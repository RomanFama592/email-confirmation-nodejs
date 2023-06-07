import dotenv from "dotenv";
import axios from "axios";
import path from "path";
import sharp from "sharp";
import express from "express";
import cors from "cors";

import { fileURLToPath } from "url";
import { existsSync } from "fs";
import logger from "./utils/logger.mjs";

dotenv.config();
const pathImage = path.join("src", "image.png");
const currentDir = path.dirname(fileURLToPath(import.meta.url));

try {
  if (!existsSync(pathImage)) {
    throw new Error();
  }
} catch (e) {
  const image = sharp({
    create: {
      width: 1,
      height: 1,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  });
  image.toFile(pathImage, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log("created image:", info);
    }
  });
}

const app = express();

app.set("port", process.env.PORT || 8080);

app.use(cors());

app.get("/favicon.ico", (rq, rs) => {
  rs.sendStatus(204);
});

app.get("/viewlog", async (rq, rs, next) => {
  try {
    if (
      rq.header("authdata") !== undefined &&
      process.env.AUTHDATA !== undefined &&
      rq.headers.authdata === process.env.AUTHDATA
    ) {
      return rs.sendFile("log.txt", { root: currentDir });
    }
    throw new Error();
  } catch (e) {
    next();
  }
});

app.get("*", (rq, rs, next) => {
  try {
    if (process.env.IMAGELINK) {
      axios
        .get(process.env.IMAGELINK, { responseType: "arraybuffer" })
        .then((rss) => {
          const imageData = Buffer.from(rss.data, "binary");
          rs.setHeader("Content-Type", "image");
          rs.setHeader("Content-Length", imageData.length);
          rs.send(imageData);
        });
    } else {
      rs.sendFile(pathImage, { root: currentDir });
    }
    logger(`url: "${rq.url}" || ${rq.ip}`);
  } catch (e) {
    e.status = 204;
    e.url = rq.url;
    next(e);
  }
});

app.use((err, rq, rs, next) => {
  logger(`ERROR in "${err.url}": ${err}`);
  console.log(err.stack);
  rs.sendFile(pathImage, { root: currentDir });
});

app.listen(app.get("port"), () => {
  logger(`##Server running in http://localhost:${app.get("port")}/`);
});

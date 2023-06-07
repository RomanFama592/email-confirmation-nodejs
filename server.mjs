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

const imageDefault = await sharp({
  create: {
    width: 1,
    height: 1,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
}).toBuffer();

const app = express();

app.set("trust proxy", true);

app.set("port", process.env.PORT || 8080);

app.use(cors());

app.get("/favicon.ico", (rq, rs) => {
  return rs.sendStatus(204);
});

app.get("/viewlog", async (rq, rs, next) => {
  if (
    rq.header("authdata") !== (undefined || "") &&
    process.env.AUTHDATA !== (undefined || "") &&
    rq.headers.authdata === process.env.AUTHDATA
  ) {
    return rs.sendFile("log.txt", { root: currentDir });
  }
  next();
});

app.get("*", async (rq, rs, next) => {
  try {
    logger(`url: "${rq.url}" || ${rq.ip}`);

    if (process.env.IMAGELINK) {
      const rss = await axios.get(process.env.IMAGELINK, {
        responseType: "arraybuffer",
      });
      const imageData = Buffer.from(rss.data, "binary");
      //sharp((input = imageData));
      rs.setHeader("Content-Type", "image/jpeg");
      rs.setHeader("Content-Length", imageData.length);
      return rs.send(imageData);
    } else if (existsSync(pathImage)) {
      return rs.sendFile(pathImage, { root: currentDir });
    } else {
      throw new Error("!");
    }
  } catch (e) {
    next(e);
  }
});

app.use((err, rq, rs, next) => {
  logger(`ERROR in "${rq.url}": ${err}`);
  console.log(err.stack);
  rs.setHeader("Content-Type", "image/png");
  rs.setHeader("Content-Length", imageDefault.length);
  return rs.send(imageDefault);
});

app.listen(app.get("port"), () => {
  logger(`##Server running in http://localhost:${app.get("port")}/`);
});

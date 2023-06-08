import cors from "cors";
import axios from "axios";
import sharp from "sharp";
import dotenv from "dotenv";
import express from "express";

import { existsSync } from "fs";
import {join, dirname} from "path";
import { fileURLToPath } from "url";
import logger from "./utils/logger.mjs";

dotenv.config();
const pathImage = join("src", "image.png");
const currentDir = dirname(fileURLToPath(import.meta.url));

function sendImage(rs, imageBinary, type = "image") {
  rs.setHeader("Content-Type", type);
  rs.setHeader("Content-Length", imageBinary.length);
  return rs.send(imageBinary);
}

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

//prevent request icon from navegator
app.get("/favicon.ico", (rq, rs) => {
  return rs.sendStatus(204);
});

//route for view logs (Only auth if not authenticated, otherwise, it works as a generic route.)
app.get("/viewlog", async (rq, rs, next) => {
  if (rq.header("authdata") !== undefined || rq.header("authdata") !== "") {
    return next();
  }

  if (process.env.AUTHDATA !== undefined || process.env.AUTHDATA !== "") {
    return next();
  }

  if (rq.headers.authdata === process.env.AUTHDATA) {
    return next();
  }

  return rs.sendFile("log.txt", { root: currentDir });
});

//route generic
app.get("*", async (rq, rs, next) => {
  try {
    logger(`url: "${rq.url}" || ${rq.ip}`);

    if (process.env.IMAGELINK) {
      if (process.env.IMAGELINK === "send-pixel") {
        return sendImage(rs, imageDefault, "image/png");
      }
      const rss = await axios.get(process.env.IMAGELINK, {
        responseType: "arraybuffer",
      });

      if (rss.status != 200) {
        throw new Error("the url do not work");
      }

      const imageData = Buffer.from(rss.data, "binary");
      return sendImage(rs, imageData, "image/jpeg");
    }

    if (existsSync(pathImage)) {
      return rs.sendFile(pathImage, { root: currentDir });
    }

    throw new Error("can't find local or external image");
  } catch (e) {
    next(e);
  }
});

//for errors
app.use((err, rq, rs, next) => {
  logger(`ERROR in "${rq.url}": ${err}`);
  console.log(err.stack);
  return sendImage(rs, imageDefault, "image/png");
});

app.listen(app.get("port"), () => {
  logger(`##Server running in http://localhost:${app.get("port")}/`);
});

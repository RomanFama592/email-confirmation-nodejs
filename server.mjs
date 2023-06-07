import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import logger from "./utils/logger.mjs";

dotenv.config();
const fileName = "image.png"
const currentDir = path.dirname(fileURLToPath(import.meta.url));

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

app.get("*", async (rq, rs, next) => {
  try {
    if(process.env.IMAGELINK){
        rs.redirect(process.env.IMAGELINK)
    } else {
        rs.sendFile(path.join("src", fileName), { root: currentDir });
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
  rs.status(err.status || 404).end();
});

app.listen(app.get("port"), () => {
  logger(`##Server running in http://localhost:${app.get("port")}/`);
});

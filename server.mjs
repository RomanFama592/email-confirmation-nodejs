import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import logger from "./utils/logger.mjs";

dotenv.config();
const currentDir = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.set("port", process.env.PORT || 8080);

app.use(cors());

app.get("/favicon.ico", (rq, rs) => {
  rs.sendStatus(204);
});

app.get("*", (rq, rs, next) => {
  try {
    rs.sendFile(path.join("src", "image.jpg"), { root: currentDir });
    logger(`"${rq.url}"`);
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

import express from "express";
import cors from "cors";
import { json } from "body-parser";
import routes from "./api/routes";
import { createConnection } from "typeorm";

const app = express();

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    app.use(cors());
    app.use(json());
    app.use(routes);

    await app.listen(PORT, () => {
      console.log("server started at ", PORT);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();

import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes/router";

import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import dbConfig from "./app/config/db.config";

const app: Application = express();

app.use(
  cors({
    origin: dbConfig.frontEnd_url || "http://localhost:3000",
    credentials: true,
  }),
);

//parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Server is running..",
    environment: process.env.NODE_ENV,
    uptime: process.uptime().toFixed(2) + " sec",
    timeStamp: new Date().toISOString(),
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;

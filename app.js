import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import dbConnection from "./DB/connection.js";
import AppError from "./utils/appError.js";
import globalError from "./midleware/globalError.js";
import * as allRoutes from "./routes/index.js";

const app = express();

app.use(express.json());

dbConnection();

app.use("/api/v1/uploads", express.static("./uploads"));

app.use("/api/v1/user", allRoutes.userRouter);
app.use("/api/v1/messages", allRoutes.messageRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find this route: ${req.originalUrl}`));
});

app.use(globalError);

app.listen(process.env.PORT, () =>
  console.log(`server running on port ${process.env.PORT}`)
);

import { createNewUser, signin } from "./src/handlers/users";
import express from "express";
import itemRouter from "./src/routes/itemRouter";
import morgan from "morgan";
import cors from "cors";
import { protectWithRole } from "./src/modules/auth";
import cookieParser from "cookie-parser";

export const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use("/products", itemRouter);
app.post("/register", createNewUser);
app.post("/signin", signin);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ error: "error happened" });
});

export default app;

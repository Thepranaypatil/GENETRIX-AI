import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";

import AuthRouter from "./route/AuthRoute.js";
import ThumbnailRouter from "./route/ThumbnailRoutes.js";
import UserRouter from "./route/userRoutes.js";

await connectDB();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

/* -------- HEALTH CHECK -------- */
app.get("/", (_req: Request, res: Response) => {
  res.send("Server is Live!");
});

/* -------- ROUTES -------- */
app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRouter);
app.use("/api/user", UserRouter);

/* -------- SERVER -------- */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

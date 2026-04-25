import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import "dotenv/config";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";
import reelRouter from "./routes/reelRouter.js";
import storyRouter from "./routes/storyRoutes.js";
import connectDB from "./config/connectDB.js";
import messageRouter from "./routes/messageRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

const corsInstance = {
  origin: ["http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

//MIDLLEWARES
app.use(cors(corsInstance));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express());
app.use(cookieParser());

//ROUTERS
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/reel", reelRouter);
app.use("/api/v1/story", storyRouter);
app.use("/api/v1/messages", messageRouter);

app.get("/", (req, res) => {
  res.send("Hello FeedFlow Server");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port : ${PORT}`);
});

//2:15

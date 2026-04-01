import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import "dotenv/config";
import userRouter from "./routes/userRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

//MIDLLEWARES
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express());
app.use(cookieParser());

//ROUTERS
app.use("/api/v1/user", userRouter); 

app.get("/", (req, res) => {
  res.send("Hello FeedFlow Server");
});

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});

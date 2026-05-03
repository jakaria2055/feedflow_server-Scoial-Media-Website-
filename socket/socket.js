import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: ["http://localhost:5173"],
    origin: ["https://feedflow-app-social-media-website.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

export const getReceiverSocketId = (userId) => {
  return onlineUsersMap[userId];
};



//Store Online Users userId = socketId
let onlineUsersMap = {};
io.on("connection", (socket) => {
  console.log("Socket Connected: ", socket.id);

  //Get userId from query and params
  const userId = socket.handshake.query.userId;
  if(userId){
    onlineUsersMap[userId] = socket.id;
    console.log(`Connected User ID: ${userId}, SocketID: ${socket.id}`);
  }

  //Send Updated Online User list to everyone
  io.emit("getOnlineUsers", Object.keys(onlineUsersMap));

  //Handle Disconnected User
  socket.on("disconnect", () => {
    console.log("User Disconnected: ", socket.id);
    delete onlineUsersMap[userId]
    io.emit("getOnlineUsers", Object.keys(onlineUsersMap));
  });
});


export {app, server, io}


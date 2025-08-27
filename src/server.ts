import { log } from "console";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose, { mongo } from "mongoose";
import * as usersController from "./controllers/users";
import bodyParser from "body-parser";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/users", usersController.register);

io.on("connection", () => {
  console.log("a user connected");
});

mongoose.connect("mongodb://localhost:27017/trello").then(() => {
  console.log("Connected to MongoDB");
  httpServer.listen(4001, () => {
    console.log("Server is listening on port 4001 ");
  });
});

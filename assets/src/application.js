import io from "socket.io-client";
import { history } from "backbone";
import { User } from "./entities/models";
import { startChat } from "helpers/utilities";

const socket = io.connect("<!-- @SOCKETIO_URL -->");
let connected = false;

socket.on("connect", () => {
  if (!connected) {
    socket.emit("GetMe");
  }
});

socket.on("GetMe", user => {
  history.stop();
  startChat(new User(user), socket);
  history.start();
  connected = true;
});

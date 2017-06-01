import io from "socket.io-client";
import { history } from "backbone";
import Backbone from "backbone";
import { Router } from "./router";
import { SocketSync, SocketListener } from "./helpers/socket";
import {
  RoomCollection,
  UserCollection,
  ChatCollection
} from "./entities/models";
import postal from "postal";
import ReactDOM from "react-dom";
import { RoomForm } from "./components/room";
import { ChatView } from "./components/chat";
import { User } from "./entities/models";
import React from "react";

let me = null;
let connected = false;
let router;
let roomCollection;
let userCollection;
let chatCollection;
let $root = document.querySelector("#react-root");
let socket = io.connect("<!-- @SOCKETIO_URL -->");

function roomSelection() {
  roomCollection.sync("create", { name: "lobby", id: "lobby" });
  ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode($root));
  ReactDOM.render(<RoomForm rooms={roomCollection} />, $root);
}
function joinRoom(room) {
  userCollection.reset();
  chatCollection.reset();
  roomCollection.sync("create", { name: room, id: room });
  chatCollection.fetch({ room: room });
  userCollection.fetch({ room: room });
  ReactDOM.unmountComponentAtNode($root);
  ReactDOM.render(
    <ChatView
      users={userCollection}
      chats={chatCollection}
      room={room}
      me={me}
    />,
    $root
  );
}
function defaultRoute() {
  router.navigate("", { trigger: true });
}

let roomFormEvent = message => {
  roomCollection.add({
    name: message.roomName,
    id: message.rootName
  });
  router.navigate(`room/${message.roomName}`, { trigger: true });
};

function startChat() {
  router = new Router();
  Backbone.socket = socket;
  Backbone.sync = SocketSync;

  roomCollection = new RoomCollection();
  roomCollection.noun = "Room";
  userCollection = new UserCollection();
  userCollection.noun = "User";
  chatCollection = new ChatCollection();
  chatCollection.noun = "Chat";

  new SocketListener("Room", roomCollection, socket);
  new SocketListener("User", userCollection, socket);
  new SocketListener("Chat", chatCollection, socket);

  let myChannel = postal.channel();
  myChannel.subscribe("Room.Join", roomFormEvent);

  router.on("route:RoomSelection", roomSelection);
  router.on("route:JoinRoom", joinRoom);
  router.on("route:Default", defaultRoute);
}

socket.on("connect", () => {
  if (!connected) {
    socket.emit("GetMe");
  }
});

let GetMe = user => {
  me = new User(user);
  history.stop();
  startChat(me);
  history.start();
  connected = true;
};

socket.on("GetMe", GetMe);

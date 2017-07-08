import Router from "../router";
import postal from "postal";
import { joinRoom, selectRoom, roomFormEvent } from "./handlers";
import { initializeCollections, SocketListener } from "./socket";

export const startChat = (me, socket) => {
  const router = new Router();
  let {
    roomCollection,
    userCollection,
    chatCollection
  } = initializeCollections(socket);

  new SocketListener("Room", roomCollection, socket);
  new SocketListener("User", userCollection, socket);
  new SocketListener("Chat", chatCollection, socket);

  postal.channel().subscribe("Room.Join", message =>
    roomFormEvent(message, {
      router,
      roomCollection
    })
  );

  router.on("route:RoomSelection", () => {
    selectRoom(roomCollection);
  });

  router.on("route:JoinRoom", room =>
    joinRoom(room, {
      me,
      roomCollection,
      chatCollection,
      userCollection
    })
  );

  router.on("route:Default", () => router.navigate("", { trigger: true }));
};

import React from "react";
import ReactDOM from "react-dom";
import RoomForm from "../components/Room";
import ChatView from "../components/Chat";

const $root = document.querySelector("#react-root");

const roomFormEvent = (message, options) => {
  const { roomName, rootName } = message;
  const { router, roomCollection } = options;
  roomCollection.add({
    name: roomName,
    id: rootName
  });
  router.navigate(`room/${roomName}`, { trigger: true });
};

let selectRoom = roomCollection => {
  roomCollection.sync("create", { name: "lobby", id: "lobby" });
  ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode($root));
  ReactDOM.render(<RoomForm rooms={roomCollection} />, $root);
};

const joinRoom = (room, options) => {
  const { me, roomCollection, chatCollection, userCollection } = options;

  userCollection.reset();
  chatCollection.reset();
  roomCollection.sync("create", { name: room, id: room });
  chatCollection.fetch({ room });
  userCollection.fetch({ room });
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
};

export { joinRoom, selectRoom, roomFormEvent };

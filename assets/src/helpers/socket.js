import Backbone from "backbone";
import {
  RoomCollection,
  UserCollection,
  ChatCollection
} from "../entities/models";

const SocketListener = (noun, collection, socket) => {
  let addModels = models => {
    collection.add(collection.parse(models));
  };
  let removeModels = models => {
    collection.remove(collection.parse(models));
  };
  socket.on("Add" + noun, addModels);
  socket.on("Get" + noun, addModels);
  socket.on("Remove" + noun, removeModels);

  let destroy = () => {
    socket.removeListener("Add" + noun, addModels);
    socket.removeListener("Get" + noun, addModels);
    socket.removeListener("Remove" + noun, removeModels);
  };
  return {
    destroy
  };
};

const SocketSync = function(method, model, options) {
  let socket = Backbone.socket;
  switch (method) {
    case "create":
      socket.emit("Add" + this.noun, model);
      break;
    case "read":
      socket.emit("Get" + this.noun, options);
      break;
    default:
      break;
  }
};

const initializeCollections = socket => {
  Backbone.socket = socket;
  Backbone.sync = SocketSync;

  let roomCollection = new RoomCollection();
  let userCollection = new UserCollection();
  let chatCollection = new ChatCollection();
  roomCollection.noun = "Room";
  userCollection.noun = "User";
  chatCollection.noun = "Chat";

  return {
    roomCollection,
    userCollection,
    chatCollection
  };
};

export { initializeCollections, SocketSync, SocketListener };

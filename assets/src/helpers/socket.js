import Backbone from "backbone";

export let SocketListener = (noun, collection, socket) => {
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
    destroy: destroy
  };
};

export let SocketSync = function(method, model, options) {
  let socket = Backbone.socket;
  let create = function create(model, options, noun) {
    socket.emit("Add" + noun, model);
  };
  let read = function read(model, options, noun) {
    socket.emit("Get" + noun, options);
  };
  switch (method) {
    case "create":
      create(model, options, this.noun);
      break;
    case "read":
      read(model, options, this.noun);
      break;
    default:
      break;
  }
};

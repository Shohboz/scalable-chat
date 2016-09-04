import {Model, Collection, Router}, Backbone from "backbone";

let SocketListener = function SocketListener (noun, collection, socket){
  let addModels = (models) => {
    collection.add(collection.parse(models));
  };
  let removeModels = (models) => {
    collection.remove(collection.parse(models));
  };
  socket.on('Add' + noun, addModels);
  socket.on('Get' + noun, addModels);
  socket.on('Remove' + noun, removeModels);

  let destroy = () => {
    socket.removeListener('Add' + noun, addModels);
    socket.removeListener('Get' + noun, addModels);
    socket.removeListener('Remove' + noun, removeModels);
  };
  return {
    destroy: destroy
  };
};

let SocketSync = function (method, model, options) {
  let socket = Backbone.socket;
  let create = function create(model, options, noun){
    socket.emit('Add' + noun, model);
  };
  let read = function read(model, options, noun){
    socket.emit('Get' + noun, options);
  };
  switch (method){
    case 'create':
      create(model, options, this.noun);
    break;
    case 'read':
      read(model, options, this.noun);
    break;
  }
};

let User = Model.extend({
  image: function(size){
    switch (this.get('type')){
      case 'local':
        return this.gravatar(size);
//      break;
      case 'facebook':
        return this.facebook(size);
//      break;
    }
  },
  gravatar: function(size){
    return `http://gravatar.com/avatar/${md5(this.get('id'))}?d=retro&s=${size}`;
  },
  facebook: function(size){
    return `http://graph.facebook.com/${this.get('id')}/picture/?height=${size}`;
  }
});

let UserCollection = Collection.extend({
  model: User
});
let RoomsCollection = Collection.extend();

let ChatCollection = Collection.extend({
  parse: (data) => {
    if (Array.isArray(data)){
      return _.map(data, (d) => {
        d.user = new User(d.user);
        return d;
      });
    } else {
      data.user = new User(data.user);
      return data;
    }
  }
});

let Router = Router.extend({
  routes: {
    '': 'RoomSelection',
    'room/:room': 'JoinRoom',
    '*default': 'Default'
  }
});

module.exports.SocketListener = SocketListener;
module.exports.SocketSync = SocketSync;
module.exports.User = User;
module.exports.UserCollection = UserCollection;
module.exports.RoomsCollection = RoomsCollection;
module.exports.ChatCollection = ChatCollection;
module.exports.Router = Router;
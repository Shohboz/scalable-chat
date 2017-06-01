'use strict';

exports.User = (id, name, type) => {
  if (arguments.length < 3) return new Error('Not enough args');
  return {
    id: id,
    user: name,
    type: type
  };
};

exports.Chat = (message, room, user) => {
  if (arguments.length < 3) return new Error('Not enough args');
  return {
    id: user.id + (new Date).getTime().toString(),
    message: message,
    room: room,
    ts: (new Date).getTime(),
    user: user
  };
};

exports.Room = (name) => {
  if (arguments.length < 1) return new Error('Not enough args');
  return {
    id: name,
    user: name
  };
};
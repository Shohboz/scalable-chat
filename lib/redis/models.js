"use strict";

exports.User = (id, name, type) => {
  if (arguments.length < 3) return new Error("Not enough args");
  return {
    id,
    user: name,
    type
  };
};

exports.Chat = (message, room, user) => {
  if (arguments.length < 3) return new Error("Not enough args");
  return {
    id: user.id + new Date().getTime().toString(),
    message,
    room,
    ts: new Date().getTime(),
    user
  };
};

exports.Room = name => {
  if (arguments.length < 1) return new Error("Not enough args");
  return {
    id: name,
    user: name
  };
};

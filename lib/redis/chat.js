"use strict";

let client = require("./index").client;
let q = require("q");
let models = require("./models");

exports.addUser = (user, name, type) => {
  client
    .multi()
    .hset("user:" + user, "name", name)
    .hset("user:" + user, "type", type)
    .zadd("users", Date.now(), user)
    .exec();
};

exports.addRoom = room => {
  if (room !== "") client.zadd("rooms", Date.now(), room);
};

exports.getRooms = cb => {
  client.zrevrangebyscore("rooms", "+inf", "-inf", (err, data) => {
    return cb(data);
  });
};

exports.addChat = chat => {
  client
    .multi()
    .zadd("rooms:" + chat.room + ":chats", Date.now(), JSON.stringify(chat))
    .zadd("users", Date.now(), chat.user.id)
    .zadd("rooms", Date.now(), chat.room)
    .exec();
};

exports.getChat = (room, cb) => {
  client.zrange("rooms:" + room + ":chats", 0, -1, (err, chats) => {
    cb(chats);
  });
};

exports.addUserToRoom = (user, room) => {
  client
    .multi()
    .zadd("rooms:" + room, Date.now(), user)
    .zadd("users", Date.now(), user)
    .zadd("rooms", Date.now(), room)
    .set("user:" + user + ":room", room)
    .exec();
};

exports.removeUserFromRoom = (user, room) => {
  client
    .multi()
    .zrem("rooms:" + room, user)
    .del("user: " + user + ":room")
    .exec();
};

exports.getUsersInRoom = room => {
  return q.Promise((resole, reject, notify) => {
    client.zrange("rooms:" + room, 0, -1, (err, data) => {
      let users = [];
      let loopsleft = data.length;
      data.forEach(u => {
        client.hgetall("user:" + u, (err, userHash) => {
          users.push(models.User(u, userHash.name, userHash.type));
          loopsleft--;
          if (loopsleft === 0) resolve(users);
        });
      });
    });
  });
};

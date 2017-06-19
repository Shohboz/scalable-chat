"use strict";

let io = require("socket.io");
let config = require("../config");
let cookie = require("cookie");
let cookieParser = require("cookie-parser");
let expressSession = require("express-session");
let ConnectRedis = require("connect-redis")(expressSession);
let redisSession = new ConnectRedis({
  host: config.redisHost,
  port: config.redisPort
});
let redisAdapter = require("socket.io-redis");
let redisChat = require("../redis/chat");
let models = require("../redis/models");
let log = require("../middleware/log");

let socketAuth = (socket, next) => {
  let handshakeData = socket.request;
  let parseCookie = cookie.parse(handshakeData.headers.cookie);
  let sid = cookieParser.signedCookie(
    parseCookie["connect.sid"],
    config.secret
  );

  if (parseCookie["connect.sid"] === sid) {
    return next(new Error("Not Authenticated"));
  }
  redisSession.get(sid, (err, session) => {
    if (session && session.isAuthenticated) {
      socket.user = session.passport.user;
      socket.sid = sid;
      redisChat.addUser(
        session.passport.user.id,
        session.passport.user.displayName,
        session.passport.user.provider
      );
      return next();
    } else {
      return next(new Error("Not Authenticated"));
    }
  });
};

let removeFromRoom = (socket, room) => {
  socket.leave(room);
  redisChat.removeUserFromRoom(socket.user.id, room);
  socket.broadcast
    .to(room)
    .emit(
      "RemoveUser",
      models.User(socket.user.id, socket.user.displayName, socket.user.provider)
    );
};
let removeAllRooms = (socket, cb) => {
  let current = socket.rooms;
  let len = Object.keys(current).length;
  let i = 0;
  for (let r in current) {
    if (current[r] !== socket.id) {
      removeFromRoom(socket, current[r]);
    }
    i++;
    if (i == len) {
      cb();
    }
  }
};

let socketConnection = socket => {
  socket.on("GetMe", () => {
    socket.emit(
      "GetMe",
      models.User(socket.user.id, socket.user.displayName, socket.user.provider)
    );
  });
  socket.on("GetUser", room => {});
  socket.on("GetChat", data => {
    redisChat.getChat(data.room, chats => {
      let retArray = [];
      let len = chats.length;
      chats.forEach(c => {
        try {
          retArray.push(JSON.parse(c));
        } catch (e) {
          log.error(e.message);
        }
        len--;
        if (len === 0) socket.emit("GetChat", retArray);
      });
    });
  });
  socket.on("AddChat", chat => {
    let newChat = models.Chat(
      chat.message,
      chat.room,
      models.User(socket.user.id, socket.user.displayName, socket.user.provider)
    );
    redisChat.addChat(newChat);
    socket.broadcast.to(chat.room).emit("AddChat", newChat);
    socket.emit("AddChat", newChat);
  });
  socket.on("GetRoom", () => {
    redisChat.getRooms(rooms => {
      let retArray = [];
      let len = rooms.length;
      rooms.forEach(r => {
        retArray.push(models.Room(r));
        len--;
        if (len === 0) socket.emit("GetRoom", retArray);
      });
    });
  });
  socket.on("AddRoom", r => {
    let room = r.name;
    removeAllRooms(socket, () => {
      if (room !== "") {
        socket.join(room);
        redisChat.addRoom(room);
        socket.broadcast.emit("AddRoom", models.Room(room));
        socket.broadcast
          .to(room)
          .emit(
            "AddUser",
            models.User(
              socket.user.id,
              socket.user.displayName,
              socket.user.provider
            )
          );
        redisChat.addUserToRoom(socket.user.id, room);
      }
    });
  });
  socket.on("disconnect", () => {
    removeAllRooms(socket, () => {});
  });
};

exports.start = server => {
  io = io.listen(server);
  io.adapter(
    redisAdapter({
      host: config.redisHost,
      port: config.redisPort
    })
  );

  let chat = io.of("/chat");
  chat.use(socketAuth);
  chat.on("connection", socketConnection);

  return io;
};

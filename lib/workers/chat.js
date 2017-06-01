'use strict';

let client = require('../redis').client;
let log = require('../middleware/log');

const delta = 60 * 60 * 1000 * 3;
const interval = 60 * 60 * 1000 * 2;

let RemoveRooms = () => {
  log.debug({
    message: 'Removing rooms',
    ts: Date.now()
  });
  client.zrangebyscore('rooms', '-inf', ((new Date).getTime() - delta), (err, rooms) => {
    if (err !== null) {
      log.error({
        message: 'Error in remove rooms',
        err: err,
        ts: Date.now()
      });
    } else {
      rooms.forEach((room) => {
        client.multi()
        .zrem('rooms', room)
        .del('rooms:' + room + ':chats')
        .exec();
      });
    }
  });
};
let CleanUpChatsFromRoom = () => {
  log.debug({
    message: 'Cleaning up chats',
    ts: Date.now()
  });
  client.zrange('rooms', 0, -1, (err, rooms) => {
    rooms.forEach((room) => {
      client.zremrangebyscore('rooms:' + room + ':chats', '-inf', ((new Date).getTime() - delta));
    });
  });
};
let CleanUpUsers = () => {
  log.debug({
    message: 'Cleaning up users',
    ts: Date.now()
  });
  client.zrangebyscore('users', '-inf', ((new Date).getTime() - delta), (err, users) => {
    users.forEach((user) => {
      client.multi()
      .zrem('users', user)
      .del('user:' + user)
      .del('user:' + user + ':room')
      .exec()
    });
  });
};
let CleanUp = () => {
  RemoveRooms();
  CleanUpChatsFromRoom();
  CleanUpUsers();
};

setInterval(CleanUp, interval);
CleanUp();
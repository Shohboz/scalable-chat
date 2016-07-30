'use strict';

let io = require('socket.io');
let config = require('../config');
let redisAdapter = require('socket.io-redis');

exports.start = (server) => {
  io = io.listen(server);
  io.adapter(redisAdapter({
    host: config.redisHost,
    port: config.redisPort
  }));

  return io;
};
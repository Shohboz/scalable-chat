'use strict';

let amqp = require('amqp');
let config = require('../config');
let q = require('q');

module.exports = q.Promise((resolve, reject, notify) => {
  let rabbit = amqp.createConnection(config.rabbitMQ.URL);
  rabbit.on('ready', () => {
    resolve(rabbit);
  });
});

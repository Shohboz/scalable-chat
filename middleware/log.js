'use strict';

let exchange = require('../queue');

let debug = (message) => {
  exchange.done((ex) => {
    ex.publish('debug.log', message);
  });
};

let error = (message) => {
  exchange.done((ex) => {
    ex.publish('error.log', message);
  });
};

exports.error = error;
exports.debug = debug;

exports.logger = (req, res, next) => {
  debug({url: req.url, ts: Date.now()});
  next();
};

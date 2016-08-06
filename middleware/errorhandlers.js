'use strict';

let log = require('./log');

exports.error = (err, req, res, next) => {
  log.error({error: err.message, ts: Date.now()});
  res.send(500, 'Server is unreacheable.');
};

exports.notFound = (req, res, next) => {
  res.send(404, 'http 404');
};

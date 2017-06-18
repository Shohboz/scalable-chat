"use strict";

let log = require("./log");

exports.error = (err, req, res, next) => {
  log.error({ error: err.message, ts: Date.now() });
  res.status(500).send("Server is unreacheable.");
};

exports.notFound = (req, res, next) => {
  res.status(404).send("http 404");
};

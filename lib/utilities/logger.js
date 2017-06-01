'use strict';

let winston = require('winston');
let config = require('../config');
let path = require('path');

let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      name: 'info-file',
      filename: path.join(config.logger.path, 'info.log'),
      json: false,
      filename: '../logs/info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      json: false,
      filename: path.join(config.logger.path, 'error.log'),
      level: 'error'
    })
  ]
});

exports.logger = logger;
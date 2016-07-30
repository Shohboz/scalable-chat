'use strict';

let redis = require('redis');
let config = require('../config');
exports.client = redis.createClient(config.redisPort, config.redisHost);
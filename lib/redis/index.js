'use strict';

let redis = require('redis');
let config = require('../config');
exports.client = redis.createClient({port: config.redisPort, host: config.redisHost});
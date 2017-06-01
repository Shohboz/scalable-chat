'use strict';

let rabbitPromise = require('../queue/rabbit');
let config = require('../config');
let logger = require('../utilities/logger').logger;

rabbitPromise.done((rabbit) => {
  rabbit.queue('debug.log',
    {autoDelete: false},
    (q) => {
      q.bind(config.rabbitMQ.exchange, '*.log');
      q.subscribe({ack: true, prefetchCount: 1},
        (message, headers, delivery, messageObject) => {
          logger.log('info', message);
          messageObject.acknowledge();
        }
      );
    }
  );
  rabbit.queue('error.log',
    {autoDelete: false},
    (q) => {
      q.bind(config.rabbitMQ.exchange, 'error.log');
      q.subscribe({ack: true, prefetchCount: 1},
        (message, headers, delivery, messageObject) => {
          logger.log('error', message);
          messageObject.acknowledge();
        }
      );
    }
  );
});

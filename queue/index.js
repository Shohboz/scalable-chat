'use strict';

let rabbitPromise = require('./rabbit');
let config = require('../config');
let q = require('q');

let queueSetup = (rabbit) => {
  rabbit.queue('debug.log',
    {autoDelete: false},
    (q) => {
      q.bind(config.rabbitMQ.exchange, '*.log');
      q.close();
    }
  );

  rabbit.queue('error.log',
    {autoDelete: false},
    (q) => {
      q.bind(config.rabbitMQ.exchange, 'error.log');
      q.close();
    }
  );
};

module.exports = q.Promise((resolve, reject, notify) => {
  rabbitPromise.done((rabbit) => {
    rabbit.exchange(config.rabbitMQ.exchange,
      {type: 'topic', autoDelete: false},
      (ex) => {
        queueSetup(rabbit);
        resolve(ex);
      }
    );
  });
});

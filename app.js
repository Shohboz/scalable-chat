'use strict';

let express = require('express');
let path = require('path');
let app = new express();
let cookieParser = require('cookie-parser');
let session = require('express-session');
let RedisStore = require('connect-redis')(session);
let util = require('./middleware/utilities')
let bodyParser = require('body-parser');
let csrf = require('csurf');

let config = require('./config');
let io = require('./socket.io');

let routes = require('./routes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/static'));
app.use(cookieParser(config.secret));

app.use(session({
  secret: config.secret,
    saveUninitialized: true,
    resave: true,
    store: new RedisStore({
      host: config.redisHost,
      port: config.redisPort
    })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(csrf());
app.use(util.csrf);

app.get('/error', (req, res, next) => {
  next(new Error('A contrived error.'));
});
app.get('/', routes.index);

let server = app.listen(config.port);
io.start(server);
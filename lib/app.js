'use strict';

let express = require('express');
let path = require('path');
let app = new express();
let cookieParser = require('cookie-parser');
let session = require('express-session');
let RedisStore = require('connect-redis')(session);
let util = require('./middleware/utilities');
let errorHandlers = require('./middleware/errorhandlers');
let log = require('./middleware/log');
let bodyParser = require('body-parser');
let csrf = require('csurf');
let flash = require('connect-flash');
let config = require('./config');
let io = require('./socket.io');
let passport = require('./passport');
let routes = require('./routes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(log.logger);
app.use('/static', express.static(__dirname + '/../assets/dist'));
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

app.use(passport.passport.initialize());
app.use(passport.passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(csrf());
app.use(util.csrf);
app.use(util.authenticated);
app.use(flash());
app.use(util.templateRoutes);

app.get('/error', (req, res, next) => {
  next(new Error('A contrived error.'));
});
app.get('/', routes.index);
app.get(config.routes.login, routes.login);
app.get(config.routes.logout, routes.logOut);
app.get(config.routes.chat, [util.requireAuthentication], routes.chat);
app.get(config.routes.register, routes.register);
app.post(config.routes.register, routes.registerProcess);

passport.routes(app);

app.use(errorHandlers.error);
app.use(errorHandlers.notFound);

let server = app.listen(config.port);
io.start(server);
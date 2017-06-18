"use strict";

let local = require("passport-local").Strategy;
let passport = require("passport");
let facebook = require("passport-facebook").Strategy;
let google = require("passport-google-oauth").OAuth2Strategy;
let passwordUtils = require("./password");
let user = require("./user");
let config = require("../config");
let log = require("../middleware/log");

// passport.use(new google({
//   clientID: config.google.clientID,
//   clientSecret: config.google.clientSecret,
//   callbackURL: config.host + config.routes.googleAuthCallback
// }, (accessToken, refreshToken, profile, done) => {
//   done(null, profile);
// }));

// passport.use(new facebook({
//   clientID: config.facebook.appID,
//   clientSecret: config.facebook.appSecret,
//   callbackURL: config.host + config.routes.facebookAuthCallback
// }, (accessToken, refreshToken, profile, done) => {
//   done(null, profile);
// }));

passport.use(
  new local((username, password, done) => {
    user.findByUsername(username, (err, profile) => {
      if (profile) {
        passwordUtils.passwordCheck(
          password,
          profile.password,
          profile.salt,
          profile.work,
          (err, isAuth) => {
            if (isAuth) {
              if (profile.work < config.crypto.workFactor) {
                user.updatePassword(
                  username,
                  password,
                  config.crypto.workFactor
                );
              }
              done(null, profile);
            } else {
              done(null, false, {
                message: "Wrong Username or Password"
              });
            }
          }
        );
      } else {
        log.debug({
          message: "Wrong Username or Password",
          username: username
        });
        done(null, false, {
          message: "Wrong Username or Password"
        });
      }
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

let routes = app => {
  app.get(config.routes.facebookAuth, passport.authenticate("facebook"));
  app.get(
    config.routes.facebookAuthCallback,
    passport.authenticate("facebook", {
      successRedirect: config.routes.chat,
      failureRedirect: config.routes.login,
      failureFlash: true
    })
  );
  app.get(
    config.routes.googleAuth,
    passport.authenticate("google", {
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
      ]
    })
  );
  app.get(
    config.routes.googleAuthCallback,
    passport.authenticate("google", {
      successRedirect: config.routes.chat,
      failureRedirect: config.routes.login,
      failureFlash: true
    })
  );
  app.post(
    config.routes.login,
    passport.authenticate("local", {
      successRedirect: config.routes.chat,
      failureRedirect: config.routes.login,
      failureFlash: true
    })
  );
};

exports.passport = passport;
exports.routes = routes;

'use strict';

let config = require('../config');
let user = require('../passport/user');
let util = require('../middleware/utilities');

module.exports = {
  index: (req, res) => {
    res.render('index', {
      title: 'Index'
    });
  },
  login: (req, res) => {
    res.render('login', {
      title: 'Login',
      message: req.flash('error')
    });
  },
  logOut: (req, res) => {
    util.logOut(req);
    res.redirect('/');
  },
  chat: (req, res) => {
    res.render('chat', { title: 'Chat' });
  },
  register: (req, res) => {
    res.render('register', {
      title: 'Register',
      message: req.flash('error')
    });
  },
  registerProcess: (req, res) => {
    if (req.body.username && req.body.password) {
      user.addUser(req.body.username, req.body.password, config.crypto.workFactor, (err, profile) => {
        if (err){
          req.flash('error', err);
          res.redirect(config.routes.register);
        } else {
          req.login(profile, (err) => {
            res.redirect(config.routes.chat);
          });
        }
      });
    } else {
      req.flash('error', 'Fill all fields');
      res.redirect(config.routes.register);
    }
  }
};
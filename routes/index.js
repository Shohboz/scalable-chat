'use strict';

module.exports = {
  index: (req, res) => {
    res.render('index', {
      title: 'Index'
    });
  }
};
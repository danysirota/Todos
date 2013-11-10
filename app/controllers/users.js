var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  utils = require('../../utils/utils');

exports.ensureLoggedIn = function(req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/login');
  }
  next();
};

var login = function(req, res) {
  if (req.session.returnTo) {
    res.redirect(req.session.returnTo);
    delete req.session.returnTo;
    return;
  }
  res.redirect('/');
};

exports.authCallback = login;

exports.login = function (req, res) {
  res.render('users/login', {
    errors: req.flash('error')
  });
};

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/');
};

exports.signup = function (req, res) {
  res.render('users/signup', {
    user : new User()
  });
};

exports.create = function (req, res) {
  var user = new User(req.body);

  user.save(function (err) {
    if (err) {
      return res.render('users/signup', {
        errors: utils.errors(err.errors),
        user: user
      });
    }

    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/');
    });

  });
};

exports.session = login;
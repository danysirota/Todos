var express = require('express'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  config = require('./config/config'),
  passport = require('passport'),
  socket = require('socket.io');

mongoose.connect(config.db);

var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file);
  }
});

var app = express();

require('./config/passport')(passport);

require('./config/express')(app, config, passport);
require('./config/routes')(app, passport);

var io = socket.listen(app.listen(config.port));

io.sockets.on('connection', function(socket) {
	socket.on('changed', function() {
		io.sockets.emit('update');
	});
});
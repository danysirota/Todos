var express = require('express'),
	mongoStore = require('connect-mongo')(express),
	flash = require('connect-flash');

module.exports = function(app, config, passport) {
	app.set('showStackError', true);

	// should be placed before express.static
	app.use(express.compress({
		filter: function (req, res) {
			return /json|text|javascrispt|css/.test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	//app.use(express.favicon(config.root + '/public/img/favicon.ico'));
	app.use(express.static(config.root + '/public'));

	app.set('views', config.root + '/app/views');
	app.set('view engine', 'jade');

	app.configure(function () {
		app.use(express.logger('dev'));
		// cookieParser should be above session
		app.use(express.cookieParser());

		// equivilant to express.bodyParser()
		app.use(express.json());
		app.use(express.urlencoded());
		//=====D~~~(O:))
		app.use(express.methodOverride());
		// express/mongo session storage
		app.use(express.session({
			secret: 'keyboard-cat',
			store: new mongoStore({
				url: config.db,
				collection: 'sessions'
			})
		}));
		app.use(passport.initialize());
		app.use(passport.session());

		app.use(flash());

		app.use(function(req, res, next) {
			if (req.user && req.user.username)
				res.locals.loggedInUser = req.user.username;

			next();
		});

		app.use(app.router);

		// assume 404 since no middleware responded
		app.use(function(req, res, next) {
			res.status(404).render('404', {
				url: req.originalUrl,
				error: 'Not found'
			});
		});
	});
};
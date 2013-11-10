var home = require('../app/controllers/home'),
	list = require('../app/controllers/list'),
	users = require('../app/controllers/users');

module.exports = function(app, passport){
	app.get('/', home.index);
	
	app.get('/signup', users.signup);
	app.post('/signup', users.create);

	app.get('/login', function(req, res) {
		res.render('home/login', {
			message: req.session.messages
		});
	});

	app.post('/login',
		passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true
		})
	);

	app.get('/logout', users.ensureLoggedIn, users.logout);

	app.get('/list', users.ensureLoggedIn, list.list);
	app.get('/todos', users.ensureLoggedIn, list.todos);
	app.post('/todos', users.ensureLoggedIn, list.saveTodo);
	app.get('/todos/:id', users.ensureLoggedIn, list.checkTodo);
	app.get('/todos/:id/view', users.ensureLoggedIn, list.viewTodo);
	app.delete('/todos/:id', users.ensureLoggedIn, list.removeTodo);
};

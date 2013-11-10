var mongoose = require('mongoose'),
	Todo = mongoose.model('Todo'),
	User = mongoose.model('User');

exports.list = function(req, res) {
	Todo.find(function(err, todos) {
		res.render('home/list', {
			todos: todos
		});
	});
};

exports.todos = function(req, res) {
	Todo.find(function(err, todos) {
		res.send(todos);
	});
};

exports.saveTodo = function(req, res) {
	new Todo({creator: req.user.username, text : req.body.text, finished : false}).save();
	res.send(200);
};

exports.viewTodo = function (req, res){
	var id = req.params.id,
		timestamp = mongoose.Types.ObjectId(id).getTimestamp();
	if (!timestamp)
		res.send(500);
	res.send({todoCreationTimestamp : timestamp});
};

exports.checkTodo = function (req,res){
	var id = req.params.id;
	if (!id)
		return res.send(500);
	Todo.findById(id, 'finished').exec(function (err, todo){
		if (err || !todo)
			res.send(500);
		Todo.update({_id : id }, { $set : {finished : !todo.finished}},function (err,numberAffected, resp){});
		res.send(200);
	});
};

exports.removeTodo = function(req, res) {
	var id = req.params.id;
	if (!id)
		return res.send(500);
	Todo.findById(id, function (err, todo) {
		if (err || !todo)
			return res.send(500);
		todo.remove();
		res.send(200);
	});
};
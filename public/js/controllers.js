todoApp.controller('TodoListCtrl', ['$scope', 'Todo', 'socket', function($scope, Todo, socket) {
	socket.on('update', function () {
		$scope.update();
	});

	$scope.update = function() {
		Todo.Action.query(function (todos) {
			$scope.todos = todos.reverse();

		});
	};
	$scope.addTodo = function() {
		if (!$scope.newTodo)
			return;
		Todo.Action.save({text: $scope.newTodo});
		socket.emit('changed');
		$scope.newTodo = '';
		$scope.update();
	};
	$scope.removeTodo = function(todo) {
		Todo.Action.delete({id : todo._id}, function() {
			socket.emit('changed');
			$scope.update();
			}, function () {
				$scope.update();
			});
		};
	$scope.checkTodo = function(todo){
		Todo.Action.get({id:todo._id},function (){
			socket.emit('changed');
		});
	};
	$scope.viewTodo = function(item){
		Todo.View.get({id:item._id},function (todo){
			$('#todoviewText').html(item.text);
			$('#todoviewCreator').html(item.creator);
			$('#todoViewTimestamp').html(todo.todoCreationTimestamp);
			$('#todoViewfinished').html(""+item.finished);
		});
		$('#todoPanel').collapse('show');
	};
	$scope.test = function(id) {
		alert(id);
	};


	$scope.$on('$destroy', function (event) {
        socket.removeAllListeners();
    });

	$scope.update();
}]);
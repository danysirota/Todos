var todoServices = angular.module('todoServices', ['ngResource']);
 
todoServices
.factory('Todo', ['$resource',
	function($resource){
		return {
		Action : $resource('todos/:id'),
		View : $resource('todos/:id/view')
	};
	}]);
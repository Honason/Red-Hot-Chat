redChat.service('chatService', ['$http', function($http){
  var self = this;
  
  this.getUsername = function(callback) {
    $http.get('/api/get-username').success(function(response) {
      callback(response.username);
    }).error(function(err){
			console.log(err);
		});
  };
  
  this.sendMessage = function() {
    $http.post('/api/message').success(function(response) {
      console.log(response);
    }).error(function(err){
      console.log(err);
    });
  };
}]);


redChat.factory('socket', ['$rootScope', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
}]);
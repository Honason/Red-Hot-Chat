redChat.controller('chatController', ['$scope', 'socket', 'chatService', 'smoothScroll', '$location', function($scope, socket, chatService, smoothScroll, $location){
	$scope.userObj = {};
	$scope.onlineUsers = [];
	$scope.messages = [];
	$scope.chatService = chatService;
	
	$scope.room = $location.path().replace("/", "");
	
	if (localStorage.user && angular.fromJson(localStorage.user).room == $scope.room) {
		socket.emit("set-user", angular.fromJson(localStorage.user));
		$scope.userObj = angular.fromJson(localStorage.user);
	}
	
	socket.emit("join-room", $scope.room);
	
	socket.on("messages-history", function(messages) {
		messages.forEach(function(message) {
			replaceMe(message);
		});
		$scope.messages = messages;
	});
	
	socket.on("message", function(message) {
		replaceMe(message);
		$scope.messages.push(message);
	});
	
	socket.on("online-users", function(onlineUsers) {
		$scope.onlineUsers = onlineUsers;
	});
	
	socket.on("set-user", function(user) {
		$scope.userObj = user;
		localStorage.user = angular.toJson(user);
	});
	
	$scope.sendMessage = function(text) {
		socket.emit("message", {text: text});
		$scope.messageInput = "";
	};
	
	var replaceMe = function(message) {
		if (message.sender.id == $scope.userObj.id) {
			message.sender.username = "You";
		}
	};
}]);

redChat.controller('homeController', ['$scope', '$location', function($scope, $location){
	$scope.createRoom = function() {
		var path = Math.floor(Math.random() * 10000);
		$location.path(path);
	};
	
}]);
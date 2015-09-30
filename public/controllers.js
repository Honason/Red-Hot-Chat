redChat.controller('chatController', ['$scope', 'socket', 'chatService', 'smoothScroll', '$location', function($scope, socket, chatService, smoothScroll, $location){
	$scope.userObj = {};
	$scope.onlineUsers = [];
	$scope.messages = [];
	$scope.chatService = chatService;
	$scope.url = $location.absUrl();
	$scope.room = $location.path().replace("/", "");
	if (!localStorage.user) {
		localStorage.user = angular.toJson([]);
	}
	
	// Set saved user from local storage, clear old saved users
	var usersStorage = angular.fromJson(localStorage.user);
	usersStorage.forEach(function(u, index){
		if ($scope.room == u.room) {
			socket.emit("set-user", u);
			$scope.userObj = u;
		} else if (u.created + 172800000 < new Date().getTime()) {
			usersStorage.splice(index, 1);
			localStorage.user = angular.toJson(usersStorage);
		}
	});
	
	// Join room from URL
	socket.emit("join-room", $scope.room);
	
	// Loads missed messages from just joined chat room
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
	
	// Add or update incoming user identification in app
	socket.on("set-user", function(user) {
		var foundAt = -1;
		usersStorage.forEach(function(u, index){
			if ($scope.room == u.room) {
				foundAt = index;
			}
		});
		
		$scope.userObj = user;
		user.created = new Date().getTime();
		var localUsers = angular.fromJson(localStorage.user);
		if (foundAt == -1) {
			localUsers.push(user);
			localStorage.user = angular.toJson(localUsers);
		} else {
			localUsers[foundAt] = user;
			localStorage.user = angular.toJson(localUsers);
		}
	});
	
	$scope.sendMessage = function(text) {
		socket.emit("message", {text: text});
		$scope.messageInput = "";
	};
	
	$scope.changeName = function(name) {
		$scope.userObj.username = name;
		$scope.userObj.real = true;
		socket.emit("set-user", $scope.userObj);
	};
	
	var replaceMe = function(message) {		
		if (message.sender.id == $scope.userObj.id) {
			message.sender.username = "You";
		}
	};
}]);

redChat.controller('homeController', ['$scope', '$location', function($scope, $location){
	
	// Generate random room ID
	$scope.createRoom = function() {
		var path = Math.floor(Math.random() * 1000000);
		$location.path(path);
	};
	
}]);
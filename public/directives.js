// Directives

redChat.directive('chatRoom', function() {
	return {
		templateUrl: 'directives/chat-room.html',
		replace: true
	};
});

redChat.directive('createRoom', function() {
	return {
		templateUrl: 'directives/create-room.html',
		replace: true
	};
});
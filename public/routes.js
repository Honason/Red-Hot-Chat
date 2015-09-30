// Routes
redChat.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	
    $routeProvider
    .when('/', {
        templateUrl: 'pages/home.html',
        controller: 'homeController'
    })
    
    .when('/:id', {
        templateUrl: 'pages/chat.html',
        controller: 'chatController'
    });
    
    $locationProvider.html5Mode(true);
}]);
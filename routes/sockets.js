var express = require('express');
var animals = require('./animals');
var router = express.Router();

var nOfUsers = 0;
var onlineSockets = [];
var messages = [];

module.exports = function(io) {
    io.sockets.on('connection', function (socket) {
        
        // Connect
        nOfUsers++;
        onlineSockets.push(socket);
        
        socket.on("join-room", function(room) {
            var user = {
                id: Math.floor(Math.random() * 10000),
                username: "Anonymous " + animals[Math.floor(Math.random() * (animals.length-1))],
                color: rndColor()
            };
            if (!socket.user || socket.user.room !== room) {socket.user = user;}
            var tMessages = [];
            messages.forEach(function(message){
                if (message.room == room) { tMessages.push(message);}
            });
            socket.emit("messages-history", tMessages);
            
            if (socket.user.room) {
                socket.leave(socket.user.room);
                var oldRoom = socket.user.room;
                socket.user.room = room;
                io.to(oldRoom).emit("online-users", getUserObjects(oldRoom));
            }
            socket.user.room = room;
            socket.emit("set-user", socket.user);
            socket.join(room);
            if (socket.user.room) {
                io.to(socket.user.room).emit("online-users", getUserObjects(socket.user.room));
            }
        });
        
        // Disconnect
        socket.on("disconnect", function(){
            onlineSockets.splice(onlineSockets.indexOf(socket), 1);
            if (socket.user && socket.user.room) {
                io.to(socket.user.room).emit("online-users", getUserObjects(socket.user.room));
            }
        });
        
        // Message
        socket.on("message", function(message) {
            message.sender = socket.user;
            message.time = new Date().getTime();
            message.room = socket.user.room;
            messages.push(message);
            if (socket.user) {
                io.to(socket.user.room).emit("message", message);
            }
        });
        
        // Set user
        socket.on("set-user", function(user) {
            socket.user = user;
        });
    });
    
    var getUserObjects = function(room) {
        var userObjects = [];
        onlineSockets.forEach(function(socket) {
            if (socket.user && socket.user.room == room) {
                userObjects.push({id: socket.user.id, username: socket.user.username, color: socket.user.color});
            }
        });
        console.log(userObjects);
        return userObjects;
    };
    
    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    function rndColor() {
        return '#' + ('00000' + (Math.random() * 16777216 << 0).toString(16)).substr(-6);
    }
    
    /*router.get('/get-username', function (req, res, next) {
        res.send({
            username: "User 1"
        });
    });*/
    
    return router;
    
};
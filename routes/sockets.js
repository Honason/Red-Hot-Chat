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
            // Create new user
            var user = {
                id: Math.floor(Math.random() * 10000),
                username: "Anonymous " + animals[Math.floor(Math.random() * (animals.length-1))],
                room: room,
                color: rndColor()
            };
            
            // Set user to Support user, if it's first user in room
            var found = false;
            onlineSockets.forEach(function(oSocket){
                if (oSocket.user && oSocket.user.room == room) {
                    found = true;
                }
            });
            if (!found) {
                user.username = "Support";
                user.color = "#FF0000";
                user.support = true;
            }
            
            if (!socket.user || socket.user.room !== room) {socket.user = user;}
            
            // Send message history of joined room to new socket
            var tMessages = [];
            messages.forEach(function(message){
                if (message.room == room) { tMessages.push(message);}
            });
            socket.emit("messages-history", tMessages);
            
            // If socket joins another room (different chat url), remove socket from old room 
            if (socket.user.room) {
                socket.leave(socket.user.room);
                var oldRoom = socket.user.room;
                socket.user.room = room;
                io.to(oldRoom).emit("online-users", getUserObjects(oldRoom));
            }
            
            // Send socket it's user info
            socket.user.room = room;
            socket.emit("set-user", socket.user);
            socket.join(room);
            if (socket.user.room) {
                io.to(socket.user.room).emit("online-users", getUserObjects(socket.user.room));
            }
        });
        
        // Disconnect
        socket.on("disconnect", function(){
            // If last user leaves a room, remove room's messages
            if (socket.user)
                removeRoomIfAbandoned(socket.user.room);
            
            // Remove socket, update online list in room
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
            socket.emit("set-user", user);
            io.to(socket.user.room).emit("online-users", getUserObjects(socket.user.room));
        });
    });
    
    var getUserObjects = function(room) {
        var userObjects = [];
        onlineSockets.forEach(function(socket) {
            if (socket.user && socket.user.room == room) {
                userObjects.push({id: socket.user.id, username: socket.user.username, color: socket.user.color, support: socket.user.support});
            }
        });
        //console.log(userObjects);
        return userObjects;
    };
    
    var rndColor = function() {
        return '#' + ('00000' + (Math.random() * 16777216 << 0).toString(16)).substr(-6);
    };
    
    var removeRoomIfAbandoned = function(room) {
        setTimeout(function(){
            var emptyRoom = true;
            if (getUserObjects(room).length > 0) {
                emptyRoom = false;
            }
            if (emptyRoom) {
                for (var i = messages.length-1; i >= 0; i--) {
                    if (messages[i].room == room) {
                        messages.splice(i, 1);
                    }
                }
            }
        },5000);
    };
    
    return router;
    
};
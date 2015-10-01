# Real-time Chat Support

Online chat system that allows for simple creation of individual private chat rooms.

## Usage
You can try out live demo [Here](http://www.nocturnbits.com) or install Node application from this repo. More chat users needs to be tested from different browsers, machines, or incognito mode, as localStorage is shared between tabs.

![alt text](http://f.cl.ly/items/3H0f3X3r1J0p3n433s0w/chat_app.png "Chat screens")

### Requirements
- Node.js
- npm installed

```sh
cd path/to/Red-Hot-Chat
npm start
```

## Technology
Real-time Chat is built as Node.js Express application on server, and Angular.js application on client side. Socket.io library is used for real-time server-client communication. A few other libraries and modules are used for specific problem inside applications, but for the project this small I tried to avoid using more libraries and not utilizing their potential. Live demo is deployed on instance of Heroku server. Sass files were used for styles, and [Codekit](https://incident57.com/codekit/) software for JSLint javascript syntax checks and .scss compiling.

## Web application workflow
Real-time chat app helps technicians to quickly connect and help users. 

Support can create new room with unique ID by clicking 'Create Room' button on homepage. This automatically redirect them to chat page, where the first member (the one who created chat room) is given the role of Support. Anyone can change their assigned username into real name. This action is encouraged in UI. Technicians can then send chat URL to new users so they can join the chat. 

Alternative way of creating new chat room with custom URL, is type in custom ID in URL. www.chat.com/exampleId would redirect to newly created chat room, and assign first user with Support role.

When new users connect to chat room via provided URL, they are provided with assigned random username, and random color for intuitive differentiation.

## UX & UI
The goal was to design clean, unobtrusive experience that present's user what is important. Instead of generic 'User 1' generated username, new guest is greeted with playful anonymous animal alias, like 'Anonymous toucan', and their specific color. This color is presented to every other user too, and color is also use to quickly differentiate message sender. Another design cue is alignment of messages in chat. Every user can see his messages aligned to the right, and everyone else's to the left, in the same pattern as in mobile chat applications.

## Under the hood
Application relies on socket communication provided by Socket.io in all client - server exchanges. More RESTful approach would be easily possible when client sends data to server, but having same objects transferred through same sockets seems more straight forward in this case. Overall, with these very capable frameworks and libraries, I dealt with bigger challenges on UX side than challenges related to technology and real-time communication.

__First connection__. 
When client connects to the server and it's socket for the first time, client checks if saved user object of current room exist in localStorage. If there is, client asks server to assign this client with given user data. Application is using localStorage to store user object to prevent bad user experience. Without this user-object persistence, only short disconnect event or browser reload would cause user to re-enter chat room as a new user with random name and color. This is caused by stateful nature of sockets, which is otherwise great advantage.

Server reacts to this first "handshake" by providing user with new generated name, id, and color and room, if this user is really new user. Server also broadcasts updated user-list to every member of the room.

__Message__.
Client emits message and server then broadcasts this message to user's room members.

__Disconnect__.
At disconnect event, server checks room for other connected members, and if room is abandoned for more than 5 seconds, messages written in this room are cleared.

### File structure
With relatively low complexity of this projects, I decided to rather put connected things together than to have too many files with little bits of functionality in each of them. Node application has server and setting related content in one document, and socket logic in second. In Angular, individual services and controllers are not divided into separate files, as there is no need for it in this stage of this project. In potential further development, occasional refactoring would probably be needed.

## Potential future implementations
As this application server as proof of abilities rather than real-world product, some potentially useful functionality was omitted, but here are a few thoughts on what features could be beneficial in real world.

__Database integration__.
For ability to have persistent history, logs, and as a foundation for many other possible feature integrations.

__Security__.
It is tricky to handle security without login system, but there could be login-system for Support users, which could be then securely recognised as Support.

__Multi-room interface__.
More differentiated Support view with possibility to create and manage more rooms in one aplication.

Happy chatting!

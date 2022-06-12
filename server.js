/**
 * Server code to handle socket connections and communications
 */

const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeaveChat, getRoomsUsers } = require('./utils/users');

const app = express(); // creating app using express module
const server = http.createServer(app); //creating server using http module
const io = socketio(server);

// setting up static folder
app.use(express.static(path.join(__dirname, 'public')));

// adding port to listen the client reqs
const PORT = 3000 || process.env.PORT;

const botName = 'ChatCord Bot';

// Run when client is connects
io.on('connection', socket => {
	console.log('New connection is established...');

	socket.on('joinRoom', ({ username, room }) => {

		const user = userJoin(socket.id, username, room);
		socket.join(user.room);

		// Runs when new user connects, Welcome message
		socket.emit('message', formatMessage(botName, 'Welcome to chatcord!')); // emitting to single client

		// Broadcast when a user connects, emitting to everyone except user
		socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

		// Send users and room info
		io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomsUsers(user.room)
		});
	});

	// Listen for chatMessage
	socket.on('chatMessage', msg => {
		// get user
		const user = getCurrentUser(socket.id);

		// console.log(msg);
		io.to(user.room).emit('message', formatMessage(user.username, msg));
	})

	// Runs when client disconnects
	socket.on('disconnect', () => {
		const user = userLeaveChat(socket.id);

		if (user) {
			io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat.`));

			// Send users and room info
			io.to(user.room).emit('roomUsers', {
				room: user.room,
				users: getRoomsUsers(user.room)
			});
		}

		console.log('A user is disconnected.');
	})

	// io.emit(); // emitting to everyone, including user
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const socket = io();

// Get username and room from URL, to pass on to client side
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true
});

// Join chatroom 
socket.emit('joinRoom', { username, room });

//Get room and users
socket.on('roomUsers', ({ room, users }) => {
	outputRoom(room);
	outputUsers(users);
});

// message from Server
socket.on('message', message => {
	console.log(message);
	outputMessage(message);

	// Scroll Down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Message submit 
chatForm.addEventListener('submit', (e) => {
	e.preventDefault();

	// get message text
	const msg = e.target.elements.msg.value;

	// console.log(msg);
	socket.emit('chatMessage', msg);

	// clear input after emitting msg to server
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
});

const outputMessage = (message) => {
	const div = document.createElement('div');
	div.classList.add('message');
	div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
					<p class="text">
						${message.text}
					</p>`;
	document.querySelector('.chat-messages').appendChild(div);
};

// Add room name to DOM
const outputRoom = (room) => {
	roomName.innerText = room;
}

// Add Users to DOM
const outputUsers = (users) => {
	userList.innerHTML = `
	${users.map(user => `<li>${user.username}</li>`).join('')}
	`;
};
const users = [];

// Join user to chat
const userJoin = (id, username, room) => {
	const user = { id, username, room };

	users.push(user);

	return user;
};

//get current user
const getCurrentUser = (id) => {
	return users.find(user => user.id === id);
};

// when user leaves
const userLeaveChat = (id) => {
	const index = users.findIndex(user => user.id === id);

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
}

//get room users
const getRoomsUsers = (room) => {
	return users.filter(user => user.room === room);
}

module.exports = {
	userJoin,
	getCurrentUser,
	userLeaveChat,
	getRoomsUsers
};
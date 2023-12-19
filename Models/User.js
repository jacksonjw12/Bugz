let {makeUniqueId} = require('../util.js');
class User {
	constructor(id, socket) {
		this.id = id;
		this.socket = socket;
		this.room = undefined;
	}

	// change user color
	newID(cb) {
		if(this.room) {
			return;
		}

		this.id = makeUniqueId(User.instances);
		cb();
		this.emitUpdate();
	}

	joinRoom(room) {
		this.room = room;
	}

	leaveRoom(room) {
		this.room = undefined;
		this.emitUpdate();
	}

	emitUpdate() {
		if(!this.socket) {
			return;
		}
		this.socket.emit('state', this.getSerialState());
	}

	getSerialState() {
		return {
			id: this.id,
			room: this.room ? this.room.getSerialState() : undefined
		}
	}

	static newUser(socket) {
		if (!User.instances) {
			User.instances = [];
		}

		const id = makeUniqueId(User.instances);

		const u = new User(id, socket);
		User.instances.push(u);
		return u;
	}

	static get(id) {
		for(let i = 0; i< User.instances.length; i++){
			if(User.instances[i].id === id) {
				
				return User.instances[i];
			}
		}
	}

	static logoutUser(user) {
		for(let i = 0; i< User.instances.length; i++){
			if(User.instances[i] == user) {
				User.instances.splice(i,1);
				return;
			}
		}
	}
}

exports.User = User
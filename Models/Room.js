let {makeUniqueId} = require('../util.js');
let {Game} = require('./Game.js');

class Room {
	constructor(id, userInitator) {
		this.id = id;
		this.state = "waiting"; // playing | 

		this.players = [userInitator];

		userInitator.joinRoom(this);

	}

	addPlayer(player) {
		this.players.push(player);

		player.joinRoom(this);
		this.emitUpdateToPlayers();

	}

	emitUpdateToPlayers() {
		for(let p = 0; p < this.players.length; p++) {
			this.players[p].emitUpdate();
		}
	}


	startGame() {
		if(this.players.length < 2) {
			return;
		}
		this.game = new Game(this);
		this.state = "playing";
		this.emitUpdateToPlayers();
		
	}

	playerIds() {
		let playerIds = [];
		for(let p = 0; p < this.players.length; p++) {
			playerIds.push(this.players[p].id);
		}
		return playerIds;
	}

	getSerialState() {

		

		return {
			id: this.id,
			state: this.state,
			game: this.state == 'playing' ? this.game.getSerialState() : undefined,
			players: this.playerIds()
		}
	}

	static newRoom(userInitiator) {
		if (!Room.instances) {
			Room.instances = [];
		}

		const id = makeUniqueId(Room.instances);

		const r = new Room(id, userInitiator);
		Room.instances.push(r);
		return r;
	}

	static get(id) {
		for(let i = 0; i< Room.instances.length; i++){
			if(Room.instances[i].id === id) {
				
				return Room.instances[i];
			}
		}
	}
}

exports.Room = Room;
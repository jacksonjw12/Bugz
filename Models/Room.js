let {makeUniqueId} = require('../util.js');
let {Game} = require('./Game.js');
let {testGameState} = require('../testGameState.js');

class Room {
	constructor(id, userInitator) {
		this.id = id;
		this.state = "waiting"; // playing | 
		this.winner = undefined;
		this.loser = undefined;

		this.players = [userInitator];

		userInitator.joinRoom(this);

	}

	addPlayer(player) {
		for(let p = 0; p < this.players.length; p++) {
			if(this.players[p] == player) {
				return;
			}
		}

		this.players.push(player);

		player.joinRoom(this);
		this.emitUpdateToPlayers();

	}

	removePlayer(player) {
		for(let p = 0; p < this.players.length; p++) {
			if(this.players[p].id == player.id){
				player.leaveRoom();
				this.players.splice(p,1);
				this.emitUpdateToPlayers();

				return;
			}
		}
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
		this.winner = undefined;
		this.loser = undefined;
		this.emitUpdateToPlayers();
		
	}

	startTestGame(playerId1, playerId2) {
		this.game = new Game(this, testGameState(playerId1, playerId2));
		this.state = "playing";
		this.winner = undefined;
		this.loser = undefined;
		this.emitUpdateToPlayers();
	}

	endGame(winner, loser) {

		this.game = undefined;
		this.state = "waiting"
		this.winner = winner;
		this.loser = loser;
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
			players: this.playerIds(),
			winner: this.winner,
			loser: this.loser
		}
	}

	static newRoom(userInitiator) {
		if (!Room.instances) {
			Room.instances = [];
		}

		const id = makeUniqueId(Room.instances, 3);

		const r = new Room(id, userInitiator);
		Room.instances.push(r);
		return r;
	}

	static get(id) {
		if (!Room.instances) {
			Room.instances = [];
		}
		id = id.toUpperCase();
		for(let i = 0; i< Room.instances.length; i++){
			if(Room.instances[i].id === id) {
				
				return Room.instances[i];
			}
		}
	}
}

exports.Room = Room;
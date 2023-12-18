
/*
Hex {
	x: column number
	y: row number

	bugs: [stack of bugs]
}

Bug {
	type
	owner
}


Move {
	playerId
	type: 'move'
	Bug
	to: Hex
	from: Hex
}
Move {
	playerId
	Bug
	type: 'add'
	to: Hex
}

*/

class Game {
	constructor(room) {
		
		this.room = room;
		this.hexes = [];
		this.finished = false;
		this.winner = undefined;

		this.bugs = this.initBugs();

		this.waitingForPlayer = 0;

		const width = 5;
		const height = 5;
		for(var c = -Math.floor(width/2); c< Math.ceil(width/2); c++) {
			for(var r = -Math.floor(height/2) + ((c % 2 == 0) ? 0 : 1); r < Math.ceil(height); r+=2) {
				this.hexes.push({x:c, y:-r, bugs: []})
			}
		}

		this.room.emitUpdateToPlayers();
	}

	initBugs() {

		let playerIds = this.room.playerIds();
		let bugs = {};
		for(let p = 0; p < playerIds.length; p++) {
			const id = playerIds[p];
			bugs[id] = {"🐝": 1, "🕷": 3, "🐜": 3, "🐞": 3, "🦗":3}
		}
		return bugs;
	}


	getSerialState() {
		return {
			hexes: this.hexes,
			waitingForPlayer: this.waitingForPlayer
		}
	}


	validateNextMove(move) {
		return true;
	}

	applyNextMove(move) {

	}
}

exports.Game = Game;
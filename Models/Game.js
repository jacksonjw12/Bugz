let {forEach} = require('../util.js');
const {Hex} = require('./Hex.js');

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

const bugs = ["🐝","🕷", "🐜", "🐞","🦗"];

class Game {
	constructor(room) {
		
		this.room = room;
		this.hexes = [];
		this.finished = false;
		this.winner = undefined;
		this.turn = 0;
		this.round = 0;

		this.bugs = this.initBugs();

		this.playerIds = this.room.playerIds();
		this.waitingForPlayer = 0;
		this.activePlayer = this.playerIds[this.waitingForPlayer];

		const width = 5;
		const height = 5;
		for(var c = -Math.floor(width/2); c< Math.ceil(width/2); c++) {
			for(var r = -Math.floor(height/2) + ((c % 2 == 0) ? 0 : 1); r < Math.ceil(height); r+=2) {
				this.hexes.push({x:c, y:-r, bugs: []})
			}
		}

		this.generateNewMoves(() => {
			this.room.emitUpdateToPlayers();
		})

	}

	initBugs() {

		let playerIds = this.room.playerIds();
		let bugs = {};
		for(let p = 0; p < playerIds.length; p++) {
			const id = playerIds[p];
			bugs[id] = {"🐝": 1, "🕷": 2, "🐜": 3, "🐞": 2, "🦗":3}
		}
		return bugs;
	}

	activePlayerId() {
		return this.playerIds[this.waitingForPlayer];
	}

	// Active player moves one bug to another position.
	generateBugMoves() {

	}

	// Active player adds a new bug to the game.
	generateBugAdds(playableBugs) {

	}

	generateNewMoves(cb) {

		let moves = []

		if(this.round == 0) {
			// Turn 0 can play any bug on {0,0}
			// Turn 1 can play on any neighbor of {0,0}

			if(this.turn == 0) {
				forEach(bugs, (bug)=>{
					moves.push({
						bug: bug,
						type: 'add',
						to: {x:0, y:0},
						player: this.activePlayer
					})
				})
			}
			else {
				let hexesWithBugs = [];
				forEach(this.hexes, (hex) => {
					if(hex.bugs.length > 0) {
						hexesWithBugs.push(hex);
					}
				})

				let emptyNeighbors = [];
				forEach(this.hexes, (hex) => {
					forEach(hexesWithBugs, (bugHex) => {
						if(Hex.neighbors(hex, bugHex)) {
							forEach(bugs, (bug)=>{
								moves.push({
									bug: bug,
									type: 'add',
									to: {x:0, y:0},
									player: this.activePlayer
								})
							})
						}

					})
				})
				

				
			}
		} else {
			let playersBugs = this.bugs[this.activePlayer];
			const queenPlayed = playersBugs['🐝'] == 0;
			let playableBugs;
			if(this.round == 3 && !queenPlayed) {
				playableBugs = ['🐝'];
			}
			else {
				playableBugs = [];
				for (const [key, value] of Object.entries(playersBugs)) {
				  if(value)  {
				  	playableBugs.push(key);
				  }
				}

			}

			if(queenPlayed) {
				moves.concat(this.generateBugMoves());
			}
			moves.concat(this.generateBugAdds(playableBugs))


		}


		this.nextMoves = moves;
		cb()


	}

	getSerialState() {
		return {
			hexes: this.hexes,
			activePlayer: this.activePlayer,
			validNextMoves: this.nextMoves,
			bugs: this.bugs
		}
	}


	validateNextMove(move) {
		return true;
	}

	applyNextMove(move) {

		this.nextTurn();
	}
	nextTurn() {
		this.turn++;
		this.waitingForPlayer++;
		if(this.waitingForPlayer >= this.playerIds.length) {
			this.waitingForPlayer %= this.playerIds.length;
			this.round++;
		}
		
		this.activePlayer = this.playerIds[this.waitingForPlayer];

		this.generateNewMoves(() => {
			this.room.emitUpdateToPlayers();
		})

		


	}
}

exports.Game = Game;
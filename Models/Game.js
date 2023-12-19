let {forEach} = require('../util.js');
const {Hex} = require('./Hex.js');

/*
Hex {
	x: column number
	y: row number

	bug: [stack of bugs]
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
	constructor(room, existingState) {
		
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

		if(existingState) {
			this.applyExistingState(existingState)
		}

		this.generateNewMoves(() => {
			this.room.emitUpdateToPlayers();
		})

	}

	applyExistingState(state) {
		let keys = ['hexes', 'finished', 'winner', 'turn', 'round', 'bugs', 'waitingForPlayer', 'activePlayer'];
		forEach(keys, (key)=> {
			if(state[key] !== undefined) {
				this[key] = state[key];
			}
		});
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
		let moves = [];

		/*
			Strats:
			Get a list of all the bugs that arent blocked
			Check if removing them from the board creates an island
				if true skip
			Run a bug-specific move generator

		*/

		forEach(this.hexes, (hex) => {
			if(hex.bugs.length == 0) {
				return;
			}
			if(!Hex.isOwner(hex, this.activePlayer)){
				return;
			}

			if(Hex.isChainLink(this.hexes, hex)) {
				return;
			}

			const bug = hex.bugs[hex.bugs.length-1].bug;

			moves = moves.concat(Hex.computeBugMoves(this.hexes, hex, bug, this.activePlayer));

			// 



		});

		
		return moves;
	}

	// Active player adds a new bug to the game.
	generateBugAdds(playableBugs) {
		
		let moves= [];
		forEach(this.hexes, (hex) => {
			if(hex.bugs.length != 0) {
				return;
			}

			let bordersPlayer = false;
			let bordersOpponent = false;
			Hex.forEachNeighbor(this.hexes, hex, (neighboring) => {
				if(!neighboring.bugs.length) {
					return;
				}
				// console.log("checking hex with neighbors, ", neighboring)
				const topBug = neighboring.bugs[neighboring.bugs.length-1];
				const isPlayerBug = topBug.owner == this.activePlayer;
				if(!isPlayerBug) {
					bordersOpponent = true;
					return true; //return early
				}
				bordersPlayer = true;
			});
			// console.log({bordersPlayer,bordersOpponent})

			if(bordersPlayer && !bordersOpponent) {
				forEach(playableBugs, (bug)=>{
					
					moves.push({
						bug: bug,
						type: 'add',
						to: hex,
						player: this.activePlayer
					})
				
					
				})
			}

			
		})
		
		return moves;

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
				console.log("hexesWithBugs:");
				console.log(hexesWithBugs);

				let emptyNeighbors = [];
				forEach(this.hexes, (hex) => {
					forEach(hexesWithBugs, (bugHex) => {
						if(Hex.neighbors(hex, bugHex)) {
							forEach(bugs, (bug)=>{
								moves.push({
									bug: bug,
									type: 'add',
									to: hex,
									player: this.activePlayer
								})
							})
						}

					})
				})
				

				
			}
		} else {
			console.log(this.bugs);
			console.log(this.activePlayer);
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
				moves = moves.concat(this.generateBugMoves());
			}
			moves = moves.concat(this.generateBugAdds(playableBugs))


		}


		this.nextMoves = moves;
		cb()


	}

	getSerialState() {
		return {
			hexes: this.hexes,
			activePlayer: this.activePlayer,
			validNextMoves: this.nextMoves,
			bugs: this.bugs,
			round: this.round,
			turn: this.turn,
			finished: this.finished
		}
	}


	validateNextMove(move) {
		return true;
	}

	ensureNeighborsExist(hex) {
		const neighborCoords = Hex.generateNeighborCoords(hex);
		forEach(neighborCoords, (coord) => {
			if(!Hex.in(this.hexes, coord)) {
				this.hexes.push({x:coord.x, y: coord.y, bugs: []})
			}
		})
	}

	applyNextMove(move) {
		if(this.validateNextMove(move)) {
			//todo - actually apply the move
			console.log('move is gonna be');
			console.log(move);
			if(move.type == 'add') {
				let targetHex = Hex.find(this.hexes, move.to);
				if(!targetHex) {
					console.log("Could not find targetHex, yikes");
					return;
					
				}
				targetHex.bugs.push({bug: move.bug, owner: this.activePlayer});

				this.bugs[this.activePlayer][move.bug]--;

				this.ensureNeighborsExist(targetHex);
			}
			else {

				let destinationHex = Hex.find(this.hexes, move.to);
				let originHex = Hex.find(this.hexes, move.from);
				if(!destinationHex || !originHex) {
					console.log("Could not find destinationHex or originHex, yikes");
					return;
				}

				console.log("originHex", originHex);
				const bug = originHex.bugs.splice(originHex.bugs.length-1, 1)[0];

				destinationHex.bugs.push(bug);

				console.log("destination", destinationHex);

				this.ensureNeighborsExist(destinationHex);

			}

			const loser = Hex.checkLoseCondition(this.hexes);
			if(loser != undefined) {

				this.loser = loser;
				for(let p = 0; p < this.playerIds.length; p++) {
					if(this.playerIds[p] != loser) {
						this.winner = this.playerIds[p];
						break;
					}
				}
				this.finished = true;

				this.room.endGame(this.winner,this.loser);

				
			}
			else {
				this.nextTurn();
			}


			
		}
		
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


/*
Hex {
	
	x: column number
	y: row value
	bugs: [{
		bug: ":)"
		owner: "id"
	}]
}

*/

class Hex {
	static find(hexlist, hex) {
		for(let h = 0; h < hexlist.length; h++) {
			if(Hex.is(hexlist[h], hex)) {
				return hexlist[h];
			}
		}
	}

	static in(hexlist, hex) {
		for(let h = 0; h < hexlist.length; h++) {
			if(Hex.is(hexlist[h], hex)) {
				return true;
			}
		}
		return false;
	}

	static is(hex1, hex2) {
		return hex1.x == hex2.x && hex1.y == hex2.y;
	}

	static isOwner(hex, playerId) {
		return hex.bugs && hex.bugs[hex.bugs.length-1].owner == playerId;
	}

	static cloneHexList(hexList) {
		return JSON.parse(JSON.stringify(hexList));
	}


	// static emptyBFS(hexList, origin, depth) {
	// 	let visited = [];
	// 	let list = Hex.cloneHexList(hexList);
	// 	let initialNeighbors = [];
	// 	Hex.forEachVisitableNeighbor(list, origin, (n) => {
			
	// 		n.seen = true;
	// 		n.depth = 1;
	// 		// n.maxDepth = 
	// 		initialNeighbors.push(n);
			
	// 	})

	// 	if(initialNeighbors.length < 2) {
	// 		return false;
	// 	}

	// 	// Get origin in cloned list
	// 	let origin = Hex.find(list, hex);

	// 	// Ignore origin
	// 	origin.seen = true;
	// 	origin.depth = 0;

	// 	// start at the first neighbor
	// 	let queue = initialNeighbors;

	// 	while(queue.length) {
	// 		const visiting = queue.splice(0,1)[0];

	// 		Hex.forEachVisitableNeighbor(list, visiting, (n) => {
				
	// 			if(!n.seen) {
	// 				n.seen = true;
	// 				n.depth = visiting.depth + 1;
	// 				stack.push(n);
	// 			}
	// 			else if(visiting.depth + 1 < n.depth) {
	// 				n.depth = visiting.depth + 1;
	// 				queue.push(n);
	// 			}
	// 		})
	// 	}
	// 	console.log({initialNeighbors})
	// 	for(let n = 1; n < initialNeighbors.length; n++) {
	// 		if(!initialNeighbors[n].seen) {
	// 			return true;
	// 		}
	// 	}

	// 	return false;

	// }

	static genericBugMoves(hexList, hex, bugType, activePlayer) {
		let moves = [];

		Hex.forEachNeighbor(hexList, hex, (neighbor) => {
			moves.push({
					bug: bugType,
					type: 'move',
					from: hex,
					to: neighbor,
					player: activePlayer
				})
		})
		return moves;
	}

	static beeMoves(hexList, hex, bugType, activePlayer) {
		let moves = [];

		Hex.forEachVisitableNeighbor(hexList, hex, (neighbor) => {
			moves.push({
					bug: bugType,
					type: 'move',
					from: hex,
					to: neighbor,
					player: activePlayer
				})
		})
		return moves;
	}

	static beetleMoves(hexList, hex, bugType, activePlayer) {
		let moves = [];

		Hex.forEachVisitableNeighbor(hexList, hex, (neighbor) => {
			moves.push({
					bug: bugType,
					type: 'move',
					from: hex,
					to: neighbor,
					player: activePlayer
				})
		}, {beetle:true})
		return moves;
	}

	static computeBugMoves(hexList, hex, bugType, activePlayer) {

		if (bugType == "🐝") {
			return Hex.beeMoves(hexList, hex, bugType, activePlayer);

		} else if(bugType == "🕷") {
			return Hex.genericBugMoves(hexList, hex, bugType, activePlayer);

		} else if(bugType == "🐜") {
			return Hex.genericBugMoves(hexList, hex, bugType, activePlayer);
			
		} else if(bugType == "🐞") {
			return Hex.beetleMoves(hexList, hex, bugType, activePlayer);
			
		} else if(bugType == "🦗") {
			return Hex.genericBugMoves(hexList, hex, bugType, activePlayer);
			
		}
	}

	static isChainLink(hexList, hex) {
		// If # neighbors <= 1
		// return false
		// Make a copy of hexlist
		// Remove hex
		// Run a dfs on one of its neighbors
		// If the dfs doesn't hit all of its other neighbors its a chain link

		let list = Hex.cloneHexList(hexList);

		let initialNeighbors = [];
		Hex.forEachNeighbor(list, hex, (n) => {
			if(n.bugs.length) {
				initialNeighbors.push(n);

			}
		})

		if(initialNeighbors.length < 2) {
			return false;
		}

		// Get origin in cloned list
		let origin = Hex.find(list, hex);

		// Delete
		origin.bugs = [];

		// start at the first neighbor
		let stack = [initialNeighbors[0]];
		initialNeighbors[0].seen = true;

		while(stack.length) {
			const visiting = stack.pop();

			Hex.forEachNeighbor(list, visiting, (n) => {
				if(n.bugs.length && !n.seen) {
					n.seen = true;
					stack.push(n);
				}
			})
		}
		console.log({initialNeighbors})
		for(let n = 1; n < initialNeighbors.length; n++) {
			if(!initialNeighbors[n].seen) {
				return true;
			}
		}

		return false;

	}

	static generateNeighborCoords(hex) {
		let neighbors = [];

		//Must be clockwise

		//left bot
		neighbors.push({x: hex.x-1, y: hex.y-1});

		//left top
		neighbors.push({x: hex.x-1, y: hex.y+1});

		//top
		neighbors.push({x: hex.x, y: hex.y+2});

		


		//right top
		neighbors.push({x: hex.x+1, y: hex.y+1});
		// right bot
		neighbors.push({x: hex.x+1, y: hex.y-1});

		//bot
		neighbors.push({x: hex.x, y: hex.y-2});

		return neighbors;

	}

	static neighbors(hex, otherHex) {
		let neighbors = Hex.generateNeighborCoords(hex);

		for(let n = 0; n < neighbors.length; n++) {
			if(Hex.is(otherHex, neighbors[n])) {
				return true;
			}
		}
		return false;
	}

	static forEachVisitableNeighbor(hexlist, hex, condition, options={}) {
		let neighbors = Hex.generateNeighborCoords(hex);
		let foundNeighbors = [];
		let hasBugs = []; // clockwise
		for(let h = 0; h < hexlist.length; h++) {
			if(Hex.in(neighbors, hexlist[h])) {
				foundNeighbors.push(hexlist[h]);
				
				hasBugs.push(!!hexlist[h].bugs.length);
				
				
			}
		}
		if(foundNeighbors.length !== 6) {
			console.log("missing hex tiles from search");
			condition(undefined);
			return;
		}

		for(let n = 0; n < foundNeighbors.length; n++) {
			//Check if its visitable

			if(!options.beetle) {
				if (hasBugs[n]) {
					continue;
				}
				let leftBlocked = hasBugs[ (n < 0) ? (foundNeighbors.length - 1) : (n-1) ]
				let rightBlocked = hasBugs[ (n >= foundNeighbors.length) ? 0 : (n+1) ]
				if(leftBlocked && rightBlocked) {
					continue;
				}
			}
			
			//Check if its floating
			let anyBugNeighbors = false;
			Hex.forEachNeighbor(hexlist, foundNeighbors[n], (subNeighbor) => {
				console.log({subNeighbor});
				if(hex.bugs.length < 2 && Hex.is(subNeighbor, hex)) {
					console.log("should be at least once for each offered move")
					return;
				}

				if(subNeighbor.bugs.length) {
					anyBugNeighbors = true;
					return true;
				}
			});

			if(!anyBugNeighbors) {
				continue;
			}

			let returnEarly = condition(foundNeighbors[n])
			if(returnEarly) {
				return;
			}

		}
	}

	static forEachNeighbor(hexlist, hex, condition) {
		let neighbors = Hex.generateNeighborCoords(hex);
		for(let h = 0; h < hexlist.length; h++) {
			if(Hex.in(neighbors, hexlist[h])) {
				// console.log("checking neighbor", hexlist[h]);
				let returnEarly = condition(hexlist[h])
				if(returnEarly) {
					return;
				}
			}
		}

	}
}

exports.Hex = Hex;
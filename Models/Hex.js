

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


	static antMoves(hexList, hex, bugType, activePlayer, turn) {
		let moves = [];
		let list = Hex.cloneHexList(hexList);
		// Get origin in cloned list
		let origin = Hex.find(list, hex);

		let initialNeighbors = [];
		Hex.forEachVisitableNeighbor(list, hex, (n) => {
			n.seen = true;
			initialNeighbors.push(n);
			moves.push({
				bug: bugType,
				type: 'move',
				from: origin,
				turn,
				to: n,
				player: activePlayer
			})
		})

		
		// Ignore origin
		origin.seen = true;
		origin.depth = 0;

		// start at the first neighbor
		let queue = initialNeighbors;

		while(queue.length) {
			const visiting = queue.splice(0,1)[0];
			// console.log({visiting})

			Hex.forEachVisitableNeighbor(list, visiting, (n) => {
				
				if(!n.seen) {
					n.seen = true;
					queue.push(n);
					moves.push({
						bug: bugType,
						type: 'move',
						from: origin,
						turn,
						to: n,
						player: activePlayer
					})
				}
			})
		}
		

		return moves;

	}
	static spiderMoves(hexList, hex, bugType, activePlayer, turn) {
		let moves = [];
		
		
		let initialNeighbors = new Set()
		Hex.forEachVisitableNeighbor(hexList, hex, (n) => {
			initialNeighbors.add(n);
		})



		const exploreNextSet = (atHex, cameFromHex, setToAdd) => {
			Hex.forEachVisitableNeighbor(hexList, atHex, (n) => {
				
				if(Hex.is(cameFromHex, n)) {
					return;
				}
				setToAdd.add(n);
			}, {floatingOrigin: hex});
		}
		

		let depth3Neighbors = new Set();
		initialNeighbors.forEach((initialNeighbor) => {
			let depth2 = new Set();
			exploreNextSet(initialNeighbor, hex, depth2);

			depth2.forEach((secondaryNeighbor) => {
				exploreNextSet(secondaryNeighbor, initialNeighbor, depth3Neighbors);
			})
		})
			
		
		depth3Neighbors.forEach((depth3Neighbor) => {
			moves.push({
				bug: bugType,
				type: 'move',
				from: hex,
				turn,
				to: depth3Neighbor,
				player: activePlayer
			})
		})

		return moves;

	}

	static grasshopperMoves(hexList, hex, bugType, activePlayer, turn) {
		
		let moves = [];
		const traverseDirection = (startHex, direction) => {
			let emptyFound = false;
			let curHex = startHex;
			while(!emptyFound) {
				//advance curHex in direction
				let neighborCoords = Hex.generateNeighborCoords(curHex);

				let neighborDirection = neighborCoords[direction];
				console.log({neighborCoords, neighborDirection, direction});
				curHex = Hex.find(hexList, neighborDirection);
				console.log({curHex});

				// check empty
				emptyFound = !curHex.bugs.length;
			}
			return curHex;
		}

		Hex.forEachNeighbor(hexList, hex, (neighbor, i) => {
			if(neighbor.bugs.length) {
				console.log("grasshopper checking for: ", neighbor);
				const finalHex = traverseDirection(neighbor, i)
				moves.push({
					bug: bugType,
					type: 'move',
					from: hex,
					turn,
					to: finalHex,
					player: activePlayer
				})
			}
			
		})
		return moves;
	}

	static genericBugMoves(hexList, hex, bugType, activePlayer, turn) {
		let moves = [];

		Hex.forEachNeighbor(hexList, hex, (neighbor) => {
			moves.push({
					bug: bugType,
					type: 'move',
					from: hex,
					turn,
					to: neighbor,
					player: activePlayer
				})
		})
		return moves;
	}

	static beeMoves(hexList, hex, bugType, activePlayer, turn) {
		let moves = [];

		Hex.forEachVisitableNeighbor(hexList, hex, (neighbor) => {
			moves.push({
					bug: bugType,
					type: 'move',
					from: hex,
					turn,
					to: neighbor,
					player: activePlayer
				})
		})
		return moves;
	}

	static beetleMoves(hexList, hex, bugType, activePlayer, turn) {
		let moves = [];

		Hex.forEachVisitableNeighbor(hexList, hex, (neighbor) => {
			moves.push({
					bug: bugType,
					type: 'move',
					from: hex,
					turn,
					to: neighbor,
					player: activePlayer
				})
		}, {beetle:true})
		return moves;
	}

	static computeBugMoves(hexList, hex, bugType, activePlayer, turn) {

		if (bugType == "🐝") {
			return Hex.beeMoves(hexList, hex, bugType, activePlayer, turn);

		} else if(bugType == "🕷") {
			return Hex.spiderMoves(hexList, hex, bugType, activePlayer, turn);

		} else if(bugType == "🐜") {
			return Hex.antMoves(hexList, hex, bugType, activePlayer, turn);
			
		} else if(bugType == "🐞") {
			return Hex.beetleMoves(hexList, hex, bugType, activePlayer, turn);
			
		} else if(bugType == "🦗") {
			return Hex.grasshopperMoves(hexList, hex, bugType, activePlayer, turn);
			
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
		// console.log({initialNeighbors})
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

	static hasBugs(hex) {
		return !!(hex.bugs && hex.bugs.length);
	}

	static forEachVisitableNeighbor(hexlist, hex, condition, options={}) {
		// console.log({forEachVisitableNeighbor: hex})
		let neighbors = Hex.generateNeighborCoords(hex);
		let foundNeighbors = [];
		let hasBugs = []; // clockwise

		for(let hn = 0; hn < neighbors.length; hn++) {
			let neighbor = Hex.find(hexlist, neighbors[hn]);

			// console.log({neighbor, neighborCoord: neighbors[hn]})
			
			if(neighbor === undefined) {
				continue;
			}
			foundNeighbors.push(neighbor);
			hasBugs.push(Hex.hasBugs(neighbor));
		}
		
		if(foundNeighbors.length !== 6) {
			// console.log("missing hex tiles from search");
			// condition(undefined);
			// return;
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
			let floatingOrigin = options.floatingOrigin ? options.floatingOrigin : hex;
			Hex.forEachNeighbor(hexlist, foundNeighbors[n], (subNeighbor) => {
				if(floatingOrigin.bugs.length < 2 && Hex.is(subNeighbor, floatingOrigin)) {
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

			let returnEarly = condition(foundNeighbors[n], n)
			if(returnEarly) {
				return;
			}

		}
	}

	static forEachNeighbor(hexlist, hex, condition) {
		let neighbors = Hex.generateNeighborCoords(hex);
		for(let h = 0; h < hexlist.length; h++) {

			for(let n = 0; n < neighbors.length; n++) {
				if(Hex.is(neighbors[n], hexlist[h])) {
					let returnEarly = condition(hexlist[h], n)
					if(returnEarly) {
						return;
					}
				}
			}
		}

	}


	static checkLoseCondition(hexlist) {
		// Find all the bees


		// Check to see if a bee is surrounded

		// If players == 2, the other player wins

		let bees = [];
		let owners = []
		for(let h = 0; h < hexlist.length; h++) {
			const hex = hexlist[h];
			if(hex.bugs) {
				console.log({hexBugs: hex.bugs})
				for(let b = 0; b < hex.bugs.length; b++) {
					if(hex.bugs[b].bug == "🐝") {
						bees.push(hex);
						owners.push(hex.bugs[b].owner)
						break;
					}
				}
			}

		
		}

		for(let b = 0; b < bees.length; b++) {
			console.log({beeCheck: bees[b], b})
			let freeNeighbor = false;

			Hex.forEachNeighbor(hexlist, bees[b], (neighbor) => {
				if(!neighbor.bugs.length) {
					freeNeighbor = true;
					return true;
				}
			})

			if(!freeNeighbor) {
				return owners[b];
			}
		}


	}

}

exports.Hex = Hex;


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

		// top & bottom
		neighbors.push({x: hex.x, y: hex.y+2});
		neighbors.push({x: hex.x, y: hex.y-2});

		//left
		neighbors.push({x: hex.x-1, y: hex.y+1});
		neighbors.push({x: hex.x-1, y: hex.y-1});

		//right
		neighbors.push({x: hex.x+1, y: hex.y+1});
		neighbors.push({x: hex.x+1, y: hex.y-1});
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
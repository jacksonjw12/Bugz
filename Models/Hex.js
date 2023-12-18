

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
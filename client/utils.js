function clamp(val, start, end) {
	if(val < start){
		return start;
	}
	else if(val > end){
		return end;
	}
	return isNaN(val) ? (end - start) / 2 + start : val;
}

function pointDist(point1, point2) {
	let xd = point1.x - point2.x;
	let yd = point1.y - point2.y;
	return Math.sqrt(xd * xd + yd * yd);
}


const debounce = (func, wait, immediate) => {
	    var timeout;
	    return () => {
	        const context = this, args = arguments;
	        const later = function() {
	            timeout = null;
	            if (!immediate) func.apply(context, args);
	        };
	        const callNow = immediate && !timeout;
	        clearTimeout(timeout);
	        timeout = setTimeout(later, wait);
	        if (callNow) func.apply(context, args);
	    };
	};

const forEach = (list, cb) => {
	for(let i = 0; i <list.length; i++) {
		cb(list[i], i);
	}
}


/*
Hex {
	
	x: column number
	y: row value
}

todo, dont just copy this from the serverside in future, I can prolly import it with importMap

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

	static checkNeighborCondition(hexlist, hex, condition) {
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
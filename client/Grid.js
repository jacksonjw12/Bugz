const hexSize = 100;
const ratio = Math.sqrt(3)/2;
const hexPoints = [
			{x: -hexSize, y: 0},
			{x: -hexSize/2, y: ratio*hexSize}, 
			{x: hexSize/2, y: ratio*hexSize},
			{x: hexSize, y: 0},
			{x: hexSize/2, y: -ratio*hexSize},
			{x: -hexSize/2, y: -ratio*hexSize}
		];


const bugSet = new Set("🐝","🕷", "🐜", "🐞","🦗")
const bugs = ["🐝","🕷", "🐜", "🐞","🦗"]
class Overlay {
	static applyGameState(state, focusedBug) {
		const playing = state.activePlayer == userId;
		console.log("playing: ", state.activePlayer, userId)

		if(playing) {
			document.getElementById("turnIndicator").innerHTML = "Your turn"
			document.getElementById("turnIndicator").style.background = "gold";
			Overlay.showAddOptions(state,focusedBug);
			document.getElementById("bugButtons").style.display = "flex"
		}
		else {
			document.getElementById("turnIndicator").innerHTML = "Opponents turn"
			document.getElementById("turnIndicator").style.background = "grey";
			document.getElementById("bugButtons").style.display = "none"
		}
		



	}

	static showAddOptions(state, focusedBug) {
		const bugsOwned = state.bugs[userId];


		const addableBugs = new Set();
		const validMoves = state.validNextMoves;
		forEach(validMoves, (move) => {
			if(move.type == 'add') {
				addableBugs.add(move.bug)
			}
			
		})

		const disabledBugs = {};
		forEach(bugs, (bug) => {
			if(!addableBugs.has(bug)) {
				disabledBugs.push
			}
		})

		
		document.getElementById('bugButtons').innerHTML = `
		<div id="🐝Button" onClick="Grid.instance.focusBug('🐝')" class="bugButton ${ !addableBugs.has('🐝') ? 'hiddenBugContainer' : ''} ${ focusedBug == '🐝' ? 'selected' : ''}" ${bugsOwned['🐝'] == 0 ? 'style="display:none;"' : ''} >
            <div id="🐝Amount" class="numBugs ${ !addableBugs.has('🐝') ? 'hiddenBug' : ''}">${bugsOwned['🐝']}</div>
            <div class="bug ${ !addableBugs.has('🐝') ? 'hiddenBug' : ''}">🐝</div>
        </div>
        <div id="🕷Button" onClick="Grid.instance.focusBug('🕷')" class="bugButton ${ !addableBugs.has('🕷') ? 'hiddenBugContainer' : ''} ${ focusedBug == '🕷' ? 'selected' : ''}" ${bugsOwned['🕷'] == 0 ? 'style="display:none;"' : ''}>
            <div id="🕷Amount" class="numBugs ${ !addableBugs.has('🕷') ? 'hiddenBug' : ''}">${bugsOwned['🕷']}</div>
            <div class="bug ${ !addableBugs.has('🕷') ? 'hiddenBug' : ''}">🕷️</div>
        </div>
        <div id="🐜Button" onClick="Grid.instance.focusBug('🐜')" class="bugButton ${ !addableBugs.has('🐜') ? 'hiddenBugContainer' : ''} ${ focusedBug == '🐜' ? 'selected' : ''}" ${bugsOwned['🐜'] == 0 ? 'style="display:none;"' : ''}>
            <div id="🐜Amount" class="numBugs ${ !addableBugs.has('🐜') ? 'hiddenBug' : ''}">${bugsOwned['🐜']}</div>
            <div class="bug ${ !addableBugs.has('🐜') ? 'hiddenBug' : ''}">🐜</div>
            </div>
        <div id="🐞Button" onClick="Grid.instance.focusBug('🐞')" class="bugButton ${ !addableBugs.has('🐞') ? 'hiddenBugContainer' : ''} ${ focusedBug == '🐞' ? 'selected' : ''}" ${bugsOwned['🐞'] == 0 ? 'style="display:none;"' : ''}>
            <div id="🐞Amount" class="numBugs ${ !addableBugs.has('🐞') ? 'hiddenBug' : ''}">${bugsOwned['🐞']}</div>
            <div class="bug ${ !addableBugs.has('🐞') ? 'hiddenBug' : ''}">🐞</div>
            </div>
        <div id="🦗Button" onClick="Grid.instance.focusBug('🦗')" class="bugButton ${ !addableBugs.has('🦗') ? 'hiddenBugContainer' : ''} ${ focusedBug == '🦗' ? 'selected' : ''}" ${bugsOwned['🦗'] == 0 ? 'style="display:none;"' : ''}>
            <div id="🦗Amount" class="numBugs ${ !addableBugs.has('🦗') ? 'hiddenBug' : ''}">${bugsOwned['🦗']}</div>
            <div class="bug ${ !addableBugs.has('🦗') ? 'hiddenBug' : ''}">🦗</div>
        </div>
		`

	}
}

class Grid {

	constructor(canvas) {
		
		this.focusedBug = undefined;
		this.hexes = []
		const width = 5;
		const height = 5;
		for(var c = -Math.floor(width/2); c< Math.ceil(width/2); c++) {
			for(var r = -Math.floor(height/2) + ((c % 2 == 0) ? 0 : 1); r < Math.ceil(height); r+=2) {
				this.hexes.push({x:c,y:-r})
			}
		}
		requestAnimationFrame(()=>{this.render()});
	}

	focusBug(bug) {
		console.log(bug);
		if(this.focusedBug == bug) {
			this.focusedBug = undefined;
		}
		else {
			this.focusedBug = bug;
		}

		Overlay.applyGameState(this.state, this.focusedBug);

		requestAnimationFrame(()=>{this.render()});
	}

	applyNewGameState(state) {
		this.state = state;
		this.focusedBug = undefined;
		this.hexes = state.hexes;
		Overlay.applyGameState(state, this.focusedBug);

		requestAnimationFrame(()=>{this.render()});

	}

	onClick() {
		console.log('click');

		const highlightHexes = [];
		if(this.state) {
			for(let m = 0; m < this.state.validNextMoves.length; m++) {
				if(this.state.validNextMoves[m].bug == this.focusedBug) {
					if(this.state.validNextMoves[m].to.x == this.focusedHex.x && this.state.validNextMoves[m].to.y == this.focusedHex.y) {
						console.log('valid move found!');
						submitMove(this.state.validNextMoves[m])
						return;
					}
				}
			}
			console.log('No valid moves found for clicked position')
		}

	}

	onMouseMove() {
		this.findFocusedHex();
		requestAnimationFrame(()=>{this.render()});

	}

	findFocusedHex() {
		let closest = undefined;
		let closeDist = undefined;
		for(let h = 0; h < this.hexes.length; h++) {
			if(this.hexes[h].centroid === undefined) {
				continue;
			}
			const newDist = pointDist(mousePos, this.hexes[h].centroid) 
			if (closest == undefined || newDist < closeDist) {
				closest = this.hexes[h];
				closeDist = newDist;
			}
		}

		if(this.focusedHex != closest) {
			this.focusedHex = closest;
		}
		

	}

	render() {
		canvas.ctx.fillStyle = "white"
		canvas.ctx.fillRect(0,0,canvas.width,canvas.height);

		const highlightHexes = [];
		if(this.state) {
			for(let m = 0; m < this.state.validNextMoves.length; m++) {
				if(this.state.validNextMoves[m].bug == this.focusedBug && this.state.validNextMoves[m].type == 'add') {
					highlightHexes.push(this.state.validNextMoves[m].to);
				}
			}
		}

		canvas.ctx.font = `${hexSize * camera.zoom}px serif`;
		const iconOffset = hexSize * camera.zoom;
		

		const drawHexLine = (hex, focused) => {

			if(focused) {
				canvas.ctx.strokeStyle = "red";
				canvas.ctx.lineWidth = 2;
			} else {
				canvas.ctx.strokeStyle = "black";
				canvas.ctx.lineWidth = 1;
			}

			hex.centroid = cameraTransform(hexTransform({x:0, y:0}, hex));

			const initial = cameraTransform(hexTransform(hexPoints[0], hex));
			canvas.ctx.beginPath();
			canvas.ctx.moveTo(initial.x,initial.y);
			for(let p = 1; p < hexPoints.length; p++) {
				const transformed = cameraTransform(hexTransform(hexPoints[p], hex));
				canvas.ctx.lineTo(transformed.x,transformed.y);
			}
			canvas.ctx.lineTo(initial.x,initial.y);

			let highlight = false;
			for(let h = 0; h < highlightHexes.length; h++) {
				if(highlightHexes[h].x == hex.x && highlightHexes[h].y == hex.y) {
					highlight = true;
					break;
				}
			}
		

			if(highlight) {
				canvas.ctx.strokeStyle = focused ? 'purple' : "blue";
				canvas.ctx.lineWidth = 3;
				// canvas.ctx.fill();
			}


			canvas.ctx.stroke();

			if(hex.bugs && hex.bugs.length) {
				const bugData = hex.bugs[hex.bugs.length-1];
				const bug = (bugData.bug == '🕷') ? '🕷️' : bugData.bug;
				canvas.ctx.fillStyle = `#${bugData.owner}`;
				canvas.ctx.fill();
				canvas.ctx.fillText(bug, hex.centroid.x - iconOffset/1.5 , hex.centroid.y + iconOffset/2.5)
			}
		}

		for(let b = 0; b < this.hexes.length; b++) {
			if(this.focusedHex == this.hexes[b]) {
				continue;
			}
			drawHexLine(this.hexes[b])
		}
		if(this.focusedHex) {
			drawHexLine(this.focusedHex, true)
		}
	}


	clear() {
		this.hexes = undefined;
		this.focusedHex = undefined;
	}

}


 

const cameraInverse = (point)=> {

	const pos = {x: point.x, y: point.y};
	// Go from camera space back to hex space

	//flip y back over axis
	pos.y = -pos.y + canvas.height/2;
	//adjust x to center of screen
	pos.x = pos.x - canvas.width/2;

	pos.x /= camera.zoom;
	pos.y /= camera.zoom;
	pos.x += camera.centerPoint.x;
	pos.y += camera.centerPoint.x;

	return pos;
}

const cameraTransform = (point) => {
	const transformed = {x:point.x, y: point.y};

	transformed.x -= camera.centerPoint.x;
	transformed.y -= camera.centerPoint.y;
	transformed.x *= camera.zoom;
	transformed.y *= camera.zoom;


	//flip y over axis
	transformed.y = canvas.height/2 - transformed.y;
	//adjust x to center of screen
	transformed.x = canvas.width/2 + transformed.x;

	return transformed;

}



const gridItems = []

const drawGridLines = true;

const hexTransform = (point, about) => {
	const transformed = {x: point.x, y: point.y};

	transformed.x += (about.x*ratio*2) * (ratio*hexSize)
	transformed.y += (about.y) * (ratio*hexSize)


	return transformed;

}






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


class Grid {

	constructor(canvas) {
		
		this.focusedBug = undefined;
		this.selectedHex = undefined;
		this.focusedHex = undefined;
		this.hexes = []
		const width = 5;
		const height = 5;
		for(var c = -Math.floor(width/2); c< Math.ceil(width/2); c++) {
			for(var r = -Math.floor(height/2) + ((c % 2 == 0) ? 0 : 1); r < Math.ceil(height); r+=2) {
				this.hexes.push({x:c,y:-r})
			}
		}
		this.queueRender();
	}

	queueRender() {
		requestAnimationFrame(()=>{this.render()});
	}

	focusBug(bug) {
		this.selectedHex = undefined;
		if(this.focusedBug == bug) {
			this.focusedBug = undefined;
			this.highlightHexes([]);
		}
		else {
			this.focusedBug = bug;
			let highlights = []
			for(let m = 0; m < this.state.validNextMoves.length; m++) {
				if(this.state.validNextMoves[m].bug == this.focusedBug && this.state.validNextMoves[m].type == 'add') {
					highlights.push(this.state.validNextMoves[m].to);
				}
			}
			this.highlightHexes(highlights);
		}


		console.log({whatState: this.state, focusedBug: this.focusedBug});
		Overlay.applyGameState(this.state, this.focusedBug);

		this.queueRender();
	}

	clearLocalState() {
		this.focusedBug = undefined;
		this.selectedHex = undefined;
		this.focusedHex = undefined;
		this.highlightHexes([])
	}
	applyNewGameState(state) {

		if(this.state == undefined || this.state.turn != state.turn) {
			this.clearLocalState();
			this.hexes = state.hexes;
		}
		this.state = state;
		
		
		Overlay.applyGameState(state, this.focusedBug);

		this.queueRender();

	}

	attemptSubmitAddMove() {
		console.log('attemptSubmitAddMove')
		for(let m = 0; m < this.state.validNextMoves.length; m++) {
			// Submit add moves
		
			if(this.state.validNextMoves[m].type == 'add' && this.state.validNextMoves[m].bug == this.focusedBug) {
				if(Hex.is(this.state.validNextMoves[m].to, this.focusedHex)) {
					console.log('valid move found!');
					submitMove(this.state.validNextMoves[m])
					return;
				}
			}
			console.log('No valid bug additions found in this position')
			
		}
	}

	attemptSubmitMoveMove() {
		console.log('attemptSubmitMoveMove')

		for(let m = 0; m < this.state.validNextMoves.length; m++) {
			if(this.state.validNextMoves[m].type == 'move' && Hex.is(this.state.validNextMoves[m].from, this.selectedHex)) {
				// alert(`Submit1 to: ${Hex.is(this.state.validNextMoves[m].to, this.focusedHex)} , highlight: ${this.focusedHex.highlight}`);
				if(Hex.is(this.state.validNextMoves[m].to, this.focusedHex) && this.focusedHex.highlight) {
					// alert(`Submit2 X: ${this.focusedHex.x} | Y: ${this.focusedHex.y}`);
					submitMove(this.state.validNextMoves[m])
					return;
				}
			}
			
		}
		this.selectedHex = undefined;
		this.highlightHexes([]);
	}

	attemptSelectHex() {
		console.log('attemptSelectHex');

		// Look through the moves to find a move that originates in the selected hex. Highlight the destinations.
		let newHighlights = [];
		for(let m = 0; m < this.state.validNextMoves.length; m++) {
			if(this.state.validNextMoves[m].type == 'move' && Hex.is(this.state.validNextMoves[m].from, this.focusedHex)) {
				newHighlights.push(this.state.validNextMoves[m].to)
			}
		}

		if(newHighlights.length) {
			console.log("newHighlights", newHighlights);
			this.selectedHex = this.focusedHex;
			this.highlightHexes(newHighlights);
		}

	}

	onClick() {
		if(!this.state || this.state.activePlayer != userId) {
			return;
		}

		if(this.focusedBug) {
			this.attemptSubmitAddMove();
			return;
		}
		else if(this.selectedHex) {
			console.log(this.selectedHex);
			this.attemptSubmitMoveMove();
			return;
		}
		// alert('selectHex');
		this.attemptSelectHex();
		this.queueRender();
		
	}

	highlightHexes(hexlist) {
		for(let h = 0; h < this.hexes.length; h++) {
			if(Hex.in(hexlist, this.hexes[h])) {
				this.hexes[h].highlight = true;
			} else{
				this.hexes[h].highlight = false;
			}
		}
	}

	onMouseMove() {
		this.findFocusedHex();
		this.queueRender();

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

			let highlight = hex.highlight;
		

			if(hex.highlight) {
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

			if(this.selectedHex && Hex.is(this.selectedHex, hex)) {
				canvas.ctx.fillStyle = `rgba(100,255,255,0.5)`;
				canvas.ctx.fill();
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



	static getInstance() {
		if(Grid.instance) {
			return Grid.instance;
		}

		const canvas = {};
		window.canvas = canvas;

		canvas.el = document.getElementById('canvas');
		if(!canvas.el){
			console.log(canvas.el, ':(')
			return;
		}
		canvas.ctx = canvas.el.getContext('2d');
		Grid.instance = new Grid(canvas);
		
		function resize() {
			const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
			const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
			canvas.width = vw;
			canvas.height = vh;
			canvas.el.width = canvas.width;
			canvas.el.height = canvas.height;
			Grid.instance.queueRender();
		}

		resize();
		window.addEventListener('resize',resize, false);

		

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



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


class Grid {

	constructor(canvas) {
		
		this.hexes = []
		const width = 5;
		const height = 5;
		for(var c = -Math.floor(width/2); c< Math.ceil(width/2); c++) {
			for(var r = -Math.floor(height/2) + ((c % 2 == 0) ? 0 : 1); r < Math.ceil(height); r+=2) {
				this.hexes.push({x:c,y:-r})
				// drawHexLine({x:c, y: -r})
			}
		}
		this.render();
		
	}

	applyNewGameState(state) {
		this.hexes = state.hexes;
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

		const drawHexLine = (hex) => {

			if(this.focusedHex == hex) {
				canvas.ctx.strokeStyle = "red";
				canvas.ctx.lineWidth = 2;
			} else {
				canvas.ctx.strokeStyle = "black";
				canvas.ctx.lineWidth = 1;
			}
			


			hex.centroid = cameraTransform(hexTransform({x:0, y:0}, hex));
			// canvas.ctx.fillStyle = "blue"
			// canvas.ctx.fillRect(hex.centroid.x, hex.centroid.y, 10,10)

			const initial = cameraTransform(hexTransform(hexPoints[0], hex));
			canvas.ctx.beginPath();
			canvas.ctx.moveTo(initial.x,initial.y);
			for(let p = 1; p < hexPoints.length; p++) {
				const transformed = cameraTransform(hexTransform(hexPoints[p], hex));
				canvas.ctx.lineTo(transformed.x,transformed.y);
			}
			canvas.ctx.lineTo(initial.x,initial.y);
			canvas.ctx.stroke();
		}

		for(let b = 0; b < this.hexes.length; b++) {
			if(this.focusedHex == this.hexes[b]) {
				continue;
			}
			drawHexLine(this.hexes[b])
		}
		if(this.focusedHex) {
			drawHexLine(this.focusedHex)
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






let socket;
const camera = {
	centerPoint: {x: 0, y: 0},
	zoom: 1
}

window.onload = function(){
	const canvas = {};
	window.canvas = canvas;

	canvas.el = document.getElementById('canvas');
	if(!canvas.el){
		console.log(canvas.el, ':(')
		return;
	}
	canvas.ctx = canvas.el.getContext('2d');
	
	function resize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.el.width = canvas.width;
		canvas.el.height = canvas.height;
	}

	resize();
	window.addEventListener('resize',resize, false);

	Grid.instance = new Grid(canvas);
	console.log('grid', Grid);

	window.mousePos = {
		x: canvas.width / 2,
		y: canvas.height / 2
	};

	const touchState = {
		inTouch: false,
		touchStartMillis: undefined
	}

	canvas.el.addEventListener("mousedown", (event) => {
		touchState.inTouch = true;
		touchState.touchStartMillis = Date.now();
	})

	canvas.el.addEventListener("mouseup", (event) => {
		touchState.inTouch = false;

		const mouseDownTime = Date.now() - touchState.touchStartMillis;

		if(mouseDownTime < 250) {
			Grid.instance.onClick();
		}

		touchState.touchStartMillis = undefined;
	})

	canvas.el.addEventListener("mousemove", (event) => {

		if(touchState.inTouch) {
			const xDiff = mousePos.x - event.clientX;
			const yDiff = mousePos.y - event.clientY;

			camera.centerPoint.x += xDiff;
			camera.centerPoint.y -= yDiff;
			// requestAnimationFrame(tick);
			// debounce(resize, 40, false)
		}
		
		mousePos.x = event.clientX;
		mousePos.y = event.clientY;
		Grid.instance.onMouseMove();



	});


	const onTouch = (touchEvent) => {
		if(touchEvent.touches.length > 0 && touchState.inTouch) {
			var touch = touchEvent.touches[0];// || touchEvent.changedTouches[0];
			
			const xDiff = mousePos.x - touch.clientX;
			const yDiff = mousePos.y - touch.clientY;

			camera.centerPoint.x += xDiff;
			camera.centerPoint.y -= yDiff;
			mousePos.x = event.clientX;
			mousePos.y = event.clientY;
			Grid.instance.onMouseMove();

			// requestAnimationFrame(tick);
			// debounce(resize, 40, false)
		}
		if(touchEvent.touches.length == 0) {
			touchState.inTouch = false;
			mousePos.x = undefined;
			mousePos.y = undefined;
			touchState.touchStartMillis = undefined;
			return;
		}

		if(touchEvent.touches.length == 1 && !touchState.inTouch) {
			touchState.inTouch = true;
			touchState.touchStartMillis = Date.now();
		}
		
	}

	document.addEventListener("touchmove", (event) => {
		var touch = event.touches[0];
		if(touchState.inTouch) {
			const xDiff = mousePos.x - touch.clientX;
			const yDiff = mousePos.y - touch.clientY;

			camera.centerPoint.x += xDiff;
			camera.centerPoint.y -= yDiff;
			// requestAnimationFrame(tick);
			// debounce(resize, 40, false)
		}
		
		mousePos.x = touch.clientX;
		mousePos.y = touch.clientY;
		Grid.instance.onMouseMove();



	});
	document.addEventListener("touchstart", (event) => {
		var touch = event.touches[0];

		if(!touchState.inTouch) {
			mousePos.x = touch.clientX;
			mousePos.y = touch.clientY;
		}
		touchState.inTouch = true;
		touchState.touchStartMillis = Date.now();

	});
	document.addEventListener("touchend", (event) => {
		touchState.inTouch = false;

		const mouseDownTime = Date.now() - touchState.touchStartMillis;

		if(mouseDownTime < 250) {
			Grid.instance.onClick();
		}

		touchState.touchStartMillis = undefined;
	});




	socket = io();
	socket.on('state', function(newState) {
		console.log({newState});
		updateState(newState);
	});

	let blurManualRequestInterval = 5000;
	let blurLoop = undefined;

	window.addEventListener("blur", function(event) { 
	   blurLoop = window.setInterval(()=> {socket.emit('getState')}, blurManualRequestInterval)
	}, false);

	window.addEventListener("focus", function(event) { 
		window.clearInterval(blurLoop);
   		socket.emit('getState');
	}, false);

	 


	
}
function requestNewId() {
	socket.emit('requestNewID')
}

function newGame() {
console.log('new game')
socket.emit('newGame');
}

function leaveRoom() {
	console.log('leaveRoom')
socket.emit('leaveRoom');
}
function leaveGame() {
	if(confirm("really forfeit?")) {
		socket.emit('leaveGame');
	}
}

function joinWithCode() {
socket.emit('joinRoom', {code: document.getElementById('joinGameCode').value})
}

function submitMove(move) {
socket.emit('submitMove', move)

}

function startGame() {
socket.emit('startGame');

}
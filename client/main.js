let socket;
const camera = {
	centerPoint: {x: 0, y: 0},
	zoom: 1
}



let trackers = [undefined, undefined, undefined, undefined]

function flashIndicator(id) {

	console.log(`flash ${id}`)
	if(trackers[id]) {
		window.clearTimeout(trackers[id]);
		trackers[id] = undefined;
	}
	document.getElementById(`indicator${id}`).style.opacity = '1.0';
	trackers[id] = window.setTimeout(() => {
		document.getElementById(`indicator${id}`).style.opacity = '0.0';
		trackers[id] = undefined;
	}, 500)

}


window.onload = function(){
	Grid.getInstance();

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
			Grid.getInstance().onClick();
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
		Grid.getInstance().onMouseMove();



	});


	
	//state.id == 'game'

	canvas.el.addEventListener("touchmove", (event) => {

		if(event.touches.length != 1) {
			return;
		}
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
		Grid.getInstance().onMouseMove();

		
		event.preventDefault();
		event.stopImmediatePropagation();
		

		


	}, {passive: false});
	canvas.el.addEventListener("touchstart", (event) => {
		if(event.touches.length != 1) {
			return;
		}
		var touch = event.touches[0];


		if(!touchState.inTouch) {
			mousePos.x = touch.clientX;
			mousePos.y = touch.clientY;
			Grid.getInstance().onMouseMove();
		}
		// alert('touchStart' + (touchState.inTouch ? 'yes' : 'no'))
		touchState.inTouch = true;
		touchState.touchStartMillis = Date.now();

		
		event.preventDefault();
		event.stopImmediatePropagation();
		

	}, {passive: false});
	canvas.el.addEventListener("touchend", (event) => {
		// if(event.touches.length != 1) {
		// 	return;
		// }
		
		if(!touchState.inTouch) {
			return;
		}
		// alert('touchEnd')
		var touch = event.touches[0];

		
		// mousePos.x = touch.clientX;
		// mousePos.y = touch.clientY;
		

		touchState.inTouch = false;
		const mouseDownTime = Date.now() - touchState.touchStartMillis;

		if(mouseDownTime < 250) {
			Grid.getInstance().onClick();
		}

		touchState.touchStartMillis = undefined;

		
		event.preventDefault();
		event.stopImmediatePropagation();
		
	}, {passive: false});




	socket = io();
	socket.on('state', function(newState) {
		console.log({newState});
		flashIndicator(2);

		updateState(newState);
		if(newState.room && newState.room.game) {
			Grid.getInstance().applyNewGameState(newState.room.game);

		}
	});

	socket.on("connect", () => {
		
	flashIndicator(3);
	  getState();
	});

	socket.on("disconnect", () => {
	  console.log("disconnect");
	  flashIndicator(4);
	  getDelayedState();
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



function getState() {
	socket.emit('getState');
	flashIndicator(1);
}

function getDelayedState() {
	window.setTimeout(getState, 50)

}

function requestNewId() {
	socket.emit('requestNewID')
	getDelayedState();
}

function newGame() {
	console.log('new game')
	socket.emit('newGame');
	getDelayedState();
}

function leaveRoom() {
	console.log('leaveRoom')
	socket.emit('leaveRoom');
	getDelayedState();
}
function leaveGame() {
	if(confirm("really forfeit?")) {
		socket.emit('leaveGame');
		getDelayedState();
	}
}

function joinWithCode() {
	socket.emit('joinRoom', {code: document.getElementById('joinGameCode').value})
	getDelayedState();
}

function submitMove(move) {
	socket.emit('submitMove', move)
	getDelayedState();

}

function startGame() {
	socket.emit('startGame');
	getDelayedState();

}
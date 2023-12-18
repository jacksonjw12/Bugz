
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
	}
	canvas.el.addEventListener("mousedown", (event) => {
		touchState.inTouch = true;
	})

	canvas.el.addEventListener("mouseup", (event) => {
		touchState.inTouch = false;
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
		if(touchEvent.touches.length == 0) {
			mousePos.x = undefined;
			mousePos.y = undefined;
			return;
		}
		var touch = touchEvent.touches[0];// || touchEvent.changedTouches[0];
		mousePos.x = touch.clientX;
		mousePos.y = touch.clientY;
	}

	document.addEventListener("touchmove", onTouch);
	document.addEventListener("touchstart", onTouch);
	document.addEventListener("touchend", onTouch);

	
}

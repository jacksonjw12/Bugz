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


function makeId(len=6) {
    let text = "";
    let possible = "ABCDE0123456789";
    for( let i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function makeUniqueId(idList, len){
	let foundGoodId = false;
	while(!foundGoodId){
		let id = makeId(len);
		let isBad = false;
		for(let i = 0; i< idList.length; i++){
			if (idList[i].id === id){
				isBad = true;
				break;
			}
		}
		if(!isBad){
			foundGoodId = true;
			console.log('id created', id)
			return id;
		}
	}
}

const forEach = (list, cb) => {
	for(let i = 0; i <list.length; i++) {
		cb(list[i], i);
	}
}



exports.forEach = forEach;
exports.makeUniqueId = makeUniqueId;
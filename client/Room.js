class Room {
	static applyNewRoomState(roomState) {

		document.getElementById('roomCode').innerHTML = `Waiting room: <u><span style='color:#${roomState.id}'>${roomState.id}</span></u>`

		let list = ""
		for(let p = 0; p < roomState.players.length; p++) {
			list += `<li style='color:#${roomState.players[p]}'> ${roomState.players[p]}</li> `;
		}
		document.getElementById('playerList').innerHTML = list;


		document.getElementById('startButton').style.display = (roomState.players.length > 1) ? 'block' : 'none';
	}
}
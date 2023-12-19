class Room {
	static applyNewRoomState(roomState) {

		document.getElementById('roomCode').innerHTML = `Waiting room: <u><span style='color:#${roomState.id}'>${roomState.id}</span></u>`

		let list = ""
		for(let p = 0; p < roomState.players.length; p++) {
			list += `<li style='color:#${roomState.players[p]}'> ${roomState.players[p]}</li> `;
		}
		document.getElementById('playerList').innerHTML = list;


		document.getElementById('startButton').style.display = (roomState.players.length > 1) ? 'block' : 'none';


		if(roomState.winner) {
			document.getElementById('winner').innerHTML = `Winner: <span style='color:#${roomState.winner}'>${roomState.winner}</span>`
			document.getElementById('winner').style.display = 'block';
		}
		else {
			document.getElementById('winner').style.display = 'none';
		}
		if(roomState.loser) {
			document.getElementById('loser').innerHTML = `Loser: <span style='color:#${roomState.loser}'>${roomState.loser}</span>`

			document.getElementById('loser').style.display = 'block';
		}
		else {
			document.getElementById('loser').style.display = 'none';
		}
	}
}
class Overlay {

	static applyGameState(state, focusedBug) {
		const playing = state.activePlayer == userId;
		console.log("playing: ", state.activePlayer, userId)

		if(Overlay.lastTurn == state.turn) {
			return;
		}
		Overlay.lastTurn = state.turn;

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
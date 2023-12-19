const testGameState = (playerId1="7150C3", playerId2="38A706") => {

    const testState = {
        "hexes": [
            {
                "x": -2,
                "y": 2,
                "bugs": []
            },
            {
                "x": -2,
                "y": 0,
                "bugs": [
                    {
                        "bug": "🐝",
                        "owner": playerId1
                    }
                ]
            },
            {
                "x": -2,
                "y": -2,
                "bugs": []
            },
            {
                "x": -2,
                "y": -4,
                "bugs": []
            },
            {
                "x": -1,
                "y": 1,
                "bugs": [
                    {
                        "bug": "🕷",
                        "owner": playerId1
                    }
                ]
            },
            {
                "x": -1,
                "y": -1,
                "bugs": [
                    {
                        "bug": "🐜",
                        "owner": playerId1
                    }
                ]
            },
            {
                "x": -1,
                "y": -3,
                "bugs": []
            },
            {
                "x": 0,
                "y": 2,
                "bugs": []
            },
            {
                "x": 0,
                "y": 0,
                "bugs": [
                    {
                        "bug": "🐝",
                        "owner": playerId2
                    }
                ]
            },
            {
                "x": 0,
                "y": -2,
                "bugs": []
            },
            {
                "x": 0,
                "y": -4,
                "bugs": []
            },
            {
                "x": 1,
                "y": 1,
                "bugs": []
            },
            {
                "x": 1,
                "y": -1,
                "bugs": []
            },
            {
                "x": 1,
                "y": -3,
                "bugs": []
            },
            {
                "x": 2,
                "y": 2,
                "bugs": []
            },
            {
                "x": 2,
                "y": 0,
                "bugs": []
            },
            {
                "x": 2,
                "y": -2,
                "bugs": []
            },
            {
                "x": 2,
                "y": -4,
                "bugs": []
            },
            {
                "x": -1,
                "y": 3,
                "bugs": []
            },
            {
                "x": 0,
                "y": 4,
                "bugs": []
            },
            {
                "x": 1,
                "y": 3,
                "bugs": []
            },
            {
                "x": -3,
                "y": -1,
                "bugs": []
            },
            {
                "x": -3,
                "y": 1,
                "bugs": []
            }
        ],
        "activePlayer": playerId1,
        "validNextMoves": [],
        "bugs": {
        },
        "round": 2,
        "turn": 5
    }

    testState.bugs[playerId1] = {
                "🐝": 0,
                "🕷": 1,
                "🐜": 3,
                "🐞": 2,
                "🦗": 3
            };
    testState.bugs[playerId2] = {
                "🐝": 0,
                "🕷": 1,
                "🐜": 3,
                "🐞": 2,
                "🦗": 3
            }

    return testState;

}
exports.testGameState = testGameState;
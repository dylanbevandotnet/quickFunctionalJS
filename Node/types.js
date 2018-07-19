"use strict";

module.exports = {
    Player: Object.freeze({xs: 'x', Os : 'o'}),
    Token: Object.freeze({x: "X", o: "O", empty: " " }),
    GridIndex: Object.freeze({one:1, two:2, three: 3}),
    GameErrors: Object.freeze({
        NotTurnOfPlayer: "Not the player's turn",
        GameSquareNotEmpty: "That square isn't empty"
    }),

    ok: x => Object.freeze({ ok: x }),
    error: x => Object.freeze({error : x}),
    isOk: x => x.ok ? true : false
};
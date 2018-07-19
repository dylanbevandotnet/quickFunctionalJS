"use strict";
let {Player, Token, GridIndex, GameErrors} = require('./types');

let TicTacToe = () => {
    let gameBoard = new Array(9).fill(" ");
    let currentPlayer = Player.xs;
}

let convertTokenPositionToArrayIndex = tokenPosition => {
    let yValue = 0;
    switch(tokenPosition.y){
        case GridIndex.one:
            yValue = 0;
            break;
        case GridIndex.two:
            yValue = 3;
            break;
        case GridIndex.three:
            yValue = 6;
            break;
    }

    switch(tokenPosition.x) {
        case GridIndex.one:
            return yValue;
        case GridIndex.two:
            return yValue + 1;
        case GridIndex.three:
            return yValue + 2;
    }
};

TicTacToe.prototype._validateTurn = player => {
    return player === this.currentPlayer
};

TicTacToe.prototype._validateToken = (index) => {
    return this.gameBoard[index] === ' ';
};

TicTacToe.prototype.placeToken = (playerMove, cb) => {
    if(playerMove.player !== this.currentPlayer) {
        return cb(GameErrors.NotTurnOfPlayer);
    }

    let tokenIndex = convertTokenPositionToArrayIndex(playerMove.position);

    if(this.gameBoard[tokenIndex] !== ' '){
        return cb(GameErrors.GameSquareNotEmpty);
    }

    let token = "";
    switch(playerMove.player) {
        case Player.xs:
            token = Token.x;
            this.currentPlayer = Player.Os;
            break;
        case Player.Os:
            token = Token.o;
            this.currentPlayer = Player.xs;
            break; 
    }
    this.gameBoard[tokenIndex] = token;
};

module.exports = TicTacToe;
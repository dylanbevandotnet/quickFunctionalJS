"use strict";
let {Player, Token, GameErrors, convertTokenPositionToArrayIndex, printBoard} = require('./types');
let moves = require('./moves');

let TicTacToe = function(repository) {
    this.tokens = new Array(9).fill(" ");
    this.currentPlayer = Player.xs;
    this.repository = repository;
};

TicTacToe.prototype.placeToken = function(playerMove, cb) {
    const self = this;

    if(playerMove.player !== this.currentPlayer) {
        return cb(GameErrors.NotTurnOfPlayer);
    }

    let tokenIndex = convertTokenPositionToArrayIndex(playerMove.position);

    if(this.tokens[tokenIndex] !== ' '){
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
    this.tokens[tokenIndex] = token;
    repository.save(this, (err) => {
        return cb(null, this);
    });
};

let gameBoard = new TicTacToe();

for(let move of moves) {
    gameBoard.placeToken(move, (err, board) => {
        if(err){
            console.log('invalid move of ' + err);
        }else{
            console.log('move is legit');
        }
        printBoard(gameBoard.tokens);
    });
}
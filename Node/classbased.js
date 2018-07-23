"use strict";
let {Player, Token, GameErrors, convertTokenPositionToArrayIndex, printBoard} = require('./types');
let moves = require('./moves');

let TicTacToe = function() {
    this.tokens = new Array(9).fill(" ");
    this.currentPlayer = Player.xs;
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
            self.currentPlayer = Player.Os;
            break;
        case Player.Os:
            token = Token.o;
            self.currentPlayer = Player.xs;
            break; 
    }
    self.tokens[tokenIndex] = token;
    cb(null, self);
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
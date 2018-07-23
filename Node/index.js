"use strict";
let {Player, Token, printBoard, GameErrors, convertTokenPositionToArrayIndex} = require('./types');
let {ok, error, isOk} = require('./functional');
let moves = require('./moves');

let createGameBoard = (currentPlayer, tokens) => 
    Object.freeze({
        currentPlayer: currentPlayer, 
        tokens: tokens
    });

let getTokenForPlayer = player => 
    player === Player.xs 
    ? 'X' 
    : 'O';

let getNextPlayer = player => player = Player.xs ? Player.Os : Player.xs;

let placeToken = newMove => {
    let tokenIndex = convertTokenPositionToArrayIndex(newMove.playerMove.position);
    let token = getTokenForPlayer(newMove.gameBoard.currentPlayer)
    let nextPlayer = getNextPlayer(newMove.gameBoard.currentPlayer);
    let tokens = newMove.gameBoard.tokens.map( (t,i) => i === tokenIndex ? token : t);
    let updatedBoard = createGameBoard(nextPlayer, tokens);
    return ok(updatedBoard);
};

let gameBoard = createGameBoard(Player.xs, (new Array(9).fill(Token.empty)));

for(let move of moves) {
    let result = placeToken({
        gameBoard: gameBoard,
        playerMove: move
    });

    if(isOk(result)){
        gameBoard = result.ok;
        console.log('move is legit');
    } else {
        console.log('invalid move of ' + result.error);
    }

    printBoard(gameBoard.tokens);
}
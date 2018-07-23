"use strict";
let {Subject, Observable} = require('rxjs');
let {Player, Token, printBoard, GameErrors, convertTokenPositionToArrayIndex} = require('./types');
let {ok, error, isOk} = require('./functional');
let moves = require('./moves');

let createGameBoard = (currentPlayer, tokens) => Object.freeze({currentPlayer: currentPlayer, tokens: tokens});

let getTokenForPlayer = player => player === Player.xs ? 'X' : 'O';

let getNextPlayer = player => player = Player.xs ? Player.Os : Player.xs;

let validateTurn = newMove => 
    newMove.gameBoard.currentPlayer === newMove.playerMove.player
    ? ok (newMove)
    : error(GameErrors.NotTurnOfPlayer);

let validateToken = newMove => {
    let tokenIndex = convertTokenPositionToArrayIndex(newMove.playerMove.position);

    return newMove.gameBoard.tokens[tokenIndex] === Token.empty
           ? ok (newMove)
           : error(GameErrors.GameSquareNotEmpty);
};

let placeToken = newMove => {
    let tokenIndex = convertTokenPositionToArrayIndex(newMove.playerMove.position);
    let token = getTokenForPlayer(newMove.gameBoard.currentPlayer)
    let nextPlayer = getNextPlayer(newMove.gameBoard.currentPlayer);
    let tokens = newMove.gameBoard.tokens.map( (t,i) => i === tokenIndex ? token : t);
    let updatedBoard = createGameBoard(nextPlayer, tokens);
    return ok(updatedBoard);
};

let gamePipe = validateTurn
                .bindF(validateToken)
                .bindF(placeToken);

let gameBoard = createGameBoard(Player.xs, (new Array(9).fill(Token.empty)));

let boardStream = new Subject();
let moveStream = new Subject();
let errorStream = new Subject();

boardStream.subscribe(b => printBoard(b.tokens));

let combinedStream = Observable.zip(boardStream, moveStream, (b,m) => {
    return {
        gameBoard: b,
        playerMove: m
    }
});

combinedStream.subscribe(gameMove => {
    let gameBoard = gameMove.gameBoard;
    let result = gamePipe(gameMove);
    if(isOk(result)){
        console.log('move is legit');
        boardStream.next(result.ok);
    }else{
        console.log('invalid move of ' + result.error);
        errorStream.next(result.error);
        boardStream.next(gameBoard);
    }
});

boardStream.next(gameBoard);
for(let move of moves) {
    moveStream.next(move);
}
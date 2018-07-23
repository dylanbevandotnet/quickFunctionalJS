"use strict";
let {Subject, Observable} = require('rxjs');
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

let ticTacToePipe = validateTurn
                    .bindF(validateToken)
                    .bindF(placeToken);

let gameBoard = createGameBoard(Player.xs, (new Array(9).fill(Token.empty)));

let boardStream = new Subject();
let moveStream = new Subject();
let errorStream = new Subject();

// we create an observer to the boardStream that has no impact on the current code flow
boardStream.subscribe(b => printBoard(b.tokens));

// we zip up the boardstream and the move stream such that they both come in a pair
let combinedStream = Observable.zip(boardStream, moveStream, (b,m) => {
    return {
        gameBoard: b,
        playerMove: m
    }
});

// when we have a move and a gameboard perform the move
combinedStream.subscribe(gameMove => {
    let gameBoard = gameMove.gameBoard;
    let result = ticTacToePipe(gameMove);
    if(isOk(result)){
        gameBoard = result.ok;
        console.log('move is legit');
        boardStream.next(result.ok);
    } else {
        console.log('invalid move of ' + result.error);
        errorStream.next(result.error);
        // board state did not change to push the current state back to the observable
        boardStream.next(gameBoard);
    }
});

boardStream.next(gameBoard);
for(let move of moves) {
    moveStream.next(move);
}
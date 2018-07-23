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

for(let move of moves) {
    let result = ticTacToePipe({
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
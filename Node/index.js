"use strict";
let {Subject, Observable} = require('rxjs');
let {Player, Token, GridIndex, GameErrors, ok, error, isOk} = require('./types');

let createGameBoard = (currentPlayer, tokens) => Object.freeze({currentPlayer: currentPlayer, tokens: tokens});

let getTokenForPlayer = player => player === Player.xs ? 'X' : 'O';

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


let binder = (f1, f2) => {
    return x => {
        let result = f1(x);

        return  isOk(result)
                ? f2(result.ok)
                : result;
    };
};


Function.prototype.bindF = function(f) {
    var self = this;
    return binder(self,f);
}

let gamePipe = validateTurn
                .bindF(validateToken)
                .bindF(placeToken);

let gameBoard = createGameBoard(Player.xs, (new Array(9).fill(Token.empty)));

let boardStream = new Subject();
let moveStream = new Subject();
let errorStream = new Subject();

boardStream.subscribe(b => console.log('Game state is '  + JSON.stringify(b, null, 2)));

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
        boardStream.next(gameBoard);
    }
});

boardStream.next(gameBoard);


let moveOne = {
    player: Player.xs,
    position: {x:GridIndex.two, y:GridIndex.two}
};

moveStream.next(moveOne);

let moveTwo = {
    player: Player.xs,
    position: {x:GridIndex.two, y:GridIndex.two}
};

moveStream.next(moveTwo);

let moveThree = {
    player: Player.Os,
    position: {x:GridIndex.two, y:GridIndex.two}
};

moveStream.next(moveThree);

let moveFour = {
    player: Player.Os,
    position: {x:GridIndex.one, y:GridIndex.two}
};

moveStream.next(moveFour);
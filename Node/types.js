"use strict";
let GridIndex = Object.freeze({one:1, two:2, three: 3});
module.exports = {
    Player: Object.freeze({xs: 'x', Os : 'o'}),
    Token: Object.freeze({x: "X", o: "O", empty: " " }),
    GridIndex: GridIndex,
    convertTokenPositionToArrayIndex: tokenPosition => {
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
    },
    printBoard: tokens => {
        for(let i = 0, j = tokens.length; i < j; i+=3){
            let row = tokens.slice(i,i+3);
            console.log(`| ${row[0]} | ${row[1]} | ${row[2]} |`);
        }
    }
};
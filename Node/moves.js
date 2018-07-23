"use strict"
let {Player, GridIndex} = require('./types');

let moveOne = {
    player: Player.xs,
    position: {x:GridIndex.two, y:GridIndex.two}
};

let moveTwo = {
    player: Player.xs,
    position: {x:GridIndex.two, y:GridIndex.two}
};

let moveThree = {
    player: Player.Os,
    position: {x:GridIndex.two, y:GridIndex.two}
};

let moveFour = {
    player: Player.Os,
    position: {x:GridIndex.one, y:GridIndex.two}
};

module.exports = [moveOne,moveTwo,moveThree,moveFour];
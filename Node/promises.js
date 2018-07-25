"use strict";

let {ok, error, isOk} = require('./functional');

let promiseOne = x => {
    return new Promise( (resolve, reject) => {
        setTimeout(() => {
            console.log('in promse one with ' + x);
            resolve(ok(x));
        }, 2000);
    });
};

let promiseTwo = x => {
    return new Promise( (resolve, reject) => {
        console.log('in promise two with ' + x);
        resolve(ok(x));
    });
};

let goodPipe =  promiseOne
                .bindP(promiseTwo);

goodPipe('all good')
     .then(x => console.log('good pipe result is ' + JSON.stringify(x, null, 4)));














//////////////////////////////////////////
//                                      //
//          Error promises              //
//                                      //
//////////////////////////////////////////

let errorPromise = x => {
    return Promise.reject('some reason');
};

let errorPipe = promiseOne
                .bindP(errorPromise)
                .bindP(promiseTwo);

errorPipe('this is bad')
    .then(x => console.log('error pipe result is ' + JSON.stringify(x, null, 4)));



















     
//////////////////////////////////////////
//                                      //
//              Mappings                //
//                                      //
//////////////////////////////////////////

let notAPromise = x => {
    console.log("not a promise but I can see " + x);
    return ok(x);
}

let mappedPromise = Promise.map(notAPromise);

let mixedPipe = promiseOne
                .bindP(promiseTwo)
                .bindP(mappedPromise);

mixedPipe('hello')
        .then(x => console.log('mapping result is ' + JSON.stringify(x, null, 4)));


let callbackMethodOne = (x, cb) => {
    if(x.length < 10) {
        return cb('too low');
    }else
    {
        return cb(null, x);
    }
};

let mappedCb = callbackMethodOne.mapCb();
let mappedCbPipe = Promise.map(mappedCb);

let cbPipe =    goodPipe
                .bindP(mappedCbPipe);

cbPipe('short').then(x => console.log('cb result one is ' + JSON.stringify(x, null, 4)));
cbPipe('a much longer phrase').then(x => console.log('cb result two is ' + JSON.stringify(x, null, 4)));
"use strict";

let ok = x => Object.freeze({ ok: x });
let error = x => Object.freeze({error : x});
let isOk = x => x.ok ? true : false;


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

module.exports = {
    ok:ok,
    error:error,
    isOk:isOk
};
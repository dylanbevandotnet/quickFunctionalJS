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

let promiseBinder = (f1, f2) => {
    return x => 
        f1(x)
         .then(result => {
             return  isOk(result)
                     ? f2(result.ok)
                     : Promise.resolve(result);
        })
        .catch(e => Promise.resolve(error(e)));
};

Function.prototype.bindF = function(f) {
    const self = this;
    return binder(self,f);
};

Function.prototype.bindP = function(f) {
    const self = this;
    return promiseBinder(this,f);
};

Promise.map = function(f) {
    return x => {
        return Promise.resolve(f(x));
    }
}

Function.prototype.mapCb = function() {
    const self = this;
    return x => {
        return self(x, (err, item) => {
            if(err){
                return error(err);
            }
            return ok(item);
        })
    };
}

module.exports = {
    ok:ok,
    error:error,
    isOk:isOk
};
"use strict";

let ok = x => Object.freeze({ ok: x });
let error = x => Object.freeze({error : x});
let isOk = x => x.ok ? true : false;


module.exports = {
    ok:ok,
    error:error,
    isOk:isOk
};
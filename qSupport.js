/**
 * Created by wyq on 2015/8/24.
 */

exports.test = function (txt, cb) {
    console.log("Q.nfcall******** %j ********", txt);
    return cb(null, {state: "success"});
};

var async = require("async");
var show = function(i) {
    console.log("************** i: %j",i);
    a
};

var count7 = 0;
async.forever(
    function(cb) {
        try {
            show(count7);
        }catch (e) {
            console.error("err: %j",e);
        }

        count7++;
        setTimeout(cb, 1000);
    },
    function(err) {
        log('1.7 err: ',err);
    }
);


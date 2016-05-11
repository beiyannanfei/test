/**
 * Created by wyq on 2015/8/4.
 */
function noop(){
    console.log("*********uncaughtException************");
}
process.on('uncaughtException', noop);

function external(cb) {
    return cb(process.nextTick(function () {
        throw new Error();
    }));
}

function test() {
    external(function() {

    });
}

test();
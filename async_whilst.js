/**
 * Created by wyq on 2015/7/16.
 */
var async = require("async");

var testList = [1,2,3,4,5,6,7];

var index = 0;
var flag = true;
var exec = function() {
    async.whilst(
        function() {
            return flag;
        },
        function(cb) {
            show();
            ++index;
            if (index == 3) {
                flag = false;
            }
            setTimeout(cb, 1000);

        },
        function(err) {
            console.error(err);
        }
    );
};

var show = function() {
    console.log("******************* ", testList[index]);
};

exec();
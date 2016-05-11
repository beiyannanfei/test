/**
 * Created by wyq on 2015/10/13.
 */

var getDateStr = function (args) {
    if (!args) {
        args = new Date();
    }
    var year = args.getFullYear();
    var month = args.getMonth() + 1;
    var day = args.getDate();
    var hour = args.getHours();
    var minute = args.getMinutes();
    var second = args.getSeconds();
    var millisecond = args.getMilliseconds();

    var dateStr = year + "-" + month + "-" + day;
    console.log(dateStr);
    return dateStr;
};

console.log(getDateStr());

console.log(new Date().toDateString());
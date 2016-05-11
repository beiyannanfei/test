/**
 * Created by wyq on 2016/3/23.
 */

var moment = require("moment");

console.log(moment().format());     //2016-03-23T16:03:57+08:00

console.log(moment().isValid());    //true

console.log(moment(1318781876406).format());    //2011-10-17T00:17:56+08:00

console.log(new Date(2013, 25, 14).toString()); //Sat Feb 14 2015 00:00:00 GMT+0800 (中国标准时间)

console.log(moment(5, "HH").format('YYYY-MM-DD HH:mm:ss'));  //2016-03-23 05:00:00

console.log(moment({hour: 5}).format('YYYY-MM-DD HH:mm:ss'));  //2016-03-23 05:00:00

console.log(moment({hour: 5, minute: 10}).format('YYYY-MM-DD HH:mm:ss'));  //2016-03-23 05:00:00

console.log(moment({hour: 5, minute: 10, seconds: 20}).format('YYYY-MM-DD HH:mm:ss'));  //2016-03-23 05:00:00

console.log(moment({hour: 5, minute: 10, seconds: 20, milliseconds: 300}).format());  //2016-03-23 05:00:00









/**
 * Created by wyq on 2016/3/23.
 */

var moment = require("moment");

function getNowStr() {
	return moment().format("YYYY-MM-DD HH:mm:ss");
}

function show(testFun) {
	if ("object" == typeof testFun) {
		var jsonStr = JSON.stringify(testFun);
	}
	var showStr = "now: " + getNowStr() + ' -- ' + testFun;
	if (jsonStr) {
		showStr += " -- jsonStr: " + jsonStr;
	}
	console.log(showStr);
}

var dateTimeStr = "YYYY-MM-DD HH:mm:ss";

//console.log(moment().startOf('d').format(dateTimeStr));


show(moment().add({hours: -24}).format(dateTimeStr));    //now: 2016-05-11 15:54:32 -- 2016-05-04 15:54:31


show(moment().get('minute'));           //now: 2016-05-11 15:40:27 -- 40
//console.log(moment().format());     //2016-03-23T16:03:57+08:00
//console.log(moment().isValid());    //true
//console.log(moment(1318781876406).format());    //2011-10-17T00:17:56+08:00
//console.log(new Date(2013, 25, 14).toString()); //Sat Feb 14 2015 00:00:00 GMT+0800 (中国标准时间)
//console.log(moment(5, "HH").format('YYYY-MM-DD HH:mm:ss'));  //2016-03-23 05:00:00
//console.log(moment({hour: 5}).format('YYYY-MM-DD HH:mm:ss'));  //2016-03-23 05:00:00
//console.log(moment({hour: 5, minute: 10}).format('YYYY-MM-DD HH:mm:ss'));  //2016-03-23 05:00:00
//console.log(moment({hour: 5, minute: 10, seconds: 20}).format('YYYY-MM-DD HH:mm:ss'));  //2016-03-23 05:00:00
//console.log(moment({hour: 5, minute: 10, seconds: 20, milliseconds: 300}).format());  //2016-03-23 05:00:00
/*
 //Gets or sets the seconds.
 show(moment().seconds(30).format("YYYY-MM-DD HH:mm:ss")); //now: 2016-05-11 14:55:55  --  2016-05-11 14:55:30  setSeconds
 show(moment().seconds());   //now: 2016-05-11 14:59:59 -- 59  getSeconds

 //Gets or sets the minutes.
 show(moment().minute(30).format("YYYY-MM-DD HH:mm:ss"));  //now: 2016-05-11 15:01:21 -- 2016-05-11 15:30:21
 show(moment().minute());    //now: 2016-05-11 15:02:19 -- 2

 //Gets or sets the hour.
 show(moment().hour(10).format("YYYY-MM-DD HH:mm:ss"));  //now: 2016-05-11 15:03:59 -- 2016-05-11 10:03:59
 show(moment().hour());  //now: 2016-05-11 15:04:22 -- 15

 //Gets or sets the day of the month.
 show(moment().date(33).format("YYYY-MM-DD HH:mm:ss"));  //now: 2016-05-11 15:11:21 -- 2016-06-02 15:11:21
 show(moment().date());  //now: 2016-05-11 15:11:56 -- 11

 //Gets or sets the day of the week.
 show(moment().day(5).format("YYYY-MM-DD HH:mm:ss"));    //now: 2016-05-11 15:16:03 -- 2016-05-13 15:16:03
 show(moment().day());   //now: 2016-05-11 15:15:07 -- 3

 //Gets or sets the day of the year.
 show(moment().dayOfYear(10).format("YYYY-MM-DD HH:mm:ss")); //now: 2016-05-11 15:17:57 -- 2016-01-10 15:17:57
 show(moment().dayOfYear());     //now: 2016-05-11 15:16:59 -- 132

 //Gets or sets the week of the year.
 show(moment().week(21).format("YYYY-MM-DD HH:mm:ss"));  //now: 2016-05-11 15:21:11 -- 2016-05-18 15:21:11
 show(moment().week());  //now: 2016-05-11 15:19:48 -- 20

 //Gets or sets the month.
 show(moment().month(5).format("YYYY-MM-DD HH:mm:ss"));      //now: 2016-05-11 15:22:54 -- 2016-06-11 15:22:54
 show(moment().month());     //now: 2016-05-11 15:22:19 -- 4
 show(moment().month("January").format("YYYY-MM-DD HH:mm:ss"));  //now: 2016-05-11 15:23:34 -- 2016-01-11 15:23:34

 //Gets the quarter (1 to 4).
 show(moment().quarter(4).format("YYYY-MM-DD HH:mm:ss"));    //now: 2016-05-11 15:27:36 -- 2016-11-11 15:27:36
 show(moment().quarter());   //now: 2016-05-11 15:26:21 -- 2

 //Gets or sets the year.
 show(moment().year());  //now: 2016-05-11 15:30:02 -- 2016
 show(moment().year(2018).format(dateTimeStr));  //now: 2016-05-11 15:31:02 -- 2018-05-11 15:31:02

 //String getter. In general
 show(moment().get('year'));             //now: 2016-05-11 15:40:27 -- 2016
 show(moment().get('month'));            //now: 2016-05-11 15:40:27 -- 4
 show(moment().get('date'));             //now: 2016-05-11 15:40:27 -- 11
 show(moment().get('hour'));             //now: 2016-05-11 15:40:27 -- 15
 show(moment().get('minute'));           //now: 2016-05-11 15:40:27 -- 40
 show(moment().get('second'));           //now: 2016-05-11 15:40:27 -- 27
 show(moment().get('millisecond'));      //now: 2016-05-11 15:40:27 -- 377

 //Generic setter, accepting unit as first argument, and value as second:
 show(moment().set('year', 2013).format(dateTimeStr));       //now: 2016-05-11 15:42:24 -- 2013-05-11 15:42:24
 show(moment().set('month', 3).format(dateTimeStr));         //now: 2016-05-11 15:42:54 -- 2016-04-11 15:42:54
 show(moment().set('date', 1).format(dateTimeStr));          //now: 2016-05-11 15:43:54 -- 2016-05-01 15:43:54
 show(moment().set('hour', 13).format(dateTimeStr));         //now: 2016-05-11 15:44:21 -- 2016-05-11 13:44:21
 show(moment().set('minute', 20).format(dateTimeStr));       //now: 2016-05-11 15:44:33 -- 2016-05-11 15:20:33
 show(moment().set('second', 30).format(dateTimeStr));       //now: 2016-05-11 15:44:51 -- 2016-05-11 15:44:30
 show(moment().set('millisecond', 123).format(dateTimeStr)); //now: 2016-05-11 15:45:03 -- 2016-05-11 15:45:03
 show(moment().set({'year': 2013, 'month': 3, date: 5, hour: 6, minute: 7, second: 8}).format(dateTimeStr)); //now: 2016-05-11 15:46:17 -- 2013-04-05 06:07:08

 //Mutates the original moment by adding time.(years:y months:M days:d hours:h minutes:m seconds:s milliseconds:ms)
 show(moment().add(7, 'd').format(dateTimeStr));     //now: 2016-05-11 15:50:46 -- 2016-05-18 15:50:46
 show(moment().add({d: 7, hours: 2}).format(dateTimeStr));   //now: 2016-05-11 15:53:14 -- 2016-05-18 17:53:14
 show(moment().add(-7, 'd').format(dateTimeStr));    //now: 2016-05-11 15:54:32 -- 2016-05-04 15:54:31

 //Mutates the original moment by subtracting time.
 show(moment().subtract(7, 'd').format(dateTimeStr)); //now: 2016-05-11 15:56:04 -- 2016-05-04 15:56:04
 show(moment().subtract({d: 7, y: 5}).format(dateTimeStr));  //now: 2016-05-11 15:56:56 -- 2011-05-04 15:56:56

 //Mutates the original moment by setting it to the start of a unit of time.
 show(moment().startOf('y').format(dateTimeStr));        //now: 2016-05-11 15:58:07 -- 2016-01-01 00:00:00
 show(moment().startOf('M').format(dateTimeStr));        //now: 2016-05-11 15:58:47 -- 2016-05-01 00:00:00
 show(moment().startOf('d').format(dateTimeStr));        //now: 2016-05-11 15:59:10 -- 2016-05-11 00:00:00
 show(moment().startOf('h').format(dateTimeStr));        //now: 2016-05-11 15:59:24 -- 2016-05-11 15:00:00
 show(moment().startOf('m').format(dateTimeStr));        //now: 2016-05-11 15:59:33 -- 2016-05-11 15:59:00
 show(moment().startOf('s').format(dateTimeStr));        //now: 2016-05-11 15:59:33 -- 2016-05-11 15:59:33

 //Mutates the original moment by setting it to the end of a unit of time.
 show(moment().endOf('y').format(dateTimeStr));      //now: 2016-05-11 16:00:24 -- 2016-12-31 23:59:59
 show(moment().endOf('M').format(dateTimeStr));      //now: 2016-05-11 16:00:24 -- 2016-05-31 23:59:59
 show(moment().endOf('d').format(dateTimeStr));      //now: 2016-05-11 16:00:24 -- 2016-05-11 23:59:59
 show(moment().endOf('h').format(dateTimeStr));      //now: 2016-05-11 16:00:24 -- 2016-05-11 16:59:59
 show(moment().endOf('m').format(dateTimeStr));      //now: 2016-05-11 16:00:24 -- 2016-05-11 16:00:59
 show(moment().endOf('s').format(dateTimeStr));      //now: 2016-05-11 16:00:24 -- 2016-05-11 16:00:24

 //Time to now
 show(moment([2016, 4, 29]).toNow());    //now: 2016-05-11 16:05:51 -- 17 days ago

 //Time to X
 show(moment([2007, 0, 28]).to(moment([2007, 0, 30])));  //now: 2016-05-11 16:07:26 -- in 2 days

 //Calendar Time
 show(moment().calendar());  //now: 2016-05-11 16:09:01 -- Today at 4:09 PM

 //To get the difference in milliseconds, use moment#diff like you would use moment#from.
 show(moment([2008, 1, 11, 2, 3, 4]).diff(moment([2007, 0, 10, 1, 2, 3])));        //now: 2016-05-11 16:14:02 -- 34304461000
 show(moment([2008, 1, 11, 2, 3, 4]).diff(moment([2007, 0, 10, 1, 2, 3]), 'y'));   //now: 2016-05-11 16:14:13 -- 1
 show(moment([2008, 1, 11, 2, 3, 4]).diff(moment([2007, 0, 10, 1, 2, 3]), 'M'));     //now: 2016-05-11 16:15:17 -- 13
 show(moment([2008, 1, 11, 2, 3, 4]).diff(moment([2007, 0, 10, 1, 2, 3]), 'd'));     //now: 2016-05-11 16:15:17 -- 397
 show(moment([2008, 1, 11, 2, 3, 4]).diff(moment([2007, 0, 10, 1, 2, 3]), 'h'));     //now: 2016-05-11 16:15:17 -- 9529
 show(moment([2008, 1, 11, 2, 3, 4]).diff(moment([2007, 0, 10, 1, 2, 3]), 'm'));     //now: 2016-05-11 16:15:17 -- 571741
 show(moment([2008, 1, 11, 2, 3, 4]).diff(moment([2007, 0, 10, 1, 2, 3]), 's'));     //now: 2016-05-11 16:15:17 -- 34304461

 //As Javascript Date
 show(moment().toDate());    //now: 2016-05-11 16:39:53 -- Wed May 11 2016 16:39:53 GMT+0800 (中国标准时间) -- jsonStr: "2016-05-11T08:39:53.945Z"

 //As Array
 show(moment().toArray());   //now: 2016-05-11 16:39:53 -- 2016,4,11,16,39,53,965 -- jsonStr: [2016,4,11,16,39,53,965]

 //As JSON
 show(moment().toJSON());    //now: 2016-05-11 16:43:20 -- 2016-05-11T08:43:20.087Z

 //As Object
 show(moment().toObject());  //now: 2016-05-11 16:46:32 -- [object Object] -- jsonStr: {"years":2016,"months":4,"date":11,"hours":16,"minutes":46,"seconds":32,"milliseconds":229}

 //As String
 show(moment().toString());  //now: 2016-05-11 16:47:37 -- Wed May 11 2016 16:47:37 GMT+0800
 */


console.log("=============================");

show(moment(new Date()).diff(moment(new Date("2016-08-25 17:01:12")), 'm'));
/*

var today = new Date("2017-01-02");
let startDay = moment(today).add(-6, 'd').dayOfYear();
let endDay = moment(today).dayOfYear();

console.log(startDay, endDay);
console.log(moment(today).add(-1, 'y').endOf('y').format('YYYY-MM-DD'));
console.log(moment(today).add(-1, 'y').endOf('y').dayOfYear());
endDay < startDay ? (endDay = moment(today).add(-1, 'y').endOf('y').dayOfYear() + endDay) : "";
console.log(startDay, endDay);
for (var i = startDay; i <= endDay; ++i) {
	console.log(moment().dayOfYear(i).format('YYYY-MM-DD'));
}
*/

console.log(moment().add(-0, 'd').format('YYYY-MM-DD'));

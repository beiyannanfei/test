/**
 * Created by wyq on 17/4/24.
 */
const EventService = require("./events03");
require("./events05");

EventService.on("data", data => {
	console.log("4  data: %j", data);
});
EventService.on("msg", msg => {
	console.log("4  msg: %j", msg);
});

setTimeout(function () {
	EventService.write("wwwwww");
	EventService.read("RRRRRRR");
}, 1000);





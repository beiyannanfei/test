/**
 * Created by wyq on 17/4/24.
 */
const EventService = require("./events03");

EventService.on("data", data => {
	console.log("5  data: %j", data);
});
EventService.on("msg", msg => {
	console.log("5  msg: %j", msg);
});


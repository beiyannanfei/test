var request = require("request");
var url = "http://localhost:6003/admin"
var j = request.jar();
//var c=config.cookie;//"connect.sid=s%3AQaCGcwIMpOwTi2TM5O73IAEF.GdtOvdALxcmz%2BVEQzOsPb2RTtDW1FK4N%2Bo8k5RZbuvs";

//Cookie	connect.sid=s%3ALpvFh2dPCcBzL77GQGPllOjS.2gutZKzKuG416U%2BRwaZGLr9lluKs7N9JQ7wzfkt2f1c
var cookie = request.cookie("connect.sid=3A1nE7l4V5ng9ovVCvA4DAYEg8.1KGCewj6R0AAZ0P9T9fLW556CxHesdX2atmS7i");
j.setCookie(cookie, url);
var request = request.defaults({jar: j});

/*
 request.post({url: "http://localhost:6003/admin/order/list",
 json: {
 page: 0,
 pageSize: 3,
 order: {
 //name:"sfsdf"
 //type:2
 //,state:"2"
 //,startTime:"2015-07-05 12:23:21"
 //,endTime:"2017-03-02"
 }}, jar: j},
 function (err, resule, body) {
 if (err) {
 console.log(err);
 }
 console.log(body);
 }
 );*/

/*
request.post({url: "http://localhost:6003/admin//order/update/exportorder",
        json: {
            sig: "3349efcb7b4c62f7ce9da19ccea560c8",
            user: {
                name: "wyq",
                icon: "asdf",
                openId: "asdfghjkl"
            },
            id: "5598becc90f1b1b8215e84d3"
        }, jar: j},
    function (err, resule, body) {
        if (err) {
            console.log(err);
        }
        console.log(body);
    }
);

*/

request.post({url: "http://localhost:6600/admin", json: {"aaa": 123}}, function(err, res) {
    console.log("err: %j, res: %j", err, res);
});







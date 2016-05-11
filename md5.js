/**
 * Created by wyq on 2015/7/29.
 */
var MD5         = require("crypto-js/md5");
console.time("aaa");
console.log(MD5("{awefsdafwefsfewfdeswefsafwefsfewfsgrgdegdfghnrthjgfhghk,.i;.ptyj56yu53tyrejntykui678i)(&*%#@!%kjsfh2w3er}").toString());
console.timeEnd("aaa");


var a = {
    "tvmId" : "13811355445",
    "yyyappId" : "wx33dc1a5264b4e846",
    "prize" : {
        "id" : "55a9e968e8bba9365cf0d7f8",
        "type" : 102,
        "name" : "天脉聚源5元红包",
        "pic" : "http://q.cdn.mtq.tvm.cn/adsmall/hb.jpg",
        "rate" : 1,
        "wxRedLotteryId" : "55aa13ecf8958fcc29ed3f3b",
        "money" : 5
    },
    "user" : {
        "openId" : "onC35t7JSiFSOiAMrVkxjNQzEK5Q",
        "name" : "李智慧",
        "icon" : "http://wx.qlogo.cn/mmopen/NibuMiax2PpgrO5LEGeicVpCZdKZs954JzZD2Mg0ElYuW3a2RgIe71G3YIFrkvS2oSsib77f1UDOh3bZzib6Tr0adpBpzdpUXQggb"
    },
    "crazyLotteryId" : "55a9ef62c86c23a77f08e07f",
    "state" : 1,
    "wxstate" : 1
};

//console.log(JSON.stringify(a));


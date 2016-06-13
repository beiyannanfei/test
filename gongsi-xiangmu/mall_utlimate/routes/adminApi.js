/**
 * Created by wyq on 2015/9/15.
 */
var router = require('koa-router');
var api = new router({prefix: '/admin'});
var scratchCard = require("./scratchCard.js");
var prize = require("./prize.js");
module.exports = api;

api.get('/', function *() {
    this.body = 'admin'
    this.send(200)
});

//获取刮刮卡列表
api.get("/list/lottery/:pageId/:ltype", scratchCard.getCardList);
//删除
api.get("/lottery/:id/del", scratchCard.delCard);
//添加奖品
api.post("/addPrize", prize.addPrize);
//奖品列表
api.get("/prize/list", prize.listPrize);
//编辑奖品
api.get("/prize/edit/:id", prize.editPrize);






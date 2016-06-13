/**
 * Created by wyq on 2015/9/15.
 */

var router = require('koa-router');
var api = new router({prefix: '/wechat'})
module.exports = api

api.get('/', function *(){
    this.body = 'wechat'
})








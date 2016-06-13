/**
 * Created by chenjie on 2015/7/12.
 */

var mWxRed = require('../routes/wxRed.js')
var async = require('async')

var  wxPrize = {
     yyyappId: 'wx33dc1a5264b4e846', //'wxddd09c59c4c73c99',
     name: 'name',
     wxredParam: {
         "send_name" : "《远方的家》",
         "hb_type" : "NORMAL",   //普通红包
         "total_amount" : 100,   //单位分
         "total_num" : 1,
         "wishing" : "感谢您对节目的支持！",
         "act_name" : "暑期去游学趣味答题",
         "remark" : "看节目来答题"
    }
}

var arr = [{total_amount: 100, count: 197}, {total_amount: 1000, count: 20}, {total_amount: 5000, count: 4}, {total_amount: 10000, count: 2}, {total_amount: 20000, count: 1}]
var map = {}
async.eachSeries(arr, function(obj, callback){
    var temp = []
    var ids = []
    for (var i = 0; i < obj.count; i ++){
        temp.push(i)
    }
    wxPrize.wxredParam.total_amount = obj.total_amount
    async.eachSeries(temp, function(o, done){
        mWxRed.createwxredAndLotteryInner(wxPrize, function(err, id){
            if (id){
                ids.push(id)
            }
            done()
        })
    }, function(err){
        map[obj.total_amount] = ids
        callback()
    })
}, function(err){
    console.log('success')
    console.log(JSON.stringify(map))
    console.log(map)
})
/**
 * Created by chenjie on 2014/8/7.
 */

// http://kuaidiapi.cn/


var request = require('superagent');
var UID = 16360;
var KEY = "81acc52aa22646968800492b734b9a67";
var KUAIDI_API_URL = "http://www.kuaidiapi.cn/rest/?uid=" + UID + "&key=" + KEY

var comCode = {
    "韵达快递": "yunda",
    "圆通快递": "yuantong",
    "运通快递": "yuntong",
    "中通快递": "zhongtong",
    "宅急送快递": "zjs",
    "顺丰快递": "shunfeng",
    "申通快递": "shentong",
    "京东快递": "jingdong"
}

exports.query = function(req, res){
    var order = req.param('order');
    var id = req.param('id');
    id = comCode[id];
    if (!order){
        return res.send(400, 'order参数不存在')
    }
    if (!id){
        return res.send(400, 'id参数不存在')
    }
    var url = KUAIDI_API_URL + "&order=" + order + "&id=" + id;
    request.get(url).end(function(xhr) {
        if (xhr.statusCode == 200){
            if (xhr.text){
                var body = JSON.parse(xhr.text);
                if (body.errcode == '0000'){
                    body.status = getStatus(body.status);
                    return res.send(body)
                } else{
                    return res.send(500, getErrMsg(body.errcode));
                }
            }
        }
    });
}

function getErrMsg(errCode){
    switch(errCode){
        case '0001':
            return "传输参数格式有误";
        case '0002':
            return "用户编号(uid)无效"
        case '0003':
            return "用户被禁用"
        case '0004':
            return "key无效"
        case '0005':
            return "快递代号(id)无效"
        case '0006':
            return "快递代号(id)无效"
        case '0007':
            return "查询服务器返回错误"
        default:
            return '未知错误'
    }
}

function getStatus(status){
    switch(status){
        case -1:
            return "待查询、在批量查询中才会出现的状态,指提交后还没有进行任何更新的单号";
        case 0:
            return "查询异常"
        case 1:
            return "暂无记录、单号没有任何跟踪记录"
        case 2:
            return "在途中"
        case 3:
            return "派送中"
        case 4:
            return "已签收"
        case 5:
            return "拒收、用户拒签"
        case 6:
            return "疑难件、以为某些原因无法进行派送"
        case 7:
            return "无效单"
        case 8:
            return "超时单"
        case 9:
            return "签收失败"
        default:
            return '未知错误'
    }
}

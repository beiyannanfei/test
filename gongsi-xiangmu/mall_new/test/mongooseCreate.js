/**
 * Created by nice on 2014/9/10.
 */


var moment = require('moment');

var tools = require('../tools');

var models = require('../models/index');
var GroupUsers = models.GroupUsers;

var _ = require('underscore');


var array = [
    {_id:'ocKZ5uAXtSiRRwb2bZ3gR1WtyXyk_9_zyc839', openId: 'ocKZ5uAXtSiRRwb2bZ3gR1WtyXyk_1', wxToken: 'zyc839', groupId: 'tvm_pointMall' },
    {_id:'ocKZ5uAXtSiRRwb2bZ3gR1WtyXyk_10_zyc839', openId: 'ocKZ5uAXtSiRRwb2bZ3gR1WtyXyk_2', wxToken: 'zyc839', groupId: 'tvm_pointMall' },
    {_id:'ocKZ5uAXtSiRRwb2bZ3gR1WtyXyk_11_zyc839', openId: 'ocKZ5uAXtSiRRwb2bZ3gR1WtyXyk_3', wxToken: 'zyc839', groupId: 'tvm_pointMall' },
    {_id:'ocKZ5uAXtSiRRwb2bZ3gR1WtyXyk_4_zyc839', openId: 'ocKZ5uAXtSiRRwb2bZ3gR1WtyXyk_4', wxToken: 'zyc839', groupId: 'tvm_pointMall' },
    {_id:'ocKZ5uAXtSiRRwb2bZ3gR1WtyXyk_5_zyc839', openId: 'ocKZ5uAXtSiRRwb2bZ3gR1WtyXyk_5', wxToken: 'zyc839', groupId: 'tvm_pointMall' },
    {_id:'ocKZ5uAXtSiRRwb2bZ3gR1WtyXyk_6_zyc839', openId: 'ocKZ5uAXtSiRRwb2bZ3gR1WtyXyk_6', wxToken: 'zyc839', groupId: 'tvm_pointMall' },
    {_id:'ocKZ5uAXtSiRRwb2bZ3gR1WtyXyk_7_zyc839', openId: 'ocKZ5uAXtSiRRwb2bZ3gR1WtyXyk_7', wxToken: 'zyc839', groupId: 'tvm_pointMall' },
    {_id:'ocKZ5uAXtSiRRwb2bZ3gR1WtyXyk_8_zyc839', openId: 'ocKZ5uAXtSiRRwb2bZ3gR1WtyXyk_8', wxToken: 'zyc839', groupId: 'tvm_pointMall' }
];

GroupUsers.create(array, function (err, jellybean, snickers) {
    if (err) {
        console.log(err);
    }
    console.log('jellybean',jellybean);
    console.log('snickers',snickers);
});

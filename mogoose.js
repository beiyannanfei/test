/**
 * Created by wyq on 2015/8/20.
 */
var mongoose = require('mongoose');

var destConf = "mongodb://point:point@10.10.42.25:27017/pointMall_test";    //目标数据库

var opts = {server: { poolSize: 20 }, mongos: true, replset: {strategy: 'ping', rs_name: 'dest'}};

var db = "";
db = mongoose.createConnection(destConf, opts, function (err, results) {
    if (!!err) {
        return console.error("err: %j, results: %j", err, results);
    }
    console.log("createConnection success");
    db.once('open', function () {
        console.log("db open");
    });

    var PersonSchema = new mongoose.Schema({
        name: String,   //定义一个属性name，类型为String
        age: Number,
        address: String
    });

    var PersonModel = db.model('test', PersonSchema);

    var personEntity = new PersonModel({name: 'Krouky', age: 20, address: "北京"});

    personEntity.save(function (err, res) {
        console.log("save err: %j, res: %j", err, res);
    });
});


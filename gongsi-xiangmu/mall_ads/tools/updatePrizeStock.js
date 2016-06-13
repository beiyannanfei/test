/**
 * Created by chenjie on 2015/7/12.
 */

var async = require('async')
var mShoppingCard = require('../routes/shoppingCard.js')
var dbUtils = require('../mongoSkin/mongoUtils.js')
var prizeCollection = new dbUtils('prize')

prizeCollection.find({type: {$in: [1, 3, 101]}}, {_id: 1}, function(err, arr){
    async.eachSeries(arr, function(o, done){
        console.log(o)
        mShoppingCard.saveCount(o._id.toString(), 100000, function(){
            console.log(arguments)
            done();
        })
    }, function(err){
        console.log('success');
    })
})
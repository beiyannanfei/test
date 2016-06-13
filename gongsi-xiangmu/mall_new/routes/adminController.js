/**
 * Created by chenjie on 2015/11/26.
 */


exports.enterIframe = function(req,res){
    var page = req.param('page')
    res.render('frame', {page: page})
}
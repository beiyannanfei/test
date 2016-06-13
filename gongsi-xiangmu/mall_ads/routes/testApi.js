var express      = require('express');
var app          = express();
var fs=require('fs');
var _=require('underscore');
function render(fileName,res){
    var fs=require('fs');
    var str='',header='public/tpl/header.html',footer='public/tpl/footer.html';
    fs.readFile(header,'utf-8',function(err,data){
        str+=data;
        fs.readFile('public/tpl/'+fileName+'.html','utf-8',function(err,data){
            str+=data;
            fs.readFile(footer,'utf-8',function(err,data){
                str+=data;
                res.write(str);
                res.end();
            })
        })
    })
}
app.get('/',function(req,res){
    render('test',res);
})
app.get('/static/:name',function(req,res){
    render(req.params.name,res);
})
_.each('addRedPkg addRedPkgActivity redPkgActivityList redPkgAwardResult redPkgList'.split(' '),function(v){
    app.get('/'+v,function(req,res){
        render(v,res);
    })
})
app.get('/ajaxTest',function(req,res){
    console.log('res is:',res);
    res.send({
        status:'OK',
        msg:'success'
    });
})
app.get('/ajaxTest1',function(req,res){
    res.send([]);
})

app.get('/test1',function(req,res){
    console.log('req.params');
    res.send('1');
})
app.get('/test2',function(req,res){
    res.send('2');
})
app.get('/test3',function(req,res){
    res.send('3');
})
app.get('/test4',function(req,res){
    res.send('4');
})
app.get('/test5',function(req,res){
    res.send('5');
})

var data=[];
for(var i=1;i<=1055;i++){
    data.push({
        id:'id'+i,
        name:'name'+i
    })
};
function sendData(page,pageSize,res){
    return res.send({
        total:1055,
        data: _.clone(data).splice((page-1)*pageSize,pageSize)
    });
}

app.get('/fetchData',function(req,res){
    sendData(req.query.page,req.query.pageSize,res);
})





app.post('/postTest',function(req,res){
    console.log('req is:',req);
})

module.exports=app;
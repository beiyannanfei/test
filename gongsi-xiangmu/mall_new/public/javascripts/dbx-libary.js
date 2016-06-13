Date.prototype.format = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = this.getDate().toString();
    var hh=this.getHours().toString();
    var ii=this.getMinutes().toString();
    var ss=this.getSeconds().toString();
    return yyyy+'-' + (mm[1]?mm:"0"+mm[0])+'-' + (dd[1]?dd:"0"+dd[0])+' '+ (hh[1]?hh:"0"+hh[0])+':'+ (ii[1]?ii:"0"+ii[0])+':'+ (ss[1]?ss:"0"+ss[0]);
};

(function($){
    $.extend({
        repeatObj:function(obj,count){
            if(!_.isObject(obj)){
                return obj;
            }
            var arr=[];
            for(var i=0;i<count;i++){
                arr.push(obj);
            }
            return arr;
        },
        showLink:function(id,str){
            return prompt(str,id);
        },
        to:function(href){
            location.href=href;
        },
        toggleArrayElementByCheckbox:function(item,arr){
            var index=arr.indexOf(item);
            if(index===-1){
                arr.push(item);
            }else{
                arr.splice(index,1);
            }
        },
        getFormDataByMap:function(formData,map){
            var res={};
            for(var i in map){

                res[map[i]]=formData[i];
            }
            return res;
        }
    });
    $.fn.extend({
        locker:function(){
            var $this=$(this);
            return {
                isLocked:_.isUndefined($this.data('isLocked'))?false:($this.data('isLocked')),
                lock:function(){
                    $this.data('isLocked',true);
                    $this.trigger('lock');
                },
                unlock:function(){
                    $this.data('isLocked',false);
                    $this.trigger('unlock');
                    $this.off('lock');
                    $this.off('unlock');
                }
            }
        }
    })
})(jQuery);


(function(){
    var app=angular.module('baseModule',[
        //'ui.bootstrap'
    ]);
    app.directive('back',function(){
        return {
            restrict:'EA',
            template:'<a href="javascript:history.back();" class="btn  btn-primary dbx-back" style="margin-top:10px;display:block;width:52px;margin-left:10px;">返回</a>'
            //,
            //link:function($scope,$element,$attr){
            //    jQuery($element).addClass('inherit-layout');
            //}
        }
    })
    app.factory('baseService',['$http','$rootScope','$q',function($http,$rootScope,$q){
        var o=window.aaa={
            urlConfig:{
                addRedPkg:'/yao/add-wxred.html',//添加红包
                redPkgList:'/yao/wxred-list.html',//红包列表
                redPkgActivityList:'/yao/wxred-lottery-list.html',//红包抽奖活动列表
                addRedPkgActivity:'/yao/add-wxred-lottery.html',//添加红包抽奖活动
                redPkgAwardResult:'/test/redPkgAwardResult'//红包领取结果列表
            },
            ajaxConfig:{
                queryRedPkg:'/yao/wxred/list',//查询红包
                queryRedPkgActivity:'/yao/wxredLottery/list',//查询红包活动
                delRedPkg:'/test/ajaxTest',//删除红包
                delRedPkgActivity:'/test/ajaxTest',//删除红包活动
                saveNewRedPkg:'/yao/wxred',//保存新红包
                saveUpdatedRedPkg:'/test/ajaxTest',//保存当前更新红包
                saveNewRedPkgActivity:'/yao/wxredLottery',//保存新红包活动
                saveUpdatedRedPkgActivity:'/test/ajaxTest',//保存当前更新红包活动
                testUrl:'/test/ajaxTest'
            },
            isAjaXSuccess:function(data){
                //return data.status==='OK';
                return true;
            },
            lenRule:function(name,minL,maxL){//兼容validate.js的长度检测
                minL=minL||1;
                maxL=maxL||8;
                return [
                    [
                        function(val){
                            var len=val.length;
                            return (len>=minL)&&(len<=maxL);
                        },
                        name+'格式错误,长度应在'+minL+'到'+maxL+'之间'
                    ],
                    [
                        function(val){
                            return new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9])*$").test(val);
                        },
                        name+'格式错误，请不要包含特殊字符'
                    ]
                ];
            },
            http:function(url,cbY,method,data,cbN){
                var def=$q.defer();
                def.promise.then(function(){
                    console.log('promise then');
                })
                var cfg={
                    method:method||'get',
                    url:url||(o.ajaxConfig.testUrl),
                    data:data||{}
                };
                var handleFailure=function(){
                    if(_.isUndefined(cbN)){
                        swal('系统繁忙，请稍后再试');
                    }else{
                        cbN(data);
                    }
                    def.resolve();
                }
                console.log('cfg is:',cfg);
                $http(cfg)
                    .success(function(data){
                    if(o.isAjaXSuccess(data)){
                        cbY(data);
                    }else{
                        handleFailure();

                    }
                }).error(function(data){
                    handleFailure();
                });
                return def.promise;
            }
        };
        return o;
    }]);
})();
(function($){
    'use strict';
    angular
        .module('main',[
            'base'
        ])
        .service('mainService',['$http','$rootScope','$q','baseService','CONFIG',function($http,$rootScope,$q,baseService,CONFIG){

            var bs=baseService;

            var urlParams=bs.parseUrl();


            var transSingleAwardsList=function(inputData){
                var result=inputData;
                result.visible=true;
                return result;
            }
            var transArrayCollection=function(inputData,transFn){
                var arr=[];
                for(var i=0,len=inputData.length;i<len;i++){
                    arr.push(transFn(inputData[i]));
                }
                return arr;
            }
            var o={
                urlParams:urlParams,
                modifiedItemId: bs.isNull(urlParams.id)?null:(urlParams.id),
                isUpdatePage:bs.isNull(urlParams.id)?false:true,
                behaviors:{
                    data:[
                        {
                            name:'答题',
                            items:[
                                {
                                    q:'1+1=?',
                                    a:['1','2']
                                },
                                {
                                    q:'11+11=?',
                                    a:['11','22']
                                }
                            ]
                        },
                        {
                            name:'点赞',
                            items:[
                                {
                                    q:'_1+_1=?',
                                    a:['_1','_2']
                                },
                                {
                                    q:'_11+_11=?',
                                    a:['_11','_22']
                                }
                            ]
                        }
                    ],
                    s1_data:{

                    },
                    s2_data:{

                    },
                    s3_data:{

                    }
                },
                data:[],
                awardsList:null,
                awardsListQ:$q.defer(),
                unPrizedRate:0,//为中间的概率
                initData:function(){

                    $rootScope.$emit('pageLoading');
                    $http.get(CONFIG.AJAX_URL.AWARDS_LIST)
                        .then(function(e){
                            var data= e.data;
                            console.log('data is:',data);
                            o.awardsList=transArrayCollection(data.data,transSingleAwardsList);
                            o.awardsListQ.resolve(data);
                        })
                }
            };
            o.initData();
            return o;
        }])
        .controller('mainController',['$scope','$http','$rootScope','$q','mainService','baseService','CONFIG','tvmService',function($scope,$http,$rootScope,$q,mainService,baseService,CONFIG,tvmService){
            var ms=$scope.ms=mainService,
                bs=$scope.bs=baseService,
                cfg=$scope.CONFIG=CONFIG;
            $scope.tvmService=tvmService;
            var default_unprize_pic=CONFIG.UNPRIZE_PIC;//未中奖默认图片
            //$scope.jq=$;

            //bs.multiHttp([bs.tpl({
            //    tpl:CONFIG.AJAX_URL.GET_CRAZY_PRIZE_INFO,
            //    data:ms.urlParams
            //}),CONFIG.AJAX_URL.AWARDS_LIST,'/test/test1','/test/test2','/test/test3','/test/test4','/test/test5'],function(res1,res2,res3,res4,res5){
            //    console.log('-----args is-------:',arguments);
            //})


            $scope.s1_change=function(index1){

            }
            $scope.s2_change=function(index1,index2){

            }
            $scope.s3_change=function(index1,index3){

            }
            $scope.isModalWinVisible=false;
            //$scope.currentModalWinEmitterIndex=null;
            function initTmp(){
                $scope.tmpAwardIds=[];
                $scope.tmpAwardIndexex=[];
                $scope.tmpAwards=[];
            }

            ms.awardsListQ.promise.then(function(){
                if(ms.isUpdatePage){
                    $http.get(bs.tpl({
                        tpl:CONFIG.AJAX_URL.GET_CRAZY_PRIZE_INFO,
                        data:ms.urlParams
                    }))
                        .then(function(e){
                            $rootScope.$emit('pageLoaded');
                            console.log('e is------------:',e);
                            var res= e.data;
                            var exist_items_sorted_by_id={};
                            if(res.status==='success'){
                                var data=res.data.prizes;
                                for(var i in data){

                                    var item=data[i];
                                    console.log('-------item is------：',item);
                                    if(typeof(item.flag)!=='undefined'&&item.flag===1){
                                        CONFIG.UNPRIZE_PIC=item.pic;
                                        ms.unPrizedRate=Math.round(item.p*100);
                                    }else{

                                        //var exist_ids=[];
                                        //for(var i in data){
                                            $scope.tmpAwardIds.push(data[i]._id);
                                            exist_items_sorted_by_id[data[i]._id]=data[i];
                                        //}



                                    }
                                }
                                console.log('--------exist_items_sorted_by_id-------:',exist_items_sorted_by_id,ms.awardsList)


                                for(var i in exist_items_sorted_by_id){
                                    angular.forEach(ms.awardsList,function(v,k){
                                        if(v._id===i){
                                            $scope.tmpAwardIndexex.push(k);
                                            $scope.tmpAwards.push($.extend(v,{
                                                p:Math.round(exist_items_sorted_by_id[i].p*100),//p表示概率
                                                total_num:exist_items_sorted_by_id[i].count,
                                                rate:exist_items_sorted_by_id[i].rate
                                                //,
                                                //award_grade:exist_items_sorted_by_id[i].rate,
                                                //total_num:exist_items_sorted_by_id[i].count
                                            }));

                                        }
                                    })
                                }
                                applyTmp();
                                console.log('ms data is:',ms.data);

                                //
                                //

                                //


                            }else{
                                jQuery.warn(res);
                            }
                        })
                }else{
                    $rootScope.$emit('pageLoaded');
                }
            })





            function applyTmp(){
                console.log('-----------apply tmp调试信息',$scope.tmpAwardIds,$scope.tmpAwardIndexex,$scope.tmpAwards)


                //if(!$scope.isSingleSelectMode){

                var tmpArr= _.clone(ms.data);
                    for(var i in $scope.tmpAwards){
                        var item=$scope.tmpAwards[i];
                        item.visible=false;
                        console.log('item is:',item);
                        var obj={
                            id:item._id,
                            logo_src:item.pic,
                            award_name:item.name,
                            rate:item.rate||'',
                            //visible:true,
                            //award_type:['实物奖品','第三方消费码','流量'][parseInt(item.type,10)],
                            award_type:{
                                '1':'实物奖品',
                                '2':'第三方电子券',
                                '3':'第三方卡券(URL)',
                                '101':'微信卡券优惠券',
                                '102':'微信红包'
                            }[''+item.type],
                            //award_grade:'',
                            p:bs.isExist(item,'p')?(item.p):'',//p表示概率
                            total_num:bs.isExist(item,'total_num')?(item.total_num):'',
                            wx_red_proty:item
                            //,
                            //total_count:''
                        }
                        tmpArr.push(obj);
                    }


                console.log('-----$scope.lastModifiedItemIndex-----------',$scope.lastModifiedItemIndex);
                //var _data= _.clone(tmpArr);
                if($scope.isSingleSelectMode){

                    var index=$scope.lastModifiedItemIndex,len=tmpArr.length;

                    var award_id=$scope.tmpAwards[0]._id;
                    var list_id=tmpArr[index].id;
                    for(var i in ms.awardsList){
                        var item=ms.awardsList[i];
                        if(item._id===list_id){
                            item.visible=true;
                        }
                        if(item._id===award_id){
                            item.visible=false;
                        }
                    }
                    //ms.awardsList[]
                    tmpArr[index]=tmpArr[len-1];
                    tmpArr.splice(len-1,1);
                }

                ms.data=tmpArr;



                    //var count = 0;
                    //angular.forEach($scope.tmpAwardIndexex,function(v,i){
                    //    var willDeleteIndex=v-count;
                    //    ms.awardsList.splice(willDeleteIndex,1);
                    //    count+=1;
                    //});

                    console.log('ms.data is :',ms.data);
                //}




                $scope.cancelChooseAwards();


                //ms.data[currentModalWinEmitterIndex].prize_ids=$scope.tmpAwardIds;
            }
            $scope.openModalWin=function(isSingleSelectMode,index){
                //var bool=isSingleSelectMode?true:false;
                $scope.isModalWinVisible=true;
                $scope.isSingleSelectMode=isSingleSelectMode?true:false;
                $scope.lastModifiedItemIndex=index;
            }
            $scope.cancelChooseAwards=function(){
                initTmp();
                $scope.isModalWinVisible=false;
                $scope.lastModifiedItemIndex=null;
                $('.click').removeClass('click');
            }
            $scope.saveAwards=function(){
                applyTmp();

            }
            $scope.lastModifiedItemIndex=null;
            $scope.toggleAwardId=function(id,index,e){
                console.log("---------isSingleSelectMode",$scope.isSingleSelectMode);
                var $obj=$(e.target);
                if(!$scope.isSingleSelectMode){

                    bs.toggleArrayElement(id,$scope.tmpAwardIds);
                    bs.toggleArrayElement(index,$scope.tmpAwardIndexex);
                    var arr=[];
                    for(var i in $scope.tmpAwardIndexex){
                        arr.push(ms.awardsList[$scope.tmpAwardIndexex[i]]);
                    }
                    $scope.tmpAwards=arr;
                    $obj.toggleClass('click');
                }else{

                    $scope.tmpAwardIds=new Array(id);
                    $scope.tmpAwardIndexex=[index];
                    $scope.tmpAwards=new Array(ms.awardsList[index]);
                    $('.click').removeClass('click');
                    $obj.addClass('click');
                }




            }
            $scope.spliceData=function(index){
                var id=ms.data[index].id;
                for(var i in ms.awardsList){
                    var item=ms.awardsList[i];
                    if(item._id===id){
                        item.visible=true;
                    }
                }
                ms.data.splice(index,1);
                //console.log('index is:',index);
                //if(typeof(ms.data[index].wx_red_proty)!=='undefined'){
                //    ms.awardsList.push(ms.data[index].wx_red_proty);
                //}

                //setTimeout(function(){
                //    ms.data.splice(index,1);
                //    $scope.$apply();
                //});
            }
            $scope.s1Change=function(){
                ms.behaviors.s2_data={};
            };
            var $selects=$('.behaviors'),$s1=$selects.first(),$s2=$selects.eq(1),$s3=$selects.last();
            $scope.$watch(function(){
                return ms.behaviors.s1_data;
            },function(){
                setTimeout(function(){
                    $s1.children().first().html()===''&&$s1.children().first().html('请选择');
                    $s2.children().first().html()===''&&$s2.children().first().html('请选择');
                    $s3.children().first().html()===''&&$s3.children().first().html('请选择');
                })
            })
            $scope.$watch(function(){
                return ms.behaviors.s2_data;
            },function(){
                setTimeout(function(){
                    $s2.children().first().html()===''&&$s2.children().first().html('请选择');
                    $s3.children().first().html()===''&&$s3.children().first().html('请选择');
                })
            })
            $scope.$watch(function(){
                return ms.behaviors.s3_data;
            },function(){
                setTimeout(function(){
                    $s3.children().first().html()===''&&$s3.children().first().html('请选择');
                })
            })
            require(['crazy-lottery-validate-rule','V'],function(rule,V){
                //console.log('rule is:',rule,V);
                $scope.submit=function(e){

                    var locker=bs.locker($(e.target));
                    if(locker.isLocked){
                        return false;
                    }
                    locker.lock();
                    var isValid=true;

                    //验证开始
                    var err=[];
                    $.each(ms.data,function(k,data){

                        var isRight=true;
                        V(rule,data,function(result){
                            if(result.status==='ERROR'){
                                isValid=false;
                                err=result.err;
                                err.unshift('第'+(k+1)+'个表单项有误:');
                                //layer.alert('第'+k+'个表单项有误:<br>'+result.err.join('<br>'));
                                isRight=false;
                            }
                        });
                        if(!isRight){
                            return false;
                        }
                    });
                    if(isValid){
                        var pSum=0;//计算中间概率的总数
                        var arr=[];
                        for(var i in ms.data){
                            pSum+=parseInt(ms.data[i].p,10);
                            arr.push(parseInt(ms.data[i].rate,10));
                        }
                        pSum+=parseInt(ms.unPrizedRate);
                        if(default_unprize_pic===CONFIG.UNPRIZE_PIC){
                            err.push('必须选择一个未中奖的图片');
                        }
                        if(pSum!==100){
                            err.push('所有中奖概率和不中奖概率之和必须等于100');
                        }
                        if(!bs.isSequentFromNo1(arr)){
                            err.push('奖品等级必须从第一名开始依次后推');
                        }

                    }

                    //验证结束


                    if(err.length===0){

                        console.log('posting');
                        var data=[];
                        for(var i in ms.data){
                            var item=ms.data[i];
                            data.push({
                                id:item.id,
                                p:item.p/100,
                                count:item.total_num,
                                rate:item.rate
                            })
                        }
                        data.push({
                            flag:1,
                            p:ms.unPrizedRate/100,
                            pic:CONFIG.UNPRIZE_PIC
                        })
                        var post_url=CONFIG.AJAX_URL.CREATE_CRAZY_LOTTERY;
                        if(ms.isUpdatePage){
                            post_url=bs.tpl({
                                tpl:CONFIG.AJAX_URL.UPDATE_CRAZY_PRIZE,
                                data:ms.urlParams
                        });
                        }
                        //var post_url=ms.isUpdatePage?(bs.tpl({
                        //    tpl:CONFIG.AJAX_URL.UPDATE_CRAZY_PRIZE,
                        //    data.ms.urlParams
                        //})):(CONFIG.AJAX_URL.CREATE_CRAZY_LOTTERY)
                        $http.post(post_url,{
                            prizes:data
                        })
                            .then(function(e){
                                try{
                                    document.domain='tvm.cn';
                                }
                                catch(err){
                                    console.warn('发生了一个错误:',err);
                                }
                                finally{
                                    var data= e.data;
                                    console.log('data is:',data);
                                    if(data.status==='success'){

                                        var id;
                                        if(ms.isUpdatePage){
                                            id=ms.urlParams.id;
                                        }else{
                                            id=data.data._id;
                                        }
                                        jQuery.success('操作成功',function(){
                                            locker.unlock();
                                            if(typeof(parent.ADListener)!=='undefined'){

                                                parent.ADListener.lotteryStatus({status: true, id:id});
                                            }
                                        });

                                    }else{
                                        if(typeof(parent.ADListener)!=='undefined'){
                                            parent.ADListener.lotteryStatus({status: false, msg: "失败"});
                                        }
                                        locker.unlock();

                                        jQuery.warn(data);
                                    }
                                }
                            })

                        //layer.alert('操作成功');
                    }else{
                        jQuery.warn(err.join('\n'));
                        locker.unlock();
                    }
                }
            })

            initTmp();

            console.log('load');
            //$scope.pushData=function(){
            //
            //    ms.data.push(ms.dataProto);
            //}
            //$scope.spliceData=function(index){
            //
            //}



        }])

})(jQuery);
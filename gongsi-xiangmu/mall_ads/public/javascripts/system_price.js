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
                needPreferenceConfig:'1',
                lotteryTypeConfig:[{type:'p',name:'%'},{type:'c',name:'人'}],
                lotteryMoneyTypeConfig:[{type:'p',name:'%'},{type:'c',name:'元'}],
                preferenceConfig:{
                    average:'',
                    max:'',
                    send_name:'',
                    info:[
                        {
                            rate:1,
                            name:"红包1",
                            percent:'', //总金额百分比
                            count:'',
                            type:'p',
                            moneyType:'p',
                            oType:{"type":"p","name":"%"},
                            redMax:''
                        }
                        //,
                        //{
                        //
                        //    rate:2,
                        //    name:"红包2",
                        //    percent:0, //总金额百分比
                        //    count:0
                        //}
                    ],
                    prizes:[

                    ]
                },
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
            //$scope.jq=$;
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
            //console.log('ms.awardsListQ',ms.awardsListQ)
            //awardsList
            ms.awardsListQ.promise.then(function(){
                if(ms.isUpdatePage){
                    $http.get(bs.tpl({
                        tpl:CONFIG.AJAX_URL.GET_SYS_PRIZE_INFO,
                        data:ms.urlParams
                    }))
                        .then(function(e){
                            $rootScope.$emit('pageLoaded');
                            console.log('e is------------:',e);
                            var res= e.data;
                            if(res.status==='success'){

                                //needPreferenceConfig:'0',
                                //    preferenceConfig

                                //ms.needPreferenceConfig=''+res.data.type;

                                console.log('---------',{
                                    needPreferenceConfig:ms.needPreferenceConfig

                                });

                                var data=res.data.money.prizes;
                                ms.preferenceConfig.info=res.data.money.info;
                                ms.preferenceConfig.average=res.data.money.average;
                                ms.preferenceConfig.send_name=res.data.money.send_name;
                                ms.preferenceConfig.max=res.data.money.max;
                                //setTimeout(function(){
                                //    $.each(ms.preferenceConfig.info,function(k,v){
                                //        if(v.type==='p'){
                                //
                                //        }
                                //    })
                                //})
                                console.log('-------------data----------:',data,res);


                                var exist_items_sorted_by_id={};
                                //var exist_ids=[];
                                console.log('---------data is：-----：;',data);
                                for(var i in data){
                                    //alert(1)
                                    $scope.tmpAwardIds.push(data[i].id);
                                    exist_items_sorted_by_id[data[i].id]=data[i];
                                }


                                console.log('--------exist_items_sorted_by_id-------:',exist_items_sorted_by_id,ms.awardsList)


                                for(var i in exist_items_sorted_by_id){
                                    angular.forEach(ms.awardsList,function(v,k){
                                        //alert(464)
                                        if(v._id===i){
                                            $scope.tmpAwardIndexex.push(k);
                                            $scope.tmpAwards.push($.extend(v,{
                                                award_grade:exist_items_sorted_by_id[i].rate,
                                                total_num:exist_items_sorted_by_id[i].count
                                            }));

                                        }
                                    })
                                }

                                applyTmp();
                                setTimeout(function(){
                                    console.log("----------sdf-sdfsdf-sdfd-sdfds",ms.preferenceConfig)
                                    if(ms.preferenceConfig.info.length!==0){
                                        $scope.isPerferenceConfigShow=true;
                                    }
                                    if(ms.data.length!==0){
                                        $scope.isPerferenceConfig1Show=true;
                                    }
                                    $scope.$apply();
                                    //$scope.isPerferenceConfigShow=ms.isUpdatePage?false:false;
                                    //$scope.isPerferenceConfig1Show=ms.isUpdatePage?false:false;
                                })


                                //console.log('-------type:',res.data.type,res.data.type===1,res.data.type===0)
                                //if(res.data.prizes || res.data.type===0){
                                //    var data=res.data.prizes;
                                //    console.log('-------------data----------:',data);
                                //
                                //
                                //    var exist_items_sorted_by_id=[];
                                //    //var exist_ids=[];
                                //    for(var i in data){
                                //        $scope.tmpAwardIds.push(data[i].id);
                                //        exist_items_sorted_by_id[data[i].id]=data[i];
                                //    }
                                //
                                //
                                //    console.log('--------exist_items_sorted_by_id-------:',exist_items_sorted_by_id,ms.awardsList)
                                //
                                //
                                //    for(var i in exist_items_sorted_by_id){
                                //        angular.forEach(ms.awardsList,function(v,k){
                                //            if(v._id===i){
                                //                $scope.tmpAwardIndexex.push(k);
                                //                $scope.tmpAwards.push($.extend(v,{
                                //                    award_grade:exist_items_sorted_by_id[i].rate,
                                //                    total_num:exist_items_sorted_by_id[i].count
                                //                }));
                                //
                                //            }
                                //        })
                                //    }
                                //
                                //
                                //
                                //
                                //
                                //    applyTmp();
                                //}else if(res.data.money || res.data.type===1){
                                //    ms.preferenceConfig=res.data.money;
                                //}




                            }else{

                                jQuery.warn(res);
                            }
                        })
                }else{
                    $rootScope.$emit('pageLoaded');
                }
            })

            function applyTmp(){
                //additional_params=additional_params||{};
                console.log('last -------:',$scope.lastNeedPreferenceConfig);


                var tmpArr= _.clone(ms.data);

                for(var i in $scope.tmpAwards){
                    var item=$scope.tmpAwards[i];
                    item.visible=false;
                    console.log('item is:',item);
                    var obj={
                        id:typeof(item._id)==='undefined'?(item.id):(item._id),
                        logo_src:item.pic,
                        award_name:item.name,
                        //award_type:['实物奖品','第三方消费码','流量'][parseInt(item.type,10)],
                        award_type:{
                            '1':'实物奖品',
                            '2':'第三方电子券',
                            '3':'第三方卡券(URL)',
                            '101':'微信卡券优惠券',
                            '102':'微信红包'
                        }[''+item.type],
                        award_grade:bs.isExist(item,'award_grade')?item.award_grade:'',
                        total_num:bs.isExist(item,'total_num')?item.total_num:'',
                        wx_red_proty:item
                        //,
                        //total_count:''
                    }
                    //ms.data.push(obj);
                    tmpArr.push(obj);



                    //if($scope.lastNeedPreferenceConfig==='1'){
                    //    for(var i in $scope.tmpAwards){
                    //        var item=$scope.tmpAwards[i];
                    //        console.log('item is:',item);
                    //        var obj={
                    //
                    //            id:(item.prizes&&item.prizes.id)?(item.prizes.id):(typeof(item._id)==='undefined'?(item.id):(item._id)),
                    //            rate:(item.prizes&&item.prizes.rate)?(item.prizes.rate):(getPreferenceConfigLen()+1),
                    //            count:(bs.isExist(item,'prizes.rate'))?(item.prizes.count):100000,
                    //            //count:(item.prizes&&item.prizes.count)?(item.prizes.count):100000,
                    //            name:(item.name||'奖品')+(getPreferenceConfigLen()+1),
                    //            wx_red_proty:item
                    //
                    //
                    //
                    //            //id:typeof(item._id)==='undefined'?(item.id):(item._id),
                    //            //logo_src:item.pic,
                    //            //award_name:item.name,
                    //            ////award_type:['实物奖品','第三方消费码','流量'][parseInt(item.type,10)],
                    //            //award_type:{
                    //            //    '1':'实物奖品',
                    //            //    '2':'第三方电子券',
                    //            //    '3':'流量',
                    //            //    '101':'微信卡券优惠券',
                    //            //    '102':'微信红包'
                    //            //}[''+item.type],
                    //            //award_grade:item.award_grade||'',
                    //            //total_num:item.total_num||'',
                    //            //wx_red_proty:item
                    //            ////,
                    //            ////total_count:''
                    //        }
                    //        console.log('----ms.preferenceConfig-----:',ms.preferenceConfig);
                    //        ms.preferenceConfig.prizes.push(obj);
                    //    }
                    //
                    //}else{
                    //    var tmpArr= _.clone(ms.data);
                    //
                    //    for(var i in $scope.tmpAwards){
                    //        var item=$scope.tmpAwards[i];
                    //        console.log('item is:',item);
                    //        var obj={
                    //            id:typeof(item._id)==='undefined'?(item.id):(item._id),
                    //            logo_src:item.pic,
                    //            award_name:item.name,
                    //            //award_type:['实物奖品','第三方消费码','流量'][parseInt(item.type,10)],
                    //            award_type:{
                    //                '1':'实物奖品',
                    //                '2':'第三方电子券',
                    //                '3':'流量',
                    //                '101':'微信卡券优惠券',
                    //                '102':'微信红包'
                    //            }[''+item.type],
                    //            award_grade:bs.isExist(item,'award_grade')?item.award_grade:'',
                    //            total_num:bs.isExist(item,'total_num')?item.total_num:'',
                    //            wx_red_proty:item
                    //            //,
                    //            //total_count:''
                    //        }
                    //        //ms.data.push(obj);
                    //        tmpArr.push(obj);
                    //    }

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





                        //var tmpArr_len=tmpArr.length;
                        ////if(tmpArr_len>1){
                        //    var tmp=tmpArr[$scope.lastModifiedItemIndex];
                        //    tmpArr[$scope.lastModifiedItemIndex]=tmpArr[tmpArr_len-1];
                        //    tmpArr[tmpArr_len-1]=tmp;
                        ////}
                        //$scope.spliceData(tmpArr_len-1);
                    }
                    ms.data=tmpArr;
                }



                console.log('---------$scope.tmpAwards-------------',$scope.tmpAwards);



                //var count = 0;
                //angular.forEach($scope.tmpAwardIndexex,function(v,i){
                //    var willDeleteIndex=v-count;
                //    ms.awardsList.splice(willDeleteIndex,1);
                //    count+=1;
                //});
                //
                //console.log('ms.data is :',ms.data);

                $scope.cancelChooseAwards();


                //ms.data[currentModalWinEmitterIndex].prize_ids=$scope.tmpAwardIds;
            }
            $scope.openModalWin=function(isSingleSelectMode,index){
                $scope.isModalWinVisible=true;
                $scope.lastNeedPreferenceConfig=ms.needPreferenceConfig;
                $scope.isSingleSelectMode=isSingleSelectMode?true:false;
                $scope.lastModifiedItemIndex=index;

            }
            $scope.cancelChooseAwards=function(){
                initTmp();
                $scope.isModalWinVisible=false;
                $('.click').removeClass('click');
            }
            $scope.saveAwards=function(){
                applyTmp();
                $scope.isPerferenceConfig1Show=true;

            }
            $scope.toggleAwardId=function(id,index,e){
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
                    console.log('arr is:',arr,$scope.tmpAwardIds,$scope.tmpAwardIndexex);
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



                //console.log(ms.awardsList);
                //ms.awardsList.push(ms.data[index].wx_red_proty);
                //console.log(ms.awardsList);
                //setTimeout(function(){
                //    ms.data.splice(index,1);
                //    $scope.$apply();
                //})

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
            function getPreferenceConfigLen(){
                return (ms.preferenceConfig.info?(ms.preferenceConfig.info.length):0)+(ms.preferenceConfig.prizes?(ms.preferenceConfig.prizes.length):0);
            }
            //添加红包类型的奖品
            $scope.addAward=function(){
                var info=ms.preferenceConfig.info||[],len=getPreferenceConfigLen();
                info.push({
                    rate:len+1,
                    name:'红包'+(len+1),
                    percent:'', //总金额百分比
                    count:'',
                    type:'p',
                    moneyType:'p',
                    oType:{"type":"p","name":"%"},
                    redMax:''
                })
            }
            //添加实物类型的奖品
            //$scope.addAward1=function(){
            //    var prizes=ms.preferenceConfig.prizes||[],len=getPreferenceConfigLen();
            //    prizes.push({
            //        rate:len+1,
            //        name:'奖品'+(len+1),
            //        percent:0, //总金额百分比
            //        count:0
            //    })
            //}
            $scope.deleteAward=function(index,str){
                var obj=ms.preferenceConfig[str];
                var rate=parseInt(obj[index].rate,10);


                function loop(str){
                    var obj=[],lastRate=rate;
                    for(var i in ms.preferenceConfig[str]){
                        var item=ms.preferenceConfig[str][i],tmpRate=parseInt(item.rate);
                        if(tmpRate<rate){

                            if(tmpRate<lastRate){
                                obj.unshift(item);
                            }else{
                                obj.push(item);
                            }

                            lastRate=tmpRate;
                        }else{
                            if(str==='prizes'){
                                //console.log("obj and i:",obj,i);
                                ms.awardsList.push(item.wx_red_proty);
                            }
                        }
                    }
                    console.log('obj is:',obj);
                    ms.preferenceConfig[str]=obj;
                }
                var arr=['info','prizes'];
                for(var i in arr){
                    loop(arr[i]);
                }
            }

            require(['system-price-validate-rule','V'],function(rule,V){
                //console.log('rule is:',rule,V);
                $scope.submit=function(e){

                    var locker=bs.locker($(e.target));
                    if(locker.isLocked){
                        return false;
                    }
                    locker.lock();


                    var isValid=true;
                    var err=[];
                    if(ms.needPreferenceConfig==='0'){
//验证开始
//                        $.each(ms.data,function(k,data){
//
//                            var isRight=true;
//                            V(rule,data,function(result){
//                                if(result.status==='ERROR'){
//                                    isValid=false;
//                                    err=result.err;
//                                    err.unshift('第'+(k+1)+'个表单项有误:');
//                                    //layer.alert('第'+k+'个表单项有误:<br>'+result.err.join('<br>'));
//                                    isRight=false;
//                                }
//                            });
//                            if(!isRight){
//                                return false;
//                            }
//                        })
//                        if(isValid){
//
//                            var arr=[];
//                            for(var i in ms.data){
//                                arr.push(parseInt(ms.data[i].award_grade,10));
//                            }
//                            if(bs.isRepeat(arr)){
//                                err.push('奖品等级中不能有重复的元素');
//                            }else{
//                                bs.bubbleSort(arr);
//                                console.log('arr is:',arr);
//                                var str='',rightStr='';
//                                for(var i= 0,len=arr.length;i<len;i++){
//                                    str+=arr[i];
//                                    rightStr+=(i+1);
//                                }
//                                if(str!==rightStr){
//                                    err.push('奖品等级必须从第一名开始依次后推');
//                                }
//                            }
//
//                        }

                        //验证结束
                    }else{

                        var arr=[];
                        for(var i in ms.data){
                            var item=ms.data[i];
                            arr.push({
                                rate:item.award_grade,
                                count:item.total_num,
                                name:item.award_name,
                                wx_red_proty:item,
                                id:item.id
                            })

                        }
                        ms.preferenceConfig.prizes=arr;


                        console.log('sdfsdfms.preferenceConfig:',ms.preferenceConfig);
                        //这个arr用于分辨奖品等级
                        var arr=[];
                        //console.log('-----$scope.isPerferenceConfigShow---------:',$scope.isPerferenceConfigShow)
                        if($scope.isPerferenceConfigShow===true){

                            if(ms.preferenceConfig.average===''||isNaN(ms.preferenceConfig.average)){

                                err.push('人均金额设置非法');
                            }else if(ms.preferenceConfig.average-1>0){
                                err.push('人均金额不能超过1元哦');
                            }
                            if(ms.preferenceConfig.max===''||isNaN(ms.preferenceConfig.max)){
                                err.push('红包上限设置非法');
                            }
                            if(ms.preferenceConfig.send_name.trim()===''){
                                err.push('商户名称不能为空');
                            }
                            //total_percent奖品的百分比，total_people_count中奖人数的百分比
                            var info=ms.preferenceConfig.info||[],len=info.length,total_percent= 0,total_people_count=0;
                            console.log('-----info------:',info);

                            for(var i=0;i<len;i++){
                                var item=info[i];
                                arr.push(item.rate);
                                if(item.percent===''||isNaN(item.percent)){
                                    err.push(item.name+'的概率设置非法');
                                }else{
                                    total_percent+=parseInt(item.percent,10);
                                }
                                if(item.count===''||isNaN(item.count)){
                                    err.push(item.name+'的中奖人数百分比设置非法');
                                }else{
                                    //这个count表示中奖人数百分比
                                    total_people_count+=parseInt(item.count,10);
                                }
                                if(item.redMax===''||isNaN(item.redMax)){
                                    item.redMax=0;
                                    //err.push(item.name+'的红包上限设置非法');
                                }else if(item.redMax>4999){
                                    err.push(item.name+'的红包上限不能超过4999元')
                                }
                            }
                            if(total_percent>100){
                                err.push('所有奖项设置概率之和不能超过100');
                            }
                        }



                        for(var i in ms.preferenceConfig.prizes){
                            var item=ms.preferenceConfig.prizes[i];
                            arr.push(parseInt(item.rate,10));
                            if(item.count===''||isNaN(item.count)){
                                err.push(item.name+'的中奖人数设置非法');
                            }
                        }

                        //for(var i in ms.data){
                        //    arr.push(parseInt(ms.data[i].award_grade,10));
                        //}
                        if(bs.isRepeat(arr)){
                            err.push('奖品等级中不能有重复的元素');
                        }else{
                            bs.bubbleSort(arr);
                            console.log('arr is:',arr);
                            var str='',rightStr='';
                            for(var i= 0,len=arr.length;i<len;i++){
                                str+=arr[i];
                                rightStr+=(i+1);
                            }
                            if(str!==rightStr){
                                err.push('奖品等级必须从第一名开始依次后推');
                            }
                        }
                        //if(total_people_count>100){
                        //    err.push('所有中奖人数概率之和不能超过100');
                        //}
                    }

                    if(err.length===0){


                        //console.log('posting');
                        //var data=[];
                        //for(var i in ms.data){
                        //    var item=ms.data[i];
                        //    data.push({
                        //        id:item.id,
                        //        rate:item.award_grade,
                        //        count:item.total_num
                        //    })
                        //}
                        //var lottery={
                        //    prizes:data
                        //};
                        //if(ms.isUpdatePage){
                        //    lottery._id=ms.urlParams.id
                        //}
                        var post_url,post_data;
                        //if(ms.needPreferenceConfig==='0'){
                        //    post_url=ms.isUpdatePage?(CONFIG.AJAX_URL.UPDATE_SYS_PRIZE):(CONFIG.AJAX_URL.CREATE_SYS_LOTTERY);
                        //    post_data={
                        //        lottery:lottery
                        //    };
                        //
                        //}else{
                            //红包预设模式
                            //post_url=ms.isUpdatePage?(CONFIG.AJAX_URL.UPDATE_SYS_PRIZE):(CONFIG.AJAX_URL.CREATE_SYS_LOTTERY);
                        post_url=ms.isUpdatePage?(CONFIG.AJAX_URL.UPDATE_SYS_PRIZE):(CONFIG.AJAX_URL.CREATE_SYS_LOTTERY);
                        post_data={
                            lottery:{
                                money:ms.preferenceConfig,
                                send_name:ms.preferenceConfig.send_name
                            }

                        };
                        //}
                        if(ms.isUpdatePage){
                            post_data.id=ms.urlParams.id;
                            post_data.type=parseInt(ms.needPreferenceConfig,10);
                        }
                        post_data= _.clone(post_data);
                        if($scope.isPerferenceConfigShow===false){
                            post_data.lottery.money.info=[];
                        }


                        //console.log('---post data：',post_data);locker.unlock();return false;
                        $http.post(post_url,post_data)
                            .then(function(e){

                                console.log('-----res e is-------:',e);

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

                                                parent.ADListener.lotteryStatus({status: true, id:id,type:parseInt(ms.needPreferenceConfig,10)});
                                            }
                                        });

                                    }else{
                                        if(typeof(parent.ADListener)!=='undefined'){
                                            parent.ADListener.lotteryStatus({status: false, msg: "失败"});
                                        }

                                        jQuery.warn(data);
                                        locker.unlock();
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





























            $scope.isPerferenceConfigShow=ms.isUpdatePage?false:false;
            $scope.isPerferenceConfig1Show=ms.isUpdatePage?false:false;
            //$scope.typeSelects=[{type:'p',name:'%'},{type:'c',name:'人'}];
            $scope.showPerferenceConfig=function(){
                $scope.isPerferenceConfigShow=true;
                if(ms.preferenceConfig.info.length===0){
                    ms.preferenceConfig.info.push({
                        rate:1,
                        name:"红包1",
                        percent:'', //总金额百分比
                        count:'',
                        type:'p',
                        moneyType:'p',
                        oType:{"type":"p","name":"%"},
                        redMax:''
                    });
                }
            }
            $scope.changeType=function(k1,k2){
                console.log('k2 and ke2:',k1,k2);
            }
            //$scope.$watch(function(){
            //    return ms.preferenceConfig.info;
            //},function(v){
            //    console.log('this is v:',v);
            //    for(var i in v){
            //        if(!_.isUndefined(v[i].type)){
            //            if(!_.isUndefined(v[i].oType)){
            //                v[i].type=v[i].oType.type;
            //            }
            //
            //        }
            //
            //    }
            //},true)



        }])

})(jQuery);
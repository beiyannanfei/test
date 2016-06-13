(function($){
    'use strict';
    angular
        .module('main',[
            'base'
        ])
        .service('mainService',['$http','$rootScope','$q','baseService','CONFIG',function($http,$rootScope,$q,baseService,CONFIG){

            var bs=baseService;

            var urlParams=bs.parseUrl();
            //console.log('urlParams is:',urlParams)

            var o={
                modifiedItemType:null,
                selected_type:null,
                urlParams:urlParams,
                modifiedItemId: bs.isNull(urlParams.id)?null:(urlParams.id),
                isUpdatePage:bs.isNull(urlParams.id)?false:true,


                award_types:{
                    name:"奖品类型",
                    types:[
                        {
                            "award_type":"SHI_WU",
                            "name":"实物奖品"
                        }
                        ,{
                            "award_type":"DIAN_ZI_QUAN",
                            "name":"第三方电子券"
                        }
                        ,{
                            "award_type":"WX_RED",
                            "name":"微信红包"
                        },{
                            "award_type":"WX_LOTTERY",
                            "name":"微信卡券"
                        },{
                            "award_type":"FLOW",
                            "name":"第三方卡券（url）"
                        }
                    ]
                },
                formData:{
                    award_type:'"WX_LOTTERY"',
                    "SHI_WU":{
                        //字段名：中文名
                        "name":"",
                        "num":"",
                        "src":"",
                        expiredDay:'',
                        count:'',
                        gainUrl:'',
                        fields:[]
                    },
                    "DIAN_ZI_QUAN":{
                        //字段名：中文名
                        "name":"",
                        "num":"",
                        "src":"",
                        "code":'',
                        landing_page:''
                        ,gainUrl:''
                        //,
                        //count:'',
                        //gainUrl:''
                    },
                    "WX_RED":{
                        "award_name":"",
                        "hb_type":"NORMAL",//GROUP为裂变红包,NORMAL为普通红包
                        "total_amount":"",
                        "total_num":"",
                        "wishing":"",
                        "activity_name":"",
                        "red_name":"",
                        "src":"/images/hong_bao.jpg",
                        "mark":""
                        //,
                        //count:'',
                        //gainUrl:''
                    },
                    "WX_LOTTERY":{
                        name:'',
                        src:'',
                        num:'',
                        type:101,
                        card_id:'',
                        price:''
                        ,
                        count:'',
                        gainUrl:''


                        //"landing_page":'',
                        //"type":"DISCOUNT",//DISCOUNT为优惠券
                        //"logo_src":"",
                        //"color":"",
                        //"main_title":"",
                        //"sub_title":"",
                        //"value":"",
                        //"begin_time":"",
                        //"end_time":"",
                        //"limit":"-1",//-1为不限制,否则必须大于0
                        //"total_num":"",
                        //"end_notice_day":"",//必须大于0
                        //"is_trans":"0",//1是0否
                        //"he_xiao_method":"1",//1为卡券号
                        //"discount_details":"",
                        //"usage":"",
                        //"tel":"",
                        //"src":"",
                        //brand_name:""
                    },
                    "FLOW":{
                        //字段名：中文名
                        "name":"",
                        "num":"",
                        "src":"",
                        "landing_page":"",
                        count:'',
                        gainUrl:''
                    }
                },
                formFields:{
                    "SHI_WU":{
                        //字段名：中文名
                        "name":{
                            msg:"奖品名称",
                            name:"name"
                        },
                        "num":{
                            msg:"奖品数量",
                            name:"name"
                        },
                        "src":{
                            msg:"奖品图片",
                            name:"name"
                        }
                    },
                    "DIAN_ZI_QUAN":{
                        "name":{
                            msg:"奖品名称",
                            name:"name"
                        },
                        "num":{
                            msg:"奖品数量",
                            name:"name"
                        },
                        "src":{
                            msg:"奖品图片",
                            name:"name"
                        },
                        "code":{
                            msg:"导入消费码",
                            name:"code"
                        }
                    },
                    "WX_RED":{
                        "award_name":{
                            msg:"商户名称",
                            name:"award_name"
                        },
                        "red_name":{
                          name:"red_name",
                            msg:"红包名称"
                        },
                        "hb_type":{
                            msg:"红包类型",
                            name:"hb_type"
                        },
                        "total_amount":{
                            msg:"红包总金额",
                            name:"total_amount"
                        },
                        "total_num":{
                            msg:"红包总人数",
                            name:"total_num"
                        },
                        "wishing":{
                            msg:"红包祝福语",
                            name:"wishing"
                        },
                        "activity_name":{
                            name:"activity_name",
                            msg:"活动名称"
                        },
                        "mark":{
                            name:"mark",
                            msg:"备注"
                        },
                        "src":{
                            msg:"奖品图片",
                            name:"name"
                        }
                    },
                    "WX_LOTTERY":{
                        "brand_name":{
                          msg:'商家名称',
                            name:"brand_name"
                        },
                        "landing_page":{
                          msg:'外部链接',
                            name:"landing_page"
                        },
                        "type":{
                            name:"type",
                            msg:"卡券类型",//DISCOUNT为优惠券
                        },
                        "logo_src":{
                            name:"logo_src",
                            msg:"商家logo"
                        },
                        "color":{
                            name:"color",
                            msg:"卡券颜色"
                        },
                        "main_title":{
                            name:"main_title",
                            msg:"主标题"
                        },
                        "sub_title":{
                            name:"sub_title",
                            msg:"副标题"
                        },
                        "value":{
                            name:"value",
                            msg:"面值"
                        },
                        "begin_time":{
                            name:"begin_time",
                            msg:"生效时间"
                        },
                        "end_time":{
                            name:"end_time",
                            msg:"过期时间"
                        },
                        "limit":{
                            name:"limit",
                            msg:"每人限领"//-1为不限制,否则必须大于0
                        },
                        "total_num":{
                            name:"total_num",
                            msg:"发放总量(张)"
                        },
                        "end_notice_day":{
                            name:"end_notice_day",//必须大于0
                            msg:"到期提前提醒天数"
                        },
                        "is_trans":{
                            name:"is_trans",//1是0否
                            msg:"是否转增"
                        },
                        "he_xiao_method":{
                            name:"he_xiao_method",//1为卡券号
                            msg:"核销方式"
                        },
                        "discount_details":{
                            name:"discount_details",
                            msg:"优惠详情"
                        },
                        "usage":{
                            name:"usage",
                            msg:"使用须知"
                        },
                        "tel":{
                            name:"tel",
                            msg:"客服电话"
                        },
                        "src":{
                            msg:"奖品图片",
                            name:"name"
                        }
                    },
                    "FLOW":{
                        "name":{
                            msg:"奖品名称",
                            name:"name"
                        },
                        "num":{
                            msg:"奖品数量",
                            name:"name"
                        },
                        "src":{
                            msg:"奖品图片",
                            name:"name"
                        },
                        "landing_page":{
                            name:"landing_page",
                            msg:"URL"
                        }
                    }
                }
            };
            console.log('-------o:',o);
            return o;
        }])
        .controller('mainController',['$scope','$animate','$http','$rootScope','$q','mainService','baseService','CONFIG','dataConverter',function($scope,$animate,$http,$rootScope,$q,mainService,baseService,CONFIG,dataConverter){
            function successAndChangeUrl(){
                jQuery.success('操作成功',function(){
                    location.href=CONFIG.URL.AWARD_LIST;
                });

            }
            //console.log('this is the animate:',$animate);
            //$animate.on('enter',$('body'),function($element){
            //    console.log('enter:',$element);
            //    $element.css({
            //        color:'red',
            //        background:'red'
            //    })
            //})
            var ms=$scope.ms=mainService,
                bs=$scope.bs=baseService,
                cfg=$scope.CONFIG=CONFIG;
            $scope.dataConverter=dataConverter;
            //console.log('dataConverter',dataConverter);
            $scope.jq=$;

            //GET_AWARD_INFO
            if(ms.isUpdatePage){
                $rootScope.$emit('pageLoading');
                $http.get(bs.tpl({
                    tpl:CONFIG.AJAX_URL.GET_AWARD_INFO,
                    data:ms.urlParams
                }))
                    .then(function(e){
                        $rootScope.$emit('pageLoaded');
                        var data= e.data;
                        console.log('原始数据',data.data);
                        if(data.status==='success'){
                            var type_mark=data.data.type;
                            var map;
                            //console.log('--------type_mark===:',type_mark==='102',type_mark);
                            if(type_mark===101){

                            }else if(type_mark===102){

                                //map={
                                //    award_name: 'send_name',
                                //    red_name: 'name',
                                //    hb_type: 'hb_type',
                                //    total_amount: 'total_amount',
                                //    total_num: 'total_num',
                                //    wishing: 'wishing',
                                //    activity_name: 'act_name',
                                //    mark: 'remark',
                                //    src:'pic'
                                //}
                            }else{
                                map={
                                    name: "name",
                                    num: "count",
                                    src:"pic",
                                    type:"type",
                                    code:'shoppingCards',
                                    landing_page:'link',
                                    expiredDay:'expiredDay',
                                    price:'price',
                                    count:'count',
                                    gainUrl:'gainUrl',
                                    fields:'fields'
                                }
                            }


                            var type={
                                '1':'SHI_WU',
                                '2':'DIAN_ZI_QUAN',
                                '3':'FLOW',
                                '101':'WX_LOTTERY',
                                '102':'WX_RED'
                            }[''+data.data.type];
                            //console.log('--------maapaaaaaaaaaaaaa---------:',map,type);

                            ms.modifiedItemType={
                                '1':'实物',
                                '2':'电子券',
                                '3':'第三方卡券(URL)',
                                '101':'微信卡券',
                                '102':'微信红包'
                            }[''+data.data.type];
                            //console.log('----------ms.modifiedItemType--------------',ms.modifiedItemType)
                            if(type_mark!==101&&type_mark!==102){
                                map=bs.reverseMap(map);
                                data=data.data;
                                data=bs.getFormDataByMap(data,map);
                                console.log('after by map,data is:',data);
                            }else{
                                return false;
                                //var data_map={
                                //
                                //}
                                //for(var i in data_map){
                                //
                                //    bs.formData[type][i]=data_map[i];
                                //}
                            }



                            //award_types
                            var index='SHI_WU DIAN_ZI_QUAN WX_RED WX_LOTTERY FLOW'.split(' ').indexOf(type);
                            ms.selected_type=ms.award_types.types[index];
                            //console.log('aaa---------:',aaa,ms.award_types.types)

                            var curTypeData=ms.formData[type];
                            ms.formData.award_type=type;

                            for(var i in curTypeData){

                                curTypeData[i]=data[i];
                            }
                            console.log('-----curTypeData---------',curTypeData,type);

                            if(type==='DIAN_ZI_QUAN'&&_.isArray(curTypeData.code)){
                                curTypeData.code=curTypeData.code.join(',');
                            }
                            //$scope.$apply();
                            console.log("final data:--------",data,type);

                            //$scope.multiSelectOptions[0].items[0].selected=true;
                            if(type==='SHI_WU'){
                                var fields=curTypeData.fields;
                                var fieldsProto=angular.copy($scope.multiSelectOptions);
                                //var fields=angular.copy(curTypeData.fields);
                                console.log('fields is:',fields)

                                var selectedFieldsValueArr=[];
                                for(var i in fields){
                                    selectedFieldsValueArr.push(fields[i].value);
                                }
                                for(var j in fieldsProto){
                                    for(var k in fieldsProto[j].items){
                                        var item=fieldsProto[j].items[k];
                                        if(selectedFieldsValueArr.indexOf(item.value)!==-1){
                                            item.selected=true;
                                        }
                                    }
                                }
                                $scope.multiSelectOptions=fieldsProto;
                                //$scope.$apply();
                            }

                        }else{

                        }
                        //console.log('updated e:',e);
                    })
            }else{
                $rootScope.$emit('pageLoaded');
            }




            $scope.multiSelectOptions=[
                {
                    labels:'全部选项',
                    //items:'联系人 联系电话 孩子姓名 孩子性别 孩子年龄 住址'.split(' '),
                    items:[
                        {
                            value:'联系人'
                            //,selected:true
                        },
                        {
                            value:'联系电话'
                        },
                        {
                            value:'孩子姓名'
                        },
                        {
                            value:'孩子性别'
                        },
                        {
                            value:'孩子年龄'
                        },
                        {
                            value:'住址'
                        }
                    ]
                }
            ]

            $scope.onMultiSelectChange=function(values){
                console.log("this is values:",values);
                var values_arr=values.split(',');
                var arr=[];
                if(values!==''){
                    var map={
                        '联系人':'name',
                        '联系电话':'phoneNum',
                        '孩子姓名':'childName',
                        '孩子性别':'childSex',
                        '孩子年龄':'childAge',
                        '住址':'address'
                    }
                    for(var i in values_arr){
                        arr[i]={

                            key:map[values_arr[i]],
                            value:values_arr[i]
                        }
                    }
                }


                //var fields={
                //    fields:arr
                //}
                ms.formData.SHI_WU.fields=arr;
                console.log('this is the values arr------:',arr);
                //console.log("multi select changed");
            }




            //$scope.$watch(function(){
            //    return ms.formData.DIAN_ZI_QUAN.code;
            //},function(){
            //    ms.formData.DIAN_ZI_QUAN.num=ms.formData.DIAN_ZI_QUAN.code.split(',').length;
            //},true)
            //ms.formData.award_type='WX_LOTTERY'
            $scope.$watch(function(){
                return ms.selected_type;
            },function(nv){
                console.log("nv------------:",nv);
                if(nv===null||typeof(nv)==='undefined'&&(!ms.isUpdatePage)){
                    nv=ms.selected_type=ms.award_types.types[0];
                }
                if(bs.isExist(nv,'award_type')){
                    ms.formData.award_type=nv.award_type;
                }

            })


            require(['add-award-validate-rule'],function(rules){
                console.log('rule is:',rules);

                $scope.submit=function(e){

                    var type=ms.formData.award_type;
                    var formData=ms.formData[type];
                    var rule;
                    if(typeof(rules[type])!=='undefined'){
                        rule=rules[type];
                    }
                    var $tar=$(e.target);
                    var locker=bs.locker($tar);
                    console.log('locker is:',locker);
                    if (locker.isLocked) {
                        return false;
                    }


                    locker.lock();

                    function handleCommonAwardAdding(data){
                        data = bs.getFormDataByMap(_.clone(data), {
                            name: "name",
                            num: "count",
                            src:"pic",
                            type:"type",
                            code:'shoppingCards',
                            landing_page:'link',
                            expiredDay:'expiredDay',
                            card_id:'card_id',
                            price:'price',
                            count:'count',
                            gainUrl:'gainUrl',
                            fields:'fields'
                        });
                        //data.pic='http://localhost:6002/images/add-red-pkg.png';
                        if(ms.isUpdatePage===false){
                            $http.post(CONFIG.AJAX_URL.ADD_AWARD,data)
                                .then(function(e){
                                    //console.log('e and status:',e, e.status);
                                    if(e.data.status==='failure'){
                                        jQuery.warn(e.data.errMsg);
                                        locker.unlock();
                                    }else{
                                        successAndChangeUrl();
                                    }
                                })
                        }else{
                            var url=bs.tpl({
                                tpl:CONFIG.AJAX_URL.UPDATE_AWARD_INFO,
                                data:ms.urlParams
                            });
                            console.log('url is----------:',url);
                            $http.post(url,data)
                                .then(function(e){
                                    //console.log('e and status:',e, e.status);
                                    if(e.data.status==='failure'){
                                        jQuery.warn(e.data.errMsg);
                                        locker.unlock();
                                    }else{
                                        successAndChangeUrl();
                                    }
                                })
                        }

                    }
                    switch(type){

                        case 'SHI_WU':{

                            formData= $.extend(formData,{
                                type:1
                            });
                            handleCommonAwardAdding(formData);
                            break;
                        }
                        case 'DIAN_ZI_QUAN':{

                            console.log('this is form data:',formData);
                            var data= $.extend(_.clone(formData),{
                                type:2
                            });
                            console.log('----------code--------',data.code);
                            data.code= _.isArray(data.code)?(data.code):(data.code.split(','));
                            data.num=data.code.join(',').trim()===''?0:data.code.length;
                            handleCommonAwardAdding(data);
                            break;
                        }
                        case 'FLOW':{

                            formData= $.extend(formData,{
                                type:3
                            });
                            handleCommonAwardAdding(formData);

                            break;
                        }
                        case 'WX_RED':{


                            formData = bs.getFormDataByMap(_.clone(formData), {
                                award_name: 'send_name',
                                red_name: 'name',
                                hb_type: 'hb_type',
                                total_amount: 'total_amount',
                                total_num: 'total_num',
                                wishing: 'wishing',
                                activity_name: 'act_name',
                                mark: 'remark',
                                src:'pic',
                                count:'count',
                                gainUrl:'gainUrl'
                            });
                            console.log("form data --------------:",formData);
                            var handleValidateResult=function(result){
                                console.log('result  is:',result);
                                if(result.status==='ERROR'){
                                    jQuery.warn(result.err.join('\n'));
                                    console.log('--------------err:',result.err);
                                    locker.unlock();
                                    $scope.$apply();
                                }else{
                                    $http.post(CONFIG.AJAX_URL.SAVE_NEW_RED_PKG,formData)
                                        .then(function(e){

                                            if(e.data.status==='failure'){
                                                locker.unlock();
                                                jQuery.warn(e.data.errMsg);
                                            }else{
                                                successAndChangeUrl();
                                            }
                                        })

                                }

                            }

                            require(['V'],function(V){
                                console.log('rule is:------------:',rule,rules);
                                V(rule,formData, handleValidateResult);
                            })





                            break;
                        }
                        case 'WX_LOTTERY':{
                            //console.log('fromdat----------------sfds,',formData)
                            handleCommonAwardAdding(formData);

                            //console.log('form data is:',formData);
                            //
                            //console.log("formdata form data:",formData);
                            //var data={
                            //
                            //    pic:formData.src,
                            //    card:{
                            //        general_coupon:{
                            //
                            //            base_info:{
                            //
                            //                brand_name:formData.brand_name,
                            //                can_give_friend:formData.is_trans,
                            //                code_type:'CODE_TYPE_TEXT',
                            //                color:$('.dbx-add-color').first().attr('name'),
                            //                date_info:{
                            //                    begin_timestamp:formData.begin_time,
                            //                    end_timestamp:formData.end_time,
                            //                    type:1
                            //                },
                            //                description:formData.usage,
                            //                get_limit:formData.limit,
                            //                logo_url:formData.logo_src,
                            //                notice:formData.end_notice_day,
                            //                service_phone:formData.tel,
                            //                title:formData.main_title,
                            //                sub_title:formData.sub_title,
                            //                sku:{
                            //                    quantity:formData.total_num
                            //                }
                            //
                            //            },
                            //            default_detail:formData.discount_details
                            //        }
                            //    },
                            //    colorValue:$('.dbx-add-color').first().attr('v'),
                            //    endTimeTips:1,
                            //    price:formData.value,
                            //};
                            //if(formData.type==='DISCOUNT'){
                            //    data.card.card_type="GENERAL_COUPON";
                            //}
                            //else{
                            //    data.card.card_type=formData.type;
                            //}
                            //console.log("the  final data is:",data);
                            //$http.post(CONFIG.AJAX_URL.ADD_WX_LOTTERY,data)
                            //    .then(function(e){
                            //        console.log('res e is:',e);
                            //        if(e.data.status==='failure'){
                            //            jQuery.warn(e.data.errMsg);
                            //        }else{
                            //            successAndChangeUrl();
                            //        }
                            //    })
                            //


                            break;
                        }
                    }

                }
            })
        }])

})(jQuery);
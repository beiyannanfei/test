(function($){


    angular.module('base')
        .service('tvmService',['$rootScope',function($rootScope){
            return {
                getChineseType:function(type){
                    return {
                        '1':'实物奖品',
                        '2':'第三方电子券',
                        '3':'第三方卡券(URL)',
                        '101':'微信卡券优惠券',
                        '102':'微信红包'
                    }[''+type];
                }
            };
        }])
        .service('dataConverter',['$rootScope',function($rootScope){






            return {
                readExcelData:function(data,previour_val){
                    var shoppingCardArr=[];
                    var importShoppingCards = []
                    if (data && data.length > 0 && data[0].data){
                        importShoppingCards = data[0].data
                    }
                    var len = 0
                    $.each(importShoppingCards, function(i, o){
                        if (o && o.length > 0){
                            shoppingCardArr.push(o[0])
                            len++
                        }
                    });
                    return previour_val+(previour_val.trim()===''?'':',')+shoppingCardArr.join(',').trim();
                }
            };
        }])
        .constant('CONFIG',{

            ///admin/prize/:id/info  获取奖品信息
            BASE_JS_LIB_PATH:'/javascripts/lib',
            BASE_JS_PATH:'/javascripts',
            UNPRIZE_PIC:'http://mall.mtq.tvm.cn/pic/20150705184847-27363-2965qj.jpg',//未中奖图片的url
            PAGE_NAME:{
                AWARD_LIST:'奖品列表',
                ORDER_LIST:'订单列表',
                ADD_AWARD:'添加奖品',
                CRAZY_LOTTERY:'疯狂抽奖',
                SYSTEM_LOTTERY:'系统抽奖'
            },
            URL:{
                AWARD_LIST:'/admin/page/awadList',
                ORDER_LIST:'/admin/page/orderList',
                ADD_AWARD:'/admin/page/add-award',
                CRAZY_LOTTERY:'/admin/page/crazyLottery',
                SYSTEM_LOTTERY:'/admin/page/systemLottery'
            },
            UPLOADER:{
                AUTO:'1',//自动上传
                SRC_KEY:'url',
                EXCEL_READER:'dataConverter.readExcelData',
                URL:'http://mall.mtq.tvm.cn/pointMall/image/upload',
                EXCEL_URL:'http://mall.mtq.tvm.cn/pointMall/excel/upload',
                EXCEL_TYPE:'excel',
                MAX_IMG_WIDTH:'100',
                MAX_IMG_HEIGHT:'100',
                WIDTH:'*',
                HEIGHT:'*',
                MAX_SIZE:'1000kb',
                TYPE:"img",
                EXT:"jpg,jpeg,png,bmp,gif",
                MULTI:'0'//屏蔽多文件上传
            },
            AJAX_URL:{
                ADD_AWARD:'/admin/prize',//添加奖品
                GET_AWARD_INFO:'/admin/prize/{{id}}/info',//获取抽奖信息
                AWARDS_LIST:'/admin/prize/list',//奖品列表
                ADD_WX_LOTTERY:'/admin/card',//添加微信卡券
                QUERY_RED_PKG:'/admin/wxred/list',//查询红包
                QUERY_RED_PKG_ACTIVITY:'/admin/wxredLottery/list',//查询红包活动
                UPDATE_AWARD_INFO:'/admin/prize/{{id}}/update',//更新奖品信息
                UPDATE_SYS_PRIZE:'/admin/syslottery/update',//修改系统抽奖-------------
                GET_SYS_PRIZE_INFO:'/admin/syslottery/{{id}}/getbyid',//根据id获取系统抽奖信息
                GET_CRAZY_PRIZE_INFO:'/admin/crazylottery/{{id}}',//根据id获取疯狂抽奖系统信息
                UPDATE_CRAZY_PRIZE:'/admin/crazylottery/{{id}}',//修改 当前疯狂抽奖系统信息
                GET_OVERVIEW_INFO:'/open/order/statistics',

                //DEL_RED_PKG:'/test/ajaxTest',//删除红包
                //DEL_RED_PKG_ACTIVITY:'/test/ajaxTest',//删除红包活动
                SAVE_NEW_RED_PKG:'/admin/wxred',//保存新红包
                //saveUpdatedRedPkg:'/test/ajaxTest',//保存当前更新红包
                SAVE_NEW_RED_PKGActivity:'/admin/wxredLottery',//保存新红包活动
                CREATE_SYS_LOTTERY:'/admin/syslottery/create',//创建系统抽奖
                CREATE_CRAZY_LOTTERY:'/admin/crazylottery'//添加新疯狂抽奖
                //saveUpdatedRedPkgActivity:'/test/ajaxTest',//保存当前更新红包活动
                //testUrl:'/test/ajaxTest'
            }
        });
})(jQuery);
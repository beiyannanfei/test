/*
为页面加入动画层：
 <body ng-app="main">
 <div ng-show="isUILock" ng-controller="baseController" class="ui-lock-anim-wrapper">
 <div class="ui-lock-anim" ng-include src="'/tpl/loading.html'"></div>
 </div>
 <script>
 (function ($) {
 'use strict';
 angular
 .module('main', [
 'base'
 ])
 //                .service('mainService', ['$http', '$rootScope', '$q', 'baseService', 'CONFIG', function ($http, $rootScope, $q, baseService, CONFIG) {
 //
 //                    var bs = baseService;
 //
 //                    var o = {};
 //                    return o;
 //                }])
 //                .controller('mainController', ['$scope', '$http', '$rootScope', '$q', 'mainService', 'baseService', 'CONFIG', function ($scope, $http, $rootScope, $q, mainService, baseService, CONFIG) {
 //                    var ms = $scope.ms = mainService,
 //                            bs = $scope.bs = baseService,
 //                            cfg = $scope.CONFIG = CONFIG;
 //
 //
 //                }])

 })(jQuery);
 </script>
 <style>
 .ui-lock-anim,.ui-lock-anim-wrapper{
 position: fixed;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 z-index: 10000000000;
 }
 .ui-lock-anim{
 top: 20%;
 }
 </style>
 */


(function($,ng){
    'use strict';

    var lib={


        tpl : function(options) {
            options = $.extend({
                left_split : "{{",
                right_split : "}}",
                tpl : "",
                data : null
            }, options);
            if (options.data == null) {
                return options.tpl;
            } else {
                var reg = new RegExp(options.left_split + "(.+?)" + options.right_split, "gi");
                var strs = options.tpl.match(reg), tpl = options.tpl;
                for (var i = 0; i < strs.length; i++) {
                    var str = strs[i];
                    strs[i] = str.substring(options.left_split.length, str.length - (options.right_split.length));
                    tpl = tpl.replace(str, str.indexOf(".") == -1 ? (options.data[strs[i]]||'') : (this.getDataByModel(options.data,strs[i]))||'');
                }
                return tpl;
            }
        },
        getFormDataByMap:function(formData,map){
            var res={};
            for(var i in map){

                res[map[i]]=formData[i];
            }
            return res;
        },
        reverseMap:function(map){
            var res={};
            for(var i in map){
                res[map[i]]=i;
            }
            return res;
        },

        toggleArrayElement:function(item,arr){
            var index=arr.indexOf(item);
            if(index===-1){
                arr.push(item);
            }else{
                arr.splice(index,1);
            }
        },
        //检测数组重复元素
        isRepeat:function(arr){

            var hash = {};

            for(var i in arr) {

                if(hash[arr[i]])

                    return true;

                hash[arr[i]] = true;

            }

            return false;

        },
        //冒泡排序
        bubbleSort:function(arr){
            for(var i=0;i<arr.length;i++){
                //内层循环，找到第i大的元素，并将其和第i个元素交换
                for(var j=i;j<arr.length;j++){
                    if(arr[i]>arr[j]){
                        //交换两个元素的位置
                        var temp=arr[i];
                        arr[i]=arr[j];
                        arr[j]=temp;
                    }
                }
            }
        },
        parseUrl: function (href) {
            var url = href || location.href;
            var a = document.createElement('a');
            a.href = url;
            var ret = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length, i = 0, s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        },
        //以下为增强数据模型的获取，修改和找寻目标scope的方法
        getDataByModel:function($scope,modelStr,otherWiseVal){
            otherWiseVal=otherWiseVal||null;
            var arr=modelStr.split('.'),len=arr.length,result=$scope;
            if(len===1){
                return $scope[arr[0]];
            }else if(len>1){
                var isError=false;
                for(var i in arr){
                    if(typeof(result[arr[i]])==='undefined'){
                        isError=true;
                        break;
                    }else{
                        result=result[arr[i]];
                    }
                }
                if(isError){
                    return otherWiseVal;
                }else{
                    return result;
                }
            }else if(len===0){
                return otherWiseVal;
            }
        },
        setDataByModel:function($scope,modelStr,val){
            var arr=modelStr.split('.'),len=arr.length;
            if(len===1){
                $scope[arr[0]]=val;
            }else if(len>1){
                var ns=arr,obj=$scope;
                for(var i=0;i<len-1;i++){
                    var key=ns[i];
                    obj=obj[key];
                }
                obj[ns[len-1]]=val;
            }
        },
        getTargetScopeByModel:function($currentScope,modelStr){
            var arr=modelStr.split('.'),len=arr.length;
            if(len===0){
                return $currentScope;
            }else{
                var key=arr[0],$pScope=$currentScope;
                var loop=function(){
                    $pScope=$pScope.$parent;
                    if($pScope===null){
                        $pScope=null;
                    }else{
                        if(typeof($pScope[key])==='undefined'){
                            loop();
                        }
                    }

                }
                loop();
                return $pScope;
            }
        },
        isDate:function(txtDate)
        {
            var currVal = txtDate;
            if(currVal == '')
                return false;

            var rxDatePattern = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/; //Declare Regex
            var dtArray = currVal.match(rxDatePattern); // is format OK?

            if (dtArray == null)
                return false;

            //Checks for mm/dd/yyyy format.
            var dtMonth = dtArray[3];
            var dtDay= dtArray[5];
            var dtYear = dtArray[1];

            if (dtMonth < 1 || dtMonth > 12)
                return false;
            else if (dtDay < 1 || dtDay> 31)
                return false;
            else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31)
                return false;
            else if (dtMonth == 2)
            {
                var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
                if (dtDay> 29 || (dtDay ==29 && !isleap))
                    return false;
            }
            return true;
        },
        filter:function(oFormData,aFilters){
            var result={};
            for(var i in oFormData){
                if(aFilters.indexOf(i)!==-1){
                    result[i]=oFormData[i];
                }
            }
            return result;
        },
        isSequentFromNo1:function(arr){
            var len=arr.length;
            if(len===0){
                return false;
            }
            var str='',rightStr='';
            for(var i= 0;i<len;i++){
                str+=arr[i];
                rightStr+=(i+1);
            };

            return str===rightStr;
        },
        isDateTime:function(str,format){
            var reg=null;
            if(format==='y-m-d h:i:s'){
                reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            }else if(format==='y/m/d h:i:s'){
                reg = /^(\d+)\/(\d{1,2})\/(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            }else{
                return true;
            }
            if(reg!==null){

            }
            //var reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            var r = str.match(reg);
            if(r==null)return false;
            r[2]=r[2]-1;
            var d= new Date(r[1], r[2],r[3], r[4],r[5], r[6]);
            if(d.getFullYear()!=r[1])return false;
            if(d.getMonth()!=r[2])return false;
            if(d.getDate()!=r[3])return false;
            if(d.getHours()!=r[4])return false;
            if(d.getMinutes()!=r[5])return false;
            if(d.getSeconds()!=r[6])return false;
            return true;
        },
        getMapByObjIndex:function(eq,obj){
            var index=0,result={};
            for(var i in obj){
                if(index==eq){
                    result.k=i;
                    result.v=obj[i];
                    break;
                }
                index++;
            }
            return result;
        },
        isNull:function(str){
            return (typeof(str)==='string'&&str.trim()==='')||(typeof(str)==='undefined')||(str===null);
        },
        isExist:function(obj,modelstr){
            var _ng={
                isObject:function(obj){
                    return obj===Object(obj);
                },
                isUndefined:function(obj){
                    return typeof(obj)==='undefined';
                }
            }
            var exist=true;
            var arr=modelstr.split('.'),len=arr.length;
            if(!_ng.isObject(obj)){
                exist=false;
            }
            else if(obj===null){
                exist=false;
            }
            else if(_ng.isUndefined(obj)){
                exist=false;
            }else{
                for(var i in arr){
                    if(_ng.isUndefined(obj[arr[i]])){
                        exist=false;
                        break;
                    }
                    obj=obj[arr[i]];
                }
            }

            return exist;
        },
        //getVal:function(obj,modelstr,otherwiseVal){
        //    var exist=this.isExist(obj,modelstr),val;
        //    if(exist){
        //        val=getDataByModel(obj,modelstr);
        //    }else{
        //        val=otherwiseVal||''
        //    }
        //    return val;
        //},
        getArrayByRepeatElement:function(obj,count){
            var arr=[];
            for(var i= 0;i<count;i++){
                arr.push(obj);
            }
            return arr;
        },
        getDateStr:function(AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = dd.getMonth()+1;//获取当前月份的日期
            var d = dd.getDate();
            m=m<10?'0'+m:m;
            d=d<10?'0'+d:d;

            return y+"-"+m+"-"+d;
        },
        /*
         节流函数
         // Usage
         var myEfficientFn = debounce(function() {
         // All the taxing stuff you do
         }, 250);
         window.addEventListener('resize', myEfficientFn);
         */
        debounce:function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },
        /*
         期望状态检查
         // Usage:  ensure element is visible
         poll(
         function() {
         return document.getElementById('lightbox').offsetWidth > 0;
         },
         function() {
         // Done, success callback
         },
         function() {
         // Error, failure callback
         }
         );
         */
        poll:function(fn, callback, errback, timeout, interval) {
            var endTime = Number(new Date()) + (timeout || 2000);
            interval = interval || 100;

            (function p() {
                // If the condition is met, we're done!
                if(fn()) {
                    callback();
                }
                // If the condition isn't met but the timeout hasn't elapsed, go again
                else if (Number(new Date()) < endTime) {
                    setTimeout(p, interval);
                }
                // Didn't match and too much time, reject!
                else {
                    errback(new Error('timed out for ' + fn + ': ' + arguments));
                }
            })();
        },
        /*
         once函数
         // Usage
         var canOnlyFireOnce = once(function() {
         console.log('Fired!');
         });

         canOnlyFireOnce(); // "Fired!"
         canOnlyFireOnce(); // undefined
         */
        once:function(fn, context) {
            var result;

            return function() {
                if(fn) {
                    result = fn.apply(context || this, arguments);
                    fn = null;
                }

                return result;
            };
        },
        /*
         // Usage
         getAbsoluteUrl('/something'); // http://davidwalsh.name/something
         */
        getAbsoluteUrl:(function() {
            var a;

            return function(url) {
                if(!a) a = document.createElement('a');
                a.href = url;

                return a.href;
            };
        })(),
        /*
         插入样式:
         // Usage
         sheet.insertRule("header { float: left; opacity: 0.8; }", 1);
         */
        sheet: (function() {
            // Create the <style> tag
            var style = document.createElement('style');

            // Add a media (and/or media query) here if you'd like!
            // style.setAttribute('media', 'screen')
            // style.setAttribute('media', 'only screen and (max-width : 1024px)')

            // WebKit hack :(
            style.appendChild(document.createTextNode(''));

            // Add the <style> element to the page
            document.head.appendChild(style);

            return style.sheet;
        })(),
        /*

         */
    };

    

    function responseSpaceAction(){
        return {
            restrict: 'A',
            link: function (scope, el, attrs){
                var service=lib.getDataByModel(scope,attrs.responseSpaceAction);
                $(el).on('keyup',function(event){
                    if(event.keyCode===32){
                        service();
                    }

                })
            }
        };
    }
    function responseEnterAction(){
        return {
            restrict: 'A',
            link: function (scope, el, attrs){
                var service=lib.getDataByModel(scope,attrs.responseEnterAction);
                $(el).on('keyup',function(event){
                    if(event.keyCode===13){
                        service();
                    }

                })
            }
        };
    }

    function responseEscAction(){
        return {
            restrict: 'A',
            link: function (scope, el, attrs){
                var service=lib.getDataByModel(scope,attrs.responseEscAction);
                $(el).on('keyup',function(event){
                    if(event.keyCode===27){
                        service();
                    }

                })
            }
        };
    }


    angular
        .module('base', [
            'ngAnimate',

            'baseModule.templates',
            'ui.bootstrap'
//                    'ui.bootstrap'
        ])
        .directive('responseEnterAction',responseEnterAction)
        .directive('responseEscAction',responseEscAction)
        //.directive('responseKeyAction',responseKeyAction)
        .directive('responseSpaceAction',responseSpaceAction)

        /*
         demo:
         <pagination res-total-num-key="total" res-data-key="data" page-handler-num="10" page-size="10" url="/test/fetchData?page={currentPage}&pageSize={pageSize}" datamodel="obj.data" transform-res-data-fn="transformResData">

         </pagination>
         */
        .directive('pagination',['$rootScope','baseService',function($rootScope,baseService){
            return {
                restrict:'EA',
                templateUrl:'/javascripts/baseModule/baseModule.template/directives.tpl/pagination.html',
                transclude:true,
                scope:{
                    resDataKey:'@',
                    pageHandlerNum:'@',
                    url:'@',
                    datamodel:'@',
                    transformResDataFn:'@',
                    initPage:'@',
                    resTotalNumKey:'@',
                    pageSize:'@'
                },
                controller:['$scope','$http','$element',function($scope,$http,$element){


                    var bs=$scope.bs=baseService;

                    var options=$scope.options={};
                    if(baseService.isNull($scope['url'])){
                        alert('url属性是必须的');
                        return false;
                    }

                    var defaultOptions={
                        resDataKey:'',
                        pageHandlerNum:10,
                        url:'',
                        datamodel:null,
                        transformResDataFn:null,
                        initPage:'1',
                        resTotalNumKey:'',
                        pageSize:10
                    }

                    for(var k in defaultOptions){
                        var v=defaultOptions[k];
                        if(baseService.isNull($scope[k])){
                            options[k]=v;
                        }else{
                            options[k]=$scope[k];
                        }
                    }

                    $scope.currentPage=parseInt(options.initPage);
                    console.log('options is--------:',options);
                    var $pScope=bs.getTargetScopeByModel($scope,options.datamodel)


                    console.log('------------$scope.currentPage:',$scope.currentPage)
                    $scope.prev=function(){
                        $scope.currentPage-=1;
                        $scope.fetchData();
                    }
                    $scope.next=function(){
                        $scope.currentPage+=1;
                        $scope.fetchData();
                    }
                    var allowFetch=true;
                    $scope.fetchData=function(page){
                        if(!allowFetch){
                            return false;
                        }
                        $rootScope.$emit('paginationDatafetching',$scope,options,$element)
                        allowFetch=false;
                        var currentPage=page||$scope.currentPage;
                        $scope.currentPage=currentPage;
                        var url=bs.tpl({
                            left_split : "{",
                            right_split : "}",
                            tpl : options.url,
                            data : {
                                currentPage:currentPage,
                                pageSize:$scope.pageSize
                            }
                        });
                        $http.get(url)
                            .then(function(e){
                                var data= e.data;
                                console.log("sdfsdf-----------data:",data);
                                if(!baseService.isNull(options.resDataKey)){
                                    var listData=bs.getDataByModel(data,options.resDataKey);
                                    if(listData!==null){
                                        allowFetch=true;
                                        //console.log("bs.isNull($pScope['transformResDataFn']",baseService.isNull($pScope['transformResDataFn']));
                                        if(baseService.isNull($scope['transformResDataFn'])){
                                            bs.setDataByModel($pScope,options.datamodel,listData);
                                        }
                                        else if(!baseService.isNull($pScope['transformResDataFn'])){
                                            bs.setDataByModel($pScope,options.datamodel,$scope['transformResDataFn'](listData));
                                        }
                                        var totalCount=parseInt(bs.getDataByModel(data,options.resTotalNumKey),10);
                                        $scope.totalPage=Math.ceil(totalCount/parseInt(options.pageSize,10))
                                        calculatePageRange();
                                        $rootScope.$emit('paginationDataLoaded', e.data,$scope,options,$element);
                                    }

                                    //console.log('sfdsfsd')
                                }
                            })
                    }
                    //$('body').click(function(){
                    //    console.log($scope);
                    //})
                    function calculatePageRange(){


                        var start=$scope.currentPage-Math.floor(parseInt(options.pageHandlerNum,10)/2),
                            end=$scope.currentPage+Math.ceil(parseInt(options.pageHandlerNum,10)/2)-1;
                        if(start<1){
                            start=1;
                        }
                        console.log('总页数：',$scope.totalPage)
                        if(end>$scope.totalPage){
                            end=$scope.totalPage;
                        }
                        if(end<parseInt(options.pageHandlerNum,10)){
                            end=parseInt(options.pageHandlerNum,10);
                        }
                        var pageConfig=[];
                        for(var i=start;i<=end;i++){
                            pageConfig[i]=i;
                        }
                        $scope.pageConfig=pageConfig;
                        console.log('start and end is:',start,end);

                    }
                    $scope.fetchData();


                }],
                //templateUrl:'/javascripts/baseModule/baseModule.template/directives.tpl/pagination.html',
                //link:function($scope,$ele,attrs){
                //    $ele.find('input[type=number]').get(0).value=attrs.number;
                //    console.log('number size:',$ele.find('input[type=number]').size());
                //},
                replace:true
            }
        }])
        /*
         demo:
         <select-all-checkbox item-flag="isSelected" checkboxes="ListOfItems" is-all-selected="AllSelectedItems" is-none-selected="NoSelectedItems"></select-all-checkbox>select all
         <div ng-repeat="item in ListOfItems">
         <input type="checkbox" ng-model="item.isSelected" />{{item.desc}}

         <!--$scope.ListOfItems = [{-->
         <!--isSelected: true,-->
         <!--desc: "Donkey"-->
         <!--}, {-->
         <!--isSelected: false,-->
         <!--desc: "Horse"-->
         <!--}];-->


         </div>
         */
        .directive('selectAllCheckbox', function () {
            return {
                replace: true,
                restrict: 'E',
                scope: {
                    checkboxes: '=',
                    isAllSelected: '=isAllSelected',
                    isNoneSelected: '=isNoneSelected',
                    itemFlag:'@'//表示列表项是否处于选中状态的flag
                },
                template: '<input type="checkbox" ng-model="master" ng-change="masterChange()">',
                controller: function ($scope, $element) {

                    $scope.masterChange = function () {
                        if ($scope.master) {
                            angular.forEach($scope.checkboxes, function (v, index) {
                                v[$scope.itemFlag] = true;
                            });
                        } else {
                            angular.forEach($scope.checkboxes, function (v, index) {
                                v[$scope.itemFlag] = false;
                            });
                        }
                    };

                    $scope.$watch('checkboxes', function () {
                        var allSet = true,
                            isNoneSelected = true;
                        angular.forEach($scope.checkboxes, function (v, index) {
                            if (v[$scope.itemFlag]) {
                                isNoneSelected = false;
                            } else {
                                allSet = false;
                            }
                        });

                        if ($scope.isAllSelected !== undefined) {
                            $scope.isAllSelected = allSet;
                        }
                        if ($scope.isNoneSelected !== undefined) {
                            $scope.isNoneSelected = isNoneSelected;
                        }

                        $element.prop('indeterminate', false);
                        if (allSet) {
                            $scope.master = true;
                        } else if (isNoneSelected) {
                            $scope.master = false;
                        } else {
                            $scope.master = false;
                            $element.prop('indeterminate', true);
                        }

                    }, true);
                }
            };
        })
        .directive('jqueryUiMultiSelect',['$rootScope','baseService',function($rootScope,baseService){
            var makeSelect=function(attrs){
                return '<select style="width:'+attrs.width+'" multiple="multiple" size="'+(attrs.size||5)+'"></select>';
            }
            return {
                restrict:'EA',
                //replace:true,
                template:function($ele,attrs){
                    //return "<div>hello world</div>";
                    var tpl=makeSelect(attrs);
                    console.log('jqueryUiMultiSelect的模板:',tpl);
                    return tpl;
                },
                scope:{

                    options:'@'
                },
                link:function($scope,$ele,attrs){

                    //var $uiSelect=null;

                    var hasInstance=false;
                    var $select=$(makeSelect(attrs));
                    var $pScope=baseService.getTargetScopeByModel($scope,attrs.options);
                    var fn=baseService.getDataByModel($pScope,attrs.selectedChangeFn),values=[];
                    //console.log('this is the $select:',$select.get(0));
                    var multiselect=function(data){
                        //var totalCount= 0,selectedCount=0;
                        var allValueStr=(function(){
                            var str='';
                            for(var i in data){
                                for(var j in data[i].items){
                                    str+=data[i].items[j].value+' ';
                                }
                            }
                            return str.trim();
                        })();




                        var str='';
                        for(var i in data){
                            var item=data[i];
                            str+='<optgroup label="'+item.labels+'">';
                            for(var j in item.items){
                                var subItem=item.items[j];
                                str+='<option'+(subItem.selected===true?' selected="selected"':'')+'>'+subItem.value+'</option>';

                                if(subItem.selected===true){
                                    values.push(subItem.value);
                                }
                            }
                            str+='</optgroup>';
                        }
                        $select.html(str);


                        console.log("this is the values:",values);
                        //return false;
                        //console.log("------select-------html:",$select.html(),values);
                        if(angular.isUndefined($.fn.multiselect)){
                            alert('jquery-ui-muti-select插件实例化失败，请检查所有相关的文件是否都已经引入，包括两个css文件和两个js文件');
                        }else{
                            if(!hasInstance){

                                $ele.replaceWith($select);
                                //console.log('$selecttttttttt:',$select.html())
                                $select.multiselect({
                                    noneSelectedText:'请选择',
                                    checkAllText:'全选',
                                    uncheckAllText:'全不选',
                                    selectedText:'# 个项目被选中',
                                    click: function(event, ui){
                                        baseService.toggleArrayElement(ui.value,values);
                                        fn(values.join(','));
                                    },
                                    checkAll: function(){
                                        values=allValueStr.split(' ');
                                        fn(values.join(','));
                                    },
                                    uncheckAll: function(){
                                        values=[];
                                        fn('');
                                    }
                                });
                                hasInstance=true;


                            }
                            else{

                                console.log("-------refresh");
                                $select.multiselect('refresh');
                            }
                        }
                    }

                    //console.log('--select scope:',$scope,attrs.options,$scope.$parent);



                    $pScope.$watch(function(){
                        return baseService.getDataByModel($pScope,attrs.options);
                    },function(nv){


                        if(angular.isArray(nv)){
                            multiselect(nv);
                        }
                        //console.log('select nv is:',nv,typeof(nv), angular.isArray(nv));
                    },true)
                }
                ,
                replace:true
            }
        }])
        .directive('laydate',['$rootScope','baseService',function($rootScope,baseService){
            return {
                restrict:'EA',
                //replace:true,
                template:function($ele,attrs){

                    return '<input ng-model="'+attrs.ngmodel+'">';
                },
                scope:{

                    ngmodel:'@'
                },
                link:function($scope,$ele,attrs){
                    var $pScope=baseService.getTargetScopeByModel($scope,$scope.ngmodel);
                    console.log('this is the p scope---laydate:',$pScope);
                    var id='laydate'+parseInt(Math.random()*10000);
                    $ele.attr({
                        id:id
                    }).on('mouseup keyup paste dragend',function(){
                        baseService.setDataByModel($pScope,attrs.ngmodel,$(this).val());
                        $pScope.$apply();
                    });




                    //$pScope.$watch(function(){
                    //    return baseService.getDataByModel($pScope,attrs.ngModel)
                    //},function(nv){
                    //    console.log('from pscrope,nv :',nv);
                    //    setTimeout(function(){
                    //        $ele.get(0).value=nv;
                    //    })
                    //})
                    //setTimeout(function())

                    laydate({
                        elem: '#'+id,
                        format: 'YYYY-MM-DD',
                        //min: laydate.now(),
                        max: '2099-06-16',
//            istime: true,
                        istoday: false,
                        choose: function(datas){
                            console.log('this is datas:',datas);
                            baseService.setDataByModel($pScope,attrs.ngmodel,datas);
                            $pScope.$apply();
                        }

                    })

                    var val=baseService.getDataByModel($pScope,attrs.ngmodel);
                    setTimeout(function(){
                        console.log('val is:',val);
                        $ele.get(0).value=val;
                    })
                },
                replace:true
            }
        }])
        .directive('datePicker',['$rootScope','baseService',function($rootScope,baseService){
            return {
                restrict:'EA',
                //replace:true,
                template:function($ele,attrs){

                    //<li><strong class="tit">{{msg}}：</strong>
                    // </li>

                    var tpl=baseService.tpl({
                        tpl:'<input onfocus="WdatePicker({dateFmt:'+'\''+attrs.format+'\''+'})" ng-focus="{{ngfocus}}" ng-model="{{ngmodel}}" type="text" class="form-control">',
                        data:attrs
                    });
                    console.log('tpl is:',tpl);
                    return tpl;
                },
                link:function($scope,$ele,attrs){
                    //$(document).click(function(e){
                    //    var $tar=$(e.target);
                    //    console.log('is WdayTable:',$tar.closest('.WdayTable').size())
                    //    if($tar.closest('.WdayTable').size()){
                    //        $ele.blur();
                    //    }
                    //})
                    $ele.blur(function(){
                        baseService.setDataByModel($scope,attrs.ngmodel,$(this).val());
                        $scope.$apply();
                    })
                },
                replace:true
            }
        }])
        .directive('radioGroups',['$rootScope','baseService',function($rootScope,baseService){
            return {
                restrict:'EA',
                template:function($ele,attrs){
                    console.log('attrs is:',attrs);
                    var labels=attrs.labels.split(','),values=attrs.values.split(',');
                    var str='';
                    for(var i in labels){
                        str+='<span><input type="radio" value="'+values[i]+'" ng-model="'+attrs.ngmodel+'"></span><label>'+labels[i]+'</label>';
                    }
                    var tpl=baseService.tpl({
                        tpl:'<li><strong class="tit">{{msg}}：</strong><div>'+str+'</div> </li>',
                        data:attrs
                    });
                    return tpl;
                },
                replace:true
            }
        }])
        .directive('noneSelectMsg',['$rootScope','baseService',function($rootScope,baseService){
            return {
                restrict:'A',
                link:function($scope,$ele,attrs){
                    console.log("ele is:",$ele,attrs);
                    var nodeName=$ele.get(0).nodeName.toLowerCase();
                    if(nodeName==='select'&&attrs.ngModel){
                        //var $pScope=baseService.getTargetScopeByModel($scope,$scope.ngModel);
                        $scope.$watch(function(){
                            return baseService.getDataByModel($scope,attrs.ngModel);
                        },function(nv){
                            if(nv===null||typeof(nv)==='undefined'||nv.trim()===''){
                                $ele.children().first().html(attrs.noneSelectMsg||'请选择');
                            }
                            //setTimeout(function(){
                            //    $s1.children().first().html()===''&&$s1.children().first().html('请选择');
                            //    $s2.children().first().html()===''&&$s2.children().first().html('请选择');
                            //    $s3.children().first().html()===''&&$s3.children().first().html('请选择');
                            //})
                        })
                    }
                    //$ele.find('input[type=number]').get(0).value=attrs.number;
                    //console.log('number size:',$ele.find('input[type=number]').size());
                }
                //template:function($ele,attrs){
                //    //console.log('attrs is:',attrs);
                //    var tpl=baseService.tpl({
                //        tpl:'<li><strong class="tit">{{msg}}：</strong><input value="{{value}}" ng-model="{{ngmodel}}" type="number" class="form-control"> </li>',
                //        data:attrs
                //    });
                //
                //    return tpl;
                //},
                //replace:true
            }
        }])
        .directive('number',['$rootScope','baseService',function($rootScope,baseService){
            return {
                restrict:'EA',
                template:function($ele,attrs){
                    //console.log('attrs is:',attrs);
                    var tpl=baseService.tpl({
                        tpl:'<li><strong class="tit">{{msg}}：</strong><input value="{{value}}" ng-model="{{ngmodel}}" type="number" class="form-control"> </li>',
                        data:attrs
                    });

                    return tpl;
                },
                //link:function($scope,$ele,attrs){
                //    $ele.find('input[type=number]').get(0).value=attrs.number;
                //    console.log('number size:',$ele.find('input[type=number]').size());
                //},
                replace:true
            }
        }])
            .directive('debuger',['$rootScope','baseService',function($rootScope,baseService){
            return {
                restrict:'EA',
                template:'<div><pre style="display:block;position:fixed;left:0;top:0;white-space:normal;max-height:400px;overflow:scroll;"></pre><div></div></div>',
                replace:true,
                scope:{
                    ngobj:'@'
                },
                controller:['$scope','$element',function($scope,$element){


                    var $p=baseService.getTargetScopeByModel($scope,$scope.ngobj);
                    $element
                        .on('dblclick',function(){
                            console.log($p[$scope.ngobj]);
                        })
                    var refresh=function(){
                        $element.find('pre').first()
                            .html(JSON.stringify($p[$scope.ngobj]));
                        setTimeout(function(){
                            $element.find('div').last().css({
                                marginTop:$element.find('pre').first().outerHeight()
                            })
                        })
                    };
                    refresh();
                    $p.$watch(function(){
                        return $p[$scope.ngobj];
                    },function(nv){

                        console.log(nv);
                        refresh();
                    },true)

                }]
            }
        }])
        .directive('texter',['$rootScope','baseService',function($rootScope,baseService){
            return {
                restrict:'EA',
                template:function($ele,attrs){
                    //console.log('attrs is:',attrs);
                    var tpl=baseService.tpl({
                        tpl:'<li><strong class="tit">{{msg}}：</strong><input placeholder="{{placeholder}}" ng-focus="{{ngfocus}}" ng-model="{{ngmodel}}" type="text" class="form-control"><span ng-transclude></span> </li>',
                        data:attrs
                    });
                    return tpl;
                },
                replace:true,
                transclude:true
                //,
                //link:function($scope,$ele,attrs){
                //    if(typeof(attrs.disabled!=='undefined')){
                //        console.log('textarea will be disabled')
                //        $ele.find('textarea').attr('disabled','disabled');
                //    }
                //    //$ele.find('textarea').get(0).value=attrs.number;
                //    //console.log('number size:',$ele.find('input[type=number]').size());
                //},
            }
        }])
        .directive('textareaer',['$rootScope','baseService',function($rootScope,baseService){
            return {
                restrict:'EA',
                template:function($ele,attrs){
                    var tpl=baseService.tpl({
                        tpl:'<li><strong class="tit">{{msg}}：</strong><textarea '+(typeof(attrs.disabled)==='undefined'?'':'disabled')+' ng-model="{{ngmodel}}" type="text" class="form-control"></textarea> </li>',
                        data:attrs
                    });
                    return tpl;
                },
                replace:true
            }
        }])
        .directive('upload',['$rootScope','$templateCache',function($rootScope,$templateCache){


            return {
                restrict:'EA',
                template:$templateCache.get('directives.tpl/upload.html'),
                scope:{
                    multi:'@',
                    url:'@',
                    type:'@',
                    ext:'@',
                    maxsize:'@',
                    width:'@',
                    height:'@',
                    btntext:'@',
                    key:'@',
                    srcmodel:'@',
                    srckey:'@',
                    auto:'@',
                    responseDataReader:'@',
                    maxImgWidth:'@',
                    maxImgHeight:'@'
                },
                transclude:true,
                replace:true,
                controller:['$scope','baseService','$rootScope','$element',function($scope,baseService,$rootScop,$element){
                    var bs=$scope.bs=baseService;

                    var $file=$element.find(':file').first();
                    if(typeof($rootScope.uploaderIndex)==='undefined'){
                        $rootScope.uploaderIndex=0;
                    }
                    $rootScope.uploaderIndex=$rootScope.uploaderIndex+1;
                    var uploaderIndex=$scope.uploaderIndex=$rootScope.uploaderIndex;//当前directive的实例的索引

                    var options={};
                    if(baseService.isNull($scope['url'])){
                        alert('url属性是必须的');
                        return false;
                    }
                    var defaultOptions={
                        multi:'1',
                        ext:'*',
                        maxsize:'1gb',
                        type:'*',
                        width:'*',
                        height:'*',
                        key:'file',
                        srcmodel:'',
                        srckey:'',
                        auto:'0',
                        responseDataReader:'',
                        maxImgWidth:'*',
                        maxImgHeight:'*'
                    }
                    for(var k in defaultOptions){
                        var v=defaultOptions[k];
                        if(baseService.isNull($scope[k])){
                            options[k]=v;
                        }else{
                            options[k]=$scope[k];
                        }
                    }
                    $scope.multi='1';
                    $scope.options=options;
                    console.log('options is:',options);

                    console.log('scopeeeeeeee is:',$scope);
                    //console.log('parent scope',$scope.$parent);
                    //$scope.$parent.CONFIG.UNPRIZE_PIC='1';

                    var isUploadImg=$scope.isUploadImg=['img','image'].indexOf(options.type.toLowerCase())!==-1;
                    var isUploadExcel=$scope.type.toLowerCase()==='excel';

                    function initUploaderStatus(){
                        $scope.percent=0;
                        $scope.isUploading=false;
                        $scope.imgSrcs=[];
                        $scope.uploadedFileNames=[];
                        $scope.tmpImgSrcs=[];//待上传的图片的src
                    }
                    initUploaderStatus();
                    $scope.file=$file.get(0);

                    //初始化文件域的多选状态
                    var init=function(){
                        var nv=options.multi;
                        console.log('nv is:',nv);

                        if(isUploadImg){
                            $file.attr('accept','image/*');
                        }
                        if(options.multi==='1'){
                            console.log('$file is:',$file);
                            $file.attr('multiple','multiple');
                        }else{
                            $file.removeAttr('multiple');
                        }
                    }



                    init();
                    $scope.multiY=function(e,index){
                        //var $file=$(e.target).closest('.dbx-uploader').find(':file').first();
                        $file.attr('multiple','multiple');
                        if(index===uploaderIndex){
                            $scope.multi='1';
                        }

                    }
                    $scope.multiN=function(e,index){
                        //var $file=$(e.target).closest('.dbx-uploader').find(':file').first();
                        $file.removeAttr('multiple');
                        if(index===uploaderIndex){
                            $scope.multi='0';
                        }

                    }
                    $file.on('change',function(){
                        $rootScope.$emit('selectedFileChange',$scope,options,$element);
                        var files=$file.get(0).files,len=files.length;
                        if(len===0){
                            return false;
                        }
                        console.log('files is:',files);
                        //检查扩展名
                        if(options.ext!=='*'){
                            var exts=options.ext.split(',');
                            for(var i=0;i<len;i++){
                                var file=files[i];
                                var ext=file.name.split('.').reverse()[0];
                                if(exts.indexOf(ext)===-1){
                                    var str='所选择的文件中包含扩展名非法的文件，文件扩展名必须为'+$scope.ext;
                                    alert(str);
                                    $rootScope.$emit('selectedFileExtInvalid',str,$scope,options,$element);
                                    $file.val('');
                                    files.length=0;

                                    return false;
                                }
                            }
                        }

                        //检查大小是否合法
                        var tmpMaxSize=options.maxsize;
                        tmpMaxSize=tmpMaxSize.toLowerCase();
                        var maxsize=parseInt(tmpMaxSize,10);
                        var map={
                            gb:1024*1024*1024,
                            mb:1024*1024,
                            kb:1024,
                            b:1
                        };
                        for(var i in map){
                            if(tmpMaxSize.indexOf(i)!==-1){
                                maxsize=maxsize*(map[i]);
                                break;
                            }
                        }
                        for(var i=0;i<len;i++){
                            var file=files[i];
                            if(file.size>maxsize){
                                var str='所选择的文件中包含大小超过最大值的文件，文件大小上限为'+tmpMaxSize;
                                console.warn(str);
                                $rootScope.$emit('selectedFileSizeInvalid',str,$scope,options,$element);
                                $file.val('');
                                files.length=0;

                                return false;
                            }
                        }

                        if(options.multi!=='1'){
                            initUploaderStatus();
                            $scope.$apply();
                        }
                        //读取图片文件
                        //console.log("isUploadImg",isUploadImg)
                        //console.log('file.length',$file.get(0).files)

                        var fileLen=$file.get(0).files.length;
                        var readIndex=0;

                        if(isUploadImg){



                            $scope.tmpImgSrcs=[];
                            var allowRead=true;
                            //console.log("hello world")
                            $.each(files,function(k,file){

                                var reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onload=function(e){
                                    var result=this.result;
                                    $('<img>')
                                        .attr({
                                            src:result
                                        }).load(function(){
                                            if(!allowRead){
                                                return false;
                                            }
                                            var w=this.width,h=this.height;

                                            console.log('w and h:',w,h)

                                            //检查图片的宽高
                                            var errmsg='',width=options.width,height=options.height;
                                            console.log('width and height',width,height,options)
                                            if(options.maxImgWidth==='*'){
                                                if(width!=='*'&&parseInt(width,10)!==w){
                                                    errmsg+='选择的图片中包含宽度不合法的图片，像素必须为'+width+';';
                                                }
                                            }else{
                                                if(parseInt(w,10)>parseInt(options.maxImgWidth,10)){
                                                    errmsg+='选择的图片宽度大于允许的最大宽度，最大宽度为'+options.maxImgWidth+';';
                                                }
                                            }

                                            if(options.maxImgHeight==='*'){
                                                if(height!=='*'&&parseInt(height,10)!==h){
                                                    errmsg+='\n选择的图片中包含长度不合法的图片，像素必须为'+width+';';
                                                }
                                            }else{
                                                if(parseInt(h,10)>parseInt(options.maxImgHeight,10)){
                                                    errmsg+='选择的图片宽度大于允许的最大宽度，最大宽度为'+options.maxImgHeight+';';
                                                }
                                            }


                                            //console.log('errmsg:',errmsg,errmsg==='');
                                            if(errmsg===''){
                                                readIndex++;
                                                if(readIndex===fileLen){
                                                    if(options.auto==='1'){
                                                        $scope.beginUpload();
                                                        return false;
                                                    }
                                                }
                                                $scope.tmpImgSrcs.push(result);
                                                $scope.$apply();
                                            }else{
                                                allowRead=false;
                                                $file.val('');
                                                files.length=0;
                                                $rootScope.$emit('imgSizeInvalid',errmsg,$scope,options,$element);
                                                $scope.$apply();
                                                return false;
                                            }


                                        })
                                }
                            })
                        }else{
                            $scope.$apply();
                            if(options.auto==='1'){
                                $scope.beginUpload();
                            }

                        }

                    });





                    $scope.chooseFiles=function(e){
                        $file.click();
                        //$(e.target).closest('.dbx-uploader').find(':file').first().click();
                    }
                    $scope.beginUpload=function(e){
                        if($scope.isUploading===true){
                            return false;
                        }
                        //var $file=$(e.target).closest('.dbx-uploader').find(':file').first(),files=$file.get(0).files;
                        var files=$file.get(0).files;

                        if(files.length===0){
                            return false;
                        }
                        var formData = new FormData();
                        var len=files.length;
                        if(len===1){
                            console.log('key is:',options.key);
                            formData.append(options.key,files[0]);
                        }else if(len>1){
                            for(var i in files){
                                formData.append('file'+(i+1),files[i]);
                            }
                        }
                        $scope.isUploading=true;

                        var xhr = new XMLHttpRequest();


                        $rootScope.$emit('uploadstart',$scope,options,$element);
                        xhr.open('post', $scope.url, true);

                        xhr.upload.onprogress = function(e) {
                            if (e.lengthComputable) {
                                var percentage = parseInt((e.loaded / e.total) * 100,10);
                                $scope.percent=percentage;
                                $rootScope.$emit('uploading',$scope,options,$element)
                                $scope.$apply();
                            }
                        };

                        xhr.onerror = function(e) {
                            var str='An error occurred while submitting the form. Maybe your file is too big';
                            console.warn(str);
                            $rootScope.$emit('uploadError',$scope,options,$element);
                        };

                        var ngModelArr=options.srcmodel.split('.'),arr0=ngModelArr.length>0?(ngModelArr[0]):null;
                        xhr.onload = function(){
                            for(var i in $scope.tmpImgSrcs){
                                $scope.imgSrcs.push($scope.tmpImgSrcs[i]);

                            }
                            for(var i= 0,len=$file.get(0).files.length;i<len;i++){
                                var item=$file.get(0).files[i];
                                $scope.uploadedFileNames.push(item.name);
                            }
                            $scope.tmpImgSrcs=[];
                            $file.val('');

                            $scope.$apply();
                            var res=JSON.parse(this.responseText);
                            console.log('res is:',res);


                            if(arr0!==null){
                                var $pScope=bs.getTargetScopeByModel($scope,options.srcmodel);
                                if(isUploadImg){



                                    var resSrc=bs.getDataByModel(res,options.srckey);
                                    console.log('res src is:',resSrc);
                                    if(resSrc!==null){
                                        if((options.multi==='0')&&($pScope!==null)){


                                            bs.setDataByModel($pScope,options.srcmodel,resSrc);
                                        }
                                    }
                                }
                                else if(isUploadExcel){
                                    if(options.responseDataReader!==''){
                                        var excelReader=bs.getDataByModel($pScope,options.responseDataReader);
                                        if($pScope!==null){
                                            bs.setDataByModel($pScope,options.srcmodel,excelReader(res,bs.getDataByModel($pScope,options.srcmodel)));
                                        }
                                        //console.log('excelReader is:',excelReader);
                                    }

                                }
                            }

                            $rootScope.$emit('uploadSuccess',res,$scope,options,$element);

                            setTimeout(function(){
                                $scope.isUploading=false;
                                $scope.percent=0;
                                $scope.$apply();
                            },1000);
                        }
                        console.log('file upload form data is:',formData);
                        xhr.send(formData);
                    }

                }]
            }
        }])
        .service('baseService',['$http','$rootScope','$q',function($http,$rootScope,$q){

            var o= $.extend(lib,{
                locker:function($this){
                    return {
                        isLocked:ng.isUndefined($this.data('isLocked'))?false:($this.data('isLocked')),
                        lock:function(){
                            $this.data('isLocked',true);
                            $rootScope.$emit('lockButton',$this);
                        },
                        unlock:function(){
                            $this.data('isLocked',false);
                            console.log('unlock---------------')
                            $rootScope.$emit('unlockButton',$this);
                        }
                    }
                },
                multiHttp:function(aRequests,cb){
                    var _this=this;
                    var dataArr=[],len=aRequests.length,index=0;
                    $.each(aRequests,function(k,v){
                        $http.get(v)
                            .success(function(data){
                                console.log('v and data:',v,data);
                                dataArr[k]=data;
                                index++;
                                if(index===len){
                                    cb.apply(_this,dataArr);
                                }
                            })
                    })
                }
            })
            //var o=;
            return o;
        }])

























































































        .directive('colorPicker',['$rootScope','$templateCache','baseService',function($rootScope,$templateCache,baseService){
            //console.log('$templateCache is:',$templateCache.get('directives.enhance.tpl/beautiful-radio-group.html'));
            return {
                restrict:'EA',
                template:$templateCache.get('directives.enhance.tpl/color-picker.html'),
                replace:true,
                scope:{

                },
                controller:['$scope',function($scope){

                    $scope.height='0';
                    $scope.toggleHeight=function(e){
                        var $tar=$(e.target);

                        if($scope.height==='0'){
                            $scope.height='auto';
                            $tar.next().next().next().css({
                                borderBottomWidth:'1px'
                            })
                        }else{
                            $scope.height='0';
                            $tar.next().next().next().css({
                                borderBottomWidth:'0px'
                            })
                        }
                    }
                    $scope.setColor=function(e){
                        var $tar=$(e.target),$b=$tar.parent().prev();
                        $b.css({
                            background:$tar.attr('v')
                        })
                        $b.attr({
                            v:$tar.attr('v'),
                            name:$tar.attr('name')
                        })
                        $scope.height='0';
                        $tar.prev().prev().css({
                            borderBottomWidth:'0px'
                        })
                        //$scope.$apply();
                    }
                }]
            }
        }])
        .directive('beautifulRadioGroup',['$rootScope','$templateCache','baseService',function($rootScope,$templateCache,baseService){
            return {
                restrict:'EA',
                template:$templateCache.get('directives.enhance.tpl/beautiful-radio-group.html'),
                scope:{
                    msg:'@',
                    labels:'@',
                    values:'@',
                    ngmodel:'@'
                },
                controller:['$scope','baseService','$rootScope','$element',function($scope,baseService,$rootScop,$element){
                    var bs=$scope.bs=baseService;
                    $scope.valueArr=$scope.values.split(',');
                    $scope.labelArr=$scope.labels.split(',');
                    var $pScope=bs.getTargetScopeByModel($scope,$scope.ngmodel);
                    $scope.currentValue=bs.getDataByModel($pScope,$scope.ngmodel);
                    $scope.correctValueIndex=$scope.valueArr.indexOf($scope.currentValue);
                    $scope.change=function(index){
                        //var $tar=$(e.target);
                        bs.setDataByModel($pScope,$scope.ngmodel,$scope.valueArr[index]);

                    }


                    $pScope.$watch(function(){
                        return bs.getDataByModel($pScope,$scope.ngmodel);
                    },function(nv){
                        console.log('from radio group  directive,nv is:',nv);
                        $scope.currentValue=nv;
                        $scope.correctValueIndex=$scope.valueArr.indexOf(nv);
                        console.log('$scope.correctValueIndex',$scope.correctValueIndex);
                    })

                    console.log('current value is:',$scope.currentValue);
                }],
                replace:true
            }
        }])

        .controller('baseController',['$scope','$http','$rootScope','$q','baseService','CONFIG',function($scope,$http,$rootScope,$q,baseService,CONFIG){
            var bs=$scope.bs=baseService,
                cfg=$scope.CONFIG=CONFIG;

            $.extend({
                warn: function (err,fn) {

                    var errStr;
                    if(ng.isString(err)){
                        errStr=err;
                    }
                    else if(ng.isArray(err)){
                        errStr=err.join('\n');
                    }else if(ng.isObject(err)){
                        if(!ng.isUndefined(err.errMsg)){
                            errStr=err.errMsg;
                        }
                        else if(!ng.isUndefined(err.errCode)){
                            errStr=err.errCode;
                        }else{
                            errStr='系统繁忙，请稍后再试';
                        }
                    }

                    swal({
                        title: "发生了一些错误",
                        text: errStr,
                        type: "warning",
                        showCancelButton: false,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确定"
                    }, function () {
                        if(fn){
                            fn();
                        }
                    });
                },
                success: function (msg,fn) {
                    swal({
                        title: msg,
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "rgb(174, 222, 244)",
                        confirmButtonText: "确定"
                    }, function () {
                        if(fn){
                            fn();
                        }
                    });
                    $rootScope.$emit('formDataUpdateSuccess');
                }
            })


            $scope.isUILock=false;
            $rootScope.$on('lockButton',function(){
                $scope.isUILock=true;
            })
            $rootScope.$on('selectedFileChange',function(){
                $scope.isUILock=true;
            })
            $rootScope.$on('pageLoading',function(){
                $scope.isUILock=true;
            })
            $rootScope.$on('pageLoaded',function(){
                $scope.isUILock=false;
                $rootScope.isPageLoaded=true;
            })
            $rootScope.$on('requesting',function(){
                $scope.isUILock=true;
            })
            $rootScope.$on('requestEnd',function(){
                $scope.isUILock=false;
            })



            $rootScope.$on('unlockButton',function(){
                $scope.isUILock=false;
            })
            $rootScope.$on('formDataUpdateSuccess',function(){
                $scope.isUILock=false;
            })
            $rootScope.$on('uploadSuccess',function(){
                $scope.isUILock=false;
            })
            $rootScope.$on('uploadError',function(){
                $scope.isUILock=false;
            })
            $rootScope.$on('selectedFileSizeInvalid',function(){
                $scope.isUILock=false;
            })
            $rootScope.$on('imgSizeInvalid',function(oEvent,errMsg){
                $scope.isUILock=false;
                $.warn(errMsg);
            })


            $scope.$watch('isUILock',function(nv){
                console.log('ui锁,nv is:',nv);
            })


        }])









})(jQuery,angular);
if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        var _=require('underscore');
    }
}
/*
 调用参考:
 var $scope={};
 $scope.formData = {
 a: '',
 b: '',
 c: '',
 d: '',
 e: [],
 f: '',
 g: ''
 };
 var obj = {

 a: {
 name: '抽奖名称',
 type: 'string',
 rules: bs.lenRule('抽奖名称')
 },
 b: {
 name: '抽奖开始时间',
 type: 'date',
 format: 'y/m/d h:i:s'
 },
 c: {
 name: '抽奖失效时间',
 type: 'date',
 format: 'y/m/d h:i:s'
 },
 d: {
 type: 'int',
 name: '红包总数'
 },
 e: {
 type: 'array',
 name: '选择红包',
 rules: [
 [
 function (val) {
 return val.length > 0;
 },
 '请选择至少一个红包'
 ]
 ]
 },
 f: {
 type: 'string',
 name: '抽奖开关',
 rules: [
 [
 function (val) {
 return ['1', '0'].indexOf(val) !== -1;
 },
 '抽奖开关未选择或者非法'
 ]
 ]
 },
 _additionalRules: [
 [
 function () {
 return new Date(this.c).getTime() - new Date(this.b).getTime() > 0;
 },
 '抽奖结束时间不能小于开始时间哦'
 ]
 ]
 };
 var handleValidateResult = function (result) {
 if (result.status === 'ERROR') {
 swal(result.err.join('\n'));
 已经废除，改用angular $emit//locker.unlock();
 } else {
 var isUpdate = ms.isUpdate();
 var formData = $.getFormDataByMap(_.clone($scope.formData), {
 a: 'title',
 b: 'begin_time',
 c: 'expire_time',
 d: 'total',
 e: 'redIds',
 f: 'onoff',
 g: 'desc'
 });
 formData.begin_time=new Date(formData.begin_time).getTime();
 formData.expire_time=new Date(formData.expire_time).getTime();
 console.log('formData is:', formData);
 bs.http(ms.ajaxConfig[isUpdate === true ? 'saveUpdatedRedPkgActivity' : 'saveNewRedPkgActivity'], function (data) {
 location.href = ms.urlConfig.redPkgActivityList;
 }, 'post', formData).finally(function () {
 已经废除，改用angular $emit//locker.unlock();
 });
 }
 }

 $.validate(obj, $scope.formData, handleValidateResult);
 */
(function(global){
    function validate(checkRules,formData,cb,skipClientValidate){


        if(skipClientValidate===true){
            cb({
                status:'OK',
                formData:formData
            });
            return false;
        }

        var _additionalRules= _.isUndefined(checkRules._additionalRules)?null:checkRules._additionalRules;
        //if(_additionalRules!==null){
        //    delete checkRules._additionalRules;
        //    //console.log('checkRules is:',checkRules);
        //}
        var err=[];
        if(_.isUndefined(checkRules)){
            err.push('校验规则不能为空');
        }else{
            if(!_.isObject(checkRules)){
                err.push('校验规则必须是一个js对象');
            }
        }
        if(_.isUndefined(formData)){
            err.push('表单数据不能为空');
        }else{
            if(!_.isObject(formData)){
                err.push('表单数据必须是一个js对象');
            }
        }
        var isDate=function(txtDate)
        {
            var currVal = txtDate;
            if(currVal == '')
                return false;

            var rxDatePattern = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/; //Declare Regex
            var dtArray = currVal.match(rxDatePattern); // is format OK?

            if (dtArray == null)
                return false;

            //Checks for mm/dd/yyyy format.
            dtMonth = dtArray[3];
            dtDay= dtArray[5];
            dtYear = dtArray[1];

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
        }
        var isDateTime=function(str,format){
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
        }


        for(var ii in checkRules){
            if(ii==='_additionalRules'){
                continue;
            }
            var val=formData[ii],item=checkRules[ii];

            //console.log('!_.isUndefined(val)',!_.isUndefined(val))
            //console.log('(_.isObject(checkRules))',(_.isObject(checkRules)));
            //console.log('(_.isObject(item))',(_.isObject(item)));

            if(
                (_.isObject(checkRules))
                &&(_.isObject(item))
            ){
                if(!_.isUndefined(item.setVal)){
                    if(
                        (_.isFunction(item.setVal.set))
                        &&(_.isString(item.setVal.reference))
                    ){
                        var setVal=item.setVal;
                        if(_.isUndefined(setVal.reference)){
                            err.push('setVal必须包含一个reference');
                            break;
                        }else{
                            var reference=setVal.reference;
                            if(!_.isString(reference)){
                                err.push('setVal必须包含一个reference,且reference必须是字符串类型');
                                break;
                            }else{
                                var isReferenceExist=function(){
                                    var result=false;
                                    for(var kkk in formData){
                                        if(kkk===reference){
                                            result=true;
                                            break;
                                        }
                                    }
                                    return result;
                                }
                                if(!isReferenceExist()){
                                    err.push('setVal中包含的reference--'+reference+'并不存在');
                                    break;
                                }
                            }
                        }
                        val=item.setVal.set.call(checkRules,formData[reference]);
                        formData[ii]=val;
                    }else{

                        err.push('setVal策略有问题，请仔细检查');
                        break;
                    }
                }
            }else{
                err.push('表单校验规则配置有问题');
                break;
            }


        }

        if(err.length>0){
            if(!_.isUndefined(cb)){
                if(_.isFunction(cb)){
                    cb({
                        status:'ERROR',
                        err:err,
                        formData:formData
                    });
                }else{
                    err.push('第三个参数必须是一个回调函数');
                }

            }

            return false;
        }

        for(var i in checkRules){
            if(i==='_additionalRules'){
                continue;
            }
            var val=formData[i],item=checkRules[i];
            if(_.isUndefined(val)){
                if(_.isUndefined(item.setVal)){
                    err.push('表单中不存在'+i+'的校验项目');
                    break;
                }

            }
            if(!_.isObject(item)){
                err.push('校验规则必须是一个对象')
            }else{
                if(_.isUndefined(item.name)){
                    if(_.isUndefined(item.showError)||(item.showError===true)){
                        err.push('k为'+i+'的校验项目缺少name属性');
                        break;
                    }

                }
                else if(_.isUndefined(item.type)){
                    err.push('k为'+i+'的校验项目缺少type属性');
                    break;
                }
            }
            //console.log('val item checkRules:',val,item,checkRules);
            if(!_.isUndefined(item.setVal)){
                if(!_.isObject(item.setVal)){
                    err.push('setVal必须是一个object类型');
                    break;
                }else{
                    var setVal=item.setVal;
                    if(_.isUndefined(setVal.reference)){
                        err.push('setVal必须包含一个reference');
                        break;
                    }else{
                        var reference=setVal.reference;
                        if(!_.isString(reference)){
                            err.push('setVal必须包含一个reference,且reference必须是字符串类型');
                            break;
                        }else{
                            var isReferenceExist=function(){
                                var result=false;
                                for(var k in formData){
                                    if(k===reference){
                                        result=true;
                                        break;
                                    }
                                }
                                return result;
                            }
                            if(!isReferenceExist()){
                                err.push('setVal中包含的reference--'+reference+'并不存在');
                                break;
                            }else{

                                if(_.isUndefined(setVal.set)){
                                    err.push('setVal必须包含一个set方法');
                                    break;
                                }else{
                                    if(!_.isFunction(setVal.set)){
                                        err.push('setVal包含的set方法必须是一个function');
                                        break;
                                    }
                                    //else{
                                    //    val=item.setVal.set.call(checkRules,formData[reference]);
                                    //    formData[i]=val;
                                    //}
                                }
                            }
                        }
                    }
                }
            }

            var check_rule=function(){
                if(!_.isUndefined(item.rules)){
                    if(!_.isArray(item.rules)){
                        err.push('规则列表必须是数组');
                    }else{
                        for(var j in item.rules){
                            var rule=item.rules[j];
                            if(rule.length<2){
                                err.push('每一项校验规则里必须有一个校验方法和一个出错提示信息');
                            }else{
                                if(!_.isFunction(rule[0])){
                                    err.push('每一项校验规则的第一项必须是一个function且返回true或者false');
                                }else{
                                    if(!_.isString(rule[1])){
                                        err.push('每一项规则里第二项必须是一个字符串类型的提示信息');
                                    }else{
                                        //console.log('vallllllll',val)
                                        if(rule[0].call(formData,val)!==true){
                                            err.push(rule[1]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }


            if(!_.isUndefined(val)){
                if(val===null){
                    if(_.isUndefined(item.showError)||(item.showError===true)){
                        err.push(item.name+'不能为空');
                    }
                }else{
                    if(_.isUndefined(item.type)){
                        err.push('没有声明'+item.name+'字段的类型');
                    }
                    if(_.isUndefined(item.name)){
                        if(_.isUndefined(item.showError)||(item.showError===true)){
                            err.push('没有声明'+item.name+'字段的名称');
                        }

                    }
                    if(item.type==='int'){
                        if(item.allowNull===true){
                            check_rule();
                        }else{
                            if(_.isString(val)&&val.trim()===''){
                                err.push(item.name+'不能为空');
                            }
                            else if(isNaN(val)){
                                err.push(item.name+'必须是整数');
                            }
                            else{
                                check_rule();
                            }
                        }

                    }
                    else if(item.type==='string'){
                        if(!_.isString(val)){
                            err.push(item.name+'必须是字符串类型');
                        }
                        else if(val.trim()===''){
                            if(_.isUndefined(item.showError)||(item.showError===true)){
                                err.push(item.name+'不能为空');
                            }

                        }else{
                            check_rule();
                        }
                    }
                    else if(item.type==='date'){
                        if(!_.isString(val)){
                            err.push(item.name+'必须是字符串类型');
                        }
                        else if(val.trim()===''){
                            if(_.isUndefined(item.showError)||(item.showError===true)){
                                err.push(item.name+'不能为空');
                            }

                        }else{
                            if(item.format==='y-m-d'){
                                if(!isDate(val)){
                                    err.push(item.name+'不符合日期类型')
                                }else{
                                    check_rule();
                                }
                            }else if(item.format==='y-m-d h:i:s'){
                                if(!isDateTime(val,'y-m-d h:i:s')){
                                    err.push(item.name+'不符合日期类型')
                                }else{
                                    check_rule();
                                }
                            }else if(item.format==='y/m/d h:i:s'){
                                if(!isDateTime(val,'y/m/d h:i:s')){
                                    err.push(item.name+'不符合日期类型')
                                }else{
                                    check_rule();
                                }
                            }
                        }
                    }else if(item.type==='array'){
                        if(!_.isArray(val)){
                            err.push(item.name+'必须是array类型');
                        }else{
                            check_rule();
                        }
                    }


                }



            }else{
                if(_.isUndefined(item.showError)||(item.showError===true)){
                    err.push(item.name+'不能为空');
                }

            }
        }
        //验证_additionalRules
        if(_additionalRules!==null){


            if(!_.isArray(_additionalRules)){
                err.push('全局规则列表必须是数组');
            }else{
                for(var j in _additionalRules){
                    var rule=_additionalRules[j];
                    if(rule.length<2){
                        err.push('全局规则每一项校验规则里必须有一个校验方法和一个出错提示信息');
                    }else{
                        if(!_.isFunction(rule[0])){
                            err.push('全局规则每一项校验规则的第一项必须是一个function且返回true或者false');
                        }else{
                            if(!_.isString(rule[1])){
                                err.push('全局规则每一项规则里第二项必须是一个字符串类型的提示信息');
                            }else{
                                //console.log('vallllllll',val)
                                if(rule[0].call(formData)!==true){
                                    err.push(rule[1]);
                                }
                            }
                        }
                    }
                }
            }

        }


        var result;
        if(err.length===0){
            result={
                status:'OK',
                formData:formData
            }
        }else{
            result={
                status:'ERROR',
                err:err,
                formData:formData
            }
        }

        if(!_.isUndefined(cb)){
            if(_.isFunction(cb)){
                cb(result);
            }else{
                err.push('第三个参数必须是一个回调函数');
            }

        }
    }


    if ("function" === typeof define && define.amd){
        define('V', [], function(){
            return validate;
        });
    }
    else if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            module.exports=validate;
        }
    } else {
        if(typeof(jQuery)==='undefined'){
            global.V=validate;
        }else{
            jQuery.extend({
                V:validate
            })
        }

    }
})(this);
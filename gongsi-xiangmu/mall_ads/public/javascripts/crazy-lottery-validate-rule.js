(function(){
    var lenRule=function(name,minL,maxL){//兼容validate.js的长度检测
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
    }


    var rule={
        p: {
            name: '中奖概率',
            type: 'int'
        },
        total_num:{
            name:'奖品数量',
            type:'int'
        },
        //total_count:{
        //    name:'中奖次数',
        //    type:'int'
        //},
        _additionalRules: [
            [
                function () {

                    return true;
                },
                ''
            ]
        ]
    };
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            module.exports=rule;
        }
    } else {
        define(function(){
            return rule;
        })
    }
})();

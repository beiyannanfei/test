(function(){
    var lenRule=function(name,minL,maxL,allowSpecialWords){//兼容validate.js的长度检测
        minL=minL||1;
        maxL=maxL||8;
        allowSpecialWords=allowSpecialWords||false;
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
                    if(allowSpecialWords){
                        return true;
                    }else{
                        return new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_])*$").test(val);
                    }

                },
                name+'格式错误，请不要包含特殊字符'
            ]
        ];
    }


    var rule={

        WX_RED:{

            send_name: {
                name: '商户名称',
                type: 'string',
                rules: lenRule('商户名称')
            },
            name: {
                name: '红包名称',
                type: 'string',
                rules: lenRule('红包名称')
            },
            hb_type: {
                name: '红包类型',
                type: 'string',
                rules: [
                    [
                        function (val) {
                            return ['GROUP', 'NORMAL'].indexOf(val) !== -1;
                        },
                        '红包类型未选择或者非法'
                    ]
                ]
            },
            total_amount: {
                type: 'int',
                name: '红包总金额',
                rules: [
                    [
                        function (val) {
                            return val >= 1;
                        },
                        '红包总金额必须大于等于1'
                    ]
                ]
            },
            total_num: {
                type: 'int',
                name: '红包发放总人数',
                allowNull:true,
                rules: [
                    [
                        function (val) {
                            if(this.hb_type==='NORMAL'){
                                return true;
                            }
                            val = parseInt(val, 10);

                            return (this.hb_type !== 'GROUP') || (this.hb_type === 'GROUP') && (val > 1);
                        },
                        '裂变红包的发放总人数必须大于1'
                    ],[
                        function(val){
                            if(this.hb_type==='NORMAL'){
                                return true;
                            }
                            val = parseInt(val, 10);

                            return val<=20;
                        },
                        '红包发放总人数必须小于20人'
                    ]
                ]
            },
            wishing: {
                type: 'string',
                name: '红包祝福语',
                rules: lenRule('红包祝福语', 1, 32,true)
            },
            act_name: {
                name: '活动名称',
                type: 'string',
                rules: lenRule('活动名称', 1, 8)
            },
            remark: {
                name: '备注',
                type: 'string',
                rules: lenRule('备注', 1, 64)
            },
            _additionalRules: [
                [
                    function () {
                        if(this.hb_type==='NORMAL'){
                            return true;
                        }
                        var total = this.total_amount;
                        var num = this.total_num;
                        var res = total / num;
                        return res >= 0.01 && res <= 4999.00;
                    },
                    '人均红包数目必须在0.01元到4999.00元之间.'
                ], [
                    function () {

                        return (this.hb_type !== 'GROUP') || (this.hb_type === 'GROUP') && (this.total_amount >= 1 && this.total_amount <= 20);
                    },
                    '裂变红包的红包总人数必须在1至20之间'
                ], [
                    function () {
                        if(this.hb_type==='NORMAL'){
                            return true;
                        }
//                                    console.log('this.total_amount this.total_num:',this.total_amount,this.total_num);
                        return parseInt(this.total_amount) >= parseInt(this.total_num);
                    },
                    '红包总数必须大于红包总人数'
                ]
            ]

        }
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

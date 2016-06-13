function parseDate (val) {
  var date = new Date(val)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  if(month < 10)
    month = '0'+ month
  if(day < 10)
    day = '0' + day

  return year + '-' + month+ '-' + day
}

var vm
var mobileVm

setTimeout(function () {
  mobileVm = $('#mobileIframe')[0].contentWindow.vm
}, 2000)

if(urlParam.id)  {
  $.get('/admin/coupon/'+urlParam.id+'/detail')
    .done(function (data) {
      if(data.status !== 'success')
        return $.util.error('获取数据失败'+ data.errMsg)

      data = data.data

      setMobildVm(data)

      vm = new Vue({
        el: '#app',
        data: {
          name: data.name,
          pic: data.pic,
          count: data.count,
          value: data.value,
          beginDate: parseDate(data.beginDate),
          endDate: parseDate(data.endDate),
          desc: data.desc,
          usePriceLimit: 0,
          useGoods: data.useGoods,
          limit: 0,
          jump_url: data.jump_url,
          tips: data.tips || '购买立即抵扣,不限额'
        },
        computed: {
          uuid: function () {
            return urlParam.id
          }
        },
        methods: {
          subform: function () {
            subForm()
          }
        },
        ready: function () {
          initFileItem()
          initDate()
        }
      })
      watchParam()
    })
    .fail(function () {
      $.util.error('获取数据失败')
    })
}else {
  vm = new Vue({
    el: '#app',
    data: {
      name: '',
      pic: '',
      count: '',
      value: '',
      beginDate: '',
      endDate: '',
      desc: '',
      usePriceLimit: 0,
      useGoods: ['all'],
      limit: 0,
      jump_url: '',
      tips: '购买立即抵扣,不限额'
    },
    computed: {
      uuid: function () {
        return urlParam.id
      }
    },
    methods: {
      subform: function () {
        subForm()
      }
    },
    ready: function () {
      initFileItem()

      initDate()
    }
  })

  watchParam()
}

function watchParam() {
  vm.$watch('name', function (n, o) {
    mobileVm.name = n
  })

  vm.$watch('pic', function (n, o) {
    mobileVm.pic = n
  })

  vm.$watch('value', function (n, o) {
    mobileVm.value = n
  })

  vm.$watch('beginDate', function (n, o) {
    mobileVm.beginDate = n.split(' ')[0]
  })

  vm.$watch('endDate', function (n, o) {
    mobileVm.endDate = n.split(' ')[0]
  })

  vm.$watch('jump_url', function (n, o) {
    mobileVm.jump_url = n
  })

  vm.$watch('desc', function (n, o) {
    mobileVm.desc = n
  })

  vm.$watch('tips', function (n, o) {
    mobileVm.tips = n || '购买立即抵扣,不限额'
    if(!n){
      this.tips = '购买立即抵扣,不限额'
    }
  })
}


function initFileItem() {
  var upload = new WebUploader.create({
    auto: true,
    server: '/image/upload',
    pick: {
      id: '#couponFile',
      multiple: false
    },
    resize: false,
    accept: {
      title: 'Images',
      extensions: 'gif,jpg,jpeg,bmp,png',
      mimeTypes: 'image/*'
    },
    duplicate: true
  })

  upload.on('uploadSuccess', function (rs, data) {
    if (data.state.toLowerCase() !== 'success')
      return $.util.error(rs.name + ' 上传失败' + data.errMsg)
    vm.pic = data.url
  })

}

function subForm() {
  if(!vm.name)
    return $.util.error('请填写优惠券名称')
  if(!vm.pic)
    return $.util.error('请上传图片')
  if(vm.count == '')
    return $.util.error('请填写发放总量')
  if(!vm.value)
    return $.util.error('请填写面值')
  if(!vm.beginDate)
    return $.util.error('请填写生效时间')
  if(!vm.endDate)
    return $.util.error('请填写过期时间')
  if(!vm.jump_url)
    return $.util.error('请填写跳转链接')

  if(+new Date(vm.endDate) <= +new Date(vm.beginDate)) {
    return $.util.error('过期时间需要大于生效时间')
  }

  var $beginDate = +new Date(vm.$data.beginDate)
  var $endDate = +new Date(vm.$data.endDate)

  var postParam = JSON.parse(JSON.stringify(vm.$data))
  postParam.beginDate = $beginDate
  postParam.endDate = $endDate

  var postUrl = '/admin/coupon/create'
  if(urlParam.id) {
    postUrl += '?id='+urlParam.id
  }
  $.post(postUrl, postParam)
    .done(function (data) {
      if(data.status !== 'success')
        return $.util.error('保存失败'+data.errMsg)

      $.util.success('保存成功')

      location.href = 'coupon.html'
    })

}

function setMobildVm(data) {
  setTimeout(function () {
    mobileVm = $('#mobileIframe')[0].contentWindow.vm
    mobileVm.name = data.name
    mobileVm.pic = data.pic
    mobileVm.value = data.value
    mobileVm.beginDate = parseDate(data.beginDate)
    mobileVm.endDate = parseDate(data.endDate)
    mobileVm.jump_url = data.jump_url
    mobileVm.desc = data.desc
    mobileVm.tips = data.tips || '购买立即抵扣,不限额'
  }, 2000)
}

function initDate() {
  $('.datetimepicker').datetimepicker({
    language: 'zh-CN',
    weekStart: 1,
    todayBtn: 1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    forceParse: 0,
    minView: 0,
    format: 'yyyy-mm-dd hh:ii:ss'
  })
}
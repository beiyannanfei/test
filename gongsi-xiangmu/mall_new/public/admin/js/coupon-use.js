var sexMap = {
  '0': '未知',
  '1': '男',
  '2': '女'
}
Vue.filter('sexmap', function (val) {
  return sexMap[val]
})

var vm = new Vue({
  el: '#app',
  data: {
    search: {
      name: ''
    },
    isload: false,
    name: urlParam.name,
    tableData: {
      count: 0,
      result: []
    },
    page: {
      loading: false,
      pageIndex: 1,
      jumpPage: ''
    }
  },
  methods: {
    refresh: function () {
      if(this.page.loading)
        return

      this.page.loading = true

      var parm = {
        page: this.page.pageIndex
      }

      $.get('/admin/coupon/getusedlist', {
        pageIndex: this.page.pageIndex -1,
        couponId: urlParam.id
      }).done(function (data) {
        if(data.status !== 'success') return $.util.error('获取数据失败')

        vm.tableData.result = data.data.datas
        if(!vm.isload){
          vm.tableData.count = data.data.count
          vm.isload = true
        }

      }).always(function () {
        vm.page.loading = false
      })
    },
    prevPage: function () {
      if(this.page.pageIndex == 1)
        return

      this.page.pageIndex--

      //this.page.isSearch = false
      this.refresh()
    },
    nextPage: function () {
      if(this.page.pageIndex == this.allPage)
        return

      this.page.pageIndex++
      //this.page.isSearch = false
      this.refresh()
    },
    jump: function () {
      var num = ~~this.page.jumpPage
      if(num < 1 || num > this.allPage) {
        return
      }

      //this.page.isSearch = false
      this.page.pageIndex = num
      this.page.jumpPage = ''
      this.refresh()
    }
  },
  computed: {
    allPage: function () {
      if(this.tableData.count == 0) return 1
      return Math.ceil(this.tableData.count / 20)
    }
  }
})

vm.refresh()
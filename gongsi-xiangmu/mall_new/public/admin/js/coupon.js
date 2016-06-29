var vm = new Vue({
  el: '#app',
  data: {
    search: {
      name: ''
    },
    tableData: {
      count: 0,
      result: []
    },
    page: {
      loading: false,
      pageIndex: 1,
      isSearch: true,
      jumpPage: ''
    }
  },
  methods: {
    searchAction: function () {
      this.page.isSearch = true
      this.page.pageIndex = 1
      this.refresh()
    },
    copyLink: function (item) {
      prompt('',item.link)
    },
    refresh: function () {
      if(this.page.loading)
        return

      this.page.loading = true

      var parm = {
        page: this.page.pageIndex
      }

      $.get('/admin/coupon/list', {
        page: this.page.pageIndex - 1,
        name: this.search.name || null
      }).done(function (data) {
        if(data.status !== 'success') return $.util.error('获取数据失败')
        if(vm.isSearch){
          vm.$set('tableData', data.data)
        }
        else{
          vm.tableData.count = data.data.count
          vm.tableData.result = data.data.result
        }
      }).always(function () {
        vm.page.loading = false
      })
    },
    prevPage: function () {
      if(this.page.pageIndex == 1)
        return

      this.page.pageIndex--

      this.page.isSearch = false
      this.refresh()
    },
    nextPage: function () {
      if(this.page.pageIndex == this.allPage)
        return

      this.page.pageIndex++
      this.page.isSearch = false
      this.refresh()
    },
    jump: function () {
      var num = ~~this.page.jumpPage
      if(num < 1 || num > this.allPage) {
        return
      }

      this.page.isSearch = false
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
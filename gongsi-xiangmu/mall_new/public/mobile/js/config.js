/**
 * 前后端分离server或者其他的配置文件， 部署时差异就在这里
 * 部署时把其中的qa测试环境server注释掉即可
 */
var HOST

switch (location.host) {
  case 'q.cdn.mtq.tvm.cn':               // production
    HOST = {
      staticServer: 'http://q.cdn.mtq.tvm.cn/tmall/data/coupon',                         // 静态文件存放地址
      server: 'http://tmall.mtq.tvm.cn',   // 咱们自己的接口
      userServer: 'http://mb.mtq.tvm.cn'    // 获取用户积分和手机号，用于是否需要注册
    }
    break;
  case 'tmall.mtq.tvm.cn':               // production
    HOST = {
      staticServer: 'http://q.cdn.mtq.tvm.cn/tmall/data/coupon',                         // 静态文件存放地址
      server: 'http://tmall.mtq.tvm.cn',   // 咱们自己的接口
      userServer: 'http://mb.mtq.tvm.cn'    // 获取用户积分和手机号，用于是否需要注册
    }
    break;
  case 'qa.tmall.mtq.tvm.cn':                // qa
    HOST = {
      staticServer: 'http://qa.tmall.mtq.tvm.cn/pic/data/coupon',
      server: 'http://qa.tmall.mtq.tvm.cn',
      userServer: 'http://qa.mb.mtq.tvm.cn'
    }
    break;
  case 'mall.dev.tvm.cn':   //dev
    HOST = {
      server: 'http://mall.dev.tvm.cn',
      userServer: 'http://mb.dev.tvm.cn'
    }
    break;
  default :                             // 默认localhost
    HOST = {
      server: '',
      userServer: 'http://mb.dev.tvm.cn'
    }
    break;
}





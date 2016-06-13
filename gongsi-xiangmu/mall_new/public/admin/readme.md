优惠券接口

### 1: 列表页面:
  /admin/coupon/list
  
  参数:
  page
  name

  返回的数据结构
  
  
  设置失效接口
  /coupon/disable/:id 
  
  
### 2: 新建编辑页面:
  /admin/coupon/create
  如果是更新 需要加上?id=
  
  /admin/coupon/:id/detail
  
  POST  
  
  数据结构:
  {
    id        
    name                名字
    pic                 图片
    count               发放数量      int > 0
    value               面值          float > 0
    limit               每人限领      int 毫秒数
    beginDate           生效时间      int 毫秒数
    endDate             过期时间      int 毫秒数
    desc                使用说明
    usePriceLimit       订单使用金额
    useGoods: ['all', 'id']     数组,   all代表全店通用    id:  商品id, 可以有多个
    tips                使用提示  
  }
  
  
### 3: 已使用列表页面: 
  /admin/
  
  

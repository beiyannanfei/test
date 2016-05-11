/*
 db.exchangeorder.count({externalOrder: {$exists: 0}, wxOrderState: {$in: [2,6,7]}, dateTime: {$gte: new Date(2016,0,25), $lt: new Date(2016,0,26)}});

 var datas = db.exchangeorder.find({externalOrder: {$exists: 0}, wxOrderState: {$in: [2,6,7]}, dateTime: {$gte: new Date(2016,0,25), $lt: new Date(2016,0,26)}});
 var total = 0;
 var wxPay = 0;
 while (datas.hasNext()) {var order = datas.next();var total_fee = +(order ? (order.payResult ? order.payResult.total_fee : 0) : 0);wxPay += total_fee;total += +(order.totalPrice || 0);}
 print(wxPay);
 print(total);
已支付
日期      订单笔数，订单微信金额，订单总金额
1-11        50      291291      291291
1-12        71      317273      317273
1-13        78      324880      324880
1-14        86      381742      381742
1-15        77      307300      307300
1-16        47      277980      277980
1-17        85      417822      417822
1-18        181     851109      974219
1-19        170     789788      1027988
1-20        152     853016      1175616
1-21        108     414871      449071
1-22        156     674704      1103404
1-23        90      431659      515559
1-24        95      383689      579589
1-25        12      49289       78589

db.exchangeorder.count({externalOrder: {$exists: 0}, wxOrderState: {$in: [4,8,9]}, dateTime: {$gte: new Date(2016,0,22), $lt: new Date(2016,0,23)}});
退款
日期      订单笔数，订单微信金额，订单总金额
1-11        0       0           0
1-12        1       2100        2100
1-13        0       0           0
1-14        0       0           0
1-15        3       20800       20800
1-16        0       0           0
1-17        0       0           0
1-18        5       28120       28120
1-19        0       0           0
1-20        1       4500        4500
1-21        2       17800       17800
1-22        1       17800       17800
1-23        0       0           0
1-24        0       0           0
1-25        0       0           0
*/
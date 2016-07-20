/*收银程序V1.0*/

/*定义输入*/
var price1 = 15;	//商品1的单价
var count1 = 3;		//商品1的购买数量
var price2 = 10;
var count2 = 2;
var money = 100;	//顾客提供的钱

/*执行计算*/
var total = price1*count1 + price2*count2; //总价
var change = money - total;				//找零


/*程序输出*/
console.log('商品总价：'+total);
console.log('找零金额：'+change);



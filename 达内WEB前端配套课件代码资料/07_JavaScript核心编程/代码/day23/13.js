//请选择您需要的服务：
var  choice = 0;

/*
if(choice==1){
	console.log('正在为您查询余额...');
}else if(choice==2){
	console.log('正在为您充值...');
}else if(choice==0){
	console.log('人工转接中...');
}else{
	console.log('不存在该选项');
}
*/
switch( choice ){
	case 1:
		console.log('用户选择的是1...');
		console.log('正在为您查询余额...');
		break; //打断switch语句的继续执行
	case 2:
		console.log('用户选择的是2...');
		console.log('正在为您充值...');
		break;
	case 0:
		console.log('用户选择的是0...');
		console.log('正在为您转接人工服务...');
		break;
	default:
		console.log('用户选择的是其它值...');
		console.log('不存在该选项...');
}

console.log('switch判定结束....')
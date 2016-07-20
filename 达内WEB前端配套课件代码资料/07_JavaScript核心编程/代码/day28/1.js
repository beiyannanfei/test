var balance = 100000;		//账户余额
const WITHDRAW_LIMIT = 20000;	//常量

/**
自定义的错误对象，表示取款金额大于取款上限
*/
function WithdrawLimitError(nm, msg){
	this.name = nm;
	this.message = msg;
}
WithdrawLimitError.prototype = new Error();


//功能性需求：能从余额中减去待取的金额
//非功能性需求：性能、可用性、安全性
function withdraw( money ){
	if( typeof(money) !== 'number' ){
		//服务器访问、作日志、用户提示——冲淡了业务方法
		throw new Error('Money Is Not a Number');  //把错误对象抛出
	}
	if( money<=0 ){
		throw 'Money Can not <= Zero';
	}
	if( money > balance ){
		throw 9901;		//throw true;
	}
	if( money > WITHDRAW_LIMIT ){
		throw new WithdrawLimitError('LimitError','Money Can not > Limit');
	}
	balance -= money;	//核心功能
	console.log('待取金额已经从余额中减除了')
	return balance;
}

/*
console.log( withdraw(100) );
console.log( withdraw(200) );
*/
try{
	console.log('开始试着取款...')
	console.log( withdraw(300) );
	//console.log( withdraw('abc') );
	//console.log( withdraw(-100) );
	//console.log( withdraw(2000) );
	//console.log( withdraw(20001) );
	return;
	console.log('取款操作结束...')
}catch( err ){
	//与业务逻辑无关的非功能性需求
	//服务器访问、作日志、用户提示....
	console.log('程序运行过程中，捕捉到一个错误：')
	console.log('Error Name:'+err.name);
	console.log('Error Message:'+err.message);
}finally{
	console.log('请取卡...');
}

console.log('程序运行结束了....');
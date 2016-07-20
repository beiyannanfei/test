var person1 = {
			name:'无名2',
			work:function(){
				console.log(this.name+'在工作');
			}
		};

var emp1 = {
			/*name:'暂定',
			work:function(){
				console.log(this.name+'在工作');
			},*/
			salary: 5000
	};
//更改对象的原型，即修改对象的父对象
Object.setPrototypeOf(emp1,person1);  
console.log(emp1.salary);
console.log(emp1.name);
emp1.work();

var coder1 = {
			/*name: '老张',
			work:function(){
				console.log(this.name+'在工作');
			},
			salary:8000,*/
			debug:function(){
				console.log(this.name+'在调试程序');
			}
	};
console.log();
Object.setPrototypeOf(coder1,  emp1);
console.log(coder1.name);
coder1.work();
console.log(coder1.salary);
coder1.debug();

//原型链：coder1 => emp1 => person1 => xx

var account1 = {
			/*name:'小王',
			work:function(){
				console.log(this.name+'在工作');
			},
			salary: 6000,*/
			calc:function(){
				console.log(this.name+'在算账');
			}
	};
console.log();
Object.setPrototypeOf(account1, emp1);
console.log(account1.name);
console.log(account1.salary);
account1.work();
account1.calc();
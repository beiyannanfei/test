var emp1 = null;
var emp3 = new Object();
var emp2 = {  
				ename:'John',
				salary:3500 ,
				"for": '搞研发',
				'job title': '副总工程师',
				work:function(){
					return this.ename+'在搞研究';
				},
				getSalary:gs
		   };
function gs(){
	return this.ename+'在领工资:'+this.salary;
}

console.log(emp2.ename);
console.log(emp2['salary']);
console.log(emp2['for']);
console.log(emp2["job title"]);
console.log( emp2.work() );
console.log( emp2.getSalary() );



console.log( emp1 );
console.log( emp2 );
console.log( emp3 );
var emp = {
	monthSalary: 5000,
	get yearSalary(){
		return this.monthSalary*12;
	},
	set yearSalary(value){
		this.monthSalary = value/12;
	}
};


var stu = {
	chinese: 95,
	math: 85,
	get total(){
		return this.chinese+this.math;
	}
};

console.log( stu.total );
//stu.total = 275;
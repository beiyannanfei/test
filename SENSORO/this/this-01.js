/**
 * Created by wyq on 17/7/14.
 * JS中this关键字详解
 */
function person() {
	this.name = "xl";
	console.log(this);  //global
	console.log(this.name);
}
person();
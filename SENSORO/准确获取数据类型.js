/**
 * Created by wyq on 17/10/30.
 */
function type_of(o) {
	return Object.prototype.toString.call(o).match(/^\[.* (.*)\]$/)[1].toLowerCase();
}

console.log(type_of({}));               //object
console.log(type_of([]));               //array
console.log(type_of(""));               //string
console.log(type_of(.1));               //number
console.log(type_of(false));            //boolean
console.log(type_of(null));             //null
console.log(type_of());                 //undefined
console.log(type_of(undefined));        //undefined
console.log(type_of(/x/));              //regexp
console.log(type_of(function () {
}));                                    //function
console.log(type_of(Symbol()));         //symbol







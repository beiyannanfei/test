var product = {price:1000, sell:function(){}};

var tv = Object.create(product);
var dc = Object.create(product);

tv.size = '56寸';
tv.play = function(){};
dc.pixels = '1000万';

//delete tv.size;
//delete dc.pixels;
//delete tv.price;	//删除原型属性无效

console.log(tv.size);
console.log(tv.price);
console.log(dc.pixels);
console.log(dc.price);
console.log();

//使用for...in遍历对象中的所有成员
//for(var propertyName in tv){
	//console.log(propertyName+'=>'+tv[propertyName]);
//}

console.log( tv.hasOwnProperty('size') );
console.log( tv.hasOwnProperty('price') );
console.log(  );

//使用for..in循环遍历出所有的自有属性
for(var p in tv){
	if(tv.hasOwnProperty(p)){	//判定p属性是否为自有属性
		console.log(p+'=>'+tv[p]);
	}
}

function getAmount(){
	return this.price * this.count;
}
function getPublishedDays(){
	var now = new Date().getTime(); //
	var pub = this.pubDate.getTime();
	return Math.round( (now-pub)/(1000*3600*24) );
}

var b1 = {};
b1.bookName = '三国演义';
b1.price = 30;
b1.pubDate = new Date('2010-5-5');
b1.count = 3;
b1.getAmount = getAmount;
b1.getPublishedDays = getPublishedDays;

var b2 = {
			bookName:'水浒传',
			price:40,
			pubDate:new Date('2011-6-6'),
			count:4,
			getAmount:getAmount,
			getPublishedDays:getPublishedDays
		 };
console.log(b1.bookName);
console.log(b1.price);
console.log(b1.pubDate);
console.log(b1.count);
console.log(b1.getAmount());
console.log(b1.getPublishedDays());
console.log();
console.log(b2.bookName);
console.log(b2.price);
console.log(b2.pubDate);
console.log(b2.count);
console.log(b2.getAmount());
console.log(b2.getPublishedDays());
console.log();

//使用for/in循环遍历对象中的所有属性
for( var attr  in  b2 ){
	console.log( attr + "=>" + b2[attr]);
}
console.log(  );



console.log( 'price' in b2 );
console.log( 'price2' in b2 );
console.log( 'getAmount' in b2 );
console.log( 'getamount' in b2 );

console.log( b2.hasOwnProperty('count') );
console.log( b2.hasOwnProperty('count2') );
console.log( b2.hasOwnProperty('getAmount') );


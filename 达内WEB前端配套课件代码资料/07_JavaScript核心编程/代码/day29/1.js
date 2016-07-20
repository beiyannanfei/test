/*网上书城中涉及到的对象*/

var book1 = {
	bname:'三国',
	price: 35,
	pubdate:new Date('2010-10-20'),
	commentList:[
					comment1,
					comment2
				]
};

var book2= {
	bname:'水浒',
	price: 45,
	pubdate:new Date('2011-11-21'),
	commentList:[]
};

console.log(book1);
console.log(book2);


var user1 = {
	uname:'tom',
	upwd:'123456',
	registerTime: new Date(),
	commentList:[
					comment1
				]
};
var user2 = {
	uname:'mary',
	upwd:'456789',
	registerTime: new Date(),
	commentList:[
					comment2
				]
};

console.log(user1);
console.log(user2);

var comment1 = {
	publisher: user1,
	forBook: book1,
	pubTime: new Date(),
	content:'这本书我看过，很经典'
};
var comment2 = {
	publisher: user2,
	forBook: book1,
	pubTime: new Date(),
	content:'这本书我也看过'
};

console.log(comment1);
console.log(comment2);

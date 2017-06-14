/**
 * Created by wyq on 16/10/8.
 */
const esClient = require("./esClient.js").esClient;

function findAll() {
	let condition1 = {
		"query": {
			"match_all": {}
		}
	};
	esClient.search(condition1, function (err, val) {
		console.log(val);
		console.log(val.hits.hits);
	});
}

function deleteOne(body) {
	esClient.delete(body, function (err, response) {
		console.log(arguments);
	});
}

// findAll();
deleteOne({
	index: "city-es",
	type: "logs",
	id: 2
});

/*
 var a = [
 {
 _index: 'website',
 _type: 'blog',
 _id: '123',
 _score: 1,
 _source: {
 title: 'My first blog entry',
 text: 'Just trying this out...',
 date: '2014/01/01'
 }
 },
 {
 _index: 'website',
 _type: 'blog',
 _id: 'AVeoVKurEikJYrqac9t8',
 _score: 1,
 _source: {
 title: 'My second blog entry',
 text: 'Still trying this out...',
 date: '2014/01/01'
 }
 },
 {
 _index: 'megacorp',
 _type: 'employee',
 _id: '2',
 _score: 1,
 _source: {
 first_name: 'Jane',
 last_name: 'Smith',
 age: 32,
 about: 'I like to collect rock albums',
 interests: [Object]
 }
 },
 {
 _index: 'megacorp',
 _type: 'employee',
 _id: '4',
 _score: 1,
 _source: {title: 'foo'}
 },
 {
 _index: 'megacorp',
 _type: 'employee',
 _id: '1',
 _score: 1,
 _source: {
 first_name: 'John',
 last_name: 'Smith',
 age: 25,
 about: 'I love to go rock climbing',
 interests: [Object]
 }
 },
 {
 _index: 'megacorp',
 _type: 'employee',
 _id: '3',
 _score: 1,
 _source: {
 first_name: 'Douglas',
 last_name: 'Fir',
 age: 35,
 about: 'I like to build cabinets',
 interests: [Object]
 }
 }
 ];*/


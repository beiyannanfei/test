"use strict";
const client = require("./esClient.js").esClient;
const async = require("async");

//生成20条文档
function create20Doc() {
	let index = 0;
	async.whilst(function () {
		return index < 20;
	}, function (cb) {
		++index;
		client.create({
			index: "myindex",
			type: "mytype",
			id: index,
			body: {
				number: Math.random()
			}
		}, function (err, response) {
			console.log(index, response);
			setTimeout(cb, 1000, err);
		});
	}, function (err) {
		console.log("============= finish =============");
	});
}

//查询所有文档
function findAll() {
	let condition = {
		index: "myindex",
		type: "mytype",
		body: {}
	};
	client.search(condition, function (err, response) {
		// console.log(response);
		// console.log(response.hits.total);
		console.log("%j", response.hits.hits);
	});
}

//分页
function paging() {
	let condition = {
		index: "myindex",
		type: "mytype",
		body: {
			from: 10,
			size: 3
		}
	};
	client.search(condition, function (err, response) {
		console.log(response);
		console.log(response.hits.total);
		console.log(response.hits.hits);
	});
}

//查询所有文档
function matchAll() {
	let condition = {
		body: {
			query: {
				match_all: {}
			}
		}
	};
	client.search(condition, function (err, response) {
		console.log(arguments);
		console.log(response.hits);
		console.log(response.hits.total);
		console.log(response.hits.hits.length);
		console.log(response.hits.hits[0]);
	});
}

//查询子句
function subQuery() {
	let condition = {
		index: "myindex",
		type: "mytype",
		body: {
			query: {
				match: {number: 0.2930520085911965}
			}
		}
	};
	client.search(condition, function (err, response) {
		console.log(arguments);
		console.log(response.hits.hits);
	});
}

//精确匹配
function termQuery() {
	let condition = {
		index: "myindex",
		type: "mytype",
		body: {
			query: {
				term: {number: 0.2930520085911965}
			}
		}
	};
	client.search(condition, function (err, response) {
		console.log(arguments);
		console.log(response);
		console.log(response.hits.hits);
	});
}

//删除全部
function deleteAll() {
	let condition = {
		body: {
			query: {
				match_all: {}
			},
			from: 0,
			size: 1000
		}
	};
	client.search(condition, function (err, response) {
		console.log(arguments);
		console.log(response.hits);
		console.log(response.hits.total);
		console.log(response.hits.hits.length);
		console.log("================================");
		async.eachSeries(response.hits.hits, function (item, cb) {
			client.delete({
				index: item._index,
				type: item._type,
				id: item._id
			}, function (err, resp) {
				console.log("delete res: %j", arguments);
				setTimeout(cb, 500);
			});
		}, function (err) {
			console.log("======= delete finish");
		});
	});
}

function createOneDoc(doc, cb) {
	client.create(doc, function (err, response) {
		return cb ? cb(err, response) : "";
	});
}

function mustQuery() {
	createOneDoc({
		index: "myindex",
		type: "mytype",
		body: {
			a: "abc",
			b: 138,
			c: {
				c1: 8,
				c2: "A"
			}
		}
	}, function (err, val) {
		console.log("argus: %j", arguments);
		let condition = {
			index: "myindex",
			type: "mytype",
			body: {
				query: {
					filtered: {
						filter: {
							bool: {
								must: [
									{term: {a: "abc"}},
									{term: {"c.c1": 8}},
									{range: {b: {gt: 137}}}
								]
							}
						}
					}
				}
			}
		};
		setTimeout(function () {
			client.search(condition, function (err, response) {
				console.log("search args: %j", arguments);
			});
		}, 1000);
	});
}

function updateTest() {
	createOneDoc({
		index: "myindex",
		type: "mytype",
		body: {
			a: "abc",
			b: 138
		}
	}, function (err, val) {
		console.log("create argus: %j", arguments);
		let updoc = {
			index: "myindex",
			type: "mytype",
			id: val._id,
			body: {
				// doc: {c: "asdf"}
				script: 'ctx._source.b += tag',
				params: {tag: 5}
			}
		};
		client.update(updoc, function (err, response) {
			if (!!err) {
				return console.log(err.message);
			}
			console.log("update argus: %j", arguments);
			setTimeout(findAll, 1000);
		});
	});
}

function bulkTest() {
	let condition = {
		body: [
			{index: {_index: "myindex1", _type: "mytype1"}},
			{a: 10, b: "abc"},  //向myindex1的mytype1表中插入数据
			{index: {_index: "myindex2", _type: "mytype2"}},  //插入多条数据
			{c: "cde", d: 987}
		]
	};
	client.bulk(condition, function (err, response) {
		console.log("%j", arguments);
	});
}

function mgetTest() {
	let doc = {
		body: [
			{index: {_index: "myindex1", _type: "mytype1", _id: 1}},
			{a: 123, b: "abc"},
			{index: {_index: "myindex2", _type: "mytype2", _id: 2}},
			{c: "def", d: 456}
		]
	};
	client.bulk(doc, function (err, response) {
		if (!!err) {
			return console.log(err.message);
		}
		console.log("response: %j", response);
		let condition = {
			body: {
				docs: [
					{_index: "myindex1", _type: "mytype1", _id: 1},
					{_index: "myindex2", _type: "mytype2", _id: 2}
				]
			}
		};
		client.mget(condition, function (err, val) {
			if (!!err) {
				return console.log(err.message);
			}
			console.log("val: %j", val);
		});
	});
}

function mgetBody() {
	let doc = {
		body: [
			{index: {_index: "myindex1", _type: "mytype1", _id: 1}},
			{a: 123, b: "abc"},
			{index: {_index: "myindex1", _type: "mytype1", _id: 2}},
			{a: 456, b: "def"}
		]
	};
	client.bulk(doc, function (err, response) {
		if (!!err) {
			return console.log(err.message);
		}
		console.log("response: %j", response);
		let condition = {
			index: "myindex1",
			type: "mytype1",
			body: {ids: [1, 2]}
		};
		client.mget(condition, function (err, val) {
			if (!!err) {
				return console.log(err.message);
			}
			console.log("val: %j", val);
		});
	});
}

function msearchTest() {
	let doc = {
		body: [
			{index: {_index: "myindex1", _type: "mytype1"}},
			{a: 123, b: "abc"},
			{index: {_index: "myindex1", _type: "mytype1"}},
			{a: 456, b: "def"},
			{index: {_index: "myindex2", _type: "mytype2"}},
			{c: "a", d: 1, e: "a"},
			{index: {_index: "myindex2", _type: "mytype2"}},
			{c: "b", d: 2, e: "a"},
			{index: {_index: "myindex2", _type: "myindex2"}},
			{c: "c", d: 3, e: "a"}
		]
	};
	client.bulk(doc, function (err, response) {
		if (!!err) {
			return console.log(err.message);
		}
		console.log("response: %j", response);
		let condition = {
			body: [
				{},
				{query: {match_all: {}}},                 //匹配所有文档(所有index的所有type)
				{_index: "myindex2", _type: "mytype2"},
				{query: {query_string: {query: "a"}}},    //匹配myindex2/mytype2 中有字段值为a的文档
				{_index: "myindex1", _type: "mytype1"},
				{query: {match: {b: "abc"}}},             //精确匹配
				{_index: "myindex2", _type: "mytype2"},
				{query: {filtered: {filter: {range: {d: {gt: 2}}}}}}, //过滤myindex2/mytype2 中d大于2的字段
				{_index: "myindex2", _type: "mytype2"},
				{query: {filtered: {filter: {bool: {must: [{term: {e: "a"}}, {range: {d: {gt: 2}}}]}}}}}] //多条件过滤
		};
		setTimeout(() => {
			client.msearch(condition, function (err, val) {
				if (!!err) {
					return console.log(err.message);
				}
				console.log("val: %j", val);
			});
		}, 1000);
	});
}

function aggsSumTest() {//聚合求和
	let doc = {
		body: [
			{index: {_index: "myindex1", _type: "mytype1"}},
			{a: 1, b: "a"},
			{index: {_index: "myindex1", _type: "mytype1"}},
			{a: 2, b: "b"},
			{index: {_index: "myindex1", _type: "mytype1"}},
			{a: 3, b: "c"}
		]
	};
	client.bulk(doc, function (err, response) {
		if (!!err) {
			return console.log(err.message);
		}
		console.log("response: %j", response);
		let condition = {
			index: "myindex1",
			type: "mytype1",
			body: {
				aggs: {
					mySum: {sum: {field: "a"}}    //聚合求和
				}
			}
		};
		setTimeout(() => {
			client.search(condition, function (err, val) {
				if (!!err) {
					return console.log(err.message);
				}
				console.log("val: %j", val);
			});
		}, 1000);
	});
}

function aggsMinTest() {//聚合取最小值
	let doc = {
		body: [
			{index: {_index: "myindex1", _type: "mytype1"}},
			{a: 1, b: "a"},
			{index: {_index: "myindex1", _type: "mytype1"}},
			{a: 1, b: "a1"},
			{index: {_index: "myindex1", _type: "mytype1"}},
			{a: 2, b: "b"},
			{index: {_index: "myindex1", _type: "mytype1"}},
			{a: 3, b: "c"}
		]
	};
	client.bulk(doc, function (err, response) {
		if (!!err) {
			return console.log(err.message);
		}
		console.log("response: %j", response);
		let condition = {
			index: "myindex1",
			type: "mytype1",
			body: {
				aggs: {
					myMinValue: {min: {field: "a"}}
				}
			}
		};
		setTimeout(() => {
			client.search(condition, function (err, val) {
				if (!!err) {
					return console.log(err.message);
				}
				console.log("val: %j", val);
			});
		}, 1000);
	});
}

function aggsMaxTest() {
	let doc = {
		body: [
			{index: {_index: "myindex1", _type: "mytype1"}},
			{a: 1, b: "a"},
			{index: {_index: "myindex1", _type: "mytype1"}},
			{a: 2, b: "b"},
			{index: {_index: "myindex1", _type: "mytype1"}},
			{a: 4, b: "c"}
		]
	};
	client.bulk(doc, function (err, response) {
		if (!!err) {
			return console.log(err.message);
		}
		console.log("response: %j", response);
		let condition = {
			index: "myindex1",
			type: "mytype1",
			body: {
				aggs: {
					myMaxValue: {max: {field: "a"}}
				}
			}
		};
		setTimeout(() => {
			client.search(condition, function (err, val) {
				if (!!err) {
					return console.log(err.message);
				}
				console.log("val: %j", val);
			});
		}, 1000);
	});
}

function aggsAvgTest() {
	let doc = {
		body: [
			{index: {_index: "myindex1", _type: "mytype1"}},
			{a: 1, b: "a"},
			{index: {_index: "myindex1", _type: "mytype1"}},
			{a: 2, b: "b"},
			{index: {_index: "myindex1", _type: "mytype1"}},
			{a: 3, b: "c"},
			{index: {_index: "myindex1", _type: "mytype1"}},
			{a: 4, b: "d"}
		]
	};
	client.bulk(doc, function (err, response) {
		if (!!err) {
			return console.log(err.message);
		}
		console.log("%j", response);
	});
}
// deleteAll();



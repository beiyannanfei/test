/**
 * Created by wyq on 17/6/15.
 * 如果没有mytest01、mytest02两个索引和数据,调用z00_准备数据.js插入数据到es
 */
"use strict";
const client = require("./esClient.js").esClient;

//如果没有 must 语句，那么至少需要能够匹配其中的一条 should 语句。但，如果存在至少一条 must 语句，则对 should 语句的匹配没有要求
let conEg1 = {
	index: "",
	type: "",
	body: {
		//下面的查询用于查找 title 字段匹配 how to make millions 并且不被标识为 spam 的文档。那些被标识为 starred 或在2014之后的文档，将比另外那些文档拥有更高的排名。如果 _两者_ 都满足，那么它排名将更高
		query: {
			bool: {
				must: {match: {title: "how to make millions"}},
				must_not: {match: {tag: "spam"}},
				should: [
					{match: {tag: "starred"}},
					{range: {date: {gte: "2014-01-01"}}}
				]
			}
		}
	}
};

//如果我们不想因为文档的时间而影响得分，可以用 filter 语句来重写前面的例子
let conEg2 = {
	index: "",
	type: "",
	body: {
		query: {
			bool: {
				must: {match: {title: "how to make millions"}},
				must_not: {match: {tag: "spam"}},
				should: [
					{match: {tag: "starred"}}
				],
				filter: {   //在filter中的条件要精确匹配且不影响评分
					range: {date: {gte: "2014-01-01"}}
				}
			}
		}
	}
};

let conEg3 = {
	index: "",
	type: "",
	body: {
		query: {
			bool: {
				must: {match: {title: "how to make millions"}},
				must_not: {match: {tag: "spam"}},
				should: [
					{match: {tag: "starred"}}
				],
				filter: {
					bool: {
						must: [
							{range: {date: {gte: "2014-01-01"}}},
							{range: {price: {lte: 29.99}}}
						],
						must_not: [
							{term: {category: "ebooks"}}
						]
					}
				}
			}
		}
	}
};


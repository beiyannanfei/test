/**
 * Created by wyq on 17/6/20.
 */
"use strict";
const client = require("./esClient.js").esClient;

let body1 = {
	query: {
		bool: {
			must: { //content 字段必须包含 full 、 text 和 search 所有三个词
				match: {
					content: {
						query: "full text search",
						operator: "and"
					}
				}
			},
			should: [ //如果 content 字段也包含 Elasticsearch 或 Lucene ，文档会获得更高的评分 _score
				{
					match: {content: "Elasticsearch"}
				},
				{
					match: {content: "Lucene"}
				}
			]
		}
	}
};

let body2 = {//通过指定 boost 来控制任何查询语句的相对的权重， boost 的默认值为 1 ，大于 1 会提升一个语句的相对权重
	query: {
		bool: {
			must: {
				match: {
					content: {  //这些语句使用默认的 boost 值 1 。
						query: "full text search",
						operator: "and"
					}
				}
			},
			should: [
				{
					match: {  //这条语句更为重要，因为它有最高的 boost 值。
						content: {
							query: "Elasticsearch",
							boost: 3
						}
					}
				},
				{
					match: {  //这条语句比使用默认值的更重要，但它的重要性不及 Elasticsearch 语句。
						content: {
							query: "Lucene",
							boost: 2
						}
					}
				}
			]
		}
	}
};



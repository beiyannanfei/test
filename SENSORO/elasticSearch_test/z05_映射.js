/**
 * Created by wyq on 17/6/14.
 * 如果没有mytest01、mytest02两个索引和数据,调用z00_准备数据.js插入数据到es
 */
"use strict";
const client = require("./esClient.js").esClient;
const superagent = require('superagent');

// put http://localhost:9200/gb   //gb为index名称
let struct = {
	"mappings": {
		"tweet": {  //type
			"properties": {   //字段属性
				"date": {
					"type": "date"    //日期类型
				},
				"bool": {
					"type": "boolean" //布尔型
				},
				"num_float": {
					"type": "float"   //浮点型
				},
				"num_double": {
					"type": "double"  //浮点型
				},
				"num_byte": {
					"type": "byte"    //字节
				},
				"num_short": {
					"type": "short"   //短整型
				},
				"num_interger": {
					"type": "integer" //整形
				},
				"num_long": {
					"type": "long"    //长整形
				},
				"str_analyzed": {
					"type": "string",       //字符串类型
					"index": "analyzed"     //首先分析字符串，然后索引它。换句话说，以全文索引这个域
				},
				"str_not_analyzed": {
					"type": "string",       //字符串类型
					"index": "not_analyzed"     //索引这个域，所以可以搜索到它，但索引指定的精确值。不对它进行分析
				},
				"str_no": {
					"type": "string",       //字符串类型
					"index": "no"           //不索引这个域。这个域不会被搜索到
				},
				"obj": {
					"type": "object",   //对象类型
					"properties": {
						"obj_1": {
							"type": "long"
						}
					}
				},
				"lonlat": {
					"type": "geo_point"   //经纬度
				}
				//关于数组:所以ElasticSearch不需要指定一个映射是一个数组。您可以使用方括号将任何映射视为数组：
			},
			"_ttl": {   //定时过去  s:秒 m/M:分 d:天 (注意es版本支持)
				enable:true,
				default: "100s"
			}
		}
	}
};

superagent.put("http://localhost:9200/gb")
	.send(struct)
	.accept("text/json")
	.end(function (err, xhr) {
		if (!!err) {
			return console.log("http err: %j", err.message || err);
		}
		if (xhr.statusCode != 200) {
			return console.log("statusCode err: %j", xhr.statusCode);
		}
		if (!xhr.body) {
			return console.log("no xhr.body, xhr: %j", xhr);
		}
		let body;
		try {
			body = JSON.parse(xhr.text);
		}
		catch (e) {
			console.log(e.message);
			body = xhr.text;
		}
		return console.log("success body: %j", body);
	});

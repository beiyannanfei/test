/**
 * Created by wyq on 17/6/20.
 */
"use strict";
const client = require("./esClient.js").esClient;


let body1 = {
	query: {
		bool: {
			should: [
				{match: {title: "War and Peace"}},
				{match: {author: "Leo Tolstoy"}}
			]
		}
	}
};

let body2 = {
	query: {
		bool: {
			should: [
				{match: {title: "War and Peace"}},
				{match: {author: "Leo Tolstoy"}},
				{
					bool: {
						should: [
							{match: {translator: "Constance Garnett"}},
							{match: {translator: "Louise Maude"}}
						]
					}
				}
			]
		}
	}
};

let body3 = {
	query: {
		bool: {
			should: [
				{
					match: {
						title: {
							query: "War and Peace",
							boost: 2
						}
					}
				},
				{
					match: {
						author: {
							query: "Leo Tolstoy",
							boost: 2
						}
					}
				},
				{
					bool: {
						should: [
							{match: {translator: "Constance Garnett"}},
							{match: {translator: "Louise Maude"}}
						]
					}
				}
			]
		}
	}
};
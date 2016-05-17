/**
 * Created by wyq on 2016/5/10.
 */

var Q = require('q');
var _ = require('underscore');
var mongoUtils = require("./mongoUtils.js");

module.exports = function (mongo) {
	return new client(mongo);
}

var client = function (mongo) {
	this.mongo = mongo;
	this.bindAll();
};

client.prototype.bindAll = function () {
	var self = this;
	var mongoCommand = [
		"insert", "save", "findOne", "findById", "find", "count", "update", "updateById", "findAndModify",
		"removeById", "remove", "aggregate", "drop", "distinct"
	];
	mongoCommand.forEach(command => {
		var lowerCommand = command.toString().toLowerCase();
		var upperCommand = command.toString().toUpperCase();
		self[command] = Q.nbind(self.mongo[command], self.mongo);
		self[lowerCommand] = Q.nbind(self.mongo[command], self.mongo);
		self[upperCommand] = Q.nbind(self.mongo[command], self.mongo);
	});
};

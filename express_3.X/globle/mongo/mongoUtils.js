/**
 * Created by wyq on 2016/5/9.
 */
var db = require('./mongo.js');
var _ = require('underscore');
var mongoskin = require('mongoskin');
var ObjectID = mongoskin.ObjectID;
var deepcopy = require("deepcopy");
var GridStore = mongoskin.GridStore;

var strIdCollections = [];

function dbUtils(collection, slave) {
	this.collection = collection;
	this.slave = slave
	if (slave) {
		this.curDb = db.slaveDb;
	}
	else {
		this.curDb = db.masterDb;
	}
	this.curDb.bind(this.collection);
}
dbUtils.ObjectID = ObjectID;
dbUtils.GridStore = GridStore;
dbUtils.db = db;

dbUtils.toId = function (id) {
	if (_.isArray(id)) {
		var arr = [];
		_.each(id, function (o) {
			if (!(o instanceof ObjectID)) {
				o = o.toString();
				arr.push(new ObjectID(o));
			}
			else {
				arr.push(o);
			}
		})
		return arr;
	}
	if (!(id instanceof ObjectID)) {
		id = id.toString();
		return new ObjectID(id);
	}
	return id
}

dbUtils.isValidId = function (id) {
	if (/^[0-9a-zA-Z]{24}$/.test(id)) {
		return true;
	}
	else {
		return false;
	}
}

dbUtils.id2Str = function (id) {
	if (_.isArray(id)) {
		var arr = [];
		_.each(id, function (o) {
			arr.push(o.toString());
		})
		return arr;
	}
	return id.toString();
}

function obj2str(obj) {
	for (var k in obj) {
		if (_.isString(obj[k])) {
			continue;
		}
		if (_.isRegExp(obj[k])) {
			obj[k] = obj[k].toString();
			continue;
		}
		obj2str(obj[k]);
	}
}

dbUtils.prototype = {
	insert: function (docs, callback) {
		var thisDb = this.curDb;
		thisDb[this.collection].insert(docs, callback)
	},
	save: function (doc, callback) {
		var thisDb = this.curDb;
		thisDb[this.collection].save(doc, function (err, o) {
			return callback(err, doc)
		})
	},
	findOne: function (spec, options, callback) {
		var collection = this.collection;
		var thisDb = this.curDb;
		if (!_.contains(strIdCollections, collection)) {
			if (spec._id && !(_id instanceof ObjectID)) {
				spec._id = new ObjectID(spec._id);
			}
		}
		if (_.isFunction(options)) {
			callback = options;
			options = {};
		}
		thisDb[collection].findOne(spec, options, function (err, db_result) {
			return callback(err, db_result);
		});
	},
	findById: function (_id, options, callback) {
		if (_.isFunction(options)) {
			callback = options;
			options = {};
		}

		var collection = this.collection;
		var thisDb = this.curDb;
		if (_.contains(strIdCollections, collection)) {
			_id = _id.toString();
		}
		else {
			if (!(_id instanceof ObjectID)) {
				if (!dbUtils.isValidId(_id)) {
					return callback("id is invalid");
				}
				_id = new ObjectID(_id);
			}
		}

		thisDb[collection].findById(_id, options, function (err, db_result) {
			return callback(err, db_result);
		});
	},
	find: function (spec, field, options, callback) {
		var collection = this.collection;
		var thisDb = this.curDb;

		if (spec._id) {
			if (_.contains(strIdCollections, collection)) {
				if (spec._id['$in'] && _.isArray(spec._id['$in'])) {
					spec._id['$in'] = dbUtils.id2Str(spec._id['$in']);
				}
				else {
					spec._id = dbUtils.id2Str(spec._id);
				}
			}
			else {
				if (spec._id['$in'] && _.isArray(spec._id['$in'])) {
					spec._id['$in'] = dbUtils.toId(spec._id['$in']);
				}
				else {
					spec._id = dbUtils.toId(spec._id);
				}
			}
		}

		if (_.isFunction(field)) {
			callback = field;
			field = null;
			options = null;
		}
		if (_.isFunction(options)) {
			callback = options;
			options = null;
		}

		thisDb[collection].findItems(spec, field, options, function (err, db_result) {
			return callback(err, db_result);
		});
	},
	count: function (spec, callback) {
		var collection = this.collection;
		var thisDb = this.curDb;

		thisDb[collection].count(spec, function (err, db_result) {
			return callback(err, db_result);
		});
	},
	update: function (spec, update_spec, options, callback) {
		var collection = this.collection;
		var thisDb = this.curDb;

		if (_.isFunction(options)) {
			callback = options;
			options = null;
		}
		if (spec._id) {
			if (spec._id['$in'] && _.isArray(spec._id['$in'])) {
				if (_.contains(strIdCollections, collection)) {
					spec._id['$in'] = dbUtils.id2Str(spec._id['$in']);
				}
				else {
					spec._id['$in'] = dbUtils.toId(spec._id['$in']);
				}
			}
			else {
				if (_.contains(strIdCollections, collection)) {
					spec._id = dbUtils.id2Str(spec._id);
				}
				else {
					spec._id = dbUtils.toId(spec._id);
				}
			}
		}
		thisDb[this.collection].update(spec, update_spec, options, callback);
	},
	updateById: function (_id, update_spec, options, callback) {
		if (_.isFunction(options)) {
			callback = options;
			options = null;
		}
		var collection = this.collection;
		var thisDb = this.curDb;
		if (_.contains(strIdCollections, collection)) {
			_id = _id.toString();
		}
		else {
			if (!(_id instanceof ObjectID)) {
				if (!dbUtils.isValidId(_id)) {
					return callback("id is invalid");
				}
				_id = new ObjectID(_id);
			}
		}

		thisDb[collection].updateById(_id, update_spec, options, function (err, count) {
			return callback(err, count);
		});
	},
	findAndModify: function (spec, sort, update_spec, options, callback) {
		if (_.isFunction(options)) {
			callback = options;
			options = null;
		}
		var thisDb = this.curDb;
		thisDb[this.collection].findAndModify(spec, sort, update_spec, options, callback);
	},
	removeById: function (_id, callback) {
		var collection = this.collection;
		var thisDb = this.curDb;
		if (_.contains(strIdCollections, collection)) {
			_id = _id.toString();
		}
		else {
			if (!(_id instanceof ObjectID)) {
				if (!dbUtils.isValidId(_id)) {
					return callback("id is invalid");
				}
				_id = new ObjectID(_id);
			}
		}
		var collectionName = this.collection
		thisDb[collectionName].removeById(_id, function (err, doc) {
			return callback(err, doc);
		});
	},

	remove: function (spec, callback) {
		var collectionName = this.collection;
		var thisDb = this.curDb;
		thisDb[collectionName].remove(spec, function (err, doc) {
			return callback(err, doc);
		});
	},
	aggregate: function (option, callback) {
		var collectionName = this.collection;
		var thisDb = this.curDb;
		thisDb[collectionName].aggregate(option, function (err, db_results) {
			return callback(err, db_results);
		});
	},
	drop: function (callback) {
		var collectionName = this.collection;
		var thisDb = this.curDb;
		thisDb[collectionName].drop(function (err, db_results) {
			return callback(err, db_results);
		});
	},
	distinct: function (field, spec, callback) {
		var collection = this.collection;
		var thisDb = this.curDb;
		if (_.isFunction(spec)) {
			callback = spec;
			spec = {};
		}
		thisDb[collection].distinct(field, spec, function (err, db_result) {
			return callback(err, db_result);
		});
	}
};

module.exports = dbUtils;
/**
 * Created by sensoro on 16/8/25.
 */

exports.cb1 = function (f, cb) {
	if (f) {
		return cb("test err cb1");
	}
	return cb(null, "cb1 ok");
};

exports.cb2 = function (f, cb) {
	if (f) {
		var err = new Error("test err cb2");
		err.code = "1234";
		err.msg = err.message;
		err.info = err.message;
		return cb(err);
	}
	return cb(null, "cb2 ok");
};


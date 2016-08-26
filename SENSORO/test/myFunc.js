/**
 * Created by sensoro on 16/8/26.
 */


exports.test = function (num, cb) {
	if (num) {
		return cb("test err");
	}
	return cb(null, "test ok");
};
/**
 * Created by wyq on 18/1/9.
 */
function t() {
	for (var i = 0; i < 5; ++i) {
		(function (i) {
			setTimeout(console.log, 1000, i);
		})(i);
	}
}

t();

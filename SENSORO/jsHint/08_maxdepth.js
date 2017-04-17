/**
 * Created by wyq on 17/4/17.
 * maxdepth -- 此选项可让您控制如何嵌套您想要的块
 */

/* jshint maxdepth: 2 */
function main() {
	if (true) {
		if (true) {
			for (; ;) {//08_maxdepth.js: line 10, col 23, Blocks are nested too deeply. (3)
			}
		}
	}
}


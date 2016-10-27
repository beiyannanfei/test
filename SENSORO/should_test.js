/**
 * Created by wyq on 16/10/26.
 */
"use strict";
const should = require("should");

try {
	// false.should.be.ok();
	[1].should.be.empty();
} catch (e) {
	console.log(e.message);
}

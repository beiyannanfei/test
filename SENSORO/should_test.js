/**
 * Created by wyq on 16/10/26.
 */
"use strict";
const should = require("should");

/*try {
 // false.should.be.ok();
 [1].should.be.empty();
 } catch (e) {
 console.log(e.message);
 }*/

/*try {
 // console.log(should(1).null());
 console.log(should(null).null());
 } catch (e) {
 console.log(e.message);
 }*/

try {
	// should([]).be.an.Array();
	should({}).be.an.Array();
} catch (e) {
	console.log(e.message);
}


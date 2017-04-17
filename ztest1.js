"use strict";

var nums = [];
for (let i = 0; i < 10; ++i) {
	nums[i] = function (j) {
		return i + j;
	}
}
console.log(nums[0](2));

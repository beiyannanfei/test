/**
 * Created by wyq on 17/4/17.
 * eqeqeq -- 禁止使用==和!=赞成===和 !==
 */

/* jshint eqeqeq: true */
var a = 1;
var b = 2;
var c = a == b;//05_eqeqeq.js: line 9, col 13, Expected '===' and instead saw '=='
var d = a != b;//05_eqeqeq.js: line 10, col 13, Expected '!==' and instead saw '!='


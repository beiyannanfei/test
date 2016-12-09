'use strict';

let type = 0;
let appid = "abcdef12345";
let query = type ? `${appid}:${type}:*` : `${appid}:*`;

console.log(query);
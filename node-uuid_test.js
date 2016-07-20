/**
 * Created by wyq on 2016/7/19.
 */

var uuid = require('node-uuid');

console.log(uuid.v1());
console.log(uuid.v4());

var uid1 = uuid.v1({
	node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
	clockseq: 0x1234,
	msecs: new Date('2011-11-01').getTime(),
	nsecs: 5679
});
console.log(uid1);

var arr = new Array(32); // -> []
var uid2 = uuid.v1(null, arr, 0);   // -> [02 a2 ce 90 14 32 11 e1 85 58 0b 48 8e 4f c1 15]
console.log(JSON.stringify(uid2));
var uid3 = uuid.v1(null, arr, 16);  // -> [02 a2 ce 90 14 32 11 e1 85 58 0b 48 8e 4f c1 15 02 a3 1c b0 14 32 11 e1 85 58 0b 48 8e 4f c1 15]
console.log(JSON.stringify(uid3));

// Optionally use uuid.unparse() to get stringify the ids
var uid4 = uuid.unparse(uid2);        // -> '02a2ce90-1432-11e1-8558-0b488e4fc115'
console.log(uid4);
var uid5 = uuid.unparse(uid3, 16);    // -> '02a31cb0-1432-11e1-8558-0b488e4fc115'
console.log(uid5);


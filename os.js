/**
 * Created by wyq on 2015/11/2.
 */
var os = require("os");

console.log("os.tmpdir(): %j", os.tmpdir());

console.log("os.endianness(): %j", os.endianness());

console.log("os.hostname(): %j", os.hostname());

console.log("os.type(): %j", os.type());

console.log("os.platform(): %j", os.platform());

console.log("os.arch(): %j", os.arch());

console.log("os.release(): %j", os.release());

console.log("os.uptime(): %j", os.uptime());

console.log("os.loadavg(): %j", os.loadavg());

console.log("os.totalmem(): %j", os.totalmem());

console.log("os.freemem(): %j", os.freemem());

console.log("os.cpus(): %j", os.cpus());

console.log("os.networkInterfaces(): %j", os.networkInterfaces());


console.log('当前目录：' + process.cwd());

console.log('版本: ' + process.version);

console.log(process.versions);

console.log('当前CPU架构是：' + process.arch);
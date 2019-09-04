/**
 * Created by wyq on 2015/8/25.
 * http://nodeapi.ucdok.com/#/api/crypto.html
 */
var crypto = require("crypto");

var ciphers = crypto.getCiphers();  //返回支持的加密算法名称列表
console.log("ciphers: %j, num: %j", ciphers, ciphers.length);

var hashes = crypto.getHashes();    //返回一个包含所支持的哈希算法的数组
console.log("hashes: %j", hashes);

var test = "testMsg";
for (var index in hashes) {
    var algorithm = hashes[index];  //加密算法
    var hasher = crypto.createHash(algorithm);  //创建并返回一个哈希对象，一个使用所给算法的用于生成摘要的加密哈希
    hasher.update(test);    //通过提供的数据更新哈希对象，可以通过input_encoding指定编码为'utf8'、'ascii'或者 'binary'。如果没有指定编码，将作为二进制数据（buffer）处理
    var hashmsg = hasher.digest("hex"); //计算传入的所有数据的摘要值。encoding可以是'hex'、'binary'或者'base64'，如果没有指定，会返回一个buffer对象，注意：hash 对象在 digest() 方法被调用后将不可用。
    console.log("加密算法: %j, 加密结果: %j", algorithm, hashmsg);
}

console.error("==============================================\n");

var key = "userName";   //加密的秘钥
for (index in ciphers) {
    var pwd = ciphers[index];
    if (-1 != ["aes-128-cbc-hmac-sha1", "aes-128-gcm", "aes-128-xts", "aes-192-gcm", "aes-256-cbc-hmac-sha1",
        "aes-256-gcm", "aes-256-xts", "id-aes128-GCM", "id-aes192-GCM", "id-aes256-GCM"].indexOf(pwd)) {
        continue;   //数组中的算法在下面的加解密过程中不具有通用性
    }
    var cipher = crypto.createCipher(pwd, key); //用给定的算法和密码，创建并返回一个cipher加密算法的对象
    var crypted = cipher.update(test, 'utf8', 'hex');   //用data参数更新cipher加密对象, 它的编码input_encoding必须是下列给定编码的 'utf8', 'ascii' or 'binary' 中一种。如果没有编码参数，那么打他参数必须是一个buffer
    crypted += cipher.final('hex'); //返回剩余的加密内容，output_encoding为'binary', 'base64' 或 'hex'中的任意一个。 如果没有提供编码格式，则返回一个buffer对象
    var message = crypted;//加密之后的值
    var decipher = crypto.createDecipher(pwd, key); //根据给定的算法和密钥，创建并返回一个解密器对象
    var dec = decipher.update(message, 'hex', 'utf8');  //用data来更新解密器，其中data以'binary', 'base64' 或 'hex'进行编码。如果没有指明编码方式，则默认data是一个buffer对象
    dec += decipher.final('utf8');//解密之后的值, 返回剩余的加密内容，output_encoding为'binary', 'ascii' 或 'utf8'中的任意一个。如果没有指明编码方式，则返回一个buffer对象
    console.log("加密算法: %j, 加密后的值: %j, 解密后的值: %j", pwd, message, dec);
}




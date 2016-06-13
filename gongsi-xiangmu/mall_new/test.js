var MD5 = require("crypto-js/md5");
function generatePassword(token){
    return MD5(token + 'pass').toString().substring(0, 10);
}
console.log(generatePassword('33580c57d3c86f07'))
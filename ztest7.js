let a = "{\"phoneList\":[{\"name\":\"15592060000\",\"number\":\"15592060000\"}],\"emailList\":[]}";
console.log(JSON.parse(a));
let phoneList = [{name: '15592060000', number: '15592060000'}];
console.log(phoneList.toString());
const _ = require("");
console.log(_.pluck(phoneList, "number").toString());
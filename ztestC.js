let str = /^(?:([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+|(\+86){0,1}1[3|4|5|7|8](\d){9})$/;

console.log(str.test("a.a@qq.com"));


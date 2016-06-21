function setName(obj) {
	obj.name = "Tom";
	obj = new Object();
	obj.name = "Mike";
}

var person = new Object();
setName(person);
console.log(person.name);
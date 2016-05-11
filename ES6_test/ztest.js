'use strict';

var [a, b, c] = [1, 2, 3];
console.log(a);

/*
const a = "AAA";
const b = "BBB";
const c = "CCC";
const d = `ABCD${a}ABCD`;
console.log(d);
*/

/*
let saludar = persona => {
	let { nombre, honorifico } = persona;
	let mensaje = `Hola ${honorifico} ${nombre}`;
	return mensaje;
}
console.log(saludar({ nombre: 'Pepito', honorifico: 'Don' }));*/


/*for (let i = 0; i < 5; i++) {
	console.log(i);
};
console.log(i);*/

/*
const DIEZ = 10;
//DIEZ = 5;
console.log(DIEZ);*/

/*
let arr  = ['foo','bar','baz'];

let eArr = arr.entries();

console.log(eArr.next());
console.log(eArr.next());
console.log(eArr.next());
console.log(eArr.next());
*/

// creamos un mapa de múltiples elementos iniciales
/*
let map = new Map([
	[1, 'foo'],
	['bar', 2],
	['baz', 'baz']
]);

let size = map.size; // obtenemos el tamaño del mapa
//console.log(size);

// distintas formas de iterar un mapa
map.forEach(v => {
	//console.log(v);
});

for (let key of map.keys()) {
	//console.log(key);
}

for (let value of map.values()) {
	//console.log(value);
}

for (let entrie of map.entries()) {
	console.log(entrie);
}

let keys = map.keys();
console.log(keys.next());
console.log(keys.next());
console.log(keys.next());

map.clear(); // lo vaciamos

size = map.size;
console.log(size);*/

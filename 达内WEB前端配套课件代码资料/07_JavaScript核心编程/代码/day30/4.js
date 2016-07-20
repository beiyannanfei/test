var square1 = {};

Object.defineProperty(
	square1,
	'width',
	{
		value:10,
		writable:true,
		enumerable:true,
		configurable:true
	}
);
Object.defineProperty(
	square1,
	'size',
	{
		get:function(){
			return this.width*this.width;
		},
		set:function(value){
			this.width = Math.sqrt( value );
		},
		enumerable:true,
		configurable:true
	}
);
Object.defineProperty(
	square1,
	'perimeter',
	{
		get:function(){
			return this.width*4;
		},
		enumerable:false,
		configurable:false
	}
);

square1.width = 2;
console.log( square1.width );
console.log( square1.size );
console.log( square1.perimeter );

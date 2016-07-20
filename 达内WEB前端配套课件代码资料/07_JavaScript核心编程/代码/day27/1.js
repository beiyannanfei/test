/*
级联下拉列表
*/

var provinces = [
				'北京市',
				'天津市',
				'河北省'
				];
var cities = [
				['东城区','西城'],
				['河东区','和平区'],
				['廊坊市','唐山市']
			];

function getCities( p ){
	var result = null;
	for(var index in provinces){
		if(provinces[index]===p){
			result = cities[index];
			break;
		}
	}
	return result;
}

console.log( getCities('山东省') );
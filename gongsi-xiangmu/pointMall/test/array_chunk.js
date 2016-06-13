/**
 * Created by zwb on 2014/12/30.
 */




var array_chunk = function(openIds,number){
    var result = [];
    var len = openIds.length / number ;
    for(var i=0;i<len;i++){
        var start = i * number;
        var last = (i+1)*number;
        result.push(openIds.slice(start,last));
    }
   return result;
};



var array = [];
for(var i=0;i<100;i++){
    array.push(i);
}

var results =  array_chunk(array,10);
console.log(results);
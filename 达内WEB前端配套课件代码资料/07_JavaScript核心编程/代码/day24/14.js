var empArr = [  ];
console.log( empArr.length );

empArr[0] = 'Tom';
console.log( empArr.length );

empArr[1] = 'Mary';
console.log( empArr.length );

empArr[0] = 'Tommy';	//下标已经存在，再赋值就是替换
console.log( empArr.length );

empArr[5] = 'John';
console.log( empArr.length );

empArr[empArr.length] = 'Timm'
console.log( empArr.length );

//arr[arr.length] = xxxx;    //向数组的最后添加一个新元素

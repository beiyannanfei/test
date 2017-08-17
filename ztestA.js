let sTypes = req.query.sensorTypes.split(",");
let thfSensor = sTypes.filter(e => ["flame", "humidity", "temperature"].includes(e));     //温湿火焰传感器
let otherSensor = sTypes.filter(e => !["flame", "humidity", "temperature"].includes(e));  //非温湿火焰传感器
if (thfSensor.length > 3) {   //包括火焰和温湿度两种设备
	otherSensor = otherSensor.concat(thfSensor);  //过滤 flame", "humidity", "temperature 三种传感器
}
if (thfSensor.length === 3) { //只包括火焰传感器
	otherSensor.push("flame");      //火焰传感器包括flame", "humidity", "temperature",而温湿度只包含"humidity", "temperature"
}
if (thfSensor.length === 2) { //只包括温湿度传感器
	otherSensor = otherSensor.concat(thfSensor);        //查询"humidity", "temperature"
	condition.$and = condition.$and || [];
	condition.$and.push({sensorTypes: {$ne: "flame"}}); //过滤掉火焰传感器包括flame
}
condition.sensorTypes = {$in: otherSensor};
db.getCollection('devices').count({"sensorData.battery": {$gte:0, $lte:9}, status: {$in: [0,1,2]}})
db.getCollection('devices').count({"sensorData.battery": {$gte:10, $lte:19}, status: {$in: [0,1,2]}})
db.getCollection('devices').count({"sensorData.battery": {$gte:20, $lte:29}, status: {$in: [0,1,2]}})
db.getCollection('devices').count({"sensorData.battery": {$gte:30, $lte:39}, status: {$in: [0,1,2]}})
db.getCollection('devices').count({"sensorData.battery": {$gte:40, $lte:49}, status: {$in: [0,1,2]}})
db.getCollection('devices').count({"sensorData.battery": {$gte:50, $lte:59}, status: {$in: [0,1,2]}})
db.getCollection('devices').count({"sensorData.battery": {$gte:60, $lte:69}, status: {$in: [0,1,2]}})
db.getCollection('devices').count({"sensorData.battery": {$gte:70, $lte:79}, status: {$in: [0,1,2]}})
db.getCollection('devices').count({"sensorData.battery": {$gte:80, $lte:89}, status: {$in: [0,1,2]}})
db.getCollection('devices').count({"sensorData.battery": {$gte:90, $lte:100}, status: {$in: [0,1,2]}})






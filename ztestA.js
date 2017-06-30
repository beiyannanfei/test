var distance = ((self.sensorData['calibration']|| 0 ) - +self.sensorData[sensor]) * 100;
if (!self.sensorData[sensor] && self.sensorData[sensor] !== 0) {
	STATUS += '-';
} else {
	STATUS += (distance > 0 ? distance : 0).toFixed(0) + (SENSOR_CONFIG[sensor] && SENSOR_CONFIG[sensor].unit);
}
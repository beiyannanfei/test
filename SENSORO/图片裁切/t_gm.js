/**
 * Created by wyq on 18/1/30.
 */
const fs = require('fs');
const gm = require('gm').subClass({imageMagick: true});

const newFileName = "./b_gm.jpg";
if (fs.existsSync(newFileName)) {    //如果文件已经存在则删除
	fs.unlinkSync(newFileName);
}

gm('./b.jpg')
	// .fill("red")
	// .drawRectangle(10, 10, 30, 50)
	// .resize(240, 240)
	.drawLine(100,200,300,400)
	// .drawLine(20, 10, 10, 100, "red", 2)
	// .drawLine(30, 10, 10, 100, "yellow", 3)
	.write(newFileName, function (err) {
		if (!err) {
			return console.log("Written montage image.");
		}
		console.log(err.stack || err.message || err);
	});

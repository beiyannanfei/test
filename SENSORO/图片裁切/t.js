/**
 * Created by wyq on 18/1/17.
 */
const Jimp = require("jimp");
const fs = require("fs");

// const imageBuf = fs.readFileSync("./a.png");


function resize() {
	const newFileName = "./a_resize.png";
	if (fs.existsSync(newFileName)) {    //如果文件已经存在则删除
		fs.unlinkSync(newFileName);
	}
	Jimp.read("./a.png").then(lenna => {
		lenna.resize(256, 256)
			.write(newFileName);
	}).catch(err => {
		return console.log("resize err: %j", err.message || err);
	});
}

function crop() { //图片裁切
	const newFileName = "./a_crop.png";
	if (fs.existsSync(newFileName)) {    //如果文件已经存在则删除
		fs.unlinkSync(newFileName);
	}
	Jimp.read("./a.png").then(lenna => {
		lenna.crop(10, 10, 100, 100)
			.write(newFileName);
	}).catch(err => {
		return console.log("crop err: %j", err.message || err);
	});
}

function rotate() { //图片翻转
	const newFileName = "./a_rotate.png";
	if (fs.existsSync(newFileName)) {    //如果文件已经存在则删除
		fs.unlinkSync(newFileName);
	}
	Jimp.read("./a.png").then(lenna => {
		lenna.rotate(90)
			.write(newFileName);
	}).catch(err => {
		return console.log("crop err: %j", err.message || err);
	});
}






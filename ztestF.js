const fs = require("fs");
const path = require("path");
app.get("/down", function (req, res) {
	let filePath = path.join(__dirname, `../files`);
	console.log("=======filePath: %j", filePath);
	if (fs.existsSync(filePath)) {
		console.log("文件存在")
	}
	res.download(filePath, "aaa.mp4", function (err) {
		console.log("======= args: %j", arguments);
	});
});
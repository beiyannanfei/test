/**
 * Created by wyq on 17/9/1.
 */
function init() {
	var vegaOptions = {}
	var connector = new MapdCon()
		.protocol("http")
		.host("my.host.com")
		.port("9092")
		.dbName("mapd")
		.user("mapd")
		.password("changeme")
		.connect(function(error, con) {
			con.renderVega(1, JSON.stringify(exampleVega), vegaOptions, function(error, result) {
				if (error) {
					console.log(error.message);
				}
				else {
					var blobUrl = `data:image/png;base64,${result.image}`
					var body = document.querySelector('body')
					var vegaImg = new Image()
					vegaImg.src = blobUrl
					body.append(vegaImg)
				}
			});
		});
}
/**
 * Created by wyq on 16/10/8.
 */
const esClient = require("./esClient.js").esClient;

let condition1 = {
	"query": {
		"match_all": {}
	}
};
esClient.search(condition1, function (err, val) {
	console.log(val);
});
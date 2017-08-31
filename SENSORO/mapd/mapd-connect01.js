/**
 * Created by wyq on 17/8/24.
 */
const MapdCon = require("./node-connector.js");

const con = new MapdCon()
.protocol("https").host("metis.mapd.com").port("443").dbName("mapd").user("mapd").password("HyperInteractive")
	// .protocol("http").host("139.199.212.13").port('9090').dbName('mapd').user('mapd').password('HyperInteractive')
	.connect((err, session) => {
		if (!!err) {
			return console.log("connect err: %j", err.message || err);
		}
		console.log("connect success sid: %j", session.sessionId());
		// getTabels(session);
		// query(session);
		// getSid(session);
		// getFrontendViews(session);
		// getFrontendView(session, "newSave");
		// getServerStatus(session);
		// createFrontendView(session);
	});

function createFrontendView(sess) {
	sess.createFrontendView('newSave', 'viewstateBase64', null, 'metaData', function (err, response) {
		if (!!err) {
			return console.log("err: %j", err.message || err);
		}
		console.log("response = %j", response);
		response = undefined;
	});
}

function getServerStatus(sess) {
	sess.getServerStatus(function (err, response) {
		if (!!err) {
			return console.log("err: %j", err.message || err);
		}
		console.log("response = %j", response);
		response = {
			"read_only": true,
			"version": "3.2.1-20170826-327e7ee",
			"rendering_enabled": true,
			"start_time": {"buffer": {"type": "Buffer", "data": [0, 0, 0, 0, 89, 166, 87, 244]}, "offset": 0},
			"edition": "ee"
		}
	});
}

function getFrontendView(sess, viewName) {
	sess.getFrontendView(viewName || "__E2E_LINE_CHART_BRUSH__DO_NOT_MODIFY__", function (err, response) {
		if (!!err) {
			return console.log("err: %j", err.message || err);
		}
		console.log("response: %j", response);
		response = {
			"view_name": "__E2E_LINE_CHART_BRUSH__DO_NOT_MODIFY__",
			"view_state": "eyJjaGFydHMiOnsiMCI6eyJkY0ZsYWciOjEzfSwiMSI6eyJhcmVGaWx0ZXJzSW52ZXJzZSI6ZmFsc2UsImJpblBhcmFtcyI6bnVsbCwiY2FwIjoxMiwiY29sb3IiOnsidHlwZSI6InNvbGlkIiwia2V5IjoiYmx1ZSIsInZhbCI6WyIjMjdhZWVmIl19LCJjb2xvckRvbWFpbiI6bnVsbCwiZGNGbGFnIjoxNCwiZGltZW5zaW9ucyI6W3siaXNFcnJvciI6ZmFsc2UsImlzUmVxdWlyZWQiOmZhbHNlLCJpbmFjdGl2ZSI6ZmFsc2UsIm5hbWUiOiJYIEF4aXMiLCJ0YWJsZSI6ImZsaWdodHNfZG9ub3Rtb2RpZnkiLCJ0eXBlIjoiVElNRVNUQU1QIiwiaXNfYXJyYXkiOmZhbHNlLCJpc19kaWN0IjpmYWxzZSwibmFtZV9pc19hbWJpZ3VvdXMiOmZhbHNlLCJsYWJlbCI6ImFycl90aW1lc3RhbXAiLCJ2YWx1ZSI6ImFycl90aW1lc3RhbXAiLCJtaW5fdmFsIjoiMjAwOC0wMS0wMVQwMDo1NzowMC4wMDBaIiwibWF4X3ZhbCI6IjIwMDktMDEtMDFUMTg6Mjc6MDAuMDAwWiIsImN1cnJlbnRMb3dWYWx1ZSI6IjIwMDgtMDEtMDFUMDA6NTc6MDAuMDAwWiIsImN1cnJlbnRIaWdoVmFsdWUiOiIyMDA5LTAxLTAxVDE4OjI3OjAwLjAwMFoiLCJpc0Jpbm5lZCI6dHJ1ZSwiaXNCaW5uYWJsZSI6dHJ1ZSwiYXV0b2JpbiI6dHJ1ZSwibWF4QmluU2l6ZSI6MjUwLCJudW1PZkJpbnMiOjQwMCwidGltZUJpbiI6ImRheSJ9XSwiZWxhc3RpY1giOnRydWUsImZpbHRlcnMiOltdLCJnZW9Kc29uIjpudWxsLCJoZWlnaHQiOm51bGwsImxvYWRpbmciOmZhbHNlLCJtZWFzdXJlcyI6W3siaXNFcnJvciI6ZmFsc2UsImlzUmVxdWlyZWQiOmZhbHNlLCJpbmFjdGl2ZSI6ZmFsc2UsIm5hbWUiOiJzZXJpZXNfMSIsImxhYmVsIjoiIyBSZWNvcmRzIiwidmFsdWUiOiIqIiwidHlwZSI6IlNNQUxMSU5UIiwiY29sb3JUeXBlIjoicXVhbnRpdGF0aXZlIiwiYWdnVHlwZSI6IkNvdW50IiwiY3VzdG9tIjpmYWxzZSwib3JpZ2luSW5kZXgiOjB9XSwib3JkZXJpbmciOiJkZXNjIiwib3RoZXJzR3JvdXBlciI6ZmFsc2UsInNhdmVkQ29sb3JzIjp7fSwic29ydENvbHVtbiI6eyJjb2wiOnsibmFtZSI6ImNvdW50dmFsIn0sImluZGV4IjowLCJvcmRlciI6ImRlc2MifSwidGlja3MiOjMsInRpbWVCaW5JbnB1dFZhbCI6IiIsInRpdGxlIjoiIiwidHlwZSI6ImxpbmUiLCJ3aWR0aCI6bnVsbCwiaGFzRXJyb3IiOmZhbHNlfSwiMiI6eyJhcmVGaWx0ZXJzSW52ZXJzZSI6ZmFsc2UsImJpblBhcmFtcyI6bnVsbCwiY2FwIjoxMCwiY29sb3IiOnsidHlwZSI6Im9yZGluYWwiLCJrZXkiOiJyYWluYm93IiwidmFsIjpbIiNlYTU1NDUiLCIjZjQ2YTliIiwiI2VmOWIyMCIsIiNlZGJmMzMiLCIjZWRlMTViIiwiI2JkY2YzMiIsIiM4N2JjNDUiLCIjMjdhZWVmIiwiI2IzM2RjNiJdfSwiY29sb3JEb21haW4iOm51bGwsImRjRmxhZyI6MTUsImRpbWVuc2lvbnMiOlt7ImluYWN0aXZlIjpmYWxzZSwibmFtZSI6bnVsbCwiaXNFcnJvciI6ZmFsc2UsImlzUmVxdWlyZWQiOmZhbHNlLCJ0YWJsZSI6ImZsaWdodHNfZG9ub3Rtb2RpZnkiLCJ0eXBlIjoiU1RSIiwiaXNfYXJyYXkiOmZhbHNlLCJpc19kaWN0Ijp0cnVlLCJuYW1lX2lzX2FtYmlndW91cyI6ZmFsc2UsImxhYmVsIjoiY2Fycmllcl9uYW1lIiwidmFsdWUiOiJjYXJyaWVyX25hbWUiLCJtYXhfdmFsIjpudWxsLCJtaW5fdmFsIjpudWxsLCJtYXhCaW5TaXplIjpudWxsLCJjdXJyZW50SGlnaFZhbHVlIjpudWxsLCJjdXJyZW50TG93VmFsdWUiOm51bGwsImF1dG9iaW4iOmZhbHNlLCJudW1PZkJpbnMiOm51bGwsImlzQmlubmVkIjpmYWxzZSwiaXNCaW5uYWJsZSI6ZmFsc2V9LHsiaXNFcnJvciI6ZmFsc2UsImlzUmVxdWlyZWQiOmZhbHNlfV0sImVsYXN0aWNYIjp0cnVlLCJmaWx0ZXJzIjpbXSwiZ2VvSnNvbiI6bnVsbCwiaGVpZ2h0IjpudWxsLCJsb2FkaW5nIjpmYWxzZSwibWVhc3VyZXMiOlt7ImlzRXJyb3IiOmZhbHNlLCJpc1JlcXVpcmVkIjpmYWxzZSwiaW5hY3RpdmUiOmZhbHNlLCJuYW1lIjoidmFsIiwibGFiZWwiOiIjIFJlY29yZHMiLCJ2YWx1ZSI6IioiLCJ0eXBlIjoiU01BTExJTlQiLCJjb2xvclR5cGUiOiJxdWFudGl0YXRpdmUiLCJhZ2dUeXBlIjoiQ291bnQiLCJjdXN0b20iOmZhbHNlLCJvcmlnaW5JbmRleCI6MH0seyJpbmFjdGl2ZSI6ZmFsc2UsIm5hbWUiOiJjb2xvciIsImlzRXJyb3IiOmZhbHNlLCJpc1JlcXVpcmVkIjpmYWxzZX1dLCJvcmRlcmluZyI6ImRlc2MiLCJvdGhlcnNHcm91cGVyIjpmYWxzZSwic2F2ZWRDb2xvcnMiOnt9LCJzb3J0Q29sdW1uIjp7ImNvbCI6eyJuYW1lIjoiY291bnR2YWwifSwiaW5kZXgiOjAsIm9yZGVyIjoiZGVzYyJ9LCJ0aWNrcyI6MywidGltZUJpbklucHV0VmFsIjoiIiwidGl0bGUiOiIiLCJ0eXBlIjoicGllIiwid2lkdGgiOm51bGwsImhhc0Vycm9yIjpmYWxzZX19LCJ1aSI6eyJzaG93RmlsdGVyUGFuZWwiOmZhbHNlLCJzaG93Q2xlYXJGaWx0ZXJzRHJvcGRvd24iOmZhbHNlLCJtb2RhbCI6eyJvcGVuIjpmYWxzZSwiY29udGVudCI6IiIsImhlYWRlciI6IiIsImNhbmNlbEJ1dHRvbiI6ZmFsc2V9LCJzZWxlY3RvclBpbGxIb3ZlciI6eyJzaG91bGRTaG93UHJvbXB0IjpmYWxzZSwibWVzc2FnZSI6IlJlcXVpcmVkICBtZWFzdXJlIiwidG9wIjoyMzl9LCJzZWxlY3RvclBvc2l0aW9ucyI6eyJkaW1lbnNpb25zIjpbMTA2LDE1MCwxMTAsMTEwLDExMF0sIm1lYXN1cmVzIjpbMjM5LDI3OSwxOTksMjM5LDE5OSwxOTldfX0sImZpbHRlcnMiOltdLCJkYXNoYm9hcmQiOnsidGl0bGUiOiJfX0UyRV9MSU5FX0NIQVJUX0JSVVNIX19ET19OT1RfTU9ESUZZX18iLCJjaGFydENvbnRhaW5lcnMiOlt7ImlkIjoiMSJ9LHsiaWQiOiIyIn1dLCJ0YWJsZSI6ImZsaWdodHNfZG9ub3Rtb2RpZnkiLCJmaWx0ZXJzSWQiOltdLCJsYXlvdXQiOlt7InciOjI4LCJoIjoxMCwieCI6MCwieSI6MCwiaSI6IjEiLCJtaW5XIjo4Ljk5NDQxMzQwNzgyMTIyOSwibWluSCI6OC41NzE0Mjg1NzE0Mjg1NzEsIm1vdmVkIjpmYWxzZSwic3RhdGljIjpmYWxzZX0seyJ3IjoxMCwiaCI6MTAsIngiOjAsInkiOjEwLCJpIjoiMiIsIm1pblciOjguOTk0NDEzNDA3ODIxMjI5LCJtaW5IIjo4LjU3MTQyODU3MTQyODU3MSwibW92ZWQiOmZhbHNlLCJzdGF0aWMiOmZhbHNlfV0sInNhdmVMaW5rU3RhdGUiOnsiZXJyb3IiOmZhbHNlLCJyZXF1ZXN0IjpmYWxzZSwic2F2ZUxpbmtJZCI6bnVsbH0sImxvYWRTdGF0ZSI6eyJlcnJvciI6ZmFsc2UsInJlcXVlc3QiOmZhbHNlLCJsb2FkTGlua0lkIjpudWxsfSwic2F2ZVN0YXRlIjp7ImVycm9yIjpmYWxzZSwicmVxdWVzdCI6ZmFsc2UsImxhc3RTdGF0ZSI6bnVsbCwiaXNTYXZlZCI6ZmFsc2V9fX0=",
			"image_hash": "",
			"update_time": "2016-10-15T05:44:20Z",
			"view_metadata": "{\"table\":\"flights_donotmodify\",\"version\":\"v2\"}"
		}
	});
}

function getFrontendViews(sess) {
	sess.getFrontendViews(function (err, results) {
		if (!!err) {
			return console.log("err: %j", err.message || err);
		}
		console.log("results: %j", results);
		results = [{
			"view_name": "__E2E_LINE_CHART_BRUSH__DO_NOT_MODIFY__",
			"view_state": "",
			"image_hash": "",
			"update_time": "2016-10-15T05:44:20Z",
			"view_metadata": "{\"table\":\"flights_donotmodify\",\"version\":\"v2\"}"
		}, {
			"view_name": "__E2E_MULTI_BIN_DIM_HEATMAP_FILTER__DO_NOT_MODIFY__",
			"view_state": "",
			"image_hash": "",
			"update_time": "2016-10-15T05:40:39Z",
			"view_metadata": "{\"table\":\"flights_donotmodify\",\"version\":\"v2\"}"
		}, {
			"view_name": "__E2E_NUMBER_CHART__DO_NOT_MODIFY__",
			"view_state": "",
			"image_hash": "",
			"update_time": "2016-10-15T05:32:44Z",
			"view_metadata": "{\"table\":\"flights_donotmodify\",\"version\":\"v2\"}"
		}, {
			"view_name": "__E2E__ALL_CHARTS__DO_NOT_MODIFY__",
			"view_state": "",
			"image_hash": "",
			"update_time": "2016-10-15T05:55:33Z",
			"view_metadata": "{\"table\":\"contributions_donotmodify\",\"version\":\"v2\"}"
		}]
	});
}

function getSid(sess) {
	console.log(sess.sessionId());
}

function getTabels(sess) {
	sess.getTables((err, data) => {
		if (!!err) {
			return console.log("getTabels err: %j", err.message || err);
		}
		console.log("%j", data);    //[{"name":"flights_2008_10k","label":"obs"}]
		data = [
			{"name": "flights_donotmodify", "label": "obs"},
			{"name": "contributions_donotmodify", "label": "obs"},
			{"name": "tweets_nov_feb", "label": "obs"},
			{"name": "zipcodes", "label": "obs"}
		];
	});
}

function query(sess) {  //会报错
	let sqlStr = 'SELECT origin_city AS "Origin", dest_city AS "Destination", AVG(airtime) AS	"Average Airtime" FROM flights_2008_10k WHERE distance < 175 GROUP BY origin_city, dest_city;';
	sqlStr = "SELECT conv_4326_900913_x(dest_lon) as x,conv_4326_900913_y(dest_lat) as y,flights_donotmodify.rowid FROM flights_donotmodify WHERE (dest_lon >= -129.54651698345356 AND dest_lon <= -69.63578696483647) AND (dest_lat >= -4.65308173226758 AND dest_lat <= 62.077009825854276) AND MOD(flights_donotmodify.rowid * 265445761, 4294967296) < 70879699;";
	sess.query(sqlStr, {limit: 10}, (err, data)=> {
		if (!!err) {
			return console.log("query err: %j", err.message || err);  //Error: skip not supported yet
		}
		console.log("%j", data);
	});
}


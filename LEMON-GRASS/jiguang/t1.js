/**
 * Created by wyq on 2018/12/26.
 */
const JPush = require("jpush-async").JPush;
const client = JPush.buildClient("aaaa", "bbb", 5);


client
	.push()
	.setPlatform(JPush.ALL) //设置 platform，本方法接收 JPush.ALL, android, ios这几个参数
	// .setAudience(JPush.registration_id("121c83f76062e9b70bc")) //设置 audience，本方法接收 JPush.ALL，或者是 tag(), tag_and(), alias(), registration_id() 创建的对象
	.setAudience(JPush.alias("8429793699712")) //设置 audience，本方法接收 JPush.ALL，或者是 tag(), tag_and(), alias(), registration_id() 创建的对象
	// .setAudience(JPush.ALL) //设置 audience，本方法接收 JPush.ALL，或者是 tag(), tag_and(), alias(), registration_id() 创建的对象
	.setNotification('Hi, JPush test')
	// .setMessage('msg content')  //设置 message，本方法接受 4 个参数msg_content(string,必填), title(string), content_type(string), extras(Object)。
	.setOptions(null, 60)  //设置 options，本方法接收 5 个参数，sendno(int), time_to_live(int), override_msg_id(int), apns_production(boolean), big_push_duration(int)
	.send(function (err, res) {
		if (err) {
			if (err instanceof JPush.APIConnectionError) {
				console.log(err.message)
			} else if (err instanceof JPush.APIRequestError) {
				console.log(err.message)
			}
		} else {
			console.log('Sendno: ' + res.sendno);
			console.log('Msg_id: ' + res.msg_id);
		}
	});


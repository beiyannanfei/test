/**
 * Created by wyq on 2018/12/26.
 */
const JPush = require("jpush-async").JPush;
const client = JPush.buildClient("aaa", "bbb", 5);


client
	.push()
	.setPlatform(JPush.ALL) //设置 platform，本方法接收 JPush.ALL, android, ios这几个参数
	.setAudience(JPush.registration_id("190e35f7e01b0d712de")) //设置 audience，本方法接收 JPush.ALL，或者是 tag(), tag_and(), alias(), registration_id() 创建的对象
	// .setAudience(JPush.registration_id("190e35f7e01b844fd38")) //设置 audience，本方法接收 JPush.ALL，或者是 tag(), tag_and(), alias(), registration_id() 创建的对象
	// .setAudience(JPush.ALL) //设置 audience，本方法接收 JPush.ALL，或者是 tag(), tag_and(), alias(), registration_id() 创建的对象
	.setNotification(
		// 'Hi, JPushaaa', //设置 notification，本方法接收 ios(), android(), winphone()等方法创建的对象，如果第一个参数为字符串，则指定全局的 alert

		// JPush.ios(  //ios(alert,sound,badge,contentAvailable,extras)
		// 	'ios alert', // string 通知内容。必传
		// 	"sound",    // string 如果为 null，则此消息无声音提示；有此字段，如果找到了指定的声音就播放该声音，否则播放默认声音, 如果此字段为空字符串('')，iOS 7 为默认声音，iOS 8 及以上系统为无声音。(消息) 说明：JPush 官方 API Library (SDK) 会默认填充声音字段。提供另外的方法关闭声音
		// 	"badge",    // int 如果为 null，表示不改变角标数字；否则把角标数字改为指定的数字；为 0 表示清除
		// 	"contentAvailable", // boolean 推送的时候携带 "content-available":true 说明是 Background Remote Notification，如果不携带此字段则是普通的 Remote Notification
		// 	"extras", //object 自定义 key / value 信息，以供业务使用。
		// 	"category", // string iOS 8 开始支持，即 APNs payload 中的 'category' 字段。
		// 	"mutableContent", // boolean 推送的时候携带"mutable-content":true 说明是支持 iOS 10 的 UNNotificationServiceExtension，如果不携带此字段则是普通的 Remote Notification
		// ),

		JPush.android(  //android(alert, title, builder_id, extras, priority, category, style, value, alertType)
			// string 通知内容。必传
			'推送内容',
			//string 通知标题。
			"推送标题(不填写则为恋世界)",
			//int Android SDK 可设置通知栏样式，这里根据样式 ID 来指定该使用哪套样式。
			1,
			// object 自定义 key / value 信息，以供业务使用。
			{
				"mzpns_content_forshort": "推送内容超过100字时需要在此填写一份少于100字的信息，客户端收到的信息为此信息",
				"oppns_content_forshort": "推送内容超过200字时需要在此填写一份少于100字的信息，客户端收到的信息为此信息",
			},
			// "priority", // int 通知栏展示优先级，默认为0，范围为 -2～2 ，其他值将会被忽略而采用默认。
			// "category", // string 通知栏条目过滤或排序，完全依赖 rom 厂商对 category 的处理策略。
			// "style", // int 通知栏样式类型，默认为0，还有1，2，3可选，用来指定选择哪种通知栏样式，其他值无效。有三种可选分别为 bigText=1，Inbox=2，bigPicture=3。
			// "value", // object 当 style = 1, 为大文本通知栏样式，类型为 string，内容会被通知栏以大文本的形式展示出来。支持 API 16 以上的 rom；
			//当 style = 2，为文本条目通知栏样式，类型为 json 对象，json 的每个 key 对应的 value 会被当作文本条目逐条展示。支持 API 16 以上的 rom；
			//当 style = 3，为大图片通知栏样式，类型为 string，可以是网络图片 url，或本地图片的 path，目前支持.jpg和.png后缀的图片。图片内容会被通知栏以大图片的形式展示出来。如果是 http／https 的url，会自动下载；如果要指定开发者准备的本地图片就填 sdcard 的相对路径。支持 API 16以上的 rom。
			// "alertTYpe", // int 可选范围为 -1 ～ 7 ，对应 Notification.DEFAULT_ALL = -1 或者 Notification.DEFAULT_SOUND = 1, Notification.DEFAULT_VIBRATE = 2, Notification.DEFAULT_LIGHTS = 4 的任意 “or” 组合。默认按照 -1 处理。
		)
	)
	.setMessage('msg content')  //设置 message，本方法接受 4 个参数msg_content(string,必填), title(string), content_type(string), extras(Object)。
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


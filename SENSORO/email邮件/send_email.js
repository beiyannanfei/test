/**
 * Created by wyq on 2018/8/28.
 * 发送邮件
 */

var nodemailer = require('nodemailer');
var start = Date.now();
console.log(start);
var smtpConfig = {
	host: 'smtp.exmail.qq.com',
	port: 465,
	secure: true, // use SSL
	auth: {
		user: 'userName@lemongrassmedia.cn',
		pass: '*******'
	}
};
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpConfig);

// setup e-mail data with unicode symbols
var mailOptions = {
	from: 'userName@lemongrassmedia.cn', // sender address
	to: 'aaaa@qq.com', // list of receivers,逗号分隔
	subject: 'ABC账号分布', // Subject line
	//text: 'Hello world ?', // plaintext body
	html: 'ABC账号分布<br/><br/><div style="text-align: right">邮件为自动发送，请勿回复。</div>', // html body
	attachments: [
		{
			filename: '附件1.xlsx',      // 改成你的附件名
			path: '/Users/wyq/workspace/sys_doc/AB测试文档.xlsx' // 改成你的附件路径
		}
	]
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function (error, info) {
	if (error) {
		return console.log(error);
	}
	console.log('Message sent: ' + info.response);
	console.log("Finish send mail:" + Date.now());
	console.log(Date.now() - start);
});
console.log("After send mail:" + Date.now());
console.log(Date.now() - start);


积分商城管理平台

安装说明
=====

1、环境
    需要安装nodejs,mongodb,redis
    centos安装
    1)nodejs  参考 https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
        yum install nodejs npm --enablerepo=epel
    2)mongodb 参考 http://docs.mongodb.org/manual/tutorial/install-mongodb-on-red-hat-centos-or-fedora-linux/
        a、添加/etc/yum.repos.d/mongodb.repo文件
        b、添加内容
            [mongodb]
            name=MongoDB Repository
            baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64/
            gpgcheck=0
            enabled=1
        c、安装
            yum install mongodb-org
        d、启动
            mongod --dbpath=/usr/local/mongodb/data --logpath=/usr/local/mongodb/logs/mongodb.log --logappend  --auth --port=27017 --fork
            （/usr/local/mongodb/data，/usr/local/mongodb/logs/mongodb.log 分别是数据文件和日志文件目录，启动前需要手动创建）
        e、出现问题尝试 yum clean all and yum check-update命令
    3）redis 参考 http://codybonney.com/installing-redis-on-centos-6-4/
        rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
        rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-6.rpm
        yum install redis -y
        启动
        redis-server /etc/redis.conf

2、安装程序
    a)安装类库  把程序解压到任意目录，之后进入程序目录执行 npm install
    b)配置mongodb需要的数据
        数据库的连接语句在 /models/index.js
        目前程序使用数据库 pointMall,用户名和密码都是 integral
        （mongo -u admin -p admin host/admin）
        在mongodb中添加 pointMall 用户即可：
            > use pointMall
            > db.addUser('integral','integral');
3、程序配置
    项目根目录有个config.json文件。
    a、mongodb 配置信息 b、host配置 c、redis配置
4、运行程序
    建议使用pm2进行维护，也可以使用forever
    npm install pm2 -g
    pm2 startup centos

    之后进入工程目录
    pm2 start app.js -i 2 --name 'integral'    负载不重，集群2个即可
    安装完毕
    可以用pm2 list查看集群状态
        pm2 logs查看日志


---------------------------------------------------------------------------------------------------
创建索引

mongo -u root -p pwd host/dbname
//用户积分


db.activities.dropIndexes()
db.activities.ensureIndex({token: 1, dateTime: -1})
db.activities.ensureIndex({token: 1, active: 1, score: 1})
db.activities.ensureIndex({name: 1, token: 1, deleted: 1}, {unique: true})

db.goods.dropIndexes()
db.goods.ensureIndex({token: 1, dateTime: -1})
db.goods.ensureIndex({'ext.pushTime': 1, type: 1, use: 1})
db.goods.ensureIndex({token: 1, use: 1})

db.addresses.dropIndexes()
db.addresses.ensureIndex({openId: 1, deleted: 1})
db.addresses.ensureIndex({openId: 1, token: 1, addInfo: 1})
db.addresses.ensureIndex({openId: 1, isDefault: 1})

db.lotteries.dropIndexes()
db.lotteries.ensureIndex({token: 1, prizeType: 1, activityId: 1, dateTime: -1})
db.lotteries.ensureIndex({token: 1, prizeId: 1, dateTime: -1})
db.lotteries.ensureIndex({prizeId: 1})
db.lotteries.ensureIndex({token: 1, dateTime: -1})
db.lotteries.ensureIndex({token: 1, from: 1, dateTime: -1})
db.lotteries.ensureIndex({token: 1, prizeType: 1, dateTime: -1})
db.lotteries.ensureIndex({token: 1, openId: 1, prizeId: 1, dateTime: -1})
db.lotteries.ensureIndex({token: 1, openId: 1, prizeType: 1, dateTime: -1})
db.lotteries.ensureIndex({token: 1, openId: 1, from: 1, dateTime: -1})

---------------------------------------------- no
db.lotteryevents.dropIndexes()
db.lotteryevents.ensureIndex({token: 1, state: 1, dateTime: 1})
db.lotteryevents.ensureIndex({'goods.id': 1})
----------------------------------------------

db.opusers.dropIndexes()
db.opusers.ensureIndex({token: 1}, {unique: true})

db.users.dropIndexes()
db.users.ensureIndex({wxToken:1,nickName:1,dateTime:-1})
db.users.ensureIndex({wxToken:1,openId:1})
db.users.ensureIndex({openId:1})
db.users.ensureIndex({wxToken:1,openId:1,higherId:1,dateTime:-1})
db.users.ensureIndex({wxToken:1,integral:-1,dateTime:-1})

db.integrallogs.dropIndexes()
db.integrallogs.ensureIndex({wxToken:1,openId:1,dateTime:-1})
db.integrallogs.ensureIndex({wxToken:1,openId:1,integral:-1})
db.integrallogs.ensureIndex({wxToken:1,source:1,openId:1})
db.integrallogs.ensureIndex({wxToken:1,integral:1,timeStr:1})

db.behaviors.dropIndexes()
#db.behaviors.ensureIndex({wxToken:1})
#db.behaviors.ensureIndex({wxToken:1,behavior:1,dateTime:-1})
db.behaviors.ensureIndex({wxToken: 1,dateTime:1, description: 1, behavior: 1, result: 1})
db.behaviors.ensureIndex({wxToken: 1, description: 1, behavior: 1, result: 1})
db.behaviors.ensureIndex({wxToken: 1,openId:1, description: 1, behavior: 1, result: 1})

db.groups.dropIndexes()
#db.groups.ensureIndex({wxToken:1,key:1})
db.groups.ensureIndex({wxToken: 1, activity: 1, key: 1}, {unique: true})
db.groups.ensureIndex({wxToken: 1, activity: 1, key: 1})


db.groupuserids.dropIndexes()
db.groupuserids.ensureIndex({groupId:1,openId:1}, {unique: true})
db.groupuserids.ensureIndex({groupId:1,openId:1})

db.redpagerrecords.ensureIndex({token: 1, redPagerEventId: 1, dateTime: -1})
db.redpagerrecords.ensureIndex({token: 1, openId: 1, goodsType: 1, state: 1})


db.personals.ensureIndex({wxToken:1}, {unique: true})
db.personals.ensureIndex({wxToken:1})

db.dailyrecords.ensureIndex({type: 1, sourceId: 1, dateString: 1})


release tips
db.goods.update({use: 1}, {$set: {count: 0, ext: {playType: 5}, category: "99991000"}}, {multi: true})

version 1.1 release tips
db.goods.update({type: 105}, {$set: {vipType: "demand"}}, {multi: true})


db.lotteries.remove({from: {$in: [1, 2]}, prizeType: {$in: [1, 5]}, dateTime: {$lt: new Date(2015, 6, 13)}})
db.lotteries.count({from: {$in: [1, 2]}, prizeType: {$in: [1, 5]}, dateTime: {$lt: new Date(2015, 6, 13)}})
db.lotteries.remove({from:  {$exists: false}})

yum install python-argparse
yum install python-imaging
yum install python-xlrd
#!/usr/bin/env bash

#tbs=$(echo "show collections" | mongo smart-city-local)   //也可以获取所有表名称
#echo ${tbs};
#echo "array length: ${tbs[0]}"

host="127.0.0.1"            #主机ip
port="27017"                #mongo端口
user="userName"             #登录名
pwd="123456"                #密码
db="dbName"                 #数据库名称
#连接数据库并获取所有表名称
tbs=$(mongo -host $host --port $port -u $user -p $pwd $db --eval "db.getCollectionNames();")
#tbs=$(mongo $db --eval "db.getCollectionNames();")
#echo "========= ${tbs[0]} ========="
#截取结果获取所有表名称
tbs1=`echo ${tbs} | awk -F '[' '{print $2}' | awk -F ']' '{print $1}'`
#echo "=========${tbs1}========="
#将表名称字符串分隔为数组
OLD_IFS="$IFS"
IFS=","
arr=($tbs1)
IFS="$OLD_IFS"
#创建一个日期文件夹，将备份数据放到这个文件夹
dateStr=$(date +%Y-%m-%d)
echo ${dateStr}
path="/Users/sensoro/Desktop/${dateStr}"
if [ ! -d ${path} ]; then
  mkdir ${path}
fi

#循环导出表数据
for s in ${arr[@]}
do
    preT=${s:1:`expr ${#s}-2`}  #由于字符串带自带双引号，需要截取文本部分
    #echo ${s}
    if [ $preT == "system.indexes" ]
    then
        #echo "===============asdf"
        continue
    fi
    echo "table: ${preT}"
    #导出数据
    mongoexport -h $host --port $port -u $user -p $pwd -d $db -c ${preT} -o ${path}/city-mocha-${preT}.dat
done




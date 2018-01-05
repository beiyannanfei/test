#!/usr/bin/env bash

#tbs=$(echo "show collections" | mongo smart-city-local);   //也可以获取所有表名称
#echo ${tbs};
#echo "array length: ${tbs[0]}"


host="127.0.0.1";
port="27017";
user="test";
pwd="123456";
db="mydb";
tbs=$(mongo -host $host --port $port -u $user -p $pwd $db --eval "db.getCollectionNames();");
echo "========= ${tbs[0]} =========";
tbs1=`echo ${tbs} | awk -F '[' '{print $2}' | awk -F ']' '{print $1}'`;
echo "=========${tbs1}=========";
OLD_IFS="$IFS"
IFS=","
arr=($tbs1)
IFS="$OLD_IFS"
for s in ${arr[@]}
do
    preT=${s:1:`expr ${#s}-2`}
    #echo ${s};
    echo ${preT};
    mongoexport -h $host --port $port -u $user -p $pwd -d $db -c ${preT} -o city-mocha-${preT}.dat;
done



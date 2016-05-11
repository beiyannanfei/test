#!/usr/bin/env bash

val=`expr 2 + 2`
echo -e "Total value : ${val}\n============= 算术运算符 ============="

a=10
b=20
val=`expr ${a} + ${b}`
echo "a + b : ${val}"

val=`expr ${a} - ${b}`
echo "a - b : ${val}"

val=`expr ${a} \* ${b}`
echo "a * b : ${val}"

val=`expr ${a} / ${b}`
echo "a / b : ${val}"

val=`expr ${a} % ${b}`
echo "a % b : ${val}"

if [ $a == $b ]
then
    echo "a is equal to b"
fi

if [ ${a} != ${b} ]
then
    echo "a is not equal b"
fi

echo "============= 关系运算符 ============="
a=10
b=20
if [ $a -eq $b ]
then
    echo "$a -eq $b : a is equal to b"
else
    echo "$a -eq $b : a is not equal to b"
fi

if [ $a -ne $b ]
then
    echo "$a -ne $b: a is not equal to b"
else
    echo "$a -ne $b: a is equal to b"
fi

if [ $a -gt $b ]
then
    echo "$a -gt $b: a is greater than b";
else
    echo "$a -gt $b: a is not greater than b"
fi

if [ $a -lt $b ]
then
    echo "$a -lt $b: a is less than b"
else
    echo "$a -lt $b: a is not less than b"
fi

if [ $a -ge $b ]
then
    echo "$a -ge $b: a is greater or equal to b"
else
    echo "$a -ge $b: a is not greater or equal to b"
fi

if [ $a -le $b ]
then
    echo "$a -le $b: a is less or equal to b"
else
    echo "$a -le $b: a is not less or equal to b"
fi

echo "============= 布尔运算符 ============="
a=10
b=20
if [ $a != $b ]
then
    echo "$a != $b: a is not equal to b"
else
    echo "$a != $b: a is equal to b"
fi

if [ $a -lt 100 -a $b -gt 15 ]
then
    echo "$a -lt 100 -a $b -gt 15: return true"
else
    echo "$a -lt 100 -a $b -gt 15: return false"
fi

if [ $a -lt 100 -o $b -gt 100 ]
then
    echo "$a -lt 100 -o $b -gt 100: return true"
else
    echo "$a -lt 100 -o $b -gt 100: return false"
fi

if [ $a -lt 5 -o $b -gt 100 ]
then
    echo "$a -lt 5 -o $b -gt 100: return true"
else
    echo "$a -lt 5 -o $b -gt 100: return false"
fi

echo "============= 字符串运算符 ============="
a="abc"
b="efg"

if [ $a == $b ]
then
    echo "$a == $b: a is equal to b"
else
    echo "$a == $b: a is not equal to b"
fi

if [ $a != $b ]
then
    echo "$a != $b: a is not equal to b"
else
    echo "$a != $b: a is equal to b"
fi

if [ -z $a ]
then
    echo "-z $a: string length is zero"
else
    echo "-z $a: string length is not zero"
fi

if [ -n $a ]
then
    echo "-n $a: string length is not zero"
else
    echo "-n $a: string length is zero"
fi

if [ $a ]
then
    echo "$a: string is not empty"
else
    echo "$a: string is empty"
fi

echo "============= 文件测试运算符 ============="

file="/root/test/a.sh"
if [ -r $file ]
then
    echo "file has read success"
else
    echo "file does not have read success"
fi

if [ -w $file ]
then
    echo "file has write permission"
else
    echo "file does not have write permission"
fi

if [ -x $file ]
then
    echo "file has execute permission"
else
    echo "file does not have execute permission"
fi

if [ -f $file ]
then
    echo "file is ordinary file"
else
    echo "file is special file"
fi

if [ -d $file ]
then
    echo "file is a directory"
else
    echo "file is not a directory"
fi

if [ -s $file ]
then
    echo "file is not null"
else
    echo "file is null"
fi

if [ -e $file ]
then
    echo "file exists"
else
    echo "file does not exists"
fi
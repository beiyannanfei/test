#!/usr/bin/env bash

echo "================= 双引号 ================="
your_name='qinjx'
str="hello, I know your are \"$your_name\"!\n"
echo -e $str

echo "================= 拼接字符串 ================="
your_name="qinjx"
greeting="hello, "$your_name" !"
greeting_1="hello, ${your_name} !"
echo $greeting $greeting_1

echo "================= 获取字符串长度 ================="
string="abcd"
echo ${#string}

echo "================= 提取子字符串 ================="
string="alibaba is a great company"
echo ${string:1:4}

echo "================= 查找子字符串 ================="
string="alibaba is a great company"
echo `expr index "$string" is`
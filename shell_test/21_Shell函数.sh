#!/usr/bin/env bash

function Hello(){
    echo "Url is http://see.xidian.edu.cn/cpp/shell/"
}
Hello

ret=$?
echo "function Hello ret = ${ret}"

function funWithReturn(){
    echo "the function is to get the sum of two numbers..."
    echo -n "input first number: "
    read aNum
    echo -n "input another number: "
    read bNum
    echo "the two numbers are ${aNum} and ${bNum}"
    return $((${aNum} + ${bNum}))
}

funWithReturn
ret=$?
echo "function funWithReturn ret = ${ret}"

function number_one (){
    echo "url_1 is http://see.xidian.edu.cn/cpp/shell/"
    number_two
}

function number_two (){
    echo "Url_2 is http://see.xidian.edu.cn/cpp/u/xitong/"
}

number_one
#!/usr/bin/env bash

echo "============== if ... else 语句 =============="
a=10
b=20

if [ $a == $b ]
then
    echo "a is equal to b"
fi

if [ $a != $b ]
then
    echo "a is not equal to b"
fi

if [ $a == $b ]
then
    echo "a is equal to b"
else
    echo "a is not equal to b"
fi

echo "============== if ... elif ... fi 语句 =============="
a=10
b=20

if [ $a == $b ]
then
    echo "a is equal to b"
elif [ $a -gt $b ]
then
    echo "a is greater than b"
elif [ $a -lt $b ]
then
    echo "a is less than b"
else
    echo "None of the condition met"
fi

echo "============== if test 语句 =============="
num1=$[2*3]
num2=$[1+5]
if test $[num1] -eq $[num2]
then
    echo "the twe numbers are equal!"
else
    echo "the twe numbers are not equal!"
fi















#!/usr/bin/env bash

for loop in 1 2 3 4 5
do
    echo "the value is: ${loop}"
done

for str in "this is a string"
do
    echo ${str}
done

for file in $HOME/.bash*
do
    echo ${file}
done
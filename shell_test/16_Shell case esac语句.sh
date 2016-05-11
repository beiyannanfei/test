#!/usr/bin/env bash

#echo "please input a number between 1 to 4"
#echo "your number is :\c"
#read aNum
#
#case ${aNum} in
#    1)
#        echo "you select 1"
#    ;;
#    2)
#        echo "you select 2"
#    ;;
#    3)
#        echo "you select 3"
#    ;;
#    4)
#        echo "you select 4"
#    ;;
#    *)
#        echo "${aNum}  you do not select a number between 1 to 4"
#    ;;
#esac

echo "${0}, ${1}, ${2}"
option="${1}"
case ${option} in
    -f)
        file="${2}"
        echo "file name is ${file}"
    ;;
    -d)
        dir="${2}"
        echo "dir name is ${dir}"
    ;;
    *)
        echo "`basename ${0}`:usage: [-f file] | [-d directory]"
        exit 1
    ;;
esac
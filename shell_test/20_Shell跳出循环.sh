#!/usr/bin/env bash

#while :
#do
#    echo -n "input a number between 1 to 5: "
#    read aNum
#    case ${aNum} in
#        1|2|3|4|5)
#            echo "your number is ${aNum}"
#        ;;
#        *)
#            echo "You do not select a number between 1 to 5, game is over!"
#            break
#        ;;
#    esac
#done

#while :
#do
#    echo -n "input a number between 1 to 5: "
#    read aNum
#    case ${aNum} in
#        1|2|3|4|5)
#            echo "your number is ${aNum}"
#        ;;
#        *)
#            echo "you do not select a number between 1 to 5!"
#            continue
#            echo "game is over!"
#        ;;
#    esac
#done

nums="1 2 3 4 5 6 7"
for num in ${nums}
do
    Q=`expr $num % 2`
    if [ $Q -eq 0 ]
    then
        echo "number: ${num} is an even number!!"
        continue
    fi
    echo "found odd number: ${num}"
done
#!/usr/bin/env bash

counter=0
while [ ${counter} -lt 5 ]
do
    counter=`expr ${counter} + 1`
    echo ${counter}
done

echo "============== read file =============="
echo "type <CTRL-D> to terminate"
echo -n "enter your most liked film: "
while read film
do
    echo "Yeah! great film the ${film}"
done

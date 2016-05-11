#!/usr/bin/env bash
a=10
echo -e "value of a is ${a} \n"

DATE=`date`
echo "Date is ${DATE}"

USERS=`who | wc -l`
echo "Logged in user are ${USERS}"

UP=`date ; uptime`
echo "Uptime is ${UP}"
#!/bin/bash

case $1 in

	reload)
		pkill -HUP -f "mAD_master"
		sleep 3
		ps -aux 2> /dev/null |grep mAD_ 1>ps.log
		cat ps.log
	;;

	restart)
		kill -9 `pgrep -f mAD_` > ps.log 2>&1
		sleep 1
		node server.js $2 $3 > /opt/logs/pointMall/mAD.log ''.log 2>&1 &
		sleep 2
		ps -aux 2> /dev/null |grep mAD_ 1>ps.log
		cat ps.log
	;;

	*)
		echo "参数不正确吗, 请使用sh startup.sh reload or sh startup.sh restart"

esac





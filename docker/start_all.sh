#!/bin/sh

nohup start_nginx.sh &>/dev/null &

/usr/app/tfd/start_back.sh
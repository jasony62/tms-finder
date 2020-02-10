#!/bin/sh

echo "启动 Nginx server for tms-finder-ue"

envsubst '$NGINX_WEB_BASE_URL $NGINX_ACCESS_CONTROL_ALLOW_ORIGIN' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'
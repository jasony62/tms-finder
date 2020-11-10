#!/bin/sh

echo "启动 Nginx server for tms-finder-ue"

if [ "$SSL_CERTIFICATE" != "" -a "$SSL_CERTIFICATE_KEY" != "" ] then
    echo "启用 Nginx ssl 端口"
    sed -i "s/#ssl_server//" /etc/nginx/nginx.conf.template
    envsubst '$NGINX_WEB_BASE_URL $NGINX_ACCESS_CONTROL_ALLOW_ORIGIN $SSL_CERTIFICATE $SSL_CERTIFICATE_KEY' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'
else 
    echo "启用 Nginx 非ssl 端口"
    sed -i "s/#nonssl_server//" /etc/nginx/nginx.conf.template
    envsubst '$NGINX_WEB_BASE_URL $NGINX_ACCESS_CONTROL_ALLOW_ORIGIN' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'
fi

#!/bin/sh

echo "启动 Nginx server for tms-finder-ue"

if [ "$TMS_APP_HTTPS_SSL_CERT" != "" -a "$TMS_APP_HTTPS_SSL_KEY" != "" ];
then
    echo "启用 Nginx https 端口"
    sed -i "s/#ssl_server//" /etc/nginx/nginx.conf.template
    envsubst '$NGINX_WEB_BASE_URL $NGINX_ACCESS_CONTROL_ALLOW_ORIGIN $TMS_APP_HTTPS_SSL_CERT $TMS_APP_HTTPS_SSL_KEY' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'
else 
    echo "启用 Nginx http 端口"
    sed -i "s/#nonssl_server//" /etc/nginx/nginx.conf.template
    envsubst '$NGINX_WEB_BASE_URL $NGINX_ACCESS_CONTROL_ALLOW_ORIGIN' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'
fi

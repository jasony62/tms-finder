# 开箱即用的tms-finder镜像

# 服务预编译
FROM node:16.15-alpine3.15 AS builder
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories

# 安装基础包
RUN npm install -g pnpm typescript

# 安装Python3，为安装sharp做准备
RUN apk add --update --no-cache py3-pip python3
# 解决sharp依赖的libvips包下载慢的问题
COPY ../docker/npmlibs/_libvips/libvips-8.12.2-linuxmusl-x64.tar.br /root/.npm/_libvips/libvips-8.12.2-linuxmusl-x64.tar.br

# 复制源代码
COPY ../packages/tfd-kit /usr/src/tfd/kit
COPY ../packages/tfd-back /usr/src/tfd/back
RUN sed -i 's/"tfd-kit": "workspace:\*"/"tfd-kit": "file:\.\.\/kit"/g' /usr/src/tfd/back/package.json
COPY ../packages/ue /usr/src/tfd/ue

# 编译源代码

## kit
RUN cd /usr/src/tfd/kit && pnpm i --strict-peer-dependencies=false && pnpm build 
## back
RUN cd /usr/src/tfd/back && pnpm i --strict-peer-dependencies=false && pnpm build 
## ue_admin
ARG vite_base_url
RUN echo VITE_BASE_URL=$vite_base_url >> /usr/src/tfd/ue/.env
RUN cd /usr/src/tfd/ue && pnpm i --strict-peer-dependencies=false && pnpm build

WORKDIR /usr/src/packages

# 生成运行镜像

FROM node:16.15-alpine3.15 
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
  && apk update && apk add bash tzdata \
  && cp -r -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN apk add nginx gettext

# ue
COPY --from=builder /usr/src/tfd/ue/dist /usr/share/nginx/html
COPY --from=builder /usr/src/tfd/ue/nginx.conf.template /etc/nginx/nginx.conf.template
COPY --from=builder /usr/src/tfd/ue/start_nginx.sh /usr/local/bin/start_nginx.sh
RUN chmod +x /usr/local/bin/start_nginx.sh

# back
COPY --from=builder /usr/src/tfd/back/node_modules /usr/app/node_modules
COPY --from=builder /usr/src/tfd/back/dist /usr/app/dist
COPY --from=builder /usr/src/tfd/back/package.json /usr/app/package.json
RUN sed -i 's/"tfd-kit": "file:\.\.\/kit"/"tfd-kit": "\*"/g' /usr/app/package.json
COPY ../docker/start_back.sh /usr/app/start_back.sh
RUN chmod +x /usr/app/start_back.sh

WORKDIR /usr/app

# 启动服务
COPY ../docker/start_all.sh /usr/local/bin/start_all.sh 
RUN chmod +x /usr/local/bin/start_all.sh 

CMD ["start_all.sh"]
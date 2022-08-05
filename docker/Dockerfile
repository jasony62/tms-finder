# 开箱即用的tms-finder镜像

FROM node:16.15-alpine3.15 AS builder
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories

# 安装基础包
RUN npm install -g pnpm typescript

# 解决sharp依赖的libvips包下载慢的问题
COPY ../docker/back/npmlibs/_libvips/libvips-8.12.2-linuxmusl-x64.tar.br /root/.npm/_libvips/libvips-8.12.2-linuxmusl-x64.tar.br

# 复制package.json安装依赖包
# 先安装依赖包，再复制和编译代码，是为了制作镜像时避免反复下载依赖包
## kit 需要先编译，有内部来依赖关系
COPY ../packages/tfd-kit /usr/src/tfd/kit
RUN cd /usr/src/tfd/kit && pnpm i --strict-peer-dependencies=false && pnpm build
## 必须清楚，否则会有导致依赖不通tms-koa的问题
RUN rm -rf /usr/src/tfd/kit/node_modules
RUN cd /usr/src/tfd/kit && pnpm i --production --strict-peer-dependencies=false

## back安装依赖包
COPY ../packages/tfd-back/package.json /usr/src/tfd/back/package.json
RUN sed -i 's/"tfd-kit": "workspace:\*"/"tfd-kit": "file:\.\.\/kit"/g' /usr/src/tfd/back/package.json
RUN cd /usr/src/tfd/back && pnpm i --strict-peer-dependencies=false
## ue安装依赖包
COPY ../packages/ue/package.json /usr/src/tfd/ue/package.json
RUN cd /usr/src/tfd/ue && pnpm i --strict-peer-dependencies=false

## back复制编译需要的文件
COPY ../packages/tfd-back/src /usr/src/tfd/back/src
COPY ../packages/tfd-back/tsconfig.json /usr/src/tfd/back/tsconfig.json
COPY ../packages/tfd-back/tsconfig.build.json /usr/src/tfd/back/tsconfig.build.json
## ue复制编译需要的文件
COPY ../packages/ue /usr/src/tfd/ue

# 编译源代码
## back
RUN cd /usr/src/tfd/back && pnpm build
## 清除开发依赖包对最终镜像的大小影响非常小，跳过
# RUN rm -rf  /usr/src/tfd/back/node_modules
# RUN cd /usr/src/tfd/back && pnpm i --production

## ue
ARG vite_base_url
RUN echo VITE_BASE_URL=$vite_base_url >> /usr/src/tfd/ue/.env
RUN cd /usr/src/tfd/ue && pnpm build

# WORKDIR /usr/src/packages

# 生成运行镜像
FROM node:16.15-alpine3.15 
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
  && apk update && apk add bash tzdata \
  && cp -r -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN apk add nginx gettext

# ue
COPY --from=builder /usr/src/tfd/ue/dist /usr/share/nginx/html
COPY ../docker/ue/nginx.conf.template /etc/nginx/nginx.conf.template
COPY ../docker/ue/start_nginx.sh /usr/local/bin/start_nginx.sh
RUN chmod +x /usr/local/bin/start_nginx.sh

# back
COPY --from=builder /usr/src/tfd/back/node_modules /usr/app/tfd/node_modules
COPY --from=builder /usr/src/tfd/back/dist /usr/app/tfd/dist
COPY --from=builder /usr/src/tfd/back/package.json /usr/app/tfd/package.json
RUN sed -i 's/"tfd-kit": "file:\.\.\/kit"/"tfd-kit": "\*"/g' /usr/app/tfd/package.json
COPY ../docker/back/start_back.sh /usr/app/tfd/start_back.sh
RUN chmod +x /usr/app/tfd/start_back.sh

WORKDIR /usr/app/tfd

# 启动服务
COPY ../docker/start_all.sh /usr/local/bin/start_all.sh 
RUN chmod +x /usr/local/bin/start_all.sh 

# 默认配置文件
COPY ../docker/back/config /usr/app/tfd/config

ENTRYPOINT ["start_all.sh"]
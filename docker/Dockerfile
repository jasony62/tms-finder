# 开箱即用的tms-finder镜像

FROM node:18-alpine AS builder
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories

# 修改npm源
RUN npm config set registry https://registry.npmmirror.com

# 安装基础包
RUN npm install -g pnpm typescript

# 复制package.json安装依赖包
## data
COPY ./packages/tfd-data /usr/src/tfd/data
RUN cd /usr/src/tfd/data && pnpm i --strict-peer-dependencies=false && pnpm build 
### 去掉不必要的依赖包
# RUN rm -rf /usr/src/tfd/data/node_modules
# RUN cd /usr/src/tfd/data && pnpm i --production --strict-peer-dependencies=false

## kit
COPY ./packages/tfd-kit /usr/src/tfd/kit
RUN sed -i 's/"tfd-data": "workspace:\*"/"tfd-data": "file:\.\.\/data"/g' /usr/src/tfd/kit/package.json
RUN cd /usr/src/tfd/kit && pnpm i --strict-peer-dependencies=false && pnpm build 
# ### 去掉不必要的依赖包
# RUN rm -rf /usr/src/tfd/kit/node_modules
# RUN cd /usr/src/tfd/kit && pnpm i --production --strict-peer-dependencies=false

## plugin
COPY ./packages/plugins /usr/src/tfd/plugins
RUN sed -i 's/"tfd-data": "workspace:\*"/"tfd-data": "file:\.\.\/data"/g' /usr/src/tfd/plugins/package.json
RUN sed -i 's/"tfd-kit": "workspace:\*"/"tfd-kit": "file:\.\.\/kit"/g' /usr/src/tfd/plugins/package.json
RUN cd /usr/src/tfd/plugins && pnpm i --strict-peer-dependencies=false && pnpm build 
### 去掉不必要的依赖包
# RUN rm -rf /usr/src/tfd/plugins/node_modules
# RUN cd /usr/src/tfd/plugins && pnpm i --production --strict-peer-dependencies=false

## back安装依赖包
COPY ./packages/tfd-back/package.json /usr/src/tfd/back/package.json
RUN sed -i 's/"tfd-data": "workspace:\*"/"tfd-data": "file:\.\.\/data"/g' /usr/src/tfd/back/package.json
RUN sed -i 's/"tfd-kit": "workspace:\*"/"tfd-kit": "file:\.\.\/kit"/g' /usr/src/tfd/back/package.json
RUN cd /usr/src/tfd/back && pnpm i --strict-peer-dependencies=false

## ue安装依赖包
COPY ./packages/ue/package.json /usr/src/tfd/ue/package.json
RUN cd /usr/src/tfd/ue && pnpm i --strict-peer-dependencies=false

## ue_plugin安装依赖包
COPY ./packages/ue_plugin/package.json /usr/src/tfd/ue_plugin/package.json
RUN cd /usr/src/tfd/ue_plugin && pnpm i --strict-peer-dependencies=false

## back复制编译需要的文件
COPY ./packages/tfd-back/src /usr/src/tfd/back/src
COPY ./packages/tfd-back/tsconfig.json /usr/src/tfd/back/tsconfig.json
COPY ./packages/tfd-back/tsconfig.build.json /usr/src/tfd/back/tsconfig.build.json
## ue复制编译需要的文件
COPY ./packages/ue /usr/src/tfd/ue

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
### 建立空的前端配置文件
RUN echo '{"backFsPort":3000,"backFsBase":"fs","bucketMode":true}' >> /usr/src/tfd/ue/dist/${vite_base_url:-tmsfinder}/settings.json

## ue_plugin
COPY ./packages/ue_plugin /usr/src/tfd/ue_plugin
ARG vite_plugin_base_url
RUN echo VITE_BASE_URL=$vite_plugin_base_url >> /usr/src/tfd/ue_plugin/.env
RUN cd /usr/src/tfd/ue_plugin && pnpm build

# WORKDIR /usr/src/packages

# 生成运行镜像
FROM node:18-alpine
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
  && apk update && apk add bash tzdata \
  && cp -r -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN apk add nginx gettext

# ue_plugin
COPY --from=builder /usr/src/tfd/ue_plugin/dist /usr/share/nginx/html

# ue
COPY --from=builder /usr/src/tfd/ue/dist /usr/share/nginx/html
COPY ./docker/ue/nginx.conf.template /etc/nginx/nginx.conf.template
COPY ./docker/ue/start_nginx.sh /usr/local/bin/start_nginx.sh
RUN chmod +x /usr/local/bin/start_nginx.sh

# back
COPY --from=builder /usr/src/tfd/back/node_modules /usr/app/tfd/node_modules
COPY --from=builder /usr/src/tfd/back/dist /usr/app/tfd/dist
COPY --from=builder /usr/src/tfd/back/package.json /usr/app/tfd/package.json
RUN sed -i 's/"tfd-data": "file:\.\.\/data"/"tfd-data": "\*"/g' /usr/app/tfd/package.json
RUN sed -i 's/"tfd-kit": "file:\.\.\/kit"/"tfd-kit": "\*"/g' /usr/app/tfd/package.json
COPY ./docker/back/start_back.sh /usr/app/tfd/start_back.sh
RUN chmod +x /usr/app/tfd/start_back.sh

# 内置控制器插件
## 定时任务控制器插件
COPY ./docker/back/ctrl-plugins/bucket.json /usr/app/tfd/ctrl_plugin_config/bucket.json

# 内置前端plugins
COPY --from=builder /usr/src/tfd/plugins/dist /usr/app/tfd/plugins/dist
COPY --from=builder /usr/src/tfd/plugins/node_modules /usr/app/tfd/plugins/node_modules

WORKDIR /usr/app/tfd

# 启动服务
COPY ./docker/start_all.sh /usr/local/bin/start_all.sh 
RUN chmod +x /usr/local/bin/start_all.sh 

# 默认配置文件
COPY ./docker/back/config /usr/app/tfd/config

ENTRYPOINT ["start_all.sh"]

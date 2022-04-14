FROM node:16.9.1-alpine3.14

# 设置时区
RUN sed -i 's?http://dl-cdn.alpinelinux.org/?https://mirrors.aliyun.com/?' /etc/apk/repositories && \
  apk add -U tzdata && \
  cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
  apk del tzdata

RUN yarn config set registry https://registry.npm.taobao.org --global && \
  yarn config set disturl https://npm.taobao.org/dist --global

# 安装Python3，为安装sharp做准备
RUN apk add --update --no-cache py3-pip python3

# 解穴sharp依赖的libvips包下载慢的问题
COPY ./npmlibs/_libvips/libvips-8.12.2-linuxmusl-x64.tar.br /root/.npm/_libvips/libvips-8.12.2-linuxmusl-x64.tar.br

WORKDIR /home/node/app

COPY ./package.json ./

RUN yarn install --production

COPY . .

RUN chmod +x /home/node/app/wait_for.sh

CMD [ "node", "server" ]
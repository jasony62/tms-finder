FROM node:16.9.1-alpine3.14

# 设置时区
RUN sed -i 's?http://dl-cdn.alpinelinux.org/?https://mirrors.aliyun.com/?' /etc/apk/repositories && \
  apk add -U tzdata && \
  cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
  apk del tzdata

RUN yarn config set registry https://registry.npm.taobao.org --global && \
  yarn config set disturl https://npm.taobao.org/dist --global

WORKDIR /home/node/app

COPY ./package.json ./

RUN yarn install --production

COPY . .

RUN chmod +x /home/node/app/wait_for.sh

CMD [ "node", "server" ]
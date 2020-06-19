FROM node:12.10.0-alpine

# 设置时区
RUN sed -i 's?http://dl-cdn.alpinelinux.org/?https://mirrors.aliyun.com/?' /etc/apk/repositories && \
  apk add -U tzdata && \
  cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
  apk del tzdata

RUN npm install cnpm -g

WORKDIR /home/node/app

COPY ./package.json ./

RUN cnpm i --production

COPY . .

RUN chmod +x /home/node/app/wait_for.sh

CMD [ "node", "server" ]
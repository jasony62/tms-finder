# 目录说明

## tfd-back

后端服务

## tfd-kit

开发工具包

## ue

客户端

## demo

演示嵌入使用

# 运行服务

## 后端服务

在 packages/tfd-back 目录中执行

```
TMS_KOA_CONFIG_DIR=../../docker/back/config 
TMS_KOA_CONTROLLERS_DIR=./dist/controllers 
TFD_APP_PORT=3030 
TFD_MONGODB_HOST=localhost 
TFD_MONGODB_PORT=27017 
TFD_FS_ROOTDIR=../../volumes/files 

node dist/server
```

## 客户端

```
pnpm dev
```

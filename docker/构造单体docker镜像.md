在一个容器中运行整个应用（`back`+`ue`，不包含`mongodb`，`redis`等中间件）。

# 构造说明

进行两阶段构建，第一个阶段编译各个模块（ts->js），生成运行代码；第二个阶段将生成的代码部署到运行环境。

通过`.dockerignore`忽略不需要复制的文件，例如：`node_modules`，`dist`等。

## 后端服务

后端服务`tfd-back`基于`tms-koa`框架实现，主要是通过配置文件进行设置。镜像包含基础配置文件，部分配置可通过环境变量调整。

后端服务分为两个包：`tfd-kit`和`tfd-back`，`tfd-back`依赖`tfd-kit`。为了开发方便，代码仓库中使用了`pnpm`的`workspace`，实现了依赖包的本地引用。在构造镜像时没有复制整个`packages`目录，而是单独的复制的各个包，通过改写`tmw-back`的`package.json`文件，将依赖关系变为本地依赖，方法如下：

```Dockerfile
RUN sed -i 's/"tfd-kit": "workspace:\*"/"tfd-kit": "file:\.\.\/kit"/g' /usr/src/tfd/back/package.json
```

在运行部署阶段，只需要复制`tfd-back`编译后的代码，其中已经包含`tfd-kit`。为了规范，再进行一次`package.json`改写，变为不依赖特定版本的形式。

```Dockerfile
RUN sed -i 's/"tfd-kit": "file:\.\.\/kit"/"tfd-kit": "\*"/g' /usr/app/package.json
```

参考：[package.json](https://docs.npmjs.com/cli/v6/configuring-npm/package-json#local-paths)

在项目根目录下执行

```bash
docker build -f ./docker/Dockerfile -t tms/tfd-aio .
```

运行并进入容器

```bash
docker run -it --rm --name tfd-test tms/tfd-aio sh
```

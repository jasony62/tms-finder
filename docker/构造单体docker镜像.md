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

## 前端代码（admin）

前端项目支持设置入口地址（base_url）。该设置在编译阶段通过环境变量`VITE_BASE_URL`设置，在`ue/vite.config.js`中使用（在`nginx.config`也要进行相应的设置，后面进行说明）。`VITE_BASE_URL`在代码中设置了默认值`/tmsfinder`，若需要修改，可以在构造镜像时通过`--build-arg vite_base_url=xxx`进行指定。`VITE_BASE_URL`同时也指定了编译生成的代码在`dist`中目录，默认生成的代码在`dist/tmsfinder`目录中。

前端代码部署在`nginx`中，位置为`/usr/share/nginx/html`。为了支持在一个`nginx`实例下部署多个前端项目，每个前端项目用`VITE_BASE_URL`指定的值作为起始目录。需要在`nginx.conf`中进行路由匹配，内容如下：

```nginx
location /admin {
    index index.html;
    try_files $uri $uri/ /admin/index.html;
}
```

在项目根目录下执行

```bash
docker build -f ./docker/Dockerfile -t tms/tfd-aio .
```

运行并进入容器

```bash
docker run -it --rm --name tfd-test tms/tfd-aio sh
```

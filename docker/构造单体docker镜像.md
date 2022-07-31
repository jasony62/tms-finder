在一个容器中运行整个应用（`back`+`ue`，不包含`mongodb`，`redis`等中间件）。

应用在容器中的目录`/usr/app/tfd`。可在此目录下指定配置文件，例如：`config`，`auth_client_account`，`ctrl_plugin_config`。

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
location /tmsfinder {
    index index.html;
    try_files $uri $uri/ /tmsfinder/index.html;
}
```

该配置中的`/tmsfinder`是通过启动脚本`start_nginx.sh`通过`envsubst`通过环境变量`NGINX_TFD_UE_BASE_URL`（默认值为`/tmsfinder`）替换，通过模板文件`nginx.conf.template`生成`nginx.conf`实现。该环境变量生效于容器阶段，因此可以通过`--env NGINX_TFD_UE_BASE_URL=xxx`进行设置。

前端页面需要访问后端的 API 可以采用两种方式：1、前端直接访问 API 的地址；2、前端通过 nginx 代理访问 API。访问方式 1 有两种实现方式：1、在编译阶段通过环境变量指定，具体说明参见`docs/环境变量.md`中的说明；2、通过配置文件在运行时指定。前端页面打开时首先会请求根地址下的`settings.json`文件，根据其中的内容获取后端 API 的访问地址，`settings.json`内容如下：

```json
{
  "authApiBase": "auth",
  "authApiPort": 3030,
  "backApiBase": "api",
  "backApiPort": 3030,
  "backFsBase": "fs",
  "backFsPort": 3030
}
```

该文件中的配置信息必须与`tfd-back`中的配置信息一致。在构建节点为配置环境变量，运行阶段也未配置`settings.json`，那么前端页面就会采用通过 nginx 代理的方式访问 API。

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
}
```

后端服务的地址在`nginx.conf.template`文件中通过环境变量`$NGINX_TFD_BACK_BASE_URL`指定，在容器运行时，通过`envsubst`命令替换，生成在`nginx.conf`文件。

# 使用镜像

在项目根目录下执行

```bash
docker build -f ./docker/Dockerfile -t tms/tfd-aio .
```

运行并进入容器

```bash
docker run -it --rm --name tfd-test tms/tfd-aio sh
```

将宿主机目录映射为文件服务根目录

```
docker run -it --rm --name tfd-test -p 3030:3000 -p 7077:80 -v $PWD/volumes/files:/usr/app/storage tms/tfd-aio
```

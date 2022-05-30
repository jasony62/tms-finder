# 启动

## windows 平台

当在本地启动时，可能会遇到 npm install 数次不成功的问题，经实验以下配置是可运行的。

1. 需要nodejs@16.9.1、python@3.10.4的版本

2. 因 back 依赖 sharp 包，需提前下载好 lib 包，放置在 npm cache（查询目录方法：`npm config get cache`）目录下。lib 包的版本需要根据当时报错的情况再去 github 下载，毕竟 sharp 包的版本不同。

3. 可以将 npm 包版本降低，比如`npm install -g npm@6`。因为 npm7 比 npm6 安装时，校验更严格。

4. 保证网络环境较好，比如能顺利访问 github。

5. 执行`npm install`才会比较顺利，不出错。

`tms-finder`项目是一个在线文档管理系统，`back`目录下是用`node`实现的后端服务，`ue`目录下是用`Vue`实现的用户端应用，`build`后会部署到`nginx`中。上传文件时用户可以输入文件的描述信息（可配置），文件会存在放在服务端指定的本地硬盘上（可配置），描述信息会保存在指定的`mongodb`中（可配置）。

这个项目是**开箱即用**的，在安装好`docker`和`docker-compose`的机器上，从`github`拉取代码，执行`docker-compose up -d`命令就可以把整个应用运行起来。

这个项目是**环境友好**的，制作的默认镜像可以灵活部署在不同的环境中（通过设置环境变量），也可以根据环境的要求制作新的镜像（通过设置构建参数）。

这个项目是**编码友好**的，程序员可以有选择地使用 docker，前后端都可以在容器外运行，方便调试代码。

# 启动服务

> git clone https://github.com/jasony62/tms-finder

> cd tms-finder

单机运行

> docker-compose -f docker-compose.yml -f docker-compose.local.yml up -d

在浏览器中输入：http://localhost:8080/finder_ue/web

在实际环境中部署时，可以新建`docker-compose.override.yml`设置需要的参数，执行如下启动命令：

> docker-compose up --build -d

# 关闭服务

> docker-compose down

# 应用配置

> docker-compose -f docker-compose.yml -f docker-compose.xxxx.yml up -d

## 服务端（back）

### 环境变量

| 变量                             | 说明                                                                  | 默认值     |
| -------------------------------- | --------------------------------------------------------------------- | ---------- |
| TMS_APP_NAME                     | 后台服务名称                                                          | tms-finder |
| TMS_APP_PORT                     | 后台服务端口                                                          | 3000       |
| TMS_FINDER_MONGODB_HOST          | 记录上传文件信息的 mongodb 地址                                       | localhost  |
| TMS_FINDER_MONGODB_PORT          | 记录上传文件信息的 mongodb 端口                                       | 27017      |
| TMS_FINDER_FS_ROOTDIR            | 上传文件在本地磁盘的存储位置                                          | storage    |
| TMS_FINDER_FS_CUSTOMNAME         | 用户自行指定上传文件的存储目录及命名                                  | true       |
| TMS_FINDER_FS_MONGODB_SOURCE     | 记录上传文件信息的 mongodb 数据源，和配置文件`mongodb.js`中的内容对应 | master     |
| TMS_FINDER_FS_MONGODB_DATABASE   | 记录上传文件信息的 mongodb 数据库                                     | upload     |
| TMS_FINDER_FS_MONGODB_COLLECTION | 记录上传文件信息的 mongodb 集合                                       | files      |

TMS_FINDER_FS_CUSTOMNAME 这个不合理，因为每个 domain 的规则可能不一样

### 配置文件

config/app.js

---

config/mongodb.js

---

config/fs.js

---

config/log4js.js

## 用户端（ue）

### 环境变量

| 变量                       | 说明                                                                     | 默认值                   |
| -------------------------- | ------------------------------------------------------------------------ | ------------------------ |
| VUE_APP_BASE_URL           | 应用的基础路径（域名后的子地址）                                         | finder_ue                |
| VUE_APP_AUTH_SERVER        | 用户鉴权 API 地址                                                        | http://localhost:3000    |
| VUE_APP_LOGIN_KEY_USERNAME | 用户鉴权 API 中用到的字段，用户名                                        | username                 |
| VUE_APP_LOGIN_KEY_PASSWORD | 用户鉴权 API 中用到的字段，密码                                          | password                 |
| VUE_APP_LOGIN_KEY_PIN      | 用户鉴权 API 中用到的字段，验证码                                        | pin                      |
| VUE_APP_SUPPORT_MULTI_VIEW | 支持切换试图，用字符串`no`或`false`，不区分大小写，进行关闭。            | 是                       |
| VUE_APP_SUPPORT_SET_INFO   | 支持指定文件扩展信息。                                                   | 是                       |
| VUE_APP_API_SERVER         | 业务 API 地址                                                            | http://localhost:3000    |
| VUE_APP_FS_SERVER          | 文件下载服务起始地址。和后台服务`app.router.prefix`对应。                | http://localhost:3000/fs |
| VUE_APP_API_PASS_COOKIE    | 调用后端`api`时是否允许传递`cookie`，字符串`yes`或`true`，不区分大小写。 | 否                       |

# 参考

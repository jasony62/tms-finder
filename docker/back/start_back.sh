# 指定环境变量

## mongodb
export TMS_MONGODB_HOST=${TMS_MONGODB_HOST:-host.docker.internal}
export TMS_MONGODB_PORT=${TMS_MONGODB_PORT:-27017}
export TMS_MONGODB_USER=${TMS_MONGODB_USER:-root}
export TMS_MONGODB_PASSWORD=${TMS_MONGODB_USER:-root}

#$ redis
export TMS_REDIS_DISABLED=${TMS_REDIS_DISABLED:-yes}

#$ 指定控制器目录
export TMS_KOA_CONTROLLERS_DIR=./dist/controllers 

# 启动服务
node dist/server
const { ImageCtrl } = require('tms-koa/lib/controller/fs/image')

/** 图片文件控制器 */
class Image extends ImageCtrl {
  constructor(...args) {
    super(...args)
  }
}

module.exports = Image

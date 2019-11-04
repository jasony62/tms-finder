const { ImageCtrl } = require('tms-koa/lib/controller/fs/image')
const { ResultData, ResultFault, ResultObjectNotFound } = require('tms-koa')

class Image extends ImageCtrl {
  constructor(...args) {
    super(...args)
  }
}

module.exports = Image

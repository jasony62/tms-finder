const { UploadCtrl } = require('tms-koa/lib/controller/fs')

class Upload extends UploadCtrl {
  constructor(...args) {
    super(...args)
  }
}

module.exports = Upload

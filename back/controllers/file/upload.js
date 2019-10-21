const { UploadCtrl } = require('tms-koa/lib/controller/fs')
const { ResultData, ResultFault, ResultObjectNotFound } = require('tms-koa')

class Upload extends UploadCtrl {
  constructor(...args) {
    super(...args)
  }
}

module.exports = Upload

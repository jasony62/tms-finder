const { ResultData, ResultFault } = require('tms-koa')
const { UploadCtrl } = require('tms-koa/lib/controller/fs')
const { LocalFD } = require('../../models/fs/local')

class Upload extends UploadCtrl {
  constructor(...args) {
    super(...args)
  }
  async tmsBeforeEach() {
    await super.tmsBeforeEach()
    this.localFD = new LocalFD(this.domain, this.bucket)
  }
  mkdir() {
    const { dir } = this.request.query
    const result = this.localFD.mkdir(dir)
    if (false === result[0]) return new ResultFault(result[1])

    return new ResultData('ok')
  }
  rmdir() {
    const { dir } = this.request.query
    const result = this.localFD.rmdir(dir)
    if (false === result[0]) return new ResultFault(result[1])

    return new ResultData('ok')
  }
}

module.exports = Upload

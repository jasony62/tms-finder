const { BrowseCtrl } = require('tms-koa/lib/controller/fs')
const { ResultData, ResultFault, ResultObjectNotFound } = require('tms-koa')
const { LocalFS } = require('tms-koa/lib/model/fs/local')

class Browse extends BrowseCtrl {
  constructor(...args) {
    super(...args)
  }
  /**
   * 获取文件及目录
   */
  async list() {
    let { dir } = this.request.query
    let localFS = new LocalFS('upload', { fileConfig: this.fsConfig })
    let { files, dirs } = localFS.list(dir)
    for (let file of files) {
      //
      file.createTime = Math.floor(file.birthtime)
      delete file.birthtime
      //
      let info = await this.getBizInfo(file.path)
      file.info = typeof info === 'object' ? info : {}
    }
    for (let dir of dirs) {
      if (dir.sub.files > 0) {
        dir.sub.files = true
      } else {
        dir.sub.files = false
      }
      if (dir.sub.dirs > 0) {
        dir.sub.dirs = true
      } else {
        dir.sub.dirs = false
      }
    }

    return new ResultData({ files, dirs })
  }
}

module.exports = Browse

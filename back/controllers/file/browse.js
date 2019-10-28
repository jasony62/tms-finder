const { BrowseCtrl } = require('tms-koa/lib/controller/fs')
const { ResultData, ResultFault, ResultObjectNotFound } = require('tms-koa')
const _ = require('lodash')
const path = require('path')
const { LocalFS } = require('tms-koa/lib/model/fs/local')

class Browse extends BrowseCtrl {
  constructor(...args) {
    super(...args)
  }
  /**
   * 获取文件及目录
   */
  async list() {
    let oUser = this.client.data
    let tbl = _.get(this.fsConfig, ['local', 'database', 'file_table'], '')
    let rootDir = _.get(this.fsConfig, ['local', 'rootDir'], '')
    let { dir = '' } = this.request.query

    // 获取一级文件夹
    let localFS = new LocalFS('upload', { fileConfig: this.fsConfig })
    let { dirs } = localFS.list(dir)

    let fsDb = this.fsDb
    if (!fsDb) return new ResultFault('数据库连接失败')

    //获取文件
    let stmt = fsDb.newSelect(tbl, '*')
    stmt.where.fieldMatch('userid', '=', oUser.uid).fieldMatch('path', 'like', rootDir + '%')
    let files = await stmt.exec()

    files.forEach(file => {
      let fPath = path.dirname(file.path.replace(rootDir, "")).split(path.sep)
      file.path = fPath
    })

    let data = { dirs: dirs, files: files }
    return new ResultData(data)
  }
}

module.exports = Browse

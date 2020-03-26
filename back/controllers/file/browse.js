const { BrowseCtrl } = require('tms-koa/lib/controller/fs')
const { ResultData, ResultFault, ResultObjectNotFound } = require('tms-koa')
const { LocalFS } = require('tms-koa/lib/model/fs/local')
const glob = require('glob')
const _ = require('lodash')
const fs = require('fs')
const pathObj = require('path')

class Browse extends BrowseCtrl {
  constructor(...args) {
    super(...args)
  }
  /**
   * 获取文件及目录
   */
  async list() {
    let { dir } = this.request.query
    let localFS = new LocalFS(this.domain)
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
      dir.createTime = Math.floor(dir.birthtime)
      delete dir.birthtime
      //
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
  /**
   *
   */
  async listAll() {
    let { dir, basename = '' } = this.request.body
    let rootDir = _.get(this.fsConfig, ['local', 'rootDir'], '')

    let path = dir ? rootDir + '/' + dir : rootDir
    let globInstance = new glob.Glob(path + '/**/*+(' + basename + ')*', { matchBase: true, sync: true })

    let dirs = []
    let files = []
    for (const file of globInstance.found) {
      let stats = fs.lstatSync(file)
      if (stats.isFile()) {
        //
        let info = await this.getBizInfo(file)
        let fileInfo = typeof info === 'object' ? info : {}
        files.push({
          name: pathObj.basename(file),
          size: stats.size,
          createTime: Math.floor(stats.birthtimeMs),
          path: file,
          info: fileInfo
        })
      } else if (stats.isDirectory()) {
        let file2 = file.replace(path, '')
        dirs.push({ name: file2, createTime: Math.floor(stats.birthtimeMs) })
      }
    }

    return new ResultData({ files, dirs })
  }
}

module.exports = Browse

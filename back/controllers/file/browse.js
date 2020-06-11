const { BrowseCtrl } = require('tms-koa/lib/controller/fs')
const { ResultData } = require('tms-koa')
const { LocalFS } = require('tms-koa/lib/model/fs/local')
const glob = require('glob')
const fs = require('fs')
const pathObj = require('path')

class Browse extends BrowseCtrl {
  constructor(...args) {
    super(...args)
  }
  /**
   *
   */
  async listAll() {
    let { dir, basename = '' } = this.request.body

    let localFS = new LocalFS(this.domain, this.bucket)
    let path = localFS.fullpath(dir)

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
          createTime: stats.birthtimeMs,
          path: file,
          info: fileInfo,
        })
      } else if (stats.isDirectory()) {
        let file2 = file.replace(path, '')
        dirs.push({ name: file2, createTime: stats.birthtimeMs })
      }
    }

    return new ResultData({ files, dirs })
  }
}

module.exports = Browse

const { BrowseCtrl } = require('tms-koa/lib/controller/fs')
const { ResultData, ResultFault, ResultObjectNotFound } = require('tms-koa')
const { LocalFS } = require('tms-koa/lib/model/fs/local')
const glob = require("glob")
const _ = require('lodash')

class Browse extends BrowseCtrl {
  constructor(...args) {
    super(...args)
  }
  /**
   * 获取文件及目录
   */
  async list() {
    let { dir, filter = '' } = this.request.query
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
  async list2() {
    let rootDir = _.get(this.fsConfig, ['local', 'rootDir'], '')
    console.log(rootDir + "/*.png")
    // let files
    // glob(rootDir + "/*.png", { matchBase: true }, function (er, files2) {
    //   console.log(files2)
    //   files = files2
    //   if (er) {
    //     console.log(er)
    //   }
    // })


    let globInstance = new glob.Glob(rootDir + "/upload/*+(a)*+(76)*", { nonull: false, matchBase: true, sync: true });
    console.log(globInstance);



    return new ResultData(globInstance.found)
  }
}

module.exports = Browse

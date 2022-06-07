const { PluginHttpSend } = require('../models/plugin')
const { LocalFS } = require('tms-koa/lib/model/fs/local')
const fs = require('fs-extra')
const path = require('path')

class Files extends PluginHttpSend {
  get name() {
    return 'files'
  }
  get scope() {
    return 'file'
  }
  get transData() {
    return 'more' //'nothing:无/one:一条/more:多条'
  }
  get visible() {
    return {
      key: '',
      value: ''
    }
  }
  get title() {
    return '测试fs'
  }
  get description() {
    return '获取文件信息'
  }
  get method() {
    return 'post'
  }
  get disabled() {
    return false
  }
  getUrl() {
    return ''
  }
  async getBody() {

    return [true, '测试']
  }
  async execute(ctx) {
    const FsBase = new FilesBase(this)
    const fsInfo = FsBase.fileInfo(ctx)
    return fsInfo
  }
}

class FilesBase {
  
  fileInfo(ctx) {
    const { dir } = ctx.query
    let { names, filter } = ctx.request.body

    const tmsFs = new LocalFS(ctx.domain, ctx.bucket)
    const fullpath = tmsFs.fullpath(dir)
    names = this.findRequestFs(names, filter, fullpath)

    let files = []
    names.forEach((name) => {
      let resolvedPath = path.resolve(fullpath, name)
      let stats = fs.statSync(resolvedPath)
      if (stats.isFile()) {
        stats.filename = name
        files.push(stats)
      }
    })
    return files
  }

  findRequestFs(names, filter, fullpath) {
    let fsNames
    if (names && Array.isArray(names) && names.length > 0) {
      fsNames = names
    } else {
      if (typeof filter === 'string' && /all/i.test(filter)) {
        fsNames = fs.readdirSync(path.resolve(fullpath))
      }
    }

    return fsNames
  }
}

/**创建插件 */
function createPlugin(file) {
  return new Files(file)
}

module.exports = { createPlugin }
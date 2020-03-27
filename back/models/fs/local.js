const fs = require('fs')
const { LocalFS } = require('tms-koa/lib/model/fs/local')

class LocalFD extends LocalFS {
  /**
   * 新建指定的目录
   *
   * @param {*} path
   */
  mkdir(path) {
    let fullpath = this.fullpath(path)
    if (fs.existsSync(fullpath)) return [false, '目录已经存在']

    fs.mkdirSync(fullpath)

    return [true]
  }
  /**
   * 删除指定的目录
   *
   * @param {*} path
   */
  rmdir(path) {
    let fullpath = this.fullpath(path)
    if (!fs.existsSync(fullpath)) return [false, '目录不存在']

    const stat = fs.statSync(fullpath)
    if (!stat.isDirectory()) return [false, '指定路径不是目录，无法删除']

    const names = fs.readdirSync(fullpath)
    if (names.length) return [false, '目录不为空，无法删除']

    fs.rmdirSync(fullpath)

    return [true]
  }
}

module.exports.LocalFD = LocalFD

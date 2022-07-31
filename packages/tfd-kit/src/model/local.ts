import * as fs from 'fs'
import { LocalFS } from 'tms-koa/dist/model/fs/local'

class LocalFD extends LocalFS {
  /**
   * 新建指定的目录
   *
   * @param {*} path
   */
  mkdir(path: string) {
    let fullpath = super.fullpath(path)
    if (fs.existsSync(fullpath)) return [false, '目录已经存在，无法创建目录']

    fs.mkdirSync(fullpath)

    return [true]
  }
  /**
   * 删除指定的目录
   *
   * @param {*} path
   */
  rmdir(path: string) {
    let fullpath = super.fullpath(path)
    if (!fs.existsSync(fullpath)) return [false, '目录不存在，无法删除目录']

    const stat = fs.statSync(fullpath)
    if (!stat.isDirectory()) return [false, '指定路径不是目录，无法删除目录']

    const names = fs.readdirSync(fullpath)
    if (names.length) return [false, '目录不为空，无法删除目录']

    fs.rmdirSync(fullpath)

    return [true]
  }
}

export default LocalFD

const { ManageCtrl } = require('tms-koa/lib/controller/fs')
const { Info } = require('tms-koa/lib/model/fs/info')
const { ResultData, ResultFault } = require('tms-koa')

class Manage extends ManageCtrl {
  constructor(...args) {
    super(...args)
  }
  /**
   * 组装 查询条件
   */
  _assembleFind(filter, like = true) {
    let find = {}
    let fKeys = Object.keys(filter)
    if (like === true) {
      for (let fk of fKeys) {
        let val = filter[fk]
        let find2
        if (typeof val === 'object' && val.keyword) {
          if (val.feature === 'start') {
            find2 = { $regex: '^' + val.keyword }
          } else if (val.feature === 'notStart') {
            find2 = { $not: { $regex: '^' + val.keyword } }
          } else if (val.feature === 'end') {
            find2 = { $regex: '^.*' + val.keyword + '$' }
          } else if (val.feature === 'notEnd') {
            find2 = { $not: { $regex: '^.*' + val.keyword + '$' } }
          } else if (val.feature === 'notLike') {
            find2 = { $not: { $regex: val.keyword } }
          } else if (val.feature === 'in') {
            if (Array.isArray(val.keyword)) {
              find2 = { $in: val.keyword }
            }
          } else if (val.feature === 'between') {
            if (Array.isArray(val.keyword) && val.keyword.length === 2) {
              find2 = { $gte: val.keyword[0], $lte: val.keyword[1] }
            }
          } else if (typeof val.keyword === 'string') {
            find2 = { $regex: val.keyword }
          }
        } else if (
          typeof val === 'object' &&
          !val.keyword &&
          typeof val.keyword !== 'undefined'
        ) {
          find2 = val.keyword
        } else if (typeof val === 'string') {
          find2 = { $regex: val }
        }

        if (typeof find2 !== 'undefined') find[fk] = find2
      }
    } else {
      for (let fk of fKeys) {
        find[fk] = filter[fk]
      }
    }

    return find
  }
  /**
   * 
   */
  async list() {
    const fsInfo = await Info.ins(this.domain)
    if (!fsInfo) return new ResultFault('不支持设置文件信息')
    const { filter } = this.request.body

    let query = {}
    if (filter) {
      query = this._assembleFind(filter)
    }
    const { bucket } = this
    if (bucket) query.bucket = bucket

    let { batch } = this.request.query
    if (!batch) batch = '1,10'
    const [page, size] = batch.split(',', 2)
    const skip = (parseInt(page) - 1) * parseInt(size)
    const limit = parseInt(size)

    const result = await fsInfo.list(query, skip, limit)

    return new ResultData(result)
  }
  /**
   *  根据某一列的值分组
   */
  async getGroupByColumnVal() {
    if (
      !this.domain.mongoClient ||
      !this.domain.database ||
      !this.domain.collection ||
      !this.domain.schemas
    )
      return new ResultFault('不支持设置文件信息')

    const mongoClient = this.domain.mongoClient
    const cl = mongoClient.db(this.domain.database).collection(this.domain.collection)

    let { column, batch } = this.request.query
    let { filter } = this.request.body
    let find = {}
    if (filter) {
      find = this._assembleFind(filter)
    }
    let group = [
      { $match: find },
      { $group: { _id: '$' + column, num_tutorial: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]
    if (batch) {
      const [page, size] = batch.split(',', 2)
      const skip = { $skip: (parseInt(page) - 1) * parseInt(size) }
      const limit = { $limit: parseInt(size) }
      group.push(skip)
      group.push(limit)
    }

    return cl
      .aggregate(group)
      .toArray()
      .then((arr) => {
        let data = []
        arr.forEach((a) => {
          let d = {}
          d.title = a._id
          d.sum = a.num_tutorial
          data.push(d)
        })

        return new ResultData(data)
      })
  }
}

module.exports = Manage

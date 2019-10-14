const { BrowseCtrl } = require('tms-koa/lib/controller/fs')
const { ResultData, ResultFault, ResultObjectNotFound } = require('tms-koa')

class Browse extends BrowseCtrl {
  constructor(...args) {
    super(...args)
  }
}

module.exports = Browse

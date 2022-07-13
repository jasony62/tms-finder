const { PluginBase } = require('./base')

/**
 * 发送数据插件
 * @extends PluginBase
 */
class PluginHttpSend extends PluginBase {
  constructor(...args) {
    super(...args)
  }
  validate() {
    return super.validate().then(() => {
      let { file, method, getUrl, getBody } = this
      if (!method || typeof method !== 'string')
        throw `插件文件[${file}]不可用，创建的PluginHttpSend插件未包含[method]属性`

      if (!['post', 'get'].includes(method))
        throw `插件文件[${file}]不可用，创建的PluginHttpSend插件[method=${method}]未提供有效值`

      if (!getUrl || typeof getUrl !== 'function')
        throw `插件文件[${file}]不可用，创建的PluginHttpSend插件未包含[getUrl]方法`

      if (method === 'post')
        if (!getBody || typeof getBody !== 'function')
          throw `插件文件[${file}]不可用，创建的PluginHttpSend插件未包含[getBody]方法`

      return true
    })
  }
}

module.exports = { PluginHttpSend }

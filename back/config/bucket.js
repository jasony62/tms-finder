/**
 * bucket处理获取bucket值，相关的逻辑
 */
module.exports = function (client) {
  return [true, client.bucket]
}

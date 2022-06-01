/**
 * bucket处理获取bucket值，相关的逻辑
 */
module.exports = function (ctx, client) {
  return [true, client.data.bucket]
}

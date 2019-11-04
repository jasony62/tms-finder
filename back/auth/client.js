const { getClientIP } = require('../tms/utilities')
const { LOGIN_MASTER_VERIFY_CODE } = require('../config')
const { CookieClient } = require('./base')

/**
 * 根据http请求中包含的信息获得用户数据
 */
module.exports = async function(ctx) {
    let { uname, password, pin } = ctx.request.body
    if (!uname || !password || !pin ) return [false, '登录信息不完整']

    // 检查验证码
    if ( !LOGIN_MASTER_VERIFY_CODE || LOGIN_MASTER_VERIFY_CODE != pin ) {
        let capText = CookieClient.getCookieVal(ctx, 'capText')
        if (!capText) {
            return [false, '登录信息不完整2']
        }
        if (capText != pin) {
            CookieClient.delCookieVal(ctx, 'capText')
            return [false, '验证码错误']
        }
    }

    CookieClient.delCookieVal(ctx, 'capText')
    //模拟前端加密
    password = CookieClient.getCookieKey(password)
    // 客户端信息
    let clientInfo = {}
    clientInfo.ip = getClientIP(ctx)
    //
    let { Client } = require("tms-koa")
    let { DbContext } = require('tms-db')
    let dbContext
    try {
        /**
         * 获取数据库连接
         */
        dbContext = new DbContext()

        let modelLogin = require("../models/site/user/login").create({ db: dbContext.db() })
        let oUser = await modelLogin.do(uname, password, clientInfo)
        if (oUser[0] === false)
            return [false, oUser[1]]

        //获得用户角色信息
        oUser.role = {}
        let modelUser = require("../models/site/user/role").create({ db: dbContext.db() })
        let role = await modelUser.byUser(oUser.uid)
        if (role)
            oUser.role = role

        // 处理插入数据
        delete oUser.password
        delete oUser.salt
        delete oUser.pwd_error_num
        delete oUser.login_limit_expire
        let tmsClient = new Client(oUser.uid, oUser)
        return [true, tmsClient]
    } catch (err) {
        console.log('用户鉴权执行异常：\n', err)
        let errMsg = typeof err === 'string' ? err : err.toString()
        return [false, '用户鉴权执行异常']
    } finally {
        // 关闭数据库连接
        if (dbContext) dbContext.end()
        dbContext = null
    }
}
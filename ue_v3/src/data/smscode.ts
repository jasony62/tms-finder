function fnVerify(userData: { [key: string]: string }) {
  let { mobile, pin, code } = userData
  console.info('sms user data', { mobile, pin, code })
  return Promise.resolve({
    code: 0,
    msg: '成功',
    result: { access_token: '89898989' },
  })
}

const schema = [
  {
    // 当前双向绑定的属性名
    key: 'mobile',
    // 组件类型
    type: 'text',
    placeholder: '请输入手机号',
  },
  {
    key: 'pin',
    type: 'captcha',
    placeholder: '请输入验证码',
  },
  {
    key: 'code',
    type: 'smscode',
    placeholder: '请输入验证码',
  },
]

export { fnSendCode, fnVerify, schema, fnSendSmsCode }

function fnVerify(userData: { [key: string]: string }) {
  let { uname, password, pin } = userData
  console.info('register user data', { uname, password, pin })
  return Promise.resolve({
    code: 0,
    msg: '成功',
    result: { access_token: '89898989' },
  })
}
function fnSendSmsCode() {
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
    key: 'code',
    type: 'smscode',
    placeholder: '请出入验证码',
  },
]

export { schema, fnVerify, fnSendSmsCode }

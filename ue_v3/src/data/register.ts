
function fnRegister(userData: { [key: string]: string }) {
  let { uname, password, pin } = userData
  console.info('register user data', { uname, password, pin })
  return Promise.resolve({
    code: 0,
    msg: '成功',
    result: { access_token: '89898989' },
  })
}

const schema = [
  {
    // 当前双向绑定的属性名
    key: 'uname',
    // 组件类型
    type: 'text',
    placeholder: '用户名',
  },
  {
    key: 'password',
    type: 'password',
    placeholder: '密码',
  },
  {
    key: 'password2',
    type: 'password',
    placeholder: '重复输入密码',
  },
  {
    key: 'pin',
    type: 'captcha',
    placeholder: '验证码',
  },
]

export { fnRegister, schema }

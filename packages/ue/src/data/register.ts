import { LOGIN_CAPTCHA_DISABLED } from '@/global'

const schema = () => {
  const data = [
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
  ]
  if (!LOGIN_CAPTCHA_DISABLED()) {
    data.push({
      key: 'pin',
      type: 'captcha',
      placeholder: '验证码',
    })
  }
}

export { schema }

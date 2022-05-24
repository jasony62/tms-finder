import { SubmitDataItem } from 'tms-vue3-ui'

const schema: SubmitDataItem[] = [
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
    key: 'pin',
    type: 'captcha',
    placeholder: '验证码',
  },
]

export { schema }

export enum PluginWidgetAction {
  Created = 'Created',
  Cancel = 'Cancel',
  Execute = 'Execute',
  Close = 'Close',
}

export interface PluginWidgetResult {
  action: PluginWidgetAction
  result?: any
  handleResponse?: boolean
  applyAccessTokenField?: string // 定用户输入中申请添加access_token的字段
  reloadOnClose?: boolean // 关闭部件后是否要刷新数据
}

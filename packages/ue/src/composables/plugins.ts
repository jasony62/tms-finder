import { ref, toRaw } from 'vue'
import * as _ from 'lodash'
import Debug from 'debug'

const debug = Debug('tfd:ue:composables:plugins')

const elPluginWidget = ref<HTMLIFrameElement>()

const showPluginWidget = ref(false)

const pluginWidgetUrl = ref('')

const pluginWidgetSize = ref('')

export type UseTfdPluginsOptions = {
  bucketName?: string
  dir?: string
  file?: string
  onExecute?: any
  onCreate?: any
  onClose?: any
}

/**
 * 执行插件
 *
 * @param options
 * @returns
 */
export const useTfdPlugins = (options?: UseTfdPluginsOptions) => {
  const { bucketName, dir, file, onExecute, onCreate, onClose } = options ?? {}
  /**
   * 执行插件
   *
   * @param plugin 要执行的插件
   * @param docScope 插件操作数据的范围
   */
  const handlePlugin = (plugin: any, docScope = '') => {
    debug(`执行插件[name=${plugin.name}, title=${plugin.title}]`)
    const { beforeWidget, schemaJson } = plugin
    if (beforeWidget) {
      const { name, url, size } = beforeWidget
      if (name === 'external' && url) {
        let fullurl = url + (url.indexOf('?') > 0 ? '&' : '?')
        showPluginWidget.value = true
        pluginWidgetUrl.value =
          fullurl + `bucket=${bucketName ?? ''}&dir=${dir}&file=${file}`
        pluginWidgetSize.value = size ?? '50%'
        // 收集页面数据
        const widgetResultListener = async (event: MessageEvent) => {
          const { data, origin } = event
          if (data) {
            const {
              action,
              result,
              handleResponse,
              defaultHandleResponseRequired,
              applyAccessTokenField,
              reloadOnClose,
            } = data
            switch (action) {
              case 'Created':
                // 插件创建成功后，将插件信息传递给插件
                if (elPluginWidget.value) {
                  const msg: any = {
                    plugin: {
                      name: toRaw(plugin.name),
                      ui: toRaw(beforeWidget.ui),
                    },
                  }
                  if (schemaJson && typeof schemaJson === 'object') {
                    // 处理没有文档时，将后端指定的schema传递给插件
                    msg.schema = toRaw(schemaJson)
                  }
                  if (typeof onCreate === 'function')
                    await onCreate(plugin, msg)
                  elPluginWidget.value.contentWindow?.postMessage(msg, '*')
                }
                break
              case 'Cancel':
                window.removeEventListener('message', widgetResultListener)
                showPluginWidget.value = false
                break
              case 'Lookup':
                break
              case 'Execute':
                onExecute(
                  plugin,
                  docScope,
                  result,
                  handleResponse,
                  defaultHandleResponseRequired,
                  applyAccessTokenField
                )
                  .then((response: any) => {
                    if (handleResponse === true) {
                      // 将执行的结果递送给插件
                      if (elPluginWidget.value) {
                        elPluginWidget.value.contentWindow?.postMessage(
                          { response },
                          '*'
                        )
                      }
                    } else {
                      window.removeEventListener(
                        'message',
                        widgetResultListener
                      )
                      showPluginWidget.value = false
                    }
                  })
                  .catch(() => {
                    // 无法执行
                  })
                break
              case 'Close':
                window.removeEventListener('message', widgetResultListener)
                showPluginWidget.value = false
                // 关闭后刷新数据
                if (reloadOnClose && typeof onClose === 'function') onClose()
                break
            }
          }
        }
        window.addEventListener('message', widgetResultListener)
        return
      }
    } else {
      onExecute(plugin, docScope)
    }
  }

  return {
    handlePlugin,
    elPluginWidget,
    showPluginWidget,
    pluginWidgetUrl,
    pluginWidgetSize,
  }
}

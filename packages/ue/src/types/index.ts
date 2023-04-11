/**
 * 服务端返回的文件对象
 */
export type TmsFile = {
  path: string
  name: string
  type?: string
  size: number
  mtime: string
  thumbType: string
  thumbSize: number
  publicUrl: string
  thumbUrl: string
  [key: string]: any
}

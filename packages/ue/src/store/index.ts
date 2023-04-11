import { defineStore } from 'pinia'
import browseApi from '../apis/file/browse'
import createUploadApi from '../apis/file/upload'

export default defineStore('webfs', {
  state: () => {
    return {
      schemas: null as any,
      schemasRootName: '',
      tree: { name: '全部', path: '' },
      files: [] as any[],
      searchFiles: [] as any[],
      currentDir: null as any,
      viewStyle: '1',
    }
  },
  actions: {
    setSearchFiles(searchFiles: any[]) {
      this.searchFiles = searchFiles
    },
    setCurrentDir(dir: any) {
      this.currentDir = dir
    },
    setViewStyle(value: string) {
      this.viewStyle = value
    },
    getSchemas(bucket?: string, domain?: string) {
      return new Promise((resolve) => {
        browseApi
          .schemas(domain, bucket)
          .then(
            ({
              schemas,
              schemasRootName,
            }: {
              schemas: any
              schemasRootName: string
            }) => {
              this.schemas = schemas
              this.schemasRootName = schemasRootName
              resolve(schemas)
            }
          )
      })
    },
    list(dir: any, domain?: string, bucket?: string) {
      return new Promise((resolve) => {
        browseApi.list(dir.path, domain, bucket).then((listData: any) => {
          let { dirs, files } = listData
          dir.dirs = dirs
          dirs.forEach((d: any) => {
            d.path = `${dir.path}/${d.name}`
            d.parent = dir
          })
          this.files = files
          resolve({ dirs, files })
        })
      })
    },
    expand(dir: any, domain: string, bucket: string) {
      return new Promise((resolve) => {
        browseApi.list(dir.path, domain, bucket).then((expandData: any) => {
          let { dirs } = expandData
          dir.dirs = dirs
          dirs.forEach((d: any) => {
            d.path = `${dir.path}/${d.name}`
            d.parent = dir
          })
          resolve(dirs)
        })
      })
    },
    removeFile(filepath: string, domain: string, bucket: string) {
      return Promise.resolve(
        createUploadApi.removeFile({ filepath, domain, bucket })
      )
    },
    mkdir(dir: string, domain: string, bucket: string) {
      return Promise.resolve(createUploadApi.mkdir({ dir, domain, bucket }))
    },
    rmdir(dir: string, domain: string, bucket: string) {
      return Promise.resolve(createUploadApi.rmdir({ dir, domain, bucket }))
    },
    overallSearch(dir: any, basename: string) {
      return new Promise((resolve) => {
        const params = {
          basename,
          dir: dir.path || '',
        }
        browseApi.overallSearch(params).then((searchData: any) => {
          let { dirs, files } = searchData
          this.files = files
          resolve({ dirs, files })
        })
      })
    },
  },
})

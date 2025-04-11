import { defineStore } from 'pinia'
import browseApi from '../apis/file/browse'
import bucketApi from '../apis/bucket.js'
import inviteApi from '../apis/invite.js'
import createUploadApi from '../apis/file/upload'

export default defineStore('webfs', {
  state: () => {
    return {
      clientInfo: {} as any,
      buckets: [] as any[],
      schemas: null as any,
      schemasRootName: '',
      schemasLoaded: false,
      bucketSchemas: null as any,
      bucketSchemasRootName: '',
      bucketSchemasLoaded: false,
      tree: { name: '全部', path: '' },
      files: [] as any[],
      searchFiles: [] as any[],
      currentDir: null as any,
      viewStyle: '1',
    }
  },
  actions: {
    listBucket() {
      return bucketApi.list().then((buckets: never[]) => {
        this.buckets = buckets
        return { buckets }
      })
    },
    appendBucket(bucket: any) {
      this.buckets.push(bucket)
    },
    updateBucket(payload: { index: any; bucket: any }) {
      const { index, bucket } = payload
      this.buckets.splice(index, 1, bucket)
    },
    removeBucket(bucket: any) {
      return bucketApi.remove(bucket).then(() => {
        this.buckets.splice(this.buckets.indexOf(bucket), 1)
      })
    },
    acceptInvite(bucket: any) {
      const { invitation } = bucket
      if (invitation) {
        inviteApi
          .accept(bucket.name, invitation.username, invitation.code)
          .then((result: any) => {
            delete bucket.invitation
            bucket.acceptAt = result.acceptAt
          })
          .catch(() => {
            // @TODO 需要做什么？
          })
      }
    },
    rejextInvite(bucket: any) {
      const { invitation } = bucket
      if (invitation) {
        inviteApi
          .reject(bucket.name, invitation.username, invitation.code)
          .then((result: any) => {
            this.buckets.splice(this.buckets.indexOf(bucket), 1)
          })
          .catch(() => {
            // @TODO 需要做什么？
          })
      }
    },
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
      /**
       * 只需要加载1次
       */
      if (this.schemasLoaded === true) return this.schemas
      this.schemasLoaded = true
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
    getBucketSchemas() {
      /**
       * 只需要加载1次
       */
      if (this.bucketSchemasLoaded === true) return this.schemas
      this.bucketSchemasLoaded = true
      return new Promise((resolve) => {
        bucketApi
          .schemas()
          .then(
            ({
              schemas,
              schemasRootName,
            }: {
              schemas: any
              schemasRootName: string
            }) => {
              this.bucketSchemas = schemas
              this.bucketSchemasRootName = schemasRootName
              resolve(schemas)
            }
          )
          .catch((e: any) => {
            resolve({})
          })
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

module.exports = {
  local: {
    rootDir: 'D:/WWW/tms-finder/back/files' // 指定保存文件的根目录
    database: {
      dialect: 'sqlite',
      file_table: 'upload_files'
    },
    schemas: [
      { id: 's1', type: 'shorttext', title: '信息1' },
      { id: 's2', type: 'longtext', title: '信息2' },
      {
        id: 's3',
        type: 'single',
        title: '信息3',
        ops: [{ v: 'v1', l: '选项1' }, { v: 'v2', l: '选项2' }, { v: 'v3', l: '选项3' }]
      },
      {
        id: 's4',
        type: 'multiple',
        title: '信息4',
        ops: [{ v: 'v1', l: '选项1' }, { v: 'v2', l: '选项2' }, { v: 'v3', l: '选项3' }]
      }
    ]
  }
}
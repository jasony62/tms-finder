module.exports = {
  local: {
    rootDir: 'D:/WWW/tms-finder/back/files', // 指定保存文件的根目录
    database: {
      dialect: 'sqlite',
      file_table: 'upload_files'
    },
    schemas: [
      { id: 'user_name', type: 'shorttext', title: '创建人姓名' },
      { id: 'file_type', type: 'shorttext', title: '文件类型' }
    ]
  }
}
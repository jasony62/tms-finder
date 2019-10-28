module.exports = {
  local: {
    rootDir: 'D:/WWW/tms-finder/back/files', // 指定保存文件的根目录
    database: {
      dialect: 'sqlite',
      file_table: 'upload_files'
    },
    schemas: [
      { id: 'dirs', type: 'shorttext', title: '目录结构' }, // {"一级目录" ：{“二级目录”： {}，“三级目录”：{“四级目录”：{}}}，“一级目录”：{}}
      { id: 'user_name', type: 'shorttext', title: '创建人姓名' },
      { id: 'create_time', type: 'shorttext', title: '创建时间' },
      { id: 'file_name', type: 'shorttext', title: '文件名' },
      { id: 'file_type', type: 'shorttext', title: '文件类型' },
      { id: 'file_size', type: 'shorttext', title: '文件大小' }
    ]
  }
}
const schemas = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  title: 'Json-Doc-File',
  description: 'tms-vue-finder file',
  properties: {
    comment: {
      type: 'string',
      minLength: 0,
      maxLength: 80,
      title: '说明',
      attrs: {
        placeholder: '请输入说明',
        title: '说明',
      },
    },
  },
}

module.exports = {
  local: {
    domains: {
      upload: {
        schemas,
        schemasRootName: 'info',
      },
    },
  },
}

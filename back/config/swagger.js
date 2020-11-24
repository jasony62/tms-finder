module.exports = {
  definition: {
    info: {
      title: 'TMS Finder 后端服务',
      version: '0.0.1',
    },
    servers: [
      {
        url: `${process.env.TMS_FINDER_API_HOST || 'http://localhost'}:${process.env.TMS_FINDER_API_PORT || 3000}`,
        description: '提供API服务的地址',
      },
    ],
  },
  apis: ['./oas/**/*.yaml', './controllers/**/*.js'],
}

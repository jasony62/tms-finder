module.exports = {
  apps: [
    {
      name: 'tms-finder',
      script: './app.js',
      instances: 1,
      autorestart: true,
      watch_delay: 1000,
      watch: ['app.js', 'auth', 'controllers', 'models', 'public'],
      ignore_watch: ['node_modules', 'tests', 'config'],
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        TMS_FINDER_MONGODB_HOST: 'localhost',
        TMS_FINDER_MONGODB_PORT: 27017
      }
    }
  ]
}

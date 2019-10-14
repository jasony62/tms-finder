module.exports = {
  apps: [
    {
      name: 'tms-finder',
      script: 'node app',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      instances: 1,
      autorestart: true,
      watch_delay: 1000,
      watch: ['app.js', 'auth', 'controllers', 'models', 'public'],
      ignore_watch: ['node_modules', 'tests', 'config'],
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}

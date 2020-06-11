module.exports = {
  apps: [
    {
      name: 'tms-finder',
      script: './server.js',
      instances: 1,
      autorestart: true,
      watch_delay: 1000,
      watch: ['app.js', 'auth', 'controllers', 'models', 'public'],
      ignore_watch: ['node_modules', 'tests', 'config'],
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
}

module.exports = {
  apps: [
    {
      name: 'api',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '4G',
      env: {
        NODE_ENV: 'production',
      }
    },
    {
      name: 'cronjob',
      script: 'dist/stand-alone.app.js',
      instances: 2,
      autorestart: true,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '4G',
      env: {
        NODE_ENV: 'production',
      }
    },
  ],
};
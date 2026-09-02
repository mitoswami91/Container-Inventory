module.exports = {
  apps: [
    {
      name: 'container-inventory-api',
      script: 'dist/main.js',
      instances: 1, // Runs a single instance. Can be set to 'max' for cluster mode.
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

module.exports = {
  apps: [{
    name: "openbank-backend",
    script: "server.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production"
    },
    node_args: "--max-old-space-size=512"
  }]
};
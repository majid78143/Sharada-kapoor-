module.exports = {
  apps: [
    {
      name: "ff-glory-bot",
      script: "src/index.js",
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      time: true
    }
  ]
};
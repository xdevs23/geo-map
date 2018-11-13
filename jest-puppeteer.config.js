global.process.getuid = () => 0;
module.exports = {
  server: {
    command: 'webpack-dev-server',
    port: 1338
  },
  launch: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
};

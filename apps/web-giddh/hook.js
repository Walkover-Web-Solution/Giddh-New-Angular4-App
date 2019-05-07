module.exports = {
  pre() {
    console.debug('pre');
  },
  config(cfg) {
    console.debug('config');
    console.debug(JSON.stringify(cfg));
    return cfg;
  },
  post() {
    console.debug('post');
  }
}

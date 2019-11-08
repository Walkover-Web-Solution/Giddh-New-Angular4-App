const webpack = require('webpack');
console.log('demo....................');
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "VERSION": JSON.stringify("4711"),
      'ENV': JSON.stringify('development'),
      'isElectron': JSON.stringify(false),
      'errlyticsNeeded': JSON.stringify(false),
      'errlyticsKey': JSON.stringify(''),
      'AppUrl': JSON.stringify('http://localapp.giddh.com:3000/'),
      'ApiUrl': JSON.stringify('http://apitest.giddh.com/'),
      'APP_FOLDER': JSON.stringify(''),
      'process.env.ENV': 'development',
      'process.env.NODE_ENV': 'development',
      'process.env.isElectron': JSON.stringify(false),
      'process.env.errlyticsNeeded': JSON.stringify(false),
      'process.env.errlyticsKey': JSON.stringify(''),
      'process.env.AppUrl': JSON.stringify('http://localapp.giddh.com:3000/'),
      'process.env.ApiUrl': JSON.stringify('http://apitest.giddh.com/'),
      'process.env.APP_FOLDER': JSON.stringify('')
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ]
}

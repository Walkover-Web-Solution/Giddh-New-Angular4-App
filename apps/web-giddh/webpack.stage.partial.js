const webpack = require('webpack');
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "VERSION": JSON.stringify("4711"),
      'ENV': JSON.stringify('production'),
      'isElectron': JSON.stringify(false),
      'errlyticsNeeded': JSON.stringify(false),
      'errlyticsKey': JSON.stringify(''),
      'AppUrl': JSON.stringify('http://stage.giddh.com/'),
      'ApiUrl': JSON.stringify('http://apitest.giddh.com/'),
      'APP_FOLDER': JSON.stringify('app/'),
      'process.env.ENV': 'production',
      'process.env.NODE_ENV': 'production',
      'process.env.isElectron': JSON.stringify(false),
      'process.env.errlyticsNeeded': JSON.stringify(false),
      'process.env.errlyticsKey': JSON.stringify(''),
      'process.env.AppUrl': JSON.stringify('http://stage.giddh.com/'),
      'process.env.ApiUrl': JSON.stringify('http://apitest.giddh.com/'),
      'process.env.APP_FOLDER': JSON.stringify('app/')
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ]
}

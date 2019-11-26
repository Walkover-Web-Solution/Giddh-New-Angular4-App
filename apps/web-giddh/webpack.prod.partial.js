const webpack = require('webpack');
console.log('demo ------Prod ....................');
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "VERSION": JSON.stringify("4711"),
      'ENV': JSON.stringify('production'),
      'isElectron': JSON.stringify(false),
      'errlyticsNeeded': JSON.stringify(true),
      'errlyticsKey': JSON.stringify('eTrTpSiedQC4tLUYVDup3RJpc_wFL2QhCaIc0vzpsQA'),
      'AppUrl': JSON.stringify('https://giddh.com/'),
      'ApiUrl': JSON.stringify('https://api.giddh.com/'),
      'APP_FOLDER': JSON.stringify('app/'),
      'process.env.ENV': 'production',
      'process.env.NODE_ENV': 'production',
      'process.env.isElectron': JSON.stringify(false),
      'process.env.errlyticsNeeded': JSON.stringify(true),
      'process.env.errlyticsKey': JSON.stringify('eTrTpSiedQC4tLUYVDup3RJpc_wFL2QhCaIc0vzpsQA'),
      'process.env.AppUrl': JSON.stringify('https://giddh.com/'),
      'process.env.ApiUrl': JSON.stringify('https://api.giddh.com/'),
      'process.env.APP_FOLDER': JSON.stringify('app/')
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ]
}

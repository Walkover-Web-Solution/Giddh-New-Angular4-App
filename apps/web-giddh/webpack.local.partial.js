const webpack = require('webpack');
console.log('demo....................');
module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            "VERSION": JSON.stringify("4711"),
            'ENV': JSON.stringify('development'),
            'isElectron': JSON.stringify(false),
            'isCordova': JSON.stringify(false),
            'errlyticsNeeded': JSON.stringify(false),
            'errlyticsKey': JSON.stringify(''),
            'AppUrl': JSON.stringify('http://localhost:3000/'),
            'ApiUrl': JSON.stringify('https://apitest.giddh.com/'),
            'APP_FOLDER': JSON.stringify(''),
            'PRODUCTION_ENV': JSON.stringify(false),
            'STAGING_ENV': JSON.stringify(false),
            'TEST_ENV': JSON.stringify(false),
            'LOCAL_ENV': JSON.stringify(true),
            'process.env.ENV': 'development',
            'process.env.NODE_ENV': 'development',
            'process.env.isElectron': JSON.stringify(false),
            'process.env.errlyticsNeeded': JSON.stringify(false),
            'process.env.errlyticsKey': JSON.stringify(''),
            'process.env.AppUrl': JSON.stringify('http://localhost:3000/'),
            'process.env.ApiUrl': JSON.stringify('https://apitest.giddh.com/'),
            'process.env.APP_FOLDER': JSON.stringify('')
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ]
}

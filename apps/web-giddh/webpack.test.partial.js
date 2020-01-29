const webpack = require('webpack');
module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            "VERSION": JSON.stringify("4711"),
            'ENV': JSON.stringify('production'),
            'isElectron': JSON.stringify(false),
            'errlyticsNeeded': JSON.stringify(false),
            'errlyticsKey': JSON.stringify(''),
            'AppUrl': JSON.stringify('https://test.giddh.com/'),
            'ApiUrl': JSON.stringify('https://apitest.giddh.com/'),
            'APP_FOLDER': JSON.stringify(''),
            'PRODUCTION_ENV': JSON.stringify(false),
            'STAGING_ENV': JSON.stringify(false),
            'TEST_ENV': JSON.stringify(true),
            'LOCAL_ENV': JSON.stringify(false),
            'process.env.ENV': 'production',
            'process.env.NODE_ENV': 'production',
            'process.env.isElectron': JSON.stringify(false),
            'process.env.errlyticsNeeded': JSON.stringify(false),
            'process.env.errlyticsKey': JSON.stringify(''),
            'process.env.AppUrl': JSON.stringify('https://test.giddh.com/'),
            'process.env.ApiUrl': JSON.stringify('https://apitest.giddh.com/'),
            'process.env.APP_FOLDER': JSON.stringify('') //JSON.stringify('app/')""
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ]
}

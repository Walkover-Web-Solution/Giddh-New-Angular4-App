const webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            "VERSION": JSON.stringify("4711"),
            'ENV': JSON.stringify('production'),
            'isElectron': JSON.stringify(true),
            'isCordova': JSON.stringify(false),
            'errlyticsNeeded': JSON.stringify(false),
            'errlyticsKey': JSON.stringify(''),
            'AppUrl': JSON.stringify('http://localhost:4200/'),
            'ApiUrl': JSON.stringify('https://apirelease.giddh.com/'),
            'APP_FOLDER': JSON.stringify(''),
            'PRODUCTION_ENV': JSON.stringify(false),
            'STAGING_ENV': JSON.stringify(false),
            'TEST_ENV': JSON.stringify(false),
            'LOCAL_ENV': JSON.stringify(true),
            'enableVoucherAdjustmentMultiCurrency': JSON.stringify(''),
            'process.env.enableVoucherAdjustmentMultiCurrency': JSON.stringify(''),
            'process.env.ENV': JSON.stringify('development'),
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.isElectron': JSON.stringify(false),
            'process.env.errlyticsNeeded': JSON.stringify(false),
            'process.env.errlyticsKey': JSON.stringify(''),
            'process.env.AppUrl': JSON.stringify('http://localhost:4200/'),
            'process.env.ApiUrl': JSON.stringify('https://apirelease.giddh.com/'),
            'process.env.APP_FOLDER': JSON.stringify(''),
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ]
}

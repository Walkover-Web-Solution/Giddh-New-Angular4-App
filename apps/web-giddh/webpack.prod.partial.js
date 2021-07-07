const webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            "VERSION": JSON.stringify("4711"),
            'ENV': JSON.stringify('production'),
            'isElectron': JSON.stringify(false),
            'isCordova': JSON.stringify(false),
            'errlyticsNeeded': JSON.stringify(true),
            'errlyticsKey': JSON.stringify('eTrTpSiedQC4tLUYVDup3RJpc_wFL2QhCaIc0vzpsQA'),
            'AppUrl': JSON.stringify('https://app.giddh.com/'),
            'ApiUrl': JSON.stringify('https://api.giddh.com/'),
            'APP_FOLDER': JSON.stringify(''),
            'PRODUCTION_ENV': JSON.stringify(true),
            'STAGING_ENV': JSON.stringify(false),
            'TEST_ENV': JSON.stringify(false),
            'LOCAL_ENV': JSON.stringify(false),
            'enableVoucherAdjustmentMultiCurrency': JSON.stringify(''),
            'process.env.enableVoucherAdjustmentMultiCurrency': JSON.stringify(''),
            'process.env.ENV': JSON.stringify('production'),
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.isElectron': JSON.stringify(false),
            'process.env.errlyticsNeeded': JSON.stringify(true),
            'process.env.errlyticsKey': JSON.stringify('eTrTpSiedQC4tLUYVDup3RJpc_wFL2QhCaIc0vzpsQA'),
            'process.env.AppUrl': JSON.stringify('https://app.giddh.com/'),
            'process.env.ApiUrl': JSON.stringify('https://api.giddh.com/'),
            'process.env.APP_FOLDER': JSON.stringify('')
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ]
}

const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require("zlib");
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
            'GOOGLE_CLIENT_ID': JSON.stringify(process.env.GOOGLE_CLIENT_ID_PROD),
            'GOOGLE_CLIENT_SECRET': JSON.stringify(process.env.GOOGLE_CLIENT_SECRET_PROD),
            'TWITTER_CLIENT_ID': JSON.stringify(process.env.TWITTER_CLIENT_ID_PROD),
            'TWITTER_SECRET_KEY': JSON.stringify(process.env.TWITTER_SECRET_KEY_PROD),
            'LINKEDIN_CLIENT_ID': JSON.stringify(process.env.LINKEDIN_CLIENT_ID_PROD),
            'LINKEDIN_SECRET_KEY': JSON.stringify(process.env.LINKEDIN_SECRET_KEY_PROD),
            'RAZORPAY_KEY': JSON.stringify(process.env.RAZORPAY_KEY_PROD),
            'NODE_API_URL': JSON.stringify('http://localhost:8080/'),
            'process.env.enableVoucherAdjustmentMultiCurrency': JSON.stringify(''),
            'process.env.GOOGLE_CLIENT_ID': JSON.stringify(process.env.GOOGLE_CLIENT_ID_PROD),
            'process.env.GOOGLE_CLIENT_SECRET': JSON.stringify(process.env.GOOGLE_CLIENT_SECRET_PROD),
            'process.env.TWITTER_CLIENT_ID': JSON.stringify(process.env.TWITTER_CLIENT_ID_PROD),
            'process.env.TWITTER_SECRET_KEY': JSON.stringify(process.env.TWITTER_SECRET_KEY_PROD),
            'process.env.LINKEDIN_CLIENT_ID': JSON.stringify(process.env.LINKEDIN_CLIENT_ID_PROD),
            'process.env.LINKEDIN_SECRET_KEY': JSON.stringify(process.env.LINKEDIN_SECRET_KEY_PROD),
            'process.env.RAZORPAY_KEY': JSON.stringify(process.env.RAZORPAY_KEY_PROD),
            'process.env.NODE_API_URL': JSON.stringify('http://localhost:8080/'),
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
        new CompressionPlugin({
            filename: "[path][base].br",
            algorithm: "brotliCompress",
            test: /\.(js|css|html|svg)$/,
            compressionOptions: {
                params: {
                    [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                },
            },
            threshold: 0,
            minRatio: 0.8,
            deleteOriginalAssets: false
        })
    ]
}

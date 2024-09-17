const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require("zlib");
module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            "VERSION": JSON.stringify("4711"),
            'ENV': JSON.stringify('production'),
            'isElectron': JSON.stringify(false),
            'errlyticsNeeded': JSON.stringify(true),
            'errlyticsKey': JSON.stringify('eTrTpSiedQC4tLUYVDup3RJpc_wFL2QhCaIc0vzpsQA'),
            'AppUrl': JSON.stringify('https://app.giddh.com/'),
            'ApiUrl': JSON.stringify('https://api.giddh.com/'),
            'DevApiUrl': JSON.stringify('http://giddh-api-prod-g.eu-west-2.elasticbeanstalk.com/'),
            'PORTAL_URL': JSON.stringify('https://portal.giddh.com/'),
            'APP_FOLDER': JSON.stringify(''),
            'PRODUCTION_ENV': JSON.stringify(true),
            'STAGING_ENV': JSON.stringify(false),
            'TEST_ENV': JSON.stringify(false),
            'LOCAL_ENV': JSON.stringify(false),
            'enableVoucherAdjustmentMultiCurrency': JSON.stringify(true),
            'GOOGLE_CLIENT_ID': JSON.stringify(process.env.GOOGLE_CLIENT_ID_PROD),
            'GOOGLE_CLIENT_SECRET': JSON.stringify(process.env.GOOGLE_CLIENT_SECRET_PROD),
            'RAZORPAY_KEY': JSON.stringify(process.env.RAZORPAY_KEY_PROD),
            'FROALA_EDITOR_KEY': JSON.stringify(process.env.FROALA_EDITOR_KEY),
            'OTP_WIDGET_ID': JSON.stringify(process.env.OTP_WIDGET_ID),
            'OTP_TOKEN_AUTH': JSON.stringify(process.env.OTP_TOKEN_AUTH),
            'process.env.enableVoucherAdjustmentMultiCurrency': JSON.stringify(true),
            'process.env.GOOGLE_CLIENT_ID': JSON.stringify(process.env.GOOGLE_CLIENT_ID_PROD),
            'process.env.GOOGLE_CLIENT_SECRET': JSON.stringify(process.env.GOOGLE_CLIENT_SECRET_PROD),
            'process.env.RAZORPAY_KEY': JSON.stringify(process.env.RAZORPAY_KEY_PROD),
            'process.env.FROALA_EDITOR_KEY': JSON.stringify(process.env.FROALA_EDITOR_KEY),
            'process.env.OTP_WIDGET_ID': JSON.stringify(process.env.OTP_WIDGET_ID),
            'process.env.OTP_TOKEN_AUTH': JSON.stringify(process.env.OTP_TOKEN_AUTH),
            'process.env.ENV': JSON.stringify('production'),
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.isElectron': JSON.stringify(false),
            'process.env.errlyticsNeeded': JSON.stringify(true),
            'process.env.errlyticsKey': JSON.stringify('eTrTpSiedQC4tLUYVDup3RJpc_wFL2QhCaIc0vzpsQA'),
            'process.env.AppUrl': JSON.stringify('https://app.giddh.com/'),
            'process.env.ApiUrl': JSON.stringify('https://api.giddh.com/'),
            'process.env.DevApiUrl': JSON.stringify('http://giddh-api-prod-g.eu-west-2.elasticbeanstalk.com/'),
            'process.PORTAL_URL': JSON.stringify('https://portal.giddh.com/'),
            'process.env.APP_FOLDER': JSON.stringify('')
        }),
        new CompressionPlugin({
            filename: "[path][base].br",
            algorithm: "brotliCompress",
            test: /\.(js|css|html|svg|json)$/,
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

const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require("zlib");
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
            'GOOGLE_CLIENT_ID': JSON.stringify(process.env.GOOGLE_CLIENT_ID_TEST),
            'GOOGLE_CLIENT_SECRET': JSON.stringify(process.env.GOOGLE_CLIENT_SECRET_TEST),
            'RAZORPAY_KEY': JSON.stringify(process.env.RAZORPAY_KEY_TEST),
            'OTP_WIDGET_ID': JSON.stringify(process.env.OTP_WIDGET_ID),
            'OTP_TOKEN_AUTH': JSON.stringify(process.env.OTP_TOKEN_AUTH),
            'NOTARIZE_TEAM_ID': JSON.stringify(process.env.NOTARIZE_TEAM_ID),
            'enableVoucherAdjustmentMultiCurrency': JSON.stringify(true),
            'process.env.enableVoucherAdjustmentMultiCurrency': JSON.stringify(true),
            'process.env.GOOGLE_CLIENT_ID': JSON.stringify(process.env.GOOGLE_CLIENT_ID_TEST),
            'process.env.GOOGLE_CLIENT_SECRET': JSON.stringify(process.env.GOOGLE_CLIENT_SECRET_TEST),
            'process.env.RAZORPAY_KEY': JSON.stringify(process.env.RAZORPAY_KEY_TEST),
            'process.env.OTP_WIDGET_ID': JSON.stringify(process.env.OTP_WIDGET_ID),
            'process.env.OTP_TOKEN_AUTH': JSON.stringify(process.env.OTP_TOKEN_AUTH),
            'process.env.NOTARIZE_TEAM_ID': JSON.stringify(process.env.NOTARIZE_TEAM_ID),
            'process.env.ENV': JSON.stringify('production'),
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.isElectron': JSON.stringify(false),
            'process.env.errlyticsNeeded': JSON.stringify(false),
            'process.env.errlyticsKey': JSON.stringify(''),
            'process.env.AppUrl': JSON.stringify('https://test.giddh.com/'),
            'process.env.ApiUrl': JSON.stringify('https://apitest.giddh.com/'),
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

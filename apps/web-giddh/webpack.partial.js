const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require("zlib");
require('dotenv').config();

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            "VERSION": JSON.stringify("4711"),
            'ENV': JSON.stringify('development'),
            'isElectron': JSON.stringify(false),
            'errlyticsNeeded': JSON.stringify(false),
            'errlyticsKey': JSON.stringify(''),
            'AppUrl': 'window.APP_URL || ' + JSON.stringify('http://localhost:3000/'),
            'ApiUrl': 'window.API_URL || ' + JSON.stringify('https://apitest.giddh.com/'),
            'PORTAL_URL': 'window.PORTAL_URL || ' + JSON.stringify('https://master.d2n1i21e52r793.amplifyapp.com/'),
            'GOOGLE_CLIENT_ID': 'window.GOOGLE_CLIENT_ID || ' + JSON.stringify(process.env.GOOGLE_CLIENT_ID_TEST),
            'GOOGLE_CLIENT_SECRET': 'window.GOOGLE_CLIENT_SECRET || ' + JSON.stringify(process.env.GOOGLE_CLIENT_SECRET_TEST),
            'OTP_WIDGET_ID': 'window.OTP_WIDGET_ID || ' + JSON.stringify(process.env.OTP_WIDGET_ID),
            'OTP_TOKEN_AUTH': 'window.OTP_TOKEN_AUTH || ' + JSON.stringify(process.env.OTP_TOKEN_AUTH),
            'UkApiUrl': JSON.stringify('https://gbapi.giddh.com/'),
            'APP_FOLDER': JSON.stringify(''),
            'PRODUCTION_ENV': JSON.stringify(false),
            'STAGING_ENV': JSON.stringify(false),
            'TEST_ENV': JSON.stringify(false),
            'LOCAL_ENV': JSON.stringify(true),
            'enableVoucherAdjustmentMultiCurrency': JSON.stringify(true),
            'RAZORPAY_KEY': JSON.stringify(process.env.RAZORPAY_KEY_TEST),
            'FROALA_EDITOR_KEY': JSON.stringify(process.env.FROALA_EDITOR_KEY),
            'process.env.enableVoucherAdjustmentMultiCurrency': JSON.stringify(true),
            'process.env.GOOGLE_CLIENT_ID': 'window["process.env.GOOGLE_CLIENT_ID"] || ' + JSON.stringify(process.env.GOOGLE_CLIENT_ID_TEST),
            'process.env.GOOGLE_CLIENT_SECRET': 'window["process.env.GOOGLE_CLIENT_SECRET"] || ' + JSON.stringify(process.env.GOOGLE_CLIENT_SECRET_TEST),
            'process.env.OTP_WIDGET_ID': 'window["process.env.OTP_WIDGET_ID"] || ' + JSON.stringify(process.env.OTP_WIDGET_ID),
            'process.env.OTP_TOKEN_AUTH': 'window["process.env.OTP_TOKEN_AUTH"] || ' + JSON.stringify(process.env.OTP_TOKEN_AUTH),
            'process.env.AppUrl': 'window["process.env.AppUrl"] || ' + JSON.stringify('http://localhost:3000/'),
            'process.env.ApiUrl': 'window["process.env.ApiUrl"] || ' + JSON.stringify('https://apitest.giddh.com/'),
            'process.env.PORTAL_URL': 'window["process.env.PORTAL_URL"] || ' + JSON.stringify('https://master.d2n1i21e52r793.amplifyapp.com/'),
            'process.env.RAZORPAY_KEY': JSON.stringify(process.env.RAZORPAY_KEY_TEST),
            'process.env.FROALA_EDITOR_KEY': JSON.stringify(process.env.FROALA_EDITOR_KEY),
            'process.env.ENV': JSON.stringify('development'),
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.isElectron': JSON.stringify(false),
            'process.env.errlyticsNeeded': JSON.stringify(false),
            'process.env.errlyticsKey': JSON.stringify(''),
            'process.env.UkApiUrl': JSON.stringify('https://gbapi.giddh.com/'),
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

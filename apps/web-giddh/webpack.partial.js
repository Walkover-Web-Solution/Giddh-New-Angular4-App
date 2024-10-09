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
            'AppUrl': JSON.stringify('http://localhost:3000/'),
            'ApiUrl': JSON.stringify('https://api.giddh.com/'),
<<<<<<< HEAD
           'UkApiUrl': JSON.stringify('https://gbapi.giddh.com/'),
=======
>>>>>>> 4bbdb503152f690a30b038914eba0d6ac092163a
            'PORTAL_URL': JSON.stringify('https://portal.giddh.com/'),
            'APP_FOLDER': JSON.stringify(''),
            'PRODUCTION_ENV': JSON.stringify(false),
            'STAGING_ENV': JSON.stringify(false),
            'TEST_ENV': JSON.stringify(false),
            'LOCAL_ENV': JSON.stringify(true),
            'enableVoucherAdjustmentMultiCurrency': JSON.stringify(true),
            'GOOGLE_CLIENT_ID': JSON.stringify(process.env.GOOGLE_CLIENT_ID_TEST),
            'GOOGLE_CLIENT_SECRET': JSON.stringify(process.env.GOOGLE_CLIENT_SECRET_TEST),
            'RAZORPAY_KEY': JSON.stringify(process.env.RAZORPAY_KEY_TEST),
            'FROALA_EDITOR_KEY': JSON.stringify(process.env.FROALA_EDITOR_KEY),
            'OTP_WIDGET_ID': JSON.stringify(process.env.OTP_WIDGET_ID),
            'OTP_TOKEN_AUTH': JSON.stringify(process.env.OTP_TOKEN_AUTH),
            'process.env.enableVoucherAdjustmentMultiCurrency': JSON.stringify(true),
            'process.env.GOOGLE_CLIENT_ID': JSON.stringify(process.env.GOOGLE_CLIENT_ID_TEST),
            'process.env.GOOGLE_CLIENT_SECRET': JSON.stringify(process.env.GOOGLE_CLIENT_SECRET_TEST),
            'process.env.RAZORPAY_KEY': JSON.stringify(process.env.RAZORPAY_KEY_TEST),
            'process.env.FROALA_EDITOR_KEY': JSON.stringify(process.env.FROALA_EDITOR_KEY),
            'process.env.OTP_WIDGET_ID': JSON.stringify(process.env.OTP_WIDGET_ID),
            'process.env.OTP_TOKEN_AUTH': JSON.stringify(process.env.OTP_TOKEN_AUTH),
            'process.env.ENV': JSON.stringify('development'),
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.isElectron': JSON.stringify(false),
            'process.env.errlyticsNeeded': JSON.stringify(false),
            'process.env.errlyticsKey': JSON.stringify(''),
            'process.env.AppUrl': JSON.stringify('http://localhost:3000/'),
            'process.env.ApiUrl': JSON.stringify('https://api.giddh.com/'),
<<<<<<< HEAD
            'process.env.UkApiUrl': JSON.stringify('https://gbapi.giddh.com/'),
=======
>>>>>>> 4bbdb503152f690a30b038914eba0d6ac092163a
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
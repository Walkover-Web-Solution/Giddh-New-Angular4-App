const webpack = require('webpack');
require('dotenv').config();

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
            'enableVoucherAdjustmentMultiCurrency': JSON.stringify(true),
            'GOOGLE_CLIENT_ID': JSON.stringify(process.env.GOOGLE_CLIENT_ID_TEST),
            'GOOGLE_CLIENT_SECRET': JSON.stringify(process.env.GOOGLE_CLIENT_SECRET_TEST),
            'TWITTER_CLIENT_ID': JSON.stringify(process.env.TWITTER_CLIENT_ID_PROD),
            'TWITTER_SECRET_KEY': JSON.stringify(process.env.TWITTER_SECRET_KEY_PROD),
            'LINKEDIN_CLIENT_ID': JSON.stringify(process.env.LINKEDIN_CLIENT_ID_PROD),
            'LINKEDIN_SECRET_KEY': JSON.stringify(process.env.LINKEDIN_SECRET_KEY_PROD),
            'RAZORPAY_KEY': JSON.stringify(process.env.RAZORPAY_KEY_TEST),
            'process.env.enableVoucherAdjustmentMultiCurrency': JSON.stringify(true),
            'process.env.GOOGLE_CLIENT_ID': JSON.stringify(process.env.GOOGLE_CLIENT_ID_TEST),
            'process.env.GOOGLE_CLIENT_SECRET': JSON.stringify(process.env.GOOGLE_CLIENT_SECRET_TEST),
            'process.env.TWITTER_CLIENT_ID': JSON.stringify(process.env.TWITTER_CLIENT_ID_PROD),
            'process.env.TWITTER_SECRET_KEY': JSON.stringify(process.env.TWITTER_SECRET_KEY_PROD),
            'process.env.LINKEDIN_CLIENT_ID': JSON.stringify(process.env.LINKEDIN_CLIENT_ID_PROD),
            'process.env.LINKEDIN_SECRET_KEY': JSON.stringify(process.env.LINKEDIN_SECRET_KEY_PROD),
            'process.env.RAZORPAY_KEY': JSON.stringify(process.env.RAZORPAY_KEY_TEST),
            'process.env.ENV': JSON.stringify('development'),
            'process.env.NODE_ENV': JSON.stringify('development'),
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

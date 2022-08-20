const webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            "VERSION": JSON.stringify("4711"),
            'ENV': JSON.stringify('production'),
            'isElectron': JSON.stringify(true),
            'errlyticsNeeded': JSON.stringify(false),
            'errlyticsKey': JSON.stringify(''),
            'AppUrl': JSON.stringify('./'),
            'ApiUrl': JSON.stringify('https://api.giddh.com/'),
            'APP_FOLDER': JSON.stringify(''),
            'PRODUCTION_ENV': JSON.stringify(true),
            'STAGING_ENV': JSON.stringify(false),
            'TEST_ENV': JSON.stringify(false),
            'LOCAL_ENV': JSON.stringify(false),
            'enableVoucherAdjustmentMultiCurrency': JSON.stringify(true),
            'GOOGLE_CLIENT_ID': JSON.stringify(process.env.GOOGLE_CLIENT_ID_PROD),
            'GOOGLE_CLIENT_SECRET': JSON.stringify(process.env.GOOGLE_CLIENT_SECRET_PROD),
            'TWITTER_CLIENT_ID': JSON.stringify(process.env.TWITTER_CLIENT_ID_PROD),
            'TWITTER_SECRET_KEY': JSON.stringify(process.env.TWITTER_SECRET_KEY_PROD),
            'LINKEDIN_CLIENT_ID': JSON.stringify(process.env.LINKEDIN_CLIENT_ID_PROD),
            'LINKEDIN_SECRET_KEY': JSON.stringify(process.env.LINKEDIN_SECRET_KEY_PROD),
            'RAZORPAY_KEY': JSON.stringify(process.env.RAZORPAY_KEY_PROD),
            'OFFLINE_API_URL': JSON.stringify(process.env.OFFLINE_API_URL),
            'process.env.enableVoucherAdjustmentMultiCurrency': JSON.stringify(true),
            'process.env.GOOGLE_CLIENT_ID': JSON.stringify(process.env.GOOGLE_CLIENT_ID_PROD),
            'process.env.GOOGLE_CLIENT_SECRET': JSON.stringify(process.env.GOOGLE_CLIENT_SECRET_PROD),
            'process.env.TWITTER_CLIENT_ID': JSON.stringify(process.env.TWITTER_CLIENT_ID_PROD),
            'process.env.TWITTER_SECRET_KEY': JSON.stringify(process.env.TWITTER_SECRET_KEY_PROD),
            'process.env.LINKEDIN_CLIENT_ID': JSON.stringify(process.env.LINKEDIN_CLIENT_ID_PROD),
            'process.env.LINKEDIN_SECRET_KEY': JSON.stringify(process.env.LINKEDIN_SECRET_KEY_PROD),
            'process.env.RAZORPAY_KEY': JSON.stringify(process.env.RAZORPAY_KEY_PROD),
            'process.env.OFFLINE_API_URL': JSON.stringify(process.env.OFFLINE_API_URL),
            'process.env.ENV': JSON.stringify('production'),
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.isElectron': JSON.stringify(true),
            'process.env.errlyticsNeeded': JSON.stringify(false),
            'process.env.errlyticsKey': JSON.stringify(''),
            'process.env.AppUrl': JSON.stringify('./'),
            'process.env.ApiUrl': JSON.stringify('https://api.giddh.com/'),
            'process.env.APP_FOLDER': JSON.stringify(''),
        })
    ]
}

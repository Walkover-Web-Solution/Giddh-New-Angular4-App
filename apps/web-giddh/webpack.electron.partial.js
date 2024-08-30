const webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            "VERSION": JSON.stringify("4711"),
            'ENV': JSON.stringify('production'),
            'isElectron': JSON.stringify(true),
            'errlyticsNeeded': JSON.stringify(false),
            'errlyticsKey': JSON.stringify(''),
            'AppUrl': JSON.stringify('http://localhost:4200/'),
            'ApiUrl': JSON.stringify('https://apitest.giddh.com/'),
            'PORTAL_URL': JSON.stringify('https://master.d2n1i21e52r793.amplifyapp.com/'),
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
            'process.env.AppUrl': JSON.stringify('http://localhost:4200/'),
            'process.env.ApiUrl': JSON.stringify('https://apitest.giddh.com/'),
            'process.PORTAL_URL': JSON.stringify('https://master.d2n1i21e52r793.amplifyapp.com/'),
            'process.env.APP_FOLDER': JSON.stringify(''),
        })
    ]
}

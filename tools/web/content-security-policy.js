'use strict';

/**
 * Content-Security-Policy for Giddh web HTML documents (index meta + production PHP header).
 * Keep index*.html meta tags in sync when changing this list.
 */
const contentSecurityPolicyDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://www.google.com https://*.g.doubleclick.net https://checkout.razorpay.com https://*.razorpay.com https://js.stripe.com https://*.stripe.com https://accounts.google.com https://verify.msg91.com https://control.msg91.com https://cdn.headwayapp.co https://cdn.plaid.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.headwayapp.co https://www.googletagmanager.com https://tagmanager.google.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https: wss: blob:",
    "frame-src 'self' blob: https://www.googletagmanager.com https://*.googletagmanager.com https://js.stripe.com https://hooks.stripe.com https://*.stripe.com https://checkout.razorpay.com https://*.razorpay.com https://accounts.google.com https://headway-widget.net https://verify.msg91.com https://control.msg91.com https://www.youtube.com https://*.youtube.com https://www.youtube-nocookie.com https://calendly.com https://*.calendly.com https://cdn.plaid.com https://*.plaid.com https://node.developer.yodlee.com https://*.yodlee.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://accounts.google.com https://*.razorpay.com https://*.stripe.com https://node.developer.yodlee.com https://*.yodlee.com",
    "frame-ancestors 'self'",
    'upgrade-insecure-requests',
];

module.exports = contentSecurityPolicyDirectives.join('; ');

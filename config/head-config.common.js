/**
 * Configuration for head elements added during the creation of index.html.
 *
 * All href attributes are added the publicPath (if exists) by default.
 * You can explicitly hint to prefix a publicPath by setting a boolean value to a key that has
 * the same name as the attribute you want to operate on, but prefix with =
 *
 * Example:
 * { name: 'msapplication-TileImage', content: 'assets/icon/ms-icon-144x144.png', '=content': true },
 * Will prefix the publicPath to content.
 *
 * { rel: 'apple-touch-icon', sizes: '57x57', href: 'assets/icon/apple-icon-57x57.png', '=href': false },
 * Will not prefix the publicPath on href (href attributes are added by default
 *
 */
module.exports = {
  link: [
    /**
     * <link> tags for 'apple-touch-icon' (AKA Web Clips).
     */
    // { rel: 'apple-touch-icon', sizes: '57x57', href: 'assets/icon/apple-icon-57x57.png' },
    // { rel: 'apple-touch-icon', sizes: '60x60', href: 'assets/icon/apple-icon-60x60.png' },
    // { rel: 'apple-touch-icon', sizes: '72x72', href: 'assets/icon/apple-icon-72x72.png' },
    // { rel: 'apple-touch-icon', sizes: '76x76', href: 'assets/icon/apple-icon-76x76.png' },
    // { rel: 'apple-touch-icon', sizes: '114x114', href: 'assets/icon/apple-icon-114x114.png' },
    // { rel: 'apple-touch-icon', sizes: '120x120', href: 'assets/icon/apple-icon-120x120.png' },
    // { rel: 'apple-touch-icon', sizes: '144x144', href: 'assets/icon/apple-icon-144x144.png' },
    // { rel: 'apple-touch-icon', sizes: '152x152', href: 'assets/icon/apple-icon-152x152.png' },
    // { rel: 'apple-touch-icon', sizes: '180x180', href: 'assets/icon/apple-icon-180x180.png' },

    /**
     * <link> tags for css.
     */
    { rel: 'stylesheet', href: 'assets/css/bootstrap.css' },
    { rel: 'stylesheet', href: 'assets/css/ngx-bootstrap/bs-datepicker.css' },
    { rel: 'stylesheet', href: 'assets/css/font-awesome.css' },
    { rel: 'stylesheet', href: 'assets/css/style-1.css' },
    { rel: 'stylesheet', href: 'assets/css/style-2.css' },
    { rel: 'stylesheet', href: 'assets/css/aside.css' },
    { rel: 'stylesheet', href: 'assets/css/ladda-themeless.min.css' },
    { rel: 'stylesheet', href: 'assets/css/style-bootstrap.css' },
    { rel: 'stylesheet', href: 'assets/css/perfect-scrollbar.component.css' },
    { rel: 'stylesheet', href: 'assets/css/toastr.css' },
    { rel: 'stylesheet', href: 'assets/css/busy.css' },
    // { rel: 'stylesheet', href: 'assets/js/plugins/select2/css/select2.min.css' },
    // { rel: 'stylesheet', href: 'assets/js/plugins/tagmanager/tagmanager.css' },
    { rel: 'stylesheet', href: 'assets/css/mystyle.css' },


    /**
     * <link> tags for android web app icons
     */
    { rel: 'icon', type: 'image/png', sizes: '192x192', href: 'assets/icon/android-icon-192x192.png' },

    /**
     * <link> tags for favicons
     */
    // { rel: 'icon', type: 'image/png', sizes: '32x32', href: 'assets/icon/favicon-32x32.png' },
    // { rel: 'icon', type: 'image/png', sizes: '96x96', href: 'assets/icon/favicon-96x96.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: 'assets/icon/favicon-16x16.png' },

    /**
     * <link> tags for a Web App Manifest
     */
    { rel: 'manifest', href: 'assets/manifest.json' }
  ],
  meta: [
    { name: 'msapplication-TileColor', content: '#00bcd4' },
    { name: 'msapplication-TileImage', content: 'assets/icon/ms-icon-144x144.png', '=content': true },
    { name: 'theme-color', content: '#00bcd4' }
  ],
  script: [
    { type: 'text/javascript', src: 'assets/js/jquery-1.11.3.min.js' },
    { type: 'text/javascript', src: 'assets/js/lodash.min.js' },
    // { type: 'text/javascript', src: 'assets/js/plugins/select2/js/select2.full.min.js' },
    // { type: 'text/javascript', src: 'assets/js/plugins/tagmanager/tagmanager.js' },
    // { type: 'text/javascript', src: 'assets/js/daterangepicker.min.js' },
    { type: 'text/javascript', src: 'https://checkout.razorpay.com/v1/checkout.js', async: true }
  ]
};


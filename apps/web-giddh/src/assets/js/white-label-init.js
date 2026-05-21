/**
 * White Label Initialization Script
 *
 * Reads white label config from localStorage and applies:
 * - Primary logo for the splash screen loader
 * - Favicon from white label config
 * - Page title and meta description from legal name
 * - API domain preconnect hint for faster connections
 *
 * Called via window.onload in each index*.html.
 * API domain is resolved from the whiteLabel localStorage config set by the server.
 */
window.onload = function () {
    var whiteLabelConfig = JSON.parse(localStorage.getItem('whiteLabel'));
    const GIDDH_DOMAINS = ['localhost', 'test.giddh.com', 'books.giddh.com'];
    const isGiddhDomain = GIDDH_DOMAINS.includes(window.location.hostname);

    // Apply primary logo (white label or Giddh default)
    var logoUrl = (whiteLabelConfig && whiteLabelConfig.body && whiteLabelConfig.body.logos && whiteLabelConfig.body.logos.dark)
        ? whiteLabelConfig.body.logos.dark
        : isGiddhDomain ? './assets/images/giddh-big-logo.svg' : '';
    var logoElement = document.getElementById('dynamic-logo');
    if (logoElement) { logoElement.src = logoUrl; }

    // Apply favicon (white label only, falls back to static <link> tag)
    var favicon = whiteLabelConfig && whiteLabelConfig.body && whiteLabelConfig.body.logos && whiteLabelConfig.body.logos.favicon;
    if (favicon) {
        var faviconEl = document.querySelector('link[rel="icon"]');
        if (!faviconEl) {
            faviconEl = document.createElement('link');
            faviconEl.setAttribute('rel', 'icon');
            document.head.appendChild(faviconEl);
        }
        faviconEl.setAttribute('href', favicon);
    }

    // Apply title and meta description from white label legal name
    if (whiteLabelConfig) {
        var legalName = whiteLabelConfig.body && whiteLabelConfig.body.legalName;
        if (legalName) {
            document.title = legalName + ' ~ Accounting Software';
            var descMeta = document.querySelector('meta[name="description"]');
            if (descMeta) { descMeta.setAttribute('content', legalName + ' ~ Accounting Software'); }
        }
    }

    // Add preconnect hint for the API domain (resolved from white label config only)
    var apiDomain = whiteLabelConfig && whiteLabelConfig.body && whiteLabelConfig.body.giddhWhiteLabel && whiteLabelConfig.body.giddhWhiteLabel.apiDomain;
    if (apiDomain) {
        var preconnectLink = document.createElement('link');
        preconnectLink.rel = 'preconnect';
        preconnectLink.href = apiDomain;
        document.head.appendChild(preconnectLink);
    }
};


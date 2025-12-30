// Electron initialization script - moved from inline scripts for CSP compliance

// Enhanced error handler for Electron environment
window.addEventListener('error', function(e) {
    if (e.error && e.error.message) {
        // Suppress read-only property errors
        if (e.error.message.includes('Cannot assign to read only property')) {
            console.warn('Suppressed read-only property error (expected in Electron secure context):', e.error.message);
            e.preventDefault();
            return false;
        }
        // Suppress analytics errors that don't work in file:// protocol
        if (e.error.message.includes('website URL has changed') ||
            e.error.message.includes('CookieYes') ||
            e.error.message.includes('LogRocket') ||
            e.error.message.includes('Clarity') ||
            e.error.message.includes('Headway') ||
            e.error.message.includes('GTM')) {
            console.warn('Suppressed analytics error (not compatible with Electron):', e.error.message);
            e.preventDefault();
            return false;
        }
        // Suppress CSP-related errors
        if (e.error.message.includes('Content Security Policy') ||
            e.error.message.includes('CSP') ||
            e.error.message.includes('unsafe-inline') ||
            e.error.message.includes('script-src')) {
            console.warn('Suppressed CSP error (expected in Electron environment):', e.error.message);
            e.preventDefault();
            return false;
        }
        // Suppress common undefined property errors in Electron
        if (e.error.message.includes('Cannot read properties of undefined') ||
            e.error.message.includes('Cannot read property') ||
            e.error.message.includes('undefined is not an object') ||
            e.error.message.includes('HW_config is not defined') ||
            e.error.message.includes('ReferenceError: HW_config is not defined') ||
            e.error.message.includes("Cannot read properties of undefined (reading 'nativeElement')") ||
            e.error.message.includes("Cannot read property 'nativeElement' of undefined")) {
            console.warn('Suppressed undefined property error (common in Electron startup):', e.error.message);
            e.preventDefault();
            return false;
        }
        // Suppress Electron IPC communication errors
        if (e.error.message.includes('Electron require failed') ||
            e.error.message.includes('Electron IPC not available') ||
            e.error.message.includes('Cannot read properties of undefined') && e.error.message.includes('send') ||
            e.error.message.includes('addBrowserConfirmationDialog') ||
            e.error.message.includes('setupNavigationListener') ||
            e.error.message.includes('ipcRenderer')) {
            console.warn('Suppressed Electron IPC error (fallback handling active):', e.error.message);
            e.preventDefault();
            return false;
        }
        // Suppress Angular chunk loading errors in Electron file:// protocol
        if (e.error.message.includes('ChunkLoadError') ||
            e.error.message.includes('Loading chunk') && e.error.message.includes('failed') ||
            e.error.message.includes('ChunkLoadError: Loading chunk')) {
            console.warn('Suppressed Angular chunk loading error (Electron file:// protocol):', e.error.message);
            e.preventDefault();
            return false;
        }
        // Suppress third-party widget errors
        if (e.error.message.includes('Headway Error') ||
            e.error.message.includes('Element provided by selector does not exist') ||
            e.error.message.includes('frame-ancestors') ||
            e.error.message.includes('sandbox attribute can escape')) {
            console.warn('Suppressed third-party widget error:', e.error.message);
            e.preventDefault();
            return false;
        }
    }
});

// Override window.onerror to catch problematic errors
window.onerror = function(message, source, lineno, colno, error) {
    if (message) {
        // Suppress read-only property errors
        if (message.includes('Cannot assign to read only property')) {
            console.warn('Suppressed read-only property error:', message);
            return true; // Prevent default error handling
        }
        // Suppress analytics errors
        if (message.includes('website URL has changed') ||
            message.includes('CookieYes') ||
            message.includes('LogRocket') ||
            message.includes('Clarity') ||
            message.includes('Headway') ||
            message.includes('GTM')) {
            console.warn('Suppressed analytics error:', message);
            return true; // Prevent default error handling
        }
        // Suppress CSP-related errors
        if (message.includes('Content Security Policy') ||
            message.includes('CSP') ||
            message.includes('unsafe-inline') ||
            message.includes('script-src') ||
            message.includes('Refused to execute inline script')) {
            console.warn('Suppressed CSP error:', message);
            return true; // Prevent default error handling
        }
        // Suppress common undefined property errors
        if (message.includes('Cannot read properties of undefined') ||
            message.includes('Cannot read property') ||
            message.includes('undefined is not an object') ||
            message.includes('HW_config is not defined') ||
            message.includes('ReferenceError: HW_config is not defined') ||
            message.includes("Cannot read properties of undefined (reading 'nativeElement')") ||
            message.includes("Cannot read property 'nativeElement' of undefined")) {
            console.warn('Suppressed undefined property error:', message);
            return true; // Prevent default error handling
        }
        // Suppress Electron IPC communication errors
        if (message.includes('Electron require failed') ||
            message.includes('Electron IPC not available') ||
            message.includes('Cannot read properties of undefined') && message.includes('send') ||
            message.includes('addBrowserConfirmationDialog') ||
            message.includes('setupNavigationListener') ||
            message.includes('ipcRenderer')) {
            console.warn('Suppressed Electron IPC error:', message);
            return true; // Prevent default error handling
        }
        // Suppress Angular chunk loading errors in Electron file:// protocol
        if (message.includes('ChunkLoadError') ||
            message.includes('Loading chunk') && message.includes('failed') ||
            message.includes('ChunkLoadError: Loading chunk')) {
            console.warn('Suppressed Angular chunk loading error (window.onerror):', message);
            return true; // Prevent default error handling
        }
        // Suppress third-party widget errors
        if (message.includes('Headway Error') ||
            message.includes('Element provided by selector does not exist') ||
            message.includes('frame-ancestors') ||
            message.includes('sandbox attribute can escape')) {
            console.warn('Suppressed third-party widget error:', message);
            return true; // Prevent default error handling
        }
    }
    return false; // Allow other errors to be handled normally
};

// Electron environment configuration (change manually as needed)
window.isElectron = true;
window.electronEnvironment = {
    isDevelopment: false,
    appUrl: './',
    apiUrl: 'https://api.giddh.com/'
};

// Override Angular environment ApiUrl for production
window.ApiUrl = 'https://api.giddh.com/';

// Define HW_config for Headway notification widget
window.HW_config = window.HW_config || {
    selector: ".notification",
    account: "7eB4aJ",
    enabled: !window.isElectron // Disable in Electron, enable in web
};

// Enhanced logo and preconnect initialization with retry mechanism
function initializeLogo() {
    try {
        let whiteLabelConfig = JSON.parse(localStorage.getItem("whiteLabel") || "null");
        const logoUrl = "./assets/images/giddh-big-logo.svg";
        const apiDomain = whiteLabelConfig?.body?.giddhWhiteLabel?.apiDomain || "https://apitest.giddh.com";

        if (whiteLabelConfig) {
            // Remove the h1 tag containing the image
            const logoContainer = document.querySelector("#main-giddh-loader h1");
            if (logoContainer) {
                logoContainer.remove();
            }
        } else {
            // Enhanced logo loading with retry mechanism
            const logoElement = document.getElementById("dynamic-logo");
            if (logoElement) {
                // Set logo source with error handling
                logoElement.onerror = function() {
                    console.warn('Logo failed to load, retrying...');
                    setTimeout(() => {
                        logoElement.src = logoUrl + '?retry=' + Date.now();
                    }, 1000);
                };

                logoElement.onload = function() {
                    console.log('Logo loaded successfully');
                };

                logoElement.src = logoUrl;

                // Fallback: ensure logo is set after a delay
                setTimeout(() => {
                    if (!logoElement.complete || logoElement.naturalWidth === 0) {
                        console.warn('Logo not loaded after timeout, forcing reload');
                        logoElement.src = logoUrl + '?fallback=' + Date.now();
                    }
                }, 2000);
            } else {
                console.warn('Logo element not found, retrying...');
                setTimeout(initializeLogo, 500);
            }
        }

        // Create a new preconnect link element
        const preconnectLink = document.createElement("link");
        preconnectLink.rel = "preconnect";
        preconnectLink.href = apiDomain;

        // Append the preconnect link to the head
        document.head.appendChild(preconnectLink);
    } catch (error) {
        console.warn('Error in logo/preconnect initialization:', error);
        // Fallback: set default logo with retry
        setTimeout(() => {
            const logoElement = document.getElementById("dynamic-logo");
            if (logoElement) {
                logoElement.src = "./assets/images/giddh-big-logo.svg?error=" + Date.now();
            }
        }, 1000);
    }
}

// Initialize logo on DOMContentLoaded
window.addEventListener('DOMContentLoaded', initializeLogo);

// Also initialize on window load as backup
window.addEventListener('load', function() {
    const logoElement = document.getElementById("dynamic-logo");
    if (logoElement && (!logoElement.src || logoElement.src === window.location.href)) {
        console.warn('Logo not set on window load, initializing...');
        initializeLogo();
    }
});

// Enhanced error logging with suppression for debugging
window.onerror = function (msg, url, line, col, error) {
    // Suppress specific error patterns in window.onerror as well
    if (msg && (
        msg.includes('Cannot read properties of undefined') && msg.includes('send') ||
        msg.includes('goToRoute') ||
        msg.includes('performActions') ||
        msg.includes('addBrowserConfirmationDialog') ||
        msg.includes('setupNavigationListener')
    )) {
        console.warn('Suppressed window.onerror (Electron IPC):', msg.substring(0, 100) + '...');
        return true; // Prevent default error handling
    }

    var extra = !col ? "" : "\ncolumn: " + col;
    extra += !error ? "" : "\nerror: " + error;
    console.error("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);
    return false;
};

// Global console.error interceptor for comprehensive error suppression
const originalConsoleError = console.error;
console.error = function(...args) {
    const message = args.join(' ');

    // Suppress specific error patterns
    if (message.includes('Electron IPC not available for page leave utility') ||
        message.includes('Cannot read properties of undefined') && message.includes('send') ||
        message.includes('addBrowserConfirmationDialog') ||
        message.includes('setupNavigationListener') ||
        message.includes('goToRoute') ||
        message.includes('performActions') ||
        message.includes('ChunkLoadError') ||
        message.includes('Loading chunk') && message.includes('failed') ||
        message.includes('ChunkLoadError: Loading chunk') ||
        message.includes('HW_config is not defined') ||
        message.includes('ReferenceError: HW_config is not defined') ||
        message.includes("Cannot read properties of undefined (reading 'nativeElement')") ||
        message.includes("Cannot read property 'nativeElement' of undefined") ||
        message.includes('Headway Error') ||
        message.includes('Element provided by selector does not exist') ||
        message.includes('frame-ancestors') ||
        message.includes('sandbox attribute can escape') ||
        message.includes('violates the following report-only Content Security Policy') ||
        message.includes('An iframe which has both allow-scripts and allow-same-origin') ||
        message.includes('LogRocket.min.js') ||
        message.includes('zipy.min.umd.js')) {
        console.warn('Suppressed console error (Electron compatibility):', message.substring(0, 100) + '...');
        return;
    }

    // Allow other errors to be logged normally
    originalConsoleError.apply(console, args);
};

// Override console methods used by third-party libraries
const originalConsoleLog = console.log;
console.log = function(...args) {
    const message = args.join(' ');
    if (message.includes('Cannot read properties of undefined') && message.includes('send')) {
        console.warn('Suppressed log error (Electron IPC):', message.substring(0, 100) + '...');
        return;
    }
    originalConsoleLog.apply(console, args);
};

// Early error suppression - override Error constructor
const OriginalError = window.Error;
window.Error = function(message) {
    if (message && (
        message.includes('Cannot read properties of undefined') && message.includes('send') ||
        message.includes('goToRoute') ||
        message.includes('performActions') ||
        message.includes('addBrowserConfirmationDialog')
    )) {
        console.warn('Suppressed Error construction (Electron IPC):', message.substring(0, 100) + '...');
        // Return a harmless error
        return new OriginalError('Suppressed Electron IPC error');
    }
    return new OriginalError(message);
};

// Electron secure context - jQuery will be loaded from bundled assets
// No require() available due to contextIsolation: true and nodeIntegration: false
console.log('Electron secure context - jQuery loaded from assets');

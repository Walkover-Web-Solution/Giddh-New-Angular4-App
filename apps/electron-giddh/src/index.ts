import { app, ipcMain, inAppPurchase } from "electron";
import setMenu from "./AppMenuManager";
import { log } from "./util";
import WindowManager from "./WindowManager";
import { GoogleLoginElectronConfig } from "./main-auth.config";
import ElectronGoogleOAuth2 from '@getstation/electron-google-oauth2';

let windowManager: WindowManager = null;
let STAGING_ENV = false;
let TEST_ENV = false;
let LOCAL_ENV = false;
let PRODUCTION_ENV = false;
let APP_URL = '';
let APP_FOLDER = '';
const PRODUCT_IDS = ['ravinder_birch_testing'];
let APPLE_INAPP_PURCHASE_PRODUCTS_LIST = null;

app.on("ready", () => {
    ipcMain.on("log.error", (event: any, arg: any) => {
        log(arg);
    });

    setMenu();
    windowManager = new WindowManager();
    windowManager.openWindows();
});
ipcMain.on("open-url", (event, arg) => {
    windowManager.openWindows(arg);
});
ipcMain.on("take-server-environment", (event, arg) => {
    process.env.STAGING_ENV = arg.STAGING_ENV;
    STAGING_ENV = arg.STAGING_ENV;
    process.env.TEST_ENV = arg.TEST_ENV;
    TEST_ENV = arg.TEST_ENV;
    process.env.LOCAL_ENV = arg.LOCAL_ENV;
    LOCAL_ENV = arg.LOCAL_ENV;
    process.env.PRODUCTION_ENV = arg.PRODUCTION_ENV;
    PRODUCTION_ENV = arg.PRODUCTION_ENV;
    process.env.AppUrl = arg.AppUrl;
    APP_URL = arg.AppUrl;
    process.env.APP_FOLDER = arg.APP_FOLDER;
    APP_FOLDER = arg.APP_FOLDER;
});

ipcMain.on("authenticate", (event, arg) => {

    if (arg === "google") {


        const myApiOauth = new ElectronGoogleOAuth2(GoogleLoginElectronConfig.clientId,
            GoogleLoginElectronConfig.clientSecret,
            ['email'],
            {
                successRedirectURL: PRODUCTION_ENV ? 'https://app.giddh.com/app-login-success' : 'https://stage.giddh.com/app-login-success',
                loopbackInterfaceRedirectionPort: 45587,
                refocusAfterSuccess: true,
            }
        );

        myApiOauth.openAuthWindowAndGetTokens()
            .then(token => {
                event.returnValue = token;
                if (event.reply) {
                    event.reply('take-your-gmail-token', token);
                } else if (event.sender.send) {
                    event.sender.send('take-your-gmail-token', token);
                }
                // use your token.access_token
            });
    }
});
ipcMain.on("authenticate-send-email", (event, arg) => {
    if (arg === "google") {
        const myApiOauth = new ElectronGoogleOAuth2(GoogleLoginElectronConfig.clientId,
            GoogleLoginElectronConfig.clientSecret,
            ['https://www.googleapis.com/auth/gmail.send'],
            {
                successRedirectURL: PRODUCTION_ENV ? 'https://app.giddh.com/app-login-success' : 'https://stage.giddh.com/app-login-success',
                loopbackInterfaceRedirectionPort: 45587,
                refocusAfterSuccess: true,
            }
        );
        myApiOauth.openAuthWindowAndGetTokens()
            .then(token => {
                event.returnValue = token;
                if (event.reply) {
                    event.reply('take-your-gmail-token', token);
                } else if (event.sender.send) {
                    event.sender.send('take-your-gmail-token', token);
                }
                // use your token.access_token
            });
    }
});

// Listen for transactions as soon as possible.
// inAppPurchase.on('transactions-updated', (event, transactions) => {
//     console.log(transactions);

//     if (!Array.isArray(transactions)) {
//         return
//     }

//     // Check each transaction.
//     for (const transaction of transactions) {
//         const payment = transaction.payment

//         switch (transaction.transactionState) {
//             case 'purchasing':
//                 console.log(`Purchasing ${payment.productIdentifier}...`)
//                 break

//             case 'purchased': {
//                 console.log(`${payment.productIdentifier} purchased.`)

//                 // Get the receipt url.
//                 const receiptURL = inAppPurchase.getReceiptURL()

//                 console.log(`Receipt URL: ${receiptURL}`)

//                 // Submit the receipt file to the server and check if it is valid.
//                 // @see https://developer.apple.com/library/content/releasenotes/General/ValidateAppStoreReceipt/Chapters/ValidateRemotely.html
//                 // ...
//                 // If the receipt is valid, the product is purchased
//                 // ...

//                 // Finish the transaction.
//                 inAppPurchase.finishTransactionByDate(transaction.transactionDate)

//                 break
//             }

//             case 'failed':

//                 console.log(`Failed to purchase ${payment.productIdentifier}.`)

//                 // Finish the transaction.
//                 inAppPurchase.finishTransactionByDate(transaction.transactionDate)

//                 break
//             case 'restored':

//                 console.log(`The purchase of ${payment.productIdentifier} has been restored.`)

//                 break
//             case 'deferred':

//                 console.log(`The purchase of ${payment.productIdentifier} has been deferred.`)

//                 break
//             default:
//                 break
//         }
//     }
// })

// // Check if the user is allowed to make in-app purchase.
// if (!inAppPurchase.canMakePayments()) {
//     console.log('The user is not allowed to make in-app purchase.')
// } else {
//     console.log('The user is allowed to make in-app purchase.')
// }

// ipcMain.on("apple-pay", (event, arg) => {
//     console.log("apple-pay", arg);
//     //if (arg == 'ravinder_birch_testing') {
//         inAppPurchase.getProducts(PRODUCT_IDS).then(products => {
//             event.reply('apple-pay-init', products);
//             // Check the parameters.
//             if (!Array.isArray(products) || products.length <= 0) {
//                 console.log('Unable to retrieve the product informations.')
//                 return
//             }
        
//             APPLE_INAPP_PURCHASE_PRODUCTS_LIST = products;
//             console.log(APPLE_INAPP_PURCHASE_PRODUCTS_LIST);
//             // Ask the user which product they want to purchase.
//             const selectedProduct = APPLE_INAPP_PURCHASE_PRODUCTS_LIST[0];
//             const selectedQuantity = 1;

//             // Purchase the selected product.
//             inAppPurchase.purchaseProduct(selectedProduct.productIdentifier, selectedQuantity).then(isProductValid => {
//                 if (!isProductValid) {
//                     console.log('The product is not valid.')
//                     return
//                 }

//                 console.log('The payment has been added to the payment queue.')
//             });
//         }).catch((err) => event.reply('apple-pay-init', err) );
//     //}
// });
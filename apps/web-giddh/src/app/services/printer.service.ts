import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { PrinterFormatService } from './printer.format.service';
declare const qz: any;

@Injectable()
export class PrinterService {
//     public qz: any = qz;
//     public cfg: any = null;
//     public state: any = {};
//     public message: any = {};
//     public version: string = '';
//     public keyword: string = '';
//     public pin: any = [];
//     public file: string = '';
//     public privateKey = '-----BEGIN PRIVATE KEY-----\n' +
//         'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCkJsPYZhBzK7uU\n' +
//         '8Lhrlbl7DiaCXH9An0Abd9H3K8eKEqZXMDmKn7tA0PIhgvIuuoQaJ0V7NeE0Hxxp\n' +
//         'dIh65Y4tMifSyCvYIHEgerBkIPUgEhpvnbRzRLEH1YDn0ust2Vfwd2Hd0nRW/xHC\n' +
//         'Y49D6DRDFslvis6K6WPJYzu9uUlRs79yQM6ipzniN4dseA2jcvNd2LncBMXm8OtX\n' +
//         'AjU9z6Nf3r1wSFaqi/6TVILf844t6OtYOh5wtp2rOlJW6yFJ+2klL7yp4x5IqNUG\n' +
//         '5AahlEFP6q5RSIRVwXwebN9NE8KUGyr8Syhc7dQmMsWDcbYSV8CfR5y2eh4rde7r\n' +
//         'b/FbDjfrAgMBAAECggEAJ84Op6b4TjVIo3FMByqjc6eWxv3PDciQLxj7HUjMdjrX\n' +
//         'g0T6bxcUvT7tuBqcx6AK8JydSKdkGNOCfD/56HNJ6sPCzGYl257iT9HwfBdR2ZkK\n' +
//         'OA6x91Gs7A1l2NFYniGaJYGNhdDGzWHE2LJzxy/DnJEl/5pVQ3Ic9HTPw83ubZUZ\n' +
//         'WxOZYuDDvCUElsQnMrMIjiNx/6X3rJRdWoBViqj1VADA+mK0efExtzvFzPZSjwbP\n' +
//         'Co/oJEAtxTXcn1YGnV6SPakcZdESgCzUhymSxjOkEVnxMmy3zZBYggXtzEiLuYaS\n' +
//         'YsEjFcWIZDGgcto+Qu5jpMr35Lh/e18a3TsRNFQowQKBgQDTrWhjRfkZDK2m0Fdh\n' +
//         'eg1o4c+P/5eiD0HHMiy/zeZS2T0nicr/GYEZkW3zu5BbgMlVxC6rIfp40NS5nZyW\n' +
//         '43ikuSGanIb49YP9kgbOj2DQqpUJzDxY//5v3b6GsIw1Vt9yjWZ67OoRgU3lGJKF\n' +
//         'esy3ojfMXH2PlGqB4Rxl73RGQwKBgQDGhdAJDxDda6jsVyuYRRFWJPvzwBNUILA0\n' +
//         'l9Kv9dTTDjuyt3UMXE7Qgp4eHIZCHnFBJX3HZII/sznx0W1foBi2sZdIJofDXRPi\n' +
//         'SBzI/Sf/nGj/G/zcwIc4B77opv6gmcoPAypuTxQXiqLzCAy6NMD9d8Sr82ZbG82p\n' +
//         'SBadR01xOQKBgC3Q5bw/A/iJBvkJNTCTA14FKjDnyIE6PimIUak+PrEF9jedmoN2\n' +
//         'mLvY/2x213sGuA1JRjSiSR1nTfPTCnaaS52TuJNHd+tg8K2ssq542CKyGUoim5lD\n' +
//         '52V9IGT0x5Qv9nNL6beHme4qB5sjo2sitja09NDV4BN4s0jjWYsytf8TAoGARRPC\n' +
//         's6Q+Zg1UFgiu7qj5w1PTJ5mqIBfPuD0r3nZXu6i0NReI7ugftIX+ptOeE9ur5NM6\n' +
//         '1OqwN6IRg4cv25pFfyyES2K80snMZWxaN8V+6X5vOnVuoxGK+4AWebXB2/gnStn7\n' +
//         'Ja72esqOsKoYY6J/lLLcCEkFUKZ4BXNECy4IUGECgYAiBDXc9CdY+k6bRYsyzP64\n' +
//         'S3yJk1HNyPyQAP3c550QhZEdDb3b9FwSWegUgVqROxnZC9xxyx6IcfxAnrUPfard\n' +
//         'ZKcN7CuHeJrmMCq/9+Wj+3mvBTlU4aTwqGkTfgtauRRYXyo8U2+v9GhczsB98SCA\n' +
//         'YNQY1AhNlt23BugdZR5HgQ==\n' +
//         '-----END PRIVATE KEY-----';

//     constructor(
//         private _printerFormat: PrinterFormatService
//     ) {
//         /// Authentication setup ///
//         this.qz.security.setCertificatePromise((resolve, reject) => {
//             // Preferred method - from server
//             // $.ajax({ url: "assets/signing/digital-certificate.txt", cache: false, dataType: "text" }).then(resolve, reject);

//             // Alternate method 1 - anonymous
//             // resolve();

//             // Alternate method 2 - direct
//             resolve('-----BEGIN CERTIFICATE-----\n' +
//                 'MIIEJTCCAw2gAwIBAgIUQhd89jxgFx0ZMV6i8cjGJvS0fkAwDQYJKoZIhvcNAQEL\n' +
//                 'BQAwgaAxCzAJBgNVBAYTAklOMRcwFQYDVQQIDA5NYWRoeWEgUHJhZGVzaDEPMA0G\n' +
//                 'A1UEBwwGSW5kb3JlMR4wHAYDVQQKDBVXYWxrb3ZlciBUZWNobm9sb2dpZXMxEDAO\n' +
//                 'BgNVBAsMB0RvdFNhbGUxFTATBgNVBAMMDCouZG90c2FsZS5pbjEeMBwGCSqGSIb3\n' +
//                 'DQEJARYPaW5mb0Bkb3RzYWxlLmluMCAXDTE5MDUzMTA4Mjk0MloYDzIwNTAxMTIz\n' +
//                 'MDgyOTQyWjCBoDELMAkGA1UEBhMCSU4xFzAVBgNVBAgMDk1hZGh5YSBQcmFkZXNo\n' +
//                 'MQ8wDQYDVQQHDAZJbmRvcmUxHjAcBgNVBAoMFVdhbGtvdmVyIFRlY2hub2xvZ2ll\n' +
//                 'czEQMA4GA1UECwwHRG90U2FsZTEVMBMGA1UEAwwMKi5kb3RzYWxlLmluMR4wHAYJ\n' +
//                 'KoZIhvcNAQkBFg9pbmZvQGRvdHNhbGUuaW4wggEiMA0GCSqGSIb3DQEBAQUAA4IB\n' +
//                 'DwAwggEKAoIBAQCkJsPYZhBzK7uU8Lhrlbl7DiaCXH9An0Abd9H3K8eKEqZXMDmK\n' +
//                 'n7tA0PIhgvIuuoQaJ0V7NeE0HxxpdIh65Y4tMifSyCvYIHEgerBkIPUgEhpvnbRz\n' +
//                 'RLEH1YDn0ust2Vfwd2Hd0nRW/xHCY49D6DRDFslvis6K6WPJYzu9uUlRs79yQM6i\n' +
//                 'pzniN4dseA2jcvNd2LncBMXm8OtXAjU9z6Nf3r1wSFaqi/6TVILf844t6OtYOh5w\n' +
//                 'tp2rOlJW6yFJ+2klL7yp4x5IqNUG5AahlEFP6q5RSIRVwXwebN9NE8KUGyr8Syhc\n' +
//                 '7dQmMsWDcbYSV8CfR5y2eh4rde7rb/FbDjfrAgMBAAGjUzBRMB0GA1UdDgQWBBTS\n' +
//                 '3KlqQ9BRm77xeRDeU/sZgZBnqDAfBgNVHSMEGDAWgBTS3KlqQ9BRm77xeRDeU/sZ\n' +
//                 'gZBnqDAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQB82T+WKjJo\n' +
//                 '1Tv5yEREsgYi4iN7ebDzFlaYOL/QuisPq1+wZPfjXIIVbKL7SL9AtvzZ8wcSkYJj\n' +
//                 'rX58WX9Hi3O1gzLrImvbbxkQFt9yGacH49p7d+4wFKYjmHw7rVX1xAGZq7YQVyjl\n' +
//                 'I0y+pJkh4l1BiiIQ6LxGuMnuL4BnRZQW+DJsPPWmq6J+ybKP9tIkfuOcr8fds94p\n' +
//                 'B17PwT8RQoAGZHSBkcY9mP9YqwM1pzOB8xT+swSD9snt1H9KiYCvesk9lAMSCDkv\n' +
//                 'oaJViejmyV9TBIW8CJ0DA30VJkZDsla7CPH6VOjaqHD+j8mgFxnbehCo8S9iBj3/\n' +
//                 'ImyMTqnKMRNp\n' +
//                 '-----END CERTIFICATE-----');
//         });


//         this.launchQZ();
//     }

//     /// Connection ///
//     launchQZ() {
//         if (!this.qz.websocket.isActive()) {
//             // Retry 5 times, pausing 1 second between each attempt
//             this.startConnection({ retries: 5, delay: 1 });
//         }
//     }

//     isActive() {
//         return this.qz.websocket.isActive();
//     }

//     startConnection(config) {
//         if (!this.qz.websocket.isActive()) {
//             this.updateState('Waiting', 'default');

//             this.qz.websocket.connect(config).then(() => {
//                 this.updateState('Active', 'success');
//                 this.findVersion();
//             }).catch(this.handleConnectionError);
//         } else {
//             this.displayMessage('An active connection with QZ already exists.', 'alert-warning');
//         }
//     }

//     endConnection() {
//         if (this.qz.websocket.isActive()) {
//             this.qz.websocket.disconnect().then(() => {
//                 this.updateState('Inactive', 'default');
//             }).catch(this.handleConnectionError);
//         } else {
//             this.displayMessage('No active connection with QZ exists.', 'alert-warning');
//         }
//     }


//     /// Detection ///
//     findPrinter(query) {
//         return this.qz.printers.find(query);
//     }

//     findDefaultPrinter(set) {
//         this.qz.printers.getDefault().then(data => {
//             if (set) { this.setPrinter(data); }
//         }).catch(this.displayError);
//     }

//     findPrinters() {
//         return this.qz.printers.find();
//     }

    

//     getUpdatedConfig() {
//         if (this.cfg === null) {
//             this.cfg = this.qz.configs.create(null);
//         }

//         this.updateConfig();
//         return this.cfg;
//     }

//     updateConfig() {
//         let pxlSize = {
//             width: 12,
//             height: 10
//         };

//         let pxlMargins = {
//             top: 1,
//             right: 1,
//             bottom: 1,
//             left: 1
//         };

//         let copies = 1;
//         let jobName = null;

//         this.cfg.reconfigure({
//             altPrinting: $('#rawAltPrinting').prop('checked'),
//             encoding: $('#rawEncoding').val(),
//             endOfDoc: $('#rawEndOfDoc').val(),
//             perSpool: $('#rawPerSpool').val(),
//             colorType: $('#pxlColorType').val(),
//             copies,
//             density: $('#pxlDensity').val(),
//             duplex: $('#pxlDuplex').prop('checked'),
//             interpolation: $('#pxlInterpolation').val(),
//             jobName,
//             legacy: $('#pxlLegacy').prop('checked'),
//             margins: pxlMargins,
//             orientation: $('#pxlOrientation').val(),
//             paperThickness: $('#pxlPaperThickness').val(),
//             printerTray: $('#pxlPrinterTray').val(),
//             rasterize: $('#pxlRasterize').prop('checked'),
//             rotation: $('#pxlRotation').val(),
//             scaleContent: $('#pxlScale').prop('checked'),
//             size: pxlSize,
//             units: $('input[name=\'pxlUnits\']:checked').val()
//         });
//     }

//     setPrintFile() {
//         this.setPrinter({ file: this.file });
//     }

//     setPrintHost(host, port) {
//         this.setPrinter({ host, port });
//     }

//     setPrinter(printer) {
//         if (printer && typeof printer === 'object' && printer.name === null) {
//             printer.name = '';
//         }
//         let cf = this.getUpdatedConfig();
//         cf.setPrinter(printer);

//         if (printer && typeof printer === 'object' && (printer.name === undefined || printer.name === '')) {
//             if (printer.file !== undefined) {
//                 this.state.name = 'FILE: ' + printer.file;
//             }
//             if (printer.host !== undefined) {
//                 this.state.name = 'HOST: ' + printer.host + ':' + printer.port;
//             }
//         } else {
//             if (printer && printer.name !== undefined) {
//                 this.state.name = printer.name;
//             }

//             if (printer === undefined) {
//                 this.state.name = 'NONE';
//             }
//         }
//     }

//     findVersion() {
//         this.qz.api.getVersion().then(data => {
//             this.version = data;
//         }).catch(this.displayError);
//     }

//     updateState(text, css) {
//         this.state.text = text;
//         this.state.css = css;
//     }

//     handleConnectionError(err) {
//         this.updateState('Error', 'danger');

//         if (err.target !== undefined) {
//             if (err.target.readyState >= 2) { // if CLOSING or CLOSED
//                 this.displayError('Connection to QZ Tray was closed');
//             } else {
//                 this.displayError('A connection error occurred, check log for details');
//                 console.error(err);
//             }
//         } else {
//             this.displayError(err);
//         }
//     }

//     displayError(err) {
//         this.displayMessage(err, 'alert-danger');
//     }

//     displayMessage(msg, css) {
//         if ((css === undefined) || (css === '')) { css = 'alert-info'; }
//         this.message = { message: msg, css };
//     }

//     // Print functions
//     public printESCPOS(text, dataForLogo, printerConfig, salesOrderId = 0, salesOrder = true) {
//         let printer = JSON.parse(localStorage.getItem('printer'));
//         let company = JSON.parse(localStorage.getItem('company')).companyDetails.company.company;
//         let printerNameOrHost = (printer.name && printer.name.length > 0) ? printer.name : printer.host;
//         this.printerSet(printerConfig);
//         let config = this.getUpdatedConfig();
//         let printImage = [
//             text
//         ];
//         // Work for printing logo at invoice
//         if (company && company.meta && company.meta.print_logo_in_invoice === true && company.image_icon) {
//             config = qz.configs.create(printerNameOrHost, {
//                 size: { width: 3, height: 3 }, units: 'in', rasterize: 'false',
//                 colorType: 'blackWhite',
//                 interpolation: 'nearest-neighbor'
//             });
//             printImage = [
//                 dataForLogo,
//                 this._printerFormat.formatCenter(''),
//                 {
//                     type: 'raw',
//                     format: 'image',
//                     // Add image here in data
//                     data: company.image_icon,
//                     options: { language: 'ESCPOS', dotDensity: 'double' }
//                 },
//                 text
//             ];
//         }
//         this.qz.print(config, printImage).catch(err => {
//             if (err && (salesOrderId > 0) && salesOrder) {
//                 let payload = {
//                     sms_invoice: true
//                 };
//                 salesOrderId = 0;
//             }
//         });
//     }

//     public printKotESCPOS(text, printerConfig) {
//         this.printerSet(printerConfig);
//         let config = this.getUpdatedConfig();
//         let printImage = [
//             text
//         ];
//         this.qz.print(config, printImage).catch(err => { });
//     }

//     public printReportESCPOS(text) {
//         let printerConfig = JSON.parse(localStorage.getItem('printer'));
//         this.printerSet(printerConfig);
//         let config = this.getUpdatedConfig();
//         let printImage = [
//             text
//         ];
//         this.qz.print(config, printImage).catch(err => { });
//     }

//     public printTestESCPOS(text, printerConfig) {
//         this.printerSet(printerConfig);
//         let config = this.getUpdatedConfig();
//         let printImage = [
//             text
//         ];
//         this.qz.print(config, printImage).catch(err => console.log(err));
//     }

//     public printerSet(printerConfig) {
//         if (printerConfig === null) {
//             printerConfig = JSON.parse(localStorage.getItem('printer'));
//         }
//         if (printerConfig && printerConfig.name !== '' && printerConfig.name !== null) {
//             printerConfig = printerConfig.name;
//         }
//         this.setPrinter(printerConfig);
//     }

}

import { Injectable } from '@angular/core';
import { PrinterFormatService } from './printer.format.service';
import { KJUR, KEYUTIL, stob64, hextorstr } from 'jsrsasign';
import * as qz from "qz-tray";

@Injectable()
export class ThermalService {

    /** This will use for max length for character according to paper */
    private maxLength: number = 46;

    constructor(private printerFormat: PrinterFormatService) { }
    /**
    * This will use for pos commands formatted
    *
    * @memberof ThermalComponent
    */
    public print(defaultTemplate: any, request: any): void {
        this.maxLength = 46;
        /**
         * This will use for hide/show for QR Code
         */
        let qr;
        let dots;
        let size1;
        let size0;
        let qrLength;
        let itemsQrTaxData = "";
        /** This will use for initialized entry tax */
        let entryTaxesQR = [];
        if (defaultTemplate?.sections?.header?.data?.showQrCode?.display) {
            for (let entry of request.entries) {
                if (entry?.taxes?.length > 0) {
                    for (let taxApp of entry.taxes) {
                        if (entryTaxesQR[taxApp.accountUniqueName] === undefined) {
                            entryTaxesQR[taxApp.accountUniqueName] = [];
                            entryTaxesQR[taxApp.accountUniqueName]['name'] = taxApp?.accountName;
                            entryTaxesQR[taxApp.accountUniqueName]['amount'] = taxApp?.amount?.amountForAccount;
                        } else {
                            entryTaxesQR[taxApp.accountUniqueName]['amount'] = Number(entryTaxesQR[taxApp?.accountUniqueName]['amount']) + Number(taxApp?.amount?.amountForAccount);
                        }
                    }
                }
            }
            Object.keys(entryTaxesQR)?.forEach(key => {
                let entryTax = entryTaxesQR[key];
                if (entryTax?.amount > 0) {
                    let taxAmount = parseFloat(
                        entryTax?.amount
                    ).toFixed(2);

                    itemsQrTaxData +=
                        entryTax?.name +
                        " - " +
                        taxAmount;
                }
            });

            // The QR data
            qr = "SELLER DETAILS" + this.printerFormat.lineBreak + "GSTIN - " + request?.company?.billingDetails?.taxNumber + this.printerFormat.lineBreak + this.printerFormat.lineBreak + "INVOICE DETAILS" + this.printerFormat.lineBreak + "Number - " + request?.number + this.printerFormat.lineBreak + "Date - " + request?.date + this.printerFormat.lineBreak + "Amount - " + (request?.grandTotal?.amountForCompany ? request?.grandTotal?.amountForCompany : 0) + this.printerFormat.lineBreak + itemsQrTaxData + this.printerFormat.lineBreak + "Total Tax - " + (request?.taxTotal?.amountForAccount ? request?.taxTotal?.amountForAccount : 0) + this.printerFormat.lineBreak;

            // The dot size of the QR code
            dots = "\x03";

            // Some proprietary size calculation
            qrLength = qr?.length + 3;
            size1 = String.fromCharCode(qrLength % 500);
            size0 = String.fromCharCode(Math.floor(qrLength / 500));
        }
        else {
            qr = "";
            dots = 0;
            size1 = 0;
            size0 = 0;
            qrLength = 0;
        }

        /** This will use for initialized entry tax */
        let entryTaxes = [];

        /** This will use for initialized items */
        let items = "";

        /** This will use for initialized items field */
        let itemsField = "";

        /** This will use for initialized tax */
        let tax = "";

        /**
         * This will use for hide/show for thanks message
         */
        let thankYouMsgField;
        if (defaultTemplate?.sections?.footer?.data?.thanks?.display) {
            thankYouMsgField = defaultTemplate?.sections?.footer?.data?.thanks?.label;
        } else {
            thankYouMsgField = "";
        }

        /**
         * This will use for hide/show for Company Name in footer
         */
        let firmNameField;
        if (defaultTemplate?.sections?.footer?.data?.message1?.display) {
            firmNameField = defaultTemplate?.sections?.footer?.data?.message1?.label;
        }
        else {
            firmNameField = "";
        }

        /**
         * This will use for hide/show for invoice heading
         */
        let invoiceHeadingField;
        if (defaultTemplate?.sections?.header?.data?.formNameTaxInvoice?.display) {
            invoiceHeadingField = defaultTemplate?.sections?.header?.data?.formNameTaxInvoice?.label;
        } else {
            invoiceHeadingField = "";
        }

        /**
         * This will use for hide/show for company name in heading
         */
        let headerCompanyName;
        if (defaultTemplate?.sections?.header?.data?.companyName?.display) {
            if (request?.company?.name) {
                headerCompanyName = request?.company?.name;
            } else {
                headerCompanyName = '';
            }
        } else {
            headerCompanyName = "";
        }

        /**
         * This will use for hide/show for company aaddress heading
         */
        let headerCompanyAddress;
        if (defaultTemplate?.sections?.header?.data?.showCompanyAddress?.display) {
            if (request?.company?.billingDetails?.address[0]) {
                headerCompanyAddress = request?.company?.billingDetails?.address[0];
            } else {
                headerCompanyAddress = '';
            }
        } else {
            headerCompanyAddress = "";
        }

        /**
         * This will use for hide/show for customer billing address
         */
        let accountAddress = "";
        let accountGstNumberField = "";
        let billingGstinNumber = "";
        // if (defaultTemplate?.sections?.header?.data?.billingGstin?.display && defaultTemplate?.sections?.header?.data?.billingAddress?.display) {
        //     accountGstNumberField = defaultTemplate?.sections?.header?.data?.billingGstin?.label;
        //     accountAddress = request?.account?.billingDetails?.address.join(" ");
        //     billingGstinNumber = request?.account?.billingDetails?.taxNumber;
        //     if (request?.account?.billingDetails?.taxNumber) {
        //         billingGstinNumber = request?.account?.billingDetails?.taxNumber;
        //         accountGstNumberField = defaultTemplate?.sections?.header?.data?.billingGstin?.label;
        //     } else {
        //         billingGstinNumber = '';
        //         accountGstNumberField = '';
        //     }
        // } else {
        //     accountGstNumberField = "";
        //     accountAddress = "";
        //     billingGstinNumber = "";
        // }

        /**
         * This will use for hide/show for company GST number
         */
        let companyGstNumberField;
        let companyGstin;
        if (defaultTemplate?.sections?.header?.data?.gstin?.display) {
            companyGstNumberField = defaultTemplate?.sections?.header?.data?.gstin?.label;
            if (request?.company?.billingDetails?.taxNumber) {
                companyGstin = request?.company?.billingDetails?.taxNumber;
            } else {
                companyGstNumberField = '';
                companyGstin = '';
            }
        }
        /**
         * This will use for hide/show for account name
         */
        let accountName;
        if (defaultTemplate?.sections?.header?.data?.customerName?.display) {
            if (request?.account?.customerName) {
                accountName = request?.account?.customerName;
            } else {
                accountName = '';
            }
        } else {
            accountName = "";
        }

        /**
         * This will use for hide/show for invoice/voucher label
        */
        let dateField;
        let numberField;
        let voucherNumber;
        let voucherDate;
        if (!(defaultTemplate?.type === "sales")) {
            if (defaultTemplate?.sections?.header?.data?.invoiceDate?.display) {
                dateField = defaultTemplate?.sections?.header?.data?.invoiceDate?.label;
                voucherDate = request?.date;
            } else {
                dateField = "";
                voucherDate = "";
            }
            if (defaultTemplate?.sections?.header?.data?.invoiceNumber?.display) {
                numberField = defaultTemplate?.sections?.header?.data?.invoiceNumber?.label;
                voucherNumber = request?.number;
            } else {
                numberField = "";
                voucherNumber = "";
            }
        } else {
            if (defaultTemplate?.sections?.header?.data?.voucherDate?.display) {
                dateField = defaultTemplate?.sections?.header?.data?.voucherDate?.label;
                voucherDate = request?.date;
            } else {
                dateField = "";
                voucherNumber = "";
            }
            if (defaultTemplate?.sections?.header?.data?.voucherNumber?.display) {
                numberField = defaultTemplate?.sections?.header?.data?.voucherNumber?.label;
                voucherNumber = request?.number;
            } else {
                numberField = "";
                voucherNumber = "";
            }
        }

        /**
         * This will use for hide/show for products name
         */

        let productsField;
        if (defaultTemplate?.sections?.table?.data?.item?.display) {
            productsField = defaultTemplate?.sections?.table?.data?.item?.label;
        } else {
            productsField = "";
        }

        /**
         * This will use for hide/show for no of items
         */
        let noOfItemsField;

        if (defaultTemplate?.sections?.table?.data?.totalQuantity?.display) {
            noOfItemsField = defaultTemplate?.sections?.table?.data?.totalQuantity?.label;
        } else {
            noOfItemsField = '';
        }

        /**
         * This will use for hide/show for total amount and total amount in words
         */
        let subTotal;
        let totalAmountField;
        let totalWords;
        let companyCurrencyCode;
        if (defaultTemplate?.sections?.footer?.data?.totalDue?.display && defaultTemplate?.sections?.footer?.data?.totalInWords?.display) {
            totalAmountField = 'Invoice Total';
            totalWords = request.totalAsWords?.amountForAccount;
            subTotal = parseFloat(request?.grandTotal?.amountForAccount).toFixed(2);
            companyCurrencyCode = request?.company?.currency?.code;
        } else {
            totalAmountField = "";
            subTotal = "";
            totalWords = "";
            companyCurrencyCode = "";
        }

        /**
         * This will use for hide/show for discount total
         */
        let discountAmountField;
        let discount: any;
        if (defaultTemplate?.sections?.table?.data?.discount?.display) {
            discountAmountField = defaultTemplate?.sections?.table?.data?.discount?.label;
            discount = request?.discountTotal ? parseFloat(request?.discountTotal?.amountForCompany).toFixed(2) : "0";
        } else {
            discountAmountField = "";
            discount = "";
        }

        /**
         * This will use for hide/show for tax amount
         */
        let taxAmountField;
        let taxableAmount = 0;
        if (defaultTemplate?.sections?.table?.data?.taxableValue?.display) {
            for (let entry of request.entries) {
                for (let transaction of entry.transactions) {
                    if (transaction?.taxableValue?.amountForAccount) {
                        taxableAmount = taxableAmount + transaction?.taxableValue?.amountForAccount;
                    } else {
                        taxableAmount = 0;
                    }
                }
            }
            taxAmountField = defaultTemplate?.sections?.table?.data?.taxableValue?.label;
        } else {
            taxAmountField = "";
        }

        /**
         * This will use for hide/show for quantity
         */
        let quantityField;
        if (defaultTemplate?.sections?.table?.data?.quantity?.display) {
            quantityField = defaultTemplate?.sections?.table?.data?.quantity?.label;
        } else {
            quantityField = "";
        }

        /**
         * This will use for hide/show for rate
         */
        let rateField;
        if (defaultTemplate?.sections?.table?.data?.rate?.display) {
            rateField = defaultTemplate?.sections?.table?.data?.rate?.label;
        } else {
            rateField = "";
        }

        /**
         * This will use for hide/show for footer total
         */
        let netAmountField;
        if (defaultTemplate?.sections?.table?.data?.total?.display) {
            netAmountField = defaultTemplate?.sections?.table?.data?.total?.label;
        } else {
            netAmountField = "";
        }

        /**
         * This will use for hide/show for footer company name
         */
        let footerCompanyName;
        if (defaultTemplate?.sections?.footer?.data?.companyName?.display) {
            footerCompanyName = request?.company?.name;
        } else {
            footerCompanyName = "";
        }
        /**
         * This will use for hide/show for quantity
         */
        let qtyPadding;
        /**
         * This will use for hide/show for rate
         */
        let ratePadding;
        /**
         * This will use for hide/show for amount
         */
        let amountPadding;
        if (defaultTemplate?.sections?.table?.data?.quantity?.display) {
            qtyPadding = 7;
            ratePadding = 16;
            amountPadding = 13;
        } else {
            qtyPadding = 0;
            ratePadding = 16;
            amountPadding = 13;
        }
        if (defaultTemplate?.sections?.table?.data?.rate?.display) {
            qtyPadding = 7;
            ratePadding = 16;
            amountPadding = 13;
        } else {
            qtyPadding = 7;
            ratePadding = 0;
            amountPadding = 16;
        }
        if (defaultTemplate?.sections?.table?.data?.amount?.display) {
            qtyPadding = 7;
            ratePadding = 16;
            amountPadding = 13;
        } else {
            qtyPadding = 7;
            ratePadding = 16;
            amountPadding = 0;
        }
        if (!defaultTemplate?.sections?.table?.data?.item?.display) {
            qtyPadding = 2;
            ratePadding = 22;
            amountPadding = 22;
        } else {
            qtyPadding = 7;
            ratePadding = 16;
            amountPadding = 13;
        }

        /**
         * This will use for hide/show for item details
         */
        let itemDetailsField =
            quantityField?.padStart(qtyPadding) +
            "" +
            rateField?.padStart(ratePadding) +
            "" +
            netAmountField?.padStart(amountPadding);

        let itemFieldLength = this.maxLength - itemDetailsField?.length;

        let itemFieldName = productsField?.substring(0, itemFieldLength);

        if (itemFieldName?.length < productsField?.length) {
            let lastIndex = itemFieldName?.lastIndexOf(" ");
            itemFieldName = itemFieldName?.substring(0, lastIndex);
        }
        if (itemFieldName?.length === 0) {
            itemsField =
                this.printerFormat.formatCenter(
                    this.printerFormat.formatBold(productsField)
                ) +
                this.printerFormat.formatCenter(
                    this.printerFormat.formatBold(this.justifyText("", itemDetailsField))
                );
        } else {
            itemsField =
                this.printerFormat.formatCenter(
                    this.printerFormat.formatBold(
                        this.justifyText(itemFieldName, itemDetailsField)
                    )
                ) + this.printerFormat.lineBreak;
        }
        let totalQty: any = 0;
        for (let entry of request?.entries) {
            let productName =
                entry?.transactions[0]?.stock?.name ||
                entry?.transactions[0]?.account?.name;
            let quantity;
            if (defaultTemplate?.sections?.table?.data?.quantity?.display) {
                if (entry?.transactions[0]?.stock?.quantity) {
                    quantity =
                        parseFloat(
                            entry?.transactions[0]?.stock?.quantity
                        ).toFixed(2) + ' ';
                } else {
                    quantity = '-' + ' ';
                }
            } else {
                quantity = '';
            }
            let rate;
            if (defaultTemplate?.sections?.table?.data?.rate?.display) {
                if (entry?.transactions[0]?.stock?.rate?.rateForAccount) {
                    rate =
                        parseFloat(
                            entry?.transactions[0]?.stock?.rate?.rateForAccount
                        ).toFixed(2) + ' ';
                } else {
                    rate = '-' + ' ';
                }
            } else {
                rate = '';
            }
            let amount;
            if (defaultTemplate?.sections?.table?.data?.total?.display) {
                amount =
                    parseFloat(entry?.transactions[0]?.amount?.amountForAccount).toFixed(
                        2
                    ) + " ";
            }
            else {
                amount = "";
            }

            let itemDetails =
                quantity?.padStart(qtyPadding) +
                "" +
                rate?.padStart(ratePadding) +
                "" +
                amount?.padStart(amountPadding);

            let itemLength = this.maxLength - itemDetails?.length;
            let itemName = productName?.substr(0, itemLength);

            if (entry?.transactions[0]?.stock?.quantity) {
                totalQty = totalQty + Number(quantity);
            }

            if (itemName?.length === 0) {
                let productNameShow;
                if (defaultTemplate?.sections?.table?.data?.item?.display) {
                    productNameShow = this.printerFormat.formatCenter(
                        this.printerFormat.formatBold(this.justifyText(productName))
                    )
                } else {
                    productNameShow = "";
                }
                items +=
                    productNameShow +
                    this.printerFormat.formatCenter(
                        this.printerFormat.formatBold(this.justifyText("", itemDetails))
                    );
            } else {
                let itemNameShow;
                if (defaultTemplate?.sections?.table?.data?.item?.display) {
                    itemNameShow = itemName;
                } else {
                    itemNameShow = '';
                }
                const itemNameShowHide = itemNameShow?.length ? this.justifyText(itemNameShow, itemDetails) : this.justifyText(itemDetails);

                items += this.printerFormat.formatCenter(
                    this.printerFormat.formatBold(
                        itemNameShowHide
                    )
                );

                if (itemName?.length < productName?.length) {
                    let lastIndex = productName.length - itemName.length;

                    for (var itemNameIndex = itemName?.length; itemNameIndex < lastIndex; itemNameIndex = itemNameIndex + 11) {
                        items += this.printerFormat.formatCenter(this.printerFormat.leftAlign + productName?.substr(itemNameIndex, 11));
                    }
                }
            }

            if (entry?.taxes && entry?.taxes.length > 0) {
                for (let taxApp of entry?.taxes) {
                    if (entryTaxes[taxApp.accountUniqueName + "_" + taxApp?.taxPercent] === undefined) {
                        entryTaxes[taxApp.accountUniqueName + "_" + taxApp?.taxPercent] = [];
                        entryTaxes[taxApp.accountUniqueName + "_" + taxApp?.taxPercent]['name'] = taxApp?.accountName;
                        entryTaxes[taxApp.accountUniqueName + "_" + taxApp?.taxPercent]['percent'] = taxApp?.taxPercent;
                        entryTaxes[taxApp.accountUniqueName + "_" + taxApp?.taxPercent]['amount'] = taxApp?.amount?.amountForAccount;
                    } else {
                        entryTaxes[taxApp?.accountUniqueName + "_" + taxApp?.taxPercent]['percent'] = taxApp?.taxPercent;
                        entryTaxes[taxApp?.accountUniqueName + "_" + taxApp?.taxPercent]['amount'] = entryTaxes[taxApp?.accountUniqueName + "_" + taxApp?.taxPercent]['amount'] + taxApp?.amount?.amountForAccount;
                    }
                }
            }
        }

        if (!totalQty) {
            totalQty = '-';
        }

        Object.keys(entryTaxes)?.forEach(key => {
            let entryTax = entryTaxes[key];
            if (entryTax?.amount > 0) {
                let taxAmount = parseFloat(
                    entryTax?.amount
                ).toFixed(2);
                if (defaultTemplate?.sections?.footer?.data?.taxBifurcation?.display) {
                    tax += this.printerFormat.formatCenter(
                        this.justifyText(
                            entryTax?.name +
                            entryTax?.percent +
                            "%" +
                            ": " +
                            "" +
                            taxAmount
                        )
                    );
                }
                else {
                    tax = ""
                }
            }
        });

        if (request) {
            let header =
                this.printerFormat.formatCenter(invoiceHeadingField) +
                this.printerFormat.formatCenter(
                    this.printerFormat.formatBold(headerCompanyName)
                ) +
                this.printerFormat.formatCenter(
                    headerCompanyAddress
                ) +
                this.printerFormat.formatCenter(
                    (companyGstNumberField + " ") + companyGstin
                ) +
                this.printerFormat.formatCenter(this.blankDash()) +
                this.printerFormat.formatBold(
                    this.justifyText(accountName, (dateField + " ") + voucherDate)
                ) +
                this.printerFormat.lineBreak +
                this.printerFormat.leftAlign +
                this.justifyText(accountAddress, "") +
                this.printerFormat.lineBreak +
                this.justifyText(
                    (accountGstNumberField + " ") + billingGstinNumber + " ",
                    (numberField + " ") + voucherNumber
                ) + this.printerFormat.lineBreak;

            const productsFieldShowHide = productsField?.length ? this.justifyText(productsField, itemDetailsField) : this.justifyText(itemDetailsField);

            let table =
                this.blankDash() + this.printerFormat.lineBreak +
                this.printerFormat.formatBold(
                    productsFieldShowHide
                ) + this.printerFormat.lineBreak +
                this.printerFormat.formatCenter(this.blankDash()) +
                items +

                this.printerFormat.formatCenter(this.blankDash()) +
                this.justifyText(
                    (noOfItemsField + " ") + totalQty,
                    (discountAmountField + " ") + discount?.padStart(11)
                ) +
                this.justifyText('', (taxAmountField + " ") + '' + taxableAmount?.toFixed(2).padStart(11)) +
                this.printerFormat.lineBreak +
                tax +
                (totalAmountField ? (this.justifyText(
                    "",
                    (totalAmountField + "(" + companyCurrencyCode + ")" + " ") + subTotal?.padStart(11))
                ) : "") +
                this.printerFormat.lineBreak +
                this.printerFormat.lineBreak +
                this.printerFormat.formatCenter(totalWords) +
                this.printerFormat.formatCenter(this.blankDash());

            let footer =
                this.printerFormat.lineBreak +
                // <!-- BEGIN QR DATA -->
                "\x1D" +
                "\x28" +
                "\x6B" +
                "\x04" +
                "\x00" +
                "\x31" +
                "\x41" +
                "\x32" +
                "\x00" +
                "\x1D" +
                "\x28" +
                "\x6B" +
                "\x03" +
                "\x00" +
                "\x31" +
                "\x43" +
                dots +
                "\x1D" +
                "\x28" +
                "\x6B" +
                "\x03" +
                "\x00" +
                "\x31" +
                "\x45" +
                "\x30" +
                "\x1D" +
                "\x28" +
                "\x6B" +
                size1 +
                size0 +
                "\x31" +
                "\x50" +
                "\x30" +
                qr +
                "\x1D" +
                "\x28" +
                "\x6B" +
                "\x03" +
                "\x00" +
                "\x31" +
                "\x51" +
                "\x30" +
                "\x1D" +
                "\x28" +
                "\x6B" +
                "\x03" +
                "\x00" +
                "\x31" +
                "\x52" +
                "\x30" +
                // <!-- END QR DATA -->
                this.printerFormat.lineBreak +
                this.justifyText(thankYouMsgField, footerCompanyName) +
                this.printerFormat.lineBreak + this.printerFormat.lineBreak +
                this.printerFormat.leftAlign + this.justifyText(firmNameField, "");

            qz.security.setCertificatePromise((resolve, reject) => {
                resolve("-----BEGIN CERTIFICATE-----\n" +
                    "MIIECzCCAvOgAwIBAgIGAYzI7gY2MA0GCSqGSIb3DQEBCwUAMIGiMQswCQYDVQQG\n" +
                    "EwJVUzELMAkGA1UECAwCTlkxEjAQBgNVBAcMCUNhbmFzdG90YTEbMBkGA1UECgwS\n" +
                    "UVogSW5kdXN0cmllcywgTExDMRswGQYDVQQLDBJRWiBJbmR1c3RyaWVzLCBMTEMx\n" +
                    "HDAaBgkqhkiG9w0BCQEWDXN1cHBvcnRAcXouaW8xGjAYBgNVBAMMEVFaIFRyYXkg\n" +
                    "RGVtbyBDZXJ0MB4XDTI0MDEwMTA2NDgxMVoXDTQ0MDEwMTA2NDgxMVowgaIxCzAJ\n" +
                    "BgNVBAYTAlVTMQswCQYDVQQIDAJOWTESMBAGA1UEBwwJQ2FuYXN0b3RhMRswGQYD\n" +
                    "VQQKDBJRWiBJbmR1c3RyaWVzLCBMTEMxGzAZBgNVBAsMElFaIEluZHVzdHJpZXMs\n" +
                    "IExMQzEcMBoGCSqGSIb3DQEJARYNc3VwcG9ydEBxei5pbzEaMBgGA1UEAwwRUVog\n" +
                    "VHJheSBEZW1vIENlcnQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDg\n" +
                    "1hu1xltGCrJ9rXTVtyaFWM7ml80M3bZGaaEu6mNjcuEZpE30/nbErigpZxJ7zbvO\n" +
                    "ZyBXbVyNZs7RIJDLfW1J9YY22IjBHqh1gum8sZzzE8JtL/4jiFnp20GwMn8QYouO\n" +
                    "AE+4zwzbIUFzZ8ZVRpMozfEI1l5YrevryU/Q+aEPn237vSpvRfPzhYqg5UpDGq+W\n" +
                    "LXDJ9ng/HShcT71Lez/SgWfSzF6Pp2xSOvUWmGrdOYEEBNwVWKs5LgbgBB8zjcgB\n" +
                    "2VvxeSACxYvaW6oRc/cpX2bAxUWYtxi9TwQkYtaSST5V4lXzCuZ0o4Hm8IXdbtXf\n" +
                    "Smi1HQ8Q7pxNNRNNfq/LAgMBAAGjRTBDMBIGA1UdEwEB/wQIMAYBAf8CAQEwDgYD\n" +
                    "VR0PAQH/BAQDAgEGMB0GA1UdDgQWBBRZejvu15Y6iPGscwNUxCAE2a3NozANBgkq\n" +
                    "hkiG9w0BAQsFAAOCAQEAAv55d6BsMS/wbxcdj7Pmz4bsUvqmGyBaGTIuwoTmPcpI\n" +
                    "8he4XnT7Pywn1LgiFtX3UXeCD9VnxbMJoC6qTKscxkvprIq1LxfsmQSrHN/YkpKf\n" +
                    "+VVZc+0rx6x95NF06XqS0UOLX1LLSQvtN6ZSC3kHJ7TLb8TtR4/5rqtpM4LDtvJn\n" +
                    "H2A6+VPi7OlHLPt8umwhKB4j70qnpDXYXrSVskOlBgV/pyCY76J4g12/P4V8Le7X\n" +
                    "DjTQdepEARmE2xkpfJ2dHH3eBR7a/J79ofr3nj67qL5bxPmQ6fPKMwuSpR99rRst\n" +
                    "T4cbjWzfzAVX6WDT0Nmii1BeksCJCwEoydtwI/BZQQ==\n" +
                    "-----END CERTIFICATE-----\n");
            });

            qz.security.setSignatureAlgorithm("SHA512");
            qz.security.setSignaturePromise(hash => {
                return (resolve, reject) => {
                    var pk = KEYUTIL.getKey("-----BEGIN PRIVATE KEY-----\n" +
                        "MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDg1hu1xltGCrJ9\n" +
                        "rXTVtyaFWM7ml80M3bZGaaEu6mNjcuEZpE30/nbErigpZxJ7zbvOZyBXbVyNZs7R\n" +
                        "IJDLfW1J9YY22IjBHqh1gum8sZzzE8JtL/4jiFnp20GwMn8QYouOAE+4zwzbIUFz\n" +
                        "Z8ZVRpMozfEI1l5YrevryU/Q+aEPn237vSpvRfPzhYqg5UpDGq+WLXDJ9ng/HShc\n" +
                        "T71Lez/SgWfSzF6Pp2xSOvUWmGrdOYEEBNwVWKs5LgbgBB8zjcgB2VvxeSACxYva\n" +
                        "W6oRc/cpX2bAxUWYtxi9TwQkYtaSST5V4lXzCuZ0o4Hm8IXdbtXfSmi1HQ8Q7pxN\n" +
                        "NRNNfq/LAgMBAAECggEAHqJdpS9RKWJ0vnX/WM07JOkcS8P8LtgYqVBkI1HRV/AD\n" +
                        "pqxB6PMw+IxoMXf3R0IZaD6Z4/+lICkVXd4rjGZbGTwoXNm1DGciedxr/4dNxLr4\n" +
                        "/0qOPIYsBhaXRSwkLvXWYPM+6YXgkQzfb5uApQbYLzOcN2GJ+lg8MGS+CNGydb+4\n" +
                        "aIG9XBZ36gshGJ11d8os9Xfx0uZI/tqYLyUJUQCeAE0+ojThvLy7d1uB+T1lICIQ\n" +
                        "35EqbLaFctX93mqS0Ew32RWfwux+ZG5etSH7yOel9vqasBiWYNRGu5e7Gs5tYGVN\n" +
                        "2jCNaxyWMfBtZANhHDkT9L9RrSQ9jN5p+2I7WdDajQKBgQDzhRyF85rqlEDHv+s5\n" +
                        "r6Ozp11U5Nsd0ztz764d3n1EQFCZxjy27bCosV8l4Nk3LeA/gJzkqpwLvihiiw5d\n" +
                        "HunJC1oYnVcAAKUFn69Tn1JpRevIPZQPC2D3ihBkjpcgKWg89urLZV1v/kPrCUgF\n" +
                        "Fem/ELLlxkdRc0F1bOfvghXNdwKBgQDsW+AE6pCW4c/NTq1fbEx9T9/pWx6nNRez\n" +
                        "qGK1r6ZFDVTUUIyeFR0pFd850qunSr5bZco3JtJKyDNkTWDx6yfXMLXabWXRXxCC\n" +
                        "OtNNHgShheq/npPdKhvJVVjzQS2gVvD3hflQy4Q6V7yuuF3NaKJl5T8vNMoq0CYy\n" +
                        "XSnBalv1TQKBgQDaIVH7aspJdaLRSkgZ1Ap+0lv3v0fG339Ryk/c0X7DtBh+peOc\n" +
                        "uCyV7sub0ly/4IgOWdYvveMpYZwrKQQkxZwESfbaNZXImss2zmLuNLhNNCSPqRkG\n" +
                        "oNqq4TDt4gvc8zo74bFPn+yidM/BqP6qD4bhbsPQrlsTynnIBVV8ZLnC4QKBgQDr\n" +
                        "NG5UVhv2mdXRiAbNW5cuaIr4zF1PpWzlsp4wERBTzPVqppGYSoiPNx3Bi9yXiLCv\n" +
                        "gTbe9Tn1gw5pNPtRImKuKOH+8DiPRpvGDMXzCvkux3YYo7SfNOUb0FvJDkZaNcpr\n" +
                        "dx3oAe6epGq2L+/glcxtu9jJoC3CtwobukvwFmhWTQKBgQDgwyDYPLPw6w5NcK21\n" +
                        "IKBHo46zgtFNgmpetbZH8kpn+xrZPtXf988/aqhaxolZZeSBoKecG2Cb9FMhzABA\n" +
                        "cJDmEvqSvPC7rbO+8CqDVFtX3dAcQ0qtp5ODIAefmBypIeuscqqZIJavLetaYeQq\n" +
                        "gcqzoBWrZ4cyzdjG2SKrYSgb+w==\n" +
                        "-----END PRIVATE KEY-----\n"
                    );
                    let sig = new KJUR.crypto.Signature({ "alg": "SHA512withRSA" }); // Use "SHA1withRSA" for QZ Tray 2.0 and older
                    sig.init(pk);
                    sig.updateString(hash);
                    let hex = sig.sign();
                    resolve(stob64(hextorstr(hex)));
                };
            });

            if (!qz.websocket.isActive()) {
                qz.websocket
                    .connect()
                    .then(function () {
                        qz.printers.getDefault().then(function (data) {
                            return qz.printers.find(data); // Pass the printer name into the next Promise
                        });
                    })
                    .then((printer: any) => {
                        if (printer) {
                            this.printNow(printer, header, table, footer);
                        } else {
                            console.warn("No default printer available.");
                        }
                    })
                    .catch(function (e: any) {
                        console.error(e);
                    });
            } else {
                this.printNow("USB Receipt Printer", header, table, footer);
            }
        }
    }

    private printNow(printer: any, header: any, table: any, footer: any): void {
        var config = qz.configs.create(printer, { encoding: 'ISO-8859-1', altPrinting: true }); // Create a default config for the found printer
        let txt = [
            this.printerFormat.initPrinter +
            header +
            table +
            footer +
            this.printerFormat.endPrinter +
            this.printerFormat.fullCut,
        ];
        return qz.print(config, txt);
    }

    /**
     * This will use for justify text formatted in template
     *
     * @param {*} textA
     * @param {*} [b='']
     * @return {*}
     * @memberof ThermalComponent
     */
    public justifyText(textA: any, textB: any = ""): any {
        let lengthOfA = textA?.length;
        let qty = textB + "";
        let lengthOfB = qty?.length;
        let textC = +lengthOfA + lengthOfB;
        let noOfSpacesRequired = this.maxLength - textC;
        let spaces = "";
        for (let i = 0; i <= noOfSpacesRequired; i++) {
            spaces += " ";
        }
        let newTxt = textA + spaces + textB;
        return newTxt;
    }

    /**
     *This will use for blank dash line between content and table in template
     *
     * @return {*}
     * @memberof ThermalComponent
     */
    public blankDash(): string {
        let dash = "";
        for (let i = 0; i <= this.maxLength; i++) {
            dash += "-";
        }
        return dash;
    }

    /**
     *This will use for blank row in template
     *
     * @return {*}
     * @memberof ThermalComponent
     */
    public blankRow(): string {
        let dash = "";
        for (let i = 0; i <= this.maxLength; i++) {
            dash += " ";
        }
        return dash;
    }
}

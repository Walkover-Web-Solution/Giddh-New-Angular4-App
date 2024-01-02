import { Injectable } from '@angular/core';
import { PrinterFormatService } from './printer.format.service';
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
        let accountAddress;
        let accountGstNumberField;
        let billingGstinNumber;
        if (defaultTemplate?.sections?.header?.data?.billingGstin?.display && defaultTemplate?.sections?.header?.data?.billingAddress?.display) {
            accountGstNumberField = defaultTemplate?.sections?.header?.data?.billingGstin?.label;
            accountAddress = request?.account?.billingDetails?.address.join(" ");
            billingGstinNumber = request?.account?.billingDetails?.taxNumber;
            if (request?.account?.billingDetails?.taxNumber) {
                billingGstinNumber = request?.account?.billingDetails?.taxNumber;
                accountGstNumberField = defaultTemplate?.sections?.header?.data?.billingGstin?.label;
            } else {
                billingGstinNumber = '';
                accountGstNumberField = '';
            }
        } else {
            accountGstNumberField = "";
            accountAddress = "";
            billingGstinNumber = "";
        }

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
            if (request?.account?.name) {
                accountName = request?.account?.name;
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
            let remainingName = "";

            if (entry?.transactions[0]?.stock) {
                if (entry?.transactions[0]?.stock?.quantity) {
                    totalQty = totalQty + Number(quantity);
                }
            }

            if (!entry?.transactions[0]?.stock?.quantity) {
                totalQty = '-';
            }

            if (itemName?.length < productName?.length) {
                let lastIndex = itemName?.lastIndexOf(" ");
                itemName = itemName.substr(0, lastIndex);
                remainingName = "" + productName?.substr(lastIndex);
            }
            if (remainingName?.length > 0) {
                remainingName = this.printerFormat.formatCenter(
                    this.justifyText(this.printerFormat.leftAlign + remainingName)
                );
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
                items +=
                    this.printerFormat.formatCenter(
                        this.printerFormat.formatBold(
                            itemNameShowHide
                        )
                    ) +
                    this.printerFormat.leftAlign +
                    remainingName;
            }

            if (entry?.taxes && entry?.taxes.length > 0) {
                for (let taxApp of entry?.taxes) {
                    if (entryTaxes[taxApp.accountUniqueName + "_" + taxApp?.taxPercent] === undefined) {
                        entryTaxes[taxApp.accountUniqueName + "_" + taxApp?.taxPercent] = [];
                        entryTaxes[taxApp.accountUniqueName + "_" + taxApp?.taxPercent]['name'] = taxApp?.accountName;
                        entryTaxes[taxApp.accountUniqueName + "_" + taxApp?.taxPercent]['percent'] = taxApp?.taxPercent;
                        entryTaxes[taxApp.accountUniqueName + "_" + taxApp?.taxPercent]['amount'] = taxApp?.amount?.amountForAccount;
                    } else {
                        entryTaxes[taxApp?.accountUniqueName + "_" + taxApp?.taxPercent]['percent'] = entryTaxes[taxApp?.accountUniqueName + "_" + taxApp?.taxPercent]['percent'] + taxApp?.taxPercent;
                        entryTaxes[taxApp?.accountUniqueName + "_" + taxApp?.taxPercent]['amount'] = entryTaxes[taxApp?.accountUniqueName + "_" + taxApp?.taxPercent]['amount'] + taxApp?.amount?.amountForAccount;
                    }
                }
            }
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
                this.justifyText(
                    "",
                    (totalAmountField + "(" + companyCurrencyCode + ")" + " ") + subTotal?.padStart(11)
                ) +
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

            qz.security.setCertificatePromise(function (resolve, reject) {
                resolve("-----BEGIN CERTIFICATE-----\n" +
                "MIIFAzCCAuugAwIBAgICEAIwDQYJKoZIhvcNAQEFBQAwgZgxCzAJBgNVBAYTAlVT\n" +
                "MQswCQYDVQQIDAJOWTEbMBkGA1UECgwSUVogSW5kdXN0cmllcywgTExDMRswGQYD\n" +
                "VQQLDBJRWiBJbmR1c3RyaWVzLCBMTEMxGTAXBgNVBAMMEHF6aW5kdXN0cmllcy5j\n" +
                "b20xJzAlBgkqhkiG9w0BCQEWGHN1cHBvcnRAcXppbmR1c3RyaWVzLmNvbTAeFw0x\n" +
                "NTAzMTkwMjM4NDVaFw0yNTAzMTkwMjM4NDVaMHMxCzAJBgNVBAYTAkFBMRMwEQYD\n" +
                "VQQIDApTb21lIFN0YXRlMQ0wCwYDVQQKDAREZW1vMQ0wCwYDVQQLDAREZW1vMRIw\n" +
                "EAYDVQQDDAlsb2NhbGhvc3QxHTAbBgkqhkiG9w0BCQEWDnJvb3RAbG9jYWxob3N0\n" +
                "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtFzbBDRTDHHmlSVQLqjY\n" +
                "aoGax7ql3XgRGdhZlNEJPZDs5482ty34J4sI2ZK2yC8YkZ/x+WCSveUgDQIVJ8oK\n" +
                "D4jtAPxqHnfSr9RAbvB1GQoiYLxhfxEp/+zfB9dBKDTRZR2nJm/mMsavY2DnSzLp\n" +
                "t7PJOjt3BdtISRtGMRsWmRHRfy882msBxsYug22odnT1OdaJQ54bWJT5iJnceBV2\n" +
                "1oOqWSg5hU1MupZRxxHbzI61EpTLlxXJQ7YNSwwiDzjaxGrufxc4eZnzGQ1A8h1u\n" +
                "jTaG84S1MWvG7BfcPLW+sya+PkrQWMOCIgXrQnAsUgqQrgxQ8Ocq3G4X9UvBy5VR\n" +
                "CwIDAQABo3sweTAJBgNVHRMEAjAAMCwGCWCGSAGG+EIBDQQfFh1PcGVuU1NMIEdl\n" +
                "bmVyYXRlZCBDZXJ0aWZpY2F0ZTAdBgNVHQ4EFgQUpG420UhvfwAFMr+8vf3pJunQ\n" +
                "gH4wHwYDVR0jBBgwFoAUkKZQt4TUuepf8gWEE3hF6Kl1VFwwDQYJKoZIhvcNAQEF\n" +
                "BQADggIBAFXr6G1g7yYVHg6uGfh1nK2jhpKBAOA+OtZQLNHYlBgoAuRRNWdE9/v4\n" +
                "J/3Jeid2DAyihm2j92qsQJXkyxBgdTLG+ncILlRElXvG7IrOh3tq/TttdzLcMjaR\n" +
                "8w/AkVDLNL0z35shNXih2F9JlbNRGqbVhC7qZl+V1BITfx6mGc4ayke7C9Hm57X0\n" +
                "ak/NerAC/QXNs/bF17b+zsUt2ja5NVS8dDSC4JAkM1dD64Y26leYbPybB+FgOxFu\n" +
                "wou9gFxzwbdGLCGboi0lNLjEysHJBi90KjPUETbzMmoilHNJXw7egIo8yS5eq8RH\n" +
                "i2lS0GsQjYFMvplNVMATDXUPm9MKpCbZ7IlJ5eekhWqvErddcHbzCuUBkDZ7wX/j\n" +
                "unk/3DyXdTsSGuZk3/fLEsc4/YTujpAjVXiA1LCooQJ7SmNOpUa66TPz9O7Ufkng\n" +
                "+CoTSACmnlHdP7U9WLr5TYnmL9eoHwtb0hwENe1oFC5zClJoSX/7DRexSJfB7YBf\n" +
                "vn6JA2xy4C6PqximyCPisErNp85GUcZfo33Np1aywFv9H+a83rSUcV6kpE/jAZio\n" +
                "5qLpgIOisArj1HTM6goDWzKhLiR/AeG3IJvgbpr9Gr7uZmfFyQzUjvkJ9cybZRd+\n" +
                "G8azmpBBotmKsbtbAU/I/LVk8saeXznshOVVpDRYtVnjZeAneso7\n" +
                "-----END CERTIFICATE-----\n" +
                "--START INTERMEDIATE CERT--\n" +
                "-----BEGIN CERTIFICATE-----\n" +
                "MIIFEjCCA/qgAwIBAgICEAAwDQYJKoZIhvcNAQELBQAwgawxCzAJBgNVBAYTAlVT\n" +
                "MQswCQYDVQQIDAJOWTESMBAGA1UEBwwJQ2FuYXN0b3RhMRswGQYDVQQKDBJRWiBJ\n" +
                "bmR1c3RyaWVzLCBMTEMxGzAZBgNVBAsMElFaIEluZHVzdHJpZXMsIExMQzEZMBcG\n" +
                "A1UEAwwQcXppbmR1c3RyaWVzLmNvbTEnMCUGCSqGSIb3DQEJARYYc3VwcG9ydEBx\n" +
                "emluZHVzdHJpZXMuY29tMB4XDTE1MDMwMjAwNTAxOFoXDTM1MDMwMjAwNTAxOFow\n" +
                "gZgxCzAJBgNVBAYTAlVTMQswCQYDVQQIDAJOWTEbMBkGA1UECgwSUVogSW5kdXN0\n" +
                "cmllcywgTExDMRswGQYDVQQLDBJRWiBJbmR1c3RyaWVzLCBMTEMxGTAXBgNVBAMM\n" +
                "EHF6aW5kdXN0cmllcy5jb20xJzAlBgkqhkiG9w0BCQEWGHN1cHBvcnRAcXppbmR1\n" +
                "c3RyaWVzLmNvbTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBANTDgNLU\n" +
                "iohl/rQoZ2bTMHVEk1mA020LYhgfWjO0+GsLlbg5SvWVFWkv4ZgffuVRXLHrwz1H\n" +
                "YpMyo+Zh8ksJF9ssJWCwQGO5ciM6dmoryyB0VZHGY1blewdMuxieXP7Kr6XD3GRM\n" +
                "GAhEwTxjUzI3ksuRunX4IcnRXKYkg5pjs4nLEhXtIZWDLiXPUsyUAEq1U1qdL1AH\n" +
                "EtdK/L3zLATnhPB6ZiM+HzNG4aAPynSA38fpeeZ4R0tINMpFThwNgGUsxYKsP9kh\n" +
                "0gxGl8YHL6ZzC7BC8FXIB/0Wteng0+XLAVto56Pyxt7BdxtNVuVNNXgkCi9tMqVX\n" +
                "xOk3oIvODDt0UoQUZ/umUuoMuOLekYUpZVk4utCqXXlB4mVfS5/zWB6nVxFX8Io1\n" +
                "9FOiDLTwZVtBmzmeikzb6o1QLp9F2TAvlf8+DIGDOo0DpPQUtOUyLPCh5hBaDGFE\n" +
                "ZhE56qPCBiQIc4T2klWX/80C5NZnd/tJNxjyUyk7bjdDzhzT10CGRAsqxAnsjvMD\n" +
                "2KcMf3oXN4PNgyfpbfq2ipxJ1u777Gpbzyf0xoKwH9FYigmqfRH2N2pEdiYawKrX\n" +
                "6pyXzGM4cvQ5X1Yxf2x/+xdTLdVaLnZgwrdqwFYmDejGAldXlYDl3jbBHVM1v+uY\n" +
                "5ItGTjk+3vLrxmvGy5XFVG+8fF/xaVfo5TW5AgMBAAGjUDBOMB0GA1UdDgQWBBSQ\n" +
                "plC3hNS56l/yBYQTeEXoqXVUXDAfBgNVHSMEGDAWgBQDRcZNwPqOqQvagw9BpW0S\n" +
                "BkOpXjAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQAJIO8SiNr9jpLQ\n" +
                "eUsFUmbueoxyI5L+P5eV92ceVOJ2tAlBA13vzF1NWlpSlrMmQcVUE/K4D01qtr0k\n" +
                "gDs6LUHvj2XXLpyEogitbBgipkQpwCTJVfC9bWYBwEotC7Y8mVjjEV7uXAT71GKT\n" +
                "x8XlB9maf+BTZGgyoulA5pTYJ++7s/xX9gzSWCa+eXGcjguBtYYXaAjjAqFGRAvu\n" +
                "pz1yrDWcA6H94HeErJKUXBakS0Jm/V33JDuVXY+aZ8EQi2kV82aZbNdXll/R6iGw\n" +
                "2ur4rDErnHsiphBgZB71C5FD4cdfSONTsYxmPmyUb5T+KLUouxZ9B0Wh28ucc1Lp\n" +
                "rbO7BnjW\n" +
                "-----END CERTIFICATE-----\n");
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

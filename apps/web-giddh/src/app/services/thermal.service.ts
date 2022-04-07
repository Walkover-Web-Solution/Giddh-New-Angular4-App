
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
        this.maxLength = +this.maxLength;
        if (!this.maxLength) {
            this.maxLength = 46;
        }
        console.log('res', request);




        /**
         * This will use for hide/show for QR Code
         */
        let qr;
        let dots;
        let size1;
        let size0;
        let qrLength;
        let itemsQrTaxData = "";
        /** This will use for intialized entry tax */
        let entryTaxesQR = [];

        if (defaultTemplate?.sections?.header?.data?.showQrCode?.display) {

            for (let entry of request.entries) {
                if (entry?.taxes?.length > 0) {
                    for (let taxApp of entry.taxes) {
                        if (entryTaxesQR[taxApp.accountUniqueName] === undefined) {
                            entryTaxesQR[taxApp.accountUniqueName] = [];
                            entryTaxesQR[taxApp.accountUniqueName]['name'] = taxApp.accountName;
                            entryTaxesQR[taxApp.accountUniqueName]['amount'] = taxApp.amount?.amountForAccount;
                        } else {
                            entryTaxesQR[taxApp.accountUniqueName]['amount'] = Number(entryTaxesQR[taxApp.accountUniqueName]['amount']) + Number(taxApp.amount?.amountForAccount);
                        }
                    }
                }
            }

            Object.keys(entryTaxesQR)?.forEach(key => {
                let entryTax = entryTaxesQR[key];
                if (entryTax.amount > 0) {
                    let taxAmount = parseFloat(
                        entryTax.amount
                    ).toFixed(2);

                    itemsQrTaxData += 
                            entryTax.name +
                            " - " +
                            taxAmount + this.printerFormat.lineBreak;
                        }
            });

            // The QR data
            qr = "SELLER DETAILS" + this.printerFormat.lineBreak + "GSTIN - " + request?.company?.billingDetails?.taxNumber + this.printerFormat.lineBreak + this.printerFormat.lineBreak + "INVOICE DETAILS" + this.printerFormat.lineBreak + "Number - " + request?.number + this.printerFormat.lineBreak + "Date - " + request?.date + this.printerFormat.lineBreak + "Amount - " + request?.subTotal?.amountForCompany + this.printerFormat.lineBreak + itemsQrTaxData + this.printerFormat.lineBreak + "Total - " + request?.taxTotal?.amountForCompany + this.printerFormat.lineBreak;
            
            // The dot size of the QR code
            dots = "\x03";

            // Some proprietary size calculation
            qrLength = qr.length + 3;
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

        /** This will use for intialized entry tax */
        let entryTaxes = [];

        /** This will use for intialized items */
        let items = "";

        /** This will use for intialized items field */
        let itemsField = "";

        console.log(defaultTemplate);
        /** This will use for intialized tax */
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
            headerCompanyName = request?.company?.name;
        } else {
            headerCompanyName = "";
        }

        /**
         * This will use for hide/show for company aaddress heading
         */
        let headerCompanyAddress;
        if (defaultTemplate?.sections?.header?.data?.showCompanyAddress?.display) {
            headerCompanyAddress = request.company?.billingDetails?.address[0];
        } else {
            headerCompanyAddress = "";
        }

        /**
         * This will use for hide/show for customer billing address
         */
        let accountAddress
        let accountGstNumberField;
        let biilingGstinNumber;
        if (defaultTemplate?.sections?.header?.data?.billingGstin?.display && defaultTemplate?.sections?.header?.data?.billingAddress?.display) {
            accountGstNumberField = defaultTemplate?.sections?.header?.data?.billingGstin?.label;
            accountAddress = request?.account?.billingDetails?.address.join(" ");
            biilingGstinNumber = request.account?.billingDetails?.taxNumber
        } else {
            accountGstNumberField = "";
            accountAddress = "";
            biilingGstinNumber = "";
        }

        /**
         * This will use for hide/show for company GST number 
         */
        let companyGstNumberField;
        let companyGstin;
        if (defaultTemplate?.sections?.header?.data?.gstin?.display) {
            companyGstNumberField = defaultTemplate?.sections?.header?.data?.gstin?.label;
            companyGstin = request?.company?.taxNumber;
        } else {
            companyGstNumberField = "";
            companyGstin = "";
        }

        /**
         * This will use for hide/show for account name 
         */
        let accountName;
        if (defaultTemplate?.sections?.header?.data?.customerName?.display) {
            accountName = request?.account?.name;
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
            productsField = ""
        }

        /**
         * This will use for hide/show for no of items
         */
        let noOfItemsField;
        let noOfItems;
        if (defaultTemplate?.sections?.table?.data?.totalQuantity?.display) {
            noOfItemsField = defaultTemplate?.sections?.table?.data?.totalQuantity?.label;
            noOfItems = request.entries.length;
        } else {
            noOfItemsField = "";
            noOfItems = "";
        }

        /**
         * This will use for hide/show for total amount and total amount in words
         */
        let subTotal;
        let totalAmountField;
        let totalWords;
        if (defaultTemplate?.sections?.footer?.data?.totalDue?.display && defaultTemplate?.sections?.footer?.data?.totalInWords?.display) {
            totalAmountField = defaultTemplate?.sections?.footer?.data?.totalDue?.label;
            totalWords = request.totalAsWords?.amountForAccount;
            subTotal = parseFloat(request?.subTotal?.amountForAccount).toFixed(2);
        } else {
            totalAmountField = "";
            subTotal = "";
            totalWords = "";
        }

        /**
         * This will use for hide/show for discount total
         */
        let discAmountField;
        let discount: any;
        if (defaultTemplate?.sections?.table?.data?.discount?.display) {
            discAmountField = defaultTemplate?.sections?.table?.data?.discount?.label;
            if (!request?.discountTotal) {
                discount = "0";
            } else {
                discount = parseFloat(request?.discountTotal).toFixed(2);
            }
        } else {
            discAmountField = "";
            discount = "";
        }

        /**
         * This will use for hide/show for tax amount
         */
        let taxAmountField;
        let taxTotal;
        if (defaultTemplate?.sections?.table?.data?.taxableValue?.display) {
            taxTotal = parseFloat(request?.taxTotal?.amountForAccount).toFixed(2);
            taxAmountField = defaultTemplate?.sections?.table?.data?.taxableValue?.label;
        } else {
            taxAmountField = "";
            taxTotal = "";
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

        let itemDetailsField =
            quantityField?.padStart(7) +
            "" +
            rateField?.padStart(16) +
            "" +
            netAmountField?.padStart(13);

        let itemFieldLength = this.maxLength - itemDetailsField.length;

        let itemFieldName = productsField.substring(0, itemFieldLength);

        if (itemFieldName.length < productsField.length) {
            let lastIndex = itemFieldName.lastIndexOf(" ");
            itemFieldName = itemFieldName.substring(0, lastIndex);
        }

        if (itemFieldName.length === 0) {
            itemsField =
                this.printerFormat.formatCenter(
                    this.printerFormat.formatBold(this.justifyText(productsField))
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
        let totalQty = 0;
        for (let entry of request.entries) {

            let productName =
                entry.transactions[0].stock?.name ||
                entry.transactions[0].account?.name;
            let quantity
            if (defaultTemplate?.sections?.table?.data?.quantity?.display) {
                quantity =
                    parseFloat(entry.transactions[0].stock?.quantity || 1).toFixed(2) +
                    " ";
            } else {
                quantity = "";
            }
            let rate;
            if (defaultTemplate?.sections?.table?.data?.rate?.display) {
                rate =
                    parseFloat(
                        entry.transactions[0].stock?.rate?.rateForAccount || 1
                    ).toFixed(2) + " ";
            } else {
                rate = "";
            }
            let amount;
            if (defaultTemplate?.sections?.table?.data?.total?.display) {
                amount =
                    parseFloat(entry.transactions[0].amount?.amountForAccount).toFixed(
                        2
                    ) + " ";
            }
            else {
                amount = "";
            }
            let itemDetails =
                quantity?.padStart(7) +
                "" +
                rate?.padStart(16) +
                "" +
                amount?.padStart(13);
            let itemLength = this.maxLength - itemDetails.length;
            let itemName = productName.substr(0, itemLength);
            let remainingName = "";
            totalQty += +quantity;

            if (itemName.length < productName.length) {
                let lastIndex = itemName.lastIndexOf(" ");
                itemName = itemName.substr(0, lastIndex);
                remainingName = "" + productName.substr(lastIndex);
            }
            if (remainingName.length > 0) {
                remainingName = this.printerFormat.formatCenter(
                    this.justifyText(this.printerFormat.leftAlign + remainingName)
                );
            }

            if (itemName.length === 0) {
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
                    itemNameShow = "";
                }
                items +=
                    this.printerFormat.formatCenter(
                        this.printerFormat.formatBold(
                            this.justifyText(itemNameShow, itemDetails)
                        )
                    ) +
                    this.printerFormat.leftAlign +
                    remainingName;
            }
            if (entry.taxes && entry.taxes.length > 0) {
                for (let taxApp of entry.taxes) {
                    if (entryTaxes[taxApp.accountUniqueName + "_" + taxApp.taxPercent] === undefined) {
                        entryTaxes[taxApp.accountUniqueName + "_" + taxApp.taxPercent] = [];
                        entryTaxes[taxApp.accountUniqueName + "_" + taxApp.taxPercent]['name'] = taxApp.accountName;
                        entryTaxes[taxApp.accountUniqueName + "_" + taxApp.taxPercent]['percent'] = taxApp.taxPercent;
                        entryTaxes[taxApp.accountUniqueName + "_" + taxApp.taxPercent]['amount'] = taxApp.amount?.amountForAccount;
                    } else {
                        entryTaxes[taxApp.accountUniqueName + "_" + taxApp.taxPercent]['percent'] = entryTaxes[taxApp.accountUniqueName + "_" + taxApp.taxPercent]['percent'] + taxApp.taxPercent;
                        entryTaxes[taxApp.accountUniqueName + "_" + taxApp.taxPercent]['amount'] = entryTaxes[taxApp.accountUniqueName + "_" + taxApp.taxPercent]['amount'] + taxApp.amount?.amountForAccount;
                    }
                }
            }
        }

        Object.keys(entryTaxes)?.forEach(key => {
            let entryTax = entryTaxes[key];
            if (entryTax.amount > 0) {
                let taxAmount = parseFloat(
                    entryTax.amount
                ).toFixed(2);
                if (defaultTemplate?.sections?.footer?.data?.taxBifurcation?.display) {
                    tax += this.printerFormat.formatCenter(
                        this.justifyText(
                            entryTax.name +
                            entryTax.percent +
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
                    (accountGstNumberField + " ") + biilingGstinNumber,
                    (numberField + " ") + voucherNumber
                ) + this.printerFormat.lineBreak;
            let table =
                this.blankDash() + this.printerFormat.lineBreak +
                this.printerFormat.formatBold(
                    this.justifyText(productsField, itemDetailsField)
                ) + this.printerFormat.lineBreak +
                this.printerFormat.formatCenter(this.blankDash()) +
                items +

                this.printerFormat.formatCenter(this.blankDash()) +
                this.justifyText(
                    (noOfItemsField + " ") + noOfItems,
                    (discAmountField + " ") + discount?.padStart(11)
                ) +
                this.justifyText('', (taxAmountField + " ") + '' + taxTotal?.padStart(11)) +
                this.printerFormat.lineBreak +
                tax +
                this.justifyText(
                    "",
                    (totalAmountField + " ") + "" + subTotal?.padStart(11)
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
                this.justifyText(firmNameField, "");
            qz.websocket
                .connect()
                .then(function () {
                    return qz.printers.find("Rugtek"); // Pass the printer name into the next Promise
                })
                .then((printer: any) => {


                    var config = qz.configs.create(printer, { encoding: 'ISO-8859-1', altPrinting: true }); // Create a default config for the found printer
                    let txt = [
                        this.printerFormat.initPrinter +
                        header +
                        table +
                        footer +
                        this.printerFormat.endPrinter +
                        this.printerFormat.fullCut,
                    ];
                    // var txt = [{
                    //     type: 'pixel',
                    //     format: 'pdf',
                    //     flavor: 'file',
                    //     data: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf'
                    // }];
                    return qz.print(config, txt);
                })
                .catch(function (e: any) {
                    console.error(e);
                });
        }

    }




    /**
     * This will use for justify text formatted in template
     *
     * @param {*} a
     * @param {*} [b='']
     * @return {*}
     * @memberof ThermalComponent
     */
    public justifyText(a: any, b: any = "") {
        let lengthOfA = a?.length;
        let qty = b + "";
        let lengthOfB = qty?.length;
        let z = +lengthOfA + lengthOfB;
        let noOfSpacesRequired = this.maxLength - z;
        let spaces = "";
        for (let i = 0; i <= noOfSpacesRequired; i++) {
            spaces += " ";
        }
        let newTxt = a + spaces + b;
        return newTxt;
    }

    /**
     *This will use for blank dash line between content and table in template
     *
     * @return {*}
     * @memberof ThermalComponent
     */
    public blankDash() {
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
    public blankRow() {
        let dash = "";
        for (let i = 0; i <= this.maxLength; i++) {
            dash += " ";
        }
        return dash;
    }
}

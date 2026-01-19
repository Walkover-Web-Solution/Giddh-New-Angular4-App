import { Injectable } from '@angular/core';
import { PrinterFormatService } from './printer.format.service';
import { KJUR, KEYUTIL, stob64, hextorstr } from 'jsrsasign';
import * as qz from "qz-tray";
import { QZ_CERTIFICATE, QZ_FILES, QZ_PEM, SUPPORTED_OPERATING_SYSTEMS } from '../app.constant';
import { ToasterService } from './toaster.service';
import { AppState } from '../store';
import { Store } from '@ngrx/store';
import { CommonActions } from '../actions/common.actions';
import { GeneralService } from './general.service';
import { find, forEach, includes, isArray, keys } from '../lodash-optimized';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * ThermalService service
 * Provides thermal related business logic and data operations
 */
export class ThermalService {

    /** This will use for max length for character according to paper */
    private maxLength: number = 46;

    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private printerFormat: PrinterFormatService,
        private toaster: ToasterService,
        private store: Store<AppState>,
        private commonAction: CommonActions,
        private generalService: GeneralService
    ) {

    }
    /**
    * This will use for pos commands formatted
    *
    * @memberof ThermalComponent
    */
    public print(defaultTemplate: any, request: any): void {
        this.maxLength = 46;

        // Generate QR code data if enabled
        const qrData = this.generateQRCodeData(defaultTemplate, request);

        // Extract template field configurations
        const templateFields = this.extractTemplateFields(defaultTemplate, request);

        // Process items and calculate totals
        const itemsData = this.processItemsAndTaxes(defaultTemplate, request);

        /**
         * Handles if functionality
         */
        if (request) {
            // Build print sections
            const header = this.buildPrintHeader(templateFields);
            const table = this.buildPrintTable(templateFields, itemsData);
            const footer = this.buildPrintFooter(qrData, templateFields);

            // Setup QZ Tray and execute print
            this.setupQZTrayAndExecutePrint(header, table, footer);
        }
    }

    /**
     * Handles findAndPrint functionality
     */
    private findAndPrint(header: any, table: any, footer: any): void {
        qz.printers.find().then((data) => {
            /**
             * Handles if functionality
             */
            if (data?.length) {
                /**
                 * Handles if functionality
                 */
                if (localStorage.getItem("defaultPrinter") && data.includes(localStorage.getItem("defaultPrinter"))) {
                    this.printNow(localStorage.getItem("defaultPrinter"), header, table, footer);
                } else {
                    /**
                     * Handles if functionality
                     */
                    if (data?.length > 1) {
                        this.store.dispatch(this.commonAction.selectPrinter(data));
                    } else {
                        this.printNow(data[0], header, table, footer);
                    }
                }
            } else {
                this.toaster.warningToast("No printer available. Please connect your printer.");
            }
        }).catch((e) => { console.error(e); });
    }

    /**
     * Handles printNow functionality
     */
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
        qz.print(config, txt);
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
        /**
         * Handles for functionality
         */
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
        /**
         * Handles for functionality
         */
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
        /**
         * Handles for functionality
         */
        for (let i = 0; i <= this.maxLength; i++) {
            dash += " ";
        }
        return dash;
    }

    /**
     * Trim String based on desired String Length and return array of trimed string
     *
     * @private
     * @param {string} productName
     * @param {string} vaiant
     * @param {number} desiredStringLength
     * @returns {*}
     * @memberof ThermalService
     */
    private wrapStringByLength(productNameWithVariant: string, desiredStringLength: number): any {
        let trimmedStringArray: any = [];

        /**
         * Handles if functionality
         */
        if (productNameWithVariant?.length > desiredStringLength) {
            let remainingString = productNameWithVariant;

            /**
             * Handles while functionality
             */
            while (remainingString?.length !== 0) {

                let cutString = remainingString.substr(0, desiredStringLength);
                remainingString = remainingString.substr(cutString.length);

                trimmedStringArray.push(cutString);

            }

            return trimmedStringArray;
        }
        return productNameWithVariant;
    }

    /**
     * Generate QR code data if QR display is enabled
     */
    private generateQRCodeData(defaultTemplate: any, request: any): any {
        /**
         * Handles if functionality
         */
        if (!defaultTemplate?.sections?.header?.data?.showQrCode?.display) {
            return { qr: "", dots: 0, size1: 0, size0: 0, qrLength: 0 };
        }

        let itemsQrTaxData = "";
        let entryTaxesQR = [];

        // Process entry taxes for QR code
        /**
         * Handles for functionality
         */
        for (let entry of request.entries) {
            /**
             * Handles if functionality
             */
            if (entry?.taxes?.length > 0) {
                /**
                 * Handles for functionality
                 */
                for (let taxApp of entry.taxes) {
                    /**
                     * Handles if functionality
                     */
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

        // Build tax data string for QR
        Object.keys(entryTaxesQR)?.forEach(key => {
            let entryTax = entryTaxesQR[key];
            /**
             * Handles if functionality
             */
            if (entryTax?.amount > 0) {
                let taxAmount = parseFloat(entryTax?.amount).toFixed(2);
                itemsQrTaxData += entryTax?.name + " - " + taxAmount;
            }
        });

        // Build complete QR data string
        const qr = "SELLER DETAILS" + this.printerFormat.lineBreak + "GSTIN - " + request?.company?.billingDetails?.taxNumber + this.printerFormat.lineBreak + this.printerFormat.lineBreak + "INVOICE DETAILS" + this.printerFormat.lineBreak + "Number - " + request?.number + this.printerFormat.lineBreak + "Date - " + request?.date + this.printerFormat.lineBreak + "Amount - " + (request?.grandTotal?.amountForCompany ? request?.grandTotal?.amountForCompany : 0) + this.printerFormat.lineBreak + itemsQrTaxData + this.printerFormat.lineBreak + "Total Tax - " + (request?.taxTotal?.amountForAccount ? request?.taxTotal?.amountForAccount : 0) + this.printerFormat.lineBreak;

        // QR code formatting parameters
        const dots = "\x03";
        const qrLength = qr?.length + 3;
        const size1 = String.fromCharCode(qrLength % 500);
        const size0 = String.fromCharCode(Math.floor(qrLength / 500));

        return { qr, dots, size1, size0, qrLength };
    }

    /**
     * Extract template field configurations
     */
    private extractTemplateFields(defaultTemplate: any, request: any): any {
        return {
            thankYouMsgField: defaultTemplate?.sections?.footer?.data?.thanks?.display ? defaultTemplate?.sections?.footer?.data?.thanks?.label : "",
            firmNameField: defaultTemplate?.sections?.footer?.data?.message1?.display ? defaultTemplate?.sections?.footer?.data?.message1?.label : "",
            invoiceHeadingField: defaultTemplate?.sections?.header?.data?.formNameTaxInvoice?.display ? defaultTemplate?.sections?.header?.data?.formNameTaxInvoice?.label : "",
            headerCompanyName: this.getHeaderCompanyName(defaultTemplate, request),
            headerCompanyAddress: this.getHeaderCompanyAddress(defaultTemplate, request),
            companyGstInfo: this.getCompanyGstInfo(defaultTemplate, request),
            accountName: this.getAccountName(defaultTemplate, request),
            dateAndNumberFields: this.getDateAndNumberFields(defaultTemplate, request),
            productsField: defaultTemplate?.sections?.table?.data?.item?.display ? defaultTemplate?.sections?.table?.data?.item?.label : "",
            noOfItemsField: defaultTemplate?.sections?.table?.data?.totalQuantity?.display ? defaultTemplate?.sections?.table?.data?.totalQuantity?.label : "",
            totalAmountInfo: this.getTotalAmountInfo(defaultTemplate, request),
            discountInfo: this.getDiscountInfo(defaultTemplate, request),
            taxAmountField: this.getTaxAmountField(defaultTemplate, request),
            quantityField: defaultTemplate?.sections?.table?.data?.quantity?.display ? defaultTemplate?.sections?.table?.data?.quantity?.label : "",
            rateField: defaultTemplate?.sections?.table?.data?.rate?.display ? defaultTemplate?.sections?.table?.data?.rate?.label : "",
            netAmountField: defaultTemplate?.sections?.table?.data?.total?.display ? defaultTemplate?.sections?.table?.data?.total?.label : "",
            footerCompanyName: defaultTemplate?.sections?.footer?.data?.companyName?.display ? request?.company?.name : "",
            paddingInfo: this.calculatePadding(defaultTemplate)
        };
    }

    /**
     * Get header company name
     */
    private getHeaderCompanyName(defaultTemplate: any, request: any): string {
        /**
         * Handles if functionality
         */
        if (defaultTemplate?.sections?.header?.data?.companyName?.display) {
            return request?.company?.name ? request?.company?.name : '';
        }
        return "";
    }

    /**
     * Get header company address
     */
    private getHeaderCompanyAddress(defaultTemplate: any, request: any): string {
        /**
         * Handles if functionality
         */
        if (defaultTemplate?.sections?.header?.data?.showCompanyAddress?.display) {
            return request?.company?.billingDetails?.address[0] ? request?.company?.billingDetails?.address[0] : '';
        }
        return '';
    }

    /**
     * Get company GST information
     */
    private getCompanyGstInfo(defaultTemplate: any, request: any): any {
        /**
         * Handles if functionality
         */
        if (defaultTemplate?.sections?.header?.data?.gstin?.display) {
            const companyGstNumberField = defaultTemplate?.sections?.header?.data?.gstin?.label;
            const companyGstin = request?.company?.billingDetails?.taxNumber ? request?.company?.billingDetails?.taxNumber : '';
            return { companyGstNumberField, companyGstin };
        }
        return { companyGstNumberField: '', companyGstin: '' };
    }

    /**
     * Get account name with truncation
     */
    private getAccountName(defaultTemplate: any, request: any): string {
        /**
         * Handles if functionality
         */
        if (defaultTemplate?.sections?.header?.data?.customerName?.display) {
            /**
             * Handles if functionality
             */
            if (request?.account?.customerName) {
                let accountName = request?.account?.customerName;
                /**
                 * Handles if functionality
                 */
                if (accountName.length > 15) {
                    const firstPart: string = accountName.substring(0, 15);
                    const dots: string = '.'.repeat(Math.min(5, accountName.length - 15));
                    accountName = `${firstPart}${dots}`;
                }
                return accountName;
            }
        }
        return "";
    }

    /**
     * Get date and number fields
     */
    private getDateAndNumberFields(defaultTemplate: any, request: any): any {
        let dateField = "";
        let numberField = "";
        let voucherNumber = "";
        let voucherDate = "";

        /**
         * Handles if functionality
         */
        if (!(defaultTemplate?.type === "sales")) {
            /**
             * Handles if functionality
             */
            if (defaultTemplate?.sections?.header?.data?.invoiceDate?.display) {
                dateField = defaultTemplate?.sections?.header?.data?.invoiceDate?.label;
                voucherDate = request?.date;
            }
            /**
             * Handles if functionality
             */
            if (defaultTemplate?.sections?.header?.data?.invoiceNumber?.display) {
                numberField = defaultTemplate?.sections?.header?.data?.invoiceNumber?.label;
                voucherNumber = request?.number;
            }
        } else {
            /**
             * Handles if functionality
             */
            if (defaultTemplate?.sections?.header?.data?.voucherDate?.display) {
                dateField = defaultTemplate?.sections?.header?.data?.voucherDate?.label;
                voucherDate = request?.date;
            }
            /**
             * Handles if functionality
             */
            if (defaultTemplate?.sections?.header?.data?.voucherNumber?.display) {
                numberField = defaultTemplate?.sections?.header?.data?.voucherNumber?.label;
                voucherNumber = request?.number;
            }
        }

        return { dateField, numberField, voucherNumber, voucherDate };
    }

    /**
     * Get total amount information
     */
    private getTotalAmountInfo(defaultTemplate: any, request: any): any {
        /**
         * Handles if functionality
         */
        if (defaultTemplate?.sections?.footer?.data?.grandTotal?.display && defaultTemplate?.sections?.footer?.data?.totalInWords?.display) {
            return {
                totalAmountField: 'Invoice Total',
                totalWords: request.totalAsWords?.amountForAccount,
                subTotal: parseFloat(request?.grandTotal?.amountForAccount).toFixed(2),
                companyCurrencyCode: request?.company?.currency?.code
            };
        }
        return { totalAmountField: "", subTotal: "", totalWords: "", companyCurrencyCode: "" };
    }

    /**
     * Get discount information
     */
    private getDiscountInfo(defaultTemplate: any, request: any): any {
        /**
         * Handles if functionality
         */
        if (defaultTemplate?.sections?.table?.data?.discount?.display) {
            return {
                discountAmountField: defaultTemplate?.sections?.table?.data?.discount?.label,
                discount: request?.discountTotal ? parseFloat(request?.discountTotal?.amountForCompany).toFixed(2) : "0"
            };
        }
        return { discountAmountField: "", discount: "" };
    }

    /**
     * Get tax amount field
     */
    private getTaxAmountField(defaultTemplate: any, request: any): any {
        let taxAmountField = "";
        let taxableAmount = 0;

        /**
         * Handles if functionality
         */
        if (defaultTemplate?.sections?.table?.data?.taxableValue?.display) {
            /**
             * Handles for functionality
             */
            for (let entry of request.entries) {
                /**
                 * Handles for functionality
                 */
                for (let transaction of entry.transactions) {
                    /**
                     * Handles if functionality
                     */
                    if (transaction?.taxableValue?.amountForAccount) {
                        taxableAmount = taxableAmount + transaction?.taxableValue?.amountForAccount;
                    }
                }
            }
            taxAmountField = defaultTemplate?.sections?.table?.data?.taxableValue?.label;
        }

        return { taxAmountField, taxableAmount };
    }

    /**
     * Calculate padding for different fields
     */
    private calculatePadding(defaultTemplate: any): any {
        let qtyPadding = 7;
        let ratePadding = 16;
        let amountPadding = 13;

        /**
         * Handles if functionality
         */
        if (!defaultTemplate?.sections?.table?.data?.quantity?.display) {
            qtyPadding = 0;
            ratePadding = 16;
            amountPadding = 13;
        }
        /**
         * Handles if functionality
         */
        if (!defaultTemplate?.sections?.table?.data?.rate?.display) {
            qtyPadding = 7;
            ratePadding = 0;
            amountPadding = 16;
        }
        /**
         * Handles if functionality
         */
        if (!defaultTemplate?.sections?.table?.data?.amount?.display) {
            qtyPadding = 7;
            ratePadding = 16;
            amountPadding = 0;
        }
        /**
         * Handles if functionality
         */
        if (!defaultTemplate?.sections?.table?.data?.item?.display) {
            qtyPadding = 2;
            ratePadding = 22;
            amountPadding = 22;
        }

        return { qtyPadding, ratePadding, amountPadding };
    }

    /**
     * Process items and calculate taxes
     */
    private processItemsAndTaxes(defaultTemplate: any, request: any): any {
        const templateFields = this.extractTemplateFields(defaultTemplate, request);
        let entryTaxes = [];
        let items = "";
        let tax = "";
        let totalQty: any = 0;

        // Build item details field
        const itemDetailsField = templateFields.quantityField?.padStart(templateFields.paddingInfo.qtyPadding) + "" +
                                templateFields.rateField?.padStart(templateFields.paddingInfo.ratePadding) + "" +
                                templateFields.netAmountField?.padStart(templateFields.paddingInfo.amountPadding);

        const itemFieldLength = this.maxLength - itemDetailsField?.length;
        let itemFieldName = templateFields.productsField?.substring(0, itemFieldLength);

        /**
         * Handles if functionality
         */
        if (itemFieldName?.length < templateFields.productsField?.length) {
            let lastIndex = itemFieldName?.lastIndexOf(" ");
            itemFieldName = itemFieldName?.substring(0, lastIndex);
        }

        let itemsField = "";
        /**
         * Handles if functionality
         */
        if (itemFieldName?.length === 0) {
            itemsField = this.printerFormat.formatCenter(templateFields.productsField) +
                        this.printerFormat.formatCenter(this.justifyText("", itemDetailsField));
        } else {
            itemsField = this.printerFormat.formatCenter(this.justifyText(itemFieldName, itemDetailsField)) + this.printerFormat.lineBreak;
        }

        // Process each entry
        /**
         * Handles for functionality
         */
        for (let entry of request?.entries) {
            const itemData = this.processIndividualItem(entry, defaultTemplate, templateFields.paddingInfo);
            items += itemData.itemString;
            totalQty += itemData.quantity;

            // Process taxes for this entry
            this.processTaxesForEntry(entry, entryTaxes);
        }

        // Build tax string
        tax = this.buildTaxString(entryTaxes, defaultTemplate);

        /**
         * Handles if functionality
         */
        if (!totalQty) {
            totalQty = '-';
        }

        return { items, itemsField, tax, totalQty, entryTaxes };
    }

    /**
     * Process individual item
     */
    private processIndividualItem(entry: any, defaultTemplate: any, paddingInfo: any): any {
        let variant = entry?.transactions[0]?.stock?.variant?.name;
        let productName = entry?.transactions[0]?.stock?.name && variant
            ? `${entry?.transactions[0]?.stock?.name} - ${variant}`
            : entry?.transactions[0]?.stock?.name ? entry?.transactions[0]?.stock?.name : entry?.transactions[0]?.account?.name;

        let quantity = "";
        /**
         * Handles if functionality
         */
        if (defaultTemplate?.sections?.table?.data?.quantity?.display) {
            /**
             * Handles if functionality
             */
            if (entry?.transactions[0]?.stock?.quantity) {
                quantity = parseFloat(entry?.transactions[0]?.stock?.quantity).toFixed(2) + ' ';
            } else {
                quantity = '-' + ' ';
            }
        }

        let rate = "";
        /**
         * Handles if functionality
         */
        if (defaultTemplate?.sections?.table?.data?.rate?.display) {
            /**
             * Handles if functionality
             */
            if (entry?.transactions[0]?.stock?.rate?.rateForAccount) {
                rate = parseFloat(entry?.transactions[0]?.stock?.rate?.rateForAccount).toFixed(2) + ' ';
            } else {
                rate = '-' + ' ';
            }
        }

        let amount = "";
        /**
         * Handles if functionality
         */
        if (defaultTemplate?.sections?.table?.data?.total?.display) {
            amount = parseFloat(entry?.transactions[0]?.amount?.amountForAccount).toFixed(2) + " ";
        }

        let itemDetails = quantity?.padStart(paddingInfo.qtyPadding) + "" +
                         rate?.padStart(paddingInfo.ratePadding) + "" +
                         amount?.padStart(paddingInfo.amountPadding);

        let itemLength = this.maxLength - itemDetails?.length;
        let completeProductName = this.wrapStringByLength(productName, itemLength);
        let itemName = Array.isArray(completeProductName) ? completeProductName[0] : completeProductName;

        let quantityNum = 0;
        /**
         * Handles if functionality
         */
        if (entry?.transactions[0]?.stock?.quantity) {
            quantityNum = Number(quantity);
        }

        let itemString = "";
        /**
         * Handles if functionality
         */
        if (itemName?.length === 0) {
            let productNameShow = "";
            /**
             * Handles if functionality
             */
            if (defaultTemplate?.sections?.table?.data?.item?.display) {
                productNameShow = this.printerFormat.formatCenter(this.justifyText(productName));
            }
            itemString = productNameShow + this.printerFormat.formatCenter(this.justifyText("", itemDetails));
        } else {
            let itemNameShow = "";
            /**
             * Handles if functionality
             */
            if (defaultTemplate?.sections?.table?.data?.item?.display) {
                itemNameShow = itemName;
            }

            const itemNameShowHide = itemNameShow?.length ? this.justifyText(itemNameShow, itemDetails) : this.justifyText(itemDetails);
            itemString = this.printerFormat.formatCenter(itemNameShowHide);

            /**
             * Handles if functionality
             */
            if ((itemName?.length < productName?.length) && Array.isArray(completeProductName)) {
                /**
                 * Handles for functionality
                 */
                for (let i = 1; i < completeProductName?.length; i++) {
                    itemString += (this.printerFormat.leftAlign + completeProductName[i] + this.printerFormat.lineBreak);
                }
            }
        }

        return { itemString, quantity: quantityNum };
    }

    /**
     * Process taxes for entry
     */
    private processTaxesForEntry(entry: any, entryTaxes: any[]): void {
        /**
         * Handles for functionality
         */
        for (let transaction of entry?.transactions) {
            /**
             * Handles if functionality
             */
            if (entry?.taxes && entry?.taxes.length > 0) {
                /**
                 * Handles for functionality
                 */
                for (let taxApp of entry?.taxes) {
                    const taxKey = taxApp.accountUniqueName + "_" + taxApp?.taxPercent;
                    /**
                     * Handles if functionality
                     */
                    if (entryTaxes[taxKey] === undefined) {
                        entryTaxes[taxKey] = [];
                        entryTaxes[taxKey]['name'] = taxApp?.accountName;
                        entryTaxes[taxKey]['percent'] = taxApp?.taxPercent;
                        entryTaxes[taxKey]['amount'] = taxApp?.amount?.amountForAccount;
                        entryTaxes[taxKey]['taxableValue'] = transaction?.taxableValue?.amountForAccount;
                    } else {
                        entryTaxes[taxKey]['percent'] = taxApp?.taxPercent;
                        entryTaxes[taxKey]['amount'] = entryTaxes[taxKey]['amount'] + taxApp?.amount?.amountForAccount;
                        entryTaxes[taxKey]['taxableValue'] = entryTaxes[taxKey]['taxableValue'] + transaction?.taxableValue?.amountForAccount;
                    }
                }
            }
        }
    }

    /**
     * Build tax string
     */
    private buildTaxString(entryTaxes: any[], defaultTemplate: any): string {
        let tax = "";
        Object.keys(entryTaxes)?.forEach(key => {
            let entryTax = entryTaxes[key];
            /**
             * Handles if functionality
             */
            if (entryTax?.amount > 0) {
                let taxAmount = parseFloat(entryTax?.amount).toFixed(2);
                let taxableValue = parseFloat(entryTax?.taxableValue).toFixed(2);
                /**
                 * Handles if functionality
                 */
                if (defaultTemplate?.sections?.footer?.data?.taxBifurcation?.display) {
                    let taxLine = entryTax?.name + entryTax?.percent + "%" + ": " + taxableValue + " " + taxAmount;
                    const paddingSpaces = this.maxLength - taxLine.length;
                    let alignedTaxLine = ' '.repeat(paddingSpaces) + taxLine;
                    tax += alignedTaxLine + this.printerFormat.lineBreak;
                }
            }
        });
        return tax;
    }

    /**
     * Build print header
     */
    private buildPrintHeader(templateFields: any): string {
        const gstInfo = templateFields.companyGstInfo;
        const dateFields = templateFields.dateAndNumberFields;

        return this.printerFormat.formatCenter(templateFields.invoiceHeadingField) +
               this.printerFormat.formatCenter(this.printerFormat.formatBold(templateFields.headerCompanyName)) +
               this.printerFormat.formatCenter(templateFields.headerCompanyAddress) +
               this.printerFormat.formatCenter((gstInfo.companyGstNumberField && gstInfo.companyGstin) ? (gstInfo.companyGstNumberField + " ") + gstInfo.companyGstin : '') +
               this.printerFormat.formatCenter(this.blankDash()) +
               this.printerFormat.formatBold(this.justifyText(templateFields.accountName, (dateFields.dateField + " ") + dateFields.voucherDate)) +
               this.printerFormat.lineBreak +
               this.printerFormat.leftAlign +
               this.justifyText("", "") +
               this.printerFormat.lineBreak +
               this.justifyText("", (dateFields.numberField + " ") + dateFields.voucherNumber) + this.printerFormat.lineBreak;
    }

    /**
     * Build print table
     */
    private buildPrintTable(templateFields: any, itemsData: any): string {
        const taxInfo = templateFields.taxAmountField;
        const discountInfo = templateFields.discountInfo;
        const totalInfo = templateFields.totalAmountInfo;

        const productsFieldShowHide = templateFields.productsField?.length ? this.justifyText(templateFields.productsField, itemsData.itemsField) : this.justifyText(itemsData.itemsField);

        return this.blankDash() + this.printerFormat.lineBreak +
               productsFieldShowHide + this.printerFormat.lineBreak +
               this.printerFormat.formatCenter(this.blankDash()) +
               itemsData.items +
               this.printerFormat.formatCenter(this.blankDash()) +
               this.justifyText(((templateFields.noOfItemsField ? templateFields.noOfItemsField : '') + " ") + (templateFields.noOfItemsField ? itemsData.totalQty : ''),
                              (discountInfo.discountAmountField + " ") + discountInfo.discount?.padStart(11)) +
               this.justifyText('', (taxInfo.taxAmountField) + '' + taxInfo.taxableAmount?.toFixed(2).padStart(11)) +
               this.printerFormat.lineBreak +
               itemsData.tax +
               (totalInfo.totalAmountField ? (this.justifyText("", (totalInfo.totalAmountField + "(" + totalInfo.companyCurrencyCode + ")") + totalInfo.subTotal?.padStart(11))) : "") +
               this.printerFormat.lineBreak +
               this.printerFormat.lineBreak +
               this.printerFormat.formatCenter(totalInfo.totalWords) +
               this.printerFormat.formatCenter(this.blankDash());
    }

    /**
     * Build print footer with QR code
     */
    private buildPrintFooter(qrData: any, templateFields: any): string {
        return this.printerFormat.lineBreak +
               // QR DATA
               "\x1D" + "\x28" + "\x6B" + "\x04" + "\x00" + "\x31" + "\x41" + "\x32" + "\x00" +
               "\x1D" + "\x28" + "\x6B" + "\x03" + "\x00" + "\x31" + "\x43" + qrData.dots +
               "\x1D" + "\x28" + "\x6B" + "\x03" + "\x00" + "\x31" + "\x45" + "\x30" +
               "\x1D" + "\x28" + "\x6B" + qrData.size1 + qrData.size0 + "\x31" + "\x50" + "\x30" + qrData.qr +
               "\x1D" + "\x28" + "\x6B" + "\x03" + "\x00" + "\x31" + "\x51" + "\x30" +
               "\x1D" + "\x28" + "\x6B" + "\x03" + "\x00" + "\x31" + "\x52" + "\x30" +
               // END QR DATA
               this.printerFormat.lineBreak +
               this.justifyText(templateFields.thankYouMsgField, templateFields.footerCompanyName) +
               this.printerFormat.lineBreak + this.printerFormat.lineBreak +
               this.printerFormat.leftAlign + this.justifyText(templateFields.firmNameField, "");
    }

    /**
     * Setup QZ Tray and execute print
     */
    private setupQZTrayAndExecutePrint(header: string, table: string, footer: string): void {
        qz.security.setCertificatePromise((resolve, reject) => {
            /**
             * Handles fetch functionality
             */
            fetch(QZ_CERTIFICATE, { cache: 'no-store', headers: { 'Content-Type': 'text/plain' } })
                .then(data => resolve(data.text()));
        });

        qz.security.setSignatureAlgorithm("SHA512");
        qz.security.setSignaturePromise(hash => {
            /**
             * Handles return functionality
             */
            return (resolve, reject) => {
                /**
                 * Handles fetch functionality
                 */
                fetch(QZ_PEM, { cache: 'no-store', headers: { 'Content-Type': 'text/plain' } })
                    .then(wrapped => wrapped.text())
                    .then(data => {
                        let pk = KEYUTIL.getKey(data);
                        let sig = new KJUR.crypto.Signature({ "alg": "SHA512withRSA" });
                        sig.init(pk);
                        sig.updateString(hash);
                        let hex = sig.sign();
                        /**
                         * Handles resolve functionality
                         */
                        resolve(stob64(hextorstr(hex)));
                    })
                    .catch(err => console.error(err));
            };
        });

        /**
         * Handles if functionality
         */
        if (!qz.websocket.isActive()) {
            qz.websocket
                .connect()
                .then(() => {
                    this.findAndPrint(header, table, footer);
                })
                .catch((e: any) => {
                    const operatingSystem = this.generalService.getOperatingSystem();
                    let qzFile = "";

                    /**
                     * Handles if functionality
                     */
                    if (operatingSystem === SUPPORTED_OPERATING_SYSTEMS.MacOS) {
                        qzFile = QZ_FILES.MacOS;
                    } else if (operatingSystem === SUPPORTED_OPERATING_SYSTEMS.Windows) {
                        qzFile = QZ_FILES.Windows;
                    }

                    /**
                     * Handles if functionality
                     */
                    if (qzFile) {
                        qzFile = " Click here to <a href='" + qzFile + "' class='underline'>download</a>";
                    }

                    this.toaster.warningToastWithTime(10000, "Please start QZ Tray application." + qzFile);
                });
        } else {
            this.findAndPrint(header, table, footer);
        }
    }
}

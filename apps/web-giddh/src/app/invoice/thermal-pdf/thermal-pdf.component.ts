import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as qz from 'qz-tray';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InvoiceReceiptActions } from '../../actions/invoice/receipt/receipt.actions';
import { PrinterFormatService } from '../../services/printer.format.service';
import { AppState } from '../../store';

@Component({
    selector: 'thermal-pdf',
    templateUrl: './thermal-pdf.component.html',
    styleUrls: [`./thermal-pdf.component.scss`]
})
export class ThermalComponent implements OnInit {

    /** Observable to get observable store data of voucher */
    public voucherDetails$: Observable<any>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);


    public maxLength = localStorage.getItem('printer') ? JSON.parse(localStorage.getItem('printer') || '{}').no_of_character : '46';

    constructor(
        private printerFormat: PrinterFormatService,
        private store: Store<AppState>,
        private invoiceReceiptActions: InvoiceReceiptActions,
    ) {
        this.voucherDetails$ = this.store.pipe(select(s => s.receipt.voucher), takeUntil(this.destroyed$));
    }

    public ngOnInit(): void {
        this.store.dispatch(this.invoiceReceiptActions.getVoucherDetailsV4('kriti', {
            invoiceNumber: 'K59',
            voucherType: 'sales',
            uniqueName: 'ay7jt1646806875852'
        }));
    }

    /**
     * This will use for print invoice pos
     *
     * @memberof ThermalComponent
     */
    public printInvoice() {
        this.printFormattedInvoice();
    }
    
    /**
     * This will use for pos commands formatted
     *
     * @memberof ThermalComponent
     */
    public printFormattedInvoice() {

        this.maxLength = localStorage.getItem('printer') ? JSON.parse(localStorage.getItem('printer') || '').no_of_character : '46';
        this.maxLength = +this.maxLength;
        if (!this.maxLength) {
            this.maxLength = 46;
        }

        this.voucherDetails$.subscribe(res => {

            // The QR data
            let qr = 'https://walkover.in/';

            // The dot size of the QR code
            let dots = '\x05';

            // Some proprietary size calculation
            let qrLength = qr.length + 3;
            let size1 = String.fromCharCode(qrLength % 50);
            let size0 = String.fromCharCode(Math.floor(qrLength / 50));

            let items = '';
            let totalQty = 0;
            let noOfItems = res.entries.length;
            let subTotal = parseFloat(res.subTotal?.amountForAccount).toFixed(2);
            let discountTotal = parseFloat(res.discountTotal?.amountForAccount).toFixed(2);
            let taxTotal = parseFloat(res.taxTotal?.amountForAccount).toFixed(2);
            let tax = '';
            let paidAmount = (res.grandTotal?.amountForAccount - res.balanceTotal?.amountForAccount)
            let paidAmt = Number(paidAmount).toFixed(0);
            let accountAddress = res.account?.billingDetails?.address.join(' ');
            let thankYouMsg = 'Thank You & Visit Again';
            let firmName = 'Walkover';

            for (let entry of res.entries) {
                let productName = entry.transactions[0].stock?.name || entry.transactions[0].account?.name;
                let quantity = parseFloat(entry.transactions[0].stock?.quantity || 1).toFixed(2) + ' ';
                let rate = parseFloat(entry.transactions[0].stock?.rate?.rateForAccount || 1).toFixed(2) + ' ';
                let amount = parseFloat(entry.transactions[0].amount?.amountForAccount).toFixed(2) + ' ';

                let itemDetails = quantity.padStart(10) + '' + rate.padStart(10) + '' + amount.padStart(12);
                let itemLength = this.maxLength - itemDetails.length;
                let itemName = productName.substr(0, itemLength);
                let remainingName = '';
                totalQty += +quantity;

                if (itemName.length < productName.length) {
                    let lastIndex = itemName.lastIndexOf(' ');
                    itemName = itemName.substr(0, lastIndex);
                    remainingName = '' + productName.substr(lastIndex);

                }
                if (remainingName.length > 0) {
                    remainingName = this.printerFormat.formatCenter(this.justifyText(this.printerFormat.leftAlign + remainingName));
                }

                if (itemName.length === 0) {
                    items +=
                        this.printerFormat.formatCenter(this.printerFormat.formatBold(this.justifyText(productName))) +
                        this.printerFormat.formatCenter(this.printerFormat.formatBold(this.justifyText('', itemDetails)));
                } else {
                    items +=
                        this.printerFormat.formatCenter(this.printerFormat.formatBold(this.justifyText(itemName, itemDetails))) + this.printerFormat.leftAlign +
                        remainingName;
                }
                if (entry.taxes && entry.taxes.length > 0) {
                    for (let taxApp of entry.taxes) {
                        if (taxApp.amount?.amountForAccount > 0) {
                            let taxAmount = parseFloat(taxApp.amount?.amountForAccount).toFixed(2);
                            tax += this.printerFormat.formatCenter(this.justifyText(taxApp.accountName + taxApp.taxPercent + '%' + ': '+ '' + taxAmount));
                        }
                    }
                }

            }

            if (res) {
                qz.websocket.connect().then(function () {
                    return qz.printers.find("Rugtek");              // Pass the printer name into the next Promise
                }).then((printer: any) => {

                    var config = qz.configs.create(printer);       // Create a default config for the found printer
                    let txt = [
                        this.printerFormat.initPrinter +
                        this.printerFormat.formatCenter('TAX INVOICE') +
                        this.printerFormat.formatCenter(this.printerFormat.formatBold(res.company?.name)) +
                        this.printerFormat.formatCenter(res.company?.billingDetails?.address[0]) +
                        this.printerFormat.formatCenter('GST: ' + res?.company?.billingDetails?.taxNumber) +
                        this.printerFormat.formatCenter(this.blankDash()) +
                        this.printerFormat.formatBold(
                            this.justifyText(res.account?.name, 'Date : ' + res.date)) +
                        this.printerFormat.lineBreak + this.printerFormat.leftAlign + this.justifyText(accountAddress, '') +
                        this.printerFormat.lineBreak +
                        this.justifyText('GST: ' + res.account.billingDetails?.taxNumber, 'Voucher No : ' + res.number) +
                        this.printerFormat.lineBreak +
                        this.printerFormat.formatCenter(this.printerFormat.formatCenter(this.blankDash()) +
                            this.printerFormat.formatBold(
                                this.justifyText('Products', 'Qty      Rate    Net Amount'))) +
                        this.printerFormat.formatCenter(this.blankDash()) +
                        items +
                        this.printerFormat.formatCenter(this.blankDash()) +
                        this.justifyText('No Of Items:  ' + noOfItems, 'Total Amt : ' + subTotal.padStart(11)) +
                        this.printerFormat.lineBreak +
                        tax +

                        this.justifyText('', 'Disc Amt : ' + '' + discountTotal.padStart(11)) +
                        this.printerFormat.lineBreak +
                        this.justifyText('', 'Tax Amt : ' + '' + taxTotal.padStart(11)) +
                        this.printerFormat.lineBreak +
                        this.justifyText('', 'Paid Amt : ' + '' + paidAmt.padStart(11)) +
                        this.printerFormat.lineBreak +
                        this.printerFormat.lineBreak +
                        this.printerFormat.formatCenter(res.totalAsWords?.amountForAccount) +
                        this.printerFormat.formatCenter(this.blankDash()) +
                        this.printerFormat.lineBreak +
                        // <!-- BEGIN QR DATA -->
                        '\x1D' + '\x28' + '\x6B' + '\x04' + '\x00' + '\x31' + '\x41' + '\x32' + '\x00',
                        '\x1D' + '\x28' + '\x6B' + '\x03' + '\x00' + '\x31' + '\x43' + dots,
                        '\x1D' + '\x28' + '\x6B' + '\x03' + '\x00' + '\x31' + '\x45' + '\x30',
                        '\x1D' + '\x28' + '\x6B' + size1 + size0 + '\x31' + '\x50' + '\x30' + qr,
                        '\x1D' + '\x28' + '\x6B' + '\x03' + '\x00' + '\x31' + '\x51' + '\x30',
                        '\x1D' + '\x28' + '\x6B' + '\x03' + '\x00' + '\x31' + '\x52' + '\x30' +
                        // <!-- END QR DATA -->
                        this.printerFormat.lineBreak +
                        this.justifyText(thankYouMsg, res.company?.name) +
                        this.printerFormat.lineBreak +
                        this.justifyText(firmName, '') +
                        this.printerFormat.endPrinter +
                        this.printerFormat.fullCut];
                    return qz.print(config, txt);
                }).catch(function (e: any) {
                    console.error(e);
                });

            }
        });
    }

    /**
     * This will use for justify text formatted in template
     *
     * @param {*} a
     * @param {*} [b='']
     * @return {*} 
     * @memberof ThermalComponent
     */
    public justifyText(a: any, b: any = '') {
        let lengthOfA = a.length;
        let qty = b + '';
        let lengthOfB = qty.length;
        let z = +lengthOfA + lengthOfB;
        let noOfSpacesRequired = this.maxLength - z;
        let spaces = '';
        for (let i = 0; i <= noOfSpacesRequired; i++) {
            spaces += ' ';
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
        let dash = '';
        for (let i = 0; i <= this.maxLength; i++) {
            dash += '-';
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
        let dash = '';
        for (let i = 0; i <= this.maxLength; i++) {
            dash += ' ';
        }
        return dash;
    }

}
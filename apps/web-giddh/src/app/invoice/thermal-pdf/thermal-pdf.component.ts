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

    public maxLength = localStorage.getItem('printer') ? JSON.parse(localStorage.getItem('printer') || '{}').no_of_character : '45';

    constructor(
        private _printerFormat: PrinterFormatService,
        private store: Store<AppState>,
        private invoiceReceiptActions: InvoiceReceiptActions,
    ) {
        this.voucherDetails$ = this.store.pipe(select(s => s.receipt.voucher), takeUntil(this.destroyed$));
    }

    public ngOnInit(): void {
        this.store.dispatch(this.invoiceReceiptActions.getVoucherDetailsV4('anshul', {
            invoiceNumber: 'K56',
            voucherType: 'sales',
            // uniqueName: 'j7sc11646214768119'
        }));
    }

    public printInvoice() {

        this.maxLength = localStorage.getItem('printer') ? JSON.parse(localStorage.getItem('printer') || '').no_of_character : '45';
        this.maxLength = +this.maxLength;
        if (!this.maxLength) {
            this.maxLength = 45;
        }

        qz.websocket.connect().then(function () {
            return qz.printers.find("Rugtek");              // Pass the printer name into the next Promise
        }).then((printer: any) => {
            var config = qz.configs.create(printer);       // Create a default config for the found printer
            let txt = [
                this._printerFormat.initPrinter +
                this._printerFormat.formatCenter('TAX INVOICE') +
                this._printerFormat.formatCenter(this._printerFormat.formatBold('SUGAR N JUICE')) +
                this._printerFormat.formatCenter('Western Avenue Naya More Bokaro Steel City Jharkhand') +
                this._printerFormat.formatCenter('GST 20BLPPK1627N1zy') +
                this._printerFormat.formatCenter(this.blankDash()) +
                this._printerFormat.formatBold(
                    this.justifyText('Dilpreet', 'Date : ' + '05-02-2022')) +
                this._printerFormat.lineBreak + this.justifyText('NEAR BUS STAND') +
                this._printerFormat.lineBreak +
                this.justifyText('GST', 'Bill No : ' + 'SN-2790') +
                this._printerFormat.lineBreak +
                this._printerFormat.formatCenter(this._printerFormat.formatCenter(this.blankDash()) +
                    this._printerFormat.formatBold(
                        this.justifyText('Products', 'Qty     Rate   Net Amount'))) +
                this._printerFormat.formatCenter(this.blankDash()) +
                this._printerFormat.lineBreak +
                this._printerFormat.formatCenter(
                    this._printerFormat.formatBold(
                        this.justifyText('2 LBS CHOCO  ', '5.00   300.00   200.00'))) +
                this._printerFormat.formatCenter(
                    this._printerFormat.formatBold(
                        this.justifyText('5 CHOCKLATE  ', '4.00   500.00   100.00'))) +
                this._printerFormat.formatCenter(
                    this._printerFormat.formatBold(
                        this.justifyText('2 WHEY  ', '1.00   700.00   400.00'))) +
                this._printerFormat.lineBreak +
                this._printerFormat.formatCenter(this.blankDash()) +
                this.justifyText('No Of Items :           ' + '34', 'Total Amt : ' + '450.00') +
                this._printerFormat.lineBreak +
                this._printerFormat.lineBreak +
                this.justifyText('IGST18%' + '  ' + '17243.00' + ' ' + '3103.74', '') +
                this._printerFormat.lineBreak +
                this.justifyText('IGST5%' + '  ' + ' 20000.00' + '  ' + '2200.74', 'Disc Amt : ' + '' + '50.00') +
                this._printerFormat.lineBreak +
                this._printerFormat.leftAlign +
                this.justifyText('IEXMPTO%' + '  ' + '1000.00' + ' ' + '0' + ' ' + '480.00', '') +
                this._printerFormat.rightAlign +
                this.justifyText('', 'Tax Amt : ' + '50.00 ') +
                this._printerFormat.lineBreak +
                this._printerFormat.rightAlign +
                this.justifyText('', 'Paid Amt : ' + '21877.00 ') +
                this._printerFormat.lineBreak +
                this._printerFormat.lineBreak +
                this._printerFormat.formatCenter('Twenty one Thousand Eight Hundred Seventy Seven') +
                this._printerFormat.formatCenter(this.blankDash()) +
                this._printerFormat.lineBreak +
                this.justifyText('Thank You & Visit Again', 'SUGAR N JUICE') +
                this._printerFormat.lineBreak +
                this.justifyText('E & O.E ', 'Authorised Signatory') +
                this._printerFormat.endPrinter +
                this._printerFormat.fullCut];
            console.log(config);
            console.log(txt);
            return qz.print(config, txt);
        }).catch(function (e: any) {
            console.error(e);
        });
    }
    
    private justifyText(a: any, b: any = '') {
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

    private blankDash() {
        let dash = '';
        for (let i = 0; i <= this.maxLength; i++) {
            dash += '-';
        }
        return dash;
    }

    private blankRow() {
        let dash = '';
        for (let i = 0; i <= this.maxLength; i++) {
            dash += ' ';
        }
        return dash;
    }

}
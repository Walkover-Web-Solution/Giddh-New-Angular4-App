import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';
import { AdvanceReceiptAdjustment, AdjustAdvancePaymentModal, AdvanceReceiptRequest, Adjustment } from '../../models/api-models/AdvanceReceiptsAdjust';
import { GIDDH_DATE_FORMAT_UI } from '../helpers/defaultDateFormat';
import * as moment from 'moment/moment';
import { SalesService } from '../../services/sales.service';
import { IOption } from '../../theme/ng-select/ng-select';


@Component({
    selector: 'advance-receipt-adjustment-component',
    templateUrl: './advance-receipt-adjustment.component.html',
    styleUrls: [`./advance-receipt-adjustment.component.scss`]
})




export class AdvanceReceiptAdjustmentComponent implements OnInit, OnChanges {
    public tempDateParams: {};
    public adjustVoucherOptions: IOption[];
    public allAdvanceReceiptResponse: Adjustment[] = [];
    public isTaxDeducted: boolean = false;
    public adjustPayment: AdjustAdvancePaymentModal = {
        customerName: '',
        customerUniquename: '',
        voucherDate: '',
        balanceDue: '',
        dueDate: '',
        grandTotal: '',
        gstTaxesTotal: 0,
        subTotal: 0,
        totalTaxableValue: 0
    }

    public adjustVoucherForm: AdvanceReceiptAdjustment;
    public getAllAdvanceReceiptsRequest: AdvanceReceiptRequest = {
        accountUniqueName: '',
        invoiceDate: ''
    };
    @Input() public invoiceFormDetails;
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
    constructor(private salesService: SalesService) {

    }
    ngOnInit() {
        this.adjustVoucherForm = new AdvanceReceiptAdjustment();
        this.assignVoucherDetails();
        this.getAllAdvanceReceipts();
    }
    public onCancel() {
        this.closeModelEvent.emit(true);
    }
    public ngOnChanges(s: SimpleChanges) {
        console.log('advance reciept comp', this.invoiceFormDetails)

    }

    public assignVoucherDetails() {
        this.adjustPayment = Object.assign(this.adjustPayment, {
            balanceDue: this.invoiceFormDetails.voucherDetails.balanceDue,
            grandTotal: this.invoiceFormDetails.voucherDetails.grandTotal,
            customerName: this.invoiceFormDetails.voucherDetails.customerName,
            customerUniquename: this.invoiceFormDetails.voucherDetails.customerUniquename,
            voucherDate: moment(this.invoiceFormDetails.voucherDetails.voucherDate).format('DD-MM-YYYY')
        });

        // this.adjustPayment.balanceDue = this.invoiceFormDetails.voucherDetails.balanceDue;
        // this.adjustPayment.grandTotal = this.invoiceFormDetails.voucherDetails.grandTotal;

        console.log('advance %%%%%%%', this.adjustPayment)

    }

    /**
     * API call to get all advance receipts
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public getAllAdvanceReceipts() {
        if (this.adjustPayment && this.adjustPayment.customerUniquename && this.adjustPayment.voucherDate) {
            this.getAllAdvanceReceiptsRequest.accountUniqueName = this.adjustPayment.customerUniquename;
            this.getAllAdvanceReceiptsRequest.invoiceDate = this.adjustPayment.voucherDate;
            this.salesService.getAllAdvanceReceiptVoucher(this.getAllAdvanceReceiptsRequest).subscribe(res => {
                if (res.status === 'success') {
                    this.allAdvanceReceiptResponse = res.body
                    if (res.body && res.body.length) {
                        this.adjustVoucherOptions = [];
                        this.allAdvanceReceiptResponse.forEach(item => {
                            this.adjustVoucherOptions.push({ value: item.uniqueName, label: item.voucherNumber, additional: item });
                        });
                    }
                    console.log('options', this.adjustVoucherOptions);
                }
            })
        }
    }

    /**
     * To add new blank entry in advance receipt adjustment
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public addNewBlankAdjustVoucherRow() {
        this.adjustVoucherForm.adjustments.push(new Adjustment());
    }

    /**
     *  To remove entry from advance receipt adjustment by given index
     *
     * @param {number} index Index number
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public deleteAdjustVoucherRow(index: number) {
        if (index) {
            this.adjustVoucherForm.adjustments.splice(index, 1);
        }
    }
}

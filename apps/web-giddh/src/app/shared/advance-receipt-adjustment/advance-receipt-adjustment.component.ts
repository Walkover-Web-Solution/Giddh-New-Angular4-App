import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';
import { AdvanceReceiptAdjustment, AdjustAdvancePaymentModal, AdvanceReceiptRequest, Adjustment } from '../../models/api-models/AdvanceReceiptsAdjust';
import { GIDDH_DATE_FORMAT_UI } from '../helpers/defaultDateFormat';
import * as moment from 'moment/moment';
import { SalesService } from '../../services/sales.service';
import { IOption } from '../../theme/ng-select/ng-select';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { NgForOf } from '@angular/common';
import { NgForm } from '@angular/forms';
import { copyStyles } from '@angular/animations/browser/src/util';


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
    public availableTdsTaxes: IOption[] = [];
    public tdsAmount: number;
    public adjustPayment: AdjustAdvancePaymentModal = {
        customerName: '',
        customerUniquename: '',
        voucherDate: '',
        balanceDue: '',
        dueDate: '',
        grandTotal: '',
        gstTaxesTotal: 0,
        subTotal: 0,
        totalTaxableValue: 0,
    }

    public adjustVoucherForm: AdvanceReceiptAdjustment;
    public getAllAdvanceReceiptsRequest: AdvanceReceiptRequest = {
        accountUniqueName: '',
        invoiceDate: ''
    };
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    @Input() public invoiceFormDetails;
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
    constructor(private store: Store<AppState>, private salesService: SalesService) {

    }
    ngOnInit() {
        this.adjustVoucherForm = new AdvanceReceiptAdjustment();
        this.adjustVoucherForm.adjustments = [
            {
                voucherNumber: '',
                dueAmount: {
                    amountForAccount: 0,
                    amountForCompany: 0
                },
                voucherDate: '',
                taxRate: 0,
                uniqueName: '',
                taxUniqueName: '',
            }
        ];
        this.assignVoucherDetails();
        this.getAllAdvanceReceipts();
        this.store.select(p => p.company).pipe(takeUntil(this.destroyed$)).subscribe((obj) => {
            if (obj && obj.taxes) {
                this.availableTdsTaxes = [];
                obj.taxes.forEach(item => {
                    if (item && (item.taxType === 'tdsrc' || item.taxType === 'tdspay')) {
                        this.availableTdsTaxes.push({ value: item.uniqueName, label: item.name, additional: item })
                    }
                });
                console.log(obj);
                console.log(this.availableTdsTaxes);

            }
        });
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
            voucherDate: moment(this.invoiceFormDetails.voucherDetails.voucherDate).format('DD-MM-YYYY'),
            totalTaxableValue: this.invoiceFormDetails.voucherDetails.totalTaxableValue,
            subTotal: this.invoiceFormDetails.voucherDetails.subTotal

        });

        // this.adjustPayment.balanceDue = this.invoiceFormDetails.voucherDetails.balanceDue;
        // this.adjustPayment.grandTotal = this.invoiceFormDetails.voucherDetails.grandTotal;

        console.log('advance %%%%%%%', this.adjustPayment);
        console.log('invoiceFormDetails %%%%%%%', this.invoiceFormDetails)


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
                            if (item) {

                            }
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
     *  To remove entry from advance receipt adjustment by given index (At least one entry required)
     *
     * @param {number} index Index number
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public deleteAdjustVoucherRow(index: number) {
        if (this.adjustVoucherForm.adjustments.length > 1) {
            this.adjustVoucherForm.adjustments.splice(index, 1);
        }
    }

    /**
     * To apply TDS tax
     *
     * @param {IOption} event Select Tax event
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public tdsTaxSelected(event: IOption) {
        console.log(event);
        if (event && event.additional && event.additional && event.additional.taxDetail && event.additional.taxDetail[0].taxValue && this.adjustPayment && this.adjustPayment.subTotal) {
            this.tdsAmount = this.calculateTdsAmount(Number(this.adjustPayment.subTotal), Number(event.additional.taxDetail[0].taxValue));
        }
    }


    /**
     *  Calculate inclusive tax amount based on tax rate
     *
     * @param {number} productAmount Product's Amount with Tax
     * @param {number} rate Tax %
     * @returns {number}  Inclusive Tax Amoun
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public calculateInclusiveTaxAmount(productAmount: number, rate: number): number {
        let taxAmount: number = 0;
        taxAmount = Number((productAmount * rate) / (rate + 100));
        return Number(taxAmount.toFixed(2));
    }


    /**
     *  Calculate TDS amount based on TDS rate
     *
     * @param {number} productAmount Product's Amount with Tax
     * @param {number} rate Tax %
     * @returns {number}  Tds taxable Amount
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public calculateTdsAmount(productAmount: number, rate: number): number {
        let taxAmount: number = 0;
        taxAmount = Number((productAmount * rate) / 100);
        return Number(taxAmount.toFixed(2));
    }

    public saveAdjustAdvanceReceipt(formData: NgForm) {
        console.log(formData.value, this.adjustVoucherForm);

    }

/**
 * Select voucher type
 *
 * @param {IOption} event
 * @param {number} index
 * @memberof AdvanceReceiptAdjustmentComponent
 */
public selectVoucher(event: IOption, entry: Adjustment, index:number) {
        if (event) {
            entry = event.additional;
            this.adjustVoucherForm.adjustments.splice(index, 0, entry);
        }
    }

/**
 * To calculate Tax field on amount change
 *
 * @param {Adjustment} entry Adjust amount entry
 * @param {number} index index number
 * @memberof AdvanceReceiptAdjustmentComponent
 */
public calculateTax(entry: Adjustment, index: number) {
        if (entry && entry.taxRate && entry.dueAmount.amountForAccount) {
            let taxAmount = this.calculateInclusiveTaxAmount(entry.dueAmount.amountForAccount, entry.taxRate);
            this.adjustVoucherForm.adjustments[index].calculatedTaxAmount = Number(taxAmount);
        } else {
            this.adjustVoucherForm.adjustments[index].calculatedTaxAmount = 0.0;
        }
    }
}

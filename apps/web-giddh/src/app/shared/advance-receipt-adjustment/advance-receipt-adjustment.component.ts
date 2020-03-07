import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, Input, ViewChild, ElementRef } from '@angular/core';
import { AdvanceReceiptAdjustment, AdjustAdvancePaymentModal, AdvanceReceiptRequest, Adjustment } from '../../models/api-models/AdvanceReceiptsAdjust';
import { GIDDH_DATE_FORMAT_UI } from '../helpers/defaultDateFormat';
import * as moment from 'moment/moment';
import { SalesService } from '../../services/sales.service';
import { IOption } from '../../theme/ng-select/ng-select';
import { AppState } from '../../store';
import { Store, select } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { NgForOf } from '@angular/common';
import { NgForm } from '@angular/forms';
import { copyStyles } from '@angular/animations/browser/src/util';
import { ToasterService } from '../../services/toaster.service';


@Component({
    selector: 'advance-receipt-adjustment-component',
    templateUrl: './advance-receipt-adjustment.component.html',
    styleUrls: [`./advance-receipt-adjustment.component.scss`]
})




export class AdvanceReceiptAdjustmentComponent implements OnInit, OnChanges {

    public newAdjustVoucherOptions: IOption[];
    public adjustVoucherOptions: IOption[];
    public allAdvanceReceiptResponse: Adjustment[] = [];
    public isTaxDeducted: boolean = false;
    public availableTdsTaxes: IOption[] = [];
    public tdsAmount: number;
    public balanceDueAmount: number = 0;
    public offset: number = 0;
    public companyCurrency: string;
    public baseCurrencySymbol: string;
    public currencySymbol: string;
    public inputMaskFormat: string = '';

    @ViewChild('tdsTypeBox') public tdsTypeBox: ElementRef;
    @ViewChild('tdsAmountBox') public tdsAmountBox: ElementRef;


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
        totalAdjustedAmount: 0
    }

    public adjustVoucherForm: AdvanceReceiptAdjustment;
    public getAllAdvanceReceiptsRequest: AdvanceReceiptRequest = {
        accountUniqueName: '',
        invoiceDate: ''
    };
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    @Input() public invoiceFormDetails;
    @Input() public advanceReceiptAdjustmentUpdatedData: AdvanceReceiptAdjustment;
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Output() public submitClicked: EventEmitter<{ adjustVoucherData: AdvanceReceiptAdjustment, adjustPaymentData: AdjustAdvancePaymentModal }> = new EventEmitter();

    constructor(private store: Store<AppState>, private salesService: SalesService, private toaster: ToasterService) {

    }
    ngOnInit() {
        this.adjustVoucherForm = new AdvanceReceiptAdjustment();

        this.adjustVoucherForm = {
            tdsTaxUniqueName: '',
            tdsAmount: {
                amountForAccount: null
            },
            description: '',
            adjustments: [
                {
                    voucherNumber: '',
                    dueAmount: {
                        amountForAccount: null,
                        amountForCompany: null
                    },
                    voucherDate: '',
                    taxRate: 0,
                    uniqueName: '',
                    taxUniqueName: '',
                }
            ]
        };
         if (this.advanceReceiptAdjustmentUpdatedData) {
            this.adjustVoucherForm = this.advanceReceiptAdjustmentUpdatedData;
            if(this.advanceReceiptAdjustmentUpdatedData && this.advanceReceiptAdjustmentUpdatedData.adjustments && this.advanceReceiptAdjustmentUpdatedData.adjustments.length && this.advanceReceiptAdjustmentUpdatedData.tdsTaxUniqueName) {
              this.isTaxDeducted = true;
            } else {
                this.isTaxDeducted = false;
            }
        }
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
            }
        });
        this.store.pipe(select(prof => prof.settings.profile), takeUntil(this.destroyed$)).subscribe(async (profile) => {
            this.companyCurrency = profile.baseCurrency || 'INR';
            this.baseCurrencySymbol = profile.baseCurrencySymbol;
            this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';
        });

        if (this.invoiceFormDetails && this.invoiceFormDetails.accountDetails && this.invoiceFormDetails.accountDetails.currencySymbol) {
            this.currencySymbol = this.invoiceFormDetails.accountDetails.currencySymbol;
        }
    }
    public onCancel() {
        this.closeModelEvent.emit(true);
    }
    public ngOnChanges(simplechange: SimpleChanges) {
        console.log(' simplechange===', this.invoiceFormDetails, simplechange);
        console.log(' simplechange advanceRece Update dData===', this.advanceReceiptAdjustmentUpdatedData);

        console.log(' update adjustVoucherForm', this.adjustVoucherForm);

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
        this.balanceDueAmount = this.invoiceFormDetails.voucherDetails.balanceDue;
        this.offset = this.adjustPayment.balanceDue;

        // this.adjustPayment.balanceDue = this.invoiceFormDetails.voucherDetails.balanceDue;
        // this.adjustPayment.grandTotal = this.invoiceFormDetails.voucherDetails.grandTotal;

        console.log('advance adjustPayment%%%%%%%', this.adjustPayment);
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
                                item.voucherDate = item.voucherDate.replace(/-/g, '/');
                                this.adjustVoucherOptions.push({ value: item.uniqueName, label: item.voucherNumber, additional: item });
                            }
                        });
                        this.newAdjustVoucherOptions = [];
                        this.newAdjustVoucherOptions = this.adjustVoucherOptions;
                    }
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
        if (this.adjustPayment.balanceDue > 0) {
            this.adjustVoucherForm.adjustments.push(new Adjustment());
        } else {
            this.toaster.errorToast('Adjust amount can\'t be greater than due amount');
        }
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
        this.calculateBalanceDue();
    }

    /**
     * To apply TDS tax
     *
     * @param {IOption} event Select Tax event
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public tdsTaxSelected(event: IOption) {
        if (event && event.additional && event.additional && event.additional.taxDetail && event.additional.taxDetail[0].taxValue && this.adjustPayment && this.adjustPayment.subTotal) {
            this.tdsAmount = this.calculateTdsAmount(Number(this.adjustPayment.subTotal), Number(event.additional.taxDetail[0].taxValue));
            this.adjustVoucherForm.tdsTaxUniqueName = event.value;
            this.adjustVoucherForm.tdsAmount.amountForAccount = this.tdsAmount;
            this.changeTdsAmount(this.tdsAmount);
            this.tdsTypeBox.nativeElement.classList.remove('error-box');
        }
    }

    public changeTdsAmount(event) {
        if (!Number(event)) {
            this.tdsAmountBox.nativeElement.classList.add('error-box');
        } else {
            this.tdsAmountBox.nativeElement.classList.remove('error-box');
        }
    }

    public isTdsSelected(event: any) {
        if (event) {
            this.adjustVoucherForm.tdsAmount = {
                amountForAccount: null
            };
            this.adjustVoucherForm.tdsTaxUniqueName = '';
            this.adjustVoucherForm.description = '';
        } else {
            delete this.adjustVoucherForm['tdsAmount'];
            delete this.adjustVoucherForm['description'];
            delete this.adjustVoucherForm['tdsTaxUniqueName'];
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

    /**
     * To save advance receipt adjustment
     *
     * @param {NgForm} formData
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public saveAdjustAdvanceReceipt(formData: NgForm) {
        if (this.isTaxDeducted) {
            if (this.adjustVoucherForm.tdsTaxUniqueName === '') {
                if (this.tdsTypeBox && this.tdsTypeBox.nativeElement)
                    this.tdsTypeBox.nativeElement.classList.add('error-box');
                return;
            } else if (this.adjustVoucherForm.tdsAmount === '') {
                if (this.tdsAmountBox && this.tdsAmountBox.nativeElement) {
                    this.tdsAmountBox.nativeElement.classList.add('error-box');
                    return;
                }
            }
        } else {
            delete this.adjustVoucherForm['tdsAmount'];
            delete this.adjustVoucherForm['description'];
            delete this.adjustVoucherForm['tdsTaxUniqueName'];
        }
        if (this.adjustPayment.balanceDue < 0) {
            this.toaster.errorToast('Adjust amount can\'t be greater than due amount');
            return;
        }
        if (this.adjustVoucherForm && this.adjustVoucherForm.adjustments && this.adjustVoucherForm.adjustments.length) {
            this.adjustVoucherForm.adjustments.forEach(item => {
                if (!item.voucherNumber) {
                    this.toaster.errorToast('please select voucher');
                    return;
                } else if (!item.dueAmount.amountForAccount) {
                    this.toaster.errorToast('please enter amount');
                    return;
                }
            });
        }
        console.log('adjustVoucherForm', this.adjustVoucherForm);
        console.log('form &&&', formData);
        console.log('form &&&', formData.valid);

        this.submitClicked.emit({
            adjustVoucherData: this.adjustVoucherForm,
            adjustPaymentData: this.adjustPayment
        });

    }

    /**
     * Select voucher type
     *
     * @param {IOption} event
     * @param {number} index
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public selectVoucher(event: IOption, entry: Adjustment, index: number) {
        if (event && entry) {
            this.adjustVoucherOptions = this.newAdjustVoucherOptions;
            entry = event.additional;
            this.adjustVoucherForm.adjustments.forEach(
                item => {
                    if (item.voucherNumber === event.label.trim()) {
                        let indexNo = this.adjustVoucherOptions.indexOf(event);
                        this.adjustVoucherOptions.splice(indexNo, 1);
                    }
                });
            this.adjustVoucherForm.adjustments.splice(index, 1, entry);
            this.calculateTax(entry, index);
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
        this.calculateBalanceDue();
    }

    public calculateBalanceDue() {
        if (this.adjustVoucherForm.adjustments && this.adjustVoucherForm.adjustments.length) {
            this.adjustPayment.balanceDue = this.invoiceFormDetails.voucherDetails.balanceDue;
            let totalAmount: number = 0;
            this.adjustVoucherForm.adjustments.forEach(item => {

                if (item && item.dueAmount && item.dueAmount.amountForAccount) {
                    totalAmount += Number(item.dueAmount.amountForAccount);
                }
            });
            this.adjustPayment.balanceDue = Number(this.adjustPayment.balanceDue) - Number(totalAmount);
            this.adjustPayment.totalAdjustedAmount = Number(totalAmount);
        }
    }
}

import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef } from '@angular/core';
import { AdvanceReceiptAdjustment, AdjustAdvancePaymentModal, AdvanceReceiptRequest, Adjustment } from '../../models/api-models/AdvanceReceiptsAdjust';
import { GIDDH_DATE_FORMAT } from '../helpers/defaultDateFormat';
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
import { cloneDeep } from '../../lodash-optimized';


@Component({
    selector: 'advance-receipt-adjustment-component',
    templateUrl: './advance-receipt-adjustment.component.html',
    styleUrls: [`./advance-receipt-adjustment.component.scss`]
})



export class AdvanceReceiptAdjustmentComponent implements OnInit {

    public newAdjustVoucherOptions: IOption[] = [];
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
    public isInvalidForm: boolean = false;


    @ViewChild('tdsTypeBox') public tdsTypeBox: ElementRef;
    @ViewChild('tdsAmountBox') public tdsAmountBox: ElementRef;

    public adjustPayment: AdjustAdvancePaymentModal = {
        customerName: '',
        customerUniquename: '',
        voucherDate: '',
        balanceDue: 0,
        dueDate: '',
        grandTotal: 0,
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
    @Input() public isUpdateMode;
    @Input() public depositAmount = 0;
    @Input() public advanceReceiptAdjustmentUpdatedData: AdvanceReceiptAdjustment;
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Output() public submitClicked: EventEmitter<{ adjustVoucherData: AdvanceReceiptAdjustment, adjustPaymentData: AdjustAdvancePaymentModal }> = new EventEmitter();

    constructor(private store: Store<AppState>, private salesService: SalesService, private toaster: ToasterService) {

    }

    /**
     * Life cycle hook
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public ngOnInit() {
        this.adjustVoucherForm = new AdvanceReceiptAdjustment();
        this.adjustVoucherForm = {
            tdsTaxUniqueName: '',
            tdsAmount: {
                amountForAccount: 0
            },
            description: '',
            adjustments: [
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
            ]
        };
        if (this.advanceReceiptAdjustmentUpdatedData) {
            this.adjustVoucherForm = this.advanceReceiptAdjustmentUpdatedData.adjustments.length ? this.advanceReceiptAdjustmentUpdatedData : this.adjustVoucherForm;
            if (this.advanceReceiptAdjustmentUpdatedData && this.advanceReceiptAdjustmentUpdatedData.adjustments && this.advanceReceiptAdjustmentUpdatedData.adjustments.length && this.advanceReceiptAdjustmentUpdatedData.tdsTaxUniqueName) {
                this.isTaxDeducted = true;
            } else {
                this.isTaxDeducted = false;
            }
        }
        if (this.invoiceFormDetails && this.invoiceFormDetails.voucherDetails) {
            if (typeof this.invoiceFormDetails.voucherDetails.voucherDate !== 'string' && !this.invoiceFormDetails.voucherDetails.voucherDate.includes('-')) {
                this.invoiceFormDetails.voucherDetails.voucherDate = moment(this.invoiceFormDetails.voucherDetails.voucherDate).format(GIDDH_DATE_FORMAT);
            }
            this.assignVoucherDetails();
        }
        this.getAllAdvanceReceipts();
        if (this.isUpdateMode) {
            this.calculateBalanceDue()
        }
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

    /**
     * To close adjust payment modal
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public onCancel(): void {
        if (this.adjustPayment && this.adjustPayment.totalAdjustedAmount && this.adjustPayment.grandTotal && this.adjustPayment.totalAdjustedAmount - this.adjustPayment.grandTotal > 0) {
            this.toaster.warningToast('The adjusted amount of the linked invoice\'s is more than this receipt');
            return;
        }
        this.closeModelEvent.emit(true);
    }

    /**
     * Assign all voucher details which get from parent component
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public assignVoucherDetails(): void {
        this.adjustPayment = Object.assign(this.adjustPayment, {
            balanceDue: Number(this.invoiceFormDetails.voucherDetails.balanceDue),
            grandTotal: Number(this.invoiceFormDetails.voucherDetails.grandTotal),
            customerName: this.invoiceFormDetails.voucherDetails.customerName,
            customerUniquename: this.invoiceFormDetails.voucherDetails.customerUniquename,
            voucherDate: this.invoiceFormDetails.voucherDetails.voucherDate,
            totalTaxableValue: Number(this.invoiceFormDetails.voucherDetails.totalTaxableValue),
            subTotal: Number(this.invoiceFormDetails.voucherDetails.subTotal)

        });
        if (this.adjustPayment.grandTotal - this.adjustPayment.totalAdjustedAmount > 0) {
            this.isInvalidForm = true;
        }
        this.balanceDueAmount = this.invoiceFormDetails.voucherDetails.balanceDue;
        this.offset = this.adjustPayment.balanceDue;
    }

    /**
     * API call to get all advance receipts
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public getAllAdvanceReceipts(): void {
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
                                this.newAdjustVoucherOptions.push({ value: item.uniqueName, label: item.voucherNumber, additional: item });
                            }
                        });
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
    public addNewBlankAdjustVoucherRow(): void {
        if (this.adjustPayment.grandTotal - this.adjustPayment.totalAdjustedAmount >= 0) {
            let isAnyBlankEntry: boolean;
            this.adjustVoucherForm.adjustments.forEach(item => {
                if (!item.uniqueName || !item.voucherNumber) {
                    isAnyBlankEntry = true;
                }
            });
            if (isAnyBlankEntry) {
                this.isInvalidForm = false;
                return;
            } else {
                this.adjustVoucherForm.adjustments.push(new Adjustment());
                this.isInvalidForm = false;
            }
        } else {
            this.toaster.errorToast('The adjusted amount of the linked invoice\'s is more than this receipt');
            this.isInvalidForm = true;
        }
    }

    /**
     *  To remove entry from advance receipt adjustment by given index (At least one entry required)
     *
     * @param {number} index Index number
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public deleteAdjustVoucherRow(index: number): void {
        let selectedItem = this.newAdjustVoucherOptions.find(item => item.value === this.adjustVoucherForm.adjustments[index].uniqueName);
        if(selectedItem && selectedItem.value && selectedItem.label && selectedItem.additional) {
        this.adjustVoucherOptions.push({ value: selectedItem.value, label: selectedItem.label, additional: selectedItem.additional });
        }
        this.adjustVoucherOptions = _.uniqBy(this.adjustVoucherOptions, (item) => {
            return item.value && item.label.trim();
        });
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
    public tdsTaxSelected(event: IOption): void {
        if (event && event.additional && event.additional && event.additional.taxDetail && event.additional.taxDetail[0].taxValue && this.adjustPayment && this.adjustPayment.subTotal) {
            this.tdsAmount = cloneDeep(this.calculateTdsAmount(Number(this.adjustPayment.subTotal), Number(event.additional.taxDetail[0].taxValue)));
            this.adjustVoucherForm.tdsTaxUniqueName = cloneDeep(event.value);
            this.adjustVoucherForm.tdsAmount.amountForAccount = cloneDeep(this.tdsAmount);
            this.changeTdsAmount(this.tdsAmount);
            this.tdsTypeBox.nativeElement.classList.remove('error-box');
        }
    }

    /**
     * To add error box in case of amount 0
     *
     * @param {*} event Value of amount
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public changeTdsAmount(event): void {
        if (!Number(event)) {
            this.tdsAmountBox.nativeElement.classList.add('error-box');
        } else {
            this.tdsAmountBox.nativeElement.classList.remove('error-box');
        }
    }

    /**
     * To check TDS section selected or not
     *
     * @param {*} event Click event
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public isTdsSelected(event: any): void {
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
        let amount: number = 0;
        amount = cloneDeep(Number(productAmount));
        taxAmount = Number((amount * rate) / (rate + 100));
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
        let amount: number = 0;
        amount = cloneDeep(Number(productAmount));
        taxAmount = Number((amount * rate) / 100);
        return Number(taxAmount.toFixed(2));
    }

    /**
     * To save advance receipt adjustment
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public saveAdjustAdvanceReceipt(): void {
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
        if ((Number(this.adjustPayment.grandTotal) - Number(this.adjustPayment.totalAdjustedAmount)) < 0) {
            this.toaster.errorToast('The adjusted amount of the linked invoice\'s is more than this receipt');
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
    public selectVoucher(event: IOption, entry: Adjustment, index: number): void {
        if (event && entry) {
            entry = cloneDeep(event.additional);
            this.adjustVoucherForm.adjustments.splice(index, 1, entry);
            this.calculateTax(entry, index);
        }
    }

    /**
     *  To handle click event of selected voucher sh-select
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public clickSelectVoucher(index: number): void {
        this.adjustVoucherOptions = this.getAdvanceReceiptUnselectedVoucher();
        if (this.adjustVoucherForm.adjustments.length && this.adjustVoucherForm.adjustments[index] && this.adjustVoucherForm.adjustments[index].voucherNumber) {
            let selectedItem = this.newAdjustVoucherOptions.find(item => item.value === this.adjustVoucherForm.adjustments[index].uniqueName);
            delete selectedItem['isHilighted'];
            this.adjustVoucherOptions.splice(0, 0, { value: selectedItem.value, label: selectedItem.label, additional: selectedItem.additional })
        }
        this.adjustVoucherOptions = _.uniqBy(this.adjustVoucherOptions, (item) => {
            return item.value && item.label.trim();
        });
    }

    /**
     * To handle removed selected voucher from vouhcer array
     *
     * @returns {IOption[]}  return filtered selected voucher sh-select options
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public getAdvanceReceiptUnselectedVoucher(): IOption[] {
        let options: IOption[] = [];
        let adjustVoucherAdjustment = [];
        this.newAdjustVoucherOptions.forEach(item => {
            options.push(item);
        });
        adjustVoucherAdjustment = cloneDeep(this.adjustVoucherForm.adjustments);

        for (let i = options.length - 1; i >= 0; i--) {
            for (let j = 0; j < adjustVoucherAdjustment.length; j++) {
                if (options[i] && (options[i].label.trim() === adjustVoucherAdjustment[j].voucherNumber.trim())) {
                    options.splice(i, 1);
                }

            }
        }
        options.forEach(item => {
            if (item) {
                delete item['isHilighted'];
            }
        });

        options = _.uniqBy(options, (item) => {
            return item.value && item.label.trim();
        });
        return options;
    }

    /**
     * To calculate Tax value depends on selected voucher
     *
     * @param {Adjustment} entry Advance receipts adjuste amount object
     * @param {number} index Index number
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public calculateTax(entryData: Adjustment, index: number): void {
        let entry: Adjustment = cloneDeep(entryData);
        if (entry && entry.taxRate && entry.dueAmount.amountForAccount) {
            let taxAmount = this.calculateInclusiveTaxAmount(entry.dueAmount.amountForAccount, entry.taxRate);
            this.adjustVoucherForm.adjustments[index].calculatedTaxAmount = Number(taxAmount);
        } else {
            this.adjustVoucherForm.adjustments[index].calculatedTaxAmount = 0.0;
        }
        this.calculateBalanceDue();
    }

    /**
     * To calculate balance due
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public calculateBalanceDue(): void {
        if (this.adjustVoucherForm && this.adjustVoucherForm.adjustments && this.adjustVoucherForm.adjustments.length) {
            this.adjustPayment.balanceDue = this.invoiceFormDetails.voucherDetails.balanceDue;
            let totalAmount: number = 0;
            this.adjustVoucherForm.adjustments.forEach(item => {
                if (item && item.dueAmount && item.dueAmount.amountForAccount) {
                    totalAmount += Number(item.dueAmount.amountForAccount);
                }
            });
            // this.adjustPayment.balanceDue = Number(this.adjustPayment.grandTotal.) - Number(totalAmount);
            this.adjustPayment.totalAdjustedAmount = Number(totalAmount);
            if (this.adjustPayment.grandTotal - this.adjustPayment.totalAdjustedAmount < 0) {
                this.isInvalidForm = true;
            } else {
                this.isInvalidForm = false;
            }
        }
    }
}

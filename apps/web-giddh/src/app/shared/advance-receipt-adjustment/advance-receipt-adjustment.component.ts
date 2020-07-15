import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef } from '@angular/core';
import { VoucherAdjustments, AdjustAdvancePaymentModal, AdvanceReceiptRequest, Adjustment } from '../../models/api-models/AdvanceReceiptsAdjust';
import { GIDDH_DATE_FORMAT } from '../helpers/defaultDateFormat';
import * as moment from 'moment/moment';
import { SalesService } from '../../services/sales.service';
import { IOption } from '../../theme/ng-select/ng-select';
import { AppState } from '../../store';
import { Store, select } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ToasterService } from '../../services/toaster.service';
import { cloneDeep } from '../../lodash-optimized';
import { AdjustedVoucherType, SubVoucher } from '../../app.constant';


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
    /** Message for toaster when due amount get negative  */
    public exceedDueErrorMessage: string = 'The adjusted amount of the linked invoice is more than this receipt due amount';
    /** Exceed Amount from invoice amount after adjustment */
    public exceedDueAmount: number = 0;




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
        totalAdjustedAmount: 0,
        tcsTotal: 0,
        tdsTotal: 0,
    }

    public adjustVoucherForm: VoucherAdjustments;
    public getAllAdvanceReceiptsRequest: AdvanceReceiptRequest = {
        accountUniqueName: '',
        invoiceDate: ''
    };
    public advanceReceiptAdjustmentPreUpdatedData: VoucherAdjustments;
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    @Input() public invoiceFormDetails;
    @Input() public isUpdateMode;
    @Input() public depositAmount = 0;
    // To use pre adjusted data which was adjusted earlier or in other trasaction by user
    @Input() public advanceReceiptAdjustmentUpdatedData: VoucherAdjustments;
    /** Stores the type of voucher adjustment */
    @Input() public adjustedVoucherType: AdjustedVoucherType;

    @Output() public closeModelEvent: EventEmitter<{ adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }> = new EventEmitter();
    @Output() public submitClicked: EventEmitter<{ adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }> = new EventEmitter();

    constructor(private store: Store<AppState>, private salesService: SalesService, private toaster: ToasterService) {

    }

    /**
     * Life cycle hook
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public ngOnInit() {
        this.adjustVoucherForm = new VoucherAdjustments();
        this.onClear();
        if (this.advanceReceiptAdjustmentUpdatedData) {
            this.advanceReceiptAdjustmentPreUpdatedData = cloneDeep(this.advanceReceiptAdjustmentUpdatedData);
            this.adjustVoucherForm = this.advanceReceiptAdjustmentUpdatedData.adjustments.length ? this.advanceReceiptAdjustmentUpdatedData : this.adjustVoucherForm;
            if (this.advanceReceiptAdjustmentUpdatedData && this.advanceReceiptAdjustmentUpdatedData.adjustments && this.advanceReceiptAdjustmentUpdatedData.adjustments.length && this.advanceReceiptAdjustmentUpdatedData.tdsTaxUniqueName) {
                this.isTaxDeducted = true;
            } else {
                this.isTaxDeducted = false;
            }
        } else {
            this.onClear();
        }
        if (this.invoiceFormDetails && this.invoiceFormDetails.voucherDetails) {
            if (typeof this.invoiceFormDetails.voucherDetails.voucherDate !== 'string') {
                this.invoiceFormDetails.voucherDetails.voucherDate = moment(this.invoiceFormDetails.voucherDetails.voucherDate).format(GIDDH_DATE_FORMAT);
            }
            this.invoiceFormDetails.voucherDetails.tcsTotal = this.invoiceFormDetails.voucherDetails.tcsTotal || 0;
            this.invoiceFormDetails.voucherDetails.tdsTotal = this.invoiceFormDetails.voucherDetails.tdsTotal || 0;
            this.assignVoucherDetails();
        }
        console.log('Invoice form details: ', this.invoiceFormDetails);
        if (this.adjustedVoucherType === AdjustedVoucherType.AdvanceReceipt || this.adjustedVoucherType === AdjustedVoucherType.Receipt) {
            const requestObject = {
                accountUniqueNames: [this.invoiceFormDetails.voucherDetails.customerUniquename, this.invoiceFormDetails.activeAccountUniqueName],
                voucherType: 'receipt',
                subVoucherType: this.adjustedVoucherType === AdjustedVoucherType.AdvanceReceipt ? SubVoucher.AdvanceReceipt : undefined
            }
            this.salesService.getInvoiceList(requestObject, this.invoiceFormDetails.voucherDetails.voucherDate).subscribe((response) => {
                console.log('Response received: ', response);
                if (response && response.body) {
                    this.allAdvanceReceiptResponse = response.body.results
                    this.adjustVoucherOptions = [];
                    if (this.allAdvanceReceiptResponse && this.allAdvanceReceiptResponse.length) {
                        this.allAdvanceReceiptResponse.forEach(item => {
                            if (item) {
                                item.voucherDate = item.voucherDate.replace(/-/g, '/');
                                this.adjustVoucherOptions.push({ value: item.uniqueName, label: item.voucherNumber, additional: item });
                                this.newAdjustVoucherOptions.push({ value: item.uniqueName, label: item.voucherNumber, additional: item });
                            }
                        });
                    } else {
                        this.toaster.warningToast("There is no advanced receipt for adjustment.");
                    }
                }
            });
        } else {
            this.getAllAdvanceReceipts();
        }
        if (this.isUpdateMode) {
            this.calculateBalanceDue();
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
        // TODO: This warning is removed as this is suggestion from testing team please remove it after approval
        // if (this.adjustPayment && this.adjustPayment.totalAdjustedAmount && this.adjustPayment.grandTotal && this.adjustPayment.totalAdjustedAmount - this.adjustPayment.grandTotal > 0) {
        //     this.toaster.warningToast('The adjusted amount of the linked invoice\'s is more than this receipt due amount');
        //     return;
        // }
        this.adjustVoucherForm.adjustments = this.adjustVoucherForm.adjustments.filter(item => {
            return item.voucherNumber !== '' || item.balanceDue.amountForAccount > 0;
        });
        this.closeModelEvent.emit({
            adjustVoucherData: this.adjustVoucherForm,
            adjustPaymentData: this.adjustPayment
        });
    }

    /**
     * To clear advance receipt adjustment form
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public onClear(): void {
        this.adjustVoucherForm = {
            tdsTaxUniqueName: '',
            tdsAmount: {
                amountForAccount: 0
            },
            description: '',
            adjustments: [
                {
                    voucherNumber: '',
                    balanceDue: {
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
            subTotal: Number(this.invoiceFormDetails.voucherDetails.subTotal),
            tcsTotal: Number(this.invoiceFormDetails.voucherDetails.tcsTotal),
            tdsTotal: Number(this.invoiceFormDetails.voucherDetails.tdsTotal)
        });
        if (this.getBalanceDue() > 0) {
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
                        if (this.allAdvanceReceiptResponse && this.allAdvanceReceiptResponse.length) {
                            this.allAdvanceReceiptResponse.forEach(item => {
                                if (item) {
                                    item.voucherDate = item.voucherDate.replace(/-/g, '/');
                                    this.adjustVoucherOptions.push({ value: item.uniqueName, label: item.voucherNumber, additional: item });
                                    this.newAdjustVoucherOptions.push({ value: item.uniqueName, label: item.voucherNumber, additional: item });
                                }
                            });
                        } else {
                            this.toaster.warningToast("There is no advanced receipt for adjustment.");
                        }
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
    public addNewBlankAdjustVoucherRow(): any {
        if (this.getBalanceDue() >= 0) {
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
            this.toaster.warningToast(this.exceedDueErrorMessage);
            this.isInvalidForm = true;
        }
        this.checkValidations();
    }

    /**
     *  To remove entry from advance receipt adjustment by given index (At least one entry required)
     *
     * @param {number} index Index number
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public deleteAdjustVoucherRow(index: number): void {
        let selectedItem = this.newAdjustVoucherOptions.find(item => item.value === this.adjustVoucherForm.adjustments[index].uniqueName);
        if (selectedItem && selectedItem.value && selectedItem.label && selectedItem.additional) {
            this.adjustVoucherOptions.push({ value: selectedItem.value, label: selectedItem.label, additional: selectedItem.additional });
        }
        this.adjustVoucherOptions = _.uniqBy(this.adjustVoucherOptions, (item) => {
            return item.value && item.label.trim();
        });
        if (this.adjustVoucherForm.adjustments.length > 1) {
            this.adjustVoucherForm.adjustments.splice(index, 1);
        } else {
            this.onClear();
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
        if (!Number(event) && this.adjustVoucherForm && this.adjustVoucherForm.tdsTaxUniqueName) {
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
    public saveAdjustAdvanceReceipt(form: NgForm): void {
        let isValid: boolean = true;
        if (this.getBalanceDue() < 0) {
            this.toaster.errorToast(this.exceedDueErrorMessage);
            isValid = false;
        }
        this.adjustVoucherForm.adjustments.map(item => {
            if (item && item.voucherDate) {
                if (typeof item.voucherDate === 'string') {
                    item.voucherDate = item.voucherDate.replace(/\//g, '-');
                }
            }
        });
        if (this.adjustVoucherForm && this.adjustVoucherForm.adjustments && this.adjustVoucherForm.adjustments.length > 0) {
            this.adjustVoucherForm.adjustments.forEach((item, key) => {
                if (!item.voucherNumber && item.balanceDue.amountForAccount) {
                    isValid = false;
                    form.controls[`voucherName${key}`].markAsTouched();
                } else if (item.voucherNumber && !item.balanceDue.amountForAccount) {
                    isValid = false;
                    form.controls[`amount${key}`].markAsTouched();
                }
            });
            this.adjustVoucherForm.adjustments = this.adjustVoucherForm.adjustments.filter(item => {
                return item.voucherNumber !== '' || item.balanceDue.amountForAccount > 0;
            });
        }
        if (this.isTaxDeducted) {
            if (this.adjustVoucherForm.tdsTaxUniqueName === '') {
                if (this.tdsTypeBox && this.tdsTypeBox.nativeElement)
                    this.tdsTypeBox.nativeElement.classList.add('error-box');
                    isValid = false;
            } else if (this.adjustVoucherForm.tdsAmount === 0) {
                if (this.tdsAmountBox && this.tdsAmountBox.nativeElement) {
                    this.tdsAmountBox.nativeElement.classList.add('error-box');
                    isValid = false;
                }
            }
        } else {
            delete this.adjustVoucherForm['tdsAmount'];
            delete this.adjustVoucherForm['description'];
            delete this.adjustVoucherForm['tdsTaxUniqueName'];
        }
        if (isValid) {
            this.submitClicked.emit({
                adjustVoucherData: this.adjustVoucherForm,
                adjustPaymentData: this.adjustPayment
            });
        }
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
    public clickSelectVoucher(index: number, form: NgForm): any {
        form.controls[`voucherName${index}`].markAsTouched();
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
     * @param {boolean} is To check is amount field changed
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public calculateTax(entryData: Adjustment, index: number): void {
        entryData.balanceDue.amountForCompany = entryData.balanceDue.amountForAccount;
        let entry: Adjustment = cloneDeep(entryData);
        // Object of selected voucher
        let selectedVoucherOptions;
        // Object of selected voucher which was adjusted earlier
        let selectedVoucherPreAdjusted;
        // Amount: remaining adjusted amount + earlier adjusted amount
        let excessAmount = 0;

        if (entryData && this.newAdjustVoucherOptions && this.newAdjustVoucherOptions.length) {
            selectedVoucherOptions = this.newAdjustVoucherOptions.find(item => {
                return item.label === entryData.voucherNumber;
            });
        }
        if (entryData && this.advanceReceiptAdjustmentPreUpdatedData && this.advanceReceiptAdjustmentPreUpdatedData.adjustments && this.advanceReceiptAdjustmentPreUpdatedData.adjustments.length) {
            selectedVoucherPreAdjusted = this.advanceReceiptAdjustmentPreUpdatedData.adjustments.find(item => {
                return item.voucherNumber === entryData.voucherNumber;
            });
        }
        if (selectedVoucherOptions && selectedVoucherPreAdjusted && selectedVoucherOptions.additional.balanceDue && selectedVoucherPreAdjusted.balanceDue) {
            excessAmount = selectedVoucherOptions.additional.balanceDue.amountForAccount + selectedVoucherPreAdjusted.balanceDue.amountForAccount;
        } else {
            if (selectedVoucherOptions && selectedVoucherOptions.additional && selectedVoucherOptions.additional.balanceDue) {
                excessAmount = selectedVoucherOptions.additional.balanceDue.amountForAccount;
            }
        }
        // To restrict user to enter amount less or equal selected voucher amount
        if (selectedVoucherOptions && selectedVoucherOptions.additional && selectedVoucherOptions.additional.balanceDue && this.adjustVoucherForm.adjustments[index].balanceDue.amountForAccount > excessAmount) {
            this.adjustVoucherForm.adjustments[index].balanceDue.amountForAccount = cloneDeep(excessAmount);
            entry.balanceDue.amountForAccount = excessAmount;
            this.adjustVoucherForm.adjustments = cloneDeep(this.adjustVoucherForm.adjustments);
        }
        if (entry && entry.taxRate && entry.balanceDue.amountForAccount) {
            let taxAmount = this.calculateInclusiveTaxAmount(entry.balanceDue.amountForAccount, entry.taxRate);
            this.adjustVoucherForm.adjustments[index].calculatedTaxAmount = Number(taxAmount);
        } else {
            this.adjustVoucherForm.adjustments[index].calculatedTaxAmount = 0.0;
        }
        this.calculateBalanceDue();
        this.checkValidations();
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
                if (item && item.balanceDue && item.balanceDue.amountForAccount) {
                    totalAmount += Number(item.balanceDue.amountForAccount);
                }
            });
            // this.adjustPayment.balanceDue = Number(this.adjustPayment.grandTotal.) - Number(totalAmount);
            this.adjustPayment.totalAdjustedAmount = Number(totalAmount);
            this.exceedDueAmount = this.getBalanceDue();
            if (this.exceedDueAmount < 0) {
                this.isInvalidForm = true;
            } else {
                this.isInvalidForm = false;
            }
        }
    }
    /**
     * return remaining due after adjustment with advance receipts
     *
     * @returns {number} Balance due
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public getBalanceDue(): number {
        return parseFloat(Number(this.adjustPayment.grandTotal + this.adjustPayment.tcsTotal - this.adjustPayment.totalAdjustedAmount - this.depositAmount - this.adjustPayment.tdsTotal).toFixed(2));
    }

    /**
     * To check form validation
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public checkValidations(): void {
        if (this.adjustVoucherForm && this.adjustVoucherForm.adjustments && this.adjustVoucherForm.adjustments.length > 0) {
            this.adjustVoucherForm.adjustments.forEach((item, key) => {
                if ((!item.voucherNumber && item.balanceDue.amountForAccount) || (item.voucherNumber && !item.balanceDue.amountForAccount) || (!item.voucherNumber && !item.balanceDue.amountForAccount && key>0)) {
                    this.isInvalidForm = true;
                } else {
                    this.isInvalidForm = false;
                }
            });
        }
    }
}

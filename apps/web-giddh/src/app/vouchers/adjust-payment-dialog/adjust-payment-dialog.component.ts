import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { VoucherComponentStore } from '../utility/vouchers.store';
import { Observable, ReplaySubject, of, takeUntil } from 'rxjs';
import * as dayjs from 'dayjs';
import { AdjustedVoucherType, SubVoucher } from '../../app.constant';
import { VoucherTypeEnum } from '../utility/vouchers.const';
import { AdjustmentUtilityService } from '../../shared/advance-receipt-adjustment/services/adjustment-utility.service';
import { IOption } from '../../theme/ng-select/ng-select';
import { AdjustAdvancePaymentModal, Adjustment, AdvanceReceiptRequest, VoucherAdjustments } from '../../models/api-models/AdvanceReceiptsAdjust';
import { GeneralService } from '../../services/general.service';
import { cloneDeep, uniqBy } from '../../lodash-optimized';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { ToasterService } from '../../services/toaster.service';
import { NgForm } from '@angular/forms';
import { VoucherService } from '../../services/voucher.service';

const NO_ADVANCE_RECEIPT_FOUND = 'There is no advanced receipt for adjustment.';

@Component({
    selector: 'voucher-adjustments',
    templateUrl: './adjust-payment-dialog.component.html',
    styleUrls: ['./adjust-payment-dialog.component.scss']
})
export class AdjustPaymentDialogComponent implements OnInit, OnDestroy {
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
    public currencySymbol: string = '';
    public inputMaskFormat: string = '';
    public isInvalidForm: boolean = false;
    /** Message for toaster when due amount get negative  */
    public exceedDueErrorMessage: string = 'The adjusted amount of the linked invoice is more than this receipt due amount';
    /** Exceed Amount from invoice amount after adjustment */
    public exceedDueAmount: number = 0;
    /** True, if form is reset, used to avoid calculation as required sh-select auto-fills the value if only single option is present  */
    public isFormReset: boolean;
    /** True, if account currency is different than company currency */
    public isMultiCurrencyAccount: boolean;
    /** Stores the multi-lingual label of current voucher */
    public currentVoucherLabel: string;
    @ViewChild('tdsTypeBox', { static: true }) public tdsTypeBox: ElementRef;
    @ViewChild('tdsAmountBox', { static: true }) public tdsAmountBox: ElementRef;

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
        convertedTotalAdjustedAmount: 0,
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
    @Input() public account;
    @Input() public isModal: boolean = true;
    @Input() public voucherDetails;
    @Input() public isUpdateMode;
    @Input() public depositAmount = 0;
    /** To use pre adjusted data which was adjusted earlier or in other trasaction by user */
    @Input() public advanceReceiptAdjustmentUpdatedData: VoucherAdjustments;
    /** Stores the type of voucher adjustment */
    @Input() public adjustedVoucherType: AdjustedVoucherType;
    /** True if the current module is voucher module required as all voucher adjustments are not supported from API */
    @Input() public isVoucherModule: boolean;
    /** Stores the voucher eligible for adjustment */
    @Input() public voucherForAdjustment: Array<Adjustment>;
    /** Holds input to get invoice list request params */
    @Input() public invoiceListRequestParams: any;
    /** True if it's payment or receipt entry */
    @Input() public isPaymentReceipt: boolean = false;
    /** Holds voucher totals */
    @Input() public voucherTotals: any;
    /** Close modal event emitter */
    @Output() public closeModelEvent: EventEmitter<{ adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }> = new EventEmitter();
    /** Submit modal event emitter */
    @Output() public submitClicked: EventEmitter<{ adjustVoucherData: VoucherAdjustments, adjustPaymentData: AdjustAdvancePaymentModal }> = new EventEmitter();
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True, if multi-currency support to voucher adjustment is enabled */
    public enableVoucherAdjustmentMultiCurrency: boolean;
    /** Current page for reference vouchers */
    private referenceVouchersCurrentPage: number = 1;
    /** Reference voucher search field */
    private searchReferenceVoucher: any = "";
    /** Invoice list observable */
    public adjustVoucherOptions$: Observable<any[]>;
    /** Holds index of current adjustment row */
    private currentAdjustmentRowIndex: number = 0;
    /** Decimal places from company settings */
    public giddhBalanceDecimalPlaces: number = 2;
    /** Holds company specific data */
    public settings: any = {
        baseCurrency: '',
        baseCurrencySymbol: '',
        accountCurrencySymbol: '',
        inputMaskFormat: '',
        giddhBalanceDecimalPlaces: 2
    };

    constructor(
        private componentStore: VoucherComponentStore,
        private adjustmentUtilityService: AdjustmentUtilityService,
        private generalService: GeneralService,
        private toasterService: ToasterService,
        private voucherService: VoucherService
    ) { }

    /**
     * Life cycle hook
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public ngOnInit() {
        this.adjustVoucherForm = new VoucherAdjustments();
        this.onClear();

        this.componentStore.companyProfile$.pipe(takeUntil(this.destroyed$)).subscribe(profile => {
            if (profile && Object.keys(profile).length) {
                this.companyCurrency = profile?.baseCurrency || 'INR';
                this.baseCurrencySymbol = profile.baseCurrencySymbol;
                this.inputMaskFormat = profile?.balanceDisplayFormat ? profile?.balanceDisplayFormat?.toLowerCase() : '';
                if (this.account?.baseCurrencySymbol) {
                    this.currencySymbol = this.account.baseCurrencySymbol;
                } else {
                    this.currencySymbol = this.baseCurrencySymbol;
                }
                this.giddhBalanceDecimalPlaces = profile?.balanceDecimalPlaces;
            }
        });

        if (this.advanceReceiptAdjustmentUpdatedData) {
            this.advanceReceiptAdjustmentPreUpdatedData = cloneDeep(this.advanceReceiptAdjustmentUpdatedData);
            this.adjustVoucherForm = this.advanceReceiptAdjustmentUpdatedData?.adjustments?.length ? cloneDeep(this.advanceReceiptAdjustmentUpdatedData) : this.adjustVoucherForm;
            if (this.advanceReceiptAdjustmentUpdatedData && this.advanceReceiptAdjustmentUpdatedData.adjustments && this.advanceReceiptAdjustmentUpdatedData.adjustments.length && this.advanceReceiptAdjustmentUpdatedData.tdsTaxUniqueName) {
                this.isTaxDeducted = true;
            } else {
                this.isTaxDeducted = false;
            }
        } else {
            this.onClear();
        }

        if (this.voucherDetails) {
            if (typeof this.voucherDetails.date !== 'string') {
                this.voucherDetails.date = dayjs(this.voucherDetails.date).format(GIDDH_DATE_FORMAT);
            }
            this.assignVoucherDetails();
        }

        if (this.account) {
            this.account.baseCurrency = this.account?.baseCurrency || this.companyCurrency;
            this.isMultiCurrencyAccount = this.account?.baseCurrency !== this.companyCurrency;
        }

        if (!this.isVoucherModule) {
            this.getInvoiceList();
        } else {
            if (!this.voucherForAdjustment) {
                this.getAllAdvanceReceipts();
            } else {
                if (this.voucherForAdjustment && this.voucherForAdjustment.length) {
                    this.adjustVoucherOptions = [];
                    this.voucherForAdjustment.forEach(item => {
                        if (item) {
                            if (!item?.adjustmentAmount) {
                                item.adjustmentAmount = cloneDeep(item.balanceDue);
                            }
                            item.voucherDate = item.voucherDate?.replace(/-/g, '/');
                            item.accountCurrency = item.accountCurrency ?? item.currency ?? { symbol: this.baseCurrencySymbol, code: this.companyCurrency };
                            item.voucherNumber = this.generalService.getVoucherNumberLabel(item.voucherType, item.voucherNumber, this.commonLocaleData);
                            this.adjustVoucherOptions.push({ value: item.uniqueName, label: item.voucherNumber, additional: item });
                            this.newAdjustVoucherOptions.push({ value: item.uniqueName, label: item.voucherNumber, additional: item });
                        }
                    });
                    this.assignCurrencyInAdjustVoucherForm();
                } else {
                    if ((!this.adjustVoucherForm?.adjustments?.length || !this.adjustVoucherForm?.adjustments[0]?.uniqueName) && this.isVoucherModule) {
                        this.toasterService.showSnackBar("warning", NO_ADVANCE_RECEIPT_FOUND);
                    }
                }
            }
        }

        this.calculateBalanceDue();

        this.componentStore.company$.pipe(takeUntil(this.destroyed$)).subscribe((obj) => {
            if (obj && obj.taxes) {
                this.availableTdsTaxes = [];
                obj.taxes.forEach(item => {
                    if (item && (item.taxType === 'tdsrc' || item.taxType === 'tdspay')) {
                        this.availableTdsTaxes.push({ value: item.uniqueName, label: item.name, additional: item })
                    }
                });
            }
        });
        this.enableVoucherAdjustmentMultiCurrency = enableVoucherAdjustmentMultiCurrency;
    }

    /**
     * To close adjust payment modal
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public onCancel(): void {
        if (this.adjustVoucherForm && this.adjustVoucherForm.adjustments) {
            this.adjustVoucherForm.adjustments = this.adjustVoucherForm.adjustments?.filter(item => {
                return item?.voucherNumber !== '' || item?.adjustmentAmount?.amountForAccount > 0;
            });
        }
        this.closeModelEvent.emit({
            adjustVoucherData: this.adjustVoucherForm,
            adjustPaymentData: this.adjustPayment
        });
    }

    /**
     * To clear advance receipt adjustment form
     *
     * @param {boolean} isFormReset True, if form is reset
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public onClear(isFormReset?: boolean): void {
        this.isFormReset = isFormReset;
        this.adjustVoucherForm = {
            tdsTaxUniqueName: '',
            tdsAmount: {
                amountForAccount: 0
            },
            description: '',
            adjustments: this.resetAdjustments()
        };

        this.calculateBalanceDue();

        if (isFormReset) {
            setTimeout(() => {
                this.isFormReset = false;
            });
        }
    }

    /**
     * Assign all voucher details which get from parent component
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public assignVoucherDetails(): void {
        if (!this.isVoucherModule) {
            const customerDetails = this.adjustmentUtilityService.getAdjustedCustomer(this.invoiceListRequestParams);
            if (customerDetails?.customerName) {
                this.voucherDetails.customerName = customerDetails.customerName;
                this.voucherDetails.customerUniquename = customerDetails.customerUniquename;
            }
        }

        this.adjustPayment = Object.assign(this.adjustPayment, {
            balanceDue: Number(this.voucherTotals.balanceDue),
            grandTotal: Number(this.voucherTotals.grandTotal),
            customerName: this.voucherDetails.account.customerName,
            customerUniquename: this.voucherDetails.account.uniqueName,
            voucherDate: this.voucherDetails.date,
            totalTaxableValue: Number(this.voucherTotals.totalTaxableValue),
            subTotal: Number(this.voucherTotals.totalAmount),
            tcsTotal: Number(this.voucherTotals.tcsTotal),
            tdsTotal: Number(this.voucherTotals.tdsTotal)
        });

        if (this.getBalanceDue() > 0) {
            this.isInvalidForm = true;
        }

        this.balanceDueAmount = this.voucherTotals.balanceDue;
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

            const requestObject = {
                accountUniqueName: this.getAllAdvanceReceiptsRequest.accountUniqueName,
                voucherType: this.adjustedVoucherType,
                number: '',
                page: 1
            }

            requestObject.number = this.searchReferenceVoucher;

            if (requestObject.number) {
                this.resetInvoiceList();
            }

            requestObject.page = this.referenceVouchersCurrentPage;
            this.referenceVouchersCurrentPage++;

            this.componentStore.getVouchersList({ request: requestObject, date: this.getAllAdvanceReceiptsRequest.invoiceDate });
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
            if (this.adjustVoucherForm && this.adjustVoucherForm.adjustments) {
                this.adjustVoucherForm.adjustments.forEach(item => {
                    if (!item?.uniqueName || !item.voucherNumber) {
                        isAnyBlankEntry = true;
                    }
                });
            }

            if (isAnyBlankEntry) {
                this.isInvalidForm = false;
                return;
            } else {
                this.adjustVoucherForm.adjustments.push(new Adjustment());
                this.isInvalidForm = false;
            }
        } else {
            this.toasterService.showSnackBar("warning", this.exceedDueErrorMessage);
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
        let selectedItem = this.newAdjustVoucherOptions.find(item => item?.value === this.adjustVoucherForm.adjustments[index]?.uniqueName);
        if (selectedItem && selectedItem?.value && selectedItem.label && selectedItem.additional) {
            this.adjustVoucherOptions.push({ value: selectedItem?.value, label: selectedItem.label, additional: selectedItem.additional });
        }
        this.adjustVoucherOptions = _.uniqBy(this.adjustVoucherOptions, (item) => {
            if (item.label === '-') {
                return item?.value;
            } else {
                return item?.value && item.label?.trim();
            }
        });
        if (this.adjustVoucherForm?.adjustments?.length > 1 || this.adjustVoucherForm?.adjustments.every(adjustment => adjustment?.uniqueName !== '')) {
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
            this.adjustVoucherForm.tdsTaxUniqueName = cloneDeep(event?.value);
            this.adjustVoucherForm.tdsAmount.amountForAccount = cloneDeep(this.tdsAmount);
            this.changeTdsAmount(this.tdsAmount);
            this.tdsTypeBox?.nativeElement?.classList?.remove('error-box');
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
            if (this.tdsAmountBox && this.tdsAmountBox.nativeElement) {
                this.tdsAmountBox.nativeElement.classList.add('error-box');
            }
        } else {
            if (this.tdsAmountBox && this.tdsAmountBox.nativeElement) {
                this.tdsAmountBox.nativeElement.classList.remove('error-box');
            }
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
        return Number(taxAmount.toFixed(this.giddhBalanceDecimalPlaces));
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
        return Number(taxAmount.toFixed(this.giddhBalanceDecimalPlaces));
    }

    /**
     * To save advance receipt adjustment
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public saveAdjustAdvanceReceipt(form: NgForm): void {
        let isValid: boolean = true;
        if (this.getBalanceDue() < 0) {
            this.toasterService.showSnackBar("error", this.exceedDueErrorMessage);
            isValid = false;
        }
        if (this.adjustVoucherForm && this.adjustVoucherForm.adjustments && this.adjustVoucherForm.adjustments.length > 0) {
            this.adjustVoucherForm.adjustments.map(item => {
                if (item && item.voucherDate) {
                    if (typeof item.voucherDate === 'string') {
                        item.voucherDate = item.voucherDate?.replace(/\//g, '-');
                    }
                }
            });

            this.adjustVoucherForm.adjustments.forEach((item, key) => {
                if (!item?.voucherNumber && item?.adjustmentAmount?.amountForAccount) {
                    isValid = false;
                    if (form.controls[`voucherName${key}`]) {
                        form.controls[`voucherName${key}`].markAsTouched();
                    }
                } else if (item?.voucherNumber && !item?.adjustmentAmount?.amountForAccount) {
                    isValid = false;
                    if (form.controls[`amount${key}`]) {
                        form.controls[`amount${key}`].markAsTouched();
                    }
                }
            });
            this.adjustVoucherForm.adjustments = this.adjustVoucherForm.adjustments?.filter(item => {
                return item?.voucherNumber !== '' || item?.adjustmentAmount?.amountForAccount > 0;
            });
        }

        if (this.isTaxDeducted) {
            if (this.adjustVoucherForm.tdsTaxUniqueName === '') {
                if (this.tdsTypeBox && this.tdsTypeBox.nativeElement)
                    this.tdsTypeBox.nativeElement.classList.add('error-box');
                isValid = false;
            } else if (this.adjustVoucherForm.tdsAmount.amountForAccount === 0) {
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
        if (event && entry && !this.isFormReset) {
            entry = cloneDeep(event.additional);
            if (entry?.uniqueName) {
                this.adjustVoucherForm.adjustments.splice(index, 1, entry);
                this.calculateTax(entry, index);
            } else {
                this.adjustVoucherForm.adjustments[index] = new Adjustment();
            }
            this.checkValidations();
        }
    }

    /**
     *  To handle click event of selected voucher sh-select
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public clickSelectVoucher(index: number, form: NgForm): any {
        this.currentAdjustmentRowIndex = index;
        if (form.controls[`voucherName${index}`]) {
            form.controls[`voucherName${index}`].markAsTouched();
        }
        this.adjustVoucherOptions = this.getAdvanceReceiptUnselectedVoucher();

        if (this.adjustVoucherForm && this.adjustVoucherForm.adjustments && this.adjustVoucherForm.adjustments.length && this.adjustVoucherForm.adjustments[index] && this.adjustVoucherForm.adjustments[index].voucherNumber) {
            let selectedItem = this.newAdjustVoucherOptions.find(item => item?.value === this.adjustVoucherForm.adjustments[index]?.uniqueName);
            if (selectedItem) {
                delete selectedItem['isHilighted'];
                this.adjustVoucherOptions.splice(0, 0, { value: selectedItem?.value, label: selectedItem.label, additional: selectedItem.additional })
            }
        }
        this.adjustVoucherOptions = uniqBy(this.adjustVoucherOptions, (item) => {
            if (item.label === '-' || item.label === this.commonLocaleData?.app_not_available) {
                return item?.value;
            } else {
                return item?.value && item.label.trim();
            }
        });

        this.adjustVoucherOptions$ = of(this.adjustVoucherOptions);
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

        for (let i = options?.length - 1; i >= 0; i--) {
            for (let j = 0; j < adjustVoucherAdjustment?.length; j++) {
                if (options[i] && options[i].label && adjustVoucherAdjustment[j] && adjustVoucherAdjustment[j].voucherNumber &&
                    options[i]?.value && adjustVoucherAdjustment[j].uniqueName &&
                    ((options[i].label.trim() !== '-' && options[i].label.trim() !== this.commonLocaleData?.app_not_available && adjustVoucherAdjustment[j].voucherNumber.trim() !== '-' && adjustVoucherAdjustment[j].voucherNumber.trim() !== this.commonLocaleData?.app_not_available && options[i].label.trim() === adjustVoucherAdjustment[j].voucherNumber.trim()) ||
                        ((options[i].label.trim() === '-' || options[i].label.trim() === this.commonLocaleData?.app_not_available) && (adjustVoucherAdjustment[j].voucherNumber.trim() === '-' || adjustVoucherAdjustment[j].voucherNumber.trim() === this.commonLocaleData?.app_not_available) && options[i]?.value && adjustVoucherAdjustment[j].uniqueName && options[i]?.value.trim() === adjustVoucherAdjustment[j].uniqueName.trim()))) {
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
            if (item.label === '-' || item.label === this.commonLocaleData?.app_not_available) {
                return item.value;
            } else {
                return item.value && item.label.trim();
            }
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
        if (this.isMultiCurrencyAccount) {
            entryData.adjustmentAmount.amountForCompany = this.getConvertedCompanyAmount(entryData?.adjustmentAmount?.amountForAccount, entryData?.exchangeRate);
        } else {
            entryData.adjustmentAmount.amountForCompany = entryData?.adjustmentAmount?.amountForAccount;
        }
        let entry: Adjustment = cloneDeep(entryData);
        // Object of selected voucher
        let selectedVoucherOptions;
        // Object of selected voucher which was adjusted earlier
        let selectedVoucherPreAdjusted;
        // Stores the index of pre-adjusted voucher, required to avoid doubling of amount when same voucher is selected
        let selectedVoucherPreAdjustedIndex;
        // Amount: remaining adjusted amount + earlier adjusted amount
        let excessAmount = 0;

        if (entryData && this.newAdjustVoucherOptions && this.newAdjustVoucherOptions.length) {
            selectedVoucherOptions = this.newAdjustVoucherOptions.find(item => {
                if (item.label !== '-' && item.label !== this.commonLocaleData?.app_not_available) {
                    return item.label === entryData.voucherNumber;
                } else {
                    return item.value === entryData?.uniqueName;
                }
            });
        }
        if (entryData && this.advanceReceiptAdjustmentPreUpdatedData && this.advanceReceiptAdjustmentPreUpdatedData.adjustments && this.advanceReceiptAdjustmentPreUpdatedData.adjustments.length) {
            selectedVoucherPreAdjusted = this.advanceReceiptAdjustmentPreUpdatedData.adjustments.find((item, index) => {
                if (item.voucherNumber !== '-') {
                    if (item.voucherNumber === entryData.voucherNumber) {
                        selectedVoucherPreAdjustedIndex = index;
                    }
                    return item.voucherNumber === entryData.voucherNumber;
                } else {
                    if (item?.uniqueName === entryData?.uniqueName) {
                        selectedVoucherPreAdjustedIndex = index;
                    }
                    return item?.uniqueName === entryData?.uniqueName;
                }
            });
        }
        if (selectedVoucherOptions && selectedVoucherPreAdjusted && selectedVoucherOptions.additional.balanceDue && selectedVoucherPreAdjusted?.adjustmentAmount && selectedVoucherPreAdjustedIndex !== index) {
            excessAmount = selectedVoucherOptions.additional.balanceDue.amountForAccount + selectedVoucherPreAdjusted?.adjustmentAmount?.amountForAccount;
        } else {
            if (selectedVoucherOptions && selectedVoucherOptions.additional && selectedVoucherOptions.additional.balanceDue) {
                excessAmount = selectedVoucherOptions.additional.balanceDue.amountForAccount;
            }
        }
        // To restrict user to enter amount less or equal selected voucher amount
        if (selectedVoucherOptions && selectedVoucherOptions.additional && selectedVoucherOptions.additional.adjustmentAmount && this.adjustVoucherForm.adjustments[index].adjustmentAmount.amountForAccount > excessAmount) {
            this.adjustVoucherForm.adjustments[index].adjustmentAmount.amountForAccount = cloneDeep(excessAmount);
            entry.adjustmentAmount.amountForAccount = excessAmount;
            this.adjustVoucherForm.adjustments = cloneDeep(this.adjustVoucherForm.adjustments);
        }
        if (entry && entry.taxRate && entry.adjustmentAmount?.amountForAccount) {
            let taxAmount = this.calculateInclusiveTaxAmount(entry.adjustmentAmount.amountForAccount, entry.taxRate);
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
        let totalAmount: number = 0;
        let convertedTotalAmount: number = 0;
        if (this.adjustVoucherForm && this.adjustVoucherForm.adjustments && this.adjustVoucherForm.adjustments.length) {
            this.adjustPayment.balanceDue = this.voucherTotals?.balanceDue;
            this.adjustVoucherForm.adjustments.forEach(item => {
                if (item && item.adjustmentAmount && item.adjustmentAmount.amountForAccount) {
                    if (
                        ((this.adjustedVoucherType === AdjustedVoucherType.SalesInvoice || this.adjustedVoucherType === AdjustedVoucherType.Sales) && item.voucherType === AdjustedVoucherType.DebitNote) ||
                        ((this.adjustedVoucherType === AdjustedVoucherType.PurchaseInvoice || this.adjustedVoucherType === AdjustedVoucherType.Purchase) && item.voucherType === AdjustedVoucherType.CreditNote) ||
                        (this.adjustedVoucherType === AdjustedVoucherType.DebitNote && item.voucherType === AdjustedVoucherType.OpeningBalance && item.voucherBalanceType === "dr") ||
                        ((this.adjustedVoucherType === AdjustedVoucherType.DebitNote || this.adjustedVoucherType === AdjustedVoucherType.SalesInvoice || this.adjustedVoucherType === AdjustedVoucherType.Sales || this.adjustedVoucherType === AdjustedVoucherType.Payment) && (item.voucherType === AdjustedVoucherType.Journal || item.voucherType === AdjustedVoucherType.JournalVoucher) && item.voucherBalanceType === "dr") ||
                        (this.adjustedVoucherType === AdjustedVoucherType.CreditNote && item.voucherType === AdjustedVoucherType.OpeningBalance && item.voucherBalanceType === "cr") ||
                        ((this.adjustedVoucherType === AdjustedVoucherType.CreditNote || this.adjustedVoucherType === AdjustedVoucherType.Purchase || this.adjustedVoucherType === AdjustedVoucherType.Receipt || this.adjustedVoucherType === AdjustedVoucherType.AdvanceReceipt) && (item.voucherType === AdjustedVoucherType.Journal || item.voucherType === AdjustedVoucherType.JournalVoucher) && item.voucherBalanceType === "cr") ||
                        (this.voucherDetails.type === "dr" && (this.adjustedVoucherType === AdjustedVoucherType.OpeningBalance && (item.voucherType === AdjustedVoucherType.Journal || item.voucherType === AdjustedVoucherType.JournalVoucher) || (this.adjustedVoucherType === AdjustedVoucherType.Journal || this.adjustedVoucherType === AdjustedVoucherType.JournalVoucher) && item.voucherType === AdjustedVoucherType.OpeningBalance) && item.voucherBalanceType === "dr") ||
                        (this.voucherDetails.type === "cr" && (this.adjustedVoucherType === AdjustedVoucherType.OpeningBalance && (item.voucherType === AdjustedVoucherType.Journal || item.voucherType === AdjustedVoucherType.JournalVoucher) || (this.adjustedVoucherType === AdjustedVoucherType.Journal || this.adjustedVoucherType === AdjustedVoucherType.JournalVoucher) && item.voucherType === AdjustedVoucherType.OpeningBalance) && item.voucherBalanceType === "cr")
                    ) {
                        totalAmount -= Number(item.adjustmentAmount.amountForAccount);
                        convertedTotalAmount -= item.adjustmentAmount.amountForCompany;
                    } else {
                        totalAmount += Number(item.adjustmentAmount.amountForAccount);
                        convertedTotalAmount += item.adjustmentAmount.amountForCompany;
                    }
                }
            });
        }

        this.adjustPayment.totalAdjustedAmount = Number(totalAmount);
        this.adjustPayment.convertedTotalAdjustedAmount = Number(convertedTotalAmount);
        this.exceedDueAmount = this.getBalanceDue();
        if (this.exceedDueAmount < 0) {
            this.isInvalidForm = true;
        } else {
            this.isInvalidForm = false;
        }
    }

    /**
     * Return remaining due after adjustment with advance receipts
     *
     * @returns {number} Balance due
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public getBalanceDue(): number {
        if (this.isPaymentReceipt) {
            return parseFloat(Number(this.adjustPayment.grandTotal - this.adjustPayment.totalAdjustedAmount - this.depositAmount).toFixed(this.giddhBalanceDecimalPlaces));
        } else {
            return parseFloat(Number(this.adjustPayment.grandTotal + this.adjustPayment.tcsTotal - this.adjustPayment.totalAdjustedAmount - this.depositAmount - this.adjustPayment.tdsTotal).toFixed(this.giddhBalanceDecimalPlaces));
        }
    }

    /**
     * Returns remaining due in company currency after adjustment with advance receipts
     *
     * @returns {number} Balance due
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public getConvertedBalanceDue(): number {
        return parseFloat(Number(
            this.getConvertedCompanyAmount(this.adjustPayment?.grandTotal, this.voucherDetails?.exchangeRate) +
            this.adjustPayment.tcsTotal - this.adjustPayment.convertedTotalAdjustedAmount - this.depositAmount - this.adjustPayment.tdsTotal).toFixed(this.giddhBalanceDecimalPlaces));
    }

    /**
     * To check form validation
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public checkValidations(): void {
        this.isInvalidForm = false;
        if (this.adjustVoucherForm && this.adjustVoucherForm.adjustments && this.adjustVoucherForm.adjustments.length > 0) {
            this.adjustVoucherForm.adjustments.forEach((item, key) => {
                if ((!item?.voucherNumber && item?.adjustmentAmount?.amountForAccount) || (item?.voucherNumber && !item?.adjustmentAmount?.amountForAccount) || (!item?.voucherNumber && !item?.adjustmentAmount?.amountForAccount && this.adjustVoucherForm.adjustments.length > 0)) {
                    this.isInvalidForm = true;
                }
            });
        } else {
            this.isInvalidForm = true;
        }
    }

    /**
     * Returns true if the voucher adjustment EDIT operation is supported
     *
     * @readonly
     * @type {boolean} True if the voucher adjustment EDIT operation is supported
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public shouldDisableEdit(item: Adjustment): boolean {
        return this.isVoucherModule && item.voucherType && !(item.voucherType === 'receipt' && item.subVoucher === SubVoucher.AdvanceReceipt);
    }

    /**
     * Resets the adjustment except linked adjustments
     *
     * @private
     * @return {*}  {Adjustment[]} New adjustments array
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    private resetAdjustments(): Adjustment[] {
        if (!this.isVoucherModule) {
            // Operation performed in Ledger
            const linkedAdjustments = this.adjustVoucherForm.adjustments?.filter(adjustment => adjustment.linkingAdjustment);
            return linkedAdjustments?.length ? linkedAdjustments : [
                {
                    voucherNumber: '',
                    balanceDue: {
                        amountForAccount: 0,
                        amountForCompany: 0
                    },
                    adjustmentAmount: {
                        amountForAccount: 0,
                        amountForCompany: 0
                    },
                    voucherDate: '',
                    taxRate: 0,
                    uniqueName: '',
                    taxUniqueName: '',
                    voucherBalanceType: ''
                }
            ];
        } else {
            // Find the adjustments that are not advance receipt adjustments and keep them on reset
            // as these adjustments can't get adjusted from voucher module (invoice get all page and invoice update page)
            const nonAdvanceReceiptAdjustments = this.adjustVoucherForm.adjustments?.filter(adjustment => adjustment.voucherType && !(adjustment.voucherType === 'receipt' && adjustment.subVoucher === SubVoucher.AdvanceReceipt));
            return nonAdvanceReceiptAdjustments?.length ? nonAdvanceReceiptAdjustments : [
                {
                    voucherNumber: '',
                    balanceDue: {
                        amountForAccount: 0,
                        amountForCompany: 0
                    },
                    adjustmentAmount: {
                        amountForAccount: 0,
                        amountForCompany: 0
                    },
                    voucherDate: '',
                    taxRate: 0,
                    uniqueName: '',
                    taxUniqueName: '',
                    voucherBalanceType: ''
                }
            ];
        }
    }

    /**
     * Returns the converted company amount
     *
     * @param {number} amountForAccount Amount value in account currency
     * @param {number} exchangeRate Exchange rate of transaction
     * @return {*}  {number} Converted amount
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public getConvertedCompanyAmount(amountForAccount: number, exchangeRate: number): number {
        if (isNaN(exchangeRate)) {
            return amountForAccount;
        }
        return amountForAccount * exchangeRate;
    }

    /**
     * Unsubscribe from all listeners
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Returns the Exchange gain/loss text based on total due in home/company currency
     *
     * @return {*}  {string} Exchange gain/loss text
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public getExchangeGainLossText(): string {
        const isProfit = this.isExchangeProfitable();
        const profitType = isProfit ? this.commonLocaleData?.app_exchange_gain : this.commonLocaleData?.app_exchange_loss;
        const text = `${this.localeData?.exchange_gain_loss_label?.replace('[PROFIT_TYPE]', profitType)} ${this.baseCurrencySymbol}${Math.abs(this.voucherDetails?.gainLoss)}`;
        return text;
    }

    /**
     * Returns true, if the exchange gain is obtained based on the voucher type and balance due
     *
     * @return {*}  {boolean} True, if the exchange gain is obtained in home/company currency
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public isExchangeProfitable(): boolean {
        return this.voucherDetails?.gainLoss >= 0;
    }

    /**
     * Translation complete handler
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public translationComplete(): void {
        this.currentVoucherLabel = this.generalService.getCurrentVoucherLabel(this.adjustedVoucherType, this.commonLocaleData);
    }

    /**
     * Handles the partially adjusted voucher which has balance
     * and is still applicable for further adjustment
     *
     * @private
     * @param {Adjustment} item Item obtained in applicable vouchers
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    private handlePartiallyAdjustedVoucher(item: Adjustment): void {
        if (this.advanceReceiptAdjustmentUpdatedData?.adjustments?.length) {
            // Find if the item is present in already adjusted voucher which means the item is already partially adjusted
            const itemPresentInExistingAdjustment = this.advanceReceiptAdjustmentUpdatedData.adjustments.find(adjustment => adjustment?.uniqueName === item?.uniqueName);
            if (itemPresentInExistingAdjustment && item.balanceDue?.amountForAccount) {
                item.adjustmentAmount.amountForAccount += itemPresentInExistingAdjustment?.adjustmentAmount?.amountForAccount;
            }
        }
    }

    /**
     * Pushes the existing adjustments in dropdown
     *
     * @private
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    private pushExistingAdjustments(): void {
        if (this.adjustVoucherForm.adjustments[this.currentAdjustmentRowIndex]?.uniqueName) {
            if (this.advanceReceiptAdjustmentUpdatedData?.adjustments?.length) {
                this.advanceReceiptAdjustmentUpdatedData.adjustments.forEach(item => {
                    if (this.adjustVoucherForm.adjustments[this.currentAdjustmentRowIndex]?.uniqueName === item?.uniqueName) {
                        item.voucherNumber = this.generalService.getVoucherNumberLabel(item.voucherType, item.voucherNumber, this.commonLocaleData);
                        const itemPresentInVoucherOptions = this.adjustVoucherOptions.find(voucher => voucher?.value === item?.uniqueName);
                        if (!itemPresentInVoucherOptions) {
                            this.adjustVoucherOptions.push({ value: item?.uniqueName, label: item.voucherNumber, additional: item });
                        }

                        const itemPresentInNewVoucherOptions = this.newAdjustVoucherOptions.find(voucher => voucher?.value === item?.uniqueName);
                        if (!itemPresentInNewVoucherOptions) {
                            this.newAdjustVoucherOptions.push({ value: item?.uniqueName, label: item.voucherNumber, additional: item });
                        }
                    }
                });
            }
            this.assignCurrencyInAdjustVoucherForm();
        }
    }

    /**
     * Assignes currency in adjust voucher form adjustments
     *
     * @private
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    private assignCurrencyInAdjustVoucherForm(): void {
        if (this.adjustVoucherForm?.adjustments?.length > 0) {
            this.adjustVoucherForm.adjustments = this.adjustVoucherForm.adjustments.map(item => {
                item.accountCurrency = item.accountCurrency ?? item.currency ?? { symbol: this.baseCurrencySymbol, code: this.companyCurrency };
                return item;
            });
        }
    }

    /**
     * Resets invoice list and current page
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public resetInvoiceList(): void {
        this.adjustVoucherOptions = [];
        this.referenceVouchersCurrentPage = 1;
    }

    /**
     * Loads vouchers
     *
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public loadVouchers(): void {
        if (!this.isVoucherModule) {
            this.getInvoiceList();
        } else {
            if (!this.voucherForAdjustment) {
                this.getAllAdvanceReceipts();
            }
        }
    }

    /**
     * Get list of vouchers
     *
     * @returns {void}
     * @memberof AdvanceReceiptAdjustmentComponent
     */
    public getInvoiceList(): void {
        let voucherType = (this.adjustedVoucherType === AdjustedVoucherType.AdvanceReceipt || this.adjustedVoucherType === AdjustedVoucherType.Receipt) ? 'receipt' : this.adjustedVoucherType;

        if (voucherType === AdjustedVoucherType.Sales) {
            voucherType = AdjustedVoucherType.SalesInvoice;
        } else if (voucherType === AdjustedVoucherType.Purchase) {
            voucherType = AdjustedVoucherType.PurchaseInvoice;
        } else if (voucherType === AdjustedVoucherType.Payment) {
            voucherType = VoucherTypeEnum.payment
        } else if (voucherType === AdjustedVoucherType.Receipt) {
            voucherType = VoucherTypeEnum.receipt
        } else if (voucherType === AdjustedVoucherType.Journal) {
            voucherType = AdjustedVoucherType.JournalVoucher
        }

        if (this.invoiceListRequestParams) {
            this.invoiceListRequestParams.voucherType = voucherType;
        }

        const customerUniqueName = this.voucherDetails.account.uniqueName;
        let requestObject;
        if (typeof customerUniqueName === 'string') {
            // New entry is created from ledger
            if (!this.invoiceListRequestParams) {
                requestObject = {
                    accountUniqueName: customerUniqueName,
                    voucherType,
                    subVoucher: this.adjustedVoucherType === AdjustedVoucherType.AdvanceReceipt ? SubVoucher.AdvanceReceipt : undefined,
                    number: '',
                    page: 1
                }
            } else {
                requestObject = this.adjustmentUtilityService.getInvoiceListRequest(this.invoiceListRequestParams);
                if (requestObject && this.adjustedVoucherType === AdjustedVoucherType.AdvanceReceipt) {
                    requestObject.subVoucher = SubVoucher.AdvanceReceipt;
                }
            }

            if (requestObject) {
                requestObject.number = this.searchReferenceVoucher;

                if (requestObject.number) {
                    this.resetInvoiceList();
                }

                requestObject.page = this.referenceVouchersCurrentPage;
                this.referenceVouchersCurrentPage++;
            }
        } else {
            // A ledger entry is updated
            if (!this.invoiceListRequestParams) {
                requestObject = {
                    accountUniqueName: customerUniqueName[customerUniqueName?.length - 1],
                    voucherType,
                    subVoucher: this.adjustedVoucherType === AdjustedVoucherType.AdvanceReceipt ? SubVoucher.AdvanceReceipt : undefined,
                    number: '',
                    page: 1
                }
            } else {
                requestObject = this.adjustmentUtilityService.getInvoiceListRequest(this.invoiceListRequestParams);
                if (requestObject && this.adjustedVoucherType === AdjustedVoucherType.AdvanceReceipt) {
                    requestObject.subVoucher = SubVoucher.AdvanceReceipt;
                }
            }

            if (requestObject) {
                requestObject.number = this.searchReferenceVoucher;

                if (requestObject.number) {
                    this.resetInvoiceList();
                }

                requestObject.page = this.referenceVouchersCurrentPage;
                this.referenceVouchersCurrentPage++;
            }
        }

        if (!requestObject) {
            return;
        }

        requestObject.uniqueName = this.voucherDetails?.voucherUniqueName;
        requestObject.voucherBalanceType = this.voucherDetails?.type;

        this.voucherService.getVouchersList(requestObject, this.voucherDetails.date).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body && response.body.page === requestObject.page) {
                let results = (response.body.results || response.body.items);

                results = this.adjustmentUtilityService.formatAdjustmentsObject(results);

                this.allAdvanceReceiptResponse = results?.map(result => ({ ...result, adjustmentAmount: { amountForAccount: result.balanceDue?.amountForAccount, amountForCompany: result.balanceDue?.amountForCompany } }));
                if (response.body.page === 1) {
                    this.adjustVoucherOptions = [];
                }

                if (this.allAdvanceReceiptResponse && this.allAdvanceReceiptResponse.length) {
                    this.allAdvanceReceiptResponse.forEach(item => {
                        this.handlePartiallyAdjustedVoucher(item);
                        if (item && item.voucherDate) {
                            item.voucherDate = item.voucherDate?.replace(/-/g, '/');
                            item.voucherNumber = this.generalService.getVoucherNumberLabel(item.voucherType, item.voucherNumber, this.commonLocaleData);
                            item.accountCurrency = item.accountCurrency ?? item.currency ?? { symbol: this.baseCurrencySymbol, code: this.companyCurrency };
                            this.adjustVoucherOptions.push({ value: item.uniqueName, label: item.voucherNumber, additional: item });
                            this.newAdjustVoucherOptions.push({ value: item.uniqueName, label: item.voucherNumber, additional: item });
                        }
                    });

                    this.assignCurrencyInAdjustVoucherForm();
                } else {
                    if (!this.adjustVoucherForm?.adjustments?.length || !this.adjustVoucherForm?.adjustments[0]?.uniqueName) {
                        if (this.isVoucherModule) {
                            this.toasterService.showSnackBar("warning", NO_ADVANCE_RECEIPT_FOUND);
                        } else {
                            this.toasterService.showSnackBar("warning", this.commonLocaleData?.app_voucher_unavailable);
                        }
                    }
                }

                if (response.body.page === 1) {
                    // Fill the suggestions with already adjusted vouchers
                    this.pushExistingAdjustments();
                }

                this.adjustVoucherOptions$ = of(this.adjustVoucherOptions);
            } else {
                if (requestObject.page === 1) {
                    this.adjustVoucherOptions = [];
                    // Since no vouchers available for adjustment, fill the suggestions with already adjusted vouchers
                    this.pushExistingAdjustments();
                    this.adjustVoucherOptions$ = of(this.adjustVoucherOptions);
                }
            }
        });
    }
}
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import * as dayjs from 'dayjs';
import { Observable, ReplaySubject, takeUntil, of as observableOf } from 'rxjs';
import { VoucherComponentStore } from '../utility/vouchers.store';
import { SettingsTagService } from '../../services/settings.tag.service';
import { cloneDeep, orderBy } from '../../lodash-optimized';
import { BriedAccountsGroup } from '../utility/vouchers.const';
import { OptionInterface } from '../../models/api-models/Voucher';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { InvoicePaymentRequest } from '../../models/api-models/Invoice';

@Component({
    selector: 'app-payment-dialog',
    templateUrl: './payment-dialog.component.html',
    styleUrls: ['./payment-dialog.component.scss'],
    providers: [VoucherComponentStore]
})
export class PaymentDialogComponent implements OnInit, OnDestroy {
    /** Holds current voucher details */
    @Input() public voucherDetails: any;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Emits payment submit event */
    @Output() public paymentSubmitted: EventEmitter<InvoicePaymentRequest> = new EventEmitter();
    /** Emits close event */
    @Output() public closeModelEvent: EventEmitter<void> = new EventEmitter();
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Hold dayjs reference */
    public dayjs: any = dayjs;
    /** Holds company specific data */
    public company: any = {
        baseCurrency: '',
        baseCurrencySymbol: '',
        inputMaskFormat: '',
        giddhBalanceDecimalPlaces: 0
    };
    /** Hold tags list */
    public tags: any[] = [];
    /** Brief accounts Observable */
    public briefAccounts$: Observable<OptionInterface[]> = observableOf(null);
    /** Holds Payment form */
    public paymentForm: FormGroup;
    /** Holds Amount Currency*/
    public amountCurrency: string = "";
    /** Holds true if Multicurrency Account*/
    public isMulticurrencyAccount: boolean = false;
    /** Selected payment mode */
    public selectedPaymentMode: any;
    /** Holds true if Bank Selected */
    public isBankSelected: boolean = false;
    /** True if currency switched */
    private currencySwitched: boolean = false;
    /** True if we need to show exchange rate edit field */
    public showExchangeRateEditField: boolean = false;
    /** Holds true action voucher api call in progress */
    public saveInProgress: boolean = false;
    /** Holds true when payment mode is not selected and amount is present */
    public showPaymentModeDropdownError: boolean = false;

    constructor(
        private componentStore: VoucherComponentStore,
        private settingsTagService: SettingsTagService,
        private searchService: SearchService,
        private formBuilder: FormBuilder
    ) { }

    /**
     * Initializes the component
     *
     * @memberof PaymentDialogComponent
     */
    public ngOnInit(): void {
        this.paymentForm = this.formBuilder.group({
            action: ['paid'],
            date: ['', Validators.required],
            deposits: this.formBuilder.array([this.getDepositFormGroup()]),
            tagUniqueName: [''],
            chequeNumber: [''],
            chequeClearanceDate: [''],
            description: [''],
            exchangeRate: [1],
            uniqueName: [this.voucherDetails?.uniqueName]
        });
        this.isMulticurrencyAccount = this.voucherDetails?.accountCurrencySymbol !== this.voucherDetails?.companyCurrencySymbol;
        this.assignAmount(this.voucherDetails?.balanceDue?.amountForAccount, this.voucherDetails?.accountCurrencySymbol);
        this.componentStore.getBriefAccounts({ currency: this.company.baseCurrency, group: BriedAccountsGroup });

        this.componentStore.briefAccounts$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.briefAccounts$ = observableOf(response);
                if (response.length === 1) {
                    this.setDepositAccountUniqueName(0, response[0].label);
                }
            }
        });

        this.componentStore.companyProfile$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.company.baseCurrency = response.baseCurrency;
                this.company.baseCurrencySymbol = response.baseCurrencySymbol;
                this.company.inputMaskFormat = response.balanceDisplayFormat?.toLowerCase() || '';
                this.company.giddhBalanceDecimalPlaces = response.balanceDecimalPlaces;

                if (this.isMulticurrencyAccount) {
                    this.getExchangeRate(this.voucherDetails?.account?.currency?.code, this.company.baseCurrency);
                }
            }
        });

        /** Exchange rate */
        this.componentStore.exchangeRate$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.paymentForm.get('exchangeRate')?.patchValue(response);
            }
        });

        this.settingsTagService.GetAllTags().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length > 0) {
                let arr: any[] = [];
                response?.body.forEach(tag => {
                    arr.push({ value: tag.name, label: tag.name });
                });
                this.tags = orderBy(arr, 'name');
            }
        });

        this.componentStore.actionVoucherInProgress$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.saveInProgress = response;
        });
    }
    /**
     * Returns deposit form group
     *
     * @private
     * @return {*}  {FormGroup}
     * @memberof PaymentDialogComponent
     */
    private getDepositFormGroup(): FormGroup {
        return this.formBuilder.group({
            amount: [''],
            accountUniqueName: ['']
        });
    }

    /**
     * Deposit account error
     *
     * @param {number} index
     * @return {*}  {boolean}
     * @memberof PaymentDialogComponent
     */
    public getEmptyDepositAccountError(isAccount:boolean, index: number): boolean {
        let deposits = this.paymentForm?.get('deposits') as FormArray;
        let currentDepositFormGroup = deposits.at(index) as FormGroup;
        return isAccount && currentDepositFormGroup?.get("amount").value && (!currentDepositFormGroup?.get("accountUniqueName").value) || (!isAccount && (!currentDepositFormGroup?.get("amount").value) && currentDepositFormGroup?.get("accountUniqueName").value);
    }
    /**
     * Add new deposit row
     *
     * @memberof PaymentDialogComponent
     */
    public addNewDepositRow(): void {
        this.paymentForm.get('deposits')['controls'].push(this.getDepositFormGroup());
    }
    /**
     * Remove deposit row
     *
     * @param {number} entryIndex
     * @memberof PaymentDialogComponent
     */
    public deleteDepositRow(entryIndex: number): void {
        const deposits = this.paymentForm.get('deposits') as FormArray;
        if (deposits?.length === 1) {
            deposits.reset();
            return;
        }
        deposits.removeAt(entryIndex);
    }

    /**
     * Lifecycle hook for destroy
     *
     * @memberof PaymentDialogComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Handle Select Payment Mode
     *
     * @param {*} event
     * @memberof PaymentDialogComponent
     */
    public onSelectPaymentMode(event: any, isSelectAccount: boolean, index: number): void {
        if (isSelectAccount) {
            if (event && event.value) {
                if (!this.isMulticurrencyAccount || this.voucherDetails?.account?.currency?.code === event?.additional?.currency?.code) {
                    this.assignAmount(this.voucherDetails?.balanceDue?.amountForAccount, this.voucherDetails?.account?.currency?.symbol, index);
                } else {
                    this.assignAmount(this.voucherDetails?.balanceDue?.amountForCompany, event?.additional?.currency?.symbol, index);
                }
                this.selectedPaymentMode = event;

                this.searchService.loadDetails(event.value).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response && response.body) {
                        const parentGroups = response.body.parentGroups;
                        if (parentGroups && parentGroups[1] === 'bankaccounts') {
                            this.isBankSelected = true;
                        } else {
                            this.isBankSelected = false;
                            this.paymentForm.get('chequeClearanceDate')?.patchValue('');
                            this.paymentForm.get('chequeNumber')?.patchValue('');
                        }
                    } else {
                        this.isBankSelected = false;
                        this.setDepositAccountUniqueName(index, '');
                        this.paymentForm.get('chequeClearanceDate')?.patchValue('');
                        this.paymentForm.get('chequeNumber')?.patchValue('');
                    }
                })
                this.setDepositAccountUniqueName(index, event.value);
            } else {
                this.assignAmount(this.voucherDetails?.balanceDue?.amountForAccount, this.voucherDetails?.account?.currency?.symbol, index);
                this.selectedPaymentMode = null;
                this.isBankSelected = false;
                this.setDepositAccountUniqueName(index, '');
                this.paymentForm.get('chequeClearanceDate')?.patchValue('');
                this.paymentForm.get('chequeNumber')?.patchValue('');
            }
        } else {
            this.setDepositAccountUniqueName(index, '');
        }
    }
    /**
     * Set AccountUniqueName Empty
     *
     * @memberof PaymentDialogComponent
     */
    private setDepositAccountUniqueName(index: number, event: any): void {
        let deposits = this.paymentForm.get('deposits')['controls'] as FormArray;
        let currentDepositFormGroup = deposits.at(index) as FormGroup;
        currentDepositFormGroup.get("accountUniqueName")?.patchValue(event);
    }

    /**
     * Assign Amount
     *
     * @private
     * @param {number} amount
     * @param {string} currencySymbol
     * @memberof PaymentDialogComponent
     */
    private assignAmount(amount: number, currencySymbol: string, depositIndex: number = 0): void {
        this.paymentForm.get('deposits')['controls']?.forEach((control: any, index: number) => {
            if (control.get('amount').value && depositIndex !== index) {
                amount -= Number(control.get('amount').value);
            }
        });

        amount = amount > 0 ? amount : 0;
        let deposits = this.paymentForm?.get('deposits')['controls'] as FormArray;
        let currentDepositFormGroup = deposits.at(depositIndex) as FormGroup;
        currentDepositFormGroup.get('amount')?.patchValue(amount);
        this.amountCurrency = currencySymbol;
    }

    /**
     * Switches currency
     *
     * @memberof PaymentDialogComponent
     */
    public switchCurrency(): void {
        this.currencySwitched = !this.currencySwitched;
        this.paymentForm.get('exchangeRate')?.patchValue(1 / this.paymentForm.get('exchangeRate')?.value);
    }

    /**
     * Gets exchange rate
     *
     * @param {string} fromCurrency
     * @param {string} toCurrency
     * @param {*} voucherDate
     * @memberof PaymentDialogComponent
     */
    public getExchangeRate(fromCurrency: string, toCurrency: string): void {
        if (fromCurrency && toCurrency) {
            let date = dayjs().format(GIDDH_DATE_FORMAT);
            this.componentStore.getExchangeRate({ fromCurrency, toCurrency, date });
        }
    }

    /**
     * Emits Save Payment
     *
     * @memberof PaymentDialogComponent
     */
    public savePayment(): void {
        let newFormObj = cloneDeep(this.paymentForm?.value);
        newFormObj.date = dayjs(newFormObj.date).format(GIDDH_DATE_FORMAT);
        if (newFormObj.chequeClearanceDate) {
            newFormObj.chequeClearanceDate = dayjs(newFormObj.chequeClearanceDate).format(GIDDH_DATE_FORMAT);
        }
        const deposits = [];
        this.paymentForm.get('deposits')['controls']?.forEach(control => {
            if (control.get("accountUniqueName").value?.length && (control.get("amount").value > 0)) {
                if (this.voucherDetails?.account?.currency?.code === this.selectedPaymentMode?.additional?.currency) {
                    deposits.push({ amountForAccount: control.get("amount").value, accountUniqueName: control.get("accountUniqueName").value });
                } else {
                    deposits.push({ amountForCompany: control.get("amount").value, accountUniqueName: control.get("accountUniqueName").value });
                }
            }
        });
        newFormObj.deposits = deposits;
        newFormObj.tagNames = (newFormObj.tagUniqueName) ? [newFormObj.tagUniqueName] : [];
        delete newFormObj.tagUniqueName;

        this.paymentSubmitted.emit(newFormObj);
    }
}

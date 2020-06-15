import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { AccountsAction } from '../../actions/accounts.actions';
import { CompanyActions } from "../../actions/company.actions";
import { takeUntil, take } from 'rxjs/operators';
import { Observable, of as observableOf, ReplaySubject, of } from "rxjs";
import { VerifyEmailResponseModel, VerifyMobileModel } from "../../models/api-models/loginModels";
import { AccountResponseV2 } from "../../models/api-models/Account";
import { CompanyService } from "../../services/companyService.service";
import { BankTransferRequest } from "../../models/api-models/Company";
import { IRegistration, IntegratedBankList, BankTransactionForOTP, GetOTPRequest, BulkPaymentConfirmRequest } from "../../models/interfaces/registration.interface";
import { ToasterService } from "../../services/toaster.service";
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, NgForm, FormBuilder, FormArray, Validators } from '@angular/forms';
import { cloneDeep } from '../../lodash-optimized';
@Component({
    selector: 'payment-aside',
    templateUrl: './payment-aside.component.html',
    styleUrls: [`./payment-aside.component.scss`],
})


export class PaymentAsideComponent implements OnInit, OnChanges {

    //variable that holds registered account information
    public registeredAccounts: any;
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    //variable holding available mode for payment transfer
    public mode: IRegistration;
    //user information
    public user: VerifyEmailResponseModel;
    //Active account to make the transfer
    public activeAccount$: Observable<AccountResponseV2>;
    //Account details into which the amount is to be transferred
    public accountDetails: any;
    //Default amount value
    public amount = 0;
    public userDetails$: Observable<VerifyEmailResponseModel>;
    //variable to check whether OTP is sent to show and hide OTP text field
    public OTPsent: boolean = false;
    public countryCode: string = '';
    /** Integrated bank list array */
    public integratedBankList$: Observable<IntegratedBankList[]>;
    /** Request object for OTP */
    public requestObjectToGetOTP: GetOTPRequest = {
        bankName: '',
        urn: '',
        totalAmount: '',
        bankPaymentTransactions: []

    };
    /** Template reference for success payment model */
    @ViewChild('successTemplate') public successTemplate: TemplateRef<any>;
    /** directive to emit boolean for close model */
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** Integrated bank list sh-select options */
    public selectIntegratedBankList: IOption[] = [];
    //Event emitter to close the Aside panel
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    //Input current account holders information
    @Input() public selectedAccForPayment: any;
    /** Selected account list */
    @Input() public selectedAccountsForBulkPayment: any[];
    /** selected accounts list for bulk payment */
    public selectedAccForBulkPayment: any[];
    /** company unique name */
    public companyUniqueName: string;
    /** count down timer observable */
    public timerCountDown$: Observable<string>;
    //Variable holding OTP received by user
    public receivedOtp: any;
    /** remark for payment */
    public remarks: string = '';
    /** Model reference */
    public successModalRef: BsModalRef;
    /** total selected account's amount sum */
    public totalSelectedAccountAmount: number;
    /** to check count down timer on */
    public timerOn: boolean = false;
    /** to track for OTP  */
    public isPayClicked: boolean = false;
    /** selected bank URN number */
    public selectedBankUrn: any;
    /** Timer reference */
    public countDownTimerRef: any;
    /** Total available balance of selected account */
    public totalAvailableBalance: any;
    /** Total selected account  */
    public totalSelectedLength: number;
    /** bulk payment form */
    public addAccountBulkPaymentForm: FormGroup;
    public imgPath: string = '';
    /** Payment request id for OTP confirmation */
    public paymentRequestId: string = '';
    /** OTP receiver success message slogan */
    public otpReceiverNameMessage = '';
    /** True if request in process */
    public isRequestInProcess: boolean = false;
    /** Company currency symbol */
    public companyCurrency: string;
    /** selected base currency symbol */
    public baseCurrencySymbol: string;
    /** Input mast for number format */
    public inputMaskFormat: string = '';


    constructor(
        private formBuilder: FormBuilder,
        private modalService: BsModalService,
        private store: Store<AppState>,
        private _companyActions: CompanyActions,
        private accountsAction: AccountsAction,
        private _companyService: CompanyService,
        private _toaster: ToasterService
    ) {
        this.userDetails$ = this.store.select(p => p.session.user);
        this.userDetails$.pipe(take(1)).subscribe(p => this.user = p);
        this.activeAccount$ = this.store.select(state => state.groupwithaccounts.activeAccount).pipe(takeUntil(this.destroyed$));

        this.integratedBankList$ = this.store.pipe(select(p => p.company.integratedBankList), takeUntil(this.destroyed$));
    }

    /**
     *To open success bulk payment model
     *
     * @param {TemplateRef<any>} template
     * @memberof PaymentAsideComponent
     */
    public openModalWithClass(template: TemplateRef<any>): void {
        this.successModalRef = this.modalService.show(
            template,
            Object.assign({}, { class: 'payment-success-modal' })
        );
    }

    public ngOnInit() {
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.initializeNewForm();
        // this.amount = this.selectedAccForPayment.closingBalance.amount;
        // get all registered account
        this.store.pipe((select(c => c.session.companyUniqueName)), take(2)).subscribe(s => this.companyUniqueName = s);
        this.store.dispatch(this._companyActions.getAllRegistrations());

        //get current registered account on the user
        this.store.pipe(select(selectStore => selectStore.company), takeUntil(this.destroyed$)).subscribe((response) => {
            if (response.account) {
                this.registeredAccounts = response.account;
                if (this.registeredAccounts.length === 1) {
                    this.mode = this.registeredAccounts[0];
                }
            }
        });
        if (this.companyUniqueName) {
            this.store.dispatch(this._companyActions.getAllIntegratedBankInCompany(this.companyUniqueName));
        }

        this.store.pipe(select(prof => prof.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            this.companyCurrency = profile.baseCurrency || 'INR';
            this.baseCurrencySymbol = profile.baseCurrencySymbol;
            this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';
        });
        //get selecetd vendors account details
        if (this.selectedAccForPayment && this.selectedAccForPayment.uniqueName) {
            this.store.dispatch(this.accountsAction.getAccountDetails(this.selectedAccForPayment.uniqueName));
        }
        this.activeAccount$.subscribe(acc => {
            if (acc && acc.accountBankDetails) {
                this.accountDetails = acc;
                if (acc.country && acc.country.countryCode) {
                    this.countryCode = this.accountDetails.country.countryCode
                }

            }
        });

        this.integratedBankList$.pipe(takeUntil(this.destroyed$)).subscribe((bankList: IntegratedBankList[]) => {
            this.selectIntegratedBankList = [];
            if (bankList && bankList.length) {
                bankList.forEach(item => {
                    if (item) {
                        item.bankName = item.bankName ? item.bankName : "";
                        this.selectIntegratedBankList.push({ label: item.bankName, value: item.urn, additional: item });
                    }
                });
                if (bankList.length === 1) {
                    this.selectBank(this.selectIntegratedBankList[0]);
                }
            }

        });
        this.selectedAccForBulkPayment.forEach(item => {
            this.addAccountTransactionsFormObject(item);
        });
        this.selectedAccForBulkPayment.map(item => {
            item.remarks = '';
            item.totalDueAmount = item.closingBalance.amount;
        });
        this.getIntegratedBankDetails();

    }


    /**
     *Lifecycle hook to changed any input directive
     *
     * @param {SimpleChanges} changes simplechanegs interface
     * @memberof PaymentAsideComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            if (changes.selectedAccountsForBulkPayment && changes.selectedAccountsForBulkPayment.currentValue) {
                this.totalSelectedLength = changes.selectedAccountsForBulkPayment.currentValue.length;
                this.selectedAccForBulkPayment = cloneDeep(this.selectedAccountsForBulkPayment);
                this.selectedAccForBulkPayment = this.selectedAccForBulkPayment.filter(item => {
                    return item.accountBankDetails && item.accountBankDetails.bankAccountNo !== '' && item.accountBankDetails.bankName !== '' && item.accountBankDetails.ifsc !== '';
                });
            }
        }
        this.getTotalAmount(this.selectedAccForBulkPayment);
    }

    /*
    * Close Aside panel view
    *
    * */
    public closeAsidePane(event?) {
        this.closeAsideEvent.emit(event);
    }
    /*
    * API call to send OTP to user
    *
    * */
    public sendOTP() {
        let request = {
            params: {
                urn: this.mode.iciciCorporateDetails.URN
            }
        };
        this._companyService.getOTP(request).subscribe((res) => {
            if (res.status === 'success') {
                this.OTPsent = true;
            } else {
                if (res.status === 'error' && res.code === 'BANK_ERROR') {
                    this._toaster.warningToast(res.message);
                } else {
                    this._toaster.errorToast(res.message);
                }
            }
        });
    }
    /*
    * API call to send OTP to user
    *
    * */
    public reSendOTP() {
        this.timerOn = true
        this.startTimer(40);
        this._companyService.resendOtp(this.companyUniqueName, this.selectedBankUrn, this.paymentRequestId).subscribe((response) => {
            if (response.status === 'success') {
                this.isPayClicked = true;
                if (response.body && response.body.message) {
                    this._toaster.successToast(response.body.message);
                    this.otpReceiverNameMessage = response.body.message;
                    this.paymentRequestId = response.body.requestId;
                }
            } else if (response.status === 'error') {
                this._toaster.errorToast(response.message, response.code);
            }
        });
    }

    /*
    * API call to confirm OTP received by user
    *
    * */
    public confirmOTP() {
        let bankTransferConfirmOtpRequest: BulkPaymentConfirmRequest = new BulkPaymentConfirmRequest();
        bankTransferConfirmOtpRequest.requestId = this.paymentRequestId;
        bankTransferConfirmOtpRequest.otp = this.receivedOtp;
        this._companyService.bulkVendorPaymentConfirm(this.companyUniqueName, this.selectedBankUrn, bankTransferConfirmOtpRequest).subscribe((res) => {
            if (res.status === 'success') {
                this.closePaymentModel();
                this.openModalWithClass(this.successTemplate);
            } else {
                if (res.status === 'error' && res.code === 'BANK_ERROR') {
                    this._toaster.warningToast(res.message);
                } else {
                    this._toaster.errorToast(res.message, res.code);
                }
            }
        });
    }


    public removeSelectedAccount(item: any) {
        if (item) {
            let itemIndx = this.selectedAccForBulkPayment.findIndex((element) => element === item);
            this.selectedAccForBulkPayment.splice(itemIndx, 1);
        }
    }

    /**
     * To close payment model
     *
     * @returns {*}
     * @memberof PaymentAsideComponent
     */
    public closePaymentModel(): void {
        this.closeModelEvent.emit(true);
    }

    /**
     * API call to get integrated bank list
     *
     * @memberof PaymentAsideComponent
     */
    public getIntegratedBankDetails(): void {
        this.store.dispatch(this._companyActions.getAllIntegratedBankInCompany(this.companyUniqueName));
    }

    /**
     * To select bank event
     *
     * @param {*} event Selected bank object
     * @memberof PaymentAsideComponent
     */
    public selectBank(event: IOption): void {
        this.selectedBankUrn = event.value;
        if (event) {
            this.isPayClicked = false;
            this.paymentRequestId = '';
            this.otpReceiverNameMessage = '';
            this.totalAvailableBalance = null;
            this.requestObjectToGetOTP.urn = event.value;
            this.requestObjectToGetOTP.bankName = event.label;
            this.isRequestInProcess = true;
            this._companyService.getAllBankDetailsOfIntegrated(this.companyUniqueName, this.requestObjectToGetOTP.urn).subscribe(response => {
                this.isRequestInProcess = false;
                if (response.status === 'success') {
                    if (response.body.Status === 'SUCCESS') {
                        this.totalAvailableBalance = response.body.effectiveBal;
                    }
                } else if (response.status === 'error') {
                    this._toaster.errorToast(response.message, response.code);
                }
            })
        }
    }

    /**
    * API call to get OTP
    *
    *
    * @memberof PaymentAsideComponent
    */
    public bulkPayVendor(): void {
        this.paymentRequestId = '';
        this.otpReceiverNameMessage = '';
        this.isRequestInProcess = true;
        this._companyService.bulkVendorPayment(this.companyUniqueName, this.requestObjectToGetOTP).subscribe(response => {
            this.isRequestInProcess = false;
            if (response.status === 'success') {
                this.isPayClicked = true;
                if (response.body && response.body.message) {
                    this._toaster.successToast(response.body.message);
                    this.otpReceiverNameMessage = response.body.message;
                    this.paymentRequestId = response.body.requestId;
                }
            } else if (response.status === 'error') {
                this.isPayClicked = false;
                this._toaster.errorToast(response.message, response.code);
                this.paymentRequestId = '';
            }
        });
    }

    /**
     * To get total amount
     *
     * @param {any[]} selectedAccount Selected accounts list
     * @memberof PaymentAsideComponent
     */
    public getTotalAmount(selectedAccount: any[]): void {
        this.totalSelectedAccountAmount = 0;
        if (selectedAccount && selectedAccount.length) {
            this.totalSelectedAccountAmount = selectedAccount.reduce((prev, cur) => {
                return prev + cur.closingBalanceAmount;
            }, 0);
        }
    }

    /**
     * To Prepare payment request object and API call
     *
     *
     * @memberof PaymentAsideComponent
     */
    public payClicked() {
        this.paymentRequestId = '';
        this.prepareRequestObject();
        this.bulkPayVendor();
    }

    /**
     * To prepare object for UI
     *
     * @memberof PaymentAsideComponent
     */
    public prepareRequestObject(): void {
        this.requestObjectToGetOTP.bankPaymentTransactions = [];
        this.requestObjectToGetOTP.totalAmount = String(this.totalSelectedAccountAmount);
        this.selectedAccForBulkPayment.forEach(item => {
            let transaction: BankTransactionForOTP = {
                amount: '',
                remarks: '',
                vendorUniqueName: ''
            };
            transaction.amount = item.closingBalance.amount;
            transaction.remarks = item.remarks;
            transaction.vendorUniqueName = item.uniqueName;
            this.requestObjectToGetOTP.bankPaymentTransactions.push(transaction);
        });
    }

    /**
     * To cancel OTP request and count down timer
     *
     * @memberof PaymentAsideComponent
     */
    public clickedCancelOtp(): void {
        this.isPayClicked = false;
        this.receivedOtp = null;
        this.timerOn = false;
        clearTimeout(this.countDownTimerRef);
    }

    /**
     * Timer for count down OTP validation API call
     *
     * @param {number} remaining   count down remaining time
     * @returns
     * @memberof PaymentAsideComponent
     */
    public startTimer(remaining: number): any {
        let min: any = Math.floor(remaining / 60);
        let sec: any = remaining % 60;
        min = Number(min) < 10 ? '0' + min : Number(min);
        sec = Number(sec) < 10 ? '0' + sec : Number(sec);
        // document.getElementById('timerElement').innerHTML = min + ':' + sec;
        this.timerCountDown$ = of(min + ':' + sec);
        remaining -= 1;

        if (remaining >= 0 && this.timerOn) {
            this.countDownTimerRef = setTimeout(() => {
                this.startTimer(remaining);
            }, 1000);
            return;
        }

        if (!this.timerOn) {

            this.timerOn = false;
            return;
        }
    }

    /**
     *To initialize form
     *
     * @memberof PaymentAsideComponent
     */
    public initializeNewForm(): void {
        this.addAccountBulkPaymentForm = this.formBuilder.group({
            bankName: [''],
            urn: [''],
            totalAmount: [''],
            bankPaymentTransactions: this.formBuilder.array([
                this.formBuilder.group({
                    remarks: ['', Validators.compose([Validators.required])],
                    amount: [''],
                    vendorUniqueName: [''],
                })
            ]),
        });
    }

    /**
     * Add account transaction object
     *
     * @param {*} value item need to add
     * @returns
     * @memberof PaymentAsideComponent
     */
    public addAccountTransactionsFormObject(value: any): any {    // commented code because we no need GSTIN No. to add new address
        // if (value && !value.startsWith(' ', 0)) {
        const transactions = this.addAccountBulkPaymentForm.get('bankPaymentTransactions') as FormArray;
        transactions.push(this.initialAccountTransactionsForm(value));
        return;
    }

    /**
     * Initialize account transaction form
     *
     * @param {*} val
     * @returns {FormGroup}
     * @memberof PaymentAsideComponent
     */
    public initialAccountTransactionsForm(val: any): FormGroup {
        let transactionsFields = this.formBuilder.group({
            remarks: ['', Validators.compose([Validators.required])],
            amount: [''],
            vendorUniqueName: [''],
        });
        if (val) {
            transactionsFields.get('remarks').patchValue('');
            transactionsFields.get('amount').patchValue(val.closingBalance.amount);
            transactionsFields.get('vendorUniqueName').patchValue(val.uniqueName);
        }
        return transactionsFields;
    }
    /**
     * To remove tansaction form row entry
     *
     * @param {number} Index of selected item
     * @memberof PaymentAsideComponent
     */
    public removeTransactionsDetailsForm(index: number) {
        const transactions = this.addAccountBulkPaymentForm.get('bankPaymentTransactions') as FormArray;
        transactions.removeAt(index);
    }
}

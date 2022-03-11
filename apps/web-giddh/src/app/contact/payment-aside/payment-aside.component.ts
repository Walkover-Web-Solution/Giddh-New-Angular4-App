import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { AccountsAction } from '../../actions/accounts.actions';
import { CompanyActions } from "../../actions/company.actions";
import { takeUntil, take } from 'rxjs/operators';
import { Observable, ReplaySubject, of } from "rxjs";
import { VerifyEmailResponseModel } from "../../models/api-models/loginModels";
import { AccountResponseV2 } from "../../models/api-models/Account";
import { CompanyService } from "../../services/companyService.service";
import { IRegistration, IntegratedBankList, BankTransactionForOTP, GetOTPRequest, BulkPaymentConfirmRequest } from "../../models/interfaces/registration.interface";
import { ToasterService } from "../../services/toaster.service";
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { cloneDeep } from '../../lodash-optimized';
import { ShSelectComponent } from '../../theme/ng-virtual-select/sh-select.component';
import { GeneralService } from '../../services/general.service';
import { SettingsIntegrationService } from '../../services/settings.integraion.service';
import { IForceClear } from '../../models/api-models/Sales';

@Component({
    selector: 'payment-aside',
    templateUrl: './payment-aside.component.html',
    styleUrls: [`./payment-aside.component.scss`],
})
export class PaymentAsideComponent implements OnInit, OnChanges {
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** variable that holds registered account information */
    public registeredAccounts: any;
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** variable holding available mode for payment transfer */
    public mode: IRegistration;
    /** user information */
    public user: VerifyEmailResponseModel;
    /** Active account to make the transfer */
    public activeAccount$: Observable<AccountResponseV2>;
    /** Account details into which the amount is to be transferred */
    public accountDetails: any;
    /** Default amount value */
    public amount = 0;
    public userDetails$: Observable<VerifyEmailResponseModel>;
    /** variable to check whether OTP is sent to show and hide OTP text field */
    public OTPsent: boolean = false;
    public countryCode: string = '';
    /** Integrated bank list array */
    public integratedBankList$: Observable<IntegratedBankList[]>;
    /** Request object for OTP */
    public requestObjectToGetOTP: GetOTPRequest = {
        bankName: '',
        urn: '',
        uniqueName: '',
        totalAmount: '',
        bankPaymentTransactions: []
    };
    /** Template reference for success payment model */
    @ViewChild('successTemplate', { static: true }) public successTemplate: TemplateRef<any>;
    /** directive to emit boolean for close model */
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** Integrated bank list sh-select options */
    public selectIntegratedBankList: IOption[] = [];
    /** Event emitter to close the Aside panel */
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** Input current account holders information */
    @Input() public selectedAccForPayment: any;
    /** Selected account list */
    @Input() public selectedAccountsForBulkPayment: any[];
    /** selected accounts list for bulk payment */
    public selectedAccForBulkPayment: any[];
    /** company unique name */
    public companyUniqueName: string;
    /** count down timer observable */
    public timerCountDown$: Observable<string>;
    /** Variable holding OTP received by user */
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
    /** Selected bank unique name */
    public selectedBankUniqueName: string;
    /** To check form validation */
    public isValidData: boolean = false;
    /** company's first  name */
    public companyFirstName: string = '';
    /** Selected bank name */
    public selectedBankName: string = '';
    /** To check is bank selected */
    public isBankSelectedForBulkPayment: boolean = false;
    /** Get all bank inprogress */
    public isGetAllIntegratedBankInProgress$: Observable<boolean>;
    /** This will hold payors list */
    public payorsList: IOption[] = [];
    /* This will clear the selected payor values */
    public forceClear$: Observable<IForceClear> = of({ status: false });
    /** True if payor list api call in progress */
    public isPayorListInProgress: boolean = false;
    /** True if payor is required */
    public isPayorRequired: boolean = true;
    /** Holds message of payment successful */
    public paymentSuccessfulMessage: string = "";

    constructor(
        private formBuilder: FormBuilder,
        private modalService: BsModalService,
        private store: Store<AppState>,
        private companyActions: CompanyActions,
        private accountsAction: AccountsAction,
        private companyService: CompanyService,
        private toaster: ToasterService,
        private generalService: GeneralService,
        private settingsIntegrationService: SettingsIntegrationService
    ) {
        this.userDetails$ = this.store.pipe(select(p => p.session.user), takeUntil(this.destroyed$));
        this.userDetails$.pipe(take(1)).subscribe(p => this.user = p);
        this.activeAccount$ = this.store.pipe(select(state => state.groupwithaccounts.activeAccount), takeUntil(this.destroyed$));

        this.integratedBankList$ = this.store.pipe(select(p => p.company && p.company.integratedBankList), takeUntil(this.destroyed$));
        this.isGetAllIntegratedBankInProgress$ = this.store.pipe(select(storeBank => storeBank.company && storeBank.company.isGetAllIntegratedBankInProgress), takeUntil(this.destroyed$));
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
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.initializeNewForm();
        // get all registered account
        this.store.pipe((select(c => c.session.companyUniqueName)), take(2)).subscribe(s => this.companyUniqueName = s);
        this.store.dispatch(this.companyActions.getAllRegistrations());

        //get current registered account on the user
        this.store.pipe(select(selectStore => selectStore.company), takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.account) {
                this.registeredAccounts = response.account;
                if (this.registeredAccounts?.length === 1) {
                    this.mode = this.registeredAccounts[0];
                }
            }
        });

        this.store.pipe(select(prof => prof.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            this.companyCurrency = profile.baseCurrency || 'INR';
            this.companyFirstName = profile.name;
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
                    if (item && !item.errorMessage) {
                        item.bankName = item.bankName ? item.bankName : "";
                        this.selectIntegratedBankList.push({ label: item.bankName, value: item.uniqueName, additional: item });
                    }
                });

                if (this.selectIntegratedBankList?.length === 1) {
                    this.selectBank(this.selectIntegratedBankList[0]);
                }
            }

        });
        this.selectedAccForBulkPayment = this.selectedAccForBulkPayment.filter((data, index) => {
            return this.selectedAccForBulkPayment.indexOf(data) === index;
        });
        this.selectedAccForBulkPayment.forEach(item => {
            this.addAccountTransactionsFormObject(item);
        });
        this.selectedAccForBulkPayment.map(item => {
            let modifiedRemark;
            let companyFirstName;
            if (this.companyFirstName) {
                companyFirstName = this.companyFirstName.split(' ');
            }
            if (item && item.name) {
                modifiedRemark = item.name.split(' ');
            }
            if (modifiedRemark && modifiedRemark.length && companyFirstName) {
                item.remarks = modifiedRemark[0] + ' - ' + companyFirstName[0];
            } else {
                item.remarks = '';
            }

            item.totalDueAmount = item.closingBalanceAmount;
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
            if (changes.selectedAccForPayment && changes.selectedAccForPayment.currentValue) {
                this.selectedAccForBulkPayment = [];
                this.selectedAccForBulkPayment.push(changes.selectedAccForPayment.currentValue);
            } else {
                if (changes.selectedAccountsForBulkPayment && changes.selectedAccountsForBulkPayment.currentValue) {
                    this.totalSelectedLength = changes.selectedAccountsForBulkPayment.currentValue.length;
                    this.selectedAccForBulkPayment = _.cloneDeep(this.selectedAccountsForBulkPayment);
                    this.selectedAccForBulkPayment = this.selectedAccForBulkPayment.filter(item => {
                        return item.accountBankDetails && item.accountBankDetails.bankAccountNo !== '' && item.accountBankDetails.bankName !== '' && item.accountBankDetails.ifsc !== '';
                    });
                }
            }
        }
        if (this.selectedAccForBulkPayment && !this.selectedAccForBulkPayment.length) {
            this.closePaymentModel(false);
        }
        this.getTotalAmount();
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
        this.companyService.getOTP(request).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res.status === 'success') {
                this.OTPsent = true;
            } else {
                if (res.status === 'error' && res.code === 'BANK_ERROR') {
                    this.toaster.showSnackBar("warning", res.message);
                } else {
                    this.toaster.showSnackBar("error", res.message);
                }
            }
        });
    }

    /**
     * API call to send OTP to user
     *
     * @memberof PaymentAsideComponent
     */
    public reSendOTP(): void {
        this.timerOn = true
        this.startTimer(40);
        this.receivedOtp = null;
        this.companyService.resendOtp(this.companyUniqueName, this.selectedBankUrn, this.paymentRequestId, this.selectedBankUniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.status === 'success') {

                this.isPayClicked = true;
                if (response.body && response.body.message) {
                    this.toaster.showSnackBar("success", response.body.message);
                    this.otpReceiverNameMessage = response.body.message;
                    this.paymentRequestId = response.body.requestId;
                }
            } else if (response.status === 'error') {
                this.toaster.showSnackBar("error", response.message, response.code);
            }
        });
    }

    /**
     * API call to confirm OTP received by user
     *
     * @memberof PaymentAsideComponent
     */
    public confirmOTP() {
        let bankTransferConfirmOtpRequest: BulkPaymentConfirmRequest = new BulkPaymentConfirmRequest();
        this.isRequestInProcess = true;
        bankTransferConfirmOtpRequest.requestId = this.paymentRequestId;
        bankTransferConfirmOtpRequest.otp = this.receivedOtp;
        this.companyService.bulkVendorPaymentConfirm(this.companyUniqueName, this.selectedBankUrn, this.selectedBankUniqueName, bankTransferConfirmOtpRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res && res.status === 'success') {
                this.paymentSuccessfulMessage = res.body?.Message;
                this.closePaymentModel(true);
                this.openModalWithClass(this.successTemplate);
            } else {
                if (res.status === 'error' && res.code === 'BANK_ERROR') {
                    this.toaster.showSnackBar("warning", res.message);
                } else {
                    this.toaster.showSnackBar("error", res.message, res.code);
                }
            }
            this.isRequestInProcess = false;
        });
    }

    /**
     * To remove selected amount range from bank account form
     *
     * @param {*} item
     * @memberof PaymentAsideComponent
     */
    public removeSelectedAccount(item: any): void {
        if (item && this.selectedAccForBulkPayment) {
            let itemIndx = this.selectedAccForBulkPayment.findIndex((element) => element === item);
            this.selectedAccForBulkPayment.splice(itemIndx, 1);
        }
        this.getTotalAmount();
    }

    /**
     * To close payment model
     *
     * @returns {*}
     * @memberof PaymentAsideComponent
     */
    public closePaymentModel(isPaySuccess: boolean): void {
        this.resetFormData();
        this.totalSelectedAccountAmount = null;
        this.selectedAccForPayment = null;
        this.closeModelEvent.emit(isPaySuccess);
    }

    /**
     * To reset form data
     *
     * @memberof PaymentAsideComponent
     */
    public resetFormData(): void {
        this.selectedBankUniqueName = '';
        this.isBankSelectedForBulkPayment = false;
        this.selectedBankUrn = '';
        this.selectedBankName = '';
        this.receivedOtp = '';
        this.isPayClicked = false;
        this.selectedAccForBulkPayment = [];
    }

    /**
     * API call to get integrated bank list
     *
     * @memberof PaymentAsideComponent
     */
    public getIntegratedBankDetails(): void {
        this.store.dispatch(this.companyActions.getAllIntegratedBankInCompany(this.companyUniqueName));
    }

    /**
     * To select bank event
     *
     * @param {IOption} event Selected bank object
     * @param {ShSelectComponent} selectBabkEle Sh-select reference element
     * @memberof PaymentAsideComponent
     */
    public selectBank(event: IOption): void {
        let loadPayorList = false;
        if (event) {
            loadPayorList = (this.requestObjectToGetOTP?.uniqueName !== event.value);
            this.selectedBankUniqueName = event.value;
            this.isBankSelectedForBulkPayment = true;
            this.selectedBankName = event.label;
            this.isPayClicked = false;
            this.paymentRequestId = '';
            this.otpReceiverNameMessage = '';
            this.requestObjectToGetOTP.uniqueName = event.value;
            this.requestObjectToGetOTP.bankName = event.label;
            this.totalAvailableBalance = event.additional.effectiveBal;
        }
        this.getTotalAmount();

        if(loadPayorList) {
            this.selectedBankUrn = '';
            this.requestObjectToGetOTP.urn = '';
            this.getBankAccountPayorsList();
        }
    }

    /**
     * callback for select payor
     *
     * @param {IOption} event
     * @memberof PaymentAsideComponent
     */
    public selectPayor(event: IOption): void {
        if (event) {
            this.selectedBankUrn = event.value;
            this.requestObjectToGetOTP.urn = event.value;
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
        this.companyService.bulkVendorPayment(this.companyUniqueName, this.requestObjectToGetOTP).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isRequestInProcess = false;
            if (response && response.status === 'success') {
                this.isPayClicked = true;
                if (response.body && response.body.message) {
                    this.toaster.showSnackBar("success", response.body.message);
                    this.otpReceiverNameMessage = response.body.message;
                    this.paymentRequestId = response.body.requestId;
                }
            } else if (response.status === 'error') {
                this.isPayClicked = false;
                this.toaster.showSnackBar("error", response.message, response.code);
                this.paymentRequestId = '';
            }
        });
    }

    /**
     * set Bank name for bydefault set bank name if only single bank integrated to prevent 'urn' displayed this was incorrect
     *
     * @param {*} event Click event
     * @param {ShSelectComponent} selectBankEle Sh-select reference
     * @memberof PaymentAsideComponent
     */
    public setBankName(event: any, selectBankEle: ShSelectComponent): void {
        selectBankEle.filter = event.target.value !== undefined ? event.target.value : selectBankEle.fixedValue;
        this.selectedBankName = event.target.value !== undefined ? event.target.value : selectBankEle.fixedValue;
    }

    /**
     * To get total amount of selected account's balance
     *
     *
     * @memberof PaymentAsideComponent
     */
    public getTotalAmount(): void {
        let selectedAccount = cloneDeep(this.selectedAccForBulkPayment);
        this.totalSelectedAccountAmount = 0;
        if (selectedAccount && selectedAccount.length) {
            this.totalSelectedAccountAmount = selectedAccount.reduce((prev, cur) => {
                const closingBalanceAmount = Number(String(cur.closingBalanceAmount).replace(/,/g, ''));
                return prev + closingBalanceAmount;
            }, 0);
        }
        this.totalSelectedAccountAmount = Number(this.totalSelectedAccountAmount);
        if (selectedAccount && selectedAccount.length) {
            this.isValidData = selectedAccount.every(item => {
                return item.closingBalanceAmount && item.remarks ? true : false;
            });
        } else {
            this.isValidData = false;
        }
    }

    /**
     * To prevent zero from textbox
     *
     * @param {number} amount Amount
     * @param {number} index Index of item
     * @memberof PaymentAsideComponent
     */
    public preventZero(amount: number, index: number): void {
        if (Number(amount) <= 0) {
            this.selectedAccForBulkPayment[index].closingBalanceAmount = '';
        }
    }

    /**
     * To Prepare payment request object and API call
     *
     *
     * @memberof PaymentAsideComponent
     */
    public payClicked(): void {
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
            const closingBalanceAmount = Number(String(item?.closingBalanceAmount).replace(/,/g, ''));
            transaction.amount = String(closingBalanceAmount);
            transaction.remarks = item?.remarks;
            transaction.vendorUniqueName = item?.uniqueName;
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
        this.otpReceiverNameMessage = '';
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
        this.timerCountDown$ = of(min + ':' + sec);
        remaining -= 1;

        if (remaining >= 0 && this.timerOn) {
            this.countDownTimerRef = setTimeout(() => {
                this.startTimer(remaining);
            }, 1000);
            return;
        }

        if (this.timerOn) {
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
            transactionsFields.get('remarks')?.patchValue('');
            transactionsFields.get('amount')?.patchValue(val.closingBalanceAmount);
            transactionsFields.get('vendorUniqueName')?.patchValue(val.uniqueName);
        }
        return transactionsFields;
    }
    /**
     * To remove tansaction form row entry
     *
     * @param {number} Index of selected item
     * @memberof PaymentAsideComponent
     */
    public removeTransactionsDetailsForm(index: number): void {
        const transactions = this.addAccountBulkPaymentForm.get('bankPaymentTransactions') as FormArray;
        transactions.removeAt(index);
    }

    /**
     * This is to allow only digits
     *
     * @param {*} event
     * @returns {boolean}
     * @memberof PaymentAsideComponent
     */
    public allowOnlyNumbers(event: any): boolean {
        return this.generalService.allowOnlyNumbers(event);
    }

    /**
     * Releases memory
     *
     * @memberof PaymentAsideComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will get the payors list for bank account based on amount limit
     *
     * @private
     * @memberof PaymentAsideComponent
     */
    private getBankAccountPayorsList(): void {
        if(!this.selectedBankUniqueName || !this.totalSelectedAccountAmount) {
            return;
        }
        this.isPayorRequired = false;
        this.selectedBankUrn = '';
        this.requestObjectToGetOTP.urn = '';
        this.forceClear$ = of({ status: true });
        this.isPayorListInProgress = true;
        this.settingsIntegrationService.getBankAccountPayorsList(this.selectedBankUniqueName, this.totalSelectedAccountAmount).pipe(take(1)).subscribe(response => {
            if(response?.status === "success") {
                this.payorsList = [];

                response?.body?.forEach(payor => {
                    this.payorsList.push({label: payor?.user?.name, value: payor?.urn});
                });

                if(this.payorsList?.length === 1) {
                    this.selectPayor(this.payorsList[0]);
                }

                this.isPayorRequired = true;
            } else {
                this.payorsList = [];
                if(response?.message) {
                    this.toaster.showSnackBar("error", response?.message);
                }
            }
            this.isPayorListInProgress = false;
        });
    }
}

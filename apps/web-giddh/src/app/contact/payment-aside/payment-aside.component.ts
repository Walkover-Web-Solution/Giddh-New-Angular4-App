import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, SimpleChanges, OnChanges } from '@angular/core';
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
import { IRegistration, IntegartedBankList, BankTransactionForOTP, GetOTPRequest } from "../../models/interfaces/registration.interface";
import { ToasterService } from "../../services/toaster.service";
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, NgForm, FormBuilder, FormArray, Validators } from '@angular/forms';
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
    public integartedBankList$: Observable<IntegartedBankList[]>;
    public requestObjectTogetOTP: GetOTPRequest = {
        bankType: '',
        urn: '',
        totalAmount: '',
        bankPaymentTransactions: []

    };
    /** directive to emit boolean for close model */
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);


    public selectIntegratedBankList: IOption[] = [];
    // [{ label: "SBI Bank", value: "1234",  additional: ''},
    // { label: "BOI Bank", value: "1235" },
    // { label: "BOB Bank", value: "1234" },
    // { label: "RBI Bank", value: "1235" }];

    //Event emitter to close the Aside panel
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    //Input current account holders information
    @Input() public selectedAccForPayment: any;
    @Input() public selectedAccForBulkPayment: any[];
    public companyUniqueName: string;
    public timerCountDown$: Observable<string>;
    //Variable holding OTP received by user
    public OTP: number;
    public remarks: string = '';
    public successModalRef: BsModalRef;
    public totalSelectedAccountAmount: number;
    public timerOn: boolean = false;
    public isPayclicked: boolean = false;
    public selectedBankUrn: any;
    public countDownTimerRef: any;
    public totalAvailableBalance: any;
    public totalSelectedLength: number;
    public addAccountBulkPaymentForm: FormGroup;
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

        this.integartedBankList$ = this.store.pipe(select(p => p.company.integratedBankList), takeUntil(this.destroyed$));
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
        this.initializeNewForm();
        // this.amount = this.selectedAccForPayment.closingBalance.amount;
        // get all registered account
        this.store.pipe((select(c => c.session.companyUniqueName)), take(2)).subscribe(s => this.companyUniqueName = s);
        this.store.dispatch(this._companyActions.getAllRegistrations());

        //get current registered account on the user
        this.store.select(p => p.company).pipe(takeUntil(this.destroyed$)).subscribe((o) => {
            if (o.account) {
                this.registeredAccounts = o.account;
                if (this.registeredAccounts.length === 1) {
                    this.mode = this.registeredAccounts[0];
                }
            }
        });
        if (this.companyUniqueName) {
            this.store.dispatch(this._companyActions.getAllIntegratedBankInCompany(this.companyUniqueName));
        }
        //get selecetd vendors account details
        this.store.dispatch(this.accountsAction.getAccountDetails(this.selectedAccForPayment.uniqueName));
        this.activeAccount$.subscribe(acc => {
            if (acc && acc.accountBankDetails) {
                this.accountDetails = acc;
                if (acc.country && acc.country.countryCode) {
                    this.countryCode = this.accountDetails.country.countryCode
                }

            }
        });

        this.integartedBankList$.pipe(takeUntil(this.destroyed$)).subscribe((bankList: IntegartedBankList[]) => {
            this.selectIntegratedBankList = [];
            if (bankList && bankList.length) {
                bankList.forEach(item => {
                    if (item) {
                        item.bankName = item.bankName ? item.bankName : "Dummy bank name for account UI";
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
        });

        if (this.selectedAccForBulkPayment.length < this.totalSelectedLength) {
            let unSelected: number = this.totalSelectedLength - this.selectedAccForBulkPayment.length;
            let totalSelected: number = this.selectedAccForBulkPayment.length;
            if (totalSelected && unSelected) {
                this._toaster.infoToast(`${unSelected} out of ${totalSelected} transactions could not be processed as bank details of those accounts are not updated.`);
            }

        }
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
            if (changes.selectedAccForBulkPayment && changes.selectedAccForBulkPayment.currentValue) {
                this.totalSelectedLength = changes.selectedAccForBulkPayment.currentValue.length;
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
        let request = {
            params: {
                urn: this.mode.iciciCorporateDetails.URN
            }
        };
        //commented due to api changed
        // this._companyService.getOTP(request).subscribe((res) => {
        //     if (res.status === 'success') {
        //         this.OTPsent = true;
        //     } else {
        //         if (res.status === 'error' && res.code === 'BANK_ERROR') {
        //             this._toaster.warningToast(res.message);
        //         } else {
        //             this._toaster.errorToast(res.message);
        //         }
        //     }
        // });
        this.timerOn = true
        this.startTimer(40);
    }

    /*
    * API call to confirm OTP received by user
    *
    * */
    public confirmOTP() {
        let bankTransferRequest: BankTransferRequest = new BankTransferRequest();
        bankTransferRequest.amount = this.amount;
        bankTransferRequest.otp = this.OTP;
        bankTransferRequest.URN = this.mode.iciciCorporateDetails.URN;
        bankTransferRequest.payeeName = this.user.user.name;
        bankTransferRequest.transferAccountUniqueName = this.accountDetails.uniqueName;
        bankTransferRequest.remarks = this.remarks;
        this._companyService.confirmOTP(bankTransferRequest).subscribe((res) => {
            if (res.status === 'success') {
                this.closeAsidePane();
            } else {
                if (res.status === 'error' && res.code === 'BANK_ERROR') {
                    this._toaster.warningToast(res.message);
                } else {
                    this._toaster.errorToast(res.message);
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
    public closePaymentModel(): any {
        this.closeModelEvent.emit(true);
    }

    public getIntegratedBankDetails(): void {
        this.store.dispatch(this._companyActions.getAllIntegratedBankInCompany(this.companyUniqueName));
    }

    /**
     *To select bank event
     *
     * @param {*} event selected bank object
     * @memberof PaymentAsideComponent
     */
    public selectBank(event: IOption): void {
        this.selectedBankUrn = event.value;
        if (event) {
            this.requestObjectTogetOTP.urn = event.value;
            this.requestObjectTogetOTP.bankType = event.label;
            this._companyService.getAllBankDetailsOfIntegrated(this.companyUniqueName, this.requestObjectTogetOTP.urn).subscribe(response => {

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
        *To select bank event
        *
        * @param {*} event selected bank object
        * @memberof PaymentAsideComponent
        */
    public bulkPayVendor(): void {
        this._companyService.bulkVendorPayment(this.companyUniqueName, this.requestObjectTogetOTP).subscribe(response => {

            if (response.status === 'success') {
                this._toaster.successToast(response.body);
            } else if (response.status === 'error') {
                this._toaster.errorToast(response.message, response.code);
            }
        });
    }




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
     * @param {NgForm} form Form data
     * @memberof PaymentAsideComponent
     */
    public payClicked(form: NgForm) {
        this.isPayclicked = true;
        this.prepareRequestObject();
        this.bulkPayVendor();
    }

    public prepareRequestObject() {
        this.requestObjectTogetOTP.bankPaymentTransactions = [];
        this.requestObjectTogetOTP.totalAmount = String(this.totalSelectedAccountAmount);
        this.selectedAccForBulkPayment.forEach(item => {
            let transaction: BankTransactionForOTP = {
                amount: '',
                remarks: '',
                vendorUniqueName: ''
            };
            transaction.amount = item.closingBalance.amount;
            transaction.remarks = item.remarks;
            transaction.vendorUniqueName = item.uniqueName;
            this.requestObjectTogetOTP.bankPaymentTransactions.push(transaction);
        });
    }

    /**
     * To cancel OTP request and count down timer
     *
     * @memberof PaymentAsideComponent
     */
    public clickedCancelOtp() {
        this.isPayclicked = false;
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


    public initializeNewForm() {
        this.addAccountBulkPaymentForm = this.formBuilder.group({
            bankType: [''],
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


    public addAccountTransactionsFormObject(value: any) {    // commented code because we no need GSTIN No. to add new address
        // if (value && !value.startsWith(' ', 0)) {
        const transactions = this.addAccountBulkPaymentForm.get('bankPaymentTransactions') as FormArray;
        transactions.push(this.initialAccountTransactionsForm(value));
        return;
    }

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


    public removeTransactionsDetailsForm(i: number) {
        const transactions = this.addAccountBulkPaymentForm.get('bankPaymentTransactions') as FormArray;
        transactions.removeAt(i);
    }
}

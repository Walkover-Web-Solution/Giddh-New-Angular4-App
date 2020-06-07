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
import { IRegistration, IntegartedBankList } from "../../models/interfaces/registration.interface";
import { ToasterService } from "../../services/toaster.service";
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup } from '@angular/forms';
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
    //  public addAccountForm: FormGroup;
    constructor(
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
        this.store.pipe((select(c => c.session.companyUniqueName)), take(1)).subscribe(s => this.companyUniqueName = s);
        this.integartedBankList$ = this.store.select(p => p.company.integratedBankList).pipe(takeUntil(this.destroyed$));
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

        this.amount = this.selectedAccForPayment.closingBalance.amount;
        // get all registered account
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
                        this.selectIntegratedBankList.push({ label: item.bankName, value: item.urn, additional: item });
                        this.selectIntegratedBankList.push({ label: item.bankName, value: item.urn, additional: item });
                    }
                })
            }
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
            if (changes.selectedAccForBulkPayment && changes.selectedAccForBulkPayment.currentValue) {
                //this.datePickerOptions.startDate = moment(changes.startDate.currentValue, 'DD-MM-YYYY');
                this.selectedAccForBulkPayment.filter(item => {
                    return item.hasBankDetails === true && item.accountBankDetails && item.accountBankDetails.bankAccountNo !== '';
                });
                this.getTotalAmount(this.selectedAccForBulkPayment);
            }
        }
        console.log('selected', this.selectedAccForBulkPayment, changes);
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
    public selectBank(event): void {
        console.log(event);
    }


    public getTotalAmount(selectedAccount: any[]): void {
        this.totalSelectedAccountAmount = 0;
        if (selectedAccount && selectedAccount.length) {
            this.totalSelectedAccountAmount = selectedAccount.reduce((prev, cur) => {
                return prev + cur.closingBalance.amount;
            }, 0);
        }
    }

    public payClicked() {
        this.isPayclicked = true;
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
            setTimeout(() => {
                this.startTimer(remaining);
            }, 1000);
            return;
        }

        if (!this.timerOn) {
            console.log('Timer Do validate stuff here');
            return;
        }
        console.log('Time out');
    }

}

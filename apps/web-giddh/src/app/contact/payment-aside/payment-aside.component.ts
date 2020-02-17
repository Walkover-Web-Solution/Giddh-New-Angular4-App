import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { AccountsAction } from '../../actions/accounts.actions';
import { CompanyActions } from "../../actions/company.actions";
import { takeUntil, take } from 'rxjs/operators';
import { Observable, of as observableOf, ReplaySubject } from "rxjs";
import { VerifyEmailResponseModel, VerifyMobileModel } from "../../models/api-models/loginModels";
import { AccountResponseV2 } from "../../models/api-models/Account";
import { CompanyService } from "../../services/companyService.service";
import { BankTransferRequest } from "../../models/api-models/Company";
import { IRegistration } from "../../models/interfaces/registration.interface";
import { ToasterService } from "../../services/toaster.service";

@Component({
    selector: 'payment-aside',
    templateUrl: './payment-aside.component.html',
    styleUrls: [`./payment-aside.component.scss`],
})


export class PaymentAsideComponent implements OnInit {

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

    //Event emitter to close the Aside panel
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    //Input current account holders information
    @Input() public selectedAccForPayment: any;
    //Variable holding OTP received by user
    public OTP: number;
    remarks: string = '';
    constructor(
        private store: Store<AppState>,
        private _companyActions: CompanyActions,
        private accountsAction: AccountsAction,
        private _companyService: CompanyService,
        private _toaster: ToasterService
    ) {
        this.userDetails$ = this.store.select(p => p.session.user);
        this.userDetails$.pipe(take(1)).subscribe(p => this.user = p);
        this.activeAccount$ = this.store.select(state => state.groupwithaccounts.activeAccount).pipe(takeUntil(this.destroyed$));
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
        //get selecetd vendors account details
        this.store.dispatch(this.accountsAction.getAccountDetails(this.selectedAccForPayment.uniqueName));
        this.activeAccount$.subscribe(acc => {
            if (acc && acc.accountBankDetails) {
                this.accountDetails = acc;
            }
        });
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
}

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from "rxjs";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../../store";
import { ContactService } from "../../../services/contact.service";
import { take, takeUntil, tap } from "rxjs/operators";
import { createSelector } from "reselect";
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { API_BULK_FETCH_LIMIT, BROADCAST_CHANNELS } from '../../../app.constant';
import { CommonActions } from '../../../actions/common.actions';
import { HomeComponentStore } from '../../home.store';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { InstitutionsListComponent } from '../../../shared/bank-integration/institutions-list/institutions-list.component';
import { GeneralService } from '../../../services/general.service';
import { BankIntegrationComponentStore } from '../../../shared/bank-integration/utility/bank-integration.store';
import { BankLinkComponent } from '../../../shared/bank-integration/bank-link/bank-link.component';
import { SettingIntegrationComponentStore } from '../../../settings/integration/utility/setting.integration.store';
import { BankIntegrationDialogComponent } from '../../../shared/bank-integration/bank-integration-popup/bank-integration-popup.component';
import { Router } from '@angular/router';
import { cloneDeep, filter, forEach, keys, map, some } from '../../../lodash-optimized';

@Component({
    selector: 'bank-accounts',
    templateUrl: 'bank-accounts.component.html',
    standalone: false,
    styleUrls: ['./bank-accounts.component.scss', '../../home.component.scss'],
    providers: [BankIntegrationComponentStore, HomeComponentStore, SettingIntegrationComponentStore]
})
export class BankAccountsComponent implements OnInit, OnDestroy {
    public universalDate$: Observable<any>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public datePickerOptions: any;
    public dayjs = dayjs;
    public toDate: string;
    public fromDate: string;
    public bankAccounts: any[] = [];
    public activeCompany: any = {};
    /** This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** True if relogin required in any bank account */
    public reLoginRequired: boolean = false;
    /** Holds Store refresh bank success message as observable*/
    private bankMessage$: Observable<any> = this.homeComponentStore.select(state => state.bankMessage);
    /** Holds Store refresh bank loading as observable*/
    public isBankRefreshing$: Observable<any> = this.homeComponentStore.select(state => state.isBankRefreshing);
    /** Holds Store requisition list on account link dialog gets open as observable*/
    public requisitionList$: Observable<any> = this.componentStore.select(state => state.requisitionList);
    /** Holds Create New Account Dialog Ref */
    public createNewAccountDialogRef: MatDialogRef<any>;
    /** Hold reference number */
    public referenceNumber: string = '';
    /** Holds true if current company country is gocardless supported country */
    public isGocardlessSupportedCountry: boolean;
    /** True, if is integration module are in scope  */
    public hasIntegrationScope: boolean = false;
    /** Holds unique name of bank account */
    public bankAccountUniqueNames: any[] = []
    /** Holds selected bank unique name */
    private selectedBankUniqueName: string;
    /** Hold callback broadcast event */
    public callBackBroadcast: any;
    /** Holds the bank account which is not linked */
    public unlinkBankList: any[] = [];
    /** Holds list of connected banks */
    private bankList: any[] = [];
    /** Holds Bank Integration Dialog Ref */
    public bankIntegrationDialogRef: any;
    /** Holds if user directly integrate to bank account */
    public isDirectlyIntegrated: boolean = false;
    /** True if active account is bank account */
    public isBankAccountConnected: boolean = null;

    constructor(
        private store: Store<AppState>,
        private contactService: ContactService,
        private commonAction: CommonActions,
        private changeDetectionRef: ChangeDetectorRef,
        private homeComponentStore: HomeComponentStore,
        public dialog: MatDialog,
        private router: Router,
        private generalService: GeneralService,
        private componentStore: BankIntegrationComponentStore,
        private settingIntegrationComponentStore: SettingIntegrationComponentStore
    ) {
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.store.pipe(select(createSelector([(states: AppState) => states.session.applicationDate], (dateObj: Date[]) => {
            if (dateObj) {
                let universalDate = cloneDeep(dateObj);
                this.datePickerOptions = {
                    ...this.datePickerOptions, startDate: dayjs(universalDate[0], GIDDH_DATE_FORMAT).toDate(),
                    endDate: dayjs(universalDate[1], GIDDH_DATE_FORMAT).toDate(),
                    chosenLabel: universalDate[2]
                };
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.getAccounts(this.fromDate, this.toDate, 'bankaccounts', null, null, 'true', API_BULK_FETCH_LIMIT, '', 'closingBalance', 'desc');
            }
        })), takeUntil(this.destroyed$)).subscribe();

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });

        const broadcast = new BroadcastChannel(BROADCAST_CHANNELS.REAUTH_PLAID_SUCCESS);
        broadcast.onmessage = (event) => {
            if (event?.data) {
                this.getAccounts(this.fromDate, this.toDate, 'bankaccounts', null, null, 'true', API_BULK_FETCH_LIMIT, '', 'closingBalance', 'desc');
            }
        };

        this.settingIntegrationComponentStore.getAllBankAccountsList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response?.body) {
                this.bankList = response.body;
                if (response.body.some(item => item.account?.uniqueName === this.selectedBankUniqueName)) {
                    this.isBankAccountConnected = true;
                }
                this.unlinkBankList = response.body.filter(bank => Object.keys(bank.account).length === 0);
                const referNo = localStorage.getItem('refNo');
                if (this.isDirectlyIntegrated && referNo !== null && referNo !== undefined) {
                    this.getLinkBankAccount();
                } else {
                    this.getBank();
                }
            }
        });

        this.bankMessage$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.getAccounts(this.fromDate, this.toDate, 'bankaccounts', null, null, 'true', API_BULK_FETCH_LIMIT, '', 'closingBalance', 'desc');
            }
        });

        this.homeComponentStore.profile$.pipe(takeUntil(this.destroyed$)).subscribe((profile) => {
            if (profile?.userEntityRoles) {
                profile.userEntityRoles.forEach(role => {
                    const scopes = role.role.scopes;
                    if (scopes && scopes.some(scope => scope.name === 'INTEGRATION')) {
                        this.hasIntegrationScope = true;
                    }
                });
            }
            if (profile && profile.countryV2 && profile.countryV2.alpha2CountryCode) {
                this.isGocardlessSupportedCountry = this.generalService.checkCompanySupportGoCardless(profile.countryV2.alpha2CountryCode);
            }
        })
        this.requisitionList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.router.url === '/pages/home') {
                if (!this.selectedBankUniqueName) {
                    this.router.navigate(['/pages/settings/integration/payment']);
                } else {
                    this.getAllBanks();
                    this.getAccounts(this.fromDate, this.toDate, 'bankaccounts', null, null, 'true', API_BULK_FETCH_LIMIT, '', 'closingBalance', 'desc')
                    this.isDirectlyIntegrated = true;
                    this.componentStore.setState(state => ({
                        ...state,
                        requisitionList: null
                    }));
                }
            }
        });

        this.settingIntegrationComponentStore.updateAccount$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.getAccounts(this.fromDate, this.toDate, 'bankaccounts', null, null, 'true', API_BULK_FETCH_LIMIT, '', 'closingBalance', 'desc');
                this.changeDetectionRef.detectChanges();
            }
        });

        this.callBackBroadcast = new BroadcastChannel("call-back-subscription");
        this.callBackBroadcast.onmessage = (event) => {
            if (event?.data?.success) {
                const referNo = localStorage.getItem('refNo');
                if (referNo !== null && referNo !== undefined) {
                    setTimeout(() => {
                        this.componentStore.getRequisition(referNo);
                    }, 100);
                }
            }
        };
    }

    /**
     * Get Banks
     *
     * @memberof BankAccountsComponent
     */
    public getBank(): void {
        if (!this.unlinkBankList?.length) {
            this.openInstitutionsDialog();
        } else if (this.unlinkBankList?.length === 1 && !this.isBankAccountConnected) {
            this.linkBankAccount();
        } else if (this.unlinkBankList?.length > 1 || this.isBankAccountConnected) {
            this.bankIntegrationDialogRef = this.dialog.open(BankIntegrationDialogComponent, {
                data: {
                    commonLocaleData: this.commonLocaleData,
                    localeData: this.localeData
                },
                panelClass: ['mat-dialog-sm'],
                disableClose: true
            });
            this.bankIntegrationDialogRef.afterClosed().subscribe(response => {
                if (response) {
                    if (response === 'integrate') {
                        this.openInstitutionsDialog();
                    } else if (response === 'link') {
                        this.getLinkBankAccount();
                    }
                }
                this.changeDetectionRef.detectChanges();
            });
        }
    }

    /**
     * This will get all accounts of giddh
     *
     * @private
     * @param {string} fromDate
     * @param {string} toDate
     * @param {string} groupUniqueName
     * @param {number} [pageNumber]
     * @param {string} [requestedFrom]
     * @param {string} [refresh]
     * @param {number} [count=API_BULK_FETCH_LIMIT]
     * @param {string} [query]
     * @param {string} [sortBy='']
     * @param {string} [order='asc']
     * @memberof BankAccountsComponent
     */
    private getAccounts(fromDate: string, toDate: string, groupUniqueName: string, pageNumber?: number, requestedFrom?: string, refresh?: string, count: number = API_BULK_FETCH_LIMIT, query?: string, sortBy: string = '', order: string = 'asc') {
        this.isLoading = true;
        pageNumber = pageNumber ? pageNumber : 1;
        refresh = refresh ? refresh : 'false';
        this.contactService.GetContacts(fromDate, toDate, groupUniqueName, pageNumber, refresh, count, query, sortBy, order).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res?.status === 'success') {
                this.bankAccounts = res?.body?.results?.map(bank => {
                    if (bank?.accountBankTransactionTotal?.bankName) {
                        bank.accountBankTransactionTotal['translatedBankName'] = this.getBankTranslateName(bank.accountBankTransactionTotal.bankName);
                    }
                    return bank;
                });
            }
            const reLoginRequired = this.bankAccounts?.filter(bankaccount => bankaccount.reLoginRequired);
            this.reLoginRequired = (reLoginRequired?.length) ? true : false;

            this.isLoading = false;

            this.changeDetectionRef.detectChanges();
        });
    }
    /**
     * Initiate request to open plaid popup
     *
     * @memberof BankAccountsComponent
     */
    public getPlaidLinkToken(itemId: any): void {
        this.store.dispatch(this.commonAction.reAuthPlaid({ itemId: itemId, reauth: true }));
    }

    /**
     * Retrieves the translated bank name by replacing a placeholder in the localized string
     *
     * @param bankName
     * @returns
     */
    private getBankTranslateName(bankName: string): string {
        return this.localeData?.in_bank?.replace("[BANK_NAME]", bankName);
    }

    /**
     * Refresh bank transactions
     *
     * @memberof BankAccountsComponent
     */
    public refreshBankTransactions(): void {
        this.homeComponentStore.refreshGoCardlessBankTransactions('');
    }

    public ngOnDestroy() {
        if (window.localStorage) {
            localStorage.removeItem('refNo');
        }
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
    * This function will use for get institutions details
    *
    * @param {*} element
    * @memberof BankAccountsComponent
    */
    public openInstitutionsDialog(): void {
        let data = {
            localeData: this.localeData,
            commonLocaleData: this.commonLocaleData,
        }
        const dialogRef = this.dialog.open(InstitutionsListComponent, {
            data: data,
            panelClass: ['subscription-sidebar', 'mat-dialog-md'],
            role: 'alertdialog',
            ariaLabel: 'institutionsListDialog'
        });

        dialogRef.afterClosed().subscribe(response => {
            if (response) {
                localStorage.setItem('refNo', response);
                this.referenceNumber = cloneDeep(response);
            }
        });
    }

    /**
    * This will get all connected bank accounts
    *
    * @memberof BankAccountsComponent
    */
    public getAllBankAccounts(): void {
        this.isBankAccountConnected = null;
        this.settingIntegrationComponentStore.getAllBankAccounts();
    }

    /**
    * This will link the connected bank accounts
    *
    * @memberof BankAccountsComponent
    */
    public linkBankAccount(): void {
        const request = { bankAccountUniqueName: this.unlinkBankList[0]?.bankResource?.uniqueName };
        const accountForm = {
            accountNumber: this.unlinkBankList[0]?.bankResource?.accountNumber,
            accountUniqueName: this.selectedBankUniqueName,
            paymentAlerts: []
        }
        this.settingIntegrationComponentStore.updateAccount({ accountForm, request });
    }

    /**
    * This will open the dialog to link a bank
    *
    * @memberof BankAccountsComponent
    */
    public openBankLinkDialog(bankAccount: any): void {
        this.selectedBankUniqueName = bankAccount?.uniqueName;
        this.getAllBankAccounts();
    }

    /**
     * This will be use for get bank account by its unique name
     *
     * @memberof BankAccountsComponent
     */
    public getLinkBankAccount(): void {
        if (this.unlinkBankList.length === 1 && !this.isBankAccountConnected) {
            this.linkBankAccount();
        } else {
            const data = {
                bankList: this.bankList ?? [],
                accountUniqueName: this.selectedBankUniqueName
            }
            const dialogRef = this.dialog.open(BankLinkComponent, {
                data: data,
                panelClass: ['mat-dialog-md'],
                disableClose: true
            });
            dialogRef.afterClosed().pipe(take(1), tap(response => {
                if (response && response !== 'closeDialog') {
                    this.isBankAccountConnected = true; this.referenceNumber = null; localStorage.setItem('refNo', null); this.getAllBankAccounts();
                }
            })).subscribe();
        }
    }

    /**
     * This will be use for get all bank accounts
     *
     * @memberof BankAccountsComponent
     */
    public getAllBanks(): void {
        this.settingIntegrationComponentStore.getAllBankAccounts();
    }

}

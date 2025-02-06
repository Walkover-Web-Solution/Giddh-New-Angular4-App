import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from "rxjs";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../../store";
import { ContactService } from "../../../services/contact.service";
import { take, takeUntil } from "rxjs/operators";
import { createSelector } from "reselect";
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { BROADCAST_CHANNELS } from '../../../app.constant';
import { CommonActions } from '../../../actions/common.actions';
import { HomeComponentStore } from '../../home.store';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { InstitutionsListComponent } from '../../../shared/bank-integration/institutions-list/institutions-list.component';
import { GeneralService } from '../../../services/general.service';
import { BankIntegrationComponentStore } from '../../../shared/bank-integration/utility/bank-integration.store';
import { BankLinkComponent } from '../../../shared/bank-integration/bank-link/bank-link.component';
import { Router } from '@angular/router';

@Component({
    selector: 'bank-accounts',
    templateUrl: 'bank-accounts.component.html',
    styleUrls: ['./bank-accounts.component.scss', '../../home.component.scss'],
    providers: [BankIntegrationComponentStore, HomeComponentStore]
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

    constructor(
        private store: Store<AppState>,
        private contactService: ContactService,
        private commonAction: CommonActions,
        private changeDetectionRef: ChangeDetectorRef,
        private homeComponentStore: HomeComponentStore,
        private router: Router,
        public dialog: MatDialog,
        private generalService: GeneralService,
        private componentStore: BankIntegrationComponentStore
    ) {
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.store.pipe(select(createSelector([(states: AppState) => states.session.applicationDate], (dateObj: Date[]) => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.datePickerOptions = {
                    ...this.datePickerOptions, startDate: dayjs(universalDate[0], GIDDH_DATE_FORMAT).toDate(),
                    endDate: dayjs(universalDate[1], GIDDH_DATE_FORMAT).toDate(),
                    chosenLabel: universalDate[2]
                };
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.getAccounts(this.fromDate, this.toDate, 'bankaccounts', null, null, 'true', 200, '', 'closingBalance', 'desc');
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
                this.getAccounts(this.fromDate, this.toDate, 'bankaccounts', null, null, 'true', 200, '', 'closingBalance', 'desc');
            }
        };

        this.bankMessage$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.getAccounts(this.fromDate, this.toDate, 'bankaccounts', null, null, 'true', 200, '', 'closingBalance', 'desc');
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
            if (response) {
                this.openBankLinkDialog();
            }
        });

        window.addEventListener('message', event => {
              console.log('bank-account',event, this.router.url);
              if (this.router.url === '/pages/home') {
                if (event && event.data === "GOCARDLESS") {
                    if (this.referenceNumber) {
                        this.componentStore.getRequisition(this.referenceNumber);
                    }
                }
            }
        });
    }

    /**
     * This will get all accounts of giddh
     *
     * @memberof BankAccountsComponent
     */
    private getAccounts(fromDate: string, toDate: string, groupUniqueName: string, pageNumber?: number, requestedFrom?: string, refresh?: string, count: number = 200, query?: string, sortBy: string = '', order: string = 'asc') {
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
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
    /**
    * This function will use for get institutions details
    *
    * @param {*} element
    * @memberof BankAccountsComponent
    */
    public openInstitutionsDialog(bankAccount: any): void {
        this.selectedBankUniqueName = bankAccount?.uniqueName;

        let data = {
            localeData: this.localeData,
            commonLocaleData: this.commonLocaleData
        }
        const dialogRef = this.dialog.open(InstitutionsListComponent, {
            data: data,
            width: 'var(--aside-pane-width)',
            panelClass: 'subscription-sidebar',
            role: 'alertdialog',
            ariaLabel: 'institutionsListDialog'
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.referenceNumber = response;
            }
        });

    }
    /**
     * This will add and Remove the listener immediately after triggering getRequisition
     *
     * @memberof BankAccountsComponent
     */
    public setupGocardlessMessageListener(): void {
        const messageHandler = (event) => {
            if (event && event.data === "GOCARDLESS") {
                if (this.referenceNumber) {
                    this.componentStore.getRequisition(this.referenceNumber);
                    // window.removeEventListener('message', messageHandler);
                }
            }
        };
        window.addEventListener('message', messageHandler);
    }

    /**
    * This will open the dialog to link a bank
    *
    * @memberof BankAccountsComponent
    */
    public openBankLinkDialog(): void {
        this.dialog.open(BankLinkComponent, {
            data: { accountUniqueName: this.selectedBankUniqueName },
            panelClass: ['mat-dialog-md'],
            disableClose: true
        });
    }
}

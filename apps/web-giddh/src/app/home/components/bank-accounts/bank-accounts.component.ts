import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from "rxjs";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../../store";
import { ContactService } from "../../../services/contact.service";
import { takeUntil } from "rxjs/operators";
import { createSelector } from "reselect";
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { BROADCAST_CHANNELS } from '../../../app.constant';
import { CommonActions } from '../../../actions/common.actions';
import { HomeComponentStore } from '../../home.store';
import { GeneralService } from '../../../services/general.service';

@Component({
    selector: 'bank-accounts',
    templateUrl: 'bank-accounts.component.html',
    styleUrls: ['./bank-accounts.component.scss', '../../home.component.scss'],
    providers: [HomeComponentStore]
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
    /** Holds true if current company country is gocardless supported country */
    public isGocardlessSupportedCountry: boolean;
    /** True, if is integration module are in scope  */
    public hasIntegrationScope: boolean = false;

    constructor(
        private store: Store<AppState>,
        private contactService: ContactService,
        private commonAction: CommonActions,
        private changeDetectionRef: ChangeDetectorRef,
        private homeComponentStore: HomeComponentStore,
        private generalService: GeneralService
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
                this.getAccounts(this.fromDate, this.toDate, 'bankaccounts', null, null, 'true', 20, '', 'closingBalance', 'desc');
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
                this.getAccounts(this.fromDate, this.toDate, 'bankaccounts', null, null, 'true', 20, '', 'closingBalance', 'desc');
            }
        };

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

        this.bankMessage$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.getAccounts(this.fromDate, this.toDate, 'bankaccounts', null, null, 'true', 20, '', 'closingBalance', 'desc');
            }
        });

    }

    private getAccounts(fromDate: string, toDate: string, groupUniqueName: string, pageNumber?: number, requestedFrom?: string, refresh?: string, count: number = 20, query?: string, sortBy: string = '', order: string = 'asc') {
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
        this.homeComponentStore.refreshGoCardlessBankTransactions();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { select, Store } from "@ngrx/store";
import { SELECT_ALL_RECORDS } from "apps/web-giddh/src/app/app.constant";
import { IForceClear } from "apps/web-giddh/src/app/models/api-models/Sales";
import { SalesService } from "apps/web-giddh/src/app/services/sales.service";
import { SettingsIntegrationService } from "apps/web-giddh/src/app/services/settings.integraion.service";
import { ToasterService } from "apps/web-giddh/src/app/services/toaster.service";
import { AppState } from "apps/web-giddh/src/app/store";
import { IOption } from "apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface";
import { Observable, of as observableOf, ReplaySubject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { SettingsAmountLimitDuration, UNLIMITED_LIMIT } from "../../../../constants/settings.constant";

@Component({
    selector: 'icici-account-create-edit',
    templateUrl: './account-create-edit.component.html',
    styleUrls: ['./account-create-edit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AccountCreateEditComponent implements OnInit, OnDestroy {
    /** This holds bank account details, If this is passed, it means we are in edit mode */
    @Input() public activeBankAccount: any;
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** This emits true if bank accounts list needs refresh */
    @Output() public getAllBankAccounts: EventEmitter<boolean> = new EventEmitter();
    /** This emits true if create account modal needs to be closed */
    @Output() public closeModalEvent: EventEmitter<boolean> = new EventEmitter();
    /* This will hold local JSON data */
    public localeData: any = {};
    /** Form Group for account form */
    public accountForm: FormGroup;
    /** This will hold list of accounts */
    public bankAccounts$: Observable<IOption[]>;
    /** This will hold users list */
    public usersList: any[] = [];
    /** This will hold users list */
    public paymentAlertsUsersList: any[] = [];
    /** Holds string for select all records */
    public selectAllRecords: string = SELECT_ALL_RECORDS;
    /* This will clear the selected payment updates values */
    public forceClearPaymentUpdates$: Observable<IForceClear> = observableOf({ status: false });
    /** List of users to receive payment alerts */
    public paymentAlerts: any[] = [];
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds the amount limit duration options */
    public amountLimitDurations: IOption[] = [];
    /** True if api call is pending */
    public isLoading: boolean = true;
    /** True if we should show select all option selected */
    public shouldShowSelectAllChecked: boolean = false;

    constructor(
        private toaster: ToasterService,
        private settingsIntegrationService: SettingsIntegrationService,
        private salesService: SalesService,
        private store: Store<AppState>,
        private formBuilder: FormBuilder,
        private changeDetection: ChangeDetectorRef
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof AccountCreateEditComponent
     */
    public ngOnInit(): void {
        if (this.activeBankAccount) {
            this.paymentAlerts = this.activeBankAccount?.iciciDetailsResource?.paymentAlerts?.map(user => user.uniqueName);

            this.accountForm = this.formBuilder.group({
                accountNumber: [this.activeBankAccount?.iciciDetailsResource?.accountNumber, Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(18)])],
                accountUniqueName: [this.activeBankAccount?.account?.uniqueName],
                paymentAlerts: [this.paymentAlerts]
            });
        } else {
            this.accountForm = this.formBuilder.group({
                bank: ['ICICI'],
                loginId: ['', Validators.required],
                accountNumber: ['', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(18)])],
                accountUniqueName: ['', Validators.required],
                paymentAlerts: [''],
                userUniqueName: ['', Validators.required],
                duration: [UNLIMITED_LIMIT],
                maxAmount: ['']
            });
        }

        this.loadUsersWithCompanyPermissions();
        this.loadDefaultBankAccountsSuggestions();
    }

    /**
     * Releases all the observables to avoid memory leaks
     *
     * @memberof AccountCreateEditComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Loads all bank accounts
     *
     * @private
     * @memberof AccountCreateEditComponent
     */
    private loadDefaultBankAccountsSuggestions(): void {
        this.salesService.getAccountsWithCurrency('bankaccounts').pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body?.results) {
                const bankAccounts = response.body.results.map(account => ({
                    label: account.name,
                    value: account.uniqueName
                }))
                this.bankAccounts$ = observableOf(bankAccounts);
            }
            this.isLoading = false;
            this.changeDetection.detectChanges();
        });
    }

    /**
     * Loads users with company permissions
     *
     * @private
     * @memberof AccountCreateEditComponent
     */
    private loadUsersWithCompanyPermissions(): void {
        this.store.pipe(select(state => state.settings.usersWithCompanyPermissions), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.usersList = [];
                this.paymentAlertsUsersList = [];
                let index = 0;

                if(response?.length > 0) {
                    this.paymentAlertsUsersList.push({ index: index, label: this.commonLocaleData?.app_select_all, value: this.selectAllRecords });
                    index++;

                    response.forEach(user => {
                        this.paymentAlertsUsersList.push({ index: index, label: user.userName, value: user.userUniqueName });
                        this.usersList.push({ index: index, label: user.userName, value: user.userUniqueName });
                        index++;
                    });

                    let isAllOptionsChecked = this.paymentAlerts?.filter(paymentAlertUser => paymentAlertUser !== this.selectAllRecords); 
                    if((isAllOptionsChecked?.length === this.paymentAlertsUsersList?.length - 1)) {
                        // if all options checked and select all is unchecked, we need to show select all as selected
                        this.paymentAlerts.push(this.selectAllRecords);
                    }
                }
            }
        });
    }

    /**
     * This will save the new account
     *
     * @memberof AccountCreateEditComponent
     */
    public saveNewAccount(): void {
        if (!this.accountForm?.invalid) {
            this.accountForm.get('paymentAlerts')?.patchValue(this.paymentAlerts?.filter(user => user !== this.selectAllRecords));

            this.settingsIntegrationService.bankAccountRegistration(this.accountForm.value).pipe(take(1)).subscribe(response => {
                if (response?.status === "success") {
                    if (response?.body?.message) {
                        this.toaster.clearAllToaster();
                        this.toaster.successToast(response?.body?.message);
                    }
                    this.getAllBankAccounts.emit(true);
                    this.closeAccountModal();
                } else {
                    this.toaster.clearAllToaster();
                    this.toaster.errorToast(response?.message);
                }
            });
        }
    }

    /**
     * This will close the account modal
     *
     * @memberof AccountCreateEditComponent
     */
    public closeAccountModal(): void {
        this.closeModalEvent.emit(true);
    }

    /**
     * Selects the users
     *
     * @param {*} event Select event
     * @memberof AccountCreateEditComponent
     */
    public selectPaymentAlertUsers(event: any): void {
        if(event) {
            let isSelectedValueAlreadyChecked = this.paymentAlerts?.filter(paymentAlertUser => paymentAlertUser === event?.value);
            if(event?.value === this.selectAllRecords) {
                if(isSelectedValueAlreadyChecked?.length > 0) {
                    this.paymentAlerts = [];
                    this.forceClearPaymentUpdates$ = observableOf({ status: true });
                } else {
                    this.paymentAlerts = this.paymentAlertsUsersList.map(user => user.value);
                }
            } else {
                if(isSelectedValueAlreadyChecked?.length > 0) {
                    this.paymentAlerts = this.paymentAlerts?.filter(paymentAlertUser => paymentAlertUser !== event?.value);
                } else {
                    this.paymentAlerts.push(event?.value);
                }

                let isAllOptionsChecked = this.paymentAlerts?.filter(paymentAlertUser => paymentAlertUser !== this.selectAllRecords); 
                let isSelectAllChecked = this.paymentAlerts?.filter(paymentAlertUser => paymentAlertUser === this.selectAllRecords);
                if((isAllOptionsChecked?.length === this.paymentAlertsUsersList?.length - 1) && !isSelectAllChecked?.length) {
                    // if all options checked and select all is unchecked, we need to show select all as selected
                    this.paymentAlerts.push(this.selectAllRecords);
                } else if((isAllOptionsChecked?.length < this.paymentAlertsUsersList?.length - 1) && isSelectAllChecked) {
                    // if all options are not checked and select all is checked, we need to show select all as unchecked
                    this.paymentAlerts = this.paymentAlerts?.filter(paymentAlertUser => paymentAlertUser !== this.selectAllRecords);
                }
            }
        }
    }

    /**
     * This will update the payment alert users list if user removed by cross from sh-select
     *
     * @param {*} event
     * @memberof AccountCreateEditComponent
     */
    public clearSingleItem(event: any): void {
        if(event) {
            this.paymentAlerts = event?.map(user => user.value);
            this.paymentAlerts = this.paymentAlerts?.filter(paymentAlertUser => paymentAlertUser !== this.selectAllRecords);
        }
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof AccountCreateEditComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.amountLimitDurations = [
                { label: this.localeData?.payment?.amount_limit?.daily, value: SettingsAmountLimitDuration.Daily },
                { label: this.localeData?.payment?.amount_limit?.weekly, value: SettingsAmountLimitDuration.Weekly },
                { label: this.localeData?.payment?.amount_limit?.monthly, value: SettingsAmountLimitDuration.Monthly }
            ];
        }
    }

    /**
     * This will update the account details
     *
     * @memberof AccountCreateEditComponent
     */
    public updateAccount(): void {
        if (!this.accountForm?.invalid) {
            this.accountForm.get('paymentAlerts')?.patchValue(this.paymentAlerts?.filter(user => user !== this.selectAllRecords));

            if (!this.accountForm.get('maxAmount')?.value) {
                this.accountForm.get('duration')?.patchValue(UNLIMITED_LIMIT);
            }

            let request = { bankAccountUniqueName: this.activeBankAccount?.iciciDetailsResource?.uniqueName };

            this.settingsIntegrationService.updateAccount(this.accountForm.value, request).pipe(take(1)).subscribe(response => {
                if (response?.status === "success") {
                    if (response?.body?.message) {
                        this.toaster.clearAllToaster();
                        this.toaster.successToast(response?.body?.message);
                    }
                    this.getAllBankAccounts.emit(true);
                    this.closeAccountModal();
                } else {
                    this.toaster.clearAllToaster();
                    this.toaster.errorToast(response?.message);
                }
            });
        }
    }

    /**
     * This will action if create/update form needs to be called
     *
     * @memberof AccountCreateEditComponent
     */
    public actionAccount(): void {
        if (this.activeBankAccount) {
            this.updateAccount();
        } else {
            this.saveNewAccount();
        }
    }

    /**
     * True if select all will be show checked
     *
     * @param {*} value
     * @returns {boolean}
     * @memberof AccountCreateEditComponent
     */
    public isSelectAllChecked(value: any): boolean {
        return ((this.selectAllRecords === value && this.paymentAlerts?.includes(value) && this.paymentAlerts?.length === this.paymentAlertsUsersList?.length) || (this.selectAllRecords === value && !this.paymentAlerts?.includes(value) && this.paymentAlerts?.length === this.paymentAlertsUsersList?.length - 1));
    }
}

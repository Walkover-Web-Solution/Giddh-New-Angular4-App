import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { select, Store } from "@ngrx/store";
import { SettingsIntegrationService } from "apps/web-giddh/src/app/services/settings.integraion.service";
import { ToasterService } from "apps/web-giddh/src/app/services/toaster.service";
import { AppState } from "apps/web-giddh/src/app/store";
import { IOption } from "apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface";
import { ReplaySubject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { SettingsAmountLimitDuration, UNLIMITED_LIMIT } from "../../../../constants/settings.constant";

@Component({
    selector: 'icici-payor-account-create-edit',
    templateUrl: './payor-create-edit.component.html',
    styleUrls: ['./payor-create-edit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PayorCreateEditComponent implements OnInit, OnDestroy {
    /** This holds bank account details */
    @Input() public activeBankAccount: any;
    /** This holds payor details, If this is passed, it means we are in edit mode */
    @Input() public activePayorAccount: any;
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** This emits true if bank accounts list needs refresh */
    @Output() public getAllBankAccounts: EventEmitter<boolean> = new EventEmitter();
    /** This emits true if create account modal needs to be closed */
    @Output() public closeModalEvent: EventEmitter<boolean> = new EventEmitter();
    /* This will hold local JSON data */
    public localeData: any = {};
    /** Form Group for account user form */
    public accountUserForm: UntypedFormGroup;
    /** Holds the amount limit duration options */
    public amountLimitDurations: IOption[] = [];
    /** This will hold users list */
    public usersList: any[] = [];
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private formBuilder: UntypedFormBuilder,
        private toaster: ToasterService,
        private settingsIntegrationService: SettingsIntegrationService
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof PayorCreateEditComponent
     */
    public ngOnInit(): void {
        this.amountLimitDurations = [
            { label: this.commonLocaleData?.app_amount_limit?.daily, value: SettingsAmountLimitDuration.Daily },
            { label: this.commonLocaleData?.app_amount_limit?.weekly, value: SettingsAmountLimitDuration.Weekly },
            { label: this.commonLocaleData?.app_amount_limit?.monthly, value: SettingsAmountLimitDuration.Monthly }
        ];

        this.loadUsersWithCompanyPermissions();

        if (this.activePayorAccount) {
            this.accountUserForm = this.formBuilder.group({
                accountUniqueName: [this.activeBankAccount?.account?.uniqueName, Validators.required],
                userUniqueName: [this.activePayorAccount?.user?.uniqueName, Validators.required],
                maxAmount: [this.activePayorAccount?.maxAmount],
                duration: [this.activePayorAccount?.duration]
            });
        } else {
            this.accountUserForm = this.formBuilder.group({
                accountUniqueName: [this.activeBankAccount?.account?.uniqueName, Validators.required],
                accountNumber: [this.activeBankAccount?.iciciDetailsResource?.accountNumber, Validators.required],
                userUniqueName: ['', Validators.required],
                uniqueName: [this.activeBankAccount?.iciciDetailsResource?.uniqueName, Validators.required],
                loginId: ['', Validators.required],
                maxAmount: [''],
                duration: ['']
            });
        }
    }

    /**
     * Releases all the observables to avoid memory leaks
     *
     * @memberof PayorCreateEditComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will save new account user
     *
     * @memberof PayorCreateEditComponent
     */
    public saveNewAccountUser(): void {
        if (!this.accountUserForm?.invalid) {
            if (!this.accountUserForm.get('maxAmount')?.value) {
                this.accountUserForm.get('duration')?.patchValue(UNLIMITED_LIMIT);
            }
            
            if(!this.validateAmountLimit()) {
                return;
            }

            this.settingsIntegrationService.bankAccountMultiRegistration(this.accountUserForm.value).pipe(take(1)).subscribe(response => {
                if (response?.status === "success") {
                    if (response?.body?.message) {
                        this.toaster.clearAllToaster();
                        this.toaster.successToast(response?.body?.message);
                    }
                    this.getAllBankAccounts.emit(true);
                    this.closeAccountUserModal();
                } else {
                    this.toaster.clearAllToaster();
                    this.toaster.errorToast(response?.message);
                }
            });
        }
    }

    /**
     * This will validate the duration and amount field
     *
     * @returns {boolean}
     * @memberof PayorCreateEditComponent
     */
    public validateAmountLimit(): boolean {
        if((!this.accountUserForm.get('duration')?.value || this.accountUserForm.get('duration')?.value === UNLIMITED_LIMIT) && this.accountUserForm.get('maxAmount')?.value) {
            this.toaster.clearAllToaster();
            this.toaster.errorToast(this.localeData?.payment?.duration_error);
            return false;
        } else {
            return true;
        }
    }

    /**
     * This will close the account user modal
     *
     * @memberof PayorCreateEditComponent
     */
    public closeAccountUserModal(): void {
        this.closeModalEvent.emit(true);
    }

    /**
     * Loads users with company permissions
     *
     * @private
     * @memberof PayorCreateEditComponent
     */
    private loadUsersWithCompanyPermissions(): void {
        this.store.pipe(select(state => state.settings.usersWithCompanyPermissions), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.usersList = [];
                let index = 0;
                response.forEach(user => {
                    this.usersList.push({ index: index, label: user.userName, value: user.userUniqueName });
                    index++;
                });
            }
        });
    }

    /**
     * This will update the bank account user
     *
     * @memberof PayorCreateEditComponent
     */
     public updateAccountUser(): void {
        if (!this.accountUserForm?.invalid) {
            if (!this.accountUserForm.get('maxAmount')?.value) {
                this.accountUserForm.get('duration')?.patchValue(UNLIMITED_LIMIT);
            }

            if(!this.validateAmountLimit()) {
                return;
            }

            let request = { bankAccountUniqueName: this.activeBankAccount?.iciciDetailsResource?.uniqueName, urn: this.activePayorAccount?.urn };

            this.settingsIntegrationService.updatePayorAccount(this.accountUserForm.value, request).pipe(take(1)).subscribe(response => {
                if (response?.status === "success") {
                    if (response?.body?.message) {
                        this.toaster.clearAllToaster();
                        this.toaster.successToast(response?.body?.message);
                    }
                    this.getAllBankAccounts.emit(true);
                    this.closeAccountUserModal();
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
     * @memberof PayorCreateEditComponent
     */
    public actionAccountUser(): void {
        if(this.activePayorAccount) {
            this.updateAccountUser();
        } else {
            this.saveNewAccountUser();
        }
    }
}
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { takeUntil, take } from 'rxjs/operators';
import { GeneralService } from '../../services/general.service';
import { SettingsPermissionActions } from '../../actions/settings/permissions/settings.permissions.action';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of as observableOf, ReplaySubject } from "rxjs";
import { BROADCAST_CHANNELS, Configuration, ICICI_ALLOWED_COMPANIES, IOption } from "../../app.constant";
import { SalesService } from "../../services/sales.service";
import { CompanyActions } from "../../actions/company.actions";
import { SettingsIntegrationService } from '../../services/settings.integration.service';
import { cloneDeep, isEmpty } from '../../lodash-optimized';
import { BankIntegrationComponentStore } from "./utility/bank-integration.store";
import { ACCOUNT_REGISTERED_STATUS } from "../../settings/constants/settings.constant";
import { ToasterService } from "../../services/toaster.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';
import { InstitutionsListComponent } from "./institutions-list/institutions-list.component";
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';
import { ServiceConfig } from "../../services/service.config";
import { environment } from 'apps/web-giddh/src/environments/environment.generated';

@Component({
    selector: 'bank-integration',
    templateUrl: './bank-integration.component.html',
    styleUrls: ['./bank-integration.component.scss'],
    providers: [BankIntegrationComponentStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class BankIntegrationComponent implements OnInit, OnDestroy {
    public isIciciBankSupportedCountry: boolean = false;
    public bankAccounts$: Observable<IOption[]>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will have bank account details */
    public activeBankAccount: any;
    /** Input mast for number format */
    public inputMaskFormat: string = '';
    /** Holds true if current company country is gocardless supported country */
    public isGocardlessSupportedCountry: boolean;
    /** List of icici bank supported countries */
    public iciciBankSupportedCountryList: any[] = ["IN", "NP", "BT"];
    public selectedCompanyUniqueName: string;
    /** This will hold active company data */
    public activeCompany: any;
    /** True, if is add or manage group form outside */
    public isAddAndManageOpenedFromOutside: boolean = false;
    /**Hold Refrence Number */
    public referenceNumber: string = '';
    /** Holds Store Delete end user agreement  API success state as observable*/
    public deleteEndUserAgreementSuccess$: Observable<any> = this.componentStore.select(state => state.deleteAccountSuccess);
    /** Holds Store Requisition API success state as observable*/
    public requisitionList$: Observable<any> = this.componentStore.select(state => state.requisitionList);
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** List of connected bank accounts */
    public connectedBankAccounts: any[] = [];
    /** True, if is integration module are in scope  */
    public hasIntegrationScope: boolean = false;
    /** Holds true if current company country is plaid supported country */
    public isPlaidSupportedCountry: boolean;
    /** Holds array of company uniqueNames which ICICI allowed companies */
    public iciciAllowedCompanies: any[] = [];
    /** Holds image path */
    public imgPath: string = '';
    /** Holds Create New Account Dialog Ref */
    public createNewAccountDialogRef: MatDialogRef<any>;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds Edit New Account Dialog Ref */
    public editAccountModalRef: MatDialogRef<any>;
    /** Holds Create New Account User Dialog Ref */
    public createNewAccountUserModalRef: MatDialogRef<any>;
    /** Hold editAccountUserModal mat dailog reference */
    public editAccountUserModalRef: any;
    /** This will have payor account details */
    public activePayorAccount: any;
    /** Hold confirmationModalRef mat dailog reference */
    public confirmationModalRef: any;
    @ViewChild('paymentForm', { static: true }) paymentForm: NgForm;
    /** Instance of create new account modal */
    @ViewChild('createNewAccountModal', { static: true }) public createNewAccountModal: TemplateRef<any>;
    /** Instance of edit account modal */
    @ViewChild('editAccountModal', { static: true }) public editAccountModal: TemplateRef<any>;
    /** Instance of create new account user modal */
    @ViewChild('createNewAccountUserModal', { static: true }) public createNewAccountUserModal: TemplateRef<any>;
    /** Edit Account User Dailog Template Reference */
    @ViewChild('editAccountUserModal', { static: true }) public editAccountUserModal: TemplateRef<any>;
    /** Instance of delete account user modal */
    @ViewChild('confirmationModal', { static: true }) public confirmationModal: TemplateRef<any>;
    /** Holds Store Save payment provider company API success state as observable*/
    public createEndUserAgreementSuccess$: Observable<any> = this.componentStore.select(state => state.createEndUserAgreementSuccess);
    /** This will use for open window */
    public openedWindow: Window | null = null;
    /** Hold reconnect bank response */
    public reconnectBankResponse: any = null;
    /** Hold callback broadcast event */
    public callBackBroadcast: any;
    /** Bank statement help doc url */
    public bankStatementHelpDocUrl = '';

    /** @ignore */
    constructor(
        private _companyActions: CompanyActions,
        private router: Router,
        private store: Store<AppState>,
        @Inject(ServiceConfig) private serviceConfig,
        private generalService: GeneralService,
        private settingsPermissionActions: SettingsPermissionActions,
        private activateRoute: ActivatedRoute,
        private componentStore: BankIntegrationComponentStore,
        private salesService: SalesService,
        private settingsIntegrationService: SettingsIntegrationService,
        private changeDetectionRef: ChangeDetectorRef,
        private toasty: ToasterService,
        public dialog: MatDialog
    ) {
        this.iciciAllowedCompanies = this.serviceConfig.ICICI_SUPPORTED_COMPANIES || ICICI_ALLOWED_COMPANIES;
        this.bankStatementHelpDocUrl = this.serviceConfig.BANK_STATEMENT_HELP_DOC_URL ?? '';
    }

    /**
    * This function will use for get institutions details
    *
    * @param {*} element
    * @memberof BankIntegrationComponent
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
     * This will open create new account modal
     *
     * @memberof BankIntegrationComponent
     */
    public openCreateNewAccountModal(): void {
        this.createNewAccountDialogRef = this.dialog.open(this.createNewAccountModal, {
                    width: '630px',
                    disableClose: true
                });
    }

    /**
     * Initializes the component message
     *
     * @memberof BankIntegrationComponent
     */
    public ngOnInit(): void {
        this.loadPaymentData();
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        this.store.pipe(select(profileObj => profileObj.settings.profile), takeUntil(this.destroyed$)).subscribe((res) => {
            if (res && !isEmpty(res)) {
                (Array.isArray(res.userEntityRoles) ? res.userEntityRoles : []).forEach(role => {
                    const scopes = role.role.scopes;
                    if (scopes && scopes.some(scope => scope.name === 'INTEGRATION')) {
                        this.hasIntegrationScope = true;
                    }
                });
                if (res && res.ecommerceDetails && res.ecommerceDetails.length > 0) {
                    (Array.isArray(res.ecommerceDetails) ? res.ecommerceDetails : []).forEach(item => {
                        if (item && item.ecommerceType && item.ecommerceType.name && item.ecommerceType.name === "shopify") {
                            // this.getShopifyVerifyStatus(item.uniqueName);
                        }
                    })
                }
            }
        });

        this.createEndUserAgreementSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.openWindow(response.link);
                localStorage.setItem('refNo', response.reference);
                this.referenceNumber = response.reference;
            }
        });

        this.store.pipe(select(prof => prof.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';
            if (profile && profile.countryV2 && profile.countryV2.alpha2CountryCode) {
                this.isGocardlessSupportedCountry = this.generalService.checkCompanySupportGoCardless(profile.countryV2.alpha2CountryCode);
                if (this.iciciBankSupportedCountryList.includes(profile.countryV2.alpha2CountryCode)) {
                    this.isIciciBankSupportedCountry = true;
                } else {
                    this.isIciciBankSupportedCountry = false;
                }
                this.changeDetectionRef.detectChanges();
            }
        });

        if (this.selectedCompanyUniqueName) {
            this.store.dispatch(this.settingsPermissionActions.GetUsersWithPermissions(this.selectedCompanyUniqueName));
        }

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });

        this.store.pipe(select(select => select.groupwithaccounts.isAddAndManageOpenedFromOutside), takeUntil(this.destroyed$)).subscribe(response => {
            if (!response && this.isAddAndManageOpenedFromOutside) {
                this.activateRoute.params.pipe(takeUntil(this.destroyed$)).subscribe(resp => {
                    if (resp?.referrer === 'payment') {
                        this.loadDefaultBankAccountsSuggestions();
                    }
                });
            }
            this.isAddAndManageOpenedFromOutside = response;
        });

        const broadcast = new BroadcastChannel(BROADCAST_CHANNELS.REAUTH_PLAID_SUCCESS);
        broadcast.onmessage = (event) => {
            if (event?.data) {
                this.loadPaymentData();
            }
        };

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

        this.requisitionList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.loadPaymentData();
            }
        });

        this.deleteEndUserAgreementSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.toasty.showSnackBar('success', this.localeData?.account_deleted_successfully);
                this.loadPaymentData();
            }
        });

    }
    private loadDefaultBankAccountsSuggestions(): void {
        this.salesService.getAccountsWithCurrency('bankaccounts,loanandoverdraft').pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body?.results) {
                const bankAccounts = response.body.results.map(account => ({
                    label: account?.name,
                    value: account?.uniqueName
                }))
                this.bankAccounts$ = observableOf(bankAccounts);
            }
        });
    }

    public loadPaymentData(): void {
        this.store.pipe(select(select => select.groupwithaccounts.isAddAndManageOpenedFromOutside), takeUntil(this.destroyed$)).subscribe(result => {
            this.isAddAndManageOpenedFromOutside = result;
        });
        this.loadDefaultBankAccountsSuggestions();
        this.getAllBankAccounts();
        this.store.dispatch(this._companyActions.getAllRegistrations());
        this.store.pipe(take(1)).subscribe(s => {
            this.selectedCompanyUniqueName = s.session.companyUniqueName;
            this.store.dispatch(this.settingsPermissionActions.GetUsersWithPermissions(this.selectedCompanyUniqueName));
        });

    }

    /**
     * This will get all connected bank accounts
     *
     * @memberof BankIntegrationComponent
     */
    public getAllBankAccounts(): void {
        this.isLoading = true;
        this.connectedBankAccounts = [];

        this.settingsIntegrationService.getAllBankAccounts().pipe(take(1)).subscribe(response => {
            this.isLoading = false;
            if (response?.body) {
                this.connectedBankAccounts = response.body;
                (Array.isArray(this.connectedBankAccounts) ? this.connectedBankAccounts : []).forEach(bankAccount => {
                    if (bankAccount?.bankResource?.payor?.length > 0) {
                        (Array.isArray(bankAccount?.bankResource?.payor) ? bankAccount?.bankResource?.payor : []).forEach(payor => {
                            this.getPayorRegistrationStatus(bankAccount, payor);
                        });
                    }
                });
            }

            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * This will get the payor account registration status
     *
     * @param {*} bankAccount
     * @param {*} payor
     * @memberof BankIntegrationComponent
     */
    public getPayorRegistrationStatus(bankAccount: any, payor: any): void {
        if (bankAccount?.bankResource?.uniqueName?.length && payor?.urn?.length) {
            let request;

            if (this.isPlaidSupportedCountry) {
                request = { bankAccountUniqueName: bankAccount.bankResource.uniqueName, urn: payor.urn };
            } else {
                request = { bankAccountUniqueName: bankAccount.bankResource.uniqueName, bankUserId: payor.urn };
            }

            this.settingsIntegrationService.getPayorRegistrationStatus(request).pipe(take(1)).subscribe(response => {
                payor.isConnected = (response?.body?.status === ACCOUNT_REGISTERED_STATUS);

                if (!payor.isConnected && response?.body?.message) {
                    this.toasty.errorToast(response?.body?.message);
                }
            });
        }
    }

    /**
     * This will open edit account modal
     *
     * @param {*} bankAccount
     * @memberof BankIntegrationComponent
     */
    public openEditAccountModal(bankAccount: any): void {
        this.activeBankAccount = bankAccount;
        this.editAccountModalRef = this.dialog.open(this.editAccountModal, {
                    panelClass: 'modal-dialog',
                    width: '1000px',
                });
    }

    /**
    * This will open the create new account user modal
    *
    * @param {*} bankAccount
    * @memberof BankIntegrationComponent
    */
    public openCreateNewAccountUserModal(bankAccount: any): void {
        this.activeBankAccount = bankAccount;
        this.createNewAccountUserModalRef = this.dialog.open(this.createNewAccountUserModal, {
                    panelClass: 'modal-dialog',
                    width: '1000px',
                });
    }

    /**
    * This will open the edit account user modal
    *
    * @param {*} bankAccount
    * @param {*} payor
    * @memberof BankIntegrationComponent
    */
    public openEditAccountUserModal(bankAccount: any, payor: any): void {
        this.activeBankAccount = bankAccount;
        this.activePayorAccount = payor;
        this.editAccountUserModalRef = this.dialog.open(this.editAccountUserModal, {
                    panelClass: 'modal-dialog',
                    width: '1000px',
                });
    }
    /**
    * This will show the delete bank account login confirmation modal
    *
    * @param {*} bankAccount
    * @param {*} payor
    * @memberof BankIntegrationComponent
    */
    public showDeleteBankAccountLoginConfirmationModal(bankAccount: any, payor: any): void {
        if (this.isPlaidSupportedCountry) {
            this.activeBankAccount = { uniqueName: bankAccount?.bankResource?.uniqueName, urn: payor?.bankUserId, loginId: payor?.loginId };
        } else {
            this.activeBankAccount = { uniqueName: bankAccount?.bankResource?.uniqueName, bankUserId: payor?.bankUserId, loginId: payor?.loginId };
        }
        this.confirmationModalRef = this.dialog.open(this.confirmationModal, {
                    panelClass: 'modal-dialog',
                    width: '1000px',
                });
    }

    /**
     * This will delete/deregister the bank account login
     *
     * @memberof BankIntegrationComponent
     */
    public deleteBankAccountLogin(): void {
        let model;
        if (this.isPlaidSupportedCountry) {
            model = { uniqueName: this.activeBankAccount?.uniqueName, urn: this.activeBankAccount?.bankUserId }
        } else {
            model = { uniqueName: this.activeBankAccount?.uniqueName, bankUserId: this.activeBankAccount?.bankUserId }
        }
        this.settingsIntegrationService.deleteBankAccountLogin(model).pipe(take(1)).subscribe(response => {
            if (response?.status === "success") {
                this.getAllBankAccounts();
            } else {
                this.toasty.clearAllToaster();
                this.toasty.errorToast(response?.message);
            }
        });
    }
    /**
     * This will use for select bank account only for plaid integration
     *
     * @param {*} event
     * @param {*} bank
     * @memberof BankIntegrationComponent
     */
    public selectBankAccount(event: any, bank: any): void {
        if (event?.value) {
            let request = { bankAccountUniqueName: bank?.bankResource?.uniqueName };
            let accountForm = {
                accountNumber: bank?.bankResource?.accountNumber,
                accountUniqueName: event?.value,
                paymentAlerts: []
            };
            this.settingsIntegrationService.updateAccount(accountForm, request).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    if (response?.body?.message) {
                        this.toasty.clearAllToaster();
                        this.toasty.successToast(response?.body?.message);
                    }
                } else {
                    this.toasty.clearAllToaster();
                    this.toasty.errorToast(response?.message);
                }
            });
        }
    }
    /**
   * This will be use for delete bank account
   *
   * @param {*} bank
   * @memberof BankIntegrationComponent
   */
    public deleteBankAccount(bank: any): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
                    width: '540px',
                    data: {
                title: this.commonLocaleData?.app_confirmation,
                    body: this.localeData?.payment?.confirm_bank_delete_message,
                    ok: this.commonLocaleData?.app_yes,
                    cancel: this.commonLocaleData?.app_no
                }
        });

        dialogRef.afterClosed().subscribe(response => {
            if (response) {
                this.componentStore.deleteEndUserAgreementByInstitutionId(bank?.bankResource?.uniqueName);
            }
        });
    }

    /**
 * This will be use for reconnect bank
 *
 * @param {*} bank
 * @memberof BankIntegrationComponent
 */
    public reconnectBank(bank: any): void {
        this.reconnectBankResponse = bank;
        if (bank && bank.institutionId) {
            this.componentStore.createEndUserAgreementByInstitutionId(bank.institutionId);
        }
    }

    /**
    * This will be open window by url
    *
    * @param {string} url
    * @memberof BankIntegrationComponent
    */
    public openWindow(url: string): void {
        const width = 800;
        const height = 900;

        this.openedWindow = this.generalService.openCenteredWindow(url, '', width, height);
    }

    /**
     * This will be use for component destroy
     *
     * @memberof BankIntegrationComponent
     */
    public ngOnDestroy(): void {
        if (window.localStorage) {
            localStorage.removeItem('refNo');
        }
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}

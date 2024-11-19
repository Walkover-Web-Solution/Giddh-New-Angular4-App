import { ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { takeUntil, take } from 'rxjs/operators';
import { GeneralService } from '../../services/general.service';
import { SettingsPermissionActions } from '../../actions/settings/permissions/settings.permissions.action';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of as observableOf, ReplaySubject } from "rxjs";
import { BROADCAST_CHANNELS } from "../../app.constant";
import { SettingIntegrationComponentStore } from "../../settings/integration/utility/setting.integration.store";
import { SalesService } from "../../services/sales.service";
import { IOption } from '../../theme/ng-select/option.interface';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { CompanyActions } from "../../actions/company.actions";
import { SettingsIntegrationService } from '../../services/settings.integraion.service';
import {  isEmpty } from '../../lodash-optimized';

@Component({
    selector: 'bank-integration',
    templateUrl: './bank-integration.component.html',
    styleUrls: ['./bank-integration.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BankIntegrationComponent implements OnInit {
    public isIciciBankSupportedCountry: boolean = false;
    public bankAccounts$: Observable<IOption[]>;
    public _companyActions: CompanyActions;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
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
    public deleteEndUseAgreementSuccess$: Observable<any> = this.componentStore.select(state => state.deleteAccountSuccess);
    /** Holds Store Requisition API success state as observable*/
    public requisitionList$: Observable<any> = this.componentStore.select(state => state.requisitionList);
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** List of connected bank accounts */
    public connectedBankAccounts: any[] = [];
     /** True, if is integration module are in scope  */
     public hasIntegrationScope: boolean = false;

    /** @ignore */
    constructor(
        private router: Router,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private settingsPermissionActions: SettingsPermissionActions,
        private activateRoute: ActivatedRoute,
        private componentStore:SettingIntegrationComponentStore,
        private salesService : SalesService,
        private settingsIntegrationService: SettingsIntegrationService,
    ) {}

    /**
     * Initializes the component message
     *
     * @memberof BankIntegrationComponent
     */
    public ngOnInit(): void {
       
        this.store.pipe(select(profileObj => profileObj.settings.profile), takeUntil(this.destroyed$)).subscribe((res) => {
            if (res && !isEmpty(res)) {
                res.userEntityRoles.forEach(role => {
                    const scopes = role.role.scopes;
                    if (scopes && scopes.some(scope => scope.name === 'INTEGRATION')) {
                        this.hasIntegrationScope = true;
                    }
                });
                if (res && res.ecommerceDetails && res.ecommerceDetails.length > 0) {
                    res.ecommerceDetails.forEach(item => {
                        if (item && item.ecommerceType && item.ecommerceType.name && item.ecommerceType.name === "shopify") {
                            // this.getShopifyVerifyStatus(item.uniqueName);
                        }
                    })
                }
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
        window.addEventListener('message', event => {
            if (this.router.url === '/pages/settings/integration/payment') {
                if (event && event.data === "GOCARDLESS") {
                    if (this.referenceNumber) {
                        this.componentStore.getRequisition(this.referenceNumber);
                    }
                }
            }
        });

        this.requisitionList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.loadPaymentData();
            }
        });

        this.deleteEndUseAgreementSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
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
    public loadPaymentData(event?: any): void {
        this.store.pipe(select(select => select.groupwithaccounts.isAddAndManageOpenedFromOutside), takeUntil(this.destroyed$)).subscribe(result => {
            this.isAddAndManageOpenedFromOutside = result;
        });
        if (event && event instanceof TabDirective || !event) {
            this.loadDefaultBankAccountsSuggestions();
            this.getAllBankAccounts();
            this.store.dispatch(this._companyActions.getAllRegistrations());
            this.store.pipe(take(1)).subscribe(s => {
                this.selectedCompanyUniqueName = s.session.companyUniqueName;
                this.store.dispatch(this.settingsPermissionActions.GetUsersWithPermissions(this.selectedCompanyUniqueName));
            });
        }
    }
    public getAllBankAccounts(): void {
        this.isLoading = true;
        this.connectedBankAccounts = [];

        this.settingsIntegrationService.getAllBankAccounts().pipe(take(1)).subscribe(response => {
            this.isLoading = false;
            if (response?.body) {
                this.connectedBankAccounts = response.body;

                // this.connectedBankAccounts.forEach(bankAccount => {
                //     if (bankAccount?.bankResource?.payor?.length > 0) {
                //         bankAccount?.bankResource?.payor.forEach(payor => {
                //             this.getPayorRegistrationStatus(bankAccount, payor);
                //         });
                //     }
                // });
            }

            // this.changeDetectionRef.detectChanges();
        });
    }

}

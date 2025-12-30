import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, take, takeUntil, tap } from 'rxjs/operators';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { digitsOnly } from '../../../helpers';
import { AppState } from '../../../../store';
import { select, Store } from '@ngrx/store';
import { AccountRequestV2, CustomFieldsData } from '../../../../models/api-models/Account';
import { ToasterService } from '../../../../services/toaster.service';
import { CompanyResponse, StateList, StatesRequest } from '../../../../models/api-models/Company';
import { IForceClear } from "../../../../models/api-models/Sales";
import { CountryRequest, OnboardingFormRequest } from "../../../../models/api-models/Common";
import { CommonActions } from '../../../../actions/common.actions';
import { GeneralActions } from "../../../../actions/general/general.actions";
import { GroupService } from 'apps/web-giddh/src/app/services/group.service';
import { GroupWithAccountsAction } from 'apps/web-giddh/src/app/actions/groupwithaccounts.actions';
import { DROPDOWN_ITEMS_COUNT_LIMIT, ASIDE_PANE_CONFIG, BranchHierarchyType, EMAIL_VALIDATION_REGEX, IOption, ZIP_CODE_SUPPORTED_COUNTRIES, API_BULK_FETCH_LIMIT } from 'apps/web-giddh/src/app/app.constant';
import { InvoiceService } from 'apps/web-giddh/src/app/services/invoice.service';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { clone, cloneDeep, isEqual, uniqBy } from '../../../../lodash-optimized';
import { CustomFieldsService } from 'apps/web-giddh/src/app/services/custom-fields.service';
import { FieldTypes } from 'apps/web-giddh/src/app/custom-fields/custom-fields.constant';
import { HttpClient } from '@angular/common/http';
import { AccountsAction } from 'apps/web-giddh/src/app/actions/accounts.actions';
import { ConfirmModalComponent } from 'apps/web-giddh/src/app/theme/new-confirm-modal/confirm-modal.component';
import { CommonService } from 'apps/web-giddh/src/app/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { OrganizationType } from 'apps/web-giddh/src/app/models/user-login-state';
import { BulkAddDialogComponent } from '../bulk-add-dialog/bulk-add-dialog.component';
import { AccountAddNewDetailsComponentStore } from './utility/account-add-new-details.store';
import { SettingsBranchActions } from 'apps/web-giddh/src/app/actions/settings/branch/settings.branch.action';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AccountingGroupEnum, CountryNames } from '../../../Enums/common.enum';
import { SalesPersonComponentStore } from '../../../sales-person/utility/sales-person.store';
import { SalesPersonComponent } from '../../../sales-person/sales-person.component';
import { ActionTypeEnum } from '../../../sales-person/utility/sales-person.constant';

@Component({
    selector: 'account-add-new-details',
    templateUrl: './account-add-new-details.component.html',
    styleUrls: ['./account-add-new-details.component.scss'],
    providers: [AccountAddNewDetailsComponentStore, SalesPersonComponentStore],
    standalone:false
})

export class AccountAddNewDetailsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    /** Holds the reactive form group for adding or editing an account. */
    public addAccountForm: FormGroup;
    @Input() public activeGroupUniqueName: string;
    @Input() public flatGroupsOptions: IOption[];
    @Input() public createAccountInProcess$: Observable<boolean>;
    @Input() public createAccountIsSuccess$: Observable<boolean>;
    @Input() public isGstEnabledAcc: boolean = false;
    @Input() public isHsnSacEnabledAcc: boolean = false;
    @Input() public showBankDetail: boolean = false;
    @Input() public showVirtualAccount: boolean = false;
    @Input() public isDebtorCreditor: boolean = true;
    /** True when this component is used in ledger, required as ledger skips the
     * top level hierarchy groups for creation of new account
     */
    @Input() public isLedgerModule: boolean;
    /** True, if new service is created through this component.
     * Used to differentiate between new customer/vendor creation and service creation
     * as they both need the groups to be shown in a particular category,
     * for eg. If a new customer/vendor is created in Sales invoice then all the groups shown in the dropdown
     * should be of category 'sundrydebtors'. Similarly, for PO/PB the group category should be
     * 'sundrycreditors'.
     * If a new service is created, then if the service is created in Invoice then it will have
     * categroy 'revenuefromoperations' and if it is in PO/PB then category will be 'operatingcost'.
     * So if isServiceCreation is true, then directly 'selectedGroupUniqueName' will be
     * used to fetch groups
    */
    @Input() public isServiceCreation: boolean;
    /** True, if new customer/vendor account is created through this component.
     * Used to differentiate between new customer/vendor creation and service creation
     * as they both need the groups to be shown in a particular category,
     * for eg. If a new customer/vendor is created in Sales invoice then all the groups shown in the dropdown
     * should be of category 'sundrydebtors'. Similarly, for PO/PB the group category should be
     * 'sundrycreditors'.
     * If a new service is created, then if the service is created in Invoice then it will have
     * categroy 'revenuefromoperations' and if it is in PO/PB then category will be 'operatingcost'.
     * So if isCustomerCreation is true, then directly 'selectedGrpUniqueName' will be
     * used to fetch groups
    */
    @Input() public isCustomerCreation: boolean;
    /** True if bank category account is selected */
    @Input() public isBankAccount: boolean = true;
    /** True if account creation is from command k */
    @Input() public fromCommandK: boolean = false;
    @Input() public includeSearchedGroup: boolean = false;
    @Output() public submitClicked: EventEmitter<{ activeGroupUniqueName: string, accountRequest: AccountRequestV2, salesPersonCreated: boolean }> = new EventEmitter();
    @Output() public isGroupSelected: EventEmitter<IOption> = new EventEmitter();
    /** Emiting true if account modal needs to be closed */
    @Output() public closeAccountModal: EventEmitter<boolean> = new EventEmitter();

    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public showOtherDetails: boolean = false;
    public partyTypeSource: IOption[] = [];
    public stateList: StateList[] = [];
    /** List of counties of country */
    public countyList: IOption[] = [];
    public states: any[] = [];
    public statesSource$: Observable<IOption[]> = observableOf([]);
    public activeCompany: CompanyResponse;
    public moreGstDetailsVisible: boolean = false;
    public gstDetailsLength: number = 3;
    public companyCurrency: string;
    public isIndia: boolean = false;
    public companyCountry: string = '';
    public isDiscount: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public countrySource: IOption[] = [];
    public countrySource$: Observable<IOption[]> = observableOf([]);
    public currencies: IOption[] = [];
    public currencySource$: Observable<IOption[]> = observableOf([]);
    public countryCurrency: any[] = [];
    public countryPhoneCode: IOption[] = [];
    public callingCodesSource$: Observable<IOption[]> = observableOf([]);
    public stateGstCode: any[] = [];
    public formFields: any[] = [];
    /** Flag indicating whether the entered GSTIN number is valid. */
    public isGstValid: boolean = true;
    public GSTIN_OR_TRN: string;
    public selectedCountry: string;
    public selectedCountryCode: string;
    public isStateRequired: boolean = false;
    public bankIbanNumberMaxLength: string = '18';
    public bankIbanNumberMinLength: string = '9';
    /** company custom fields list */
    public companyCustomFields: any[] = [];
    /** Observable for selected active group  */
    private activeGroup$: Observable<any>;
    /** This will hold active parent group */
    public activeParentGroup: string = "";
    /** Stores the search results pagination details for group dropdown */
    public groupsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search for group dropdown */
    public defaultGroupSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list for group dropdown */
    public preventDefaultGroupScrollApiCall: boolean = false;
    /** Stores the default search results pagination details for group dropdown */
    public defaultGroupPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold placeholder for tax */
    public taxNamePlaceholder: string = "";
    /** This will hold inventory settings */
    public inventorySettings: any;
    /** This will hold parent unique name */
    public activeParentGroupUniqueName: string = '';
    /** True if custom fields api call in progress */
    public isCustomFieldLoading: boolean = false;
    /** Custom fields request */
    public customFieldsRequest: any = {
        page: 0,
        count: 0,
        moduleUniqueName: 'account'
    };
    /** Available field types list */
    public availableFieldTypes: any = FieldTypes;
    /** This will hold isMobileNumberInvalid */
    public isMobileNumberInvalid: boolean = false;
    /** True if last duplicate email in portal  users */
    public lastDuplicateEmailIndex: number = -1;
    /** Index of last duplicate contact number in portal users */
    public lastDuplicateContactIndex: number = -1;
    /** True if last duplicate email in portal  users */
    public portalIndex: number;
    /** Stores the voucher API version of company */
    public voucherApiVersion: number;
    /** Hold active index of form group */
    public activeIndex: number = 0;
    /** Holds list of countries which use ZIP Code in address */
    public zipCodeSupportedCountryList: string[] = ZIP_CODE_SUPPORTED_COUNTRIES;
    /** True if current currency is not company currency */
    public isForeignCurrency: boolean = false;
    /** Hold all temporary save bulk balance data */
    public tempSaveBulkData: any[] = [];
    /** Holds company branches */
    public branches: Array<any>;
    /** Holds company specific data */
    public company: any = {
        branch: null,
    };
    /** True if update data on temp bulk data  */
    public isBulkDataUpdated: boolean = false;
    /** True if form is valid */
    public isValidForm: boolean = true;
    /** True if form value is assigned */
    private formValueAssigned: boolean = false;
    /** Indicates whether the "Custom" tab is currently selected */
    public isCustomSelectedTab: boolean = false;
    /** Stores the index of the currently active mobile number field under the Portal tab */
    public isActivePortalMobileNumber: number = -1;
    /** Holds active selected Tab Index */
    public selectedTabIndex: number = 0;
    /** Holds active selected Tab Label */
    public selectedTabLabel: string = '';
    /** True if there are duplicate contact number errors */
    public hasDuplicateContactErrors: boolean = false;
    /** Tracks which tabs have been activated at least once */
    public activatedTabs: Set<string> = new Set([]);
    /** True if active country is UK */
    public isUKCompany: boolean = false;
    /** Flag to determine if the parent group is "sundrydebtors". */
    public isParentSundrydebtors: boolean = false;
    /** Enum representing the types of accounting group type */
    public accountingGroupEnum: typeof AccountingGroupEnum = AccountingGroupEnum;
    /** Sales Person List */
    public salesPersonList$: Observable<any> = this.salesPersonStore.salesPersonList$;
    /** Holds transfer info if active sales person is transfer */
    private activeSalePersonIsTransfer: any;
    /** True if sales person is created */
    public salesPersonCreated: boolean = false;

    constructor(
        private _fb: FormBuilder,
        private store: Store<AppState>,
        private _toaster: ToasterService,
        private commonActions: CommonActions,
        private _generalActions: GeneralActions,
        private changeDetectorRef: ChangeDetectorRef,
        private generalService: GeneralService,
        private groupService: GroupService,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private invoiceService: InvoiceService,
        private customFieldsService: CustomFieldsService,
        private http: HttpClient,
        private accountsAction: AccountsAction,
        public dialog: MatDialog,
        private commonService: CommonService,
        private readonly componentStore: AccountAddNewDetailsComponentStore,
        private settingsBranchAction: SettingsBranchActions,
        private salesPersonStore: SalesPersonComponentStore
    ) {
        this.activeGroup$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroup), takeUntil(this.destroyed$));
    }

    /**
     * Initializes the component
     *
     * @memberof AccountAddNewDetailsComponent
     */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                if (this.activeCompany?.uniqueName !== activeCompany?.uniqueName) {
                    this.activeCompany = activeCompany;
                    this.isUKCompany = activeCompany.country === CountryNames.UNITED_KINGDOM;
                    this.getCompanyCustomField();
                }
                if (this.activeCompany.countryV2 !== undefined && this.activeCompany.countryV2 !== null) {
                    this.getStates(this.activeCompany.countryV2.alpha2CountryCode);
                }
                this.companyCurrency = clone(this.activeCompany?.baseCurrency);
            }
        });
        this.getCountry();
        this.getCallingCodes();
        this.getPartyTypes();
        this.getCompanyBranches();
        this.getSalesPersonList();

        if (this.flatGroupsOptions === undefined) {
            this.getAccount();
        }
        if (this.activeGroupUniqueName === 'discount') {
            this.isDiscount = true;
            this.showBankDetail = false;
            this.isDebtorCreditor = false;
        }

        if (this.activeGroupUniqueName === 'bankaccounts') {
            this.isDebtorCreditor = false;
        }

        if (this.activeGroupUniqueName === 'sundrycreditors') {
            this.showBankDetail = true;
        }

        this.initializeNewForm();
        this.activeGroup$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (this.activeGroupUniqueName && response.uniqueName !== this.activeGroupUniqueName) {
                    this.store.dispatch(this.groupWithAccountsAction.getAccountGroupDetails(this.activeGroupUniqueName));
                } else if (response.parentGroups && response.parentGroups.length) {
                    let parent = response.parentGroups;
                    const HSN_SAC_PARENT_GROUPS = [this.accountingGroupEnum.RevenueFromOperations, this.accountingGroupEnum.OtherIncome, this.accountingGroupEnum.OperatingCost, this.accountingGroupEnum.IndirectExpenses];
                    if (parent?.length > 1) {
                        this.isHsnSacEnabledAcc = HSN_SAC_PARENT_GROUPS.some(group =>
                            this.checkParentGroup(parent, group)
                        );
                        this.isParentDebtorCreditor(parent[1].uniqueName);
                    } else if (parent?.length === 1) {
                        this.isHsnSacEnabledAcc = (response.parentGroups) ? HSN_SAC_PARENT_GROUPS.includes(response?.parentGroups[0]?.uniqueName) : false;
                        this.isParentDebtorCreditor(response?.uniqueName);
                    }
                    this.isParentSundrydebtors = this.checkParentGroup(parent, this.accountingGroupEnum.SundryDebtors);
                    this.showHideAddressTab();
                    this.selectedTabIndex = null;
                    this.changeDetectorRef.detectChanges();

                    setTimeout(() => {
                        this.selectedTabIndex = 0;
                        this.changeDetectorRef.detectChanges();
                    }, 0);
                }
            }
        });


        this.addAccountForm.get('hsnOrSac').valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(a => {
            const hsn: AbstractControl = this.addAccountForm.get('hsnNumber');
            const sac: AbstractControl = this.addAccountForm.get('sacNumber');
            if (a === 'hsn') {
                hsn.enable();
                sac.disable();
            } else {
                sac.enable();
                hsn.disable();
            }
        });

        let mappings = this.addAccountForm.get('portalDomain') as FormArray;
        mappings.valueChanges.pipe(debounceTime(1000), takeUntil(this.destroyed$), distinctUntilChanged(isEqual)).subscribe((res) => {

            if (this.portalIndex === null || this.portalIndex === undefined) {
                return;
            }
            const index = this.portalIndex;
            let change = mappings.at(index);
            let defaultUser = mappings.controls.find(control => control.get('default')?.value === true);
            if (defaultUser) {
                this.addAccountForm.patchValue({
                    attentionTo: defaultUser.get('name').value,
                    contactNo: defaultUser.get('contactNo').value,
                    email: defaultUser.get('email').value
                });
            }
            if (change) {
                if (change.invalid) {
                    this.portalIndex = undefined;
                    return;
                }

                // Email validation
                if (change.get('email').value) {
                    change.get('email')?.setValidators([Validators.required, Validators.pattern(EMAIL_VALIDATION_REGEX)]);
                    change.get('email')?.updateValueAndValidity();
                } else {
                    change.get('email')?.setValidators([Validators.pattern(EMAIL_VALIDATION_REGEX)]);
                    change.get('email')?.updateValueAndValidity();
                }
                let lastEmailOccurrenceIndex = -1;
                let currentEmail = change.get('email')?.value;
                let emailDuplicateFound = false;
                if (currentEmail !== "") {
                    (Array.isArray(mappings.controls) ? mappings.controls : []).forEach((control, i) => {
                        if (lastEmailOccurrenceIndex === -1 && index !== i && control.get('email')?.value === currentEmail) {
                            lastEmailOccurrenceIndex = index;
                            change.get('email').setErrors({ duplicate: true });
                            emailDuplicateFound = true;
                        }
                    });
                }
                // Clear email duplicate error if no duplicates found
                if (!emailDuplicateFound && change.get('email')?.errors?.['duplicate']) {
                    const errors = { ...change.get('email')?.errors };
                    delete errors['duplicate'];
                    change.get('email').setErrors(Object.keys(errors).length ? errors : null);
                }


                // Contact number validation
                let lastContactOccurrenceIndex = -1;
                let currentContactNo = change.get('contactNo')?.value;
                let contactDuplicateFound = false;
                if (currentContactNo !== "" && currentContactNo) {
                    (Array.isArray(mappings.controls) ? mappings.controls : []).forEach((control, i) => {
                        if (lastContactOccurrenceIndex === -1 && index !== i && control.get('contactNo')?.value === currentContactNo) {
                            lastContactOccurrenceIndex = index;
                            change.get('contactNo').setErrors({ duplicate: true });
                            contactDuplicateFound = true;
                        }
                    });
                }
                // Clear contact duplicate error if no duplicates found
                if (!contactDuplicateFound && change.get('contactNo')?.errors?.['duplicate']) {
                    const errors = { ...change.get('contactNo')?.errors };
                    delete errors['duplicate'];
                    change.get('contactNo').setErrors(Object.keys(errors).length ? errors : null);
                }

                this.portalIndex = undefined;

                this.lastDuplicateEmailIndex = lastEmailOccurrenceIndex;
                this.lastDuplicateContactIndex = lastContactOccurrenceIndex;

                // Update duplicate contact errors flag
                this.hasDuplicateContactErrors = this.checkForDuplicateContactErrors();
            }
        });

        this.addAccountForm.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged((prev, curr) => (prev?.attentionTo === curr?.attentionTo) && (prev?.mobileNo === curr?.mobileNo) && (prev?.email === curr?.email)),
            takeUntil(this.destroyed$))
            .subscribe((response) => {
                const users = this.addAccountForm.get('portalDomain') as FormArray;
                if (response?.attentionTo || response?.mobileNo || response?.email) {
                    let user = users.controls.find(control => control.get('default')?.value === true);
                    if (user) {
                        user?.get('name').setValue(response?.attentionTo);
                        user?.get('email').setValue(response?.email);
                        user?.get('contactNo').setValue(response?.mobileNo);
                        user?.get('default').setValue(true);
                    } else {
                        let setValue = false;
                        users.controls?.find((control) => {
                            if (!control.get('name')?.value && !control.get('email')?.value && !control.get('contactNo')?.value) {
                                control.patchValue({ name: response?.attentionTo, email: response?.email, contactNo: response.mobileNo, default: true });
                                setValue = true;
                                return true;
                            }
                        });
                        if (!setValue) {
                            let data = { name: response?.attentionTo, email: response?.email, contactNo: response.mobileNo, default: true };
                            this.addNewPortalUser(data);
                        }
                    }
                    this.changeDetectorRef.detectChanges();
                }
            });

        this.addAccountForm.valueChanges.pipe(debounceTime(200), takeUntil(this.destroyed$)).subscribe((response) => {
            if (this.formValueAssigned && response) {
                this.store.dispatch(this.accountsAction.hasUnsavedChanges(this.addAccountForm.dirty));
            }
        });

        // get country code value change
        this.addAccountForm.get('country').get('countryCode').valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(a => {
            if (a) {
                const addresses = this.addAccountForm.get('addresses') as FormArray;
                if (addresses?.controls?.length === 0) {
                    this.addBlankGstForm();
                }
                if (a !== 'IN') {
                    this.isIndia = false;
                } else {
                    if (addresses?.controls?.length === 0) {
                        this.addBlankGstForm();
                    }
                    this.isIndia = true;
                }
            }
        });

        // get openingblance value changes
        this.addAccountForm.get('openingBalance').valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(a => { // as disccused with back end team bydefault openingBalanceType will be CREDIT
            if (a && (a === 0 || a <= 0) && this.addAccountForm.get('openingBalanceType')?.value) {
                this.addAccountForm.get('openingBalanceType')?.patchValue('CREDIT');
            } else if (a && (a === 0 || a > 0) && this.addAccountForm.get('openingBalanceType')?.value === '') {
                this.addAccountForm.get('openingBalanceType')?.patchValue('CREDIT');
            }
        });

        this.addAccountForm.get('activeGroupUniqueName')?.setValue(this.activeGroupUniqueName);

        this.getCurrency();
        this.isStateRequired = this.checkActiveGroupCountry();

        if (this.fromCommandK && this.activeGroupUniqueName) {
            this.store.dispatch(this.groupWithAccountsAction.getGroupDetails(this.activeGroupUniqueName));
        }

        this.createAccountIsSuccess$?.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                // listen for new add account utils
                this.store.dispatch(this.accountsAction.hasUnsavedChanges(false));
                this.addAccountForm?.markAsPristine();
            }
        });

        if (this.activeCompany.state) {
            setTimeout(() => {
                let addresses = (this.addAccountForm.get('addresses') as FormArray).at(0);
                addresses?.get('stateCode')?.patchValue(this.activeCompany.state);
            }, 500);
        } else {
            if (this.activeCompany?.addresses?.length && this.activeCompany?.addresses[0]?.stateCode) {
                setTimeout(() => {
                    let addresses = (this.addAccountForm.get('addresses') as FormArray).at(0);
                    addresses?.get('stateCode')?.patchValue(this.activeCompany?.addresses[0]?.stateCode);
                    addresses?.get('state').get('code')?.patchValue(this.activeCompany?.addresses[0]?.stateCode);
                    addresses?.get('state').get('name')?.patchValue(this.activeCompany?.addresses[0]?.stateName);
                }, 500);
            }
        }
        setTimeout(() => {
            let addresses = this.addAccountForm.get('addresses') as FormArray;
            addresses.controls[0].get('isDefault')?.patchValue(true);
        }, 500);

        this.componentStore.branchList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.branches = response;
                this.company.isActive = this.generalService.currentOrganizationType !== OrganizationType.Branch && this.branches?.length > 1;
                if (this.generalService.currentOrganizationType === OrganizationType.Branch) {
                    // Find the current checked out branch
                    this.company.branch = response.find(branch => branch?.uniqueName === this.generalService.currentBranchUniqueName);
                } else {
                    // Find the HO branch
                    this.company.branch = response.find(branch => !branch.parentBranch);
                }
            }
        });

        this.salesPersonList$.pipe(takeUntil(this.destroyed$), filter(Boolean)).subscribe((salesPersonList: IOption[]) => {
            if (!this.isSalesPersonExists(this.addAccountForm.get('salesPersonUniqueName').value, salesPersonList)) {
                let salesPersonUniqueName = null;
                if (this.activeSalePersonIsTransfer?.model?.action === ActionTypeEnum.TRANSFER) {
                    const salesPerson = salesPersonList?.find(item => item.value === this.activeSalePersonIsTransfer.model.uniqueName);
                    if (salesPerson) {
                        salesPersonUniqueName = salesPerson.value
                    }
                }
                this.addAccountForm.get('salesPersonUniqueName').patchValue(salesPersonUniqueName);
            }
        });
    }

    public ngAfterViewInit() {
        this.addAccountForm.get('country').get('countryCode').setValidators(Validators.required);
        let activegroupName = this.addAccountForm.get('activeGroupUniqueName')?.value;
        if (activegroupName === 'sundrydebtors' || activegroupName === 'sundrycreditors') {
            if (activegroupName === 'sundrycreditors') {
                this.showBankDetail = true;
            }
            this.isDebtorCreditor = true;
        }
        const mappings = this.addAccountForm.get('portalDomain') as FormArray;
        mappings.clear();
        this.addNewPortalUser();
        setTimeout(() => {
            this.formValueAssigned = true;
        }, 2500);
    }

    public isShowBankDetails(accountType: string) {
        if (accountType === 'sundrycreditors') {
            this.showBankDetail = true;
        } else {
            this.showBankDetail = false;
        }
    }

    public getAccount() {
        this.loadDefaultGroupsSuggestions();
    }

    public setCountryByCompany(company: CompanyResponse) {

        if (this.activeCompany && this.activeCompany.countryV2) {
            const countryCode = this.activeCompany.countryV2.alpha2CountryCode;
            const countryName = this.activeCompany.countryV2.countryName;
            this.addAccountForm.get('country').get('countryCode')?.patchValue(countryCode);
            this.selectedCountry = `${countryCode} - ${countryName}`;
            this.selectedCountryCode = countryCode;
            this.addAccountForm.get('currency')?.patchValue(company?.baseCurrency);
            this.getOnboardingForm(countryCode);
            this.companyCountry = countryCode;
        } else {
            this.addAccountForm.get('country').get('countryCode')?.patchValue('IN');
            this.selectedCountry = 'IN - India';
            this.selectedCountryCode = 'IN';
            this.addAccountForm.get('currency')?.patchValue('IN');
            this.companyCountry = 'IN';
            this.getOnboardingForm('IN');
        }
        this.toggleStateRequired();
    }

    public initializeNewForm() {
        this.addAccountForm = this._fb.group({
            activeGroupUniqueName: ['', Validators.required],
            name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
            uniqueName: [''],
            openingBalanceType: ['CREDIT'],
            foreignOpeningBalance: [''],
            openingBalance: [''],
            mobileNo: [''],
            email: ['', Validators.pattern(EMAIL_VALIDATION_REGEX)],
            companyName: [''],
            attentionTo: [''],
            description: [''],
            duePeriod: [''],
            addresses: this._fb.array([]),
            country: this._fb.group({
                countryCode: ['', Validators.required]
            }),
            hsnOrSac: [''],
            currency: [''],
            hsnNumber: [''],
            sacNumber: [''],
            accountBankDetails: this._fb.array([
                this._fb.group({
                    bankName: [''],
                    bankAccountNo: [''],
                    ifsc: [''],
                    beneficiaryName: [''],
                    branchName: [''],
                    swiftCode: [''],
                }),
            ]),
            portalDomain: this._fb.array([
                this._fb.group({
                    name: [''],
                    email: [''],
                    contactNo: [''],
                    default: [false]
                }),
            ]),
            closingBalanceTriggerAmount: ['', Validators.compose([digitsOnly])],
            closingBalanceTriggerAmountType: ['CREDIT'],
            customFields: this._fb.array([]),
            accountOpeningBalance: this._fb.array([
                this._fb.group({
                    branch: [''],
                    openingBalance: [''],
                    openingBalanceType: [''],
                    foreignOpeningBalance: ['']
                }),
            ]),
            salesPersonName: [''],
            salesPersonUniqueName: ['']
        });

        this.getInvoiceSettings();
    }

    /**
     * Initializes the GST details form with default values and validators.
     *
     * @returns FormGroup
     * @memberof AccountAddNewDetailsComponent
     */
    public initialGstDetailsForm(): FormGroup {
        this.isStateRequired = this.checkActiveGroupCountry();

        let gstFields = this._fb.group({
            gstNumber: ['', Validators.compose([Validators.maxLength(15)])],
            address: [''],
            state: this._fb.group({
                code: [''],
                name: [''],
                stateGstCode: ['']
            }),
            stateCode: [{ value: '', disabled: false }, (this.stateList?.length ? (this.isStateRequired ? Validators.required : "") : "")],
            county: this._fb.group({
                code: [''],
                name: ['']
            }),
            countyCode: [{ value: '', disabled: false }, (this.countyList?.length ? (this.isStateRequired ? Validators.required : "") : "")],
            isDefault: [false],
            isComposite: [false],
            partyType: ['NOT APPLICABLE'],
            pincode: ['']
        });
        return gstFields;
    }

    /**
     * This will be use for add new portal user
     *
     * @param {*} [user]
     * @memberof AccountAddNewDetailsComponent
     */
    public addNewPortalUser(user?: any): void {
        let mappings = this.addAccountForm.get('portalDomain') as FormArray;
        let mappingForm = this._fb.group({
            name: [''],
            email: [''],
            uniqueName: [''],
            contactNo: [''],
            default: [false]
        });
        mappings.push(mappingForm);
        if (user) {
            (Array.isArray(mappings.controls) ? mappings.controls : []).forEach(control => {
                if (!control?.get('name').value && !control?.get('email').value && !control?.get('contactNo').value) {
                    control?.get('name').setValue(user.name);
                    control?.get('email').setValue(user.email);
                    control?.get('contactNo').setValue(user.contactNo);
                    control?.get('default').setValue(true);
                    control?.get('uniqueName').setValue('');
                }
            });
        }
    }

    /**
     * This will be use for remove portal user
     *
     * @param {number} index
     * @memberof AccountAddNewDetailsComponent
     */
    public removePortalUser(index: number): void {
        let mappings = this.addAccountForm.get('portalDomain') as FormArray;
        mappings.removeAt(index);
    }

    public resetGstStateForm() {
        this.forceClear$ = observableOf({ status: true });

        let addresses = this.addAccountForm.get('addresses') as FormArray;
        for (let control of addresses.controls) {
            control.get('stateCode')?.patchValue(null);
            control.get('countyCode')?.patchValue(null);
            control.get('state').get('code')?.patchValue(null);
            control.get('gstNumber')?.setValue("");
        }
    }

    public resetBankDetailsForm() {
        let accountBankDetails = this.addAccountForm.get('accountBankDetails') as FormArray;
        for (let control of accountBankDetails.controls) {
            control.get('bankName')?.patchValue(null);
            control.get('bankAccountNo')?.patchValue(null);
            control.get('beneficiaryName')?.patchValue(null);
            control.get('branchName')?.patchValue(null);
            control.get('swiftCode')?.patchValue(null);
            control.get('ifsc')?.setValue("");
        }
    }


    public addGstDetailsForm(value?: string) {    // commented code because we no need GSTIN No. to add new address
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        addresses.push(this.initialGstDetailsForm());
        if (addresses?.length > 4) {
            this.moreGstDetailsVisible = false;
        }
        return;
    }

    public removeGstDetailsForm(i: number) {
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        addresses.removeAt(i);
    }

    public addBlankGstForm() {
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        if (addresses?.value?.length === 0) {
            addresses.push(this.initialGstDetailsForm());
        }
    }
    /**
     * This will be use for is default address selected
     *
     * @param {boolean} val
     * @param {number} i
     * @memberof AccountAddNewDetailsComponent
     */
    public isDefaultAddressSelected(val: boolean, activeIndex: number): void {
        this.activeIndex = activeIndex;
        if (val) {
            let addresses = this.addAccountForm.get('addresses') as FormArray;
            for (let control of addresses.controls) {
                control.get('isDefault')?.patchValue(false);
            }
            addresses.controls[activeIndex].get('isDefault')?.patchValue(true);
        }
    }

    /**
     * Validates and extracts the state code from the GST number entered in the given form.
     *
     * @param gstForm The `FormGroup` containing the GST-related form controls.
     * @memberof AccountAddNewDetailsComponent
     */
    public getStateCode(gstForm: FormGroup): void {
        let gstVal: string = gstForm.get('gstNumber')?.value?.trim();
        gstForm.get('gstNumber')?.setValue(gstVal?.trim());
        if (gstVal?.length) {
            if (gstVal?.length !== 15) {
                gstForm.get('partyType').reset('NOT APPLICABLE');
            }

            if (gstVal?.length >= 2) {
                this.statesSource$.pipe(take(1)).subscribe(state => {
                    let stateCode = this.stateGstCode[gstVal.substr(0, 2)];
                    let currentState = state.find(st => st?.value === stateCode);
                    if (currentState) {
                        gstForm.get('stateCode')?.patchValue(currentState.value);
                        gstForm.get('state').get('code')?.patchValue(currentState.value);
                        const name = currentState.label.split(' - ')[1];
                        gstForm.get('state').get('name')?.patchValue(name);
                    } else {
                        this._toaster.clearAllToaster();
                        if (this.formFields['taxName'] && !gstForm.get('gstNumber')?.valid) {
                            if (this.isIndia) {
                                gstForm.get('stateCode')?.patchValue(null);
                                gstForm.get('state').get('code')?.patchValue(null);
                                gstForm.get('state').get('name')?.patchValue(null);
                            }

                            let invalidTaxName = this.commonLocaleData?.app_invalid_tax_name;
                            invalidTaxName = invalidTaxName?.replace("[TAX_NAME]", this.formFields['taxName'].label);
                            this._toaster.errorToast(invalidTaxName);
                        }
                    }
                });
            }
        }
        this.changeDetectorRef.detectChanges();
    }

    public showMoreGst() {
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        this.gstDetailsLength = addresses?.controls?.length;
        this.moreGstDetailsVisible = true;
    }

    /**
     * This will be use for opening balance type value changes
     *
     * @param {string} type
     * @memberof AccountAddNewDetailsComponent
     */
    public openingBalanceTypeChanged(type: string): void {
        if (Number(this.addAccountForm.get('openingBalance')?.value) > 0 || Number(this.addAccountForm.get('foreignOpeningBalance')?.value) > 0) {
            this.addAccountForm.get('openingBalanceType')?.patchValue(type);
        }
    }

    public showLessGst() {
        this.gstDetailsLength = 3;
        this.moreGstDetailsVisible = false;
    }

    public resetAddAccountForm() {
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        const countries = this.addAccountForm.get('country') as FormGroup;
        addresses.reset();
        countries.reset();
        this.addAccountForm.reset();
    }

    public submit() {
        // Check for duplicate contact errors
        this.hasDuplicateContactErrors = this.checkForDuplicateContactErrors();

        if (this.addAccountForm.invalid || !this.isGstValid || this.isMobileNumberInvalid || this.hasDuplicateContactErrors) {
            this.isValidForm = false;

            // If duplicate contact errors exist, navigate to portal tab
            if (this.hasDuplicateContactErrors) {
                this.goToPortalTab();
            }
            return;
        }

        if (!this.addAccountForm.get('openingBalance')?.value) {
            this.addAccountForm.get('openingBalance')?.setValue('0');
        }
        if (!this.addAccountForm.get('foreignOpeningBalance')?.value) {
            this.addAccountForm.get('foreignOpeningBalance')?.patchValue('0');
        }
        if (this.showBankDetail) {
            const bankDetails = cloneDeep(this.addAccountForm.get('accountBankDetails')?.value);
            const isValid = this.generalService.checkForValidBankDetails(bankDetails?.pop(), this.selectedCountryCode);
            if (!isValid) {
                this._toaster.errorToast(this.localeData?.bank_details_error_message);
                return;
            }
        }
        let accountRequest: AccountRequestV2 = this.addAccountForm?.value as AccountRequestV2;
        let branchModeOpeningBalance = [
            {
                branch: {
                    name: this.company?.branch?.name,
                    uniqueName: this.company?.branch?.uniqueName
                },
                openingBalance: this.addAccountForm.get('openingBalance')?.value,
                foreignOpeningBalance: this.addAccountForm.get('foreignOpeningBalance')?.value,
                openingBalanceType: this.addAccountForm.get('openingBalanceType')?.value
            }
        ];

        const accountOpeningBalanceValue = this.addAccountForm.get('accountOpeningBalance')?.value;
        const isAccountOpeningBalanceValid = accountOpeningBalanceValue?.some((balance: any) => {
            return balance.branch || balance.openingBalance || balance.foreignOpeningBalance || balance.openingBalanceType;
        });
        const isBranchModeOpeningBalanceValid = branchModeOpeningBalance.some((balance: any) => {
            return balance.branch?.name || balance.openingBalance || balance.foreignOpeningBalance || balance.openingBalanceType;
        });

        accountRequest.accountOpeningBalance = this.company.isActive
            ? (isAccountOpeningBalanceValid ? accountOpeningBalanceValue : [])
            : (isBranchModeOpeningBalanceValid ? branchModeOpeningBalance : []);
        if (this.company.isActive) {
            accountRequest.accountOpeningBalance = this.isBulkDataUpdated ? this.tempSaveBulkData : [];
            accountRequest.accountOpeningBalance = accountRequest.accountOpeningBalance?.filter((res: any) => res?.branch?.uniqueName);
        }
        if (this.stateList && accountRequest.addresses && accountRequest.addresses.length > 0 && !this.isHsnSacEnabledAcc) {
            let selectedStateObj = this.getStateGSTCode(this.stateList, accountRequest.addresses[0].stateCode);
            if (selectedStateObj) {
                accountRequest.addresses[0].stateCode = selectedStateObj.stateGstCode;
            }
        }
        delete accountRequest['addAccountForm'];

        if (this.activeParentGroupUniqueName === "bankaccounts") {
            if (accountRequest.addresses && accountRequest.addresses.length > 0) {
                let addressExists = false;

                (Array.isArray(accountRequest.addresses) ? accountRequest.addresses : []).forEach(address => {
                    if (address?.address?.trim() || address?.gstNumber?.trim() || address?.stateCode?.trim() || address?.countyCode?.trim() || address?.pincode?.trim()) {
                        addressExists = true;
                    }
                });

                if (!addressExists) {
                    delete accountRequest['addresses'];
                }
            } else {
                delete accountRequest['addresses'];
            }
        }

        if (!this.isHsnSacEnabledAcc) {
            delete accountRequest['hsnOrSac'];
            delete accountRequest['hsnNumber'];
            delete accountRequest['sacNumber'];
        }

        if (!this.showBankDetail) {
            if (accountRequest['accountBankDetails']) {
                delete accountRequest['accountBankDetails'];
                delete this.addAccountForm['accountBankDetails'];
            }
        }
        if (!this.showVirtualAccount) {
            delete accountRequest['cashFreeVirtualAccountData'];
        }

        if (this.isHsnSacEnabledAcc || this.activeGroupUniqueName === 'discount') {
            delete accountRequest['addresses'];
        }

        accountRequest['hsnNumber'] = (accountRequest["hsnOrSac"] === "hsn") ? accountRequest['hsnNumber'] : "";
        accountRequest['sacNumber'] = (accountRequest["hsnOrSac"] === "sac") ? accountRequest['sacNumber'] : "";

        if (accountRequest.addresses && accountRequest.addresses.length > 0) {
            (Array.isArray(accountRequest.addresses) ? accountRequest.addresses : []).forEach(address => {
                if (this.countyList?.length) {
                    delete address['state'];
                    delete address['stateCode'];
                } else {
                    delete address['county'];
                    delete address['countyCode'];
                }
            });
        }
        accountRequest['portalDomain'] = accountRequest['portalDomain']?.filter(portalDomain => portalDomain.default !== true) || [];
        accountRequest['portalDomain']?.forEach(portalDomain => {
            delete portalDomain.default;
            delete portalDomain.uniqueName;
        });

        if ((!accountRequest['portalDomain'][0]?.name && !accountRequest['portalDomain'][0]?.email && !accountRequest['portalDomain'][0]?.contactNo) || !(this.activeGroupUniqueName === this.accountingGroupEnum.SundryDebtors || this.isParentSundrydebtors)) {
            delete accountRequest['portalDomain'];
        }
        delete accountRequest['salesPersonName'];
        this.store.dispatch(this.accountsAction.hasUnsavedChanges(false));
        this.submitClicked.emit({
            activeGroupUniqueName: this.activeGroupUniqueName,
            accountRequest,
            salesPersonCreated: this.salesPersonCreated
        });
        this.salesPersonCreated = false;
    }

    public closingBalanceTypeChanged(type: string) {
        if (Number(this.addAccountForm.get('closingBalanceTriggerAmount')?.value) > 0) {
            this.addAccountForm.get('closingBalanceTriggerAmountType')?.patchValue(type);
        }
    }

    /**
     * Open confirm leave dialog
     *
     * @memberof AccountAddNewDetailsComponent
     */
    public openConfirmLeaveDialog(): void {
        this.store.dispatch(this.accountsAction.hasUnsavedChanges(this.addAccountForm.dirty));
    }

    /**
     * ngOnChanges
     */
    public ngOnChanges(s) {
        if (s && s['showVirtualAccount'] && s['showVirtualAccount'].currentValue) {
            this.showOtherDetails = true;
        }
        if (s && s['activeGroupUniqueName'] && s['activeGroupUniqueName'].currentValue) {
            this.activeGroupUniqueName = s['activeGroupUniqueName'].currentValue;
        }
    }

    public ngOnDestroy() {
        this.resetAddAccountForm();
        this.store.dispatch(this.accountsAction.resetActiveAccount());
        this.store.dispatch(this.accountsAction.hasUnsavedChanges(false));
        this.salesPersonCreated = false;
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public selectCountry(event: IOption) {
        if (event && event.value) {
            this.store.dispatch(this._generalActions.resetStatesList());
            this.store.dispatch(this.commonActions.resetOnboardingForm());
            this.getOnboardingForm(event.value);
            let phoneCode = event.additional;
            this.addAccountForm.get('mobileCode')?.patchValue(phoneCode);
            let currencyCode = this.countryCurrency[event.value];
            this.addAccountForm.get('currency')?.patchValue(currencyCode);
            this.getStates(event.value);
            this.toggleStateRequired();
            this.resetGstStateForm();
            this.resetBankDetailsForm();
        }
    }

    /**
     * Checks whether a given unique group name exists within the list of parent groups.
     *
     * @param parentGroups - Array of parent group objects, each having a `uniqueName` field.
     * @param uniqueName - The unique name to search for in the parent groups.
     * @returns `true` if any parent group matches the given unique name, otherwise `false`.
     * @memberof AccountAddNewDetailsComponent
     */
    public checkParentGroup(parentGroups: any[], uniqueName: string): boolean {
        return parentGroups.some(parent => parent.uniqueName === uniqueName);
    }

    /**
     * Handles the selection of a state from a dropdown or similar UI component.
     *
     * @param gstForm The `FormGroup` containing GST-related form controls.
     * @param event The event object containing the selected state's label and value.
     * @memberof AccountAddNewDetailsComponent
     */
    public selectedState(gstForm: FormGroup, event: IOption): void {
        if (gstForm && event?.label) {
            gstForm.get('stateCode')?.patchValue(event?.value);
            gstForm.get('state').get('code')?.patchValue(event?.value);
            const name = event.label.split(' - ')[1];
            gstForm.get('state').get('name')?.patchValue(name);
        }
    }

    /**
     * Updates the county information in the GST form based on the selected county event.
     *
     * @param gstForm The `FormGroup` containing GST-related form controls.
     * @param event The event object containing the selected county's label and value.
     * @memberof AccountAddNewDetailsComponent
     */
    public selectedCounty(gstForm: FormGroup, event: IOption): void {
        if (gstForm && event?.label) {
            gstForm.get('countyCode')?.patchValue(event?.value);
            gstForm.get('county').get('code')?.patchValue(event?.value);
            gstForm.get('county').get('name')?.patchValue(event?.label);
        }
    }

    public selectGroup(event: IOption) {
        if (event?.value) {
            this.activeGroupUniqueName = event.value;
            this.store.dispatch(this.groupWithAccountsAction.getGroupDetails(this.activeGroupUniqueName));
            this.isParentDebtorCreditor(this.activeGroupUniqueName);

            let parent = event.additional;
            if (parent && parent[1]) {
                this.activeParentGroupUniqueName = parent[1].uniqueName;
            }

            this.isGroupSelected.emit(event);
            this.toggleStateRequired();
        }
    }

    public isParentDebtorCreditor(activeParentgroup: string) {
        this.activeParentGroup = activeParentgroup;
        this.activeParentGroupUniqueName = activeParentgroup;
        if (activeParentgroup === 'sundrycreditors' || activeParentgroup === 'sundrydebtors') {
            this.isShowBankDetails(activeParentgroup);
            this.isDebtorCreditor = true;
        } else {
            this.isBankAccount = false;
            this.isDebtorCreditor = false;
            this.showBankDetail = false;
        }
        this.changeDetectorRef.detectChanges();
    }

    public getCountry() {
        this.store.pipe(select(s => s.common.countriesAll), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res).forEach(key => {
                    this.countrySource.push({
                        value: res[key].alpha2CountryCode,
                        label: res[key].alpha2CountryCode + ' - ' + res[key].countryName,
                        additional: res[key].callingCode
                    });
                    // Creating Country Currency List
                    if (res[key]?.currency !== undefined && res[key]?.currency !== null) {
                        this.countryCurrency[res[key].alpha2CountryCode] = [];
                        this.countryCurrency[res[key].alpha2CountryCode] = res[key].currency.code;
                    }
                });
                this.countrySource$ = observableOf(this.countrySource);
            } else {
                let countryRequest = new CountryRequest();
                countryRequest.formName = '';
                this.store.dispatch(this.commonActions.GetAllCountry(countryRequest));
            }
        });
    }

    public getOnboardingForm(countryCode: string) {
        let onboardingFormRequest = new OnboardingFormRequest();
        onboardingFormRequest.formName = '';
        onboardingFormRequest.country = countryCode;
        this.store.dispatch(this.commonActions.GetOnboardingForm(onboardingFormRequest));
    }

    public getCurrency() {
        this.store.pipe(select(s => s.session.currencies), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res).forEach(key => {
                    this.currencies.push({ label: res[key].code, value: res[key].code });
                });

                this.currencySource$ = observableOf(this.currencies);
                setTimeout(() => {
                    // Timeout is used as value were not updated in form
                    this.setCountryByCompany(this.activeCompany);
                }, 500);
            }
        });
    }

    public getCallingCodes() {
        this.store.pipe(select(s => s.common.callingcodes), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res.callingCodes).forEach(key => {
                    this.countryPhoneCode.push({ label: res.callingCodes[key], value: res.callingCodes[key] });
                });
                this.callingCodesSource$ = observableOf(this.countryPhoneCode);
            } else {
                this.store.dispatch(this.commonActions.GetCallingCodes());
            }
        });
    }

    public checkGstNumValidation(ele: HTMLInputElement) {
        let isValid: boolean = false;
        if (ele?.value?.trim()) {
            if (this.formFields['taxName']['regex'] !== "" && this.formFields['taxName']['regex']?.length > 0) {
                for (let key = 0; key < this.formFields['taxName']['regex'].length; key++) {
                    let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                    if (regex.test(ele?.value)) {
                        isValid = true;
                        break;
                    }
                }
            } else {
                isValid = true;
            }
            if (!isValid) {
                this._toaster.errorToast('Invalid ' + this.formFields['taxName']?.label);
                ele?.classList?.add('error-box');
                this.isGstValid = false;
            } else {
                ele?.classList?.remove('error-box');
                this.isGstValid = true;
                if (this.selectedCountryCode === 'IN') {
                    this.getGstConfirmationPopup();
                }
            }
        } else {
            ele?.classList?.remove('error-box');
            this.isGstValid = true;
        }
    }

    public getStates(countryCode) {
        this.selectedCountryCode = countryCode;
        if (countryCode && this.addAccountForm) {
            let accountBankDetails = this.addAccountForm.get('accountBankDetails') as FormArray;
            for (let control of accountBankDetails.controls) {
                if (countryCode === 'IN') {
                    control.get('bankAccountNo').setValidators([Validators.minLength(9), Validators.maxLength(18)]);
                    this.bankIbanNumberMaxLength = '18';
                    this.bankIbanNumberMinLength = '9';
                } else {
                    control.get('bankAccountNo').setValidators([Validators.minLength(23), Validators.maxLength(34)]);
                    this.bankIbanNumberMaxLength = '34';
                    this.bankIbanNumberMinLength = '23';
                }
            }
        }
        this.store.dispatch(this._generalActions.resetStatesList());
        this.store.pipe(select(s => s.general.states), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.states = [];
                this.stateList = [];
                this.countyList = [];
                this.statesSource$ = observableOf([]);

                if (res.stateList) {
                    this.stateList = res.stateList;

                    Object.keys(res.stateList).forEach(key => {
                        if (res.stateList[key].stateGstCode !== null) {
                            this.stateGstCode[res.stateList[key].stateGstCode] = [];
                            this.stateGstCode[res.stateList[key].stateGstCode] = res.stateList[key].code;
                        }

                        this.states.push({
                            label: res.stateList[key].code + ' - ' + res.stateList[key].name,
                            value: res.stateList[key].code
                        });
                    });
                    this.statesSource$ = observableOf(this.states);
                }

                if (res.countyList) {
                    this.countyList = res.countyList?.map(county => {
                        return { label: county.name, value: county.code };
                    });
                }

                this.toggleStateRequired();
                this.changeDetectorRef.detectChanges();
            } else {
                let statesRequest = new StatesRequest();
                statesRequest.country = countryCode;
                this.store.dispatch(this._generalActions.getAllState(statesRequest));
            }
        });
    }

    /**
     * Get Party Type List
     *
     * @memberof AccountAddNewDetailsComponent
     */
    public getPartyTypes() {
        this.store.pipe(select(s => s.common.partyTypes), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                switch (this.activeCompany?.countryV2?.alpha2CountryCode) {
                    case 'ZW':
                    case 'KE': this.partyTypeSource = res.filter(item => (item.label === 'GOVERNMENT ENTITY') || (item.label === 'NOT APPLICABLE'));
                        break;
                    default: this.partyTypeSource = res;
                }
            } else {
                this.store.dispatch(this.commonActions.GetPartyType());
            }
        });
    }

    private getStateGSTCode(stateList, code: string) {
        return stateList.find(res => code === res.code);
    }

    /**
     * This function is used to check if company country is India and Group is sundrydebtors or sundrycreditors
     *
     * @returns {void}
     * @memberof AccountAddNewDetailsComponent
     */
    public checkActiveGroupCountry(): boolean {
        if (this.activeCompany && this.activeCompany.countryV2 && this.activeCompany.countryV2.alpha2CountryCode === this.addAccountForm.get('country').get('countryCode')?.value && (this.activeGroupUniqueName === 'sundrycreditors' || this.activeParentGroupUniqueName === 'sundrycreditors' || this.activeGroupUniqueName === 'sundrydebtors' || this.activeParentGroupUniqueName === 'sundrydebtors')) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * This functions is used to add/remove required validation to state field
     *
     * @returns {void}
     * @memberof AccountAddNewDetailsComponent
     */
    public toggleStateRequired(): void {
        this.isStateRequired = this.checkActiveGroupCountry();
        let i = 0;
        let addresses = this.addAccountForm.get('addresses') as FormArray;
        for (let control of addresses.controls) {
            control.get('stateCode').setValidators(null);
            control.get('countyCode').setValidators(null);
            if (this.isStateRequired) {
                if (this.countyList?.length) {
                    control.get('countyCode').setValidators([Validators.required]);
                } else {
                    control.get('stateCode').setValidators([Validators.required]);
                }
            }
            control.get('countyCode').updateValueAndValidity();
            control.get('stateCode').updateValueAndValidity();
            i++;
        }
        this.addAccountForm.controls['addresses'].updateValueAndValidity();
    }

    /**
     * To make value alphanumeric
     *
     * @param {*} type To check Type of bank details field
     * @param {*} element element reference
     * @memberof AccountAddNewDetailsComponent
     */
    public bankDetailsValidator(element, type: string): void {
        let trim: string = '';
        if (element?.value && type) {
            // changes account number validation for country india as well ref card : GIDK-1119
            trim = element.value?.replace(/[^a-zA-Z0-9]/g, '');
            let accountBankDetail = this.addAccountForm.get('accountBankDetails') as FormArray;
            for (let control of accountBankDetail.controls) {
                if (type === 'bankAccountNo') {
                    control.get('bankAccountNo')?.patchValue(trim);
                } else if (type === 'swiftCode') {
                    control.get('swiftCode')?.patchValue(trim);
                }
            }
        }
    }

    /**
     * To show bank details validation using toaster
     *
     * @param {*} element Edit box value
     * @param {*} type  To check Type of bank details field
     * @memberof AccountAddNewDetailsComponent
     */
    public showBankDetailsValidation(element: any, type: any) {
        if (type === 'bankAccountNo') {
            if (this.selectedCountryCode === 'IN') {
                if (element && element.value && element.value.length < 9) {
                    this._toaster.errorToast(this.commonLocaleData?.app_invalid_bank_account_number);
                    element.classList.add('error-box');
                } else {
                    element.classList.remove('error-box');
                }
            } else {
                if (element && element.value && element.value.length < 23) {
                    this._toaster.errorToast(this.commonLocaleData?.app_invalid_iban);
                    element.classList.add('error-box');
                } else {
                    element.classList.remove('error-box');
                }
            }
        } else if (type === 'swiftCode') {
            if (element && element.value && element.value.length < 8) {
                this._toaster.errorToast(this.commonLocaleData?.app_invalid_swift_code);
                element.classList.add('error-box');
            } else {
                element.classList.remove('error-box');
            }
        }
    }

    /**
     * Handles tab change
     *
     * @param {MatTabChangeEvent} event
     * @memberof AccountAddNewDetailsComponent
     */
    public tabChanged(event: MatTabChangeEvent): void {
        if (event) {
            this.selectedTabLabel = event.tab.textLabel;
            this.selectedTabIndex = event.index;
            this.isCustomSelectedTab = event.tab.textLabel === this.localeData?.tabs?.custom;

            // Mark this tab as activated
            this.activatedTabs.add(event.tab.textLabel);
        }
    }

    /**
     * Checks if there are any duplicate contact number errors in portal domain
     *
     * @returns {boolean} True if duplicate contact errors exist
     * @memberof AccountAddNewDetailsComponent
     */
    public checkForDuplicateContactErrors(): boolean {
        const portalDomain = this.addAccountForm.get('portalDomain') as FormArray;
        if (!portalDomain) {
            return false;
        }

        for (let i = 0; i < portalDomain.controls.length; i++) {
            const control = portalDomain.at(i);
            if (control.get('contactNo')?.hasError('duplicate')) {
                return true;
            }
        }
        return false;
    }

    /**
     * Navigates to a specific tab by index
     *
     * @param {number} tabIndex - Index of the tab to navigate to
     * @memberof AccountAddNewDetailsComponent
     */
    public goToTab(tabIndex: number): void {
        this.selectedTabIndex = tabIndex;
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Navigates to the portal tab (index 2) when duplicate contact errors exist
     *
     * @memberof AccountAddNewDetailsComponent
     */
    public goToPortalTab(): void {
        this.goToTab(2); // Portal tab is at index 2
    }

    /**
     * Checks if a tab has been activated at least once
     *
     * @param {string} textLabel - Label of the tab to check
     * @returns {boolean} True if tab has been activated
     * @memberof AccountAddNewDetailsComponent
     */
    public isTabActivated(textLabel: string): boolean {
        return this.activatedTabs.has(textLabel);
    }

    /**
    * API call to get custom field data
    *
    * @memberof AccountAddNewDetailsComponent
    */
    public getCompanyCustomField(): void {
        if (this.isCustomFieldLoading) {
            return;
        }
        this.isCustomFieldLoading = true;
        this.companyCustomFields = [];
        this.customFieldsService.list(this.customFieldsRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === 'success') {
                this.companyCustomFields = response.body?.results;
                this.createDynamicCustomFieldForm(this.companyCustomFields);
            } else {
                this._toaster.errorToast(response.message);
            }
            this.isCustomFieldLoading = false;
            this.changeDetectorRef.detectChanges();
        });
    }

    /**
     * To create blank dynamic custom field row
     *
     * @memberof AccountAddNewDetailsComponent
     */
    public addBlankCustomFieldForm(): void {
        const customField = this.addAccountForm.get('customFields') as FormArray;
        if (customField?.value?.length === 0) {
            customField.push(this.initialCustomFieldDetailsForm(null));
        }
    }

    /**
     * To render custom field form
     *
     * @param {*} obj
     * @param {*} customFieldLength
     * @memberof AccountAddNewDetailsComponent
     */
    public renderCustomFieldDetails(obj: any, customFieldLength: any): void {
        const customField = this.addAccountForm.get('customFields') as FormArray;
        if (customField?.length < customFieldLength) {
            customField.push(this.initialCustomFieldDetailsForm(obj));
        }
    }

    /**
     * To initialize custom field form
     *
     * @param {CustomFieldsData} [value=null]
     * @returns {FormGroup}
     * @memberof AccountAddNewDetailsComponent
     */
    public initialCustomFieldDetailsForm(value: CustomFieldsData = null): FormGroup {
        let customFields = this._fb.group({
            uniqueName: [''],
            value: ['', (value?.isMandatory) ? Validators.required : undefined],
        });

        if (value) {
            customFields?.patchValue({
                uniqueName: value.uniqueName,
                value: typeof value.value === 'string' ? value.value : ''
            });
        }
        return customFields;
    }

    /**
     * To create dynamic custom field form
     *
     * @param {*} customFieldForm
     * @memberof AccountAddNewDetailsComponent
     */
    public createDynamicCustomFieldForm(customFieldForm: any): void {
        customFieldForm.map(item => {
            this.renderCustomFieldDetails(item, customFieldForm?.length);
        });
    }

    /**
     * To set boolean type custom field value
     *
     * @param {string} isChecked to check boolean custom field true or false
     * @param {number} index index number
     * @memberof AccountAddNewDetailsComponent
     */
    public selectedBooleanCustomField(isChecked: string, index: number): void {
        const customField = this.addAccountForm.get('customFields') as FormArray;
        customField.controls[index].get('value')?.setValue(isChecked);
    }

    /**
     * Search query change handler for group
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof AccountAddNewDetailsComponent
     */
    public onGroupSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.groupsSearchResultsPaginationData.query = query;
        if (!this.preventDefaultGroupScrollApiCall &&
            (query || (this.defaultGroupSuggestions && this.defaultGroupSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                count: DROPDOWN_ITEMS_COUNT_LIMIT,
            }
            if (this.isLedgerModule) {
                // Remove the top hierarchy of groups
                requestObject.removeTop = true;
            }
            if (this.isServiceCreation) {
                // Group requires the group uniquename whose child groups will be fetched from API
                // The result will not include this group but will only include its children
                requestObject.group = this.activeGroupUniqueName;
            }
            if (this.isCustomerCreation) {
                // Group requires the group uniquename whose child groups will be fetched from API
                requestObject.group = this.activeGroupUniqueName;
                // Include the parent group provided in 'group' param in fetched results
                // The result will include this group and its children
                requestObject.includeSearchedGroup = true;
            }
            if (this.includeSearchedGroup) {
                requestObject.includeSearchedGroup = true;
            }
            let activeGroup;
            this.activeGroup$.pipe(take(1)).subscribe(response => activeGroup = response);
            this.groupService.searchGroups(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: `${result?.name}`,
                            additional: result?.parentGroups
                        }
                    }) || [];
                    if (page === 1) {
                        if (activeGroup && searchResults?.findIndex(group => group?.value === activeGroup?.uniqueName) === -1) {
                            // Active group is not found in first page add it
                            searchResults.push({
                                value: activeGroup?.uniqueName,
                                label: `${activeGroup.name}`,
                                additional: activeGroup.parentGroups
                            });
                        }
                        this.flatGroupsOptions = searchResults;
                    } else {
                        const results = [
                            ...this.flatGroupsOptions,
                            ...searchResults
                        ];
                        this.flatGroupsOptions = uniqBy(results, 'value');
                    }
                    this.groupsSearchResultsPaginationData.page = data.body.page;
                    this.groupsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultGroupPaginationData.page = this.groupsSearchResultsPaginationData.page;
                        this.defaultGroupPaginationData.totalPages = this.groupsSearchResultsPaginationData.totalPages;
                    }
                    this.changeDetectorRef.detectChanges();
                }
            });
        } else {
            this.flatGroupsOptions = [...this.defaultGroupSuggestions];
            this.groupsSearchResultsPaginationData.page = this.defaultGroupPaginationData.page;
            this.groupsSearchResultsPaginationData.totalPages = this.defaultGroupPaginationData.totalPages;
            this.preventDefaultGroupScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultGroupScrollApiCall = false;
            }, 500);
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Scroll end handler for group dropdown
     *
     * @returns null
     * @memberof AccountAddNewDetailsComponent
     */
    public handleGroupScrollEnd(): void {
        if (this.groupsSearchResultsPaginationData.page < this.groupsSearchResultsPaginationData.totalPages) {
            this.onGroupSearchQueryChanged(
                this.groupsSearchResultsPaginationData.query,
                this.groupsSearchResultsPaginationData.page + 1,
                (response) => {
                    if (!this.groupsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result?.uniqueName,
                                label: `${result?.name}`,
                                additional: result?.parentGroups
                            }
                        }) || [];
                        this.defaultGroupSuggestions = this.defaultGroupSuggestions.concat(...results);
                        this.defaultGroupPaginationData.page = this.groupsSearchResultsPaginationData.page;
                        this.defaultGroupPaginationData.totalPages = this.groupsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
     * Loads the default group list for advance search
     *
     * @private
     * @memberof AccountAddNewDetailsComponent
     */
    private loadDefaultGroupsSuggestions(): void {
        this.onGroupSearchQueryChanged('', 1, (response) => {
            this.defaultGroupSuggestions = response.map(result => {
                return {
                    value: result?.uniqueName,
                    label: `${result?.name}`,
                    additional: result?.parentGroups
                }
            }) || [];
            this.defaultGroupPaginationData.page = this.groupsSearchResultsPaginationData.page;
            this.defaultGroupPaginationData.totalPages = this.groupsSearchResultsPaginationData.totalPages;
        });
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof AccountAddNewDetailsComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            this.activatedTabs.add(this.localeData?.tabs?.address);
            this.store.pipe(select(s => s.common.onboardingform), takeUntil(this.destroyed$)).subscribe(res => {
                if (res) {
                    if (res.fields) {
                        this.formFields = [];
                        Object.keys(res.fields).forEach(key => {
                            if (res.fields[key]) {
                                this.formFields[res.fields[key].name] = [];
                                this.formFields[res.fields[key].name] = res.fields[key];
                            }
                        });
                    }
                    if (this.formFields['taxName'] && this.formFields['taxName'].label) {
                        this.GSTIN_OR_TRN = this.formFields['taxName'].label;
                        this.taxNamePlaceholder = this.commonLocaleData?.app_enter_tax_name;
                        this.taxNamePlaceholder = this.taxNamePlaceholder?.replace("[TAX_NAME]", this.formFields['taxName']?.label || '');
                    } else {
                        this.GSTIN_OR_TRN = '';
                    }

                    this.changeDetectorRef.detectChanges();
                }
            });
        }
    }

    /*
     * This will get invoice settings
     *
     * @memberof AccountAddNewDetailsComponent
     */
    public getInvoiceSettings(): void {
        this.invoiceService.GetInvoiceSetting().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === "success" && response.body) {
                let invoiceSettings = cloneDeep(response.body);
                this.inventorySettings = invoiceSettings.companyInventorySettings;

                if (this.inventorySettings?.manageInventory) {
                    this.addAccountForm.get("hsnOrSac")?.patchValue("hsn");
                } else {
                    this.addAccountForm.get("hsnOrSac")?.patchValue("sac");
                }
            }
        });
    }

    /**
     * This will show/hide address tab depending on parent group
     *
     * @private
     * @memberof AccountAddNewDetailsComponent
     */
    private showHideAddressTab(): void {
        if (!this.isHsnSacEnabledAcc) {
            const accountAddress = this.addAccountForm.get('addresses') as FormArray;
            if (accountAddress.controls?.length === 0 || !accountAddress?.length) {
                this.addBlankGstForm();
            }
        } else {
            let loop = 0;
            const addresses = this.addAccountForm.get('addresses') as FormArray;
            for (let control of addresses.controls) {
                this.removeGstDetailsForm(loop);
                loop++;
            }
            addresses.push(this.initialGstDetailsForm());
        }
    }

    /**
     * Closes Master
     *
     * @memberof AccountAddNewDetailsComponent
     */
    public closeMaster(): void {
        this.closeAccountModal.emit(true);
        this.store.dispatch(this.groupWithAccountsAction.HideAddAndManageFromOutside());
        document.querySelector('body')?.classList?.remove('master-page');
    }

    /**
      * This will open for get gst information confirmation dialog
      *
      * @memberof AccountAddNewDetailsComponent
      */
    public getGstConfirmationPopup(): void {
        let addresses = (this.addAccountForm.get('addresses') as FormArray).at(this.activeIndex);
        if (addresses?.get('gstNumber')?.value) {
            this.commonService.getGstInformationDetails(addresses.get('gstNumber')?.value).pipe(takeUntil(this.destroyed$)).subscribe(result => {
                if (result?.body) {
                    let dialogRef = this.dialog.open(ConfirmModalComponent, {
                                width: '40%',
                                data: {
                            title: this.commonLocaleData?.app_confirmation,
                                body: this.commonLocaleData?.app_gst_confirm_message1,
                                ok: this.commonLocaleData?.app_yes,
                                cancel: this.commonLocaleData?.app_no,
                                permanentlyDeleteMessage: this.commonLocaleData?.app_gst_confirm_message2
                            }
                    });
                    dialogRef.afterClosed().subscribe(response => {
                        if (response) {
                            if (addresses?.get('isDefault')?.value) {
                                this.addAccountForm.get('name')?.patchValue(result.body?.lgnm);
                            }
                            let completeAddress = this.generalService.getCompleteAddress(result.body?.pradr?.addr);
                            addresses.get('address')?.patchValue(completeAddress);
                            addresses.get('pincode')?.patchValue(result.body?.pradr?.addr?.pncd);
                        }
                    });
                }
            });
        }
    }

    /**
     * Open Bulk Add Dialog
     *
     * @memberof AccountAddNewDetailsComponent
     */
    public openBulkAddDialog(): void {
        this.isForeignCurrency = this.addAccountForm.get('currency')?.value !== this.companyCurrency;
        let data = {
            foreignCurrency: this.isForeignCurrency,
            saveBulkData: this.tempSaveBulkData?.length ? this.tempSaveBulkData : []
        }
        const bulkAddAsideMenuRef = this.dialog.open(BulkAddDialogComponent, {
            ...ASIDE_PANE_CONFIG,
            data: data
        });

        bulkAddAsideMenuRef.afterClosed().subscribe(result => {
            if (result) {
                this.bulkDialogData(result.customFields);
                this.tempSaveBulkData = result.customFields;
                this.isBulkDataUpdated = true;
            }
        });
    }

    /**
   * Get company branches
   *
   * @memberof AccountAddNewDetailsComponent
 */
    public getCompanyBranches(): void {
        this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
    }

    /**
     * This will be use for get bulk opening balance data
     *
     * @private
     * @param {*} dialogData
     * @memberof AccountAddNewDetailsComponent
     */
    private bulkDialogData(dialogData: any): void {
        const accountData = this.addAccountForm.get('accountOpeningBalance') as FormArray;
        accountData.clear();

        let openingBalanceCredit = 0;
        let openingBalanceDebit = 0;
        let foreignOpeningBalanceCredit = 0;
        let foreignOpeningBalanceDebit = 0;

        dialogData?.filter(item => item.foreignOpeningBalance > 0 || item.openingBalance > 0)
            .forEach(item => {
                const { foreignOpeningBalance, openingBalance, openingBalanceType, branch } = item;

                if (openingBalanceType === 'CREDIT') {
                    foreignOpeningBalanceCredit += foreignOpeningBalance;
                    openingBalanceCredit += openingBalance;
                } else if (openingBalanceType === 'DEBIT') {
                    foreignOpeningBalanceDebit += foreignOpeningBalance;
                    openingBalanceDebit += openingBalance;
                }

                const data = this._fb.group({
                    branch: [branch],
                    openingBalance: [openingBalance],
                    foreignOpeningBalance: [foreignOpeningBalance],
                    openingBalanceType: [openingBalanceType]
                });
                accountData.push(data);
            });

        this.totalOpeningBalanceDebitCredit(openingBalanceCredit, openingBalanceDebit);

        if (this.addAccountForm.get('currency')?.value !== this.companyCurrency) {
            this.totalForeignOpeningBalanceDebitCredit(foreignOpeningBalanceCredit, foreignOpeningBalanceDebit);
        }
    }
    /**
     * This will be calculate total Opening Balance Credit Debit
     *
     * @param {number} credit
     * @param {number} debit
     * @memberof AccountAddNewDetailsComponent
     */
    public totalOpeningBalanceDebitCredit(credit: number, debit: number): void {
        let openingBalanceType = 'CREDIT';
        let calculateTotal = 0;

        if (credit > debit) {
            calculateTotal = credit - debit;
            openingBalanceType = 'CREDIT';
            this.addAccountForm.get('openingBalanceType')?.patchValue('CREDIT');
        } else if (debit > credit) {
            calculateTotal = debit - credit;
            openingBalanceType = 'DEBIT';
            this.addAccountForm.get('openingBalanceType')?.patchValue('CREDIT');
        } else {
            calculateTotal = null;
        }
        this.addAccountForm.get('openingBalanceType')?.patchValue(openingBalanceType);
        this.addAccountForm.get('openingBalance')?.patchValue(calculateTotal);
    }

    /**
     * This will be use for calculating total foreign credit debit balance
     *
     * @param {number} credit
     * @param {number} debit
     * @memberof AccountAddNewDetailsComponent
     */
    public totalForeignOpeningBalanceDebitCredit(credit: number, debit: number): void {
        let calculateTotal = 0;

        if (credit > debit) {
            calculateTotal = credit - debit;
        } else if (debit > credit) {
            calculateTotal = debit - credit;
        } else {
            calculateTotal = null;
        }
        this.addAccountForm.get('foreignOpeningBalance')?.patchValue(calculateTotal);
    }

    /**
     * Open sales person dialog
     *
     * @memberof AccountAddNewDetailsComponent
     */
    public openSalesPersonDialog(): void {
        const dialogRef = this.dialog.open(SalesPersonComponent, {
            ...ASIDE_PANE_CONFIG,
            data: { activeSalePersonUniqueName: this.addAccountForm.get('salesPersonUniqueName').value || "" }
        });
        dialogRef.afterClosed().pipe(filter(Boolean), take(1), tap((res) => { this.getSalesPersonList(); this.salesPersonCreated = true; this.activeSalePersonIsTransfer = res.isTransfer })).subscribe();
    }

    /**
     * Get Sales Person List
     *
     * @memberof AccountAddNewDetailsComponent
     */
    public getSalesPersonList(): void {
        this.salesPersonStore.getAllSalesPerson({ isDropdown: true, params: { page: 1, count: API_BULK_FETCH_LIMIT } });
    }

    /**
     * Checks if a sales person exists by unique name
     *
     * @private
     * @param {string} uniqueName - The unique name to search for
     * @param {any[]} salesPersonList - Array of sales persons to search in
     * @returns {boolean} True if sales person exists, false otherwise
     * @memberof AccountAddNewDetailsComponent
     */
    private isSalesPersonExists(uniqueName: string, salesPersonList: IOption[]): boolean {
        if (!uniqueName || !salesPersonList?.length) return false;
        return salesPersonList.some(salesPerson => salesPerson?.value === uniqueName);
    }
}



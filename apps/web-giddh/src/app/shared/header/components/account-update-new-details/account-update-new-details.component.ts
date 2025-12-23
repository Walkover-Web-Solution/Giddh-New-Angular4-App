import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createSelector, select, Store } from '@ngrx/store';
import { GroupWithAccountsAction } from 'apps/web-giddh/src/app/actions/groupwithaccounts.actions';
import { ApplyTaxRequest } from 'apps/web-giddh/src/app/models/api-models/ApplyTax';
import { GroupResponse } from 'apps/web-giddh/src/app/models/api-models/Group';
import { IDiscountList } from 'apps/web-giddh/src/app/models/api-models/SettingsDiscount';
import { AccountService } from 'apps/web-giddh/src/app/services/account.service';
import { combineLatest, Observable, of as observableOf, ReplaySubject, timer } from 'rxjs';
import { take, takeUntil, debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { AccountsAction } from '../../../../actions/accounts.actions';
import { CommonActions } from '../../../../actions/common.actions';
import { CompanyActions } from '../../../../actions/company.actions';
import { GeneralActions } from '../../../../actions/general/general.actions';
import {
    AccountMergeRequest,
    AccountMoveRequest,
    AccountRequestV2,
    AccountResponseV2,
    AccountsTaxHierarchyResponse,
    AccountUnMergeRequest,
    CustomFieldsData,
    IAccountAddress,
} from '../../../../models/api-models/Account';
import { CountryRequest, OnboardingFormRequest } from '../../../../models/api-models/Common';
import { CompanyResponse, StateList, StatesRequest, TaxResponse } from '../../../../models/api-models/Company';
import { IForceClear } from '../../../../models/api-models/Sales';
import { ToasterService } from '../../../../services/toaster.service';
import { AppState } from '../../../../store';
import { digitsOnly } from '../../../helpers';
import { ApplyDiscountRequestV2 } from 'apps/web-giddh/src/app/models/api-models/ApplyDiscount';
import { GroupService } from 'apps/web-giddh/src/app/services/group.service';
import { DROPDOWN_ITEMS_COUNT_LIMIT, ASIDE_PANE_CONFIG, BranchHierarchyType, EMAIL_VALIDATION_REGEX, IOption, TCS_TDS_TAXES_TYPES, ZIP_CODE_SUPPORTED_COUNTRIES, API_BULK_FETCH_LIMIT } from 'apps/web-giddh/src/app/app.constant';
import { InvoiceService } from 'apps/web-giddh/src/app/services/invoice.service';
import { SearchService } from 'apps/web-giddh/src/app/services/search.service';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { clone, cloneDeep, differenceBy, flattenDeep, isEqual } from 'apps/web-giddh/src/app/lodash-optimized';
import { SettingsDiscountService } from 'apps/web-giddh/src/app/services/settings.discount.service';
import { CustomFieldsService } from 'apps/web-giddh/src/app/services/custom-fields.service';
import { FieldTypes } from 'apps/web-giddh/src/app/custom-fields/custom-fields.constant';
import { HttpClient } from '@angular/common/http';
import { BulkAddDialogComponent } from '../bulk-add-dialog/bulk-add-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OrganizationType } from 'apps/web-giddh/src/app/models/user-login-state';
import { SettingsBranchActions } from 'apps/web-giddh/src/app/actions/settings/branch/settings.branch.action';
import { AccountAddNewDetailsComponentStore } from '../account-add-new-details/utility/account-add-new-details.store';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { NewConfirmationModalComponent } from 'apps/web-giddh/src/app/theme/new-confirmation-modal/confirmation-modal.component';
import { AccountingGroupEnum, CountryNames } from '../../../Enums/common.enum';
import { SalesPersonComponentStore } from '../../../sales-person/utility/sales-person.store';
import { SalesPersonComponent } from '../../../sales-person/sales-person.component';
import { ActionTypeEnum } from '../../../sales-person/utility/sales-person.constant';

@Component({
    selector: 'account-update-new-details',
    templateUrl: './account-update-new-details.component.html',
    styleUrls: ['./account-update-new-details.component.scss'],
    providers: [AccountAddNewDetailsComponentStore, SalesPersonComponentStore],
    standalone: false
})

export class AccountUpdateNewDetailsComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    /** Holds the reactive form group for adding or editing an account. */
    public addAccountForm: FormGroup;
    @Input() public activeGroupUniqueName: string;
    @Input() public flatGroupsOptions: IOption[];
    @Input() public createAccountInProcess$: Observable<boolean>;
    @Input() public createAccountIsSuccess$: Observable<boolean>;
    @Input() public isGstEnabledAcc: boolean = false;
    @Input() public activeAccount$: Observable<AccountResponseV2>;
    @Input() public isHsnSacEnabledAcc: boolean = false;
    @Input() public updateAccountInProcess$: Observable<boolean>;
    @Input() public updateAccountIsSuccess$: Observable<boolean>;
    public activeAccountTaxHierarchy$: Observable<AccountsTaxHierarchyResponse>;
    @Input() public showBankDetail: boolean = false;
    @Input() public showVirtualAccount: boolean = false;
    @Input() public isDebtorCreditor: boolean = false;
    /** True if bank category account is selected */
    @Input() public isBankAccount: boolean = false;
    @Input() public showDeleteButton: boolean = true;
    @Input() public accountDetails: any;
    @ViewChild('autoFocusUpdate', { static: true }) public autoFocusUpdate: ElementRef;
    /** Reactive form used for moving an account to a different group.*/
    public moveAccountForm: FormGroup;
    /** Reactive form used to manage the selected taxes for a tax group. */
    public taxGroupForm: FormGroup;
    /** Instance of delete account modal */
    @ViewChild('deleteMergedAccountModal', { static: false }) public deleteMergedAccountModal: TemplateRef<any>;
    public activeCompany: CompanyResponse;
    @Output() public submitClicked: EventEmitter<{ value: { groupUniqueName: string, accountUniqueName: string }, accountRequest: AccountRequestV2, salesPersonCreated: boolean }>
        = new EventEmitter();
    /** Emitted when the update via patch api . */
    @Output() public updateViaPatchApi: EventEmitter<{ value: { groupUniqueName: string, accountUniqueName: string }, accountRequest: AccountRequestV2, isAccountArchived?: boolean }>
        = new EventEmitter();
    @Output() public deleteClicked: EventEmitter<any> = new EventEmitter();
    @Output() public isGroupSelected: EventEmitter<IOption> = new EventEmitter();
    /** Emiting true if account modal needs to be closed */
    @Output() public closeAccountModal: EventEmitter<boolean> = new EventEmitter();
    public showOtherDetails: boolean = false;
    public partyTypeSource: IOption[] = [];
    public stateList: StateList[] = [];
    /** List of counties of country */
    public countyList: IOption[] = [];
    public states: any[] = [];
    public statesSource$: Observable<IOption[]> = observableOf([]);
    public isTaxableAccount$: Observable<boolean>;
    /** List of available tax options to be shown in the dropdown. */
    public companyTaxDropDown: IOption[] = [];
    public moreGstDetailsVisible: boolean = false;
    public gstDetailsLength: number = 3;
    public companyCurrency: string;
    public isIndia: boolean = false;
    public companyCountry: string = '';
    public activeAccountName: string = '';
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public forceClearDiscount$: Observable<IForceClear> = observableOf({ status: false });
    public isDiscount: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public countrySource: IOption[] = [];
    public countrySource$: Observable<IOption[]> = observableOf([]);
    public currencies: IOption[] = [];
    public currencySource$: Observable<IOption[]> = observableOf([]);
    public countryCurrency: any[] = [];
    public countryPhoneCode: IOption[] = [];
    public callingCodesSource$: Observable<IOption[]> = observableOf([]);
    public accounts: IOption[];
    public stateGstCode: any[] = [];
    public formFields: any[] = [];
    /** Flag indicating whether the entered GSTIN number is valid. */
    public isGstValid: boolean = true;
    /** Holds active selected Tab Label */
    public selectedTabLabel: string = '';
    public moveAccountSuccess$: Observable<boolean>;
    public discountList$: Observable<IDiscountList[]>;
    public discountList: any[] = [];
    public setAccountForMove: string;
    public showDeleteMove: boolean = false;
    public deleteMergedAccountModalBody: string;
    public moveMergedAccountModalBody: string;
    public selectedAccountForDelete: string;
    public selectedAccountForMove: string;
    public selectedCountryCurrency: string = '';
    public selectedAccountCallingCode: string = '';
    public isOtherSelectedTab: boolean = false;
    public selectedaccountForMerge: any = [];
    public selectedDiscounts: IOption = null;
    public selectedDiscountList: any[] = [];
    public GSTIN_OR_TRN: string;
    public selectedCompanyCountryName: string;
    public selectedCurrency: string;
    public isStateRequired: boolean = false;
    public selectedCountryCode: string = '';
    public bankIbanNumberMaxLength: string = '18';
    public bankIbanNumberMinLength: string = '9';
    /** account applied inherited discounts list */
    public accountInheritedDiscounts: any[] = [];
    /** company custom fields list */
    public companyCustomFields: any[] = [];
    /** To check applied taxes modified  */
    public isTaxesSaveDisable$: Observable<boolean> = observableOf(true);
    /** To check applied discounts modified  */
    public isDiscountSaveDisable$: Observable<boolean> = observableOf(true);
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
    /** Stores the search results pagination details */
    public accountsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search */
    public defaultAccountSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list */
    public preventDefaultScrollApiCall: boolean = false;
    /** Stores the default search results pagination details */
    public defaultAccountPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the active account group */
    public activeAccountGroup: IOption[] = [];
    /** This holds account country name */
    public accountCountryName: string = "";
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
    public lastDuplicateEmailIndex: number | null = null;
    /** True if last duplicate contact in portal  users */
    public lastDuplicateContactIndex: number | null = null;
    /** True if last duplicate email in portal  users */
    public portalIndex: number;
    /** Stores the voucher API version of company */
    public voucherApiVersion: number;
    /** This will hold is portal default */
    public isPortalDefault: boolean;
    /** Holds list of countries which use ZIP Code in address */
    public zipCodeSupportedCountryList: string[] = ZIP_CODE_SUPPORTED_COUNTRIES;
    /** True if current currency is not company currency */
    public isForeignCurrency: boolean = false;
    /** Hold all temporary save bulk balance data */
    public tempSaveBulkData: any[] = [];
    /** Account Opening Balance list */
    public accountOpeningBalance: any[] = [];
    /** Holds company branches */
    public branches: Array<any>;
    /** Holds company specific data */
    public company: any = {
        branch: null,
    };
    /** True if update data on temp bulk data  */
    public isBulkDataUpdated: boolean = false;
    /** True if valid from date is selected */
    public isValidForm: boolean = true;
    /** True if form value is assigned */
    private formValueAssigned: boolean = false;
    /** Indicates whether the "Custom" tab is currently selected */
    public isCustomSelectedTab: boolean = false;
    /** Stores the index of the currently active mobile number field under the Portal tab */
    public isActivePortalMobileNumber: number = -1;
    /** Holds active selected Tab Index */
    public selectedTabIndex: number = 0;
    /** True if there are duplicate contact number errors */
    public hasDuplicateContactErrors: boolean = false;
    /** Tracks which tabs have been activated at least once */
    public activatedTabs: Set<string> = new Set([]);
    /** True if active country is UK */
    public isUKCompany: boolean = false;
    /** Flag to determine if the parent group is "sundrydebtors". */
    public isParentSundryDebtors: boolean = false;
    /** Flag to determine if the parent group is "sundrycreditors". */
    public isParentSundryCreditors: boolean = false;
    /** Flag to determine if the parent group is "bank accounts". */
    public isParentBankAccounts: boolean = false;
    /** Enum representing the types of accounting group type */
    public accountingGroupEnum: typeof AccountingGroupEnum = AccountingGroupEnum;
    /** Stores the list of selected tax labels to display in the UI. */
    public defaultTaxLabel: string[] = [];
    /** Store active parent group */
    public parentGroups: any[] = [];
    /** Sales Person List */
    public salesPersonList$: Observable<any> = this.salesPersonStore.salesPersonList$;
    /** Holds transfer info if active sales person is transfer */
    private activeSalePersonIsTransfer: any;
    /** True if sales person is created */
    public salesPersonCreated: boolean = false;
    /** Flag to determine if the parent group is "sundrycreditors". */
    @Input() public showBankDetailPreview: boolean = false;
    /** Flag to determine if the parent group is "sundrycreditors". */
    @Input() public contactPreview: boolean = false;
    /** True if action menu is open */
    @Input() public isActionMenu: boolean = false;
    /** Stores the current tax to display in the UI. */
    public currentTax: any;
    /** Stores the current discount to display in the UI. */
    public currentDiscount: any;

    constructor(
        private _fb: FormBuilder,
        private store: Store<AppState>,
        private accountsAction: AccountsAction,
        private searchService: SearchService,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private _accountService: AccountService,
        private _toaster: ToasterService,
        private companyActions: CompanyActions,
        private commonActions: CommonActions,
        private _generalActions: GeneralActions,
        private generalService: GeneralService,
        private groupService: GroupService,
        private invoiceService: InvoiceService,
        private changeDetectorRef: ChangeDetectorRef,
        private settingsDiscountService: SettingsDiscountService,
        private customFieldsService: CustomFieldsService,
        private http: HttpClient,
        public dialog: MatDialog,
        private settingsBranchAction: SettingsBranchActions,
        private readonly componentStore: AccountAddNewDetailsComponentStore,
        private salesPersonStore: SalesPersonComponentStore
    ) {

    }

    public ngOnInit() {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
                this.isUKCompany = activeCompany.country === CountryNames.UNITED_KINGDOM;
                if (activeCompany.countryV2) {
                    this.selectedCompanyCountryName = activeCompany.countryV2.alpha2CountryCode + ' - ' + activeCompany.country;
                    this.companyCountry = activeCompany.countryV2.alpha2CountryCode;
                }
                this.companyCurrency = clone(activeCompany.baseCurrency);
            }
        });

        this.activeAccount$ = this.store.pipe(select(state => state.groupwithaccounts.activeAccount), takeUntil(this.destroyed$));
        this.moveAccountSuccess$ = this.store.pipe(select(state => state.groupwithaccounts.moveAccountSuccess), takeUntil(this.destroyed$));
        this.activeAccountTaxHierarchy$ = this.store.pipe(select(state => state.groupwithaccounts.activeAccountTaxHierarchy), takeUntil(this.destroyed$));
        this.getCountry();
        this.getCurrency();
        this.getCallingCodes();
        this.getPartyTypes();
        this.prepareTaxDropdown();
        this.getDiscountList();
        this.getCompanyBranches();
        this.getSalesPersonList();

        if (this.activeGroupUniqueName === 'discount') {
            this.isDiscount = true;
        }
        this.initializeNewForm();
        this.moveAccountForm = this._fb.group({
            moveto: ['', Validators.required]
        });
        this.moveAccountSuccess$.subscribe(p => {
            if (p) {
                this.moveAccountForm.reset();
            }
        });
        this.taxGroupForm = this._fb.group({
            taxes: ['']
        });

        this.initAccountCustomFields();

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

        // get openingblance value changes
        this.addAccountForm.get('openingBalance').valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(a => { // as disccused with back end team bydefault openingBalanceType will be CREDIT
            if (a && (a === 0 || a <= 0) && this.addAccountForm.get('openingBalanceType')?.value) {
                this.addAccountForm.get('openingBalanceType')?.patchValue('CREDIT');
            } else if (a && (a === 0 || a > 0) && this.addAccountForm.get('openingBalanceType')?.value === '') {
                this.addAccountForm.get('openingBalanceType')?.patchValue('CREDIT');
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
                defaultUser.get('default').patchValue(false);
            }
            if (change) {
                if (change.invalid) {
                    this.portalIndex = undefined;
                    return;
                }
                if (this.accountDetails) {
                    this.activeAccountName = this.accountDetails.uniqueName;
                } else {
                    this.activeAccount$.pipe(take(1)).subscribe(activeAccountState => this.activeAccountName = activeAccountState?.uniqueName);
                }
                if (change.get('email').value) {
                    change.get('email')?.setValidators([Validators.required, Validators.pattern(EMAIL_VALIDATION_REGEX)]);
                    change.get('email')?.updateValueAndValidity();
                } else {
                    change.get('email')?.setValidators([Validators.pattern(EMAIL_VALIDATION_REGEX)]);
                    change.get('email')?.updateValueAndValidity();
                }
                // change.get('contactNo')?.setValue(mobileNo);
                
                // Email validation
                let lastEmailOccurrenceIndex = -1;
                let currentEmail = change.get('email')?.value;
                let emailDuplicateFound = false;
                if (currentEmail !== "" && currentEmail) {
                    mappings.controls.forEach((control, i) => {
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
                    mappings.controls.forEach((control, i) => {
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
                if (this.lastDuplicateEmailIndex === -1 && this.lastDuplicateContactIndex === -1) {
                    this._accountService.createPortalUser([change.value], this.activeAccountName).pipe(take(1)).subscribe(data => {
                        if (data?.status === 'success') {
                            this._toaster.successToast(this.localeData?.portal_updated_successfully, 'Success');
                            change.get('uniqueName')?.setValue(data?.body[0]?.uniqueName);
                        } else {
                            this._toaster.errorToast(data.message, data.code);
                        }
                    });
                }
            }
        });

        this.addAccountForm.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(isEqual),
            takeUntil(this.destroyed$))
            .subscribe((response) => {
                const users = this.addAccountForm.get('portalDomain') as FormArray;
                if (response?.attentionTo || response?.mobileNo || response?.email) {
                    let user = users.controls.find(control => control.get('default')?.value === true);
                    if (user) {
                        if (!this.isPortalDefault) {
                            user?.get('name').setValue(response?.attentionTo);
                            user?.get('email').setValue(response?.email);
                            user?.get('contactNo').setValue(response?.mobileNo);
                            user?.get('default').setValue(true);
                        }
                    } else {
                        let setValue = false;
                        let matchedEmail = users.value.filter(user => user.email === response.email);
                        if (matchedEmail?.length) {
                            setValue = true;
                            return;
                        }
                        users.controls?.find((control) => {
                            if (!control.get('name')?.value && !control.get('email')?.value && !control.get('contactNo')?.value) {
                                control.patchValue({ name: response?.attentionTo, email: response?.email, contactNo: response?.mobileNo, default: true });
                                setValue = true;
                                return;
                            }
                        });
                        if (!setValue) {
                            let data = { name: response?.attentionTo, email: response?.email, contactNo: response?.mobileNo, default: true };
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

        this.addAccountForm.get('activeGroupUniqueName')?.setValue(this.activeGroupUniqueName);
        this.accountsAction.mergeAccountResponse$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            this.selectedaccountForMerge = '';
        });
        this.isTaxableAccount$ = this.store.pipe(select(createSelector([(state: AppState) => state.groupwithaccounts.activeAccount], (activeAccount) => {
            let result: boolean = false;
            if (this.activeGroupUniqueName && activeAccount) {
                result = this.getAccountFromGroup(activeAccount, false);
            } else {
                result = false;
            }
            return result;
        })), takeUntil(this.destroyed$));

        this.updateAccountIsSuccess$?.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.store.dispatch(this.accountsAction.hasUnsavedChanges(false));
                this.addAccountForm?.markAsPristine();
            }
        });

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
        this.onViewReady(true);
        this.loadAccountData();

        this.salesPersonList$.pipe(takeUntil(this.destroyed$), filter(Boolean)).subscribe((salesPersonList: IOption[]) => {
            if (!this.isSalesPersonExists(this.addAccountForm.get('salesPersonUniqueName').value, salesPersonList)) {
                let salesPersonName = "";
                let salesPersonUniqueName = null;
                if (this.activeSalePersonIsTransfer?.model?.action === ActionTypeEnum.TRANSFER) {
                    const salesPerson = salesPersonList?.find(item => item.value === this.activeSalePersonIsTransfer.model.uniqueName);
                    if (salesPerson) {
                        salesPersonName = salesPerson.label
                        salesPersonUniqueName = salesPerson.value
                    }
                }
                this.addAccountForm.get('salesPersonName').patchValue(salesPersonName);
                this.addAccountForm.get('salesPersonUniqueName').patchValue(salesPersonUniqueName);
            }
        });
    }

    public ngAfterViewInit() {
        if (this.flatGroupsOptions === undefined) {
            this.getAccount();
        }
        this.taxHierarchy();
        let selectedGroupDetails;

        this.store.pipe(select(appStore => appStore.groupwithaccounts.activeGroup), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                selectedGroupDetails = response;
                if (selectedGroupDetails?.parentGroups) {
                    this.parentGroups = [...selectedGroupDetails.parentGroups, { uniqueName: selectedGroupDetails?.uniqueName }];
                    this.isParentDebtorCreditor();
                }
            }
        });
        this.prepareTaxDropdown();
        setTimeout(() => {
            this.formValueAssigned = true;
        }, 2500);
    }

    public getAccountFromGroup(activeGroup: AccountResponseV2, result: boolean): boolean {
        if (activeGroup.category === 'income' || activeGroup.category === 'expenses' || this.isDebtorCreditor) {
            result = true;
        }
        return result;
    }

    public prepareTaxDropdown() {
        // prepare drop down for taxes
        this.store.pipe(select(createSelector([
            (state: AppState) => state.groupwithaccounts.activeAccount,
            (state: AppState) => state.groupwithaccounts.activeAccountTaxHierarchy,
            (state: AppState) => state.company && state.company.taxes],
            (activeAccount: AccountResponseV2, activeAccountTaxHierarchy: AccountsTaxHierarchyResponse, taxes: TaxResponse[]) => {
                let arr: IOption[] = [];
                if (taxes) {
                    if (activeAccount) {
                        let applicableTaxes = activeAccount.applicableTaxes.map(p => p?.uniqueName);

                        // set isGstEnabledAcc or not
                        if (activeAccount.parentGroups[0]?.uniqueName) {
                            let col = activeAccount.parentGroups[0]?.uniqueName;
                            this.isHsnSacEnabledAcc = col === 'revenuefromoperations' || col === 'otherincome' || col === 'operatingcost' || col === 'indirectexpenses';
                            this.isGstEnabledAcc = !this.isHsnSacEnabledAcc;
                        }

                        if (activeAccountTaxHierarchy) {

                            if (activeAccountTaxHierarchy.inheritedTaxes) {
                                let inheritedTaxes = flattenDeep(activeAccountTaxHierarchy.inheritedTaxes.map(p => p.applicableTaxes)).map((j: any) => j?.uniqueName);
                                let allTaxes = applicableTaxes?.filter(f => inheritedTaxes?.indexOf(f) === -1);
                                // set value in tax group form
                                this.taxGroupForm?.setValue({ taxes: allTaxes });
                            } else {
                                this.taxGroupForm?.setValue({ taxes: applicableTaxes });
                            }
                            const notInheritedTax = differenceBy(taxes.map(p => {
                                return { label: p.name, value: p?.uniqueName, additional: p };
                            }), flattenDeep(activeAccountTaxHierarchy.inheritedTaxes.map(p => p.applicableTaxes)).map((p: any) => {
                                return { label: p.name, value: p?.uniqueName, additional: p };
                            }), 'value');

                            return this.filterTaxesForDebtorCreditor(notInheritedTax);
                        } else {
                            // set value in tax group form
                            this.taxGroupForm?.setValue({ taxes: applicableTaxes });

                            const formattedTax = taxes.map(p => {
                                return { label: p.name, value: p?.uniqueName, additional: p };
                            });
                            return this.filterTaxesForDebtorCreditor(formattedTax);
                        }
                    }
                }
                return arr;
            })), takeUntil(this.destroyed$)).subscribe((taxResponse: IOption[]) => {
                this.companyTaxDropDown = taxResponse;
                if (this.companyTaxDropDown.length) {
                    const selectedTaxes = this.taxGroupForm?.get("taxes")?.value || [];
                    this.defaultTaxLabel = selectedTaxes.map(selectTax => {
                        return this.companyTaxDropDown.find(tax => tax.value === selectTax)?.label;
                    });
                } else {
                    this.defaultTaxLabel = [];
                }
            });
    }

    public getDiscountList() {
        this.settingsDiscountService.GetDiscounts().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length > 0) {
                this.discountList = [];
                Object.keys(response?.body).forEach(key => {
                    this.discountList.push({
                        label: response?.body[key]?.name,
                        value: response?.body[key]?.uniqueName,
                        isSelected: false
                    });
                });
            }
        });
    }

    public onViewReady(ev) {
        let accountCountry = this.addAccountForm.get('country').get('countryCode')?.value;
        this.selectedCountryCode = accountCountry;
        if (accountCountry) {
            if (accountCountry !== 'IN') {
                this.isIndia = false;
            } else {
                this.isIndia = true;
            }
            this.toggleStateRequired();
        }
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        if (addresses?.controls?.length === 0) {
            this.addBlankGstForm();
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Evaluates the parent groups of an account to determine its classification
     *
     * @memberof AccountUpdateNewDetailsComponent
     */
    public determineParentGroupTypes(): void {
        this.isParentBankAccounts = this.checkParentGroup(this.parentGroups, this.accountingGroupEnum.BankAccounts) || this.activeGroupUniqueName === this.accountingGroupEnum.BankAccounts;
        this.isParentSundryCreditors = this.checkParentGroup(this.parentGroups, this.accountingGroupEnum.SundryCreditors) || this.activeGroupUniqueName === this.accountingGroupEnum.SundryCreditors;
        this.isParentSundryDebtors = this.checkParentGroup(this.parentGroups, this.accountingGroupEnum.SundryDebtors) || this.activeGroupUniqueName === this.accountingGroupEnum.SundryDebtors;
        this.isDebtorCreditor = this.isParentSundryCreditors || this.isParentSundryDebtors;
    }

    /**
     * Handles tab change
     *
     * @param {any} event 
     * @memberof AccountUpdateNewDetailsComponent
     */
    public tabChanged(event: MatTabChangeEvent): void {
        if (event) {
            this.selectedTabLabel = event.tab.textLabel;
            this.selectedTabIndex = event.index;
            this.isCustomSelectedTab = event.tab.textLabel === this.localeData?.tabs?.custom;
            if (event.tab.textLabel === this.localeData?.tabs?.others) {
                this.isOtherSelectedTab = true;
            } else {
                this.isOtherSelectedTab = false;
            }
            
            // Mark this tab as activated
            this.activatedTabs.add(event.tab.textLabel);
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Open confirm leave dialog
     *
     * @memberof AccountUpdateNewDetailsComponent
     */
    public openConfirmLeaveDialog(): void {
        this.store.dispatch(this.accountsAction.hasUnsavedChanges(this.addAccountForm.dirty));
    }

    public initializeNewForm() {
        this.addAccountForm = this._fb.group({
            activeGroupUniqueName: [''],
            name: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
            uniqueName: [''],
            openingBalanceType: ['CREDIT'],
            foreignOpeningBalance: [''],
            openingBalance: [''],
            mobileNo: [''],
            mobileCode: [''],
            email: ['', Validators.pattern(EMAIL_VALIDATION_REGEX)],
            companyName: [''],
            attentionTo: [''],
            description: [''],
            duePeriod: [''],
            addresses: this._fb.array([]),
            country: this._fb.group({
                countryCode: ['']
            }),
            hsnOrSac: [''],
            currency: [''],
            hsnNumber: [''],
            sacNumber: [''],
            accountBankDetails: this._fb.array([
                this._fb.group({
                    bankName: [''],
                    bankAccountNo: ['', Validators.compose([Validators.maxLength(34)])],
                    ifsc: [''],
                    beneficiaryName: [''],
                    branchName: [''],
                    swiftCode: ['', Validators.compose([Validators.maxLength(11)])]
                })
            ]),

            cashFreeVirtualAccountData: this._fb.group({
                ifscCode: [''],
                name: [''],
                virtualAccountNumber: ['']
            }),
            closingBalanceTriggerAmount: ["", Validators.compose([digitsOnly])],
            closingBalanceTriggerAmountType: ['CREDIT'],
            customFields: this._fb.array([]),
            portalDomain: this._fb.array([
                this._fb.group({
                    name: [''],
                    email: ['', Validators.pattern(EMAIL_VALIDATION_REGEX)],
                    contactNo: [''],
                    default: [false],
                    uniqueName: ['']
                })
            ]),
            accountOpeningBalance: this._fb.array([
                this._fb.group({
                    branch: [''],
                    openingBalance: [''],
                    openingBalanceType: ['']
                }),
            ]),
            archive: [''],
            salesPersonName: [''],
            salesPersonUniqueName: ['']
        });

        this.getInvoiceSettings();
    }

    /**
     * Initializes the GST details form with default values and validators.
     * 
     * @returns FormGroup
     * @memberof AccountUpdateNewDetailsComponent
     */
    public initialGstDetailsForm(val: IAccountAddress = null): FormGroup {
        this.isStateRequired = this.checkActiveGroupCountry();

        let gstFields = this._fb.group({
            gstNumber: ['', Validators.compose([Validators.maxLength(15)])],
            address: [''],
            state: this._fb.group({
                code: [''],
                name: [''],
                stateGstCode: ['']
            }),
            stateCode: [{ value: '', disabled: false }, (this.isStateRequired && !this.countyList?.length) ? Validators.required : ""],
            county: this._fb.group({
                code: [''],
                name: ['']
            }),
            countyCode: [{ value: '', disabled: false }, (this.isStateRequired && this.countyList?.length) ? Validators.required : ""],
            isDefault: [false],
            isComposite: [false],
            partyType: ['NOT APPLICABLE'],
            pincode: ['']
        });

        if (val) {
            val.stateCode = val.state ? (val.state.code ? val.state.code : val.stateCode) : val.stateCode;
            val.countyCode = val.county ? val.county.code : "";
            gstFields?.patchValue(val);
        }
        return gstFields;
    }

    public resetGstStateForm() {
        this.forceClear$ = observableOf({ status: true });

        let addresses = this.addAccountForm.get('addresses') as FormArray;
        for (let control of addresses.controls) {
            control.get('stateCode')?.patchValue(null);
            control.get('countyCode')?.patchValue(null);
            control.get('state').get('code')?.patchValue(null);
            control.get('state').get('name')?.patchValue(null);
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
            control.get('ifsc')?.patchValue("");
        }
    }


    /**
     * This will be use for add new portal user
     *
     * @param {*} [user]
     * @memberof AccountUpdateNewDetailsComponent
     */
    public addNewPortalUser(user?: any): void {
        const mobileStartWithPlus = user?.contactNo?.startsWith('+');
        let mobileNo = '';
        if (user?.contactNo && mobileStartWithPlus) {
            mobileNo = user?.contactNo ?? '';
        } else {
            mobileNo = user?.contactNo ? `+${user?.contactNo}` : '';
        }
        let mappings = this.addAccountForm.get('portalDomain') as FormArray;
        let mappingForm = this._fb.group({
            name: [''],
            email: ['', Validators.pattern(EMAIL_VALIDATION_REGEX)],
            uniqueName: [''],
            contactNo: [''],
            default: [false]
        });
        mappings.push(mappingForm);
        if (user) {
            mappings.controls.forEach(control => {
                if (!control?.get('name').value && !control?.get('email').value && !control?.get('contactNo').value) {
                    control?.get('name')?.patchValue(user.name ?? '');
                    control?.get('email')?.patchValue(user.email ?? '');
                    control?.get('contactNo')?.patchValue(mobileNo ?? '');
                    control?.get('default')?.patchValue(user.default ?? false);
                    control?.get('uniqueName')?.patchValue(user.uniqueName ?? '');
                }
            });
        }
        const lastIndex = mappings.controls.length - 1;
        // Removed interval and fallback timeout
    }

    /**
     * This will be use for remove portal users
     *
     * @param {FormGroup} portal
     * @param {number} index
     * @memberof AccountUpdateNewDetailsComponent
     */
    public removePortalUser(portal: FormGroup, index: number): void {
        if (portal) {
            let mappings = this.addAccountForm.get('portalDomain') as FormArray;
            mappings.removeAt(index);
            let data = [{
                name: portal.value.name,
                email: portal.value.email,
                uniqueName: portal.value.uniqueName,
                contactNo: portal.value.contactNo,
                default: portal.value.default,
                operationType: 'DELETE'
            }];
            if (this.accountDetails) {
                this.activeAccountName = this.accountDetails.uniqueName;
            } else {
                this.activeAccount$.pipe(take(1)).subscribe(activeAccountState => this.activeAccountName = activeAccountState?.uniqueName);
            }
            if (portal.value?.uniqueName) {
                this._accountService.createPortalUser(data, this.activeAccountName).pipe(take(1)).subscribe(data => {
                    if (data?.status === 'success') {
                        this._toaster.successToast(this.localeData?.portal_deleted_successfully, 'Success');
                    } else {
                        this._toaster.errorToast(data.message, data.code);
                    }
                });
            }
        }
    }

    public addGstDetailsForm(value: string) {         // commented code because we no need GSTIN No. to add new address
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        addresses.push(this.initialGstDetailsForm(null));
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
            addresses.push(this.initialGstDetailsForm(null));
        }
    }

    public renderGstDetails(addressObj: IAccountAddress = null, addressLength: any) {
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        if (addresses?.length < addressLength) {
            addresses.push(this.initialGstDetailsForm(addressObj));
        }
    }

    public isDefaultAddressSelected(val: boolean, i: number) {
        if (val) {
            let addresses = this.addAccountForm.get('addresses') as FormArray;
            for (let control of addresses.controls) {
                control.get('isDefault')?.patchValue(false);
            }
            addresses.controls[i].get('isDefault')?.patchValue(true);
        }
    }

    /**
     * Validates and extracts the state code from the GST number entered in the given form.
     * 
     * @param gstForm The `FormGroup` containing the GST-related form controls.
     * @memberof AccountUpdateNewDetailsComponent
     */
    public getStateCode(gstForm: FormGroup): void {
        let gstVal: string = gstForm.get('gstNumber')?.value;
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
    }

    public showMoreGst() {
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        this.gstDetailsLength = addresses?.controls?.length;
        this.moreGstDetailsVisible = true;
    }

    public openingBalanceTypeChanged(type: string) {
        if (Number(this.addAccountForm.get('openingBalance')?.value) > 0 || Number(this.addAccountForm.get('foreignOpeningBalance')?.value) > 0) {
            this.addAccountForm.get('openingBalanceType')?.patchValue(type);
        }
    }

    public showLessGst() {
        this.gstDetailsLength = 3;
        this.moreGstDetailsVisible = false;
    }

    public resetUpdateAccountForm() {
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        const countries = this.addAccountForm.get('country') as FormGroup;
        addresses.reset();
        countries.reset();
        this.addAccountForm.reset();
        this.addBlankGstForm();
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
            accountRequest.accountOpeningBalance = this.isBulkDataUpdated ? this.tempSaveBulkData : !this.tempSaveBulkData?.length ? this.accountOpeningBalance : this.mergeOpeningBalanceData(accountOpeningBalanceValue);
            accountRequest.accountOpeningBalance = accountRequest.accountOpeningBalance?.filter((res: any) => res?.branch?.uniqueName);
        }
        if (this.stateList && accountRequest.addresses && accountRequest.addresses.length > 0 && !this.isHsnSacEnabledAcc) {
            let selectedStateObj = this.getStateGSTCode(this.stateList, accountRequest.addresses[0].stateCode);
            if (selectedStateObj) {
                accountRequest.addresses[0].stateCode = selectedStateObj.stateGstCode;
            }
        }
        if (this.accountDetails) {
            this.activeAccountName = this.accountDetails.uniqueName;
        } else {
            this.activeAccount$.pipe(take(1)).subscribe(activeAccountState => this.activeAccountName = activeAccountState?.uniqueName);
        }
        if (this.isHsnSacEnabledAcc) {
            delete accountRequest['addresses'];
        } else {
            delete accountRequest['hsnOrSac'];
            delete accountRequest['hsnNumber'];
            delete accountRequest['sacNumber'];

            accountRequest.addresses = accountRequest.addresses.map(f => {
                if (!f.partyType || f.partyType === '') {
                    f.partyType = 'NOT APPLICABLE';
                }
                return f;
            });
            if (accountRequest.mobileCode && accountRequest.mobileNo) {
                accountRequest.mobileNo = accountRequest.mobileNo;
            }
        }

        if (!this.showVirtualAccount) {
            delete accountRequest['cashFreeVirtualAccountData'];
        }

        if (this.activeGroupUniqueName === 'discount') {
            delete accountRequest['addresses'];
        }

        if (!this.showVirtualAccount) {
            delete accountRequest['cashFreeVirtualAccountData'];
        }
        if (!this.showBankDetail) {
            delete accountRequest['accountBankDetails'];
        }

        if (!accountRequest.currency) {
            this.selectedCurrency = this.companyCurrency;
            this.addAccountForm.get('currency')?.patchValue(this.selectedCurrency, { onlySelf: true });
            accountRequest.currency = this.selectedCurrency;
        }
        accountRequest['hsnNumber'] = (accountRequest["hsnOrSac"] === "hsn") ? accountRequest['hsnNumber'] : "";
        accountRequest['sacNumber'] = (accountRequest["hsnOrSac"] === "sac") ? accountRequest['sacNumber'] : "";

        if (accountRequest.addresses && accountRequest.addresses.length > 0) {
            accountRequest.addresses.forEach(address => {
                if (this.countyList?.length) {
                    delete address['state'];
                    delete address['stateCode'];
                } else {
                    delete address['county'];
                    delete address['countyCode'];
                }
            });
        }
        delete accountRequest['portalDomain'];
        delete accountRequest['mobileCode'];
        delete accountRequest['salesPersonName'];
        this.store.dispatch(this.accountsAction.hasUnsavedChanges(false));
        this.submitClicked.emit({
            value: { groupUniqueName: this.activeGroupUniqueName, accountUniqueName: this.activeAccountName },
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
     * This will check the account opening balance data and merge it with both previous and updated data."
     *
     * @param {*} accountOpeningBalanceValue
     * @return {*}
     * @memberof AccountUpdateNewDetailsComponent
     */
    public mergeOpeningBalanceData(accountOpeningBalanceValue: any): any {
        const updatedOpeningBalance = [...this.accountOpeningBalance];

        accountOpeningBalanceValue?.forEach(updatedItem => {
            const existingIndex = updatedOpeningBalance.findIndex(item => item.branch.uniqueName === updatedItem.branch.uniqueName);

            if (existingIndex > -1) {
                updatedOpeningBalance[existingIndex] = { ...updatedOpeningBalance[existingIndex], ...updatedItem };
            } else {
                updatedOpeningBalance.push(updatedItem);
            }
        });

        if (!accountOpeningBalanceValue.length) {
            return this.accountOpeningBalance;
        }
        return updatedOpeningBalance;
    }

    /**
     * ngOnChanges
     */
    public ngOnChanges(s) {
        if (s && s['showVirtualAccount'] && s['showVirtualAccount'].currentValue) {
            this.showOtherDetails = true;
        }
    }

    public ngOnDestroy() {
        this.resetUpdateAccountForm();
        this.store.dispatch(this.accountsAction.resetActiveAccount());
        this.store.dispatch(this.accountsAction.hasUnsavedChanges(false));
        this.salesPersonCreated = false;
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public selectCountry(event: IOption) {
        if (event) {
            this.accountCountryName = event.label;
            this.addAccountForm.get('accountBankDetails').reset();
            this.store.dispatch(this._generalActions.resetStatesList());
            this.store.dispatch(this.commonActions.resetOnboardingForm());
            let phoneCode = event.additional;
            this.addAccountForm.get('mobileCode')?.setValue(phoneCode);
            let currencyCode = this.countryCurrency[event.value];
            this.addAccountForm.get('currency')?.setValue(currencyCode);
            this.getStates(event.value);
            this.getOnboardingForm(event.value);
            this.toggleStateRequired();
            this.resetGstStateForm();
            this.resetBankDetailsForm();
        }
    }

    /**
     * Handles the selection of a state from a dropdown or similar UI component.
     * 
     * @param gstForm The `FormGroup` containing GST-related form controls.
     * @param event The event object containing the selected state's label and value.
     * @memberof AccountUpdateNewDetailsComponent
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
     * @memberof AccountUpdateNewDetailsComponent
     */
    public selectedCounty(gstForm: FormGroup, event) {
        if (gstForm && event?.label) {
            gstForm.get('countyCode')?.patchValue(event?.value);
            gstForm.get('county').get('code')?.patchValue(event?.value);
            gstForm.get('county').get('name')?.patchValue(event?.label);
        }
    }

    public selectGroup(event: IOption) {
        if (event) {
            this.activeGroupUniqueName = event.value;
            this.isParentDebtorCreditor();
            this.isGroupSelected.emit(event);
        }
    }

    /**
     * Determines and sets the internal flags related to the account group type.
     *
     * @memberof AccountUpdateNewDetailsComponent
     */
    public isParentDebtorCreditor(): void {
        this.determineParentGroupTypes();
        this.toggleStateRequired();
        if (this.isParentSundryDebtors || this.isParentSundryCreditors) {
            this.showBankDetail = this.contactPreview ? this.showBankDetailPreview : this.isParentSundryCreditors
            this.isDebtorCreditor = true;
        } else if (this.isParentBankAccounts) {
            this.isBankAccount = true;
            this.isDebtorCreditor = false;
            this.showBankDetail = false;
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
                    this.countrySource.push({ value: res[key].alpha2CountryCode, label: res[key].alpha2CountryCode + ' - ' + res[key].countryName, additional: res[key].callingCode });
                    // Creating Country Currency List
                    if (res[key]?.currency !== undefined && res[key].currency !== null) {
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
        this.selectedCountryCode = countryCode;
        this.store.dispatch(this.commonActions.GetOnboardingForm(onboardingFormRequest));
    }

    public getCurrency() {
        this.store.pipe(select(s => s.session.currencies), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res).forEach(key => {
                    this.currencies.push({ label: res[key].code, value: res[key].code });

                });
                this.currencySource$ = observableOf(this.currencies);
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
            }
        } else {
            ele?.classList?.remove('error-box');
            this.isGstValid = true;
        }
    }

    public getStates(countryCode, selectedAcountCurrency?: string) {
        this.store.dispatch(this._generalActions.resetStatesList());
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
        this.store.pipe(select(s => s.general.states), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.country) {
                    if (res.country.currency) {
                        this.selectedCountryCurrency = res.country.currency.code;
                        this.selectedAccountCallingCode = res.country.callingCode;
                        if (selectedAcountCurrency) {
                            this.addAccountForm.get('currency')?.patchValue(selectedAcountCurrency);
                            this.selectedCurrency = selectedAcountCurrency;
                        } else {
                            this.addAccountForm.get('currency')?.patchValue(this.selectedCountryCurrency);
                            this.selectedCurrency = this.selectedCountryCurrency;
                        }
                        if (!this.addAccountForm.get('mobileCode')?.value && this.selectedAccountCallingCode) {
                            this.addAccountForm.get('mobileCode')?.patchValue(this.selectedAccountCallingCode);
                        }
                    }
                }
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
                        this.states.push({ label: res.stateList[key].code + ' - ' + res.stateList[key].name, value: res.stateList[key].code });
                    });
                    this.statesSource$ = observableOf(this.states);
                }

                if (res.countyList) {
                    this.countyList = res.countyList?.map(county => {
                        return { label: county.name, value: county.code };
                    });
                }

                this.toggleStateRequired();
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
     * @memberof AccountUpdateNewDetailsComponent
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
                this.partyTypeSource.forEach(item => {
                    item.value = item.label;
                });
            } else {
                this.store.dispatch(this.commonActions.GetPartyType());
            }
        });
    }
    public moveAccount() {
        let activeAcc;
        this.activeAccount$.pipe(take(1)).subscribe(p => activeAcc = p);
        let grpObject = new AccountMoveRequest();
        grpObject.uniqueName = this.moveAccountForm.controls['moveto']?.value;

        this.store.dispatch(this.accountsAction.moveAccount(grpObject, activeAcc?.uniqueName, this.activeGroupUniqueName));
        this.moveAccountForm.reset();
    }

    /**
     * This will use for merger accounts
     *
     * @return {*}
     * @memberof AccountUpdateNewDetailsComponent
     */
    public mergeAccounts() {
        let activeAccount: AccountResponseV2 = null;
        this.activeAccount$.pipe(take(1)).subscribe(p => activeAccount = p);
        let finalData: AccountMergeRequest[] = [];
        if (this.selectedaccountForMerge) {
            let obj = new AccountMergeRequest();
            obj.uniqueName = this.selectedaccountForMerge;
            finalData.push(obj);
            this.store.dispatch(this.accountsAction.mergeAccount(activeAccount?.uniqueName, finalData));
            this.showDeleteMove = false;
        } else {
            this._toaster.errorToast(this.localeData?.merge_account_error);
            return;
        }
    }
    public customMoveGroupFilter(term: string, item: IOption): boolean {
        return (item?.label?.toLocaleLowerCase()?.indexOf(term) > -1 || item?.value?.toLocaleLowerCase()?.indexOf(term) > -1);
    }
    public setAccountForMoveFunc(v: string) {
        this.setAccountForMove = v;
        this.showDeleteMove = true;
    }

    public showDeleteMergedAccountModal(merge: string) {
        merge = merge?.trim();
        this.deleteMergedAccountModalBody = this.localeData?.delete_merged_account_content;
        this.deleteMergedAccountModalBody = this.deleteMergedAccountModalBody?.replace("[MERGE]", merge);
        this.selectedAccountForDelete = merge;
        this.openDeleteMergedAccountDialog();
    }

    /**
     * Delete merge account dialog open
     *
     * @returns {void}
     * @memberof AccountUpdateNewDetailsComponent
     */
    public openDeleteMergedAccountDialog(): void {
        const configuration = this.generalService.getVoucherDeleteConfiguration(this.localeData?.delete_merged_account_title, this.deleteMergedAccountModalBody, '', this.commonLocaleData);
        const confirnationDialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-md'],
            data: {
                configuration: configuration
            },
            disableClose: true
        });
        confirnationDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteMergedAccount();
            }
        });
    }

    public deleteMergedAccount() {
        let activeAccount: AccountResponseV2 = null;
        this.activeAccount$.pipe(take(1)).subscribe(p => activeAccount = p);
        let obj = new AccountUnMergeRequest();
        obj.uniqueNames = [this.selectedAccountForDelete];
        this.store.dispatch(this.accountsAction.unmergeAccount(activeAccount?.uniqueName, obj));
        this.showDeleteMove = false;
    }
    public loadAccountData() {
        this.activeAccount$.pipe(take(1)).subscribe(p => {
            if (!this.showBankDetail) {
                if (p && p.parentGroups) {
                    p.parentGroups.forEach(grp => {
                        this.showBankDetail = grp?.uniqueName === "sundrycreditors" ? true : false;
                        return;
                    });
                }
            }
        });
        this.loadDefaultAccountsSuggestions();
    }

    public taxHierarchy() {
        let activeAccount: AccountResponseV2 = null;
        let activeGroup: GroupResponse = null;
        this.store.pipe(take(1)).subscribe(s => {
            if (s.groupwithaccounts) {
                activeAccount = s.groupwithaccounts.activeAccount;
                activeGroup = s.groupwithaccounts.activeGroup;
            }
        });
        if (activeAccount) {
            this.store.dispatch(this.companyActions.getTax());
            this.store.dispatch(this.accountsAction.getTaxHierarchy(activeAccount?.uniqueName));
        } else {
            this.store.dispatch(this.companyActions.getTax());
            if (activeGroup) {
                this.store.dispatch(this.groupWithAccountsAction.getTaxHierarchy(activeGroup.uniqueName));
            }
        }

    }

    public applyTax() {
        let activeAccount: AccountResponseV2 = null;
        let activeGroup: GroupResponse = null;
        this.store.pipe(take(1)).subscribe(s => {
            if (s.groupwithaccounts) {
                activeAccount = s.groupwithaccounts.activeAccount;
                activeGroup = s.groupwithaccounts.activeGroup;
            }
        });
        if (activeAccount) {
            let data: ApplyTaxRequest = new ApplyTaxRequest();
            data.isAccount = true;
            data.taxes = [];
            this.activeAccountTaxHierarchy$.pipe(take(1)).subscribe((t) => {
                if (t) {
                    t.inheritedTaxes.forEach(tt => {
                        tt.applicableTaxes.forEach(ttt => {
                            data.taxes.push(ttt?.uniqueName);
                        });
                    });
                }
            });

            data.taxes.push.apply(data.taxes, this.taxGroupForm.value.taxes);
            data.uniqueName = activeAccount?.uniqueName;
            this.store.dispatch(this.accountsAction.applyAccountTax(data));
        }
    }

    public showMoveMergedAccountModal() {
        this.moveMergedAccountModalBody = this.localeData?.move_merged_account_content;
        this.moveMergedAccountModalBody = this.moveMergedAccountModalBody?.replace("[SOURCE_ACCOUNT]", this.setAccountForMove);
        this.moveMergedAccountModalBody = this.moveMergedAccountModalBody?.replace("[DESTINATION_ACCOUNT]", this.selectedAccountForMove);
    }

    public moveMergeAccountTo() {
        let activeAccount: AccountResponseV2 = null;
        this.activeAccount$.pipe(take(1)).subscribe(p => activeAccount = p);
        let obj = new AccountUnMergeRequest();
        obj.uniqueNames = [this.setAccountForMove];
        obj.moveTo = this.selectedAccountForMove;
        this.store.dispatch(this.accountsAction.unmergeAccount(activeAccount?.uniqueName, obj));
        this.showDeleteMove = false;
    }

    public getAccount() {
        this.loadDefaultGroupsSuggestions();
    }

    private getStateGSTCode(stateList, code: string) {
        return stateList.find(res => code === res.code);
    }

    /**
     * This function is used to check if company country is India and Group is sundrydebtors or sundrycreditors
     *
     * @returns {void}
     * @memberof AccountUpdateNewDetailsComponent
     */
    public checkActiveGroupCountry(): boolean {
        if (this.activeCompany && this.activeCompany.countryV2 && this.activeCompany.countryV2.alpha2CountryCode === this.addAccountForm.get('country').get('countryCode')?.value && (this.activeGroupUniqueName === 'sundrycreditors' || this.isParentSundryCreditors || this.activeGroupUniqueName === 'sundrydebtors' || this.isParentSundryDebtors)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * This functions is used to add/remove required validation to state field
     *
     * @returns {void}
     * @memberof AccountUpdateNewDetailsComponent
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
            control.get('stateCode').updateValueAndValidity();
            control.get('countyCode').updateValueAndValidity();
            i++;
        }
        this.addAccountForm.controls['addresses'].updateValueAndValidity();
    }

    /**
   * To make value alphanumeric
   *
   * @param {*} type To check Type of bank details field
   * @param {*} element element reference
   * @memberof AccountUpdateNewDetailsComponent
   */
    public bankDetailsValidator(element, type: string): void {
        if (element?.value && type) {
            let trim: string = '';
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
      * @memberof AccountUpdateNewDetailsComponent
      */
    public showBankDetailsValidation(element: any, type: any): void {
        if (type === 'bankAccountNo') {
            if (this.selectedCountryCode === 'IN') {
                if (element && element.value && element.value.length < 9) {
                    this._toaster.errorToast(this.commonLocaleData?.app_invalid_bank_account_number);
                    element?.classList?.add('error-box');
                } else {
                    element?.classList?.remove('error-box');
                }
            } else {
                if (element && element.value && element.value.length < 23) {
                    this._toaster.errorToast(this.commonLocaleData?.app_invalid_iban);
                    element?.classList?.add('error-box');
                } else {
                    element?.classList?.remove('error-box');
                }
            }
        } else if (type === 'swiftCode') {
            if (element && element.value && element.value.length < 8) {
                this._toaster.errorToast(this.commonLocaleData?.app_invalid_swift_code);
                element?.classList?.add('error-box');
            } else {
                element?.classList?.remove('error-box');
            }
        }
    }

    /**
     * To apply discount in accounts
     *
     * @memberof AccountUpdateNewDetailsComponent
     */
    public applyDiscounts(): void {
        if (this.accountDetails) {
            this.activeAccountName = this.accountDetails.uniqueName;
        } else {
            this.activeAccount$.pipe(take(1)).subscribe(activeAccountState => this.activeAccountName = activeAccountState?.uniqueName);
        }
        if (this.activeAccountName) {
            let assignDiscountObject: ApplyDiscountRequestV2 = new ApplyDiscountRequestV2();
            assignDiscountObject.uniqueName = this.activeAccountName;
            assignDiscountObject.discounts = this.selectedDiscounts?.value ? [this.selectedDiscounts.value] : [];
            assignDiscountObject.isAccount = true;
            this.store.dispatch(this.accountsAction.applyAccountDiscountV2([assignDiscountObject]));
            this.isDiscountSaveDisable$ = observableOf(true);
        }
    }

    /**
    * API call to get custom field data
    *
    * @memberof AccountUpdateNewDetailsComponent
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
     * @memberof AccountUpdateNewDetailsComponent
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
     * @memberof AccountUpdateNewDetailsComponent
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
     * @memberof AccountUpdateNewDetailsComponent
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
     * @memberof AccountUpdateNewDetailsComponent
     */
    public createDynamicCustomFieldForm(customFieldForm: any): void {
        customFieldForm.forEach(item => {
            this.renderCustomFieldDetails(item, customFieldForm?.length);
        });
    }

    /**
     * To set boolean type custom field value
     *
     * @param {string} isChecked to check boolean custom field true or false
     * @param {number} index index number
     * @memberof AccountUpdateNewDetailsComponent
     */
    public selectedBooleanCustomField(isChecked: string, index: number): void {
        const customField = this.addAccountForm.get('customFields') as FormArray;
        customField.controls[index].get('value')?.setValue(isChecked);
    }

    /**
     * To check taxes list updated
     *
     * @param {*} event
     * @memberof AccountUpdateNewDetailsComponent
     */
    public taxesSelected(event: any): void {
        if (event) {
            this.isTaxesSaveDisable$ = observableOf(false);
            this.taxGroupForm.get('taxes').patchValue(event);
        }
    }

    /**
     * To check discount list updated
     * @param {*} event - event object containing selected discounts
     * @memberof AccountUpdateNewDetailsComponent
     */
    public discountSelected(event: any): void {
        if (event) {
            this.selectedDiscounts = {
                value: event.value,
                label: event.label
            };
        } else {
            this.selectedDiscounts = null;
        }
        this.isDiscountSaveDisable$ = observableOf(false);
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof AccountUpdateNewDetailsComponent
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
                    } else {
                        this.GSTIN_OR_TRN = '';
                    }
                    this.taxNamePlaceholder = this.commonLocaleData?.app_enter_tax_name;
                    this.taxNamePlaceholder = this.taxNamePlaceholder?.replace("[TAX_NAME]", this.formFields['taxName']?.label || '');
                }
            });
        }
    }

    /**
     * Search query change handler for group
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof AccountUpdateNewDetailsComponent
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
            this.groupService.searchGroups(requestObject).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: `${result?.name}`,
                            additional: result?.parentGroups
                        }
                    }) || [];
                    if (page === 1) {
                        this.flatGroupsOptions = searchResults;
                    } else {
                        this.flatGroupsOptions = [
                            ...this.flatGroupsOptions,
                            ...searchResults
                        ];
                    }
                    this.groupsSearchResultsPaginationData.page = data.body.page;
                    this.groupsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    }
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
        }
    }

    /**
     * This will get invoice settings
     *
     * @memberof AccountUpdateNewDetailsComponent
     */
    public getInvoiceSettings(): void {
        this.invoiceService.GetInvoiceSetting().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === "success" && response.body) {
                let invoiceSettings = cloneDeep(response.body);
                this.inventorySettings = invoiceSettings.companyInventorySettings;

                if (!this.addAccountForm.get("hsnOrSac")?.value) {
                    if (this.inventorySettings?.manageInventory) {
                        this.addAccountForm.get("hsnOrSac")?.patchValue("hsn");
                    } else {
                        this.addAccountForm.get("hsnOrSac")?.patchValue("sac");
                    }
                }
            }
        });
    }

    /**
     * Scroll end handler for group dropdown
     *
     * @returns null
     * @memberof AccountUpdateNewDetailsComponent
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
     * @memberof AccountUpdateNewDetailsComponent
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
            this.flatGroupsOptions = [...this.defaultGroupSuggestions];
        });
    }

    /**
     * Search query change handler
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof AuditLogsFormComponent
     */
    public onAccountSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.accountsSearchResultsPaginationData.query = query;
        if (!this.preventDefaultScrollApiCall &&
            (query || (this.defaultAccountSuggestions && this.defaultAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page
            }
            this.searchService.searchAccountV2(requestObject).subscribe(data => {
                if (data && data.body && data.body.results) {
                    let activeAccountUniqueName: string;
                    this.activeAccount$.pipe(take(1)).subscribe(account => activeAccountUniqueName = account?.uniqueName);
                    data.body.results = data.body.results.filter(account => account?.uniqueName !== activeAccountUniqueName);
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: `${result.name} (${result?.uniqueName})`
                        }
                    }) || [];
                    if (page === 1) {
                        this.accounts = searchResults;
                    } else {
                        this.accounts = [
                            ...this.accounts,
                            ...searchResults
                        ];
                    }
                    this.accountsSearchResultsPaginationData.page = data.body.page;
                    this.accountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    }
                }
            });
        } else {
            this.accounts = [...this.defaultAccountSuggestions];
            this.accountsSearchResultsPaginationData.page = this.defaultAccountPaginationData.page;
            this.accountsSearchResultsPaginationData.totalPages = this.defaultAccountPaginationData.totalPages;
            this.preventDefaultScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Scroll end handler
     *
     * @returns null
     * @memberof AuditLogsFormComponent
     */
    public handleScrollEnd(): void {
        if (this.accountsSearchResultsPaginationData.page < this.accountsSearchResultsPaginationData.totalPages) {
            this.onAccountSearchQueryChanged(
                this.accountsSearchResultsPaginationData.query,
                this.accountsSearchResultsPaginationData.page + 1,
                (response) => {
                    if (!this.accountsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result?.uniqueName,
                                label: `${result.name} (${result?.uniqueName})`
                            }
                        }) || [];
                        this.defaultAccountSuggestions = this.defaultAccountSuggestions.concat(...results);
                        this.defaultAccountPaginationData.page = this.accountsSearchResultsPaginationData.page;
                        this.defaultAccountPaginationData.totalPages = this.accountsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
     * Loads the default account search suggestion when module is loaded
     *
     * @private
     * @memberof AuditLogsFormComponent
     */
    private loadDefaultAccountsSuggestions(): void {
        this.onAccountSearchQueryChanged('', 1, (response) => {
            this.defaultAccountSuggestions = response.map(result => {
                return {
                    value: result?.uniqueName,
                    label: `${result.name} (${result?.uniqueName})`
                }
            }) || [];
            this.defaultAccountPaginationData.page = this.accountsSearchResultsPaginationData.page;
            this.defaultAccountPaginationData.totalPages = this.accountsSearchResultsPaginationData.totalPages;
            this.accounts = [...this.defaultAccountSuggestions];
        });
    }

    /**
     * Filters taxes for Sundry debtors and creditors
     *
     * @private
     * @param {Array<any>} [taxes] Company taxes
     * @return {Array<any>} Filtered taxes
     * @memberof AccountUpdateNewDetailsComponent
     */
    private filterTaxesForDebtorCreditor(taxes?: Array<any>): Array<any> {
        if (this.isParentSundryDebtors) {
            // Only allow TDS receivable and TCS payable
            return taxes?.filter(tax => ['tdsrc', 'tcspay']?.indexOf(tax?.additional?.taxType) > -1);
        } else if (this.isParentSundryCreditors) {
            // Only allow TDS payable and TCS receivable
            return taxes?.filter(tax => ['tdspay', 'tcsrc']?.indexOf(tax?.additional?.taxType) > -1);
        } else {
            // Only normal (non-other) taxes
            return taxes?.filter(tax => TCS_TDS_TAXES_TYPES?.indexOf(tax?.additional?.taxType) === -1);
        }
    }

    /**
     * Checks whether a given unique group name exists within the list of parent groups.
     * 
     * @param parentGroups - Array of parent group objects, each having a `uniqueName` field.
     * @param uniqueName - The unique name to search for in the parent groups.
     * @returns `true` if any parent group matches the given unique name, otherwise `false`.
     * @memberof AccountUpdateNewDetailsComponent
     */
    public checkParentGroup(parentGroups: any[], uniqueName: string): boolean {
        return parentGroups.some(parent => parent.uniqueName === uniqueName);
    }

    /**
     * This will show/hide address tab depending on parent group
     *
     * @private
     * @memberof AccountUpdateNewDetailsComponent
     */
    private showHideAddressTab(): void {
        if (!this.isHsnSacEnabledAcc) {
            const accountAddress = this.addAccountForm.get('addresses') as FormArray;
            if (accountAddress.controls?.length === 0 || !accountAddress?.length) {
                this.addBlankGstForm();
            }
        } else {
            this.addAccountForm.get('addresses').reset();
        }
        this.selectedTabIndex = null;
        this.changeDetectorRef.detectChanges();
        setTimeout(() => {
            this.selectedTabIndex = 0;
            this.changeDetectorRef.detectChanges();
        }, 0);
    }

    /**
     * This will initialize the account details and custom fields
     *
     * @private
     * @memberof AccountUpdateNewDetailsComponent
     */
    private initAccountCustomFields(): void {
        // fill form with active account
        combineLatest([this.activeAccount$, this.customFieldsService.list(this.customFieldsRequest)]).pipe(takeUntil(this.destroyed$)).subscribe(results => {
            if (results && results[0] && results[1]) {
                this.companyCustomFields = [];
                this.addAccountForm.setControl('customFields', this._fb.array([]));
                let acc = results[0];
                this.resetBankDetailsForm();
                if (acc && acc.parentGroups[0]?.uniqueName) {
                    this.accountOpeningBalance = acc.accountOpeningBalance;
                    const HSN_SAC_PARENT_GROUPS = [this.accountingGroupEnum.RevenueFromOperations, this.accountingGroupEnum.OtherIncome, this.accountingGroupEnum.OperatingCost, this.accountingGroupEnum.IndirectExpenses];
                    this.isHsnSacEnabledAcc = HSN_SAC_PARENT_GROUPS.some(group =>
                        this.checkParentGroup(acc.parentGroups, group)
                    );
                    this.isGstEnabledAcc = !this.isHsnSacEnabledAcc;
                    this.parentGroups = acc.parentGroups;
                    this.determineParentGroupTypes();
                    this.activeAccountGroup = acc.parentGroups?.length > 0 ? [{
                        label: acc.parentGroups[acc.parentGroups?.length - 1]?.name,
                        value: acc.parentGroups[acc.parentGroups?.length - 1]?.uniqueName,
                        additional: acc.parentGroups[acc.parentGroups?.length - 1],
                    }] : this.flatGroupsOptions;
                    this.activeGroupUniqueName = acc.parentGroups?.length > 0 ? acc.parentGroups[acc.parentGroups?.length - 1]?.uniqueName : '';
                    this.store.dispatch(this.groupWithAccountsAction.SetActiveGroup(this.activeGroupUniqueName));
                    timer(1)
                        .pipe(debounceTime(50))
                        .subscribe(_ => {
                            if (results[0]?.mobileNo) {
                                this.addAccountForm.get('mobileNo')?.setValue(results[0].mobileNo);
                            }
                        });
                    this.store.pipe(select(appStore => appStore.groupwithaccounts.activeGroupUniqueName), take(1)).subscribe(response => {
                        if (response) {
                            this.addAccountForm.get('activeGroupUniqueName')?.setValue(response);
                        }
                        if (response !== this.activeGroupUniqueName) {
                            this.store.dispatch(this.groupWithAccountsAction.getGroupDetails(this.activeGroupUniqueName));
                        }
                    });

                    this.showHideAddressTab();
                }

                let accountDetails: AccountRequestV2 = acc as AccountRequestV2;
                if (accountDetails?.uniqueName) {
                    this.accountInheritedDiscounts = [];
                    if (accountDetails && accountDetails.inheritedDiscounts) {
                        accountDetails.inheritedDiscounts.forEach(item => {
                            this.accountInheritedDiscounts.push(...item.applicableDiscounts);
                        });
                    }
                    this._accountService.GetApplyDiscount(accountDetails?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                        this.selectedDiscounts = null;
                        this.forceClearDiscount$ = observableOf({ status: true });
                        if (response?.status === 'success') {
                            if (response.body) {
                                if (response.body[accountDetails?.uniqueName]) {
                                    let list = response.body[accountDetails?.uniqueName];
                                    Object.keys(list)?.forEach(key => {
                                        this.selectedDiscounts = {
                                            value: list[key]['discount']['uniqueName'],
                                            label: list[key]['discount']['name']
                                        };
                                    });
                                }
                            }
                        }
                    });
                    this._accountService
                        .getPortalUsers(accountDetails?.uniqueName)
                        .pipe(takeUntil(this.destroyed$))
                        .subscribe((response) => {
                            if (response?.body?.length && response?.status === 'success') {
                                this.isPortalDefault = false;
                                let mappings = this.addAccountForm.get('portalDomain') as FormArray;
                                mappings.clear();
                                response.body?.forEach((item) => {
                                    if (item && (item.name || item.email) && item.default) {
                                        this.isPortalDefault = true;
                                    }
                                    this.addNewPortalUser(item);
                                });
                            } else {
                                const mappings = this.addAccountForm.get('portalDomain') as FormArray;
                                mappings.clear();
                                this.addNewPortalUser();
                            }
                        });
                }

                accountDetails.addresses.forEach(address => {
                    address.state = address.state ? address.state : { code: '', stateGstCode: '', name: '' };
                    address.stateCodeName = address.state.code + " - " + address.state.name;

                    address.county = address.county ? address.county : { code: '', name: '' };
                });

                for (let i = 0; i <= 10; i++) {
                    this.removeGstDetailsForm(0);
                }
                if (!accountDetails.customFields) {
                    accountDetails.customFields = [];
                }

                this.addAccountForm?.patchValue(accountDetails);
                if (accountDetails.salesPerson) {
                    this.addAccountForm.get('salesPersonName')?.patchValue(accountDetails.salesPerson.name);
                    this.addAccountForm.get('salesPersonUniqueName')?.patchValue(accountDetails.salesPerson.uniqueName);
                }
                if (accountDetails.currency) {
                    this.selectedCurrency = accountDetails.currency;
                    this.addAccountForm.get('currency')?.patchValue(this.selectedCurrency);
                } else {
                    this.selectedCurrency = this.companyCurrency;
                    this.addAccountForm.get('currency')?.patchValue(this.selectedCurrency);
                }
                if (accountDetails.country) {
                    this.accountCountryName = acc?.country?.countryCode + " - " + acc?.country?.countryName;
                    if (accountDetails.country.countryCode) {
                        this.getStates(accountDetails.country.countryCode, accountDetails.currency);
                        this.getOnboardingForm(accountDetails.country.countryCode);
                    }
                }
                // render gst details if there's no details add one automatically
                if (accountDetails?.addresses?.length > 0) {
                    accountDetails.addresses.map(a => {
                        this.renderGstDetails(a, accountDetails.addresses.length);
                    });
                } else {
                    if (accountDetails?.addresses?.length === 0) {
                        this.addBlankGstForm();
                    }
                }
                // render custom field data
                if (results[1] && results[1].status === 'success') {
                    this.companyCustomFields = results[1].body?.results;
                    this.createDynamicCustomFieldForm(this.companyCustomFields);
                } else {
                    this._toaster.errorToast(results[1].message);
                }
                if (accountDetails.customFields?.length) {
                    const customField = this.addAccountForm.get('customFields') as FormArray;
                    if (customField.controls?.length) {
                        accountDetails.customFields.forEach(item => {
                            const fieldIndex = customField.controls?.findIndex(control => control?.value?.uniqueName === item?.uniqueName);
                            customField?.at(fieldIndex).get('value').patchValue(item?.value);
                        });
                    }
                }
                // hsn/sac enable disable
                if (acc.hsnNumber) {
                    this.addAccountForm.get('hsnOrSac')?.patchValue('hsn');
                } else if (acc.sacNumber) {
                    this.addAccountForm.get('hsnOrSac')?.patchValue('sac');
                }
                this.openingBalanceTypeChanged(accountDetails.openingBalanceType);
                if (accountDetails.mobileNo) {

                    if (accountDetails.mobileNo.indexOf('-') > -1) {
                        let mobileArray = accountDetails.mobileNo.split('-');
                        this.addAccountForm.get('mobileCode')?.patchValue(mobileArray[0]);
                        this.addAccountForm.get('mobileNo')?.patchValue(mobileArray[1]);
                    } else {
                        this.addAccountForm.get('mobileNo')?.patchValue('+' + accountDetails.mobileNo);
                        this.addAccountForm.get('mobileCode')?.patchValue('+' + accountDetails.mobileCode);
                    }
                } else {
                    this.addAccountForm.get('mobileNo')?.patchValue('');
                    this.addAccountForm.get('mobileCode')?.patchValue(this.selectedAccountCallingCode);  // if mobile no null then country calling cade will assign
                }
                this.toggleStateRequired();
                setTimeout(() => {
                    this.generalService.invokeEvent.next(["accountEditing", acc]);
                }, 500);
            }

        });
    }

    /**
     * Closes Master
     *
     * @memberof AccountUpdateNewDetailsComponent
     */
    public closeMaster(): void {
        this.closeAccountModal.emit(true);
        this.store.dispatch(this.groupWithAccountsAction.HideAddAndManageFromOutside());
        document.querySelector('body')?.classList?.remove('master-page');
    }


    /**
    * Get company branches
    *
    * @memberof AccountUpdateNewDetailsComponent
    */
    public getCompanyBranches(): void {
        this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
    }

    /**
      * Open Bulk Add Dialog
      *
      * @memberof AccountUpdateNewDetailsComponent
      */
    public openBulkAddDialog(): void {
        this.isForeignCurrency = this.addAccountForm.get('currency')?.value !== this.companyCurrency;
        let data = {
            foreignCurrency: this.isForeignCurrency,
            saveBulkData: this.tempSaveBulkData?.length ? this.tempSaveBulkData : this.accountOpeningBalance
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
     * This will be use for get bulk opening balance data
     *
     * @private
     * @param {*} dialogData
     * @memberof AccountUpdateNewDetailsComponent
     */
    private bulkDialogData(dialogData: any): void {
        const accountData = this.addAccountForm.get('accountOpeningBalance') as FormArray;
        accountData.clear();

        let openingBalanceCredit = 0;
        let openingBalanceDebit = 0;
        let foreignOpeningBalanceCredit = 0;
        let foreignOpeningBalanceDebit = 0;

        dialogData.filter(item => item.foreignOpeningBalance > 0 || item.openingBalance > 0)
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
     * @memberof AccountUpdateNewDetailsComponent
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
     * @memberof AccountUpdateNewDetailsComponent
     */    public totalForeignOpeningBalanceDebitCredit(credit: number, debit: number): void {
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
     * Handles toggling the archive status of an account
     * 
     * @memberof AccountUpdateNewDetailsComponent
     */
    public accountArchiveUnarchive(): void {
        let accountRequest: AccountRequestV2 = new AccountRequestV2();
        if (this.accountDetails) {
            accountRequest['uniqueName'] = this.accountDetails.uniqueName;
        } else {
            this.activeAccount$.pipe(take(1)).subscribe(activeAccountState => accountRequest['uniqueName'] = activeAccountState?.uniqueName);
        }
        accountRequest['archive'] = !this.addAccountForm.get('archive')?.value;
        this.store.dispatch(this.accountsAction.hasUnsavedChanges(false));
        this.updateViaPatchApi.emit({
            value: { groupUniqueName: this.activeGroupUniqueName, accountUniqueName: accountRequest['uniqueName'] },
            accountRequest
        });
    }

    /**
    * Open sales person dialog
    *
    * @memberof AccountUpdateNewDetailsComponent
    */
    public openSalesPersonDialog(): void {
        const dialogRef = this.dialog.open(SalesPersonComponent, {
            ...ASIDE_PANE_CONFIG,
            data: { activeSalePersonUniqueName: this.addAccountForm.get('salesPersonUniqueName').value || "" }
        });
        dialogRef.afterClosed().pipe(filter(Boolean), take(1), tap((res) => { this.getSalesPersonList(); this.salesPersonCreated = true; this.activeSalePersonIsTransfer = res.isTransfer })).subscribe();
    }

    /**
     * Get sales person list as label value
     *
     * @memberof AccountUpdateNewDetailsComponent
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
     * @memberof AccountUpdateNewDetailsComponent
     */
    private isSalesPersonExists(uniqueName: string, salesPersonList: IOption[]): boolean {
        if (!uniqueName || !salesPersonList?.length) return false;
        return salesPersonList.some(salesPerson => salesPerson?.value === uniqueName);
    }

    /**
     * Checks if there are any duplicate contact number errors in portal domain
     *
     * @returns {boolean} True if duplicate contact errors exist
     * @memberof AccountUpdateNewDetailsComponent
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
     * @memberof AccountUpdateNewDetailsComponent
     */
    public goToTab(tabIndex: number): void {
        this.selectedTabIndex = tabIndex;
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Navigates to the portal tab (index 2) when duplicate contact errors exist
     *
     * @memberof AccountUpdateNewDetailsComponent
     */
    public goToPortalTab(): void {
        this.goToTab(2); // Portal tab is at index 2
    }

    /**
     * Checks if a tab has been activated at least once
     *
     * @param {string} textLabel - Label of the tab to check
     * @returns {boolean} True if tab has been activated
     * @memberof AccountUpdateNewDetailsComponent
     */
    public isTabActivated(textLabel: string): boolean {
        return this.activatedTabs.has(textLabel);
    }
}

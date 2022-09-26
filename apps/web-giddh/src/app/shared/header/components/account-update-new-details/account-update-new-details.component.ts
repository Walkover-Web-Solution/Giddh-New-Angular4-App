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
    ViewChild,
} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createSelector, select, Store } from '@ngrx/store';
import { GroupWithAccountsAction } from 'apps/web-giddh/src/app/actions/groupwithaccounts.actions';
import { ApplyTaxRequest } from 'apps/web-giddh/src/app/models/api-models/ApplyTax';
import { GroupResponse } from 'apps/web-giddh/src/app/models/api-models/Group';
import { IDiscountList } from 'apps/web-giddh/src/app/models/api-models/SettingsDiscount';
import { AccountService } from 'apps/web-giddh/src/app/services/account.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { combineLatest, Observable, of as observableOf, ReplaySubject, timer } from 'rxjs';
import { take, takeUntil, debounceTime } from 'rxjs/operators';
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
import { CompanyResponse, StateList, StatesRequest } from '../../../../models/api-models/Company';
import { IForceClear } from '../../../../models/api-models/Sales';
import { ToasterService } from '../../../../services/toaster.service';
import { AppState } from '../../../../store';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { ShSelectComponent } from '../../../../theme/ng-virtual-select/sh-select.component';
import { digitsOnly } from '../../../helpers';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js/min';
import { ApplyDiscountRequestV2 } from 'apps/web-giddh/src/app/models/api-models/ApplyDiscount';
import { GroupService } from 'apps/web-giddh/src/app/services/group.service';
import { API_COUNT_LIMIT, BootstrapToggleSwitch, EMAIL_VALIDATION_REGEX, MOBILE_NUMBER_UTIL_URL, TCS_TDS_TAXES_TYPES } from 'apps/web-giddh/src/app/app.constant';
import { InvoiceService } from 'apps/web-giddh/src/app/services/invoice.service';
import { SearchService } from 'apps/web-giddh/src/app/services/search.service';
import { INameUniqueName } from 'apps/web-giddh/src/app/models/api-models/Inventory';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { clone, cloneDeep, differenceBy, flattenDeep, uniq } from 'apps/web-giddh/src/app/lodash-optimized';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { SettingsDiscountService } from 'apps/web-giddh/src/app/services/settings.discount.service';
import { CustomFieldsService } from 'apps/web-giddh/src/app/services/custom-fields.service';
import { FieldTypes } from 'apps/web-giddh/src/app/custom-fields/custom-fields.constant';
import { HttpClient } from '@angular/common/http';
@Component({
    selector: 'account-update-new-details',
    templateUrl: './account-update-new-details.component.html',
    styleUrls: ['./account-update-new-details.component.scss']
})

export class AccountUpdateNewDetailsComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
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
    public moveAccountForm: FormGroup;
    public taxGroupForm: FormGroup;
    @ViewChild('deleteMergedAccountModal', { static: false }) public deleteMergedAccountModal: ModalDirective;
    @ViewChild('moveMergedAccountModal', { static: false }) public moveMergedAccountModal: ModalDirective;
    /** Tabs instance */
    @ViewChild('staticTabs', { static: true }) public staticTabs: TabsetComponent;

    public activeCompany: CompanyResponse;
    @Output() public submitClicked: EventEmitter<{ value: { groupUniqueName: string, accountUniqueName: string }, accountRequest: AccountRequestV2 }>
        = new EventEmitter();
    @Output() public deleteClicked: EventEmitter<any> = new EventEmitter();
    @Output() public isGroupSelected: EventEmitter<IOption> = new EventEmitter();
    /** Emiting true if account modal needs to be closed */
    @Output() public closeAccountModal: EventEmitter<boolean> = new EventEmitter();
    public showOtherDetails: boolean = false;
    public partyTypeSource: IOption[] = [];
    public stateList: StateList[] = [];
    public states: any[] = [];
    public statesSource$: Observable<IOption[]> = observableOf([]);
    public isTaxableAccount$: Observable<boolean>;
    public companyTaxDropDown$: Observable<IOption[]>;
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
    public isGstValid$: Observable<boolean> = observableOf(true);
    public selectedTab: string = 'address';
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
    public selectedDiscounts: any[] = [];
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
    public activeAccountGroup: IOption[] | INameUniqueName[] = [];
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
    /** This will hold toggle buttons value and size */
    public bootstrapToggleSwitch = BootstrapToggleSwitch;
    /** This will hold isMobileNumberValid */
    public isMobileNumberValid: boolean = true;
    /** This will hold mobile number field input  */
    public intl: any;
    /** True if we need to destroy mobile number field */
    public showMobileNumberError: boolean = false;

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
        private http: HttpClient
    ) {

    }

    public ngOnInit() {
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;

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
        this.addAccountForm.get('openingBalance').valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(a => {
            if (a && (a === 0 || a <= 0) && this.addAccountForm.get('openingBalanceType').value) {
                this.addAccountForm.get('openingBalanceType')?.patchValue('CREDIT');
            } else if (a && (a === 0 || a > 0) && this.addAccountForm.get('openingBalanceType').value === '') {
                this.addAccountForm.get('openingBalanceType')?.patchValue('CREDIT');
            }
        });

        if (this.autoFocusUpdate !== undefined) {
            setTimeout(() => {
                this.autoFocusUpdate?.nativeElement?.focus();
            }, 50);
        }

        this.addAccountForm.get('activeGroupUniqueName').setValue(this.activeGroupUniqueName);
        this.accountsAction.mergeAccountResponse$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            this.selectedaccountForMerge = '';
        });
        this.isTaxableAccount$ = this.store.pipe(select(createSelector([
            (state: AppState) => state.groupwithaccounts.activeAccount],
            (activeAccount) => {
                let result: boolean = false;
                if (this.activeGroupUniqueName && activeAccount) {
                    result = this.getAccountFromGroup(activeAccount, false);
                } else {
                    result = false;
                }
                return result;
            })), takeUntil(this.destroyed$));
    }

    public ngAfterViewInit() {
        this.onlyPhoneNumber();
        if (this.flatGroupsOptions === undefined) {
            this.getAccount();
        }
        this.taxHierarchy();
        let selectedGroupDetails;

        this.store.pipe(select(appStore => appStore.groupwithaccounts.activeGroup), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                selectedGroupDetails = response;
                if (selectedGroupDetails?.parentGroups) {
                    let parentGroup = selectedGroupDetails.parentGroups?.length > 1 ? selectedGroupDetails.parentGroups[1] : { uniqueName: selectedGroupDetails?.uniqueName };
                    if (parentGroup) {
                        this.isParentDebtorCreditor(parentGroup.uniqueName);
                    }
                }
            }
        });
        this.prepareTaxDropdown();
    }

    public getAccountFromGroup(activeGroup: AccountResponseV2, result: boolean): boolean {
        if (activeGroup.category === 'income' || activeGroup.category === 'expenses' || this.isDebtorCreditor) {
            result = true;
        }
        return result;
    }

    public prepareTaxDropdown() {
        // prepare drop down for taxes
        this.companyTaxDropDown$ = this.store.pipe(select(createSelector([
            (state: AppState) => state.groupwithaccounts.activeAccount,
            (state: AppState) => state.groupwithaccounts.activeAccountTaxHierarchy,
            (state: AppState) => state.company && state.company.taxes],
            (activeAccount, activeAccountTaxHierarchy, taxes) => {
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
                                let allTaxes = applicableTaxes?.filter(f => inheritedTaxes.indexOf(f) === -1);
                                // set value in tax group form
                                this.taxGroupForm.setValue({ taxes: allTaxes });
                            } else {
                                this.taxGroupForm.setValue({ taxes: applicableTaxes });
                            }
                            const notInheritedTax = differenceBy(taxes.map(p => {
                                return { label: p.name, value: p?.uniqueName, additional: p };
                            }), flattenDeep(activeAccountTaxHierarchy.inheritedTaxes.map(p => p.applicableTaxes)).map((p: any) => {
                                return { label: p.name, value: p?.uniqueName, additional: p };
                            }), 'value');
                            return this.filterTaxesForDebtorCreditor(notInheritedTax);
                        } else {
                            // set value in tax group form
                            this.taxGroupForm.setValue({ taxes: applicableTaxes });

                            const formattedTax = taxes.map(p => {
                                return { label: p.name, value: p?.uniqueName, additional: p };
                            });
                            return this.filterTaxesForDebtorCreditor(formattedTax);
                        }
                    }
                }
                return arr;
            })), takeUntil(this.destroyed$));
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
        let accountCountry = this.addAccountForm.get('country').get('countryCode').value;
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

    public tabChanged(activeTab: string) {
        if (activeTab) {
            this.selectedTab = activeTab;
            if (activeTab === 'others') {
                this.isOtherSelectedTab = true;
            } else {
                this.isOtherSelectedTab = false;
            }
        }
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
            closingBalanceTriggerAmount: [Validators.compose([digitsOnly])],
            closingBalanceTriggerAmountType: ['CREDIT'],
            customFields: this._fb.array([])
        });
        this.getInvoiceSettings();
    }

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
            stateCode: [{ value: '', disabled: false }, (this.isStateRequired) ? Validators.required : ""],
            isDefault: [false],
            isComposite: [false],
            partyType: ['NOT APPLICABLE'],
            pincode: ['']
        });

        if (val) {
            val.stateCode = val.state ? (val.state.code ? val.state.code : val.stateCode) : val.stateCode;
            gstFields?.patchValue(val);
        }
        return gstFields;
    }

    public resetGstStateForm() {
        this.forceClear$ = observableOf({ status: true });

        let addresses = this.addAccountForm.get('addresses') as FormArray;
        for (let control of addresses.controls) {
            control.get('stateCode')?.patchValue(null);
            control.get('state').get('code')?.patchValue(null);
            control.get('gstNumber').setValue("");
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

    public getStateCode(gstForm: FormGroup, statesEle: ShSelectComponent) {
        let gstVal: string = gstForm.get('gstNumber').value;
        gstForm.get('gstNumber').setValue(gstVal?.trim());
        if (gstVal?.length) {
            if (gstVal?.length !== 15) {
                gstForm.get('partyType').reset('NOT APPLICABLE');
            }

            if (gstVal?.length >= 2) {
                this.statesSource$.pipe(take(1)).subscribe(state => {
                    let stateCode = this.stateGstCode[gstVal.substr(0, 2)];

                    let currentState = state.find(st => st.value === stateCode);
                    if (currentState) {
                        gstForm.get('stateCode')?.patchValue(currentState.value);
                        gstForm.get('state').get('code')?.patchValue(currentState.value);

                    } else {
                        this._toaster.clearAllToaster();
                        if (this.formFields['taxName'] && !gstForm.get('gstNumber')?.valid) {
                            if (this.isIndia) {
                                gstForm.get('stateCode')?.patchValue(null);
                                gstForm.get('state').get('code')?.patchValue(null);
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

    public openingBalanceTypeChnaged(type: string) {
        if (Number(this.addAccountForm.get('openingBalance').value) > 0) {
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
        if (!this.addAccountForm.get('openingBalance').value) {
            this.addAccountForm.get('openingBalance').setValue('0');
        }
        if (!this.addAccountForm.get('foreignOpeningBalance').value) {
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
        let accountRequest: AccountRequestV2 = this.addAccountForm.value as AccountRequestV2;
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

        let mobileNo = this.intl?.getNumber();
        accountRequest['mobileNo'] = mobileNo;

        accountRequest['hsnNumber'] = (accountRequest["hsnOrSac"] === "hsn") ? accountRequest['hsnNumber'] : "";
        accountRequest['sacNumber'] = (accountRequest["hsnOrSac"] === "sac") ? accountRequest['sacNumber'] : "";

        this.submitClicked.emit({
            value: { groupUniqueName: this.activeGroupUniqueName, accountUniqueName: this.activeAccountName },
            accountRequest
        });
    }

    public closingBalanceTypeChanged(type: string) {
        if (Number(this.addAccountForm.get('closingBalanceTriggerAmount').value) > 0) {
            this.addAccountForm.get('closingBalanceTriggerAmountType')?.patchValue(type);
        }
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
            this.addAccountForm.get('mobileCode').setValue(phoneCode);
            let currencyCode = this.countryCurrency[event.value];
            this.addAccountForm.get('currency').setValue(currencyCode);
            this.getStates(event.value);
            this.getOnboardingForm(event.value);
            this.toggleStateRequired();
            this.resetGstStateForm();
            this.resetBankDetailsForm();
        }
    }

    public selectedState(gstForm: FormGroup, event) {
        if (gstForm && event?.label) {
            gstForm.get('stateCode')?.patchValue(event.value);
            gstForm.get('state').get('code')?.patchValue(event.value);

        }

    }

    public selectGroup(event: IOption) {
        if (event) {
            this.activeGroupUniqueName = event.value;
            let parent = event.additional;
            if (parent && parent[1]) {
                this.isParentDebtorCreditor(parent[1].uniqueName);
            }
            this.isGroupSelected.emit(event);
        }
    }

    public isParentDebtorCreditor(activeParentgroup: string) {
        this.activeParentGroup = activeParentgroup;
        this.toggleStateRequired();
        if (activeParentgroup === 'sundrycreditors' || activeParentgroup === 'sundrydebtors') {
            this.isShowBankDetails(activeParentgroup);
            this.isDebtorCreditor = true;
        } else if (activeParentgroup === 'bankaccounts') {
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

    public isShowBankDetails(accountType: string) {
        if (accountType === 'sundrycreditors') {
            this.showBankDetail = true;
        } else {
            this.showBankDetail = false;
        }
    }
    public getCountry() {
        this.store.pipe(select(s => s.common.countriesAll), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res).forEach(key => {
                    this.countrySource.push({ value: res[key].alpha2CountryCode, label: res[key].alpha2CountryCode + ' - ' + res[key].countryName, additional: res[key].callingCode });
                    // Creating Country Currency List
                    if (res[key].currency !== undefined && res[key].currency !== null) {
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

        if (ele.value?.trim()) {
            if (this.formFields['taxName']['regex'] !== "" && this.formFields['taxName']['regex']?.length > 0) {
                for (let key = 0; key < this.formFields['taxName']['regex'].length; key++) {
                    let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                    if (regex.test(ele.value)) {
                        isValid = true;
                        break;
                    }
                }
            } else {
                isValid = true;
            }

            if (!isValid) {
                this._toaster.errorToast('Invalid ' + this.formFields['taxName']?.label);
                ele.classList.add('error-box');
                this.isGstValid$ = observableOf(false);
            } else {
                ele.classList.remove('error-box');
                this.isGstValid$ = observableOf(true);
            }
        } else {
            ele.classList.remove('error-box');
            this.isGstValid$ = observableOf(true);
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
                        if (!this.addAccountForm.get('mobileCode').value) {
                            this.addAccountForm.get('mobileCode')?.patchValue(this.selectedAccountCallingCode);
                        }
                    }
                }
                this.states = [];
                if (res.stateList) {
                    this.stateList = res.stateList;
                }
                Object.keys(res.stateList).forEach(key => {

                    if (res.stateList[key].stateGstCode !== null) {
                        this.stateGstCode[res.stateList[key].stateGstCode] = [];
                        this.stateGstCode[res.stateList[key].stateGstCode] = res.stateList[key].code;
                    }

                    this.states.push({ label: res.stateList[key].code + ' - ' + res.stateList[key].name, value: res.stateList[key].code });
                });
                this.statesSource$ = observableOf(this.states);
            } else {
                let statesRequest = new StatesRequest();
                statesRequest.country = countryCode;
                this.store.dispatch(this._generalActions.getAllState(statesRequest));
            }
        });
    }

    public getPartyTypes() {
        this.store.pipe(select(s => s.common.partyTypes), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.partyTypeSource = res;
            } else {
                this.store.dispatch(this.commonActions.GetPartyType());
            }
        });
    }
    public moveAccount() {
        let activeAcc;
        this.activeAccount$.pipe(take(1)).subscribe(p => activeAcc = p);
        let grpObject = new AccountMoveRequest();
        grpObject.uniqueName = this.moveAccountForm.controls['moveto'].value;

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
        this.deleteMergedAccountModal?.show();
    }

    public hideDeleteMergedAccountModal() {
        this.deleteMergedAccountModal?.hide();
    }

    public deleteMergedAccount() {
        let activeAccount: AccountResponseV2 = null;
        this.activeAccount$.pipe(take(1)).subscribe(p => activeAccount = p);
        let obj = new AccountUnMergeRequest();
        obj.uniqueNames = [this.selectedAccountForDelete];
        this.store.dispatch(this.accountsAction.unmergeAccount(activeAccount?.uniqueName, obj));
        this.showDeleteMove = false;
        this.hideDeleteMergedAccountModal();
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
        this.moveMergedAccountModal.show();
    }

    public hideMoveMergedAccountModal() {
        this.moveMergedAccountModal.hide();
    }
    public moveMergeAccountTo() {
        let activeAccount: AccountResponseV2 = null;
        this.activeAccount$.pipe(take(1)).subscribe(p => activeAccount = p);
        let obj = new AccountUnMergeRequest();
        obj.uniqueNames = [this.setAccountForMove];
        obj.moveTo = this.selectedAccountForMove;
        this.store.dispatch(this.accountsAction.unmergeAccount(activeAccount?.uniqueName, obj));
        this.showDeleteMove = false;
        this.hideDeleteMergedAccountModal();
        this.hideMoveMergedAccountModal();
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
     * @memberof AccountAddNewDetailsComponent
     */
    public checkActiveGroupCountry(): boolean {
        if (this.activeCompany && this.activeCompany.countryV2 && this.activeCompany.countryV2.alpha2CountryCode === this.addAccountForm.get('country').get('countryCode').value && (this.activeGroupUniqueName === 'sundrycreditors' || this.activeParentGroup === 'sundrycreditors' || this.activeGroupUniqueName === 'sundrydebtors' || this.activeParentGroup === 'sundrydebtors')) {
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
            if (this.isStateRequired) {
                control.get('stateCode').setValidators([Validators.required]);
            } else {
                control.get('stateCode').setValidators(null);
            }
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
   * @memberof AccountUpdateNewDetailsComponent
   */
    public bankDetailsValidator(element, type: string): void {
        if (element.value && type) {
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
            uniq(this.selectedDiscounts);
            let assignDiscountObject: ApplyDiscountRequestV2 = new ApplyDiscountRequestV2();
            assignDiscountObject.uniqueName = this.activeAccountName;
            assignDiscountObject.discounts = this.selectedDiscounts;
            assignDiscountObject.isAccount = true;
            this.store.dispatch(this.accountsAction.applyAccountDiscountV2([assignDiscountObject]));
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
            customFields?.patchValue(value);
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
        customField.controls[index].get('value').setValue(isChecked);
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
        }
    }

    /**
     * To check discount list updated
     *
     * @memberof AccountUpdateNewDetailsComponent
     */
    public discountSelected(): void {
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
                count: API_COUNT_LIMIT,
            }
            this.groupService.searchGroups(requestObject).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result.uniqueName,
                            label: `${result.name}`,
                            additional: result.parentGroups
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
                                value: result.uniqueName,
                                label: `${result.name}`,
                                additional: result.parentGroups
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
                    value: result.uniqueName,
                    label: `${result.name}`,
                    additional: result.parentGroups
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
                            value: result.uniqueName,
                            label: `${result.name} (${result.uniqueName})`
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
                                value: result.uniqueName,
                                label: `${result.name} (${result.uniqueName})`
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
                    value: result.uniqueName,
                    label: `${result.name} (${result.uniqueName})`
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
        if (this.activeGroupUniqueName === 'sundrydebtors' || this.activeParentGroup === 'sundrydebtors') {
            // Only allow TDS receivable and TCS payable
            return taxes?.filter(tax => ['tdsrc', 'tcspay'].indexOf(tax?.additional?.taxType) > -1);
        } else if (this.activeGroupUniqueName === 'sundrycreditors' || this.activeParentGroup === 'sundrycreditors') {
            // Only allow TDS payable and TCS receivable
            return taxes?.filter(tax => ['tdspay', 'tcsrc'].indexOf(tax?.additional?.taxType) > -1);
        } else {
            // Only normal (non-other) taxes
            return taxes?.filter(tax => TCS_TDS_TAXES_TYPES.indexOf(tax?.additional?.taxType) === -1);
        }
    }

    /**
     * This will show/hide address tab depending on parent group
     *
     * @private
     * @memberof AccountUpdateNewDetailsComponent
     */
    private showHideAddressTab(): void {
        if (!this.isHsnSacEnabledAcc) {
            setTimeout(() => {
                if (this.staticTabs && this.staticTabs.tabs && this.staticTabs.tabs[0]) {
                    this.staticTabs.tabs[0].active = true;
                    this.changeDetectorRef.detectChanges();
                }
            }, 50);

            const accountAddress = this.addAccountForm.get('addresses') as FormArray;
            if (accountAddress.controls?.length === 0 || !accountAddress?.length) {
                this.addBlankGstForm();
            }
        } else {
            this.addAccountForm.get('addresses').reset();

            setTimeout(() => {
                if (this.staticTabs && this.staticTabs.tabs && this.staticTabs.tabs[1]) {
                    this.staticTabs.tabs[1].active = true;
                    this.changeDetectorRef.detectChanges();
                }
            }, 50);
        }
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
                    let col = acc.parentGroups[0]?.uniqueName;
                    this.isHsnSacEnabledAcc = col === 'revenuefromoperations' || col === 'otherincome' || col === 'operatingcost' || col === 'indirectexpenses';
                    this.isGstEnabledAcc = !this.isHsnSacEnabledAcc;
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
                                let updatedNumber = '+' + results[0]?.mobileNo;
                                this.intl.setNumber(updatedNumber);
                            }
                        });
                    this.store.pipe(select(appStore => appStore.groupwithaccounts.activeGroupUniqueName), take(1)).subscribe(response => {
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
                        this.selectedDiscounts = [];
                        this.forceClearDiscount$ = observableOf({ status: true });
                        if (response.status === 'success') {
                            if (response.body) {
                                if (response.body[accountDetails?.uniqueName]) {
                                    let list = response.body[accountDetails?.uniqueName];
                                    Object.keys(list).forEach(key => {
                                        let UniqueName = list[key]['discount']['uniqueName'];
                                        this.selectedDiscounts.push(UniqueName);
                                    });
                                }
                            }
                        }
                        uniq(this.selectedDiscounts);
                    });
                }

                accountDetails.addresses.forEach(address => {
                    address.state = address.state ? address.state : { code: '', stateGstCode: '', name: '' };
                    address.stateCodeName = address.state.code + " - " + address.state.name;
                });

                for (let i = 0; i <= 10; i++) {
                    this.removeGstDetailsForm(0);
                }
                if (!accountDetails.customFields) {
                    accountDetails.customFields = [];
                }

                this.addAccountForm?.patchValue(accountDetails);
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
                            customField?.at(fieldIndex).get('value').patchValue(item.value);
                        });
                    }
                }
                // hsn/sac enable disable
                if (acc.hsnNumber) {
                    this.addAccountForm.get('hsnOrSac')?.patchValue('hsn');
                } else if (acc.sacNumber) {
                    this.addAccountForm.get('hsnOrSac')?.patchValue('sac');
                }
                this.openingBalanceTypeChnaged(accountDetails.openingBalanceType);
                if (accountDetails.mobileNo) {
                    if (accountDetails.mobileNo.indexOf('-') > -1) {
                        let mobileArray = accountDetails.mobileNo.split('-');
                        this.addAccountForm.get('mobileCode')?.patchValue(mobileArray[0]);
                        this.addAccountForm.get('mobileNo')?.patchValue(mobileArray[1]);
                    } else {
                        this.addAccountForm.get('mobileNo')?.patchValue(accountDetails.mobileNo);
                        this.addAccountForm.get('mobileCode')?.patchValue(accountDetails.mobileCode);
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
    *This will use for  fetch mobile number
   *
   * @memberof AccountUpdateNewDetailsComponent
   */
    public onlyPhoneNumber(): void {
        const input = document.getElementById('init-contact-update');
        this.intl = new window['intlTelInput'](input, {
            nationalMode: false,
            utilsScript: MOBILE_NUMBER_UTIL_URL,
            autoHideDialCode: false,
            separateDialCode: false,
            geoIpLookup: (success, failure) => {
                let countryCode = this.activeCompany.countryV2.alpha2CountryCode.toLowerCase();
                if (!countryCode) {
                    const fetchIPApi = this.http.get<any>('https://api.db-ip.com/v2/free/self');
                    fetchIPApi.subscribe(
                        (res) => {
                            if (res?.response?.ipAddress) {
                                const fetchCountryByIpApi = this.http.get<any>('http://ip-api.com/json/${res.response.ipAddress');
                                fetchCountryByIpApi.subscribe(
                                    (fetchCountryByIpApiRes) => {
                                        if (fetchCountryByIpApiRes?.response?.countryCode) {
                                            return success(fetchCountryByIpApiRes.response.countryCode);
                                        } else {
                                            return success(countryCode);
                                        }
                                    },
                                    (fetchCountryByIpApiErr) => {
                                        const fetchCountryByIpInfoApi = this.http.get<any>('https://ipinfo.io/${res.response.ipAddress}/json');

                                        fetchCountryByIpInfoApi.subscribe(
                                            (fetchCountryByIpInfoApiRes) => {
                                                if (fetchCountryByIpInfoApiRes?.response?.country) {
                                                    return success(fetchCountryByIpInfoApiRes.response.country);
                                                } else {
                                                    return success(countryCode);
                                                }
                                            },
                                            (fetchCountryByIpInfoApiErr) => {
                                                return success(countryCode);
                                            }
                                        );
                                    }
                                );
                            } else {
                                return success(countryCode);
                            }
                        },
                        (err) => {
                            return success(countryCode);
                        }
                    );
                } else {
                    return success(countryCode);
                }
            },
        });
        input.addEventListener('blur', () => {
            if (!this.intl?.isValidNumber()) {
                this.showMobileNumberError = true;
            } else {
                this.showMobileNumberError = false;
            }
        });
    }
}

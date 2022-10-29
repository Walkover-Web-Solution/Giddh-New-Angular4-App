import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
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
    ViewChild
} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { digitsOnly } from '../../../helpers';
import { AppState } from '../../../../store';
import { select, Store } from '@ngrx/store';
import { AccountRequestV2, CustomFieldsData } from '../../../../models/api-models/Account';
import { ToasterService } from '../../../../services/toaster.service';
import { CompanyResponse, StateList, StatesRequest } from '../../../../models/api-models/Company';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { ShSelectComponent } from '../../../../theme/ng-virtual-select/sh-select.component';
import { IForceClear } from "../../../../models/api-models/Sales";
import { CountryRequest, OnboardingFormRequest } from "../../../../models/api-models/Common";
import { CommonActions } from '../../../../actions/common.actions';
import { GeneralActions } from "../../../../actions/general/general.actions";
import { GroupService } from 'apps/web-giddh/src/app/services/group.service';
import { GroupWithAccountsAction } from 'apps/web-giddh/src/app/actions/groupwithaccounts.actions';
import { API_COUNT_LIMIT, BootstrapToggleSwitch, EMAIL_VALIDATION_REGEX, MOBILE_NUMBER_ADDRESS_JSON_URL, MOBILE_NUMBER_IP_ADDRESS_URL, MOBILE_NUMBER_SELF_URL, MOBILE_NUMBER_UTIL_URL } from 'apps/web-giddh/src/app/app.constant';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { InvoiceService } from 'apps/web-giddh/src/app/services/invoice.service';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { clone, cloneDeep, uniqBy } from 'apps/web-giddh/src/app/lodash-optimized';
import { CustomFieldsService } from 'apps/web-giddh/src/app/services/custom-fields.service';
import { FieldTypes } from 'apps/web-giddh/src/app/custom-fields/custom-fields.constant';
import { HttpClient } from '@angular/common/http';

/** Declare of window */
declare var window;
@Component({
    selector: 'account-add-new-details',
    templateUrl: './account-add-new-details.component.html',
    styleUrls: ['./account-add-new-details.component.scss'],
})

export class AccountAddNewDetailsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
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
    @Output() public submitClicked: EventEmitter<{ activeGroupUniqueName: string, accountRequest: AccountRequestV2 }> = new EventEmitter();
    @Output() public isGroupSelected: EventEmitter<IOption> = new EventEmitter();
    /** Emiting true if account modal needs to be closed */
    @Output() public closeAccountModal: EventEmitter<boolean> = new EventEmitter();
    @ViewChild('autoFocus', { static: true }) public autoFocus: ElementRef;
    /** Tabs instance */
    @ViewChild('staticTabs', { static: true }) public staticTabs: TabsetComponent;

    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public showOtherDetails: boolean = false;
    public partyTypeSource: IOption[] = [];
    public stateList: StateList[] = [];
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
    public isGstValid$: Observable<boolean> = observableOf(true);
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
    /** This will hold toggle buttons value and size */
    public bootstrapToggleSwitch = BootstrapToggleSwitch;
    /** This will hold isMobileNumberInvalid */
    public isMobileNumberInvalid: boolean = false;
    /** This will hold mobile number field input  */
    public intl: any;

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
        private http: HttpClient) {
        this.activeGroup$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroup), takeUntil(this.destroyed$));
    }

    /**
     * Initializes the component
     *
     * @memberof AccountAddNewDetailsComponent
     */
    public ngOnInit(): void {
        this.getCountry();
        this.getCallingCodes();
        this.getPartyTypes();

        if (this.flatGroupsOptions === undefined) {
            this.getAccount();
        }
        if (this.activeGroupUniqueName === 'discount') {
            this.isDiscount = true;
            this.showBankDetail = false;
            this.isDebtorCreditor = false;
        }
        if (this.activeGroupUniqueName === 'sundrycreditors') {
            this.showBankDetail = true;
        }

        this.initializeNewForm();
        this.activeGroup$.subscribe(response => {
            if (response) {
                if (this.activeGroupUniqueName && response.uniqueName !== this.activeGroupUniqueName) {
                    this.store.dispatch(this.groupWithAccountsAction.getAccountGroupDetails(this.activeGroupUniqueName));
                } else if (response.parentGroups && response.parentGroups.length) {
                    let parent = response.parentGroups;
                    const HSN_SAC_PARENT_GROUPS = ['revenuefromoperations', 'otherincome', 'operatingcost', 'indirectexpenses'];
                    if (parent?.length > 1 && parent[1]) {
                        this.isHsnSacEnabledAcc = (parent[1].parentGroups) ? HSN_SAC_PARENT_GROUPS.includes(parent[1].parentGroups[0]?.uniqueName) : false;
                        this.isParentDebtorCreditor(parent[1].uniqueName);
                    } else if (parent?.length === 1) {
                        this.isHsnSacEnabledAcc = (response.parentGroups) ? HSN_SAC_PARENT_GROUPS.includes(response?.parentGroups[0]?.uniqueName) : false;
                        this.isParentDebtorCreditor(response?.uniqueName);
                    }
                    this.showHideAddressTab();
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
            if (a && (a === 0 || a <= 0) && this.addAccountForm.get('openingBalanceType').value) {
                this.addAccountForm.get('openingBalanceType')?.patchValue('CREDIT');
            } else if (a && (a === 0 || a > 0) && this.addAccountForm.get('openingBalanceType').value === '') {
                this.addAccountForm.get('openingBalanceType')?.patchValue('CREDIT');
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                if (this.activeCompany?.uniqueName !== activeCompany?.uniqueName) {
                    this.activeCompany = activeCompany;
                    this.getCompanyCustomField();
                }
                if (this.activeCompany.countryV2 !== undefined && this.activeCompany.countryV2 !== null) {
                    this.getStates(this.activeCompany.countryV2.alpha2CountryCode);
                }
                this.companyCurrency = clone(this.activeCompany.baseCurrency);
            }
        });

        this.addAccountForm.get('activeGroupUniqueName')?.setValue(this.activeGroupUniqueName);

        if (this.autoFocus !== undefined) {
            setTimeout(() => {
                this.autoFocus?.nativeElement?.focus();
            }, 50);
        }

        this.getCurrency();
        this.isStateRequired = this.checkActiveGroupCountry();

        if (this.fromCommandK && this.activeGroupUniqueName) {
            this.store.dispatch(this.groupWithAccountsAction.getGroupDetails(this.activeGroupUniqueName));
        }
    }

    public ngAfterViewInit() {
        setTimeout(() => {
            this.onlyPhoneNumber();
        }, 1000);
        this.addAccountForm.get('country').get('countryCode').setValidators(Validators.required);
        let activegroupName = this.addAccountForm.get('activeGroupUniqueName').value;
        if (activegroupName === 'sundrydebtors' || activegroupName === 'sundrycreditors') {
            if (activegroupName === 'sundrycreditors') {
                this.showBankDetail = true;
            }
            this.isDebtorCreditor = true;
        }
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
            this.addAccountForm.get('country').get('countryCode')?.setValue(countryCode);
            this.selectedCountry = `${countryCode} - ${countryName}`;
            this.selectedCountryCode = countryCode;
            this.addAccountForm.get('currency')?.setValue(company.baseCurrency);
            this.getOnboardingForm(countryCode);
            this.companyCountry = countryCode;
        } else {
            this.addAccountForm.get('country').get('countryCode')?.setValue('IN');
            this.selectedCountry = 'IN - India';
            this.selectedCountryCode = 'IN';
            this.addAccountForm.get('currency')?.setValue('IN');
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
                    swiftCode: ['']

                })
            ]),
            closingBalanceTriggerAmount: ['', Validators.compose([digitsOnly])],
            closingBalanceTriggerAmountType: ['CREDIT'],
            customFields: this._fb.array([])
        });
        this.getInvoiceSettings();
    }

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
            stateCode: [{ value: '', disabled: false }, (this.isStateRequired) ? Validators.required : ""],
            isDefault: [false],
            isComposite: [false],
            partyType: ['NOT APPLICABLE'],
            pincode: ['']
        });
        return gstFields;
    }

    public resetGstStateForm() {
        this.forceClear$ = observableOf({ status: true });

        let addresses = this.addAccountForm.get('addresses') as FormArray;
        for (let control of addresses.controls) {
            control.get('stateCode')?.patchValue(null);
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

    public isDefaultAddressSelected(val: boolean, i: number) {
        if (val) {
            let addresses = this.addAccountForm.get('addresses') as FormArray;
            for (let control of addresses.controls) {
                control.get('isDefault')?.patchValue(false);
            }
            addresses.controls[i].get('isDefault')?.patchValue(true);
        }
    }

    public getStateCode(gstForm: FormGroup, statesEle: ShSelectComponent, event: KeyboardEvent) {
        const keyAvoid = ['Tab', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'];
        if (keyAvoid.findIndex(key => key === event.key) > -1) {
            return;
        }
        let gstVal: string = gstForm.get('gstNumber').value?.trim();
        gstForm.get('gstNumber')?.setValue(gstVal?.trim());
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

    public resetAddAccountForm() {
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        const countries = this.addAccountForm.get('country') as FormGroup;
        addresses.reset();
        countries.reset();
        this.addAccountForm.reset();
    }

    public submit() {
        if (!this.addAccountForm.get('openingBalance').value) {
            this.addAccountForm.get('openingBalance')?.setValue('0');
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
        delete accountRequest['addAccountForm'];

        if (this.isHsnSacEnabledAcc) {
            delete accountRequest['addresses'];
        } else {
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

        if (this.activeGroupUniqueName === 'discount') {
            delete accountRequest['addresses'];
        }

        let mobileNo = this.intl?.getNumber();
        accountRequest['mobileNo'] = mobileNo;

        accountRequest['hsnNumber'] = (accountRequest["hsnOrSac"] === "hsn") ? accountRequest['hsnNumber'] : "";
        accountRequest['sacNumber'] = (accountRequest["hsnOrSac"] === "sac") ? accountRequest['sacNumber'] : "";

        this.submitClicked.emit({
            activeGroupUniqueName: this.activeGroupUniqueName,
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
        if (s && s['activeGroupUniqueName'] && s['activeGroupUniqueName'].currentValue) {
            this.activeGroupUniqueName = s['activeGroupUniqueName'].currentValue;
        }
    }

    public ngOnDestroy() {
        this.resetAddAccountForm();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public selectCountry(event: IOption) {
        if (event && event.value) {
            this.store.dispatch(this._generalActions.resetStatesList());
            this.store.dispatch(this.commonActions.resetOnboardingForm());
            this.getOnboardingForm(event.value);
            let phoneCode = event.additional;
            this.addAccountForm.get('mobileCode')?.setValue(phoneCode);
            let currencyCode = this.countryCurrency[event.value];
            this.addAccountForm.get('currency')?.setValue(currencyCode);
            this.getStates(event.value);
            this.toggleStateRequired();
            this.resetGstStateForm();
            this.resetBankDetailsForm();
        }
    }

    public selectedState(gstForm: FormGroup, event) {
        if (gstForm && event?.label) {
            gstForm.get('stateCode')?.patchValue(event?.value);
            gstForm.get('state').get('code')?.patchValue(event?.value);
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
                if (res.stateList) {
                    this.stateList = res.stateList;
                }
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
        if (this.activeCompany && this.activeCompany.countryV2 && this.activeCompany.countryV2.alpha2CountryCode === this.addAccountForm.get('country').get('countryCode').value && (this.activeGroupUniqueName === 'sundrycreditors' || this.activeParentGroupUniqueName === 'sundrycreditors' || this.activeGroupUniqueName === 'sundrydebtors' || this.activeParentGroupUniqueName === 'sundrydebtors')) {
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
     * @memberof AccountAddNewDetailsComponent
     */
    public bankDetailsValidator(element, type: string): void {
        let trim: string = '';
        if (element.value && type) {
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
            customFields?.patchValue(value);
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
                count: API_COUNT_LIMIT,
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
            let activeGroup;
            this.activeGroup$.pipe(take(1)).subscribe(response => activeGroup = response);
            this.groupService.searchGroups(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result.uniqueName,
                            label: `${result.name}`,
                            additional: result.parentGroups
                        }
                    }) || [];
                    if (page === 1) {
                        if (activeGroup && searchResults.findIndex(group => group.value === activeGroup?.uniqueName) === -1) {
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
            let loop = 0;
            const addresses = this.addAccountForm.get('addresses') as FormArray;
            for (let control of addresses.controls) {
                this.removeGstDetailsForm(loop);
                loop++;
            }
            addresses.push(this.initialGstDetailsForm());

            setTimeout(() => {
                if (this.staticTabs && this.staticTabs.tabs && this.staticTabs.tabs[1]) {
                    this.staticTabs.tabs[1].active = true;
                    this.changeDetectorRef.detectChanges();
                }
            }, 50);
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
      *This will use for  fetch mobile number
     *
     * @memberof AccountAddNewDetailsComponent
     */
    public onlyPhoneNumber(): void {
        let input = document.getElementById('init-contact-add');
        const errorMsg = document.querySelector("#init-contact-add-error-msg");
        const validMsg = document.querySelector("#init-contact-add-valid-msg");
        let errorMap = [this.localeData?.invalid_contact_number, this.commonLocaleData?.app_invalid_country_code, this.commonLocaleData?.app_invalid_contact_too_short, this.commonLocaleData?.app_invalid_contact_too_long, this.localeData?.invalid_contact_number];
        let intlTelInput = new window['intlTelInput'];
        if (intlTelInput && input) {
            this.intl = intlTelInput(input, {
                nationalMode: true,
                utilsScript: MOBILE_NUMBER_UTIL_URL,
                autoHideDialCode: false,
                separateDialCode: false,
                initialCountry: 'auto',
                geoIpLookup: (success, failure) => {
                    let countryCode = 'in';
                    const fetchIPApi = this.http.get<any>(MOBILE_NUMBER_SELF_URL);
                    fetchIPApi.subscribe(
                        (res) => {
                            if (res?.response?.ipAddress) {
                                const fetchCountryByIpApi = this.http.get<any>(MOBILE_NUMBER_IP_ADDRESS_URL + `${res.response.ipAddress}`);
                                fetchCountryByIpApi.subscribe(
                                    (fetchCountryByIpApiRes) => {
                                        if (fetchCountryByIpApiRes?.response?.countryCode) {
                                            return success(fetchCountryByIpApiRes.response.countryCode);
                                        } else {
                                            return success(countryCode);
                                        }
                                    },
                                    (fetchCountryByIpApiErr) => {
                                        const fetchCountryByIpInfoApi = this.http.get<any>(MOBILE_NUMBER_ADDRESS_JSON_URL + `${res.response.ipAddress}`);

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
                },
            });
            let reset = () => {
                input?.classList?.remove("error");
                if (errorMsg && validMsg) {
                    errorMsg.innerHTML = "";
                    errorMsg.classList.add("d-none");
                    validMsg.classList.add("d-none");
                }
            };
            input.addEventListener('blur', () => {
                let phoneNumber = this.intl?.getNumber();
                reset();
                if (input) {
                    if (phoneNumber?.length) {
                        if (this.intl?.isValidNumber()) {
                            validMsg?.classList?.remove("d-none");
                            this.isMobileNumberInvalid = false;
                        } else {
                            input?.classList?.add("error");
                            this.isMobileNumberInvalid = true;
                            let errorCode = this.intl?.getValidationError();
                            if (errorMsg && errorMap[errorCode]) {
                                this._toaster.errorToast(this.localeData?.invalid_contact_number);
                                errorMsg.innerHTML = errorMap[errorCode];
                                errorMsg.classList.remove("d-none");
                            }
                        }
                    } else {
                        this.isMobileNumberInvalid = false;
                    }
                }
            });
        }
    }
}

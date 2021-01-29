import {Observable, of as observableOf, ReplaySubject} from 'rxjs';
import {distinctUntilChanged, take, takeUntil} from 'rxjs/operators';
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
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {digitsOnly} from '../../../helpers';
import {AppState} from '../../../../store';
import {select, Store} from '@ngrx/store';
import {AccountRequestV2, CustomFieldsData} from '../../../../models/api-models/Account';
import {ToasterService} from '../../../../services/toaster.service';
import {CompanyResponse, StateList, StatesRequest} from '../../../../models/api-models/Company';
import * as _ from '../../../../lodash-optimized';
import {IOption} from '../../../../theme/ng-virtual-select/sh-options.interface';
import {ShSelectComponent} from '../../../../theme/ng-virtual-select/sh-select.component';
import {IForceClear} from "../../../../models/api-models/Sales";
import {CountryRequest, OnboardingFormRequest} from "../../../../models/api-models/Common";
import {CommonActions} from '../../../../actions/common.actions';
import {GeneralActions} from "../../../../actions/general/general.actions";
import {IFlattenGroupsAccountsDetail} from 'apps/web-giddh/src/app/models/interfaces/flattenGroupsAccountsDetail.interface';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js/min';
import { GroupService } from 'apps/web-giddh/src/app/services/group.service';
import { GroupWithAccountsAction } from 'apps/web-giddh/src/app/actions/groupwithaccounts.actions';
import { API_COUNT_LIMIT, EMAIL_VALIDATION_REGEX } from 'apps/web-giddh/src/app/app.constant';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
    selector: 'account-add-new-details',
    templateUrl: './account-add-new-details.component.html',
    styleUrls: ['./account-add-new-details.component.scss'],
})

export class AccountAddNewDetailsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    public addAccountForm: FormGroup;
    @Input() public activeGroupUniqueName: string;
    @Input() public flatGroupsOptions: IOption[];
    @Input() public fetchingAccUniqueName$: Observable<boolean>;
    @Input() public isAccountNameAvailable$: Observable<boolean>;
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
    /** True, if the module doesn't depend on flatten APIs */
    @Input() public isFlattenRemoved: boolean;
    /** True if bank category account is selected */
    @Input() public isBankAccount: boolean = true;
    @Output() public submitClicked: EventEmitter<{ activeGroupUniqueName: string, accountRequest: AccountRequestV2 }> = new EventEmitter();
    @Output() public isGroupSelected: EventEmitter<IOption> = new EventEmitter();
    @ViewChild('autoFocus', {static: true}) public autoFocus: ElementRef;
    /** Tabs instance */
    @ViewChild('staticTabs', {static: true}) public staticTabs: TabsetComponent;

    public forceClear$: Observable<IForceClear> = observableOf({status: false});
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
    public isMobileNumberValid: boolean = false;
    public formFields: any[] = [];
    public isGstValid$: Observable<boolean> = observableOf(true);
    public GSTIN_OR_TRN: string;
    public selectedCountry: string;
    public selectedCountryCode: string;
    private flattenGroups$: Observable<IFlattenGroupsAccountsDetail[]>;
    public isStateRequired: boolean = false;
    public bankIbanNumberMaxLength: string = '18';
    public bankIbanNumberMinLength: string = '9';
    /** company custom fields list */
    public companyCustomFields: any[] = [];
    /** Observable for selected active group  */
    private activeGroup$: Observable<any>;
    /** This will handle if we need to disable currency selection */
    public disableCurrencySelection: boolean = false;
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

    constructor(
        private _fb: FormBuilder,
        private store: Store<AppState>,
        private _toaster: ToasterService,
        private commonActions: CommonActions,
        private _generalActions: GeneralActions,
        private changeDetectorRef: ChangeDetectorRef,
        private groupService: GroupService,
        private groupWithAccountsAction: GroupWithAccountsAction) {
        this.flattenGroups$ = this.store.pipe(select(state => state.general.flattenGroups), takeUntil(this.destroyed$));
        this.activeGroup$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroup),takeUntil(this.destroyed$));
        this.getCountry();
        this.getCallingCodes();
        this.getPartyTypes();
    }

    /**
     * Initializes the component
     *
     * @memberof AccountAddNewDetailsComponent
     */
    public ngOnInit(): void {
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
                if (response.parentGroups && response.parentGroups.length) {
                    let parent = response.parentGroups;
                    if (parent.length > 1 && parent[1]) {
                        this.isParentDebtorCreditor(parent[1].uniqueName);
                    } else if (parent.length === 1) {
                        this.isParentDebtorCreditor(response.uniqueName);
                    }
                }
            }
        });
        this.getCompanyCustomField();

        this.addAccountForm.get('hsnOrSac').valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(a => {
            const hsn: AbstractControl = this.addAccountForm.get('hsnNumber');
            const sac: AbstractControl = this.addAccountForm.get('sacNumber');
            if (a === 'hsn') {
                sac.reset();
                hsn.enable();
                sac.disable();
            } else {
                hsn.reset();
                sac.enable();
                hsn.disable();
            }
        });

        // get country code value change
        this.addAccountForm.get('country').get('countryCode').valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(a => {

            if (a) {
                const addresses = this.addAccountForm.get('addresses') as FormArray;
                if (addresses.controls.length === 0) {
                    this.addBlankGstForm();
                }
                // let addressFormArray = (this.addAccountForm.controls['addresses'] as FormArray);
                if (a !== 'IN') {
                    this.isIndia = false;
                    // Object.keys(addressFormArray.controls).forEach((key) => {
                    //     if (parseInt(key) > 0) {
                    //         addressFormArray.removeAt(1); // removing index 1 only because as soon as we remove any index, it automatically updates index
                    //     }
                    // });
                } else {
                    if (addresses.controls.length === 0) {
                        this.addBlankGstForm();
                    }
                    this.isIndia = true;
                }

                // this.resetGstStateForm();
            }
        });

        // get openingblance value changes
        this.addAccountForm.get('openingBalance').valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(a => { // as disccused with back end team bydefault openingBalanceType will be CREDIT
            if (a && (a === 0 || a <= 0) && this.addAccountForm.get('openingBalanceType').value) {
                this.addAccountForm.get('openingBalanceType').patchValue('CREDIT');
            } else if (a && (a === 0 || a > 0) && this.addAccountForm.get('openingBalanceType').value === '') {
                this.addAccountForm.get('openingBalanceType').patchValue('CREDIT');
            }
        });
        // this.addAccountForm.get('foreignOpeningBalance').valueChanges.subscribe(a => {
        //     if (!a) {
        //         this.addAccountForm.get('foreignOpeningBalance').patchValue('0');
        //     }
        // });
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if(activeCompany) {
                this.activeCompany = activeCompany;
                if (this.activeCompany.countryV2 !== undefined && this.activeCompany.countryV2 !== null) {
                    this.getStates(this.activeCompany.countryV2.alpha2CountryCode);
                }
                this.companyCurrency = _.clone(this.activeCompany.baseCurrency);
            }
        });

        this.addAccountForm.get('activeGroupUniqueName').setValue(this.activeGroupUniqueName);


        // COMMENTED BELOW CODE TO REMOVE AUTOCOMPLETE ON ACCOUNT NAME SINCE API TEAM IS HANDING THE ACCOUNT UNIQUE NAME
        // this.addAccountForm.get('name').valueChanges.pipe(debounceTime(100)).subscribe(name => {
        //   let val: string = name;
        //   val = uniqueNameInvalidStringReplace(val);
        //   if (val) {
        //     this.store.dispatch(this.accountsAction.getAccountUniqueName(val));
        //     this.isAccountNameAvailable$.subscribe(a => {
        //       if (a !== null && a !== undefined) {
        //         if (a) {
        //           this.addAccountForm.patchValue({ uniqueName: val });
        //         } else {
        //           let num = 1;
        //           this.addAccountForm.patchValue({ uniqueName: val + num });
        //         }
        //       }
        //     });
        //   } else {
        //     this.addAccountForm.patchValue({ uniqueName: '' });
        //   }
        // });

        if (this.autoFocus !== undefined) {
            setTimeout(() => {
                this.autoFocus.nativeElement.focus();
            }, 50);
        }
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
            }
        });
        this.getCurrency();

        this.isStateRequired = this.checkActiveGroupCountry();
    }

    public ngAfterViewInit() {
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
        if (this.isLedgerModule || this.isFlattenRemoved) {
            this.loadDefaultGroupsSuggestions();
        } else {
            this.flattenGroups$.subscribe(flattenGroups => {
                if (flattenGroups) {
                    let items: IOption[] = flattenGroups.filter(grps => {
                        return grps.groupUniqueName === this.activeGroupUniqueName || grps.parentGroups.some(s => s.uniqueName === this.activeGroupUniqueName);
                    }).map((m: any) => ({value: m.groupUniqueName, label: m.groupName, additional: m.parentGroups}));
                    this.flatGroupsOptions = items;
                    if (this.flatGroupsOptions.length > 0 && this.activeGroupUniqueName) {
                        let selectedGroupDetails;

                        this.flatGroupsOptions.forEach(res => {
                            if (res.value === this.activeGroupUniqueName) {
                                selectedGroupDetails = res;
                            }
                        })
                        if (selectedGroupDetails) {
                            if (selectedGroupDetails.additional) {
                                let parentGroup = selectedGroupDetails.additional.length > 1 ? selectedGroupDetails.additional[1] : '';
                                if (parentGroup) {
                                    this.isParentDebtorCreditor(parentGroup.uniqueName);
                                }
                            }
                        }
                        this.toggleStateRequired();
                    }
                }
            });
        }
    }

    public setCountryByCompany(company: CompanyResponse) {
        if (this.activeCompany && this.activeCompany.countryV2) {
            const countryCode = this.activeCompany.countryV2.alpha2CountryCode;
            const countryName = this.activeCompany.countryV2.countryName;
            const callingCode = this.activeCompany.countryV2.callingCode;
            this.addAccountForm.get('country').get('countryCode').setValue(countryCode);
            this.selectedCountry = `${countryCode} - ${countryName}`;
            this.selectedCountryCode = countryCode;
            this.addAccountForm.get('mobileCode').setValue(callingCode);
            this.addAccountForm.get('currency').setValue(company.baseCurrency);
            this.getOnboardingForm(countryCode);
            this.companyCountry = countryCode;
        } else {
            this.addAccountForm.get('country').get('countryCode').setValue('IN');
            this.addAccountForm.get('mobileCode').setValue('91');
            this.selectedCountry = 'IN - India';
            this.selectedCountryCode = 'IN';
            this.addAccountForm.get('currency').setValue('IN');
            this.companyCountry = 'IN';
            this.getOnboardingForm('IN');
        }

        this.toggleStateRequired();
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
                countryCode: ['', Validators.required]
            }),
            hsnOrSac: [''],
            currency: [''],
            hsnNumber: [{value: '', disabled: false}],
            sacNumber: [{value: '', disabled: false}],
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
            closingBalanceTriggerAmount: ['',Validators.compose([digitsOnly])],
            closingBalanceTriggerAmountType: ['CREDIT'],
            customFields: this._fb.array([])
        });
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
            stateCode: [{value: '', disabled: false}, (this.isStateRequired) ? Validators.required : ""],
            isDefault: [false],
            isComposite: [false],
            partyType: ['NOT APPLICABLE']
        });
        return gstFields;
    }

    public resetGstStateForm() {
        this.forceClear$ = observableOf({status: true});

        let addresses = this.addAccountForm.get('addresses') as FormArray;
        for (let control of addresses.controls) {
            control.get('stateCode').patchValue(null);
            control.get('state').get('code').patchValue(null);
            control.get('gstNumber').setValue("");
        }
    }

    public resetBankDetailsForm() {
        let accountBankDetails = this.addAccountForm.get('accountBankDetails') as FormArray;
        for (let control of accountBankDetails.controls) {
            control.get('bankName').patchValue(null);
            control.get('bankAccountNo').patchValue(null);
            control.get('beneficiaryName').patchValue(null);
            control.get('branchName').patchValue(null);
            control.get('swiftCode').patchValue(null);
            control.get('ifsc').setValue("");
        }
    }

    public addGstDetailsForm(value?: string) {    // commented code because we no need GSTIN No. to add new address
        // if (value && !value.startsWith(' ', 0)) {
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        addresses.push(this.initialGstDetailsForm());
        if (addresses.length > 4) {
            this.moreGstDetailsVisible = false;
        }
        // } else {
        //     this._toaster.clearAllToaster();

        //     if (this.formFields['taxName']) {
        //         this._toaster.errorToast(`Please fill ${this.formFields['taxName'].label}`);
        //     }
        // }
        return;
    }

    public removeGstDetailsForm(i: number) {
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        addresses.removeAt(i);
    }

    public addBlankGstForm() {
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        if (addresses.value.length === 0) {
            addresses.push(this.initialGstDetailsForm());
        }
    }

    public isDefaultAddressSelected(val: boolean, i: number) {
        if (val) {
            let addresses = this.addAccountForm.get('addresses') as FormArray;
            for (let control of addresses.controls) {
                control.get('isDefault').patchValue(false);
            }
            addresses.controls[i].get('isDefault').patchValue(true);
        }
    }

    public getStateCode(gstForm: FormGroup, statesEle: ShSelectComponent, event: KeyboardEvent) {
        const keyAvoid = ['Tab', 'ArrowLeft', 'ArrowUp' , 'ArrowRight', 'ArrowDown'];
        if (keyAvoid.findIndex(key => key === event.key) > -1) {
            return;
        }
        let gstVal: string = gstForm.get('gstNumber').value.trim();
        gstForm.get('gstNumber').setValue(gstVal.trim());
        if (gstVal.length) {
            if (gstVal.length !== 15) {
                gstForm.get('partyType').reset('NOT APPLICABLE');
            }

            if (gstVal.length >= 2) {
                this.statesSource$.pipe(take(1)).subscribe(state => {
                    let stateCode = this.stateGstCode[gstVal.substr(0, 2)];

                    let currentState = state.find(st => st.value === stateCode);
                    if (currentState) {
                        gstForm.get('stateCode').patchValue(currentState.value);
                        gstForm.get('state').get('code').patchValue(currentState.value);
                    } else {
                        if (this.isIndia) {
                            gstForm.get('stateCode').patchValue(null);
                            gstForm.get('state').get('code').patchValue(null);
                        }
                        this._toaster.clearAllToaster();
                        if (this.formFields['taxName'] && !gstForm.get('gstNumber')?.valid) {
                            this._toaster.errorToast(`Invalid ${this.formFields['taxName'].label}`);
                        }
                    }
                });
            } else {
                // statesEle.setDisabledState(false);
                if (this.isIndia) {
                    statesEle.forceClearReactive.status = true;
                    statesEle.clear();
                    gstForm.get('stateCode').patchValue(null);
                    gstForm.get('state').get('code').patchValue(null);
                }
            }
        } else {
            statesEle.forceClearReactive.status = true;
            statesEle.clear();
            gstForm.get('stateCode').patchValue(null);
            gstForm.get('state').get('code').patchValue(null);
        }
    }

    public showMoreGst() {
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        this.gstDetailsLength = addresses.controls.length;
        this.moreGstDetailsVisible = true;
    }

    public openingBalanceTypeChnaged(type: string) {
        if (Number(this.addAccountForm.get('openingBalance').value) > 0) {
            this.addAccountForm.get('openingBalanceType').patchValue(type);
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

    public isValidMobileNumber(ele: HTMLInputElement) {
        if (ele.value) {
            this.checkMobileNo(ele);
        }
    }

    public checkMobileNo(ele) {
        try {
            let parsedNumber = parsePhoneNumberFromString('+' + this.addAccountForm.get('mobileCode').value + ele.value, this.addAccountForm.get('country').get('countryCode').value as CountryCode);
            if (parsedNumber.isValid()) {
                ele.classList.remove('error-box');
                this.isMobileNumberValid = true;
            } else {
                this.isMobileNumberValid = false;
                this._toaster.errorToast('Invalid Contact number');
                ele.classList.add('error-box');
            }
        } catch (error) {
            this.isMobileNumberValid = false;
            this._toaster.errorToast('Invalid Contact number');
            ele.classList.add('error-box');
        }
    }

    public submit() {

        if (!this.addAccountForm.get('openingBalance').value) {
            this.addAccountForm.get('openingBalance').setValue('0');
        }
        if (!this.addAccountForm.get('foreignOpeningBalance').value) {
            this.addAccountForm.get('foreignOpeningBalance').patchValue('0');
        }
        let accountRequest: AccountRequestV2 = this.addAccountForm.value as AccountRequestV2;
        if (this.stateList && accountRequest.addresses && accountRequest.addresses.length > 0 && !this.isHsnSacEnabledAcc) {
            let selectedStateObj = this.getStateGSTCode(this.stateList, accountRequest.addresses[0].stateCode);
            if (selectedStateObj) {
                accountRequest.addresses[0].stateCode = selectedStateObj.stateGstCode;
            }
        }
        delete accountRequest['addAccountForm'];

        if (!accountRequest.mobileNo) {
            accountRequest.mobileCode = '';
        } else {
            if(!this.isMobileNumberValid) {
                this._toaster.errorToast('Invalid Contact number');
                return false;
            }
        }
        if (this.isHsnSacEnabledAcc) {
            // delete accountRequest['country'];
            delete accountRequest['addresses'];
            // delete accountRequest['hsnOrSac'];
            // delete accountRequest['mobileNo'];
            // delete accountRequest['email'];
            // delete accountRequest['attentionTo'];
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

        // if (this.showVirtualAccount && (!accountRequest.mobileNo || !accountRequest.email)) {
        //   this._toaster.errorToast('Mobile no. & email Id is mandatory');
        //   return;
        // }
        this.submitClicked.emit({
            activeGroupUniqueName: this.activeGroupUniqueName,
            accountRequest
        });
    }

    public closingBalanceTypeChanged(type: string) {
        if (Number(this.addAccountForm.get('closingBalanceTriggerAmount').value) > 0) {
            this.addAccountForm.get('closingBalanceTriggerAmountType').patchValue(type);
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
            this.addAccountForm.get('mobileCode').setValue(phoneCode);
            if(!this.disableCurrencyIfSundryCreditor()) {
                let currencyCode = this.countryCurrency[event.value];
                this.addAccountForm.get('currency').setValue(currencyCode);
            }
            this.getStates(event.value);
            this.toggleStateRequired();
            this.resetGstStateForm();
            this.resetBankDetailsForm();
        }
    }

    public selectedState(gstForm: FormGroup, event) {
        if (gstForm && event.label) {
            let obj = this.getStateGSTCode(this.stateList, event.value)
            gstForm.get('stateCode').patchValue(event.value);
            gstForm.get('state').get('code').patchValue(event.value);
        }

    }

    public selectGroup(event: IOption) {
        if (event) {
            this.activeGroupUniqueName = event.value;
            this.store.dispatch(this.groupWithAccountsAction.getGroupDetails(this.activeGroupUniqueName));

            // let parent = event.additional;
            // if (parent[1]) {
            //     this.isParentDebtorCreditor(parent[1].uniqueName);
            // }
            this.isParentDebtorCreditor(this.activeGroupUniqueName);
            this.isGroupSelected.emit(event);
            this.toggleStateRequired();
        }
    }

    public isParentDebtorCreditor(activeParentgroup: string) {
        this.activeParentGroup = activeParentgroup;
        if (activeParentgroup === 'sundrycreditors' || activeParentgroup === 'sundrydebtors') {
            const accountAddress = this.addAccountForm.get('addresses') as FormArray;
            this.isShowBankDetails(activeParentgroup);
            this.isDebtorCreditor = true;

            if(this.staticTabs && this.staticTabs.tabs && this.staticTabs.tabs[0]) {
                this.staticTabs.tabs[0].active = true;
            }

            if (accountAddress.controls.length === 0) {
                this.addBlankGstForm();
            }
            if (!accountAddress.length) {
                this.addBlankGstForm();
            }

        } else if (activeParentgroup === 'bankaccounts') {
            this.isBankAccount = true;
            this.isDebtorCreditor = false;
            this.showBankDetail = false;
            this.addAccountForm.get('addresses').reset();
        } else {
            this.isBankAccount = false;
            this.isDebtorCreditor = false;
            this.showBankDetail = false;
            this.addAccountForm.get('addresses').reset();

            if(this.staticTabs && this.staticTabs.tabs && this.staticTabs.tabs[0]) {
                this.staticTabs.tabs[0].active = false;
            }
        }
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
                    this.currencies.push({label: res[key].code, value: res[key].code});
                });

                this.currencySource$ = observableOf(this.currencies);
                setTimeout(() => {
                    // Timeout is used as value were not updated in form
                    this.setCountryByCompany(this.activeCompany);
                }, 500);
            } else {
                this.store.dispatch(this.commonActions.GetCurrency());
            }
        });
    }

    public getCallingCodes() {
        this.store.pipe(select(s => s.common.callingcodes), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res.callingCodes).forEach(key => {
                    this.countryPhoneCode.push({label: res.callingCodes[key], value: res.callingCodes[key]});
                });
                this.callingCodesSource$ = observableOf(this.countryPhoneCode);
            } else {
                this.store.dispatch(this.commonActions.GetCallingCodes());
            }
        });
    }

    public checkGstNumValidation(ele: HTMLInputElement) {
        let isValid: boolean = false;
        if (ele.value.trim()) {
            if (this.formFields['taxName']['regex'] !== "" && this.formFields['taxName']['regex'].length > 0) {
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
                this._toaster.errorToast('Invalid ' + this.formFields['taxName'].label);
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
        if (this.activeCompany && this.activeCompany.countryV2 && this.activeCompany.countryV2.alpha2CountryCode === this.addAccountForm.get('country').get('countryCode').value && (this.activeGroupUniqueName === 'sundrycreditors' || this.activeGroupUniqueName === 'sundrydebtors')) {
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
        this.changeDetectorRef.detectChanges();
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
            trim = element.value.replace(/[^a-zA-Z0-9]/g, '');
            let accountBankDetail = this.addAccountForm.get('accountBankDetails') as FormArray;
            for (let control of accountBankDetail.controls) {
                if (type === 'bankAccountNo') {
                    control.get('bankAccountNo').patchValue(trim);
                } else if (type === 'swiftCode') {
                    control.get('swiftCode').patchValue(trim);
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
                    this._toaster.errorToast('The bank account number must contain 9 to 18 characters');
                    element.classList.add('error-box');
                } else {
                    element.classList.remove('error-box');
                }
            } else {
                if (element && element.value && element.value.length < 23) {
                    this._toaster.errorToast('The IBAN must contain 23 to 34 characters.');
                    element.classList.add('error-box');
                } else {
                    element.classList.remove('error-box');
                }
            }
        } else if (type === 'swiftCode') {
            if (element && element.value && element.value.length < 8) {
                this._toaster.errorToast('The SWIFT Code/BIC must contain 8 to 11 characters.');
                element.classList.add('error-box');
            } else {
                element.classList.remove('error-box');
            }
        }
    }

    /**
     * Returns true if passed account belongs to creditor or debtor category
     * required to make state mandatory
     *
     * @private
     * @param {string} accountUniqueName Account unique name
     * @returns {boolean} True if passed account belongs to creditor or debtor category
     * @memberof AccountAddNewDetailsComponent
     */
    private isCreditorOrDebtor(accountUniqueName: string): boolean {
        if (this.flatGroupsOptions && _.isArray(this.flatGroupsOptions) && this.flatGroupsOptions.length && accountUniqueName) {
            const groupDetails: any = this.flatGroupsOptions.filter((group) => group.value === accountUniqueName).pop();
            if (groupDetails) {
                return groupDetails.additional.some((parentGroup) => {
                    const groups = [parentGroup.uniqueName, groupDetails.value];
                    return groups.includes('sundrydebtors') || groups.includes('sundrycreditors');
                });
            }
            return false;
        }
        return false;
    }

     /**
     * API call to get custom field data
     *
     * @memberof AccountAddNewDetailsComponent
     */
    public getCompanyCustomField(): void {
        this.groupService.getCompanyCustomField().subscribe(response => {
            if (response && response.status === 'success') {
                this.companyCustomFields = response.body;
                this.createDynamicCustomFieldForm(this.companyCustomFields);
            } else {
                this._toaster.errorToast(response.message);
            }
        });
    }

    /**
     * To create blank dynamic custom field row
     *
     * @memberof AccountAddNewDetailsComponent
     */
    public addBlankCustomFieldForm(): void {
        const customField = this.addAccountForm.get('customFields') as FormArray;
        if (customField.value.length === 0) {
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
        if (customField.length < customFieldLength) {
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
            value: [''],
        });
        if (value) {
            customFields.patchValue(value);
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
            this.renderCustomFieldDetails(item, customFieldForm.length);
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
        customField.controls[index].get('value').setValue(isChecked);
    }

    /**
     * This will disable currency field if selected group or parent group is sundry creditor
     *
     * @param {string} [groupName]
     * @memberof AccountAddNewDetailsComponent
     */
    public get disableCurrency(): boolean {
        return this.disableCurrencyIfSundryCreditor();
    }

    /**
     * This will disable currency field if selected group or parent group is sundry creditor
     *
     * @returns {boolean}
     * @memberof AccountAddNewDetailsComponent
     */
    public disableCurrencyIfSundryCreditor(): boolean {
        let groupName = (this.addAccountForm && this.addAccountForm.get('activeGroupUniqueName')) ? this.addAccountForm.get('activeGroupUniqueName').value : "";
        if(groupName === "sundrycreditors" || this.activeParentGroup === "sundrycreditors") {
            this.addAccountForm.get('currency').setValue(this.companyCurrency);
            return true;
        } else {
            return false;
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
}

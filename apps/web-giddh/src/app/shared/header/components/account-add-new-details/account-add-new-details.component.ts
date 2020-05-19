import { Observable, of as observableOf, ReplaySubject, of } from 'rxjs';

import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { digitsOnly } from '../../../helpers';
import { AccountsAction } from '../../../../actions/accounts.actions';
import { AppState } from '../../../../store';
import { select, Store } from '@ngrx/store';
import { uniqueNameInvalidStringReplace } from '../../../helpers/helperFunctions';
import { AccountRequestV2 } from '../../../../models/api-models/Account';
import { CompanyService } from '../../../../services/companyService.service';
import { contriesWithCodes, IContriesWithCodes } from '../../../helpers/countryWithCodes';
import { ToasterService } from '../../../../services/toaster.service';
import { CompanyResponse, States, StatesRequest, StateList } from '../../../../models/api-models/Company';
import { CompanyActions } from '../../../../actions/company.actions';
import * as _ from '../../../../lodash-optimized';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { ShSelectComponent } from '../../../../theme/ng-virtual-select/sh-select.component';
import { IForceClear } from "../../../../models/api-models/Sales";
import { CountryRequest, OnboardingFormRequest } from "../../../../models/api-models/Common";
import { CommonActions } from '../../../../actions/common.actions';
import { GeneralActions } from "../../../../actions/general/general.actions";
import { IFlattenGroupsAccountsDetail } from 'apps/web-giddh/src/app/models/interfaces/flattenGroupsAccountsDetail.interface';
import * as googleLibphonenumber from 'google-libphonenumber';

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
    @Output() public submitClicked: EventEmitter<{ activeGroupUniqueName: string, accountRequest: AccountRequestV2 }> = new EventEmitter();
    @Output() public isGroupSelected: EventEmitter<string> = new EventEmitter();
    @ViewChild('autoFocus') public autoFocus: ElementRef;

    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public showOtherDetails: boolean = false;
    public partyTypeSource: IOption[] = [];
    public stateList: StateList[] = [];
    public states: any[] = [];
    public statesSource$: Observable<IOption[]> = observableOf([]);
    public companiesList$: Observable<CompanyResponse[]>;
    public activeCompany: CompanyResponse;
    public moreGstDetailsVisible: boolean = false;
    public gstDetailsLength: number = 3;
    public isMultipleCurrency: boolean = false;
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
    public phoneUtility: any = googleLibphonenumber.PhoneNumberUtil.getInstance();
    public isMobileNumberValid: boolean = false;
    public formFields: any[] = [];
    public isGstValid$: Observable<boolean>= observableOf(true);
    public GSTIN_OR_TRN: string;
    public selectedCountry: string;
    public selectedCountryCode: string;
    private flattenGroups$: Observable<IFlattenGroupsAccountsDetail[]>;
    public isStateRequired: boolean = false;
    public bankIbanNumberMaxLength: string = '18';
    public bankIbanNumberMinLength: string = '9';

    constructor(private _fb: FormBuilder, private store: Store<AppState>, private accountsAction: AccountsAction,
        private _companyService: CompanyService, private _toaster: ToasterService, private companyActions: CompanyActions, private commonActions: CommonActions, private _generalActions: GeneralActions) {
        this.companiesList$ = this.store.select(s => s.session.companies).pipe(takeUntil(this.destroyed$));
        this.flattenGroups$ = this.store.pipe(select(state => state.general.flattenGroups), takeUntil(this.destroyed$));

        this.getCountry();
        this.getCurrency();
        this.getCallingCodes();
        this.getPartyTypes();
        if (this.flatGroupsOptions === undefined) {
            this.getAccount();
        }
    }

    public ngOnInit() {
        if (this.activeGroupUniqueName === 'discount') {
            this.isDiscount = true;
            this.showBankDetail = false;
            this.isDebtorCreditor = false;
        } if (this.activeGroupUniqueName === 'sundrycreditors') {
            this.showBankDetail = true;
        }
        this.initializeNewForm();

        this.addAccountForm.get('hsnOrSac').valueChanges.subscribe(a => {
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
        this.addAccountForm.get('country').get('countryCode').valueChanges.subscribe(a => {

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
        this.addAccountForm.get('openingBalance').valueChanges.subscribe(a => { // as disccused with back end team bydefault openingBalanceType will be CREDIT
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
        this.store.select(p => p.session.companyUniqueName).pipe(distinctUntilChanged()).subscribe(a => {
            if (a) {
                this.companiesList$.pipe(take(1)).subscribe(companies => {
                    this.activeCompany = companies.find(cmp => cmp.uniqueName === a);
                    if (this.activeCompany.countryV2 !== undefined && this.activeCompany.countryV2 !== null) {
                        this.getStates(this.activeCompany.countryV2.alpha2CountryCode);
                    }
                });
            }
        });

        this.store.select(s => s.session).pipe(takeUntil(this.destroyed$)).subscribe((session) => {
            let companyUniqueName: string;
            if (session.companyUniqueName) {
                companyUniqueName = _.cloneDeep(session.companyUniqueName);
            }
            if (session.companies && session.companies.length) {
                let companies = _.cloneDeep(session.companies);
                let currentCompany = companies.find((company) => company.uniqueName === companyUniqueName);
                if (currentCompany) {
                    // set country
                    this.setCountryByCompany(currentCompany);
                    this.companyCurrency = _.clone(currentCompany.baseCurrency);
                    this.isMultipleCurrency = _.clone(currentCompany.isMultipleCurrency);
                    // if (this.isMultipleCurrency) {
                    //     this.addAccountForm.get('currency').enable();
                    // } else {
                    //     this.addAccountForm.get('currency').disable();
                    // }
                }
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
        this.flattenGroups$.subscribe(flattenGroups => {
            if (flattenGroups) {
                let items: IOption[] = flattenGroups.filter(grps => {
                    return grps.groupUniqueName === this.activeGroupUniqueName || grps.parentGroups.some(s => s.uniqueName === this.activeGroupUniqueName);
                }).map((m: any) => ({ value: m.groupUniqueName, label: m.groupName, additional: m.parentGroups }));
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
            email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
            companyName: [''],
            attentionTo: [''],
            description: [''],
            addresses: this._fb.array([]),
            country: this._fb.group({
                countryCode: ['', Validators.required]
            }),
            hsnOrSac: [''],
            currency: [''],
            hsnNumber: [{ value: '', disabled: false }],
            sacNumber: [{ value: '', disabled: false }],
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
            closingBalanceTriggerAmount: [Validators.compose([digitsOnly])],
            closingBalanceTriggerAmountType: ['CREDIT']
        });
    }

    public initialGstDetailsForm(): FormGroup {
        this.isStateRequired = this.checkActiveGroupCountry();

        let gstFields = this._fb.group({
            gstNumber: ['', Validators.compose([Validators.maxLength(15)])],
            address: ['', Validators.maxLength(120)],
            state: this._fb.group({
                code: [''],
                name: [''],
                stateGstCode: ['']
            }),
            stateCode: [{ value: '', disabled: false }, (this.isStateRequired) ? Validators.required : ""],
            isDefault: [false],
            isComposite: [false],
            partyType: ['NOT APPLICABLE']
        });
        return gstFields;
    }

    public resetGstStateForm() {
        this.forceClear$ = observableOf({ status: true });

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

    public getStateCode(gstForm: FormGroup, statesEle: ShSelectComponent) {
        let gstVal: string = gstForm.get('gstNumber').value;
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
                        if (this.formFields['taxName']) {
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
            let parsedNumber = this.phoneUtility.parse('+' + this.addAccountForm.get('mobileCode').value + ele.value, this.addAccountForm.get('country').get('countryCode').value);
            if (this.phoneUtility.isValidNumber(parsedNumber)) {
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
        if (this.stateList && accountRequest.addresses.length > 0 && !this.isHsnSacEnabledAcc) {
            let selectedStateObj = this.getStateGSTCode(this.stateList, accountRequest.addresses[0].stateCode);
            if (selectedStateObj) {
                accountRequest.addresses[0].stateCode = selectedStateObj.stateGstCode;
            }
        }
        delete accountRequest['addAccountForm'];

        if (!accountRequest.mobileNo) {
            accountRequest.mobileCode = '';
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
            accountRequest: this.addAccountForm.value
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
        if (event) {
            this.store.dispatch(this._generalActions.resetStatesList());
            this.store.dispatch(this.commonActions.resetOnboardingForm());
            this.getOnboardingForm(event.value);
            let phoneCode = event.additional;
            this.addAccountForm.get('mobileCode').setValue(phoneCode);
            let currencyCode = this.countryCurrency[event.value];
            this.addAccountForm.get('currency').setValue(currencyCode);
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
            let parent = event.additional;
            if (parent[1]) {
                this.isParentDebtorCreditor(parent[1].uniqueName);
            }
            this.isGroupSelected.emit(event.value);
            this.toggleStateRequired();
        }
    }
    public isParentDebtorCreditor(activeParentgroup: string) {
        if (activeParentgroup === 'sundrycreditors' || activeParentgroup === 'sundrydebtors') {
            const accountAddress = this.addAccountForm.get('addresses') as FormArray;
            this.isShowBankDetails(activeParentgroup);
            this.isDebtorCreditor = true;

            if (accountAddress.controls.length === 0) {
                this.addBlankGstForm();
            }
            if (!accountAddress.length) {
                this.addBlankGstForm();
            }

        } else {
            this.isDebtorCreditor = false;
            this.showBankDetail = false;
            this.addAccountForm.get('addresses').reset();
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
        this.store.dispatch(this.commonActions.GetOnboardingForm(onboardingFormRequest));
    }

    public getCurrency() {
        this.store.pipe(select(s => s.common.currencies), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res).forEach(key => {
                    this.currencies.push({ label: res[key].code, value: res[key].code });

                });
                this.currencySource$ = observableOf(this.currencies);
            } else {
                this.store.dispatch(this.commonActions.GetCurrency());
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
        if (this.activeCompany && this.activeCompany.countryV2 && this.activeCompany.countryV2.alpha2CountryCode === this.addAccountForm.get('country').get('countryCode').value &&
            this.isCreditorOrDebtor(this.activeGroupUniqueName)) {
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
            if (this.selectedCountryCode === 'IN') {
                trim = element.value.replace(/[^0-9]/g, '');
            } else {
                trim = element.value.replace(/[^a-zA-Z0-9]/g, '');
            }

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
                    const groups = [parentGroup.uniqueName, groupDetails.value]
                    return groups.includes('sundrydebtors') || groups.includes('sundrycreditors');
                });
            }
            return false;
        }
        return false;
    }
}

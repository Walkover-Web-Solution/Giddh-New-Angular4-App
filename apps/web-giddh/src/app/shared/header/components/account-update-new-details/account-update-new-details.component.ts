import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { digitsOnly } from '../../../helpers';
import { AccountsAction } from '../../../../actions/accounts.actions';
import { AppState } from '../../../../store';
import { select, Store, createSelector } from '@ngrx/store';
import { uniqueNameInvalidStringReplace } from '../../../helpers/helperFunctions';
import { AccountRequestV2, AccountResponseV2, IAccountAddress, AccountMoveRequest, AccountUnMergeRequest, AccountsTaxHierarchyResponse, AccountMergeRequest } from '../../../../models/api-models/Account';
import { CompanyService } from '../../../../services/companyService.service';
import { contriesWithCodes, IContriesWithCodes } from '../../../helpers/countryWithCodes';
import { ToasterService } from '../../../../services/toaster.service';
import { CompanyResponse, StateList, StatesRequest } from '../../../../models/api-models/Company';
import { CompanyActions } from '../../../../actions/company.actions';
import * as _ from '../../../../lodash-optimized';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { ShSelectComponent } from '../../../../theme/ng-virtual-select/sh-select.component';
import { IForceClear } from "../../../../models/api-models/Sales";
import { CountryRequest, OnboardingFormRequest } from "../../../../models/api-models/Common";
import { CommonActions } from '../../../../actions/common.actions';
import { GeneralActions } from "../../../../actions/general/general.actions";
import * as googleLibphonenumber from 'google-libphonenumber';
import { ModalDirective } from 'ngx-bootstrap';
import { AccountService } from 'apps/web-giddh/src/app/services/account.service';
import { GroupResponse } from 'apps/web-giddh/src/app/models/api-models/Group';
import { GroupWithAccountsAction } from 'apps/web-giddh/src/app/actions/groupwithaccounts.actions';
import { ApplyTaxRequest } from 'apps/web-giddh/src/app/models/api-models/ApplyTax';
import { IGroupsWithAccounts } from 'apps/web-giddh/src/app/models/interfaces/groupsWithAccounts.interface';
import { IFlattenGroupsAccountsDetail } from 'apps/web-giddh/src/app/models/interfaces/flattenGroupsAccountsDetail.interface';
import { DbService } from 'apps/web-giddh/src/app/services/db.service';
import { IDiscountList } from 'apps/web-giddh/src/app/models/api-models/SettingsDiscount';
import { AssignDiscountRequestForAccount } from 'apps/web-giddh/src/app/models/api-models/ApplyDiscount';
import { SettingsDiscountActions } from 'apps/web-giddh/src/app/actions/settings/discount/settings.discount.action';

@Component({
    selector: 'account-update-new-details',
    styles: [`

  `],
    templateUrl: './account-update-new-details.component.html',
    styleUrls: ['./account-update-new-details.component.scss'],
})

export class AccountUpdateNewDetailsComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    public addAccountForm: FormGroup;
    @Input() public activeGroupUniqueName: string;
    @Input() public flatGroupsOptions: IOption[];
    @Input() public fetchingAccUniqueName$: Observable<boolean>;
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
    @Input() public showDeleteButton: boolean = true;
    @Input() public accountDetails: any;
    @ViewChild('autoFocusUpdate') public autoFocusUpdate: ElementRef;
    public moveAccountForm: FormGroup;
    public taxGroupForm: FormGroup;
    @ViewChild('deleteMergedAccountModal') public deleteMergedAccountModal: ModalDirective;
    @ViewChild('moveMergedAccountModal') public moveMergedAccountModal: ModalDirective;

    public activeCompany: CompanyResponse;
    @Output() public submitClicked: EventEmitter<{ value: { groupUniqueName: string, accountUniqueName: string }, accountRequest: AccountRequestV2 }>
        = new EventEmitter();
    @Output() public deleteClicked: EventEmitter<any> = new EventEmitter();
    @Output() public isGroupSelected: EventEmitter<string> = new EventEmitter();
    public showOtherDetails: boolean = false;
    public partyTypeSource: IOption[] = [];
    public stateList: StateList[] = [];

    public states: any[] = [];
    public statesSource$: Observable<IOption[]> = observableOf([]);
    public isTaxableAccount$: Observable<boolean>;
    public companiesList$: Observable<CompanyResponse[]>;
    public companyTaxDropDown: Observable<IOption[]>;
    public moreGstDetailsVisible: boolean = false;
    public gstDetailsLength: number = 3;
    public isMultipleCurrency: boolean = false;
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
    public accounts$: Observable<IOption[]>;
    public stateGstCode: any[] = [];
    public phoneUtility: any = googleLibphonenumber.PhoneNumberUtil.getInstance();
    public isMobileNumberValid: boolean = false;
    public formFields: any[] = [];
    public isGstValid: boolean;
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
    private flattenGroups$: Observable<IFlattenGroupsAccountsDetail[]>;
    // private flattenGroups$: Observable<IFlattenGroupsAccountsDetail[]>;
    public isStateRequired: boolean = false;

    constructor(private _fb: FormBuilder, private store: Store<AppState>, private accountsAction: AccountsAction, private accountService: AccountService, private groupWithAccountsAction: GroupWithAccountsAction,
        private _settingsDiscountAction: SettingsDiscountActions, private _accountService: AccountService, private _dbService: DbService, private _toaster: ToasterService, private companyActions: CompanyActions, private commonActions: CommonActions, private _generalActions: GeneralActions) {
        this.companiesList$ = this.store.select(s => s.session.companies).pipe(takeUntil(this.destroyed$));
        this.discountList$ = this.store.select(s => s.settings.discount.discountList).pipe(takeUntil(this.destroyed$));
        this.activeAccount$ = this.store.select(state => state.groupwithaccounts.activeAccount).pipe(takeUntil(this.destroyed$));
        this.moveAccountSuccess$ = this.store.select(state => state.groupwithaccounts.moveAccountSuccess).pipe(takeUntil(this.destroyed$));
        this.activeAccountTaxHierarchy$ = this.store.select(state => state.groupwithaccounts.activeAccountTaxHierarchy).pipe(takeUntil(this.destroyed$));
        this.flattenGroups$ = this.store.pipe(select(state => state.general.flattenGroups), takeUntil(this.destroyed$));
        this.store.dispatch(this._settingsDiscountAction.GetDiscount());

        this.getCountry();
        this.getCurrency();
        this.getCallingCodes();
        this.getPartyTypes();
        if (this.flatGroupsOptions === undefined) {
            this.getAccount();
        }
        this.prepareTaxDropdown();
        this.getDiscountList();
        this.store.select(s => s.session).pipe(takeUntil(this.destroyed$)).subscribe((session) => {
            let companyUniqueName: string;
            if (session.companyUniqueName) {
                companyUniqueName = _.cloneDeep(session.companyUniqueName);
            }
            if (session.companies && session.companies.length) {
                let companies = _.cloneDeep(session.companies);
                let currentCompany = companies.find((company) => company.uniqueName === companyUniqueName);
                if (currentCompany) {
                    if (currentCompany.countryV2) {
                        this.selectedCompanyCountryName = currentCompany.countryV2.alpha2CountryCode + ' - ' + currentCompany.country;
                        this.companyCountry = currentCompany.countryV2.alpha2CountryCode;
                    }
                    this.companyCurrency = _.clone(currentCompany.baseCurrency);
                    this.isMultipleCurrency = _.clone(currentCompany.isMultipleCurrency);
                }
            }
        });
    }

    public ngOnInit() {
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

        // fill form with active account
        this.activeAccount$.pipe(takeUntil(this.destroyed$)).subscribe(acc => {
            if (acc) {
                if (acc && acc.parentGroups[0].uniqueName) {
                    let col = acc.parentGroups[0].uniqueName;
                    this.isHsnSacEnabledAcc = col === 'revenuefromoperations' || col === 'otherincome' || col === 'operatingcost' || col === 'indirectexpenses';
                    this.isGstEnabledAcc = !this.isHsnSacEnabledAcc;
                    this.activeGroupUniqueName = acc.parentGroups.length > 0 ? acc.parentGroups[acc.parentGroups.length - 1].uniqueName : '';
                    this.store.dispatch(this.groupWithAccountsAction.SetActiveGroup(this.activeGroupUniqueName));
                }

                let accountDetails: AccountRequestV2 = acc as AccountRequestV2;
                if (accountDetails.uniqueName) {
                    this._accountService.GetApplyDiscount(accountDetails.uniqueName).subscribe(response => {
                        this.selectedDiscounts = [];
                        this.forceClearDiscount$ = observableOf({ status: true });
                        if (response.status === 'success') {
                            if (response.body) {
                                if (response.body[accountDetails.uniqueName]) {
                                    let list = response.body[accountDetails.uniqueName];
                                    Object.keys(list).forEach(key => {
                                        let UniqueName = list[key]['discount']['uniqueName'];
                                        this.selectedDiscounts.push(UniqueName);
                                    });
                                }
                            }
                        }
                        _.uniq(this.selectedDiscounts);
                    });
                }

                accountDetails.addresses.forEach(address => {
                    address.state = address.state ? address.state : { code: '', stateGstCode: '', name: '' };
                    address.stateCodeName = address.state.code + " - " + address.state.name;
                });

                for (let i = 0; i <= 10; i++) {
                    this.removeGstDetailsForm(0);
                }

                this.addAccountForm.patchValue(accountDetails);
                if (accountDetails.currency) {
                    this.selectedCurrency = accountDetails.currency;
                    this.addAccountForm.get('currency').patchValue(this.selectedCurrency);
                } else {
                    this.selectedCurrency = this.companyCurrency;
                    this.addAccountForm.get('currency').patchValue(this.selectedCurrency);
                }
                if (accountDetails.country) {
                    if (accountDetails.country.countryCode) {
                        this.getStates(accountDetails.country.countryCode, accountDetails.currency);
                        this.getOnboardingForm(accountDetails.country.countryCode);
                        // let ss = this.getStateGSTCode(this.stateList, accountDetails.country.countryCode);
                    }
                }
                // render gst details if there's no details add one automatically
                if (accountDetails.addresses.length > 0) {
                    accountDetails.addresses.map(a => {
                        this.renderGstDetails(a, accountDetails.addresses.length);
                    });
                } else {
                    if (accountDetails.addresses.length === 0) {
                        this.addBlankGstForm();
                    }
                }

                // hsn/sac enable disable
                if (acc.hsnNumber) {
                    this.addAccountForm.get('sacNumber').disable();
                    this.addAccountForm.get('hsnNumber').enable();
                    this.addAccountForm.get('hsnOrSac').patchValue('hsn');
                } else if (acc.sacNumber) {
                    this.addAccountForm.get('hsnNumber').disable();
                    this.addAccountForm.get('sacNumber').enable();
                    this.addAccountForm.get('hsnOrSac').patchValue('sac');
                }
                this.openingBalanceTypeChnaged(accountDetails.openingBalanceType);
                this.addAccountForm.patchValue(accountDetails);
                if (accountDetails.mobileNo) {
                    if (accountDetails.mobileNo.indexOf('-') > -1) {
                        let mobileArray = accountDetails.mobileNo.split('-');
                        this.addAccountForm.get('mobileCode').patchValue(mobileArray[0]);
                        this.addAccountForm.get('mobileNo').patchValue(mobileArray[1]);
                    } else {
                        this.addAccountForm.get('mobileNo').patchValue(accountDetails.mobileNo);
                        this.addAccountForm.get('mobileCode').patchValue(accountDetails.mobileCode);
                    }
                } else {
                    this.addAccountForm.get('mobileNo').patchValue('');
                    this.addAccountForm.get('mobileCode').patchValue(this.selectedAccountCallingCode);  // if mobile no null then country calling cade will assign
                }

                this.toggleStateRequired();
            }

        });
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
        // this.flattenGroups$.subscribe(flattenGroups => {
        //     if (flattenGroups) {
        //         let items: IOption[] = flattenGroups.filter(grps => {
        //             return grps.groupUniqueName === this.activeGroupUniqueName || grps.parentGroups.some(s => s.uniqueName === this.activeGroupUniqueName);
        //         }).map(m => {
        //             return {
        //                 value: m.groupUniqueName, label: m.groupName
        //             }
        //         });
        //         this.flatGroupsOptions = items;
        //     }
        // });
        // get country code value change
        // this.addAccountForm.get('country').get('countryCode').valueChanges.subscribe(a => {

        //     if (a) {
        //         const addresses = this.addAccountForm.get('addresses') as FormArray;
        //         if (addresses.controls.length === 0) {
        //             this.addBlankGstForm();
        //         }
        //         // let addressFormArray = (this.addAccountForm.controls['addresses'] as FormArray);
        //         if (a !== 'IN') {
        //             this.isIndia = false;
        //             // Object.keys(addressFormArray.controls).forEach((key) => {
        //             //     if (parseInt(key) > 0) {
        //             //         addressFormArray.removeAt(1); // removing index 1 only because as soon as we remove any index, it automatically updates index
        //             //     }
        //             // });
        //         } else {
        //             if (addresses.controls.length === 0) {
        //                 this.addBlankGstForm();
        //             }
        //             this.isIndia = true;
        //         }

        //         // this.resetGstStateForm();
        //     }
        // });
        // get openingblance value changes
        this.addAccountForm.get('openingBalance').valueChanges.subscribe(a => {
            if (a && (a === 0 || a <= 0) && this.addAccountForm.get('openingBalanceType').value) {
                this.addAccountForm.get('openingBalanceType').patchValue('CREDIT');
            } else if (a && (a === 0 || a > 0) && this.addAccountForm.get('openingBalanceType').value === '') {
                this.addAccountForm.get('openingBalanceType').patchValue('CREDIT');
            }
        });
        // this.addAccountForm.get('foreignOpeningBalance').valueChanges.subscribe(a => {
        //     if (!a) {
        //         this.addAccountForm.get('foreignOpeningBalance').patchValue('0');
        //         this.addAccountForm.get('openingBalanceType').patchValue('CREDIT');
        //     }
        // });
        this.store.select(p => p.session.companyUniqueName).pipe(distinctUntilChanged()).subscribe(a => {
            if (a) {
                this.companiesList$.pipe(take(1)).subscribe(companies => {
                    this.activeCompany = companies.find(cmp => cmp.uniqueName === a);
                });
            }
        });


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

        if (this.autoFocusUpdate !== undefined) {
            setTimeout(() => {
                this.autoFocusUpdate.nativeElement.focus();
            }, 50);
        }

        this.store.pipe(select(s => s.common.onboardingform), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res.fields).forEach(key => {
                    this.formFields[res.fields[key].name] = [];
                    this.formFields[res.fields[key].name] = res.fields[key];
                });
                this.GSTIN_OR_TRN = res.fields[0].label;


                // Object.keys(res.applicableTaxes).forEach(key => {
                //     this.taxesList.push({ label: res.applicableTaxes[key].name, value: res.applicableTaxes[key].uniqueName, isSelected: false });
                // });
            }
        });
        this.addAccountForm.get('activeGroupUniqueName').setValue(this.activeGroupUniqueName);
        this.accountsAction.mergeAccountResponse$.subscribe(res => {
            if (this.selectedaccountForMerge.length > 0) {
                this.selectedaccountForMerge.forEach((element) => {
                    this.deleteFromLocalDB(element);
                });
            }
            this.selectedaccountForMerge = '';
        });
        this.isTaxableAccount$ = this.store.select(createSelector([
            (state: AppState) => state.groupwithaccounts.groupswithaccounts,
            (state: AppState) => state.groupwithaccounts.activeAccount],
            (groupswithaccounts, activeAccount) => {
                let result: boolean = false;
                if (groupswithaccounts && this.activeGroupUniqueName && activeAccount) {
                    result = this.getAccountFromGroup(groupswithaccounts, this.activeGroupUniqueName, false);
                } else {
                    result = false;
                }
                return result;
            }));
    }
    public deleteFromLocalDB(activeAccUniqueName?: string) {
        this._dbService.removeItem(this.activeCompany.uniqueName, 'accounts', activeAccUniqueName).then((res) => {
            if (res) {
                this.store.dispatch(this.groupWithAccountsAction.showAddNewForm());
            }
        }, (err: any) => {
        });
    }


    public ngAfterViewInit() {
        if (this.flatGroupsOptions === undefined) {
            this.getAccount();
        }
        this.taxHierarchy();
        let activegroupName = this.addAccountForm.get('activeGroupUniqueName').value;
        let selectedGroupDetails;

        this.flatGroupsOptions.forEach(res => {
            if (res.value === activegroupName) {
                selectedGroupDetails = res;
            }
        })
        if (selectedGroupDetails) {
            if (selectedGroupDetails.additional) {
                let parentGroup = selectedGroupDetails.additional.length > 1 ? selectedGroupDetails.additional[1] : { uniqueName: selectedGroupDetails.value };
                if (parentGroup) {
                    this.isParentDebtorCreditor(parentGroup.uniqueName);
                }
            }
        }
        this.prepareTaxDropdown();
    }

    public getAccountFromGroup(groupList: IGroupsWithAccounts[], uniqueName: string, result: boolean): boolean {
        if (result) {
            return result;
        }
        for (const el of groupList) {
            if (el.accounts) {
                if (el.uniqueName === uniqueName && (el.category === 'income' || el.category === 'expenses')) {
                    result = true;
                    break;
                }
            }
            if (el.groups) {
                result = this.getAccountFromGroup(el.groups, uniqueName, result);
                if (result) {
                    break;
                }
            }
        }
        return result;
    }

    public prepareTaxDropdown() {
        // prepare drop down for taxes
        this.companyTaxDropDown = this.store.select(createSelector([
            (state: AppState) => state.groupwithaccounts.activeAccount,
            (state: AppState) => state.groupwithaccounts.activeAccountTaxHierarchy,
            (state: AppState) => state.company.taxes],
            (activeAccount, activeAccountTaxHierarchy, taxes) => {
                let arr: IOption[] = [];
                if (taxes) {
                    if (activeAccount) {
                        let applicableTaxes = activeAccount.applicableTaxes.map(p => p.uniqueName);

                        // set isGstEnabledAcc or not
                        if (activeAccount.parentGroups[0].uniqueName) {
                            let col = activeAccount.parentGroups[0].uniqueName;
                            this.isHsnSacEnabledAcc = col === 'revenuefromoperations' || col === 'otherincome' || col === 'operatingcost' || col === 'indirectexpenses';
                            this.isGstEnabledAcc = !this.isHsnSacEnabledAcc;
                        }

                        if (activeAccountTaxHierarchy) {

                            if (activeAccountTaxHierarchy.inheritedTaxes) {
                                let inheritedTaxes = _.flattenDeep(activeAccountTaxHierarchy.inheritedTaxes.map(p => p.applicableTaxes)).map((j: any) => j.uniqueName);
                                let allTaxes = applicableTaxes.filter(f => inheritedTaxes.indexOf(f) === -1);
                                // set value in tax group form
                                this.taxGroupForm.setValue({ taxes: allTaxes });
                            } else {
                                this.taxGroupForm.setValue({ taxes: applicableTaxes });
                            }
                            return _.differenceBy(taxes.map(p => {
                                return { label: p.name, value: p.uniqueName };
                            }), _.flattenDeep(activeAccountTaxHierarchy.inheritedTaxes.map(p => p.applicableTaxes)).map((p: any) => {
                                return { label: p.name, value: p.uniqueName };
                            }), 'value');

                        } else {
                            // set value in tax group form
                            this.taxGroupForm.setValue({ taxes: applicableTaxes });

                            return taxes.map(p => {
                                return { label: p.name, value: p.uniqueName };
                            });

                        }
                    }
                }
                return arr;
            })).pipe(takeUntil(this.destroyed$));
    }
    public getDiscountList() {
        this.discountList$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.discountList = [];
                Object.keys(res).forEach(key => {
                    this.discountList.push({
                        label: res[key].name,
                        value: res[key].uniqueName,
                        isSelected: false
                    });
                });
            } else {
                this.store.dispatch(this._settingsDiscountAction.GetDiscount());
            }
        });
    }


    public onViewReady(ev) {
        let accountCountry = this.addAccountForm.get('country').get('countryCode').value;
        if (accountCountry) {
            if (accountCountry !== 'IN') {
                this.isIndia = false;
            } else {
                this.isIndia = true;
            }
            this.toggleStateRequired();
        }
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        if (addresses.controls.length === 0) {
            this.addBlankGstForm();
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
            email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
            companyName: [''],
            attentionTo: [''],
            description: [''],
            addresses: this._fb.array([]),
            country: this._fb.group({
                countryCode: ['']
            }),
            hsnOrSac: [''],
            currency: [''],
            hsnNumber: [{ value: '', disabled: false }],
            sacNumber: [{ value: '', disabled: false }],
            accountBankDetails: this._fb.array([
                this._fb.group({
                    bankName: [''],
                    bankAccountNo: [''],
                    ifsc: ['']
                })
            ]),
            cashFreeVirtualAccountData: this._fb.group({
                ifscCode: [''],
                name: [''],
                virtualAccountNumber: ['']
            }),
            closingBalanceTriggerAmount: [Validators.compose([digitsOnly])],
            closingBalanceTriggerAmountType: ['CREDIT']
        });
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
            partyType: ['NOT APPLICABLE']
        });

        if (val) {
            val.stateCode = val.state ? (val.state.code ? val.state.code : val.stateCode) : val.stateCode;
            gstFields.patchValue(val);
        }
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

    public addGstDetailsForm(value: string) {         // commented code because we no need GSTIN No. to add new address
        // if (value && !value.startsWith(' ', 0)) {
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        addresses.push(this.initialGstDetailsForm(null));
        if (addresses.length > 4) {
            this.moreGstDetailsVisible = false;
        }
        // } else {
        //     this._toaster.clearAllToaster();
        //     if (this.formFields['taxName']) {
        //         this._toaster.errorToast(`Please fill ${this.formFields['taxName'].label} field first`);
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
            addresses.push(this.initialGstDetailsForm(null));
        }
    }

    public renderGstDetails(addressObj: IAccountAddress = null, addressLength: any) {
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        if (addresses.length < addressLength) {
            addresses.push(this.initialGstDetailsForm(addressObj));
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

        if (gstVal.length !== 15) {
            gstForm.get('partyType').reset('NOT APPLICABLE');
        }

        if (gstVal.length >= 2) {
            this.statesSource$.pipe(take(1)).subscribe(state => {
                let stateCode = this.stateGstCode[gstVal.substr(0, 2)];

                let s = state.find(st => st.value === stateCode);
                if (s) {
                    gstForm.get('stateCode').patchValue(s.value);
                    gstForm.get('state').get('code').patchValue(s.value);

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
                gstForm.get('stateCode').patchValue(null);
                gstForm.get('state').get('code').patchValue(null);
            }


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

    public resetUpdateAccountForm() {
        const addresses = this.addAccountForm.get('addresses') as FormArray;
        const countries = this.addAccountForm.get('country') as FormGroup;
        addresses.reset();
        countries.reset();
        this.addAccountForm.reset();
        this.addBlankGstForm();
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
        if (this.accountDetails) {
            this.activeAccountName = this.accountDetails.uniqueName;
        } else {
            this.activeAccount$.pipe(take(1)).subscribe(a => this.activeAccountName = a.uniqueName);
        }
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

            accountRequest.addresses = accountRequest.addresses.map(f => {
                if (!f.partyType || f.partyType === '') {
                    f.partyType = 'NOT APPLICABLE';
                }
                return f;
            });

            if (accountRequest.mobileCode && accountRequest.mobileNo) {
                accountRequest.mobileNo = accountRequest.mobileNo;
                // delete accountRequest['mobileCode'];
            }
        }

        // if (this.showBankDetail) {
        //     if (!accountRequest['accountBankDetails'][0].bankAccountNo || !accountRequest['accountBankDetails'][0].ifsc) {
        //         accountRequest['accountBankDetails'] = [];
        //     }
        // } else {
        //     delete accountRequest['accountBankDetails'];
        // }

        if (!this.showVirtualAccount) {
            delete accountRequest['cashFreeVirtualAccountData'];
        }

        if (this.activeGroupUniqueName === 'discount') {
            delete accountRequest['addresses'];
        }
        // this.isShowBankDetails(this.activeGroupUniqueName);
        if (!this.showVirtualAccount) {
            delete accountRequest['cashFreeVirtualAccountData'];
        }
        if (!this.showBankDetail) {
            delete accountRequest['accountBankDetails'];
        }

        if (!accountRequest.currency) {
            this.selectedCurrency = this.companyCurrency;
            this.addAccountForm.get('currency').patchValue(this.selectedCurrency);
        }
        this.submitClicked.emit({
            value: { groupUniqueName: this.activeGroupUniqueName, accountUniqueName: this.activeAccountName },
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
    }

    public ngOnDestroy() {
        this.resetUpdateAccountForm();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public selectCountry(event: IOption) {
        if (event) {
            this.store.dispatch(this._generalActions.resetStatesList());
            this.store.dispatch(this.commonActions.resetOnboardingForm());
            let phoneCode = event.additional;
            this.addAccountForm.get('mobileCode').setValue(phoneCode);
            let currencyCode = this.countryCurrency[event.value];
            this.addAccountForm.get('currency').setValue(currencyCode);
            this.getStates(event.value);
            this.getOnboardingForm(event.value);
            this.toggleStateRequired();
        }
    }

    public selectedState(gstForm: FormGroup, event) {
        if (gstForm && event.label) {
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
        }
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

        if (ele.value) {
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
                this.isGstValid = false;
            } else {
                ele.classList.remove('error-box');
                this.isGstValid = true;
            }
        } else {
            ele.classList.remove('error-box');
        }
    }

    public getStates(countryCode, selectedAcountCurrency?: string) {
        this.store.dispatch(this._generalActions.resetStatesList());
        this.store.pipe(select(s => s.general.states), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.country) {
                    if (res.country.currency) {
                        this.selectedCountryCurrency = res.country.currency.code;
                        this.selectedAccountCallingCode = res.country.callingCode;
                        this.addAccountForm.get('currency').patchValue(selectedAcountCurrency);
                        if (!this.addAccountForm.get('mobileCode').value) {
                            this.addAccountForm.get('mobileCode').patchValue(this.selectedAccountCallingCode);
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

        this.store.dispatch(this.accountsAction.moveAccount(grpObject, activeAcc.uniqueName, this.activeGroupUniqueName));
        this.moveAccountForm.reset();
    }
    public mergeAccounts() {
        let activeAccount: AccountResponseV2 = null;
        this.activeAccount$.pipe(take(1)).subscribe(p => activeAccount = p);
        let finalData: AccountMergeRequest[] = [];
        if (this.selectedaccountForMerge.length) {
            this.selectedaccountForMerge.map((acc) => {
                let obj = new AccountMergeRequest();
                obj.uniqueName = acc;
                finalData.push(obj);
            });
            this.store.dispatch(this.accountsAction.mergeAccount(activeAccount.uniqueName, finalData));
            this.showDeleteMove = false;
        } else {
            this._toaster.errorToast('Please Select at least one account');
            return;
        }
    }
    public customMoveGroupFilter(term: string, item: IOption): boolean {
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1);
    }
    public setAccountForMoveFunc(v: string) {
        this.setAccountForMove = v;
        this.showDeleteMove = true;
    }

    public showDeleteMergedAccountModal(merge: string) {
        merge = merge.trim();
        this.deleteMergedAccountModalBody = `Are you sure you want to delete ${merge} Account ?`;
        this.selectedAccountForDelete = merge;
        this.deleteMergedAccountModal.show();
    }

    public hideDeleteMergedAccountModal() {
        this.deleteMergedAccountModal.hide();
    }

    public deleteMergedAccount() {
        let activeAccount: AccountResponseV2 = null;
        this.activeAccount$.pipe(take(1)).subscribe(p => activeAccount = p);
        let obj = new AccountUnMergeRequest();
        obj.uniqueNames = [this.selectedAccountForDelete];
        this.store.dispatch(this.accountsAction.unmergeAccount(activeAccount.uniqueName, obj));
        this.showDeleteMove = false;
        this.hideDeleteMergedAccountModal();
    }
    public loadAccountData() {
        let activeAccount: AccountResponseV2 = null;
        this.activeAccount$.pipe(take(1)).subscribe(p => {
            activeAccount = p;
            if (!this.showBankDetail) {
                if (p.parentGroups) {
                    p.parentGroups.forEach(grp => {
                        this.showBankDetail = grp.uniqueName === "sundrycreditors" ? true : false;
                        return;
                    });
                }
            }
        });

        this.accountService.GetFlattenAccounts().subscribe(a => {
            let accounts: IOption[] = [];
            if (a.status === 'success') {
                a.body.results.map(acc => {
                    accounts.push({ label: `${acc.name} (${acc.uniqueName})`, value: acc.uniqueName });
                });
                let accountIndex = accounts.findIndex(acc => acc.value === activeAccount.uniqueName);
                if (accountIndex > -1) {
                    accounts.splice(accountIndex, 1);
                }
            }
            this.accounts$ = observableOf(accounts);
        });
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
            //
            this.store.dispatch(this.companyActions.getTax());
            this.store.dispatch(this.accountsAction.getTaxHierarchy(activeAccount.uniqueName));
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
                            data.taxes.push(ttt.uniqueName);
                        });
                    });
                }
            });

            data.taxes.push.apply(data.taxes, this.taxGroupForm.value.taxes);
            data.uniqueName = activeAccount.uniqueName;
            this.store.dispatch(this.accountsAction.applyAccountTax(data));
        } else {
            // let data: ApplyTaxRequest = new ApplyTaxRequest();
            // data.isAccount = false;
            // data.taxes = [];
            // this.activeGroupTaxHierarchy$.take(1).subscribe((t) => {
            //   if (t) {
            //     t.inheritedTaxes.forEach(tt => {
            //       tt.applicableTaxes.forEach(ttt => {
            //         data.taxes.push(ttt.uniqueName);
            //       });
            //     });
            //   }
            // });
            // data.taxes.push(...(this.applyTaxSelect2.value as string[]));
            // data.uniqueName = activeGroup.uniqueName;
            // this.store.dispatch(this.groupWithAccountsAction.applyGroupTax(data));
        }
    }

    public showMoveMergedAccountModal() {
        this.moveMergedAccountModalBody = `Are you sure you want to move ${this.setAccountForMove} Account to ${this.selectedAccountForMove} ?`;
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
        this.store.dispatch(this.accountsAction.unmergeAccount(activeAccount.uniqueName, obj));
        this.showDeleteMove = false;
        this.hideDeleteMergedAccountModal();
        // this.accountForMoveSelect2.setElementValue('');
        this.hideMoveMergedAccountModal();
    }
    public getAccount() {
        this.flattenGroups$.subscribe(flattenGroups => {
            if (flattenGroups) {
                let items: IOption[] = flattenGroups.filter(grps => {
                    return grps.groupUniqueName === this.activeGroupUniqueName || grps.parentGroups.some(s => s.uniqueName === this.activeGroupUniqueName);
                }).map(m => {
                    return {
                        value: m.groupUniqueName, label: m.groupName, additional: m.parentGroups
                    }
                });
                this.flatGroupsOptions = items;
            }
        });
    }

    /**
     *
     *NOTE:---This is for apply discount for an account don't remove this commented code pending due to API Team is working on it
     * @memberof AccountUpdateNewDetailsComponent
     */
    // public applyDiscount(): void {
    //     if (this.accountDetails) {
    //         this.activeAccountName = this.accountDetails.uniqueName;
    //     } else {
    //         this.activeAccount$.pipe(take(1)).subscribe(a => this.activeAccountName = a.uniqueName);
    //     }
    //     if (this.activeAccountName) {
    //         _.uniq(this.selectedDiscounts);
    //         let assignDescountObject: AssignDiscountRequestForAccount = new AssignDiscountRequestForAccount();
    //         assignDescountObject.accountUniqueName = this.activeAccountName;
    //         assignDescountObject.discountUniqueNames = this.selectedDiscounts;
    //         this.store.dispatch(this.accountsAction.applyAccountDiscount(assignDescountObject));
    //     }
    // }

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
        if(this.activeCompany && this.activeCompany.countryV2 && this.activeCompany.countryV2.alpha2CountryCode === this.addAccountForm.get('country').get('countryCode').value && (this.activeGroupUniqueName === "sundrydebtors" || this.activeGroupUniqueName === "sundrycreditors")) {
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
            if(this.isStateRequired) {
                control.get('stateCode').setValidators([Validators.required]);
            } else {
                control.get('stateCode').setValidators(null);
            }
            control.get('stateCode').updateValueAndValidity();
            i++;
        }
        this.addAccountForm.controls['addresses'].updateValueAndValidity();
    }
}

import { Observable, of as observableOf, ReplaySubject, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { IOption } from '../../theme/ng-select/option.interface';
import { select, Store } from '@ngrx/store';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppState } from '../../store';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import * as _ from '../../lodash-optimized';
import { ToasterService } from '../../services/toaster.service';
import { Organization, States, StatesRequest } from '../../models/api-models/Company';
import { LocationService } from '../../services/location.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { animate, style, transition, trigger, state } from '@angular/animations';
import { currencyNumberSystems, digitAfterDecimal } from 'apps/web-giddh/src/app/shared/helpers/currencyNumberSystem';
import { CountryRequest, OnboardingFormRequest } from "../../models/api-models/Common";
import { GeneralActions } from '../../actions/general/general.actions';
import { CommonActions } from '../../actions/common.actions';
import { OrganizationType } from '../../models/user-login-state';
import { OrganizationProfile, SettingsAsideConfiguration, SettingsAsideFormType } from '../constants/settings.constant';
import { SettingsProfileService } from '../../services/settings.profile.service';
import { SettingsUtilityService } from '../services/settings-utility.service';
import { CommonService } from '../../services/common.service';
import { CompanyService } from '../../services/companyService.service';
import { GeneralService } from '../../services/general.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocaleService } from '../../services/locale.service';
import { BreakpointObserver } from '@angular/cdk/layout';
export interface IGstObj {
    newGstNumber: string;
    newstateCode: number;
    newstateName: string;
    newaddress: string;
    isDefault: boolean;
}

@Component({
    selector: 'setting-profile',
    templateUrl: './setting.profile.component.html',
    styleUrls: ['../../shared/header/components/company-add/company-add.component.scss', './setting.profile.component.scss'],
    host: { 'class': 'settings-profile' },
    animations: [
        trigger('fadeInAndSlide', [
            transition(':enter', [
                style({ opacity: '0', marginTop: '100px' }),
                animate('.1s ease-out', style({ opacity: '1', marginTop: '20px' })),
            ]),
        ]),
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})
export class SettingProfileComponent implements OnInit, OnDestroy {
    public countrySource: IOption[] = [];
    public countrySource$: Observable<IOption[]> = observableOf([]);
    public currencies: IOption[] = [];
    public currencySource$: Observable<IOption[]> = observableOf([]);
    public countryCurrency: any[] = [];
    /** Stores the current company details */
    public currentCompanyDetails: any;
    /** Stores the current branch details */
    public currentBranchDetails: any;
    /** Stores the company profile details */
    public companyProfileObj: OrganizationProfile | any = {
        name: '',
        uniqueName: '',
        companyName: '',
        logo: '',
        alias: '',
        parent: {},
        country: {
            countryName: '',
            currencyName: '',
            currencyCode: ''
        },
        businessTypes: [],
        businessType: '',
        nameAlias: '',
        headQuarterAlias: '',
        balanceDisplayFormat: '',
        taxType: '',
        manageInventory: false
    };
    public stateStream$: Observable<States[]>;
    public statesSource$: Observable<IOption[]> = observableOf([]);
    public addNewGstEntry: boolean = false;
    public newGstObj: any = {};
    public states: IOption[] = [];
    public statesInBackground: IOption[] = [];
    public isGstValid: boolean = false;
    public isPANValid: boolean = false;
    public isMobileNumberValid: boolean = false;
    public countryCode: string = '91';
    public gstDetailsBackup: object[] = null;
    public showAllGST: boolean = true;
    public countryIsIndia: boolean = false;
    public dataSource: any;
    public dataSourceBackup: any;
    public statesSourceCompany: IOption[] = [];
    public keyDownSubject$: Subject<any> = new Subject<any>();
    public gstKeyDownSubject$: Subject<any> = new Subject<any>();
    public dataToSave: object = {};
    public CompanySettingsObj: any = {};
    public numberSystemSource: IOption[] = [];
    public decimalDigitSource: IOption[] = [];
    public selectedState: any = '';
    public stateGstCode: any[] = [];
    public formFields: any[] = [];

    /** Observer to track get company profile API call in process */
    public getCompanyProfileInProgress$: Observable<boolean>;
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** Stores the current selected tab  */
    public currentTab: string = 'personal';
    /** Stores the company addresses */
    public addresses: Array<any> = [];
    /** Stores the pagination details of address component */
    public addressTabPaginationData = {
        page: 0,
        totalPages: 0,
        totalItems: 0,
        count: 0
    };
    /** Stores the address configuration */
    public addressConfiguration: SettingsAsideConfiguration = {
        type: SettingsAsideFormType.CreateAddress,
        stateList: [],
        tax: {
            name: '',
            validation: []
        },
        linkedEntities: []
    };
    /** True, if address API is in progress */
    public shouldShowAddressLoader: boolean;
    /** True, if search filter is applied */
    public isSearchFilterApplied: boolean;
    /** True, if address aside pane needs to be closed (after successful CREATE/UDPATE address) */
    public closeAddressSidePane: boolean;
    /** True, if create/update address is in progress */
    public isAddressChangeInProgress: boolean;
    /** Stores the current organization uniqueName */
    public currentOrganizationUniqueName: string;

    public imgPath: string = '';

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This holds the active locale */
    public activeLocale: string = "";
    /** This holds perforsonal information tab heading */
    public personalInformationTabHeading: string = "";
    /* This will store screen size */
    public isMobileScreen: boolean = false;

    constructor(
        private commonService: CommonService,
        private companyService: CompanyService,
        private changeDetectorRef: ChangeDetectorRef,
        private store: Store<AppState>,
        private settingsProfileActions: SettingsProfileActions,
        private _toasty: ToasterService,
        private _location: LocationService,
        private _generalActions: GeneralActions,
        private generalService: GeneralService,
        private commonActions: CommonActions,
        private settingsProfileService: SettingsProfileService,
        private settingsUtilityService: SettingsUtilityService,
        private router: Router,
        public route: ActivatedRoute,
        private localeService: LocaleService,
        private breakPointObservar: BreakpointObserver
    ) {

        this.breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        this.getCountry();
        this.getCurrency();

        currencyNumberSystems.map(currency => {
            this.numberSystemSource.push({ value: currency.value, label: `${currency.name}`, additional: currency });
        });
        digitAfterDecimal.map(decimal => {
            this.decimalDigitSource.push({ value: decimal.value, label: decimal.name });
        });
        this.getCompanyProfileInProgress$ = this.store.pipe(select(settingsStore => settingsStore.settings.getProfileInProgress), takeUntil(this.destroyed$));

    }

    /**
     * This will return page heading based on active tab
     *
     * @param {boolean} event
     * @memberof SettingProfileComponent
     */
     public getPageHeading(): string {

        if(this.isMobileScreen){
             if(this.currentTab === 'personal'){
                 this.personalInformationTabHeading;
             }
             else if(this.currentTab === 'address'){
                this.companyProfileObj?.taxType ? (this.localeData?.address + this.companyProfileObj?.taxType) : this.localeData?.addresses
             }
             else if(this.currentTab === 'other'){
                this.localeData?.other;
             }
        }
        else {
            return " ";
        }
    }

    public ngOnInit() {
        this.initProfileObj();
        this.dataSource = (text$: Observable<any>): Observable<any> => {
            return text$.pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((term: string) => {
                    if (term.startsWith(' ', 0)) {
                        return [];
                    }
                    return this._location.GetCity({
                        QueryString: this.companyProfileObj.city,
                        AdministratorLevel: undefined,
                        Country: undefined,
                        OnlyCity: true
                    }).pipe(catchError(e => {
                        return [];
                    }));
                }),
                map((res) => {
                    // let data = res.map(item => item.address_components[0].long_name);
                    let data = res.map(item => item.city);
                    this.dataSourceBackup = res;
                    return data;
                }),
                takeUntil(this.destroyed$));
        };

        this.keyDownSubject$
            .pipe(debounceTime(5000), distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe((event: any) => {
                this.patchProfile(this.dataToSave);
            });

        this.gstKeyDownSubject$
            .pipe(debounceTime(3000), distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe((event: any) => {
                if (this.isGstValid) {

                    // let addresses = [];
                    //
                    // for(let addressLoop = 0; addressLoop < this.companyProfileObj.addresses.length; addressLoop++) {
                    //   if(this.companyProfileObj.addresses[addressLoop].taxNumber && this.companyProfileObj.addresses[addressLoop].stateCode) {
                    //     addresses.push(this.companyProfileObj.addresses[addressLoop]);
                    //   }
                    // }

                    //this.patchProfile({addresses: addresses});
                    this.patchProfile({ addresses: this.companyProfileObj.addresses });
                }
            });
        this.store.pipe(select(appStore => appStore.common.onboardingform), takeUntil(this.destroyed$)).subscribe(res => {
            if (res && res.businessType) {
                this.companyProfileObj.businessTypes = res.businessType.map(businessType => ({
                    label: businessType, value: businessType
                }));
            }
        });

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.currentTab = (params['referrer']) ? params['referrer'] : "personal";
        });

        this.imgPath = (isElectron || isCordova) ? 'assets/images/warehouse-vector.svg' : AppUrl + APP_FOLDER + 'assets/images/warehouse-vector.svg';

        this.store.pipe(select(state => state.session.currentLocale), takeUntil(this.destroyed$)).subscribe(response => {
            if (this.activeLocale && this.activeLocale !== response?.value) {
                this.localeService.getLocale('settings/profile', response?.value).subscribe(response => {
                    this.localeData = response;
                    this.translationComplete(true);
                });
            }
            this.activeLocale = response?.value;
        });
    }

    public getInitialProfileData() {
        this.store.pipe(select(appStore => appStore.session.currentOrganizationDetails), takeUntil(this.destroyed$)).subscribe((organization: Organization) => {
            if (organization) {
                if (organization.type === OrganizationType.Branch) {
                    this.store.dispatch(this.settingsProfileActions.getBranchInfo());
                    this.currentOrganizationType = OrganizationType.Branch;
                } else if (organization.type === OrganizationType.Company) {
                    this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
                    this.currentOrganizationType = OrganizationType.Company;
                }
            } else {
                // Treat it as company
                this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
                this.currentOrganizationType = OrganizationType.Company;
            }

            this.loadAddresses('GET');
        });
    }

    public getInventorySettingData() {
        this.store.dispatch(this.settingsProfileActions.GetInventoryInfo());
    }

    public initProfileObj() {
        this.isGstValid = true;
        this.isPANValid = true;
        this.isMobileNumberValid = true;

        this.currentOrganizationUniqueName = this.generalService.currentBranchUniqueName || this.generalService.companyUniqueName;

        this.store.pipe(select(p => p.settings.inventory), takeUntil(this.destroyed$)).subscribe((o) => {
            if (o.profileRequest || 1 === 1) {
                let inventorySetting = _.cloneDeep(o);
                this.CompanySettingsObj = inventorySetting;
            }
        });

        this.store.pipe(select(appState => appState.settings.profile), takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.currentCompanyDetails = response;
                if (this.currentOrganizationType === OrganizationType.Company) {
                    this.handleCompanyProfileResponse(response);
                } else if (this.currentOrganizationType === OrganizationType.Branch) {
                    this.companyProfileObj = {
                        ...this.companyProfileObj,
                        country: {
                            countryName: response.countryV2 ? response.countryV2.countryName : '',
                            countryCode: response.countryV2 ? response.countryV2.alpha2CountryCode?.toLowerCase() : '',
                            currencyCode: response.countryV2 && response.countryV2.currency ? response.countryV2.currency.code : '',
                            currencyName: response.countryV2 && response.countryV2.currency ? response.countryV2.currency.symbol : ''
                        },
                        companyName: response.name,
                        balanceDecimalPlaces: response.balanceDecimalPlaces,
                        balanceDisplayFormat: response.balanceDisplayFormat
                    }
                }
            }
        });
        this.store.pipe(select(appState => appState.settings.currentBranch), takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.currentBranchDetails = response;
                if (this.currentOrganizationType === OrganizationType.Branch) {
                    this.handleBranchProfileResponse(response);
                }
            }
        });

        this.store.pipe(take(1)).subscribe(s => {
            if (s.session.user) {
                this.countryCode = s.session.user.countryCode ? s.session.user.countryCode : '91';
            }
        });

    }

    public addGst() {
        let addresses = _.cloneDeep(this.companyProfileObj.addresses);
        let gstNumber;
        let isValid;
        if (addresses && addresses.length) {
            gstNumber = addresses[addresses.length - 1].taxNumber;
            //isValid = (Number(gstNumber.substring(0, 2)) > 37 || Number(gstNumber.substring(0, 2)) < 1 || gstNumber.length !== 15) ? false : true;

            if (this.formFields['taxName']['regex'] !== "" && this.formFields['taxName']['regex'].length > 0) {
                for (let key = 0; key < this.formFields['taxName']['regex'].length; key++) {
                    let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                    if (regex.test(gstNumber)) {
                        isValid = true;
                        break;
                    }
                }
            } else {
                isValid = true;
            }
        } else {
            isValid = true;
        }

        if (isValid) {
            let companyDetails = _.cloneDeep(this.companyProfileObj);
            let newGstObj = {
                taxNumber: '',
                stateCode: '',
                stateName: '',
                address: '',
                isDefault: false
            };

            companyDetails.addresses.push(newGstObj);
            this.companyProfileObj = companyDetails;
        } else {
            this._toasty.errorToast('Please enter valid ' + this.formFields['taxName'].label + ' to add more ' + this.formFields['taxName'].label + ' details.');
        }
    }

    public stateSelected(v, indx) {
        let profileObj = _.cloneDeep(this.companyProfileObj);
        let selectedStateCode = v.value;
        let selectedState = this.states.find((state) => state.value === selectedStateCode);
        if (selectedState && selectedState.value) {
            profileObj.addresses[indx].stateName = '';
            this.companyProfileObj = profileObj;
        }
        this.checkGstDetails();
    }

    public updateProfile(data) {

        let dataToSave = _.cloneDeep(data);
        if (dataToSave.addresses.length > 0) {
            for (let entry of dataToSave.addresses) {
                if (!entry.taxNumber && !entry.stateCode && !entry.address) {
                    dataToSave.addresses = _.without(dataToSave.addresses, entry);
                }
            }
        }
        delete dataToSave.financialYears;
        delete dataToSave.activeFinancialYear;
        // dataToSave.contactNo = this.countryCode + '-' + dataToSave.contactNo;
        this.companyProfileObj = _.cloneDeep(dataToSave);
        if (this.gstDetailsBackup) {
            dataToSave.addresses = _.cloneDeep(this.gstDetailsBackup);
        }

        this.store.dispatch(this.settingsProfileActions.UpdateProfile(dataToSave));

    }

    public updateInventorySetting(data) {
        let dataToSaveNew = _.cloneDeep(this.CompanySettingsObj);
        dataToSaveNew.companyInventorySettings = { manageInventory: data };
        this.store.dispatch(this.settingsProfileActions.UpdateInventory(dataToSaveNew));
    }

    public removeGstEntry(indx) {
        let profileObj = _.cloneDeep(this.companyProfileObj);
        if (indx > -1) {
            profileObj.addresses.splice(indx, 1);
            if (this.gstDetailsBackup) {
                this.gstDetailsBackup.splice(indx, 1);
            }
        }
        this.companyProfileObj = profileObj;
        this.checkGstDetails();
    }

    public setGstAsDefault(indx, ev) {
        if (indx > -1 && ev.target.checked) {
            for (let entry of this.companyProfileObj.addresses) {
                entry.isDefault = false;
            }
            if (this.companyProfileObj.addresses && this.companyProfileObj.addresses[indx] && this.companyProfileObj.addresses[indx] && this.companyProfileObj.addresses[indx]) {
                this.companyProfileObj.addresses[indx].isDefault = true;
            }
        }
    }

    public getDefaultGstNumber() {
        if (this.companyProfileObj && this.companyProfileObj.addresses) {
            let profileObj = this.companyProfileObj;
            let defaultGstObjIndx;
            profileObj.addresses.forEach((obj, indx) => {
                if (profileObj.addresses[indx] && profileObj.addresses[indx].isDefault) {
                    defaultGstObjIndx = indx;
                }
            });
            return '';
        }
        return '';
    }

    // public checkGstNumValidation(ele: HTMLInputElement) {
    //   let isInvalid: boolean = false;
    //   if (ele.value) {
    //     if (ele.value.length !== 15 || (Number(ele.value.substring(0, 2)) < 1) || (Number(ele.value.substring(0, 2)) > 37)) {
    //       this._toasty.errorToast('Invalid GST number');
    //       ele.classList.add('error-box');
    //       this.isGstValid = false;
    //     } else {
    //       ele.classList.remove('error-box');
    //       this.isGstValid = true;
    //     }
    //   } else {
    //     ele.classList.remove('error-box');
    //   }
    // }

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
                this._toasty.errorToast('Invalid ' + this.formFields['taxName'].label);
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

    public setMainState(ele: HTMLInputElement) {
        this.companyProfileObj.state = Number(ele.value.substring(0, 2));
    }

    public setChildState(ele: HTMLInputElement, index: number) {
        let gstVal: string = ele.value;
        if (gstVal.length >= 2) {
            this.statesSource$.pipe(take(1)).subscribe(state => {
                let stateCode = this.stateGstCode[gstVal.substr(0, 2)];

                let s = state.find(st => st.value === stateCode);
                _.uniqBy(s, 'value');
                if (s) {
                    this.companyProfileObj.addresses[index].stateCode = s.value;
                } else {
                    this.companyProfileObj.addresses[index].stateCode = '';
                }
            });
        } else {
            this.companyProfileObj.addresses[index].stateCode = '';
        }
    }

    /**
     * onReset
     */
    public onReset() {
        this.initProfileObj();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public isValidPAN(ele: HTMLInputElement) {
        let panNumberRegExp = new RegExp(/[A-Za-z]{5}\d{4}[A-Za-z]{1}/g);
        if (ele.value) {
            if (ele.value.match(panNumberRegExp)) {
                ele.classList.remove('error-box');
                this.isPANValid = true;
                this.patchProfile({ panNumber: ele.value });
            } else {
                this.isPANValid = false;
                this._toasty.errorToast('Invalid PAN number');
                ele.classList.add('error-box');
            }
        }
    }

    public isValidMobileNumber(ele: HTMLInputElement) {
        if (ele.value) {
            if (ele.value.length > 9 && ele.value.length < 16) {
                ele.classList.remove('error-box');
                this.isMobileNumberValid = true;
            } else {
                this.isMobileNumberValid = false;
                this._toasty.errorToast('Invalid Contact number');
                ele.classList.add('error-box');
            }
        }
    }

    public onToggleAllGSTDetails() {
        if ((this.companyProfileObj.addresses.length === this.gstDetailsBackup.length) && (this.gstDetailsBackup.length === 3)) {
            this.gstDetailsBackup = null;
        } else {
            this.showAllGST = !this.showAllGST;
            if (this.gstDetailsBackup) {
                if (this.showAllGST) {
                    this.companyProfileObj.addresses = _.cloneDeep(this.gstDetailsBackup);
                } else {
                    this.companyProfileObj.addresses = this.companyProfileObj.addresses.slice(0, 3);
                }
            }
        }
    }

    /**
     * checkCountry
     */
    public checkCountry(event) {
        if (event) {
            let country: any = _.cloneDeep(this.companyProfileObj.country || '');
            country = country.toLocaleLowerCase();
            if (event.value === 'IN') {
                this.countryIsIndia = true;
                this.companyProfileObj.state = '';
            } else {
                this.countryIsIndia = false;
                this.companyProfileObj.state = '';
            }
            this.getStates(event.value);
            this.getOnboardingForm(event.value);
            this.patchProfile({ country: this.companyProfileObj.country });
        }
    }

    public selectState(event) {
        if (event) {
            this.patchProfile({ state: this.companyProfileObj.state });
        }
    }

    public changeEventOfForm(key: string) {
        this.patchProfile({ [key]: this.companyProfileObj[key] });
    }

    public checkGstDetails() {
        this.patchProfile({ addresses: this.companyProfileObj.addresses });
    }

    public patchProfile(obj) {
        for (let member in obj) {
            if (obj[member] === null) {
                obj[member] = '';
            }
        }
        if (obj.contactNo && !this.isMobileNumberValid) {
            delete obj['contactNo'];
        }
        this.store.dispatch(this.settingsProfileActions.PatchProfile(obj));
    }

    public typeaheadOnSelect(e: TypeaheadMatch): void {
        this.dataSourceBackup.forEach(item => {
            if (item.city === e.item) {
                this.companyProfileObj.country = item.country;
                this.patchProfile({ city: this.companyProfileObj.city });
            }
        });
    }

    public pushToUpdate(event) {
        setTimeout(() => {
            this.dataToSave[event.target.name] = this.companyProfileObj[event.target.name];
        }, 100);
    }
    /**
* checkNumberSystem
*/
    public checkNumberSystem(event) {
        if (event) {
            this.patchProfile({ balanceDisplayFormat: this.companyProfileObj.balanceDisplayFormat });
        }
    }

    public checkDigitAfterDecimal(event) {
        if (!event) {
            return;
        }
        this.patchProfile({ balanceDecimalPlaces: this.companyProfileObj.balanceDecimalPlaces });
    }

    public nameAlisPush(event) {
        if (!event) {
            return;
        }

        this.patchProfile({ nameAlias: this.companyProfileObj.nameAlias });
    }

    public savePincode(event) {
        this.patchProfile({ pincode: this.companyProfileObj.pincode });
    }

    public getCountry() {
        this.store.pipe(select(s => s.common.countries), takeUntil(this.destroyed$)).subscribe(res => {
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
                countryRequest.formName = 'onboarding';
                this.store.dispatch(this.commonActions.GetCountry(countryRequest));
            }
        });
    }

    public getStates(countryCode) {
        this.store.dispatch(this._generalActions.resetStatesList());

        this.store.pipe(select(s => s.general.states), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.states = [];
                this.statesInBackground = [];
                this.statesSourceCompany = [];

                Object.keys(res.stateList).forEach(key => {
                    this.states.push({ label: res.stateList[key].code + ' - ' + res.stateList[key].name, value: res.stateList[key].code });
                    this.statesInBackground.push({ label: res.stateList[key].code + ' - ' + res.stateList[key].name, value: res.stateList[key].code });
                    this.statesSourceCompany.push({ label: res.stateList[key].code + ' - ' + res.stateList[key].name, value: res.stateList[key].code });

                    if (this.companyProfileObj.state === res.stateList[key].code) {
                        this.selectedState = res.stateList[key].code + ' - ' + res.stateList[key].name;
                    }

                    if (res.stateList[key].stateGstCode !== null) {
                        this.stateGstCode[res.stateList[key].stateGstCode] = [];
                        this.stateGstCode[res.stateList[key].stateGstCode] = res.stateList[key].code;
                    }
                });
                this.statesSource$ = observableOf(this.states);
            } else {
                let statesRequest = new StatesRequest();
                statesRequest.country = countryCode;
                this.store.dispatch(this._generalActions.getAllState(statesRequest));
            }
        });
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

    public getOnboardingForm(countryCode) {
        this.store.pipe(select(s => s.common.onboardingform), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.fields) {
                    Object.keys(res.fields).forEach(key => {
                        if (res.fields[key]) {
                            this.formFields[res.fields[key].name] = [];
                            this.formFields[res.fields[key].name] = res.fields[key];
                        }
                    });
                }
            } else {
                let onboardingFormRequest = new OnboardingFormRequest();
                onboardingFormRequest.formName = 'onboarding';
                onboardingFormRequest.country = countryCode;
                this.store.dispatch(this.commonActions.GetOnboardingForm(onboardingFormRequest));
            }
        });
    }



    /**
     * This will return the state code/name if available
     *
     * @param {*} gst
     * @returns {string}
     * @memberof SettingProfileComponent
     */
    public getState(gst): string {
        let state = "";
        if (gst.stateCode) {
            state = gst.stateCode + " - " + gst.stateName;
        }
        return state;
    }

    /**
     * Handles save profile operation
     *
     * @param {*} value Value to be updated
     * @memberof SettingProfileComponent
     */
    public handleSaveProfile(value: any): void {
        if (this.currentOrganizationType === OrganizationType.Company) {
            if ('manageInventory' in value) {
                this.updateInventorySetting(value.manageInventory);
            } else {
                this.patchProfile({ ...value });
            }
        } else if (this.currentOrganizationType === OrganizationType.Branch) {
            this.updateBranchProfile();
        }
    }

    /**
     * Update branch profile handler
     *
     * @param {*} [params] Request payload for API
     * @memberof SettingProfileComponent
     */
    public updateBranchProfile(params?: any): void {
        this.currentBranchDetails.name = this.companyProfileObj.name;
        this.currentBranchDetails.alias = this.companyProfileObj.alias;
        this.settingsProfileService.updateBranchInfo(this.settingsUtilityService.getUpdateBranchRequestObject(params ? params : this.currentBranchDetails))
            .pipe(takeUntil(this.destroyed$))
            .subscribe(response => {
                if (response) {
                    if (response.status === 'success') {
                        this._toasty.successToast('Profile Updated Successfully.');
                    } else {
                        this._toasty.errorToast(response.message);
                    }
                }
            });
    }

    /**
     * Handles tab changes
     *
     * @param {string} tabName Current tab name
     * @memberof SettingProfileComponent
     */
    public handleTabChanged(tabName: string): void {
        this.currentTab = tabName;
        if (tabName === 'address') {
            this.loadAddresses('GET');
            this.loadLinkedEntities();
            if (this.currentCompanyDetails && this.currentCompanyDetails.countryV2) {
                this.loadTaxDetails(this.currentCompanyDetails.countryV2.alpha2CountryCode);
                this.loadStates(this.currentCompanyDetails.countryV2.alpha2CountryCode);
            }
        }
        this.router.navigateByUrl('/pages/settings/profile/' + tabName);
    }

    /**
     * Loads all the entities of an company
     *
     * @memberof SettingProfileComponent
     */
    public loadLinkedEntities(): void {
        this.settingsProfileService.getAllLinkedEntities().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body && response.status === 'success') {
                this.addressConfiguration.linkedEntities = response.body.map(result => ({
                    ...result,
                    isDefault: false,
                    label: result.alias,
                    value: result.uniqueName
                }));
            }
        });
    }

    /**
     * Loads all the states of a country
     *
     * @param {string} countryCode Country code
     * @memberof SettingProfileComponent
     */
    public loadStates(countryCode: string): void {
        this.companyService.getAllStates({ country: countryCode }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body && response.status === 'success') {
                const result = response.body;
                this.addressConfiguration.stateList = [];
                Object.keys(result.stateList).forEach(key => {
                    this.addressConfiguration.stateList.push({
                        label: result.stateList[key].code + ' - ' + result.stateList[key].name,
                        value: result.stateList[key].code,
                        code: result.stateList[key].stateGstCode,
                        stateName: result.stateList[key].name
                    });
                });
            }
        });
    }

    /**
     * Loads the tax details of a country (tax name, tax validation, etc.)
     *
     * @param {string} countryCode Country code
     * @memberof SettingProfileComponent
     */
    public loadTaxDetails(countryCode: string): void {
        let onboardingFormRequest = new OnboardingFormRequest();
        onboardingFormRequest.formName = 'onboarding';
        onboardingFormRequest.country = countryCode;
        this.commonService.getOnboardingForm(onboardingFormRequest).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response && response.status === 'success') {
                if (response.body && response.body.fields && response.body.fields.length > 0) {
                    const taxField = response.body.fields.find(field => field && field.name === 'taxName');
                    // Tax field found, support for the country taxation
                    this.addressConfiguration.tax.name = taxField ? taxField.label : '';
                    this.addressConfiguration.tax.validation = taxField ? taxField.regex : [];
                }
            }
        });
    }

    /**
     * Page change handler
     *
     * @param {*} event Page change event
     * @memberof SettingProfileComponent
     */
    public handlePageChanged(event: any): void {
        let method: string;
        delete event.itemsPerPage;
        let params = {
            ...event
        };
        if (this.isSearchFilterApplied) {
            method = 'POST';
        } else {
            method = 'GET';
        }
        this.loadAddresses(method, params);
    }

    /**
     * Handle search operation within address
     *
     * @param {*} event Search event
     * @memberof SettingProfileComponent
     */
    public handleSearchInAddress(event: any): void {
        this.isSearchFilterApplied = true;
        this.loadAddresses('POST', { ...event, page: 1 });
    }

    /**
     * Creates new address
     *
     * @param {*} addressDetails Address details
     * @memberof SettingProfileComponent
     */
    public createNewAddress(addressDetails: any): void {
        this.isAddressChangeInProgress = true;
        const chosenState = addressDetails.addressDetails.stateList.find(selectedState => selectedState.value === addressDetails.formValue.state);
        let linkEntity = addressDetails.addressDetails.linkedEntities.filter(entity => (addressDetails.formValue.linkedEntity.includes(entity.uniqueName))).map(filteredEntity => ({
            uniqueName: filteredEntity.uniqueName,
            isDefault: filteredEntity.isDefault,
            entity: filteredEntity.entity
        }));
        // if (this.currentOrganizationType === OrganizationType.Branch) {
        //     linkEntity.push({
        //         uniqueName: this.generalService.currentBranchUniqueName,
        //         isDefault: false,
        //         entity: 'BRANCH'
        //     });
        // }
        const requestObj = {
            taxNumber: addressDetails.formValue.taxNumber,
            stateCode: addressDetails.formValue.state,
            stateName: chosenState ? chosenState.stateName : '',
            address: addressDetails.formValue.address,
            name: addressDetails.formValue.name,
            pincode: addressDetails.formValue.pincode,
            linkEntity
        };

        this.settingsProfileService.createNewAddress(requestObj).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response.status === 'success') {
                this.closeAddressSidePane = true;
                if (this.currentOrganizationType === OrganizationType.Company) {
                    this.loadAddresses('GET');
                } else if (this.currentOrganizationType === OrganizationType.Branch) {
                    this.store.dispatch(this.settingsProfileActions.getBranchInfo());
                }
                this._toasty.successToast('Address created successfully');
            } else {
                this._toasty.errorToast(response.message);
            }
            this.isAddressChangeInProgress = false;
            this.changeDetectorRef.detectChanges();
        }, () => {
            this.isAddressChangeInProgress = false;
        });
    }

    /**
     * Update address
     *
     * @param {*} addressDetails Address details
     * @memberof SettingProfileComponent
     */
    public updateAddress(addressDetails: any): void {
        this.isAddressChangeInProgress = true;
        addressDetails.formValue.linkedEntity = addressDetails.formValue.linkedEntity || [];
        const chosenState = addressDetails.addressDetails.stateList.find(selectedState => selectedState.value === addressDetails.formValue.state);
        const linkEntity = addressDetails.addressDetails.linkedEntities.filter(entity => (addressDetails.formValue.linkedEntity.includes(entity.uniqueName))).map(filteredEntity => ({
            uniqueName: filteredEntity.uniqueName,
            isDefault: filteredEntity.isDefault,
            entity: filteredEntity.entity
        }));
        const requestObj = {
            taxNumber: addressDetails.formValue.taxNumber,
            stateCode: addressDetails.formValue.state,
            stateName: chosenState ? chosenState.stateName : '',
            address: addressDetails.formValue.address,
            name: addressDetails.formValue.name,
            pincode: addressDetails.formValue.pincode,
            uniqueName: addressDetails.formValue.uniqueName,
            linkEntity
        };
        this.settingsProfileService.updateAddress(requestObj).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response.status === 'success') {
                this.closeAddressSidePane = true;
                this.loadAddresses('GET');
                this._toasty.successToast('Address updated successfully');
            } else {
                this._toasty.errorToast(response.message);
            }
            this.isAddressChangeInProgress = false;
        }, () => {
            this.isAddressChangeInProgress = false;
        });
    }

    /**
     * Deletes addresss
     *
     * @param {*} addressDetails Address to be deleted
     * @memberof SettingProfileComponent
     */
    public handleDeleteAddress(addressDetails: any): void {
        this.settingsProfileService.deleteAddress(addressDetails.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.loadAddresses('GET');
            this._toasty.successToast('Address deleted successfully');
        });
    }

    /**
     * Handles address unlinking
     *
     * @param {*} addressDetails Address details
     * @memberof SettingProfileComponent
     */
    public handleAddressUnlinking(addressDetails: any): void {
        const requestObject = {
            name: this.currentBranchDetails.name,
            alias: this.currentBranchDetails.alias,
            linkAddresses: this.currentBranchDetails.addresses.filter(address => address.uniqueName !== addressDetails.uniqueName)
        }
        this.settingsProfileService.updateBranchInfo(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.store.dispatch(this.settingsProfileActions.getBranchInfo());
            this._toasty.successToast('Address unlinked successfully');
        });
    }

    /**
     * Handle default address
     *
     * @param {*} addressDetails Address details
     * @memberof SettingProfileComponent
     */
    public handleDefaultAddress(addressDetails: any): void {
        this.addresses.forEach(add => {
            if (add.uniqueName !== addressDetails.uniqueName) {
                add.isDefault = false;
            }
        })
        addressDetails.isDefault = !addressDetails.isDefault;
        const requestObject = {
            name: this.currentBranchDetails.name,
            alias: this.currentBranchDetails.alias,
            linkAddresses: this.currentBranchDetails.addresses.map(address => {
                if (address.uniqueName === addressDetails.uniqueName) {
                    address.isDefault = addressDetails.isDefault;
                } else {
                    address.isDefault = false;
                }
                return address;
            })
        }
        this.settingsProfileService.updateBranchInfo(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.store.dispatch(this.settingsProfileActions.getBranchInfo());
            this._toasty.successToast('Address updated successfully');
        });
    }

    /**
     * Handle company profile response
     *
     * @private
     * @param {*} response Company profile details
     * @memberof SettingProfileComponent
     */
    private handleCompanyProfileResponse(response: any): void {
        if (response.profileRequest || 1 === 1) {
            let profileObj = _.cloneDeep(response);
            if (profileObj.contactNo && profileObj.contactNo.indexOf('-') > -1) {
                profileObj.contactNo = profileObj.contactNo.substring(profileObj.contactNo.indexOf('-') + 1);
            }
            if (profileObj.addresses && profileObj.addresses.length > 3) {
                this.gstDetailsBackup = _.cloneDeep(profileObj.addresses);
                this.showAllGST = false;
                profileObj.addresses = profileObj.addresses.slice(0, 3);
            }

            if (profileObj.addresses && !profileObj.addresses.length) {
                let newGstObj = {
                    taxNumber: '',
                    stateCode: '',
                    stateName: '',
                    address: '',
                    isDefault: false
                };
                profileObj.addresses.push(newGstObj);
            }

            if (profileObj.countryV2 !== undefined && profileObj.countryV2.alpha2CountryCode !== undefined) {
                profileObj.country = profileObj.countryV2.alpha2CountryCode;
            }

            this.companyProfileObj = {
                ...this.companyProfileObj,
                name: profileObj.name,
                companyName: profileObj.name,
                headQuarterAlias: profileObj.headQuarterAlias,
                nameAlias: profileObj.nameAlias,
                uniqueName: profileObj.uniqueName,
                country: {
                    countryName: profileObj.countryV2 ? profileObj.countryV2.countryName : '',
                    countryCode: profileObj.countryV2 ? profileObj.countryV2.alpha2CountryCode?.toLowerCase() : '',
                    currencyCode: profileObj.countryV2 && profileObj.countryV2.currency ? profileObj.countryV2.currency.code : '',
                    currencyName: profileObj.countryV2 && profileObj.countryV2.currency ? profileObj.countryV2.currency.symbol : ''
                },
                businessType: profileObj.businessType,
                balanceDecimalPlaces: profileObj.balanceDecimalPlaces,
                balanceDisplayFormat: profileObj.balanceDisplayFormat,
                isMultipleCurrency: profileObj.isMultipleCurrency,
                manageInventory: this.CompanySettingsObj && this.CompanySettingsObj.companyInventorySettings ? this.CompanySettingsObj.companyInventorySettings.manageInventory : false
            };
            this.companyProfileObj.balanceDecimalPlaces = String(profileObj.balanceDecimalPlaces);

            if (profileObj && profileObj.country) {
                if (profileObj.countryV2 !== undefined && this.states.length === 0) {
                    this.getStates(profileObj.countryV2.alpha2CountryCode);
                    this.getOnboardingForm(profileObj.countryV2.alpha2CountryCode);
                }

                let countryName = profileObj.country.toLocaleLowerCase();
                if (countryName === 'india') {
                    this.countryIsIndia = true;
                }
            }
            this.checkCountry(false);
        }
    }

    /**
     * Handle branch profile response
     *
     * @private
     * @param {*} response Branch profile data
     * @memberof SettingProfileComponent
     */
    private handleBranchProfileResponse(response: any): void {
        if (response && response.name) {
            this.companyProfileObj = {
                ...this.companyProfileObj,
                name: response.name,
                parent: response.parentBranch,
                uniqueName: response.uniqueName,
                alias: response.alias,
                taxType: response.taxType,
                manageInventory: this.CompanySettingsObj && this.CompanySettingsObj.companyInventorySettings ? this.CompanySettingsObj.companyInventorySettings.manageInventory : false
            };
            this.addresses = this.settingsUtilityService.getFormattedBranchAddresses(response.addresses);
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Loads all the addresses of a company
     *
     * @private
     * @param {string} method Method name to make API call ('GET' for fetching and 'POST' for searching)
     * @param {*} [params] Request payload
     * @memberof SettingProfileComponent
     */
    private loadAddresses(method: string, params?: any): void {
        if (this.currentOrganizationType === OrganizationType.Company) {
            this.shouldShowAddressLoader = true;
            this.settingsProfileService.getCompanyAddresses(method, params).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                this.shouldShowAddressLoader = false;
                if (response && response.body && response.status === 'success') {
                    this.updateAddressPagination(response.body);
                    this.addresses = this.settingsUtilityService.getFormattedCompanyAddresses(response.body.results);
                }
            });
        }
    }

    /**
     * Updates address pagination when response is received
     *
     * @private
     * @param {*} response Response received
     * @memberof SettingProfileComponent
     */
    private updateAddressPagination(response: any): void {
        this.addressTabPaginationData.totalPages = response.totalPages;
        this.addressTabPaginationData.page = response.page;
        this.addressTabPaginationData.totalItems = response.totalItems;
        this.addressTabPaginationData.count = response.count;
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof SettingProfileComponent
     */
    public translationComplete(event: any): void {
        if(event) {
            this.store.pipe(select(appStore => appStore.session.currentOrganizationDetails), takeUntil(this.destroyed$)).subscribe((organization: Organization) => {
                if (organization) {
                    if (organization.type === OrganizationType.Branch) {
                        this.personalInformationTabHeading = this.localeData?.branch_information;
                    } else {
                        this.personalInformationTabHeading = this.localeData?.company_information;
                    }
                } else {
                    this.personalInformationTabHeading = this.localeData?.company_information;
                }
            });
        }
    }
}

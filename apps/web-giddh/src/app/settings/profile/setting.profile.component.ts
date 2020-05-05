import { Observable, of as observableOf, ReplaySubject, Subject } from 'rxjs';

import { catchError, debounceTime, distinctUntilChanged, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { IOption } from '../../theme/ng-select/option.interface';
import { select, Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { CompanyService } from '../../services/companyService.service';
import * as _ from '../../lodash-optimized';
import { ToasterService } from '../../services/toaster.service';
import { States, StatesRequest } from '../../models/api-models/Company';
import { LocationService } from '../../services/location.service';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { contriesWithCodes } from 'apps/web-giddh/src/app/shared/helpers/countryWithCodes';
import { animate, style, transition, trigger } from '@angular/animations';
import { currencyNumberSystems, digitAfterDecimal } from 'apps/web-giddh/src/app/shared/helpers/currencyNumberSystem';
import { CountryRequest, OnboardingFormRequest } from "../../models/api-models/Common";
import { GeneralActions } from '../../actions/general/general.actions';
import { CommonActions } from '../../actions/common.actions';

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
    styleUrls: ['../../shared/header/components/company-add/company-add.component.css', './setting.profile.component.scss'],
    animations: [
        trigger('fadeInAndSlide', [
            transition(':enter', [
                style({ opacity: '0', marginTop: '100px' }),
                animate('.1s ease-out', style({ opacity: '1', marginTop: '20px' })),
            ]),
        ]),
    ],
})
export class SettingProfileComponent implements OnInit, OnDestroy {

    public countrySource: IOption[] = [];
    public countrySource$: Observable<IOption[]> = observableOf([]);
    public currencies: IOption[] = [];
    public currencySource$: Observable<IOption[]> = observableOf([]);
    public countryCurrency: any[] = [];
    public companyProfileObj: any = {};
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

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    private stateResponse: States[] = null;

    constructor(
        private router: Router,
        private store: Store<AppState>,
        private settingsProfileActions: SettingsProfileActions,
        private _companyService: CompanyService,
        private _toasty: ToasterService,
        private _location: LocationService,
        private _generalActions: GeneralActions,
        private commonActions: CommonActions
    ) {

        this.getCountry();
        this.getCurrency();

        currencyNumberSystems.map(c => {
            this.numberSystemSource.push({ value: c.value, label: `${c.name}`, additional: c });
        });
        digitAfterDecimal.map(d => {
            this.decimalDigitSource.push({ value: d.value, label: d.name });
        });
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
                }));
        };

        this.keyDownSubject$
            .pipe(debounceTime(5000), distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe((event: any) => {
                this.patchProfile(this.dataToSave);
            });

        this.gstKeyDownSubject$
            .pipe(debounceTime(3000)
                , distinctUntilChanged()
                , takeUntil(this.destroyed$))
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
    }

    public getInitialProfileData() {
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
    }

    public getInventorySettingData() {
        this.store.dispatch(this.settingsProfileActions.GetInventoryInfo());
    }

    public initProfileObj() {
        this.isGstValid = true;
        this.isPANValid = true;
        this.isMobileNumberValid = true;
        // getting profile info from store
        // distinctUntilKeyChanged('profileRequest')

        this.store.select(p => p.settings.inventory).pipe(takeUntil(this.destroyed$)).subscribe((o) => {
            if (o.profileRequest || 1 === 1) {
                let inventorySetting = _.cloneDeep(o);
                this.CompanySettingsObj = inventorySetting;
            }
        });

        this.store.select(p => p.settings.profile).pipe(takeUntil(this.destroyed$)).subscribe((o) => {
            if (o.profileRequest || 1 === 1) {
                let profileObj = _.cloneDeep(o);
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

                this.companyProfileObj = profileObj;
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
        if(gst.stateCode) {
            state = gst.stateCode + " - " + gst.stateName;
        }
        return state;
    }
}

import { decimalDigits } from './../../shared/helpers/customValidationHelper';
import { digitAfterDecimal, currencyNumberSystems } from './../../shared/helpers/currencyNumberSystem';
import { Observable, of as observableOf, ReplaySubject, Subject } from 'rxjs';

import { catchError, debounceTime, distinctUntilChanged, distinctUntilKeyChanged, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { IOption } from '../../theme/ng-select/option.interface';
import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { CompanyService } from '../../services/companyService.service';
import * as _ from '../../lodash-optimized';
import { ToasterService } from '../../services/toaster.service';
import { States } from '../../models/api-models/Company';
import { LocationService } from '../../services/location.service';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { contriesWithCodes } from 'app/shared/helpers/countryWithCodes';
import { animate, style, transition, trigger } from '@angular/animations';

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
  styleUrls: ['../../shared/header/components/company-add/company-add.component.css'],
  animations: [
    trigger('fadeInAndSlide', [
      transition(':enter', [
        style({opacity: '0', marginTop: '100px'}),
        animate('.1s ease-out', style({opacity: '1', marginTop: '20px'})),
      ]),
    ]),
  ],
})
export class SettingProfileComponent implements OnInit, OnDestroy {

  public companyProfileObj: any = {};
  public stateStream$: Observable<States[]>;
  public statesSource$: Observable<IOption[]> = observableOf([]);
  public currencySource$: Observable<IOption[]> = observableOf([]);
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
  public countrySource: IOption[] = [];
  public statesSourceCompany: IOption[] = [];
  public keyDownSubject$: Subject<any> = new Subject<any>();
  public gstKeyDownSubject$: Subject<any> = new Subject<any>();
  public dataToSave: object = {};
  public CompanySettingsObj: any = {};
  public numberSystemSource: IOption[] = [];
  public decimalDigitSource: IOption[] = [];

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private stateResponse: States[] = null;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private settingsProfileActions: SettingsProfileActions,
    private _companyService: CompanyService,
    private _toasty: ToasterService,
    private _location: LocationService
  ) {
    this.stateStream$ = this.store.select(s => s.general.states).pipe(takeUntil(this.destroyed$));
    contriesWithCodes.map(c => {
      this.countrySource.push({value: c.countryName, label: `${c.countryflag} - ${c.countryName}`});
    });
    this.stateStream$.subscribe((data) => {
      if (data) {
        this.stateResponse = _.cloneDeep(data);
        data.map(d => {
          this.states.push({label: `${d.code} - ${d.name}`, value: d.code});
          this.statesInBackground.push({label: `${d.name}`, value: d.code});
          this.statesSourceCompany.push({label: `${d.name}`, value: `${d.name}`});
        });
      }
      this.statesSource$ = observableOf(this.states);
    }, (err) => {
      // console.log(err);
    });

    this.store.select(s => s.session.currencies).pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      let currencies: IOption[] = [];
      if (data) {
        data.map(d => {
          currencies.push({label: d.code, value: d.code});
        });
      }
      this.currencySource$ = observableOf(currencies);
    });
    currencyNumberSystems.map(c => {
      this.numberSystemSource.push({value: c.value , label: `${c.name}` , additional: c});
    });
    digitAfterDecimal.map(d => {
this.decimalDigitSource.push({value: d.value, label: d.name });
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
        this.patchProfile({gstDetails: this.companyProfileObj.gstDetails});
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
        if (profileObj.gstDetails && profileObj.gstDetails.length > 3) {
          this.gstDetailsBackup = _.cloneDeep(profileObj.gstDetails);
          this.showAllGST = false;
          profileObj.gstDetails = profileObj.gstDetails.slice(0, 3);
        }

        if (profileObj.gstDetails && !profileObj.gstDetails.length) {
          let newGstObj = {
            gstNumber: '',
            addressList: [{
              stateCode: '',
              stateName: '',
              address: '',
              isDefault: false
            }]
          };
          profileObj.gstDetails.push(newGstObj);
        }
        this.companyProfileObj = profileObj;
        // if (this.statesInBackground && this.statesInBackground.length) {
        //   let selectedState;
        //   if (profileObj.state) {
        //     selectedState = this.statesInBackground.find((state) => state.label.toLowerCase() === profileObj.state.toLowerCase());
        //   }
        //   if (selectedState) {
        //     profileObj.state = selectedState.value;
        //   }
        // } else {
        //   this.companyProfileObj = profileObj;
        // }

        if (profileObj && profileObj.country) {
          let countryName = profileObj.country.toLocaleLowerCase();
          if (countryName === 'india') {
            this.countryIsIndia = true;
          }
        }
        this.checkCountry(false);
        // this.selectState(false);
      }
    });
    this.store.pipe(take(1)).subscribe(s => {
      if (s.session.user) {
        this.countryCode = s.session.user.countryCode ? s.session.user.countryCode : '91';
      }
    });

  }

  public addGst() {
    let gstDetails = _.cloneDeep(this.companyProfileObj.gstDetails);
    let gstNumber;
    let isValid;
    if (gstDetails && gstDetails.length) {
      gstNumber = gstDetails[gstDetails.length - 1].gstNumber;
      isValid = (Number(gstNumber.substring(0, 2)) > 37 || Number(gstNumber.substring(0, 2)) < 1 || gstNumber.length !== 15) ? false : true;
    } else {
      isValid = true;
    }

    // this.isGstValid
    if (isValid) {
      let companyDetails = _.cloneDeep(this.companyProfileObj);
      let newGstObj = {
        gstNumber: '',
        addressList: [{
          stateCode: '',
          stateName: '',
          address: '',
          isDefault: false
        }]
      };

      companyDetails.gstDetails.push(newGstObj);
      this.companyProfileObj = companyDetails;
    } else {
      this._toasty.errorToast('Please enter valid GST number to add more GST details.');
    }
  }

  public stateSelected(v, indx) {
    let profileObj = _.cloneDeep(this.companyProfileObj);
    let selectedStateCode = v.value;
    let selectedState = this.states.find((state) => state.value === selectedStateCode);
    if (selectedState && selectedState.value) {
      profileObj.gstDetails[indx].addressList[0].stateName = '';
      this.companyProfileObj = profileObj;

      // this.checkGstDetails();
    }
  }

  public updateProfile(data) {

    let dataToSave = _.cloneDeep(data);
    if (dataToSave.gstDetails.length > 0) {
      // console.log('dataToSave.gstDetails is :', dataToSave.gstDetails);
      for (let entry of dataToSave.gstDetails) {
        if (!entry.gstNumber && entry.addressList && !entry.addressList[0].stateCode && !entry.addressList[0].address) {
          dataToSave.gstDetails = _.without(dataToSave.gstDetails, entry);
        }
      }
    }
    delete dataToSave.financialYears;
    delete dataToSave.activeFinancialYear;
    // dataToSave.contactNo = this.countryCode + '-' + dataToSave.contactNo;
    this.companyProfileObj = _.cloneDeep(dataToSave);
    if (this.gstDetailsBackup) {
      dataToSave.gstDetails = _.cloneDeep(this.gstDetailsBackup);
    }

    // if (this.countryIsIndia) {
    //   dataToSave.state = null;
    // }
    this.store.dispatch(this.settingsProfileActions.UpdateProfile(dataToSave));

  }

  public updateInventorySetting(data) {
    let dataToSaveNew = _.cloneDeep(this.CompanySettingsObj);
    dataToSaveNew.companyInventorySettings = {manageInventory: data};

    this.store.dispatch(this.settingsProfileActions.UpdateInventory(dataToSaveNew));

  }

  public removeGstEntry(indx) {
    let profileObj = _.cloneDeep(this.companyProfileObj);
    if (indx > -1) {
      profileObj.gstDetails.splice(indx, 1);
      if (this.gstDetailsBackup) {
        this.gstDetailsBackup.splice(indx, 1);
      }
    }
    this.companyProfileObj = profileObj;
    this.checkGstDetails();
  }

  public setGstAsDefault(indx, ev) {
    if (indx > -1 && ev.target.checked) {
      for (let entry of this.companyProfileObj.gstDetails) {
        entry.addressList[0].isDefault = false;
      }
      if (this.companyProfileObj.gstDetails && this.companyProfileObj.gstDetails[indx] && this.companyProfileObj.gstDetails[indx].addressList && this.companyProfileObj.gstDetails[indx].addressList[0]) {
        this.companyProfileObj.gstDetails[indx].addressList[0].isDefault = true;
      }
    }
  }

  public getDefaultGstNumber() {
    if (this.companyProfileObj && this.companyProfileObj.gstDetails) {
      let profileObj = this.companyProfileObj;
      let defaultGstObjIndx;
      profileObj.gstDetails.forEach((obj, indx) => {
        if (profileObj.gstDetails[indx] && profileObj.gstDetails[indx].addressList[0] && profileObj.gstDetails[indx].addressList[0].isDefault) {
          defaultGstObjIndx = indx;
        }
      });
      // console.log('defaultGstObjIndx is :', defaultGstObjIndx);
      return '';
    }
    return '';
  }

  public checkGstNumValidation(ele: HTMLInputElement) {
    let isInvalid: boolean = false;
    if (ele.value) {
      if (ele.value.length !== 15 || (Number(ele.value.substring(0, 2)) < 1) || (Number(ele.value.substring(0, 2)) > 37)) {
        this._toasty.errorToast('Invalid GST number');
        ele.classList.add('error-box');
        this.isGstValid = false;
      } else {
        ele.classList.remove('error-box');
        this.isGstValid = true;
        // this.checkGstDetails();
      }
    } else {
      ele.classList.remove('error-box');
    }
  }

  public setMainState(ele: HTMLInputElement) {
    this.companyProfileObj.state = Number(ele.value.substring(0, 2));
  }

  public setChildState(ele: HTMLInputElement, index: number) {
    let stateCode: any = Number(ele.value.substring(0, 2));
    if (stateCode <= 37) {
      if (stateCode < 10 && stateCode !== 0) {
        stateCode = (stateCode < 10) ? '0' + stateCode.toString() : stateCode.toString();
      } else if (stateCode === 0) {
        stateCode = '';
      }
      this.companyProfileObj.gstDetails[index].addressList[0].stateCode = stateCode.toString();
    } else {
      this.companyProfileObj.gstDetails[index].addressList[0].stateCode = '';
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
        this.patchProfile({panNumber: ele.value});
      } else {
        this.isPANValid = false;
        this._toasty.errorToast('Invalid PAN number');
        ele.classList.add('error-box');
      }
    }
  }

  public isValidMobileNumber(ele: HTMLInputElement) {
    // [0-9]{2,4}-{0,1}[0-9]{8,15}
    let mobileNumberRegExp = new RegExp(/[0-9]{2,4}-{0,1}[0-9]{8,15}/g);
    if (ele.value) {
      if (ele.value.match(mobileNumberRegExp) && ele.value.length === 10) {
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
    if ((this.companyProfileObj.gstDetails.length === this.gstDetailsBackup.length) && (this.gstDetailsBackup.length === 3)) {
      this.gstDetailsBackup = null;
    } else {
      this.showAllGST = !this.showAllGST;
      if (this.gstDetailsBackup) {
        if (this.showAllGST) {
          this.companyProfileObj.gstDetails = _.cloneDeep(this.gstDetailsBackup);
        } else {
          this.companyProfileObj.gstDetails = this.companyProfileObj.gstDetails.slice(0, 3);
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
      if (event.value === 'India') {
        this.countryIsIndia = true;
        this.companyProfileObj.state = '';
      } else {
        this.countryIsIndia = false;
        this.companyProfileObj.state = '';
      }
      this.patchProfile({country: this.companyProfileObj.country});
    }
  }

  public selectState(event) {
    if (event) {
      this.patchProfile({state: this.companyProfileObj.state});
    }
  }

  public changeEventOfForm(key: string) {
    this.patchProfile({[key]: this.companyProfileObj[key]});
  }

  public checkGstDetails() {
    this.patchProfile({gstDetails: this.companyProfileObj.gstDetails});
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
        this.patchProfile({city: this.companyProfileObj.city});
        // set country and state values
        // try {
        //   item.address_components.forEach(address => {
        //     let stateIdx = _.indexOf(address.types, 'administrative_area_level_1');
        //     let countryIdx = _.indexOf(address.types, 'country');
        //     if (stateIdx !== -1) {
        //       if (this.stateResponse) {
        //         let selectedState = this.stateResponse.find((state: States) => state.name === address.long_name);
        //         if (selectedState) {
        //           this.companyProfileObj.state = selectedState.code;
        //         }
        //       }
        //     }
        //     if (countryIdx !== -1) {
        //       this.companyProfileObj.country = address.long_name;
        //     }
        //   });
        // } catch (e) {
        //   console.log(e);
        // }
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
     this.patchProfile({balanceDisplayFormat: this.companyProfileObj.balanceDisplayFormat});
    }
  }

   public checkDigitAfterDecimal(event) {
     if (!event) {
      return;
     }
    this.patchProfile({balanceDecimalPlaces: this.companyProfileObj.balanceDecimalPlaces});
  }
   public nameAlisPush(event) {
     if (!event) {
      return;
     }

    this.patchProfile({nameAlias: this.companyProfileObj.nameAlias});
  }
}

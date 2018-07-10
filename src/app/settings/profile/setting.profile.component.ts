import { IOption } from '../../theme/ng-select/option.interface';
import { Store } from '@ngrx/store';
import { animate, Component, OnDestroy, OnInit, style, transition, trigger } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { CompanyService } from '../../services/companyService.service';
import { Observable } from 'rxjs/Observable';
import * as _ from '../../lodash-optimized';
import { ToasterService } from '../../services/toaster.service';
import { Select2OptionData } from '../../theme/select2';
import { States } from '../../models/api-models/Company';
import { setTimeout } from 'timers';
import { LocationService } from '../../services/location.service';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { contriesWithCodes } from 'app/shared/helpers/countryWithCodes';

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
        style({ opacity: '0', marginTop: '100px' }),
        animate('.1s ease-out', style({ opacity: '1', marginTop: '20px' })),
      ]),
    ]),
  ],
})
export class SettingProfileComponent  implements OnInit, OnDestroy {

  public companyProfileObj: any = null;
  public stateStream$: Observable<States[]>;
  public statesSource$: Observable<IOption[]> = Observable.of([]);
  public currencySource$: Observable<IOption[]> = Observable.of([]);
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
    this.stateStream$ = this.store.select(s => s.general.states).takeUntil(this.destroyed$);
    contriesWithCodes.map(c => {
          this.countrySource.push({value: c.countryName, label: `${c.countryflag} - ${c.countryName}`});
        });
    this.stateStream$.subscribe((data) => {
      if (data) {
        this.stateResponse = _.cloneDeep(data);
        data.map(d => {
          this.states.push({ label: `${d.code} - ${d.name}`, value: d.name });
          this.statesInBackground.push({ label: `${d.name}`, value: d.name });
        });
      }
      this.statesSource$ = Observable.of(this.states);
    }, (err) => {
      // console.log(err);
    });

    this.store.select(s => s.session.currencies).takeUntil(this.destroyed$).subscribe((data) => {
      let currencies: IOption[] = [];
      if (data) {
        data.map(d => {
          currencies.push({ label: d.code, value: d.code });
        });
      }
      this.currencySource$ = Observable.of(currencies);
    });
  }

  public ngOnInit() {
    this.initProfileObj();

    this.dataSource = (text$: Observable<any>): Observable<any> => {
      return text$
        .debounceTime(300)
        .distinctUntilChanged()
        .switchMap((term: string) => {
          if (term.startsWith(' ', 0)) {
            return [];
          }
          return this._location.GetCity({
            QueryString: this.companyProfileObj.city,
            AdministratorLevel: undefined,
            Country: undefined,
            OnlyCity: true
          }).catch(e => {
            return [];
          });
        })
        .map((res) => {
          // let data = res.map(item => item.address_components[0].long_name);
          let data = res.map(item => item.city);
          this.dataSourceBackup = res;
          return data;
        });
    };
  }

  public getInitialProfileData() {
    this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
  }

  public initProfileObj() {
    this.isGstValid = true;
    this.isPANValid = true;
    this.isMobileNumberValid = true;
    // getting profile info from store
    this.store.select(p => p.settings.profile).takeUntil(this.destroyed$).subscribe((o) => {
      if (o) {
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
        this.selectState(false);
      }
    });
    this.store.take(1).subscribe(s => {
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
      profileObj.gstDetails[indx].addressList[0].stateName = selectedState.value;
      this.companyProfileObj = profileObj;
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

  public removeGstEntry(indx) {
    let profileObj = _.cloneDeep(this.companyProfileObj);
    if (indx > -1) {
      profileObj.gstDetails.splice(indx, 1);
      if (this.gstDetailsBackup) {
        this.gstDetailsBackup.splice(indx, 1);
      }
    }
    this.companyProfileObj = profileObj;
  }

  public setGstAsDefault(indx, ev) {
    if (indx > -1 && ev.target.checked) {
      for (let entry of this.companyProfileObj.gstDetails) {
        entry.addressList[0].isDefault = false;
      }
      this.companyProfileObj.gstDetails[indx].addressList[0].isDefault = true;
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
      } else {
        this.isPANValid = false;
        this._toasty.errorToast('Invalid PAN number');
        ele.classList.add('error-box');
      }
    }
  }

  public isValidMobileNumber(ele: HTMLInputElement) {
    let mobileNumberRegExp = new RegExp(/^\d+$/);
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
    }
  }

  public selectState(event) {
    if (event) {
      //
    }
  }

  public typeaheadOnSelect(e: TypeaheadMatch): void {
    this.dataSourceBackup.forEach(item => {
      if (item.city === e.item) {
        this.companyProfileObj.country = item.country;
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
}

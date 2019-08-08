import { Observable, of as observableOf, ReplaySubject, Subject } from 'rxjs';

import { takeUntil, debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { IOption } from '../theme/ng-select/option.interface';
import { States, CompanyRequest, CompanyCreateRequest } from '../models/api-models/Company';
import * as _ from '../lodash-optimized';
import { Store } from '@ngrx/store';
import { AppState } from '../store';
import { contriesWithCodes } from '../shared/helpers/countryWithCodes';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { Router } from '@angular/router';
import { GeneralService } from '../services/general.service';
import { ToasterService } from '../services/toaster.service';
import { FormGroup } from '@angular/forms';
import { ShSelectComponent } from '../theme/ng-virtual-select/sh-select.component';
import { CompanyActions } from '../actions/company.actions';

@Component({
  selector: 'welcome-component',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})

export class WelcomeComponent implements OnInit, OnDestroy, AfterViewInit {
  public companyProfileObj: any = null;
  public countryCodeList: IOption[] = [];
  public company: any = {};
  public createNewCompany: any = {};
  public statesSource$: Observable<IOption[]> = observableOf([]);
  public stateStream$: Observable<States[]>;
  public states: IOption[] = [];
  public countryIsIndia: boolean = false;
  public selectedBusinesstype: string = '';
  public selectedstateName: string = '';
  public selectedCountry = '';
  //public gstKeyDownSubject$: Subject<any> = new Subject<any>();
  public isGstValid: boolean;
  public countrySource: IOption[] = [];
  public currencies: IOption[] = [];
  public countryPhoneCode: IOption[] = [];
  public currencySource$: Observable<IOption[]> = observableOf([]);
  public industrialList: IOption[] = [{
    label: 'Agriculture',
    value: 'Agriculture'
  }, {
    label: 'Automobile Transport',
    value: 'Automobile Transport'
  }, {
    label: 'Ecommerce',
    value: 'Ecommerce'
  }, {
    label: 'Education',
    value: 'Education'
  }, {
    label: 'Financial Institution',
    value: 'Financial Institution'
  }, {
    label: 'Gym',
    value: 'Gym'
  }, {
    label: 'Hospitality',
    value: 'Hospitality'
  }, {
    label: 'IT Company',
    value: 'IT Company'
  }, {
    label: 'Lifestyle Clubs',
    value: 'Lifestyle Clubs'
  }, {
    label: 'Logistics',
    value: 'Logistics'
  }, {
    label: 'Marriage Bureau',
    value: 'Marriage Bureau'
  }, {
    label: 'Media  Advertisement',
    value: 'Media  Advertisement'
  }, {
    label: 'Personal Use',
    value: 'Personal Use'
  }, {
    label: 'Political',
    value: 'Political'
  }, {
    label: 'Public Sector',
    value: 'Public Sector'
  }, {
    label: 'Real estate',
    value: 'Real estate'
  }, {
    label: 'Retail FMCG',
    value: 'Retail FMCG'
  }, {
    label: 'Stock and Commodity',
    value: 'Stock and Commodity'
  }, {
    label: 'Telecom',
    value: 'Telecom'
  }, {
    label: 'Tips And Alert',
    value: 'Tips And Alert'
  }, {
    label: 'Travel',
    value: 'Travel'
  }, {
    label: 'Wholesalers Distributors',
    value: 'Wholesalers Distributors'
  }
  ];
  public createNewCompanyPreparedObj: CompanyCreateRequest = {
        name: '',
        country: '',
        phoneCode: '',
        contactNo: '',
        uniqueName: '',
        isBranch: false,
        subscriptionRequest: null,
        gstDetails: [],
        bussinessNature: '',
        bussinessType: '',
        address: '',
        industry: '',
        baseCurrency: '',
        isMultipleCurrency: false,
        city: '',
        pincode: '',
        email: '',
        taxes: [],
        billingDetails: null,
        nameAlias: '',
  }
  public updateProfileSuccess$: Observable<boolean>;
  public businessType: IOption[] = [
    { label: 'Unregister', value: 'unregistered' },
    { label: 'Register', value: 'registered' }
  ];

  public taxesoptions: IOption[] = [
    { label: 'TCS', value: 'TCS Tax' },
    { label: 'TDS', value: 'TDS Tax' },
  ];
  public BusinessOptions: IOption[] = [
    { label: 'Food', value: 'food' },
    { label: 'Service', value: 'service' },
     { label: 'Manufacturing', value: 'manufacturing' },
    { label: 'Retail', value: 'retail' },
  ];


  public hideTextarea = true;
  public collapseTextarea = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private settingsProfileActions: SettingsProfileActions,
    private _router: Router, private _generalService: GeneralService, private _toasty: ToasterService,private companyActions: CompanyActions) {
    this.companyProfileObj = {};

    contriesWithCodes.map(c => {
      this.countrySource.push({value: c.countryName, label: `${c.countryflag} - ${c.countryName}`});
    });
     // Country phone Code
    contriesWithCodes.map(c => {
      this.countryPhoneCode.push({value: c.value, label: c.value});
    });

    this.stateStream$ = this.store.select(s => s.general.states).pipe(takeUntil(this.destroyed$));
    this.stateStream$.subscribe((data) => {
      if (data) {
        data.map(d => {
          this.states.push({label: `${d.code} - ${d.name}`, value: d.code});
        });
      }
      this.statesSource$ = observableOf(this.states);
    }, (err) => {
      // console.log(err);
    });
    this.store.select(state => {
      if (!state.session.companies) {
        return;
      }
      state.session.companies.forEach(cmp => {
        if (cmp.uniqueName === state.session.companyUniqueName) {
          this.countryIsIndia = cmp.country.toLocaleLowerCase() === 'india';

          if (cmp.country && this.companyProfileObj && !this.companyProfileObj.country) {
            this.selectedCountry = cmp.country;
            this.autoSelectCountryCode(cmp.country);
          }
        }
      });
    }).pipe(takeUntil(this.destroyed$)).subscribe();
    this.updateProfileSuccess$ = this.store.select(s => s.settings.updateProfileSuccess).pipe(takeUntil(this.destroyed$));
     // GET APPLICABLE TAXES
   // this.store.dispatch(this.companyActions.GetApplicableTaxes());
    this.store.select(s => s.session.currencies).pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      this.currencies = [];
      if (data) {
        data.map(d => {
          this.currencies.push({label: d.code, value: d.code});
        });
      }
      this.currencySource$ = observableOf(this.currencies);
    });

  }

  public ngOnInit() {
    if(this._generalService.createNewCompany) {
      this.createNewCompany = this._generalService.createNewCompany;
      this.company = this.createNewCompany;
      if(this.company) {
      this.createNewCompanyPreparedObj.name = this.company.name ? this.company.name : '';
      this.createNewCompanyPreparedObj.phoneCode = this.company.phoneCode ? this.company.phoneCode : '';
      this.createNewCompanyPreparedObj.contactNo = this.company.contactNo ? this.company.contactNo : '';
      this.createNewCompanyPreparedObj.uniqueName = this.company.uniqueName ? this.company.uniqueName: '';
      this.createNewCompanyPreparedObj.isBranch = this.company.isBranch ?this.company.isBranch :'';
      this.createNewCompanyPreparedObj.country = this.company.country? this.company.country: '';
      this.createNewCompanyPreparedObj.baseCurrency = this.company.baseCurrency? this.company.baseCurrency:''; 
      }
     
    }
   
    this.updateProfileSuccess$.subscribe(s => {
      if (s) {
        this._router.navigate(['/select-plan']);
      }
    });

    // this.gstKeyDownSubject$
    //   .pipe(debounceTime(3000)
    //     , distinctUntilChanged()
    //     , takeUntil(this.destroyed$))
    //   .subscribe((event: any) => {
    //     if (this.isGstValid) {
    //     this.patchProfile({gstDetails: this.companyProfileObj.gstDetails});
    //     }
    //   });
  }

  public ngAfterViewInit() {
    this._generalService.IAmLoaded.next(true);
  }

  public skip() {
    this._router.navigate(['/onboarding']);
  }

  public submit() {

    let object = _.cloneDeep(this.companyProfileObj);
    this.createNewCompanyPreparedObj.bussinessNature = this.companyProfileObj.bussinessNature ? this.companyProfileObj.bussinessNature: '';
    this.createNewCompanyPreparedObj.bussinessType = this.companyProfileObj.businessType ? this.companyProfileObj.businessType: '';
    this.createNewCompanyPreparedObj.address = this.companyProfileObj.address ? this.companyProfileObj.address : '';
    if(this.createNewCompanyPreparedObj.phoneCode && this.createNewCompanyPreparedObj.contactNo) {
     this.createNewCompanyPreparedObj.contactNo =  this.createNewCompanyPreparedObj.phoneCode + '-' +  this.createNewCompanyPreparedObj.contactNo;
    }
    let gstDetails = this.prepareGstDetails(this.companyProfileObj);
    if(gstDetails) {
     this.createNewCompanyPreparedObj.gstDetails.push(gstDetails);
    }
  

    if(object.country && object.contactNo) {
      object.contactNo = _.cloneDeep(`${object.country}${object.contactNo}`);
      object.country = this.selectedCountry;
    } else {
      object.country = this.selectedCountry;
      object.contactNo = null;
    }
     this._generalService.createNewCompany =  this.createNewCompanyPreparedObj;
     console.log('created obj',this.createNewCompanyPreparedObj);
    this._router.navigate(['/pages','select-plan']);
   // this.store.dispatch(this.settingsProfileActions.UpdateProfile(object));
    //  this.store.dispatch(this.companyActions.GetApplicableTaxes());
  }

  public prepareGstDetails(obj) {
    let gstobj:any = {};
    if(obj.gstNumber ) {
    let addressLists = [];
    let addresslistobj: any= {}
    gstobj.gstNumber = obj.gstNumber;
    addresslistobj.stateCode = obj.state;
    addresslistobj.address = '';
    addresslistobj.isDefault = false;
    addresslistobj.stateName = this.selectedstateName ? this.selectedstateName.split('-')[1]: '';
   addressLists.push(addresslistobj);
   gstobj.addressList = addressLists;
    }
   return gstobj;
  }

  /**
   * autoSelectCountryCode
   */
  public autoSelectCountryCode(country) {
    if (this.countryCodeList) {
      let selectedCountry = _.find(this.countryCodeList, function (o) {
        return o.additional === country;
      });
      if (selectedCountry && selectedCountry.value) {
        this.companyProfileObj.country = selectedCountry.value;
      }
    }

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
  public getStateCode(gstNo: HTMLInputElement, statesEle: ShSelectComponent) {
    let gstVal: string = gstNo.value;
    this.companyProfileObj.gstNumber = gstVal;

    if (gstVal.length >= 2) {
      this.statesSource$.pipe(take(1)).subscribe(state => {
        let s = state.find(st => st.value === gstVal.substr(0, 2));
        statesEle.setDisabledState(false);
  
        if (s) {
           this.companyProfileObj.state = s.value;
            this.selectedstateName = s.label
           statesEle.setDisabledState(true);
         
        } else {
           this.companyProfileObj.state = '';
          statesEle.setDisabledState(false);
          this._toasty.clearAllToaster();
          this._toasty.warningToast('Invalid GSTIN.');
        }
      });
    } else {
      statesEle.setDisabledState(false);
      this.companyProfileObj.state = '';
    }
  }

  public selectedbusinessType(event) {
    //
    if(event) {
    this.selectedBusinesstype = event.value;
    }
    console.log(event);
  }
  public selectedbusinessOptions(event) {
    if(event) {
   //
    }
    console.log(event);

  }
  public selectedApplicabeTaxes(event) {
    console.log(event);

  }

  //   public setChildState(ele: HTMLInputElement, index: number) {
  //   let stateCode: any = Number(ele.value.substring(0, 2));
  //   if (stateCode <= 37) {
  //     if (stateCode < 10 && stateCode !== 0) {
  //       stateCode = (stateCode < 10) ? '0' + stateCode.toString() : stateCode.toString();
  //     } else if (stateCode === 0) {
  //       stateCode = '';
  //     }
  //     this.companyProfileObj.gstDetails[index].addressList[0].stateCode = stateCode.toString();
  //   } else {
  //     this.companyProfileObj.gstDetails[index].addressList[0].stateCode = '';
  //   }
  // }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

import { Observable, of as observableOf, ReplaySubject, Subject } from 'rxjs';

import { takeUntil, debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { AfterViewInit, Component, OnDestroy, OnInit, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { IOption } from '../theme/ng-select/option.interface';
import { States, CompanyRequest, CompanyCreateRequest, GstDetail } from '../models/api-models/Company';
import * as _ from '../lodash-optimized';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { contriesWithCodes } from '../shared/helpers/countryWithCodes';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { Router } from '@angular/router';
import { GeneralService } from '../services/general.service';
import { ToasterService } from '../services/toaster.service';
import { FormGroup } from '@angular/forms';
import { ShSelectComponent } from '../theme/ng-virtual-select/sh-select.component';
import { CompanyActions } from '../actions/company.actions';
import { CompanyService } from '../services/companyService.service';
import { ModalDirective, ModalOptions } from 'ngx-bootstrap';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { CompanyAddNewUiComponent, CompanyAddComponent } from '../shared/header/components';
import { GeneralActions } from '../actions/general/general.actions';

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
  public isGstValid: boolean = true;
  public countrySource: IOption[] = [];
  public currencies: IOption[] = [];
  public countryPhoneCode: IOption[] = [];
  public currencySource$: Observable<IOption[]> = observableOf([]);
  public taxesList: any = [];
  public businessTypeList: IOption[] = [];
  public businessNatureList: IOption[] = [];
  public selectedTaxes: string[] = [];
  public isbranch: boolean = false;
  public modalConfig: ModalOptions = {
    animated: true,
    keyboard: true,
    backdrop: false,
    ignoreBackdropClick: true
  };
  public createNewCompanyPreparedObj: CompanyCreateRequest = {
    name: '',
    country: '',
    phoneCode: '',
    contactNo: '',
    uniqueName: '',
    isBranch: false,
    subscriptionRequest: {
      planUniqueName: '',
      subscriptionId: '',
      userUniqueName: '',
      licenceKey: ''
    },
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
    userBillingDetails: {
      name: '',
      email: '',
      mobile: '',
      gstin: '',
      state: '',
      address: '',
      autorenew: ''
    },
    nameAlias: '',
    paymentId: '',
    amountPaid: '',
    razorpaySignature: ''
  };
  public GstDetailsObj: GstDetail = {
    gstNumber: '',
    addressList: [
      {
        stateCode: '',
        address: '',
        isDefault: false,
        stateName: ''
      }
    ]
  };
  public updateProfileSuccess$: Observable<boolean>;
  public businessType: IOption[] = [];

  public BusinessOptions: IOption[] = [];


  public hideTextarea = true;
  public collapseTextarea = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);



  constructor(private componentFactoryResolver: ComponentFactoryResolver, private store: Store<AppState>, private settingsProfileActions: SettingsProfileActions,
    private _router: Router, private _generalService: GeneralService, private _toasty: ToasterService, private companyActions: CompanyActions, private _companyService: CompanyService, private _generalActions: GeneralActions) {
    this.companyProfileObj = {};
    this.store.dispatch(this._generalActions.getAllState());
    contriesWithCodes.map(c => {
      this.countrySource.push({ value: c.countryName, label: `${c.countryflag} - ${c.countryName}` });
    });
    // Country phone Code
    contriesWithCodes.map(c => {
      this.countryPhoneCode.push({ value: c.value, label: c.value });
    });

    this.stateStream$ = this.store.select(s => s.general.states).pipe(takeUntil(this.destroyed$));
    this.stateStream$.subscribe((data) => {
      if (data) {
        data.map(d => {
          this.states.push({ label: `${d.code} - ${d.name}`, value: d.code });
        });
      }
      const filteredArr = this.states.reduce((acc, current) => {
        const x = acc.find(item => item.value === current.value);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      this.statesSource$ = observableOf(filteredArr);
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
          this.currencies.push({ label: d.code, value: d.code });
        });
      }
      this.currencySource$ = observableOf(this.currencies);
    });

  }

  public ngOnInit() {
    this.store.pipe(select(s => s.session.createCompanyUserStoreRequestObj), takeUntil(this.destroyed$)).subscribe(res => {
      if (res) {
        if (!res.isBranch && !res.city) {
          this.isbranch = res.isBranch;
          this.createNewCompany = res;
          this.company = this.createNewCompany;
          if (this.company.contactNo.toString().includes('-')) {
            let contact = this.company.contactNo.split('-');
            this.company.contactNo = contact[1];
          }
          this.prepareWelcomeForm();
        }
      }
    });
    this.store.pipe(select(s => s.session.createBranchUserStoreRequestObj), takeUntil(this.destroyed$)).subscribe(res => {
      if (res) {
        if (res.isBranch && res.city) {
          this.isbranch = res.isBranch;
          this.createNewCompany = res;
          this.company = this.createNewCompany;
          if (this.company.contactNo.toString().includes('-')) {
            let contact = this.company.contactNo.split('-');
            this.company.contactNo = contact[1];
          }
          this.prepareWelcomeForm();
        }
      }
    });

    this.updateProfileSuccess$.subscribe(s => {
      if (s) {
        this._router.navigate(['select-plan']);
      }
    });

    this._companyService.GetAllBusinessTypeList().subscribe((res: any) => {
      _.map(res.body, (o) => {
        this.businessTypeList.push({ label: o, value: o });
      });
    });
    this._companyService.getApplicabletaxes().subscribe((res: any) => {
      this.taxesList = [];
      _.map(res.body, (o) => {
        this.taxesList.push({ label: o.name, value: o.uniqueName, isSelected: false });
      });
    });
    this._companyService.GetAllBusinessNatureList().subscribe((res: any) => {
      this.businessNatureList = [];
      _.map(res.body, (o) => {
        this.businessNatureList.push({ label: o, value: o });
      });
    });
  }

  public ngAfterViewInit() {
    this._generalService.IAmLoaded.next(true);
  }

  public skip() {
    this._router.navigate(['/onboarding']);
  }
  // public reFillForm() {
  //   this.companyProfileObj.bussinessNature = this.createNewCompany.bussinessNature;
  //   this.companyProfileObj.bussinessType = this.createNewCompany.bussinessType;
  //   this.selectedBusinesstype = this.createNewCompany.bussinessType;
  //   if (this.selectedBusinesstype === 'Registered') {
  //     this.companyProfileObj.gstNumber = this.createNewCompany.gstDetails[0].gstNumber;
  //   }
  //   this.companyProfileObj.address = this.createNewCompany.address;
  // }
  public prepareWelcomeForm() {
    if (this.company) {
      this.createNewCompanyPreparedObj.name = this.company.name ? this.company.name : '';
      this.createNewCompanyPreparedObj.phoneCode = this.company.phoneCode ? this.company.phoneCode : '';
      this.createNewCompanyPreparedObj.contactNo = this.company.contactNo ? this.company.contactNo : '';
      this.createNewCompanyPreparedObj.uniqueName = this.company.uniqueName ? this.company.uniqueName : '';
      this.createNewCompanyPreparedObj.isBranch = this.company.isBranch;
      this.createNewCompanyPreparedObj.country = this.company.country ? this.company.country : '';
      this.createNewCompanyPreparedObj.baseCurrency = this.company.baseCurrency ? this.company.baseCurrency : '';
    }
  }

  public submit() {
    // this.selectedTaxes = [];
    this.createNewCompanyPreparedObj.bussinessNature = this.companyProfileObj.bussinessNature ? this.companyProfileObj.bussinessNature : '';
    this.createNewCompanyPreparedObj.bussinessType = this.companyProfileObj.bussinessType ? this.companyProfileObj.bussinessType : '';
    this.createNewCompanyPreparedObj.address = this.companyProfileObj.address ? this.companyProfileObj.address : '';
    this.createNewCompanyPreparedObj.taxes = (this.selectedTaxes.length > 0) ? this.selectedTaxes : [];
    if (this.createNewCompanyPreparedObj.phoneCode && this.createNewCompanyPreparedObj.contactNo) {
      if (!this.createNewCompanyPreparedObj.contactNo.toString().includes('-')) {
        this.createNewCompanyPreparedObj.contactNo = this.createNewCompanyPreparedObj.phoneCode + '-' + this.createNewCompanyPreparedObj.contactNo;
      }
    }
    let gstDetails = this.prepareGstDetail(this.companyProfileObj);
    if (gstDetails.gstNumber) {
      this.createNewCompanyPreparedObj.gstDetails.push(gstDetails);
      this.createNewCompanyPreparedObj.address = '';
    } else {
      this.createNewCompanyPreparedObj.gstDetails = [];
    }
    this._generalService.createNewCompany = this.createNewCompanyPreparedObj;
    this.store.dispatch(this.companyActions.userStoreCreateCompany(this.createNewCompanyPreparedObj));
    this._router.navigate(['select-plan']);
  }
  public prepareGstDetail(obj) {
    if (obj.gstNumber) {
      this.GstDetailsObj.gstNumber = obj.gstNumber;
      this.GstDetailsObj.addressList[0].stateCode = obj.state;
      this.GstDetailsObj.addressList[0].address = obj.address;
      this.GstDetailsObj.addressList[0].isDefault = false;
      this.GstDetailsObj.addressList[0].stateName = this.selectedstateName ? this.selectedstateName.split('-')[1] : '';
    }
    return this.GstDetailsObj;
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
        _.uniqBy(s, 'value');
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
    if (event) {
      this.selectedBusinesstype = event.value;
    }
  }

  // public resetbussinessType() {
  //   setTimeout(() => {
  //     this.companyProfileObj.bussinessType = '';
  //   }, 100);
  // }

  // public resetbussinessNature() {
  //   setTimeout(() => {
  //     this.companyProfileObj.bussinessNature = '';
  //   }, 100);
  // }

  public selectApplicableTaxes(tax, event) {
    if (event && tax) {
      if (event.target.checked) {
        tax.isSelected = event.target.checked;
        this.selectedTaxes.push(tax.value);
      } else {
        let indx = this.selectedTaxes.indexOf(tax.value);
        this.selectedTaxes.splice(indx, 1);
      }
    }
    event.stopPropagation();
  }
  public back(isbranch: boolean) {
    //this._router.navigate(['']);
    if (isbranch) {
      this._router.navigate(['pages', 'settings', 'branch']);  // <!-- pages/settings/branch -->
    } else {
      this._router.navigate(['new-user']);
    }
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public removeTax(tax) {
    let i = 0;
    let matchedIndex = -1;

    for (i; i < this.taxesList.length; i++) {
      if (tax === this.taxesList[i].value) {
        matchedIndex = i;
        break;
      }
    }

    let indx = this.selectedTaxes.indexOf(tax);
    this.selectedTaxes.splice(indx, 1);

    if (matchedIndex > -1) {
      this.taxesList[matchedIndex].isSelected = false;
    }
  }
  public onClearBusinessType() {
    this.selectedBusinesstype = '';
    this.companyProfileObj.bussinessType = '';

  }
  public onClearBusinessNature() {
    this.companyProfileObj.bussinessNature = '';
  }
}

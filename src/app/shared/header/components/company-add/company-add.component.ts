import { CompanyActions } from './../../../../services/actions/company.actions';
import { CompanyService } from './../../../../services/companyService.service';
import { GeoLocationSearch } from './../../../../models/other-models/GeoLocationSearch';
import { LocationService } from './../../../../services/location.service';
import { CompanyRequest } from './../../../../models/api-models/Company';
import { mobileValidator } from './../../../helpers/customValidationHelper';
import { SignupWithMobile, VerifyMobileModel } from './../../../../models/api-models/loginModels';
import { Observable } from 'rxjs';
import { VerifyMobileActions } from './../../../../services/actions/verifyMobile.actions';
import { AppState } from './../../../../store/roots';
import { Store } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { WizardComponent } from '../../../theme/ng2-wizard/wizard.component';

@Component({
  selector: 'company-add',
  templateUrl: './company-add.component.html'
})
export class CompanyAddComponent implements OnInit {
  @ViewChild('wizard') public wizard: WizardComponent;
  public company: CompanyRequest = new CompanyRequest();
  public phoneNumber: string;
  public verificationCode: string;
  public showVerificationBox: Observable<boolean>;
  public isMobileVerified: Observable<boolean>;
  public dataSource: Observable<any>;
  constructor(private store: Store<AppState>, private verifyActions: VerifyMobileActions, private companyActions: CompanyActions,
    private _location: LocationService) { }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {
    this.showVerificationBox = this.store.select(s => s.verifyMobile.showVerificationBox);
    this.isMobileVerified = this.store.select(s => s.session.user.user.contactNo).map(m => m !== null);
    this.dataSource = Observable
      .create((observer: any) => {
        this._location.GetCity({
          QueryString: this.company.city,
          AdministratorLevel: undefined,
          Country: undefined,
          OnlyCity: true
        }).subscribe((res) => observer.next(['Test']));
      });

    this.isMobileVerified.subscribe(p => {
      if (p) {
        this.wizard.next();
      }
    });
    this.store
      .select(c => c.company.companies)
      .subscribe(p => {
        if (p && p.find(c => c.name === this.company.name) !== undefined) {
          this.company = new CompanyRequest();
          this.wizard.next();
        }
      });
  }

  /**
   * addNumber
   */
  public addNumber() {
    let model = new SignupWithMobile();
    model.mobileNumber = this.phoneNumber;
    this.store.dispatch(this.verifyActions.verifyNumberRequest(model));
  }

  /**
   * verifyNumber
   */
  public verifyNumber() {
    let model = new VerifyMobileModel();
    model.mobileNumber = this.phoneNumber;
    model.oneTimePassword = this.verificationCode;
    this.store.dispatch(this.verifyActions.verifyNumberCodeRequest(model));
  }

  /**
   * createCompany
   */
  public createCompany() {
    let company = new CompanyRequest();
    company.name = this.company.name;
    company.city = this.company.city;
    company.uniqueName = this.getRandomString(company.name, company.city);
    this.store.dispatch(this.companyActions.CreateCompany(company));
  }

  private getRandomString(comnanyName, city) {
    // tslint:disable-next-line:one-variable-per-declaration
    let d, dateString, randomGenerate, strings;
    comnanyName = this.removeSpecialCharacters(comnanyName);
    city = this.removeSpecialCharacters(city);
    d = new Date();
    dateString = d.getTime().toString();
    randomGenerate = this.getSixCharRandom();
    strings = [comnanyName, city, dateString, randomGenerate];
    return strings.join('');
  }
  private removeSpecialCharacters(str) {
    let finalString;
    finalString = str.replace(/[^a-zA-Z0-9]/g, '');
    return finalString.substr(0, 6).toLowerCase();
  }
  private getSixCharRandom() {
    return Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 6);
  }
}

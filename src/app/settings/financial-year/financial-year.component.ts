import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { ToasterService } from '../../services/toaster.service';
import { SettingsFinancialYearActions } from '../../services/actions/settings/financial-year/financial-year.action';
import { IFinancialYearResponse } from '../../services/settings.financial-year.service';
import { ActiveFinancialYear } from '../../models/api-models/Company';
import { CompanyActions } from '../../services/actions/company.actions';

export interface IGstObj {
  newGstNumber: string;
  newstateCode: number;
  newstateName: string;
  newaddress: string;
  isDefault: boolean;
}

@Component({
  selector: 'financial-year',
  templateUrl: './financial-year.component.html'
})
export class FinancialYearComponent implements OnInit {

  public financialYearObj: IFinancialYearResponse;
  public currentCompanyUniqueName: string;
  public currentCompanyFinancialYearUN: string;
  public currentCompanyName: string;
  public financialOptions = [];
  public yearOptions = [];
  public selectedFinancialYearOption: string;
  public selectedFinancialYearUN: string;
  public selectedYear: string;
  public options: Select2Options = {
    multiple: false,
    width: '300px',
    placeholder: 'Select Option',
    allowClear: true
  };
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private settingsFinancialYearActions: SettingsFinancialYearActions,
    private _companyActions: CompanyActions,
    private _toasty: ToasterService
  ) { }

  public ngOnInit() {
    this.store.dispatch(this.settingsFinancialYearActions.GetAllFinancialYears());

    this.store.select(p => p.settings.financialYears).takeUntil(this.destroyed$).subscribe((o) => {
      if (o) {
        this.financialYearObj = _.cloneDeep(o);
      } else if (_.isNull(o)) {
        this.store.dispatch(this._companyActions.RefreshCompanies());
        this.store.dispatch(this.settingsFinancialYearActions.GetAllFinancialYears());
      }
    });

    this.store.takeUntil(this.destroyed$).subscribe(s => {
      if (s.session) {
        this.currentCompanyUniqueName = _.cloneDeep(s.session.companyUniqueName);
      }
      if (this.currentCompanyUniqueName && s.session.companies) {
        let companies = _.cloneDeep(s.session.companies);
        let comp = companies.find((c) => c.uniqueName === this.currentCompanyUniqueName);
        if (comp) {
          this.currentCompanyName = comp.name;
          this.currentCompanyFinancialYearUN = comp.activeFinancialYear.uniqueName;
          this.financialOptions = comp.financialYears.map(q => {
            return { label: q.uniqueName, value: q.uniqueName };
          });
        }
      }
    });

    let endYear = moment().year();
    let startYear = moment().subtract(7, 'year').year();
    let yearArray = _.range(startYear, endYear);

    this.yearOptions = yearArray.map(q => {
      return { label: q, value: q };
    });
  }

  public lockUnlockFinancialYear(financialYear: ActiveFinancialYear) {
    let year = _.cloneDeep(financialYear);
    let dataToSend = {
      lockAll: true,
      uniqueName: year.uniqueName
    };
    financialYear.isLocked = !financialYear.isLocked;
    if (financialYear.isLocked) {
      this.store.dispatch(this.settingsFinancialYearActions.LockFinancialYear(dataToSend));
    } else {
      this.store.dispatch(this.settingsFinancialYearActions.UnlockFinancialYear(dataToSend));
    }
  }

  public selectFinancialYearOption(data) {
    this.selectedFinancialYearUN = data.value;
  }

  public selectYear(data) {
    this.selectedYear = data.value;
  }

  public switchFY() {
    if (this.selectedFinancialYearUN) {
      this.store.dispatch(this.settingsFinancialYearActions.SwitchFinancialYear(this.selectedFinancialYearUN));
    }
  }

  public addFY() {
    if (this.selectedYear) {
      this.store.dispatch(this.settingsFinancialYearActions.AddFinancialYear(this.selectedYear));
    }
  }

}

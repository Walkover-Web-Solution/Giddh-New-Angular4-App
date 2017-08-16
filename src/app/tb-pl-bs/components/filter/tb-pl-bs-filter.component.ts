import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { TrialBalanceRequest } from '../../../models/api-models/tb-pl-bs';
import { AppState } from '../../../store/roots';
import { ComapnyResponse } from '../../../models/api-models/Company';

@Component({
  selector: 'tb-pl-bs-filter',  // <home></home>
  templateUrl: './tb-pl-bs-filter.component.html'
})
export class TbPlBsFilterComponent implements OnInit, OnDestroy {
  public today: Date = new Date();
  public selectedDateOption: string = '1';
  public selectedFinancialYearOption: string = '';
  public filterForm: FormGroup;
  public financialOptions = [];
  public expandAll = false;

  // init form and other properties from input commpany
  @Input()
  public set selectedCompany(value: ComapnyResponse) {
    if (!value) {
      return;
    }
    this.filterForm.patchValue({
      toDate: value.activeFinancialYear.financialYearEnds,
      fromDate: value.activeFinancialYear.financialYearEnds
    });

    this.financialOptions = value.financialYears.map(q => {
      return { text: q.uniqueName, id: q.uniqueName };
    });
    this.selectedFinancialYearOption = value.activeFinancialYear.uniqueName;
  }

  public request: TrialBalanceRequest = {};
  @Output() public onPropertyChanged = new EventEmitter<TrialBalanceRequest>();

  // public financialYears:
  public options: Select2Options = {
    multiple: false,
    width: '200px',
    placeholder: 'Select Option',
    allowClear: true
  };
  public dateOptions: any[] = [{ text: 'Date Range', id: 1 }, { text: 'Financial Year', id: 0 }];

  /*  public set toDate(value: Date) {
      this.store.dispatch(this.tlPlActions.SetDate(this.convertToDate(this.request.fromDate), value));
    }

    public set fromDate(value: Date) {
      this.store.dispatch(this.tlPlActions.SetDate(value, this.convertToDate(this.request.toDate)));
    }*/

  // public fromDate: Date;
  public moment = moment;

  /**
   * TypeScript public modifiers
   */
  constructor(private fb: FormBuilder, private store: Store<AppState>) {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      refresh: [false]
    });

    // fetch company then active financial year
    /*this.store.select(p => p.company.companies && p.company.companies.find(q => q.uniqueName === p.session.companyUniqueName)).subscribe(p => {
      this.selectedCompany = p;
      if (p) {
        this.financialOptions = p.financialYears.map(q => {
          return { text: q.uniqueName, id: q.uniqueName };
        });
        this.selectedFinancialYearOption = this.selectedCompany.activeFinancialYear.uniqueName;
        this.request = {
          refresh: false,
          fromDate: this.selectedCompany.activeFinancialYear.financialYearStarts,
          toDate: this.selectedCompany.activeFinancialYear.financialYearEnds
        };
        // this.store.dispatch(this.tlPlActions.GetTrialBalance(_.cloneDeep(this.request)));
      }
    });*/
    // this.toDate$ = this.store.select(p => p.tlPl.toDate);
    // this.fromDate$ = this.store.select(p => p.tlPl.fromDate);
    // this.toDate$.subscribe(p => this.request.toDate = this.convertToString(p));
    // this.fromDate$.subscribe(p => this.request.fromDate = this.convertToString(p));
  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    //
  }

  public selectDateOption(v) {
    this.selectedDateOption = v.value || '';
  }

  public selectFinancialYearOption(v) {
    this.selectedFinancialYearOption = v.value || '';
    let financialYear = this.selectedCompany.financialYears.find(p => p.uniqueName === this.selectedFinancialYearOption);
    this.filterForm.patchValue({
      toDate: financialYear.financialYearEnds,
      fromDate: financialYear.financialYearEnds
    });
    // this.toDate = moment(financialYear.financialYearEnds, 'DD-MM-YYYY').toDate();
    // this.fromDate = moment(financialYear.financialYearStarts, 'DD-MM-YYYY').toDate();
    // this.store.dispatch(this.tlPlActions.SetDate(this.fromDate, this.toDate));
    // this.store.dispatch(this.tlPlActions.GetTrialBalance(_.cloneDeep(this.request)));

  }

  public filterData() {
    this.onPropertyChanged.emit(this.filterForm.value);
    /*    this.store.dispatch(this.tlPlActions.SetDate(this.fromDate, this.toDate));
        this.store.dispatch(this.tlPlActions.GetTrialBalance(_.cloneDeep(this.request)));*/
  }

}

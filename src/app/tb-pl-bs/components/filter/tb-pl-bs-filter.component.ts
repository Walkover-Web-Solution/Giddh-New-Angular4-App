import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TrialBalanceRequest } from '../../../models/api-models/tb-pl-bs';
import { ComapnyResponse } from '../../../models/api-models/Company';

@Component({
  selector: 'tb-pl-bs-filter',  // <home></home>
  templateUrl: './tb-pl-bs-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TbPlBsFilterComponent implements OnInit, OnDestroy {
  public today: Date = new Date();
  public selectedDateOption: string = '1';
  public selectedFinancialYearOption: string = '';
  public filterForm: FormGroup;
  public financialOptions = [];
  public expandAll = false;
  public showClearSearch: boolean;
  public request: TrialBalanceRequest = {};
  public dateOptions: any[] = [{ text: 'Date Range', id: 1 }, { text: 'Financial Year', id: 0 }];

  public options: Select2Options = {
    multiple: false,
    width: '200px',
    placeholder: 'Select Option',
    allowClear: true
  };

  @Input() public showLoader: boolean = true;

  @Input() public showLabels: boolean = false;

  // init form and other properties from input commpany
  @Input()
  public set selectedCompany(value: ComapnyResponse) {
    if (!value) {
      return;
    }
    this._selectedCompany = value;
    this.filterForm.patchValue({
      toDate: value.activeFinancialYear.financialYearEnds,
      fromDate: value.activeFinancialYear.financialYearEnds
    });

    this.financialOptions = value.financialYears.map(q => {
      return { text: q.uniqueName, id: q.uniqueName };
    });
    this.selectedFinancialYearOption = value.activeFinancialYear.uniqueName;
  }

  @Output() public onPropertyChanged = new EventEmitter<TrialBalanceRequest>();
  private _selectedCompany: ComapnyResponse;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      fy: [''],
      refresh: [false]
    });

  }

  public ngOnInit() {
    //
    if (!this.showLabels) {
      this.selectedDateOption = '0';
    }
  }

  public ngOnDestroy() {
    //
  }

  public selectDateOption(v) {
    this.selectedDateOption = v.value || '';
  }

  public selectFinancialYearOption(v) {
    this.selectedFinancialYearOption = v.value || '';
    let financialYear = this._selectedCompany.financialYears.find(p => p.uniqueName === this.selectedFinancialYearOption);
    let index = this._selectedCompany.financialYears.findIndex(p => p.uniqueName === this.selectedFinancialYearOption);
    this.filterForm.patchValue({
      toDate: financialYear.financialYearEnds,
      fromDate: financialYear.financialYearEnds,
      fy: index === 0 ? 0 : index * -1
    });
  }

  public filterData() {
    this.onPropertyChanged.emit(this.filterForm.value);
  }

}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TrialBalanceRequest } from '../../../models/api-models/tb-pl-bs';
import { ComapnyResponse } from '../../../models/api-models/Company';

@Component({
  selector: 'tb-pl-bs-filter',  // <home></home>
  templateUrl: './tb-pl-bs-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TbPlBsFilterComponent implements OnInit, OnDestroy, OnChanges {
  public today: Date = new Date();
  public selectedDateOption: string = '1';
  public selectedFinancialYearOption: string = '';
  public filterForm: FormGroup;
  public search: string;
  public financialOptions = [];
  @Input() public tbExportPdf: boolean = false;
  @Input() public tbExportXLS: boolean = false;
  @Input() public tbExportCsv: boolean = false;
  @Input() public plBsExportXLS: boolean = false;
  @Input() public BsExportXLS: boolean = false;

  @Output() public tbExportPdfEvent = new EventEmitter<string>();
  @Output() public tbExportXLSEvent = new EventEmitter<string>();
  @Output() public tbExportCsvEvent = new EventEmitter<string>();
  @Output() public plBsExportXLSEvent = new EventEmitter<string>();
  // public expandAll?: boolean = null;
  @Output()
  public expandAll: EventEmitter<boolean> = new EventEmitter<boolean>();
  public showClearSearch: boolean;
  public request: TrialBalanceRequest = {};
  public dateOptions: any[] = [{ text: 'Date Range', id: 1 }, { text: 'Financial Year', id: 0 }];

  public options: Select2Options = {
    multiple: false,
    width: '200px',
    placeholder: 'Select Option',
    allowClear: false
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
      to: value.activeFinancialYear.financialYearEnds,
      from: value.activeFinancialYear.financialYearStarts
    });

    this.financialOptions = value.financialYears.map(q => {
      return { text: q.uniqueName, id: q.uniqueName };
    });
    this.selectedFinancialYearOption = value.activeFinancialYear.uniqueName;
    this.cd.detectChanges();
  }

  public get selectedCompany() {
    return this._selectedCompany;
  }

  @Output() public onPropertyChanged = new EventEmitter<TrialBalanceRequest>();
  private _selectedCompany: ComapnyResponse;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    this.filterForm = this.fb.group({
      from: [''],
      to: [''],
      fy: [''],
      refresh: [false]
    });

  }
  public ngOnChanges(changes: SimpleChanges): void {
    // if (changes['needToReCalculate']) {
    //   this.calculateTotal();
    // }
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
      to: financialYear.financialYearEnds,
      from: financialYear.financialYearStarts,
      fy: index === 0 ? 0 : index * -1
    });
    this.cd.markForCheck();
  }

  public filterData() {
    let request = this.filterForm.value as TrialBalanceRequest;
    this.onPropertyChanged.emit(this.filterForm.value);
  }

}

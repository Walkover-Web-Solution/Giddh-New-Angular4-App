import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TrialBalanceRequest } from '../../../models/api-models/tb-pl-bs';
import { CompanyResponse } from '../../../models/api-models/Company';
import { IOption } from '../../../theme/ng-select/option.interface';

@Component({
  selector: 'tb-pl-bs-filter',  // <home></home>
  templateUrl: './tb-pl-bs-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TbPlBsFilterComponent implements OnInit, OnDestroy, OnChanges {
  public today: Date = new Date();
  public selectedDateOption: string = '1';
  public filterForm: FormGroup;
  public search: string;
  public financialOptions: IOption[] = [];
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
  public dateOptions: IOption[] = [{label: 'Date Range', value: '1'}, {label: 'Financial Year', value: '0'}];

  @Input() public showLoader: boolean = true;

  @Input() public showLabels: boolean = false;

  // init form and other properties from input commpany
  @Input()
  public set selectedCompany(value: CompanyResponse) {
    if (!value) {
      return;
    }
    this._selectedCompany = value;
    this.financialOptions = value.financialYears.map(q => {
      return {label: q.uniqueName, value: q.uniqueName};
    });
    this.filterForm.patchValue({
      to: value.activeFinancialYear.financialYearEnds,
      from: value.activeFinancialYear.financialYearStarts,
      selectedFinancialYearOption: value.activeFinancialYear.uniqueName
    });
  }

  public get selectedCompany() {
    return this._selectedCompany;
  }

  @Output() public onPropertyChanged = new EventEmitter<TrialBalanceRequest>();
  private _selectedCompany: CompanyResponse;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    this.filterForm = this.fb.group({
      from: [''],
      to: [''],
      fy: [''],
      selectedDateOption: ['1'],
      selectedFinancialYearOption: [''],
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
      this.filterForm.patchValue({selectedDateOption: '0'});
    }
  }

  public ngOnDestroy() {
    //
  }

  public selectDateOption(v: IOption) {
    // this.selectedDateOption = v.value || '';
  }

  public selectFinancialYearOption(v: IOption) {
    let financialYear = this._selectedCompany.financialYears.find(p => p.uniqueName === v.value);
    let index = this._selectedCompany.financialYears.findIndex(p => p.uniqueName === v.value);
    this.filterForm.patchValue({
      to: financialYear.financialYearEnds,
      from: financialYear.financialYearStarts,
      fy: index === 0 ? 0 : index * -1
    });
  }

  public filterData() {
    this.onPropertyChanged.emit(this.filterForm.value);
  }

}

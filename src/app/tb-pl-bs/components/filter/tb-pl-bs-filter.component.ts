import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TrialBalanceRequest } from '../../../models/api-models/tb-pl-bs';
import { CompanyResponse } from '../../../models/api-models/Company';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import * as moment from 'moment/moment';
import * as _ from '../../../lodash-optimized';

@Component({
  selector: 'tb-pl-bs-filter',  // <home></home>
  templateUrl: './tb-pl-bs-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TbPlBsFilterComponent implements OnInit, OnDestroy, OnChanges {
  public today: Date = new Date();
  public selectedDateOption: string = '1';
  public filterForm: FormGroup;
  public search: string = '';
  public financialOptions: IOption[] = [];
  public accountSearchControl: FormControl = new FormControl();
  public datePickerOptions: any = {
    locale: {
      applyClass: 'btn-green',
      applyLabel: 'Go',
      fromLabel: 'From',
      format: 'D-MMM-YY',
      toLabel: 'To',
      cancelLabel: 'Cancel',
      customRangeLabel: 'Custom range'
    },
    ranges: {
      'Last 1 Day': [
        moment().subtract(1, 'days'),
        moment()
      ],
      'Last 7 Days': [
        moment().subtract(6, 'days'),
        moment()
      ],
      'Last 30 Days': [
        moment().subtract(29, 'days'),
        moment()
      ],
      'Last 6 Months': [
        moment().subtract(6, 'months'),
        moment()
      ],
      'Last 1 Year': [
        moment().subtract(12, 'months'),
        moment()
      ]
    },
    startDate: moment().subtract(30, 'days'),
    endDate: moment()
  };
  @Input() public tbExportPdf: boolean = false;
  @Input() public tbExportXLS: boolean = false;
  @Input() public tbExportCsv: boolean = false;
  @Input() public plBsExportXLS: boolean = false;
  @Input() public BsExportXLS: boolean = false;

  @Output() public seachChange = new EventEmitter<string>();
  @Output() public tbExportPdfEvent = new EventEmitter<string>();
  @Output() public tbExportXLSEvent = new EventEmitter<string>();
  @Output() public tbExportCsvEvent = new EventEmitter<string>();
  @Output() public plBsExportXLSEvent = new EventEmitter<string>();
  // public expandAll?: boolean = null;
  @Output()
  public expandAll: EventEmitter<boolean> = new EventEmitter<boolean>();
  public showClearSearch: boolean;
  public request: TrialBalanceRequest = {};
  public dateOptions: IOption[] = [{ label: 'Date Range', value: '1' }, { label: 'Financial Year', value: '0' }];

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
      return { label: q.uniqueName, value: q.uniqueName };
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
      this.filterForm.patchValue({ selectedDateOption: '0' });
    }
    this.accountSearchControl.valueChanges
      .debounceTime(700)
      .subscribe((newValue) => {
        this.search = newValue;
        this.seachChange.emit(this.search);
        this.cd.detectChanges();
      });

  }

  public ngOnDestroy() {
    //
  }

  public selectDateOption(v: IOption) {
    // this.selectedDateOption = v.value || '';
  }
  public selectedDate(value: any) {
    this.filterForm.controls['from'].setValue(moment(value.picker.startDate).format('DD-MM-YYYY'));
    this.filterForm.controls['to'].setValue(moment(value.picker.endDate).format('DD-MM-YYYY'));
  }
  public selectFinancialYearOption(v: IOption) {
    if (v.value) {
      let financialYear = this._selectedCompany.financialYears.find(p => p.uniqueName === v.value);
      let index = this._selectedCompany.financialYears.findIndex(p => p.uniqueName === v.value);
      this.filterForm.patchValue({
        to: financialYear.financialYearEnds,
        from: financialYear.financialYearStarts,
        fy: index === 0 ? 0 : index * -1
      });
    } else {
      this.filterForm.patchValue({
        to: '',
        from: '',
        fy: ''
      });
    }
  }
  public filterData() {
    this.onPropertyChanged.emit(this.filterForm.value);
  }
  public refreshData() {
    let data = _.cloneDeep(this.filterForm.value);
    data.refresh = true;
    this.onPropertyChanged.emit(data);
  }
}

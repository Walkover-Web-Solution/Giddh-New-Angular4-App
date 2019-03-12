import { debounceTime, takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TrialBalanceRequest } from '../../../models/api-models/tb-pl-bs';
import { CompanyResponse } from '../../../models/api-models/Company';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import * as moment from 'moment/moment';
import * as _ from '../../../lodash-optimized';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { SettingsTagActions } from '../../../actions/settings/tag/settings.tag.actions';
import { createSelector } from 'reselect';
import { Observable, ReplaySubject } from 'rxjs';
import { TagRequest } from '../../../models/api-models/settingsTags';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'tb-pl-bs-filter',  // <home></home>
  templateUrl: './tb-pl-bs-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TbPlBsFilterComponent implements OnInit, OnDestroy, OnChanges {
  public today: Date = new Date();
  public selectedDateOption: string = '0';
  public filterForm: FormGroup;
  public search: string = '';
  public financialOptions: IOption[] = [];
  public accountSearchControl: FormControl = new FormControl();
  public tags$: Observable<TagRequest[]>;
  public selectedTag: string;
  public datePickerOptions: any = {
    hideOnEsc: true,
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
  public expand: boolean = false;
  public dateOptions: IOption[] = [{label: 'Date Range', value: '1'}, {label: 'Financial Year', value: '0'}];
  public imgPath: string;

  @Input() public showLoader: boolean = true;

  @Input() public showLabels: boolean = false;
  @Output() public onPropertyChanged = new EventEmitter<TrialBalanceRequest>();
  @ViewChild('createTagModal') public createTagModal: ModalDirective;

  public universalDate$: Observable<any>;
  public newTagForm: FormGroup;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private _selectedCompany: CompanyResponse;

  constructor(private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private store: Store<AppState>,
              private _settingsTagActions: SettingsTagActions,) {
    this.filterForm = this.fb.group({
      from: [''],
      to: [''],
      fy: [''],
      selectedDateOption: ['0'],
      selectedFinancialYearOption: [''],
      refresh: [false],
      tagName: ['']
    });

    this.newTagForm = this.fb.group({
      name: ['', Validators.required],
      description: []
    });

    this.store.dispatch(this._settingsTagActions.GetALLTags());
    this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));

  }

  public get selectedCompany() {
    return this._selectedCompany;
  }

  // init form and other properties from input company
  @Input()
  public set selectedCompany(value: CompanyResponse) {
    if (!value) {
      return;
    }
    this._selectedCompany = value;
    this.financialOptions = value.financialYears.map(q => {
      return {label: q.uniqueName, value: q.uniqueName};
    });

    if (this.filterForm.get('selectedDateOption').value === '0') {
      this.datePickerOptions.startDate = moment(value.activeFinancialYear.financialYearStarts, 'DD-MM-YYYY');
      this.datePickerOptions.endDate = moment(value.activeFinancialYear.financialYearEnds, 'DD-MM-YYYY');
      this.filterForm.patchValue({
        to: value.activeFinancialYear.financialYearEnds,
        from: value.activeFinancialYear.financialYearStarts,
        selectedFinancialYearOption: value.activeFinancialYear.uniqueName
      });
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    // if (changes['needToReCalculate']) {
    //   this.calculateTotal();
    // }
  }

  public ngOnInit() {

    this.imgPath = isElectron ? 'assets/icon/' : AppUrl + APP_FOLDER + 'assets/icon/';
    //
    if (!this.showLabels) {
      this.filterForm.patchValue({selectedDateOption: '0'});
    }
    this.accountSearchControl.valueChanges.pipe(
      debounceTime(700))
      .subscribe((newValue) => {
        this.search = newValue;
        this.seachChange.emit(this.search);
        this.cd.detectChanges();
      });

    this.tags$ = this.store.select(createSelector([(state: AppState) => state.settings.tags], (tags) => {
      if (tags && tags.length) {
        _.map(tags, (tag) => {
          tag.value = tag.name;
          tag.label = tag.name;
        });
        return _.orderBy(tags, 'name');
      }
    })).pipe(takeUntil(this.destroyed$));

    this.universalDate$.subscribe((a) => {
      if (a) {
        this.datePickerOptions.startDate = _.cloneDeep(a[0]);
        this.datePickerOptions.endDate = _.cloneDeep(a[1]);
        this.filterForm.patchValue({
          from: moment(a[0]).format('DD-MM-YYYY'),
          to: moment(a[1]).format('DD-MM-YYYY')
        });
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
        this.filterData();
      }
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
      this.datePickerOptions.startDate = moment(financialYear.financialYearStarts, 'DD-MM-YYYY');
      this.datePickerOptions.endDate = moment(financialYear.financialYearEnds, 'DD-MM-YYYY');

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
    this.setFYFirstTime(this.filterForm.controls['selectedFinancialYearOption'].value);
    this.onPropertyChanged.emit(this.filterForm.value);
  }

  public refreshData() {
    this.setFYFirstTime(this.filterForm.controls['selectedFinancialYearOption'].value);
    let data = _.cloneDeep(this.filterForm.value);
    data.refresh = true;
    this.onPropertyChanged.emit(data);
  }

  public setFYFirstTime(selectedFY: string) {
    if (selectedFY) {
      let inx = this._selectedCompany.financialYears.findIndex(p => p.uniqueName === selectedFY);
      if (inx !== -1) {
        this.filterForm.patchValue({
          fy: inx === 0 ? 0 : inx * -1
        });
      }
    }
  }

  public toggleTagsModal() {
    this.createTagModal.toggle();
  }

  public createTag() {
    this.store.dispatch(this._settingsTagActions.CreateTag(this.newTagForm.getRawValue()));
    this.toggleTagsModal();
  }

  /**
   * emitExpand
   */
  public emitExpand() {
    this.expand = !this.expand;
    setTimeout(() => {
      this.expandAll.emit(this.expand);
    }, 10);
  }

  public onTagSelected(ev) {
    this.selectedTag = ev.value;
    this.filterForm.get('tagName').patchValue(ev.value);
    this.filterForm.get('refresh').patchValue(true);
    this.onPropertyChanged.emit(this.filterForm.value);
  }

  public dateOptionIsSelected(ev) {
    if (ev && ev.value === '0') {
      this.selectFinancialYearOption(this.financialOptions[0]);
    }
  }
}

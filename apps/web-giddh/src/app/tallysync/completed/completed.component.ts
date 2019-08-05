import {Observable, ReplaySubject} from 'rxjs';

import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';


import * as moment from 'moment/moment';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';
import {ActivatedRoute} from '@angular/router';
import {ToasterService} from '../../services/toaster.service';
import {takeUntil} from "rxjs/operators";
import {createSelector, select, Store} from "@ngrx/store";
import {AppState} from "../../store";
import {IOption} from "../../theme/ng-virtual-select/sh-options.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GIDDH_DATE_FORMAT} from "../../shared/helpers/defaultDateFormat";
import {TallySyncService} from "../../services/tally-sync.service";
import {TallySyncData} from "../../models/api-models/tally-sync";
import { saveAs } from 'file-saver';
import { ActiveFinancialYear, CompanyResponse } from '../../models/api-models/Company';
@Component({
  selector: 'app-completed-preview',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss'],
})
export class CompletedComponent implements OnInit, OnDestroy {
  public universalDate$: Observable<any>;
  public bsConfig: Partial<BsDatepickerConfig> = {
    showWeekNumbers: false,
    dateInputFormat: 'DD-MM-YYYY',
    rangeInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-green myDpClass'
  };
  public CompanyList: IOption[] = [];
  public moment = moment;
  public maxDate = new Date(new Date().setDate(new Date().getDate() - 1));
  public startDate: string;
  public endDate: string;
  public filter: any = {};
  public activeFinancialYear: ActiveFinancialYear;
  public filterForm: FormGroup;
  public completedData: TallySyncData[] = [];
  public MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  public timeInterval: IOption[] = [
    {
      value: '00:00:00-02:00:00',
      label: '00:00 am - 02:00 am'
    },
    {
      value: '02:00:00-04:00:00',
      label: '02:00 am - 04:00 am'
    },
    {
      value: '04:00:00-06:00:00',
      label: '04:00 am - 06:00 am'
    },
    {
      value: '06:00:00-08:00:00',
      label: '06:00 am - 08:00 am'
    },
    {
      value: '08:00:00-10:00:00',
      label: '08:00 am - 10:00 am'
    },
    {
      value: '10:00:00-12:00:00',
      label: '10:00 am - 12:00 pm'
    },
    {
      value: '12:00:00-14:00:00',
      label: '12:00 pm - 02:00 pm'
    },
    {
      value: '14:00:00-16:00:00',
      label: '02:00 pm - 04:00 pm'
    },
    {
      value: '16:00:00-18:00:00',
      label: '04:00 pm - 06:00 pm'
    },
    {
      value: '18:00:00-20:00:00',
      label: '06:00 pm - 08:00 pm'
    },
    {
      value: '20:00:00-22:00:00',
      label: '08:00 pm - 10:00 pm'
    },
    {
      value: '22:00:00-24:00:00',
      label: '10:00 pm - 12:00 pm'
    }
  ];

  public companies$: Observable<CompanyResponse[]>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private _toaster: ToasterService,
    private _activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private tallysyncService: TallySyncService
  ) {

    this.filterForm = this.fb.group({
      filterCompany: [''],
      filterTimeInterval: [''],
      filterDate: ['', Validators.required],
    });
    this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
    this.companies$ = this.store.select(p => p.session.companies).pipe(takeUntil(this.destroyed$));
    // set financial years based on company financial year
    this.store.pipe(select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
      if (!companies) {
        return;
      }

      return companies.find(cmp => {
        if (cmp && cmp.uniqueName) {
          return cmp.uniqueName === uniqueName;
        } else {
          return false;
        }
      });
    })), takeUntil(this.destroyed$)).subscribe(selectedCmp => {
      if (selectedCmp) {
        this.filterForm.get('filterCompany').patchValue(selectedCmp.uniqueName);
      }
    });

  }

  public ngOnInit() {
    // set universal date
    // this.universalDate$.subscribe(a => {
    //   if (a) {
    //     this.filterForm.get('filterDate').patchValue(moment(a[1]).format('D-MMM-YYYY'));
    //   }
    // });
    // set current company date
    this.companies$.subscribe(a => {
      if (a) {
        a.forEach((element) => {
          this.CompanyList.push({value: element.uniqueName, label: element.name});
        })
      }
    });
    // set initial Data
    this.filterForm.get('filterDate').patchValue(moment(this.maxDate).format('D-MMM-YYYY'));
    this.filterForm.get('filterTimeInterval').patchValue(this.timeInterval[5].value);
    this.filter.timeRange = this.timeInterval[5].value;
    this.filter.startDate = moment(this.maxDate).format('DD-MM-YYYY');
    this.getReport();
  }

  public getReport() {
    if (this.filterForm.invalid) {
      this._toaster.errorToast("Please check your filter criteria");
      return;
    }

    // api call here
    this.filter.from = this.filter.startDate + ' ' + this.filter.timeRange.split('-')[0];
    this.filter.to = this.filter.startDate + ' ' + this.filter.timeRange.split('-')[1];
    this.tallysyncService.getCompletedSync(this.filter.from, this.filter.to).subscribe((res) => {
      if (res && res.results && res.results.length > 0) {
        this.completedData = res.results;
        this.completedData.forEach((element) => {
          element['dateString'] = this.prepareDate(element.updatedAt);
          //completed
          let tallyGroups = (element.totalSavedGroups * 100) / element.totalTallyGroups;
          let tallyAccounts = (element.totalSavedAccounts * 100) / element.totalTallyAccounts;
          let tallyEntries = (element.totalSavedEntries * 100) / element.totalTallyEntries;
          element['groupsPercent'] = (isNaN(tallyGroups) ? 0 : tallyGroups).toFixed(2) + '%';
          element['accountsPercent'] = (isNaN(tallyAccounts) ? 0 : tallyAccounts).toFixed(2) + '%';
          element['entriesPercent'] = (isNaN(tallyEntries) ? 0 : tallyEntries).toFixed(2) + '%';

          //error
          let tallyErrorGroups = (element.tallyErrorGroups * 100) / element.totalTallyGroups;
          let tallyErrorAccounts = (element.tallyErrorAccounts * 100) / element.totalTallyAccounts;
          let tallyErrorEntries = (element.tallyErrorEntries * 100) / element.totalTallyEntries;
          element['groupsErrorPercent'] = (isNaN(tallyErrorGroups) ? 0 : tallyErrorGroups).toFixed(2) + '%';
          element['accountsErrorPercent'] = (isNaN(tallyErrorAccounts) ? 0 : tallyErrorAccounts).toFixed(2) + '%';
          element['entriesErrorPercent'] = (isNaN(tallyErrorEntries) ? 0 : tallyErrorEntries).toFixed(2) + '%';
        })
      }
    })
    // ===============

  }


  // download
  public downloadLog(row: TallySyncData) {
    this.tallysyncService.getErrorLog(row.id, row.company.uniqueName).subscribe((res) => {
      if (res.status === 'success') {
        let blobData = this.base64ToBlob(res.body, 'text/csv', 512);
        return saveAs(blobData, `${row.company.name}-error-log.csv`);
      } else {
        this._toaster.errorToast(res.message);
      }
    })
  }

  public base64ToBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    let offset = 0;
    while (offset < byteCharacters.length) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      let i = 0;
      while (i < slice.length) {
        byteNumbers[i] = slice.charCodeAt(i);
        i++;
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
      offset += sliceSize;
    }
    return new Blob(byteArrays, {type: contentType});
  }

  // download


  public prepareDate(dateArray: any) {
    if (dateArray[5] < 10) {
      dateArray[5] = '0' + dateArray[5];
    }
    return 'Last Import on ' + dateArray[2] + ' ' + this.MONTHS[(dateArray[1]-1)] + ' ' + dateArray[0] + ' @ ' + dateArray[3] + ':' + dateArray[4] + ':' + dateArray[5];
  }

  public onDDElementCompanySelect(event: IOption) {
    this.filter.company = event.value;
  }

  public onValueChange(event: Date): void {
    this.filter.startDate = moment(event).format(GIDDH_DATE_FORMAT);
  }

  public onDDElementTimeRangeSelect(event: IOption): void {
    this.filter.timeRange = event.value;
  }


  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}

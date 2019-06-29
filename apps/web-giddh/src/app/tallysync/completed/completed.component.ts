import {Observable, ReplaySubject} from 'rxjs';

import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';


import * as moment from 'moment/moment';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';
import {ActivatedRoute} from '@angular/router';
import {ToasterService} from '../../services/toaster.service';
import {ActiveFinancialYear, CompanyResponse} from "../../../../../../Nativemobile/src/app/models/api-models/Company";
import {takeUntil} from "rxjs/operators";
import {createSelector, select, Store} from "@ngrx/store";
import {AppState} from "../../store";
import {IOption} from "../../theme/ng-virtual-select/sh-options.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GIDDH_DATE_FORMAT} from "../../shared/helpers/defaultDateFormat";
import {TallySyncService} from "../../services/tally-sync.service";
import {TallySyncData} from "../../models/api-models/tally-sync";

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
      }
    })
    // ===============

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

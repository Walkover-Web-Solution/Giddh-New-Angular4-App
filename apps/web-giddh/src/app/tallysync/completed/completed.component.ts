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
  public maxDate = new Date();
  public startDate: string;
  public endDate: string;
  public filter: any = {};
  public activeFinancialYear: ActiveFinancialYear;
  public filterForm: FormGroup;
  public timeInterval: IOption[] = [
    {
      value: '0am',
      label: '00:00 am - 02:00 am'
    },
    {
      value: '2am',
      label: '02:00 am - 04:00 am'
    },
    {
      value: '4am',
      label: '04:00 am - 06:00 am'
    },
    {
      value: '6am',
      label: '06:00 am - 08:00 am'
    },
    {
      value: '8am',
      label: '08:00 am - 10:00 am'
    },
    {
      value: '10pm',
      label: '10:00 am - 12:00 pm'
    },
    {
      value: '12am',
      label: '12:00 pm - 02:00 pm'
    },
    {
      value: '2pm',
      label: '02:00 pm - 04:00 pm'
    },
    {
      value: '4pm',
      label: '04:00 pm - 06:00 pm'
    },
    {
      value: '6pm',
      label: '06:00 pm - 08:00 pm'
    },
    {
      value: '8pm',
      label: '08:00 pm - 10:00 pm'
    },
    {
      value: '10pm',
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
    this.universalDate$.subscribe(a => {
      if (a) {
        //this.filter.startDate = moment(a[1]).format('DD-MM-YYYY');
        this.filterForm.get('filterDate').patchValue(moment(a[1]).format('D-MMM-YYYY'));
      }
    });
    // set current company date
    this.companies$.subscribe(a => {
      if (a) {
        a.forEach((element) => {
          this.CompanyList.push({value: element.uniqueName, label: element.name});
        })
      }
    });
    // set interval
    this.filterForm.get('filterTimeInterval').patchValue(this.timeInterval[5].value);
  }

  public getReport() {
    if (this.filterForm.invalid) {
      this._toaster.errorToast("Please check your filter criteria");
      return;
    }
    console.log('Report');

    // api call here


    // ===============


  }

  public onDDElementSelect(event: IOption) {
    this.filter.company = event.value;
  }

  public onValueChange(event: Date): void {
    this.filter.startDate = moment(event).format(GIDDH_DATE_FORMAT);
  }


  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { IOption } from '../theme/ng-select/option.interface';
import { Observable } from 'rxjs/Observable';
import { States } from '../models/api-models/Company';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from '../lodash-optimized';
import { Store } from '@ngrx/store';
import { AppState } from '../store';
import { contriesWithCodes } from '../shared/helpers/countryWithCodes';

@Component({
  selector: 'welcome-component',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})

export class WelcomeComponent implements OnInit, OnDestroy {
  public companyProfileObj: any = null;
  public countryCodeList: IOption[] = [];
  public statesSource$: Observable<IOption[]> = Observable.of([]);
  public stateStream$: Observable<States[]>;
  public states: IOption[] = [];
  public countryIsIndia: boolean = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private store: Store<AppState>) {
    this.companyProfileObj = {};

    contriesWithCodes.map(c => {
      this.countryCodeList.push({ value: c.countryName, label: c.value });
    });

    this.stateStream$ = this.store.select(s => s.general.states).takeUntil(this.destroyed$);
    this.stateStream$.subscribe((data) => {
      if (data) {
        data.map(d => {
          this.states.push({ label: `${d.code} - ${d.name}`, value: `${d.code}` });
        });
      }
      this.statesSource$ = Observable.of(this.states);
    }, (err) => {
      // console.log(err);
    });
  }

  public ngOnInit() {
    //
  }

  /**
   * checkCountry
   */
  public checkCountry(event) {
    if (event) {
      let country: any = _.cloneDeep(this.companyProfileObj.country || '');
      country = country.toLocaleLowerCase();
      this.countryIsIndia = country === 'india';
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

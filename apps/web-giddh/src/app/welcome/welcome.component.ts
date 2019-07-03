import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { IOption } from '../theme/ng-select/option.interface';
import { States } from '../models/api-models/Company';
import * as _ from '../lodash-optimized';
import { Store } from '@ngrx/store';
import { AppState } from '../store';
import { contriesWithCodes } from '../shared/helpers/countryWithCodes';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { Router } from '@angular/router';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'welcome-component',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})

export class WelcomeComponent implements OnInit, OnDestroy, AfterViewInit {
  public companyProfileObj: any = null;
  public countryCodeList: IOption[] = [];
  public company: any = {};
  public statesSource$: Observable<IOption[]> = observableOf([]);
  public stateStream$: Observable<States[]>;
  public states: IOption[] = [];
  public countryIsIndia: boolean = false;
  public selectedCountry = '';
  public industrialList: IOption[] = [{
    label: 'Agriculture',
    value: 'Agriculture'
  }, {
    label: 'Automobile Transport',
    value: 'Automobile Transport'
  }, {
    label: 'Ecommerce',
    value: 'Ecommerce'
  }, {
    label: 'Education',
    value: 'Education'
  }, {
    label: 'Financial Institution',
    value: 'Financial Institution'
  }, {
    label: 'Gym',
    value: 'Gym'
  }, {
    label: 'Hospitality',
    value: 'Hospitality'
  }, {
    label: 'IT Company',
    value: 'IT Company'
  }, {
    label: 'Lifestyle Clubs',
    value: 'Lifestyle Clubs'
  }, {
    label: 'Logistics',
    value: 'Logistics'
  }, {
    label: 'Marriage Bureau',
    value: 'Marriage Bureau'
  }, {
    label: 'Media  Advertisement',
    value: 'Media  Advertisement'
  }, {
    label: 'Personal Use',
    value: 'Personal Use'
  }, {
    label: 'Political',
    value: 'Political'
  }, {
    label: 'Public Sector',
    value: 'Public Sector'
  }, {
    label: 'Real estate',
    value: 'Real estate'
  }, {
    label: 'Retail FMCG',
    value: 'Retail FMCG'
  }, {
    label: 'Stock and Commodity',
    value: 'Stock and Commodity'
  }, {
    label: 'Telecom',
    value: 'Telecom'
  }, {
    label: 'Tips And Alert',
    value: 'Tips And Alert'
  }, {
    label: 'Travel',
    value: 'Travel'
  }, {
    label: 'Wholesalers Distributors',
    value: 'Wholesalers Distributors'
  }
  ];
  public updateProfileSuccess$: Observable<boolean>;
  public businessptions: IOption[] = [
    { label: 'Unregister Business', value: 'Unregister Business' },
    { label: 'Register Business', value: 'Register Business' }
  ];

  public taxesoptions: IOption[] = [
    { label: 'TCS', value: 'TCS Tax' },
    { label: 'TDS', value: 'TDS Tax' },
  ];

  public hideTextarea = true;
  public collapseTextarea = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private settingsProfileActions: SettingsProfileActions,
    private _router: Router, private _generalService: GeneralService) {
    this.companyProfileObj = {};

    contriesWithCodes.map(c => {
      this.countryCodeList.push({ value: c.value, label: c.value, additional: c.countryName });
    });

    this.stateStream$ = this.store.select(s => s.general.states).pipe(takeUntil(this.destroyed$));
    this.stateStream$.subscribe((data) => {
      if (data) {
        data.map(d => {
          this.states.push({ label: `${d.name}`, value: `${d.name}` });
        });
      }
      this.statesSource$ = observableOf(this.states);
    }, (err) => {
      // console.log(err);
    });
    this.store.select(state => {
      if (!state.session.companies) {
        return;
      }
      state.session.companies.forEach(cmp => {
        if (cmp.uniqueName === state.session.companyUniqueName) {
          this.countryIsIndia = cmp.country.toLocaleLowerCase() === 'india';

          if (cmp.country && this.companyProfileObj && !this.companyProfileObj.country) {
            this.selectedCountry = cmp.country;
            this.autoSelectCountryCode(cmp.country);
          }
        }
      });
    }).pipe(takeUntil(this.destroyed$)).subscribe();
    this.updateProfileSuccess$ = this.store.select(s => s.settings.updateProfileSuccess).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.updateProfileSuccess$.subscribe(s => {
      if (s) {
        this._router.navigate(['/select-plan']);
      }
    });
  }

  public ngAfterViewInit() {
    this._generalService.IAmLoaded.next(true);
  }

  public skip() {
    this._router.navigate(['/onboarding']);
  }

  public makeMeCaptialize(companyName: string) {
    if (companyName) {
      this.company.name = companyName[0].toUpperCase() + companyName.substr(1, companyName.length);
    }
  }

  public submit() {
    let object = _.cloneDeep(this.companyProfileObj);
    if (object.country && object.contactNo) {
      object.contactNo = _.cloneDeep(`${object.country}${object.contactNo}`);
      object.country = this.selectedCountry;
    } else {
      object.country = this.selectedCountry;
      object.contactNo = null;
    }
    this.store.dispatch(this.settingsProfileActions.UpdateProfile(object));
  }

  /**
   * autoSelectCountryCode
   */
  public autoSelectCountryCode(country) {
    if (this.countryCodeList) {
      let selectedCountry = _.find(this.countryCodeList, function (o) {
        return o.additional === country;
      });
      if (selectedCountry && selectedCountry.value) {
        this.companyProfileObj.country = selectedCountry.value;
      }
    }

  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AccountAddComponent } from '../shared/header/components/index';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Select2OptionData } from '../../shared/theme/select2/select2.interface';
import { IFlattenGroupsAccountsDetail } from '../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { FIXED_CATEGORY_OF_GROUPS } from '../sales.module';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

@Component({
  selector: 'aside-menu-account',
  styles: [`
  :host{
    position: fixed;
    left: auto;
    top: 0;
    right: 0;
    bottom: 0;
    width: 400px;
    z-index: 1045;
  }
  `],
  templateUrl: './aside.menu.account.component.html'
})
export class AsideMenuAccountComponent implements OnInit {

  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  // public flatAccountWGroupsList: IFlattenGroupsAccountsDetail[];
  public flatAccountWGroupsList$: Observable<Select2OptionData[]>;
  public select2Options: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Select Group',
    allowClear: true
  };
  // private below
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
  ) {
  }

  public ngOnInit() {
    // get groups list
    this.store.select(state => {
      return state.flyAccounts.flattenGroupsAccounts;
    }).takeUntil(this.destroyed$).subscribe(o => {
      if (o && o.length > 0) {
        let result: Select2OptionData[] = [];
        _.forEach(_.cloneDeep(o), (grp: IFlattenGroupsAccountsDetail) => {
          if (_.indexOf(FIXED_CATEGORY_OF_GROUPS, grp.groupUniqueName) === -1) {
            result.push({ text: grp.groupName, id: grp.groupUniqueName });
          }
        });
        this.flatAccountWGroupsList$ = Observable.of(result);
        console.log(this.flatAccountWGroupsList$);
      }
    });
  }

  public closeAsidePane(event) {
    this.closeAsideEvent.emit(event);
  }
}

import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import * as _ from '../../lodash-optimized';
import { AccountRequestV2 } from '../../models/api-models/Account';
import { AccountsAction } from '../../actions/accounts.actions';
import { GroupService } from '../../services/group.service';
import { GroupResponse } from '../../models/api-models/Group';
import { IOption } from '../../theme/ng-select/option.interface';

const GROUP = ['revenuefromoperations', 'otherincome', 'operatingcost', 'indirectexpenses'];

@Component({
  selector: 'aside-menu-account',
  styleUrls: ['./aside.menu.account.component.scss'],
  templateUrl: './aside.menu.account.component.html'
})
export class AsideMenuAccountComponent implements OnInit, OnDestroy, OnChanges {

  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  @Input() public isPurchaseInvoice: boolean = false;
  public flatAccountWGroupsList$: Observable<IOption[]>;
  public select2Options: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Select Group',
    allowClear: true
  };
  public activeGroupUniqueName: string;
  public isGstEnabledAcc: boolean = true;
  public isHsnSacEnabledAcc: boolean = false;
  public fetchingAccUniqueName$: Observable<boolean>;
  public isAccountNameAvailable$: Observable<boolean>;
  public createAccountInProcess$: Observable<boolean>;
  // private below
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private groupService: GroupService,
    private accountsAction: AccountsAction
  ) {
    // account-add component's property
    this.fetchingAccUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingAccUniqueName).pipe(takeUntil(this.destroyed$));
    this.isAccountNameAvailable$ = this.store.select(state => state.groupwithaccounts.isAccountNameAvailable).pipe(takeUntil(this.destroyed$));
    this.createAccountInProcess$ = this.store.select(state => state.groupwithaccounts.createAccountInProcess).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    // get groups list and refine list
    if (!this.isPurchaseInvoice) {
      this.getGroups('currentassets', 'sundrydebtors');
    } else {
      this.getGroups('currentliabilities', 'sundrycreditors');
    }
  }

  public addNewAcSubmit(accRequestObject: { activeGroupUniqueName: string, accountRequest: AccountRequestV2 }) {
    this.store.dispatch(this.accountsAction.createAccountV2(accRequestObject.activeGroupUniqueName, accRequestObject.accountRequest));
  }

  public closeAsidePane(event) {
    this.closeAsideEvent.emit(event);
  }

  public getGroups(parentGrp, findItem) {
    this.groupService.GetGroupsWithAccounts('').subscribe(res => {
      let result: IOption[] = [];
      if (res.status === 'success' && res.body.length > 0) {
        let currentassets = _.find(res.body, {uniqueName: parentGrp});
        let sundryGrp;
        if (currentassets) {
          sundryGrp = _.find(currentassets.groups, {uniqueName: findItem});
        }
        if (sundryGrp) {
          let flatGrps = this.groupService.flattenGroup([sundryGrp], []);
          _.forEach(flatGrps, (grp: GroupResponse) => {
            result.push({label: grp.name, value: grp.uniqueName});
          });
        }
      }
      this.flatAccountWGroupsList$ = observableOf(result);
      this.activeGroupUniqueName = findItem;
    });
  }

  public ngOnChanges(s: SimpleChanges) {
    if (s && s['isPurchaseInvoice'] && s['isPurchaseInvoice'].currentValue) {
      this.getGroups('currentliabilities', 'sundrycreditors');
    } else if (s && s['isPurchaseInvoice'] && !s['isPurchaseInvoice'].currentValue) {
      this.getGroups('currentassets', 'sundrydebtors');
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

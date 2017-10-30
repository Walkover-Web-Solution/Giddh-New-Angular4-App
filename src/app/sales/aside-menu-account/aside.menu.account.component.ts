import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import * as _ from '../../lodash-optimized';
import { AccountRequestV2 } from '../../models/api-models/Account';
import { AccountsAction } from '../../services/actions/accounts.actions';
import { GroupService } from '../../services/group.service';
import { GroupResponse } from '../../models/api-models/Group';
import { IOption } from '../../theme/ng-select/option.interface';

const GROUP = ['revenuefromoperations', 'otherincome', 'operatingcost', 'indirectexpenses'];

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
    #close{
      display: none;
    }
    :host.in  #close{
      display: block;
      position: fixed;
      left: -42px;
      top: 0;
      z-index: 5;
    }
    :host .container-fluid{
      padding-left: 0;
      padding-right: 0;
    }
  `],
  templateUrl: './aside.menu.account.component.html'
})
export class AsideMenuAccountComponent implements OnInit {

  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
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
  public createAccountIsSuccess$: Observable<boolean>;
  // private below
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private groupService: GroupService,
    private accountsAction: AccountsAction
  ) {
    // account-add component's property
    this.fetchingAccUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingAccUniqueName).takeUntil(this.destroyed$);
    this.isAccountNameAvailable$ = this.store.select(state => state.groupwithaccounts.isAccountNameAvailable).takeUntil(this.destroyed$);
    this.createAccountInProcess$ = this.store.select(state => state.groupwithaccounts.createAccountInProcess).takeUntil(this.destroyed$);
    this.createAccountIsSuccess$ = this.store.select(state => state.groupwithaccounts.createAccountIsSuccess).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    // get groups list and refine list
    this.groupService.GetGroupSubgroups('currentassets').subscribe(res => {
      let result: IOption[] = [];
      if (res.status === 'success' && res.body.length > 0) {
        let sundryGrp = _.find(res.body, { uniqueName: 'sundrydebtors'});
        if (sundryGrp) {
          let flatGrps = this.groupService.flattenGroup([sundryGrp], []);
          _.forEach(flatGrps, (grp: GroupResponse) => {
            result.push({ label: grp.name, value: grp.uniqueName });
          });
        }
      }
      this.flatAccountWGroupsList$ = Observable.of(result);
      this.activeGroupUniqueName = 'sundrydebtors';
    });

    this.createAccountIsSuccess$.takeUntil(this.destroyed$).subscribe((o) => {
      if (o) {
        this.closeAsidePane(event);
      }
    });
  }

  public addNewAcSubmit(accRequestObject: { activeGroupUniqueName: string, accountRequest: AccountRequestV2 }) {
    this.store.dispatch(this.accountsAction.createAccountV2(accRequestObject.activeGroupUniqueName, accRequestObject.accountRequest));
  }

  public closeAsidePane(event) {
    this.closeAsideEvent.emit(event);
  }
}

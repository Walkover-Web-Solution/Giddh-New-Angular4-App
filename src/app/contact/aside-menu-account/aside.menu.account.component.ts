import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { AccountRequestV2 } from '../../models/api-models/Account';
import { AccountsAction } from '../../actions/accounts.actions';
import { GroupService } from '../../services/group.service';
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
      width: 480px;
      z-index: 1045;
    }
    #close{
      display: none;
    }
    :host.in  #close{
      display: block;
      position: fixed;
      left: -41px;
      top: 0;
      z-index: 5;
      border: 0;
      border-radius: 0;
    }
    :host .container-fluid{
      padding-left: 0;
      padding-right: 0;
    }
    :host .aside-pane {
      width: 480px;
    }
  `],
  templateUrl: './aside.menu.account.component.html'
})
export class AsideMenuAccountInContactComponent implements OnInit, OnDestroy {

  @Input() public activeGroupUniqueName: string;
  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  public flatAccountWGroupsList$: Observable<IOption[]>;
  public select2Options: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Select Group',
    allowClear: true
  };
  public isGstEnabledAcc: boolean = true;
  public isHsnSacEnabledAcc: boolean = false;
  public fetchingAccUniqueName$: Observable<boolean>;
  public isAccountNameAvailable$: Observable<boolean>;
  public createAccountInProcess$: Observable<boolean>;
  // private below
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private groups = [
    {label: 'Sundry Debtors', value: 'sundrydebtors'},
    {label: 'Sundry Creditors', value: 'sundrycreditors'},
    {label: 'Discount', value: 'discount'},
  ];

  constructor(
    private store: Store<AppState>,
    private groupService: GroupService,
    private accountsAction: AccountsAction
  ) {
    // account-add component's property
    this.fetchingAccUniqueName$ = this.store.select(state => state.groupwithaccounts.fetchingAccUniqueName).takeUntil(this.destroyed$);
    this.isAccountNameAvailable$ = this.store.select(state => state.groupwithaccounts.isAccountNameAvailable).takeUntil(this.destroyed$);
    this.createAccountInProcess$ = this.store.select(state => state.groupwithaccounts.createAccountInProcess).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.isGstEnabledAcc = this.activeGroupUniqueName !== 'discount';
    this.isHsnSacEnabledAcc = !this.isGstEnabledAcc;
    this.flatAccountWGroupsList$ = Observable.of(this.groups);
  }

  public addNewAcSubmit(accRequestObject: { activeGroupUniqueName: string, accountRequest: AccountRequestV2 }) {
    this.store.dispatch(this.accountsAction.createAccountV2(accRequestObject.activeGroupUniqueName, accRequestObject.accountRequest));
  }

  public closeAsidePane(event) {
    this.closeAsideEvent.emit(event);
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

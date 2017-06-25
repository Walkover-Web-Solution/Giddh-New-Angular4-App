import { Component, Input, OnInit } from '@angular/core';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { IFlattenGroupsAccountsDetail } from '../../../../models/interfaces/flattenGroupsAccountsDetail.interface';

@Component({
  selector: 'accounts-side-bar',
  templateUrl: './accounts-side-bar.component.html',
  styleUrls: ['./accounts-side-bar.component.css']
})
export class AccountsSideBarComponent implements OnInit {
  @Input() public flyAccounts: boolean;
  public flatAccountWGroupsList$: Observable<IFlattenGroupsAccountsDetail[]>;
  public companyList: any;
  public showAccountList: boolean = true;
  public noGroups: boolean;
  // tslint:disable-next-line:no-empty
  constructor(private store: Store<AppState>) {
    this.flatAccountWGroupsList$ = this.store.select(state => {
      return state.groupwithaccounts.flattenGroupsAccounts;
    });
  }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {
  }

}

import { Component, OnInit, Input } from '@angular/core';
// import { IAccount } from '../../../../models/interfaces/accountCreate.interface';
import { IAccountsInfo } from '../../../../models/interfaces/accountInfo.interface';

@Component({
  selector: 'group-account-list',
  templateUrl: './group-accounts-list.component.html'
})
export class GroupAccountsListComponent implements OnInit {
  @Input() public accountsList: IAccountsInfo[];
  // tslint:disable-next-line:no-empty
  constructor() { }

  // tslint:disable-next-line:no-empty
  public ngOnInit() { }
}

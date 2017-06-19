import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'accounts-side-bar',
  templateUrl: './accounts-side-bar.component.html',
  styleUrls: ['./accounts-side-bar.component.css']
})
export class AccountsSideBarComponent implements OnInit {
 @Input() public flyAccounts: boolean;
 public flatAccountWGroupsList: string[] = [];
 public companyList: any;
 public showAccountList: boolean = true;
 public noGroups: boolean;
  constructor() { }

  ngOnInit() {
  }

}

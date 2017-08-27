import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from 'lodash';
import { RecTypePipe } from '../../../shared/helpers/pipes/recType.pipe';
import { Account, AccountFlat, ChildGroup } from '../../../models/api-models/Search';

@Component({
  selector: 'tb-export-csv',  // <home></home>
  template: `
    <div class="form-group export" (clickOutside)="showCsvDownloadOptions=false;">
      <a title="" download="" (click)="showCsvDownloadOptions = !showCsvDownloadOptions" *ngIf="enableDownload"><img
        src="/assets/images/csv.png" class="csv"/></a>
      <div class="export-options" *ngIf="showCsvDownloadOptions">
        <span class="arrow"></span>
        <ul class="list-unstyled">
          <li><a href="" (click)="hideOptions('group-wise', $event)" export-report data-report="group-wise">Group Wise
            Report</a></li>
          <li><a href="" (click)="hideOptions('condensed', $event)" export-report data-report="condensed">Condensed
            Report</a></li>
          <li><a href="" (click)="hideOptions('account-wise', $event)" export-report data-report="account-wise">Account
            Wise
            Report</a></li>
        </ul>
      </div>
    </div>
    <!-- end form-group -->
  `
})
export class TbExportCsvComponent implements OnInit, OnDestroy {
  @Output() public tbExportCsvEvent = new EventEmitter<string>();
  public showCsvDownloadOptions: boolean;
  public enableDownload: boolean = true;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private exportData: ChildGroup[];
  private fnGroupWise: string;
  private selectedCompany: any;
  private showOptions: boolean;
  private csvGW: any;
  private uriGroupWise: any;
  private uriAccountWise: any;
  private fnAccountWise: string;
  private csvAW: any;

  /**
   * TypeScript public modifiers
   */
  constructor(private fb: FormBuilder, private recType: RecTypePipe) {

  }

  public formatDataGroupWise = e => {
    let companyDetails;
    let csv;
    let groups;
    let header;
    let rawData;
    let row;
    let title;
    let total;
    groups = [];
    rawData = this.exportData;
    total = {
      ob: 0,
      cb: 0,
      cr: 0,
      dr: 0
    };
    csv = '';
    row = '';
    header = '';
    title = '' + ',' + 'Opening Balance' + ',' + 'Debit' + ',' + 'Credit' + ',' + 'Closing Balance' + '\n';
    this.fnGroupWise = "Trial_Balance.csv";
    companyDetails = this.selectedCompany;
    header = `${companyDetails.name}\r\n"${companyDetails.address}"\r\n${companyDetails.city}-${companyDetails.pincode}\r\nTrial Balance: fromDate  to toDate\r\n`;
    csv += `${header}\r\n${title}`;
    // _.each(rawData, obj => {
    //   let group;
    //   group = {};
    //   group.name = obj.groupName;
    //   group.openingBalance = obj.forwardedBalance.amount;
    //   group.openingBalanceType = obj.forwardedBalance.type;
    //   group.credit = obj.creditTotal;
    //   group.debit = obj.debitTotal;
    //   group.closingBalance = obj.closingBalance.amount;
    //   group.closingBalanceType = obj.closingBalance.type;
    //   group.isVisible = obj.isVisible;
    //   return groups.push(group);
    // });
    _.each(this.exportData, obj => {
      if (obj.isVisible) {
        row += `${obj.groupName},${obj.forwardedBalance} ${this.recType.transform(obj.forwardedBalance)},${obj.debitTotal},${obj.creditTotal},${obj.closingBalance}${this.recType.transform(obj.closingBalance)}\r\n`;
        if (obj.forwardedBalance.type === "DEBIT") {
          total.ob = total.ob + obj.forwardedBalance.amount;
        } else {
          total.ob = total.ob - obj.forwardedBalance.amount;
        }
        if (obj.closingBalance.type === "DEBIT") {
          total.cb = total.cb + obj.closingBalance.amount;
        } else {
          total.cb = total.cb - obj.closingBalance.amount;
        }
        total.cr += obj.creditTotal;
        return total.dr += obj.debitTotal;
      }
    });
    if (total.ob < 0) {
      total.ob = total.ob * -1;
      total.ob = `${total.ob} Cr`;
    } else {
      total.ob = `${total.ob} Dr`;
    }
    if (total.cb < 0) {
      total.cb = total.cb * -1;
      total.cb = `${total.cb} Cr`;
    } else {
      total.cb = `${total.cb} Dr`;
    }
    csv += `${row}\r\n`;
    csv += `\r\nTotal,${total.ob},${total.dr},${total.cr},${total.cb}\n`;
    this.csvGW = csv;
    this.uriGroupWise = `data:text/csv;charset=utf-8,${csv}`;
    this.showOptions = true;
    return e.stopPropagation();
  };

  public formatDataAccountWise = e => {
    let accounts: AccountFlat[];
    let body;
    let childGroups;
    let companyDetails;
    let createCsv;
    let csv;
    let footer;
    let groups;
    let header;
    let rawData;
    let row;
    let sortChildren;
    let title;
    let total;
    groups = [];
    accounts = [];
    childGroups = [];
    rawData = this.exportData;
    total = {
      ob: 0,
      cb: 0,
      cr: 0,
      dr: 0
    };
    this.fnAccountWise = "Trial_Balance_account-wise.csv";
    row = '';
    title = '';
    body = '';
    footer = '';
    companyDetails = this.selectedCompany;
    header = `${companyDetails.name}\r\n"${companyDetails.address}"\r\n${companyDetails.city}-${companyDetails.pincode}\r\nTrial Balance: fromDate to toDate\r\n`;
    // Flatten All Accounts > accounts , Flatten All ChildGroups > ChildGroups, Flatten All
    const toAccountFlat = (accounts: Account[], parentGroup: string) => {
      return accounts.map(p => {
        return <AccountFlat>{
          name: p.name,
          openingBalance: p.openingBalance.amount,
          openBalanceType: p.openingBalance.type,
          creditTotal: p.creditTotal,
          debitTotal: p.debitTotal,
          closingBalance: p.closingBalance.amount,
          closeBalanceType: p.closingBalance.type,
          parent: parentGroup,
          uniqueName: ''
        };
      });
    };
    sortChildren = (parent: ChildGroup[]) => {
      _.each(parent, obj => {
        if (obj.accounts.length > 0) {
          accounts.push(...toAccountFlat(obj.accounts, obj.groupName));
        }
      });
      return _.each(parent, obj => {
        if (obj.childGroups.length > 0) {
          return _.each(obj.childGroups, chld => {
            if (chld.accounts.length > 0) {
              accounts.push(...toAccountFlat(chld.accounts, chld.groupName));
            }
            if (chld.childGroups.length > 0) {
              return sortChildren(chld.childGroups);
            }
          });
        }
      });
    };
    sortChildren(rawData);
    title += 'Name' + ',' + 'Opening Balance' + ',' + 'Debit' + ',' + 'Credit' + ',' + 'Closing Balance' + '\r\n';
    createCsv = data => {
      _.each(data, obj => {
        row = row || '';
        if (obj.isVisible === true) {
          row += `${obj.name} (${obj.parent}),${obj.openingBalance} ${this.recType.transform({
            type: obj.openingBalanceType,
            amount: obj.openingBalance
          })},${obj.debit},${obj.credit},${obj.closingBalance},${this.recType.transform({
            type: obj.closingBalanceType,
            amount: obj.closingBalance
          })}\r\n`;
          if (obj.openingBalanceType === "DEBIT") {
            total.ob = total.ob + obj.openingBalance;
          } else {
            total.ob = total.ob - obj.openingBalance;
          }
          if (obj.closingBalanceType === "DEBIT") {
            total.cb = total.cb + obj.closingBalance;
          } else {
            total.cb = total.cb - obj.closingBalance;
          }
          total.cr += obj.credit;
          return total.dr += obj.debit;
        }
      });
      if (total.ob < 0) {
        total.ob = total.ob * -1;
        total.ob = `${total.ob} Cr`;
      } else {
        total.ob = `${total.ob} Dr`;
      }
      if (total.cb < 0) {
        total.cb = total.cb * -1;
        total.cb = `${total.cb} Cr`;
      } else {
        total.cb = `${total.cb} Dr`;
      }
      return body += `${row}\r\n`;
    };
    createCsv(accounts);
    footer += `Total,${total.ob},${total.dr},${total.cr},${total.cb}\n`;
    csv = `${header}\r\n\r\n${title}\r\n${body}${footer}`;
    this.csvAW = csv;
    this.uriAccountWise = `data:text/csv;charset=utf-8,${(csv)}`;
    this.showOptions = true;
    return e.stopPropagation();
  };

  /*  public formatDataCondensed = e => {
      let body;
      let companyDetails;
      let createCsv;
      let csv;
      let footer;
      let groupData;
      let header;
      let rawData;
      let sortData;
      let title;
      let total;
      rawData = $scope.exportData;
      groupData = [];
      total = {
        ob: 0,
        cb: 0,
        cr: 0,
        dr: 0
      };
      csv = '';
      title = '';
      body = '';
      footer = '';
      companyDetails = $rootScope.selectedCompany;
      header = `${companyDetails.name}\r\n"${companyDetails.address}"\r\n${companyDetails.city}-${companyDetails.pincode}\r\nTrial Balance: ${$filter('date')($scope.fromDate.date, "dd-MM-yyyy")} to ${$filter('date')($scope.toDate.date, "dd-MM-yyyy")}\r\n`;
      $scope.fnCondensed = "Trial_Balance_condensed.csv";
      sortData = (parent, groups) => _.each(parent, obj => {
        let group;
        group = group || {
          accounts: [],
          childGroups: []
        };
        group.name = obj.groupName;
        group.openingBalance = obj.forwardedBalance.amount;
        group.openingBalanceType = obj.forwardedBalance.type;
        group.credit = obj.creditTotal;
        group.debit = obj.debitTotal;
        group.closingBalance = obj.closingBalance.amount;
        group.closingBalanceType = obj.closingBalance.type;
        group.isVisible = obj.isVisible;
        if (obj.accounts.length > 0) {
          _.each(obj.accounts, acc => {
            let account;
            account = {};
            account.name = acc.name;
            account.openingBalance = acc.openingBalance.amount;
            account.openingBalanceType = acc.openingBalance.type;
            account.credit = acc.creditTotal;
            account.debit = acc.debitTotal;
            account.closingBalance = acc.closingBalance.amount;
            account.closingBalanceType = acc.closingBalance.type;
            account.isVisible = acc.isVisible;
            return group.accounts.push(account);
          });
        }
        if (obj.childGroups.length > 0) {
          _.each(obj.childGroups, grp => {
            let childGroup;
            childGroup = childGroup || {
              childGroups: [],
              accounts: []
            };
            childGroup.name = grp.groupName;
            childGroup.parent = obj.groupName;
            childGroup.openingBalance = grp.forwardedBalance.amount;
            childGroup.openingBalanceType = grp.forwardedBalance.type;
            childGroup.credit = grp.creditTotal;
            childGroup.debit = grp.debitTotal;
            childGroup.closingBalance = grp.closingBalance.amount;
            childGroup.closingBalanceType = grp.closingBalance.type;
            childGroup.isVisible = grp.isVisible;
            group.childGroups.push(childGroup);
            if (grp.accounts.length > 0) {
              _.each(grp.accounts, acc => {
                let account;
                childGroup.accounts = childGroup.accounts || [];
                account = {};
                account.name = acc.name;
                account.openingBalance = acc.openingBalance.amount;
                account.openingBalanceType = acc.openingBalance.type;
                account.credit = acc.creditTotal;
                account.debit = acc.debitTotal;
                account.closingBalance = acc.closingBalance.amount;
                account.closingBalanceType = acc.closingBalance.type;
                account.isVisible = acc.isVisible;
                return childGroup.accounts.push(account);
              });
            }
            if (grp.childGroups.length > 0) {
              return sortData(grp.childGroups, childGroup.childGroups);
            }
          });
        }
        return groups.push(group);
      });
      sortData(rawData, groupData);
      title += 'Name' + ',' + 'Opening Balance' + ',' + 'Debit' + ',' + 'Credit' + ',' + 'Closing Balance' + '\r\n';
      createCsv = csvObj => {
        let bodyGen;
        let index;
        index = 0;
        bodyGen = (csvObj, index) => {
          let bd;
          bd = '';
          _.each(csvObj, obj => {
            let i;
            let j;
            let ref;
            let row;
            let strIndex;
            row = '';
            strIndex = '';
            for (i = j = 0, ref = index; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
              strIndex += '   ';
            }
            if (obj.isVisible === true && obj.closingBalance !== 0) {
              row += `${strIndex + obj.name.toUpperCase()},${obj.openingBalance}${this.recType.transform(obj.openingBalanceType, obj.openingBalance)},${obj.debit},${obj.credit},${obj.closingBalance}${this.recType.transform(obj.closingBalanceType, obj.ClosingBalance)}\r\n`;
              if (obj.accounts === void 0) {
                console.log(obj);
              }
              if (obj.accounts.length > 0) {
                _.each(obj.accounts, acc => {
                  if (acc.isVisible === true) {
                    row += `${strIndex}   ${$scope.firstCapital(acc.name.toLowerCase())} (${$scope.firstCapital(obj.name)}),${acc.openingBalance}${this.recType.transform(acc.openingBalanceType, acc.openingBalance)},${acc.debit},${acc.credit},${acc.closingBalance}${this.recType.transform(acc.closingBalanceType, acc.closingBalance)}\r\n`;
                    if (acc.openingBalanceType === "DEBIT") {
                      total.ob = total.ob + acc.openingBalance;
                    } else {
                      total.ob = total.ob - acc.openingBalance;
                    }
                    if (acc.closingBalanceType === "DEBIT") {
                      total.cb = total.cb + acc.closingBalance;
                    } else {
                      total.cb = total.cb - acc.closingBalance;
                    }
                    total.cr += acc.credit;
                    return total.dr += acc.debit;
                  }
                });
                if (total.ob < 0) {
                  total.ob = total.ob * -1;
                  total.ob = `${total.ob} Cr`;
                } else {
                  total.ob = `${total.ob} Dr`;
                }
                if (total.cb < 0) {
                  total.cb = total.cb * -1;
                  total.cb = `${total.cb} Cr`;
                } else {
                  total.cb = `${total.cb} Dr`;
                }
              }
              if (obj.childGroups.length > 0) {
                row += bodyGen(obj.childGroups, index + 1);
              }
            }
            return bd += row;
          });
          return bd;
        };
        body = bodyGen(csvObj, 0);
        footer += `Total,${total.ob},${total.dr},${total.cr},${total.cb}\n`;
        return csv = `${header}\r\n\r\n${title}\r\n${body}\r\n${footer}\r\n`;
      };
      createCsv(groupData);
      $scope.csvCond = csv;
      $scope.uriCondensed = `data:text/csv;charset=utf-8,${escape(csv)}`;
      $scope.showOptions = true;
      return e.stopPropagation();
    };*/

  public formatData = e => {
    this.formatDataGroupWise(e);
    //this.formatDataCondensed(e);
    this.formatDataAccountWise(e);
  };

  public hideOptions(value: string, e: Event) {
    this.showCsvDownloadOptions = false;
    this.tbExportCsvEvent.emit(value);
    e.preventDefault();
    return false;
  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    //
  }

}

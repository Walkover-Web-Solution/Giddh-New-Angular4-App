import { Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AppState } from '../../../store/roots';

@Component({
  selector: 'tl-pl-grid',  // <home></home>
  templateUrl: './tl-pl-grid.component.html'
})
export class TlPlGridComponent implements OnInit, OnDestroy {
  public showTbplLoader: boolean;
  public noData: boolean;
  public showClearSearch: boolean;
  public enableDownload: boolean;
  public showOptions: boolean;
  public showpdf: boolean;
  public showTbXls: boolean;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>) {

  }

  public formatData(e) {
    this.formatDataGroupWise(e);
    this.formatDataCondensed(e);
    this.formatDataAccountWise(e);
  }

  public formatDataGroupWise(e) {
    // let companyDetails;
    // let csv;
    // let groups;
    // let header;
    // let rawData;
    // let row;
    // let title;
    // let total;
    // groups = [];
    // rawData = this.exportData;
    // total = {
    //   ob: 0,
    //   cb: 0,
    //   cr: 0,
    //   dr: 0
    // };
    // csv = '';
    // row = '';
    // header = '';
    // title = '' + ',' + 'Opening Balance' + ',' + 'Debit' + ',' + 'Credit' + ',' + 'Closing Balance' + '\n';
    // this.fnGroupWise = 'Trial_Balance.csv';
    // companyDetails = this.selectedCompany;
    // header = companyDetails.name + '\r\n' + '"' + companyDetails.address + '"' + '\r\n' + companyDetails.city + '-' + companyDetails.pincode + '\r\n' + 'Trial Balance' + ': ' + $filter('date')(this.fromDate.date, 'dd-MM-yyyy') + ' to ' + $filter('date')(this.toDate.date, 'dd-MM-yyyy') + '\r\n';
    // csv += header + '\r\n' + title;
    // _.each(rawData, function(obj) {
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
    // _.each(groups, function(obj) {
    //   if (obj.isVisible) {
    //     row += obj.name + ',' + obj.openingBalance + ' ' + $filter('recType')(obj.openingBalanceType, obj.openingBalance) + ',' + obj.debit + ',' + obj.credit + ',' + obj.closingBalance + $filter('recType')(obj.closingBalanceType, obj.closingBalance) + '\r\n';
    //     if (obj.openingBalanceType === 'DEBIT') {
    //       total.ob = total.ob + obj.openingBalance;
    //     } else {
    //       total.ob = total.ob - obj.openingBalance;
    //     }
    //     if (obj.closingBalanceType === 'DEBIT') {
    //       total.cb = total.cb + obj.closingBalance;
    //     } else {
    //       total.cb = total.cb - obj.closingBalance;
    //     }
    //     total.cr += obj.credit;
    //     return total.dr += obj.debit;
    //   }
    // });
    // if (total.ob < 0) {
    //   total.ob = total.ob * -1;
    //   total.ob = total.ob + ' Cr';
    // } else {
    //   total.ob = total.ob + ' Dr';
    // }
    // if (total.cb < 0) {
    //   total.cb = total.cb * -1;
    //   total.cb = total.cb + ' Cr';
    // } else {
    //   total.cb = total.cb + ' Dr';
    // }
    // csv += row + '\r\n';
    // csv += '\r\n' + 'Total' + ',' + total.ob + ',' + total.dr + ',' + total.cr + ',' + total.cb + '\n';
    // this.csvGW = csv;
    // this.uriGroupWise = 'data:text/csv;charset=utf-8,' + escape(csv);
    // this.showOptions = true;
  }

  public formatDataCondensed(e) {

  }

  public formatDataAccountWise(e) {

  }

  public hideOptions() {
    this.showOptions = false;
    this.showpdf = false;
    return false;
  }

  public showPdfOptions() {

  }

  public showTbXlsOptions() {
    this.showTbXls = true;
    return false;
  }

  public downloadTbXls() {
    this.showOptions = false;
    this.showTbXls = false;
    return false;

  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}

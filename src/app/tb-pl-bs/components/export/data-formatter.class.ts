import { ComapnyResponse } from '../../../models/api-models/Company';
import { RecTypePipe } from '../../../shared/helpers/pipes/recType.pipe';
import { Account, ChildGroup } from '../../../models/api-models/Search';
import { Total } from './tb-export-csv.component';

export class DataFormatter {
  public accounts: Account[] = [];
  public groups: ChildGroup[] = [];

  constructor(private exportData: ChildGroup[],
              private selectedCompany: ComapnyResponse,
              private recType: RecTypePipe) {

  }


  public formatDataGroupWise = (): string => {
    let csv;
    let header;
    let row;
    let title;
    let total: Total;
    total = {
      ob: 0,
      cb: 0,
      cr: 0,
      dr: 0
    };
    csv = '';
    row = '';
    title = '' + ',' + 'Opening Balance' + ',' + 'Debit' + ',' + 'Credit' + ',' + 'Closing Balance' + '\n';
    header = `${this.selectedCompany.name}\r\n"${this.selectedCompany.address}"\r\n${this.selectedCompany.city}-${this.selectedCompany.pincode}\r\nTrial Balance: fromDate  to toDate\r\n`;
    csv += `${header}\r\n${title}`;

    this.exportData.forEach(obj => {
      // if (obj.isVisible) {
      row += `${obj.groupName},${obj.forwardedBalance.amount} ${this.recType.transform(obj.forwardedBalance)},${obj.debitTotal},${obj.creditTotal},${obj.closingBalance.amount}${this.recType.transform(obj.closingBalance)}\r\n`;
      total = this.calculateTotal(obj, total);
      // }
    });
    csv += `${row}\r\n`;
    csv += `\r\nTotal,${this.suffixRecordType(total.ob)},${total.dr},${total.cr},${this.suffixRecordType(total.cb)}\n`;
    return csv;
  };

  public formatDataAccountWise = (): string => {
    let body;
    let createCsv;
    let csv;
    let footer;
    let header;
    let row;
    let title;
    let total;
    total = {
      ob: 0,
      cb: 0,
      cr: 0,
      dr: 0
    };
    row = '';
    title = '';
    body = '';
    footer = '';
    header = `${this.selectedCompany.name}\r\n"${this.selectedCompany.address}"\r\n${this.selectedCompany.city}-${this.selectedCompany.pincode}\r\nTrial Balance: fromDate to toDate\r\n`;
    title += 'Name' + ',' + 'Opening Balance' + ',' + 'Debit' + ',' + 'Credit' + ',' + 'Closing Balance' + '\r\n';
    createCsv = (groups: ChildGroup[]) => {
      const addRow = (group: ChildGroup) => {
        if (group.accounts.length > 0) {
          group.accounts.forEach(account => {
            // if (account.isVisible === true) {
            row += `${account.name} (${group.groupName}),${account.openingBalance.amount} ${this.recType.transform(account.openingBalance)},${account.debitTotal},${account.creditTotal},${account.closingBalance.amount},${this.recType.transform(account.closingBalance)}\r\n`;
            total = this.calculateTotal(group, total);
            // }
          });
        }
      };
      groups.forEach(group => {
        if (group.accounts.length > 0) {
          addRow(group);
        }
        group.childGroups.forEach(childGroup => {
          if (childGroup.accounts.length > 0) {
            addRow(childGroup);
          }
          if (childGroup.childGroups.length > 0) {
            return createCsv(childGroup.childGroups);
          }
        });
      });
      return `${row}\r\n`;
    };
    body = createCsv(this.exportData);
    footer += `Total,${this.suffixRecordType(total.ob)},${total.dr},${total.cr},${this.suffixRecordType(total.cb)}\n`;
    csv = `${header}\r\n\r\n${title}\r\n${body}${footer}`;
    return csv;
  };

  public formatDataCondensed = (): string => {
    let body;
    let csv;
    let footer;
    let header;
    let title;
    let total;
    total = {
      ob: 0,
      cb: 0,
      cr: 0,
      dr: 0
    };
    csv = '';
    title = '';
    footer = '';
    header = `${this.selectedCompany.name}\r\n"${this.selectedCompany.address}"\r\n${this.selectedCompany.city}-${this.selectedCompany.pincode}\r\nTrial Balance: fromDate to toDate\r\n`;
    title += 'Name' + ',' + 'Opening Balance' + ',' + 'Debit' + ',' + 'Credit' + ',' + 'Closing Balance' + '\r\n';
    const createCsv = (groupDetails: ChildGroup[], index) => {
      let bd;
      bd = '';
      groupDetails.forEach(group => {
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
        if (group.closingBalance.amount !== 0) {
          row += `${strIndex + group.groupName.toUpperCase()},${group.forwardedBalance.amount}${this.recType.transform(group.forwardedBalance)},${group.debitTotal},${group.creditTotal},${group.closingBalance.amount}${this.recType.transform(group.closingBalance)}\r\n`;
          if (group.accounts === void 0) {
            console.log(group);
          }
          if (group.accounts.length > 0) {
            group.accounts.forEach(acc => {
              if (acc.isVisible === true) {
                row += `${strIndex}   ${this.firstCapital(acc.name)} (${this.firstCapital(group.groupName)}),${acc.openingBalance.amount}${this.recType.transform(acc.openingBalance)},${acc.debitTotal},${acc.creditTotal},${acc.closingBalance.amount}${this.recType.transform(acc.closingBalance)}\r\n`;
                total = this.calculateTotal(group, total);
              }
            });
          }
          if (group.childGroups.length > 0) {
            row += createCsv(group.childGroups, index + 1);
          }
        }
        return bd += row;
      });
      return bd;
    };
    body = createCsv(this.exportData, 0);
    footer += `Total,${this.suffixRecordType(total.ob)},${total.dr},${total.cr},${this.suffixRecordType(total.cb)}\n`;
    csv = `${header}\r\n\r\n${title}\r\n${body}\r\n${footer}\r\n`;
    return csv;
  };

  public calculateTotal = (group: ChildGroup, total: Total): Total => {
    if (group.forwardedBalance.type === "DEBIT") {
      total.ob = total.ob + group.forwardedBalance.amount;
    } else {
      total.ob = total.ob - group.forwardedBalance.amount;
    }
    if (group.closingBalance.type === "DEBIT") {
      total.cb = total.cb + group.closingBalance.amount;
    } else {
      total.cb = total.cb - group.closingBalance.amount;
    }
    total.cr += group.creditTotal;
    total.dr += group.debitTotal;
    return total;
  };

  private firstCapital = (s: string) => s[0].toUpperCase() + s.slice(1);

  private suffixRecordType = (balance: number): string => {
    if (balance < 0) {
      balance = balance * -1;
      return `${balance} Cr`;
    } else {
      return `${balance} Dr`;
    }
  };
}

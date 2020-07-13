import { CompanyResponse } from '../../../models/api-models/Company';
import { RecTypePipe } from '../../../shared/helpers/pipes/recType/recType.pipe';
import { Account, ChildGroup } from '../../../models/api-models/Search';
import { Total } from './tb-export-csv.component';

export interface IFormatable {
    setHeader(selectedCompany: CompanyResponse);

    setRowData(data: any[], padding: number);

    setFooter(data: any[]);
}

export class DataFormatter {
    public accounts: Account[] = [];
    public groups: ChildGroup[] = [];
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
            row += `${obj.groupName} (${obj.uniqueName}),${obj.forwardedBalance.amount} ${this.recType.transform(obj.forwardedBalance)},${obj.debitTotal},${obj.creditTotal},${obj.closingBalance.amount}${this.recType.transform(obj.closingBalance)}\r\n`;
            total = this.calculateTotal(obj, total);
            // }
        });
        csv += `${row}\r\n`;
        csv += `\r\nTotal,${this.suffixRecordType(total.ob)},${total.dr},${total.cr},${this.suffixRecordType(total.cb)}\n`;
        return csv;
    }
    public formatDataAccountWise = (formatable: IFormatable): void => {
        let createCsv;
        let total;
        total = {
            ob: 0,
            cb: 0,
            cr: 0,
            dr: 0
        };
        formatable.setHeader(this.selectedCompany);
        createCsv = (groups: ChildGroup[]) => {
            const addRow = (group: ChildGroup) => {
                if (group.accounts.length > 0) {
                    group.accounts.forEach(account => {
                        // if (account.isVisible === true) {
                        let data1 = [];
                        // data1.push(this.truncate(`${this.firstCapital(account.name)}(${this.firstCapital(group.groupName)})`, true, 25));
                        let name = this.truncate(`${this.firstCapital(account.name)} (${this.firstCapital(group.groupName)})`, true, 37);
                        data1.push(name);
                        data1.push(`${account.openingBalance.amount}${this.recType.transform(account.openingBalance)}`);
                        data1.push(account.debitTotal);
                        data1.push(account.creditTotal);
                        data1.push(`${account.closingBalance.amount}${this.recType.transform(account.closingBalance)}`);
                        formatable.setRowData(data1, 0);
                        //total = this.calculateTotal(group, total);
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
        };

        total = this.calculateGrandTotal(total);

        createCsv(this.exportData);
        let data: any[] = [];
        data.push(this.suffixRecordType(total.ob));
        data.push(total.dr);
        data.push(total.cr);
        data.push(this.suffixRecordType(total.cb));
        formatable.setFooter(data);
    }
    public formatDataCondensed = (formatable: IFormatable): void => {
        let total;
        total = {
            ob: 0,
            cb: 0,
            cr: 0,
            dr: 0
        };
        formatable.setHeader(this.selectedCompany);
        const createCsv = (groupDetails: ChildGroup[], index) => {
            groupDetails.forEach(group => {
                let i;
                let j;
                let ref;
                let strIndex;
                strIndex = 0;
                for (i = j = 0, ref = index; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                    strIndex += 3;
                }
                if (group.closingBalance.amount !== 0) {
                    let data1: any[] = [];
                    data1.push(this.truncate(group.groupName.toUpperCase(), true, 25));
                    data1.push(`${group.forwardedBalance.amount} ${this.recType.transform(group.forwardedBalance)}`);
                    data1.push(group.debitTotal);
                    data1.push(group.creditTotal);
                    data1.push(`${group.closingBalance.amount} ${this.recType.transform(group.closingBalance)}`);
                    formatable.setRowData(data1, strIndex);
                    data1 = [];
                    if (group.accounts.length > 0) {
                        group.accounts.forEach(acc => {
                            if (true) {
                                data1.push(this.truncate(`${this.firstCapital(acc.name)}(${this.firstCapital(group.groupName)})`, true, 25));
                                data1.push(`${acc.openingBalance.amount}${this.recType.transform(acc.openingBalance)}`);
                                data1.push(acc.debitTotal);
                                data1.push(acc.creditTotal);
                                data1.push(`${acc.closingBalance.amount}${this.recType.transform(acc.closingBalance)}`);
                                formatable.setRowData(data1, strIndex);
                                data1 = [];
                            }
                        });
                    }
                    if (group.childGroups.length > 0) {
                        createCsv(group.childGroups, index + 1);
                    }
                }
            });
        };

        total = this.calculateGrandTotal(total);

        createCsv(this.exportData, 0);
        let data: any[] = [];
        data.push(this.suffixRecordType(total.ob));
        data.push(total.dr);
        data.push(total.cr);
        data.push(this.suffixRecordType(total.cb));
        formatable.setFooter(data);
    }

    public calculateTotal = (group: ChildGroup, total: Total): Total => {
        if (group.forwardedBalance.type === 'DEBIT') {
            total.ob = total.ob + group.forwardedBalance.amount;
        } else {
            total.ob = total.ob - group.forwardedBalance.amount;
        }
        if (group.closingBalance.type === 'DEBIT') {
            total.cb = total.cb + group.closingBalance.amount;
        } else {
            total.cb = total.cb - group.closingBalance.amount;
        }

        total.cr += group.creditTotal;
        total.dr += group.debitTotal;

        return total;
    }

    /**
     * This will calculate grand total
     *
     * @param {*} total
     * @returns {Total}
     * @memberof DataFormatter
     */
    public calculateGrandTotal(total): Total {
        this.exportData.forEach(group => {
            total = this.calculateTotal(group, total);
        });

        total.cr = Number(total.cr.toString().substring(0, total.cr.toString().indexOf(".") + 5));
        total.dr = Number(total.dr.toString().substring(0, total.dr.toString().indexOf(".") + 5));
        total.ob = Number(total.ob.toString().substring(0, total.ob.toString().indexOf(".") + 5));
        total.cb = Number(total.cb.toString().substring(0, total.cb.toString().indexOf(".") + 5));
        return total;
    }

    private firstCapital = (s: string) => s[0].toUpperCase() + s.slice(1);
    private suffixRecordType = (balance: number): string => {
        if (balance < 0) {
            balance = balance * -1;
            return `${balance} Cr`;
        } else {
            return `${balance} Dr`;
        }
    }

    constructor(private exportData: ChildGroup[],
        private selectedCompany: CompanyResponse,
        private recType: RecTypePipe) {

    }

    private truncate(value: string, wordWise: boolean, max: number, tail?: string) {
        if (!value) {
            return '';
        }
        if (!max) {
            return value;
        }
        if (value.length <= max) {
            return value;
        }
        value = value.substr(0, max);
        let lastspace;
        if (wordWise) {
            lastspace = value.lastIndexOf(' ');
        }
        if (lastspace !== -1) {
            value = value.substr(0, lastspace);
        }
        return value + (tail ? tail : ' …');
    }
}

import { CompanyResponse } from "apps/web-giddh/src/app/models/api-models/Company";
import { Account, ChildGroup } from "apps/web-giddh/src/app/models/api-models/Search";
import { giddhRoundOff } from "apps/web-giddh/src/app/shared/helpers/helperFunctions";
import { RecTypePipe } from "apps/web-giddh/src/app/shared/helpers/pipes/recType/recType.pipe";
import { Total } from "../trial-balance/export-csv/export-csv.component";


export interface IFormatable {
    setHeader(selectedCompany: CompanyResponse);

    setRowData(data: any[], padding: number);

    setFooter(data: any[]);
}

export class DataFormatter {
    public accounts: Account[] = [];
    public groups: ChildGroup[] = [];
    public formatDataGroupWise = (localeData): string => {
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
        title = '' + ',' + localeData?.csv.trial_balance.opening_balance + ',' + localeData?.csv.trial_balance.debit + ',' + localeData?.csv.trial_balance.credit + ',' + localeData?.csv.trial_balance.closing_balance + '\n';
        header = `${this.selectedCompany.name}\r\n"${this.selectedCompany.address}"\r\n${this.selectedCompany.city}-${this.selectedCompany.pincode}\r\n${localeData?.csv.trial_balance.trial_balance} ${localeData?.csv.trial_balance.fromDate} ${localeData?.csv.trial_balance.to} ${localeData?.csv.trial_balance.toDate}\r\n`;
        csv += `${header}\r\n${title}`;

        this.exportData.forEach(obj => {
            row += `${obj.groupName} (${obj?.uniqueName}),${obj.forwardedBalance.amount} ${this.recType.transform(obj.forwardedBalance)},${obj.debitTotal},${obj.creditTotal},${obj.closingBalance.amount}${this.recType.transform(obj.closingBalance)}\r\n`;
            total = this.calculateTotal(obj, total);
        });
        csv += `${row}\r\n`;
        csv += `\r\n${localeData?.csv.trial_balance.total},${this.suffixRecordType(total.ob)},${total.dr},${total.cr},${this.suffixRecordType(total.cb)}\n`;
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
                if (group.accounts?.length > 0) {
                    group.accounts.forEach(account => {
                        let data1 = [];
                        let name = this.truncate(`${this.firstCapital(account.name)} (${this.firstCapital(group.groupName)})`, true, 37);
                        data1.push(name);
                        data1.push(`${account.openingBalance.amount}${this.recType.transform(account.openingBalance)}`);
                        data1.push(account.debitTotal);
                        data1.push(account.creditTotal);
                        data1.push(`${account.closingBalance.amount}${this.recType.transform(account.closingBalance)}`);
                        formatable.setRowData(data1, 0);
                    });
                }
            };
            groups.forEach(group => {
                if (group.accounts?.length > 0) {
                    addRow(group);
                }
                group.childGroups.forEach(childGroup => {
                    if (childGroup.accounts?.length > 0) {
                        addRow(childGroup);
                    }
                    if (childGroup.childGroups?.length > 0) {
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
                    data1.push(this.truncate(group.groupName?.toUpperCase(), true, 25));
                    data1.push(`${group.forwardedBalance.amount} ${this.recType.transform(group.forwardedBalance)}`);
                    data1.push(group.debitTotal);
                    data1.push(group.creditTotal);
                    data1.push(`${group.closingBalance.amount} ${this.recType.transform(group.closingBalance)}`);
                    formatable.setRowData(data1, strIndex);
                    data1 = [];
                    if (group.accounts?.length > 0) {
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
                    if (group.childGroups?.length > 0) {
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

    public calculateTotal = (group: ChildGroup, total: Total, decimalPlaces?: number): Total => {
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
        if (decimalPlaces) {
            total.cr = giddhRoundOff(total.cr, decimalPlaces);
            total.dr = giddhRoundOff(total.dr, decimalPlaces);
            total.ob = giddhRoundOff(total.ob, decimalPlaces);
            total.cb = giddhRoundOff(total.cb, decimalPlaces);
        }

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

        total.cr = giddhRoundOff(total.cr, 2);
        total.dr = giddhRoundOff(total.dr, 2);
        total.ob = giddhRoundOff(total.ob, 2);
        total.cb = giddhRoundOff(total.cb, 2);

        return total;
    }

    private firstCapital = (s: string) => s[0]?.toUpperCase() + s.slice(1);
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
        if (value?.length <= max) {
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

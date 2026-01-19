import { CompanyResponse } from "apps/web-giddh/src/app/models/api-models/Company";
import { Account, ChildGroup } from "apps/web-giddh/src/app/models/api-models/Search";
import { giddhRoundOff } from "apps/web-giddh/src/app/shared/helpers/helperFunctions";
import { RecTypePipe } from "apps/web-giddh/src/app/shared/helpers/pipes/recType/recType.pipe";
import { Total } from "../trial-balance/export-csv/export-csv.component";
import { forEach, keys, slice } from '../../../../lodash-optimized';


/**
 * IFormatable interface definition
 * Defines the structure and contract for IFormatable objects
 */
export interface IFormatable {
    /**
     * Sets header value
     */
    setHeader(selectedCompany: CompanyResponse);

    /**
     * Sets rowdata value
     */
    setRowData(data: any[], padding: number);

    /**
     * Sets footer value
     */
    setFooter(data: any[]);
}

/**
 * DataFormatter class
 * Implements DataFormatter functionality
 */
export class DataFormatter {
    public accounts: Account[] = [];
    public groups: ChildGroup[] = [];
    /**
     * Handles formatDataGroupWise functionality
     */
    public formatDataGroupWise = (localeData, fromDate, toDate): string => {
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
        header = `${this.selectedCompany?.name ?? ''}\r\n"${this.selectedCompany?.address ?? ''}"\r\n${this.selectedCompany?.city ?? ''}${this.selectedCompany?.pincode ? '-' : ''}${this.selectedCompany?.pincode ?? ''}\r\n${localeData?.csv.trial_balance.trial_balance} ${fromDate ?? ''} ${localeData?.csv.trial_balance.to} ${toDate ?? ''}\r\n`;
        csv += `${header}\r\n${title}`;

        (Array.isArray(this.exportData) ? this.exportData : []).forEach(obj => {
            const balanceObj = obj.closingBalance[Object.keys(obj.closingBalance)[0]];
            row += `${obj.groupName} (${obj?.uniqueName}),${obj.forwardedBalance?.amount} ${this.recType.transform(obj.forwardedBalance)}, ${obj.debitTotal},${obj.creditTotal}, ${balanceObj?.amount} ${this.recType.transform(balanceObj)}\r\n`;
            total = this.calculateTotal(obj, total);
        });
        csv += `${row}\r\n`;
        csv += `\r\n${localeData?.csv.trial_balance.total},${this.suffixRecordType(total.ob)},${total.dr},${total.cr},${this.suffixRecordType(total.cb)}\n`;
        return csv;
    }
    /**
     * Handles formatDataAccountWise functionality
     */
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
        /**
         * Creates new csv
         */
        createCsv = (groups: ChildGroup[]) => {
            const addRow = (group: ChildGroup) => {
                /**
                 * Handles if functionality
                 */
                if (group.accounts?.length > 0) {
                    (Array.isArray(group.accounts) ? group.accounts : []).forEach(account => {
                        /**
                         * Handles if functionality
                         */
                        if (account) {
                            let data1 = [];
                            let name = `${this.firstCapital(account.name)} (${this.firstCapital(group.groupName)})`;
                            data1.push(name);
                            data1.push(`${account.openingBalance.amount}${this.recType.transform(account.openingBalance)}`);
                            data1.push(account.debitTotal);
                            data1.push(account.creditTotal);
                            data1.push(`${account.closingBalance.amount}${this.recType.transform(account.closingBalance)}`);
                            formatable.setRowData(data1, 0);
                        }
                    });
                }
            };
            (Array.isArray(groups) ? groups : []).forEach(group => {
                /**
                 * Handles if functionality
                 */
                if (group.accounts?.length > 0) {
                    /**
                     * Handles addRow functionality
                     */
                    addRow(group);
                }
                (Array.isArray(group.childGroups) ? group.childGroups : []).forEach(childGroup => {
                    /**
                     * Handles if functionality
                     */
                    if (childGroup.accounts?.length > 0) {
                        /**
                         * Handles addRow functionality
                         */
                        addRow(childGroup);
                    }
                    /**
                     * Handles if functionality
                     */
                    if (childGroup.childGroups?.length > 0) {
                        return createCsv(childGroup.childGroups);
                    }
                });
            });
        };

        total = this.calculateGrandTotal(total);

        /**
         * Creates new csv
         */
        createCsv(this.exportData);
        let data: any[] = [];
        data.push(this.suffixRecordType(total.ob));
        data.push(total.dr);
        data.push(total.cr);
        data.push(this.suffixRecordType(total.cb));
        formatable.setFooter(data);
    }
    /**
     * Handles formatDataCondensed functionality
     */
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
            (Array.isArray(groupDetails) ? groupDetails : []).forEach(group => {
                let i;
                let j;
                let ref;
                let strIndex;
                strIndex = 0;
                /**
                 * Handles for functionality
                 */
                for (i = j = 0, ref = index; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                    strIndex += 3;
                }
                const key = Object.keys(group.closingBalance)[0];
                /**
                 * Handles if functionality
                 */
                if (group.closingBalance[key].amount !== 0) {
                    let data1: any[] = [];
                    data1.push(group.groupName?.toUpperCase());
                    data1.push(`${group.forwardedBalance.amount} ${this.recType.transform(group.forwardedBalance)}`);
                    data1.push(group.debitTotal);
                    data1.push(group.creditTotal);
                    data1.push(`${group.closingBalance[key].amount} ${this.recType.transform(group.closingBalance[key])}`);
                    formatable.setRowData(data1, strIndex);
                    data1 = [];
                    /**
                     * Handles if functionality
                     */
                    if (group.accounts?.length > 0) {
                        (Array.isArray(group.accounts) ? group.accounts : []).forEach(acc => {
                            /**
                             * Handles if functionality
                             */
                            if (acc) {
                                data1.push(`${this.firstCapital(acc.name)}(${this.firstCapital(group.groupName)})`);
                                data1.push(`${acc.openingBalance.amount}${this.recType.transform(acc.openingBalance)}`);
                                data1.push(acc.debitTotal);
                                data1.push(acc.creditTotal);
                                data1.push(`${acc.closingBalance[key].amount}${this.recType.transform(acc.closingBalance[key])}`);
                                formatable.setRowData(data1, strIndex);
                                data1 = [];
                            }
                        });
                    }
                    /**
                     * Handles if functionality
                     */
                    if (group.childGroups?.length > 0) {
                        /**
                         * Creates new csv
                         */
                        createCsv(group.childGroups, index + 1);
                    }
                }
            });
        };

        total = this.calculateGrandTotal(total);

        /**
         * Creates new csv
         */
        createCsv(this.exportData, 0);
        let data: any[] = [];
        data.push(this.suffixRecordType(total.ob));
        data.push(total.dr);
        data.push(total.cr);
        data.push(this.suffixRecordType(total.cb));
        formatable.setFooter(data);
    }

    /**
     * Calculates total value
     */
    public calculateTotal = (group: ChildGroup, total: Total, decimalPlaces?: number): Total => {
        const key = Object.keys(group.closingBalance)[0];

        /**
         * Handles if functionality
         */
        if (group.forwardedBalance.type === 'DEBIT') {
            total.ob = total.ob + group.forwardedBalance.amount;
        } else {
            total.ob = total.ob - group.forwardedBalance.amount;
        }
        /**
         * Handles if functionality
         */
        if (group.closingBalance[key].type === 'DEBIT') {
            total.cb = total.cb + group.closingBalance[key].amount;
        } else {
            total.cb = total.cb - group.closingBalance[key].amount;
        }

        total.cr += group.creditTotal;
        total.dr += group.debitTotal;
        /**
         * Handles if functionality
         */
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
        (Array.isArray(this.exportData) ? this.exportData : []).forEach(group => {
            total = this.calculateTotal(group, total);
        });

        total.cr = giddhRoundOff(total.cr, 2);
        total.dr = giddhRoundOff(total.dr, 2);
        total.ob = giddhRoundOff(total.ob, 2);
        total.cb = giddhRoundOff(total.cb, 2);

        return total;
    }

    /**
     * Handles firstCapital functionality
     */
    private firstCapital = (s: string) => s[0]?.toUpperCase() + s.slice(1);
    /**
     * Handles suffixRecordType functionality
     */
    private suffixRecordType = (balance: number): string => {
        /**
         * Handles if functionality
         */
        if (balance < 0) {
            balance = balance * -1;
            return `${balance} Cr`;
        } else {
            return `${balance} Dr`;
        }
    }

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(private exportData: ChildGroup[],
        private selectedCompany: CompanyResponse,
        private recType: RecTypePipe) {

    }


}

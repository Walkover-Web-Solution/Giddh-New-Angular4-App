import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../store";
import { CompanyActions } from "../../../actions/company.actions";
import { CompanyService } from "../../../services/companyService.service";
import { PurchaseReportsModel, ReportsRequestModel } from "../../../models/api-models/Reports";
import { ToasterService } from "../../../services/toaster.service";
import { createSelector } from "reselect";
import { takeUntil, filter } from "rxjs/operators";
import * as moment from 'moment/moment';
import { ReplaySubject } from "rxjs";
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { CompanyResponse, ActiveFinancialYear } from '../../../models/api-models/Company';

@Component({
    selector: 'purchase-register-component',
    templateUrl: './purchase.register.component.html',
    styleUrls: ['./purchase.register.component.scss']
})
export class PurchaseRegisterComponent implements OnInit {

    bsValue = new Date();
    public reportRespone: PurchaseReportsModel[];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public activeFinacialYr: ActiveFinancialYear;
    public purchaseRegisterTotal: PurchaseReportsModel = new PurchaseReportsModel();
    public monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    public selectedType = 'monthly';
    private selectedMonth: string;
    public dateRange: Date[];
    public moment = moment;
    public datePickerOptions: any = {
        hideOnEsc: true,
        // parentEl: '#dp-parent',
        locale: {
            applyClass: 'btn-green',
            applyLabel: 'Go',
            fromLabel: 'From',
            format: 'D-MMM-YY',
            toLabel: 'To',
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom range'
        },
        ranges: {
            'This Month to Date': [
                moment().startOf('month'),
                moment()
            ],
            'This Quarter to Date': [
                moment().quarter(moment().quarter()).startOf('quarter'),
                moment()
            ],
            'This Financial Year to Date': [
                moment().startOf('year').subtract(9, 'year'),
                moment()
            ],
            'This Year to Date': [
                moment().startOf('year'),
                moment()
            ],
            'Last Month': [
                moment().subtract(1, 'month').startOf('month'),
                moment().subtract(1, 'month').endOf('month')
            ],
            'Last Quarter': [
                moment().quarter(moment().quarter()).subtract(1, 'quarter').startOf('quarter'),
                moment().quarter(moment().quarter()).subtract(1, 'quarter').endOf('quarter')
            ],
            'Last Financial Year': [
                moment().startOf('year').subtract(10, 'year'),
                moment().endOf('year').subtract(10, 'year')
            ],
            'Last Year': [
                moment().startOf('year').subtract(1, 'year'),
                moment().endOf('year').subtract(1, 'year')
            ]
        },
        startDate: moment().subtract(30, 'days'),
        endDate: moment()
    };
    public financialOptions: IOption[] = [];
    public selectedCompany: CompanyResponse;
    private interval: any;
    public currentActiveFinacialYear: IOption;

    constructor(private router: Router, private store: Store<AppState>, private companyActions: CompanyActions, private companyService: CompanyService, private _toaster: ToasterService) {
        this.setCurrentFY();
    }

    ngOnInit() {
        this.router.events.pipe(
            filter(event => (event instanceof NavigationStart && !(event.url.includes('/reports/purchase-register') || event.url.includes('/reports/purchase-detailed-expand')))),
            takeUntil(this.destroyed$)).subscribe(() => {
                // Reset the chosen financial year when user leaves the module
                this.store.dispatch(this.companyActions.resetUserChosenFinancialYear());
            });
    }

    public goToDashboard() {
        this.router.navigate(['/pages/reports']);
    }

    public filterReportResp(response) {
        let reportModelArray = [];
        let index = 1;
        let indexMonths = 0;
        let weekCount = 1;
        let reportsModelCombined: PurchaseReportsModel = new PurchaseReportsModel();
        _.forEach(response, (item) => {
            let reportsModel: PurchaseReportsModel = new PurchaseReportsModel();
            reportsModel.purchase = item.debitTotal;
            reportsModel.returns = item.creditTotal;
            reportsModel.taxTotal = item.taxTotal;
            reportsModel.discountTotal = item.discountTotal;
            reportsModel.tcsTotal = item.tcsTotal;
            reportsModel.tdsTotal = item.tdsTotal;
            reportsModel.netPurchase = item.balance.amount;
            reportsModel.cumulative = item.closingBalance.amount;
            reportsModel.from = item.from;
            reportsModel.to = item.to;
            let mdyFrom = item.from.split('-');
            let mdyTo = item.to.split('-');
            let dateDiff = this.datediff(this.parseDate(mdyFrom), this.parseDate(mdyTo));
            if (dateDiff <= 8) {
                this.setPurchaseRegisterTotal(item);
                this.purchaseRegisterTotal.particular = this.selectedMonth + " " + mdyFrom[2];
                reportsModel.particular = 'Week' + weekCount++;
                reportModelArray.push(reportsModel);
            } else if (dateDiff <= 31) {
                this.setPurchaseRegisterTotal(item);
                reportsModel.particular = this.monthNames[parseInt(mdyFrom[1]) - 1] + " " + mdyFrom[2];
                indexMonths++;
                reportsModelCombined.purchase += item.debitTotal;
                reportsModelCombined.returns += item.creditTotal;
                reportsModelCombined.taxTotal += item.taxTotal;
                reportsModelCombined.discountTotal += item.discountTotal;
                reportsModelCombined.tcsTotal += item.tcsTotal;
                reportsModelCombined.tdsTotal += item.tdsTotal;
                reportsModelCombined.netPurchase += item.balance.amount;
                reportsModelCombined.cumulative = item.closingBalance.amount;
                reportModelArray.push(reportsModel);
                if (indexMonths % 3 === 0) {
                    reportsModelCombined.particular = 'Quarter ' + indexMonths / 3;
                    reportsModelCombined.reportType = 'combined';
                    reportModelArray.push(reportsModelCombined);

                    reportsModelCombined = new PurchaseReportsModel();
                }
            } else if (dateDiff <= 93) {
                this.setPurchaseRegisterTotal(item);
                reportsModel.particular = this.formatParticular(mdyTo, mdyFrom, index, this.monthNames);
                reportModelArray.push(reportsModel);
                index++;
            }
        });
        return reportModelArray;
    }

    // new Date("dateString") is browser-dependent and discouraged, so we'll write
    // a simple parse function for U.S. date format (which does no error checking)
    public parseDate(mdy) {
        return new Date(mdy[2], mdy[1], mdy[0]);
    }

    public datediff(first, second) {
        // Take the difference between the dates and divide by milliseconds per day.
        // Round to nearest whole number to deal with DST.
        return Math.round((second - first) / (1000 * 60 * 60 * 24));
    }

    public setCurrentFY() {
        let financialYearChosenInReportUniqueName = '';
        // set financial years based on company financial year
        this.store.pipe(select(createSelector(
            [(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName, (state: AppState) => state.session.financialYearChosenInReport], (companies, uniqueName, financialYearChosenInReport) => {
                financialYearChosenInReportUniqueName = financialYearChosenInReport;
                if (!companies) {
                    return;
                }

                return companies.find(cmp => {
                    if (cmp && cmp.uniqueName) {
                        return cmp.uniqueName === uniqueName;
                    } else {
                        return false;
                    }
                });
            })), takeUntil(this.destroyed$)).subscribe(selectedCmp => {
                if (selectedCmp) {
                    this.selectedCompany = selectedCmp;
                    this.financialOptions = selectedCmp.financialYears.map(q => {
                        return { label: q.uniqueName, value: q.uniqueName };
                    });
                    let selectedFinancialYear, activeFinancialYear, uniqueNameToSearch;
                    if (financialYearChosenInReportUniqueName) {
                        // User is navigating back from details page hence show the selected filter as pre-filled
                        uniqueNameToSearch = financialYearChosenInReportUniqueName;
                    } else {
                        uniqueNameToSearch = selectedCmp.activeFinancialYear.uniqueName;
                    }
                    selectedFinancialYear = this.financialOptions.find(p => p.value === uniqueNameToSearch);
                    activeFinancialYear = this.selectedCompany.financialYears.find(p => p.uniqueName === uniqueNameToSearch);
                    this.currentActiveFinacialYear = _.cloneDeep(selectedFinancialYear);
                    this.store.dispatch(this.companyActions.setUserChosenFinancialYear(this.currentActiveFinacialYear.value));
                    this.activeFinacialYr = activeFinancialYear;
                    this.populateRecords('monthly');
                    this.purchaseRegisterTotal.particular = this.activeFinacialYr.uniqueName;
                }
            });
    }

    public selectFinancialYearOption(v: IOption) {
        if (v.value) {
            let financialYear = this.selectedCompany.financialYears.find(p => p.uniqueName === v.value);
            this.store.dispatch(this.companyActions.setUserChosenFinancialYear(this.currentActiveFinacialYear.value));
            this.activeFinacialYr = financialYear;
            this.populateRecords(this.interval, this.selectedMonth);
        }
    }

    public populateRecords(interval, month?) {
        this.interval = interval;
        if (this.activeFinacialYr) {
            let startDate = this.activeFinacialYr.financialYearStarts.toString();
            let endDate = this.activeFinacialYr.financialYearEnds.toString();
            if (month) {
                this.selectedMonth = month;
                let startEndDate = this.getDateFromMonth(this.monthNames.indexOf(this.selectedMonth) + 1);
                startDate = startEndDate.firstDay;
                endDate = startEndDate.lastDay;
            } else {
                this.selectedMonth = null;
            }
            this.selectedType = interval.charAt(0).toUpperCase() + interval.slice(1);
            let request: ReportsRequestModel = {
                to: endDate,
                from: startDate,
                interval: interval,
            }
            this.companyService.getPurchaseRegister(request).subscribe((res) => {
                if (res.status === 'error') {
                    this._toaster.errorToast(res.message);
                } else {
                    this.purchaseRegisterTotal = new PurchaseReportsModel();
                    this.purchaseRegisterTotal.particular = this.activeFinacialYr.uniqueName;
                    this.reportRespone = this.filterReportResp(res.body);
                }
            });
        }
    }

    public formatParticular(mdyTo, mdyFrom, index, monthNames) {
        return 'Quarter ' + index + " (" + monthNames[parseInt(mdyFrom[1]) - 1] + " " + mdyFrom[2] + "-" + monthNames[parseInt(mdyTo[1]) - 1] + " " + mdyTo[2] + ")";
    }

    public bsValueChange(event: any) {
        if (event) {
            let request: ReportsRequestModel = {
                to: moment(event[1]).format(GIDDH_DATE_FORMAT),
                from: moment(event[0]).format(GIDDH_DATE_FORMAT),
                interval: 'monthly',
            }
            this.companyService.getPurchaseRegister(request).subscribe((res) => {
                if (res.status === 'error') {
                    this._toaster.errorToast(res.message);
                } else {
                    this.purchaseRegisterTotal = new PurchaseReportsModel();
                    this.purchaseRegisterTotal.particular = this.activeFinacialYr.uniqueName;
                    this.reportRespone = this.filterReportResp(res.body);
                }
            });

        }
    }

    public getDateFromMonth(selectedMonth) {
        let firstDay = '', lastDay = '';
        if (this.activeFinacialYr) {
            let mdyFrom = this.activeFinacialYr.financialYearStarts.split('-');
            let mdyTo = this.activeFinacialYr.financialYearEnds.split('-');

            let startDate;

            if (mdyFrom[1] > selectedMonth) {
                startDate = '01-' + (selectedMonth - 1) + '-' + mdyTo[2];
            } else {
                startDate = '01-' + (selectedMonth - 1) + '-' + mdyFrom[2];
            }
            let startDateSplit = startDate.split('-');
            let dt = new Date(startDateSplit[2], startDateSplit[1], startDateSplit[0]);
            // GET THE MONTH AND YEAR OF THE SELECTED DATE.
            let month = (dt.getMonth() + 1).toString(),
                year = dt.getFullYear();

            // GET THE FIRST AND LAST DATE OF THE MONTH.
            if (parseInt(month) < 10) {
                month = '0' + month;
            }
            firstDay = '01-' + (month) + '-' + year;
            lastDay = new Date(year, parseInt(month), 0).getDate() + '-' + month + '-' + year;
        }

        return { firstDay, lastDay };
    }

    /**
     * Calculates the purchase register total
     *
     * @private
     * @param {*} transaction Purchase transaction
     * @memberof PurchaseRegisterComponent
     */
    private setPurchaseRegisterTotal(transaction: any): void {
        if (transaction) {
            const item = _.cloneDeep(transaction);
            this.purchaseRegisterTotal.purchase += item.debitTotal;
            this.purchaseRegisterTotal.returns += item.creditTotal;
            this.purchaseRegisterTotal.taxTotal += item.taxTotal;
            this.purchaseRegisterTotal.discountTotal += item.discountTotal;
            this.purchaseRegisterTotal.tcsTotal += item.tcsTotal;
            this.purchaseRegisterTotal.tdsTotal += item.tdsTotal;
            this.purchaseRegisterTotal.netPurchase += item.balance.amount;
            this.purchaseRegisterTotal.cumulative = item.closingBalance.amount;
        }
    }
}

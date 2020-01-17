import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../store";
import { CompanyActions } from "../../../actions/company.actions";
import { CompanyService } from "../../../services/companyService.service";
import { ReportsModel, ReportsRequestModel, ReportsResponseModel } from "../../../models/api-models/Reports";
import { ToasterService } from "../../../services/toaster.service";
import { createSelector } from "reselect";
import { takeUntil } from "rxjs/operators";
import * as moment from 'moment/moment';
import { ReplaySubject } from "rxjs";
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { CompanyResponse, ActiveFinancialYear } from '../../../models/api-models/Company';

@Component({
    selector: 'reports-details-component',
    templateUrl: './report.details.component.html',
    styleUrls: ['./report.details.component.scss']
})
export class ReportsDetailsComponent implements OnInit {

    bsValue = new Date();
    public reportRespone: ReportsModel[];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public activeFinacialYr: ActiveFinancialYear;
    public salesRegisterTotal: ReportsModel = new ReportsModel();
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
            'Last Quater': [
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
        endDate: moment(),
        // parentEl: '#dateRangeParent'
    };
    public financialOptions: IOption[] = [];
    public selectedCompany: CompanyResponse;
    private interval: any;
    public currentActiveFinacialYear: IOption;
    // @ViewChild(DaterangePickerComponent) public dp: DaterangePickerComponent;
    ngOnInit() {
    }

    constructor(private router: Router, private store: Store<AppState>, private companyActions: CompanyActions, private companyService: CompanyService, private _toaster: ToasterService) {
        this.setCurrentFY();
    }

    public goToDashboard() {
        this.router.navigate(['/pages/reports']);
    }

    public filterReportResp(response) {
        let reportModelArray = [];
        let index = 1;
        let indexMonths = 0;
        let weekCount = 1;
        let reportsModelCombined: ReportsModel = new ReportsModel();
        _.forEach(response, (item) => {
            let reportsModel: ReportsModel = new ReportsModel();
            reportsModel.sales = item.creditTotal;
            reportsModel.returns = item.debitTotal;
            reportsModel.netSales = item.closingBalance.amount;
            reportsModel.cumulative = item.balance.amount;
            reportsModel.from = item.from;
            reportsModel.to = item.to;


            let mdyFrom = item.from.split('-');
            let mdyTo = item.to.split('-');
            let dateDiff = this.datediff(this.parseDate(mdyFrom), this.parseDate(mdyTo));
            if (dateDiff <= 8) {
                this.salesRegisterTotal.sales += item.creditTotal;
                this.salesRegisterTotal.returns += item.debitTotal;
                this.salesRegisterTotal.netSales = item.closingBalance.amount;
                this.salesRegisterTotal.cumulative += item.balance.amount;
                this.salesRegisterTotal.particular = this.selectedMonth + " " + mdyFrom[2];
                reportsModel.particular = 'Week' + weekCount++;
                reportModelArray.push(reportsModel);
            } else if (dateDiff <= 31) {
                this.salesRegisterTotal.sales += item.creditTotal;
                this.salesRegisterTotal.returns += item.debitTotal;
                this.salesRegisterTotal.netSales = item.closingBalance.amount;
                this.salesRegisterTotal.cumulative += item.balance.amount;

                reportsModel.particular = this.monthNames[parseInt(mdyFrom[1]) - 1] + " " + mdyFrom[2];
                indexMonths++;
                reportsModelCombined.sales += item.creditTotal;
                reportsModelCombined.returns += item.debitTotal;
                reportsModelCombined.netSales = item.closingBalance.amount;
                reportsModelCombined.cumulative += item.balance.amount;
                reportModelArray.push(reportsModel);
                if (indexMonths % 3 === 0) {
                    reportsModelCombined.particular = 'Quarter ' + indexMonths / 3;
                    reportsModelCombined.reportType = 'combined';
                    reportModelArray.push(reportsModelCombined);

                    reportsModelCombined = new ReportsModel();
                }
            } else if (dateDiff <= 93) {
                this.salesRegisterTotal.sales += item.creditTotal;
                this.salesRegisterTotal.returns += item.debitTotal;
                this.salesRegisterTotal.netSales = item.closingBalance.amount;
                this.salesRegisterTotal.cumulative += item.balance.amount;

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
        // set financial years based on company financial year
        this.store.pipe(select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
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
                let financialYear = this.financialOptions.find(p => p.value === selectedCmp.activeFinancialYear.uniqueName);
                this.currentActiveFinacialYear = _.cloneDeep(financialYear);
                this.activeFinacialYr = selectedCmp.activeFinancialYear;
                this.populateRecords('monthly');
                this.salesRegisterTotal.particular = this.activeFinacialYr.uniqueName;
            }
        });
    }
    public selectFinancialYearOption(v: IOption) {
        if (v.value) {
            let financialYear = this.selectedCompany.financialYears.find(p => p.uniqueName === v.value);
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
            this.companyService.getSalesRegister(request).subscribe((res) => {
                if (res.status === 'error') {
                    this._toaster.errorToast(res.message);
                } else {
                    this.salesRegisterTotal = new ReportsModel();
                    this.salesRegisterTotal.particular = this.activeFinacialYr.uniqueName;
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
            this.companyService.getSalesRegister(request).subscribe((res) => {
                if (res.status === 'error') {
                    this._toaster.errorToast(res.message);
                } else {
                    this.salesRegisterTotal = new ReportsModel();
                    this.salesRegisterTotal.particular = this.activeFinacialYr.uniqueName;
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
            //let firstDay = new Date(year, month , 0).toISOString().replace(/T.*/,'').split('-').reverse().join('-');
            //let lastDay = new Date(year, month + 1, 1).toISOString().replace(/T.*/,'').split('-').reverse().join('-');
            if (parseInt(month) < 10) {
                month = '0' + month;
            }
            firstDay = '01-' + (month) + '-' + year;
            lastDay = new Date(year, parseInt(month), 0).getDate() + '-' + month + '-' + year;
        }

        return { firstDay, lastDay };
    }
}

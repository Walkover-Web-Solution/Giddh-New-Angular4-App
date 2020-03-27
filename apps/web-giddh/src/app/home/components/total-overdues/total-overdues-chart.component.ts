import { skipWhile, take, takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Options } from 'highcharts';
import { CompanyResponse } from '../../../models/api-models/Company';
import { Observable, ReplaySubject } from 'rxjs';
import { HomeActions } from '../../../actions/home/home.actions';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import * as moment from 'moment/moment';
import { isNullOrUndefined } from 'util';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { LocaleService } from '../../../services/locale.service';
import { GiddhCurrencyPipe } from '../../../shared/helpers/pipes/currencyPipe/currencyType.pipe';
import * as _ from "../../../lodash-optimized";
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'toal-overdues-chart',
    templateUrl: 'total-overdues-chart.component.html',
    styleUrls: ['../../home.component.scss'],
    styles: [
        `
            .total_amt {
                font-size: 18px;
            }

            .customerDueText {
                color: #0CB1AF;
            }

            .vendorDueText {
                color: #F85C88;
            }

            .secondary_text {
                color: #5B64C9;
            }

            span.monthDropdown {
                font-size: 12px;
                color: #666666;
                vertical-align: top;
            }

            .dashboard-filter .btn-group {
                display: block;
                line-height: 1;
            }

            .dashboard-filter .btn-group span {
                vertical-align: middle;
                color: #666666;
            }

            .underline {
                text-decoration: underline;
            }

            .dashboard-filter {
                display: inline-flex;
                color: #666666;
                align-items: flex-end;

            }

            .dashboard-filter .icon-collapse-icon {
                margin-left: 8px;
                font-size: 14px;
            }

            .dueAmount {
                color: #262626;
                font-size: 16px;
                margin: 0;
                padding: 0;
            }

            span.icon-rupees {
                font-size: 15px;
            }

            .panel-body small {
                color: #666666;
            }

		`
    ]
})

export class TotalOverduesChartComponent implements OnInit, OnDestroy {
    @Input() public refresh: boolean = false;
    public imgPath: string = '';
    public options: Options;
    public companies$: Observable<CompanyResponse[]>;
    public activeCompanyUniqueName$: Observable<string>;
    public requestInFlight: boolean = true;
    public totaloverDueChart: Options;
    public totalOverDuesResponse$: Observable<any>;
    public sundryDebtorResponse: any = {};
    public sundryCreditorResponse: any = {};
    public totalRecievable: number = 0;
    public totalPayable: number = 0;
    public overDueObj: any = {};
    public ReceivableDurationAmt: number = 0;
    public PaybaleDurationAmt: number = 0;
    public moment = moment;
    public amountSettings: any = { baseCurrencySymbol: '', balanceDecimalPlaces: '' };
    public universalDate$: Observable<any>;
    public dataFound: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public toRequest: any = { from: '', to: '', refresh: false };
    public localeData: any = {};

    constructor(private store: Store<AppState>, private _homeActions: HomeActions, public currencyPipe: GiddhCurrencyPipe, private cdRef: ChangeDetectorRef, private localeService: LocaleService) {
        this.getLocale("en");
        this.activeCompanyUniqueName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
        this.companies$ = this.store.select(p => p.session.companies).pipe(takeUntil(this.destroyed$));
        this.totalOverDuesResponse$ = this.store.select(p => p.home.totalOverDues).pipe(takeUntil(this.destroyed$));
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.companies$.subscribe(c => {
            if (c) {
                let activeCompany: CompanyResponse;
                this.activeCompanyUniqueName$.pipe(take(1)).subscribe(a => {
                    activeCompany = c.find(p => p.uniqueName === a);
                    if (activeCompany) {
                        this.amountSettings.baseCurrencySymbol = activeCompany.baseCurrencySymbol;
                        this.amountSettings.balanceDecimalPlaces = activeCompany.balanceDecimalPlaces;
                    }
                });
            }
        });
        // img path
        this.imgPath = (isElectron||isCordova)  ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        // listen for universal date
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj) => {
            if (dateObj) {
                let dates = [];
                dates = [moment(dateObj[0]).format(GIDDH_DATE_FORMAT), moment(dateObj[1]).format(GIDDH_DATE_FORMAT), false];
                this.getFilterDate(dates);
            }
        });

        this.totalOverDuesResponse$.pipe(skipWhile(p => (isNullOrUndefined(p))))
            .subscribe(p => {
                if (p && p.length) {
                    this.dataFound = true;

                    this.overDueObj = p;
                    this.overDueObj.forEach((grp) => {
                        if (grp.uniqueName === 'sundrydebtors') {
                            this.sundryDebtorResponse = grp;
                            this.totalRecievable = this.sundryDebtorResponse.closingBalance.amount;
                            this.ReceivableDurationAmt = this.sundryDebtorResponse.debitTotal - this.sundryDebtorResponse.creditTotal;
                        } else {
                            this.sundryCreditorResponse = grp;
                            this.totalPayable = this.sundryCreditorResponse.closingBalance.amount;
                            this.PaybaleDurationAmt = this.sundryCreditorResponse.creditTotal - this.sundryCreditorResponse.debitTotal;
                        }
                    });

                    if (this.totalRecievable === 0 && this.totalPayable === 0) {
                        this.resetChartData();
                    } else {
                        this.generateCharts();
                    }
                } else {
                    this.resetChartData();
                }
            });
    }

    public resetChartData() {
        this.dataFound = false;
        this.overDueObj = {};
        this.totalRecievable = 0;
        this.ReceivableDurationAmt = 0;
        this.totalPayable = 0;
        this.PaybaleDurationAmt = 0;
        this.requestInFlight = false;
        this.cdRef.detectChanges();
    }

    public generateCharts() {
        let baseCurrencySymbol = this.amountSettings.baseCurrencySymbol;
        let cPipe = this.currencyPipe;

        this.totaloverDueChart = {
            colors: ['#F85C88', '#0CB1AF'],
            chart: {
                type: 'pie',
                polar: false,
                className: 'overdue_chart',
                width: 348,
                height: '180px'
            },
            title: {
                text: '',
            },
            yAxis: {
                title: {
                    text: ''
                },
                gridLineWidth: 0,
                minorGridLineWidth: 0,
            },
            xAxis: {
                categories: []
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    showInLegend: true,
                    innerSize: '70%',
                    allowPointSelect: true,
                    dataLabels: {
                        enabled: false,
                        crop: true,
                        defer: true
                    },
                    shadow: false
                },
                series: {
                    animation: false,
                    dataLabels: {}
                }
            },
            tooltip: {
                shared: true,
                useHTML: true,
                formatter: function () {
                    return baseCurrencySymbol + " " + cPipe.transform(this.point.y) + '/-';
                }
            },
            series: [{
                name: 'Total Overdues',
                data: [['Customer Due', this.totalRecievable], ['Vendor Due', this.totalPayable]],
            }],
        };

        this.requestInFlight = false;
        this.cdRef.detectChanges();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public getFilterDate(dates: any) {
        if (dates !== null) {
            this.requestInFlight = true;
            this.toRequest.from = dates[0];
            this.toRequest.to = dates[1];
            this.toRequest.refresh = false;
            this.store.dispatch(this._homeActions.getTotalOverdues(this.toRequest.from, this.toRequest.to, this.toRequest.refresh));
        }
    }

    public refreshChart() {
        this.requestInFlight = true;
        this.toRequest.refresh = true;
        this.store.dispatch(this._homeActions.getTotalOverdues(this.toRequest.from, this.toRequest.to, this.toRequest.refresh));
    }

    public getLocale(language) {
        this.localeService.getLocale("home/total-overdues-chart", language).subscribe(data => {
            this.localeData = data;
        });
    }
}

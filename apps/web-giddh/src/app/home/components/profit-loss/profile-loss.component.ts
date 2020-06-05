import { take, takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Options } from 'highcharts';
import { CompanyResponse } from '../../../models/api-models/Company';
import { Observable, ReplaySubject } from 'rxjs';
import { HomeActions } from '../../../actions/home/home.actions';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import * as moment from 'moment/moment';
import * as _ from '../../../lodash-optimized';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { DashboardService } from '../../../services/dashboard.service';
import {
    ProfitLossData,
    ProfitLossRequest,
    GetRevenueResponse,
    GetTotalExpenseResponse,
    GetIncomeBeforeTaxes
} from "../../../models/api-models/tb-pl-bs";
import { TBPlBsActions } from "../../../actions/tl-pl.actions";
import * as Highcharts from 'highcharts';
import { GiddhCurrencyPipe } from '../../../shared/helpers/pipes/currencyPipe/currencyType.pipe';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { GeneralService } from '../../../services/general.service';

@Component({
    selector: 'profit-loss',
    templateUrl: 'profit-loss.component.html',
    styleUrls: ['../../home.component.scss', './profit-loss.component.scss'],
})

export class ProfitLossComponent implements OnInit, OnDestroy {
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /* This will store if device is mobile or not */
    public isMobileScreen: boolean = false;
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOptions: any;
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    @Input() public refresh: boolean = false;
    public imgPath: string = '';
    public options: Options;
    public companies$: Observable<CompanyResponse[]>;
    public activeCompanyUniqueName$: Observable<string>;
    public requestInFlight: boolean = true;
    public profitLossChart: Options;
    public totalIncome: number = 0;
    public totalIncomeType: string = '';
    public totalExpense: number = 0;
    public totalExpenseType: string = '';
    public netProfitLoss: number = 0;
    public netProfitLossType: string = '';
    public plRequest: ProfitLossRequest = { from: '', to: '', refresh: false };
    public amountSettings: any = { baseCurrencySymbol: '' };
    public isDefault: boolean = true;
    public universalDate$: Observable<any>;
    public dataFound: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private _homeActions: HomeActions, private _dashboardService: DashboardService, public tlPlActions: TBPlBsActions, public currencyPipe: GiddhCurrencyPipe,
        private cdRef: ChangeDetectorRef,
        private modalService: BsModalService,
        private generalService: GeneralService) {
        this.activeCompanyUniqueName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
        this.companies$ = this.store.select(p => p.session.companies).pipe(takeUntil(this.destroyed$));
        this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.companies$.subscribe(c => {
            if (c) {
                let activeCompany: CompanyResponse;
                this.activeCompanyUniqueName$.pipe(take(1)).subscribe(a => {
                    activeCompany = c.find(p => p.uniqueName === a);
                    if (activeCompany) {
                        this.amountSettings.baseCurrencySymbol = activeCompany.baseCurrencySymbol;
                    }
                });
            }
        });
        // img path
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        /* This will get the date range picker configurations */
        this.store.pipe(select(state => state.company.dateRangePickerConfig), takeUntil(this.destroyed$)).subscribe(config => {
            if (config) {
                this.datePickerOptions = config;
            }
        });
        // listen for universal date
        this.universalDate$.subscribe(dateObj => {
            if (this.isDefault && dateObj) {
                let dates = [];
                dates = [moment(dateObj[0]).format(GIDDH_DATE_FORMAT), moment(dateObj[1]).format(GIDDH_DATE_FORMAT), false];
                this.selectedDateRange = { startDate: moment(dateObj[0]), endDate: moment(dateObj[1]) };
                this.selectedDateRangeUi = moment(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.getFilterDate(dates);
                this.isDefault = false;
            }
        });

        this.store.pipe(select(p => p.tlPl.pl.data), takeUntil(this.destroyed$)).subscribe(p => {
            if (p) {
                this.dataFound = true;
                let data = _.cloneDeep(p) as ProfitLossData;
                let revenue;
                let expense;
                let npl;

                if (data && data.incomeStatment && data.incomeStatment.revenue) {
                    revenue = _.cloneDeep(data.incomeStatment.revenue) as GetRevenueResponse;
                    this.totalIncome = revenue.amount;
                    this.totalIncomeType = (revenue.type === "CREDIT") ? "Cr." : "Dr.";
                } else {
                    this.totalIncome = 0;
                    this.totalIncomeType = '';
                }

                if (data && data.incomeStatment && data.incomeStatment.totalExpenses) {
                    expense = _.cloneDeep(data.incomeStatment.totalExpenses) as GetTotalExpenseResponse;
                    this.totalExpense = expense.amount;
                    this.totalExpenseType = (expense.type === "CREDIT") ? "Cr." : "Dr.";
                } else {
                    this.totalExpense = 0;
                    this.totalExpenseType = '';
                }

                if (data && data.incomeStatment && data.incomeStatment.incomeBeforeTaxes) {
                    npl = _.cloneDeep(data.incomeStatment.incomeBeforeTaxes) as GetIncomeBeforeTaxes;
                    this.netProfitLossType = (npl.type === "CREDIT") ? "+" : "-";
                    this.netProfitLoss = npl.amount;
                } else {
                    this.netProfitLossType = '';
                    this.netProfitLoss = 0;
                }

                if (this.totalIncome === 0 && this.totalExpense === 0) {
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
        this.totalIncome = 0;
        this.totalIncomeType = '';
        this.totalExpense = 0;
        this.totalExpenseType = '';
        this.netProfitLossType = '';
        this.netProfitLoss = 0;
        this.requestInFlight = false;
        this.cdRef.detectChanges();
    }

    public generateCharts() {
        let baseCurrencySymbol = this.amountSettings.baseCurrencySymbol;
        let cPipe = this.currencyPipe;

        this.profitLossChart = {
            colors: ['#FED46A', '#4693F1'],
            chart: {
                type: 'pie',
                polar: false,
                className: 'profit-loss-chart',
                width: 260,
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
                name: 'Profit & Loss',
                data: [['Total Income', this.totalIncome], ['Total Expenses', this.totalExpense]],
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

            this.plRequest.from = dates[0];
            this.plRequest.to = dates[1];
            this.plRequest.refresh = false;

            this.store.dispatch(this.tlPlActions.GetProfitLoss(_.cloneDeep(this.plRequest)));
        }
    }

    /**
     * API call to get refresh chart
     *
     * @memberof ProfitLossComponent
     */
    public refreshChart() {
        this.requestInFlight = true;
        this.plRequest.refresh = true;
        this.store.dispatch(this.tlPlActions.GetProfitLoss(_.cloneDeep(this.plRequest)));
    }

    /**
     * This will show the datepicker
     *
     * @param {*} element input element reference
     * @memberof ProfitLossComponent
     */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: this.isMobileScreen })
        );
    }

    /**
     * This will hide the datepicker
     *
     * @memberof ProfitLossComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
    * Call back function for date/range selection in datepicker
    *
    * @param {*} value
    * @memberof ProfitLossComponent
    */
    public dateSelectedCallback(value: any): void {
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = moment(value.endDate).format(GIDDH_DATE_FORMAT);
            this.requestInFlight = true;
            this.plRequest.from = this.fromDate;
            this.plRequest.to = this.toDate;
            this.plRequest.refresh = false;
            this.store.dispatch(this.tlPlActions.GetProfitLoss(_.cloneDeep(this.plRequest)));
        }
    }
}

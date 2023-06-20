import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import {
    ProfitLossData,
    ProfitLossRequest,
    GetRevenueResponse,
    GetTotalExpenseResponse,
    GetIncomeBeforeTaxes
} from "../../../models/api-models/tb-pl-bs";
import { TBPlBsActions } from "../../../actions/tl-pl.actions";
import { GiddhCurrencyPipe } from '../../../shared/helpers/pipes/currencyPipe/currencyType.pipe';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GeneralService } from '../../../services/general.service';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import { TlPlService } from '../../../services/tl-pl.service';
import { cloneDeep } from '../../../lodash-optimized';
import { giddhRoundOff } from '../../../shared/helpers/helperFunctions';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
    selector: 'profit-loss',
    templateUrl: 'profit-loss.component.html',
    styleUrls: ['../../home.component.scss', './profit-loss.component.scss'],
})

export class ProfitLossComponent implements OnInit, OnDestroy {
    @Input() public refresh: boolean = false;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate', { static: true }) public datepickerTemplate: ElementRef;
    /* This will store if device is mobile or not */
    public isMobileScreen: boolean = false;
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    public imgPath: string = '';
    public requestInFlight: boolean = true;
    public totalIncome: number = 0;
    public totalIncomeType: string = '';
    public totalExpense: number = 0;
    public totalExpenseType: string = '';
    public netProfitLoss: number = 0;
    public netProfitLossType: string = '';
    public plRequest: ProfitLossRequest = { from: '', to: '', refresh: false };
    public amountSettings: any = { baseCurrencySymbol: '' };
    public universalDate$: Observable<any>;
    public dataFound: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /* this will store active company data */
    public activeCompany: any = {};
    /** Decimal places from company settings */
    public giddhBalanceDecimalPlaces: number = 2;
    public chart:any;

    constructor(private store: Store<AppState>, public tlPlActions: TBPlBsActions, public currencyPipe: GiddhCurrencyPipe, private cdRef: ChangeDetectorRef, private modalService: BsModalService, private generalService: GeneralService, private tlPlService: TlPlService) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));

        this.store.pipe(select(p => p.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            if (profile) {
                this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
            }
        });
    }

    public ngOnInit() {
        // img path
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.amountSettings.baseCurrencySymbol = activeCompany.baseCurrencySymbol;
                this.activeCompany = activeCompany;
            }
        });

        // listen for universal date
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                let dates = [];
                dates = [dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT), dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT), false];

                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);

                this.getFilterDate(dates);
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
            this.getProfitLossData();
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
        this.getProfitLossData();
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
            Object.assign({}, { class: 'modal-xl giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: this.isMobileScreen })
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
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.requestInFlight = true;
            this.plRequest.from = this.fromDate;
            this.plRequest.to = this.toDate;
            this.plRequest.refresh = false;
            this.getProfitLossData();
        }
    }

    /**
     * This will get Profit/loss data
     *
     * @memberof ProfitLossComponent
     */
    public getProfitLossData(): void {
        this.tlPlService.GetProfitLoss(cloneDeep(this.plRequest)).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body) {
                this.dataFound = true;
                let data = cloneDeep(response.body) as ProfitLossData;
                let revenue;
                let expense;
                let npl;

                if (data && data.incomeStatment && data.incomeStatment.revenue) {
                    revenue = cloneDeep(data.incomeStatment.revenue) as GetRevenueResponse;
                    this.totalIncome = giddhRoundOff(revenue.amount, this.giddhBalanceDecimalPlaces);
                    this.totalIncomeType = (revenue.type === "CREDIT") ? "Cr." : "Dr.";
                } else {
                    this.totalIncome = 0;
                    this.totalIncomeType = '';
                }

                if (data && data.incomeStatment && data.incomeStatment.totalExpenses) {
                    expense = cloneDeep(data.incomeStatment.totalExpenses) as GetTotalExpenseResponse;
                    this.totalExpense = giddhRoundOff(expense.amount, this.giddhBalanceDecimalPlaces);
                    this.totalExpenseType = (expense.type === "CREDIT") ? "Cr." : "Dr.";
                } else {
                    this.totalExpense = 0;
                    this.totalExpenseType = '';
                }

                if (data && data.incomeStatment && data.incomeStatment.incomeBeforeTaxes) {
                    npl = cloneDeep(data.incomeStatment.incomeBeforeTaxes) as GetIncomeBeforeTaxes;
                    this.netProfitLossType = (npl.type === "CREDIT") ? "+" : "-";
                    this.netProfitLoss = giddhRoundOff(npl.amount, this.giddhBalanceDecimalPlaces);
                } else {
                    this.netProfitLossType = '';
                    this.netProfitLoss = 0;
                }

                if (this.totalIncome === 0 && this.totalExpense === 0) {
                    this.resetChartData();
                } else {

                    if (this.chart) {
                        this.chart.destroy();
                    } 
                    this.createChart()
                }
            }
            this.requestInFlight = false;
        });
    }

    public createChart():void {
        let totalIncome = this.amountSettings.baseCurrencySymbol + " " + this.currencyPipe.transform(this.totalIncome) + "/-";
        let totalExpense = this.amountSettings.baseCurrencySymbol + " " + this.currencyPipe.transform(this.totalExpense) + "/-";
        let label = [totalIncome,totalExpense];

        let data = [this.totalIncome, this.totalExpense]

        const dataChart = new Chart("profitLossChartCanvas", {
            type: 'doughnut',            
            data: {
                labels: label,
                datasets: [{
                    label: 'Profit & Loss',
                    data: data,
                    backgroundColor: ['#FED46A', '#4693F1'],
                    hoverOffset: 18,
                    hoverBorderColor: '#fff',
                    borderWidth: 1,		 
                    offset: 6      
              }],
            },

            options:{
                plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                        
                        backgroundColor: 'rgba(255, 255, 255,0.8)',
                        borderColor: 'rgb(95, 172, 255)',
                        bodyFont: {
                            size: 0,
                        },
                        titleColor: 'rgb(0, 0, 0)',
                        borderWidth: 0.5,
                        titleFont: {
                            weight: 'normal'
                        },
                        displayColors: false
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                spacing:1,
                cutout:50,  
                radius: '95%'        
            } 
            });

            this.requestInFlight = false;
            this.cdRef.detectChanges();


            const doughnutLabel = {
                id: 'profitLossChartCanvas',
                beforeDatasetsDraw(chart, args ,pluginOptions) {
                  const { ctx, dataChart } = chart;
                  ctx.save(); 
                  const xCoor = chart.getDatasetMeta(0).dataChart[0].x;
                  const yCoor = chart.getDatasetMeta(0).dataChart[0].y;
                  ctx.font = 'bold 30px sans-serif';
                  ctx.fillStyle = 'rgba(54, 162, 235, 1)';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillText(`jskd`, xCoor, yCoor);
                }
              }
     }
     
}

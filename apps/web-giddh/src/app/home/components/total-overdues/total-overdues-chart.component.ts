import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit, ChangeDetectorRef, ViewChild, TemplateRef, Inject } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { DashboardService } from '../../../services/dashboard.service';
import { GeneralService } from '../../../services/general.service';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import { ReceiptService } from '../../../services/receipt.service';
import { giddhRoundOff } from '../../../shared/helpers/helperFunctions';
import { Chart, registerables } from 'chart.js';
import { ServiceConfig } from '../../../services/service.config';
import { GiddhNumberFormatPipe } from '../../../shared/helpers/pipes/number-format/number-format.pipe';
import { Configuration } from '../../../app.constant';
import { environment } from '../../../../environments/environment.generated';
import { cloneDeep } from '../../../lodash-optimized';
Chart.register(...registerables);

/**
 * Handles Component functionality
 */
@Component({
    selector: 'total-overdues-chart',
    templateUrl: 'total-overdues-chart.component.html',
    styleUrls: ['../../home.component.scss', './total-overdues-chart.component.scss'],
    standalone:false
})
/**
 * TotalOverduesChartComponent component
 * Handles totaloverdueschart functionality and user interactions
 */
export class TotalOverduesChartComponent implements OnInit, OnDestroy {
    @ViewChild('datepickerTemplate', { static: true }) public datepickerTemplate: TemplateRef<any>;
    /** Angular Material menu trigger for datepicker */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** Selected from date */
    public fromDate: string;
    /** Selected to date */
    public toDate: string;
    @Input() public refresh: boolean = false;
    public imgPath: string = '';
    public requestInFlight: boolean = true;
    /** Holds due invoices */
    public invoiceDue: number = 0;
    /** Holds pending invoices */
    public pendingInvoices: number = 0;
    /** Holds hold invoices */
    public holdInvoices: number = 0;
    /** Holds due bills */
    public billDue: number = 0;
    /** Holds pending bills */
    public pendingBills: number = 0;
    /** Holds hold bills */
    public holdBills: number = 0;
    public overDueObj: any = {};
    public dayjs = dayjs;
    public amountSettings: any = { baseCurrencySymbol: '', balanceDecimalPlaces: '' };
    public universalDate$: Observable<any>;
    public dataFound: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public toRequest: any = { from: '', to: '', refresh: false };
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** this will store active company data */
    public activeCompany: any = {};
    /** Stores the voucher API version of company */
    public voucherApiVersion: number;
    /** Decimal places from company settings */
    public giddhBalanceDecimalPlaces: number = 2;
    /** Chart object */
    public chart: any;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(@Inject(ServiceConfig) private serviceConfig,  private store: Store<AppState>, private dashboardService: DashboardService, public currencyPipe: GiddhNumberFormatPipe, private cdRef: ChangeDetectorRef, private generalService: GeneralService, private receiptService: ReceiptService) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));

        this.store.pipe(select(p => p.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            /**
             * Handles if functionality
             */
            if (profile) {
                this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
            }
        });
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        // img path
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            /**
             * Handles if functionality
             */
            if (activeCompany) {
                this.amountSettings.baseCurrencySymbol = activeCompany.baseCurrencySymbol;
                this.amountSettings.balanceDecimalPlaces = activeCompany.balanceDecimalPlaces;
                this.activeCompany = activeCompany;
            }
        });

        // listen for universal date
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj) => {
            /**
             * Handles if functionality
             */
            if (dateObj) {
                let dates = [];
                dates = [dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT), dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT), false];
                this.getFilterDate(dates);
            }
        });

        /* Observer to store universal from/to date */
        this.universalDate$.subscribe(dateObj => {
            /**
             * Handles if functionality
             */
            if (dateObj) {
                let universalDate = cloneDeep(dateObj);

                this.selectedDateRange = { startDate: dayjs(universalDate[0]), endDate: dayjs(universalDate[1]) };
                this.selectedDateRangeUi = dayjs(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            }
        });
    }

    /**
     * Resets chartdata to default state
     */
    public resetChartData() {
        this.dataFound = false;
        this.overDueObj = {};
        this.invoiceDue = 0;
        this.pendingInvoices = 0;
        this.billDue = 0;
        this.pendingBills = 0;
        this.requestInFlight = false;
        this.cdRef.detectChanges();
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        /**
         * Handles if functionality
         */
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Retrieves filterdate data
     */
    public getFilterDate(dates: any) {
        /**
         * Handles if functionality
         */
        if (dates !== null) {
            this.requestInFlight = true;
            this.toRequest.from = dates[0];
            this.toRequest.to = dates[1];
            this.toRequest.refresh = false;
            this.getTotalOverdues();
        }
    }

    /**
     * Handles refreshChart functionality
     */
    public refreshChart() {
        this.requestInFlight = true;
        this.toRequest.refresh = true;
        this.getTotalOverdues();
    }

    /**
     * This will get total overdues for both sundry debtors and creditors
     *
     * @memberof TotalOverduesChartComponent
     */
    public getTotalOverdues(): void {
        this.dataFound = false;
        this.invoiceDue = 0;
        this.billDue = 0;
        this.pendingInvoices = 0
        this.pendingBills = 0;
        this.getTotalOverduesData();
    }

    /**
     * This will draw the chart if data available or will reset the chart
     *
     * @memberof TotalOverduesChartComponent
     */
    public checkPayableAndReceivable(): void {
        /**
         * Handles if functionality
         */
        if (this.invoiceDue === 0 && this.billDue === 0) {
            this.resetChartData();
        } else {
            /**
             * Handles if functionality
             */
            if (this.chart) {
                this.chart.destroy();
            }
            this.createChart();
        }
    }

    /**
     * This will call the api to get the data
     *
     * @memberof TotalOverduesChartComponent
     */
    public getTotalOverduesData(): void {
        this.dataFound = false;
        /**
         * Handles combineLatest functionality
         */
        combineLatest([this.receiptService.getAllReceiptBalanceDue({ from: this.toRequest.from, to: this.toRequest.to }, "sales"), this.receiptService.getAllReceiptBalanceDue({ from: this.toRequest.from, to: this.toRequest.to }, "purchase"), this.dashboardService.getPendingVouchersCount(this.toRequest.from, this.toRequest.to, "sales"), this.dashboardService.getPendingVouchersCount(this.toRequest.from, this.toRequest.to, "purchase")]).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            /**
             * Handles if functionality
             */
            if (response[0] && response[1] && response[2] && response[3]) {
                /**
                 * Handles if functionality
                 */
                if (response[0] && response[0].status === 'success' && response[0].body) {
                    this.invoiceDue = giddhRoundOff(response[0].body.totalDue, this.giddhBalanceDecimalPlaces);
                    this.dataFound = true;
                }
                /**
                 * Handles if functionality
                 */
                if (response[1] && response[1].status === 'success' && response[1].body) {
                    this.billDue = giddhRoundOff(response[1].body.totalDue, this.giddhBalanceDecimalPlaces);
                    this.dataFound = true;
                }
                /**
                 * Handles if functionality
                 */
                if (response[2] && response[2].status === 'success' && response[2].body) {
                    this.pendingInvoices = Number(response[2].body.unpaidCount) + Number(response[2].body.partialPaidCount);
                    this.holdInvoices = response[2].body.holdCount;
                    this.dataFound = true;
                }
                /**
                 * Handles if functionality
                 */
                if (response[3] && response[3].status === 'success' && response[3].body) {
                    this.pendingBills = Number(response[3].body.unpaidCount) + Number(response[3].body.partialPaidCount);
                    this.holdBills = response[3].body.holdCount;
                    this.dataFound = true;
                }

                this.checkPayableAndReceivable();
            }
        });
    }

    /**
    * This will show the datepicker
    *
    * @memberof TotalOverduesChartComponent
    */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        /**
         * Handles if functionality
         */
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof TotalOverduesChartComponent
     */
    public dateSelectedCallback(value?: any): void {
        /**
         * Handles if functionality
         */
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";

        /**
         * Handles if functionality
         */
        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
        /**
         * Handles if functionality
         */
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.requestInFlight = true;
            this.toRequest.from = this.fromDate;
            this.toRequest.to = this.toDate;
            this.toRequest.refresh = false;
            this.getTotalOverdues();
        }
    }

    /**
     * Create chart
     *
     * @memberof TotalOverduesChartComponent
     */
    public createChart(): void {
        let invoiceDue = this.amountSettings.baseCurrencySymbol + " " + this.currencyPipe.transform(this.invoiceDue) + "/-";
        let billDue = this.amountSettings.baseCurrencySymbol + " " + this.currencyPipe.transform(this.billDue) + "/-";
        let label = [invoiceDue, billDue];
        let data = [this.invoiceDue, this.billDue];

        this.chart = new Chart("totaloverDueChartCanvas", {
            type: 'doughnut',
            data: {
                labels: label,
                datasets: [{
                    label: '',
                    data: data,
                    backgroundColor: ['#F85C88', '#0CB1AF'],
                    hoverOffset: 18,
                    hoverBorderColor: '#fff',
                    borderWidth: 1,
                    offset: 6,
                }],
            },

            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255,0.8)',
                        borderColor: 'rgb(248, 92, 136)',
                        bodyFont: {
                            size: 0,
                        },
                        titleColor: 'rgb(0, 0, 0)',
                        borderWidth: 0.5,
                        titleFont: {
                            weight: 'normal'
                        },
                        displayColors: false,
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                spacing: 1,
                cutout: 50,
                radius: '95%',
            }
        });

        this.requestInFlight = false;
        this.cdRef.detectChanges();
    }
}

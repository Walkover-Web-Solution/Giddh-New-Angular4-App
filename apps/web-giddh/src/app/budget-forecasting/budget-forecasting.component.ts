import { Component, OnInit, OnDestroy, signal, computed, inject, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { BudgetForecastingService } from './utility/budget-forecasting.service';
import { ForecastGranularity, AnalysisPeriod, ForecastResponse } from './utility/budget-forecasting.model';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { SearchService } from '../services/search.service';
import { API_BULK_FETCH_LIMIT } from '../app.constant';
import { AmountFieldComponentModule } from '../shared/amount-field/amount-field.module';
import { ToasterService } from '../services/toaster.service';
import { GeneralService } from '../services/general.service';
import { GiddhDatePipe } from '../shared/pipes/giddh-date.pipe';
import { HamburgerMenuModule } from "../shared/header/components/hamburger-menu/hamburger-menu.module";

Chart.register(...registerables);

@Component({
    selector: 'app-budget-forecasting',
    imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormFieldsModule,
    TranslateDirectiveModule,
    AmountFieldComponentModule,
    GiddhDatePipe,
    HamburgerMenuModule
],
    templateUrl: './budget-forecasting.component.html',
    styleUrls: ['./budget-forecasting.component.scss']
})
export class BudgetForecastingComponent implements OnInit, OnDestroy {
    private budgetForecastingService = inject(BudgetForecastingService);
    private searchService = inject(SearchService);
    private generalService = inject(GeneralService);
    private activatedRoute = inject(ActivatedRoute);
    private toasterService = inject(ToasterService)

    /** Default forecast length for daily granularity (in days) */
    private readonly DEFAULT_DAILY_FORECAST_LENGTH = 60;

    /** Default forecast length for weekly granularity (in weeks) */
    private readonly DEFAULT_WEEKLY_FORECAST_LENGTH = 26;

    /** Default forecast length for monthly granularity (in months) */
    private readonly DEFAULT_MONTHLY_FORECAST_LENGTH = 12;

    /** Parent group names for account filtering */
    private readonly PARENT_GROUP_NAMES = "shareholdersfunds, noncurrentliabilities, currentliabilities, fixedassets, noncurrentassets, currentassets, revenuefromoperations, otherincome, operatingcost, indirectexpenses";

    /** Locale data for translations */
    public localeData = signal<any>({});

    /** Common locale data for shared translations */
    public commonLocaleData = signal<any>({});

    /** Expose ForecastGranularity enum to template */
    public readonly forecastGranularity = ForecastGranularity;

    /** Holds the forecast settings form */
    public forecastForm: FormGroup = new FormGroup({
        account: new FormControl('', Validators.required),
        granularity: new FormControl(ForecastGranularity.DAILY, Validators.required),
        forecastLength: new FormControl(this.DEFAULT_DAILY_FORECAST_LENGTH, [Validators.required, Validators.min(1)])
    });

    /** Selected account value from form control */
    private selectedAccountValue = toSignal(
        this.forecastForm.get('account')!.valueChanges.pipe(
            startWith(this.forecastForm.get('account')!.value)
        ),
        { initialValue: '' }
    );

    /** Computed selected account label */
    public selectedAccountLabel = computed(() => {
        const selectedValue = this.selectedAccountValue();
        const account = this.accountOptions().find(opt => opt.value === selectedValue);
        return account?.label;
    });

    /** Granularity value from form control */
    private granularityValue = toSignal(
        this.forecastForm.get('granularity')!.valueChanges.pipe(
            startWith(this.forecastForm.get('granularity')!.value)
        ),
        { initialValue: ForecastGranularity.DAILY }
    );

    /** Computed granularity label based on form control value */
    public granularityLabel = computed(() => {
        const granularity = this.granularityValue();
        if (granularity === ForecastGranularity.DAILY) return this.localeData()?.granularity_daily;
        if (granularity === ForecastGranularity.WEEKLY) return this.localeData()?.granularity_weekly;
        return this.localeData()?.granularity_monthly;
    });

    /** Computed forecast length suffix based on selected granularity */
    public forecastLengthSuffix = computed(() => {
        const granularity = this.granularityValue();
        if (granularity === ForecastGranularity.DAILY) return this.localeData()?.suffix_days;
        if (granularity === ForecastGranularity.WEEKLY) return this.localeData()?.suffix_weeks;
        return this.localeData()?.suffix_months;
    });

    /** Computed forecast range text based on selected granularity */
    public forecastRangeText = computed(() => {
        const granularity = this.granularityValue();
        const length = this.forecastLength();
        if (granularity === ForecastGranularity.DAILY) {
            return this.localeData()?.next_days?.replace('{{days}}', length);
        }
        if (granularity === ForecastGranularity.WEEKLY) {
            return this.localeData()?.next_weeks?.replace('{{weeks}}', length);
        }
        return this.localeData()?.next_months?.replace('{{months}}', length);
    });

    /** Available account options for dropdown */
    public accountOptions = signal([]);

    /** Flag to prevent circular updates between form and query params */
    private isUpdatingFromQueryParams = false;

    /** Flag to track if component is initialized */
    private isInitialized = false;

    /** Available analysis period options */
    public analysisPeriods = signal([]);

    /** Selected analysis period */
    public selectedPeriod = signal<AnalysisPeriod>(AnalysisPeriod.LAST_30_DAYS);

    /** Forecast results data */
    public forecastResults = signal<ForecastResponse | null>(null);

    /** Loading state */
    public isLoading = signal(false);

    /** Canvas element for chart */
    @ViewChild('forecastChart') private chartCanvas: ElementRef<HTMLCanvasElement>;

    /** Chart.js instance */
    private chart: Chart | null = null;

    /** Computed forecast length */
    public forecastLength = toSignal(
        this.forecastForm.get('forecastLength')!.valueChanges.pipe(
            startWith(this.forecastForm.get('forecastLength')!.value)
        ),
        { initialValue: this.DEFAULT_DAILY_FORECAST_LENGTH }
    );

    /** Computed analysis period label */
    public analysisPeriodLabel = computed(() => {
        const period = this.selectedPeriod();
        const periodObj = this.analysisPeriods().find(p => p.value === period);
        return periodObj?.label.toLowerCase();
    });

    private destroyed$ = new Subject<void>();

    constructor() {
        effect(() => {
            const results = this.forecastResults();
            if (results?.forecast?.length) {
                setTimeout(() => {
                    if (this.chart) {
                        this.chart.destroy();
                        this.chart = null;
                    }
                    this.initializeChart();
                    if (this.chart) {
                        this.updateChart();
                    }
                }, 100);
            }
        });
    }

    /**
     * Initializes the component and sets up form listeners
     *
     * @memberof BudgetForecastingComponent
     */
    public ngOnInit(): void {
        this.loadFiltersFromQueryParams();
        this.setupFormListeners();
        this.setupQueryParamSync();
        this.getAccounts();
        this.isInitialized = true;

        // Auto-run forecast if all required params are present in URL
        const queryParams = this.activatedRoute.snapshot.queryParams;
        if (queryParams['account'] && this.forecastForm.valid) {
            setTimeout(() => {
                this.runForecast();
            }, 500);
        }
    }

    /**
     * Loads filters from URL query parameters
     *
     * @private
     * @memberof BudgetForecastingComponent
     */
    private loadFiltersFromQueryParams(): void {
        this.isUpdatingFromQueryParams = true;

        const queryParams = this.activatedRoute.snapshot.queryParams;

        if (queryParams['account']) {
            this.forecastForm.patchValue({ account: queryParams['account'] });
        }

        if (queryParams['granularity'] && Object.values(ForecastGranularity).includes(queryParams['granularity'])) {
            this.forecastForm.patchValue({ granularity: queryParams['granularity'] });
        }

        if (queryParams['forecastLength']) {
            const length = parseInt(queryParams['forecastLength'], 10);
            if (!isNaN(length) && length > 0) {
                this.forecastForm.patchValue({ forecastLength: length });
            }
        }

        if (queryParams['analysisPeriod'] && Object.values(AnalysisPeriod).includes(queryParams['analysisPeriod'])) {
            this.selectedPeriod.set(queryParams['analysisPeriod'] as AnalysisPeriod);
        }

        setTimeout(() => {
            this.isUpdatingFromQueryParams = false;
        }, 100);
    }

    /**
     * Sets up synchronization between form values and query parameters
     *
     * @private
     * @memberof BudgetForecastingComponent
     */
    private setupQueryParamSync(): void {
        this.forecastForm.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                takeUntil(this.destroyed$)
            )
            .subscribe(() => {
                if (!this.isUpdatingFromQueryParams && this.isInitialized) {
                    this.updateQueryParams();
                }
            });
    }

    /**
     * Updates URL query parameters based on current filter values
     *
     * @private
     * @memberof BudgetForecastingComponent
     */
    private updateQueryParams(): void {
        const queryParams: any = {};

        const formValue = this.forecastForm.value;

        if (formValue.account) {
            queryParams.account = formValue.account;
        }

        if (formValue.granularity) {
            queryParams.granularity = formValue.granularity;
        }

        if (formValue.forecastLength) {
            queryParams.forecastLength = formValue.forecastLength;
        }

        if (this.selectedPeriod()) {
            queryParams.analysisPeriod = this.selectedPeriod();
        }

        this.generalService.updateActivatedRouteQueryParams(queryParams);
    }

    /**
     * Handles translation completion event
     *
     * @param {*} event - Translation complete event
     * @memberof BudgetForecastingComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.updateAnalysisPeriodLabels();
        }
    }

    /**
     * Updates analysis period labels with translated text
     *
     * @private
     * @memberof BudgetForecastingComponent
     */
    private updateAnalysisPeriodLabels(): void {
        const locale = this.localeData();
        this.analysisPeriods.set([
            { label: locale?.period_last_7_days, value: AnalysisPeriod.LAST_7_DAYS },
            { label: locale?.period_last_30_days, value: AnalysisPeriod.LAST_30_DAYS },
            { label: locale?.period_last_3_months, value: AnalysisPeriod.LAST_3_MONTHS },
            { label: locale?.period_last_6_months, value: AnalysisPeriod.LAST_6_MONTHS },
            { label: locale?.period_last_1_year, value: AnalysisPeriod.LAST_1_YEAR },
            { label: locale?.period_lifetime, value: AnalysisPeriod.LIFETIME }
        ]);
    }


    /**
     * Fetches accounts from API
     *
     * @param {string} search - Search query for filtering accounts
     * @memberof BudgetForecastingComponent
     */
    public getAccounts(search: string = ''): void {
        const params = {
            page: 1,
            withStocks: false,
            count: API_BULK_FETCH_LIMIT,
            branchUniqueName: '',
            q: search,
            group: this.PARENT_GROUP_NAMES
        };

        this.searchService.searchAccountV3(params)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (response) => {
                    if (response?.status === 'success' && response?.body?.results) {
                        const accounts = response.body.results.map((account: any) => ({
                            label: account.name,
                            value: account.uniqueName,
                            additional: account
                        }));
                        this.accountOptions.set(accounts);
                    } else {
                        this.accountOptions.set([]);
                        if (response?.status === 'error' && response?.message) {
                            this.toasterService.showSnackBar("error", response.message);
                        }
                    }
                },
                error: (error) => {
                    console.error('Error fetching accounts:', error);
                    this.accountOptions.set([]);
                }
            });
    }


    /**
     * Cleanup on component destruction
     *
     * @memberof BudgetForecastingComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
        if (this.chart) {
            this.chart.destroy();
        }
    }

    /**
     * Sets up form value change listeners
     *
     * @private
     * @memberof BudgetForecastingComponent
     */
    private setupFormListeners(): void {
        this.forecastForm.get('granularity')?.valueChanges
            .pipe(takeUntil(this.destroyed$))
            .subscribe((granularity) => {
                this.updateDefaultForecastLength(granularity);
            });
    }

    /**
     * Updates default forecast length based on granularity
     *
     * @private
     * @param {ForecastGranularity} granularity - Selected granularity
     * @memberof BudgetForecastingComponent
     */
    private updateDefaultForecastLength(granularity: ForecastGranularity): void {
        let defaultLength = this.DEFAULT_DAILY_FORECAST_LENGTH;

        if (granularity === ForecastGranularity.WEEKLY) {
            defaultLength = this.DEFAULT_WEEKLY_FORECAST_LENGTH;
        } else if (granularity === ForecastGranularity.MONTHLY) {
            defaultLength = this.DEFAULT_MONTHLY_FORECAST_LENGTH;
        }

        this.forecastForm.patchValue({ forecastLength: defaultLength });
    }

    /**
     * Selects an analysis period
     *
     * @param {AnalysisPeriod} period - Period value to select
     * @memberof BudgetForecastingComponent
     */
    public selectPeriod(period: AnalysisPeriod): void {
        this.selectedPeriod.set(period);
        if (this.isInitialized) {
            this.updateQueryParams();
        }
    }

    /**
     * Runs the forecast with current settings
     *
     * @memberof BudgetForecastingComponent
     */
    public runForecast(): void {
        this.forecastForm.get('account')?.markAsTouched();
        if (this.forecastForm.invalid) {
            return;
        }

        this.isLoading.set(true);

        const payload = {
            accountUniqueNames: [this.forecastForm.value.account],
            granularity: this.forecastForm.value.granularity,
            analysisPeriod: this.selectedPeriod(),
            forecastLength: this.forecastForm.value.forecastLength
        };

        this.budgetForecastingService.getForecast(payload)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (response) => {
                    if (response.status === 'success' && response.body?.length > 0) {
                        this.forecastResults.set(response.body[0]);
                    } else {
                        this.forecastResults.set(null);
                        if (response?.status === 'error' && response?.message) {
                            this.toasterService.showSnackBar("error", response.message);
                        }
                    }
                    this.isLoading.set(false);
                },
                error: () => {
                    this.isLoading.set(false);
                }
            });
    }

    /**
     * Initializes the Chart.js line chart
     *
     * @private
     * @memberof BudgetForecastingComponent
     */
    private initializeChart(): void {
        if (!this.chartCanvas) {
            console.warn('Chart canvas not found');
            return;
        }

        const ctx = this.chartCanvas.nativeElement.getContext('2d');
        if (!ctx) {
            console.warn('Canvas context not available');
            return;
        }

        const config: ChartConfiguration = {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Closing Balance',
                    data: [],
                    borderColor: '#4A90E2',
                    backgroundColor: 'rgba(74, 144, 226, 0.05)',
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 3,
                    pointBackgroundColor: '#4A90E2',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#4A90E2',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        titleFont: {
                            size: 12,
                            weight: 'normal'
                        },
                        bodyFont: {
                            size: 13,
                            weight: 'bold'
                        },
                        padding: 10,
                        displayColors: false,
                        cornerRadius: 4,
                        callbacks: {
                            label: (context) => {
                                return `${Number(context.parsed.y).toLocaleString('en-IN')}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            color: '#6c757d',
                            font: {
                                size: 11
                            },
                            maxRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 6
                        }
                    },
                    y: {
                        display: false,
                        grid: {
                            color: '#e9ecef',
                            lineWidth: 1
                        },
                        border: {
                            display: false
                        }
                    }
                }
            }
        };

        this.chart = new Chart(ctx, config);
    }

    /**
     * Updates the chart with new forecast data
     *
     * @private
     * @memberof BudgetForecastingComponent
     */
    private updateChart(): void {
        if (!this.chart) return;

        const results = this.forecastResults();
        if (!results?.forecast) return;

        const labels = results.forecast.map(item => {
            const [day, month, year] = item.date.split('-');
            const date = new Date(Number(year), Number(month) - 1, Number(day));
            return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        });

        const data = results.forecast.map(item => parseFloat(item.predicted_amount));

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }
}

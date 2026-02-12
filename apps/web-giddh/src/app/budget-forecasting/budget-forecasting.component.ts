import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { BudgetForecastingService } from './utility/budget-forecasting.service';
import { ForecastGranularity, AnalysisPeriod, ForecastResponse } from './utility/budget-forecasting.model';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { SearchService } from '../services/search.service';
import { API_BULK_FETCH_LIMIT } from '../app.constant';
import { AmountFieldComponentModule } from '../shared/amount-field/amount-field.module';
import { ToasterService } from '../services/toaster.service';

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
        AmountFieldComponentModule
    ],
    templateUrl: './budget-forecasting.component.html',
    styleUrls: ['./budget-forecasting.component.scss']
})
export class BudgetForecastingComponent implements OnInit, OnDestroy {
    private budgetForecastingService = inject(BudgetForecastingService);
    private searchService = inject(SearchService);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private toasterService = inject(ToasterService);
    
    /** Default forecast length for daily granularity (in days) */
    private readonly DEFAULT_DAILY_FORECAST_LENGTH = 60;
    
    /** Default forecast length for weekly granularity (in weeks) */
    private readonly DEFAULT_WEEKLY_FORECAST_LENGTH = 26;
    
    /** Default forecast length for monthly granularity (in months) */
    private readonly DEFAULT_MONTHLY_FORECAST_LENGTH = 12;
    
    /** Locale data for translations */
    public localeData = signal<any>({});
    
    /** Common locale data for shared translations */
    public commonLocaleData = signal<any>({});
    
    /** Expose ForecastGranularity enum to template */
    public readonly forecastGranularity = ForecastGranularity;
    
    /** Holds the forecast settings form */
    public forecastForm: FormGroup;
    
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
    
    /** AI question input */
    public aiQuestion = signal('');
    
    /** Computed selected account label */
    public selectedAccountLabel = computed(() => {
        const selectedValue = this.forecastForm?.get('account')?.value;
        const account = this.accountOptions().find(opt => opt.value === selectedValue);
        return account?.label;
    });
    
    /** Computed granularity label */
    public granularityLabel = computed(() => {
        const granularity = this.forecastForm?.get('granularity')?.value;
        if (granularity === ForecastGranularity.DAILY) return this.localeData()?.granularity_daily;
        if (granularity === ForecastGranularity.WEEKLY) return this.localeData()?.granularity_weekly;
        return this.localeData()?.granularity_monthly;
    });
    
    /** Computed forecast length */
    public forecastLength = computed(() => {
        return this.forecastForm?.get('forecastLength')?.value || 60;
    });
    
    /** Computed analysis period label */
    public analysisPeriodLabel = computed(() => {
        const period = this.selectedPeriod();
        const periodObj = this.analysisPeriods().find(p => p.value === period);
        return periodObj?.label.toLowerCase();
    });
    
    private destroyed$ = new Subject<void>();
    
    constructor() {
        this.forecastForm = new FormGroup({
            account: new FormControl('', Validators.required),
            granularity: new FormControl(ForecastGranularity.DAILY, Validators.required),
            forecastLength: new FormControl(60, [Validators.required, Validators.min(1)])
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
            this.forecastForm.patchValue({ account: queryParams['account'] }, { emitEvent: false });
        }
        
        if (queryParams['granularity'] && Object.values(ForecastGranularity).includes(queryParams['granularity'])) {
            this.forecastForm.patchValue({ granularity: queryParams['granularity'] }, { emitEvent: false });
        }
        
        if (queryParams['forecastLength']) {
            const length = parseInt(queryParams['forecastLength'], 10);
            if (!isNaN(length) && length > 0) {
                this.forecastForm.patchValue({ forecastLength: length }, { emitEvent: false });
            }
        }
        
        if (queryParams['analysisPeriod'] && Object.values(AnalysisPeriod).includes(queryParams['analysisPeriod'])) {
            this.selectedPeriod.set(queryParams['analysisPeriod'] as AnalysisPeriod);
        }
        
        if (queryParams['aiQuestion']) {
            this.aiQuestion.set(decodeURIComponent(queryParams['aiQuestion']));
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
        
        if (this.aiQuestion()) {
            queryParams.aiQuestion = encodeURIComponent(this.aiQuestion());
        }
        
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
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
            { label: locale?.period_last_30_days, value: AnalysisPeriod.LAST_30_DAYS },
            { label: locale?.period_last_60_days, value: AnalysisPeriod.LAST_60_DAYS },
            { label: locale?.period_last_90_days, value: AnalysisPeriod.LAST_90_DAYS },
            { label: locale?.period_last_6_months, value: AnalysisPeriod.LAST_6_MONTHS },
            { label: locale?.period_last_year, value: AnalysisPeriod.LAST_YEAR }
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
            group: "shareholdersfunds, noncurrentliabilities, currentliabilities, fixedassets, noncurrentassets, currentassets, revenuefromoperations, otherincome, operatingcost, indirectexpenses"
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
        
        this.forecastForm.patchValue({ forecastLength: defaultLength }, { emitEvent: false });
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
            if (!this.forecastForm.value.account) {
                this.toasterService.showSnackBar('error', this.localeData()?.account + ' ' + (this.localeData()?.is_mandatory || 'is mandatory'));
            }
            return;
        }
        
        this.isLoading.set(true);
        
        const payload = {
            accountUniqueNames: [this.forecastForm.value.account],
            granularity: this.forecastForm.value.granularity,
            analysisPeriod: this.selectedPeriod(),
            forecastLength: this.forecastForm.value.forecastLength,
            question: this.aiQuestion()
        };
        
        if (!payload.question) {
            delete payload.question;
        }
        
        this.budgetForecastingService.getForecast(payload)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (response) => {
                    if (response.status === 'success' && response.body?.length > 0) {
                        this.forecastResults.set(response.body[0]);
                    }
                    this.isLoading.set(false);
                },
                error: () => {
                    this.isLoading.set(false);
                }
            });
    }
    
    /**
     * Sends AI question and runs forecast
     *
     * @memberof BudgetForecastingComponent
     */
    public sendAiQuestion(): void {
        if (!this.forecastForm.value.account) {
            this.toasterService.showSnackBar('error', this.localeData()?.account + ' ' + (this.localeData()?.is_mandatory || 'is mandatory'));
            return;
        }
        
        if (this.aiQuestion()?.trim()) {
            if (this.isInitialized) {
                this.updateQueryParams();
            }
            this.runForecast();
        }
    }
    
    /**
     * Handles click events on empty state message
     * Triggers forecast if "Run forecast" text is clicked
     *
     * @param {MouseEvent} event - Click event
     * @memberof BudgetForecastingComponent
     */
    public onEmptyStateClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        
        // Check if clicked element has text-primary class (the "Run forecast" span)
        if (target.classList.contains('text-primary')) {
            if (!this.forecastForm.value.account) {
                this.toasterService.showSnackBar('error', this.localeData()?.account + ' ' + (this.localeData()?.is_mandatory || 'is mandatory'));
                return;
            }
            
            if (this.forecastForm.valid && !this.isLoading()) {
                this.runForecast();
            }
        }
    }
}

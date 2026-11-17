import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    computed,
    inject,
    signal
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { ASIDE_PANE_CONFIG, IOption } from 'apps/web-giddh/src/app/app.constant';
import {
    JobWorkBatch,
    JobWorkExpenseLine,
    JobWorkFormModel,
    JobWorkOrderRequest,
    JobWorkScrapLine,
    JobWorkStockLine,
    JobworkerType,
    ScrapRetainedBy,
    ScrapTreatment
} from 'apps/web-giddh/src/app/models/api-models/JobWork';
import { BatchSelectDialogResult, VoucherSelectedBatch } from 'apps/web-giddh/src/app/models/interfaces/batch-report.interface';
import { OrganizationType } from 'apps/web-giddh/src/app/models/user-login-state';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { InventoryService } from 'apps/web-giddh/src/app/services/inventory.service';
import { JobWorkService } from 'apps/web-giddh/src/app/services/job-work.service';
import { LedgerService } from 'apps/web-giddh/src/app/services/ledger.service';
import { ManufacturingService } from 'apps/web-giddh/src/app/services/manufacturing.service';
import { SearchService } from 'apps/web-giddh/src/app/services/search.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { CommonActions } from 'apps/web-giddh/src/app/actions/common.actions';
import { CompanyActions } from 'apps/web-giddh/src/app/actions/company.actions';
import { OnboardingFormRequest } from 'apps/web-giddh/src/app/models/api-models/Common';
import { WarehouseActions } from 'apps/web-giddh/src/app/settings/warehouse/action/warehouse.action';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { giddhRoundOff } from 'apps/web-giddh/src/app/shared/helpers/helperFunctions';
import { AppState } from 'apps/web-giddh/src/app/store';
import { BatchSelectDialogComponent } from 'apps/web-giddh/src/app/vouchers/batch-select-dialog/batch-select-dialog.component';
import * as dayjs from 'dayjs';
import { map, take } from 'rxjs/operators';

type JobWorkBatchSource = 'finished' | 'raw' | 'scrap';

@Component({
    selector: 'create-job-work',
    templateUrl: './create-job-work.component.html',
    styleUrls: ['./create-job-work.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CreateJobWorkComponent implements OnInit {
    private readonly store = inject(Store<AppState>);
    private readonly warehouseAction = inject(WarehouseActions);
    private readonly companyActions = inject(CompanyActions);
    private readonly commonActions = inject(CommonActions);
    private readonly inventoryService = inject(InventoryService);
    private readonly manufacturingService = inject(ManufacturingService);
    private readonly ledgerService = inject(LedgerService);
    private readonly searchService = inject(SearchService);
    private readonly jobWorkService = inject(JobWorkService);
    private readonly toasterService = inject(ToasterService);
    private readonly generalService = inject(GeneralService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    private readonly dialog = inject(MatDialog);

    /** Page translations. */
    readonly localeData = signal<Record<string, string>>({});
    /** Shared translations. */
    readonly commonLocaleData = signal<Record<string, string>>({});
    /** Create/update form model. */
    readonly form = signal(new JobWorkFormModel());
    /** Bumps when nested form fields change so computed totals re-run. */
    private readonly formTick = signal(0);
    /** Warehouse dropdown options. */
    readonly warehouses = signal<IOption[]>([]);
    /** Jobworker account options. */
    readonly jobworkerAccounts = signal<IOption[]>([]);
    /** Expense "from" account options. */
    readonly fromAccounts = signal<IOption[]>([]);
    /** Expense "to" account options. */
    readonly toAccounts = signal<IOption[]>([]);
    /** True while create/update request is in flight. */
    readonly isLoading = signal(false);
    /** True while loading an existing order for edit. */
    readonly isLoadingDetails = signal(false);
    /** Company (HO) organization mode. */
    readonly isCompany = signal(this.generalService.currentOrganizationType === OrganizationType.Company);
    /** Order unique name when editing. */
    readonly orderUniqueName = signal('');
    /** Company decimal places for amount rounding. */
    readonly giddhBalanceDecimalPlaces = signal(2);
    /** Company amount mask for common-tax display. */
    readonly inputMaskFormat = signal('');
    /** True when company batch tracking is enabled. */
    readonly batchTrackingEnabled = signal(false);
    /** Company taxes for common-tax. */
    readonly companyTaxes = signal<unknown[]>([]);
    /** Restrict one tax per tax type (same as vouchers/ledger). */
    readonly allowedSelectionOfAType = { type: [] as string[], count: 1 };

    private readonly jobworkerPage = signal(1);
    private readonly jobworkerTotalPages = signal(1);
    private readonly jobworkerQuery = signal('');
    /** Tracks in-flight stock searches per line to allow parallel loads. */
    private readonly stockSearchInFlight = new WeakSet<object>();

    private readonly isConsolidatedBranch = toSignal(
        this.store.pipe(
            select(state => state.branchConsolidated),
            map(response => !!response?.isBranchConsolidated)
        ),
        { initialValue: false }
    );

    /** True when create/edit controls must be read-only. */
    readonly isReadOnly = computed(() => this.isCompany() || this.isConsolidatedBranch());
    /** True when opened from Job Work list (show Back). */
    readonly showBackToList = signal(false);
    /** True when GSTIN matches company tax regex (or is empty). */
    readonly isGstValid = signal(true);
    /** Onboarding form tax field config for GSTIN validation. */
    private taxFormFields: Record<string, { label?: string; regex?: string[] | string }> = {};
    /** Country code used to load tax form fields once. */
    private taxFormCountryCode = '';

    /** Jobworker registration type options. */
    readonly jobworkerTypes = computed<IOption[]>(() => {
        const locale = this.localeData();
        return [
            { label: locale['registered'], value: 'REGISTERED' },
            { label: locale['unregistered'], value: 'UNREGISTERED' }
        ];
    });

    /** Scrap retained-by options. */
    readonly scrapRetainedByOptions = computed<IOption[]>(() => {
        const locale = this.localeData();
        return [
            { label: locale['jobworker'], value: 'JOBWORKER' },
            { label: locale['company'], value: 'COMPANY' }
        ];
    });

    /** Scrap treatment options. */
    readonly scrapTreatmentOptions = computed<IOption[]>(() => {
        const locale = this.localeData();
        return [
            { label: locale['reduce_from_job_work_cost'], value: 'REDUCE_FROM_JOB_WORK_COST' },
            { label: locale['keep_as_scrap_stock'], value: 'KEEP_AS_SCRAP_STOCK' }
        ];
    });

    /** Job work type options (send only for v1). */
    readonly jobWorkTypeOptions = computed<IOption[]>(() => [
        { label: this.localeData()['send_for_job_work'], value: 'SEND' }
    ]);

    /** Derived cost totals from the form. */
    readonly totals = computed(() => {
        this.formTick();
        const form = this.form();
        const decimals = this.giddhBalanceDecimalPlaces();
        const rawAmount = giddhRoundOff(
            form.rawStocks.reduce((sum, row) => sum + (Number(row.amount) || 0), 0),
            decimals
        );
        const rawQuantity = form.rawStocks.reduce((sum, row) => sum + (Number(row.quantity) || 0), 0);
        const expenseAmount = giddhRoundOff(
            form.expenses.reduce((sum, row) => sum + (Number(row.amount) || 0), 0),
            decimals
        );
        const taxAmount = giddhRoundOff(
            form.expenses.reduce((sum, row) => sum + (Number(row.taxAmount) || 0), 0),
            decimals
        );
        const scrapAmount = giddhRoundOff(
            form.scraps.reduce((sum, row) => sum + (Number(row.amount) || 0), 0),
            decimals
        );
        const scrapQuantity = form.scraps.reduce((sum, row) => sum + (Number(row.quantity) || 0), 0);
        const reduceScrap =
            form.scrapRetainedBy === 'JOBWORKER' && form.scrapTreatment === 'REDUCE_FROM_JOB_WORK_COST'
                ? scrapAmount
                : 0;
        const capitalizeExpense = form.increaseAssetValue ? expenseAmount : 0;
        const capitalizeTax = form.increaseAssetValue && !form.claimItc ? taxAmount : 0;
        const outputWithoutTax = giddhRoundOff(rawAmount + capitalizeExpense - reduceScrap, decimals);
        const outputWithTax = giddhRoundOff(rawAmount + capitalizeExpense + taxAmount - reduceScrap, decimals);
        const outputValue = giddhRoundOff(rawAmount + capitalizeExpense + capitalizeTax - reduceScrap, decimals);
        const qty = Number(form.finishedStock.quantity) || 0;
        const costPerItem = qty ? giddhRoundOff(outputValue / qty, decimals) : 0;
        const totalPayable = giddhRoundOff(expenseAmount + (form.claimItc ? taxAmount : 0), decimals);
        return {
            rawAmount,
            rawQuantity,
            expenseAmount,
            taxAmount,
            scrapAmount,
            scrapQuantity,
            outputValue,
            outputWithoutTax,
            outputWithTax,
            costPerItem,
            totalPayable
        };
    });

    /** GST line caption in the valuation card. */
    readonly gstCaption = computed(() => {
        this.formTick();
        const form = this.form();
        const locale = this.localeData();
        if (form.jobworkerType === 'UNREGISTERED') {
            return locale['nil_unregistered'] ?? '';
        }
        if (!form.increaseAssetValue || form.claimItc) {
            return locale['not_capitalized'] ?? '';
        }
        return String(this.totals().taxAmount);
    });

    /** Alert toggle label. */
    readonly alertLabel = computed(() => {
        this.formTick();
        return (this.localeData()['alert_before_days'] || '').replace(
            '[DAYS]',
            String(this.form().alertBeforeDays || 15)
        );
    });

    /** Cost-per-item label with qty/unit placeholders. */
    readonly costPerItemLabel = computed(() => {
        this.formTick();
        const finished = this.form().finishedStock;
        return (this.localeData()['cost_per_item_qty'] || '')
            .replace('[QTY]', String(finished.quantity || 0))
            .replace('[UNIT]', finished.stockUnitCode || '');
    });

    /**
     * Initializes warehouses, default rows, and route/edit loading.
     *
     * @memberof CreateJobWorkComponent
     */
    ngOnInit(): void {
        const navigationState = (
            this.router.getCurrentNavigation()?.extras?.state
            || this.router.lastSuccessfulNavigation()?.extras?.state
            || (typeof history !== 'undefined' ? history.state : null)
            || {}
        ) as { fromJobWorkList?: boolean };
        this.showBackToList.set(!!navigationState.fromJobWorkList);

        this.store.pipe(
            select(state => state.settings?.profile),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(profile => {
            if (profile?.balanceDecimalPlaces || profile?.balanceDecimalPlaces === 0) {
                this.giddhBalanceDecimalPlaces.set(profile.balanceDecimalPlaces);
            }
            this.inputMaskFormat.set(
                profile?.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : ''
            );
            const countryCode = profile?.countryV2?.alpha2CountryCode || '';
            if (countryCode) {
                this.loadTaxFormFields(countryCode);
            }
        });

        this.store.pipe(
            select(state => state.common?.onboardingform),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(response => {
            if (!response?.fields) {
                return;
            }
            this.taxFormFields = {};
            Object.keys(response.fields).forEach(key => {
                const field = response.fields[key];
                if (field?.name) {
                    this.taxFormFields[field.name] = field;
                }
            });
        });

        this.store.pipe(
            select(state => state.inventory.inventorySettings),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(settings => {
            if (settings) {
                this.batchTrackingEnabled.set(!!settings?.batchManagement?.enabled);
            }
        });

        this.store.dispatch(this.companyActions.getTax());
        this.store.pipe(
            select(state => state.company?.taxes),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(taxes => {
            const list = Array.isArray(taxes) ? taxes : [];
            this.companyTaxes.set(list);
            this.allowedSelectionOfAType.type = [];
            list.forEach((tax: { taxType?: string }) => {
                if (tax?.taxType && !this.allowedSelectionOfAType.type.includes(tax.taxType)) {
                    this.allowedSelectionOfAType.type.push(tax.taxType);
                }
            });
        });

        this.store.pipe(
            select(state => state.session.applicationDate),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(dateObj => {
            if (dateObj && !this.orderUniqueName() && !this.form().date) {
                const today = dateObj[1] ? dayjs(dateObj[1]) : dayjs();
                this.commitForm(current => {
                    current.date = today.format(GIDDH_DATE_FORMAT);
                    current.challanDate = current.date;
                    current.expectedReturnDate = today.add(30, 'day').format(GIDDH_DATE_FORMAT);
                });
            }
        });

        this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
            if (params?.uniqueName) {
                this.orderUniqueName.set(params.uniqueName);
                this.getDetails(params.uniqueName);
            }
        });

        this.getWarehouses();
        this.addRawStockRow();
        this.addExpenseRow();
        this.addScrapRow();
        this.searchJobworkers('');
        this.searchFromAccounts('');
        this.searchToAccounts('');
        this.getStocks(this.form().finishedStock, 1, '');
        this.touchForm();
    }

    /**
     * Stores page locale JSON and keeps option labels in sync.
     *
     * @param {Record<string, string>} event
     * @memberof CreateJobWorkComponent
     */
    localeDataFn(event: Record<string, string>): void {
        this.localeData.set(event || {});
    }

    /**
     * Stores common locale JSON.
     *
     * @param {Record<string, string>} event
     * @memberof CreateJobWorkComponent
     */
    setCommonLocaleData(event: Record<string, string>): void {
        this.commonLocaleData.set(event || {});
    }

    /**
     * Marks form nested mutations so computed values refresh.
     *
     * @memberof CreateJobWorkComponent
     */
    touchForm(): void {
        this.formTick.update(tick => tick + 1);
    }

    /**
     * Mutates the form model and emits a new signal reference so the template refreshes.
     *
     * @param {(draft: JobWorkFormModel) => void} mutator
     * @memberof CreateJobWorkComponent
     */
    private commitForm(mutator: (draft: JobWorkFormModel) => void): void {
        this.form.update(current => {
            mutator(current);
            return { ...current };
        });
        this.touchForm();
    }

    /**
     * Loads warehouses from store.
     *
     * @memberof CreateJobWorkComponent
     */
    getWarehouses(): void {
        this.store.dispatch(this.warehouseAction.fetchAllWarehouses({ page: 1, count: 0 }));
        this.store.pipe(
            select(state => state.warehouse.warehouses),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((warehouses: { results?: Array<{ isArchived?: boolean; name: string; uniqueName: string }> }) => {
            if (!warehouses?.results?.length) {
                return;
            }
            const options = warehouses.results
                .filter(warehouse => !warehouse.isArchived)
                .map(warehouse => ({
                    label: warehouse.name,
                    value: warehouse.uniqueName
                }));
            this.warehouses.set(options);
            if (!this.form().warehouseUniqueName && options.length) {
                this.commitForm(current => {
                    current.warehouseUniqueName = options[0].value;
                    current.warehouseName = options[0].label;
                });
            }
        });
    }

    /**
     * Creates an empty raw/finished stock line.
     *
     * @returns {JobWorkStockLine}
     * @memberof CreateJobWorkComponent
     */
    createEmptyStockLine(): JobWorkStockLine {
        return {
            stockUniqueName: '',
            variantUniqueName: '',
            quantity: 1,
            stockUnitCode: '',
            stockUnitUniqueName: '',
            rate: 0,
            amount: 0,
            batches: [],
            stocks: [],
            stocksPageNumber: 1,
            stocksTotalPages: 1,
            stocksQ: '',
            variants: [],
            unitsList: []
        };
    }

    /**
     * Creates an empty scrap line.
     *
     * @returns {JobWorkScrapLine}
     * @memberof CreateJobWorkComponent
     */
    createEmptyScrapLine(): JobWorkScrapLine {
        const form = this.form();
        return {
            stockUniqueName: '',
            quantity: 0,
            rate: 0,
            amount: 0,
            retainedBy: form.scrapRetainedBy,
            treatment: form.scrapTreatment,
            batches: [],
            stockUnitCode: '',
            stockUnitUniqueName: '',
            stocks: [],
            stocksPageNumber: 1,
            stocksTotalPages: 1,
            stocksQ: '',
            variants: [],
            unitsList: []
        };
    }

    /**
     * Creates an empty expense line.
     *
     * @returns {JobWorkExpenseLine}
     * @memberof CreateJobWorkComponent
     */
    createEmptyExpenseLine(): JobWorkExpenseLine {
        return {
            fromAccountUniqueName: '',
            toAccountUniqueName: '',
            tax: '',
            taxes: [],
            amount: 0,
            taxAmount: 0,
            fromAccountName: '',
            toAccountName: ''
        };
    }

    /**
     * Stores selected taxes from common-tax on an expense line.
     *
     * @param {JobWorkExpenseLine} expense
     * @param {Array<{ uniqueName?: string }>} taxes
     * @memberof CreateJobWorkComponent
     */
    onExpenseTaxesSelected(expense: JobWorkExpenseLine, taxes: Array<{ uniqueName?: string }>): void {
        const uniqueNames = (taxes || [])
            .map(tax => tax?.uniqueName)
            .filter((uniqueName): uniqueName is string => !!uniqueName);
        expense.taxes = uniqueNames;
        expense.tax = uniqueNames.join(',');
        this.touchForm();
    }

    /**
     * Stores calculated tax amount from common-tax on an expense line.
     *
     * @param {JobWorkExpenseLine} expense
     * @param {number} taxAmount
     * @memberof CreateJobWorkComponent
     */
    onExpenseTaxAmountChange(expense: JobWorkExpenseLine, taxAmount: number): void {
        expense.taxAmount = Number(taxAmount) || 0;
        this.touchForm();
    }

    /**
     * Adds a raw stock row.
     *
     * @memberof CreateJobWorkComponent
     */
    addRawStockRow(): void {
        const row = this.createEmptyStockLine();
        this.commitForm(current => {
            current.rawStocks = [...current.rawStocks, row];
        });
        this.getStocks(row, 1, '');
    }

    /**
     * Removes a raw stock row.
     *
     * @param {number} index
     * @memberof CreateJobWorkComponent
     */
    removeRawStockRow(index: number): void {
        let replacement: JobWorkStockLine | null = null;
        this.commitForm(current => {
            if (current.rawStocks.length === 1) {
                replacement = this.createEmptyStockLine();
                current.rawStocks = [replacement];
            } else {
                current.rawStocks = current.rawStocks.filter((_, rowIndex) => rowIndex !== index);
            }
        });
        if (replacement) {
            this.getStocks(replacement, 1, '');
        }
    }

    /**
     * Adds an expense row.
     *
     * @memberof CreateJobWorkComponent
     */
    addExpenseRow(): void {
        this.commitForm(current => {
            current.expenses = [...current.expenses, this.createEmptyExpenseLine()];
        });
    }

    /**
     * Removes an expense row.
     *
     * @param {number} index
     * @memberof CreateJobWorkComponent
     */
    removeExpenseRow(index: number): void {
        this.commitForm(current => {
            if (current.expenses.length === 1) {
                current.expenses = [this.createEmptyExpenseLine()];
            } else {
                current.expenses = current.expenses.filter((_, rowIndex) => rowIndex !== index);
            }
        });
    }

    /**
     * Adds a scrap row.
     *
     * @memberof CreateJobWorkComponent
     */
    addScrapRow(): void {
        const row = this.createEmptyScrapLine();
        this.commitForm(current => {
            current.scraps = [...current.scraps, row];
        });
        this.getStocks(row, 1, '');
    }

    /**
     * Removes a scrap row.
     *
     * @param {number} index
     * @memberof CreateJobWorkComponent
     */
    removeScrapRow(index: number): void {
        let replacement: JobWorkScrapLine | null = null;
        this.commitForm(current => {
            if (current.scraps.length === 1) {
                replacement = this.createEmptyScrapLine();
                current.scraps = [replacement];
            } else {
                current.scraps = current.scraps.filter((_, rowIndex) => rowIndex !== index);
            }
        });
        if (replacement) {
            this.getStocks(replacement, 1, '');
        }
    }

    /**
     * Searches stocks via stocks/v2 (same as Manufacturing).
     *
     * @param {(JobWorkStockLine | JobWorkScrapLine)} stockObject
     * @param {number} [page=1]
     * @param {string} [q]
     * @memberof CreateJobWorkComponent
     */
    getStocks(stockObject: JobWorkStockLine | JobWorkScrapLine, page: number = 1, q?: string): void {
        if (page > (stockObject.stocksTotalPages || 1) || this.stockSearchInFlight.has(stockObject) || q === undefined) {
            return;
        }
        this.stockSearchInFlight.add(stockObject);
        if (typeof q === 'string') {
            stockObject.stocksQ = q;
        } else if (stockObject.stocksQ) {
            q = stockObject.stocksQ;
        }
        stockObject.stocksPageNumber = page;
        this.inventoryService.getStocksV2({ inventoryType: '', page, q }).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: (response) => {
                if (response?.status === 'success' && response?.body?.results?.length) {
                    stockObject.stocksTotalPages = response.body.totalPages;
                    if (page === 1) {
                        stockObject.stocks = [];
                    }
                    response.body.results.forEach((stock: {
                        name?: string;
                        uniqueName?: string;
                        inventoryType?: string;
                        stockUnits?: Array<{ code: string; uniqueName: string }>;
                    }) => {
                        const unitsList = (stock?.stockUnits || []).map(unit => ({
                            label: unit.code,
                            value: unit.uniqueName
                        }));
                        stockObject.stocks = stockObject.stocks || [];
                        stockObject.stocks.push({
                            label: stock?.name,
                            value: stock?.uniqueName,
                            additional: {
                                stockUnitCode: unitsList[0]?.label || '',
                                stockUnitUniqueName: unitsList[0]?.value || '',
                                inventoryType: stock.inventoryType,
                                // Fresh array per stock so unit dropdown never shares another stock's list.
                                unitsList: unitsList.map(unit => ({ ...unit }))
                            }
                        });
                    });
                } else if (page === 1) {
                    stockObject.stocks = [];
                    stockObject.stocksTotalPages = 1;
                }
                this.ensureSelectedStockOption(stockObject);
                this.syncUnitsListFromStocks(stockObject);
                this.stockSearchInFlight.delete(stockObject);
                this.touchForm();
            },
            error: () => {
                this.stockSearchInFlight.delete(stockObject);
            }
        });
    }

    /**
     * Copies unitsList from the selected stock option onto the line.
     *
     * @private
     * @param {(JobWorkStockLine | JobWorkScrapLine)} stockObject
     * @memberof CreateJobWorkComponent
     */
    private syncUnitsListFromStocks(stockObject: JobWorkStockLine | JobWorkScrapLine): void {
        if (!stockObject.stockUniqueName) {
            return;
        }
        const selected = (stockObject.stocks || []).find(stock => stock.value === stockObject.stockUniqueName);
        const additional = selected?.additional as {
            unitsList?: Array<{ label: string; value: string }>;
            stockUnitCode?: string;
            stockUnitUniqueName?: string;
        } | undefined;
        if (!additional?.unitsList?.length) {
            return;
        }
        let unitsList = additional.unitsList.map(unit => ({
            label: unit.label,
            value: unit.value
        }));
        if (
            stockObject.stockUnitUniqueName
            && !unitsList.some(unit =>
                unit.value === stockObject.stockUnitUniqueName || unit.label === stockObject.stockUnitCode
            )
        ) {
            unitsList = [
                {
                    label: stockObject.stockUnitCode || stockObject.stockUnitUniqueName,
                    value: stockObject.stockUnitUniqueName
                },
                ...unitsList
            ];
        }
        stockObject.unitsList = unitsList;
        const matchedUnit = unitsList.find(unit =>
            unit.value === stockObject.stockUnitUniqueName || unit.label === stockObject.stockUnitCode
        );
        if (matchedUnit) {
            stockObject.stockUnitCode = matchedUnit.label;
            stockObject.stockUnitUniqueName = matchedUnit.value;
        }
        // Keep patched unit when search results do not include it.
    }

    /**
     * Keeps the currently selected stock in dropdown options after a search refresh.
     *
     * @private
     * @param {(JobWorkStockLine | JobWorkScrapLine)} stockObject
     * @memberof CreateJobWorkComponent
     */
    private ensureSelectedStockOption(stockObject: JobWorkStockLine | JobWorkScrapLine): void {
        if (!stockObject.stockUniqueName) {
            return;
        }
        stockObject.stocks = stockObject.stocks || [];
        if (stockObject.stocks.some(stock => stock.value === stockObject.stockUniqueName)) {
            return;
        }
        stockObject.stocks = [
            {
                label: stockObject.stockName || stockObject.stockUniqueName,
                value: stockObject.stockUniqueName,
                additional: {
                    stockUnitCode: stockObject.stockUnitCode || '',
                    stockUnitUniqueName: stockObject.stockUnitUniqueName || '',
                    unitsList: (stockObject.unitsList || []).map(unit => ({ ...unit }))
                }
            },
            ...stockObject.stocks
        ];
    }

    /**
     * Loads next stock page for a line.
     *
     * @param {(JobWorkStockLine | JobWorkScrapLine)} stockObject
     * @memberof CreateJobWorkComponent
     */
    stockScrollEnd(stockObject: JobWorkStockLine | JobWorkScrapLine): void {
        const nextPage = (stockObject.stocksPageNumber || 1) + 1;
        this.getStocks(stockObject, nextPage, stockObject.stocksQ || '');
    }

    /**
     * Handles finished stock selection.
     *
     * @param {IOption} event
     * @memberof CreateJobWorkComponent
     */
    onFinishedStockSelected(event: IOption): void {
        this.commitForm(current => {
            this.applyStockSelection(current.finishedStock, event);
        });
        this.loadVariants(this.form().finishedStock);
    }

    /**
     * Handles raw stock selection.
     *
     * @param {JobWorkStockLine} row
     * @param {IOption} event
     * @memberof CreateJobWorkComponent
     */
    onRawStockSelected(row: JobWorkStockLine, event: IOption): void {
        this.applyStockSelection(row, event);
        row.rate = 0;
        row.amount = 0;
        this.loadVariants(row, true);
        this.touchForm();
    }

    /**
     * Handles scrap stock selection.
     *
     * @param {JobWorkScrapLine} row
     * @param {IOption} event
     * @memberof CreateJobWorkComponent
     */
    onScrapStockSelected(row: JobWorkScrapLine, event: IOption): void {
        this.applyStockSelection(row, event);
        this.loadVariants(row);
        this.touchForm();
    }

    /**
     * Applies selected stock and rebuilds that stock's unit list only.
     *
     * @private
     * @param {(JobWorkStockLine | JobWorkScrapLine)} row
     * @param {IOption} event
     * @memberof CreateJobWorkComponent
     */
    private applyStockSelection(row: JobWorkStockLine | JobWorkScrapLine, event: IOption): void {
        const stockUniqueName = event?.value || '';
        // Always take units from this stock option only (never keep previous stock units).
        const selectedStock = (row.stocks || []).find(stock => stock.value === stockUniqueName);
        const additional = (selectedStock?.additional || event?.additional) as {
            stockUnitCode?: string;
            stockUnitUniqueName?: string;
            unitsList?: Array<{ label: string; value: string }>;
        } | undefined;
        const unitsList = (additional?.unitsList || []).map(unit => ({
            label: unit.label,
            value: unit.value
        }));
        row.stockUniqueName = stockUniqueName;
        row.stockName = event?.label || '';
        row.unitsList = unitsList;
        row.stockUnitCode = unitsList[0]?.label || '';
        row.stockUnitUniqueName = unitsList[0]?.value || '';
        row.variantUniqueName = '';
        row.variantName = '';
        row.batches = [];
    }

    /**
     * Handles unit selection on a stock/scrap line.
     *
     * @param {(JobWorkStockLine | JobWorkScrapLine)} row
     * @param {IOption} event
     * @param {boolean} [fetchRate=false]
     * @memberof CreateJobWorkComponent
     */
    onUnitSelected(row: JobWorkStockLine | JobWorkScrapLine, event: IOption, fetchRate: boolean = false): void {
        const selectedValue = event?.value || '';
        const matched = (row.unitsList || []).find(unit => unit.value === selectedValue);
        row.stockUnitUniqueName = matched?.value || selectedValue;
        row.stockUnitCode = matched?.label || event?.label || '';
        row.batches = [];
        if (fetchRate) {
            this.fetchRate(row as JobWorkStockLine);
        }
        this.touchForm();
    }

    /**
     * Loads variants for a stock line.
     *
     * @param {(JobWorkStockLine | JobWorkScrapLine)} row
     * @param {boolean} [fetchRate=false]
     * @memberof CreateJobWorkComponent
     */
    loadVariants(row: JobWorkStockLine | JobWorkScrapLine, fetchRate: boolean = false): void {
        if (!row.stockUniqueName) {
            return;
        }
        this.ledgerService.loadStockVariants(row.stockUniqueName).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((response: Array<{ name: string; uniqueName: string }> | unknown) => {
            const source = Array.isArray(response) ? response : [];
            const variants = source.map(variant => ({
                label: variant.name,
                value: variant.uniqueName
            }));
            row.variants = variants;
            const matched = variants.find(variant => variant.value === row.variantUniqueName);
            if (matched) {
                row.variantName = matched.label;
            } else if (variants.length === 1) {
                row.variantUniqueName = variants[0].value;
                row.variantName = variants[0].label;
            }
            if (fetchRate && row.variantUniqueName) {
                this.fetchRate(row as JobWorkStockLine);
            }
            this.touchForm();
        });
    }

    /**
     * Handles variant selection.
     *
     * @param {(JobWorkStockLine | JobWorkScrapLine)} row
     * @param {IOption} event
     * @param {boolean} [fetchRate=false]
     * @memberof CreateJobWorkComponent
     */
    onVariantSelected(row: JobWorkStockLine | JobWorkScrapLine, event: IOption, fetchRate: boolean = false): void {
        row.variantUniqueName = event?.value || '';
        row.variantName = event?.label || '';
        row.batches = [];
        if (fetchRate) {
            this.fetchRate(row as JobWorkStockLine);
        }
        this.touchForm();
    }

    /**
     * Normalizes batches for chip list / select dialog.
     *
     * @param {JobWorkStockLine['batches']} [batches]
     * @returns {VoucherSelectedBatch[]}
     * @memberof CreateJobWorkComponent
     */
    getJobWorkBatches(batches?: JobWorkStockLine['batches']): VoucherSelectedBatch[] {
        return (Array.isArray(batches) ? batches : []) as VoucherSelectedBatch[];
    }

    /**
     * Opens Select Batches for finished, raw, or scrap stock.
     *
     * @param {JobWorkBatchSource} source
     * @param {number} [index]
     * @param {Event} [event]
     * @memberof CreateJobWorkComponent
     */
    openBatchSelectDialog(source: JobWorkBatchSource, index?: number, event?: Event): void {
        event?.preventDefault();
        event?.stopPropagation();
        if (!this.batchTrackingEnabled() || this.isReadOnly()) {
            return;
        }

        const form = this.form();
        const warehouse = this.getJobWorkWarehouse();
        let stockUniqueName = '';
        let stockName = '';
        let variantUniqueName = '';
        let variantName = '';
        let hasVariants = false;
        let lineQuantity = 0;
        let selectedBatches: VoucherSelectedBatch[] = [];
        let unitCode = '';
        let inventoryType = 'PRODUCT';

        if (source === 'finished') {
            const finished = form.finishedStock;
            stockUniqueName = finished.stockUniqueName;
            stockName = finished.stockName || finished.stockUniqueName;
            variantUniqueName = finished.variantUniqueName || '';
            variantName = finished.variantName || '';
            hasVariants = (finished.variants?.length || 0) > 1;
            lineQuantity = Number(finished.quantity) || 0;
            selectedBatches = this.getJobWorkBatches(finished.batches);
            unitCode = finished.stockUnitCode || '';
            inventoryType = this.getStockInventoryType(finished);
        } else {
            const row = source === 'raw' ? form.rawStocks?.[index] : form.scraps?.[index];
            if (!row) {
                return;
            }
            stockUniqueName = row.stockUniqueName;
            stockName = row.stockName || row.stockUniqueName;
            variantUniqueName = row.variantUniqueName || '';
            variantName = row.variantName || '';
            hasVariants = (row.variants?.length || 0) > 1;
            lineQuantity = Number(row.quantity) || 0;
            selectedBatches = this.getJobWorkBatches(row.batches);
            unitCode = row.stockUnitCode || '';
            inventoryType = this.getStockInventoryType(row);
        }

        if (!stockUniqueName) {
            return;
        }
        if (hasVariants && !variantUniqueName) {
            this.toasterService.warningToast(this.localeData()['select_variant_first']);
            return;
        }

        this.dialog.open(BatchSelectDialogComponent, {
            ...ASIDE_PANE_CONFIG,
            data: {
                stockName,
                stockUniqueName,
                variantUniqueName,
                variantName,
                hasVariants,
                inventoryType,
                warehouseName: warehouse.name,
                warehouseUniqueName: warehouse.uniqueName,
                unitCode,
                lineQuantity,
                selectedBatches: cloneDeep(selectedBatches),
                localeData: this.localeData(),
                commonLocaleData: this.commonLocaleData(),
                isInbound: source === 'finished' || source === 'scrap'
            }
        }).afterClosed().pipe(take(1)).subscribe((result?: BatchSelectDialogResult) => {
            if (!result) {
                return;
            }
            this.commitForm(current => {
                if (source === 'finished') {
                    current.finishedStock.batches = result.batches ?? [];
                    if (result.overrideLineQuantity) {
                        current.finishedStock.quantity = result.allocatedQuantity;
                    }
                    return;
                }
                const row = source === 'raw' ? current.rawStocks?.[index] : current.scraps?.[index];
                if (!row) {
                    return;
                }
                row.batches = result.batches ?? [];
                if (result.overrideLineQuantity) {
                    row.quantity = result.allocatedQuantity;
                    row.amount = giddhRoundOff(
                        (Number(row.quantity) || 0) * (Number(row.rate) || 0),
                        this.giddhBalanceDecimalPlaces()
                    );
                }
            });
        });
    }

    /**
     * Warehouse selected on the form, or the first warehouse.
     *
     * @private
     * @returns {{ name: string; uniqueName: string }}
     * @memberof CreateJobWorkComponent
     */
    private getJobWorkWarehouse(): { name: string; uniqueName: string } {
        const form = this.form();
        const uniqueName = form.warehouseUniqueName || this.warehouses()?.[0]?.value || '';
        const selected = (this.warehouses() ?? []).find(warehouse => warehouse.value === uniqueName);
        return {
            name: selected?.label || form.warehouseName || this.warehouses()?.[0]?.label || '',
            uniqueName
        };
    }

    /**
     * Inventory type from stock option additional data.
     *
     * @private
     * @param {(JobWorkStockLine | JobWorkScrapLine)} row
     * @returns {string}
     * @memberof CreateJobWorkComponent
     */
    private getStockInventoryType(row: JobWorkStockLine | JobWorkScrapLine): string {
        const selected = (row.stocks || []).find(stock => stock.value === row.stockUniqueName);
        const inventoryType = selected?.additional?.['inventoryType'];
        return typeof inventoryType === 'string' && inventoryType ? inventoryType : 'PRODUCT';
    }

    /**
     * Payload batches: uniqueName + quantity only.
     *
     * @private
     * @param {JobWorkStockLine['batches']} [batches]
     * @returns {{ uniqueName: string; quantity: number }[]}
     * @memberof CreateJobWorkComponent
     */
    private mapBatchesForPayload(batches?: JobWorkStockLine['batches']): { uniqueName: string; quantity: number }[] {
        return (Array.isArray(batches) ? batches : [])
            .filter(batch => batch?.uniqueName && Number(batch.quantity) > 0)
            .map(batch => ({ uniqueName: batch.uniqueName, quantity: Number(batch.quantity) }));
    }

    /**
     * Fetches rate for a raw stock line.
     *
     * @param {JobWorkStockLine} row
     * @memberof CreateJobWorkComponent
     */
    fetchRate(row: JobWorkStockLine): void {
        if (!row.stockUniqueName) {
            return;
        }
        if (!row.stockUnitUniqueName && row.unitsList?.length) {
            row.stockUnitUniqueName = row.unitsList[0].value;
            row.stockUnitCode = row.unitsList[0].label;
        }
        const model = {
            stockUniqueName: row.stockUniqueName,
            quantity: row.quantity || 1,
            stockUnitUniqueName: row.stockUnitUniqueName || '',
            warehouseUniqueName: this.form().warehouseUniqueName,
            variant: { uniqueName: row.variantUniqueName || '' }
        };
        this.manufacturingService.getRateForStockV2(row.stockUniqueName, model).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((response) => {
            if (response?.status === 'success' && response?.body) {
                row.rate = Number((response.body as { rate?: number }).rate) || 0;
                if (!row.stockUnitUniqueName && row.unitsList?.length) {
                    row.stockUnitUniqueName = row.unitsList[0].value;
                    row.stockUnitCode = row.unitsList[0].label;
                }
                this.updateLineAmount(row);
            }
        });
    }

    /**
     * Recalculates a line amount from qty × rate.
     *
     * @param {{ quantity?: number; rate?: number; amount?: number }} row
     * @memberof CreateJobWorkComponent
     */
    updateLineAmount(row: { quantity?: number; rate?: number; amount?: number }): void {
        row.amount = giddhRoundOff(
            (Number(row.quantity) || 0) * (Number(row.rate) || 0),
            this.giddhBalanceDecimalPlaces()
        );
        this.touchForm();
    }

    /**
     * Searches jobworker accounts.
     *
     * @param {string} query
     * @param {number} [page=1]
     * @memberof CreateJobWorkComponent
     */
    searchJobworkers(query: string, page: number = 1): void {
        this.jobworkerQuery.set(query);
        this.jobworkerPage.set(page);
        this.searchService.searchAccountV2({
            q: encodeURIComponent(query || ''),
            page,
            group: encodeURIComponent('sundrycreditors')
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
            if (!data?.body?.results) {
                return;
            }
            const results = data.body.results.map((result: { uniqueName: string; name: string }) => ({
                value: result.uniqueName,
                label: `${result.name} (${result.uniqueName})`,
                additional: result
            }));
            const nextOptions = page === 1 ? results : [...this.jobworkerAccounts(), ...results];
            this.jobworkerAccounts.set(
                page === 1
                    ? this.ensureSelectedOption(
                        nextOptions,
                        this.form().accountUniqueName,
                        this.form().accountName
                    )
                    : nextOptions
            );
            this.jobworkerTotalPages.set(data.body.totalPages || 1);
        });
    }

    /**
     * Loads next jobworker page.
     *
     * @memberof CreateJobWorkComponent
     */
    jobworkerScrollEnd(): void {
        if (this.jobworkerPage() < this.jobworkerTotalPages()) {
            this.searchJobworkers(this.jobworkerQuery(), this.jobworkerPage() + 1);
        }
    }

    /**
     * Handles jobworker selection.
     *
     * @param {IOption} event
     * @memberof CreateJobWorkComponent
     */
    onJobworkerSelected(event: IOption): void {
        this.commitForm(current => {
            current.accountUniqueName = event?.value || '';
            current.accountName = event?.label || '';
            const additional = event?.additional as { gstIn?: string };
            if (additional?.gstIn) {
                current.gstin = additional.gstIn;
                current.jobworkerType = 'REGISTERED';
            }
        });
    }

    /**
     * Searches credit/liability accounts for expense from-side.
     *
     * @param {string} query
     * @param {number} [page=1]
     * @memberof CreateJobWorkComponent
     */
    searchFromAccounts(query: string, page: number = 1): void {
        this.searchService.searchAccountV2({
            q: encodeURIComponent(query || ''),
            page,
            group: encodeURIComponent('sundrycreditors,currentliabilities,noncurrentliabilities')
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
            if (!data?.body?.results) {
                return;
            }
            const results = data.body.results.map((result: { uniqueName: string; name: string }) => ({
                value: result.uniqueName,
                label: `${result.name} (${result.uniqueName})`
            }));
            const nextOptions = page === 1 ? results : [...this.fromAccounts(), ...results];
            this.fromAccounts.set(
                page === 1
                    ? this.ensureExpenseAccountOptions(nextOptions, 'from')
                    : nextOptions
            );
        });
    }

    /**
     * Searches expense accounts for expense to-side.
     *
     * @param {string} query
     * @param {number} [page=1]
     * @memberof CreateJobWorkComponent
     */
    searchToAccounts(query: string, page: number = 1): void {
        this.searchService.searchAccountV2({
            q: encodeURIComponent(query || ''),
            page,
            group: encodeURIComponent('operatingcost,indirectexpenses,revenuefromoperations,otherincome')
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
            if (!data?.body?.results) {
                return;
            }
            const results = data.body.results.map((result: { uniqueName: string; name: string }) => ({
                value: result.uniqueName,
                label: `${result.name} (${result.uniqueName})`
            }));
            const nextOptions = page === 1 ? results : [...this.toAccounts(), ...results];
            this.toAccounts.set(
                page === 1
                    ? this.ensureExpenseAccountOptions(nextOptions, 'to')
                    : nextOptions
            );
        });
    }

    /**
     * Handles warehouse selection.
     *
     * @param {IOption} event
     * @memberof CreateJobWorkComponent
     */
    onWarehouseSelected(event: IOption): void {
        this.commitForm(current => {
            current.warehouseUniqueName = event?.value || '';
            current.warehouseName = event?.label || '';
            current.finishedStock.batches = [];
            current.rawStocks.forEach(row => {
                row.batches = [];
            });
            current.scraps.forEach(row => {
                row.batches = [];
            });
        });
    }

    /**
     * Handles job work type change.
     *
     * @param {IOption} event
     * @memberof CreateJobWorkComponent
     */
    onJobWorkTypeSelected(event: IOption): void {
        this.commitForm(current => {
            current.jobWorkType = (event?.value as JobWorkFormModel['jobWorkType']) || 'SEND';
        });
    }

    /**
     * Locale HTML for expense info when asset value is not increased.
     *
     * @returns {string}
     * @memberof CreateJobWorkComponent
     */
    expenseNotCapitalizedMessage(): string {
        const locale = this.localeData();
        const toggleLabel = locale['increase_assets_value'] || locale['increase_value'] || '';
        return (locale['expense_not_capitalized_message'] || '').replace('[TOGGLE]', toggleLabel);
    }

    /**
     * Locale HTML when Claim ITC is on (GST stays off stock value).
     *
     * @returns {string}
     * @memberof CreateJobWorkComponent
     */
    claimItcMessage(): string {
        const locale = this.localeData();
        const totals = this.totals();
        return (locale['claim_itc_message'] || '')
            .replace('[TAX]', String(totals.taxAmount))
            .replace('[OUTPUT]', String(totals.outputWithoutTax))
            .replace('[OUTPUT_WITH_GST]', String(totals.outputWithTax));
    }

    /**
     * Locale HTML when jobworker is unregistered (no ITC).
     *
     * @returns {string}
     * @memberof CreateJobWorkComponent
     */
    unregisteredItcMessage(): string {
        const locale = this.localeData();
        return (locale['unregistered_itc_message'] || '').replace(
            '[TYPE]',
            locale['unregistered'] || 'Unregistered'
        );
    }

    /**
     * Syncs claim ITC when increase-asset-value toggle changes.
     *
     * @param {{ checked?: boolean }} event
     * @memberof CreateJobWorkComponent
     */
    onIncreaseAssetValueChange(event: { checked?: boolean }): void {
        this.commitForm(current => {
            current.increaseAssetValue = !!event?.checked;
            if (!current.increaseAssetValue) {
                current.claimItc = false;
            }
        });
    }

    /**
     * Handles jobworker type change.
     *
     * @param {IOption} event
     * @memberof CreateJobWorkComponent
     */
    onJobworkerTypeChange(event: IOption): void {
        this.commitForm(current => {
            current.jobworkerType = (event?.value as JobworkerType) || 'REGISTERED';
            if (current.jobworkerType === 'UNREGISTERED') {
                current.claimItc = false;
                current.expenses.forEach(expense => {
                    expense.tax = '';
                    expense.taxes = [];
                    expense.taxAmount = 0;
                });
            }
        });
    }

    /**
     * Updates scrap retained-by and syncs scrap lines.
     *
     * @param {IOption} event
     * @memberof CreateJobWorkComponent
     */
    onScrapRetainedByChange(event: IOption): void {
        this.commitForm(current => {
            current.scrapRetainedBy = (event?.value as ScrapRetainedBy) || 'JOBWORKER';
            current.scraps.forEach(scrap => {
                scrap.retainedBy = current.scrapRetainedBy;
                scrap.treatment = current.scrapTreatment;
            });
        });
    }

    /**
     * Updates scrap treatment and syncs scrap lines.
     *
     * @param {IOption} event
     * @memberof CreateJobWorkComponent
     */
    onScrapTreatmentChange(event: IOption): void {
        this.commitForm(current => {
            current.scrapTreatment = (event?.value as ScrapTreatment) || 'REDUCE_FROM_JOB_WORK_COST';
            current.scraps.forEach(scrap => {
                scrap.retainedBy = current.scrapRetainedBy;
                scrap.treatment = current.scrapTreatment;
            });
        });
    }

    /**
     * Syncs scrap root meta onto scrap lines.
     *
     * @memberof CreateJobWorkComponent
     */
    onScrapMetaChange(): void {
        this.commitForm(current => {
            current.scraps.forEach(scrap => {
                scrap.retainedBy = current.scrapRetainedBy;
                scrap.treatment = current.scrapTreatment;
            });
        });
    }

    /**
     * Clears the form while keeping warehouse/date.
     *
     * @memberof CreateJobWorkComponent
     */
    clearForm(): void {
        const previous = this.form();
        const next = new JobWorkFormModel();
        next.warehouseUniqueName = previous.warehouseUniqueName;
        next.warehouseName = previous.warehouseName;
        next.date = previous.date;
        next.challanDate = previous.date;
        next.expectedReturnDate = dayjs(previous.date, GIDDH_DATE_FORMAT).add(30, 'day').format(GIDDH_DATE_FORMAT);
        this.form.set(next);
        this.addRawStockRow();
        this.addExpenseRow();
        this.addScrapRow();
        this.getStocks(this.form().finishedStock, 1, '');
        this.touchForm();
    }

    /**
     * Validates GSTIN against company onboarding tax regex.
     *
     * @param {string} [value]
     * @memberof CreateJobWorkComponent
     */
    checkGstinValidation(value?: string): void {
        const gstin = (value ?? this.form().gstin)?.toString().trim() || '';
        this.commitForm(current => {
            current.gstin = gstin;
        });
        if (!gstin) {
            this.isGstValid.set(true);
            return;
        }

        const taxField = this.taxFormFields['taxName'];
        const regexList = taxField?.regex;
        if (
            !(Array.isArray(regexList) && regexList.length > 0)
            && !(typeof regexList === 'string' && regexList)
        ) {
            // Do not treat missing tax config as a pass for a filled GSTIN.
            this.isGstValid.set(false);
            this.toasterService.errorToast(
                this.commonLocaleData()?.['app_invalid_tax_name']?.replace('[TAX_NAME]', 'GSTIN')
                || 'Invalid GSTIN'
            );
            return;
        }

        const isValid = Array.isArray(regexList)
            ? regexList.some(pattern => !!pattern && new RegExp(pattern).test(gstin))
            : new RegExp(regexList).test(gstin);

        this.isGstValid.set(isValid);
        if (!isValid) {
            const message = (this.commonLocaleData()?.['app_invalid_tax_name'] || 'Invalid [TAX_NAME]')
                .replace('[TAX_NAME]', taxField?.label || this.commonLocaleData()?.['app_gstin'] || 'GSTIN');
            this.toasterService.errorToast(message);
        }
    }

    /**
     * Validates required create/update fields.
     *
     * @returns {boolean}
     * @memberof CreateJobWorkComponent
     */
    validate(): boolean {
        const form = this.form();
        const locale = this.localeData();
        const common = this.commonLocaleData();
        if (!form.date) {
            this.toasterService.errorToast(common['app_date'] ? `${common['app_date']} is required` : 'Date is required');
            return false;
        }
        if (!form.warehouseUniqueName) {
            this.toasterService.errorToast(common['app_select_warehouse'] || 'Select Warehouse');
            return false;
        }
        if (!form.finishedStock.stockUniqueName) {
            this.toasterService.errorToast(locale['select_finished_stock']);
            return false;
        }
        if (!form.finishedStock.quantity) {
            this.toasterService.errorToast(locale['enter_output_quantity']);
            return false;
        }
        if (!form.accountUniqueName) {
            this.toasterService.errorToast(locale['select_jobworker_required']);
            return false;
        }
        if (form.jobworkerType === 'REGISTERED' && !form.gstin?.trim()) {
            this.toasterService.errorToast(locale['gstin_required']);
            return false;
        }
        if (form.gstin?.trim()) {
            this.checkGstinValidation(form.gstin);
            if (!this.isGstValid()) {
                return false;
            }
        }
        if (!form.rawStocks.some(row => row.stockUniqueName && row.quantity)) {
            this.toasterService.errorToast(locale['add_raw_stock']);
            return false;
        }
        return true;
    }

    /**
     * Loads country tax field config used for GSTIN regex validation.
     *
     * @private
     * @param {string} countryCode
     * @memberof CreateJobWorkComponent
     */
    private loadTaxFormFields(countryCode: string): void {
        if (!countryCode || this.taxFormCountryCode === countryCode) {
            return;
        }
        this.taxFormCountryCode = countryCode;
        const request = new OnboardingFormRequest();
        request.formName = '';
        request.country = countryCode;
        this.store.dispatch(this.commonActions.GetOnboardingForm(request));
    }

    /**
     * Builds API request body from the form signal.
     *
     * @returns {JobWorkOrderRequest}
     * @memberof CreateJobWorkComponent
     */
    buildRequest(): JobWorkOrderRequest {
        const form = this.form();
        return {
            jobWorkType: form.jobWorkType,
            date: this.formatDate(form.date),
            warehouseUniqueName: form.warehouseUniqueName,
            accountUniqueName: form.accountUniqueName,
            jobworkerType: form.jobworkerType,
            gstin: form.gstin || '',
            deliveryChallanUniqueName: form.deliveryChallanUniqueName || '',
            challanDate: this.formatDate(form.challanDate),
            expectedReturnDate: this.formatDate(form.expectedReturnDate),
            process: form.process || '',
            contactPerson: form.contactPerson || '',
            mobile: form.mobile || '',
            isCapitalGoods: !!form.isCapitalGoods,
            alertEnabled: !!form.alertEnabled,
            alertBeforeDays: Number(form.alertBeforeDays) || 15,
            increaseAssetValue: !!form.increaseAssetValue,
            claimItc: !!form.claimItc,
            scrapRetainedBy: form.scrapRetainedBy,
            scrapTreatment: form.scrapTreatment,
            finishedStock: {
                stockUniqueName: form.finishedStock.stockUniqueName,
                variantUniqueName: form.finishedStock.variantUniqueName || '',
                quantity: Number(form.finishedStock.quantity) || 0,
                stockUnitCode: form.finishedStock.stockUnitCode || '',
                stockUnitUniqueName: form.finishedStock.stockUnitUniqueName || '',
                batches: this.mapBatchesForPayload(form.finishedStock.batches)
            },
            rawStocks: form.rawStocks
                .filter(row => row.stockUniqueName)
                .map(row => ({
                    stockUniqueName: row.stockUniqueName,
                    variantUniqueName: row.variantUniqueName || '',
                    quantity: Number(row.quantity) || 0,
                    stockUnitCode: row.stockUnitCode || '',
                    stockUnitUniqueName: row.stockUnitUniqueName || '',
                    rate: Number(row.rate) || 0,
                    amount: Number(row.amount) || 0,
                    batches: this.mapBatchesForPayload(row.batches)
                })),
            expenses: form.expenses
                .filter(row => row.fromAccountUniqueName && row.toAccountUniqueName && row.amount)
                .map(row => ({
                    fromAccountUniqueName: row.fromAccountUniqueName,
                    toAccountUniqueName: row.toAccountUniqueName,
                    tax: row.tax || '',
                    amount: Number(row.amount) || 0,
                    taxAmount: Number(row.taxAmount) || 0
                })),
            scraps: form.scraps
                .filter(row => row.stockUniqueName && row.quantity)
                .map(row => ({
                    stockUniqueName: row.stockUniqueName,
                    variantUniqueName: row.variantUniqueName || '',
                    quantity: Number(row.quantity) || 0,
                    stockUnitCode: row.stockUnitCode || '',
                    stockUnitUniqueName: row.stockUnitUniqueName || '',
                    rate: Number(row.rate) || 0,
                    amount: Number(row.amount) || 0,
                    retainedBy: (row.retainedBy || form.scrapRetainedBy) as ScrapRetainedBy,
                    treatment: (row.treatment || form.scrapTreatment) as ScrapTreatment,
                    batches: this.mapBatchesForPayload(row.batches)
                }))
        };
    }

    /**
     * Returns to the Job Work list without changing stored list filters.
     *
     * @memberof CreateJobWorkComponent
     */
    goBackToList(): void {
        this.router.navigate(['/pages/inventory/v2/job-work/list']);
    }

    /**
     * Creates or updates the job work order.
     *
     * @memberof CreateJobWorkComponent
     */
    save(): void {
        if (this.isReadOnly() || this.isLoading() || !this.validate()) {
            return;
        }
        const request = this.buildRequest();
        const uniqueName = this.orderUniqueName();
        this.isLoading.set(true);
        const request$ = uniqueName
            ? this.jobWorkService.update(uniqueName, request)
            : this.jobWorkService.create(request);
        request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (response) => {
                this.isLoading.set(false);
                if (response?.status === 'success') {
                    const locale = this.localeData();
                    this.toasterService.successToast(
                        uniqueName ? locale['job_work_updated'] : locale['job_work_saved']
                    );
                    this.router.navigate(['/pages/inventory/v2/job-work/list']);
                    return;
                }
                this.toasterService.errorToast(response?.message || response?.body?.message);
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    /**
     * Loads an existing order for edit.
     *
     * @param {string} uniqueName
     * @memberof CreateJobWorkComponent
     */
    getDetails(uniqueName: string): void {
        this.isLoadingDetails.set(true);
        this.jobWorkService.get(uniqueName).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (response) => {
                this.isLoadingDetails.set(false);
                if (response?.status === 'success' && response?.body) {
                    this.patchForm(response.body);
                    return;
                }
                this.toasterService.errorToast(response?.message);
            },
            error: () => {
                this.isLoadingDetails.set(false);
            }
        });
    }

    /**
     * Patches the form signal from GET job-work-order body
     * (`documentItems` + `jobWorkDetails` + nested warehouse/account).
     *
     * @param {Record<string, unknown>} body
     * @memberof CreateJobWorkComponent
     */
    patchForm(body: Record<string, unknown>): void {
        const next = new JobWorkFormModel();
        const details = (body['jobWorkDetails'] || {}) as Record<string, unknown>;
        const account = (body['account'] || body['jobworker']) as { uniqueName?: string; name?: string } | undefined;
        const warehouse = body['warehouse'] as { uniqueName?: string; name?: string } | undefined;
        const linkedChallans = body['linkedChallans'] as Array<{ uniqueName?: string }> | undefined;
        const documentItems = (body['documentItems'] as Array<Record<string, unknown>>) || [];
        const outputItem = documentItems.find(item => item['lineRole'] === 'OUTPUT');
        const inputItems = documentItems.filter(item => item['lineRole'] === 'INPUT');
        const scrapItems = documentItems.filter(item => item['lineRole'] === 'SCRAP');
        const detailScraps = (details['scraps'] as Array<Record<string, unknown>>) || [];
        const detailExpenses = (details['expenses'] as Array<Record<string, unknown>>) || [];
        const documentDate = (body['documentDate'] as string) || (body['date'] as string) || '';

        next.jobWorkType = (details['jobWorkType'] as JobWorkFormModel['jobWorkType'])
            || (body['jobWorkType'] as JobWorkFormModel['jobWorkType'])
            || 'SEND';
        next.date = this.formatDate(documentDate);
        next.warehouseUniqueName = warehouse?.uniqueName
            || (body['warehouseUniqueName'] as string)
            || '';
        next.warehouseName = warehouse?.name
            || (body['warehouseName'] as string)
            || this.form().warehouseName;
        next.accountUniqueName = account?.uniqueName
            || (body['accountUniqueName'] as string)
            || '';
        const accountName = account?.name
            || (body['accountName'] as string)
            || '';
        next.accountName = next.accountUniqueName
            ? (accountName
                ? `${accountName} (${next.accountUniqueName})`
                : next.accountUniqueName)
            : '';
        next.jobworkerType = (details['jobworkerType'] as JobworkerType)
            || (body['jobworkerType'] as JobworkerType)
            || 'REGISTERED';
        next.gstin = (details['gstin'] as string) || (body['gstin'] as string) || '';
        next.deliveryChallanUniqueName =
            (details['deliveryChallanUniqueName'] as string)
            || (body['deliveryChallanUniqueName'] as string)
            || linkedChallans?.[0]?.uniqueName
            || '';
        next.challanDate = this.formatDate(
            (details['challanDate'] as string) || (body['challanDate'] as string) || documentDate
        );
        next.expectedReturnDate = this.formatDate(
            (details['expectedReturnDate'] as string) || (body['expectedReturnDate'] as string) || ''
        );
        next.process = (details['process'] as string) || (body['process'] as string) || '';
        next.contactPerson = (details['contactPerson'] as string) || (body['contactPerson'] as string) || '';
        next.mobile = (details['mobile'] as string) || (body['mobile'] as string) || '';
        next.isCapitalGoods = !!(details['isCapitalGoods'] ?? body['isCapitalGoods']);
        next.alertEnabled = (details['alertEnabled'] ?? body['alertEnabled']) !== false;
        const alertBeforeDays = details['alertBeforeDays'] ?? body['alertBeforeDays'];
        next.alertBeforeDays = alertBeforeDays === 0 || alertBeforeDays === '0'
            ? 0
            : (Number(alertBeforeDays) || 15);
        next.increaseAssetValue = (details['increaseAssetValue'] ?? body['increaseAssetValue']) !== false;
        const claimItcValue = details['claimItc'] ?? body['claimItc'];
        next.claimItc = claimItcValue === undefined || claimItcValue === null
            ? next.increaseAssetValue
            : !!claimItcValue;
        next.scrapRetainedBy = (details['scrapRetainedBy'] as ScrapRetainedBy)
            || (body['scrapRetainedBy'] as ScrapRetainedBy)
            || 'JOBWORKER';
        next.scrapTreatment = (details['scrapTreatment'] as ScrapTreatment)
            || (body['scrapTreatment'] as ScrapTreatment)
            || 'REDUCE_FROM_JOB_WORK_COST';

        next.finishedStock = outputItem
            ? this.mapDocumentItemToStockLine(outputItem)
            : this.mapLegacyFinishedStock((body['finishedStock'] || {}) as Record<string, unknown>);

        next.rawStocks = inputItems.length
            ? inputItems.map(item => this.mapDocumentItemToStockLine(item))
            : this.mapLegacyRawStocks((body['rawStocks'] as Array<Record<string, unknown>>) || []);

        next.expenses = detailExpenses.length
            ? detailExpenses.map(row => this.mapExpenseRow(row))
            : ((body['expenses'] as Array<Record<string, unknown>>) || []).map(row => this.mapExpenseRow(row));

        if (scrapItems.length) {
            next.scraps = scrapItems.map(item =>
                this.mapDocumentItemToScrapLine(item, next, detailScraps)
            );
        } else if (detailScraps.length) {
            next.scraps = detailScraps.map(row => this.mapDetailScrapToScrapLine(row, next));
        } else {
            next.scraps = ((body['scraps'] as Array<Record<string, unknown>>) || []).map(row =>
                this.mapDetailScrapToScrapLine(row, next)
            );
        }

        this.form.set(next);

        if (next.accountUniqueName) {
            this.jobworkerAccounts.set(
                this.ensureSelectedOption(
                    this.jobworkerAccounts(),
                    next.accountUniqueName,
                    next.accountName,
                    account
                )
            );
        }

        this.fromAccounts.set(this.ensureExpenseAccountOptions(this.fromAccounts(), 'from'));
        this.toAccounts.set(this.ensureExpenseAccountOptions(this.toAccounts(), 'to'));

        this.getStocks(next.finishedStock, 1, next.finishedStock.stockName || '');
        if (next.finishedStock.stockUniqueName) {
            this.loadVariants(next.finishedStock);
        }
        if (!next.rawStocks.length) {
            this.addRawStockRow();
        } else {
            next.rawStocks.forEach(row => {
                this.getStocks(row, 1, row.stockName || '');
                if (row.stockUniqueName) {
                    this.loadVariants(row);
                }
            });
        }
        if (!next.expenses.length) {
            this.addExpenseRow();
        }
        if (!next.scraps.length) {
            this.addScrapRow();
        } else {
            next.scraps.forEach(row => {
                this.getStocks(row, 1, row.stockName || '');
                if (row.stockUniqueName) {
                    this.loadVariants(row);
                }
            });
        }
        this.touchForm();
    }

    /**
     * Ensures a selected account remains in dropdown options after search refresh.
     *
     * @private
     * @param {IOption[]} options
     * @param {string} value
     * @param {string} label
     * @param {unknown} [additional]
     * @returns {IOption[]}
     * @memberof CreateJobWorkComponent
     */
    private ensureSelectedOption(
        options: IOption[],
        value: string,
        label: string,
        additional?: unknown
    ): IOption[] {
        if (!value) {
            return options;
        }
        if (options.some(option => option.value === value)) {
            return options;
        }
        return [
            {
                value,
                label: label || value,
                additional
            },
            ...options
        ];
    }

    /**
     * Keeps patched expense from/to accounts visible in dropdown options.
     *
     * @private
     * @param {IOption[]} options
     * @param {'from' | 'to'} side
     * @returns {IOption[]}
     * @memberof CreateJobWorkComponent
     */
    private ensureExpenseAccountOptions(options: IOption[], side: 'from' | 'to'): IOption[] {
        let next = [...options];
        this.form().expenses.forEach(expense => {
            const value = side === 'from' ? expense.fromAccountUniqueName : expense.toAccountUniqueName;
            const label = side === 'from' ? expense.fromAccountName : expense.toAccountName;
            next = this.ensureSelectedOption(next, value, label || value);
        });
        return next;
    }

    /**
     * Maps a GET `documentItems` row into a stock line with seeded dropdown options.
     *
     * @private
     * @param {Record<string, unknown>} item
     * @returns {JobWorkStockLine}
     * @memberof CreateJobWorkComponent
     */
    private mapDocumentItemToStockLine(item: Record<string, unknown>): JobWorkStockLine {
        const stock = item['stock'] as { uniqueName?: string; name?: string } | undefined;
        const variant = item['variant'] as { uniqueName?: string; name?: string } | undefined;
        const stockUnit = item['stockUnit'] as { uniqueName?: string; name?: string; code?: string } | undefined;
        const stockUniqueName = stock?.uniqueName || (item['stockUniqueName'] as string) || '';
        const stockName = stock?.name || (item['stockName'] as string) || '';
        const variantUniqueName = variant?.uniqueName || (item['variantUniqueName'] as string) || '';
        const variantName = variant?.name || (item['variantName'] as string) || '';
        const stockUnitUniqueName = stockUnit?.uniqueName || (item['stockUnitUniqueName'] as string) || '';
        const stockUnitCode = stockUnit?.code || stockUnit?.name || (item['stockUnitCode'] as string) || '';
        const unitsList = stockUnitUniqueName
            ? [{ label: stockUnitCode || stockUnitUniqueName, value: stockUnitUniqueName }]
            : [];
        const stocks = stockUniqueName
            ? [{
                label: stockName || stockUniqueName,
                value: stockUniqueName,
                additional: {
                    stockUnitCode,
                    stockUnitUniqueName,
                    unitsList: unitsList.map(unit => ({ ...unit }))
                }
            }]
            : [];
        const variants = variantUniqueName
            ? [{ label: variantName || variantUniqueName, value: variantUniqueName }]
            : [];

        return {
            ...this.createEmptyStockLine(),
            stockUniqueName,
            stockName,
            variantUniqueName,
            variantName,
            quantity: Number(item['quantity']) || 0,
            rate: Number(item['rate']) || 0,
            amount: Number(item['amount']) || 0,
            stockUnitCode,
            stockUnitUniqueName,
            batches: this.mapApiBatches(item['batches']),
            stocks,
            variants,
            unitsList
        };
    }

    /**
     * Maps a GET scrap `documentItems` row into a scrap line.
     * Prefers rate/amount/retainedBy/treatment from matching `jobWorkDetails.scraps`
     * when document item values are missing or zero.
     *
     * @private
     * @param {Record<string, unknown>} item
     * @param {JobWorkFormModel} form
     * @param {Array<Record<string, unknown>>} [detailScraps=[]]
     * @returns {JobWorkScrapLine}
     * @memberof CreateJobWorkComponent
     */
    private mapDocumentItemToScrapLine(
        item: Record<string, unknown>,
        form: JobWorkFormModel,
        detailScraps: Array<Record<string, unknown>> = []
    ): JobWorkScrapLine {
        const stockLine = this.mapDocumentItemToStockLine(item);
        const detailScrap = detailScraps.find(row => {
            const stockUniqueName = (row['stockUniqueName'] as string) || '';
            const variantUniqueName = (row['variantUniqueName'] as string) || '';
            if (stockUniqueName !== stockLine.stockUniqueName) {
                return false;
            }
            if (variantUniqueName && stockLine.variantUniqueName) {
                return variantUniqueName === stockLine.variantUniqueName;
            }
            return !variantUniqueName && !stockLine.variantUniqueName;
        });
        const detailRate = Number(detailScrap?.['rate']);
        const detailAmount = Number(detailScrap?.['amount']);
        const rate = stockLine.rate || detailRate || 0;
        const amount = stockLine.amount || detailAmount || (rate && stockLine.quantity ? rate * stockLine.quantity : 0);
        return {
            ...this.createEmptyScrapLine(),
            stockUniqueName: stockLine.stockUniqueName,
            stockName: stockLine.stockName,
            variantUniqueName: stockLine.variantUniqueName,
            variantName: stockLine.variantName,
            quantity: stockLine.quantity,
            rate,
            amount,
            stockUnitCode: stockLine.stockUnitCode || (detailScrap?.['stockUnitCode'] as string) || '',
            stockUnitUniqueName: stockLine.stockUnitUniqueName,
            retainedBy: (item['retainedBy'] as ScrapRetainedBy)
                || (detailScrap?.['retainedBy'] as ScrapRetainedBy)
                || form.scrapRetainedBy,
            treatment: (item['treatment'] as ScrapTreatment)
                || (detailScrap?.['treatment'] as ScrapTreatment)
                || form.scrapTreatment,
            batches: stockLine.batches,
            stocks: stockLine.stocks,
            variants: stockLine.variants,
            unitsList: stockLine.unitsList
        };
    }

    /**
     * Maps flat scrap rows from `jobWorkDetails.scraps`.
     *
     * @private
     * @param {Record<string, unknown>} row
     * @param {JobWorkFormModel} form
     * @returns {JobWorkScrapLine}
     * @memberof CreateJobWorkComponent
     */
    private mapDetailScrapToScrapLine(row: Record<string, unknown>, form: JobWorkFormModel): JobWorkScrapLine {
        const stockUniqueName = (row['stockUniqueName'] as string) || '';
        const stockName = (row['stockName'] as string) || (row['name'] as string) || stockUniqueName;
        const variantUniqueName = (row['variantUniqueName'] as string) || '';
        const stockUnitCode = (row['stockUnitCode'] as string) || '';
        const stockUnitUniqueName = (row['stockUnitUniqueName'] as string) || '';
        const unitsList = stockUnitUniqueName || stockUnitCode
            ? [{ label: stockUnitCode || stockUnitUniqueName, value: stockUnitUniqueName || stockUnitCode }]
            : [];
        return {
            ...this.createEmptyScrapLine(),
            stockUniqueName,
            stockName,
            variantUniqueName,
            quantity: Number(row['quantity']) || 0,
            rate: Number(row['rate']) || 0,
            amount: Number(row['amount']) || 0,
            stockUnitCode,
            stockUnitUniqueName,
            retainedBy: (row['retainedBy'] as ScrapRetainedBy) || form.scrapRetainedBy,
            treatment: (row['treatment'] as ScrapTreatment) || form.scrapTreatment,
            batches: this.mapApiBatches(row['batches']),
            stocks: stockUniqueName
                ? [{
                    label: stockName,
                    value: stockUniqueName,
                    additional: {
                        stockUnitCode,
                        stockUnitUniqueName,
                        unitsList: unitsList.map(unit => ({ ...unit }))
                    }
                }]
                : [],
            variants: variantUniqueName
                ? [{ label: variantUniqueName, value: variantUniqueName }]
                : [],
            unitsList
        };
    }

    /**
     * Maps expense rows from API.
     *
     * @private
     * @param {Record<string, unknown>} row
     * @returns {JobWorkExpenseLine}
     * @memberof CreateJobWorkComponent
     */
    private mapExpenseRow(row: Record<string, unknown>): JobWorkExpenseLine {
        const tax = (row['tax'] as string) || '';
        const taxesFromApi = row['taxes'] as string[] | undefined;
        const fromAccount = row['fromAccount'] as { uniqueName?: string; name?: string } | undefined;
        const toAccount = row['toAccount'] as { uniqueName?: string; name?: string } | undefined;
        const fromAccountUniqueName = fromAccount?.uniqueName
            || (row['fromAccountUniqueName'] as string)
            || '';
        const toAccountUniqueName = toAccount?.uniqueName
            || (row['toAccountUniqueName'] as string)
            || '';
        const fromAccountName = (row['fromAccountName'] as string)
            || fromAccount?.name
            || fromAccountUniqueName;
        const toAccountName = (row['toAccountName'] as string)
            || toAccount?.name
            || toAccountUniqueName;
        return {
            fromAccountUniqueName,
            toAccountUniqueName,
            tax,
            taxes: Array.isArray(taxesFromApi)
                ? taxesFromApi
                : (tax ? tax.split(',').map(value => value.trim()).filter(Boolean) : []),
            amount: Number(row['amount']) || 0,
            taxAmount: Number(row['taxAmount']) || 0,
            fromAccountName: fromAccountUniqueName && fromAccountName && fromAccountName !== fromAccountUniqueName
                ? `${fromAccountName} (${fromAccountUniqueName})`
                : fromAccountName,
            toAccountName: toAccountUniqueName && toAccountName && toAccountName !== toAccountUniqueName
                ? `${toAccountName} (${toAccountUniqueName})`
                : toAccountName
        };
    }

    /**
     * Maps API batch arrays into form batch lines.
     *
     * @private
     * @param {unknown} batches
     * @returns {JobWorkBatch[]}
     * @memberof CreateJobWorkComponent
     */
    private mapApiBatches(batches: unknown): JobWorkBatch[] {
        if (!Array.isArray(batches)) {
            return [];
        }
        return batches.map((batch: Record<string, unknown>) => ({
            uniqueName: (batch['uniqueName'] as string) || '',
            name: (batch['name'] as string) || '',
            quantity: Number(batch['quantity']) || 0
        }));
    }

    /**
     * Legacy flat finishedStock shape fallback.
     *
     * @private
     * @param {Record<string, unknown>} finished
     * @returns {JobWorkStockLine}
     * @memberof CreateJobWorkComponent
     */
    private mapLegacyFinishedStock(finished: Record<string, unknown>): JobWorkStockLine {
        const finishedVariant = finished['variant'] as { uniqueName?: string; name?: string } | undefined;
        return {
            ...this.createEmptyStockLine(),
            stockUniqueName: (finished['stockUniqueName'] as string) || '',
            stockName: (finished['stockName'] as string) || (finished['name'] as string) || '',
            variantUniqueName: (finished['variantUniqueName'] as string) || finishedVariant?.uniqueName || '',
            variantName: (finished['variantName'] as string) || finishedVariant?.name || '',
            quantity: Number(finished['quantity']) || 1,
            stockUnitCode: (finished['stockUnitCode'] as string) || '',
            batches: this.mapApiBatches(finished['batches'])
        };
    }

    /**
     * Legacy flat rawStocks shape fallback.
     *
     * @private
     * @param {Array<Record<string, unknown>>} rows
     * @returns {JobWorkStockLine[]}
     * @memberof CreateJobWorkComponent
     */
    private mapLegacyRawStocks(rows: Array<Record<string, unknown>>): JobWorkStockLine[] {
        return rows.map(row => {
            const variant = row['variant'] as { uniqueName?: string; name?: string } | undefined;
            return {
                ...this.createEmptyStockLine(),
                stockUniqueName: (row['stockUniqueName'] as string) || '',
                stockName: (row['stockName'] as string) || (row['name'] as string) || '',
                variantUniqueName: (row['variantUniqueName'] as string) || variant?.uniqueName || '',
                variantName: (row['variantName'] as string) || variant?.name || '',
                quantity: Number(row['quantity']) || 0,
                stockUnitCode: (row['stockUnitCode'] as string) || '',
                rate: Number(row['rate']) || 0,
                amount: Number(row['amount']) || 0,
                batches: this.mapApiBatches(row['batches'])
            };
        });
    }

    /**
     * Formats a date value as dd-MM-yyyy.
     *
     * @param {(string | Date)} value
     * @returns {string}
     * @memberof CreateJobWorkComponent
     */
    formatDate(value: string | Date): string {
        if (!value) {
            return '';
        }
        if (typeof value === 'string' && value.includes('-') && value.length === 10 && value.indexOf('-') === 2) {
            return value;
        }
        return dayjs(value).format(GIDDH_DATE_FORMAT);
    }
}

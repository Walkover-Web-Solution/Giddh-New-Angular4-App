import { Component, OnDestroy, OnInit, ChangeDetectorRef, NgZone, ChangeDetectionStrategy, signal, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { FormControl } from '@angular/forms';
import { Angular21ChangeDetectionService } from '../services/angular21-change-detection.service';
import { NewVsOldInvoicesRequest, NewVsOldInvoicesResponse } from '../models/api-models/new-vs-old-invoices';
import { AppState } from '../store';
import { Store, select } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { ToasterService } from '../services/toaster.service';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { SettingsFinancialYearActions } from '../actions/settings/financial-year/financial-year.action';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { NewVsOldInvoicesService } from '../services/new-vs-old-invoices.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SalesBifurcationDetailsComponent } from './sales-bifurcation-details/sales-bifurcation-details.component';
import { ASIDE_PANE_CONFIG, GetBifurcationType, IOption } from '../app.constant';
import { GeneralService } from '../services/general.service';
import { find, slice } from '../lodash-optimized';
import { SalesPersonComponentStore } from '../shared/sales-person/utility/sales-person.store';
import { SalesPersonService } from '../shared/sales-person/utility/sales-person.service';
import { SalesByPersonResponse, SalesByPersonRow, SbpDataType, SbpSubType } from './sales-by-person/sales-by-person.models';


@Component({
    selector: 'new-vs-old-invoices',
    templateUrl: './new-vs-old-Invoices.component.html',
    styleUrls: [`./new-vs-old-Invoices.component.scss`],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [SalesPersonComponentStore, SalesPersonService]
})

export class NewVsOldInvoicesComponent implements OnInit, OnDestroy {
    public GetTypeOptions: IOption[] = [];
    public selectedType: string = "month";
    public monthOptions: IOption[] = [];
    public selectedmonth: string;
    public quaterOptions: IOption[] = [];
    public selectedQuater: string = '';
    public newVsOldInvoicesData: NewVsOldInvoicesResponse;
    public yearOptions: IOption[] = [];
    public selectedYear: string;
    public NewVsOldInvoicesQueryRequest: NewVsOldInvoicesRequest;
    public columnName: string = '';
    public newSalesClientTotal: number = 0;
    public totalSalesClientTotal: number = 0;
    public newSalesAmount: number = 0;
    public totalSalesAmount: number = 0;
    public newSalesInvCount: number = 0;
    public totalSalesInvCount: number = 0;
    public invoiceCountAll: number = 0;
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if api call in progress */
    public isLoading: boolean = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold bifurcation of clients content */
    public bifurcationClients: string = "";
    /** This will hold report year */
    public reportYear: string;
    /** Delete attached file dialog ref */
    public salesBifurcationDetailsDialogRef: MatDialogRef<any>;
    /** Selected type enum */
    public selectedTypeEnum: any = GetBifurcationType;
    /** Exposed for template access */
    protected readonly SbpDataType = SbpDataType;
    /** Exposed for template access */
    protected readonly SbpSubType = SbpSubType;
    /** Sales person list for dropdown (raw observable from store, never search-filtered) */
    public salesPersonList$: any;
    /** Full unfiltered sales person list — used for label resolution only */
    private fullSalesPersonList: IOption[] = [];
    /** Filtered sales person list for dropdown */
    public filteredSalesPersonList = signal<IOption[]>([]);
    /** Search control for sales person multi-select */
    public salesPersonSearch: FormControl = new FormControl();
    /** Sentinel value representing the "All" pseudo-option in the sales person dropdown */
    public readonly ALL_SALES_PERSONS = '__ALL__';
    /** Sentinel value representing the "Others" (no sales person assigned) option */
    public readonly NO_SALES_PERSON = '__no_sales_person__';
    /** Selected sales person unique names (real unique names only, no sentinel) */
    public selectedSalesPersonUniqueNames: string[] = [];
    /** Whether the "All" pseudo-option is selected in the sales person dropdown */
    public isAllSalesPersonSelected = signal<boolean>(false);
    /** Canvas for the Top Salespersons vertical bar chart */
    @ViewChild('sbpTopCanvas') private sbpTopCanvas!: ElementRef<HTMLCanvasElement>;
    /** Canvas for the New vs Old Sales grouped bar chart */
    @ViewChild('sbpNvoCanvas') private sbpNvoCanvas!: ElementRef<HTMLCanvasElement>;
    /** Top Salespersons Chart.js instance */
    private sbpTopChart: Chart | null = null;
    /** New vs Old Sales Chart.js instance */
    private sbpNvoChart: Chart | null = null;
    /** Base currency symbol of the active company */
    public baseCurrencySymbol: string;

    
    /** Sales-by-person response passed to the child table component */
    public salesByPersonData: SalesByPersonResponse = null;//SALES_BY_PERSON_MOCK;

    /** Rows derived from salesByPersonData — used to drive the dashboard charts */
    public get salesByPersonRows(): SalesByPersonRow[] {
        return this.salesByPersonData?.rows ?? [];
    }

    /**
     * Display labels of salespersons that were requested but have no row in the API response.
     * Populated after each API response via computeMissingSalesPersonNames().
     */
    public missingSalesPersonNames = signal<string[]>([]);

    constructor(
        private store: Store<AppState>,
        private toaster: ToasterService,
        private settingsFinancialYearActions: SettingsFinancialYearActions,
        private newVsOldInvoicesService: NewVsOldInvoicesService,
        private dialog: MatDialog,
        private generalService: GeneralService,
        private changeDetectorRef: ChangeDetectorRef,
        private ngZone: NgZone,
        private changeDetectionService: Angular21ChangeDetectionService,
        private salesPersonStore: SalesPersonComponentStore
    ) {
        this.NewVsOldInvoicesQueryRequest = new NewVsOldInvoicesRequest();
        this.salesPersonList$ = this.salesPersonStore.salesPersonList$;
    }

    /**
     * Renders both Sales Bifurcation charts from salesByPersonRows data.
     *
     * @memberof NewVsOldInvoicesComponent
     */
    public renderSbpCharts(): void {
        const rows = this.salesByPersonRows;
        const headers = this.salesByPersonData?.headers ?? [];

        /** Find the leaf header key used for the name column (first non-group header) */
        const nameHeader = headers.find(h => !(h as any).children);
        const nameKey = nameHeader?.key;

        /** All group headers (headers with children) keyed by label */
        const groupHeaders = headers.filter(h => !!(h as any).children);

        /** Resolve a dot-notation path (e.g. 'salesPerson.name') against a row object */
        const resolvePath = (obj: unknown, path: string): unknown =>
            path.split('.').reduce((acc, part) => (acc as any)?.[part], obj);

        /** Resolve the salesperson label from a row using the name header key (supports dot-notation) */
        const getLabel = (r: SalesByPersonRow): string => (resolvePath(r, nameKey) as string) ?? '';

        /** Resolve the amount value from a row for a given group header key */
        const getAmount = (r: SalesByPersonRow, key: string): number => (r[key] as any)?.amount ?? 0;

        /** Top chart: sort all rows by total amount desc and take top 5 */
        const totalHeader = groupHeaders[groupHeaders.length - 1];
        const top5Rows = totalHeader
            ? [...rows].sort((a, b) => getAmount(b, totalHeader.key) - getAmount(a, totalHeader.key)).slice(0, 5)
            : rows.slice(0, 5);

        const labels = top5Rows.map(getLabel);

        const chartScaleOptions = {
            x: { border: { display: false }, grid: { display: false }, ticks: { color: '#555', font: { size: 11 } } },
            y: {
                border: { display: false },
                grid: { color: 'rgba(0,0,0,0.06)' },
                ticks: {
                    color: '#666',
                    font: { size: 11 },
                    callback: (v: any) => v >= 1000 ? this.baseCurrencySymbol + (v / 1000).toFixed(0) + 'k' : this.baseCurrencySymbol + v
                }
            }
        };

        if (this.sbpTopCanvas?.nativeElement && totalHeader) {
            this.sbpTopChart?.destroy();
            this.sbpTopChart = new Chart(this.sbpTopCanvas.nativeElement, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{
                        label: totalHeader.label,
                        data: top5Rows.map(r => getAmount(r, totalHeader.key)),
                        backgroundColor: 'rgba(12, 177, 175, 0.85)',
                        borderColor: 'rgb(12, 177, 175)',
                        borderWidth: 1,
                        borderRadius: 4,
                        barPercentage: 0.55
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            borderColor: 'rgb(12,177,175)',
                            borderWidth: 1,
                            bodyColor: '#333',
                            titleColor: '#333',
                            displayColors: false,
                            padding: 8,
                            callbacks: { label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString()}` }
                        }
                    },
                    scales: chartScaleOptions
                }
            });
        }

        /** NvO chart: use all group headers except the last (Total) as separate datasets */
        const nvoHeaders = groupHeaders.slice(0, -1);
        const nvoColors = [
            { bg: 'rgba(12, 177, 175, 0.85)', border: 'rgb(12, 177, 175)' },
            { bg: 'rgba(94, 189, 185, 0.45)', border: 'rgba(94, 189, 185, 0.8)' },
            { bg: 'rgba(255, 159, 64, 0.45)', border: 'rgba(255, 159, 64, 0.8)' },
            { bg: 'rgba(153, 102, 255, 0.45)', border: 'rgba(153, 102, 255, 0.8)' }
        ];

        if (this.sbpNvoCanvas?.nativeElement && nvoHeaders.length) {
            this.sbpNvoChart?.destroy();
            this.sbpNvoChart = new Chart(this.sbpNvoCanvas.nativeElement, {
                type: 'bar',
                data: {
                    labels,
                    datasets: nvoHeaders.map((h, i) => ({
                        label: h.label,
                        data: top5Rows.map(r => getAmount(r, h.key)),
                        backgroundColor: (nvoColors[i] ?? nvoColors[0]).bg,
                        borderColor: (nvoColors[i] ?? nvoColors[0]).border,
                        borderWidth: 1,
                        borderRadius: 4,
                        barPercentage: 0.7
                    }))
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: { boxWidth: 12, font: { size: 11 }, color: '#555' }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            borderColor: 'rgb(12,177,175)',
                            borderWidth: 1,
                            bodyColor: '#333',
                            titleColor: '#333',
                            displayColors: true,
                            padding: 8
                        }
                    },
                    scales: chartScaleOptions
                }
            });
        }
    }

    public ngOnInit() {
        this.salesPersonStore.getAllSalesPerson({ isDropdown: true, params: { page: 1, count: 1000, archive: '' } });
        this.salesPersonList$.pipe(takeUntil(this.destroyed$)).subscribe((list: any) => {
            const options: IOption[] = Array.isArray(list) ? list : [];
            this.fullSalesPersonList = [{ label: this.localeData?.others, value: this.NO_SALES_PERSON }, ...options];
            this.filteredSalesPersonList.set(this.fullSalesPersonList);
        });
        this.salesPersonSearch.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((search: string) => {
            this.salesPersonList$.pipe(take(1)).subscribe((list: any) => {
                const options: IOption[] = Array.isArray(list) ? list : [];
                const term = (search ?? '').toLowerCase();
                const othersOption: IOption = { label: this.localeData?.others, value: this.NO_SALES_PERSON };
                const allOptions: IOption[] = [othersOption, ...options];
                this.filteredSalesPersonList.set(term ? allOptions.filter(o => o.label?.toLowerCase().includes(term)) : allOptions);
            });
        });
        this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$)).subscribe(profile => {
            if (profile?.baseCurrencySymbol) {
                this.baseCurrencySymbol = profile.baseCurrencySymbol;
            }
        });
        this.store.dispatch(this.settingsFinancialYearActions.getFinancialYearLimits());

        this.store.pipe(select(state => state.settings.financialYearLimits), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.startDate && response.endDate) {
                this.yearOptions = [];
                let startYear = Number(dayjs(response.startDate, GIDDH_DATE_FORMAT).format("YYYY"));
                let endYear = Number(dayjs(response.endDate, GIDDH_DATE_FORMAT).format("YYYY"));

                for (startYear; startYear <= endYear; startYear++) {
                    this.yearOptions.push({ label: String(startYear), value: String(startYear) });
                }
                this.changeDetectionService.triggerChangeDetection(this.changeDetectorRef, this.ngZone);
            }
        });

        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                let universalEndDate = dayjs(response[1]).format("YYYY");

                if (dayjs(response[1]).toDate() >= dayjs().toDate()) {
                    this.selectedYear = (new Date()).getFullYear()?.toString();
                    this.selectedmonth = ("0" + (new Date().getMonth() + 1)).slice(-2)?.toString();
                } else {
                    this.selectedYear = universalEndDate;
                    this.selectedmonth = ("0" + (dayjs(response[1]).format("M"))).slice(-2)?.toString();
                }
                this.getSalesBifurcation();
                this.changeDetectionService.triggerChangeDetection(this.changeDetectorRef, this.ngZone);
            }
        });
    }

    /**
     * This will reset the data
     *
     * @memberof NewVsOldInvoicesComponent
     */
    public resetData(): void {
        this.selectedmonth = null;
        this.selectedQuater = null;
        this.newVsOldInvoicesData = {
            totalSales: {
                invoiceCount: null,
                total: null,
                month: '',
                uniqueCount: null,
                fromDate: null,
                toDate: null
            },
            newSales: {
                invoiceCount: null,
                total: null,
                month: '',
                uniqueCount: null,
                fromDate: null,
                toDate: null
            },
            oldSales: {
                invoiceCount: null,
                total: null,
                month: '',
                uniqueCount: null,
                uniqueNames: [],
                fromDate: null,
                toDate: null
            },
            carriedSales: []
        };
    }

    /**
     * This will get sales bifurcation report
     *
     * @memberof NewVsOldInvoicesComponent
     */
    public getSalesBifurcation(): void {
        this.isLoading = true;
        this.NewVsOldInvoicesQueryRequest.type = this.selectedType;
        if (this.NewVsOldInvoicesQueryRequest.type === GetBifurcationType.MONTH) {
            this.NewVsOldInvoicesQueryRequest.value = this.selectedmonth + '-' + this.selectedYear;
        } else {
            this.NewVsOldInvoicesQueryRequest.value = this.selectedQuater + '-' + this.selectedYear;
        }

        this.reportYear = this.selectedYear;

        const realPersonSelections = (this.selectedSalesPersonUniqueNames ?? []).filter(v => v !== this.ALL_SALES_PERSONS);
        const hasSalesPersonFilter = this.selectedSalesPersonUniqueNames.length > 0 && this.filteredSalesPersonList().length > 0;
        this.NewVsOldInvoicesQueryRequest.salesPersonUniqueNames = hasSalesPersonFilter ? realPersonSelections : undefined;

        const apiCall$ = hasSalesPersonFilter
            ? this.newVsOldInvoicesService.GetNewVsOldInvoicesBySalesPerson(this.NewVsOldInvoicesQueryRequest)
            : this.newVsOldInvoicesService.GetNewVsOldInvoices(this.NewVsOldInvoicesQueryRequest);

        apiCall$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                if (hasSalesPersonFilter) {
                    this.salesByPersonData = response?.body;
                    this.computeMissingSalesPersonNames();
                    setTimeout(() => {
                        this.renderSbpCharts();
                    }, 200);
                } else {
                    this.newVsOldInvoicesData = response?.body;
                    this.newSalesClientTotal = this.newVsOldInvoicesData?.newSales?.uniqueCount;
                    this.totalSalesClientTotal = this.newVsOldInvoicesData?.totalSales?.uniqueCount;
                    this.newSalesAmount = this.newVsOldInvoicesData?.newSales?.total;
                    this.totalSalesAmount = this.newVsOldInvoicesData?.totalSales?.total;
                    this.newSalesInvCount = this.newVsOldInvoicesData?.newSales?.invoiceCount;
                    this.totalSalesInvCount = this.newVsOldInvoicesData?.totalSales?.invoiceCount;
                    this.changeDetectionService.triggerChangeDetection(this.changeDetectorRef, this.ngZone);
                }
            } else {
                this.changeDetectionService.safeChangeDetection(this.changeDetectorRef, this.ngZone);
            }
            this.isLoading = false;

            this.getBifurcationClientsString();
        });
    }

    /**
     * Computes missingSalesPersonNames by comparing requested salesPersonUniqueNames
     * against the row ids returned by the API. Excludes the NO_SALES_PERSON sentinel.
     *
     * @memberof NewVsOldInvoicesComponent
     */
    private computeMissingSalesPersonNames(): void {
        const rows = this.salesByPersonData?.rows ?? [];
        const returnedIds = new Set(rows.map(r => r.id as string));
        const list = this.fullSalesPersonList;
        this.missingSalesPersonNames.set(
            (this.NewVsOldInvoicesQueryRequest.salesPersonUniqueNames ?? [])
                .filter(u => u !== this.NO_SALES_PERSON && !returnedIds.has(u))
                .map(u => list.find(o => o.value === u)?.label ?? u)
        );
    }

    /**
     * Handles mat-select ngModelChange for the sales person dropdown.
     * If the __ALL__ sentinel is in the new selection, selects all real persons and removes the sentinel.
     * If __ALL__ was previously selected and is now absent, clears all.
     * Otherwise syncs isAllSalesPersonSelected based on whether every person is selected.
     *
     * @param {string[]} selected
     * @memberof NewVsOldInvoicesComponent
     */
    public onSalesPersonSelectionChange(selected: string[]): void {
        const allValues = this.filteredSalesPersonList().map(o => o.value);
        const allSentinel = this.ALL_SALES_PERSONS;
        const hadAll = this.isAllSalesPersonSelected();
        const hasAllNow = selected.includes(allSentinel);
        const realSelections = selected.filter(v => v !== allSentinel);

        if (hasAllNow && !hadAll) {
            /** User just clicked All → select everything */
            this.isAllSalesPersonSelected.set(true);
            this.selectedSalesPersonUniqueNames = [...allValues, allSentinel];
        } else if (!hasAllNow && hadAll) {
            /** User clicked All to uncheck it and uncheck all individual selections */
            this.isAllSalesPersonSelected.set(false);
            if (selected.length === allValues.length) {
                this.selectedSalesPersonUniqueNames = [];
            } else {
                this.selectedSalesPersonUniqueNames = realSelections;
            }
        } else {
            /** Individual selection changed — auto-activate All if every person is now selected */
            const allSelected = allValues.length > 0 && allValues.every(v => realSelections.includes(v));
            this.isAllSalesPersonSelected.set(allSelected);
            this.selectedSalesPersonUniqueNames = allSelected ? [...allValues, allSentinel] : realSelections;
        }
    }

    public showErrorToast(msg) {
        this.toaster.errorToast(msg);
    }

    public ngOnDestroy() {
        this.sbpTopChart?.destroy();
        this.sbpNvoChart?.destroy();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public customMonthSorting(a: IOption, b: IOption) {
        return (parseInt(a?.value) - parseInt(b?.value));
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof NewVsOldInvoicesComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            this.monthOptions = [{ label: this.commonLocaleData?.app_months_full.january, value: '01' }, { label: this.commonLocaleData?.app_months_full.february, value: '02' }, { label: this.commonLocaleData?.app_months_full.march, value: '03' }, { label: this.commonLocaleData?.app_months_full.april, value: '04' }, { label: this.commonLocaleData?.app_months_full.may, value: '05' }, { label: this.commonLocaleData?.app_months_full.june, value: '06' }, { label: this.commonLocaleData?.app_months_full.july, value: '07' }, { label: this.commonLocaleData?.app_months_full.august, value: '08' }, { label: this.commonLocaleData?.app_months_full.september, value: '09' }, { label: this.commonLocaleData?.app_months_full.october, value: '10' }, { label: this.commonLocaleData?.app_months_full.november, value: '11' }, { label: this.commonLocaleData?.app_months_full.december, value: '12' }];

            this.GetTypeOptions = [{ label: this.localeData?.get_type_options?.month, value: GetBifurcationType.MONTH }, { label: this.localeData?.get_type_options?.quarter, value: GetBifurcationType.QUARTER }];
            this.quaterOptions = [{ label: this.localeData?.quarters?.q1, value: '01' }, { label: this.localeData?.quarters?.q2, value: '02' }, { label: this.localeData?.quarters?.q3, value: '03' }, { label: this.localeData?.quarters?.q4, value: '04' }];

            this.getBifurcationClientsString();
            this.changeDetectionService.triggerChangeDetection(this.changeDetectorRef, this.ngZone);
        }
    }

    /**
     * This will set bifurcation clients string
     *
     * @memberof NewVsOldInvoicesComponent
     */
    public getBifurcationClientsString(): void {
        if (this.NewVsOldInvoicesQueryRequest.type === GetBifurcationType.MONTH && this.selectedmonth) {
            this.columnName = this.monthOptions.find(f => f?.value === this.selectedmonth)?.label;
        } else if (this.NewVsOldInvoicesQueryRequest.type === GetBifurcationType.QUARTER && this.selectedQuater) {
            this.columnName = this.quaterOptions.find(f => f?.value === this.selectedQuater)?.label;
        }

        if (this.columnName) {
            this.bifurcationClients = this.localeData?.bifurcation_clients?.replace("[COLUMN_NAME]", this.columnName);
        }
        this.changeDetectionService.triggerChangeDetection(this.changeDetectorRef, this.ngZone);
    }

    /**
     * This will show client list
     *
     * @param {any} newVsOldInvoicesData
     * @param {string} type
     * @param {string} subType
     * @param {string} salesFrom
     * @memberof NewVsOldInvoicesComponent
     */
    /** Handles client-cell click from the sales-by-person table */
    public onSbpClientClick(event: { row: any; group: string }): void {
        const rowData = event.row?.[event.group];
        this.showClientList(rowData, event.group, SbpSubType.Client, rowData?.month, event.row?.id ? [event.row.id] : undefined);
    }

    /** Handles invoice-cell click from the sales-by-person table */
    public onSbpInvoiceClick(event: { row: any; group: string }): void {
        const rowData = event.row?.[event.group];
        this.showClientList(rowData, event.group, SbpSubType.Invoice, rowData?.month, event.row?.id ? [event.row.id] : undefined);
    }

    /** Handles client-cell click from the expand breakdown row */
    public onSbpExpandClientClick(event: { row: any; expandRow: any }): void {
        this.showClientList(event.expandRow, SbpDataType.Old, SbpSubType.Client, event.expandRow?.month, event.row?.id ? [event.row.id] : undefined);
    }

    /** Handles invoice-cell click from the expand breakdown row */
    public onSbpExpandInvoiceClick(event: { row: any; expandRow: any }): void {
        this.showClientList(event.expandRow, SbpDataType.Old, SbpSubType.Invoice, event.expandRow?.month, event.row?.id ? [event.row.id] : undefined);
    }

    public showClientList(newVsOldInvoicesData: any, type: string, subType: string, salesFrom: string, salesPersonUniqueNames?: string[]): void {
        const goToLedgerDateRange = this.generalService.getStartAndEndDateOfMonthOrQuater(this.NewVsOldInvoicesQueryRequest.type as GetBifurcationType, this.NewVsOldInvoicesQueryRequest.value);
        const reportType = this.NewVsOldInvoicesQueryRequest.type;
        const reportReq = {
            type: reportType,
            value: this.NewVsOldInvoicesQueryRequest.value,
            fromDate: goToLedgerDateRange.fromDate,
            toDate: goToLedgerDateRange.toDate
        }
        const data = {
            newVsOldInvoicesData,
            type,
            subType,
            salesFrom,
            salesPersonUniqueNames,
            newVsOldInvoicesQueryRequest: reportReq
        };
        ASIDE_PANE_CONFIG.data = data;
        this.salesBifurcationDetailsDialogRef = this.dialog.open(SalesBifurcationDetailsComponent, ASIDE_PANE_CONFIG);
        this.salesBifurcationDetailsDialogRef.afterClosed().pipe(take(1), filter(Boolean), tap(() => {
            this.getSalesBifurcation(); this.salesBifurcationDetailsDialogRef = undefined;
        })).subscribe();
    }
}

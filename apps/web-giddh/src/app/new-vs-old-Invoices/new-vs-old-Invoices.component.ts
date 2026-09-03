import { Component, OnDestroy, OnInit, ChangeDetectorRef, NgZone, ChangeDetectionStrategy, signal, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
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
import { ASIDE_PANE_CONFIG, AppThemeClassEnum, GetBifurcationType, IOption, isSelectedAllOption } from '../app.constant';
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
    /** Full unfiltered sales person list passed to the dropdown and used for label resolution */
    public fullSalesPersonList: IOption[] = [];
    /** Sentinel value representing the "Others" (no sales person assigned) option */
    public readonly NO_SALES_PERSON = '__no_sales_person__';
    /** Selected sales person unique names. All is stored as [SELECTED_ALL_OPTION]. */
    public selectedSalesPersonUniqueNames: string[] = [];
    /** Canvas for the Top Salespersons vertical bar chart */
    @ViewChild('sbpTopCanvas') private sbpTopCanvas!: ElementRef<HTMLCanvasElement>;
    /** Canvas for the New vs Old Sales grouped bar chart */
    @ViewChild('sbpNvoCanvas') private sbpNvoCanvas!: ElementRef<HTMLCanvasElement>;
    /** Template reference for the top-salesperson expand dialog */
    @ViewChild('topSalesPersonDialogTemplate') private topSalesPersonDialogTemplate!: TemplateRef<unknown>;
    /** Template reference for the new-vs-old expand dialog */
    @ViewChild('nvoSalesDialogTemplate') private nvoSalesDialogTemplate!: TemplateRef<unknown>;
    /** Canvas for the expanded top-salesperson dialog chart */
    @ViewChild('topSalesPersonDialogCanvas') private topSalesPersonDialogCanvas!: ElementRef<HTMLCanvasElement>;
    /** Canvas for the expanded new-vs-old dialog chart */
    @ViewChild('nvoSalesDialogCanvas') private nvoSalesDialogCanvas!: ElementRef<HTMLCanvasElement>;
    /** Top Salespersons Chart.js instance */
    private sbpTopChart: Chart | null = null;
    /** New vs Old Sales Chart.js instance */
    private sbpNvoChart: Chart | null = null;
    /** Expanded Top Salespersons Chart.js instance */
    private topSalesPersonDialogChart: Chart | null = null;
    /** Expanded New vs Old Sales Chart.js instance */
    private nvoSalesDialogChart: Chart | null = null;
    /** Base currency symbol of the active company */
    public baseCurrencySymbol: string;

    
    /** Sales-by-person response passed to the child table component */
    public salesByPersonData: SalesByPersonResponse = null;//SALES_BY_PERSON_MOCK;

    /** Rows derived from salesByPersonData — used to drive the dashboard charts */
    public get salesByPersonRows(): SalesByPersonRow[] {
        return this.salesByPersonData?.rows ?? [];
    }

    /** Maximum salesperson bars shown in the top-salesperson chart */
    public readonly topSalesPersonDisplayLimit: number = 5;
    /** Full sorted top-salesperson rows shown in the expand dialog */
    public topSalesPersonDialogRows: Array<{ label: string; clients: number; amount: number; invoices: number }> = [];
    /** True when expand action for top-salesperson chart should be visible */
    public showTopSalesPersonExpandButton = signal<boolean>(false);
    /** True when expand action for new-vs-old chart should be visible */
    public showNvoSalesExpandButton = signal<boolean>(false);
    /** Dialog reference for top-salesperson popup */
    public topSalesPersonDialogRef: MatDialogRef<any>;
    /** Dialog reference for new-vs-old popup */
    public nvoSalesDialogRef: MatDialogRef<any>;
    /** Expanded new-vs-old chart labels (all salespersons) */
    public nvoSalesDialogLabels: string[] = [];
    /** Expanded new-vs-old chart datasets keyed by group header */
    public nvoSalesDialogDatasets: Array<{ label: string; key: string }> = [];
    /** Shared width for chart popups. */
    private readonly chartDialogWidth: string = '60vw';
    /** Shared height for chart popups. */
    private readonly chartDialogHeight: string = '60vh';

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
        /** Theme-aware color tokens used by all chart instances */
        const chartThemeColors = this.getChartThemeColors();
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
        const sortedRows = totalHeader
            ? [...rows].sort((a, b) => getAmount(b, totalHeader.key) - getAmount(a, totalHeader.key))
            : [...rows];
        const top5Rows = sortedRows.slice(0, this.topSalesPersonDisplayLimit);

        this.showTopSalesPersonExpandButton.set(sortedRows.length > this.topSalesPersonDisplayLimit);
        this.showNvoSalesExpandButton.set(sortedRows.length > this.topSalesPersonDisplayLimit);
        this.topSalesPersonDialogRows = totalHeader
            ? sortedRows.map((row) => ({
                label: getLabel(row),
                clients: Number((row[totalHeader.key] as any)?.clients ?? 0),
                amount: Number((row[totalHeader.key] as any)?.amount ?? 0),
                invoices: Number((row[totalHeader.key] as any)?.invoices ?? 0)
            }))
            : [];
        this.nvoSalesDialogLabels = sortedRows.map(getLabel);

        const labels = top5Rows.map(getLabel);

        const chartScaleOptions = {
            x: { border: { display: false }, grid: { display: false }, ticks: { color: chartThemeColors.axisTextColor, font: { size: 11 } } },
            y: {
                border: { display: false },
                grid: { color: chartThemeColors.gridColor },
                ticks: {
                    color: chartThemeColors.axisTextColor,
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
                            callbacks: { label: (ctx) => ` ${this.baseCurrencySymbol}${ctx.parsed.y.toLocaleString()}` }
                        }
                    },
                    scales: chartScaleOptions
                }
            });
        }

        /** NvO chart: use all group headers except the last (Total) as separate datasets */
        const nvoHeaders = groupHeaders.slice(0, -1);
        this.nvoSalesDialogDatasets = nvoHeaders.map((header) => ({ label: header.label, key: header.key }));
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
                            labels: { boxWidth: 12, font: { size: 11 }, color: chartThemeColors.legendTextColor }
                        },
                        tooltip: {
                            backgroundColor: chartThemeColors.tooltipBackgroundColor,
                            borderColor: chartThemeColors.tooltipBorderColor,
                            borderWidth: 1,
                            bodyColor: chartThemeColors.tooltipTextColor,
                            titleColor: chartThemeColors.tooltipTextColor,
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

        const realPersonSelections = isSelectedAllOption(this.selectedSalesPersonUniqueNames) ? this.fullSalesPersonList.map((list: IOption) => list.value) : this.selectedSalesPersonUniqueNames;
        const hasSalesPersonFilter = realPersonSelections?.length > 0 && this.fullSalesPersonList?.length > 0;
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

    public showErrorToast(msg) {
        this.toaster.errorToast(msg);
    }

    public ngOnDestroy() {
        this.sbpTopChart?.destroy();
        this.sbpNvoChart?.destroy();
        this.topSalesPersonDialogChart?.destroy();
        this.nvoSalesDialogChart?.destroy();
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

    /** 
     * Opens popup with complete sorted salesperson list for the top-salesperson chart 
     * 
     * @memberof NewVsOldInvoicesComponent
    */
    public openTopSalesPersonDialog(): void {
        if (!this.topSalesPersonDialogTemplate || this.topSalesPersonDialogRows.length === 0) {
            return;
        }

        this.topSalesPersonDialogRef = this.openChartDialog(
            this.topSalesPersonDialogTemplate,
            () => this.renderTopSalesPersonDialogChart(),
            () => {
                this.topSalesPersonDialogChart?.destroy();
                this.topSalesPersonDialogChart = null;
                this.topSalesPersonDialogRef = undefined;
            }
        );
    }

    /** 
     * Opens popup with complete new-vs-old chart for all salesperson rows 
     * 
     * @memberof NewVsOldInvoicesComponent
    */
    public openNvoSalesDialog(): void {
        if (!this.nvoSalesDialogTemplate || this.nvoSalesDialogLabels.length === 0 || this.nvoSalesDialogDatasets.length === 0) {
            return;
        }

        this.nvoSalesDialogRef = this.openChartDialog(
            this.nvoSalesDialogTemplate,
            () => this.renderNvoSalesDialogChart(),
            () => {
                this.nvoSalesDialogChart?.destroy();
                this.nvoSalesDialogChart = null;
                this.nvoSalesDialogRef = undefined;
            }
        );
    }

    /**
     * Opens a chart dialog with shared dimensions and binds one-time open/close lifecycle callbacks.
     *
     * @param {TemplateRef<unknown>} template Dialog template reference
     * @param {() => void} onOpened Callback executed once after dialog is opened
     * @param {() => void} onClosed Callback executed once after dialog is closed
     * @memberof NewVsOldInvoicesComponent
     * @returns {MatDialogRef<any>} Opened dialog reference
     */
    private openChartDialog(template: TemplateRef<unknown>, onOpened: () => void, onClosed: () => void): MatDialogRef<any> {
        const dialogRef = this.dialog.open(template, {
            width: this.chartDialogWidth,
            height: this.chartDialogHeight,
            autoFocus: false
        });

        dialogRef.afterOpened().pipe(take(1)).subscribe(onOpened);
        dialogRef.afterClosed().pipe(take(1)).subscribe(onClosed);

        return dialogRef;
    }

    /** 
     * Renders the expanded top-salesperson bar chart with all salesperson rows 
     * 
     * @memberof NewVsOldInvoicesComponent
    */
    private renderTopSalesPersonDialogChart(): void {
        /** Theme-aware color tokens used by dialog chart */
        const chartThemeColors = this.getChartThemeColors();
        const canvas = this.topSalesPersonDialogCanvas?.nativeElement;

        if (!canvas || this.topSalesPersonDialogRows.length === 0) {
            return;
        }

        this.topSalesPersonDialogChart?.destroy();
        this.topSalesPersonDialogChart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: this.topSalesPersonDialogRows.map((row) => row.label),
                datasets: [
                    {
                        label: this.localeData?.top_salespersons,
                        data: this.topSalesPersonDialogRows.map((row) => row.amount),
                        backgroundColor: 'rgba(12, 177, 175, 0.85)',
                        borderColor: 'rgb(12, 177, 175)',
                        borderWidth: 1,
                        borderRadius: 4,
                        barPercentage: 0.6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: chartThemeColors.tooltipBackgroundColor,
                        borderColor: chartThemeColors.tooltipBorderColor,
                        borderWidth: 1,
                        bodyColor: chartThemeColors.tooltipTextColor,
                        titleColor: chartThemeColors.tooltipTextColor,
                        displayColors: false,
                        padding: 8,
                        callbacks: {
                            label: (ctx) => `${this.baseCurrencySymbol}${(ctx.parsed?.y ?? 0).toLocaleString()}`
                        }
                    }
                },
                scales: {
                    x: {
                        border: { display: false },
                        grid: { display: false },
                        ticks: {
                            color: chartThemeColors.axisTextColor,
                            font: { size: 11 },
                            maxRotation: 45,
                            minRotation: 20
                        }
                    },
                    y: {
                        border: { display: false },
                        grid: { color: chartThemeColors.gridColor },
                        ticks: {
                            color: chartThemeColors.axisTextColor,
                            font: { size: 11 },
                            callback: (v: any) => v >= 1000 ? this.baseCurrencySymbol + (v / 1000).toFixed(0) + 'k' : this.baseCurrencySymbol + v
                        }
                    }
                }
            }
        });
    }

    /** 
     * Renders the expanded new-vs-old grouped bar chart with all salesperson rows 
     * 
     * @memberof NewVsOldInvoicesComponent
    */
    private renderNvoSalesDialogChart(): void {
        /** Theme-aware color tokens used by dialog chart */
        const chartThemeColors = this.getChartThemeColors();
        const canvas = this.nvoSalesDialogCanvas?.nativeElement;

        if (!canvas || this.nvoSalesDialogLabels.length === 0 || this.nvoSalesDialogDatasets.length === 0) {
            return;
        }

        const rows = this.salesByPersonRows;
        const headers = this.salesByPersonData?.headers ?? [];
        const nameHeader = headers.find(h => !(h as any).children);
        const nameKey = nameHeader?.key;
        const resolvePath = (obj: unknown, path: string): unknown => path.split('.').reduce((acc, part) => (acc as any)?.[part], obj);
        const getLabel = (r: SalesByPersonRow): string => (resolvePath(r, nameKey) as string) ?? '';
        const getAmount = (r: SalesByPersonRow, key: string): number => (r[key] as any)?.amount ?? 0;
        const groupHeaders = headers.filter(h => !!(h as any).children);
        const totalHeader = groupHeaders[groupHeaders.length - 1];
        const sortedRows = totalHeader ? [...rows].sort((a, b) => getAmount(b, totalHeader.key) - getAmount(a, totalHeader.key)) : [...rows];

        const nvoColors = [
            { bg: 'rgba(12, 177, 175, 0.85)', border: 'rgb(12, 177, 175)' },
            { bg: 'rgba(94, 189, 185, 0.45)', border: 'rgba(94, 189, 185, 0.8)' },
            { bg: 'rgba(255, 159, 64, 0.45)', border: 'rgba(255, 159, 64, 0.8)' },
            { bg: 'rgba(153, 102, 255, 0.45)', border: 'rgba(153, 102, 255, 0.8)' }
        ];

        this.nvoSalesDialogChart?.destroy();
        this.nvoSalesDialogChart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: sortedRows.map(getLabel),
                datasets: this.nvoSalesDialogDatasets.map((dataset, index) => ({
                    label: dataset.label,
                    data: sortedRows.map((row) => getAmount(row, dataset.key)),
                    backgroundColor: (nvoColors[index] ?? nvoColors[0]).bg,
                    borderColor: (nvoColors[index] ?? nvoColors[0]).border,
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
                        labels: { boxWidth: 12, font: { size: 11 }, color: chartThemeColors.legendTextColor }
                    },
                    tooltip: {
                        backgroundColor: chartThemeColors.tooltipBackgroundColor,
                        borderColor: chartThemeColors.tooltipBorderColor,
                        borderWidth: 1,
                        bodyColor: chartThemeColors.tooltipTextColor,
                        titleColor: chartThemeColors.tooltipTextColor,
                        displayColors: true,
                        padding: 8
                    }
                },
                scales: {
                    x: {
                        border: { display: false },
                        grid: { display: false },
                        ticks: {
                            color: chartThemeColors.axisTextColor,
                            font: { size: 11 },
                            maxRotation: 45,
                            minRotation: 20
                        }
                    },
                    y: {
                        border: { display: false },
                        grid: { color: chartThemeColors.gridColor },
                        ticks: {
                            color: chartThemeColors.axisTextColor,
                            font: { size: 11 },
                            callback: (v: any) => v >= 1000 ? this.baseCurrencySymbol + (v / 1000).toFixed(0) + 'k' : this.baseCurrencySymbol + v
                        }
                    }
                }
            }
        });
    }

    /**
     * Reads a CSS variable value from document body and returns a fallback if missing.
     *
     * @param {string} variableName CSS custom property name
     * @param {string} fallbackValue Value returned when variable is unavailable
     * @returns {string} Resolved CSS value
     */
    private getCssVarValue(variableName: string, fallbackValue: string): string {
        const resolvedValue = getComputedStyle(document.body).getPropertyValue(variableName)?.trim();
        return resolvedValue || fallbackValue;
    }

    /**
     * Builds theme-aware chart colors so dark mode remains readable.
     *
     * @returns {{
     * axisTextColor: string;
     * legendTextColor: string;
     * gridColor: string;
     * tooltipBackgroundColor: string;
     * tooltipTextColor: string;
     * tooltipBorderColor: string;
     * }} Chart palette for current theme
     */
    private getChartThemeColors(): {
        axisTextColor: string;
        legendTextColor: string;
        gridColor: string;
        tooltipBackgroundColor: string;
        tooltipTextColor: string;
        tooltipBorderColor: string;
    } {
        /** True when active app theme is dark */
        const isDarkThemeEnabled = document.body.classList.contains(AppThemeClassEnum.Dark);
        /** Axis and legend label color derived from global theme tokens */
        const baseTextColor = this.getCssVarValue('--color-dark-gray', isDarkThemeEnabled ? '#f5f5f5' : '#555555');

        return {
            axisTextColor: baseTextColor,
            legendTextColor: baseTextColor,
            gridColor: isDarkThemeEnabled ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.06)',
            tooltipBackgroundColor: isDarkThemeEnabled ? 'rgba(33,33,33,0.96)' : 'rgba(255,255,255,0.95)',
            tooltipTextColor: isDarkThemeEnabled ? '#f5f5f5' : '#333333',
            tooltipBorderColor: this.getCssVarValue('--theme-primary-color', 'rgb(12,177,175)')
        };
    }
}

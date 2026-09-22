import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatMenuTrigger } from "@angular/material/menu";
import { Sort } from "@angular/material/sort";
import { PageEvent } from "@angular/material/paginator";
import { ReplaySubject, Subject, debounceTime, distinctUntilChanged, filter, from, skip, switchMap, take, takeUntil } from "rxjs";
import { finalize } from "rxjs/operators";
import * as dayjs from "dayjs";
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGE_SIZE_OPTIONS } from "../../app.constant";
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from "../../shared/helpers/defaultDateFormat";
import { GeneralService } from "../../services/general.service";
import { ToasterService } from "../../services/toaster.service";
import { VoucherService } from "../../services/voucher.service";
import { VoucherTypeEnum } from "../utility/vouchers.const";
import { VoucherComponentStore } from "../utility/vouchers.store";

type PendingReportType = "WITHOUT_CHALLAN" | "NOT_INVOICED"; // | "PARTIALLY_INVOICED" | "FULLY_INVOICED"
type PendingDocumentType = "DC" | "RC";

interface PendingReportFilters {
    from: string;
    to: string;
    q: string;
    page: number;
    count: number;
    sort: "asc" | "desc" | "";
    sortBy: "date" | "";
    reportType: PendingReportType;
}

@Component({
    selector: "pending-reconciliation",
    templateUrl: "./pending-reconciliation.component.html",
    styleUrls: ["./pending-reconciliation.component.scss"],
    providers: [VoucherComponentStore],
    standalone: false
})
export class PendingReconciliationComponent implements OnInit, OnDestroy {
    @ViewChild("universalDatepickerTrigger", { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;

    public localeData: any = {};
    public commonLocaleData: any = {};
    public voucherType: VoucherTypeEnum = VoucherTypeEnum.deliveryChallan;
    public readonly voucherTypeEnum = VoucherTypeEnum;
    public readonly pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    public readonly datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    public dataSource: any[] = [];
    public totalResults = 0;
    public balances: any = null;
    public loading = false;
    public isSearching = false;
    public filtersApplied = false;
    public showNumberSearch = false;
    public showPartySearch = false;
    public selectedDateRange: any;
    public selectedDateRangeUi = "";
    public selectedRangeLabel = "";
    public company: any = {};
    public numberInput = new FormControl("");
    public partyInput = new FormControl("");
    public reportTypeOptions: Array<{ label: string; value: PendingReportType }> = [];
    public filters: PendingReportFilters = this.createDefaultFilters();

    private documentType: PendingDocumentType = "DC";
    private searchColumn: "number" | "party" = "number";
    private isUniversalDateApplicable = true;
    private filtersReady = false;
    private suppressSearch = false;
    private userHasAppliedFilter = false;
    private universalDate: any;
    private readonly destroyed$ = new ReplaySubject<boolean>(1);
    private readonly fetch$ = new Subject<void>();
    private readonly reportTypes: PendingReportType[] = [
        "WITHOUT_CHALLAN",
        "NOT_INVOICED"
        // "PARTIALLY_INVOICED",
        // "FULLY_INVOICED"
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private generalService: GeneralService,
        private voucherService: VoucherService,
        private toasterService: ToasterService,
        private componentStore: VoucherComponentStore
    ) { }

    /**
     * @memberof PendingReconciliationComponent
     */
    public ngOnInit(): void {
        this.bindSearch();
        this.bindReportLoader();

        this.componentStore.companyProfile$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && Object.keys(response).length) {
                this.company = response;
            }
        });

        this.route.paramMap.pipe(
            switchMap(params => {
                this.setVoucherType(params.get("voucherType"));
                this.setReportTypeOptions();
                return from(this.ensureFilterRoute()).pipe(
                    switchMap(() => this.componentStore.universalDate$.pipe(filter(Boolean), take(1)))
                );
            }),
            takeUntil(this.destroyed$)
        ).subscribe(date => {
            this.universalDate = date;
            this.initFilters();
        });

        this.componentStore.universalDate$.pipe(filter(Boolean), skip(1), takeUntil(this.destroyed$)).subscribe(response => {
            if (!response || !this.filtersReady) {
                return;
            }
            this.handleUniversalDateChange(response);
        });
    }

    /**
     * @memberof PendingReconciliationComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * @param {boolean} [isOpen=true]
     * @memberof PendingReconciliationComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * @param {*} value
     * @memberof PendingReconciliationComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value?.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = value?.name || "";
        this.toggleGiddhDatepicker(false);
        if (!value?.startDate || !value?.endDate) {
            return;
        }
        this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
        this.selectedDateRangeUi = this.formatRangeLabel(value.startDate, value.endDate);
        this.filters.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
        this.filters.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        this.filters.page = 1;
        this.isUniversalDateApplicable = false;
        this.userHasAppliedFilter = true;
        this.filtersApplied = true;
        if (window.localStorage) {
            localStorage.setItem("pendingReportSelectedDate", JSON.stringify({
                fromDates: this.filters.from,
                toDates: this.filters.to
            }));
        }
        this.persistAndLoad();
    }

    /**
     * @memberof PendingReconciliationComponent
     */
    public clearFilters(): void {
        this.suppressSearch = true;
        this.numberInput.patchValue("", { emitEvent: false });
        this.partyInput.patchValue("", { emitEvent: false });
        this.suppressSearch = false;
        this.showNumberSearch = false;
        this.showPartySearch = false;
        this.isSearching = false;
        this.searchColumn = "number";
        const currentReportType = this.filters.reportType;
        this.filters = this.createDefaultFilters();
        this.filters.reportType = currentReportType;
        this.isUniversalDateApplicable = true;
        this.applyUniversalDate(this.universalDate);
        this.userHasAppliedFilter = false;
        this.filtersApplied = false;
        if (window.localStorage) {
            localStorage.removeItem("pendingReportSelectedDate");
        }
        this.persistAndLoad(true);
    }

    /**
     * Toggle report type (not treated as a clearable filter)
     *
     * @param {PendingReportType} reportType
     * @memberof PendingReconciliationComponent
     */
    public onReportTypeChange(reportType: PendingReportType): void {
        if (!reportType || reportType === this.filters.reportType) {
            return;
        }
        this.filters.reportType = reportType;
        this.filters.page = 1;
        this.persistAndLoad();
    }

    /**
     * WITHOUT_CHALLAN returns voucher rows; other report types return business documents
     *
     * @readonly
     * @type {boolean}
     * @memberof PendingReconciliationComponent
     */
    public get isWithoutChallanReport(): boolean {
        return this.filters.reportType === "WITHOUT_CHALLAN";
    }

    /**
     * Table columns based on report type
     *
     * @readonly
     * @type {string[]}
     * @memberof PendingReconciliationComponent
     */
    public get displayedColumns(): string[] {
        if (this.isWithoutChallanReport) {
            return ["date", "number", "voucherType", "party", "amount", "action"];
        }
        return ["date", "number", "documentType", "party", "amount", "invoiceStatus", "status", "linkedInvoice", "action"];
    }

    /**
     * @param {Sort} event
     * @memberof PendingReconciliationComponent
     */
    public sortChange(event: Sort): void {
        if (!event?.direction || event.active !== "date") {
            this.filters.sort = "";
            this.filters.sortBy = "";
        } else {
            this.filters.sort = event.direction;
            this.filters.sortBy = "date";
        }
        this.filters.page = 1;
        this.persistAndLoad();
    }

    /**
     * @param {PageEvent} event
     * @memberof PendingReconciliationComponent
     */
    public handlePageChange(event: PageEvent): void {
        this.filters.page = this.filters.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.filters.count = event.pageSize;
        this.persistAndLoad();
    }

    /**
     * @param {*} event
     * @param {string} fieldName
     * @memberof PendingReconciliationComponent
     */
    public toggleSearch(event: Event, fieldName: string): void {
        event.stopPropagation();
        if (fieldName === "number") {
            this.showNumberSearch = true;
            this.showPartySearch = false;
        } else {
            this.showPartySearch = true;
            this.showNumberSearch = false;
        }
    }

    /**
     * @param {*} event
     * @param {*} element
     * @param {string} fieldName
     * @memberof PendingReconciliationComponent
     */
    public handleClickOutside(event: any, element: any, fieldName: string): void {
        const control = fieldName === "number" ? this.numberInput : this.partyInput;
        if (control.value) {
            return;
        }
        if (this.generalService.childOf(event?.target, element)) {
            return;
        }
        if (fieldName === "number") {
            this.showNumberSearch = false;
        } else {
            this.showPartySearch = false;
        }
    }

    /**
     * @param {*} row
     * @memberof PendingReconciliationComponent
     */
    public openDocument(row: any): void {
        if (!row?.uniqueName) {
            return;
        }
        const viewType = row.source === "VOUCHER"
            ? (row.voucherType || VoucherTypeEnum.sales)
            : this.voucherType;
        this.router.navigate(["/pages/vouchers/view", viewType, row.uniqueName]);
    }

    /**
     * Direct convert — same API as voucher list convertInventoryDocument
     * Pending Invoice: DC → Invoice/Bill
     * Pending DC: Invoice/Bill → DC/RN
     *
     * @param {*} row
     * @memberof PendingReconciliationComponent
     */
    public convertDocument(row: any): void {
        if (!row?.uniqueName) {
            return;
        }
        this.voucherService.convertInventoryDocuments([row.uniqueName])
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response) => {
                if (response?.status === "success") {
                    this.toasterService.showSnackBar("success", this.localeData?.document_converted_successfully
                        || "Document converted successfully");
                    this.loadReport();
                } else if (response?.message) {
                    this.toasterService.showSnackBar("error", response.message);
                }
            });
    }

    /**
     * Preview & convert — opens create page with query params to prefill
     * Pending Invoice: sales/purchase create with dcUniqueName/rnUniqueName
     * Pending DC: delivery-challan/receipt-note create with invoiceUniqueName/billUniqueName
     *
     * @param {*} row
     * @memberof PendingReconciliationComponent
     */
    public previewAndConvertDocument(row: any): void {
        if (!row?.uniqueName) {
            return;
        }

        const redirect = this.router.url;
        this.saveFilters();

        if (this.isWithoutChallanReport) {
            // Invoice/Bill → create DC/RN
            const createType = this.voucherType === VoucherTypeEnum.receiptNote
                ? VoucherTypeEnum.receiptNote
                : VoucherTypeEnum.deliveryChallan;
            const queryParams = this.voucherType === VoucherTypeEnum.receiptNote
                ? {
                    billUniqueName: row.uniqueName,
                    accountUniqueName: row.accountUniqueName,
                    redirect
                }
                : {
                    invoiceUniqueName: row.uniqueName,
                    accountUniqueName: row.accountUniqueName,
                    redirect
                };
            this.router.navigate([`/pages/vouchers/${createType}/create`], { queryParams });
            return;
        }

        // DC/RN → create Invoice/Bill (same as list previewAndConvertInventoryDocument)
        const createVoucherType = this.voucherType === VoucherTypeEnum.receiptNote
            ? VoucherTypeEnum.purchase
            : VoucherTypeEnum.sales;
        const queryParams = this.voucherType === VoucherTypeEnum.receiptNote
            ? { rnUniqueName: row.uniqueName, redirect }
            : { dcUniqueName: row.uniqueName, redirect };
        this.router.navigate([`/pages/vouchers/${createVoucherType}/create`], { queryParams });
    }

    /**
     * @private
     * @memberof PendingReconciliationComponent
     */
    private bindSearch(): void {
        this.numberInput.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(value => {
            if (this.suppressSearch || !this.filtersReady) {
                return;
            }
            this.searchColumn = "number";
            this.partyInput.patchValue("", { emitEvent: false });
            this.applySearch(value);
        });
        this.partyInput.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(value => {
            if (this.suppressSearch || !this.filtersReady) {
                return;
            }
            this.searchColumn = "party";
            this.numberInput.patchValue("", { emitEvent: false });
            this.applySearch(value);
        });
    }

    /**
     * @private
     * @param {string} value
     * @memberof PendingReconciliationComponent
     */
    private applySearch(value: string): void {
        this.filters.q = value || "";
        this.filters.page = 1;
        this.isSearching = true;
        this.userHasAppliedFilter = true;
        this.refreshAppliedState();
        this.persistAndLoad();
    }

    /**
     * @private
     * @memberof PendingReconciliationComponent
     */
    private bindReportLoader(): void {
        this.fetch$.pipe(
            switchMap(() => {
                this.loading = true;
                return this.voucherService.getPendingBusinessDocumentReport({
                    from: this.filters.from,
                    to: this.filters.to,
                    q: this.filters.q || "",
                    page: this.filters.page,
                    count: this.filters.count,
                    sort: this.filters.sort || "",
                    sortBy: this.filters.sortBy || ""
                }, {
                    reportType: this.filters.reportType,
                    documentType: this.documentType
                }).pipe(finalize(() => {
                    this.loading = false;
                }));
            }),
            takeUntil(this.destroyed$)
        ).subscribe(response => this.handleResponse(response));
    }

    /**
     * @private
     * @param {string} voucherType
     * @memberof PendingReconciliationComponent
     */
    private setVoucherType(voucherType: string): void {
        this.voucherType = voucherType === VoucherTypeEnum.receiptNote
            ? VoucherTypeEnum.receiptNote
            : VoucherTypeEnum.deliveryChallan;
        this.documentType = this.voucherType === VoucherTypeEnum.receiptNote ? "RC" : "DC";
        this.filtersReady = false;
    }

    /**
     * Builds report type dropdown options from locale
     *
     * @memberof PendingReconciliationComponent
     */
    public setReportTypeOptions(): void {
        const isReceiptNote = this.voucherType === VoucherTypeEnum.receiptNote;
        const labels = isReceiptNote
            ? (this.localeData?.pending_report_types_rn || {})
            : (this.localeData?.pending_report_types || {});
        this.reportTypeOptions = this.reportTypes.map(value => ({
            value,
            label: labels[value] || (
                isReceiptNote
                    ? this.getReceiptNoteReportLabel(value)
                    : this.getDeliveryChallanReportLabel(value)
            )
        }));
    }

    /**
     * Locale callback for translated labels
     *
     * @param {*} event
     * @memberof PendingReconciliationComponent
     */
    public onLocaleData(event: any): void {
        this.localeData = event;
        this.setReportTypeOptions();
    }

    /**
     * @private
     * @return {Promise<boolean>}
     * @memberof PendingReconciliationComponent
     */
    private ensureFilterRoute(): Promise<boolean> {
        const params = this.route.snapshot.queryParams || {};
        if (params.required === "report" && params.report === "pending") {
            return Promise.resolve(true);
        }
        return this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { required: "report", report: "pending" },
            queryParamsHandling: "merge",
            replaceUrl: true
        });
    }

    /**
     * @private
     * @memberof PendingReconciliationComponent
     */
    private initFilters(): void {
        const snapshotParams = this.route.snapshot.queryParams || {};
        const saved = this.generalService.getRouteQueryFiltersForPath() ?? {};
        const hasSavedFilters = Object.keys(saved).some(key => !["required", "report"].includes(key) && saved[key] != null && saved[key] !== "");
        const hasFiltersInUrl = !!(
            snapshotParams.from
            || snapshotParams.to
            || snapshotParams.q
            || snapshotParams.sort
            || snapshotParams.sortBy
            || snapshotParams.reportType
        );
        const params = hasSavedFilters
            ? { ...snapshotParams, ...saved }
            : snapshotParams;

        this.applyFiltersFromParams(params);
        if (!this.filters.from || !this.filters.to) {
            this.applyUniversalDate(this.universalDate);
        }
        this.loadReport();
        if (!(hasSavedFilters && (snapshotParams.required || !hasFiltersInUrl))) {
            this.saveFilters();
        }
        this.filtersReady = true;
    }

    /**
     * @private
     * @param {*} params
     * @memberof PendingReconciliationComponent
     */
    private applyFiltersFromParams(params: any): void {
        if (!params) {
            return;
        }
        if (params.from && params.to) {
            this.filters.from = params.from;
            this.filters.to = params.to;
            this.selectedDateRange = {
                startDate: dayjs(params.from, GIDDH_DATE_FORMAT),
                endDate: dayjs(params.to, GIDDH_DATE_FORMAT)
            };
            this.selectedDateRangeUi = this.formatRangeLabel(
                dayjs(params.from, GIDDH_DATE_FORMAT),
                dayjs(params.to, GIDDH_DATE_FORMAT)
            );
            if (this.universalDate?.length > 1) {
                const universalFrom = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                const universalTo = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.isUniversalDateApplicable = params.from === universalFrom && params.to === universalTo;
            }
        }
        if (params.page) {
            this.filters.page = Number(params.page) || 1;
        }
        if (params.count) {
            this.filters.count = Number(params.count) || this.pageSizeOptions[2];
        }
        if (params.sort === "asc" || params.sort === "desc") {
            this.filters.sort = params.sort;
        }
        if (params.sortBy === "date") {
            this.filters.sortBy = "date";
        }
        if (this.reportTypes.includes(params.reportType)) {
            this.filters.reportType = params.reportType;
        }
        if (params.q) {
            this.filters.q = params.q;
            this.searchColumn = params.searchColumn === "party" ? "party" : "number";
            this.suppressSearch = true;
            if (this.searchColumn === "party") {
                this.partyInput.patchValue(params.q, { emitEvent: false });
                this.showPartySearch = true;
            } else {
                this.numberInput.patchValue(params.q, { emitEvent: false });
                this.showNumberSearch = true;
            }
            this.suppressSearch = false;
            this.isSearching = true;
        }
        this.refreshAppliedState();
    }

    /**
     * Applies application universal date to page filters (same pattern as voucher list)
     *
     * @private
     * @param {*} response
     * @memberof PendingReconciliationComponent
     */
    private handleUniversalDateChange(response: any): void {
        this.universalDate = response;

        if (localStorage.getItem("universalSelectedDate")) {
            const universalStorageData = localStorage.getItem("universalSelectedDate").split(",");
            const storageMatches =
                dayjs(universalStorageData[0]).format(GIDDH_DATE_FORMAT) === dayjs(response[0]).format(GIDDH_DATE_FORMAT)
                && dayjs(universalStorageData[1]).format(GIDDH_DATE_FORMAT) === dayjs(response[1]).format(GIDDH_DATE_FORMAT);

            if (storageMatches && window.localStorage && localStorage.getItem("pendingReportSelectedDate")) {
                const storedSelectedDate = JSON.parse(localStorage.getItem("pendingReportSelectedDate"));
                if (storedSelectedDate?.fromDates && storedSelectedDate?.toDates) {
                    const dateRange = this.generalService.dateConversionToSetComponentDatePicker(
                        storedSelectedDate.fromDates,
                        storedSelectedDate.toDates
                    );
                    this.selectedDateRange = { startDate: dayjs(dateRange.fromDate), endDate: dayjs(dateRange.toDate) };
                    this.selectedDateRangeUi = this.formatRangeLabel(dateRange.fromDate, dateRange.toDate);
                    this.filters.from = storedSelectedDate.fromDates;
                    this.filters.to = storedSelectedDate.toDates;
                    this.isUniversalDateApplicable = false;
                } else {
                    this.applyUniversalDate(response);
                    this.isUniversalDateApplicable = true;
                }
            } else if (storageMatches) {
                this.applyUniversalDate(response);
                this.isUniversalDateApplicable = true;
            } else {
                this.applyUniversalDate(response);
                this.isUniversalDateApplicable = true;
                if (window.localStorage) {
                    localStorage.removeItem("pendingReportSelectedDate");
                }
            }
        } else {
            this.applyUniversalDate(response);
            this.isUniversalDateApplicable = true;
            if (window.localStorage) {
                localStorage.setItem("universalSelectedDate", response);
                localStorage.removeItem("pendingReportSelectedDate");
            }
        }

        this.filters.page = 1;
        this.refreshAppliedState();
        this.persistAndLoad();
    }

    /**
     * @private
     * @param {*} date
     * @memberof PendingReconciliationComponent
     */
    private applyUniversalDate(date: any): void {
        if (!date || date.length < 2) {
            return;
        }
        this.selectedDateRange = { startDate: dayjs(date[0]), endDate: dayjs(date[1]) };
        this.selectedDateRangeUi = this.formatRangeLabel(date[0], date[1]);
        this.filters.from = dayjs(date[0]).format(GIDDH_DATE_FORMAT);
        this.filters.to = dayjs(date[1]).format(GIDDH_DATE_FORMAT);
    }

    /**
     * @private
     * @param {boolean} [replaceOnly=false]
     * @memberof PendingReconciliationComponent
     */
    private persistAndLoad(replaceOnly: boolean = false): void {
        this.saveFilters(replaceOnly);
        this.loadReport();
    }

    /**
     * @private
     * @param {boolean} [replaceOnly=false]
     * @memberof PendingReconciliationComponent
     */
    private saveFilters(replaceOnly: boolean = false): void {
        this.generalService.saveRouteQueryFilters({
            required: "report",
            report: "pending",
            from: this.filters.from || null,
            to: this.filters.to || null,
            page: this.filters.page || 1,
            count: this.filters.count || null,
            q: this.filters.q || null,
            sort: this.filters.sort || null,
            sortBy: this.filters.sortBy || null,
            reportType: this.filters.reportType || null,
            searchColumn: this.filters.q ? this.searchColumn : null
        }, replaceOnly);
    }

    /**
     * @private
     * @memberof PendingReconciliationComponent
     */
    private loadReport(): void {
        if (!this.filters.from || !this.filters.to) {
            return;
        }
        this.fetch$.next();
    }

    /**
     * @private
     * @param {*} response
     * @memberof PendingReconciliationComponent
     */
    private handleResponse(response: any): void {
        if (response?.status === "error") {
            if (response.message) {
                this.toasterService.showSnackBar("error", response.message);
            }
            this.dataSource = [];
            this.totalResults = 0;
            this.balances = null;
            return;
        }
        const body = response?.body ?? {};
        const items = Array.isArray(body.results) ? body.results : [];
        this.totalResults = body.totalItems ?? items.length;
        this.balances = body.balances ?? null;
        this.dataSource = items.map(item => this.normalizeRow(item));
    }

    /**
     * @private
     * @param {*} item
     * @return {*}
     * @memberof PendingReconciliationComponent
     */
    private normalizeRow(item: any): any {
        const account = item.account ?? {};
        return {
            uniqueName: item.uniqueName,
            voucherNumber: item.number,
            voucherDate: item.date,
            source: item.source,
            voucherType: item.voucherType,
            documentSubType: item.documentSubType || "",
            partyName: account.name,
            accountUniqueName: account.uniqueName,
            grandTotal: item.grandTotal,
            currencySymbol: this.company.baseCurrencySymbol,
            currencyCode: this.company.baseCurrency,
            invoiceStatus: item.invoiceStatus,
            invoiceStatusLabel: this.getInvoiceStatusLabel(item.invoiceStatus),
            documentStatus: item.statusName || item.status?.statusName || "",
            linkedInvoiceCount: item.linkedInvoiceCount ?? 0
        };
    }

    /**
     * Maps API invoiceStatus code to display label
     *
     * @private
     * @param {string} status
     * @return {string}
     * @memberof PendingReconciliationComponent
     */
    private getInvoiceStatusLabel(status: string): string {
        if (!status) {
            return "";
        }
        const isReceiptNote = this.voucherType === VoucherTypeEnum.receiptNote;
        const labels = this.localeData?.inventory_invoice_status || {};
        const statusMap: Record<string, string> = {
            NOT_INVOICED: isReceiptNote ? (labels.not_billed || "Not Billed") : (labels.not_invoiced || "Not Invoiced"),
            PARTIALLY_INVOICED: isReceiptNote
                ? (labels.partially_billed || "Partially Billed")
                : (labels.partially_invoiced || "Partially Invoiced"),
            FULLY_INVOICED: isReceiptNote ? (labels.billed || "Billed") : (labels.invoiced || "Invoiced"),
            INVOICED: isReceiptNote ? (labels.billed || "Billed") : (labels.invoiced || "Invoiced")
        };
        return statusMap[status] || status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    }

    /**
     * @private
     * @memberof PendingReconciliationComponent
     */
    private refreshAppliedState(): void {
        if (!this.userHasAppliedFilter) {
            this.filtersApplied = false;
            return;
        }
        this.filtersApplied = !!(this.filters.q || !this.isUniversalDateApplicable);
    }

    /**
     * @private
     * @return {PendingReportFilters}
     * @memberof PendingReconciliationComponent
     */
    private createDefaultFilters(): PendingReportFilters {
        return {
            from: "",
            to: "",
            q: "",
            page: 1,
            count: this.pageSizeOptions[2],
            sort: "",
            sortBy: "",
            reportType: "WITHOUT_CHALLAN"
        };
    }

    /**
     * @private
     * @param {PendingReportType} value
     * @return {string}
     * @memberof PendingReconciliationComponent
     */
    private getDeliveryChallanReportLabel(value: PendingReportType): string {
        const labels: Record<PendingReportType, string> = {
            WITHOUT_CHALLAN: "Pending DC",
            NOT_INVOICED: "Pending Invoice"
        };
        return labels[value];
    }

    /**
     * @private
     * @param {PendingReportType} value
     * @return {string}
     * @memberof PendingReconciliationComponent
     */
    private getReceiptNoteReportLabel(value: PendingReportType): string {
        const labels: Record<PendingReportType, string> = {
            WITHOUT_CHALLAN: "Pending RN",
            NOT_INVOICED: "Pending Bill"
        };
        return labels[value];
    }

    /**
     * @private
     * @param {*} start
     * @param {*} end
     * @return {string}
     * @memberof PendingReconciliationComponent
     */
    private formatRangeLabel(start: any, end: any): string {
        return dayjs(start).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(end).format(GIDDH_NEW_DATE_FORMAT_UI);
    }
}

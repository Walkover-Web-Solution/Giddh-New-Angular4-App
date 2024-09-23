import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy, TemplateRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { InvoiceReceiptActions } from '../../../actions/invoice/receipt/receipt.actions';
import { ReportsDetailedRequestFilter, PurchaseRegisteDetailedResponse } from '../../../models/api-models/Reports';
import { ActivatedRoute, Router } from '@angular/router';
import { take, takeUntil, debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { ReplaySubject, Observable } from 'rxjs';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { UntypedFormControl } from '@angular/forms';
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT, ZIP_CODE_SUPPORTED_COUNTRIES } from '../../../app.constant';
import { CurrentCompanyState } from '../../../store/company/company.reducer';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GeneralService } from '../../../services/general.service';
import { MatDialog } from '@angular/material/dialog';
import { SalesPurchaseRegisterExportComponent } from '../../sales-purchase-register-export/sales-purchase-register-export.component';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_MM_DD_YYYY, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as dayjs from 'dayjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: "purchase-register-expand",
    templateUrl: "./purchase.register.expand.component.html",
    styleUrls: ["./purchase.register.expand.component.scss"],
})
export class PurchaseRegisterExpandComponent implements OnInit, OnDestroy {
    public PurchaseRegisteDetailedItems: PurchaseRegisteDetailedResponse;
    public from: string;
    public to: string;
    public purchaseRegisteDetailedResponse$: Observable<PurchaseRegisteDetailedResponse>;
    public isGetPurchaseDetailsInProcess$: Observable<boolean>;
    public isGetPurchaseDetailsSuccess$: Observable<boolean>;
    public getDetailedPurchaseRequestFilter: ReportsDetailedRequestFilter = new ReportsDetailedRequestFilter();
    public selectedMonth: string;
    public showSearchInvoiceNo: boolean = false;
    /** Pagination limit for records */
    public paginationLimit: number = PAGINATION_LIMIT;
    /** True, if company country supports other tax (TCS/TDS) */
    public isTcsTdsApplicable: boolean;

    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    // searching
    @ViewChild('invoiceSearch', { static: true }) public invoiceSearch: ElementRef;
    @ViewChild('filterDropDownList', { static: true }) public filterDropDownList: BsDropdownDirective;
    /** Directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    public voucherNumberInput: UntypedFormControl = new UntypedFormControl();
    public monthNames = [];
    public monthYear: string[] = [];
    public modalUniqueName: string;
    public imgPath: string;
    public expand: boolean = false;
    public showFieldFilter = {
        date: false,
        account: false,
        voucher_type: false,
        voucher_no: false,
        purchase: false,
        return: false,
        qty_rate: false,
        qty_unit: false,
        value: false,
        discount: false,
        tax: false,
        net_purchase: false,
        parent_group: false,
        purchase_account: false,
        tax_no: false,
        address: false,
        pincode: false,
        email: false,
        mobile_no: false,
    };
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /* This will hold if it's mobile screen or not */
    public isMobileScreen: boolean = false;
    /** True, if custom date filter is selected or custom searching or sorting is performed */
    public showClearFilter: boolean = false;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2;
    /* This will hold module type */
    public moduleType = "PURCHASE_REGISTER";
    /** This will use for purchase register column check values */
    public customiseColumns = [];
    /** This will use for purchase register displayed columns */
    public displayedColumns: any[] = [];
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Universal date observer */
    public universalDate$: Observable<any>;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** Modal reference */
    public modalRef: BsModalRef;
    /** Hold initial params data */
    private params: any = { from: '', to: '' };
    /**True if API called on single time */
    public isDefaultLoaded: boolean = false;
    /** Hold active company country code */
    public activeCompanyCountryCode: string = '';
    /** Holds list of countries which use ZIP Code in address */
    public zipCodeSupportedCountryList: string[] = ZIP_CODE_SUPPORTED_COUNTRIES;
    /** Datasource of Purchase Register report */
    public dataSource: MatTableDataSource<any> = new MatTableDataSource();
    
    constructor(
        private store: Store<AppState>,
        private invoiceReceiptActions: InvoiceReceiptActions,
        private activeRoute: ActivatedRoute,
        private router: Router,
        private _cd: ChangeDetectorRef,
        private breakPointObservar: BreakpointObserver,
        private generalService: GeneralService,
        private dialog: MatDialog,
        private modalService: BsModalService
    ) {
        this.purchaseRegisteDetailedResponse$ = this.store.pipe(
            select((appState) => appState.receipt.PurchaseRegisteDetailedResponse),
            takeUntil(this.destroyed$)
        );
        this.isGetPurchaseDetailsInProcess$ = this.store.pipe(
            select((p) => p.receipt.isGetPurchaseDetailsInProcess),
            takeUntil(this.destroyed$)
        );
        this.isGetPurchaseDetailsSuccess$ = this.store.pipe(
            select((p) => p.receipt.isGetPurchaseDetailsSuccess),
            takeUntil(this.destroyed$)
        );
        this.breakPointObservar
            .observe(["(max-width: 767px)"])
            .pipe(takeUntil(this.destroyed$))
            .subscribe((result) => {
                this.isMobileScreen = result.matches;
            });
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), skip(1), takeUntil(this.destroyed$));
    }

    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.imgPath = isElectron ? "assets/icon/" : AppUrl + APP_FOLDER + "assets/icon/";
        this.getDetailedPurchaseRequestFilter.page = 1;
        this.getDetailedPurchaseRequestFilter.count = this.paginationLimit;
        this.getDetailedPurchaseRequestFilter.q = "";
        this.store
            .pipe(
                select((appState) => appState.company),
                takeUntil(this.destroyed$)
            )
            .subscribe((companyData: CurrentCompanyState) => {
                if (companyData) {
                    this.isTcsTdsApplicable = companyData.isTcsTdsApplicable;
                }
            });

        this.isGetPurchaseDetailsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(success => {
            if (success) {
                this.isDefaultLoaded = true;
            }
        });

        this.activeRoute.queryParams.pipe(take(1)).subscribe((params) => {
            if (params.from && params.to) {
                this.from = params.from;
                this.to = params.to;
                this.getDetailedPurchaseRequestFilter.from = this.from;
                this.getDetailedPurchaseRequestFilter.to = this.to;
                this.getDetailedPurchaseRequestFilter.branchUniqueName = params.branchUniqueName;
                this.params = params;
                this.setDataPickerDateRange();
                this.getDetailedPurchaseReport(this.getDetailedPurchaseRequestFilter);
            }
        });

        /** Universal date observer */
        this.universalDate$.subscribe(dateObj => {
            if (dateObj && this.isDefaultLoaded) {
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.from = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.to = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                this.getDetailedPurchaseRequestFilter.from = this.from;
                this.getDetailedPurchaseRequestFilter.to = this.to;
                this.getDetailedPurchaseReport(this.getDetailedPurchaseRequestFilter);
            }
        });

        this.purchaseRegisteDetailedResponse$
            .pipe(takeUntil(this.destroyed$))
            .subscribe((res: PurchaseRegisteDetailedResponse) => {
                if (res) {
                    this.PurchaseRegisteDetailedItems = res;
                    this.dataSource.data = this.PurchaseRegisteDetailedItems.items.map((obj: any) => {
                        obj.date = this.getDateToDMY(obj.date);
                        return obj;
                    });
                    if (this.voucherNumberInput?.value) {
                        setTimeout(() => {
                            this.invoiceSearch?.nativeElement.focus();
                        }, 200);
                    }
                }
                setTimeout(() => {
                    this.detectChange();
                }, 200);
            });

        this.voucherNumberInput?.valueChanges
            ?.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe((s) => {
                if (s !== null && s !== undefined) {
                    this.showClearFilter = true;
                    this.getDetailedPurchaseRequestFilter.sort = null;
                    this.getDetailedPurchaseRequestFilter.sortBy = null;
                    this.getDetailedPurchaseRequestFilter.q = s;
                    this.getDetailedPurchaseReport(this.getDetailedPurchaseRequestFilter);
                    this.showSearchInvoiceNo = false;
                }
            });
        this.customiseColumns = [
            {
                "value": "date",
                "label": "Date",
                "checked": true,
            },
            {
                "value": "account",
                "label": "Account",
                "checked": true,
            },
            {
                "value": "parent_group",
                "label": "Parent Group",
                "checked": false,
            },
            {
                "value": "tax_no",
                "label": "Tax no.",
                "checked": false,
            },
            {
                "value": "address",
                "label": "Address",
                "checked": false,
            },
            {
                "value": "pincode",
                "label": "Pincode",
                "checked": false,
            },
            {
                "value": "email",
                "label": "Email",
                "checked": false,
            },
            {
                "value": "mobile_no",
                "label": "Mobile No.",
                "checked": false,
            },
            {
                "value": "purchase_account",
                "label": "Purchase Account",
                "checked": false,
            },
            {
                "value": "voucher_type",
                "label": "Voucher Type",
                "checked": true,
            },
            {
                "value": "voucher_no",
                "label": "Voucher No.",
                "checked": true,
            },
            {
                "value": "purchase",
                "label": "Purchase",
                "checked": true,
            },
            {
                "value": "return",
                "label": "Return",
                "checked": true,
            },
            {
                "value": "qty_unit",
                "label": "Qty-Unit",
                "checked": true
            },
            {
                "value": "qty_rate",
                "label": "Rate",
                "checked": true,
            },
            {
                "value": "discount",
                "label": "Discount",
                "checked": true,
            },
            {
                "value": "tax",
                "label": "Tax",
                "checked": true,
            },
            {
                "value": "net_purchase",
                "label": "Net Purchase",
                "checked": true,
            },
        ];

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompanyCountryCode = activeCompany.countryV2?.alpha2CountryCode;
            }
        });
    }

    public getDetailedPurchaseReport(PurchaseDetailedfilter) {
        setTimeout(() => {
            this.detectChange();
        }, 200);
        this.store.dispatch(this.invoiceReceiptActions.GetPurchaseRegistedDetails(PurchaseDetailedfilter));
    }

    public pageChanged(ev: any): void {
        if (ev.page === this.getDetailedPurchaseRequestFilter.page) {
            return;
        }
        this.getDetailedPurchaseRequestFilter.page = ev.page;
        this.getDetailedPurchaseReport(this.getDetailedPurchaseRequestFilter);
    }

    public sortbyApi(ord, key) {
        this.showClearFilter = true;
        this.getDetailedPurchaseRequestFilter.sortBy = key;
        this.getDetailedPurchaseRequestFilter.sort = ord;
        this.getDetailedPurchaseReport(this.getDetailedPurchaseRequestFilter);
    }

    /**
     * Redirects to Purchase Register Page
     *
     * @memberof PurchaseRegisterExpandComponent
     */
    public gotoPurchaseRegister(): void {
        this.activeRoute.queryParams.pipe(take(1)).subscribe((params) => {
            this.router.navigate(["pages", "reports", "purchase-register"], {
                queryParams: {
                    from: params.from,
                    to: params.to,
                    branchUniqueName: params.branchUniqueName,
                    interval: params.interval,
                    selectedMonth: params.selectedMonth,
                },
            });
        });
    }

    /**
     * emitExpand
     */
    public emitExpand() {
        this.expand = !this.expand;
    }

    public columnFilter(event, column) {
        if (event && column) {
            this.showFieldFilter[column] = event;
        }
    }

    public hideListItems() {
        if (this.filterDropDownList.isOpen) {
            this.filterDropDownList.hide();
        }
    }

    public goToDashboard(val: boolean) {
        if (val) {
            this.router.navigate(["/pages/reports"]);
        } else {
            this.router.navigate(["/pages/reports", "purchase-register"]);
        }
    }

    public getDateToDMY(selecteddate) {
        let date = selecteddate.split("-");
        if (date?.length === 3) {
            this.translationComplete(true);
            let month = this.monthNames[parseInt(date[1]) - 1]?.substr(0, 3);
            let year = date[2]?.substr(2, 4);
            return date[0] + " " + month + " " + year;
        } else {
            return selecteddate;
        }
    }

    public getCurrentMonthYear() {
        if (this.from && this.to) {
            let currentYearFrom = this.from.split("-")[2];
            let currentYearTo = this.to.split("-")[2];
            let idx = this.from.split("-");
            this.monthYear = [];
            if (currentYearFrom === currentYearTo) {
                this.monthNames.forEach((element) => {
                    this.monthYear.push(element + " " + currentYearFrom);
                });
            }
            this.selectedMonth = this.monthYear[parseInt(idx[1]) - 1];
        }
    }

    public selectedFilterMonth(monthYridx: string, i) {
        let date = this.getDateFromMonth(i);
        this.getDetailedPurchaseRequestFilter.from = date.firstDay;
        this.getDetailedPurchaseRequestFilter.to = date.lastDay;
        this.getDetailedPurchaseRequestFilter.q = "";
        this.selectedMonth = monthYridx;
        this.getDetailedPurchaseReport(this.getDetailedPurchaseRequestFilter);
    }

    public getDateFromMonth(selectedMonth) {
        let mdyFrom = this.from.split("-");
        let mdyTo = this.to.split("-");

        let startDate;

        if (mdyFrom[1] > selectedMonth) {
            startDate = "01-" + (selectedMonth - 1) + "-" + mdyTo[2];
        } else {
            startDate = "01-" + (selectedMonth - 1) + "-" + mdyFrom[2];
        }
        let startDateSplit = startDate.split("-");
        let dt = new Date(startDateSplit[2], startDateSplit[1], startDateSplit[0]);
        // GET THE MONTH AND YEAR OF THE SELECTED DATE.
        let month = (dt.getMonth() + 1)?.toString(),
            year = dt.getFullYear();

        // GET THE FIRST AND LAST DATE OF THE MONTH.
        if (parseInt(month) < 10) {
            month = "0" + month;
        }
        let firstDay = "01-" + month + "-" + year;
        let lastDay = new Date(year, parseInt(month), 0).getDate() + "-" + month + "-" + year;

        return { firstDay, lastDay };
    }

    public toggleSearch(fieldName: string) {
        if (fieldName === "invoiceNumber") {
            this.showSearchInvoiceNo = true;
            setTimeout(() => {
                this.invoiceSearch?.nativeElement.focus();
            }, 200);
        } else {
            this.showSearchInvoiceNo = false;
        }
        this.detectChange();
    }

    public clickedOutsideEvent() {
        this.showSearchInvoiceNo = false;
    }

    detectChange() {
        if (!this._cd["destroyed"]) {
            this._cd.detectChanges();
        }
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof PurchaseRegisterExpandComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            this.customiseColumns = this.customiseColumns?.map((column) => {
                column.label = this.localeData[column.value];
                return column;
            });
            this.monthNames = [
                this.commonLocaleData?.app_months_full.january,
                this.commonLocaleData?.app_months_full.february,
                this.commonLocaleData?.app_months_full.march,
                this.commonLocaleData?.app_months_full.april,
                this.commonLocaleData?.app_months_full.may,
                this.commonLocaleData?.app_months_full.june,
                this.commonLocaleData?.app_months_full.july,
                this.commonLocaleData?.app_months_full.august,
                this.commonLocaleData?.app_months_full.september,
                this.commonLocaleData?.app_months_full.october,
                this.commonLocaleData?.app_months_full.november,
                this.commonLocaleData?.app_months_full.december,
            ];
            this.getCurrentMonthYear();
        }
    }

    /**
     * Resets the advance search when user clicks on Clear Filter
     *
     * @memberof PurchaseRegisterExpandComponent
     */
    public resetAdvanceSearch() {
        this.showClearFilter = false;
        this.voucherNumberInput?.reset();
        this.showSearchInvoiceNo = false;
        this.getDetailedPurchaseRequestFilter.page = 1;
        this.getDetailedPurchaseRequestFilter.count = this.paginationLimit;
        this.getDetailedPurchaseRequestFilter.q = "";
        this.getDetailedPurchaseRequestFilter.sort = null;
        this.getDetailedPurchaseRequestFilter.sortBy = null;
        this.getDetailedPurchaseRequestFilter.from = this.params?.from;
        this.getDetailedPurchaseRequestFilter.to = this.params?.to;
        this.setDataPickerDateRange();
        this.getDetailedPurchaseReport(this.getDetailedPurchaseRequestFilter);
    }

    /**
     * Releases memory
     *
     * @memberof PurchaseRegisterExpandComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Exports purchase register detailed report
     *
     * @memberof PurchaseRegisterExpandComponent
     */
    public export(): void {
        let exportData = {
            from: this.from,
            to: this.to,
            exportType: "PURCHASE_REGISTER_DETAILED_EXPORT",
            fileType: "CSV",
            isExpanded: this.expand,
            q: this.voucherNumberInput?.value,
            branchUniqueName: this.getDetailedPurchaseRequestFilter?.branchUniqueName,
            commonLocaleData: this.commonLocaleData,
            localeData: this.localeData,
        };
        this.dialog.open(SalesPurchaseRegisterExportComponent, {
            width: "630px",
            panelClass: 'export-container',
            data: exportData,
        });
    }

    /**
     * This will use for show hide main table columns from customise columns
     *
     * @param {*} event
     * @memberof PurchaseRegisterExpandComponent
     */
    public getSelectedTableColumns(event: any): void {
        this.displayedColumns = event;
        const displayColumnsSet = new Set(this.displayedColumns);
        Object.keys(this.showFieldFilter).forEach((key) => (this.showFieldFilter[key] = displayColumnsSet.has(key)));
    }

    /**
    *To show the datepicker
    *
    * @param {*} element
    * @memberof PurchaseRegisterExpandComponent
    */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
    }

    /**
     * This will hide the datepicker
     *
     * @memberof PurchaseRegisterExpandComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof PurchaseRegisterExpandComponent
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
            this.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.showClearFilter = true;
            this.getDetailedPurchaseRequestFilter.from = this.from;
            this.getDetailedPurchaseRequestFilter.to = this.to;
            this.getDetailedPurchaseReport(this.getDetailedPurchaseRequestFilter);
        }
    }
    /**
     * Set the initial date range from query params
     *
     * @private
     * @memberof SalesRegisterExpandComponent
     */
    private setDataPickerDateRange(): void {
        let dateRange = { fromDate: '', toDate: '' };
        dateRange = this.generalService.dateConversionToSetComponentDatePicker(this.params?.from, this.params?.to);
        this.selectedDateRange = { startDate: dayjs(dateRange.fromDate, GIDDH_DATE_FORMAT_MM_DD_YYYY), endDate: dayjs(dateRange.toDate, GIDDH_DATE_FORMAT_MM_DD_YYYY) };
        this.selectedDateRangeUi = dayjs(dateRange.fromDate, GIDDH_DATE_FORMAT_MM_DD_YYYY).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateRange.toDate, GIDDH_DATE_FORMAT_MM_DD_YYYY).format(GIDDH_NEW_DATE_FORMAT_UI);
    }
}

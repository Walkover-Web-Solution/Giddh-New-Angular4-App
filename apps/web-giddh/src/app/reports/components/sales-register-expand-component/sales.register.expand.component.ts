import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { InvoiceReceiptActions } from '../../../actions/invoice/receipt/receipt.actions';
import { ReportsDetailedRequestFilter, SalesRegisteDetailedResponse } from '../../../models/api-models/Reports';
import { ActivatedRoute, Router } from '@angular/router';
import { take, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ReplaySubject, Observable } from 'rxjs';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { FormControl } from '@angular/forms';
import { PAGINATION_LIMIT } from '../../../app.constant';
import { CurrentCompanyState } from '../../../store/company/company.reducer';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GeneralService } from '../../../services/general.service';
import { ExportBodyRequest } from '../../../models/api-models/DaybookRequest';
import { LedgerService } from '../../../services/ledger.service';
import { ToasterService } from '../../../services/toaster.service';

@Component({
    selector: 'sales-register-expand',
    templateUrl: './sales.register.expand.component.html',
    styleUrls: ['./sales.register.expand.component.scss']
})
export class SalesRegisterExpandComponent implements OnInit, OnDestroy {
    public SalesRegisteDetailedItems: SalesRegisteDetailedResponse;
    public from: string;
    public to: string;
    /** Sales register detail response */
    public salesRegisteDetailedResponse$: Observable<SalesRegisteDetailedResponse>;
    public isGetSalesDetailsInProcess$: Observable<boolean>;
    public isGetSalesDetailsSuccess$: Observable<boolean>;
    public getDetailedsalesRequestFilter: ReportsDetailedRequestFilter = new ReportsDetailedRequestFilter();
    public selectedMonth: string;
    // public showSearchCustomer: boolean = false;
    public showSearchInvoiceNo: boolean = false;
    /** Pagination limit for records */
    public paginationLimit: number = PAGINATION_LIMIT;
    /** True, if company country supports other tax (TCS/TDS) */
    public isTcsTdsApplicable: boolean;

    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    // searching
    @ViewChild('invoiceSearch', { static: true }) public invoiceSearch: ElementRef;
    @ViewChild('filterDropDownList', { static: true }) public filterDropDownList: BsDropdownDirective;

    public voucherNumberInput: FormControl = new FormControl();
    public monthNames = [];
    public monthYear: string[] = [];
    public modalUniqueName: string;
    public imgPath: string;
    public expand: boolean = false;
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
    public moduleType = 'SALES_REGISTER';
    /** This will use for sales register column check values */
    public customiseColumns = [];
    /** This will use for sales register displayed columns */
    public displayedColumns: any[] = [];
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** True according to show field filters  */
    public showFieldFilter = {
        date: false,
        account: false,
        voucher_type: false,
        voucher_no: false,
        sales: false,
        return: false,
        qty_rate: false,
        value: false,
        discount: false,
        tax: false,
        net_sales: false
    };
    /** True if api call in progress */
    public isLoading: boolean = false;
    constructor(private store: Store<AppState>, private invoiceReceiptActions: InvoiceReceiptActions, private activeRoute: ActivatedRoute, private router: Router, private _cd: ChangeDetectorRef, private breakPointObservar: BreakpointObserver, private generalService: GeneralService, private ledgerService: LedgerService, private toaster: ToasterService) {
        this.salesRegisteDetailedResponse$ = this.store.pipe(select(appState => appState.receipt.SalesRegisteDetailedResponse), takeUntil(this.destroyed$));
        this.isGetSalesDetailsInProcess$ = this.store.pipe(select(p => p.receipt.isGetSalesDetailsInProcess), takeUntil(this.destroyed$));
        this.isGetSalesDetailsSuccess$ = this.store.pipe(select(p => p.receipt.isGetSalesDetailsSuccess), takeUntil(this.destroyed$));
        this.breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });
    }

    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.imgPath = isElectron ? 'assets/icon/' : AppUrl + APP_FOLDER + 'assets/icon/';
        this.getDetailedsalesRequestFilter.page = 1;
        this.getDetailedsalesRequestFilter.count = this.paginationLimit;
        this.getDetailedsalesRequestFilter.q = '';

        this.store.pipe(select(appState => appState.company), takeUntil(this.destroyed$)).subscribe((companyData: CurrentCompanyState) => {
            if (companyData) {
                this.isTcsTdsApplicable = companyData.isTcsTdsApplicable;
            }
        });

        this.activeRoute.queryParams.pipe(take(1)).subscribe(params => {
            if (params.from && params.to) {
                this.from = params.from;
                this.to = params.to;
                this.getDetailedsalesRequestFilter.from = this.from;
                this.getDetailedsalesRequestFilter.to = this.to;
                this.getDetailedsalesRequestFilter.branchUniqueName = params.branchUniqueName;
            }
        });
        this.getDetailedSalesReport(this.getDetailedsalesRequestFilter);
        this.salesRegisteDetailedResponse$.pipe(takeUntil(this.destroyed$)).subscribe((res: SalesRegisteDetailedResponse) => {
            if (res) {
                this.SalesRegisteDetailedItems = res;
                _.map(this.SalesRegisteDetailedItems.items, (obj: any) => {
                    obj.date = this.getDateToDMY(obj.date);
                });
                if (this.voucherNumberInput?.value) {
                    setTimeout(() => {
                        if (this.invoiceSearch && this.invoiceSearch.nativeElement) {
                            this.invoiceSearch.nativeElement.focus();
                        }
                    }, 200);
                }
            }
            setTimeout(() => { this.detectChange() }, 200);

        });

        this.voucherNumberInput?.valueChanges?.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            if (s !== null && s !== undefined) {
                this.showClearFilter = true;
                this.getDetailedsalesRequestFilter.sort = null;
                this.getDetailedsalesRequestFilter.sortBy = null;
                this.getDetailedsalesRequestFilter.q = s;
                this.getDetailedSalesReport(this.getDetailedsalesRequestFilter);
                this.showSearchInvoiceNo = false;
            }
        });
        this.customiseColumns = [
            {
                "value": "date",
                "label": "Date",
                "checked": true
            },
            {
                "value": "account",
                "label": "Account",
                "checked": true
            },
            {
                "value": "voucher_type",
                "label": "Voucher Type",
                "checked": true
            },
            {
                "value": "voucher_no",
                "label": "Voucher No.",
                "checked": true
            },
            {
                "value": "sales",
                "label": "Sales",
                "checked": true
            },
            {
                "value": "return",
                "label": "Return",
                "checked": true
            },
            {
                "value": "qty_rate",
                "label": "Qty-Rate",
                "checked": true
            },
            {
                "value": "discount",
                "label": "Discount",
                "checked": true
            },
            {
                "value": "tax",
                "label": "Tax",
                "checked": true
            },
            {
                "value": "net_sales",
                "label": "Net Sales",
                "checked": true
            }
        ];
    }

    public getDetailedSalesReport(SalesDetailedfilter) {
        setTimeout(() => { this.detectChange() }, 200);
        this.store.dispatch(this.invoiceReceiptActions.GetSalesRegistedDetails(SalesDetailedfilter));
    }
    public pageChanged(ev: any): void {
        if (ev.page === this.getDetailedsalesRequestFilter.page) {
            return;
        }
        this.getDetailedsalesRequestFilter.page = ev.page;
        this.getDetailedSalesReport(this.getDetailedsalesRequestFilter);
    }
    public sortbyApi(ord, key) {
        this.showClearFilter = true;
        this.getDetailedsalesRequestFilter.sortBy = key;
        this.getDetailedsalesRequestFilter.sort = ord;
        this.getDetailedSalesReport(this.getDetailedsalesRequestFilter);
    }

    /**
     * Redirects to Sales Register Page
     *
     * @memberof SalesRegisterExpandComponent
     */
    public gotoSalesRegister(): void {
        this.activeRoute.queryParams.pipe(take(1)).subscribe(params => {
            this.router.navigate(['pages', 'reports', 'sales-register'], { queryParams: { from: params.from, to: params.to, branchUniqueName: params.branchUniqueName, interval: params.interval, selectedMonth: params.selectedMonth } });
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
            this.router.navigate(['/pages/reports']);
        } else {
            this.router.navigate(['/pages/reports', 'sales-register']);
        }
    }

    public getDateToDMY(selecteddate) {
        let date = selecteddate.split('-');
        if (date?.length === 3) {
            this.translationComplete(true);
            let month = this.monthNames[parseInt(date[1]) - 1]?.substr(0, 3);
            let year = date[2]?.substr(2, 4);
            return date[0] + ' ' + month + ' ' + year;
        } else {
            return selecteddate;
        }

    }
    public getCurrentMonthYear() {
        if (this.from && this.to) {
            let currentYearFrom = this.from.split('-')[2];
            let currentYearTo = this.to.split('-')[2];
            let idx = this.from.split('-');
            this.monthYear = [];
            if (currentYearFrom === currentYearTo) {
                this.monthNames.forEach(element => {
                    this.monthYear.push(element + ' ' + currentYearFrom);
                });
            }
            this.selectedMonth = this.monthYear[parseInt(idx[1]) - 1];
        }

    }
    public selectedFilterMonth(monthYridx: string, i) {
        let date = this.getDateFromMonth(i);
        this.getDetailedsalesRequestFilter.from = date.firstDay;
        this.getDetailedsalesRequestFilter.to = date.lastDay;
        this.getDetailedsalesRequestFilter.q = '';
        this.selectedMonth = monthYridx;
        this.getDetailedSalesReport(this.getDetailedsalesRequestFilter);

    }

    public getDateFromMonth(selectedMonth) {
        let mdyFrom = this.from.split('-');
        let mdyTo = this.to.split('-');

        let startDate;

        if (mdyFrom[1] > selectedMonth) {
            startDate = '01-' + (selectedMonth - 1) + '-' + mdyTo[2];
        } else {
            startDate = '01-' + (selectedMonth - 1) + '-' + mdyFrom[2];
        }
        let startDateSplit = startDate.split('-');
        let dt = new Date(startDateSplit[2], startDateSplit[1], startDateSplit[0]);
        // GET THE MONTH AND YEAR OF THE SELECTED DATE.
        let month = (dt.getMonth() + 1)?.toString(),
            year = dt.getFullYear();

        if (parseInt(month) < 10) {
            month = '0' + month;
        }
        let firstDay = '01-' + (month) + '-' + year;
        let lastDay = new Date(year, parseInt(month), 0).getDate() + '-' + month + '-' + year;

        return { firstDay, lastDay };
    }
    public toggleSearch(fieldName: string) {
        if (fieldName === 'invoiceNumber') {
            this.showSearchInvoiceNo = true;

            setTimeout(() => {
                if (this.invoiceSearch && this.invoiceSearch.nativeElement) {
                    this.invoiceSearch.nativeElement.focus();
                }
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
        if (!this._cd['destroyed']) {
            this._cd.detectChanges();
        }
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof SalesRegisterExpandComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            this.monthNames = [this.commonLocaleData?.app_months_full.january, this.commonLocaleData?.app_months_full.february, this.commonLocaleData?.app_months_full.march, this.commonLocaleData?.app_months_full.april, this.commonLocaleData?.app_months_full.may, this.commonLocaleData?.app_months_full.june, this.commonLocaleData?.app_months_full.july, this.commonLocaleData?.app_months_full.august, this.commonLocaleData?.app_months_full.september, this.commonLocaleData?.app_months_full.october, this.commonLocaleData?.app_months_full.november, this.commonLocaleData?.app_months_full.december];
            this.getCurrentMonthYear();
        }
    }
    /**
     * Resets the advance search when user clicks on Clear Filter
     *
     * @memberof SalesRegisterExpandComponent
     */
    public resetAdvanceSearch() {
        this.showClearFilter = false;
        this.voucherNumberInput?.reset();
        this.showSearchInvoiceNo = false;
        this.getDetailedsalesRequestFilter.page = 1;
        this.getDetailedsalesRequestFilter.count = this.paginationLimit;
        this.getDetailedsalesRequestFilter.q = '';
        this.getDetailedsalesRequestFilter.sort = null;
        this.getDetailedsalesRequestFilter.sortBy = null;
        this.getDetailedSalesReport(this.getDetailedsalesRequestFilter);
    }

    /**
     * This function will destroy the subscribers
     *
     * @memberof SalesRegisterExpandComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Exports sales register detailed report
     *
     * @memberof SalesRegisterExpandComponent
     */
    public export(): void {
        let exportBodyRequest: ExportBodyRequest = new ExportBodyRequest();
        exportBodyRequest.from = this.from;
        exportBodyRequest.to = this.to;
        exportBodyRequest.exportType = "SALES_REGISTER_DETAILED_EXPORT";
        exportBodyRequest.fileType = "CSV";
        exportBodyRequest.isExpanded = this.expand;
        exportBodyRequest.q = this.voucherNumberInput?.value;
        exportBodyRequest.branchUniqueName = this.getDetailedsalesRequestFilter?.branchUniqueName;
        exportBodyRequest.columnsToExport = [];

        if (this.showFieldFilter.voucher_type) {
            exportBodyRequest.columnsToExport.push("Voucher Type");
        }
        if (this.showFieldFilter.voucher_no) {
            exportBodyRequest.columnsToExport.push("Voucher No");
        }
        if (this.showFieldFilter.qty_rate) {
            exportBodyRequest.columnsToExport.push("Qty/Unit");
        }
        if (this.showFieldFilter.discount) {
            exportBodyRequest.columnsToExport.push("Discount");
        }
        if (this.showFieldFilter.tax) {
            exportBodyRequest.columnsToExport.push("Tax");
        }

        this.ledgerService.exportData(exportBodyRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === 'success') {
                this.toaster.successToast(response?.body);
                this.router.navigate(["/pages/downloads"]);
            } else {
                this.toaster.errorToast(response?.message);
            }
        });
    }

    /**
    * This will use for show hide main table headers from customise columns
    *
    * @param {*} event
    * @memberof SalesRegisterExpandComponent
    */
    public getCustomiseHeaderColumns(event: any): void {
        this.displayedColumns = event;
        const displayColumnsSet = new Set(this.displayedColumns);
        Object.keys(this.showFieldFilter).forEach(key => this.showFieldFilter[key] = displayColumnsSet.has(key));
    }

}

import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { InvoiceReceiptActions } from '../../../actions/invoice/receipt/receipt.actions';
import { ReportsDetailedRequestFilter, PurchaseRegisteDetailedResponse } from '../../../models/api-models/Reports';
import { ActivatedRoute, Router } from '@angular/router';
import { take, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ReplaySubject, Observable } from 'rxjs';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { FormControl } from '@angular/forms';
import { PAGINATION_LIMIT } from '../../../app.constant';
import { CurrentCompanyState } from '../../../store/Company/company.reducer';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GeneralService } from '../../../services/general.service';
import { ExportBodyRequest } from '../../../models/api-models/DaybookRequest';
import { LedgerService } from '../../../services/ledger.service';
import { ToasterService } from '../../../services/toaster.service';

@Component({
    selector: 'purchase-register-expand',
    templateUrl: './purchase.register.expand.component.html',
    styleUrls: ['./purchase.register.expand.component.scss']
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
    public voucherNumberInput: FormControl = new FormControl();
    public monthNames = [];
    public monthYear: string[] = [];
    public modalUniqueName: string;
    public imgPath: string;
    public expand: boolean = false;
    public showFieldFilter = {
        voucherType: true,
        voucherNo: true,
        productService: false,
        qtyRate: false,
        value: false,
        discount: false,
        tax: false
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

    constructor(private store: Store<AppState>, private invoiceReceiptActions: InvoiceReceiptActions, private activeRoute: ActivatedRoute, private router: Router, private _cd: ChangeDetectorRef, private breakPointObservar: BreakpointObserver, private generalService: GeneralService, private ledgerService: LedgerService, private toaster: ToasterService) {
        this.purchaseRegisteDetailedResponse$ = this.store.pipe(select(appState => appState.receipt.PurchaseRegisteDetailedResponse), takeUntil(this.destroyed$));
        this.isGetPurchaseDetailsInProcess$ = this.store.pipe(select(p => p.receipt.isGetPurchaseDetailsInProcess), takeUntil(this.destroyed$));
        this.isGetPurchaseDetailsSuccess$ = this.store.pipe(select(p => p.receipt.isGetPurchaseDetailsSuccess), takeUntil(this.destroyed$));
        this.breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });
    }

    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.imgPath = isElectron ? 'assets/icon/' : AppUrl + APP_FOLDER + 'assets/icon/';
        this.getDetailedPurchaseRequestFilter.page = 1;
        this.getDetailedPurchaseRequestFilter.count = this.paginationLimit;
        this.getDetailedPurchaseRequestFilter.q = '';
        this.store.pipe(select(appState => appState.company), takeUntil(this.destroyed$)).subscribe((companyData: CurrentCompanyState) => {
            if (companyData) {
                this.isTcsTdsApplicable = companyData.isTcsTdsApplicable;
            }
        });
        this.activeRoute.queryParams.pipe(take(1)).subscribe(params => {
            if (params.from && params.to) {
                this.from = params.from;
                this.to = params.to;
                this.getDetailedPurchaseRequestFilter.from = this.from;
                this.getDetailedPurchaseRequestFilter.to = this.to;
                this.getDetailedPurchaseRequestFilter.branchUniqueName = params.branchUniqueName;
            }
        });
        this.getDetailedPurchaseReport(this.getDetailedPurchaseRequestFilter);
        this.purchaseRegisteDetailedResponse$.pipe(takeUntil(this.destroyed$)).subscribe((res: PurchaseRegisteDetailedResponse) => {
            if (res) {
                this.PurchaseRegisteDetailedItems = res;
                _.map(this.PurchaseRegisteDetailedItems.items, (obj: any) => {
                    obj.date = this.getDateToDMY(obj.date);
                });
                if (this.voucherNumberInput?.value) {
                    setTimeout(() => {
                        this.invoiceSearch?.nativeElement.focus();
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
                this.getDetailedPurchaseRequestFilter.sort = null;
                this.getDetailedPurchaseRequestFilter.sortBy = null;
                this.getDetailedPurchaseRequestFilter.q = s;
                this.getDetailedPurchaseReport(this.getDetailedPurchaseRequestFilter);
                this.showSearchInvoiceNo = false;
            }
        });
    }

    public getDetailedPurchaseReport(PurchaseDetailedfilter) {
        setTimeout(() => { this.detectChange() }, 200);
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
        this.activeRoute.queryParams.pipe(take(1)).subscribe(params => {
            this.router.navigate(['pages', 'reports', 'purchase-register'], { queryParams: { from: params.from, to: params.to, branchUniqueName: params.branchUniqueName, interval: params.interval, selectedMonth: params.selectedMonth } });
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
            this.router.navigate(['/pages/reports', 'purchase-register']);
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
        this.getDetailedPurchaseRequestFilter.from = date.firstDay;
        this.getDetailedPurchaseRequestFilter.to = date.lastDay;
        this.getDetailedPurchaseRequestFilter.q = '';
        this.selectedMonth = monthYridx;
        this.getDetailedPurchaseReport(this.getDetailedPurchaseRequestFilter);
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

        // GET THE FIRST AND LAST DATE OF THE MONTH.
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
        if (!this._cd['destroyed']) {
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
            this.monthNames = [this.commonLocaleData?.app_months_full.january, this.commonLocaleData?.app_months_full.february, this.commonLocaleData?.app_months_full.march, this.commonLocaleData?.app_months_full.april, this.commonLocaleData?.app_months_full.may, this.commonLocaleData?.app_months_full.june, this.commonLocaleData?.app_months_full.july, this.commonLocaleData?.app_months_full.august, this.commonLocaleData?.app_months_full.september, this.commonLocaleData?.app_months_full.october, this.commonLocaleData?.app_months_full.november, this.commonLocaleData?.app_months_full.december];

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
        this.getDetailedPurchaseRequestFilter.q = '';
        this.getDetailedPurchaseRequestFilter.sort = null;
        this.getDetailedPurchaseRequestFilter.sortBy = null;
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
        let exportBodyRequest: ExportBodyRequest = new ExportBodyRequest();
        exportBodyRequest.from = this.from;
        exportBodyRequest.to = this.to;
        exportBodyRequest.exportType = "PURCHASE_REGISTER_DETAILED_EXPORT";
        exportBodyRequest.fileType = "CSV";
        exportBodyRequest.isExpanded = this.expand;
        exportBodyRequest.q = this.voucherNumberInput?.value;
        exportBodyRequest.branchUniqueName = this.getDetailedPurchaseRequestFilter?.branchUniqueName;
        exportBodyRequest.columnsToExport = [];

        if(this.showFieldFilter.voucherType) {
            exportBodyRequest.columnsToExport.push("Voucher Type");
        }
        if(this.showFieldFilter.voucherNo) {
            exportBodyRequest.columnsToExport.push("Voucher No");
        }
        if(this.showFieldFilter.qtyRate) {
            exportBodyRequest.columnsToExport.push("Qty/Unit");
        }
        if(this.showFieldFilter.discount) {
            exportBodyRequest.columnsToExport.push("Discount");
        }
        if(this.showFieldFilter.tax) {
            exportBodyRequest.columnsToExport.push("Tax");
        }

        this.ledgerService.exportData(exportBodyRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === 'success') {
                this.toaster.showSnackBar("success", response?.body);
                this.router.navigate(["/pages/downloads"]);
            } else {
                this.toaster.showSnackBar("error", response?.message);
            }
        });
    }
}

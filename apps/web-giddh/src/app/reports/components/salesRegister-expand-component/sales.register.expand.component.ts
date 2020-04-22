import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { InvoiceReceiptActions } from '../../../actions/invoice/receipt/receipt.actions';
import { ReportsDetailedRequestFilter, SalesRegisteDetailedResponse } from '../../../models/api-models/Reports';
import { ActivatedRoute, Router } from '@angular/router';
import { take, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ReplaySubject, Observable } from 'rxjs';
import { BsDropdownDirective } from 'ngx-bootstrap';
import { FormControl } from '@angular/forms';
import { CurrentPage } from '../../../models/api-models/Common';
import { GeneralActions } from '../../../actions/general/general.actions';
import { PAGINATION_LIMIT } from '../../../app.constant';
import { CurrentCompanyState } from '../../../store/Company/company.reducer';


@Component({
    selector: 'sales-register-expand',
    templateUrl: './sales.register.expand.component.html',
    styleUrls: ['./sales.register.expand.component.scss']
})
export class SalesRegisterExpandComponent implements OnInit {

    public SalesRegisteDetailedItems: SalesRegisteDetailedResponse;
    public from: string;
    public to: string;
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
    @ViewChild('invoiceSearch') public invoiceSearch: ElementRef;
    // @ViewChild('customerSearch') public customerSearch: ElementRef;
    @ViewChild('filterDropDownList') public filterDropDownList: BsDropdownDirective;

    public voucherNumberInput: FormControl = new FormControl();
    // public customerNameInput: FormControl = new FormControl();
    public monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

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


    bsValue = new Date();

    constructor(private store: Store<AppState>, private invoiceReceiptActions: InvoiceReceiptActions, private activeRoute: ActivatedRoute, private router: Router, private _cd: ChangeDetectorRef, private _generalActions: GeneralActions) {
        this.salesRegisteDetailedResponse$ = this.store.pipe(select(p => p.receipt.SalesRegisteDetailedResponse), takeUntil(this.destroyed$));
        this.isGetSalesDetailsInProcess$ = this.store.pipe(select(p => p.receipt.isGetSalesDetailsInProcess), takeUntil(this.destroyed$));
        this.isGetSalesDetailsSuccess$ = this.store.pipe(select(p => p.receipt.isGetSalesDetailsSuccess), takeUntil(this.destroyed$));
    }

    ngOnInit() {
        this.setCurrentPageTitle();
        this.imgPath = (isElectron||isCordova)  ? 'assets/icon/' : AppUrl + APP_FOLDER + 'assets/icon/';
        this.getDetailedsalesRequestFilter.page = 1;
        this.getDetailedsalesRequestFilter.count = 50;
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
            }
        });
        this.getDetailedSalesReport(this.getDetailedsalesRequestFilter);
        this.getCurrentMonthYear();
        this.salesRegisteDetailedResponse$.pipe(takeUntil(this.destroyed$)).subscribe((res: SalesRegisteDetailedResponse) => {
            if (res) {
                this.SalesRegisteDetailedItems = res;
                _.map(this.SalesRegisteDetailedItems.items, (obj: any) => {
                    obj.date = this.getDateToDMY(obj.date);
                });
                if (this.voucherNumberInput.value) {
                    setTimeout(() => {
                        this.invoiceSearch.nativeElement.focus();
                    }, 200);
                }
            }
            setTimeout(() => { this.detectChange() }, 200);

        });

        this.voucherNumberInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.getDetailedsalesRequestFilter.sort = null;
            this.getDetailedsalesRequestFilter.sortBy = null;
            this.getDetailedsalesRequestFilter.q = s;
            this.getDetailedSalesReport(this.getDetailedsalesRequestFilter);
            if (s === '') {
                this.showSearchInvoiceNo = false;
            }
        });

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
        this.getDetailedsalesRequestFilter.sortBy = key;
        this.getDetailedsalesRequestFilter.sort = ord;
        this.getDetailedSalesReport(this.getDetailedsalesRequestFilter);
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
        if (date.length === 3) {
            let month = this.monthNames[parseInt(date[1]) - 1].substr(0, 3);
            let year = date[2].substr(2, 4);
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
        let month = (dt.getMonth() + 1).toString(),
            year = dt.getFullYear();

        // GET THE FIRST AND LAST DATE OF THE MONTH.
        //let firstDay = new Date(year, month , 0).toISOString().replace(/T.*/,'').split('-').reverse().join('-');
        //let lastDay = new Date(year, month + 1, 1).toISOString().replace(/T.*/,'').split('-').reverse().join('-');
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
            // this.showSearchCustomer = false;

            setTimeout(() => {
                this.invoiceSearch.nativeElement.focus();
            }, 200);
        }
        // else if (fieldName === 'customerUniqueName') {
        //   this.showSearchCustomer = true;
        //   this.showSearchInvoiceNo = false;
        //   setTimeout(() => {
        //     this.customerSearch.nativeElement.focus();
        //   }, 200);
        // }
        else {
            this.showSearchInvoiceNo = false;
            // this.showSearchCustomer = false;
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

    public setCurrentPageTitle() {
        let currentPageObj = new CurrentPage();
        currentPageObj.name = "Reports > Sales Register";
        currentPageObj.url = this.router.url;
        this.store.dispatch(this._generalActions.setPageTitle(currentPageObj));
    }
}

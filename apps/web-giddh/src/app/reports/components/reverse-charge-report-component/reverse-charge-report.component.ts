import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ReverseChargeReportGetRequest, ReverseChargeReportPostRequest } from '../../../models/api-models/ReverseCharge';
import { PAGINATION_LIMIT } from '../../../app.constant';
import { Observable, ReplaySubject } from 'rxjs';
import { Store, select, createSelector } from '@ngrx/store';
import { AppState } from '../../../store';
import { take, takeUntil } from 'rxjs/operators';
import { ToasterService } from '../../../services/toaster.service';
import { ReverseChargeService } from '../../../services/reversecharge.service';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment/moment';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { CurrentPage } from '../../../models/api-models/Common';
import { Router } from '@angular/router';
import { GeneralActions } from '../../../actions/general/general.actions';

@Component({
    selector: 'reverse-charge-report',
    templateUrl: './reverse-charge-report.component.html',
    styleUrls: ['./reverse-charge-report.component.scss']
})

export class ReverseChargeReport implements OnInit, OnDestroy {
    public inlineSearch: any = '';
    @ViewChild('suppliersNameField', {static: true}) public suppliersNameField;
    @ViewChild('invoiceNumberField', {static: true}) public invoiceNumberField;
    @ViewChild('supplierCountryField', {static: true}) public supplierCountryField;

    public showEntryDate = true;
    public activeCompanyUniqueName$: Observable<string>;
    public activeCompany: any;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public reverseChargeReportGetRequest: ReverseChargeReportGetRequest = {
        from: '',
        to: '',
        sort: '',
        sortBy: '',
        page: 1,
        count: PAGINATION_LIMIT
    };
    public reverseChargeReportPostRequest: ReverseChargeReportPostRequest = {
        supplierName: '',
        invoiceNumber: '',
        supplierCountry: '',
        voucherType: ''
    };
    public isLoading: boolean = false;
    public reverseChargeReportResults: any = {};
    public paginationLimit: number = PAGINATION_LIMIT;
    public timeout: any;
    public bsConfig: Partial<BsDaterangepickerConfig> = { showWeekNumbers: false, dateInputFormat: GIDDH_DATE_FORMAT, rangeInputFormat: GIDDH_DATE_FORMAT };
    public universalDate$: Observable<any>;
    public datePicker: any[] = [];
    public universalDate: any[] = [];

    constructor(private store: Store<AppState>, private toasty: ToasterService, private cdRef: ChangeDetectorRef, private reverseChargeService: ReverseChargeService, private router: Router, private generalActions: GeneralActions) {
        this.setCurrentPageTitle();
        this.activeCompanyUniqueName$ = this.store.pipe(select(p => p.session.companyUniqueName), (takeUntil(this.destroyed$)));
        this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
    }

    /**
     * This function will initialize the component
     *
     * @memberof ReverseChargeReport
     */
    public ngOnInit(): void {
        this.activeCompanyUniqueName$.pipe(take(1)).subscribe(activeCompanyName => {
            this.store.pipe(select(state => state.session.companies), takeUntil(this.destroyed$)).subscribe(res => {
                if (!res) {
                    return;
                }
                res.forEach(cmp => {
                    if (!this.activeCompany && cmp.uniqueName === activeCompanyName) {
                        this.activeCompany = cmp;
                        this.getReverseChargeReport(false);
                    }
                });
            });
        });

        this.store.select(createSelector([(states: AppState) => states.session.applicationDate], (dateObj: Date[]) => {
            if (dateObj) {
                this.universalDate = _.cloneDeep(dateObj);
                if (this.reverseChargeReportGetRequest.from !== moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT) || this.reverseChargeReportGetRequest.to !== moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT)) {
                    this.datePicker = [moment(this.universalDate[0], GIDDH_DATE_FORMAT).toDate(), moment(this.universalDate[1], GIDDH_DATE_FORMAT).toDate()];
                }
            }
        })).pipe(takeUntil(this.destroyed$)).subscribe();
    }

    /**
     * This will put focus on selected search field
     *
     * @param {*} inlineSearch
     * @memberof ReverseChargeReport
     */
    public focusOnColumnSearch(inlineSearch) {
        this.inlineSearch = inlineSearch;

        setTimeout(() => {
            if (this.inlineSearch === 'suppliersName') {
                this.suppliersNameField.nativeElement.focus();
            } else if (this.inlineSearch === 'invoiceNumber') {
                this.invoiceNumberField.nativeElement.focus();
            } else if (this.inlineSearch === 'supplierCountry') {
                this.supplierCountryField.nativeElement.focus();
            }
        }, 200);
    }

    /**
     * This function will destroy the subscribers
     *
     * @memberof VatReportTransactionsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This function will change the page of vat report
     *
     * @param {*} event
     * @memberof VatReportTransactionsComponent
     */
    public pageChanged(event: any): void {
        if (this.reverseChargeReportGetRequest.page != event.page) {
            this.reverseChargeReportResults.results = [];
            this.reverseChargeReportGetRequest.page = event.page;
            this.getReverseChargeReport(false);
        }
    }

    /**
     * This function will get the data of vat detailed report
     *
     * @param {boolean} resetPage
     * @memberof VatReportTransactionsComponent
     */
    public getReverseChargeReport(resetPage: boolean): void {
        if (this.activeCompany && this.reverseChargeReportGetRequest.from && this.reverseChargeReportGetRequest.to) {
            this.isLoading = true;

            if (resetPage) {
                this.reverseChargeReportGetRequest.page = 1;
            }

            this.reverseChargeReportResults = [];

            this.reverseChargeService.getReverseChargeReport(this.activeCompany.uniqueName, this.reverseChargeReportGetRequest, this.reverseChargeReportPostRequest).subscribe((res) => {
                if (res.status === 'success') {
                    this.reverseChargeReportResults = res.body;
                    this.cdRef.detectChanges();
                } else {
                    this.toasty.errorToast(res.message);
                }
                this.isLoading = false;
            });
        }
    }

    /**
     * This will initialize the search
     *
     * @memberof ReverseChargeReport
     */
    public columnSearch(): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.getReverseChargeReport(true);
        }, 700);
    }

    /**
     * This will sort the report
     *
     * @param {*} sortBy
     * @memberof ReverseChargeReport
     */
    public sortReverseChargeList(sortBy): void {
        let sort = "asc";

        if (this.reverseChargeReportGetRequest.sortBy === sortBy) {
            sort = (this.reverseChargeReportGetRequest.sort === "asc") ? "desc" : "asc";
        } else {
            sort = "asc";
        }

        this.reverseChargeReportGetRequest.sort = sort;
        this.reverseChargeReportGetRequest.sortBy = sortBy;
        this.getReverseChargeReport(true);
    }

    /**
     * This will filter the report by date
     *
     * @param {*} date
     * @memberof ReverseChargeReport
     */
    public changeFilterDate(date): void {
        if (date) {
            this.reverseChargeReportGetRequest.from = moment(date[0]).format(GIDDH_DATE_FORMAT);
            this.reverseChargeReportGetRequest.to = moment(date[1]).format(GIDDH_DATE_FORMAT);
            this.getReverseChargeReport(true);
        }
    }

    /**
     * This will filter the report by voucher type
     *
     * @param {string} voucherType
     * @memberof ReverseChargeReport
     */
    public changeVoucherType(voucherType: string): void {
        this.reverseChargeReportPostRequest.voucherType = voucherType;
        this.getReverseChargeReport(true);
    }

    /**
     * This will set the page heading
     *
     * @memberof ReverseChargeReport
     */
    public setCurrentPageTitle() {
        let currentPageObj = new CurrentPage();
        currentPageObj.name = "Reports > Reverse Charge";
        currentPageObj.url = this.router.url;
        this.store.dispatch(this.generalActions.setPageTitle(currentPageObj));
    }

    /**
     * This function is used to check if filters are applied
     *
     * @returns {boolean}
     * @memberof ReverseChargeReport
     */
    public checkIfFiltersApplied(): boolean {
        if(this.reverseChargeReportPostRequest.invoiceNumber || this.reverseChargeReportPostRequest.supplierCountry || this.reverseChargeReportPostRequest.supplierName || this.reverseChargeReportPostRequest.voucherType || this.reverseChargeReportGetRequest.from !== moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT) || this.reverseChargeReportGetRequest.to !== moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * This function is used to reset filters
     *
     * @memberof ReverseChargeReport
     */
    public resetFilters(): void {
        this.reverseChargeReportPostRequest = {
            supplierName: '',
            invoiceNumber: '',
            supplierCountry: '',
            voucherType: ''
        };

        this.reverseChargeReportGetRequest.sort = "";
        this.reverseChargeReportGetRequest.sortBy = "";

        if(this.reverseChargeReportGetRequest.from !== moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT) || this.reverseChargeReportGetRequest.to !== moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT)) {
            this.datePicker = [moment(this.universalDate[0], GIDDH_DATE_FORMAT).toDate(), moment(this.universalDate[1], GIDDH_DATE_FORMAT).toDate()];
        } else {
            this.getReverseChargeReport(true);
        }
    }
}

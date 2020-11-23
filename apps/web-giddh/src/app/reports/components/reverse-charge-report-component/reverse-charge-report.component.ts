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
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { GeneralService } from '../../../services/general.service';
import { OrganizationType } from '../../../models/user-login-state';

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

    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };

    constructor(
        private store: Store<AppState>,
        private toasty: ToasterService,
        private cdRef: ChangeDetectorRef,
        private reverseChargeService: ReverseChargeService,
        private router: Router,
        private generalActions: GeneralActions,
        private settingsBranchAction: SettingsBranchActions,
        private generalService: GeneralService
    ) {
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

        this.store.pipe(
            select(state => state.session.companies), take(1)
        ).subscribe(companies => {
            companies = companies || [];
            this.activeCompany = companies.find(company => company.uniqueName === this.generalService.companyUniqueName);
        });
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch.alias,
                    value: branch.uniqueName,
                    name: branch.name,
                    parentBranch: branch.parentBranch
                }));
                this.currentCompanyBranches.unshift({
                    label: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                    name: this.activeCompany ? this.activeCompany.name : '',
                    value: this.activeCompany ? this.activeCompany.uniqueName : '',
                    isCompany: true
                });
                const hoBranch = response.find(branch => !branch.parentBranch);
                const currentBranchUniqueName = this.generalService.currentOrganizationType === OrganizationType.Branch ? this.generalService.currentBranchUniqueName : hoBranch ? hoBranch.uniqueName : '';
                this.currentBranch = _.cloneDeep(response.find(branch => branch.uniqueName === currentBranchUniqueName));
                this.currentBranch.name = this.currentBranch.name + (this.currentBranch.alias ? ` (${this.currentBranch.alias})` : '');
                this.reverseChargeReportGetRequest.branchUniqueName = this.currentBranch.uniqueName;
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({from: '', to: ''}));
                }
            }
        });

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

    /**
     * Branch change handler
     *
     * @memberof ReverseChargeReport
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
        this.reverseChargeReportGetRequest.branchUniqueName = selectedEntity.value;
        this.getReverseChargeReport(true);
    }
}

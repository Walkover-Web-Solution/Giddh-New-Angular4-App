import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ReverseChargeReportGetRequest, ReverseChargeReportPostRequest } from '../../../models/api-models/ReverseCharge';
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from '../../../app.constant';
import { Observable, ReplaySubject } from 'rxjs';
import { Store, select, createSelector } from '@ngrx/store';
import { AppState } from '../../../store';
import { take, takeUntil } from 'rxjs/operators';
import { ToasterService } from '../../../services/toaster.service';
import { ReverseChargeService } from '../../../services/reversecharge.service';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../../../models/user-login-state';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GeneralService } from '../../../services/general.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
@Component({
    selector: 'reverse-charge-report',
    templateUrl: './reverse-charge-report.component.html',
    styleUrls: ['./reverse-charge-report.component.scss']
})

export class ReverseChargeReport implements OnInit, OnDestroy {
    public inlineSearch: any = '';
    @ViewChild('suppliersNameField', { static: true }) public suppliersNameField;
    @ViewChild('invoiceNumberField', { static: true }) public invoiceNumberField;
    @ViewChild('supplierCountryField', { static: true }) public supplierCountryField;

    /* This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    public showEntryDate = true;
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
    public universalDate: any[] = [];
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* dayjs object */
    public dayjs = dayjs;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /* True, if mobile screen size is detected **/
    public isMobileScreen: boolean = true;
    /** True if today selected */
    public todaySelected: boolean = false;

    constructor(
        private store: Store<AppState>,
        private toasty: ToasterService,
        private cdRef: ChangeDetectorRef,
        private reverseChargeService: ReverseChargeService,
        private settingsBranchAction: SettingsBranchActions,
        private generalService: GeneralService,
        private modalService: BsModalService,
        private breakPointObservar: BreakpointObserver,
        private router: Router
    ) {
    }

    /**
     * This function will initialize the component
     *
     * @memberof ReverseChargeReport
     */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
            if (!this.isMobileScreen) {
                this.asideGstSidebarMenuState = 'in';
            }
        });

        this.store.pipe(select(appState => appState.general.openGstSideMenu), takeUntil(this.destroyed$)).subscribe(shouldOpen => {
            if (this.isMobileScreen) {
                if (shouldOpen) {
                    this.asideGstSidebarMenuState = 'in';
                } else {
                    this.asideGstSidebarMenuState = 'out';
                }
            }
        });

        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });

        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj: Date[]) => {
            if (dateObj) {
                this.universalDate = _.cloneDeep(dateObj);

                setTimeout(() => {
                    this.store.pipe(select(state => state.session.todaySelected), take(1)).subscribe(response => {
                        this.todaySelected = response;
                        if (this.universalDate && !this.todaySelected) {
                            this.selectedDateRange = { startDate: dayjs(this.universalDate[0]), endDate: dayjs(this.universalDate[1]) };
                            this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);

                            this.reverseChargeReportGetRequest.from = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                            this.reverseChargeReportGetRequest.to = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
                        } else {
                            this.universalDate = [];
                            this.reverseChargeReportGetRequest.from = "";
                            this.reverseChargeReportGetRequest.to = "";
                        }

                        this.getReverseChargeReport(false);
                    });
                }, 100);
            }
        });

        this.store.pipe(
            select(state => state.session.activeCompany), takeUntil(this.destroyed$)
        ).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
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
                let currentBranchUniqueName;
                if (!this.currentBranch?.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded
                    if (this.currentOrganizationType === OrganizationType.Branch) {
                        currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                        this.currentBranch = _.cloneDeep(response.find(branch => branch.uniqueName === currentBranchUniqueName)) || this.currentBranch;
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany.uniqueName : '';
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : '',
                            alias: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                            uniqueName: this.activeCompany ? this.activeCompany.uniqueName : '',
                        };
                    }
                    this.reverseChargeReportGetRequest.branchUniqueName = this.currentBranch?.uniqueName;
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
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
                this.suppliersNameField?.nativeElement.focus();
            } else if (this.inlineSearch === 'invoiceNumber') {
                this.invoiceNumberField?.nativeElement.focus();
            } else if (this.inlineSearch === 'supplierCountry') {
                this.supplierCountryField?.nativeElement.focus();
            }
        }, 200);
    }

    /**
     * This function will destroy the subscribers
     *
     * @memberof ReverseChargeReport
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState === 'out';
    }

    /**
     * This function will change the page of vat report
     *
     * @param {*} event
     * @memberof ReverseChargeReport
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
     * @memberof ReverseChargeReport
     */
    public getReverseChargeReport(resetPage: boolean): void {
        if (this.activeCompany) {
            this.isLoading = true;

            if (resetPage) {
                this.reverseChargeReportGetRequest.page = 1;
            }

            this.reverseChargeReportResults = [];

            this.reverseChargeService.getReverseChargeReport(this.activeCompany.uniqueName, this.reverseChargeReportGetRequest, this.reverseChargeReportPostRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res?.status === 'success') {
                    this.reverseChargeReportResults = res.body;

                    if(this.todaySelected) {
                        this.selectedDateRange = { startDate: dayjs(this.reverseChargeReportResults?.from, GIDDH_DATE_FORMAT), endDate: dayjs(this.reverseChargeReportResults?.to, GIDDH_DATE_FORMAT) };
                        this.selectedDateRangeUi = dayjs(this.reverseChargeReportResults?.from, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(this.reverseChargeReportResults?.to, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
                    }

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
     * This function is used to check if filters are applied
     *
     * @returns {boolean}
     * @memberof ReverseChargeReport
     */
    public checkIfFiltersApplied(): boolean {
        if (this.reverseChargeReportPostRequest.invoiceNumber || this.reverseChargeReportPostRequest.supplierCountry || this.reverseChargeReportPostRequest.supplierName || this.reverseChargeReportPostRequest.voucherType || (this.reverseChargeReportGetRequest.from && this.reverseChargeReportGetRequest.from !== dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT)) || (this.reverseChargeReportGetRequest.to && this.reverseChargeReportGetRequest.to !== dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT))) {
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
        this.reverseChargeReportGetRequest.from = "";
        this.reverseChargeReportGetRequest.to = "";
        if(!this.todaySelected) {
            this.selectedDateRange = { startDate: dayjs(this.universalDate[0]), endDate: dayjs(this.universalDate[1]) };
            this.selectedDateRangeUi = dayjs(this.universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(this.universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.reverseChargeReportGetRequest.from = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
            this.reverseChargeReportGetRequest.to = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
        }
        this.getReverseChargeReport(true);
    }

    /**
    *To show the datepicker
    *
    * @param {*} element
    * @memberof ReverseChargeReport
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
     * @memberof ReverseChargeReport
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof ReverseChargeReport
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
            this.reverseChargeReportGetRequest.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.reverseChargeReportGetRequest.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.getReverseChargeReport(true);
        }
    }

    /**
     * Branch change handler
     *
     * @memberof ReverseChargeReport
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity?.label;
        this.reverseChargeReportGetRequest.branchUniqueName = selectedEntity?.value;
        this.getReverseChargeReport(true);
    }

    /**
     * Handles GST Sidebar Navigation
     *
     * @memberof ReverseChargeReport
     */
    public handleNavigation(): void {
        this.router.navigate(['pages', 'gstfiling']);
    }
}

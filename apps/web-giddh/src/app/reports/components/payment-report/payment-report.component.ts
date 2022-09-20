import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { fromEvent, merge, Observable, ReplaySubject } from 'rxjs';
import { debounceTime, takeUntil, take } from 'rxjs/operators';
import { GeneralActions } from '../../../actions/general/general.actions';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../../../models/user-login-state';
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from '../../../app.constant';
import { cloneDeep, isArray } from '../../../lodash-optimized';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { PaymentSummaryRequest } from '../../../models/api-models/Reports';
import { GeneralService } from '../../../services/general.service';
import { ReceiptService } from '../../../services/receipt.service';
import { ToasterService } from '../../../services/toaster.service';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { ElementViewContainerRef } from '../../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { AppState } from '../../../store'; 
import { PAYMENT_REPORT_FILTERS, PaymentAdvanceSearchModel } from '../../constants/reports.constant';
import { PaymentAdvanceSearchComponent } from '../payment-advance-search/payment-advance-search.component';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceBulkUpdateService } from '../../../services/invoice.bulkupdate.service';

@Component({
    selector: 'payment-report',
    templateUrl: './payment-report.component.html',
    styleUrls: ['./payment-report.component.scss']
})
export class PaymentReportComponent implements AfterViewInit, OnDestroy, OnInit {
    /** Vendor name search bar */
    @ViewChild('vendorName', { static: false }) public vendorName: ElementRef;
    /** Parent of vendor name search bar */
    @ViewChild('vendorNameParent', { static: false }) public vendorNameParent: ElementRef;
    /** Receipt number search bar */
    @ViewChild('receiptNumber', { static: false }) public receiptNumber: ElementRef;
    /** Parent of payment number search bar */
    @ViewChild('paymentNumberParent', { static: false }) public paymentNumberParent: ElementRef;
    /** Advance search modal instance */
    @ViewChild('paymentSearchFilterModal', { static: false }) public paymentSearchFilterModal: ElementViewContainerRef;
    /** Container of Advance search modal instance */
    @ViewChild('paymentSearchModalContainer', { static: false }) public paymentSearchModalContainer: ModalDirective;
    /** Instance of receipt confirmation modal */
    @ViewChild('paymentConfirmationModel', { static: false }) public paymentConfirmationModel: ModalDirective;
    /** dayjs method */
    public dayjs = dayjs;
    /** Modal reference */
    public modalRef: BsModalRef;
    /** Stores the list of all payments */
    public allPayments: Array<any>;
    /** Stores summary data of all payments based on filters applied */
    public paymentsSummaryData: any;
    /** Stores the value of pagination limit for template use */
    public paginationLimit: number = PAGINATION_LIMIT;
    /** Stores the current page number */
    public pageConfiguration: { currentPage: number, totalPages: number, totalItems: number } = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 1
    };
    /** Stores the search query params for API call */
    public searchQueryParams: any = {
        receiptNumber: '',  // Receipt Number
        baseAccountName: '',  // Vendor Name
        sortBy: '',  // Sort by
        sort: '',
        q: ''
    };
    /** True, if the user clicks to search payment */
    public showPaymentSearchBar: boolean = false;
    /** True, if the user clicks to search vendor */
    public showVendorSearchBar: boolean = false;
    /** True, if the user clicks to search payment mode */
    public showPaymentModeSearchBar: boolean = false;
    /** True, if the user clicks to search Invoice */
    public showInvoiceSearchBar: boolean = false;
    /** True, if custom date filter is selected or custom searching or sorting is performed */
    public showClearFilter: boolean = false;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** Stores the current company */
    public activeCompany: any;
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** Advance search model to initialize the advance search fields */
    private advanceSearchModel: PaymentAdvanceSearchModel = {
        totalAmountFilter: {
            filterValues: [],
            selectedValue: '',
            amount: ''
        },
        unusedAmountFilter: {
            filterValues: [],
            selectedValue: '',
            amount: ''
        }
    };
    /** Stores universal date of Giddh */
    private universalDate: Array<Date>;
    /** Subject to unsubscribe all the observables when the component destroys */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Company unique name for API calls */
    private activeCompanyUniqueName: string;
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* Universal date observer */
    public universalDate$: Observable<any>;
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Amount filter values for Advance Search in payment reports */
    public paymentAdvanceSearchAmountFilters: any;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2;
    /** Voucher params */
    public previewVoucherParams: any = {};
    /** List of selected payments */
    public selectedPayments: any[] = [];
    /** True if all payments are selected */
    public allPaymentsSelected: boolean = false;
    /** Uniquename of payment user hovered */
    public hoveredPaymentUniqueName: string = "";
    /** True if table is hovered */
    public hoveredPaymentTable: boolean = false;
    /** Holds currency */
    public baseCurrency: string = '';

    /** @ignore */
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private generalAction: GeneralActions,
        private receiptService: ReceiptService,
        private store: Store<AppState>,
        private toastService: ToasterService,
        private generalService: GeneralService,
        private settingsBranchAction: SettingsBranchActions,
        private modalService: BsModalService,
        private router: Router,
        private route: ActivatedRoute,
        private invoiceBulkUpdateService: InvoiceBulkUpdateService
    ) {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params?.uniqueName && params?.accountUniqueName) {
                this.previewVoucherParams = params;
            } else {
                this.previewVoucherParams = {};
            }
        });

        this.store.pipe(select(s => s.settings.profile), takeUntil(this.destroyed$)).subscribe(profile => {
            if (profile) {
                this.baseCurrency = profile.baseCurrency;
            }
        });
    }

    /** Subscribe to universal date and set header title */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        if (this.voucherApiVersion === 1) {
            this.router.navigate(['pages', 'home']);
        }

        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.store.dispatch(this.generalAction.setAppTitle('/pages/reports/payment'));
        this.store.pipe(select(state => state.session.companyUniqueName), take(1)).subscribe(uniqueName => this.activeCompanyUniqueName = uniqueName);
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((applicationDate) => {
            if (applicationDate) {
                this.universalDate = applicationDate;
                let universalDate = _.cloneDeep(applicationDate);
                this.selectedDateRange = { startDate: dayjs(universalDate[0]), endDate: dayjs(universalDate[1]) };
                this.selectedDateRangeUi = dayjs(applicationDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(applicationDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
            this.fetchPaymentsData();
        });
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
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
                if (!this.currentBranch?.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded
                    let currentBranchUniqueName;
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
     * Subscribe to input events for search filters
     *
     * @memberof PaymentReportComponent
     */
    public ngAfterViewInit(): void {
        if (!this.previewVoucherParams?.uniqueName) {
            this.subscribeToEvents();
        }
    }

    /**
     * Unsubscribes from the listeners to avoid memory leaks
     *
     * @memberof PaymentReportComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Opens the advance search model
     *
     * @memberof PaymentReportComponent
     */
    public openModal(): void {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(PaymentAdvanceSearchComponent);
        const viewContainerRef = this.paymentSearchFilterModal.viewContainerRef;
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent(componentFactory);

        (componentRef.instance as PaymentAdvanceSearchComponent).searchModel = cloneDeep(this.advanceSearchModel);
        (componentRef.instance as PaymentAdvanceSearchComponent).localeData = cloneDeep(this.localeData);
        (componentRef.instance as PaymentAdvanceSearchComponent).commonLocaleData = cloneDeep(this.commonLocaleData);

        merge(
            (componentRef.instance as PaymentAdvanceSearchComponent).closeModal,
            (componentRef.instance as PaymentAdvanceSearchComponent).cancel).pipe(takeUntil(this.destroyed$)).subscribe(() => {
                // Listener for close and cancel event of modal
                this.paymentSearchModalContainer.hide();
            });
        (componentRef.instance as PaymentAdvanceSearchComponent).confirm.pipe(takeUntil(this.destroyed$)).subscribe((data: PaymentAdvanceSearchModel) => {
            // Listener for confirm event of modal
            this.showClearFilter = true;
            this.advanceSearchModel = cloneDeep(data);
            this.fetchAllPayments({
                companyUniqueName: this.activeCompanyUniqueName,
                receiptTypes: [],
                totalAmount: data.totalAmountFilter.amount,
                totalAmountOperation: data.totalAmountFilter.selectedValue,
                unUsedAmount: data.unusedAmountFilter.amount,
                unUsedAmountOperation: data.unusedAmountFilter.selectedValue
            }).pipe(takeUntil(this.destroyed$)).subscribe((response) => this.handleFetchAllPaymentResponse(response));
            this.paymentSearchModalContainer.hide();
        });
        this.paymentSearchModalContainer.show();
    }
    /**
     * Opens/Closes the respective search bar based on parameters provided
     *
     * @param {string} filterName Name of the filter to open or close
     * @param {boolean} openFilter True, if filter needs to be opened
     * @memberof PaymentReportComponent
     */
    public searchBy(event: any, filterName: string, openFilter: boolean): void {
        switch (filterName) {
            case PAYMENT_REPORT_FILTERS.PAYMENT_FILTER:
                if (event && this.childOf(event.target, this.paymentNumberParent?.nativeElement)) {
                    return;
                }
                this.showPaymentSearchBar = openFilter;
                break;
            case PAYMENT_REPORT_FILTERS.VENDOR_FILTER:
                if (event && this.childOf(event.target, this.vendorNameParent?.nativeElement)) {
                    return;
                }
                this.showVendorSearchBar = openFilter;
                break;
            default: break;
        }
    }

    /**
     * Pagination change handler
     *
     * @param {*} event Selected page details
     * @memberof PaymentReportComponent
     */
    public onPageChanged(event: any): void {
        this.fetchAllPayments({ page: event.page, ...this.searchQueryParams }).pipe(takeUntil(this.destroyed$)).subscribe((response) => this.handleFetchAllPaymentResponse(response));
    }

    /**
     * Returns true, if the element is child of parent
     *
     * @param {*} element Element to be tested
     * @param {*} parent Parent with which test is carried out
     * @returns {boolean} True, if element is child of parent
     * @memberof PaymentReportComponent
     */
    public childOf(element: any, parent: any): boolean {
        return parent?.contains(element);
    }

    /**
     * Resets the advance search when user clicks on Clear Filter
     *
     * @memberof PaymentReportComponent
     */
    public resetAdvanceSearch(): void {
        this.showClearFilter = false;
        this.selectedDateRange = { startDate: dayjs(this.universalDate[0]), endDate: dayjs(this.universalDate[1]) };
        this.selectedDateRangeUi = dayjs(this.universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(this.universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
        this.fromDate = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
        this.toDate = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);

        this.searchQueryParams = {
            receiptTypes: [],
            receiptNumber: '',
            baseAccountName: '',
            sortBy: '',
            sort: ''
        };
        this.advanceSearchModel = {
            totalAmountFilter: {
                filterValues: [...this.paymentAdvanceSearchAmountFilters],
                selectedValue: '',
                amount: ''
            },
            unusedAmountFilter: {
                filterValues: [...this.paymentAdvanceSearchAmountFilters],
                selectedValue: '',
                amount: ''
            }
        };
        this.fetchPaymentsData();
    }

    /**
     * Handler for applying sorting
     *
     * @param {string} sort Sort value 'asc' or 'desc'
     * @param {string} sortBy Column name with which sorting is to be applied
     * @memberof PaymentReportComponent
     */
    public handleSorting(sort: string, sortBy: string): void {
        this.showClearFilter = true;
        this.searchQueryParams.sort = sort;
        this.searchQueryParams.sortBy = sortBy;
        this.fetchAllPayments({ ...this.searchQueryParams }).pipe(takeUntil(this.destroyed$)).subscribe((response) => this.handleFetchAllPaymentResponse(response));
    }

    /**
     * Branch change handler
     *
     * @memberof PaymentReportComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
        this.fetchPaymentsData();
    }

    /**
     * Subscribes to input search filters for vendor, receipt, payment and invoice number
     *
     * @private
     * @memberof PaymentReportComponent
     */
    private subscribeToEvents(): void {
        if (!this.previewVoucherParams?.uniqueName) {
            merge(
                fromEvent(this.vendorName?.nativeElement, 'input'),
                fromEvent(this.receiptNumber?.nativeElement, 'input')).pipe(debounceTime(700), takeUntil(this.destroyed$)).subscribe((value) => {
                    this.showClearFilter = true;
                    this.fetchAllPayments(this.searchQueryParams).pipe(takeUntil(this.destroyed$)).subscribe((response) => this.handleFetchAllPaymentResponse(response));
                });
        }
    }

    /**
     * Fetches the payment data and summary data of footer
     *
     * @private
     * @memberof PaymentReportComponent
     */
    private fetchPaymentsData(): void {
        this.fetchAllPayments(this.searchQueryParams).subscribe((response) => this.handleFetchAllPaymentResponse(response));
        this.fetchSummary().pipe(takeUntil(this.destroyed$)).subscribe((response) => this.handleSummaryResponse(response));
    }

    /**
     * Fetches all the payments for particular search filters
     *
     * @private
     * @param {GetAllPaymentsRequest} [additionalRequestParameters] Additional search parameters
     * @returns {Observable<BaseResponse<any, GetAllPaymentsRequest>>} Observable to carry out further operations
     * @memberof PaymentReportComponent
     */
    private fetchAllPayments(additionalRequestParameters?: any): Observable<BaseResponse<any, any>> {
        this.isLoading = true;
        let requestObject: any = {};

        requestObject = {
            companyUniqueName: this.activeCompanyUniqueName,
            from: this.fromDate,
            to: this.toDate,
            count: this.paginationLimit,
            q: this.searchQueryParams.q,
            total: (this.advanceSearchModel.totalAmountFilter) ? this.advanceSearchModel.totalAmountFilter.amount : "",
                balanceDue: (this.advanceSearchModel.unusedAmountFilter) ? this.advanceSearchModel.unusedAmountFilter.amount : "",
            sort: this.searchQueryParams.sort,
            sortBy: this.searchQueryParams.sortBy,
            branchUniqueName: this.currentBranch?.uniqueName
        };

        requestObject.balanceMoreThan = false;
        requestObject.balanceLessThan = false;
        requestObject.balanceEqual = false;

        if (this.advanceSearchModel.unusedAmountFilter.selectedValue === 'GREATER_THAN') {
            requestObject.balanceMoreThan = true;
        } else if(this.advanceSearchModel.unusedAmountFilter.selectedValue === 'GREATER_THAN_OR_EQUALS') {
            requestObject.balanceEqual = true;
            requestObject.balanceMoreThan = true;
        } else if (this.advanceSearchModel.unusedAmountFilter.selectedValue === 'LESS_THAN_OR_EQUALS') {
            requestObject.balanceEqual = true;
            requestObject.balanceLessThan = true;
        } else if (this.advanceSearchModel.unusedAmountFilter.selectedValue === 'EQUALS') {
            requestObject.balanceEqual = true;
        }

        requestObject.totalMoreThan = false;
        requestObject.totalLessThan = false;
        requestObject.totalEqual = false;

        if (this.advanceSearchModel.totalAmountFilter.selectedValue === 'GREATER_THAN') {
            requestObject.totalMoreThan = true;
        } else if(this.advanceSearchModel.totalAmountFilter.selectedValue === 'GREATER_THAN_OR_EQUALS') {
            requestObject.totalEqual = true;
            requestObject.totalMoreThan = true;
        } else if (this.advanceSearchModel.totalAmountFilter.selectedValue === 'LESS_THAN_OR_EQUALS') {
            requestObject.totalEqual = true;
            requestObject.totalLessThan = true;
        } else if (this.advanceSearchModel.totalAmountFilter.selectedValue === 'EQUALS') {
            requestObject.totalEqual = true;
        }

        delete additionalRequestParameters['unUsedAmount'];
        delete additionalRequestParameters['unUsedAmountOperation'];
        delete additionalRequestParameters['totalAmount'];
        delete additionalRequestParameters['totalAmountOperation'];

        const optionalParams = cloneDeep(additionalRequestParameters);
        if (optionalParams) {
            for (let key in optionalParams) {
                if ((optionalParams[key] === undefined || optionalParams[key] === null) || (optionalParams[key] && isArray(optionalParams[key]) && !optionalParams[key]?.length)) {
                    // Delete empty keys or keys with empty arrays as values
                    delete optionalParams[key]; // Delete falsy values
                }
            }
            requestObject = { ...requestObject, ...optionalParams };
        }
        return this.receiptService.GetAllReceipt(requestObject, 'payment');
    }

    /**
     * Fetches the summary of all the payments to be displayed in footer section
     *
     * @private
     * @returns {Observable<BaseResponse<any, PaymentSummaryRequest>>} Observable to carry out further operations
     * @memberof PaymentReportComponent
     */
    private fetchSummary(): Observable<BaseResponse<any, PaymentSummaryRequest>> {
        if (this.voucherApiVersion === 2) {
            const requestObj = {
                from: this.fromDate,
                to: this.toDate,
                q: this.searchQueryParams.q
            };
            return this.receiptService.getAllReceiptBalanceDue(requestObj, "payment");
        } else {
            const requestObject: PaymentSummaryRequest = {
                companyUniqueName: this.activeCompanyUniqueName,
                from: this.fromDate,
                to: this.toDate,
                branchUniqueName: this.currentBranch?.uniqueName
            };
            return this.receiptService.fetchSummary(requestObject);
        }
    }

    /**
     * Handler for handling all payments response received from the API
     *
     * @private
     * @param {*} response Response form the GET ALL api
     * @returns {*} If success then response of API call else error toast
     * @memberof PaymentReportComponent
     */
    private handleFetchAllPaymentResponse(response: any): any {
        this.isLoading = false;
        if (response) {
            if (response.status === 'success' && response.body) {
                this.pageConfiguration.currentPage = response.body.page;
                this.pageConfiguration.totalPages = response.body.totalPages;
                this.pageConfiguration.totalItems = response.body.totalItems;
                this.allPayments = response.body.items;

                this.allPayments.forEach(payment => {
                    let isSeleted = this.selectedPayments.some(selectedPayment => selectedPayment === payment?.uniqueName);
                    if (isSeleted) {
                        payment.isSelected = true;
                    }
                    payment = this.generalService.addToolTipText("payment", this.baseCurrency, payment, this.localeData, this.commonLocaleData);
                });

                this.changeDetectorRef.detectChanges();
                return response.body;
            } else {
                this.toastService.errorToast(response.message, response.code);
            }
        }
    }

    /**
     * Handler for handling summary response received from the API
     *
     * @private
     * @param {*} response Response received from API
     * @memberof PaymentReportComponent
     */
    private handleSummaryResponse(response: any): void {
        if (response) {
            if (response.status === 'success' && response.body) {
                this.paymentsSummaryData = response.body;
            } else {
                this.toastService.errorToast(response.message, response.code);
            }
        }
    }

    /**
    *To show the datepicker
    *
    * @param {*} element
    * @memberof AuditLogsFormComponent
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
     * @memberof AuditLogsFormComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof AuditLogsFormComponent
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
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.showClearFilter = true;
            this.fetchPaymentsData();
        }
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof PaymentReportComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            this.paymentAdvanceSearchAmountFilters = [
                { label: this.commonLocaleData?.app_comparision_filters.greater_than, value: 'GREATER_THAN' },
                { label: this.commonLocaleData?.app_comparision_filters.greater_than_equals, value: 'GREATER_THAN_OR_EQUALS' },
                { label: this.commonLocaleData?.app_comparision_filters.less_than_equals, value: 'LESS_THAN_OR_EQUALS' },
                { label: this.commonLocaleData?.app_comparision_filters.equals, value: 'EQUALS' }
            ];
            this.advanceSearchModel.totalAmountFilter.filterValues = this.paymentAdvanceSearchAmountFilters;
            this.advanceSearchModel.unusedAmountFilter.filterValues = this.paymentAdvanceSearchAmountFilters;
        }
    }

    /**
     * This will update the search query param
     *
     * @param {*} value
     * @memberof PaymentReportComponent
     */
    public updateSearchQuery(value): void {
        this.searchQueryParams.q = value;
    }

    /**
     * This will preview voucher
     *
     * @param {*} payment
     * @memberof PaymentReportComponent
     */
    public previewVoucher(payment: any): void {
        // if (this.voucherApiVersion === 2) {
        //     this.router.navigate(['/pages/voucher/payment/preview/' + payment.uniqueName + '/' + payment.account?.uniqueName]);
        // }
    }

    /**
     * This will check/uncheck the selected payment for bulk operations
     *
     * @param {*} payment
     * @memberof PaymentReportComponent
     */
    public togglePayment(payment: any): void {
        if (payment.isSelected) {
            this.selectedPayments = this.selectedPayments?.filter(selectedPayment => selectedPayment !== payment?.uniqueName);
            this.allPaymentsSelected = false;
        } else {
            this.selectedPayments.push(payment?.uniqueName);
        }
        payment.isSelected = !payment.isSelected;
    }

    /**
     * This will check/uncheck all payments for bulk operations
     *
     * @param {boolean} [uncheckAll]
     * @memberof PaymentReportComponent
     */
    public toggleAllPayments(uncheckAll?: boolean): void {
        if (this.allPaymentsSelected || uncheckAll) {
            this.selectedPayments = [];

            this.allPayments.map(payment => {
                payment.isSelected = false;
                return payment;
            });
        } else {
            this.allPayments.forEach(payment => {
                payment.isSelected = true;
                this.selectedPayments.push(payment?.uniqueName);
            });
        }

        if (uncheckAll) {
            this.allPaymentsSelected = false;
        } else {
            this.allPaymentsSelected = !this.allPaymentsSelected;
        }
    }

    /**
     * This will delete the payment if confirmed to delete
     *
     * @memberof PaymentReportComponent
     */
    public deletePayments(): void {
        this.closeConfirmationPopup();

        let bulkDeleteModel = {
            voucherUniqueNames: this.selectedPayments,
            voucherType: "payment"
        }

        this.invoiceBulkUpdateService.bulkUpdateInvoice(bulkDeleteModel, 'delete').subscribe(response => {
            if (response) {
                if (response.status === "success") {
                    this.toastService.successToast(response.body);
                    this.fetchPaymentsData();
                    this.toggleAllPayments(true);
                } else {
                    this.toastService.errorToast(response.message);
                }
            } else {
                this.toastService.errorToast(this.commonLocaleData?.app_something_went_wrong);
            }
        });
    }

    /**
     * This will open delete confirmation modal
     *
     * @memberof PaymentReportComponent
     */
    public openConfirmationPopup() {
        this.paymentConfirmationModel?.show();
    }

    /**
     * This will close delete confirmation modal
     *
     * @memberof PaymentReportComponent
     */
    public closeConfirmationPopup() {
        this.paymentConfirmationModel?.hide();
    }
}

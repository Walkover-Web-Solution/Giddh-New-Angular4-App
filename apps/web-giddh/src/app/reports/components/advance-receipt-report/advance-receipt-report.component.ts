import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { fromEvent, merge, Observable, of, ReplaySubject } from 'rxjs';
import { debounceTime, takeUntil, take } from 'rxjs/operators';
import { GeneralActions } from '../../../actions/general/general.actions';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../../../models/user-login-state';
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT, SubVoucher } from '../../../app.constant';
import { cloneDeep, isArray } from '../../../lodash-optimized';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { AdvanceReceiptSummaryRequest } from '../../../models/api-models/Reports';
import { GeneralService } from '../../../services/general.service';
import { ReceiptService } from '../../../services/receipt.service';
import { ToasterService } from '../../../services/toaster.service';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { ElementViewContainerRef } from '../../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { AppState } from '../../../store';
import { ADVANCE_RECEIPT_REPORT_FILTERS, ReceiptAdvanceSearchModel } from '../../constants/reports.constant';
import { ReceiptAdvanceSearchComponent } from '../receipt-advance-search/receipt-advance-search.component';
import { ActivatedRoute } from '@angular/router';
import { InvoiceBulkUpdateService } from '../../../services/invoice.bulkupdate.service';
import { saveAs } from 'file-saver';
import { InvoiceService } from '../../../services/invoice.service';

@Component({
    selector: 'advance-receipt-report',
    templateUrl: './advance-receipt-report.component.html',
    styleUrls: ['./advance-receipt-report.component.scss']
})
export class AdvanceReceiptReportComponent implements AfterViewInit, OnDestroy, OnInit {
    /** Customer name search bar */
    @ViewChild('customerName', { static: false }) public customerName: ElementRef;
    /** Parent of customer name search bar */
    @ViewChild('customerNameParent', { static: false }) public customerNameParent: ElementRef;
    /** Receipt number search bar */
    @ViewChild('receiptNumber', { static: false }) public receiptNumber: ElementRef;
    /** Parent of receipt number search bar */
    @ViewChild('receiptNumberParent', { static: false }) public receiptNumberParent: ElementRef;
    /** Payment mode search bar */
    @ViewChild('paymentMode', { static: false }) public paymentMode: ElementRef;
    /** Parent of payment mode search bar */
    @ViewChild('paymentModeParent', { static: false }) public paymentModeParent: ElementRef;
    /** Invoice number search bar */
    @ViewChild('invoiceNumber', { static: false }) public invoiceNumber: ElementRef;
    /** Parent of invoice number search bar */
    @ViewChild('invoiceNumberParent', { static: false }) public invoiceNumberParent: ElementRef;
    /** Advance search modal instance */
    @ViewChild('receiptAdvanceSearchFilterModal', { static: false }) public receiptAdvanceSearchFilterModal: ElementViewContainerRef;
    /** Container of Advance search modal instance */
    @ViewChild('receiptAdvanceSearchModalContainer', { static: false }) public receiptAdvanceSearchModalContainer: ModalDirective;
    /** Instance of receipt confirmation modal */
    @ViewChild('receiptConfirmationModel', { static: false }) public receiptConfirmationModel: ModalDirective;
    /** dayjs method */
    public dayjs = dayjs;
    /** Receipt type for filter */
    public receiptType: Array<any>;
    /** Modal reference */
    public modalRef: BsModalRef;
    /** Stores the list of all receipts */
    public allReceipts: Array<any>;
    /** Stores summary data of all receipts based on filters applied */
    public receiptsSummaryData: any;
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
        receiptTypes: [],  // Receipt type
        receiptNumber: '',  // Receipt Number
        baseAccountName: '',  // Customer Name
        particularName: '', // Payment Mode
        invoiceNumber: '',  // Invoice Number
        sortBy: '',  // Sort by
        sort: '',
        q: ''
    };
    /** True, if the user clicks to search Receipt */
    public showReceiptSearchBar: boolean = false;
    /** True, if the user clicks to search Customer */
    public showCustomerSearchBar: boolean = false;
    /** True, if the user clicks to search Payment */
    public showPaymentSearchBar: boolean = false;
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
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Advance search model to initialize the advance search fields */
    private advanceSearchModel: ReceiptAdvanceSearchModel = {
        adjustmentVoucherDetails: {
            vouchers: [],
            selectedValue: this.searchQueryParams.receiptTypes[0],
            isDisabled: !!this.searchQueryParams.receiptTypes?.length
        },
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
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
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
    /** Amount filter values for Advance Search in receipt reports */
    public advanceReceiptAdvanceSearchAmountFilters: any;
    /** List of receipt types for filters */
    public receiptTypes: any;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2;
    /** Voucher params */
    public previewVoucherParams: any = {};
    /** List of selected receipts */
    public selectedReceipts: any[] = [];
    /** True if all receipts are selected */
    public allReceiptsSelected: boolean = false;
    /** Uniquename of receipt user hovered */
    public hoveredReceiptUniqueName: string = "";
    /** True if table is hovered */
    public hoveredReceiptTable: boolean = false;
    /** Holds currency */
    public baseCurrency: string = '';
    /** Decimal places from company settings */
    public giddhBalanceDecimalPlaces: number = 2;
    /** Holds Payment Report export request */
    private exportcsvRequest: any = {
        from: '',
        to: '',
        dataToSend: {}
    };

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
        private route: ActivatedRoute,
        private invoiceBulkUpdateService: InvoiceBulkUpdateService,
        private invoiceService: InvoiceService
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
                this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
            }
        });
    }

    /** Subscribe to universal date and set header title */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.store.dispatch(this.generalAction.setAppTitle('/pages/reports/receipt'));
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
            this.fetchReceiptsData();
        });
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch.alias,
                    value: branch?.uniqueName,
                    name: branch.name,
                    parentBranch: branch.parentBranch
                }));
                this.currentCompanyBranches.unshift({
                    label: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                    name: this.activeCompany ? this.activeCompany.name : '',
                    value: this.activeCompany ? this.activeCompany?.uniqueName : '',
                    isCompany: true
                });
                if (!this.currentBranch?.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded
                    let currentBranchUniqueName;
                    if (this.currentOrganizationType === OrganizationType.Branch) {
                        currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                        this.currentBranch = _.cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName)) || this.currentBranch;
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany?.uniqueName : '';
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : '',
                            alias: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                            uniqueName: this.activeCompany ? this.activeCompany?.uniqueName : '',
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
     * @memberof AdvanceReceiptReportComponent
     */
    public ngAfterViewInit(): void {
        if (!this.previewVoucherParams?.uniqueName) {
            this.subscribeToEvents();
        }
    }

    /**
     * Unsubscribes from the listeners to avoid memory leaks
     *
     * @memberof AdvanceReceiptReportComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Opens the advance search model
     *
     * @memberof AdvanceReceiptReportComponent
     */
    public openModal(): void {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ReceiptAdvanceSearchComponent);
        const viewContainerRef = this.receiptAdvanceSearchFilterModal.viewContainerRef;
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent(componentFactory);

        this.advanceSearchModel.adjustmentVoucherDetails.selectedValue = (this.searchQueryParams.receiptTypes?.length) ? this.searchQueryParams.receiptTypes[0] : undefined;
        this.advanceSearchModel.adjustmentVoucherDetails.isDisabled = !!this.searchQueryParams.receiptTypes?.length;
        (componentRef.instance as ReceiptAdvanceSearchComponent).searchModel = cloneDeep(this.advanceSearchModel);
        (componentRef.instance as ReceiptAdvanceSearchComponent).localeData = cloneDeep(this.localeData);
        (componentRef.instance as ReceiptAdvanceSearchComponent).commonLocaleData = cloneDeep(this.commonLocaleData);

        merge(
            (componentRef.instance as ReceiptAdvanceSearchComponent).closeModal,
            (componentRef.instance as ReceiptAdvanceSearchComponent).cancel).pipe(takeUntil(this.destroyed$)).subscribe(() => {
                // Listener for close and cancel event of modal
                this.receiptAdvanceSearchModalContainer.hide();
            });
        (componentRef.instance as ReceiptAdvanceSearchComponent).confirm.pipe(takeUntil(this.destroyed$)).subscribe((data: ReceiptAdvanceSearchModel) => {
            // Listener for confirm event of modal
            this.showClearFilter = true;
            this.advanceSearchModel = cloneDeep(data);
            if (data.adjustmentVoucherDetails.selectedValue) {
                this.searchQueryParams.receiptTypes = [data.adjustmentVoucherDetails.selectedValue];
            }
            this.fetchAllReceipts({
                companyUniqueName: this.activeCompanyUniqueName,
                receiptTypes: this.searchQueryParams.receiptTypes,
                totalAmount: data.totalAmountFilter.amount,
                totalAmountOperation: data.totalAmountFilter.selectedValue,
                unUsedAmount: data.unusedAmountFilter.amount,
                unUsedAmountOperation: data.unusedAmountFilter.selectedValue
            }).pipe(takeUntil(this.destroyed$)).subscribe((response) => this.handleFetchAllReceiptResponse(response));
            this.receiptAdvanceSearchModalContainer.hide();
        });
        this.receiptAdvanceSearchModalContainer.show();
    }
    /**
     * Opens/Closes the respective search bar based on parameters provided
     *
     * @param {string} filterName Name of the filter to open or close
     * @param {boolean} openFilter True, if filter needs to be opened
     * @memberof AdvanceReceiptReportComponent
     */
    public searchBy(event: any, filterName: string, openFilter: boolean): void {
        switch (filterName) {
            case ADVANCE_RECEIPT_REPORT_FILTERS.RECEIPT_FILTER:
                if (event && this.childOf(event.target, this.receiptNumberParent?.nativeElement)) {
                    return;
                }
                this.showReceiptSearchBar = openFilter;
                break;
            case ADVANCE_RECEIPT_REPORT_FILTERS.CUSTOMER_FILTER:
                if (event && this.childOf(event.target, this.customerNameParent?.nativeElement)) {
                    return;
                }
                this.showCustomerSearchBar = openFilter;
                break;
            case ADVANCE_RECEIPT_REPORT_FILTERS.PAYMENT_FILTER:
                if (event && this.childOf(event.target, this.paymentModeParent?.nativeElement)) {
                    return;
                }
                this.showPaymentSearchBar = openFilter;
                break;
            case ADVANCE_RECEIPT_REPORT_FILTERS.INVOICE_FILTER:
                if (event && this.childOf(event.target, this.invoiceNumberParent?.nativeElement)) {
                    return;
                }
                this.showInvoiceSearchBar = openFilter;
                break;
            default: break;
        }
    }

    /**
     * Receipt change handler
     *
     * @param {string} currentlySelectedReceipt Receipt selected by the user
     * @memberof AdvanceReceiptReportComponent
     */
    public onReceiptTypeChanged(currentlySelectedReceipt: string): void {
        this.showClearFilter = true;
        this.searchQueryParams.receiptTypes = [currentlySelectedReceipt];
        this.fetchAllReceipts({ ...this.searchQueryParams }).pipe(takeUntil(this.destroyed$)).subscribe((response) => this.handleFetchAllReceiptResponse(response));
    }

    /**
     * Pagination change handler
     *
     * @param {*} event Selected page details
     * @memberof AdvanceReceiptReportComponent
     */
    public onPageChanged(event: any): void {
        this.fetchAllReceipts({ page: event.page, ...this.searchQueryParams }).pipe(takeUntil(this.destroyed$)).subscribe((response) => this.handleFetchAllReceiptResponse(response));
    }

    /**
     * Returns true, if the element is child of parent
     *
     * @param {*} element Element to be tested
     * @param {*} parent Parent with which test is carried out
     * @returns {boolean} True, if element is child of parent
     * @memberof AdvanceReceiptReportComponent
     */
    public childOf(element: any, parent: any): boolean {
        return parent?.contains(element);
    }

    /**
     * Resets the advance search when user clicks on Clear Filter
     *
     * @memberof AdvanceReceiptReportComponent
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
            particularName: '',
            invoiceNumber: '',
            sortBy: '',
            sort: ''
        };
        this.advanceSearchModel = {
            adjustmentVoucherDetails: {
                vouchers: [...this.receiptTypes],
                selectedValue: this.searchQueryParams.receiptTypes[0],
                isDisabled: !!this.searchQueryParams.receiptTypes?.length
            },
            totalAmountFilter: {
                filterValues: [...this.advanceReceiptAdvanceSearchAmountFilters],
                selectedValue: '',
                amount: ''
            },
            unusedAmountFilter: {
                filterValues: [...this.advanceReceiptAdvanceSearchAmountFilters],
                selectedValue: '',
                amount: ''
            }
        };
        this.fetchReceiptsData();
    }

    /**
     * Handler for applying sorting
     *
     * @param {string} sort Sort value 'asc' or 'desc'
     * @param {string} sortBy Column name with which sorting is to be applied
     * @memberof AdvanceReceiptReportComponent
     */
    public handleSorting(sort: string, sortBy: string): void {
        this.showClearFilter = true;
        this.searchQueryParams.sort = sort;
        this.searchQueryParams.sortBy = sortBy;
        this.fetchAllReceipts({ ...this.searchQueryParams }).pipe(takeUntil(this.destroyed$)).subscribe((response) => this.handleFetchAllReceiptResponse(response));
    }

    /**
     * Branch change handler
     *
     * @memberof AdvanceReceiptReportComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
        this.fetchReceiptsData();
    }

    /**
     * Subscribes to input search filters for customer, receipt, payment and invoice number
     *
     * @private
     * @memberof AdvanceReceiptReportComponent
     */
    private subscribeToEvents(): void {
        merge(
            fromEvent(this.customerName?.nativeElement, 'input'),
            fromEvent(this.receiptNumber?.nativeElement, 'input'),
            fromEvent(this.paymentMode?.nativeElement, 'input'),
            fromEvent(this.invoiceNumber?.nativeElement, 'input')).pipe(debounceTime(700), takeUntil(this.destroyed$)).subscribe((value) => {
                this.showClearFilter = true;
                this.fetchAllReceipts(this.searchQueryParams).pipe(takeUntil(this.destroyed$)).subscribe((response) => this.handleFetchAllReceiptResponse(response));
            });
    }

    /**
     * Fetches the receipt data and summary data of footer
     *
     * @private
     * @memberof AdvanceReceiptReportComponent
     */
    private fetchReceiptsData(): void {
        this.fetchAllReceipts(this.searchQueryParams).subscribe((response) => this.handleFetchAllReceiptResponse(response));
        this.fetchSummary().pipe(takeUntil(this.destroyed$)).subscribe((response) => this.handleSummaryResponse(response));
    }

    /**
     * Fetches all the receipts for particular search filters
     *
     * @private
     * @param {GetAllAdvanceReceiptsRequest} [additionalRequestParameters] Additional search parameters
     * @returns {Observable<BaseResponse<any, GetAllAdvanceReceiptsRequest>>} Observable to carry out further operations
     * @memberof AdvanceReceiptReportComponent
     */
    private fetchAllReceipts(additionalRequestParameters?: any): Observable<BaseResponse<any, any>> {
        this.isLoading = true;
        let requestObject: any = {};

        if (this.voucherApiVersion === 2) {
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

            if (additionalRequestParameters.receiptTypes?.length > 0) {
                if (additionalRequestParameters.receiptTypes[0] === "advance receipt") {
                    requestObject.receiptType = SubVoucher.AdvanceReceipt;
                } else {
                    requestObject.receiptType = "NORMAL_RECEIPT";
                }
            }
            delete additionalRequestParameters['receiptTypes'];

            requestObject.balanceMoreThan = false;
            requestObject.balanceLessThan = false;
            requestObject.balanceEqual = false;

            if (this.advanceSearchModel.unusedAmountFilter.selectedValue === 'GREATER_THAN') {
                requestObject.balanceMoreThan = true;
            } else if (this.advanceSearchModel.unusedAmountFilter.selectedValue === 'GREATER_THAN_OR_EQUALS') {
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
            } else if (this.advanceSearchModel.totalAmountFilter.selectedValue === 'GREATER_THAN_OR_EQUALS') {
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
        } else {
            requestObject = {
                companyUniqueName: this.activeCompanyUniqueName,
                from: this.fromDate,
                to: this.toDate,
                count: this.paginationLimit,
                receiptTypes: this.searchQueryParams.receiptTypes,
                receiptNumber: this.searchQueryParams.receiptNumber,
                baseAccountName: this.searchQueryParams.baseAccountName,
                particularName: this.searchQueryParams.particularName,
                invoiceNumber: this.searchQueryParams.invoiceNumber,
                totalAmount: (this.advanceSearchModel.totalAmountFilter) ? this.advanceSearchModel.totalAmountFilter.amount : "",
                totalAmountOperation: (this.advanceSearchModel.totalAmountFilter) ? this.advanceSearchModel.totalAmountFilter.selectedValue : "",
                unUsedAmount: (this.advanceSearchModel.unusedAmountFilter) ? this.advanceSearchModel.unusedAmountFilter.amount : "",
                unUsedAmountOperation: (this.advanceSearchModel.unusedAmountFilter) ? this.advanceSearchModel.unusedAmountFilter.selectedValue : "",
                sort: this.searchQueryParams.sort,
                sortBy: this.searchQueryParams.sortBy,
                branchUniqueName: this.currentBranch?.uniqueName
            };
        }

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
        return (this.voucherApiVersion === 2) ? this.receiptService.GetAllReceipt(requestObject, 'receipt') : this.receiptService.getAllAdvanceReceipts(requestObject);
    }

    /**
     * Fetches the summary of all the receipts to be displayed in footer section
     *
     * @private
     * @returns {Observable<BaseResponse<any, AdvanceReceiptSummaryRequest>>} Observable to carry out further operations
     * @memberof AdvanceReceiptReportComponent
     */
    private fetchSummary(): Observable<BaseResponse<any, AdvanceReceiptSummaryRequest>> {
        if (this.voucherApiVersion === 2) {
            const requestObj = {
                from: this.fromDate,
                to: this.toDate,
                q: this.searchQueryParams.q
            };
            return this.receiptService.getAllReceiptBalanceDue(requestObj, "receipt");
        } else {
            const requestObject: AdvanceReceiptSummaryRequest = {
                companyUniqueName: this.activeCompanyUniqueName,
                from: this.fromDate,
                to: this.toDate,
                branchUniqueName: this.currentBranch?.uniqueName
            };
            return this.receiptService.fetchSummary(requestObject);
        }
    }

    /**
     * Handler for handling all receipts response received from the API
     *
     * @private
     * @param {*} response Response form the GET ALL api
     * @returns {*} If success then response of API call else error toast
     * @memberof AdvanceReceiptReportComponent
     */
    private handleFetchAllReceiptResponse(response: any): any {
        this.isLoading = false;
        if (response) {
            if (response.status === 'success' && response.body) {
                this.pageConfiguration.currentPage = response.body.page;
                this.pageConfiguration.totalPages = response.body.totalPages;
                this.pageConfiguration.totalItems = response.body.totalItems;
                this.allReceipts = (this.voucherApiVersion === 2) ? response.body.items : response.body.results;

                this.allReceipts.forEach(receipt => {
                    let isSeleted = this.selectedReceipts?.some(selectedReceipt => selectedReceipt === receipt?.uniqueName);
                    if (isSeleted) {
                        receipt.isSelected = true;
                    }
                    receipt = this.generalService.addToolTipText("receipt", this.baseCurrency, receipt, this.localeData, this.commonLocaleData, this.giddhBalanceDecimalPlaces);
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
     * @memberof AdvanceReceiptReportComponent
     */
    private handleSummaryResponse(response: any): void {
        if (response) {
            if (response.status === 'success' && response.body) {
                this.receiptsSummaryData = response.body;
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
            this.fetchReceiptsData();
        }
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof AdvanceReceiptReportComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            if (this.voucherApiVersion === 2) {
                this.advanceReceiptAdvanceSearchAmountFilters = [
                    { label: this.commonLocaleData?.app_comparision_filters.greater_than, value: 'GREATER_THAN' },
                    { label: this.commonLocaleData?.app_comparision_filters.greater_than_equals, value: 'GREATER_THAN_OR_EQUALS' },
                    { label: this.commonLocaleData?.app_comparision_filters.less_than_equals, value: 'LESS_THAN_OR_EQUALS' },
                    { label: this.commonLocaleData?.app_comparision_filters.equals, value: 'EQUALS' }
                ];
            } else {
                this.advanceReceiptAdvanceSearchAmountFilters = [
                    { label: this.commonLocaleData?.app_comparision_filters.greater_than, value: 'GREATER_THAN' },
                    { label: this.commonLocaleData?.app_comparision_filters.greater_than_equals, value: 'GREATER_THAN_OR_EQUALS' },
                    { label: this.commonLocaleData?.app_comparision_filters.less_than_equals, value: 'LESS_THAN_OR_EQUALS' },
                    { label: this.commonLocaleData?.app_comparision_filters.equals, value: 'EQUALS' },
                    { label: this.commonLocaleData?.app_comparision_filters.not_equals, value: 'NOT_EQUALS' }
                ];
            }

            this.receiptTypes = [
                { label: this.localeData?.receipt_types.normal_receipts, value: 'normal receipt' },
                { label: this.localeData?.receipt_types.advance_receipts, value: 'advance receipt' }
            ];

            this.receiptType = this.receiptTypes;
            this.advanceSearchModel.adjustmentVoucherDetails.vouchers = this.receiptTypes;
            this.advanceSearchModel.totalAmountFilter.filterValues = this.advanceReceiptAdvanceSearchAmountFilters;
            this.advanceSearchModel.unusedAmountFilter.filterValues = this.advanceReceiptAdvanceSearchAmountFilters;
        }
    }

    /**
     * This will update the search query param
     *
     * @param {*} value
     * @memberof AdvanceReceiptReportComponent
     */
    public updateSearchQuery(value): void {
        this.searchQueryParams.q = value;
    }

    /**
     * This will preview voucher
     *
     * @param {*} receipt
     * @memberof AdvanceReceiptReportComponent
     */
    public previewVoucher(receipt: any): void {
        // if (this.voucherApiVersion === 2) {
        //     this.router.navigate(['/pages/voucher/receipt/preview/' + receipt.uniqueName + '/' + receipt.account?.uniqueName]);
        // }
    }

    /**
     * This will check/uncheck the selected receipt for bulk operations
     *
     * @param {*} receipt
     * @memberof AdvanceReceiptReportComponent
     */
    public toggleReceipt(receipt: any): void {
        if (receipt.isSelected) {
            this.selectedReceipts = this.selectedReceipts?.filter(selectedReceipt => selectedReceipt !== receipt?.uniqueName);
            this.allReceiptsSelected = false;
        } else {
            this.selectedReceipts.push(receipt?.uniqueName);
        }
        receipt.isSelected = !receipt.isSelected;
    }

    /**
     * This will check/uncheck all receipts for bulk operations
     *
     * @param {boolean} [uncheckAll]
     * @memberof AdvanceReceiptReportComponent
     */
    public toggleAllReceipts(uncheckAll?: boolean): void {
        if (this.allReceiptsSelected || uncheckAll) {
            this.selectedReceipts = [];

            this.allReceipts.map(receipt => {
                receipt.isSelected = false;
                return receipt;
            });
        } else {
            this.allReceipts.forEach(receipt => {
                receipt.isSelected = true;
                this.selectedReceipts.push(receipt?.uniqueName);
            });
        }

        if (uncheckAll) {
            this.allReceiptsSelected = false;
        } else {
            this.allReceiptsSelected = !this.allReceiptsSelected;
        }
    }

    /**
     * This will delete the receipt if confirmed to delete
     *
     * @memberof AdvanceReceiptReportComponent
     */
    public deleteReceipts(): void {
        this.closeConfirmationPopup();

        let bulkDeleteModel = {
            voucherUniqueNames: this.selectedReceipts,
            voucherType: "receipt"
        }

        this.invoiceBulkUpdateService.bulkUpdateInvoice(bulkDeleteModel, 'delete').subscribe(response => {
            if (response) {
                if (response.status === "success") {
                    this.toastService.successToast(response.body);
                    this.fetchReceiptsData();
                    this.toggleAllReceipts(true);
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
     * @memberof AdvanceReceiptReportComponent
     */
    public openConfirmationPopup() {
        this.receiptConfirmationModel?.show();
    }

    /**
     * This will close delete confirmation modal
     *
     * @memberof AdvanceReceiptReportComponent
     */
    public closeConfirmationPopup() {
        this.receiptConfirmationModel?.hide();
    }

    /**
    * Export Selected advance receipt report to .xls
    *
    * @returns {*}
    * @memberof AdvanceReceiptReportComponent
    */
    public exportCsvDownload(): any {
        const isAllItemsSelected = this.allReceiptsSelected;
        this.exportcsvRequest.from = this.fromDate;
        this.exportcsvRequest.to = this.toDate;
        let dataTosend = { accountUniqueName: '', uniqueNames: [], type: 'payment' };
        if (this.selectedReceipts?.length === 1) {
            dataTosend.accountUniqueName = this.selectedReceipts[0].account?.uniqueName;
        } else {
            delete dataTosend.accountUniqueName;
        }
        if (this.selectedReceipts.length) {
            dataTosend.uniqueNames = this.selectedReceipts;
        }
        this.exportcsvRequest.dataToSend = dataTosend;
        this.invoiceService.exportCsvInvoiceDownload(this.exportcsvRequest).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                if (response.status === 'success') {
                    this.selectedReceipts = [];
                    this.allReceiptsSelected = false;
                    this.allReceipts.forEach((item) => {
                        item.isSelected = false;
                    });
                    let blob = this.generalService.base64ToBlob(response.body, 'application/xls', 512);
                    const fileName = `${isAllItemsSelected ? this.localeData?.all_receipts : this.localeData?.receipts}.xls`;
                    return saveAs(blob, fileName);
                } else {
                    this.toastService.errorToast(response.message);
                }
            }
        });
    }
}

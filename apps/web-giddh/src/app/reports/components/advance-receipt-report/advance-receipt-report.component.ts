import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment/moment';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { fromEvent, merge, Observable, ReplaySubject } from 'rxjs';
import { debounceTime, takeUntil, take } from 'rxjs/operators';

import { GeneralActions } from '../../../actions/general/general.actions';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { PAGINATION_LIMIT } from '../../../app.constant';
import { cloneDeep, isArray } from '../../../lodash-optimized';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { AdvanceReceiptSummaryRequest, GetAllAdvanceReceiptsRequest } from '../../../models/api-models/Reports';
import { OrganizationType } from '../../../models/user-login-state';
import { GeneralService } from '../../../services/general.service';
import { ReceiptService } from '../../../services/receipt.service';
import { ToasterService } from '../../../services/toaster.service';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { ElementViewContainerRef } from '../../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { AppState } from '../../../store';
import {
    ADVANCE_RECEIPT_ADVANCE_SEARCH_AMOUNT_FILTERS,
    ADVANCE_RECEIPT_REPORT_FILTERS,
    RECEIPT_TYPES,
    ReceiptAdvanceSearchModel,
} from '../../constants/reports.constant';
import { ReceiptAdvanceSearchComponent } from '../receipt-advance-search/receipt-advance-search.component';

@Component({
    selector: 'advance-receipt-report',
    templateUrl: './advance-receipt-report.component.html',
    styleUrls: ['./advance-receipt-report.component.scss']
})
export class AdvanceReceiptReportComponent implements AfterViewInit, OnDestroy, OnInit {

    /** Customer name search bar */
    @ViewChild('customerName', {static: true}) public customerName: ElementRef;
    /** Parent of customer name search bar */
    @ViewChild('customerNameParent', {static: true}) public customerNameParent: ElementRef;
    /** Receipt number search bar */
    @ViewChild('receiptNumber', {static: true}) public receiptNumber: ElementRef;
    /** Parent of receipt number search bar */
    @ViewChild('receiptNumberParent', {static: true}) public receiptNumberParent: ElementRef;
    /** Payment mode search bar */
    @ViewChild('paymentMode', {static: true}) public paymentMode: ElementRef;
    /** Parent of payment mode search bar */
    @ViewChild('paymentModeParent', {static: true}) public paymentModeParent: ElementRef;
    /** Invoice number search bar */
    @ViewChild('invoiceNumber', {static: true}) public invoiceNumber: ElementRef;
    /** Parent of invoice number search bar */
    @ViewChild('invoiceNumberParent', {static: true}) public invoiceNumberParent: ElementRef;
    /** Advance search modal instance */
    @ViewChild('receiptAdvanceSearchFilterModal', {static: true}) public receiptAdvanceSearchFilterModal: ElementViewContainerRef;
    /** Container of Advance search modal instance */
    @ViewChild('receiptAdvanceSearchModalContainer', {static: true}) public receiptAdvanceSearchModalContainer: ModalDirective;

    /** Moment method */
    public moment = moment;
    /** Date picker options for date filter */
    public datePickerOptions: any = {
        hideOnEsc: true,
        locale: {
            applyClass: 'btn-green',
            applyLabel: 'Go',
            fromLabel: 'From',
            format: 'D-MMM-YY',
            toLabel: 'To',
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom range'
        },
        ranges: {
            'This Month to Date': [
                moment().startOf('month'),
                moment()
            ],
            'This Quarter to Date': [
                moment().quarter(moment().quarter()).startOf('quarter'),
                moment()
            ],
            'This Financial Year to Date': [
                moment().startOf('year').subtract(9, 'month'),
                moment()
            ],
            'This Year to Date': [
                moment().startOf('year'),
                moment()
            ],
            'Last Month': [
                moment().subtract(1, 'month').startOf('month'),
                moment().subtract(1, 'month').endOf('month')
            ],
            'Last Quater': [
                moment().quarter(moment().quarter()).subtract(1, 'quarter').startOf('quarter'),
                moment().quarter(moment().quarter()).subtract(1, 'quarter').endOf('quarter')
            ],
            'Last Financial Year': [
                moment().startOf('year').subtract(10, 'year'),
                moment().endOf('year').subtract(10, 'year')
            ],
            'Last Year': [
                moment().startOf('year').subtract(1, 'year'),
                moment().endOf('year').subtract(1, 'year')
            ]
        },
        startDate: moment().subtract(30, 'days'),
        endDate: moment()
    };
    /** Receipt type for filter */
    public receiptType: Array<any> = RECEIPT_TYPES;
    public modalRef: BsModalRef;
    public message: string;
    public showEntryDate = true;
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
        sort: '' // Sort value
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

    /** Advance search model to initialize the advance search fields */
    private advanceSearchModel: ReceiptAdvanceSearchModel = {
        adjustmentVoucherDetails: {
            vouchers: [...RECEIPT_TYPES],
            selectedValue: this.searchQueryParams.receiptTypes[0],
            isDisabled: !!this.searchQueryParams.receiptTypes.length
        },
        totalAmountFilter: {
            filterValues: [...ADVANCE_RECEIPT_ADVANCE_SEARCH_AMOUNT_FILTERS],
            selectedValue: '',
            amount: ''
        },
        unusedAmountFilter: {
            filterValues: [...ADVANCE_RECEIPT_ADVANCE_SEARCH_AMOUNT_FILTERS],
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

    /** @ignore */
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private generalAction: GeneralActions,
        private receiptService: ReceiptService,
        private store: Store<AppState>,
        private toastService: ToasterService,
        private generalService: GeneralService,
        private settingsBranchAction: SettingsBranchActions
    ) { }

    /** Subscribe to universal date and set header title */
    public ngOnInit(): void {
        this.store.dispatch(this.generalAction.setAppTitle('/pages/reports/receipt'));
        this.store.pipe(select(state => state.session.companyUniqueName), take(1)).subscribe(uniqueName => this.activeCompanyUniqueName = uniqueName);
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((applicationDate) => {
            if (applicationDate) {
                this.universalDate = applicationDate;
                this.datePickerOptions = {
                    ...this.datePickerOptions,
                    startDate: moment(applicationDate[0], GIDDH_DATE_FORMAT).toDate(),
                    endDate: moment(applicationDate[1], GIDDH_DATE_FORMAT).toDate(),
                    chosenLabel: applicationDate[2]
                }
            }
            this.fetchReceiptsData();
        });
        this.store.pipe(
            select(state => state.session.activeCompany), take(1)
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
                if (this.generalService.currentOrganizationType === OrganizationType.Branch) {
                    currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                    this.currentBranch = _.cloneDeep(response.find(branch => branch.uniqueName === currentBranchUniqueName));
                } else {
                    currentBranchUniqueName = this.activeCompany ? this.activeCompany.uniqueName : '';
                    this.currentBranch = {
                        name: this.activeCompany ? this.activeCompany.name : '',
                        alias: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                        uniqueName: this.activeCompany ? this.activeCompany.uniqueName : '',
                    };
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({from: '', to: ''}));
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
        this.subscribeToEvents();
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

        this.advanceSearchModel.adjustmentVoucherDetails.selectedValue = this.searchQueryParams.receiptTypes[0];
        this.advanceSearchModel.adjustmentVoucherDetails.isDisabled = !!this.searchQueryParams.receiptTypes.length;
        (componentRef.instance as ReceiptAdvanceSearchComponent).searchModel = cloneDeep(this.advanceSearchModel);
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
            }).subscribe((response) => this.handleFetchAllReceiptResponse(response));
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
                if (event && this.childOf(event.target, this.receiptNumberParent.nativeElement)) {
                    return;
                }
                this.showReceiptSearchBar = openFilter;
                break;
            case ADVANCE_RECEIPT_REPORT_FILTERS.CUSTOMER_FILTER:
                if (event && this.childOf(event.target, this.customerNameParent.nativeElement)) {
                    return;
                }
                this.showCustomerSearchBar = openFilter;
                break;
            case ADVANCE_RECEIPT_REPORT_FILTERS.PAYMENT_FILTER:
                if (event && this.childOf(event.target, this.paymentModeParent.nativeElement)) {
                    return;
                }
                this.showPaymentSearchBar = openFilter;
                break;
            case ADVANCE_RECEIPT_REPORT_FILTERS.INVOICE_FILTER:
                if (event && this.childOf(event.target, this.invoiceNumberParent.nativeElement)) {
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
        this.fetchAllReceipts({ ...this.searchQueryParams }).subscribe((response) => this.handleFetchAllReceiptResponse(response));
    }

    /**
     * Date picker change handler
     *
     * @param {*} event Selected dates
     * @memberof AdvanceReceiptReportComponent
     */
    public onDateChange(event: any): void {
        this.datePickerOptions.startDate = event.picker.startDate._d;
        this.datePickerOptions.endDate = event.picker.endDate._d;
        this.showClearFilter = true;
        this.fetchReceiptsData();
    }

    /**
     * Pagination change handler
     *
     * @param {*} event Selected page details
     * @memberof AdvanceReceiptReportComponent
     */
    public onPageChanged(event: any): void {
        this.fetchAllReceipts({ page: event.page, ...this.searchQueryParams }).subscribe((response) => this.handleFetchAllReceiptResponse(response));
    }

    /**
     * Returns true, if the element is child of parent
     *
     * @param {*} element Element to be tested
     * @param {*} parent Parent with which test is carried out
     * @returns {boolean} True, if element is child of parent
     * @memberof AdvanceReceiptReportComponent
     */
    public childOf(element, parent): boolean {
        return parent.contains(element);
    }

    /**
     * Resets the advance search when user clicks on Clear Filter
     *
     * @memberof AdvanceReceiptReportComponent
     */
    public resetAdvanceSearch(): void {
        this.showClearFilter = false;
        this.datePickerOptions = {
            ...this.datePickerOptions,
            startDate: moment(this.universalDate[0], GIDDH_DATE_FORMAT).toDate(),
            endDate: moment(this.universalDate[1], GIDDH_DATE_FORMAT).toDate(),
            chosenLabel: this.universalDate[2]
        }
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
                vouchers: [...RECEIPT_TYPES],
                selectedValue: this.searchQueryParams.receiptTypes[0],
                isDisabled: !!this.searchQueryParams.receiptTypes.length
            },
            totalAmountFilter: {
                filterValues: [...ADVANCE_RECEIPT_ADVANCE_SEARCH_AMOUNT_FILTERS],
                selectedValue: '',
                amount: ''
            },
            unusedAmountFilter: {
                filterValues: [...ADVANCE_RECEIPT_ADVANCE_SEARCH_AMOUNT_FILTERS],
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
        this.fetchAllReceipts({ ...this.searchQueryParams }).subscribe((response) => this.handleFetchAllReceiptResponse(response));
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
            fromEvent(this.customerName.nativeElement, 'input'),
            fromEvent(this.receiptNumber.nativeElement, 'input'),
            fromEvent(this.paymentMode.nativeElement, 'input'),
            fromEvent(this.invoiceNumber.nativeElement, 'input')).pipe(debounceTime(700), takeUntil(this.destroyed$)).subscribe((value) => {
                this.showClearFilter = true;
                this.fetchAllReceipts(this.searchQueryParams).subscribe((response) => this.handleFetchAllReceiptResponse(response));
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
        this.fetchSummary().subscribe((response) => this.handleSummaryResponse(response));
    }

    /**
     * Fetches all the receipts for particular search filters
     *
     * @private
     * @param {GetAllAdvanceReceiptsRequest} [additionalRequestParameters] Additional search parameters
     * @returns {Observable<BaseResponse<any, GetAllAdvanceReceiptsRequest>>} Observable to carry out further operations
     * @memberof AdvanceReceiptReportComponent
     */
    private fetchAllReceipts(additionalRequestParameters?: GetAllAdvanceReceiptsRequest): Observable<BaseResponse<any, GetAllAdvanceReceiptsRequest>> {
        let requestObject: GetAllAdvanceReceiptsRequest = {
            companyUniqueName: this.activeCompanyUniqueName,
            from: moment(this.datePickerOptions.startDate).format(GIDDH_DATE_FORMAT),
            to: moment(this.datePickerOptions.endDate).format(GIDDH_DATE_FORMAT),
            count: PAGINATION_LIMIT,
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
            branchUniqueName: this.currentBranch.uniqueName
        };

        const optionalParams = cloneDeep(additionalRequestParameters);
        if (optionalParams) {
            for (let key in optionalParams) {
                if ((optionalParams[key] === undefined || optionalParams[key] === null) || (optionalParams[key] && isArray(optionalParams[key]) && !optionalParams[key].length)) {
                    // Delete empty keys or keys with empty arrays as values
                    delete optionalParams[key]; // Delete falsy values
                }
            }
            requestObject = { ...requestObject, ...optionalParams };
        }
        return this.receiptService.getAllAdvanceReceipts(requestObject);
    }

    /**
     * Fetches the summary of all the receipts to be displayed in footer section
     *
     * @private
     * @returns {Observable<BaseResponse<any, AdvanceReceiptSummaryRequest>>} Observable to carry out further operations
     * @memberof AdvanceReceiptReportComponent
     */
    private fetchSummary(): Observable<BaseResponse<any, AdvanceReceiptSummaryRequest>> {
        const requestObject: AdvanceReceiptSummaryRequest = {
            companyUniqueName: this.activeCompanyUniqueName,
            from: moment(this.datePickerOptions.startDate).format(GIDDH_DATE_FORMAT),
            to: moment(this.datePickerOptions.endDate).format(GIDDH_DATE_FORMAT),
            branchUniqueName: this.currentBranch.uniqueName
        };
        return this.receiptService.fetchSummary(requestObject);
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
        if (response) {
            if (response.status === 'success' && response.body) {
                this.pageConfiguration.currentPage = response.body.page;
                this.pageConfiguration.totalPages = response.body.totalPages;
                this.pageConfiguration.totalItems = response.body.totalItems;
                this.allReceipts = response.body.results;
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
}

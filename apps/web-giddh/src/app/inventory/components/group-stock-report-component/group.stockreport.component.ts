import { ESCAPE } from '@angular/cdk/keycodes';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { createSelector } from 'reselect';
import { Observable, of as observableOf, ReplaySubject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, publishReplay, refCount, take, takeUntil } from 'rxjs/operators';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { StockReportActions } from '../../../actions/inventory/stocks-report.actions';
import { CompanyResponse } from '../../../models/api-models/Company';
import {
    GroupStockReportRequest,
    GroupStockReportResponse,
    InventoryDownloadRequest,
    StockGroupResponse,
} from '../../../models/api-models/Inventory';
import { InventoryService } from '../../../services/inventory.service';
import { ToasterService } from '../../../services/toaster.service';
import { AppState } from '../../../store';
import { InvViewService } from '../../inv.view.service';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { PageEvent } from '@angular/material/paginator';
import { ASIDE_PANE_CONFIG, IOption, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from '../../../app.constant';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import { OrganizationType } from '../../../models/user-login-state';
import { GeneralService } from '../../../services/general.service';
import { cloneDeep, isEqual, orderBy } from '../../../lodash-optimized';
import { MatMenuTrigger } from '@angular/material/menu';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'invetory-group-stock-report',
    templateUrl: './group.stockreport.component.html',
    styleUrls: ['./group.stockreport.component.scss'],
    standalone: false
})

/**
 * InventoryGroupStockReportComponent component
 * Handles inventorygroupstockreport functionality and user interactions
 */
export class InventoryGroupStockReportComponent implements OnChanges, OnInit, OnDestroy {
    @ViewChild('dateRangePickerCmp', { static: true }) public dateRangePickerCmp: ElementRef;
    /** Reference to advance search dialog template */
    @ViewChild('advanceSearchDialog', { static: true }) public advanceSearchDialog: TemplateRef<any>;
    /** Reference to advance search dialog */
    private advanceSearchDialogRef: MatDialogRef<any>;
    @ViewChild("productName", { static: true }) productName: ElementRef;
    @ViewChild("sourceName", { static: true }) sourceName: ElementRef;
    @ViewChild('advanceSearchForm', { static: true }) formValues;
    @ViewChild('template', { static: true }) public template: TemplateRef<any>;
    /** Reference to aside pane template */
    @ViewChild('asidePaneTemplate', { static: true }) public asidePaneTemplate: TemplateRef<any>;
    /** Reference to aside transfer pane template */
    @ViewChild('asideBranchTransferPaneTemplate', { static: true }) public asideBranchTransferPaneTemplate: TemplateRef<any>;
    /** Reference to aside pane dialog */
    public asidePaneDialogRef: MatDialogRef<any>;
    /** Reference to aside transfer pane dialog */
    public asideBranchTransferPaneDialogRef: MatDialogRef<any>;

    /** Stores the branch details along with their warehouses */
    @Input() public currentBranchAndWarehouse: any;
    /** List of branches */
    public branches: Array<any> = [];

    public today: Date = new Date();
    public activeGroup$: Observable<StockGroupResponse>;
    public groupStockReport$: Observable<GroupStockReportResponse>;
    public sub: Subscription;
    public groupUniqueName: string;
    public stockUniqueName: string;
    public GroupStockReportRequest: GroupStockReportRequest;
    public showFromDatePicker: boolean;
    public showToDatePicker: boolean;
    public toDate: string;
    public fromDate: string;
    public dayjs = dayjs;
    public activeGroupName: string;
    public stockList$: Observable<IOption[]>;
    public comparisonFilterDropDown$: Observable<IOption[]>;
    public entityFilterDropDown$: Observable<IOption[]>;
    public valueFilterDropDown$: Observable<IOption[]>;
    public selectedCmp: CompanyResponse;
    public isWarehouse: boolean = false;
    public showAdvanceSearchIcon: boolean = false;
    public showProductSearch: boolean = false;
    public showSourceSearch: boolean = false;
    public productUniqueNameInput: UntypedFormControl = new UntypedFormControl();
    public sourceUniqueNameInput: UntypedFormControl = new UntypedFormControl();
    public entities$: Observable<CompanyResponse[]>;
    public selectedEntity: string = null;
    // modal advance search
    public advanceSearchForm: UntypedFormGroup;
    public filterCategory: string = null;
    public filterCategoryType: string = null;
    public filterValueCondition: string = null;
    public isFilterCorrect: boolean = false;
    public groupUniqueNameFromURL: string = null;
    public pickerSelectedFromDate: string;
    public pickerSelectedToDate: string;
    public transactionTypes: any[] = [
        { id: 1, uniqueName: 'purchase_sale', name: 'Purchase & Sales' },
        { id: 2, uniqueName: 'transfer', name: 'Transfer' },
        { id: 3, uniqueName: 'all', name: 'All Transactions' },
    ];
    public CategoryOptions: any[] = [
        {
            value: "inwards",
            label: "Inwards",
            disabled: false
        },
        {
            value: "outwards",
            label: "Outwards",
            disabled: false
        },
        {
            value: "Opening Stock",
            label: "Opening Stock",
            disabled: false
        },
        {
            value: "Closing Stock",
            label: "Closing Stock",
            disabled: false
        }
    ];

    public CategoryTypeOptions: any[] = [
        {
            value: "quantity",
            label: "Quantity",
            disabled: false
        },
        {
            value: "value",
            label: "Value",
            disabled: false
        }
    ];

    public FilterValueCondition: any[] = [
        {
            value: "EQUALS",
            label: "Equals",
            disabled: false
        },
        {
            value: "GREATER_THAN",
            label: "Greater than",
            disabled: false
        },
        {
            value: "LESS_THAN",
            label: "Less than",
            disabled: false
        },
        {
            value: "NOT_EQUALS",
            label: "Excluded",
            disabled: false
        }
    ];

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
            'Last 1 Day': [
                /**
                 * Handles dayjs functionality
                 */
                dayjs().subtract(1, 'day'),
                /**
                 * Handles dayjs functionality
                 */
                dayjs()
            ],
            'Last 7 Days': [
                /**
                 * Handles dayjs functionality
                 */
                dayjs().subtract(6, 'day'),
                /**
                 * Handles dayjs functionality
                 */
                dayjs()
            ],
            'Last 30 Days': [
                /**
                 * Handles dayjs functionality
                 */
                dayjs().subtract(29, 'day'),
                /**
                 * Handles dayjs functionality
                 */
                dayjs()
            ],
            'Last 6 Months': [
                /**
                 * Handles dayjs functionality
                 */
                dayjs().subtract(6, 'month'),
                /**
                 * Handles dayjs functionality
                 */
                dayjs()
            ],
            'Last 1 Year': [
                /**
                 * Handles dayjs functionality
                 */
                dayjs().subtract(12, 'month'),
                /**
                 * Handles dayjs functionality
                 */
                dayjs()
            ]
        },
        startDate: dayjs().subtract(1, 'month'),
        endDate: dayjs()
    };
    public groupStockReport: GroupStockReportResponse;
    /** Stores the message when particular group is not found */
    public groupNotFoundMessage: string;
    public groupStockReportInProcess: boolean = false;
    public universalDate$: Observable<any>;
    public showAdvanceSearchModal: boolean = false;
    public branchAvailable: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    valueWidth = false;
    public branchTransferMode: string = '';
    /** Holds available page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Instance of universal datepicker menu trigger */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /** Reference to advance search dialog */
    public dialogRef: MatDialogRef<any>;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private store: Store<AppState>,
        private stockReportActions: StockReportActions,
        private inventoryService: InventoryService,
        private fb: UntypedFormBuilder,
        private _toasty: ToasterService,
        private inventoryAction: InventoryAction,
        private invViewService: InvViewService,
        private generalService: GeneralService,
        private dialog: MatDialog
    ) {

        this.groupStockReport$ = this.store.pipe(select(p => p.inventory.groupStockReport), takeUntil(this.destroyed$), publishReplay(1), refCount());
        this.GroupStockReportRequest = new GroupStockReportRequest();
        this.GroupStockReportRequest.count = PAGINATION_LIMIT;
        this.activeGroup$ = this.store.pipe(select(activeGroupStore => activeGroupStore.inventory.activeGroup), takeUntil(this.destroyed$));
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
        this.activeGroup$.pipe(takeUntil(this.destroyed$)).subscribe(a => {
            /**
             * Handles if functionality
             */
            if (a) {
                const stockGroup = cloneDeep(a);
                const stockList = [];
                this.activeGroupName = stockGroup.name;
                (Array.isArray(stockGroup.stocks) ? stockGroup.stocks : []).forEach((stock) => {
                    stockList.push({ label: `${stock.name} (${stock?.uniqueName})`, value: stock?.uniqueName });
                });
                this.stockList$ = observableOf(stockList);
                /**
                 * Handles if functionality
                 */
                if (this.GroupStockReportRequest && !this.GroupStockReportRequest.stockGroupUniqueName) {
                    this.GroupStockReportRequest.stockGroupUniqueName = stockGroup?.uniqueName;
                }
            }
        });
        this.currentOrganizationType = this.generalService.currentOrganizationType;

        // tslint:disable-next-line:no-shadowed-variable
        this.store.pipe(select(createSelector([(state: AppState) => state.settings.branches], (branches) => {
            /**
             * Handles if functionality
             */
            if (branches && branches.length > 0) {
                this.branchAvailable = true;
            } else {
                this.branchAvailable = false;
            }
            this.branches = branches;
        })), takeUntil(this.destroyed$)).subscribe();

    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        // get view from sidebar while clicking on group/stock
        let len = document.location.pathname?.split('/')?.length;
        this.groupUniqueNameFromURL = document.location.pathname?.split('/')[len - 2];
        /**
         * Handles if functionality
         */
        if (this.groupUniqueNameFromURL && len === 6) {
            this.groupUniqueName = this.groupUniqueNameFromURL;
            this.initReport();
        }
        /**
         * Handles if functionality
         */
        if (this.invViewService.getActiveGroupUniqueName()) {
            this.groupUniqueName = this.invViewService.getActiveGroupUniqueName();
            this.initReport();
        }

        this.invViewService.getActiveView().pipe(takeUntil(this.destroyed$)).subscribe(v => {
            /**
             * Handles if functionality
             */
            if (v && !v.isOpen) {
                this.activeGroupName = v.name;
                this.groupUniqueName = v.groupUniqueName;
                /**
                 * Handles if functionality
                 */
                if (this.groupUniqueName) {
                    /**
                     * Handles if functionality
                     */
                    if (this.groupUniqueName) {
                        this.initReport();
                    }
                }
            }
        });

        this.groupStockReport$.subscribe((res: any) => {
            /**
             * Handles if functionality
             */
            if (res) {
                /**
                 * Handles if functionality
                 */
                if (res.isGroupNotFound) {
                    this.groupStockReport = undefined;
                    this.groupNotFoundMessage = res.message;
                } else {
                    this.groupStockReport = res;
                    this.groupNotFoundMessage = '';
                }
            }
        });

        this.store.pipe(select(s => s.inventory.groupStockReportInProcess), takeUntil(this.destroyed$)).subscribe(res => {
            this.groupStockReportInProcess = res;
        });

        this.universalDate$.subscribe(a => {
            /**
             * Handles if functionality
             */
            if (a) {
                this.datePickerOptions = { ...this.datePickerOptions, startDate: a[0], endDate: a[1], chosenLabel: a[2] };
                this.fromDate = dayjs(a[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(a[1]).format(GIDDH_DATE_FORMAT);
                this.selectedDateRange = { startDate: dayjs(a[0]), endDate: dayjs(a[1]) };
                this.selectedDateRangeUi = dayjs(a[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(a[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.getGroupReport(true);
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            /**
             * Handles if functionality
             */
            if (activeCompany) {
                this.selectedCmp = activeCompany;
                this.getAllBranch();
            }
        });

        this.productUniqueNameInput.valueChanges.pipe(
            /**
             * Handles debounceTime functionality
             */
            debounceTime(700),
            /**
             * Handles distinctUntilChanged functionality
             */
            distinctUntilChanged(),
            /**
             * Handles takeUntil functionality
             */
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.isFilterCorrect = true;
            this.GroupStockReportRequest.stockName = s;
            /**
             * Handles if functionality
             */
            if (s === '') {
                this.showProductSearch = false;
            }
            this.getGroupReport(true);
        });
        this.sourceUniqueNameInput.valueChanges.pipe(
            /**
             * Handles debounceTime functionality
             */
            debounceTime(700),
            /**
             * Handles distinctUntilChanged functionality
             */
            distinctUntilChanged(),
            /**
             * Handles takeUntil functionality
             */
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            /**
             * Handles if functionality
             */
            if (s) {
                this.isFilterCorrect = true;
                this.GroupStockReportRequest.source = s;
                this.getGroupReport(true);
                /**
                 * Handles if functionality
                 */
                if (s === '') {
                    this.showProductSearch = false;
                }
            }
        });
        // Advance search modal
        this.advanceSearchForm = this.fb.group({
            filterAmount: ['', [Validators.pattern('[-0-9]+([,.][0-9]+)?$')]],
            filterCategory: [''],
            filterCategoryType: [''],
            filterValueCondition: ['']
        });
    }

    /**
     * Lifecycle hook to fetch records based on warehouse and branch selected
     *
     * @param {SimpleChanges} changes SimpleChanges object
     * @memberof InventoryGroupStockReportComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        /**
         * Handles if functionality
         */
        if (changes.currentBranchAndWarehouse && !isEqual(changes.currentBranchAndWarehouse.previousValue, changes.currentBranchAndWarehouse.currentValue)) {
            /**
             * Handles if functionality
             */
            if (this.currentBranchAndWarehouse) {
                this.GroupStockReportRequest.warehouseUniqueName = (this.currentBranchAndWarehouse.warehouse !== 'all-entities') ? this.currentBranchAndWarehouse.warehouse : null;
                this.GroupStockReportRequest.branchUniqueName = this.currentBranchAndWarehouse.isCompany ? undefined : this.currentBranchAndWarehouse.branch;
                /**
                 * Handles if functionality
                 */
                if (!changes.currentBranchAndWarehouse.firstChange) {
                    // Make a manual service call only when it is not first change
                    this.getGroupReport(true);
                }
            }
        }
    }

    @HostListener('document:keyup', ['$event'])
    /**
     * Handles keyboardevent event
     */
    public handleKeyboardEvent(event: KeyboardEvent) {
        /**
         * Handles if functionality
         */
        if (event.altKey && event.which === 73) { // Alt + i
            event.preventDefault();
            event.stopPropagation();
            this.openAsidePaneDialog();
        }
        /**
         * Handles if functionality
         */
        if (event.altKey && event.which === 78 && this.branchAvailable) { // Alt + N
            event.preventDefault();
            event.stopPropagation();
            this.openBranchTransferDialog();
        }
        /**
         * Handles if functionality
         */
        if (event.which === ESCAPE) {
            this.asideBranchTransferPaneDialogRef?.close();
            this.asidePaneDialogRef?.close();
        }
    }

    /**
     * Initializes report
     */
    public initReport() {
        this.GroupStockReportRequest.page = 1;
        this.GroupStockReportRequest.stockGroupUniqueName = this.groupUniqueName || '';
        this.GroupStockReportRequest.stockUniqueName = '';
        this.groupUniqueNameFromURL = null;
        this.GroupStockReportRequest.warehouseUniqueName = (this.currentBranchAndWarehouse.warehouse !== 'all-entities') ? this.currentBranchAndWarehouse.warehouse : null;
        this.GroupStockReportRequest.branchUniqueName = this.currentBranchAndWarehouse.isCompany ? undefined : this.currentBranchAndWarehouse.branch;
        this.store.dispatch(this.stockReportActions.GetGroupStocksReport(cloneDeep(this.GroupStockReportRequest)));
    }

    /**
     * Retrieves groupreport data
     */
    public getGroupReport(resetPage: boolean) {
        this.GroupStockReportRequest.from = this.fromDate || null;
        this.GroupStockReportRequest.to = this.toDate || null;
        this.invViewService.setActiveDate(this.GroupStockReportRequest.from, this.GroupStockReportRequest.to);
        this.activeGroup$.pipe(take(1)).subscribe(activeGroup => {
            /**
             * Handles if functionality
             */
            if (activeGroup) {
                this.GroupStockReportRequest.stockGroupUniqueName = activeGroup?.uniqueName;
            }
        });
        /**
         * Handles if functionality
         */
        if (resetPage) {
            this.GroupStockReportRequest.page = 1;
        }
        /**
         * Handles if functionality
         */
        if (!this.GroupStockReportRequest.stockGroupUniqueName) {
            return;
        }
        this.store.dispatch(this.stockReportActions.GetGroupStocksReport(cloneDeep(this.GroupStockReportRequest)));
    }

    /**
     * getAllBranch
     */
    public getAllBranch() {
        this.store.pipe(select(createSelector([(state: AppState) => state.settings.branches], (entities) => {
            /**
             * Handles if functionality
             */
            if (entities) {
                let newEntities = [];
                /**
                 * Handles if functionality
                 */
                if (entities.length) {
                    newEntities = [...entities];
                    /**
                     * Handles if functionality
                     */
                    if (this.selectedCmp && entities.findIndex(p => p?.uniqueName === this.selectedCmp?.uniqueName) === -1) {
                        this.selectedCmp['label'] = this.selectedCmp.name;
                        newEntities.push(this.selectedCmp);
                    }
                    (Array.isArray(newEntities) ? newEntities : []).forEach(element => {
                        element['label'] = element.name;
                    });
                    this.entities$ = observableOf(orderBy(newEntities, 'name'));
                } else if (newEntities?.length === 0) {
                    this.entities$ = observableOf(null);
                }
            }
        })), takeUntil(this.destroyed$)).subscribe();
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Handles goToManageGroup functionality
     */
    public goToManageGroup() {
        /**
         * Handles if functionality
         */
        if (this.groupUniqueName) {
            this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
            this.setInventoryAsideState(true, true, true);
        }
    }

    /**
     * Handles nextPage functionality
     */
    public nextPage() {
        this.GroupStockReportRequest.page++;
        this.getGroupReport(false);
    }

    /**
     * Handles prevPage functionality
     */
    public prevPage() {
        this.GroupStockReportRequest.page--;
        this.getGroupReport(false);
    }

    /**
     * Closes fromdate
     */
    public closeFromDate(e: any) {
        /**
         * Handles if functionality
         */
        if (this.showFromDatePicker) {
            this.showFromDatePicker = false;
        }
    }

    /**
     * Closes todate
     */
    public closeToDate(e: any) {
        /**
         * Handles if functionality
         */
        if (this.showToDatePicker) {
            this.showToDatePicker = false;
        }
    }

    /**
     * Handles selectedDate functionality
     */
    public selectedDate(value: any, from?: string) { //from like advance search
        this.fromDate = dayjs(value.picker.startDate).format(GIDDH_DATE_FORMAT);
        this.toDate = dayjs(value.picker.endDate).format(GIDDH_DATE_FORMAT);
        this.pickerSelectedFromDate = value.picker.startDate;
        this.pickerSelectedToDate = value.picker.endDate;
        /**
         * Handles if functionality
         */
        if (!from) {
            this.isFilterCorrect = true;
            this.getGroupReport(true);
        }
    }

    /**
     * Handles filterFormData functionality
     */
    public filterFormData() {
        this.getGroupReport(true);
    }

    /**
     * setInventoryAsideState
     */
    public setInventoryAsideState(isOpen, isGroup, isUpdate) {
        this.store.dispatch(this.inventoryAction.ManageInventoryAside({ isOpen, isGroup, isUpdate }));
    }

    /**
     * Handles pagination events and updates API parameters
     *
     * @param {PageEvent} event - Contains pagination details
     * @memberof InventoryGroupStockReportComponent
     */
    public handlePageEvent(event: PageEvent): void {
        this.GroupStockReportRequest.page = this.GroupStockReportRequest.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.GroupStockReportRequest.count = event.pageSize;
        this.getGroupReport(false);
    }



    /**
     * Handles DownloadGroupReports functionality
     */
    public DownloadGroupReports(type: string) {
        this.GroupStockReportRequest.reportDownloadType = type;
        this._toasty.infoToast('Upcoming feature');
    }

    /**
     * Open aside pane dialog
     *
     * @memberof InventoryGroupStockReportComponent
     */
    public openAsidePaneDialog(): void {
        this.asidePaneDialogRef = this.dialog.open(this.asidePaneTemplate, ASIDE_PANE_CONFIG);
    }

    /**
     * Open branch transfer dialog
     *
     * @memberof InventoryGroupStockReportComponent
     */
    public openBranchTransferDialog(): void {
        this.asideBranchTransferPaneDialogRef = this.dialog.open(this.asideBranchTransferPaneTemplate, ASIDE_PANE_CONFIG);
    }

    // From Entity Dropdown
    /**
     * Handles selectEntity functionality
     */
    public selectEntity(option: IOption) {
        this._toasty.infoToast('Upcoming feature');
        this.GroupStockReportRequest.branchDetails = option.label;
    }

    // From inventory type Dropdown
    /**
     * Handles selectTransactionType functionality
     */
    public selectTransactionType(inventoryType) {
        this.GroupStockReportRequest.transactionType = inventoryType;
        this.getGroupReport(true);
    }

    /**
     * Handles sortButtonClicked functionality
     */
    public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {
        /**
         * Handles if functionality
         */
        if (this.GroupStockReportRequest.sort !== type || this.GroupStockReportRequest.sortBy !== columnName) {
            this.GroupStockReportRequest.sort = type;
            this.GroupStockReportRequest.sortBy = columnName;
        }
        this.isFilterCorrect = true;
        this.getGroupReport(true);
    }

    /**
     * Handles clickedOutside functionality
     */
    public clickedOutside(event, el, fieldName: string) {
        /**
         * Handles if functionality
         */
        if (fieldName === 'product') {
            /**
             * Handles if functionality
             */
            if (this.productUniqueNameInput.value !== null && this.productUniqueNameInput.value !== '') {
                return;
            }
        }
        /**
         * Handles if functionality
         */
        if (fieldName === 'source') {
            /**
             * Handles if functionality
             */
            if (this.sourceUniqueNameInput.value !== null && this.sourceUniqueNameInput.value !== '') {
                return;
            }
        }
        /**
         * Handles if functionality
         */
        if (this.childOf(event.target, el)) {
            return;
        } else {
            /**
             * Handles if functionality
             */
            if (fieldName === 'product') {
                this.showProductSearch = false;
            } else if (fieldName === 'source') {
                this.showSourceSearch = false;
            }
        }
    }

    /* tslint:disable */
    /**
     * Handles childOf functionality
     */
    public childOf(c, p) {
        /**
         * Handles while functionality
         */
        while ((c = c.parentNode) && c !== p) {
        }
        return !!c;
    }

    // focus on click search box
    /**
     * Shows productsearchbox element
     */
    public showProductSearchBox() {
        this.showProductSearch = !this.showProductSearch;
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            /**
             * Handles if functionality
             */
            if (this.productName && this.productName.nativeElement) {
                this.productName.nativeElement.focus();
                this.productName.nativeElement.value = null;
            }
        }, 200);
    }

    /**
     * Shows sourcesearchbox element
     */
    public showSourceSearchBox() {
        this.showSourceSearch = !this.showSourceSearch;
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            /**
             * Handles if functionality
             */
            if (this.sourceName && this.sourceName.nativeElement) {
                this.sourceName.nativeElement.focus();
                this.sourceName.nativeElement.value = null;
            }
        }, 200);
    }

    //******* Advance search modal *******//
    /**
     * Resets filter to default state
     */
    public resetFilter() {
        this.showAdvanceSearchModal = true;
        this.advanceSearchAction('clear');
        this.isFilterCorrect = false;
        this.showAdvanceSearchModal = false;
        this.GroupStockReportRequest.sort = 'asc';
        this.GroupStockReportRequest.sortBy = null;
        this.GroupStockReportRequest.entity = null;
        this.GroupStockReportRequest.value = null;
        this.GroupStockReportRequest.condition = null;
        this.GroupStockReportRequest.number = null;
        this.showSourceSearch = false;
        this.showProductSearch = false;
        this.GroupStockReportRequest.stockName = null;
        this.GroupStockReportRequest.source = null;
        /**
         * Handles if functionality
         */
        if (this.productName && this.productName.nativeElement) {
            this.productName.nativeElement.value = null;
        }
        /**
         * Handles if functionality
         */
        if (this.sourceName && this.sourceName.nativeElement) {
            this.sourceName.nativeElement.value = null;
        }
        //Reset Date with universal date
        this.universalDate$.subscribe(a => {
            /**
             * Handles if functionality
             */
            if (a) {
                this.datePickerOptions = { ...this.datePickerOptions, startDate: a[0], endDate: a[1], chosenLabel: a[2] };
                this.fromDate = dayjs(a[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(a[1]).format(GIDDH_DATE_FORMAT);
                let universalDate = cloneDeep(a);
                this.selectedDateRange = { startDate: dayjs(universalDate[0]), endDate: dayjs(universalDate[1]) };
                this.selectedDateRangeUi = dayjs(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            }
        });

        this.getGroupReport(true);
    }

    /**
     * Opens the advance search dialog using Angular Material
     *
     * @memberof InventoryGroupStockReportComponent
     */
    public onOpenAdvanceSearch() {
        this.showAdvanceSearchModal = true;
        this.advanceSearchDialogRef = this.dialog.open(this.advanceSearchDialog, {
            panelClass: 'mat-dialog-md',
            disableClose: true
        });

        this.advanceSearchDialogRef.afterClosed().subscribe(() => {
            this.showAdvanceSearchModal = false;
        });
    }

    /**
     * Handles advance search actions (search, cancel, clear)
     *
     * @param {string} [type] - Action type: 'search', 'cancel', or 'clear'
     * @memberof InventoryGroupStockReportComponent
     */
    public advanceSearchAction(type?: string) {
        /**
         * Handles if functionality
         */
        if (type === 'cancel') {
            this.clearModal();
            this.showAdvanceSearchModal = false;
            /**
             * Handles if functionality
             */
            if (this.advanceSearchDialogRef) {
                this.advanceSearchDialogRef.close();
            }
            return;
        } else if (type === 'clear') {
            this.clearModal();
            return;
        }

        /**
         * Handles if functionality
         */
        if (this.isFilterCorrect) {
            this.datePickerOptions = {
                ...this.datePickerOptions,
                startDate: dayjs(this.pickerSelectedFromDate).toDate(),
                endDate: dayjs(this.pickerSelectedToDate).toDate()
            };
            this.showAdvanceSearchModal = false;
            /**
             * Handles if functionality
             */
            if (this.advanceSearchDialogRef) {
                this.advanceSearchDialogRef.close();
            }
            this.getGroupReport(true);
        }

    }

    /**
     * Handles clearModal functionality
     */
    public clearModal() {
        /**
         * Handles if functionality
         */
        if (this.GroupStockReportRequest.number || this.GroupStockReportRequest.condition || this.GroupStockReportRequest.value || this.GroupStockReportRequest.entity) {
            this.advanceSearchForm.controls['filterAmount'].setValue(null);

            this.GroupStockReportRequest.number = null;
            this.getGroupReport(true);
        }
        /**
         * Handles if functionality
         */
        if (this.GroupStockReportRequest.sortBy || this.GroupStockReportRequest.stockName || this.GroupStockReportRequest.source || this.productName?.nativeElement.value) {
            // do something...
        } else {
            this.isFilterCorrect = false;
        }
    }

    /**
     * onDDElementSelect
     */
    public clearShSelect(type: string) {
        /**
         * Handles switch functionality
         */
        switch (type) {
            case 'filterCategory':  // Opening Stock, inwards, outwards, Closing Stock
                this.filterCategory = null;
                this.GroupStockReportRequest.entity = null;
                break;
            case 'filterCategoryType': // quantity/value
                this.filterCategoryType = null;
                this.GroupStockReportRequest.value = null;
                break;
            case 'filterValueCondition': // GREATER_THAN,GREATER_THAN_OR_EQUALS,LESS_THAN,LESS_THAN_OR_EQUALS,EQUALS,NOT_EQUALS
                this.filterValueCondition = null;
                this.GroupStockReportRequest.condition = null;
                break;
        }
        this.mapAdvFilters();
    }

    /**
     * Handles ddelementselect event
     */
    public onDDElementSelect(event: IOption, type?: string) {
        /**
         * Handles switch functionality
         */
        switch (type) {
            case 'filterCategory':  // Opening Stock, inwards, outwards, Closing Stock
                this.filterCategory = event.value;
                break;
            case 'filterCategoryType': // quantity/value
                this.filterCategoryType = event.value;
                break;
            case 'filterValueCondition': // GREATER_THAN,GREATER_THAN_OR_EQUALS,LESS_THAN,LESS_THAN_OR_EQUALS,EQUALS,NOT_EQUALS
                this.filterValueCondition = event.value;
                break;
        }
        this.mapAdvFilters();
    }

    /**
     * Handles downloadAllInventoryReports functionality
     */
    public downloadAllInventoryReports(reportType: string, reportFormat: string) {
        let obj = new InventoryDownloadRequest();
        /**
         * Handles if functionality
         */
        if (this.GroupStockReportRequest.stockGroupUniqueName) {
            obj.stockGroupUniqueName = this.GroupStockReportRequest.stockGroupUniqueName;
        }
        /**
         * Handles if functionality
         */
        if (this.GroupStockReportRequest.stockUniqueName) {
            obj.stockUniqueName = this.GroupStockReportRequest.stockUniqueName;
        }
        obj.format = reportFormat;
        obj.reportType = reportType;
        obj.from = this.fromDate;
        obj.to = this.toDate;
        obj.warehouseUniqueName = (this.currentBranchAndWarehouse.warehouse !== 'all-entities') ? this.currentBranchAndWarehouse.warehouse : null;
        obj.branchUniqueName = this.currentBranchAndWarehouse.branch;
        this.inventoryService.downloadAllInventoryReports(obj).pipe(takeUntil(this.destroyed$))
            .subscribe(res => {
                /**
                 * Handles if functionality
                 */
                if (res?.status === 'success') {
                    this._toasty.infoToast(res?.body);
                } else {
                    this._toasty.errorToast(res?.message);
                }
            });
    }

    /**
     * Handles mapAdvFilters functionality
     */
    public mapAdvFilters() {
        /**
         * Handles if functionality
         */
        if (this.filterCategory) { // entity = Opening Stock, inwards, outwards, Closing Stock
            this.GroupStockReportRequest.entity = this.filterCategory;
        }
        /**
         * Handles if functionality
         */
        if (this.filterCategoryType) { // value = quantity/value
            this.GroupStockReportRequest.value = this.filterCategoryType;
        }
        /**
         * Handles if functionality
         */
        if (this.filterValueCondition) { // condition = GREATER_THAN,GREATER_THAN_OR_EQUALS,LESS_THAN,LESS_THAN_OR_EQUALS,EQUALS,NOT_EQUALS
            this.GroupStockReportRequest.condition = this.filterValueCondition;
        }
        /**
         * Handles if functionality
         */
        if (this.advanceSearchForm.controls['filterAmount'].value && !this.advanceSearchForm.controls['filterAmount'].invalid) { // number=1 {any number given by user}
            this.GroupStockReportRequest.number = parseFloat(this.advanceSearchForm.controls['filterAmount'].value);
        } else {
            this.GroupStockReportRequest.number = null;
        }
        /**
         * Handles if functionality
         */
        if (this.GroupStockReportRequest.source || this.GroupStockReportRequest.sortBy || (this.productName && this.productName.nativeElement && this.productName.nativeElement.value) || this.GroupStockReportRequest.entity || this.GroupStockReportRequest.condition || this.GroupStockReportRequest.value || this.GroupStockReportRequest.number) {
            this.isFilterCorrect = true;
        } else {
            this.isFilterCorrect = false;
        }
    }

    //************************************//

    /**
     * Opens the dialog with the provided template
     *
     * @param {TemplateRef<any>} template
     * @memberof InventoryGroupStockReportComponent
     */
    public openDialog(): void {
        this.dialogRef = this.dialog.open(this.template, {
            panelClass: 'mat-dialog-md'
        });
    }

    /**
     * Hide modal
     *
     * @param {boolean} isNoteCreatedSuccessfully True, if new note was created successfully, load the inventory report
     * @memberof InventoryGroupStockReportComponent
     */
    public hideModal(isNoteCreatedSuccessfully?: boolean): void {
        this.dialogRef?.close();
        /**
         * Handles if functionality
         */
        if (isNoteCreatedSuccessfully) {
            this.getGroupReport(true);
        }
    }

    /**
     * Opens branchtransferpopup
     */
    public openBranchTransferPopup(event) {
        this.branchTransferMode = event;
        this.openBranchTransferDialog();
        this.openDialog();
    }

    /**
     * To open edit model
     *
     * @memberof InventoryGroupStockReportComponent
     */
    public editGroup(): void {
        this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
        this.setInventoryAsideState(true, true, true);
    }

    /**
     * Toggles the datepicker
     *
     * @param {boolean} isOpen - If true, opens the datepicker; if false, closes it
     * @memberof InventoryGroupStockReportComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean): void {
        /**
         * Handles if functionality
         */
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value - Value from datepicker
     * @param {*} [from] - Source of the event
     * @memberof InventoryGroupStockReportComponent
     */
    public dateSelectedCallback(value?: any, from?: any): void {
        /**
         * Handles if functionality
         */
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";

        /**
         * Handles if functionality
         */
        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
        /**
         * Handles if functionality
         */
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.pickerSelectedFromDate = value.startDate;
            this.pickerSelectedToDate = value.endDate;
            /**
             * Handles if functionality
             */
            if (!from) {
                this.isFilterCorrect = true;
            }
            this.getGroupReport(true);
        }
    }
}

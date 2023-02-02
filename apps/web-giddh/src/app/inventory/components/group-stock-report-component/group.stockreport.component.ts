import { animate, state, style, transition, trigger } from '@angular/animations';
import { ESCAPE } from '@angular/cdk/keycodes';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
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
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { InvViewService } from '../../inv.view.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import { OrganizationType } from '../../../models/user-login-state';
import { GeneralService } from '../../../services/general.service';
import { cloneDeep, isEqual, orderBy } from '../../../lodash-optimized';

@Component({
    selector: 'invetory-group-stock-report',
    templateUrl: './group.stockreport.component.html',
    styleUrls: ['./group.stockreport.component.scss'],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})

export class InventoryGroupStockReportComponent implements OnChanges, OnInit, OnDestroy {
    @ViewChild('dateRangePickerCmp', { static: true }) public dateRangePickerCmp: ElementRef;
    @ViewChild('advanceSearchModel', { static: true }) public advanceSearchModel: ModalDirective;
    @ViewChild("productName", { static: true }) productName: ElementRef;
    @ViewChild("sourceName", { static: true }) sourceName: ElementRef;
    @ViewChild('advanceSearchForm', { static: true }) formValues;
    @ViewChild('shCategory', { static: false }) public shCategory: ShSelectComponent;
    @ViewChild('shCategoryType', { static: false }) public shCategoryType: ShSelectComponent;
    @ViewChild('shValueCondition', { static: false }) public shValueCondition: ShSelectComponent;
    @ViewChild('template', { static: true }) public template: ElementRef;

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
    public asidePaneState: string = 'out';
    public asideTransferPaneState: string = 'out';
    public selectedCmp: CompanyResponse;
    public isWarehouse: boolean = false;
    public showAdvanceSearchIcon: boolean = false;
    public showProductSearch: boolean = false;
    public showSourceSearch: boolean = false;
    public productUniqueNameInput: FormControl = new FormControl();
    public sourceUniqueNameInput: FormControl = new FormControl();
    public entities$: Observable<CompanyResponse[]>;
    public selectedEntity: string = null;
    // modal advance search
    public advanceSearchForm: FormGroup;
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
                dayjs().subtract(1, 'day'),
                dayjs()
            ],
            'Last 7 Days': [
                dayjs().subtract(6, 'day'),
                dayjs()
            ],
            'Last 30 Days': [
                dayjs().subtract(29, 'day'),
                dayjs()
            ],
            'Last 6 Months': [
                dayjs().subtract(6, 'month'),
                dayjs()
            ],
            'Last 1 Year': [
                dayjs().subtract(12, 'month'),
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
    modalRef: BsModalRef;
    valueWidth = false;
    public branchTransferMode: string = '';
    /* This will hold if it's mobile screen or not */
    public isMobileScreen: boolean = false;
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };

    constructor(
        private modalService: BsModalService,
        private store: Store<AppState>,
        private stockReportActions: StockReportActions,
        private inventoryService: InventoryService,
        private fb: FormBuilder,
        private _toasty: ToasterService,
        private inventoryAction: InventoryAction,
        private invViewService: InvViewService,
        private breakPointObservar: BreakpointObserver,
        private generalService: GeneralService
    ) {
        this.breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        this.groupStockReport$ = this.store.pipe(select(p => p.inventory.groupStockReport), takeUntil(this.destroyed$), publishReplay(1), refCount());
        this.GroupStockReportRequest = new GroupStockReportRequest();
        this.activeGroup$ = this.store.pipe(select(activeGroupStore => activeGroupStore.inventory.activeGroup), takeUntil(this.destroyed$));
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
        this.activeGroup$.pipe(takeUntil(this.destroyed$)).subscribe(a => {
            if (a) {
                const stockGroup = cloneDeep(a);
                const stockList = [];
                this.activeGroupName = stockGroup.name;
                stockGroup.stocks.forEach((stock) => {
                    stockList.push({ label: `${stock.name} (${stock?.uniqueName})`, value: stock?.uniqueName });
                });
                this.stockList$ = observableOf(stockList);
                if (this.GroupStockReportRequest && !this.GroupStockReportRequest.stockGroupUniqueName) {
                    this.GroupStockReportRequest.stockGroupUniqueName = stockGroup?.uniqueName;
                }
            }
        });
        this.currentOrganizationType = this.generalService.currentOrganizationType;

        // tslint:disable-next-line:no-shadowed-variable
        this.store.pipe(select(createSelector([(state: AppState) => state.settings.branches], (branches) => {
            if (branches && branches.length > 0) {
                this.branchAvailable = true;
            } else {
                this.branchAvailable = false;
            }
            this.branches = branches;
        })), takeUntil(this.destroyed$)).subscribe();

    }

    public ngOnInit() {
        // get view from sidebar while clicking on group/stock
        let len = document.location.pathname?.split('/')?.length;
        this.groupUniqueNameFromURL = document.location.pathname?.split('/')[len - 2];
        if (this.groupUniqueNameFromURL && len === 6) {
            this.groupUniqueName = this.groupUniqueNameFromURL;
            this.initReport();
        }
        if (this.invViewService.getActiveGroupUniqueName()) {
            this.groupUniqueName = this.invViewService.getActiveGroupUniqueName();
            this.initReport();
        }

        this.invViewService.getActiveView().pipe(takeUntil(this.destroyed$)).subscribe(v => {
            if (v && !v.isOpen) {
                this.activeGroupName = v.name;
                this.groupUniqueName = v.groupUniqueName;
                if (this.groupUniqueName) {
                    if (this.groupUniqueName) {
                        this.initReport();
                    }
                }
            }
        });

        this.groupStockReport$.subscribe((res: any) => {
            if (res) {
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
            if (activeCompany) {
                this.selectedCmp = activeCompany;
                this.getAllBranch();
            }
        });

        this.productUniqueNameInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.isFilterCorrect = true;
            this.GroupStockReportRequest.stockName = s;
            if (s === '') {
                this.showProductSearch = false;
            }
            this.getGroupReport(true);
        });
        this.sourceUniqueNameInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            if (s) {
                this.isFilterCorrect = true;
                this.GroupStockReportRequest.source = s;
                this.getGroupReport(true);
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
        if (changes.currentBranchAndWarehouse && !isEqual(changes.currentBranchAndWarehouse.previousValue, changes.currentBranchAndWarehouse.currentValue)) {
            if (this.currentBranchAndWarehouse) {
                this.GroupStockReportRequest.warehouseUniqueName = (this.currentBranchAndWarehouse.warehouse !== 'all-entities') ? this.currentBranchAndWarehouse.warehouse : null;
                this.GroupStockReportRequest.branchUniqueName = this.currentBranchAndWarehouse.isCompany ? undefined : this.currentBranchAndWarehouse.branch;
                if (!changes.currentBranchAndWarehouse.firstChange) {
                    // Make a manual service call only when it is not first change
                    this.getGroupReport(true);
                }
            }
        }
    }

    @HostListener('document:keyup', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent) {
        if (event.altKey && event.which === 73) { // Alt + i
            event.preventDefault();
            event.stopPropagation();
            this.toggleAsidePane();
        }
        if (event.altKey && event.which === 78 && this.branchAvailable) { // Alt + N
            event.preventDefault();
            event.stopPropagation();
            this.toggleTransferAsidePane();
        }
        if (event.which === ESCAPE) {
            this.asidePaneState = 'out';
            this.asideTransferPaneState = 'out';
            this.toggleBodyClass();
        }
    }

    public initReport() {
        this.GroupStockReportRequest.page = 1;
        this.GroupStockReportRequest.stockGroupUniqueName = this.groupUniqueName || '';
        this.GroupStockReportRequest.stockUniqueName = '';
        this.groupUniqueNameFromURL = null;
        this.GroupStockReportRequest.warehouseUniqueName = (this.currentBranchAndWarehouse.warehouse !== 'all-entities') ? this.currentBranchAndWarehouse.warehouse : null;
        this.GroupStockReportRequest.branchUniqueName = this.currentBranchAndWarehouse.isCompany ? undefined : this.currentBranchAndWarehouse.branch;
        this.store.dispatch(this.stockReportActions.GetGroupStocksReport(cloneDeep(this.GroupStockReportRequest)));
    }

    public getGroupReport(resetPage: boolean) {
        this.GroupStockReportRequest.from = this.fromDate || null;
        this.GroupStockReportRequest.to = this.toDate || null;
        this.invViewService.setActiveDate(this.GroupStockReportRequest.from, this.GroupStockReportRequest.to);
        this.activeGroup$.pipe(take(1)).subscribe(activeGroup => {
            if (activeGroup) {
                this.GroupStockReportRequest.stockGroupUniqueName = activeGroup?.uniqueName;
            }
        });
        if (resetPage) {
            this.GroupStockReportRequest.page = 1;
        }
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
            if (entities) {
                let newEntities = [];
                if (entities.length) {
                    newEntities = [...entities];
                    if (this.selectedCmp && entities.findIndex(p => p?.uniqueName === this.selectedCmp?.uniqueName) === -1) {
                        this.selectedCmp['label'] = this.selectedCmp.name;
                        newEntities.push(this.selectedCmp);
                    }
                    newEntities.forEach(element => {
                        element['label'] = element.name;
                    });
                    this.entities$ = observableOf(orderBy(newEntities, 'name'));
                } else if (newEntities?.length === 0) {
                    this.entities$ = observableOf(null);
                }
            }
        })), takeUntil(this.destroyed$)).subscribe();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public goToManageGroup() {
        if (this.groupUniqueName) {
            this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
            this.setInventoryAsideState(true, true, true);
        }
    }

    public nextPage() {
        this.GroupStockReportRequest.page++;
        this.getGroupReport(false);
    }

    public prevPage() {
        this.GroupStockReportRequest.page--;
        this.getGroupReport(false);
    }

    public closeFromDate(e: any) {
        if (this.showFromDatePicker) {
            this.showFromDatePicker = false;
        }
    }

    public closeToDate(e: any) {
        if (this.showToDatePicker) {
            this.showToDatePicker = false;
        }
    }

    public selectedDate(value: any, from?: string) { //from like advance search
        this.fromDate = dayjs(value.picker.startDate).format(GIDDH_DATE_FORMAT);
        this.toDate = dayjs(value.picker.endDate).format(GIDDH_DATE_FORMAT);
        this.pickerSelectedFromDate = value.picker.startDate;
        this.pickerSelectedToDate = value.picker.endDate;
        if (!from) {
            this.isFilterCorrect = true;
            this.getGroupReport(true);
        }
    }

    public filterFormData() {
        this.getGroupReport(true);
    }

    /**
     * setInventoryAsideState
     */
    public setInventoryAsideState(isOpen, isGroup, isUpdate) {
        this.store.dispatch(this.inventoryAction.ManageInventoryAside({ isOpen, isGroup, isUpdate }));
    }

    public pageChanged(event: any): void {
        this.GroupStockReportRequest.page = event.page;
        this.getGroupReport(false);
    }

    public DownloadGroupReports(type: string) {
        this.GroupStockReportRequest.reportDownloadType = type;
        this._toasty.infoToast('Upcoming feature');
    }

    // region asidemenu toggle
    public toggleBodyClass() {
        if (this.asidePaneState === 'in' || this.asideTransferPaneState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public toggleAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asidePaneState = this.asidePaneState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    // new transfer aside pane
    public toggleTransferAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideTransferPaneState = this.asideTransferPaneState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    // From Entity Dropdown
    public selectEntity(option: IOption) {
        this._toasty.infoToast('Upcoming feature');
        this.GroupStockReportRequest.branchDetails = option.label;
    }

    // From inventory type Dropdown
    public selectTransactionType(inventoryType) {
        this.GroupStockReportRequest.transactionType = inventoryType;
        this.getGroupReport(true);
    }

    public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {
        if (this.GroupStockReportRequest.sort !== type || this.GroupStockReportRequest.sortBy !== columnName) {
            this.GroupStockReportRequest.sort = type;
            this.GroupStockReportRequest.sortBy = columnName;
        }
        this.isFilterCorrect = true;
        this.getGroupReport(true);
    }

    public clickedOutside(event, el, fieldName: string) {
        if (fieldName === 'product') {
            if (this.productUniqueNameInput.value !== null && this.productUniqueNameInput.value !== '') {
                return;
            }
        }
        if (fieldName === 'source') {
            if (this.sourceUniqueNameInput.value !== null && this.sourceUniqueNameInput.value !== '') {
                return;
            }
        }
        if (this.childOf(event.target, el)) {
            return;
        } else {
            if (fieldName === 'product') {
                this.showProductSearch = false;
            } else if (fieldName === 'source') {
                this.showSourceSearch = false;
            }
        }
    }

    /* tslint:disable */
    public childOf(c, p) {
        while ((c = c.parentNode) && c !== p) {
        }
        return !!c;
    }

    // focus on click search box
    public showProductSearchBox() {
        this.showProductSearch = !this.showProductSearch;
        setTimeout(() => {
            this.productName?.nativeElement.focus();
            this.productName.nativeElement.value = null;
        }, 200);
    }

    public showSourceSearchBox() {
        this.showSourceSearch = !this.showSourceSearch;
        setTimeout(() => {
            this.sourceName?.nativeElement.focus();
            this.sourceName.nativeElement.value = null;
        }, 200);
    }

    //******* Advance search modal *******//
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
        this.productName.nativeElement.value = null;
        if (this.sourceName) {
            this.sourceName.nativeElement.value = null;
        }
        //Reset Date with universal date
        this.universalDate$.subscribe(a => {
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

    public onOpenAdvanceSearch() {
        this.showAdvanceSearchModal = true;
        this.advanceSearchModel?.show();
    }

    public advanceSearchAction(type?: string) {
        if (type === 'cancel') {
            this.clearModal();
            this.showAdvanceSearchModal = false;
            this.advanceSearchModel.hide(); // change request : to only reset fields
            return;
        } else if (type === 'clear') {
            this.clearModal();
            return;
        }

        if (this.isFilterCorrect) {
            this.datePickerOptions = {
                ...this.datePickerOptions,
                startDate: dayjs(this.pickerSelectedFromDate).toDate(),
                endDate: dayjs(this.pickerSelectedToDate).toDate()
            };
            this.showAdvanceSearchModal = false;
            this.advanceSearchModel.hide(); // change request : to only reset fields
            this.getGroupReport(true);
        }

    }

    public clearModal() {
        if (this.GroupStockReportRequest.number || this.GroupStockReportRequest.condition || this.GroupStockReportRequest.value || this.GroupStockReportRequest.entity) {
            this.shCategory?.clear();
            this.shCategoryType?.clear();
            this.shValueCondition?.clear();
            this.advanceSearchForm.controls['filterAmount'].setValue(null);

            this.GroupStockReportRequest.number = null;
            this.getGroupReport(true);
        }
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

    public onDDElementSelect(event: IOption, type?: string) {
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

    public downloadAllInventoryReports(reportType: string, reportFormat: string) {
        let obj = new InventoryDownloadRequest();
        if (this.GroupStockReportRequest.stockGroupUniqueName) {
            obj.stockGroupUniqueName = this.GroupStockReportRequest.stockGroupUniqueName;
        }
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
                if (res?.status === 'success') {
                    this._toasty.infoToast(res?.body);
                } else {
                    this._toasty.errorToast(res?.message);
                }
            });
    }

    public mapAdvFilters() {
        if (this.filterCategory) { // entity = Opening Stock, inwards, outwards, Closing Stock
            this.GroupStockReportRequest.entity = this.filterCategory;
        }
        if (this.filterCategoryType) { // value = quantity/value
            this.GroupStockReportRequest.value = this.filterCategoryType;
        }
        if (this.filterValueCondition) { // condition = GREATER_THAN,GREATER_THAN_OR_EQUALS,LESS_THAN,LESS_THAN_OR_EQUALS,EQUALS,NOT_EQUALS
            this.GroupStockReportRequest.condition = this.filterValueCondition;
        }
        if (this.advanceSearchForm.controls['filterAmount'].value && !this.advanceSearchForm.controls['filterAmount'].invalid) { // number=1 {any number given by user}
            this.GroupStockReportRequest.number = parseFloat(this.advanceSearchForm.controls['filterAmount'].value);
        } else {
            this.GroupStockReportRequest.number = null;
        }
        if (this.GroupStockReportRequest.source || this.GroupStockReportRequest.sortBy || this.productName?.nativeElement.value || this.GroupStockReportRequest.entity || this.GroupStockReportRequest.condition || this.GroupStockReportRequest.value || this.GroupStockReportRequest.number) {
            this.isFilterCorrect = true;
        } else {
            this.isFilterCorrect = false;
        }
    }

    //************************************//

    openModal() {
        this.modalRef = this.modalService.show(
            this.template,
            Object.assign({}, { class: 'modal-xl receipt-note-modal ' })
        );
    }

    /**
     * Hide modal
     *
     * @param {boolean} isNoteCreatedSuccessfully True, if new note was created successfully, load the inventory report
     * @memberof InventoryGroupStockReportComponent
     */
    public hideModal(isNoteCreatedSuccessfully?: boolean): void {
        this.modalRef.hide();
        if (isNoteCreatedSuccessfully) {
            this.getGroupReport(true);
        }
    }

    public openBranchTransferPopup(event) {
        this.branchTransferMode = event;
        this.toggleTransferAsidePane();
        this.openModal();
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
     *To show the datepicker
     *
     * @param {*} element
     * @memberof InventoryGroupStockReportComponent
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
     * @memberof InventoryGroupStockReportComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof InventoryGroupStockReportComponent
     */
    public dateSelectedCallback(value?: any, from?: any): void {
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
            this.pickerSelectedFromDate = value.startDate;
            this.pickerSelectedToDate = value.endDate;
            if (!from) {
                this.isFilterCorrect = true;
            }
            this.getGroupReport(true);
        }
    }
}

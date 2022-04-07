import { ToasterService } from './../../../services/toaster.service';
import { InventoryService } from '../../../services/inventory.service';
import { debounceTime, distinctUntilChanged, publishReplay, refCount, take, takeUntil } from 'rxjs/operators';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { InventoryDownloadRequest, StockReportRequest, StockReportResponse } from '../../../models/api-models/Inventory';
import { StockReportActions } from '../../../actions/inventory/stocks-report.actions';
import { AppState } from '../../../store';
import { select, Store } from '@ngrx/store';
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { Observable, of as observableOf, ReplaySubject, Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment/moment';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BranchFilterRequest, CompanyResponse } from '../../../models/api-models/Company';
import { createSelector } from 'reselect';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { InvViewService } from '../../inv.view.service';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { KEYS } from '../../../accounting/journal-voucher/journal-voucher.component';
import { OrganizationType } from '../../../models/user-login-state';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import { GeneralService } from '../../../services/general.service';
import { cloneDeep, isEqual, orderBy } from '../../../lodash-optimized';

@Component({
    selector: 'invetory-stock-report',
    templateUrl: './inventory.stockreport.component.html',
    styleUrls: ['./inventory.stockreport.component.scss'],
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
export class InventoryStockReportComponent implements OnChanges, OnInit, OnDestroy {
    @ViewChild('advanceSearchModel', { static: true }) public advanceSearchModel: ModalDirective;
    @ViewChild('accountName', { static: true }) public accountName: ElementRef;
    @ViewChild('shCategory', { static: true }) public shCategory: ShSelectComponent;
    @ViewChild('shCategoryType', { static: true }) public shCategoryType: ShSelectComponent;
    @ViewChild('shValueCondition', { static: true }) public shValueCondition: ShSelectComponent;
    /** Template reference */
    @ViewChild('template', { static: true }) public template: ElementRef;

    /** Stores the branch details along with their warehouses */
    @Input() public currentBranchAndWarehouse: any;
    /** List of branches */
    public branches: Array<any> = [];

    public today: Date = new Date();
    public activeStock$: string;
    public stockReport$: Observable<StockReportResponse>;
    /** Stores the message when particular stock is not found */
    public stockNotFoundMessage: string;
    public sub: Subscription;
    public groupUniqueName: string;
    public stockUniqueName: string;
    public stockReportRequest: StockReportRequest;
    public showFromDatePicker: boolean;
    public showToDatePicker: boolean;
    public toDate: string;
    public fromDate: string;
    public moment = moment;
    public activeStockName = null;
    public asideMenuState: string = 'out';
    public isWarehouse: boolean = false;
    public selectedEntity: string = 'all';
    public selectedTransactionType: string = 'all';
    public entities$: Observable<CompanyResponse[]>;
    public showAdvanceSearchIcon: boolean = false;
    public accountUniqueNameInput: FormControl = new FormControl();
    public showAccountSearch: boolean = false;
    public entityAndInventoryTypeForm: FormGroup = new FormGroup({});
    // modal advance search
    public advanceSearchForm: FormGroup;
    public filterCategory: string = null;
    public filterCategoryType: string = null;
    public filterValueCondition: string = null;
    public isFilterCorrect: boolean = false;
    public stockUniqueNameFromURL: string = null;
    public pickerSelectedFromDate: string;
    public pickerSelectedToDate: string;
    public transactionTypes: any[] = [
        { uniqueName: 'purchase_and_sales', name: 'Purchase & Sales' },
        { uniqueName: 'transfer', name: 'Transfer' },
        { uniqueName: 'all', name: 'All Transactions' },
    ];

    public VOUCHER_TYPES: any[] = [
        {
            "value": "SALES",
            "label": "Sales",
            "checked": true
        },
        {
            "value": "PURCHASE",
            "label": "Purchase",
            "checked": true
        },
        {
            "value": "MANUFACTURING",
            "label": "Manufacturing",
            "checked": true
        },
        {
            "value": "TRANSFER",
            "label": "Transfer",
            "checked": true
        },
        {
            "value": "JOURNAL",
            "label": "Journal Voucher",
            "checked": true
        },
        {
            "value": "CREDIT_NOTE",
            "label": "Credit Note",
            "checked": true
        },
        {
            "value": "DEBIT_NOTE",
            "label": "Debit Note",
            "checked": true
        }
    ];
    public CategoryOptions: IOption[] = [
        {
            value: "dr",
            label: "Inwards",
            disabled: false
        },
        {
            value: "cr",
            label: "Outwards",
            disabled: false
        },
        {
            value: "dr",
            label: "Opening Stock",
            disabled: false
        },
        {
            value: "cr",
            label: "Closing Stock",
            disabled: false
        }
    ];

    public CategoryTypeOptions: IOption[] = [
        {
            value: "qty",
            label: "Quantity",
            disabled: false
        },
        {
            value: "amt",
            label: "Amount",
            disabled: false
        }
    ];

    public FilterValueCondition: IOption[] = [
        {
            value: "equal",
            label: "Equals",
            disabled: false
        },
        {
            value: "greater_than",
            label: "Greater than",
            disabled: false
        },
        {
            value: "less_than",
            label: "Less than",
            disabled: false
        },
        {
            value: "not_equals",
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
                moment().subtract(1, 'days'),
                moment()
            ],
            'Last 7 Days': [
                moment().subtract(6, 'days'),
                moment()
            ],
            'Last 30 Days': [
                moment().subtract(29, 'days'),
                moment()
            ],
            'Last 6 Months': [
                moment().subtract(6, 'months'),
                moment()
            ],
            'Last 1 Year': [
                moment().subtract(12, 'months'),
                moment()
            ]
        },
        startDate: moment().subtract(30, 'days'),
        endDate: moment()
    };
    public stockReport: StockReportResponse;
    public universalDate$: Observable<any>;
    public selectedCmp: CompanyResponse;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public advanceSearchModalShow: boolean = false;
    public updateStockSuccess$: Observable<boolean>;
    /** Hold the state of new transfer side pan */
    public asideTransferPaneState: string = 'out';
    /** Hold branch transfer mode */
    public branchTransferMode: string = '';
    /** Modal Reference */
    public modalRef: BsModalRef;
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
    /** True if stock report API is in progress */
    public stockReportInProcess: boolean = false;

    /**
     * TypeScript public modifiers
     */
    constructor(private store: Store<AppState>, private sideBarAction: SidebarAction,
        private stockReportActions: StockReportActions,
        private _toasty: ToasterService,
        private inventoryService: InventoryService, private fb: FormBuilder, private inventoryAction: InventoryAction,
        private settingsBranchActions: SettingsBranchActions,
        private invViewService: InvViewService,
        private cdr: ChangeDetectorRef,
        private modalService: BsModalService,
        private generalService: GeneralService
    ) {
        this.stockReport$ = this.store.pipe(select(stockReportStore => stockReportStore.inventory.stockReport), takeUntil(this.destroyed$), publishReplay(1), refCount());
        this.stockReportRequest = new StockReportRequest();
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
        this.entityAndInventoryTypeForm = this.fb.group({
            selectedEntity: ['allEntity'],
            selectedTransactionType: ['all']
        });
        this.updateStockSuccess$ = this.store.pipe(select(s => s.inventory.UpdateStockSuccess), takeUntil(this.destroyed$));
        this.store.pipe(select(s => s.inventory.activeStockUniqueName), takeUntil(this.destroyed$)).subscribe(activeStockUniqueName => {
            if (activeStockUniqueName) {
                this.stockUniqueName = activeStockUniqueName;
            }
        });
        this.currentOrganizationType = this.generalService.currentOrganizationType;
    }

    public findStockNameFromId(grps: IGroupsWithStocksHierarchyMinItem[], stockUniqueName: string): string {
        if (grps && grps.length > 0) {
            for (let key of grps) {
                if (key.stocks && key.stocks.length > 0) {

                    let index = key.stocks.findIndex(p => p.uniqueName === stockUniqueName);
                    if (index === -1) {
                        let result = this.findStockNameFromId(key.childStockGroups, stockUniqueName);
                        if (result !== '') {
                            return result;
                        } else {
                            continue;
                        }
                    } else {
                        this.activeStockName = key.stocks[index].name;
                        return key.stocks[index].name;
                    }
                } else {
                    let result = this.findStockNameFromId(key.childStockGroups, stockUniqueName);
                    if (result !== '') {
                        return result;
                    } else {
                        continue;
                    }
                }
            }
            return '';
        }
        return '';
    }

    public ngOnInit() {
        if (this.invViewService.getActiveGroupUniqueName() || this.invViewService.getActiveStockUniqueName()) {
            this.groupUniqueName = this.invViewService.getActiveGroupUniqueName();
            this.stockUniqueName = this.invViewService.getActiveStockUniqueName();
            this.initReport();
        }

        this.store.pipe(select(appsStore => appsStore.inventory.stockReportInProcess), takeUntil(this.destroyed$)).subscribe(res => {
            this.stockReportInProcess = res;
        });

        // get view from sidebar while clicking on group/stock
        this.invViewService.getActiveView().pipe(takeUntil(this.destroyed$)).subscribe(viewActiveStock => {
            this.initVoucherType();
            this.groupUniqueName = viewActiveStock?.groupUniqueName;
            this.stockUniqueName = viewActiveStock?.stockUniqueName;
            this.selectedEntity = 'allEntity';
            this.selectedTransactionType = 'all';
            if (this.groupUniqueName) {
                this.store.dispatch(this.sideBarAction.SetActiveStock(this.stockUniqueName));
                if (this.groupUniqueName && this.stockUniqueName) {
                    this.initReport();
                    this.store.pipe(select(p => {
                        return this.findStockNameFromId(p.inventory.groupsWithStocks, this.stockUniqueName);
                    }), take(1)).subscribe(p => this.activeStock$ = p);
                }
            }
        });

        this.stockReport$.subscribe((res: any) => {
            if (res) {
                if (res.isStockNotFound) {
                    this.stockReport = undefined;
                    this.stockNotFoundMessage = res.message;
                } else {
                    this.stockReport = res;
                    this.stockNotFoundMessage = '';
                }
                this.cdr.detectChanges();
            }
        });

        this.universalDate$.subscribe(a => {
            if (a) {
                this.datePickerOptions = { ...this.datePickerOptions, startDate: a[0], endDate: a[1], chosenLabel: a[2] };
                this.fromDate = moment(a[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(a[1]).format(GIDDH_DATE_FORMAT);
                let universalDate = cloneDeep(a);
                this.selectedDateRange = { startDate: moment(a[0]), endDate: moment(a[1]) };
                this.selectedDateRangeUi = moment(a[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(a[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.getStockReport(true);
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.selectedCmp = activeCompany;
                this.getAllBranch();
            }
        });

        this.accountUniqueNameInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.isFilterCorrect = true;
            this.stockReportRequest.accountName = s;
            this.getStockReport(true);
            if (s === '') {
                this.showAccountSearch = false;
            }
        });

        // Advance search modal
        this.advanceSearchForm = this.fb.group({
            filterAmount: ['', [Validators.pattern('[-0-9]+([,.][0-9]+)?$')]],
            filterCategory: [''],
            filterCategoryType: [''],
            filterValueCondition: ['']
        });
        this.resetFilter(false);

        this.updateStockSuccess$.subscribe(stock => {
            if (stock) {
                this.initReport();
            }
        })
    }

    /**
     * Lifecycle hook to fetch records based on warehouse and branch selected
     *
     * @param {SimpleChanges} changes SimpleChanges object
     * @memberof InventoryStockReportComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.currentBranchAndWarehouse && !isEqual(changes.currentBranchAndWarehouse.previousValue, changes.currentBranchAndWarehouse.currentValue)) {
            if (this.currentBranchAndWarehouse) {
                this.stockReportRequest.warehouseUniqueName = (this.currentBranchAndWarehouse.warehouse !== 'all-entities') ? this.currentBranchAndWarehouse.warehouse : null;
                this.stockReportRequest.branchUniqueName = this.currentBranchAndWarehouse.isCompany ? undefined : this.currentBranchAndWarehouse.branch;
                if (!changes.currentBranchAndWarehouse.firstChange) {
                    // Make a manual service call only when it is not first change
                    this.getStockReport(true);
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

        if (event.key === KEYS.ESC) {
            event.preventDefault();
            event.stopPropagation();
            this.asideTransferPaneState = 'out';
            this.toggleBodyClass();
        }
    }

    public initReport() {
        this.stockReportRequest.stockGroupUniqueName = this.groupUniqueName;
        this.stockReportRequest.stockUniqueName = this.stockUniqueName;
        this.stockReportRequest.transactionType = 'all';
        this.store.dispatch(this.stockReportActions.GetStocksReport(cloneDeep(this.stockReportRequest)));
    }

    public getStockReport(resetPage: boolean) {
        this.stockReportRequest.from = this.fromDate || null;
        this.stockReportRequest.to = this.toDate || null;
        this.invViewService.setActiveDate(this.stockReportRequest.from, this.stockReportRequest.to);
        if (resetPage) {
            this.stockReportRequest.page = 1;
        }
        if (!this.stockReportRequest.stockGroupUniqueName || !this.stockReportRequest.stockUniqueName) {
            return;
        }
        if (!this.stockReportRequest.expression || !this.stockReportRequest.param || !this.stockReportRequest.val) {
            delete this.stockReportRequest.expression;
            delete this.stockReportRequest.param;
            delete this.stockReportRequest.val;
        }
        this.store.dispatch(this.stockReportActions.GetStocksReport(cloneDeep(this.stockReportRequest)));
    }

    /**
     * getAllBranch
     */
    public getAllBranch() {
        let branchFilterRequest = new BranchFilterRequest();
        this.store.dispatch(this.settingsBranchActions.GetALLBranches(branchFilterRequest));
        // tslint:disable-next-line:no-shadowed-variable
        this.store.pipe(select(createSelector([(state: AppState) => state.settings.branches], (entities) => {
            if (entities) {
                if (entities.length) {
                    const branches = cloneDeep(entities);
                    if (this.selectedCmp && branches.findIndex(p => p.uniqueName === this.selectedCmp.uniqueName) === -1) {
                        this.selectedCmp['label'] = this.selectedCmp.name;
                        branches.push(this.selectedCmp);
                    }
                    branches.forEach(element => {
                        element['label'] = element.name;
                    });
                    this.entities$ = observableOf(orderBy(branches, 'name'));
                } else if (entities.length === 0) {
                    this.entities$ = observableOf(null);
                }
                this.branches = entities;
            }
        })), takeUntil(this.destroyed$)).subscribe();
    }

    public initVoucherType() {
        // initialization for voucher type array inially all selected
        this.stockReportRequest.voucherTypes = [];
        this.VOUCHER_TYPES.forEach(element => {
            element.checked = true;
            this.stockReportRequest.voucherTypes.push(element.value);
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public goToManageStock() {
        if (this.groupUniqueName && this.stockUniqueName) {
            this.store.dispatch(this.inventoryAction.showLoaderForStock());
            this.store.dispatch(this.sideBarAction.GetInventoryStock(this.stockUniqueName, this.groupUniqueName));
            this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
            this.setInventoryAsideState(true, false, true);
        }
    }

    public nextPage() {
        this.stockReportRequest.page++;
        this.getStockReport(false);
    }

    public prevPage() {
        this.stockReportRequest.page--;
        this.getStockReport(false);
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

    public selectedDate(value?: any, from?: string) { //from like advance search
        this.fromDate = moment(value.picker.startDate).format(GIDDH_DATE_FORMAT);
        this.toDate = moment(value.picker.endDate).format(GIDDH_DATE_FORMAT);
        this.pickerSelectedFromDate = value.picker.startDate;
        this.pickerSelectedToDate = value.picker.endDate;
        if (!from) {
            this.isFilterCorrect = true;
            this.getStockReport(true);
        }
    }

    /**
     * setInventoryAsideState
     */
    public setInventoryAsideState(isOpen, isGroup, isUpdate) {
        this.store.dispatch(this.inventoryAction.ManageInventoryAside({ isOpen, isGroup, isUpdate }));
    }

    public pageChanged(event: any): void {
        this.stockReportRequest.page = event.page;
        this.getStockReport(false);
    }

    public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {
        if (this.stockReportRequest.sort !== type || this.stockReportRequest.sortBy !== columnName) {
            this.stockReportRequest.sort = type;
            this.stockReportRequest.sortBy = columnName;
            this.getStockReport(true);
        }
        this.isFilterCorrect = true;
    }

    public filterByCheck(type: string, event: boolean) {
        let idx = this.stockReportRequest.voucherTypes.indexOf('ALL');
        if (idx !== -1) {
            this.initVoucherType();
        }
        if (event && type) {
            this.stockReportRequest.voucherTypes.push(type);
        } else {
            let index = this.stockReportRequest.voucherTypes.indexOf(type);
            if (index !== -1) {
                this.stockReportRequest.voucherTypes.splice(index, 1);
            }
        }
        if (this.stockReportRequest.voucherTypes.length > 0 && this.stockReportRequest.voucherTypes.length < this.VOUCHER_TYPES.length) {
            idx = this.stockReportRequest.voucherTypes.indexOf('ALL');
            if (idx !== -1) {
                this.stockReportRequest.voucherTypes.splice(idx, 1);
            }
            idx = this.stockReportRequest.voucherTypes.indexOf('NONE');
            if (idx !== -1) {
                this.stockReportRequest.voucherTypes.splice(idx, 1);
            }
        }
        if (this.stockReportRequest.voucherTypes.length === this.VOUCHER_TYPES.length) {
            this.stockReportRequest.voucherTypes = ['ALL'];
        }
        if (this.stockReportRequest.voucherTypes.length === 0) {
            this.stockReportRequest.voucherTypes = ['NONE'];
        }
        this.getStockReport(true);
        this.isFilterCorrect = true;
    }

    public clickedOutside(event, el, fieldName: string) {
        if (fieldName === 'account') {
            if (this.accountUniqueNameInput.value !== null && this.accountUniqueNameInput.value !== '') {
                return;
            }
        }
        if (this.childOf(event.target, el)) {
            return;
        } else {
            if (fieldName === 'account') {
                this.showAccountSearch = false;
            }
        }
    }

    /* tslint:disable */
    public childOf(c, p) {
        while ((c = c.parentNode) && c !== p) {
        }
        return !!c;
    }

    public downloadStockReports(type: string) {
        this.stockReportRequest.reportDownloadType = type;
        this._toasty.infoToast('Upcoming feature');
    }

    // region asidemenu toggle
    public toggleBodyClass() {
        if (this.asideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public toggleAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    // From Entity Dropdown
    public selectEntity(option: IOption) {
        this._toasty.infoToast('Upcoming feature');
    }

    // From inventory type Dropdown
    public selectTransactionType(inventoryType) {
        this.stockReportRequest.transactionType = inventoryType;
        this.getStockReport(true);
    }

    // focus on click search box
    public showAccountSearchBox() {
        this.showAccountSearch = !this.showAccountSearch;
        setTimeout(() => {
            this.accountName?.nativeElement.focus();
            this.accountName.nativeElement.value = null;
        }, 200);
    }

    //******* Advance search modal *******//
    public resetFilter(isReset?: boolean) {
        this.isFilterCorrect = false;
        this.stockReportRequest.sort = null;
        this.stockReportRequest.sortBy = null;
        this.stockReportRequest.accountName = null;
        this.showAccountSearch = false;
        this.stockReportRequest.val = null;
        this.stockReportRequest.param = null;
        this.stockReportRequest.expression = null;
        if (this.accountName) {
            this.accountName.nativeElement.value = null;
        }

        this.initVoucherType();
        this.advanceSearchForm.controls['filterAmount'].setValue(null);
        //Reset Date with universal date
        this.universalDate$.subscribe(a => {
            if (a) {
                this.datePickerOptions = { ...this.datePickerOptions, startDate: a[0], endDate: a[1], chosenLabel: a[2] };
                this.fromDate = moment(a[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(a[1]).format(GIDDH_DATE_FORMAT);
                let universalDate = cloneDeep(a);
                this.selectedDateRange = { startDate: moment(a[0]), endDate: moment(a[1]) };
                this.selectedDateRangeUi = moment(a[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(a[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
        });
        //Reset Date

        if (isReset) {
            this.getStockReport(true);
        }
    }

    public onOpenAdvanceSearch() {
        this.advanceSearchModalShow = true;
        this.advanceSearchModel.show();
    }

    public advanceSearchAction(type?: string) {
        if (type === 'cancel') {
            this.advanceSearchModalShow = true;
            this.clearModal()
            this.advanceSearchModel.hide();
            return;
        } else if (type === 'clear') {
            this.clearModal()
            return;
        }

        if (this.isFilterCorrect) {

            this.datePickerOptions = {
                ...this.datePickerOptions, startDate: moment(this.pickerSelectedFromDate).toDate(),
                endDate: moment(this.pickerSelectedToDate).toDate()
            };

            this.advanceSearchModalShow = false;
            this.advanceSearchModel.hide();
            this.getStockReport(true);
        }
    }


    public clearModal() {
        if (this.stockReportRequest.param || this.stockReportRequest.val || this.stockReportRequest.expression) {
            this.shCategory.clear();
            if (this.shCategoryType) {
                this.shCategoryType.clear();
            }
            this.shValueCondition.clear();
            this.advanceSearchForm.controls['filterAmount'].setValue(null);
            this.getStockReport(true);
        }
        if (this.stockReportRequest.sortBy || this.stockReportRequest.accountName || this.accountName?.nativeElement.value) {
            // do something...
        } else {
            this.isFilterCorrect = false;
        }
    }

    /**
     * onDDElementSelect
     */
    public clearShSelect(type?: string) {
        switch (type) {
            case 'filterCategory':  // Opening Stock, inwards, outwards, Closing Stock
                this.filterCategory = null;
                this.stockReportRequest.val = null;
                break;
            case 'filterCategoryType': // quantity/value
                this.filterCategoryType = null;
                this.stockReportRequest.param = null;
                break;
            case 'filterValueCondition': // GREATER_THAN,GREATER_THAN_OR_EQUALS,LESS_THAN,LESS_THAN_OR_EQUALS,EQUALS,NOT_EQUALS
                this.filterValueCondition = null;
                this.stockReportRequest.expression = null;
                break;
        }
        this.mapAdvFilters();
    }

    public onDDElementSelect(event: IOption, type?: string) {

        switch (type) {
            case 'filterCategory':  // inwards/outwards/opening/closing
                this.filterCategory = event.value;
                break;
            case 'filterCategoryType': // value/quantity
                this.filterCategoryType = event.value;
                break;
            case 'filterValueCondition': // =, <, >, !
                this.filterValueCondition = event.value;
                break;
        }

        if (type === 'filterCategory' && event.label === 'Closing Stock') {
            this.stockReportRequest.param = 'qty_closing';
            this.filterCategoryType = null;
        } else if (type === 'filterCategory' && event.label !== 'Closing Stock') {
            this.stockReportRequest.param = null;
        } else {
        }
        this.mapAdvFilters(this.stockReportRequest.param);
    }

    public downloadAllInventoryReports(reportType: string, reportFormat: string) {
        let obj = new InventoryDownloadRequest();
        if (this.stockReportRequest.stockGroupUniqueName) {
            obj.stockGroupUniqueName = this.stockReportRequest.stockGroupUniqueName;
        }
        if (this.stockReportRequest) {
            obj.stockUniqueName = this.stockReportRequest.stockUniqueName;
        }
        obj.format = reportFormat;
        obj.reportType = reportType;
        obj.from = this.fromDate;
        obj.to = this.toDate;
        obj.warehouseUniqueName = (this.currentBranchAndWarehouse.warehouse !== 'all-entities') ? this.currentBranchAndWarehouse.warehouse : null;
        obj.branchUniqueName = this.currentBranchAndWarehouse.branch;
        this.inventoryService.downloadAllInventoryReports(obj).pipe(takeUntil(this.destroyed$))
            .subscribe(res => {
                if (res.status === 'success') {
                    this._toasty.infoToast(res.body);
                } else {
                    this._toasty.errorToast(res.message);
                }
            });
    }

    public mapAdvFilters(param?: string) {
        if (!param) {
            if (this.filterCategoryType && this.filterCategory) { // creating value for key parma like "qty_cr", "amt_cr"
                this.stockReportRequest.param = this.filterCategoryType + '_' + this.filterCategory;
            }
        }

        if (this.filterValueCondition) { // expressions less_than, greator_than etc
            this.stockReportRequest.expression = this.filterValueCondition;
        }
        if (this.advanceSearchForm.controls['filterAmount'].value && !this.advanceSearchForm.controls['filterAmount'].invalid) {
            this.stockReportRequest.val = parseFloat(this.advanceSearchForm.controls['filterAmount'].value);
        } else {
            this.stockReportRequest.val = null;
        }
        if (this.stockReportRequest.sortBy || this.stockReportRequest.accountName || this.accountName?.nativeElement.value || this.stockReportRequest.param || this.stockReportRequest.expression || this.stockReportRequest.val) {
            this.isFilterCorrect = true;
        } else {
            this.isFilterCorrect = false;
        }
    }

    /**
     * Toggle's the branch transfer side pan
     *
     * @param {*} [event]
     * @memberof InventoryStockReportComponent
     */
    public toggleTransferAsidePane(event?: any): void {
        if (event) {
            event.preventDefault();
        }
        this.asideTransferPaneState = this.asideTransferPaneState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /**
     * This will open branch transfer popup
     *
     * @param {*} event
     * @memberof InventoryStockReportComponent
     */
    public openBranchTransferPopup(event: any): void {
        this.branchTransferMode = event;
        this.toggleTransferAsidePane();
        this.openModal();
    }

    /**
     * Open's modal
     *
     * @memberof InventoryStockReportComponent
     */
    public openModal(): void {
        this.modalRef = this.modalService.show(
            this.template,
            Object.assign({}, { class: 'modal-xl receipt-note-modal ' })
        );
    }

    /**
     * Hide modal
     *
     * @param {boolean} isNoteCreatedSuccessfully True, if new note was created successfully, load the inventory report
     * @memberof InventoryStockReportComponent
     */
    public hideModal(isNoteCreatedSuccessfully?: boolean): void {
        this.modalRef.hide();
        if (isNoteCreatedSuccessfully) {
            this.getStockReport(true);
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
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = moment(value.endDate).format(GIDDH_DATE_FORMAT);
            this.pickerSelectedFromDate = this.fromDate;
            this.pickerSelectedToDate = this.toDate;
            if (!from) {
                this.isFilterCorrect = true;
                this.getStockReport(true);
            }
        }
    }
    //************************************//
}

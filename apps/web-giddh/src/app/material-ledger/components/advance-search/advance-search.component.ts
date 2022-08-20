import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShSelectComponent } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.component';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ILedgerAdvanceSearchRequest } from '../../../models/api-models/Ledger';
import { AdvanceSearchModel, AdvanceSearchRequest } from '../../../models/interfaces/AdvanceSearchRequest';
import { GeneralService } from '../../../services/general.service';
import { GroupService } from '../../../services/group.service';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { IOption } from '../../../theme/ng-select/option.interface';
import { API_COUNT_LIMIT, GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import { SearchService } from '../../../services/search.service';
import { InventoryService } from '../../../services/inventory.service';
import { MatAccordion } from '@angular/material/expansion';
import { cloneDeep } from '../../../lodash-optimized';

@Component({
    selector: 'advance-search-model',
    templateUrl: './advance-search.component.html',
    styleUrls: ['./advance-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AdvanceSearchModelComponent implements OnInit, OnDestroy, OnChanges {
    /** Instance of mat accordion */
    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChildren(ShSelectComponent) public dropDowns: QueryList<ShSelectComponent>;
    public bsRangeValue: string[];
    /** Taking advance search params as input */
    @Input() public advanceSearchRequest: AdvanceSearchRequest;
    /** Output emitter for close modal event */
    @Output() public closeModelEvent: EventEmitter<{ advanceSearchData, isClose }> = new EventEmitter(null);
    public advanceSearchObject: ILedgerAdvanceSearchRequest = null;
    public advanceSearchForm: FormGroup;
    public showChequeDatePicker: boolean = false;
    public accounts$: Observable<IOption[]>;
    public groups$: Observable<IOption[]>;
    public voucherTypeList: Observable<IOption[]>;
    public stockListDropDown$: Observable<IOption[]>;
    public comparisonFilterDropDown$: Observable<IOption[]>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** datepickerTemplate element reference  */
    @ViewChild('datepickerTemplate', { static: true }) public datepickerTemplate: ElementRef;
    /* This will store if device is mobile or not */
    public isMobileScreen: boolean = false;
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* Selected from date */
    public fromDate: any;
    /* Selected to date */
    public toDate: any;
    /* This will hold the groups */
    public groups: IOption[] = [];
    public groupUniqueNames: any[] = [];
    /** Stores the search results pagination details */
    public accountsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search */
    public defaultAccountSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list */
    public preventDefaultScrollApiCall: boolean = false;
    /** Stores the default search results pagination details */
    public defaultAccountPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the list of accounts */
    public accounts: IOption[];
    /** Stores the search results pagination details for stock dropdown */
    public stocksSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search for stock dropdown */
    public defaultStockSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list for stock dropdown */
    public preventDefaultStockScrollApiCall: boolean = false;
    /** Stores the default search results pagination details for stock dropdown */
    public defaultStockPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the value of stocks */
    public stocks: IOption[];
    /** Stores the search results pagination details for group dropdown */
    public groupsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search for group dropdown */
    public defaultGroupSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list for group dropdown */
    public preventDefaultGroupScrollApiCall: boolean = false;
    /** Stores the default search results pagination details for group dropdown */
    public defaultGroupPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the value of groups */
    public searchedGroups: IOption[];
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if default accounts api call in progress */
    public isDefaultAccountsLoading: boolean = true;
    /** True if default stocks api call in progress */
    public isDefaultStocksLoading: boolean = true;
    /** True if default groups api call in progress */
    public isDefaultGroupsLoading: boolean = true;
    /** True if other details should be expanded by default */
    public isExpanded: boolean = false;
    /** Cloning advance search params to use in case of reset filters */
    public advanceSearchRequestClone: AdvanceSearchRequest;

    constructor(
        private groupService: GroupService,
        private inventoryService: InventoryService,
        private fb: FormBuilder,
        private modalService: BsModalService,
        private generalService: GeneralService,
        private searchService: SearchService,
        private changeDetectionRef: ChangeDetectorRef
    ) {

    }

    public ngOnInit() {
        this.setAdvanceSearchForm();

        this.loadDefaultAccountsSuggestions();
        this.loadDefaultStocksSuggestions();
        this.loadDefaultGroupsSuggestions();
    }

    /**
     * Lifecycle hook which updates input data if data has updated
     *
     * @param {SimpleChanges} changes
     * @memberof AdvanceSearchModelComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (!this.advanceSearchForm) {
            this.setAdvanceSearchForm();
        }

        if ('advanceSearchRequest' in changes && changes.advanceSearchRequest.currentValue && changes.advanceSearchRequest.currentValue !== changes.advanceSearchRequest.previousValue && changes.advanceSearchRequest.currentValue.dataToSend?.bsRangeValue) {
            this.fromDate = dayjs((changes.advanceSearchRequest.currentValue as AdvanceSearchRequest).dataToSend.bsRangeValue[0], GIDDH_DATE_FORMAT).toDate();
            this.toDate = dayjs((changes.advanceSearchRequest.currentValue as AdvanceSearchRequest).dataToSend.bsRangeValue[1], GIDDH_DATE_FORMAT).toDate();
            this.selectedDateRange = { startDate: changes.advanceSearchRequest.currentValue.dataToSend.bsRangeValue[0], endDate: changes.advanceSearchRequest.currentValue.dataToSend.bsRangeValue[1] };
            this.selectedDateRangeUi = dayjs(changes.advanceSearchRequest.currentValue.dataToSend.bsRangeValue[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(changes.advanceSearchRequest.currentValue.dataToSend.bsRangeValue[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            if (this.advanceSearchForm) {
                let bsDaterangepicker = this.advanceSearchForm.get('bsRangeValue');
                bsDaterangepicker?.patchValue(this.selectedDateRangeUi);
            }
        }

        if (this.advanceSearchForm && 'advanceSearchRequest' in changes && changes.advanceSearchRequest.currentValue && changes.advanceSearchRequest.currentValue.dataToSend) {
            let dataToSend = changes.advanceSearchRequest.currentValue.dataToSend;

            this.groupUniqueNames = [];

            setTimeout(() => {
                if (dataToSend.accountUniqueNames) {
                    this.advanceSearchForm.get('accountUniqueNames')?.patchValue(dataToSend.accountUniqueNames);
                }

                if (dataToSend.groupUniqueNames) {
                    this.advanceSearchForm.get('groupUniqueNames')?.patchValue(dataToSend.groupUniqueNames);
                    this.groupUniqueNames = dataToSend.groupUniqueNames;
                }

                if (dataToSend.particulars) {
                    this.advanceSearchForm.get('particulars')?.patchValue(dataToSend.particulars);
                }

                if (dataToSend.vouchers) {
                    this.advanceSearchForm.get('vouchers')?.patchValue(dataToSend.vouchers);
                }

                if (dataToSend.inventory) {
                    this.advanceSearchForm.get('inventory')?.patchValue(dataToSend.inventory);
                }

                if (dataToSend.amountOption) {
                    this.advanceSearchForm.get('amountOption')?.patchValue(dataToSend.amountOption);
                }

                this.changeDetectionRef.detectChanges();
            }, 500);
        }

        this.advanceSearchRequestClone = cloneDeep(this.advanceSearchRequest);
        this.changeDetectionRef.detectChanges();
    }

    public resetAdvanceSearchModal() {
        this.advanceSearchRequest.dataToSend.bsRangeValue = this.advanceSearchRequestClone.dataToSend.bsRangeValue;
        if (this.dropDowns) {
            this.dropDowns.forEach((el) => {
                el.clear();
            });
        }
        let f: any = dayjs(this.advanceSearchRequest.dataToSend.bsRangeValue[0], GIDDH_DATE_FORMAT);
        let t: any = dayjs(this.advanceSearchRequest.dataToSend.bsRangeValue[1], GIDDH_DATE_FORMAT);
        this.bsRangeValue = [];
        this.bsRangeValue.push(f.$d);
        this.bsRangeValue.push(t.$d);
        this.advanceSearchRequest.dataToSend = new AdvanceSearchModel();
        this.advanceSearchRequest.dataToSend.bsRangeValue = this.advanceSearchRequestClone.dataToSend.bsRangeValue;
        this.advanceSearchRequest.page = 1;
        this.setAdvanceSearchForm();
    }

    public setAdvanceSearchForm() {
        this.advanceSearchForm = this.fb.group({
            bsRangeValue: [[]],
            uniqueNames: [[]],
            isInvoiceGenerated: [null],
            accountUniqueNames: [[]],
            groupUniqueNames: [[]],
            amountLessThan: [false],
            includeAmount: [false],
            amountEqualTo: [false],
            amountGreaterThan: [false],
            amount: ['', Validators.required],
            amountOption: [false],
            includeDescription: [false, Validators.required],
            description: [null, Validators.required],
            includeTag: [false, Validators.required],
            includeParticulars: [true, Validators.required],
            includeVouchers: [true, Validators.required],
            chequeNumber: ['', Validators.required],
            dateOnCheque: ['', Validators.required],
            tags: this.fb.array([]),
            particulars: [[]],
            vouchers: [[]],
            cancelledEntries: [false],
            inventory: this.fb.group({
                includeInventory: true,
                inventories: [[]],
                quantity: null,
                inventoryQty: false,
                inventoryVal: false,
                includeQuantity: false,
                quantityLessThan: false,
                quantityEqualTo: false,
                quantityGreaterThan: false,
                includeItemValue: false,
                itemValue: null,
                includeItemLessThan: false,
                includeItemEqualTo: false,
                includeItemGreaterThan: false
            }),
        });

        if (this.advanceSearchRequest) {
            this.advanceSearchForm?.patchValue(this.advanceSearchRequest.dataToSend);

            if (this.advanceSearchForm.get('includeDescription').value) {
                this.isExpanded = true;
            } else {
                this.isExpanded = false;
            }
        }
    }

    public setVoucherTypes(event?: any) {
        if (event) {
            this.voucherTypeList = observableOf([{
                label: this.commonLocaleData?.app_voucher_types?.sales,
                value: 'sales'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.purchases,
                value: 'purchase'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.receipt,
                value: 'receipt'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.payment,
                value: 'payment'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.journal,
                value: 'journal'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.contra,
                value: 'contra'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.debit_note,
                value: 'debit note'
            }, {
                label: this.commonLocaleData?.app_voucher_types?.credit_note,
                value: 'credit note'
            }]);

            this.comparisonFilterDropDown$ = observableOf([
                { label: this.commonLocaleData?.app_comparision_filters?.greater_than, value: 'greaterThan' },
                { label: this.commonLocaleData?.app_comparision_filters?.less_than, value: 'lessThan' },
                { label: this.commonLocaleData?.app_comparision_filters?.greater_than_equals, value: 'greaterThanOrEquals' },
                { label: this.commonLocaleData?.app_comparision_filters?.less_than_equals, value: 'lessThanOrEquals' },
                { label: this.commonLocaleData?.app_comparision_filters?.equals, value: 'equals' },
                { label: this.commonLocaleData?.app_comparision_filters?.exclude, value: 'exclude' }
            ]);
        }
    }

    public onCancel() {
        this.closeModelEvent.emit({ advanceSearchData: this.advanceSearchRequest, isClose: true });
        this.hideGiddhDatepicker();
    }

    /**
     * onSearch
     */
    public onSearch() {
        this.advanceSearchRequest.dataToSend = this.advanceSearchForm.value;
        if (this.advanceSearchRequest.dataToSend && typeof this.advanceSearchRequest.dataToSend.bsRangeValue === 'string') {
            this.advanceSearchRequest.dataToSend.bsRangeValue = [this.fromDate, this.toDate];
        }
        if (this.advanceSearchRequest.dataToSend && this.advanceSearchRequest.dataToSend.dateOnCheque) {
            this.advanceSearchRequest.dataToSend.dateOnCheque = (dayjs(this.advanceSearchRequest.dataToSend.dateOnCheque).format('dddd') !== 'Invalid date') ? dayjs(this.advanceSearchRequest.dataToSend.dateOnCheque).format(GIDDH_DATE_FORMAT) : this.advanceSearchRequest.dataToSend.dateOnCheque;
        }
        this.closeModelEvent.emit({ advanceSearchData: this.advanceSearchRequest, isClose: false });
    }

    public prepareRequest() {
        let dataToSend = _.cloneDeep(this.advanceSearchForm.value);
        if (dataToSend.dateOnCheque) {
            dataToSend.dateOnCheque = dayjs(dataToSend.dateOnCheque).format(GIDDH_DATE_FORMAT);
        }
        return dataToSend;
    }

    /**
     * onDDElementSelect
     */
    public onDDElementSelect(type: string, data: any[]) {
        let values = [];
        if (data && data.length > 0) {
            data.forEach(element => {
                values.push(element.value);
            });
        }
        switch (type) {
            case 'particulars':
                this.advanceSearchForm.get('particulars')?.patchValue(values);
                break;
            case 'accountUniqueNames':
                this.advanceSearchForm.get('accountUniqueNames')?.patchValue(values);
                break;
            case 'vouchers':
                this.advanceSearchForm.get('vouchers')?.patchValue(values);
                break;
            case 'inventory':
                this.advanceSearchForm.get('inventory.inventories')?.patchValue(values);
                break;
            case 'groupUniqueNames':
                this.advanceSearchForm.get('groupUniqueNames')?.patchValue(values);
                break;
        }
    }

    /**
     * onDDClear
     */
    public onDDClear(type: string) {
        this.onDDElementSelect(type, []);
    }

    /**
     * onRangeSelect
     */
    public onRangeSelect(type: string, data: IOption) {
        switch (type + '-' + data.value) {
            case 'amount-greaterThan':
                this.advanceSearchForm.get('includeAmount')?.patchValue(true);
                this.advanceSearchForm.get('amountGreaterThan')?.patchValue(true);
                this.advanceSearchForm.get('amountLessThan')?.patchValue(false);
                this.advanceSearchForm.get('amountEqualTo')?.patchValue(false);
                break;
            case 'amount-lessThan':
                this.advanceSearchForm.get('includeAmount')?.patchValue(true);
                this.advanceSearchForm.get('amountGreaterThan')?.patchValue(false);
                this.advanceSearchForm.get('amountLessThan')?.patchValue(true);
                this.advanceSearchForm.get('amountEqualTo')?.patchValue(false);
                break;
            case 'amount-greaterThanOrEquals':
                this.advanceSearchForm.get('includeAmount')?.patchValue(true);
                this.advanceSearchForm.get('amountGreaterThan')?.patchValue(true);
                this.advanceSearchForm.get('amountLessThan')?.patchValue(false);
                this.advanceSearchForm.get('amountEqualTo')?.patchValue(true);
                break;
            case 'amount-lessThanOrEquals':
                this.advanceSearchForm.get('includeAmount')?.patchValue(true);
                this.advanceSearchForm.get('amountGreaterThan')?.patchValue(false);
                this.advanceSearchForm.get('amountLessThan')?.patchValue(true);
                this.advanceSearchForm.get('amountEqualTo')?.patchValue(true);
                break;
            case 'amount-equals':
                this.advanceSearchForm.get('includeAmount')?.patchValue(true);
                this.advanceSearchForm.get('amountGreaterThan')?.patchValue(false);
                this.advanceSearchForm.get('amountLessThan')?.patchValue(false);
                this.advanceSearchForm.get('amountEqualTo')?.patchValue(true);
                break;
            case 'amount-exclude':
                this.advanceSearchForm.get('includeAmount')?.patchValue(false);
                this.advanceSearchForm.get('amountGreaterThan')?.patchValue(false);
                this.advanceSearchForm.get('amountLessThan')?.patchValue(false);
                this.advanceSearchForm.get('amountEqualTo')?.patchValue(true);
                break;
            case 'inventoryQty-greaterThan':
                this.advanceSearchForm.get('inventory.includeQuantity')?.patchValue(true);
                this.advanceSearchForm.get('inventory.quantityGreaterThan')?.patchValue(true);
                this.advanceSearchForm.get('inventory.quantityLessThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.quantityEqualTo')?.patchValue(false);
                break;
            case 'inventoryQty-lessThan':
                this.advanceSearchForm.get('inventory.includeQuantity')?.patchValue(true);
                this.advanceSearchForm.get('inventory.quantityGreaterThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.quantityLessThan')?.patchValue(true);
                this.advanceSearchForm.get('inventory.quantityEqualTo')?.patchValue(false);
                break;
            case 'inventoryQty-greaterThanOrEquals':
                this.advanceSearchForm.get('inventory.includeQuantity')?.patchValue(true);
                this.advanceSearchForm.get('inventory.quantityGreaterThan')?.patchValue(true);
                this.advanceSearchForm.get('inventory.quantityLessThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.quantityEqualTo')?.patchValue(true);
                break;
            case 'inventoryQty-lessThanOrEquals':
                this.advanceSearchForm.get('inventory.includeQuantity')?.patchValue(true);
                this.advanceSearchForm.get('inventory.quantityGreaterThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.quantityLessThan')?.patchValue(true);
                this.advanceSearchForm.get('inventory.quantityEqualTo')?.patchValue(true);
                break;
            case 'inventoryQty-equals':
                this.advanceSearchForm.get('inventory.includeQuantity')?.patchValue(true);
                this.advanceSearchForm.get('inventory.quantityGreaterThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.quantityLessThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.quantityEqualTo')?.patchValue(true);
                break;
            case 'inventoryQty-exclude':
                this.advanceSearchForm.get('inventory.includeQuantity')?.patchValue(false);
                this.advanceSearchForm.get('inventory.quantityGreaterThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.quantityLessThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.quantityEqualTo')?.patchValue(false);
                break;
            case 'inventoryVal-greaterThan':
                this.advanceSearchForm.get('inventory.includeItemValue')?.patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemGreaterThan')?.patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemLessThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemEqualTo')?.patchValue(false);
                break;
            case 'inventoryVal-lessThan':
                this.advanceSearchForm.get('inventory.includeItemValue')?.patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemGreaterThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemLessThan')?.patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemEqualTo')?.patchValue(false);
                break;
            case 'inventoryVal-greaterThanOrEquals':
                this.advanceSearchForm.get('inventory.includeItemValue')?.patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemGreaterThan')?.patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemLessThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemEqualTo')?.patchValue(true);
                break;
            case 'inventoryVal-lessThanOrEquals':
                this.advanceSearchForm.get('inventory.includeItemValue')?.patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemGreaterThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemLessThan')?.patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemEqualTo')?.patchValue(true);
                break;
            case 'inventoryVal-equals':
                this.advanceSearchForm.get('inventory.includeItemValue')?.patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemGreaterThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemLessThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemEqualTo')?.patchValue(true);
                break;
            case 'inventoryVal-exclude':
                this.advanceSearchForm.get('inventory.includeItemValue')?.patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemGreaterThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemLessThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemEqualTo')?.patchValue(false);
                break;
        }
    }

    /**
     * toggleOtherDetails
     *
     * @memberof AdvanceSearchModelComponent
     */
    public toggleOtherDetails() {
        let val: boolean = !this.advanceSearchForm.get('includeDescription').value;
        this.advanceSearchForm.get('includeDescription')?.patchValue(val);
        if (!val) {
            this.advanceSearchForm.get('description')?.patchValue(null);
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body')?.classList?.remove('modal-open');
    }

    /**
    * This will show the datepicker
    *
    * @memberof AdvanceSearchModelComponent
    */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-xl giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: this.isMobileScreen })
        );

        this.modalService.onHidden.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            setTimeout(() => {
                document.querySelector('body')?.classList?.add('modal-open');
            }, 500);
        });
    }

    /**
     * This will hide the datepicker
     *
     * @memberof AdvanceSearchModelComponent
     */
    public hideGiddhDatepicker(): void {
        if (this.modalRef) {
            this.modalRef.hide();
        }
    }

    /**
       * Call back function for date/range selection in datepicker
       *
       * @param {*} value
       * @memberof AdvanceSearchModelComponent
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
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.startDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            if (this.advanceSearchForm) {
                this.fromDate = dayjs(value.startDate, GIDDH_DATE_FORMAT).toDate();
                this.toDate = dayjs(value.endDate, GIDDH_DATE_FORMAT).toDate();
                let bsDaterangepicker = this.advanceSearchForm.get('bsRangeValue');
                bsDaterangepicker?.patchValue([this.fromDate, this.toDate]);
            }
        }
    }

    /**
     * Search query change handler
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof AdvanceSearchModelComponent
     */
    public onAccountSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.accountsSearchResultsPaginationData.query = query;
        if (!this.preventDefaultScrollApiCall &&
            (query || (this.defaultAccountSuggestions && this.defaultAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page
            }
            if (this.advanceSearchRequest.branchUniqueName) {
                requestObject.branchUniqueName = encodeURIComponent(this.advanceSearchRequest.branchUniqueName);
            }
            this.searchService.searchAccountV2(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result.uniqueName,
                            label: `${result.name} (${result.uniqueName})`
                        }
                    }) || [];
                    if (page === 1) {
                        this.accounts = searchResults;
                    } else {
                        this.accounts = [
                            ...this.accounts,
                            ...searchResults
                        ];
                    }
                    this.accounts$ = observableOf(this.accounts);
                    this.accountsSearchResultsPaginationData.page = data.body.page;
                    this.accountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultAccountPaginationData.page = this.accountsSearchResultsPaginationData.page;
                        this.defaultAccountPaginationData.totalPages = this.accountsSearchResultsPaginationData.totalPages;
                    }
                }
            });
        } else {
            this.accounts = [...this.defaultAccountSuggestions];
            this.accountsSearchResultsPaginationData.page = this.defaultAccountPaginationData.page;
            this.accountsSearchResultsPaginationData.totalPages = this.defaultAccountPaginationData.totalPages;
            this.preventDefaultScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Scroll end handler
     *
     * @returns null
     * @memberof AdvanceSearchModelComponent
     */
    public handleScrollEnd(): void {
        if (this.accountsSearchResultsPaginationData.page < this.accountsSearchResultsPaginationData.totalPages) {
            this.onAccountSearchQueryChanged(
                this.accountsSearchResultsPaginationData.query,
                this.accountsSearchResultsPaginationData.page + 1,
                (response) => {
                    if (!this.accountsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result.uniqueName,
                                label: `${result.name} - (${result.uniqueName})`
                            }
                        }) || [];
                        this.defaultAccountSuggestions = this.defaultAccountSuggestions.concat(...results);
                        this.defaultAccountPaginationData.page = this.accountsSearchResultsPaginationData.page;
                        this.defaultAccountPaginationData.totalPages = this.accountsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
     * Search query change handler for stock
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof AdvanceSearchModelComponent
     */
    public onStockSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.stocksSearchResultsPaginationData.query = query;
        if (!this.preventDefaultStockScrollApiCall &&
            (query || (this.defaultStockSuggestions && this.defaultStockSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                count: API_COUNT_LIMIT
            }
            if (this.advanceSearchRequest.branchUniqueName) {
                requestObject.branchUniqueName = this.advanceSearchRequest.branchUniqueName;
            }
            this.inventoryService.GetStocks(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result.uniqueName,
                            label: `${result.name} (${result.uniqueName})`
                        }
                    }) || [];
                    if (page === 1) {
                        this.stocks = searchResults;
                    } else {
                        this.stocks = [
                            ...this.stocks,
                            ...searchResults
                        ];
                    }
                    this.stockListDropDown$ = observableOf(this.stocks);
                    this.stocksSearchResultsPaginationData.page = data.body.page;
                    this.stocksSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    }
                }
            });
        } else {
            this.stocks = [...this.defaultStockSuggestions];
            this.stocksSearchResultsPaginationData.page = this.defaultStockPaginationData.page;
            this.stocksSearchResultsPaginationData.totalPages = this.defaultStockPaginationData.totalPages;
            this.preventDefaultStockScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultStockScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Search query change handler for group
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof AdvanceSearchModelComponent
     */
    public onGroupSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.groupsSearchResultsPaginationData.query = query;
        if (!this.preventDefaultGroupScrollApiCall &&
            (query || (this.defaultGroupSuggestions && this.defaultGroupSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                count: API_COUNT_LIMIT
            }
            if (this.advanceSearchRequest.branchUniqueName) {
                requestObject.branchUniqueName = encodeURIComponent(this.advanceSearchRequest.branchUniqueName);
            }
            this.groupService.searchGroups(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result.uniqueName,
                            label: `${result.name} (${result.uniqueName})`
                        }
                    }) || [];
                    if (page === 1) {
                        this.searchedGroups = searchResults;
                    } else {
                        this.searchedGroups = [
                            ...this.searchedGroups,
                            ...searchResults
                        ];
                    }
                    this.groups$ = observableOf(this.searchedGroups);
                    this.groupsSearchResultsPaginationData.page = data.body.page;
                    this.groupsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultGroupPaginationData.page = this.groupsSearchResultsPaginationData.page;
                        this.defaultGroupPaginationData.totalPages = this.groupsSearchResultsPaginationData.totalPages;
                    }
                }
            });
        } else {
            this.searchedGroups = [...this.defaultGroupSuggestions];
            this.groupsSearchResultsPaginationData.page = this.defaultGroupPaginationData.page;
            this.groupsSearchResultsPaginationData.totalPages = this.defaultGroupPaginationData.totalPages;
            this.preventDefaultGroupScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultGroupScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Scroll end handler for stock dropdown
     *
     * @returns null
     * @memberof AdvanceSearchModelComponent
     */
    public handleStockScrollEnd(): void {
        if (this.stocksSearchResultsPaginationData.page < this.stocksSearchResultsPaginationData.totalPages) {
            this.onStockSearchQueryChanged(
                this.stocksSearchResultsPaginationData.query,
                this.stocksSearchResultsPaginationData.page + 1,
                (response) => {
                    if (!this.stocksSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result.uniqueName,
                                label: `${result.name} (${result.uniqueName})`
                            }
                        }) || [];
                        this.defaultStockSuggestions = this.defaultStockSuggestions.concat(...results);
                        this.defaultStockPaginationData.page = this.stocksSearchResultsPaginationData.page;
                        this.defaultStockPaginationData.totalPages = this.stocksSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
     * Scroll end handler for group dropdown
     *
     * @returns null
     * @memberof AdvanceSearchModelComponent
     */
    public handleGroupScrollEnd(): void {
        if (this.groupsSearchResultsPaginationData.page < this.groupsSearchResultsPaginationData.totalPages) {
            this.onGroupSearchQueryChanged(
                this.groupsSearchResultsPaginationData.query,
                this.groupsSearchResultsPaginationData.page + 1,
                (response) => {
                    if (!this.groupsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result.uniqueName,
                                label: `${result.name} (${result.uniqueName})`
                            }
                        }) || [];
                        this.defaultGroupSuggestions = this.defaultGroupSuggestions.concat(...results);
                        this.defaultGroupPaginationData.page = this.groupsSearchResultsPaginationData.page;
                        this.defaultGroupPaginationData.totalPages = this.groupsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
     * Loads the default stock list for advance search
     *
     * @private
     * @memberof AdvanceSearchModelComponent
     */
    private loadDefaultStocksSuggestions(): void {
        this.onStockSearchQueryChanged('', 1, (response) => {
            this.defaultStockSuggestions = response.map(result => {
                return {
                    value: result.uniqueName,
                    label: `${result.name} (${result.uniqueName})`
                }
            }) || [];
            this.defaultStockPaginationData.page = this.stocksSearchResultsPaginationData.page;
            this.defaultStockPaginationData.totalPages = this.stocksSearchResultsPaginationData.totalPages;
            this.stocks = [...this.defaultStockSuggestions];
            this.isDefaultStocksLoading = false;
            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * Loads the default group list for advance search
     *
     * @private
     * @memberof AdvanceSearchModelComponent
     */
    private loadDefaultGroupsSuggestions(): void {
        this.onGroupSearchQueryChanged('', 1, (response) => {
            this.defaultGroupSuggestions = response.map(result => {
                return {
                    value: result.uniqueName,
                    label: `${result.name} (${result.uniqueName})`
                }
            }) || [];
            this.defaultGroupPaginationData.page = this.groupsSearchResultsPaginationData.page;
            this.defaultGroupPaginationData.totalPages = this.groupsSearchResultsPaginationData.totalPages;
            this.searchedGroups = [...this.defaultGroupSuggestions];
            this.isDefaultGroupsLoading = false;
            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * Loads the default account search suggestion when module is loaded
     *
     * @private
     * @memberof AdvanceSearchModelComponent
     */
    private loadDefaultAccountsSuggestions(): void {
        this.onAccountSearchQueryChanged('', 1, (response) => {
            this.defaultAccountSuggestions = response.map(result => {
                return {
                    value: result.uniqueName,
                    label: `${result.name} (${result.uniqueName})`
                }
            }) || [];
            this.defaultAccountPaginationData.page = this.accountsSearchResultsPaginationData.page;
            this.defaultAccountPaginationData.totalPages = this.accountsSearchResultsPaginationData.totalPages;
            this.accounts = [...this.defaultAccountSuggestions];
            this.isDefaultAccountsLoading = false;
            this.changeDetectionRef.detectChanges();
        });
    }

}

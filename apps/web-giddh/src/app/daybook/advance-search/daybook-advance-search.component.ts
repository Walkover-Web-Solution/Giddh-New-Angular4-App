import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-select/option.interface';
import { AppState } from 'apps/web-giddh/src/app/store';
import { DayBookRequestModel } from 'apps/web-giddh/src/app/models/api-models/DaybookRequest';
import { DaterangePickerComponent } from '../../theme/ng2-daterangepicker/daterangepicker.component';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_MM_DD_YYYY, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { API_COUNT_LIMIT, GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GeneralService } from '../../services/general.service';
import { SearchService } from '../../services/search.service';
import { InventoryService } from '../../services/inventory.service';
import { MatAccordion } from '@angular/material/expansion';

@Component({
    selector: 'daybook-advance-search-model',
    templateUrl: './daybook-advance-search.component.html',
    styleUrls: ['./daybook-advance-search.component.scss']

})
export class DaybookAdvanceSearchModelComponent implements OnInit, OnChanges, OnDestroy {
    /** Instance of mat accordion */
    @ViewChild(MatAccordion) accordion: MatAccordion;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Input() public startDate: any;
    @Input() public endDate: any;
    /** Search filter data */
    @Input() public searchFilterData: any;
    @Output() public closeModelEvent: EventEmitter<any> = new EventEmitter();
    @ViewChild('dateRangePickerDir', { read: DaterangePickerComponent, static: true }) public dateRangePickerDir: DaterangePickerComponent;
    public advanceSearchObject: DayBookRequestModel = null;
    public advanceSearchForm: UntypedFormGroup;
    public showChequeDatePicker: boolean = false;
    public accounts$: Observable<IOption[]>;
    public groups$: Observable<IOption[]>;
    public voucherTypeList: Observable<IOption[]>;
    public stockListDropDown$: Observable<IOption[]>;
    public comparisonFilterDropDown$: Observable<IOption[]>;
    private dayjs = dayjs;
    private fromDate: string = '';
    private toDate: string = '';
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
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Mask format for decimal number and comma separation  */
    public inputMaskFormat: string = '';
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
    /** Stores the default search results pagination details for account dropdown */
    public defaultAccountPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the value of accounts */
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
    /** True if other details should be expanded by default */
    public isExpanded: boolean = false;

    constructor(
        private inventoryService: InventoryService,
        private store: Store<AppState>,
        private fb: UntypedFormBuilder,
        private generalService: GeneralService,
        private modalService: BsModalService,
        private searchService: SearchService
    ) {
        
    }

    public ngOnInit() {
        this.setVoucherTypes();
        this.loadDefaultAccountsSuggestions();
        this.loadDefaultStocksSuggestions();

        this.initializeDaybookAdvanceSearchForm();
        this.store.pipe(select(prof => prof.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';
        });

        this.comparisonFilterDropDown$ = observableOf([
            { label: this.commonLocaleData?.app_comparision_filters?.greater_than, value: 'greaterThan' },
            { label: this.commonLocaleData?.app_comparision_filters?.less_than, value: 'lessThan' },
            { label: this.commonLocaleData?.app_comparision_filters?.greater_than_equals, value: 'greaterThanOrEquals' },
            { label: this.commonLocaleData?.app_comparision_filters?.less_than_equals, value: 'lessThanOrEquals' },
            { label: this.commonLocaleData?.app_comparision_filters?.equals, value: 'equals' },
            { label: this.commonLocaleData?.app_comparision_filters?.exclude, value: 'exclude' }
        ]);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if(!this.advanceSearchForm) {
            this.initializeDaybookAdvanceSearchForm();
        }

        if ('startDate' in changes && changes.startDate.currentValue && 'endDate' in changes && changes.endDate.currentValue) {
            let dateRange = { fromDate: '', toDate: '' };
            dateRange = this.generalService.dateConversionToSetComponentDatePicker(changes.startDate.currentValue, changes.endDate.currentValue);
            this.selectedDateRange = { startDate: dayjs(dateRange.fromDate, GIDDH_DATE_FORMAT_MM_DD_YYYY), endDate: dayjs(dateRange.toDate, GIDDH_DATE_FORMAT_MM_DD_YYYY) };
            this.selectedDateRangeUi = dayjs(dateRange.fromDate, GIDDH_DATE_FORMAT_MM_DD_YYYY).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateRange.toDate, GIDDH_DATE_FORMAT_MM_DD_YYYY).format(GIDDH_NEW_DATE_FORMAT_UI);
        }

        if('searchFilterData' in changes && changes.searchFilterData.currentValue) {
            let dataToSend = changes.searchFilterData.currentValue;

            setTimeout(() => {
                if (dataToSend?.accountUniqueNames) {
                    this.advanceSearchForm.get('accountUniqueNames')?.patchValue(dataToSend?.accountUniqueNames);
                }

                if (dataToSend?.groupUniqueNames) {
                    this.advanceSearchForm.get('groupUniqueNames')?.patchValue(dataToSend?.groupUniqueNames);
                }

                if (dataToSend?.vouchers) {
                    this.advanceSearchForm.get('vouchers')?.patchValue(dataToSend?.vouchers);
                }

                if(dataToSend?.particulars) {
                    this.advanceSearchForm.get('particulars')?.patchValue(dataToSend?.particulars);
                }

                if(dataToSend?.inventory) {
                    this.advanceSearchForm.get('inventory')?.patchValue(dataToSend?.inventory);
                }
            }, 500);
        }
    }

    public setVoucherTypes(): void {
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
    }

    public onCancel() {
        this.fromDate = this.startDate;
        this.toDate = this.endDate;
        this.closeModelEvent.emit({
            cancle: true
        });
        if (this.modalRef) {
            this.hideGiddhDatepicker();
        }
    }

    /**
     * This will emit advance seach params
     *
     * @memberof DaybookAdvanceSearchModelComponent
     */
    public emitAdvanceSearchParams(): void {
        let dataToSend = _.cloneDeep(this.advanceSearchForm.value) as DayBookRequestModel;
        if (dataToSend.dateOnCheque) {
            if(typeof dataToSend.dateOnCheque === "object") {
                dataToSend.dateOnCheque = dayjs(dataToSend.dateOnCheque).format(GIDDH_DATE_FORMAT);
            } else {
                dataToSend.dateOnCheque = dayjs(dataToSend.dateOnCheque, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
            }
        }
        let fromDate = this.fromDate ? this.fromDate : this.selectedDateRange?.startDate ? this.selectedDateRange.startDate.format(GIDDH_DATE_FORMAT) : "";
        let toDate = this.toDate ? this.toDate : this.selectedDateRange?.endDate ? this.selectedDateRange.endDate.format(GIDDH_DATE_FORMAT) : "";
        this.closeModelEvent.emit({
            action: 'search',
            exportAs: null,
            dataToSend,
            fromDate,
            toDate,
            cancle: false
        });
    }

    /**
     * onDDElementSelect
     */
    public onDDElementSelect(type: string, data: any[]) {
        let values = [];
        data.forEach(element => {
            values.push(element.value);
        });
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
            case 'amount-null':
                this.advanceSearchForm.get('includeAmount')?.patchValue(false);
                this.advanceSearchForm.get('amountGreaterThan')?.patchValue(false);
                this.advanceSearchForm.get('amountLessThan')?.patchValue(false);
                this.advanceSearchForm.get('amountEqualTo')?.patchValue(false);
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
                this.advanceSearchForm.get('inventory.quantityEqualTo')?.patchValue(true);
                break;
            case 'inventoryQty-null':
                this.advanceSearchForm.get('inventory.includeQuantity')?.patchValue(false);
                this.advanceSearchForm.get('inventory.quantityGreaterThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.quantityLessThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.quantityEqualTo')?.patchValue(false);
                break;     
            case 'inventoryVal-greaterThan':
                this.advanceSearchForm.get('inventory.includeItemValue')?.patchValue(true);
                this.advanceSearchForm.get('inventory.itemValueGreaterThan')?.patchValue(true);
                this.advanceSearchForm.get('inventory.itemValueLessThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.itemValueEqualTo')?.patchValue(false);
                break;
            case 'inventoryVal-lessThan':
                this.advanceSearchForm.get('inventory.includeItemValue')?.patchValue(true);
                this.advanceSearchForm.get('inventory.itemValueGreaterThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.itemValueLessThan')?.patchValue(true);
                this.advanceSearchForm.get('inventory.itemValueEqualTo')?.patchValue(false);
                break;
            case 'inventoryVal-greaterThanOrEquals':
                this.advanceSearchForm.get('inventory.includeItemValue')?.patchValue(true);
                this.advanceSearchForm.get('inventory.itemValueGreaterThan')?.patchValue(true);
                this.advanceSearchForm.get('inventory.itemValueLessThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.itemValueEqualTo')?.patchValue(true);
                break;
            case 'inventoryVal-lessThanOrEquals':
                this.advanceSearchForm.get('inventory.includeItemValue')?.patchValue(true);
                this.advanceSearchForm.get('inventory.itemValueGreaterThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.itemValueLessThan')?.patchValue(true);
                this.advanceSearchForm.get('inventory.itemValueEqualTo')?.patchValue(true);
                break;
            case 'inventoryVal-equals':
                this.advanceSearchForm.get('inventory.includeItemValue')?.patchValue(true);
                this.advanceSearchForm.get('inventory.itemValueGreaterThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.itemValueLessThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.itemValueEqualTo')?.patchValue(true);
                break;
            case 'inventoryVal-exclude':
                this.advanceSearchForm.get('inventory.includeItemValue')?.patchValue(false);
                this.advanceSearchForm.get('inventory.itemValueGreaterThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.itemValueLessThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.itemValueEqualTo')?.patchValue(true);
                break;
            case 'inventoryVal-null':
                this.advanceSearchForm.get('inventory.includeItemValue')?.patchValue(false);
                this.advanceSearchForm.get('inventory.itemValueGreaterThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.itemValueLessThan')?.patchValue(false);
                this.advanceSearchForm.get('inventory.itemValueEqualTo')?.patchValue(false);
                break;      
        }
    }

    /**
     * toggleOtherDetails
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
    }

    /**
     * To initialize day book advance search form
     *
     * @memberof DaybookAdvanceSearchModelComponent
     */
    public initializeDaybookAdvanceSearchForm(): void {
        this.advanceSearchForm = this.fb.group({
            accountUniqueNames: [[]],
            groupUniqueNames: [[]],
            isInvoiceGenerated: [false],
            amountLessThan: [false],
            includeAmount: [false],
            amountEqualTo: [false],
            amountGreaterThan: [false],
            amountRange: [""],
            amount: ['', Validators.required],
            includeDescription: [false, Validators.required],
            description: [null, Validators.required],
            includeTag: [false, Validators.required],
            includeParticulars: [false, Validators.required],
            includeVouchers: [false, Validators.required],
            chequeNumber: ['', Validators.required],
            dateOnCheque: ['', Validators.required],
            tags: this.fb.array([]),
            particulars: [[]],
            vouchers: [[]],
            inventory: this.fb.group({
                includeInventory: true,
                inventories: [[]],
                quantity: null,
                inventoryQuantity: null,
                inventoryValue: null,
                includeQuantity: true,
                quantityLessThan: false,
                quantityEqualTo: true,
                quantityGreaterThan: true,
                includeItemValue: true,
                itemValue: null,
                itemValueLessThan: true,
                itemValueEqualTo: true,
                itemValueGreaterThan: false
            }),
        });

        if (this.searchFilterData) {
            this.advanceSearchForm?.patchValue(this.searchFilterData);

            if(this.advanceSearchForm.get("includeDescription").value) {
                this.isExpanded = true;
            } else {
                this.isExpanded = false;
            }
        }
    }

    /**
     * To show the datepicker
     *
     * @param {*} element
     * @memberof DaybookAdvanceSearchModelComponent
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
     * @memberof DaybookAdvanceSearchModelComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof DaybookAdvanceSearchModelComponent
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
        }
    }

    /**
     * Search query change handler for account
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof DaybookAdvanceSearchModelComponent
     */
    public onAccountSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.accountsSearchResultsPaginationData.query = query;
        if (!this.preventDefaultScrollApiCall &&
            (query || (this.defaultAccountSuggestions && this.defaultAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject = {
                q: encodeURIComponent(query),
                page
            }
            this.searchService.searchAccountV2(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: result.name
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
     * Search query change handler for stock
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof DaybookAdvanceSearchModelComponent
     */
    public onStockSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.stocksSearchResultsPaginationData.query = query;
        if (!this.preventDefaultStockScrollApiCall &&
            (query || (this.defaultStockSuggestions && this.defaultStockSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject = {
                q: encodeURIComponent(query),
                page,
                count: API_COUNT_LIMIT
            }
            this.inventoryService.GetStocks(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: `${result.name} (${result?.uniqueName})`
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
     * Scroll end handler for account dropdown
     *
     * @returns null
     * @memberof DaybookAdvanceSearchModelComponent
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
                                value: result?.uniqueName,
                                label: result.name
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
     * Scroll end handler  for stock dropdown
     *
     * @returns null
     * @memberof DaybookAdvanceSearchModelComponent
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
                                value: result?.uniqueName,
                                label: `${result.name} (${result?.uniqueName})`
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
     * Loads the default account search suggestion when module is loaded
     *
     * @private
     * @memberof DaybookAdvanceSearchModelComponent
     */
    private loadDefaultAccountsSuggestions(): void {
        this.onAccountSearchQueryChanged('', 1, (response) => {
            this.defaultAccountSuggestions = response.map(result => {
                return {
                    value: result?.uniqueName,
                    label: result.name
                }
            }) || [];
            this.defaultAccountPaginationData.page = this.accountsSearchResultsPaginationData.page;
            this.defaultAccountPaginationData.totalPages = this.accountsSearchResultsPaginationData.totalPages;
            this.accounts = [...this.defaultAccountSuggestions];
        });
    }

    /**
     * Loads the default stock list for advance search
     *
     * @private
     * @memberof DaybookAdvanceSearchModelComponent
     */
    private loadDefaultStocksSuggestions(): void {
        this.onStockSearchQueryChanged('', 1, (response) => {
            this.defaultStockSuggestions = response.map(result => {
                return {
                    value: result?.uniqueName,
                    label: `${result.name} (${result?.uniqueName})`
                }
            }) || [];
            this.defaultStockPaginationData.page = this.stocksSearchResultsPaginationData.page;
            this.defaultStockPaginationData.totalPages = this.stocksSearchResultsPaginationData.totalPages;
            this.stocks = [...this.defaultStockSuggestions];
        });
    }
}

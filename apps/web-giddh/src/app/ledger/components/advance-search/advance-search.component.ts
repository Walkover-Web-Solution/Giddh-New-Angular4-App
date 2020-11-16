import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { IFlattenAccountsResultItem } from 'apps/web-giddh/src/app/models/interfaces/flattenAccountsResultItem.interface';
import { ShSelectComponent } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.component';
import * as moment from 'moment';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { createSelector } from 'reselect';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { ILedgerAdvanceSearchRequest } from '../../../models/api-models/Ledger';
import { AdvanceSearchModel, AdvanceSearchRequest } from '../../../models/interfaces/AdvanceSearchRequest';
import { GeneralService } from '../../../services/general.service';
import { GroupService } from '../../../services/group.service';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { AppState } from '../../../store';
import { IOption } from '../../../theme/ng-select/option.interface';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';

const COMPARISON_FILTER = [
    { label: 'Greater Than', value: 'greaterThan' },
    { label: 'Less Than', value: 'lessThan' },
    { label: 'Greater Than or Equals', value: 'greaterThanOrEquals' },
    { label: 'Less Than or Equals', value: 'lessThanOrEquals' },
    { label: 'Equals', value: 'equals' },
    { label: 'Exclude', value: 'exclude' }
];

@Component({
    selector: 'advance-search-model',
    templateUrl: './advance-search.component.html',
    styleUrls: ['./advance-search.component.scss']
})

export class AdvanceSearchModelComponent implements OnInit, OnDestroy, OnChanges {

    @ViewChildren(ShSelectComponent) public dropDowns: QueryList<ShSelectComponent>;
    // @ViewChild('dp') public dateRangePicker: BsDaterangepickerDirective;
    public bsRangeValue: string[];
    @Input() public advanceSearchRequest: AdvanceSearchRequest;
    @Output() public closeModelEvent: EventEmitter<{ advanceSearchData, isClose }> = new EventEmitter(null);
    public flattenAccountListStream$: Observable<IFlattenAccountsResultItem[]>;
    public advanceSearchObject: ILedgerAdvanceSearchRequest = null;
    public advanceSearchForm: FormGroup;
    public showOtherDetails: boolean = false;
    public showChequeDatePicker: boolean = false;
    public bsConfig: Partial<BsDaterangepickerConfig> = { showWeekNumbers: false, dateInputFormat: GIDDH_DATE_FORMAT, rangeInputFormat: GIDDH_DATE_FORMAT };
    public accounts$: Observable<IOption[]>;
    public groups$: Observable<IOption[]>;
    public voucherTypeList: Observable<IOption[]>;
    public stockListDropDown$: Observable<IOption[]>;
    public comparisonFilterDropDown$: Observable<IOption[]>;
    private moment = moment;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** datepickerTemplate element reference  */
    @ViewChild('datepickerTemplate', {static: true}) public datepickerTemplate: ElementRef;
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

    constructor(private _groupService: GroupService, private inventoryAction: InventoryAction, private store: Store<AppState>, private fb: FormBuilder, private modalService: BsModalService, private generalService: GeneralService) {
        this.comparisonFilterDropDown$ = observableOf(COMPARISON_FILTER);
        this.flattenAccountListStream$ = this.store.pipe(select(p => p.general.flattenAccounts), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.flattenAccountListStream$.subscribe(data => {
            if (data) {
                let accounts: IOption[] = [];
                data.map(d => {
                    accounts.push({ label: `${d.name} (${d.uniqueName})`, value: d.uniqueName });
                });
                this.accounts$ = observableOf(accounts);
            }
        });

        this.stockListDropDown$ = this.store.pipe(select(createSelector([(state: AppState) => state.inventory.stocksList], (allStocks) => {
            let data = _.cloneDeep(allStocks);
            if (data && data.results) {
                let units = data.results;

                return units.map(unit => {
                    return { label: `${unit.name} (${unit.uniqueName})`, value: unit.uniqueName };
                });
            }
        })), takeUntil(this.destroyed$));

        if(!this.advanceSearchForm) {
            this.setAdvanceSearchForm();
        }
        this.setVoucherTypes();
    }

    public ngOnChanges(s: SimpleChanges) {
        if(!this.advanceSearchForm) {
            this.setAdvanceSearchForm();
        }

        if ('advanceSearchRequest' in s && s.advanceSearchRequest.currentValue && s.advanceSearchRequest.currentValue !== s.advanceSearchRequest.previousValue && s.advanceSearchRequest.currentValue.dataToSend.bsRangeValue) {
            this.fromDate = moment((s.advanceSearchRequest.currentValue as AdvanceSearchRequest).dataToSend.bsRangeValue[0], GIDDH_DATE_FORMAT).toDate();
            this.toDate = moment((s.advanceSearchRequest.currentValue as AdvanceSearchRequest).dataToSend.bsRangeValue[1], GIDDH_DATE_FORMAT).toDate();
            this.selectedDateRange = { startDate: s.advanceSearchRequest.currentValue.dataToSend.bsRangeValue[0], endDate: s.advanceSearchRequest.currentValue.dataToSend.bsRangeValue[1] };
            this.selectedDateRangeUi = moment(s.advanceSearchRequest.currentValue.dataToSend.bsRangeValue[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(s.advanceSearchRequest.currentValue.dataToSend.bsRangeValue[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            if (this.advanceSearchForm) {
                let bsDaterangepicker = this.advanceSearchForm.get('bsRangeValue');
                bsDaterangepicker.patchValue(this.selectedDateRangeUi);
            }
        }

        if(this.advanceSearchForm && 'advanceSearchRequest' in s && s.advanceSearchRequest.currentValue && s.advanceSearchRequest.currentValue.dataToSend) {
            let dataToSend = s.advanceSearchRequest.currentValue.dataToSend;

            this.groupUniqueNames = [];

            setTimeout(() => {
                if(dataToSend.accountUniqueNames) {
                    this.advanceSearchForm.get('accountUniqueNames').patchValue(dataToSend.accountUniqueNames);
                }

                if(dataToSend.groupUniqueNames) {
                    if(this.groups && this.groups.length > 0) {
                        this.advanceSearchForm.get('groupUniqueNames').patchValue(dataToSend.groupUniqueNames);
                    }

                    this.groupUniqueNames = dataToSend.groupUniqueNames;
                }

                if(dataToSend.particulars) {
                    this.advanceSearchForm.get('particulars').patchValue(dataToSend.particulars);
                }

                if(dataToSend.vouchers) {
                    this.advanceSearchForm.get('vouchers').patchValue(dataToSend.vouchers);
                }

                if(dataToSend.inventory) {
                    this.advanceSearchForm.get('inventory').patchValue(dataToSend.inventory);
                }
            }, 500);
        }
    }

    /**
     * Calls the API on component load when component is visible
     *
     * @memberof AdvanceSearchModelComponent
     */
    public loadComponent(): void {
        this.store.dispatch(this.inventoryAction.GetStock());
        // this.store.dispatch(this.groupWithAccountsAction.getFlattenGroupsWithAccounts());

        // Get groups with accounts
        this._groupService.GetFlattenGroupsAccounts().pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data && data.status === 'success' && data.body && data.body.results ) {
                let groups: IOption[] = [];
                data.body.results.map(d => {
                    groups.push({ label: `${d.groupName} (${d.groupUniqueName})`, value: d.groupUniqueName });
                });
                this.groups$ = observableOf(groups);

                setTimeout(() => {
                    if(this.groupUniqueNames && this.groupUniqueNames.length > 0) {
                        this.advanceSearchForm.get('groupUniqueNames').patchValue(this.groupUniqueNames);
                    }
                }, 500);
            }
        });
    }

    public resetAdvanceSearchModal() {
        this.advanceSearchRequest.dataToSend.bsRangeValue = [moment().toDate(), moment().subtract(30, 'days').toDate()];
        if (this.dropDowns) {
            this.dropDowns.forEach((el) => {
                el.clear();
            });
        }
        let f: any = moment(this.advanceSearchRequest.dataToSend.bsRangeValue[0], GIDDH_DATE_FORMAT);
        let t: any = moment(this.advanceSearchRequest.dataToSend.bsRangeValue[1], GIDDH_DATE_FORMAT);
        this.bsRangeValue = [];
        this.bsRangeValue.push(f._d);
        this.bsRangeValue.push(t._d);
        this.advanceSearchRequest.dataToSend = new AdvanceSearchModel();
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

        if(this.advanceSearchRequest) {
            this.advanceSearchForm.patchValue(this.advanceSearchRequest.dataToSend);
        }
    }

    public setVoucherTypes() {
        this.voucherTypeList = observableOf([{
            label: 'Sales',
            value: 'sales'
        }, {
            label: 'Purchases',
            value: 'purchase'
        }, {
            label: 'Receipt',
            value: 'receipt'
        }, {
            label: 'Payment',
            value: 'payment'
        }, {
            label: 'Journal',
            value: 'journal'
        }, {
            label: 'Contra',
            value: 'contra'
        }, {
            label: 'Debit Note',
            value: 'debit note'
        }, {
            label: 'Credit Note',
            value: 'credit note'
        }]);
    }

    public onCancel() {
        this.closeModelEvent.emit({ advanceSearchData: this.advanceSearchRequest, isClose: true });
        this.hideGiddhDatepicker();
    }

    /**
     * onDateRangeSelected
     */
    public onDateRangeSelected(data) {
        if (data && data.length) {
            // this.advanceSearchRequest.from = moment(data[0]).format(GIDDH_DATE_FORMAT);
            // this.advanceSearchRequest.to = moment(data[1]).format(GIDDH_DATE_FORMAT);
        }
        // this.closeModelEvent.emit(_.cloneDeep(this.advanceSearchRequest));
    }

    /**
     * onSearch
     */
    public onSearch() {
        this.advanceSearchRequest.dataToSend = this.advanceSearchForm.value;
        if (this.advanceSearchRequest.dataToSend && typeof this.advanceSearchRequest.dataToSend.bsRangeValue === 'string') {
            this.advanceSearchRequest.dataToSend.bsRangeValue = [this.fromDate, this.toDate];
        }
        this.closeModelEvent.emit({ advanceSearchData: this.advanceSearchRequest, isClose: false });
    }

    public resetAndSearch() {
        this.resetAdvanceSearchModal();
    }

    public prepareRequest() {
        let dataToSend = _.cloneDeep(this.advanceSearchForm.value);
        if (dataToSend.dateOnCheque) {
            dataToSend.dateOnCheque = moment(dataToSend.dateOnCheque).format(GIDDH_DATE_FORMAT);
        }
        return dataToSend;
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
                this.advanceSearchForm.get('particulars').patchValue(values);
                break;
            case 'accountUniqueNames':
                this.advanceSearchForm.get('accountUniqueNames').patchValue(values);
                break;
            case 'vouchers':
                this.advanceSearchForm.get('vouchers').patchValue(values);
                break;
            case 'inventory':
                this.advanceSearchForm.get('inventory.inventories').patchValue(values);
                break;
            case 'groupUniqueNames':
                this.advanceSearchForm.get('groupUniqueNames').patchValue(values);
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
                this.advanceSearchForm.get('includeAmount').patchValue(true);
                this.advanceSearchForm.get('amountGreaterThan').patchValue(true);
                this.advanceSearchForm.get('amountLessThan').patchValue(false);
                this.advanceSearchForm.get('amountEqualTo').patchValue(false);
                break;
            case 'amount-lessThan':
                this.advanceSearchForm.get('includeAmount').patchValue(true);
                this.advanceSearchForm.get('amountGreaterThan').patchValue(false);
                this.advanceSearchForm.get('amountLessThan').patchValue(true);
                this.advanceSearchForm.get('amountEqualTo').patchValue(false);
                break;
            case 'amount-greaterThanOrEquals':
                this.advanceSearchForm.get('includeAmount').patchValue(true);
                this.advanceSearchForm.get('amountGreaterThan').patchValue(true);
                this.advanceSearchForm.get('amountLessThan').patchValue(false);
                this.advanceSearchForm.get('amountEqualTo').patchValue(true);
                break;
            case 'amount-lessThanOrEquals':
                this.advanceSearchForm.get('includeAmount').patchValue(true);
                this.advanceSearchForm.get('amountGreaterThan').patchValue(false);
                this.advanceSearchForm.get('amountLessThan').patchValue(true);
                this.advanceSearchForm.get('amountEqualTo').patchValue(true);
                break;
            case 'amount-equals':
                this.advanceSearchForm.get('includeAmount').patchValue(true);
                this.advanceSearchForm.get('amountGreaterThan').patchValue(false);
                this.advanceSearchForm.get('amountLessThan').patchValue(false);
                this.advanceSearchForm.get('amountEqualTo').patchValue(true);
                break;
            case 'amount-exclude':
                this.advanceSearchForm.get('includeAmount').patchValue(false);
                this.advanceSearchForm.get('amountGreaterThan').patchValue(false);
                this.advanceSearchForm.get('amountLessThan').patchValue(false);
                this.advanceSearchForm.get('amountEqualTo').patchValue(false);
                break;
            case 'inventoryQty-greaterThan':
                this.advanceSearchForm.get('inventory.includeQuantity').patchValue(true);
                this.advanceSearchForm.get('inventory.quantityGreaterThan').patchValue(true);
                this.advanceSearchForm.get('inventory.quantityLessThan').patchValue(false);
                this.advanceSearchForm.get('inventory.quantityEqualTo').patchValue(false);
                break;
            case 'inventoryQty-lessThan':
                this.advanceSearchForm.get('inventory.includeQuantity').patchValue(true);
                this.advanceSearchForm.get('inventory.quantityGreaterThan').patchValue(false);
                this.advanceSearchForm.get('inventory.quantityLessThan').patchValue(true);
                this.advanceSearchForm.get('inventory.quantityEqualTo').patchValue(false);
                break;
            case 'inventoryQty-greaterThanOrEquals':
                this.advanceSearchForm.get('inventory.includeQuantity').patchValue(true);
                this.advanceSearchForm.get('inventory.quantityGreaterThan').patchValue(true);
                this.advanceSearchForm.get('inventory.quantityLessThan').patchValue(false);
                this.advanceSearchForm.get('inventory.quantityEqualTo').patchValue(true);
                break;
            case 'inventoryQty-lessThanOrEquals':
                this.advanceSearchForm.get('inventory.includeQuantity').patchValue(true);
                this.advanceSearchForm.get('inventory.quantityGreaterThan').patchValue(false);
                this.advanceSearchForm.get('inventory.quantityLessThan').patchValue(true);
                this.advanceSearchForm.get('inventory.quantityEqualTo').patchValue(true);
                break;
            case 'inventoryQty-equals':
                this.advanceSearchForm.get('inventory.includeQuantity').patchValue(true);
                this.advanceSearchForm.get('inventory.quantityGreaterThan').patchValue(false);
                this.advanceSearchForm.get('inventory.quantityLessThan').patchValue(false);
                this.advanceSearchForm.get('inventory.quantityEqualTo').patchValue(true);
                break;
            case 'inventoryQty-exclude':
                this.advanceSearchForm.get('inventory.includeQuantity').patchValue(false);
                this.advanceSearchForm.get('inventory.quantityGreaterThan').patchValue(false);
                this.advanceSearchForm.get('inventory.quantityLessThan').patchValue(false);
                this.advanceSearchForm.get('inventory.quantityEqualTo').patchValue(false);
                break;
            case 'inventoryVal-greaterThan':
                this.advanceSearchForm.get('inventory.includeItemValue').patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemGreaterThan').patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemLessThan').patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemEqualTo').patchValue(false);
                break;
            case 'inventoryVal-lessThan':
                this.advanceSearchForm.get('inventory.includeItemValue').patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemGreaterThan').patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemLessThan').patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemEqualTo').patchValue(false);
                break;
            case 'inventoryVal-greaterThanOrEquals':
                this.advanceSearchForm.get('inventory.includeItemValue').patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemGreaterThan').patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemLessThan').patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemEqualTo').patchValue(true);
                break;
            case 'inventoryVal-lessThanOrEquals':
                this.advanceSearchForm.get('inventory.includeItemValue').patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemGreaterThan').patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemLessThan').patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemEqualTo').patchValue(true);
                break;
            case 'inventoryVal-equals':
                this.advanceSearchForm.get('inventory.includeItemValue').patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemGreaterThan').patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemLessThan').patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemEqualTo').patchValue(true);
                break;
            case 'inventoryVal-exclude':
                this.advanceSearchForm.get('inventory.includeItemValue').patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemGreaterThan').patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemLessThan').patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemEqualTo').patchValue(false);
                break;
        }
    }

    /**
     * toggleOtherDetails
     *
     * @memberof AdvanceSearchModelComponent
     */
    public toggleOtherDetails() {
        this.showOtherDetails = !this.showOtherDetails;
        let val: boolean = !this.advanceSearchForm.get('includeDescription').value;
        this.advanceSearchForm.get('includeDescription').patchValue(val);
        if (!val) {
            this.advanceSearchForm.get('description').patchValue(null);
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
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
                document.querySelector('body').classList.add('modal-open');
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
        if(value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.startDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            if (this.advanceSearchForm) {
                this.fromDate = moment(value.startDate, GIDDH_DATE_FORMAT).toDate();
                this.toDate = moment(value.endDate, GIDDH_DATE_FORMAT).toDate();
                let bsDaterangepicker = this.advanceSearchForm.get('bsRangeValue');
                bsDaterangepicker.patchValue([this.fromDate, this.toDate]);
            }
        }
    }
}

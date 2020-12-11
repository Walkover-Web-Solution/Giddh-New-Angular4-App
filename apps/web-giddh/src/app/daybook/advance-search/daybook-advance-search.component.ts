import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { createSelector } from 'reselect';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-select/option.interface';
import { GroupService } from 'apps/web-giddh/src/app/services/group.service';
import { InventoryAction } from 'apps/web-giddh/src/app/actions/inventory/inventory.actions';
import { AppState } from 'apps/web-giddh/src/app/store';
import { DaybookActions } from 'apps/web-giddh/src/app/actions/daybook/daybook.actions';
import { AccountService } from 'apps/web-giddh/src/app/services/account.service';
import { DayBookRequestModel } from 'apps/web-giddh/src/app/models/api-models/DaybookRequest';
import { DaterangePickerComponent } from '../../theme/ng2-daterangepicker/daterangepicker.component';
import {IForceClear} from "../../models/api-models/Sales";
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_MM_DD_YYYY, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GeneralService } from '../../services/general.service';

const COMPARISON_FILTER = [
	{ label: 'Greater Than', value: 'greaterThan' },
	{ label: 'Less Than', value: 'lessThan' },
	{ label: 'Greater Than or Equals', value: 'greaterThanOrEquals' },
	{ label: 'Less Than or Equals', value: 'lessThanOrEquals' },
	{ label: 'Equals', value: 'equals' },
	{ label: 'Exclude', value: 'exclude' }
];

@Component({
	selector: 'daybook-advance-search-model',
	templateUrl: './daybook-advance-search.component.html',
	styleUrls: ['./daybook-advance-search.component.scss']

})

export class DaybookAdvanceSearchModelComponent implements OnInit, OnChanges, OnDestroy {

	@Input() public startDate: any;
	@Input() public endDate: any;
	@Output() public closeModelEvent: EventEmitter<any> = new EventEmitter();
	@ViewChild('dateRangePickerDir', { read: DaterangePickerComponent, static: true }) public dateRangePickerDir: DaterangePickerComponent;

	public advanceSearchObject: DayBookRequestModel = null;
	public advanceSearchForm: FormGroup;
	public showOtherDetails: boolean = false;
	public showChequeDatePicker: boolean = false;
	public bsConfig: Partial<BsDatepickerConfig> = { showWeekNumbers: false, dateInputFormat: GIDDH_DATE_FORMAT };
	public accounts$: Observable<IOption[]>;
	public groups$: Observable<IOption[]>;
	public voucherTypeList: Observable<IOption[]>;
	public stockListDropDown$: Observable<IOption[]>;
	public comparisonFilterDropDown$: Observable<IOption[]>;
    /** Sh-select force clear observable for voucher type  */
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    /** Sh-select force clear observable for amount range  */
    public forceClearRange$: Observable<IForceClear> = observableOf({ status: false });
    /** Sh-select force clear observable for account type  */
    public forceClearParticulars$: Observable<IForceClear> = observableOf({ status: false });

	public datePickerOptions: any = {
		parentEl: '#date-range-picker-parent',
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

	private moment = moment;
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

	constructor(private inventoryAction: InventoryAction, private store: Store<AppState>, private fb: FormBuilder, private _accountService: AccountService, private generalService: GeneralService, private modalService: BsModalService) {
        this.initializeDaybookAdvanceSearchForm();
		this.setVoucherTypes();
		this.comparisonFilterDropDown$ = observableOf(COMPARISON_FILTER);
		this.store.dispatch(this.inventoryAction.GetManufacturingStock());

	}

	public ngOnInit() {

		this.store.dispatch(this.inventoryAction.GetStock());
		// this.store.dispatch(this.groupWithAccountsAction.getFlattenGroupsWithAccounts());

		this._accountService.getFlattenAccounts('', '').pipe(takeUntil(this.destroyed$)).subscribe(data => {
			if (data.status === 'success') {
				let accounts: IOption[] = [];
				data.body.results.map(d => {
					accounts.push({ label: d.name, value: d.uniqueName });
				});
				this.accounts$ = observableOf(accounts);
			}
		});

		this.stockListDropDown$ = this.store.pipe(select(createSelector([(state: AppState) => state.inventory.stocksList], (allStocks) => {
			let data = _.cloneDeep(allStocks);
			if (data && data.results) {
				let units = data.results;

				return units.map(unit => {
					return { label: ` ${unit.name} (${unit.uniqueName})`, value: unit.uniqueName };
				});
			}
		})), takeUntil(this.destroyed$));
         this.store.pipe(select(prof => prof.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';
        });
	}

	public ngOnChanges(changes: SimpleChanges) {
        if('startDate' in changes && changes.startDate.currentValue && 'endDate' in changes && changes.endDate.currentValue) {
            let dateRange = { fromDate: '', toDate: '' };
            dateRange = this.generalService.dateConversionToSetComponentDatePicker(changes.startDate.currentValue, changes.endDate.currentValue);
            this.selectedDateRange = { startDate: moment(dateRange.fromDate, GIDDH_DATE_FORMAT_MM_DD_YYYY), endDate: moment(dateRange.toDate, GIDDH_DATE_FORMAT_MM_DD_YYYY) };
            this.selectedDateRangeUi = moment(dateRange.fromDate, GIDDH_DATE_FORMAT_MM_DD_YYYY).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(dateRange.toDate, GIDDH_DATE_FORMAT_MM_DD_YYYY).format(GIDDH_NEW_DATE_FORMAT_UI);
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
		this.datePickerOptions.startDate = this.startDate;
		this.datePickerOptions.endDate = this.endDate;
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
     * go
     */
	public go(exportFileAs = null) {
		let dataToSend = _.cloneDeep(this.advanceSearchForm.value) as DayBookRequestModel;
		if (dataToSend.dateOnCheque) {
			dataToSend.dateOnCheque = moment(dataToSend.dateOnCheque).format(GIDDH_DATE_FORMAT);
		}
		let fromDate = this.fromDate;
		let toDate = this.toDate;
		// this.store.dispatch(this._daybookActions.GetDaybook(dataToSend, this.fromDate, this.toDate));
		this.closeModelEvent.emit({
			action: exportFileAs ? 'export' : 'search',
			exportAs: exportFileAs,
			dataToSend,
			fromDate,
			toDate,
			cancle: false
		});

		exportFileAs = null;
		// this.advanceSearchForm.reset();
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
     */
	public toggleOtherDetails() {
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
     * To clear sh-selct value
     *
     * @memberof DaybookAdvanceSearchModelComponent
     */
    public resetShselectForceClear(): void {
        this.forceClear$ = observableOf({ status: true });
        this.forceClearParticulars$ = observableOf({ status: true });
        this.forceClearRange$ = observableOf({ status: true });
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
                includeQuantity: true,
                quantityLessThan: false,
                quantityEqualTo: true,
                quantityGreaterThan: true,
                includeItemValue: true,
                itemValue: null,
                includeItemLessThan: true,
                includeItemEqualTo: true,
                includeItemGreaterThan: false
            }),
        });
    }

    /**
     * To show the datepicker
     *
     * @param {*} element
     * @memberof TbPlBsFilterComponent
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
     * @memberof TbPlBsFilterComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof TbPlBsFilterComponent
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
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = moment(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }
}

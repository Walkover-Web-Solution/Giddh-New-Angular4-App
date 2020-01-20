import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
	@ViewChild('dateRangePickerDir', { read: DaterangePickerComponent }) public dateRangePickerDir: DaterangePickerComponent;

	public advanceSearchObject: DayBookRequestModel = null;
	public advanceSearchForm: FormGroup;
	public showOtherDetails: boolean = false;
	public showChequeDatePicker: boolean = false;
	public bsConfig: Partial<BsDatepickerConfig> = { showWeekNumbers: false, dateInputFormat: 'DD-MM-YYYY' };
	public accounts$: Observable<IOption[]>;
	public groups$: Observable<IOption[]>;
	public voucherTypeList: Observable<IOption[]>;
	public stockListDropDown$: Observable<IOption[]>;
	public comparisonFilterDropDown$: Observable<IOption[]>;

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
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(private _groupService: GroupService, private inventoryAction: InventoryAction, private store: Store<AppState>, private fb: FormBuilder, private _daybookActions: DaybookActions, private _accountService: AccountService) {

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

		this.setVoucherTypes();
		this.comparisonFilterDropDown$ = observableOf(COMPARISON_FILTER);
		this.store.dispatch(this.inventoryAction.GetManufacturingStock());

	}

	public ngOnInit() {

		this.store.dispatch(this.inventoryAction.GetStock());
		// this.store.dispatch(this.groupWithAccountsAction.getFlattenGroupsWithAccounts());

		this._accountService.GetFlattenAccounts('', '').pipe(takeUntil(this.destroyed$)).subscribe(data => {
			if (data.status === 'success') {
				let accounts: IOption[] = [];
				data.body.results.map(d => {
					accounts.push({ label: d.name, value: d.uniqueName });
				});
				this.accounts$ = observableOf(accounts);
			}
		});

		this.stockListDropDown$ = this.store.select(createSelector([(state: AppState) => state.inventory.stocksList], (allStocks) => {
			let data = _.cloneDeep(allStocks);
			if (data && data.results) {
				let units = data.results;

				return units.map(unit => {
					return { label: ` ${unit.name} (${unit.uniqueName})`, value: unit.uniqueName };
				});
			}
		})).pipe(takeUntil(this.destroyed$));

		// Get groups with accounts
		this._groupService.GetFlattenGroupsAccounts().pipe(takeUntil(this.destroyed$)).subscribe(data => {
			if (data.status === 'success') {
				let groups: IOption[] = [];
				data.body.results.map(d => {
					groups.push({ label: d.groupName, value: d.groupUniqueName });
				});
				this.groups$ = observableOf(groups);
			}
		});
	}

	public ngOnChanges(changes: SimpleChanges) {
		if ('startDate' in changes && changes.startDate.currentValue !== changes.startDate.previousValue) {
			//this.datePickerOptions.startDate = moment(changes.startDate.currentValue, 'DD-MM-YYYY');
			this.datePickerOptions = { ...this.datePickerOptions, startDate: moment(changes.startDate.currentValue, 'DD-MM-YYYY') };
			this.fromDate = changes.startDate.currentValue;
		}
		if ('endDate' in changes && changes.endDate.currentValue !== changes.endDate.previousValue) {
			//this.datePickerOptions.endDate = moment(changes.endDate.currentValue, 'DD-MM-YYYY');
			this.datePickerOptions = { ...this.datePickerOptions, endDate: moment(changes.endDate.currentValue, 'DD-MM-YYYY') };
			this.toDate = changes.endDate.currentValue;
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
		this.dateRangePickerDir.render();
		this.closeModelEvent.emit({
			cancle: true
		});
	}

    /**
     * onDateRangeSelected
     */
	public onDateRangeSelected(value) {
		this.fromDate = moment(value.picker.startDate).format('DD-MM-YYYY');
		this.toDate = moment(value.picker.endDate).format('DD-MM-YYYY');
	}

    /**
     * go
     */
	public go(exportFileAs = null) {
		let dataToSend = _.cloneDeep(this.advanceSearchForm.value) as DayBookRequestModel;
		if (dataToSend.dateOnCheque) {
			dataToSend.dateOnCheque = moment(dataToSend.dateOnCheque).format('DD-MM-YYYY');
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
}

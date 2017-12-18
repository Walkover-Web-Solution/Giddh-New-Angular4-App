import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs/Rx';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as moment from 'moment';
import { createSelector } from 'reselect';
import { IOption } from 'app/theme/ng-select/option.interface';
import { GroupService } from 'app/services/group.service';
import { InventoryAction } from 'app/actions/inventory/inventory.actions';
import { AppState } from 'app/store';
import { DaybookActions } from 'app/actions/daybook/daybook.actions';
import { AccountService } from 'app/services/account.service';
import { DayBookRequestModel } from 'app/models/api-models/DaybookRequest';

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
  templateUrl: './daybook-advance-search.component.html'
})

export class DaybookAdvanceSearchModelComponent implements OnInit {

  @Output() public closeModelEvent: EventEmitter<any> = new EventEmitter();

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
    this.comparisonFilterDropDown$ = Observable.of(COMPARISON_FILTER);
    this.store.dispatch(this.inventoryAction.GetManufacturingStock());

  }

  public ngOnInit() {

    this.store.dispatch(this.inventoryAction.GetStock());
    // this.store.dispatch(this.groupWithAccountsAction.getFlattenGroupsWithAccounts());

    this._accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accounts: IOption[] = [];
        data.body.results.map(d => {
          accounts.push({ label: d.name, value: d.uniqueName });
        });
        this.accounts$ = Observable.of(accounts);
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
    })).takeUntil(this.destroyed$);

    // Get groups with accounts
    this._groupService.GetFlattenGroupsAccounts().takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let groups: IOption[] = [];
        data.body.results.map(d => {
          groups.push({ label: d.groupName, value: d.groupUniqueName });
        });
        this.groups$ = Observable.of(groups);
      }
    });
  }

  public setVoucherTypes() {
    this.voucherTypeList = Observable.of([{
      label: 'Sales',
      value: 'sal'
    }, {
      label: 'Purchases',
      value: 'pur'
    }, {
      label: 'Receipt',
      value: 'rcpt'
    }, {
      label: 'Payment',
      value: 'pay'
    }, {
      label: 'Journal',
      value: 'jr'
    }, {
      label: 'Contra',
      value: 'cntr'
    }, {
      label: 'Debit Note',
      value: 'debit note'
    }, {
      label: 'Credit Note',
      value: 'credit note'
    }]);
  }

  public onCancel() {
    this.closeModelEvent.emit({
      cancle: true
    });
  }

  /**
   * onDateRangeSelected
   */
  public onDateRangeSelected(data) {
    this.fromDate = moment(data[0]).format('DD-MM-YYYY');
    this.toDate = moment(data[1]).format('DD-MM-YYYY');
  }

  /**
   * onSearch
   */
  public onSearch() {
    let dataToSend = _.cloneDeep(this.advanceSearchForm.value) as DayBookRequestModel;
    if (dataToSend.dateOnCheque) {
      dataToSend.dateOnCheque = moment(dataToSend.dateOnCheque).format('DD-MM-YYYY');
    }
    let fromDate = this.fromDate;
    let toDate = this.toDate;
    console.log('advanceSearchForm is :', dataToSend);
    // this.store.dispatch(this._daybookActions.GetDaybook(dataToSend, this.fromDate, this.toDate));
    this.closeModelEvent.emit({
      dataToSend,
      fromDate,
      toDate,
      cancle: false
    });
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
}

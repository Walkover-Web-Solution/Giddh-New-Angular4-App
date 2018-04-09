import { GIDDH_DATE_FORMAT } from './../../../shared/helpers/defaultDateFormat';
import { from } from 'rxjs/observable/from';
import { ShSelectComponent } from 'app/theme/ng-virtual-select/sh-select.component';
import { GroupService } from './../../../services/group.service';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { BsDatepickerConfig, BsDaterangepickerComponent } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs/Rx';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ILedgerAdvanceSearchRequest, Inventory } from './../../../models/api-models/Ledger';
import { CompanyActions } from '../../../actions/company.actions';
import { AppState } from './../../../store/roots';
import { Store } from '@ngrx/store';
import { IOption } from './../../../theme/ng-select/option.interface';
import { AccountService } from './../../../services/account.service';
import { AccountResponseV2 } from './../../../models/api-models/Account';
import { Component, Input, Output, EventEmitter, OnInit, ViewChildren, ViewChild, QueryList, SimpleChanges, OnDestroy, AfterViewInit, OnChanges } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as moment from 'moment';
import { createSelector } from 'reselect';
import { IFlattenAccountsResultItem } from 'app/models/interfaces/flattenAccountsResultItem.interface';

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
  templateUrl: './advance-search.component.html'
})

export class AdvanceSearchModelComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChildren(ShSelectComponent) public dropDowns: QueryList<ShSelectComponent>;
  @ViewChild('dp') public dateRangePicker: BsDaterangepickerComponent;
  @Input() public fromDateInLedger: string;
  @Input() public toDateInLedger: string;
  @Input() public accountUniqueName: string;
  @Output() public closeModelEvent: EventEmitter<any> = new EventEmitter(null);
  public flattenAccountListStream$: Observable<IFlattenAccountsResultItem[]>;
  public advanceSearchObject: ILedgerAdvanceSearchRequest = null;
  public advanceSearchForm: FormGroup;
  public showOtherDetails: boolean = false;
  public showChequeDatePicker: boolean  = false;
  public bsConfig: Partial<BsDatepickerConfig> = {showWeekNumbers: false, dateInputFormat: 'DD-MM-YYYY'};
  public accounts$: Observable<IOption[]>;
  public groups$: Observable<IOption[]>;
  public voucherTypeList: Observable<IOption[]>;
  public stockListDropDown$: Observable<IOption[]>;
  public comparisonFilterDropDown$: Observable<IOption[]>;

  private moment = moment;
  private fromDate: string = '';
  private toDate: string = '';
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _groupService: GroupService, private inventoryAction: InventoryAction, private store: Store<AppState>, private fb: FormBuilder, private _ledgerActions: LedgerActions, private _accountService: AccountService ) {
    this.setAdvanceSearchForm();
    this.setVoucherTypes();
    this.comparisonFilterDropDown$ = Observable.of(COMPARISON_FILTER);
    this.store.dispatch(this.inventoryAction.GetManufacturingStock());
    this.flattenAccountListStream$ = this.store.select(p => p.general.flattenAccounts).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.store.dispatch(this.inventoryAction.GetStock());
    // this.store.dispatch(this.groupWithAccountsAction.getFlattenGroupsWithAccounts());
    this.flattenAccountListStream$.subscribe(data => {
      if (data) {
        let accounts: IOption[] = [];
        data.map(d => {
          accounts.push({label: `${d.name} (${d.uniqueName})`, value: d.uniqueName});
        });
        this.accounts$ = Observable.of(accounts);
      }
    });

    this.stockListDropDown$ = this.store.select(createSelector([(state: AppState) => state.inventory.stocksList], (allStocks) => {
      let data = _.cloneDeep(allStocks);
      if (data && data.results) {
        let units = data.results;

        return units.map(unit => {
          return {label: `${unit.name} (${unit.uniqueName})`, value: unit.uniqueName};
        });
      }
    })).takeUntil(this.destroyed$);

    // Get groups with accounts
    this._groupService.GetFlattenGroupsAccounts().takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let groups: IOption[] = [];
        data.body.results.map(d => {
          groups.push({label: `${d.groupName} (${d.groupUniqueName})`, value: d.groupUniqueName});
        });
        this.groups$ = Observable.of(groups);
      }
    });
  }

  public ngOnChanges(s: SimpleChanges) {
    this.dateRangePicker._bsValue = [];
    if ('fromDateInLedger' in s && s.fromDateInLedger.currentValue && s.fromDateInLedger.currentValue !== s.fromDateInLedger.previousValue) {
      this.fromDate = s.fromDateInLedger.currentValue;
      let f: any = moment(s.fromDateInLedger.currentValue, GIDDH_DATE_FORMAT);
      this.dateRangePicker._bsValue[0] = f._d;
    }
    if ('toDateInLedger' in s && s.toDateInLedger.currentValue && s.toDateInLedger.currentValue !== s.toDateInLedger.previousValue) {
      this.toDate = s.toDateInLedger.currentValue;
      let t: any = moment(s.toDateInLedger.currentValue, GIDDH_DATE_FORMAT);
      this.dateRangePicker._bsValue[1] = t._d;
    }
  }

  public resetAdvanceSearchModal() {
    if (this.dropDowns) {
      this.dropDowns.forEach((el) => {
        el.clear();
      });
    }
    this.dateRangePicker.bsValue = [];
    this.setAdvanceSearchForm();
  }

  public setAdvanceSearchForm() {
    this.advanceSearchForm = this.fb.group({
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
      includeParticulars: [false, Validators.required],
      includeVouchers: [false, Validators.required],
      chequeNumber: ['', Validators.required],
      dateOnCheque: ['', Validators.required],
      tags: this.fb.array([]),
      particulars: [[]],
      vouchers: [[]],
      inventory: this.fb.group({
        includeInventory: false,
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
  }

  public setVoucherTypes() {
    this.voucherTypeList = Observable.of([{
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
    this.closeModelEvent.emit(null);
  }

  /**
   * onDateRangeSelected
   */
  public onDateRangeSelected(data) {
    if (data && data.length) {
      this.fromDate = moment(data[0]).format('DD-MM-YYYY');
      this.toDate = moment(data[1]).format('DD-MM-YYYY');
    }
  }

  /**
   * onSearch
   */
  public onSearch() {
    const dataToSend = this.prepareRequest();
    this.store.dispatch(this._ledgerActions.doAdvanceSearch(dataToSend, this.accountUniqueName, this.fromDate, this.toDate));
    this.closeModelEvent.emit(dataToSend);
    // this.advanceSearchForm.reset();
  }

  public prepareRequest() {
    let dataToSend = _.cloneDeep(this.advanceSearchForm.value);
    if (dataToSend.dateOnCheque) {
      dataToSend.dateOnCheque = moment(dataToSend.dateOnCheque).format('DD-MM-YYYY');
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
    let val: boolean = !this.advanceSearchForm.get('').value;
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

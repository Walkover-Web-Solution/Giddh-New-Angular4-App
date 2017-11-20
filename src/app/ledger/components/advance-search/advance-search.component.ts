import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs/Rx';
import { LedgerActions } from './../../../services/actions/ledger/ledger.actions';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ILedgerAdvanceSearchRequest, Inventory } from './../../../models/api-models/Ledger';
import { CompanyActions } from './../../../services/actions/company.actions';
import { AppState } from './../../../store/roots';
import { Store } from '@ngrx/store';
import { IOption } from './../../../theme/ng-select/option.interface';
import { AccountService } from './../../../services/account.service';
import { AccountResponseV2 } from './../../../models/api-models/Account';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as moment from 'moment';

@Component({
  selector: 'advance-search-model',
  templateUrl: './advance-search.component.html'
})

export class AdvanceSearchModelComponent implements OnInit {

  @Input() public accountUniqueName: string;
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

  public advanceSearchObject: ILedgerAdvanceSearchRequest = null;
  public advanceSearchForm: FormGroup;
  public showOtherDetails: boolean = false;
  public showChequeDatePicker: boolean  = false;
  public bsConfig: Partial<BsDatepickerConfig> = {showWeekNumbers: false, dateInputFormat: 'DD-MM-YYYY'};
  public accounts$: Observable<IOption[]>;

  // public activeAccount$: Observable<AccountResponseV2>;
  // public accounts$: Observable<IOption[]>;
  // public selectedAccountForMerge: any = [];
  // public checkModel: string = 'all';

  private moment = moment;
  private fromDate: string = '';
  private toDate: string = '';
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private fb: FormBuilder, private _ledgerActions: LedgerActions, private _accountService: AccountService ) {
    this.advanceSearchForm = this.fb.group({
      uniqueNames: this.fb.array([]),
      isInvoiceGenerated: [false],
      amountLessThan: [false],
      includeAmount: [false],
      amountEqualTo: [false],
      amountGreaterThan: [false],
      amount: ['', Validators.required],
      includeDescription: ['', Validators.required],
      description: ['', Validators.required],
      includeTag: ['', Validators.required],
      includeParticulars: ['', Validators.required],
      chequeNumber: ['', Validators.required],
      dateOnCheque: ['', Validators.required],
      tags: this.fb.array([]),
      particulars: this.fb.array(null),
      inventory: this.fb.array([])
    });
  }

  public ngOnInit() {
    this._accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accounts: IOption[] = [];
        data.body.results.map(d => {
          accounts.push({label: d.name, value: d.uniqueName});
        });
        this.accounts$ = Observable.of(accounts);
      }
    });

    // this.advanceSearchForm.controls['isInvoiceGenerated'].valueChanges.takeUntil(this.destroyed$).subscribe((value: boolean) => {
    //   this.advanceSearchForm.controls90;
    // });
  }

  public onCancel() {
    this.closeModelEvent.emit(true);
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
    let obj = {
      uniqueNames: [],
      includeAmount: null,
      amount: null,
      amountLessThan: null,
      amountEqualTo: null,
      amountGreaterThan: null,
      includeDescription: null,
      description: null,
      isInvoiceGenerated: false,
      includeTag: null,
      tags: [],
      includeParticulars: false,
      particulars: [],
      chequeNumber: '',
      dateOnCheque: '',
      inventory: {
        includeInventory: true,
        inventories: ['BLUEPEN1'],
        quantity: 1,
        includeQuantity: true,
        quantityLessThan: false,
        quantityEqualTo: true,
        quantityGreaterThan: true,
        includeItemValue: true,
        itemValue: 20,
        includeItemLessThan: true,
        includeItemEqualTo: true,
        includeItemGreaterThan: false
      }
    };
    let dataToSend = _.cloneDeep(this.advanceSearchForm.value);
    if (dataToSend.dateOnCheque) {
      dataToSend.dateOnCheque = moment(dataToSend.dateOnCheque).format('DD-MM-YYYY');
    }
    console.log('advanceSearchForm is :', dataToSend);
    this.store.dispatch(this._ledgerActions.doAdvanceSearch(dataToSend, this.accountUniqueName, this.fromDate, this.toDate));
  }

  /**
   * onParticularSelect
   */
  public onParticularSelect(data) {
    // let particulars = this.advanceSearchForm.get('particulars');
    let particulars = this.advanceSearchForm.get('particulars');
    particulars.patchValue(['1', '2', '3']);
    console.log('after patching value :', this.advanceSearchForm.value);
  }
}

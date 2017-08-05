import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flattenAccountsResultItem.interface';
import { IFlattenGroupsAccountsDetail } from '../../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { AppState } from '../../../store/roots';
import { Store } from '@ngrx/store';
import { LedgerActions } from '../../../services/actions/ledger/ledger.actions';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BlankLedgerVM, TransactionVM } from '../../ledger.vm';
import { Select2OptionData } from '../../../shared/theme/select2/select2.interface';
import { createAutoCorrectedDatePipe } from '../../../shared/helpers/autoCorrectedDatePipe';
import { CompanyActions } from '../../../services/actions/company.actions';
import { TaxResponse } from '../../../models/api-models/Company';
import { Router } from '@angular/router';

@Component({
  selector: 'new-ledger-entry-panel',
  templateUrl: 'newLedgerEntryPanel.component.html'
})

export class NewLedgerEntryPanelComponent implements OnInit, OnDestroy, OnChanges, AfterViewChecked {
  @Input() public selectedAccount: IFlattenAccountsResultItem | any = null;
  @Input() public blankLedger: BlankLedgerVM;
  @Input() public currentTxn: TransactionVM = null;
  @Input() public needToReCalculate: boolean = false;
  @Input() public accountUnq: string;
  @Output() public changeTransactionType: EventEmitter<string> = new EventEmitter();
  @Output() public resetBlankLedger: EventEmitter<boolean> = new EventEmitter();
  public discountAccountsList$: Observable<IFlattenGroupsAccountsDetail>;
  public companyTaxesList$: Observable<TaxResponse[]>;
  public isLedgerCreateSuccess$: Observable<boolean>;

  public voucherDropDownOptions: Select2Options = {
    multiple: false,
    allowClear: true,
    width: '200px',
    placeholder: 'Select Vouchers'
  };
  public voucherTypeList: Observable<Select2OptionData[]>;
  public showAdvanced: boolean;
  public dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  public datePipe = createAutoCorrectedDatePipe('mm/dd/yyyy');

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>,
              private _ledgerActions: LedgerActions,
              private _companyActions: CompanyActions,
              private cdRef: ChangeDetectorRef,
              private _router: Router) {
    this.discountAccountsList$ = this.store.select(p => p.ledger.discountAccountsList).takeUntil(this.destroyed$);
    this.companyTaxesList$ = this.store.select(p => p.company.taxes).takeUntil(this.destroyed$);
    this.voucherTypeList = Observable.of([{
      text: 'Sales',
      id: 'sal'
    }, {
      text: 'Purchases',
      id: 'pur'
    }, {
      text: 'Receipt',
      id: 'rcpt'
    }, {
      text: 'Payment',
      id: 'pay'
    }, {
      text: 'Journal',
      id: 'jr'
    }, {
      text: 'Contra',
      id: 'cntr'
    }, {
      text: 'Debit Note',
      id: 'debit note'
    }, {
      text: 'Credit Note',
      id: 'credit note'
    }]);

    this.store.dispatch(this._ledgerActions.GetDiscountAccounts());
    this.store.dispatch(this._companyActions.getTax());
    this.isLedgerCreateSuccess$ = this.store.select(p => p.ledger.ledgerCreateSuccess).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.showAdvanced = false;
    this.isLedgerCreateSuccess$.distinctUntilChanged().subscribe(s => {
      if (s) {
        this._router.navigate(['/pages/dummy'], {skipLocationChange: true}).then(() => {
          this._router.navigate(['/pages', 'ledger', this.accountUnq]);
        });
      }
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['needToReCalculate']) {
      this.calculateTotal();
    }
  }

  public ngAfterViewChecked() {
    // this.cdRef.detectChanges();
  }

  /**
   * add to debit or credit
   * @param {string} type
   */
  public addToDrOrCr(type: string) {
    this.changeTransactionType.emit(type);
  }

  public calculateTotal() {
    let total = this.currentTxn.amount - this.currentTxn.discount;
    this.currentTxn.total = Number((total + (( total * this.currentTxn.tax) / 100)).toFixed(2));
  }

  public calculateAmount() {
    this.currentTxn.amount = ((this.currentTxn.total * 100) + (100 + this.currentTxn.tax) * this.currentTxn.discount) / (100 + this.currentTxn.tax);
  }

  public saveLedger() {
    let blankTransactionObj: BlankLedgerVM;
    blankTransactionObj = Object.assign({}, this.blankLedger);

    blankTransactionObj.transactions = blankTransactionObj.transactions.filter(c => c.type === this.currentTxn.type);
    blankTransactionObj.transactions.map(bl => {
      bl.particular = this.selectedAccount.uniqueName;
      // delete bl['tax'];
      // delete bl['discount'];
    });
    this.store.dispatch(this._ledgerActions.CreateBlankLedger(blankTransactionObj, this.accountUnq));
  }

  /**
   * reset panel form
   */
  public resetPanel() {
    this.currentTxn = null;
    this.resetBlankLedger.emit(true);
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

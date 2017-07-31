import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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

@Component({
  selector: 'new-ledger-entry-panel',
  templateUrl: 'newLedgerEntryPanel.component.html'
})

export class NewLedgerEntryPanelComponent implements OnInit, OnDestroy {
  @Input() public selectedAccount: IFlattenAccountsResultItem | any = null;
  @Input() public blankLedger: BlankLedgerVM;
  @Input() public currentTxn: TransactionVM = null;
  @Output() public changeTransactionType: EventEmitter<string> = new EventEmitter();
  @Output() public resetBlankLedger: EventEmitter<boolean> = new EventEmitter();
  public discountAccountsList$: Observable<IFlattenGroupsAccountsDetail>;

  public voucherDropDownOptions: Select2Options = {
    multiple: false,
    allowClear: true,
    width: '100%',
    placeholder: 'Select Vouchers'
  };
  public voucherTypeList: Observable<Select2OptionData[]>;
  public showAdvanced: boolean;
  public dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  public datePipe = createAutoCorrectedDatePipe('mm/dd/yyyy');

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _ledgerActions: LedgerActions) {
    this.discountAccountsList$ = this.store.select(p => p.ledger.discountAccountsList).takeUntil(this.destroyed$);
    this.voucherTypeList = Observable.of([{
      text: 'Sales',
      id: 'Sales'
    }, {
      text: 'Purchases',
      id: 'Purchases'
    }, {
      text: 'Receipt',
      id: 'Receipt'
    }, {
      text: 'Payment',
      id: 'Payment'
    }, {
      text: 'Journal',
      id: 'Journal'
    }, {
      text: 'Contra',
      id: 'Contra'
    }, {
      text: 'Debit Note',
      id: 'Debit Note'
    }, {
      text: 'Credit Note',
      id: 'Credit Note'
    }]);

    this.store.dispatch(this._ledgerActions.GetDiscountAccounts());
  }

  public ngOnInit() {
    this.showAdvanced = false;
  }

  public addToDrOrCr(type: string) {
    this.changeTransactionType.emit(type);
  }

  public resetPanel() {
    this.currentTxn = null;
    this.resetBlankLedger.emit(true);
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

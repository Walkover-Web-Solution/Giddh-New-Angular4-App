import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, ViewChild } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { LedgerResponse } from '../../../models/api-models/Ledger';
import { AppState } from '../../../store/roots';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { IOption } from '../../../shared/theme/index';
import { TaxResponse } from '../../../models/api-models/Company';
import { UploadInput, UploadOutput } from 'ngx-uploader';
import { ToasterService } from '../../../services/toaster.service';
import { LEDGER_API } from '../../../services/apiurls/ledger.api';
import { ModalDirective } from 'ngx-bootstrap';
import { AccountService } from '../../../services/account.service';
import { ITransactionItem, ILedgerTransactionItem } from '../../../models/interfaces/ledger.interface';
import { TransactionVM } from '../../ledger.vm';
import { last, filter, orderBy, reduce, sumBy } from 'lodash';
import { Select2OptionData } from '../../../shared/theme/select2/select2.interface';
import * as uuid from 'uuid';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flattenAccountsResultItem.interface';
import { LedgerActions } from '../../../services/actions/ledger/ledger.actions';

@Component({
  selector: 'update-ledger-entry-panel',
  templateUrl: './updateLedgerEntryPanel.component.html',
  styleUrls: ['./updateLedgerEntryPanel.component.css']
})
export class UpdateLedgerEntryPanelComponent implements OnInit, OnDestroy {
  @Output() public closeUpdateLedgerModal: EventEmitter<boolean> = new EventEmitter();
  @Output() public entryDeleted: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('deleteAttachedFileModal') public deleteAttachedFileModal: ModalDirective;
  @ViewChild('deleteEntryModal') public deleteEntryModal: ModalDirective;
  public sessionKey$: Observable<string>;
  public companyName$: Observable<string>;
  public flatternAccountList: Observable<Select2OptionData[]>;
  public accountsOptions: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Select Accounts',
    allowClear: true,
    templateSelection: (data) => data.text,
    templateResult: (data: any) => {
      if (data.text === 'Searching…') {
        return;
      }
      if (!data.additional.stock) {
        return $(`<a href="javascript:void(0)" class="account-list-item" style="border-bottom: 1px solid #000;">
                        <span class="account-list-item" style="display: block;font-size:14px">${data.text}</span>
                        <span class="account-list-item" style="display: block;font-size:12px">${data.additional.uniqueName}</span>
                      </a>`);
      } else {
        return $(`<a href="javascript:void(0)" class="account-list-item" style="border-bottom: 1px solid #000;">
                        <span class="account-list-item" style="display: block;font-size:14px">${data.text}</span>
                        <span class="account-list-item" style="display: block;font-size:12px">${data.additional.uniqueName}</span>
                        <span class="account-list-item" style="display: block;font-size:11px">
                            Stock: ${data.additional.stock.name}
                        </span>
                      </a>`);
      }
    }
  };
  public isFileUploading: boolean = false;
  public accountUniqueName: string;
  public entryUniqueName$: Observable<string>;
  public selectedLedger: LedgerResponse = new LedgerResponse();
  public voucherTypeList: IOption[];
  public companyTaxesList$: Observable<TaxResponse[]>;
  public uploadInput: EventEmitter<UploadInput>;
  public entryTotal: { crTotal: number, drTotal: number } = { drTotal: 0, crTotal: 0 };
  public grandTotal: number = 0;
  public totalAmount: number = 0;
  public selectedAccount: IFlattenAccountsResultItem = null;
  public isDeleteTrxEntrySuccess$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(private store: Store<AppState>, private _ledgerService: LedgerService,
    private route: ActivatedRoute, private _toasty: ToasterService, private _accountService: AccountService,
    private _ledgerAction: LedgerActions) {
    this.selectedLedger = new LedgerResponse();
    this.entryUniqueName$ = this.store.select(p => p.ledger.selectedTxnForEditUniqueName).takeUntil(this.destroyed$);
    this.companyTaxesList$ = this.store.select(p => p.company.taxes).takeUntil(this.destroyed$);
    this.sessionKey$ = this.store.select(p => p.session.user.session.id).takeUntil(this.destroyed$);
    this.companyName$ = this.store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$);
    this.isDeleteTrxEntrySuccess$ = this.store.select(p => p.ledger.isDeleteTrxEntrySuccessfull).takeUntil(this.destroyed$);
    this.voucherTypeList = [{
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
    }];

    // get flatten_accounts list
    this._accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accountsArray: Select2OptionData[] = [];
        data.body.results.map(acc => {
          if (acc.stocks) {
            acc.stocks.map(as => {
              accountsArray.push({
                id: acc.uniqueName,
                text: acc.name,
                additional: Object.assign({}, acc, { stock: as })
              });
            });
            accountsArray.push({ id: acc.uniqueName, text: acc.name, additional: acc });
          } else {
            accountsArray.push({ id: acc.uniqueName, text: acc.name, additional: acc });
          }
        });
        this.flatternAccountList = Observable.of(orderBy(accountsArray, 'text'));
      }
    });
  }
  public ngOnInit() {
    // get Account name from url
    this.route.params.takeUntil(this.destroyed$).subscribe(params => {
      this.accountUniqueName = params['accountUniqueName'];
    });

    // emit upload event
    this.uploadInput = new EventEmitter<UploadInput>();

    //  get entry from server
    this.entryUniqueName$.distinctUntilChanged().subscribe(entryName => {
      if (entryName) {
        this._ledgerService.GetLedgerTransactionDetails(this.accountUniqueName, entryName).subscribe(resp => {
          if (resp.status === 'success') {
            this.selectedLedger = resp.body;
            if (this.selectedLedger.total.type === 'DEBIT') {
              this.selectedLedger.transactions.push(this.blankTransactionItem('CREDIT'));
            } else {
              this.selectedLedger.transactions.push(this.blankTransactionItem('DEBIT'));
            }
            this.getEntryTotal();
            this.generateGrandTotal();
            this.getPanelAmount();
          }
        });
      }
    });

    // check if delete entry is success
    this.isDeleteTrxEntrySuccess$.subscribe(del => {
      if (del) {
        this.hideDeleteEntryModal();
        this.entryDeleted.emit(true);
      }
    });
  }
  public addBlankTrx(type: string = 'DEBIT', txn: ITransactionItem, event: Event) {
    let lastTxn = last(filter(this.selectedLedger.transactions, p => p.type === type));
    if (txn.particular.uniqueName && lastTxn.particular.uniqueName) {
      this.selectedLedger.transactions.push(this.blankTransactionItem(type));
    }
  }
  public blankTransactionItem(type: string = 'DEBIT'): ITransactionItem {
    return {
      amount: 0,
      type,
      particular: {
        name: '',
        uniqueName: ''
      }
    } as ITransactionItem;
  }
  public onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
      let sessionKey = null;
      let companyUniqueName = null;
      this.sessionKey$.take(1).subscribe(a => sessionKey = a);
      this.companyName$.take(1).subscribe(a => companyUniqueName = a);
      const event: UploadInput = {
        type: 'uploadAll',
        url: LEDGER_API.UPLOAD_FILE.replace(':companyUniqueName', companyUniqueName),
        method: 'POST',
        fieldName: 'file',
        data: { company: companyUniqueName },
        headers: { 'Session-Id': sessionKey },
        concurrency: 0
      };
      this.uploadInput.emit(event);
    } else if (output.type === 'start') {
      this.isFileUploading = true;
    } else if (output.type === 'done') {
      if (output.file.response.status === 'success') {
        // this.isFileUploading = false;
        this.selectedLedger.attachedFile = output.file.response.body.uniqueName;
        this.selectedLedger.attachedFileName = output.file.response.body.name;
        this._toasty.successToast('file uploaded successfully');
      } else {
        this.isFileUploading = false;
        this.selectedLedger.attachedFile = '';
        this.selectedLedger.attachedFileName = '';
        this._toasty.errorToast(output.file.response.message);
      }
    }
  }
  public selectAccount(e, txn) {
    this.onTxnAmountChange();
    if (!e.value) {
      // if there's no selected account set selectedAccount to null
      this.selectedAccount = null;
      // reset taxes and discount on selected account change
      // txn.tax = 0;
      // txn.taxes = [];
      // txn.discount = 0;
      // txn.discounts = [];
      return;
    }
    this.flatternAccountList.take(1).subscribe(data => {
      data.map(fa => {
        // change (e.value[0]) to e.value to use in single select for ledger transaction entry
        if (fa.id === e.value) {
          this.selectedAccount = fa.additional;
          // reset taxes and discount on selected account change
          // txn.tax = 0;
          // txn.taxes = [];
          // txn.discount = 0;
          // txn.discounts = [];
          return;
        }
      });
    });
  }
  public getEntryTotal() {
    this.entryTotal.crTotal = 0;
    this.entryTotal.drTotal = 0;
    this.selectedLedger.transactions.forEach((txn) => {
      if (txn.type === 'DEBIT') {
        return this.entryTotal.drTotal += Number(txn.amount);
      } else {
        return this.entryTotal.crTotal += Number(txn.amount);
      }
    });
    // if (this.entryTotal.drTotal > this.entryTotal.crTotal) {
    //   this.entryTotal.reckoning = this.entryTotal.drTotal;
    // } else {
    //   this.entryTotal.reckoning = this.entryTotal.crTotal;
    // }
    // return this.entryTotal;
  }
  public onTxnAmountChange() {
    this.generateGrandTotal();
    this.getPanelAmount();
  }
  public getPanelAmount() {
    this.totalAmount = sumBy(this.selectedLedger.transactions, (tr) => Number(tr.amount));
  }
  public generateGrandTotal() {
    this.grandTotal = sumBy(this.selectedLedger.transactions, (tr) => Number(tr.amount));
  }
  public showDeleteAttachedFileModal(merge: string) {
    this.deleteAttachedFileModal.show();
  }
  public hideDeleteAttachedFileModal() {
    this.deleteAttachedFileModal.hide();
  }
  public showDeleteEntryModal(merge: string) {
    this.deleteEntryModal.show();
  }
  public hideDeleteEntryModal() {
    this.deleteEntryModal.hide();
  }
  public deleteTrxEntry() {
    let entryName: string = null;
    this.entryUniqueName$.take(1).subscribe(en => entryName = en);
    this.store.dispatch(this._ledgerAction.deleteTrxEntry(this.accountUniqueName, entryName));
  }
  public deleteAttachedFile() {
    this.selectedLedger.attachedFile = '';
    this.selectedLedger.attachedFileName = '';
    this.hideDeleteAttachedFileModal();
  }
  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

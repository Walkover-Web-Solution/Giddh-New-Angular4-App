import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { LedgerResponse } from '../../../models/api-models/Ledger';
import { AppState } from '../../../store/roots';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { TaxResponse } from '../../../models/api-models/Company';
import { UploadInput, UploadOutput } from 'ngx-uploader';
import { ToasterService } from '../../../services/toaster.service';
import { LEDGER_API } from '../../../services/apiurls/ledger.api';
import { ModalDirective } from 'ngx-bootstrap';
import { AccountService } from '../../../services/account.service';
import { ITransactionItem } from '../../../models/interfaces/ledger.interface';
import { filter, findIndex, last, orderBy } from 'lodash';
import { Select2OptionData } from '../../../shared/theme/select2/select2.interface';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flattenAccountsResultItem.interface';
import { LedgerActions } from '../../../services/actions/ledger/ledger.actions';
import { UpdateLedgerVm } from './updateLedger.vm';
import { Select2Component } from '../../../shared/theme/select2/select2.component';
import { IOption } from '../../../shared/theme/index';
import { UpdateLedgerDiscountComponent } from '../updateLedgerDiscount/updateLedgerDiscount.component';
import { SelectComponent } from '../../../shared/theme/ng-select/select.component';

@Component({
  selector: 'update-ledger-entry-panel',
  templateUrl: './updateLedgerEntryPanel.component.html',
  styleUrls: ['./updateLedgerEntryPanel.component.css']
})
export class UpdateLedgerEntryPanelComponent implements OnInit, OnDestroy {
  public vm: UpdateLedgerVm;
  @Output() public closeUpdateLedgerModal: EventEmitter<boolean> = new EventEmitter();
  @Output() public entryDeleted: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('deleteAttachedFileModal') public deleteAttachedFileModal: ModalDirective;
  @ViewChild('deleteEntryModal') public deleteEntryModal: ModalDirective;
  @ViewChild('discount') public discountComponent: UpdateLedgerDiscountComponent;
  public sessionKey$: Observable<string>;
  public companyName$: Observable<string>;
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
  public companyTaxesList$: Observable<TaxResponse[]>;
  public uploadInput: EventEmitter<UploadInput>;
  public selectedAccount: IFlattenAccountsResultItem = null;
  public isDeleteTrxEntrySuccess$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _ledgerService: LedgerService,
    private route: ActivatedRoute, private _toasty: ToasterService, private _accountService: AccountService,
    private _ledgerAction: LedgerActions) {
    this.entryUniqueName$ = this.store.select(p => p.ledger.selectedTxnForEditUniqueName).takeUntil(this.destroyed$);
    this.companyTaxesList$ = this.store.select(p => p.company.taxes).takeUntil(this.destroyed$);
    this.sessionKey$ = this.store.select(p => p.session.user.session.id).takeUntil(this.destroyed$);
    this.companyName$ = this.store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$);
    this.isDeleteTrxEntrySuccess$ = this.store.select(p => p.ledger.isDeleteTrxEntrySuccessfull).takeUntil(this.destroyed$);

    // get flatten_accounts list
    this._accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accountsArray: IOption[] = [];
        this.vm.flatternAccountList = data.body.results;
        data.body.results.map(acc => {
          if (acc.stocks) {
            acc.stocks.map(as => {
              accountsArray.push({
                value: acc.uniqueName,
                label: acc.name,
                additional: Object.assign({}, acc, { stock: as })
              });
            });
            accountsArray.push({ value: acc.uniqueName, label: acc.name, additional: acc });
          } else {
            accountsArray.push({ value: acc.uniqueName, label: acc.name, additional: acc });
          }
        });
        this.vm.flatternAccountList4Select = Observable.of(orderBy(accountsArray, 'text'));
      }
    });
  }

  public ngOnInit() {
    this.vm = new UpdateLedgerVm(this._toasty, this.discountComponent);
    this.vm.selectedLedger = new LedgerResponse();
    // TODO: save backup of response for future use
    // get Account name from url
    this.route.params.takeUntil(this.destroyed$).subscribe(params => {
      this.accountUniqueName = params['accountUniqueName'];
    });

    // emit upload event
    this.uploadInput = new EventEmitter<UploadInput>();

    //  get entry from server
    this.entryUniqueName$.subscribe(entryName => {
      if (entryName) {
        this._ledgerService.GetLedgerTransactionDetails(this.accountUniqueName, entryName).subscribe(resp => {
          if (resp.status === 'success') {
            this.vm.selectedLedger = resp.body;
            this.vm.selectedLedgerBackup = resp.body;
            if (this.vm.selectedLedger.total.type === 'DEBIT') {
              this.vm.selectedLedger.transactions.push(this.vm.blankTransactionItem('CREDIT'));
            } else {
              this.vm.selectedLedger.transactions.push(this.vm.blankTransactionItem('DEBIT'));
            }
            this.vm.getEntryTotal();
            this.vm.generatePanelAmount();
            this.vm.generateGrandTotal();
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
    let lastTxn = last(filter(this.vm.selectedLedger.transactions, p => p.type === type));
    if (txn.particular.uniqueName && lastTxn.particular.uniqueName) {
      this.vm.selectedLedger.transactions.push(this.vm.blankTransactionItem(type));
    }
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
        this.vm.selectedLedger.attachedFile = output.file.response.body.uniqueName;
        this.vm.selectedLedger.attachedFileName = output.file.response.body.name;
        this._toasty.successToast('file uploaded successfully');
      } else {
        this.isFileUploading = false;
        this.vm.selectedLedger.attachedFile = '';
        this.vm.selectedLedger.attachedFileName = '';
        this._toasty.errorToast(output.file.response.message);
      }
    }
  }

  public selectAccount(e: IOption, txn: ITransactionItem, selectCmp: SelectComponent) {
    if (!e.value) {
      // if there's no selected account set selectedAccount to null
      this.selectedAccount = null;
      txn.selectedAccount = null;
      // reset taxes and discount on selected account change
      // txn.tax = 0;
      // txn.taxes = [];
      // txn.discount = 0;
      // txn.discounts = [];
      return;
    } else {
      if (!this.vm.isValidEntry(e.value)) {
        selectCmp.clear();
        this.selectedAccount = null;
        txn.selectedAccount = null;
        return;
      }
    }

    if (e.additional.stock) {
      if (this.vm.isThereStockEntry()) {
        txn.particular.uniqueName = null;
        txn.particular.name = null;
        this.selectedAccount = null;
        txn.selectedAccount = null;
        this._toasty.warningToast('you can\'t add multiple stock entry');
      } else {
        this.selectedAccount = e.additional;
        txn.selectedAccount = e.additional;
      }
    } else {
      this.selectedAccount = e.additional;
      txn.selectedAccount = e.additional;
    }
    this.vm.onTxnAmountChange(txn);
  }
  public deSelectAccount(e: IOption, txn: ITransactionItem) {
    this.vm.discountArray.map(d => {
      if (d.particular === e.value) {
        d.amount = 0;
      }
    });
    this.discountComponent.change();
  }
  public showDeleteAttachedFileModal() {
    this.deleteAttachedFileModal.show();
  }

  public hideDeleteAttachedFileModal() {
    this.deleteAttachedFileModal.hide();
  }

  public showDeleteEntryModal() {
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
    this.vm.selectedLedger.attachedFile = '';
    this.vm.selectedLedger.attachedFileName = '';
    this.hideDeleteAttachedFileModal();
  }

  public ngOnDestroy(): void {
    this.vm.selectedLedger = null;
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

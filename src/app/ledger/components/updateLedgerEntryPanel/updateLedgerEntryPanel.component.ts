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
import { ILedgerTransactionItem, ITransactionItem } from '../../../models/interfaces/ledger.interface';
import { cloneDeep, filter, last, orderBy } from 'lodash';
import { LedgerActions } from '../../../services/actions/ledger/ledger.actions';
import { UpdateLedgerVm } from './updateLedger.vm';
import { IOption } from '../../../shared/theme/index';
import { UpdateLedgerDiscountComponent } from '../updateLedgerDiscount/updateLedgerDiscount.component';
import { SelectComponent } from '../../../shared/theme/ng-select/select.component';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { UpdateLedgerTaxData } from '../updateLedger-tax-control/updateLedger-tax-control.component';

@Component({
  selector: 'update-ledger-entry-panel',
  templateUrl: './updateLedgerEntryPanel.component.html',
  styleUrls: ['./updateLedgerEntryPanel.component.css']
})
export class UpdateLedgerEntryPanelComponent implements OnInit, OnDestroy {
  public vm: UpdateLedgerVm;
  @Output() public closeUpdateLedgerModal: EventEmitter<boolean> = new EventEmitter();
  @Output() public entryManipulated: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('deleteAttachedFileModal') public deleteAttachedFileModal: ModalDirective;
  @ViewChild('deleteEntryModal') public deleteEntryModal: ModalDirective;
  @ViewChild('discount') public discountComponent: UpdateLedgerDiscountComponent;
  public sessionKey$: Observable<string>;
  public companyName$: Observable<string>;
  public isFileUploading: boolean = false;
  public accountUniqueName: string;
  public entryUniqueName$: Observable<string>;
  public entryUniqueName: string;
  public companyTaxesList$: Observable<TaxResponse[]>;
  public uploadInput: EventEmitter<UploadInput>;
  public isDeleteTrxEntrySuccess$: Observable<boolean>;
  public isTxnUpdateInProcess$: Observable<boolean>;
  public isTxnUpdateSuccess$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _ledgerService: LedgerService,
    private route: ActivatedRoute, private _toasty: ToasterService, private _accountService: AccountService,
    private _ledgerAction: LedgerActions) {
    this.entryUniqueName$ = this.store.select(p => p.ledger.selectedTxnForEditUniqueName).takeUntil(this.destroyed$);
    this.companyTaxesList$ = this.store.select(p => p.company.taxes).takeUntil(this.destroyed$);
    this.sessionKey$ = this.store.select(p => p.session.user.session.id).takeUntil(this.destroyed$);
    this.companyName$ = this.store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$);
    this.isDeleteTrxEntrySuccess$ = this.store.select(p => p.ledger.isDeleteTrxEntrySuccessfull).takeUntil(this.destroyed$);
    this.isTxnUpdateInProcess$ = this.store.select(p => p.ledger.isTxnUpdateInProcess).takeUntil(this.destroyed$);
    this.isTxnUpdateSuccess$ = this.store.select(p => p.ledger.isTxnUpdateSuccess).takeUntil(this.destroyed$);
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
      this.entryUniqueName = entryName;
      if (entryName) {
        // get flatten_accounts list && get transactions list
        Observable.zip(this._accountService.GetFlattenAccounts('', ''), this._ledgerService.GetLedgerTransactionDetails(this.accountUniqueName, entryName))
          .subscribe((resp: Array<BaseResponse<any, any>>) => {
            //#region flattern group list assign process
            if (resp[0].status === 'success' && resp[1].status === 'success') {
              let accountsArray: IOption[] = [];
              this.vm.flatternAccountList = resp[0].body.results;
              resp[0].body.results.map(acc => {
                if (acc.stocks) {
                  acc.stocks.map(as => {
                    accountsArray.push({
                      value: `${acc.uniqueName}#${as.uniqueName}`,
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
              //#endregion
              //#region transaction assignment process
              this.vm.selectedLedger = resp[1].body;
              this.vm.selectedLedgerBackup = resp[1].body;

              this.vm.selectedLedger.transactions.map(t => {
                if (t.inventory) {
                  let findStocks = this.vm.flatternAccountList.find(f => f.uniqueName === t.particular.uniqueName);
                  if (findStocks) {
                    let findUnitRates = findStocks.stocks.find(s => s.uniqueName === t.inventory.stock.uniqueName);
                    if (findUnitRates) {
                      let tempUnitRates = findUnitRates.accountStockDetails.unitRates;
                      tempUnitRates.map(tmp => tmp.code = tmp.stockUnitCode);
                      t.unitRate = tempUnitRates;
                    }
                  }
                  t.particular.uniqueName = `${t.particular.uniqueName}#${t.inventory.stock.uniqueName}`;
                }
              });
              this.vm.isInvoiceGeneratedAlready = this.vm.selectedLedger.invoiceGenerated;
              if (this.vm.selectedLedger.total.type === 'DEBIT') {
                this.vm.selectedLedger.transactions.push(this.vm.blankTransactionItem('CREDIT'));
              } else {
                this.vm.selectedLedger.transactions.push(this.vm.blankTransactionItem('DEBIT'));
              }
              this.vm.showNewEntryPanel = (this.vm.isThereIncomeOrExpenseEntry() > 0 && this.vm.isThereIncomeOrExpenseEntry() < 2);
              this.vm.getEntryTotal();
              this.vm.generatePanelAmount();
              this.vm.generateGrandTotal();
              this.vm.generateCompoundTotal();
              //#endregion
            }
          });
      }
    });

    // check if delete entry is success
    this.isDeleteTrxEntrySuccess$.subscribe(del => {
      if (del) {
        this.hideDeleteEntryModal();
        this.entryManipulated.emit(true);
      }
    });

    // chek if update entry is success
    this.isTxnUpdateSuccess$.subscribe(upd => {
      if (upd) {
        this.entryManipulated.emit(true);
      }
    });
  }

  public addBlankTrx(type: string = 'DEBIT', txn: ILedgerTransactionItem, event: Event) {
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

  public selectAccount(e: IOption, txn: ILedgerTransactionItem, selectCmp: SelectComponent) {
    if (!e.value) {
      // if there's no selected account set selectedAccount to null
      txn.selectedAccount = null;
      return;
    } else {
      // check if txn.selectedAccount is aleready set so it means account name is changed without firing deselect event
      if (txn.selectedAccount) {
        // check if discount is added and update component as needed
        this.vm.discountArray.map(d => {
          if (d.particular === txn.selectedAccount.uniqueName) {
            d.amount = 0;
          }
        });
        if (this.discountComponent) {
          this.discountComponent.genTotal();
        }
      }
      // if ther's stock entry
      if (e.additional.stock) {
        // check if we aleready have stock entry
        if (this.vm.isThereStockEntry()) {
          selectCmp.clear();
          txn.particular.uniqueName = null;
          txn.particular.name = null;
          txn.selectedAccount = null;
          this._toasty.warningToast('you can\'t add multiple stock entry');
          return;
        } else {
          // add unitArrys in txn for stock entry
          txn.selectedAccount = e.additional;
          let rate = 0;
          let unitCode = '';
          let unitName = '';
          let stockName = '';
          let stockUniqueName = '';
          let unitArray = [];
          let defaultUnit = {
            stockUnitCode: e.additional.stock.stockUnit.name,
            code: e.additional.stock.stockUnit.code,
            rate: 0
          };
          if (e.additional.stock.accountStockDetails && e.additional.stock.accountStockDetails.unitRates) {
            let cond = e.additional.stock.accountStockDetails.unitRates.find(p => p.stockUnitCode === e.additional.stock.stockUnit.code);
            if (cond) {
              defaultUnit.rate = cond.rate;
              rate = defaultUnit.rate;
            }
            unitArray = unitArray.concat(e.additional.stock.accountStockDetails.unitRates.map(p => {
              return {
                stockUnitCode: p.stockUnitCode,
                code: p.stockUnitCode,
                rate: p.rate
              };
            }));
            if (unitArray.findIndex(p => p.code === defaultUnit.code) === -1) {
              unitArray.push(defaultUnit);
            }
          } else {
            unitArray.push(defaultUnit);
          }
          txn.unitRate = unitArray;
          stockName = e.additional.stock.name;
          stockUniqueName = e.additional.stock.uniqueName;
          unitName = e.additional.stock.stockUnit.name;
          unitCode = e.additional.stock.stockUnit.code;

          if (stockName && stockUniqueName) {
            txn.inventory = {
              stock: {
                name: stockName,
                uniqueName: stockUniqueName,
              },
              quantity: 1,
              unit: {
                stockUnitCode: unitCode,
                code: unitCode,
                rate
              },
              amount: 0,
              rate
            };
          }
          if (rate > 0 && txn.amount === 0) {
            txn.amount = rate;
          }
        }
      } else {
        // directly assign additional property
        txn.selectedAccount = e.additional;
      }
      // check if need to showEntryPanel
      this.vm.showNewEntryPanel = (this.vm.isThereIncomeOrExpenseEntry() > 0 && this.vm.isThereIncomeOrExpenseEntry() < 2);
      this.vm.onTxnAmountChange(txn);
    }
  }
  public deSelectAccount(e: IOption, txn: ITransactionItem) {
    // set deselected transaction = undefined for manually cleanup
    this.vm.selectedLedger.transactions.map(t => {
      if (t.particular.uniqueName === e.value) {
        t.inventory = null;
        t.particular.name = undefined;
        t.particular.uniqueName = undefined;
      }
    });
    // check if need to showEntryPanel
    this.vm.showNewEntryPanel = (this.vm.isThereIncomeOrExpenseEntry() > 0 && this.vm.isThereIncomeOrExpenseEntry() < 2);
    // set discount amount to 0 when deselected account is type of discount category
    if (this.discountComponent) {
      this.vm.discountArray.map(d => {
        if (d.particular === e.value) {
          d.amount = 0;
        }
      });
      this.discountComponent.genTotal();
    }
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

  public saveLedgerTransaction() {
    let requestObj: LedgerResponse = cloneDeep(this.vm.selectedLedger);
    let taxes: UpdateLedgerTaxData[] = cloneDeep(this.vm.selectedTaxes);
    requestObj.voucherType = requestObj.voucher.shortCode;
    requestObj.transactions = requestObj.transactions.filter(p => p.particular.uniqueName);
    requestObj.transactions.map(trx => {
      if (trx.inventory && trx.inventory.stock) {
        trx.particular.uniqueName = trx.particular.uniqueName.split('#')[0];
      }
    });
    requestObj.taxes = taxes.map(t => t.particular.uniqueName);
    this.store.dispatch(this._ledgerAction.updateTxnEntry(requestObj, this.accountUniqueName, this.entryUniqueName));
  }
  public ngOnDestroy(): void {
    this.store.dispatch(this._ledgerAction.ResetUpdateLedger());
    this.vm.resetVM();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

import { combineLatest as observableCombineLatest, Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { shareReplay, take, takeUntil } from 'rxjs/operators';
import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { DownloadLedgerRequest, LedgerResponse } from '../../../models/api-models/Ledger';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { TaxResponse } from '../../../models/api-models/Company';
import { UploaderOptions, UploadInput, UploadOutput } from 'ngx-uploader';
import { ToasterService } from '../../../services/toaster.service';
import { LEDGER_API } from '../../../services/apiurls/ledger.api';
import { ModalDirective } from 'ngx-bootstrap';
import { AccountService } from '../../../services/account.service';
import { ILedgerTransactionItem } from '../../../models/interfaces/ledger.interface';
import { filter, last, orderBy } from '../../../lodash-optimized';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';
import { UpdateLedgerVm } from './updateLedger.vm';
import { UpdateLedgerDiscountComponent } from '../updateLedgerDiscount/updateLedgerDiscount.component';
import { AccountResponse } from '../../../models/api-models/Account';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flattenAccountsResultItem.interface';
import { base64ToBlob } from '../../../shared/helpers/helperFunctions';
import { saveAs } from 'file-saver';
import { LoaderService } from '../../../loader/loader.service';
import { Configuration } from 'app/app.constant';
import { IFlattenGroupsAccountsDetail } from 'app/models/interfaces/flattenGroupsAccountsDetail.interface';
import { createSelector } from 'reselect';
import { TagRequest } from '../../../models/api-models/settingsTags';
import { SettingsTagActions } from '../../../actions/settings/tag/settings.tag.actions';

@Component({
  selector: 'update-ledger-entry-panel',
  templateUrl: './updateLedgerEntryPanel.component.html',
  styleUrls: ['./updateLedgerEntryPanel.component.css']
})
export class UpdateLedgerEntryPanelComponent implements OnInit, AfterViewInit, OnDestroy {
  public vm: UpdateLedgerVm;
  @Output() public closeUpdateLedgerModal: EventEmitter<boolean> = new EventEmitter();
  @Output() public showQuickAccountModalFromUpdateLedger: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('deleteAttachedFileModal') public deleteAttachedFileModal: ModalDirective;
  @ViewChild('deleteEntryModal') public deleteEntryModal: ModalDirective;
  @ViewChild('updateTaxModal') public updateTaxModal: ModalDirective;
  @ViewChild('discount') public discountComponent: UpdateLedgerDiscountComponent;
  public tags$: Observable<TagRequest[]>;
  public sessionKey$: Observable<string>;
  public companyName$: Observable<string>;
  public isFileUploading: boolean = false;
  public accountUniqueName: string;
  public entryUniqueName$: Observable<string>;
  public editAccUniqueName$: Observable<string>;
  public entryUniqueName: string;
  public companyTaxesList$: Observable<TaxResponse[]>;
  public uploadInput: EventEmitter<UploadInput>;
  public fileUploadOptions: UploaderOptions;
  public isDeleteTrxEntrySuccess$: Observable<boolean>;
  public isTxnUpdateInProcess$: Observable<boolean>;
  public isTxnUpdateSuccess$: Observable<boolean>;
  public flattenAccountListStream$: Observable<IFlattenAccountsResultItem[]>;
  public selectedLedgerStream$: Observable<LedgerResponse>;
  public activeAccount$: Observable<AccountResponse>;
  public discountAccountsList$: Observable<IFlattenGroupsAccountsDetail>;
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public showAdvanced: boolean;
  public currentAccountApplicableTaxes: string[] = [];
  public isMultiCurrencyAvailable: boolean = false;
  public baseCurrency: string = null;
  public existingTaxTxn: any[] = [];
  public baseAccount$: Observable<any> = observableOf(null);

  constructor(private store: Store<AppState>, private _ledgerService: LedgerService,
              private _toasty: ToasterService, private _accountService: AccountService,
              private _ledgerAction: LedgerActions, private _loaderService: LoaderService,
              private _settingsTagActions: SettingsTagActions) {
    this.entryUniqueName$ = this.store.select(p => p.ledger.selectedTxnForEditUniqueName).pipe(takeUntil(this.destroyed$));
    this.editAccUniqueName$ = this.store.select(p => p.ledger.selectedAccForEditUniqueName).pipe(takeUntil(this.destroyed$));
    this.selectedLedgerStream$ = this.store.select(p => p.ledger.transactionDetails).pipe(takeUntil(this.destroyed$));
    this.flattenAccountListStream$ = this.store.select(p => p.general.flattenAccounts).pipe(takeUntil(this.destroyed$));
    this.companyTaxesList$ = this.store.select(p => p.company.taxes).pipe(takeUntil(this.destroyed$));
    this.sessionKey$ = this.store.select(p => p.session.user.session.id).pipe(takeUntil(this.destroyed$));
    this.companyName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
    this.isDeleteTrxEntrySuccess$ = this.store.select(p => p.ledger.isDeleteTrxEntrySuccessfull).pipe(takeUntil(this.destroyed$));
    this.isTxnUpdateInProcess$ = this.store.select(p => p.ledger.isTxnUpdateInProcess).pipe(takeUntil(this.destroyed$));
    this.isTxnUpdateSuccess$ = this.store.select(p => p.ledger.isTxnUpdateSuccess).pipe(takeUntil(this.destroyed$));
    this.discountAccountsList$ = this.store.select(p => p.ledger.discountAccountsList).pipe(takeUntil(this.destroyed$), shareReplay());
    this.closeUpdateLedgerModal.pipe(takeUntil(this.destroyed$));
    this.store.dispatch(this._settingsTagActions.GetALLTags());
  }

  public ngOnInit() {

    this.showAdvanced = false;
    this.vm = new UpdateLedgerVm();
    this.vm.selectedLedger = new LedgerResponse();

    this.tags$ = this.store.select(createSelector([(state: AppState) => state.settings.tags], (tags) => {
      if (tags && tags.length) {
        _.map(tags, (tag) => {
          tag.label = tag.name;
          tag.value = tag.name;
        });
        return _.orderBy(tags, 'name');
      }
    })).pipe(takeUntil(this.destroyed$));

    // get enetry name and ledger account uniquename
    observableCombineLatest(this.entryUniqueName$, this.editAccUniqueName$).subscribe((resp: any[]) => {
      if (resp[0] && resp[1]) {
        this.entryUniqueName = resp[0];
        this.accountUniqueName = resp[1];
        this.store.dispatch(this._ledgerAction.getLedgerTrxDetails(this.accountUniqueName, this.entryUniqueName));
      }
    });

    // emit upload event
    this.uploadInput = new EventEmitter<UploadInput>();
    // set file upload options
    this.fileUploadOptions = {concurrency: 0};

    // get flatten_accounts list && get transactions list && get ledger account list
    observableCombineLatest(this.flattenAccountListStream$, this.selectedLedgerStream$, this._accountService.GetAccountDetailsV2(this.accountUniqueName))
      .subscribe((resp: any[]) => {
        if (resp[0] && resp[1] && resp[2].status === 'success') {
          //#region flattern group list assign process

          let stockListFormFlattenAccount: IFlattenAccountsResultItem;
          if (resp[0]) {
            stockListFormFlattenAccount = resp[0].find((acc) => acc.uniqueName === resp[2].body.uniqueName);
          }

          this.vm.flatternAccountList = resp[0];
          this.activeAccount$ = observableOf(resp[2].body);
          let accountDetails: AccountResponse = resp[2].body;

          this.activeAccount$.subscribe((acc) => {
            if (acc && acc.currency && this.isMultiCurrencyAvailable) {
              this.baseCurrency = acc.currency;
            }
          });

          // check if current account category is type 'income' or 'expenses'
          let parentAcc = accountDetails.parentGroups[0].uniqueName;
          let incomeAccArray = ['revenuefromoperations', 'otherincome'];
          let expensesAccArray = ['operatingcost', 'indirectexpenses'];
          let incomeAndExpensesAccArray = [...incomeAccArray, ...expensesAccArray];

          if (incomeAndExpensesAccArray.indexOf(parentAcc) > -1) {
            let appTaxes = [];
            accountDetails.applicableTaxes.forEach(app => appTaxes.push(app.uniqueName));
            this.currentAccountApplicableTaxes = appTaxes;
          }
          //    this.vm.getUnderstandingText(accountDetails.accountType, accountDetails.name);

          this.vm.getUnderstandingText(resp[1].particularType, resp[1].particular.name);

          // check if account is stockable
          let isStockableAccount = accountDetails.uniqueName !== 'roundoff' ? incomeAndExpensesAccArray.indexOf(parentAcc) > -1 : false;
          // (parentOfAccount.uniqueName === 'revenuefromoperations' || parentOfAccount.uniqueName === 'otherincome' ||
          //   parentOfAccount.uniqueName === 'operatingcost' || parentOfAccount.uniqueName === 'indirectexpenses') : false;

          let accountsArray: IOption[] = [];
          if (isStockableAccount) {
            // stocks from ledger account
            resp[0].map(acc => {
              // normal entry
              accountsArray.push({value: acc.uniqueName, label: acc.name, additional: acc});

              // normal merge account entry
              if (acc.mergedAccounts && acc.mergedAccounts !== '') {
                let mergeAccs = acc.mergedAccounts.split(',');
                mergeAccs.map(m => m.trim()).forEach(ma => {
                  accountsArray.push({
                    value: ma,
                    label: ma,
                    additional: acc
                  });
                });
              }

              // check if taxable or roundoff account then don't assign stocks
              let notRoundOff = acc.uniqueName === 'roundoff';
              let isTaxAccount = acc.uNameStr.indexOf('dutiestaxes') > -1;
              if (!isTaxAccount && !notRoundOff && stockListFormFlattenAccount && stockListFormFlattenAccount.stocks) {
                stockListFormFlattenAccount.stocks.map(as => {
                  // stock entry
                  accountsArray.push({
                    value: `${acc.uniqueName}#${as.uniqueName}`,
                    label: acc.name + '(' + as.uniqueName + ')',
                    additional: Object.assign({}, acc, {stock: as})
                  });
                  // normal merge account entry
                  if (acc.mergedAccounts && acc.mergedAccounts !== '') {
                    let mergeAccs = acc.mergedAccounts.split(',');
                    mergeAccs.map(m => m.trim()).forEach(ma => {
                      accountsArray.push({
                        value: `${ma}#${as.uniqueName}`,
                        label: ma + '(' + as.uniqueName + ')',
                        additional: Object.assign({}, acc, {stock: as})
                      });
                    });
                  }
                });
              }

            });
            // accountsArray = uniqBy(accountsArray, 'value');
          } else {
            resp[0].map(acc => {
              if (acc.stocks) {
                acc.stocks.map(as => {
                  accountsArray.push({
                    value: `${acc.uniqueName}#${as.uniqueName}`,
                    label: `${acc.name} (${as.uniqueName})`,
                    additional: Object.assign({}, acc, {stock: as})
                  });
                });
                accountsArray.push({value: acc.uniqueName, label: acc.name, additional: acc});
              } else {
                accountsArray.push({value: acc.uniqueName, label: acc.name, additional: acc});
              }
              // normal merge account entry
              if (acc.mergedAccounts && acc.mergedAccounts !== '') {
                let mergeAccs = acc.mergedAccounts.split(',');
                mergeAccs.map(m => m.trim()).forEach(ma => {
                  accountsArray.push({
                    value: ma,
                    label: ma,
                    additional: acc
                  });
                });
              }
            });
            // accountsArray = uniqBy(accountsArray, 'value');
          }
          this.vm.flatternAccountList4Select = observableOf(orderBy(accountsArray, 'text'));
          //#endregion
          //#region transaction assignment process
          this.vm.selectedLedger = resp[1];
          this.vm.selectedLedgerBackup = resp[1];
          this.baseAccount$ = observableOf(resp[1].particular);

          this.vm.selectedLedger.transactions.map(t => {
            if (!this.isMultiCurrencyAvailable) {
              this.isMultiCurrencyAvailable = !!t.convertedAmountCurrency;
            }
            if (t.inventory) {
              let findStocks = accountsArray.find(f => f.value === t.particular.uniqueName + '#' + t.inventory.stock.uniqueName);
              if (findStocks) {
                let findUnitRates = findStocks.additional.stock;
                if (findUnitRates && findUnitRates.accountStockDetails && findUnitRates.accountStockDetails.unitRates.length) {
                  let tempUnitRates = findUnitRates.accountStockDetails.unitRates;
                  tempUnitRates.map(tmp => tmp.code = tmp.stockUnitCode);
                  t.unitRate = tempUnitRates;
                } else {
                  t.unitRate = [{
                    code: t.inventory.unit.code,
                    rate: t.inventory.rate,
                    stockUnitCode: t.inventory.unit.code
                  }];
                }
              } else {
                t.unitRate = [{
                  code: t.inventory.unit.code,
                  rate: t.inventory.rate,
                  stockUnitCode: t.inventory.unit.code
                }];
              }
              t.particular.uniqueName = `${t.particular.uniqueName}#${t.inventory.stock.uniqueName}`;
            }
          });
          this.vm.isInvoiceGeneratedAlready = this.vm.selectedLedger.voucherGenerated;

          this.vm.selectedLedger.transactions.push(this.vm.blankTransactionItem('CREDIT'));
          this.vm.selectedLedger.transactions.push(this.vm.blankTransactionItem('DEBIT'));

          let incomeExpenseEntryLength = this.vm.isThereIncomeOrExpenseEntry();
          this.vm.showNewEntryPanel = (incomeExpenseEntryLength > 0 && incomeExpenseEntryLength < 2);
          this.vm.getEntryTotal();
          this.vm.reInitilizeDiscount();
          this.vm.generatePanelAmount();
          this.vm.generateGrandTotal();
          this.vm.generateCompoundTotal();
          this.existingTaxTxn = _.filter(this.vm.selectedLedger.transactions, (o) => o.isTax);
          //#endregion
        }
      });

    // check if delete entry is success
    this.isDeleteTrxEntrySuccess$.subscribe(del => {
      if (del) {
        this.store.dispatch(this._ledgerAction.resetDeleteTrxEntryModal());
        this.closeUpdateLedgerModal.emit(true);
      }
    });

    // check if update entry is success
    this.isTxnUpdateSuccess$.subscribe(upd => {
      if (upd) {
        this.store.dispatch(this._ledgerAction.ResetUpdateLedger());
        // this.closeUpdateLedgerModal.emit(true);
      }
    });
  }

  public ngAfterViewInit() {
    this.vm.discountComponent = this.discountComponent;
  }

  public addBlankTrx(type: string = 'DEBIT', txn: ILedgerTransactionItem, event: Event) {
    let isMultiCurrencyAvailable: boolean = false;
    if (txn.selectedAccount && txn.selectedAccount.currency) {
      this.activeAccount$.pipe(take(1)).subscribe((acc) => {
        if (acc.currency !== txn.selectedAccount.currency) {
          this.isMultiCurrencyAvailable = true;
          isMultiCurrencyAvailable = true;
          this.baseCurrency = acc.currency;
        }
      });
    }
    if (Number(txn.amount) === 0) {
      txn.amount = undefined;
    }
    let lastTxn = last(filter(this.vm.selectedLedger.transactions, p => p.type === type));
    if (txn.particular.uniqueName && lastTxn.particular.uniqueName) {
      let blankTrxnRow = this.vm.blankTransactionItem(type);
      if (isMultiCurrencyAvailable) {
        blankTrxnRow.convertedAmount = null;
        blankTrxnRow.convertedAmountCurrency = null;
      }
      this.vm.selectedLedger.transactions.push(blankTrxnRow);
    }
  }

  public onUploadOutputUpdate(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
      let sessionKey = null;
      let companyUniqueName = null;
      this.sessionKey$.pipe(take(1)).subscribe(a => sessionKey = a);
      this.companyName$.pipe(take(1)).subscribe(a => companyUniqueName = a);
      const event: UploadInput = {
        type: 'uploadAll',
        url: Configuration.ApiUrl + LEDGER_API.UPLOAD_FILE.replace(':companyUniqueName', companyUniqueName),
        method: 'POST',
        fieldName: 'file',
        data: {company: companyUniqueName},
        headers: {'Session-Id': sessionKey},
      };
      this.uploadInput.emit(event);
    } else if (output.type === 'start') {
      this.isFileUploading = true;
      this._loaderService.show();
    } else if (output.type === 'done') {
      this._loaderService.hide();
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

  public selectAccount(e: IOption, txn: ILedgerTransactionItem, selectCmp: ShSelectComponent) {
    if (!e.value) {
      // if there's no selected account set selectedAccount to null
      txn.selectedAccount = null;
      txn.inventory = null;
      txn.particular.name = undefined;
      // check if need to showEntryPanel
      let incomeExpenseEntryLength = this.vm.isThereIncomeOrExpenseEntry();
      this.vm.showNewEntryPanel = (incomeExpenseEntryLength > 0 && incomeExpenseEntryLength < 2);
      // set discount amount to 0 when deselected account is type of discount category
      if (this.discountComponent) {
        this.vm.reInitilizeDiscount();
      }
      return;
    } else {
      if (!txn.isUpdated) {
        if (this.vm.selectedLedger.taxes.length && !txn.isTax) {
          txn.isUpdated = true;
        }
      }
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
        if (this.vm.isThereStockEntry(e.value)) {
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
      let incomeExpenseEntryLength = this.vm.isThereIncomeOrExpenseEntry();
      this.vm.showNewEntryPanel = (incomeExpenseEntryLength > 0 && incomeExpenseEntryLength < 2);
      this.vm.reInitilizeDiscount();
      this.vm.onTxnAmountChange(txn);
    }
  }

  public onTxnAmountChange(txn) {
    if (!txn.selectedAccount) {
      this.vm.flatternAccountList4Select.pipe(take(1)).subscribe((accounts) => {
        if (accounts && accounts.length) {
          let selectedAcc = accounts.find(acc => acc.value === txn.particular.uniqueName);
          if (selectedAcc) {
            txn.selectedAccount = selectedAcc.additional;
          }
        }
      });
    }

    txn.isUpdated = true;
    let currencyFound: boolean = false;
    let ref = this.activeAccount$.subscribe((acc) => {
      if (acc && acc.currency && !currencyFound) {
        // Arpit: Sagar told to remove in update case
        // this.calculateConversionRate(acc.currency, txn.selectedAccount.currency, txn.amount, txn);
        this.vm.onTxnAmountChange(txn);
        currencyFound = true;
      }
    });
    if (currencyFound) {
      ref.unsubscribe();
    }
  }

  /**
   * calculateConversionRate
   */
  public calculateConversionRate(baseCurr, convertTo, amount, obj): any {
    if (baseCurr && convertTo) {
      this._ledgerService.GetCurrencyRate(baseCurr, convertTo).subscribe((res: any) => {
        let rate = res.body;
        if (rate) {
          obj.convertedAmount = amount * rate;
          obj.convertedAmountCurrency = convertTo;
          return obj;
        }
      });
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

  public showUpdateTaxModal() {
    this.updateTaxModal.show();
  }

  public updateTaxes() {
    this.updateTaxModal.hide();
    let requestObj: LedgerResponse = this.vm.prepare4Submit();
    requestObj.transactions = requestObj.transactions.filter(tx => !tx.isTax);
    this.store.dispatch(this._ledgerAction.updateTxnEntry(requestObj, this.accountUniqueName, this.entryUniqueName));
  }

  public hideUpdateTaxModal() {
    this.updateTaxModal.hide();

    let requestObj: LedgerResponse = this.vm.prepare4Submit();
    requestObj.taxes = [];
    this.store.dispatch(this._ledgerAction.updateTxnEntry(requestObj, this.accountUniqueName, this.entryUniqueName));
  }

  public deleteTrxEntry() {
    let entryName: string = null;
    this.entryUniqueName$.pipe(take(1)).subscribe(en => entryName = en);
    this.store.dispatch(this._ledgerAction.deleteTrxEntry(this.accountUniqueName, entryName));
    this.hideDeleteEntryModal();
  }

  public deleteAttachedFile() {
    this.vm.selectedLedger.attachedFile = '';
    this.vm.selectedLedger.attachedFileName = '';
    this.hideDeleteAttachedFileModal();
  }

  public saveLedgerTransaction() {
    let requestObj: LedgerResponse = this.vm.prepare4Submit();
    let isThereUpdatedEntry = requestObj.transactions.find(t => t.isUpdated);
    // if their's any changes
    if (isThereUpdatedEntry && requestObj.taxes && requestObj.taxes.length) {
      this.showUpdateTaxModal();
    } else {
      // remove taxes entry
      _.remove(requestObj.transactions, (obj) => {
        if (obj.isTax) {
          let taxTxn = _.find(this.existingTaxTxn, (o) => obj.particular.uniqueName === o.particular.uniqueName);
          if (taxTxn) {
            return obj;
          }
        }
      });
      // if their's no change fire action straightaway
      this.store.dispatch(this._ledgerAction.updateTxnEntry(requestObj, this.accountUniqueName, this.entryUniqueName));
    }
  }

  public ngOnDestroy(): void {
    this.vm.resetVM();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public downloadAttachedFile(fileName: string, e: Event) {
    e.stopPropagation();
    this._ledgerService.DownloadAttachement(fileName).subscribe(d => {
      if (d.status === 'success') {
        let blob = base64ToBlob(d.body.uploadedFile, `image/${d.body.fileType}`, 512);
        return saveAs(blob, d.body.name);
      } else {
        this._toasty.errorToast(d.message);
      }
    });
  }

  public downloadInvoice(invoiceName: string, voucherType: string, e: Event) {
    e.stopPropagation();
    let activeAccount = null;
    this.activeAccount$.pipe(take(1)).subscribe(p => activeAccount = p);
    let downloadRequest = new DownloadLedgerRequest();
    downloadRequest.invoiceNumber = [invoiceName];
    downloadRequest.voucherType = voucherType;

    this._ledgerService.DownloadInvoice(downloadRequest, activeAccount.uniqueName).subscribe(d => {
      if (d.status === 'success') {
        let blob = base64ToBlob(d.body, 'application/pdf', 512);
        return saveAs(blob, `${activeAccount.name} - ${invoiceName}.pdf`);
      } else {
        this._toasty.errorToast(d.message);
      }
    });
  }

  public showQuickAccountModal() {
    this.showQuickAccountModalFromUpdateLedger.emit(true);
  }
}

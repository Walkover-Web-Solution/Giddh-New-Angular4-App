import { BehaviorSubject, Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { take, takeUntil } from 'rxjs/operators';
import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AppState } from '../../../store';
import { select, Store } from '@ngrx/store';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';
import { BlankLedgerVM, TransactionVM } from '../../ledger.vm';
import { CompanyActions } from '../../../actions/company.actions';
import { TaxResponse } from '../../../models/api-models/Company';
import { UploaderOptions, UploadInput, UploadOutput } from 'ngx-uploader';
import { LEDGER_API } from '../../../services/apiurls/ledger.api';
import { ToasterService } from '../../../services/toaster.service';
import { ModalDirective } from 'ngx-bootstrap';
import { LedgerDiscountComponent } from '../ledgerDiscount/ledgerDiscount.component';
import { TaxControlComponent } from '../../../theme/tax-control/tax-control.component';
import { LedgerService } from '../../../services/ledger.service';
import { ReconcileRequest, ReconcileResponse } from '../../../models/api-models/Ledger';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { cloneDeep, forEach, sumBy } from '../../../lodash-optimized';
import { ILedgerTransactionItem } from '../../../models/interfaces/ledger.interface';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { LoaderService } from '../../../loader/loader.service';
import { AccountResponse } from 'app/models/api-models/Account';
import { Configuration } from 'app/app.constant';
import { SettingsTagActions } from '../../../actions/settings/tag/settings.tag.actions';
import { createSelector } from 'reselect';
import { TagRequest } from '../../../models/api-models/settingsTags';
import { AdvanceSearchRequest } from '../../../models/interfaces/AdvanceSearchRequest';
import { SettingsProfileActions } from '../../../actions/settings/profile/settings.profile.action';
import { IDiscountList } from '../../../models/api-models/SettingsDiscount';

@Component({
  selector: 'new-ledger-entry-panel',
  templateUrl: 'newLedgerEntryPanel.component.html',
  styleUrls: ['./newLedgerEntryPanel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NewLedgerEntryPanelComponent implements OnInit, OnDestroy, OnChanges, AfterViewChecked, AfterViewInit {
  @Input() public blankLedger: BlankLedgerVM;
  @Input() public currentTxn: TransactionVM = null;
  @Input() public needToReCalculate: BehaviorSubject<boolean>;
  @Input() public showTaxationDiscountBox: boolean = true;
  @Input() public isBankTransaction: boolean = false;
  @Input() public trxRequest: AdvanceSearchRequest;
  @Input() public invoiceList: any[];
  public isAmountFirst: boolean = false;
  public isTotalFirts: boolean = false;
  public selectedInvoices: string[] = [];
  @Output() public changeTransactionType: EventEmitter<string> = new EventEmitter();
  @Output() public resetBlankLedger: EventEmitter<boolean> = new EventEmitter();
  @Output() public saveBlankLedger: EventEmitter<boolean> = new EventEmitter();
  @Output() public clickedOutsideEvent: EventEmitter<any> = new EventEmitter();
  @Output() public clickUnpaidInvoiceList: EventEmitter<any> = new EventEmitter();
  @ViewChild('entryContent') public entryContent: ElementRef;
  @ViewChild('sh') public sh: ShSelectComponent;

  @ViewChild('deleteAttachedFileModal') public deleteAttachedFileModal: ModalDirective;
  @ViewChild('discount') public discountControl: LedgerDiscountComponent;
  @ViewChild('tax') public taxControll: TaxControlComponent;
  public uploadInput: EventEmitter<UploadInput>;
  public fileUploadOptions: UploaderOptions;
  public discountAccountsList$: Observable<IDiscountList[]>;
  public companyTaxesList$: Observable<TaxResponse[]>;
  public sessionKey$: Observable<string>;
  public companyName$: Observable<string>;
  public voucherTypeList: Observable<IOption[]>;
  public showAdvanced: boolean;
  public dateMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public isFileUploading: boolean = false;
  public isLedgerCreateInProcess$: Observable<boolean>;
  // bank map eledger related
  @ViewChild('confirmBankTxnMapModal') public confirmBankTxnMapModal: ModalDirective;
  public matchingEntriesData: ReconcileResponse[] = [];
  public showMatchingEntries: boolean = false;
  public mapBodyContent: string;
  public selectedItemToMap: ReconcileResponse;
  public tags$: Observable<TagRequest[]>;
  public activeAccount$: Observable<AccountResponse>;
  public currentAccountApplicableTaxes: string[] = [];
  public isMulticurrency: boolean;
  public accountBaseCurrency: string;
  public companyCurrency: string;
  public totalForTax: number = 0;
  public taxListForStock = []; // New
  public companyIsMultiCurrency: boolean;

  // private below
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  private currentBaseCurrency: string;
  private currencyRateResponse: any;
  private fetchedBaseCurrency: string = null;
  private fetchedConvertToCurrency: string = null;
  private fetchedConvertedRate: number = null;

  constructor(private store: Store<AppState>,
              private _ledgerService: LedgerService,
              private _ledgerActions: LedgerActions,
              private _companyActions: CompanyActions,
              private cdRef: ChangeDetectorRef,
              private _toasty: ToasterService,
              private _loaderService: LoaderService,
              private _settingsTagActions: SettingsTagActions,
              private _settingsProfileActions: SettingsProfileActions) {
    this.store.dispatch(this._settingsTagActions.GetALLTags());
    this.discountAccountsList$ = this.store.select(p => p.settings.discount.discountList).pipe(takeUntil(this.destroyed$));
    this.companyTaxesList$ = this.store.select(p => p.company.taxes).pipe(takeUntil(this.destroyed$));
    this.sessionKey$ = this.store.select(p => p.session.user.session.id).pipe(takeUntil(this.destroyed$));
    this.companyName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
    this.activeAccount$ = this.store.select(p => p.ledger.account).pipe(takeUntil(this.destroyed$));
    this.isLedgerCreateInProcess$ = this.store.select(p => p.ledger.ledgerCreateInProcess).pipe(takeUntil(this.destroyed$));
    this.voucherTypeList = observableOf([{
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

  public ngOnInit() {
    this.showAdvanced = false;
    this.uploadInput = new EventEmitter<UploadInput>();
    this.fileUploadOptions = {concurrency: 0};
    this.activeAccount$.subscribe(acc => {
      //   console.log('activeAccount...');
      if (acc) {
        let parentAcc = acc.parentGroups[0].uniqueName;
        let incomeAccArray = ['revenuefromoperations', 'otherincome'];
        let expensesAccArray = ['operatingcost', 'indirectexpenses'];
        let assetsAccArray = ['assets'];
        let incomeAndExpensesAccArray = [...incomeAccArray, ...expensesAccArray, ...assetsAccArray];
        if (incomeAndExpensesAccArray.indexOf(parentAcc) > -1) {
          let appTaxes = [];
          acc.applicableTaxes.forEach(app => appTaxes.push(app.uniqueName));
          this.currentAccountApplicableTaxes = appTaxes;
        }
        if (acc.currency) {
          this.accountBaseCurrency = acc.currency;
        }
        this.store.select(p => p.settings.profile).pipe(takeUntil(this.destroyed$)).subscribe((o) => {
          if (!_.isEmpty(o)) {
            let companyProfile = _.cloneDeep(o);
            if (companyProfile.isMultipleCurrency && !acc.currency) {
              this.accountBaseCurrency = companyProfile.baseCurrency || 'INR';
            }
            this.companyCurrency = companyProfile.baseCurrency || 'INR';
          } else {
            this.store.dispatch(this._settingsProfileActions.GetProfileInfo());
          }
        });
      }
    });

    this.tags$ = this.store.select(createSelector([(state: AppState) => state.settings.tags], (tags) => {
      if (tags && tags.length) {
        _.map(tags, (tag) => {
          tag.label = tag.name;
          tag.value = tag.name;
        });
        return _.orderBy(tags, 'name');
      }
    })).pipe(takeUntil(this.destroyed$));

    this.store.pipe(select(s => s.settings.profile), takeUntil(this.destroyed$)).subscribe(s => {
      if (s) {
        this.companyIsMultiCurrency = s.isMultipleCurrency;
      } else {
        this.companyIsMultiCurrency = false;
      }
    });
  }

  @HostListener('click', ['$event'])
  public clicked(e) {
    if (this.sh && !this.sh.ele.nativeElement.contains(e.path[3])) {
      this.sh.hide();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.currentTxn && this.currentTxn.selectedAccount) {
      if (this.currentTxn.selectedAccount.stock && this.currentTxn.selectedAccount.stock.stockTaxes && this.currentTxn.selectedAccount.stock.stockTaxes.length) {
        this.taxListForStock = this.currentTxn.selectedAccount.stock.stockTaxes;
      } else if (this.currentTxn.selectedAccount.parentGroups && this.currentTxn.selectedAccount.parentGroups.length) {
        let parentAcc = this.currentTxn.selectedAccount.parentGroups[0].uniqueName;
        let incomeAccArray = ['revenuefromoperations', 'otherincome'];
        let expensesAccArray = ['operatingcost', 'indirectexpenses'];
        let assetsAccArray = ['assets'];
        let incomeAndExpensesAccArray = [...incomeAccArray, ...expensesAccArray, ...assetsAccArray];
        if (incomeAndExpensesAccArray.indexOf(parentAcc) > -1) {
          let appTaxes = [];
          this.activeAccount$.pipe(take(1)).subscribe(acc => {
            if (acc && acc.applicableTaxes) {
              acc.applicableTaxes.forEach(app => appTaxes.push(app.uniqueName));
              this.taxListForStock = appTaxes;
            }
          });
        }
      } else {
        this.taxListForStock = [];
      }
    }
    // if (changes['blankLedger'] && (changes['blankLedger'].currentValue ? changes['blankLedger'].currentValue.entryDate : '') !== (changes['blankLedger'].previousValue ? changes['blankLedger'].previousValue.entryDate : '')) {
    //   // this.amountChanged();
    //   if (moment(changes['blankLedger'].currentValue.entryDate, 'DD-MM-yyyy').isValid()) {
    //     this.taxControll.date = changes['blankLedger'].currentValue.entryDate;
    //   }
    // }
    if (this.currentTxn && this.currentTxn.selectedAccount) {
      this.checkForMulitCurrency();
    }
  }

  public ngAfterViewInit(): void {
    this.needToReCalculate.subscribe(a => {
      if (a) {
        this.amountChanged();
        this.calculateTotal();
        this.calculateCompoundTotal();
      }
    });
    this.cdRef.markForCheck();
  }

  public ngAfterViewChecked() {
    // this.cdRef.markForCheck();
  }

  /**
   *
   * @param {string} type
   * @param {Event} e
   */
  public addToDrOrCr(type: string, e: Event) {
    this.changeTransactionType.emit(type);
    e.stopPropagation();
  }

  public calculateTotal() {
    if (this.currentTxn && this.currentTxn.selectedAccount) {
      if (this.currentTxn.selectedAccount.stock && this.currentTxn.amount > 0) {
        if (this.currentTxn.inventory.unit.rate) {
          // this.currentTxn.inventory.quantity = Number((this.currentTxn.amount / this.currentTxn.inventory.unit.rate).toFixed(2));
        }
      }
    }
    if (this.currentTxn && this.currentTxn.amount) {
      let total = (this.currentTxn.amount - this.currentTxn.discount) || 0;
      this.totalForTax = total;
      this.currentTxn.total = Number((total + ((total * this.currentTxn.tax) / 100)).toFixed(2));
    }
    this.calculateCompoundTotal();
  }

  public amountChanged() {
    if (this.discountControl) {
      this.discountControl.change();
    }
    if (this.currentTxn && this.currentTxn.selectedAccount) {
      if (this.currentTxn.selectedAccount.stock && this.currentTxn.amount > 0) {
        if (this.currentTxn.inventory.quantity) {
          this.currentTxn.inventory.unit.rate = Number((this.currentTxn.amount / this.currentTxn.inventory.quantity).toFixed(2));
        }
      }
    }

    if (this.isAmountFirst || this.isTotalFirts) {
      return;
    } else {
      this.isAmountFirst = true;
      // this.currentTxn.isInclusiveTax = false;
    }
  }

  public changePrice(val: string) {
    this.currentTxn.inventory.unit.rate = Number(cloneDeep(val));
    this.currentTxn.amount = Number((this.currentTxn.inventory.unit.rate * this.currentTxn.inventory.quantity).toFixed(2));
    // this.amountChanged();
    this.calculateTotal();
    this.calculateCompoundTotal();
  }

  public changeQuantity(val: string) {
    this.currentTxn.inventory.quantity = Number(val);
    this.currentTxn.amount = Number((this.currentTxn.inventory.unit.rate * this.currentTxn.inventory.quantity).toFixed(2));
    // this.amountChanged();
    this.calculateTotal();
    this.calculateCompoundTotal();
  }

  public calculateAmount() {
    let fixDiscount = 0;
    let percentageDiscount = 0;
    if (this.discountControl) {
      percentageDiscount = this.discountControl.discountAccountsDetails.filter(f => f.isActive)
        .filter(s => s.discountType === 'PERCENTAGE')
        .reduce((pv, cv) => {
          return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
        }, 0) || 0;

      fixDiscount = this.discountControl.discountAccountsDetails.filter(f => f.isActive)
        .filter(s => s.discountType === 'FIX_AMOUNT')
        .reduce((pv, cv) => {
          return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
        }, 0) || 0;

    }
    // A = (P+X+ 0.01XT) /(1-0.01Y + 0.01T -0.0001YT)

    this.currentTxn.amount = Number(((Number(this.currentTxn.total) + fixDiscount + 0.01 * fixDiscount * Number(this.currentTxn.tax)) /
      (1 - 0.01 * percentageDiscount + 0.01 * Number(this.currentTxn.tax) - 0.0001 * percentageDiscount * Number(this.currentTxn.tax))).toFixed(2));

    if (this.discountControl) {
      this.discountControl.ledgerAmount = this.currentTxn.amount;
      this.discountControl.change();
    }

    if (this.currentTxn.selectedAccount) {
      if (this.currentTxn.selectedAccount.stock) {
        this.currentTxn.inventory.unit.rate = Number((this.currentTxn.amount / this.currentTxn.inventory.quantity).toFixed(2));
      }
    }
    this.calculateCompoundTotal();
    if (this.isTotalFirts || this.isAmountFirst) {
      return;
    } else {
      this.isTotalFirts = true;
      this.currentTxn.isInclusiveTax = true;
    }
  }

  public calculateCompoundTotal() {
    // let debitTotal = Number(sumBy(this.blankLedger.transactions.filter(t => t.type === 'DEBIT'), 'total')) || 0;
    let debitTotal = Number(sumBy(this.blankLedger.transactions.filter(t => t.type === 'DEBIT'), (trxn) => Number(trxn.total))) || 0;
    // let creditTotal = Number(sumBy(this.blankLedger.transactions.filter(t => t.type === 'CREDIT'), 'total')) || 0;
    let creditTotal = Number(sumBy(this.blankLedger.transactions.filter(t => t.type === 'CREDIT'), (trxn) => Number(trxn.total))) || 0;

    if (debitTotal > creditTotal) {
      this.blankLedger.compoundTotal = Number((debitTotal - creditTotal).toFixed(2));
    } else {
      this.blankLedger.compoundTotal = Number((creditTotal - debitTotal).toFixed(2));
    }
    if (this.currentTxn && this.currentTxn.selectedAccount) {
      this.checkForMulitCurrency();
    }
  }

  public saveLedger() {
    this.saveBlankLedger.emit(true);
  }

  /**
   * reset panel form
   */
  public resetPanel() {
    this.resetBlankLedger.emit(true);
    this.currentTxn = null;
  }

  public onUploadOutput(output: UploadOutput): void {
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
        this.isFileUploading = false;
        this.blankLedger.attachedFile = output.file.response.body.uniqueName;
        this.blankLedger.attachedFileName = output.file.response.body.name;
        this._toasty.successToast('file uploaded successfully');
      } else {
        this.isFileUploading = false;
        this.blankLedger.attachedFile = '';
        this.blankLedger.attachedFileName = '';
        this._toasty.errorToast(output.file.response.message);
      }
    }
  }

  public showDeleteAttachedFileModal(merge: string) {
    this.deleteAttachedFileModal.show();
  }

  public hideDeleteAttachedFileModal() {
    this.deleteAttachedFileModal.hide();
  }

  public unitChanged(stockUnitCode: string) {
    let unit = this.currentTxn.selectedAccount.stock.accountStockDetails.unitRates.find(p => p.stockUnitCode === stockUnitCode);
    this.currentTxn.inventory.unit = {code: unit.stockUnitCode, rate: unit.rate, stockUnitCode: unit.stockUnitCode};
    if (this.currentTxn.inventory.unit) {
      this.changePrice(this.currentTxn.inventory.unit.rate.toString());
    }
  }

  public deleteAttachedFile() {
    this.blankLedger.attachedFile = '';
    this.blankLedger.attachedFileName = '';
    this.hideDeleteAttachedFileModal();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public getReconciledEntries() {
    this.matchingEntriesData = [];
    let o: ReconcileRequest = {};
    o.chequeNumber = (this.blankLedger.chequeNumber) ? this.blankLedger.chequeNumber : '';
    o.accountUniqueName = this.trxRequest.accountUniqueName;
    o.from = this.trxRequest.from;
    o.to = this.trxRequest.to;
    this._ledgerService.GetReconcile(o.accountUniqueName, o.from, o.to, o.chequeNumber).subscribe((res) => {
      let data: BaseResponse<ReconcileResponse[], string> = res;
      if (data.status === 'success') {
        if (data.body.length) {
          forEach(data.body, (entry: ReconcileResponse) => {
            forEach(entry.transactions, (txn: ILedgerTransactionItem) => {
              if (txn.amount === this.currentTxn.amount) {
                this.matchingEntriesData.push(entry);
              }
            });
          });
          if (this.matchingEntriesData.length === 1) {
            this.confirmBankTransactionMap(this.matchingEntriesData[0]);
          } else if (this.matchingEntriesData.length > 1) {
            this.showMatchingEntries = true;
          } else {
            this.showErrMsgOnUI();
          }
        } else {
          this.showErrMsgOnUI();
        }
      } else {
        this._toasty.errorToast(data.message, data.code);
      }
    });
  }

  public showErrMsgOnUI() {
    this._toasty.warningToast('no entry with matching amount found, please create a new entry with same amount as this transaction.');
  }

  public confirmBankTransactionMap(item: ReconcileResponse) {
    this.selectedItemToMap = item;
    this.mapBodyContent = `Selected bank transaction will be mapped with cheque number ${item.chequeNumber} Click yes to accept.`;
    this.confirmBankTxnMapModal.show();
  }

  public hideConfirmBankTxnMapModal() {
    this.confirmBankTxnMapModal.hide();
  }

  public mapBankTransaction() {


    if (this.blankLedger.transactionId && this.selectedItemToMap.uniqueName) {
      let model = {
        uniqueName: this.selectedItemToMap.uniqueName
      };
      let unqObj = {
        accountUniqueName: this.trxRequest.accountUniqueName,
        transactionId: this.blankLedger.transactionId
      };
      this._ledgerService.MapBankTransactions(model, unqObj).subscribe((res) => {
        if (res.status === 'success') {
          if (typeof (res.body) === 'string') {
            this._toasty.successToast(res.body);
          } else {
            this._toasty.successToast('Entry Mapped Successfully!');
          }
          this.hideConfirmBankTxnMapModal();
          this.clickedOutsideEvent.emit(false);
        } else {
          this._toasty.errorToast(res.message, res.code);
        }
      });
    } else {
      // err
    }
  }

  public hideDiscountTax(): void {
    if (this.discountControl) {
      this.discountControl.discountMenu = false;
    }
    if (this.taxControll) {
      this.taxControll.showTaxPopup = false;
    }
  }

  public hideDiscount(): void {
    if (this.discountControl) {
      this.discountControl.change();
      this.discountControl.discountMenu = false;
    }
  }

  public hideTax(): void {
    if (this.taxControll) {
      this.taxControll.change();
      this.taxControll.showTaxPopup = false;
    }
  }

  public detactChanges() {
    this.cdRef.detectChanges();
  }

  public saveCtrlEnter(event) {
    if (event.ctrlKey && event.keyCode === 13) {
      this.saveLedger();
    } else {
      return;
    }
  }

  @HostListener('window:click', ['$event'])
  public clickedOutsideOfComponent(e) {
    if (!e.relatedTarget || !this.entryContent.nativeElement.contains(e.relatedTarget)) {
      this.clickedOutsideEvent.emit(e);
    }
  }

  /**
   * calculateConversionRate
   */
  public calculateConversionRate(baseCurr, convertTo, amount, obj): any {
    if (baseCurr && convertTo) {
      obj.convertedAmount = 0;
      if (this.fetchedBaseCurrency === baseCurr && this.fetchedConvertToCurrency === convertTo && this.fetchedConvertedRate) {
        return obj.convertedAmount = Number((amount * this.fetchedConvertedRate).toFixed(2));
      } else {
        this.fetchedBaseCurrency = baseCurr;
        this.fetchedConvertToCurrency = convertTo;
        // this._ledgerService.GetCurrencyRate(baseCurr, convertTo).subscribe((res: any) => {
        // Note: Sagar told me to interchange baseCurr and convertTo #1128
        this._ledgerService.GetCurrencyRate(convertTo, baseCurr).subscribe((res: any) => {
          let rate = res.body;
          if (rate) {
            this.fetchedConvertedRate = rate;
            return obj.convertedAmount = Number((amount * rate).toFixed(2));
          }
        });
      }
    }
  }

  /**
   * checkForCurrency
   */
  public checkForCurrency(currency) {
    if (!currency && this.companyCurrency) {
      return this.companyCurrency;
    } else {
      return currency;
    }
  }

  public checkForMulitCurrency() {
    let selectedAccountCurrency = this.checkForCurrency(this.currentTxn.selectedAccount.currency);
    this.currentTxn.selectedAccount.currency = _.cloneDeep(selectedAccountCurrency);
    if (this.currentTxn && this.currentTxn.selectedAccount && selectedAccountCurrency && (this.accountBaseCurrency !== selectedAccountCurrency)) {
      setTimeout(() => {
        this.isMulticurrency = true;
      }, 400);
      this.calculateConversionRate(this.accountBaseCurrency, selectedAccountCurrency, this.currentTxn.total, this.currentTxn);
    } else {
      this.isMulticurrency = false;
      this.currentTxn.convertedAmount = 0;
    }
  }

  public selectInvoice(invoiceNo, ev) {
    invoiceNo.isSelected = ev.target.checked;
    if (ev.target.checked) {
      this.blankLedger.invoicesToBePaid.push(invoiceNo.label);
    } else {
      let indx = this.blankLedger.invoicesToBePaid.indexOf(invoiceNo.label);
      this.blankLedger.invoicesToBePaid.splice(indx, 1);
    }
    // this.selectedInvoice.emit(this.selectedInvoices);

  }

  public getInvoiveListsData(e: any) {
    if (e.value === 'rcpt') {
      this.clickUnpaidInvoiceList.emit(true);
    }
  }

  public getInvoiveLists() {
    if (this.blankLedger.voucherType === 'rcpt') {
      this.clickUnpaidInvoiceList.emit(true);
    }
  }
}

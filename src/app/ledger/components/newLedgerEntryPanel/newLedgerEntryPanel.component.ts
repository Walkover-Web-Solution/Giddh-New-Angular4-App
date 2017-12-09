import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IFlattenGroupsAccountsDetail } from '../../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BlankLedgerVM, TransactionVM } from '../../ledger.vm';
import { CompanyActions } from '../../../actions/company.actions';
import { TaxResponse } from '../../../models/api-models/Company';
import { UploadInput, UploadOutput } from 'ngx-uploader';
import { LEDGER_API } from '../../../services/apiurls/ledger.api';
import { ToasterService } from '../../../services/toaster.service';
import { ModalDirective } from 'ngx-bootstrap';
import { LedgerDiscountComponent } from '../ledgerDiscount/ledgerDiscount.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TaxControlComponent } from '../../../theme/tax-control/tax-control.component';
import { LedgerService } from '../../../services/ledger.service';
import { ReconcileRequest, ReconcileResponse, TransactionsRequest } from '../../../models/api-models/Ledger';
import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { cloneDeep, forEach } from '../../../lodash-optimized';
import { ILedgerTransactionItem } from '../../../models/interfaces/ledger.interface';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { LoaderService } from '../../../loader/loader.service';
import { UploaderOptions } from 'ngx-uploader/index';

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
  @Input() public trxRequest: TransactionsRequest;
  public isAmountFirst: boolean = false;
  public isTotalFirts: boolean = false;
  @Output() public changeTransactionType: EventEmitter<string> = new EventEmitter();
  @Output() public resetBlankLedger: EventEmitter<boolean> = new EventEmitter();
  @Output() public saveBlankLedger: EventEmitter<boolean> = new EventEmitter();
  @Output() public clickedOutsideEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild('entryContent') public entryContent: ElementRef;
  @ViewChild('sh') public sh: ShSelectComponent;

  @ViewChild('deleteAttachedFileModal') public deleteAttachedFileModal: ModalDirective;
  @ViewChild('discount') public discountControl: LedgerDiscountComponent;
  @ViewChild('tax') public taxControll: TaxControlComponent;
  public uploadInput: EventEmitter<UploadInput>;
  public fileUploadOptions: UploaderOptions;
  public discountAccountsList$: Observable<IFlattenGroupsAccountsDetail>;
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

  // private below
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>,
              private _ledgerService: LedgerService,
              private _ledgerActions: LedgerActions,
              private _companyActions: CompanyActions,
              private cdRef: ChangeDetectorRef,
              private _toasty: ToasterService,
              private _loaderService: LoaderService) {
    this.discountAccountsList$ = this.store.select(p => p.ledger.discountAccountsList).takeUntil(this.destroyed$);
    this.companyTaxesList$ = this.store.select(p => p.company.taxes).takeUntil(this.destroyed$);
    this.sessionKey$ = this.store.select(p => p.session.user.session.id).takeUntil(this.destroyed$);
    this.companyName$ = this.store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$);
    this.isLedgerCreateInProcess$ = this.store.select(p => p.ledger.ledgerCreateInProcess).takeUntil(this.destroyed$);
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

  public ngOnInit() {
    this.showAdvanced = false;
    this.uploadInput = new EventEmitter<UploadInput>();
    this.fileUploadOptions = {concurrency: 0};
  }

  @HostListener('click', ['$event'])
  public clicked(e) {
    if (this.sh && !this.sh.ele.nativeElement.contains(e.path[3])) {
      this.sh.hide();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    // if (changes['blankLedger'] && (changes['blankLedger'].currentValue ? changes['blankLedger'].currentValue.entryDate : '') !== (changes['blankLedger'].previousValue ? changes['blankLedger'].previousValue.entryDate : '')) {
    //   // this.amountChanged();
    //   if (moment(changes['blankLedger'].currentValue.entryDate, 'DD-MM-yyyy').isValid()) {
    //     this.taxControll.date = changes['blankLedger'].currentValue.entryDate;
    //   }
    // }
  }

  public ngAfterViewInit(): void {
    this.needToReCalculate.subscribe(a => {
      if (a) {
        this.amountChanged();
        this.calculateTotal();
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
    let total = (this.currentTxn.amount - this.currentTxn.discount) || 0;
    this.currentTxn.total = Number((total + ((total * this.currentTxn.tax) / 100)).toFixed(2));
  }

  public amountChanged() {
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
  }

  public changeQuantity(val: string) {
    this.currentTxn.inventory.quantity = Number(val);
    this.currentTxn.amount = Number((this.currentTxn.inventory.unit.rate * this.currentTxn.inventory.quantity).toFixed(2));
    // this.amountChanged();
    this.calculateTotal();
  }

  public calculateAmount() {
    let total = ((this.currentTxn.total * 100) + (100 + this.currentTxn.tax)
      * this.currentTxn.discount);
    this.currentTxn.amount = Number((total / (100 + this.currentTxn.tax)).toFixed(2));

    if (this.currentTxn.selectedAccount) {
      if (this.currentTxn.selectedAccount.stock) {
        this.currentTxn.inventory.unit.rate = Number((this.currentTxn.amount / this.currentTxn.inventory.quantity).toFixed(2));
      }
    }

    if (this.isTotalFirts || this.isAmountFirst) {
      return;
    } else {
      this.isTotalFirts = true;
      this.currentTxn.isInclusiveTax = true;
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
      this.sessionKey$.take(1).subscribe(a => sessionKey = a);
      this.companyName$.take(1).subscribe(a => companyUniqueName = a);
      const event: UploadInput = {
        type: 'uploadAll',
        url: LEDGER_API.UPLOAD_FILE.replace(':companyUniqueName', companyUniqueName),
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

  @HostListener('window:click', ['$event'])
  public clickedOutsideOfComponent(e) {
    if (!e.relatedTarget || !this.entryContent.nativeElement.contains(e.relatedTarget)) {
      this.clickedOutsideEvent.emit(e);
    }
  }
}

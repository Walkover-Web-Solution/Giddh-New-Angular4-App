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
  SimpleChanges,
  ViewChild
} from '@angular/core';
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
import { UploadInput, UploadOutput } from 'ngx-uploader';
import { LEDGER_API } from '../../../services/apiurls/ledger.api';
import { ToasterService } from '../../../services/toaster.service';
import { ModalDirective } from 'ngx-bootstrap';
import { TaxControlComponent } from '../../../shared/theme/index';
import { LedgerDiscountComponent } from '../ledgerDiscount/ledgerDiscount.component';
import { GroupsWithAccountsResponse } from '../../../models/api-models/GroupsWithAccounts';
import { find } from 'lodash';

@Component({
  selector: 'new-ledger-entry-panel',
  templateUrl: 'newLedgerEntryPanel.component.html',
  styleUrls: ['./newLedgerEntryPanel.component.css']
})

export class NewLedgerEntryPanelComponent implements OnInit, OnDestroy, OnChanges, AfterViewChecked {
  @Input() public blankLedger: BlankLedgerVM;
  @Input() public currentTxn: TransactionVM = null;
  @Input() public needToReCalculate: boolean = false;
  @Input() public showTaxationDiscountBox: boolean = true;
  public isAmountFirst: boolean = false;
  public isTotalFirts: boolean = false;
  @Output() public changeTransactionType: EventEmitter<string> = new EventEmitter();
  @Output() public resetBlankLedger: EventEmitter<boolean> = new EventEmitter();
  @Output() public saveBlankLedger: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('deleteAttachedFileModal') public deleteAttachedFileModal: ModalDirective;
  @ViewChild('discount') public discountControl: LedgerDiscountComponent;
  @ViewChild('tax') public taxControll: TaxControlComponent;
  public uploadInput: EventEmitter<UploadInput>;
  public discountAccountsList$: Observable<IFlattenGroupsAccountsDetail>;
  public companyTaxesList$: Observable<TaxResponse[]>;
  public authKey$: Observable<string>;
  public companyName$: Observable<string>;

  public voucherDropDownOptions: Select2Options = {
    multiple: false,
    allowClear: true,
    width: '200px',
    placeholder: 'Select Vouchers'
  };
  public voucherTypeList: Observable<Select2OptionData[]>;
  public showAdvanced: boolean;
  public dateMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public datePipe = createAutoCorrectedDatePipe('dd-mm-yyyy');
  public isFileUploading: boolean = false;
  public isLedgerCreateInProcess$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>,
    private _ledgerActions: LedgerActions,
    private _companyActions: CompanyActions,
    private cdRef: ChangeDetectorRef,
    private _toasty: ToasterService) {
    this.discountAccountsList$ = this.store.select(p => p.ledger.discountAccountsList).takeUntil(this.destroyed$);
    this.companyTaxesList$ = this.store.select(p => p.company.taxes).takeUntil(this.destroyed$);
    this.authKey$ = this.store.select(p => p.session.user.authKey).takeUntil(this.destroyed$);
    this.companyName$ = this.store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$);
    this.isLedgerCreateInProcess$ = this.store.select(p => p.ledger.ledgerCreateInProcess).takeUntil(this.destroyed$);
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
  }

  public ngOnInit() {
    this.showAdvanced = false;
    this.uploadInput = new EventEmitter<UploadInput>();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['needToReCalculate']) {
      this.calculateTotal();
    }
  }

  public ngAfterViewChecked() {
    this.cdRef.detectChanges();
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
    let total = this.currentTxn.amount - this.currentTxn.discount;
    this.currentTxn.total = Number((total + ((total * this.currentTxn.tax) / 100)).toFixed(2));
    if (this.isAmountFirst || this.isTotalFirts) {
      return;
    } else {
      this.isAmountFirst = true;
      this.currentTxn.isInclusiveTax = false;
    }
  }

  public calculateAmount() {
    let total = ((this.currentTxn.total * 100) + (100 + this.currentTxn.tax)
      * this.currentTxn.discount);
    this.currentTxn.amount = Number((total / (100 + this.currentTxn.tax)).toFixed(2));
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
    this.currentTxn = null;
    this.resetBlankLedger.emit(true);
  }

  public onUploadOutput(output: UploadOutput): void {

    if (output.type === 'allAddedToQueue') {
      let authKey = null;
      let companyUniqueName = null;
      this.authKey$.take(1).subscribe(a => authKey = a);
      this.companyName$.take(1).subscribe(a => companyUniqueName = a);
      const event: UploadInput = {
        type: 'uploadAll',
        url: LEDGER_API.UPLOAD_FILE.replace(':companyUniqueName', companyUniqueName),
        method: 'POST',
        fieldName: 'file',
        data: { company: companyUniqueName },
        headers: { 'Auth-Key': authKey },
        concurrency: 1
      };

      this.uploadInput.emit(event);
    } else if (output.type === 'start') {
      this.isFileUploading = true;
    } else if (output.type === 'done') {
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

  public deleteAttachedFile() {
    this.blankLedger.attachedFile = '';
    this.blankLedger.attachedFileName = '';
    this.hideDeleteAttachedFileModal();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
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
      this.discountControl.discountMenu = false;
    }
  }

  public hideTax(): void {
    if (this.taxControll) {
      this.taxControll.showTaxPopup = false;
    }
  }
}

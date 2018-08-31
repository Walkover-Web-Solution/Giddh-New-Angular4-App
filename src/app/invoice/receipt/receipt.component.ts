import { IOption } from '../../theme/ng-select/option.interface';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import * as _ from '../../lodash-optimized';
import { orderBy } from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { GetAllInvoicesPaginatedResponse, IInvoiceResult, InvoiceFilterClassForInvoicePreview } from '../../models/api-models/Invoice';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import { AccountService } from '../../services/account.service';
import { Observable } from 'rxjs/Observable';
import { InvoiceService } from '../../services/invoice.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { ModalDirective } from 'ngx-bootstrap';
import { createSelector } from 'reselect';
import { IFlattenAccountsResultItem } from 'app/models/interfaces/flattenAccountsResultItem.interface';
import { InvoiceTemplatesService } from 'app/services/invoice.templates.service';
import { InvoiceReceiptActions } from '../../actions/invoice/receipt/receipt.actions';
import { DownloadVoucherRequest, InvoiceReceiptFilter, ReceiptItem, ReciptDeleteRequest, ReciptResponse } from '../../models/api-models/recipt';
import { ReceiptService } from '../../services/receipt.service';
import { ToasterService } from '../../services/toaster.service';
import { saveAs } from 'file-saver';

const PARENT_GROUP_ARR = ['sundrydebtors', 'bankaccounts', 'revenuefromoperations', 'otherincome', 'cash'];
const COUNTS = [
  {label: '12', value: '12'},
  {label: '25', value: '25'},
  {label: '50', value: '50'},
  {label: '100', value: '100'}
];

const COMPARISON_FILTER = [
  {label: 'Greater Than', value: 'greaterThan'},
  {label: 'Less Than', value: 'lessThan'},
  {label: 'Greater Than or Equals', value: 'greaterThanOrEquals'},
  {label: 'Less Than or Equals', value: 'lessThanOrEquals'},
  {label: 'Equals', value: 'equals'}
];

@Component({
  templateUrl: './receipt.component.html'
})
export class ReceiptComponent implements OnInit, OnDestroy {

  @ViewChild('invoiceReceiptConfirmationModel') public invoiceReceiptConfirmationModel: ModalDirective;

  public bsConfig: Partial<BsDatepickerConfig> = {showWeekNumbers: false, dateInputFormat: 'DD-MM-YYYY', rangeInputFormat: 'DD-MM-YYYY'};
  public selectedInvoice: IInvoiceResult;
  public selectedReceipt: ReceiptItem;
  public receiptSearchRequest: InvoiceReceiptFilter = new InvoiceReceiptFilter();
  public invoiceData: GetAllInvoicesPaginatedResponse;
  public receiptData: ReciptResponse;
  public filtersForEntryTotal: IOption[] = COMPARISON_FILTER;
  public counts: IOption[] = COUNTS;
  public accounts$: Observable<IOption[]>;
  public moment = moment;
  public startDate: Date;
  public endDate: Date;
  public isGetAllRequestInProcess$: Observable<boolean>;
  private universalDate: Date[];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private isUniversalDateApplicable: boolean = false;
  private flattenAccountListStream$: Observable<IFlattenAccountsResultItem[]>;

  constructor(
    private modalService: BsModalService,
    private store: Store<AppState>,
    private invoiceActions: InvoiceActions,
    private _accountService: AccountService,
    private _invoiceService: InvoiceService,
    private _invoiceTemplatesService: InvoiceTemplatesService,
    private invoiceReceiptActions: InvoiceReceiptActions,
    private _receiptService: ReceiptService,
    private _toasty: ToasterService
  ) {
    this.receiptSearchRequest.page = 1;
    this.receiptSearchRequest.count = 25;
    this.receiptSearchRequest.entryTotalBy = '';
    this.flattenAccountListStream$ = this.store.select(p => p.general.flattenAccounts).takeUntil(this.destroyed$);
    this.isGetAllRequestInProcess$ = this.store.select(p => p.receipt.isGetAllRequestInProcess).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    // Get accounts
    this.flattenAccountListStream$.subscribe((data: IFlattenAccountsResultItem[]) => {
      let accounts: IOption[] = [];
      _.forEach(data, (item) => {
        if (_.find(item.parentGroups, (o) => _.indexOf(PARENT_GROUP_ARR, o.uniqueName) !== -1)) {
          accounts.push({label: item.name, value: item.uniqueName});
        }
      });
      this.accounts$ = Observable.of(orderBy(accounts, 'label'));
    });

    this.store.select(p => p.receipt.data).takeUntil(this.destroyed$).subscribe((o: ReciptResponse) => {
      if (o) {
        this.receiptData = _.cloneDeep(o);
      } else {
        this.getInvoiceReceipts();
      }
    });

    // Refresh report data according to universal date
    this.store.select(createSelector([(state: AppState) => state.session.applicationDate], (dateObj: Date[]) => {
      if (dateObj) {
        this.universalDate = _.cloneDeep(dateObj);
        this.receiptSearchRequest.dateRange = this.universalDate;
        this.isUniversalDateApplicable = true;
        this.getInvoiceReceipts();
      }
    })).subscribe();
  }

  public pageChanged(event: any): void {
    this.receiptSearchRequest.page = event.page;
    this.getInvoiceReceipts();
  }

  public getInvoiceReceiptByFilters(f: NgForm) {
    // if (f.valid) {
    this.isUniversalDateApplicable = false;
    this.getInvoiceReceipts();
    // }
  }

  public onEditBtnClick(uniqueName) {
    //
  }

  public onDeleteBtnClick(uniqueName) {
    let allReceipts: ReceiptItem[] = _.cloneDeep(this.receiptData.items);
    this.selectedReceipt = allReceipts.find((o) => o.uniqueName === uniqueName);
    this.invoiceReceiptConfirmationModel.show();
  }

  public deleteConfirmedInvoice() {
    this.invoiceReceiptConfirmationModel.hide();
    let request: ReciptDeleteRequest = {
      invoiceNumber: this.selectedReceipt.voucherNumber,
      voucherType: 'receipt'
    };
    this.store.dispatch(this.invoiceReceiptActions.DeleteInvoiceReceiptRequest(
      request, this.selectedReceipt.account.uniqueName
    ));
  }

  public closeConfirmationPopup() {
    this.invoiceReceiptConfirmationModel.hide();
  }

  public getInvoiceReceipts() {
    this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(
      this.prepareModelForInvoiceReceiptApi()
    ));
  }

  public prepareModelForInvoiceReceiptApi(): InvoiceReceiptFilter {
    let model: InvoiceReceiptFilter = {};
    let o = _.cloneDeep(this.receiptSearchRequest);

    if (o.voucherNumber) {
      model.voucherNumber = o.voucherNumber;
    }

    if (o.accountUniqueName) {
      model.accountUniqueName = o.accountUniqueName;
    }
    if (o.balanceDue) {
      model.balanceDue = o.balanceDue;
    }
    if (o.description) {
      model.description = o.description;
    }
    if (o.entryTotalBy === COMPARISON_FILTER[0].value) {
      model.balanceMoreThan = true;
    } else if (o.entryTotalBy === COMPARISON_FILTER[1].value) {
      model.balanceLessThan = true;
    } else if (o.entryTotalBy === COMPARISON_FILTER[2].value) {
      model.balanceMoreThan = true;
      model.balanceEqual = true;
    } else if (o.entryTotalBy === COMPARISON_FILTER[3].value) {
      model.balanceLessThan = true;
      model.balanceEqual = true;
    } else if (o.entryTotalBy === COMPARISON_FILTER[4].value) {
      model.balanceEqual = true;
    }

    let fromDate = null;
    let toDate = null;
    if (this.universalDate && this.universalDate.length) {
      fromDate = moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
      toDate = moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
    } else {
      fromDate = moment().subtract(30, 'days').format(GIDDH_DATE_FORMAT);
      toDate = moment().format(GIDDH_DATE_FORMAT);
    }

    model.from = this.isUniversalDateApplicable ? fromDate : o.from;
    model.to = this.isUniversalDateApplicable ? toDate : o.to;
    model.count = o.count;
    model.page = o.page;
    return model;
  }

  public bsValueChange(event: any) {
    if (event) {
      this.receiptSearchRequest.from = moment(event[0]).format(GIDDH_DATE_FORMAT);
      this.receiptSearchRequest.to = moment(event[1]).format(GIDDH_DATE_FORMAT);
      this.getInvoiceReceipts();
    }
  }

  public downloadVoucherRequest(uniqueName: string) {
    let allReceipts: ReceiptItem[] = _.cloneDeep(this.receiptData.items);
    this.selectedReceipt = allReceipts.find((o) => o.uniqueName === uniqueName);
    let dataToSend: DownloadVoucherRequest = {
      voucherNumber: [this.selectedReceipt.voucherNumber],
      voucherType: 'receipt'
    };

    this._receiptService.DownloadVoucher(dataToSend, this.selectedReceipt.account.uniqueName)
      .subscribe(s => {
        if (s) {
          return saveAs(s, `Receipt-${this.selectedReceipt.account.uniqueName}.pdf`);
        } else {
          this._toasty.errorToast('File not Downloaded Please Try Again');
        }
      }, (e) => {
        this._toasty.errorToast('File not Downloaded Please Try Again');
      });
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

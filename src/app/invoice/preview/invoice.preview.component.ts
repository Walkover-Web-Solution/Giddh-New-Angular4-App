import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InvoiceFilterClass, GetAllLedgersOfInvoicesResponse, GenBulkInvoiceGroupByObj, GenBulkInvoiceFinalObj, IInvoiceResult, IGetAllInvoicesResponse, GetAllInvoicesPaginatedResponse } from '../../models/api-models/Invoice';
import { InvoiceActions } from '../../services/actions/invoice/invoice.actions';
import { INameUniqueName } from '../../models/interfaces/nameUniqueName.interface';
import { InvoiceState } from '../../store/Invoice/invoice.reducer';
import { AccountService } from '../../services/account.service';
import { Observable } from 'rxjs/Observable';
import { Select2OptionData } from '../../shared/theme/select2/select2.interface';
import { ModalDirective } from 'ngx-bootstrap';

const COUNTS = [12, 25, 50, 100];
const COMPARISON_FILTER = [
  { name: 'Greater Than', uniqueName: 'greaterThan' },
  { name: 'Less Than', uniqueName: 'lessThan' },
  { name: 'Greater Than or Equals', uniqueName: 'greaterThanOrEquals' },
  { name: 'Less Than or Equals', uniqueName: 'lessThanOrEquals' },
  { name: 'Equals', uniqueName: 'equals' }
];

@Component({
  templateUrl: './invoice.preview.component.html',
  styleUrls: ['./invoice.preview.component.css'],
})
export class InvoicePreviewComponent implements OnInit {

  @ViewChild('invoiceConfirmationModel') public invoiceConfirmationModel: ModalDirective;
  @ViewChild('performActionOnInvoiceModel') public performActionOnInvoiceModel: ModalDirective;
  @ViewChild('downloadOrSendMailModel') public downloadOrSendMailModel: ModalDirective;

  public selectedInvoice: IInvoiceResult;
  public invoiceSearchRequest: InvoiceFilterClass = new InvoiceFilterClass();
  public invoiceData: GetAllInvoicesPaginatedResponse;
  public filtersForEntryTotal: INameUniqueName[] = COMPARISON_FILTER;
  public counts: number[] = COUNTS;
  public accounts$: Observable<Select2OptionData[]>;
  public select2Options: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Select Accounts',
    allowClear: true
  };
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private modalRef: BsModalRef;
  private config = {
    animated: true,
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true
  };

  constructor(
    private modalService: BsModalService,
    private store: Store<AppState>,
    private invoiceActions: InvoiceActions,
    private _accountService: AccountService
  ) {
    this.invoiceSearchRequest.entryTotalBy = '';
  }

  public ngOnInit() {
    // set initial values
    this.invoiceSearchRequest.from = moment().subtract(30, 'days').format('DD-MM-YYYY');
    this.invoiceSearchRequest.to = moment().format('DD-MM-YYYY');
    this.invoiceSearchRequest.page = 1;
    this.invoiceSearchRequest.count = 12;

    // Get accounts
    this._accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accounts: Select2OptionData[] = [];
        data.body.results.map(d => {
          // Select only sundry debtors account
          if (d.parentGroups.find((o) => o.uniqueName === 'sundrydebtors')) {
            accounts.push({ text: d.name, id: d.uniqueName });
          }
        });
        this.accounts$ = Observable.of(accounts);
      }
    });

    this.store.select(p => p.invoice).takeUntil(this.destroyed$).subscribe((o: InvoiceState) => {
      if (o.preview && o.preview.invoices) {
        this.invoiceData = _.cloneDeep(o.preview.invoices);
        _.map(this.invoiceData.results, (item: IInvoiceResult) => {
          item.isSelected = false;
          return o;
        });
      } else {
        this.getInvoices();
      }
    });
    this.getInvoices();
  }

  public getInvoicesByFilters(f: NgForm) {
    if (f.valid) {
      this.getInvoices();
    }
  }

  public onPerformAction(item, ele: HTMLInputElement) {
    let actionToPerform = ele.value;
    if (actionToPerform === 'paid') {
      this.selectedInvoice = item;
      this.performActionOnInvoiceModel.show();
    } else {
      this.store.dispatch(this.invoiceActions.ActionOnInvoice(item.uniqueName, { action: actionToPerform }));
    }
  }

  public onDeleteBtnClick(uniqueName) {
    let allInvoices = _.cloneDeep(this.invoiceData.results);
    this.selectedInvoice = allInvoices.find((o) => o.uniqueName === uniqueName);
    this.invoiceConfirmationModel.show();
  }

  public deleteConfirmedInvoice() {
    this.invoiceConfirmationModel.hide();
    this.store.dispatch(this.invoiceActions.DeleteInvoice(this.selectedInvoice.invoiceNumber));
  }

  public closeConfirmationPopup() {
    this.invoiceConfirmationModel.hide();
  }

  public closePerformActionPopup(data) {
    this.performActionOnInvoiceModel.hide();
    this.store.dispatch(this.invoiceActions.ActionOnInvoice(this.selectedInvoice.uniqueName, { action: 'paid', amount: data }));
  }

  /**
   * onSelectInvoice
   */
  public onSelectInvoice(invoice) {
    this.selectedInvoice = _.cloneDeep(invoice);
    this.downloadOrSendMailModel.show();
  }

  /**
  * onDownloadOrSendMailEvent
  */
  public onDownloadOrSendMailEvent(userResponse: { action: string, emails: string[] }) {
    if (userResponse.action === 'download') {
      this.store.dispatch(this.invoiceActions.DownloadInvoice(this.selectedInvoice.account.uniqueName, { invoiceNumber: [this.selectedInvoice.invoiceNumber], template: 'gst_template_a' }));
    } else if (userResponse.action === 'send_mail' && userResponse.emails && userResponse.emails.length) {
      this.store.dispatch(this.invoiceActions.SendInvoiceOnMail(this.selectedInvoice.account.uniqueName, { emailId: userResponse.emails, invoiceNumber: [this.selectedInvoice.invoiceNumber] }));
    }
  }

  public closeDownloadOrSendMailPopup(data) {
    this.downloadOrSendMailModel.hide();
  }

  private getInvoices() {
    this.store.dispatch(this.invoiceActions.GetAllInvoices(this.prepareQueryParamsForInvoiceApi()));
  }

  private prepareModelForInvoiceApi() {
    let model: InvoiceFilterClass = {};
    let o = _.cloneDeep(this.invoiceSearchRequest);
    if (o.accountUniqueName) {
      model.accountUniqueName = o.accountUniqueName;
    }
    if (o.entryTotal) {
      model.entryTotal = o.entryTotal;
    }
    if (o.description) {
      model.description = o.description;
    }
    if (o.entryTotalBy === COMPARISON_FILTER[0].uniqueName) {
      model.totalIsMore = true;
    } else if (o.entryTotalBy === COMPARISON_FILTER[1].uniqueName) {
      model.totalIsLess = true;
    } else if (o.entryTotalBy === COMPARISON_FILTER[2].uniqueName) {
      model.totalIsMore = true;
      model.totalIsEqual = true;
    } else if (o.entryTotalBy === COMPARISON_FILTER[3].uniqueName) {
      model.totalIsLess = true;
      model.totalIsEqual = true;
    } else if (o.entryTotalBy === COMPARISON_FILTER[4].uniqueName) {
      model.totalIsEqual = true;
    }
    return model;
  }

  private prepareQueryParamsForInvoiceApi() {
    let o = _.cloneDeep(this.invoiceSearchRequest);
    return {
      from: o.from,
      to: o.to,
      count: o.count,
      page: o.page
    };
  }
}

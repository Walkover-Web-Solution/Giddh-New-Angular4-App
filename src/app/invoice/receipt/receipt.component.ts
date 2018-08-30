import { IOption } from '../../theme/ng-select/option.interface';
import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import * as _ from '../../lodash-optimized';
import { find, orderBy } from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { CustomTemplateResponse, GetAllInvoicesPaginatedResponse, IInvoiceResult, InvoiceFilterClassForInvoicePreview, PreviewInvoiceResponseClass } from '../../models/api-models/Invoice';
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
import { BaseResponse } from 'app/models/api-models/BaseResponse';
import { InvoiceReceiptActions } from '../../actions/invoice/receipt/receipt.actions';
import { DownloadVoucherRequest, InvoiceReceiptFilter, ReciptResponse } from '../../models/api-models/recipt';
import { DownloadOrSendInvoiceOnMailComponent } from '../preview/models/download-or-send-mail/download-or-send-mail.component';

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

const PREVIEW_OPTIONS = [
  {label: 'Paid', value: 'paid'},
  {label: 'Unpaid', value: 'unpaid'},
  {label: 'Hold', value: 'hold'},
  {label: 'Cancel', value: 'cancel'},
];

@Component({
  templateUrl: './receipt.component.html'
})
export class ReceiptComponent implements OnInit, OnDestroy {

  @ViewChild('invoiceConfirmationModel') public invoiceConfirmationModel: ModalDirective;

  public bsConfig: Partial<BsDatepickerConfig> = {showWeekNumbers: false, dateInputFormat: 'DD-MM-YYYY', rangeInputFormat: 'DD-MM-YYYY'};
  public showPdfWrap: boolean = false;
  public base64Data: string;
  public selectedInvoice: IInvoiceResult;
  public selectedReceipt: ReciptResponse;
  public invoiceSearchRequest: InvoiceFilterClassForInvoicePreview = new InvoiceFilterClassForInvoicePreview();
  public receiptSearchRequest: InvoiceReceiptFilter = new InvoiceReceiptFilter();
  public invoiceData: GetAllInvoicesPaginatedResponse;
  public filtersForEntryTotal: IOption[] = COMPARISON_FILTER;
  public previewDropdownOptions: IOption[] = PREVIEW_OPTIONS;
  public counts: IOption[] = COUNTS;
  public accounts$: Observable<IOption[]>;
  public moment = moment;
  public modalRef: BsModalRef;
  public modalConfig = {
    animated: true,
    keyboard: false,
    backdrop: 'static',
    ignoreBackdropClick: true
  };
  public startDate: Date;
  public endDate: Date;
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
    private componentFactoryResolver: ComponentFactoryResolver,
    private invoiceReceiptActions: InvoiceReceiptActions
  ) {
    this.invoiceSearchRequest.page = 1;
    this.invoiceSearchRequest.count = 25;
    this.invoiceSearchRequest.entryTotalBy = '';
    this.flattenAccountListStream$ = this.store.select(p => p.general.flattenAccounts).takeUntil(this.destroyed$);
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

    this.store.select(p => p.invoice.invoices).takeUntil(this.destroyed$).subscribe((o: GetAllInvoicesPaginatedResponse) => {
      if (o) {
        this.invoiceData = _.cloneDeep(o);
        _.map(this.invoiceData.results, (item: IInvoiceResult) => {
          item.isSelected = false;
          return o;
        });
      } else {
        this.getInvoices();
      }
    });

    this.store.select(p => p.invoice.invoiceData)
      .takeUntil(this.destroyed$)
      .distinctUntilChanged((p: PreviewInvoiceResponseClass, q: PreviewInvoiceResponseClass) => {
        if (p && q) {
          return (p.templateUniqueName === q.templateUniqueName);
        }
        if ((p && !q) || (!p && q)) {
          return false;
        }
        return true;
      }).subscribe((o: PreviewInvoiceResponseClass) => {
      if (o) {
        /**
         * find if templateUniqueName is exist in company all templates
         * check for isDefault flag
         * last hope call api from first template
         * */
        this._invoiceTemplatesService.getAllCreatedTemplates().subscribe((res: BaseResponse<CustomTemplateResponse[], string>) => {
          if (res.status === 'success' && res.body.length) {
            let template = find(res.body, (item) => item.uniqueName === o.templateUniqueName);
            if (template) {
              this.getInvoiceTemplateDetails(template.uniqueName);
            } else {
              template = find(res.body, (item) => item.isDefault);
              if (template) {
                this.getInvoiceTemplateDetails(template.uniqueName);
              } else {
                this.getInvoiceTemplateDetails(res.body[0].uniqueName);
              }
            }
          }
        });
      }
    });

    // Refresh report data according to universal date
    this.store.select(createSelector([(state: AppState) => state.session.applicationDate], (dateObj: Date[]) => {
      if (dateObj) {
        this.universalDate = _.cloneDeep(dateObj);
        this.invoiceSearchRequest.dateRange = this.universalDate;
        this.isUniversalDateApplicable = true;
        this.getInvoices();
      }
    })).subscribe();
  }

  public getInvoiceTemplateDetails(templateUniqueName: string) {
    if (templateUniqueName) {
      this.store.dispatch(this.invoiceActions.GetTemplateDetailsOfInvoice(templateUniqueName));
    } else {
      console.log('error hardcoded: templateUniqueName');
      this.store.dispatch(this.invoiceActions.GetTemplateDetailsOfInvoice('j8bzr0k3lh0khbcje8bh'));
    }
  }

  public pageChanged(event: any): void {
    this.invoiceSearchRequest.page = event.page;
    this.getInvoices();
  }

  public getInvoicesByFilters(f: NgForm) {
    if (f.valid) {
      this.isUniversalDateApplicable = false;
      this.getInvoices();
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

  /**
   * download file as pdf
   * @param data
   * @param invoiceUniqueName
   */
  public downloadFile() {
    let blob = this.base64ToBlob(this.base64Data, 'application/pdf', 512);
    return saveAs(blob, `Invoice-${this.selectedInvoice.account.uniqueName}.pdf`);
  }

  public base64ToBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    let offset = 0;
    while (offset < byteCharacters.length) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      let i = 0;
      while (i < slice.length) {
        byteNumbers[i] = slice.charCodeAt(i);
        i++;
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
      offset += sliceSize;
    }
    return new Blob(byteArrays, {type: contentType});
  }

  public getInvoices() {
    this.store.dispatch(this.invoiceActions.GetAllInvoices(this.prepareQueryParamsForInvoiceApi(), this.prepareModelForInvoiceApi()));
  }

  public prepareModelForInvoiceApi() {
    let model: InvoiceFilterClassForInvoicePreview = {};
    let o = _.cloneDeep(this.invoiceSearchRequest);
    if (o && o.accountUniqueName) {
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
    return model;
  }

  public prepareQueryParamsForInvoiceApi() {
    let o = _.cloneDeep(this.invoiceSearchRequest);
    let fromDate = null;
    let toDate = null;
    if (this.universalDate && this.universalDate.length) {
      fromDate = moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
      toDate = moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
    } else {
      fromDate = moment().subtract(30, 'days').format(GIDDH_DATE_FORMAT);
      toDate = moment().format(GIDDH_DATE_FORMAT);
    }
    return {
      from: this.isUniversalDateApplicable ? fromDate : o.from,
      to: this.isUniversalDateApplicable ? toDate : o.to,
      count: o.count,
      page: o.page
    };
  }

  public bsValueChange(event: any) {
    if (event) {
      this.invoiceSearchRequest.from = moment(event[0]).format(GIDDH_DATE_FORMAT);
      this.invoiceSearchRequest.to = moment(event[1]).format(GIDDH_DATE_FORMAT);
      this.getInvoices();
    }
  }

  public downloadVoucherRequest(voucherNumber: string) {
    let dataToSend: DownloadVoucherRequest = {
      voucherNumber: [voucherNumber]
    };
    // this.store.dispatch(this.invoiceReceiptActions.DownloadVoucherRequest(this.selectedReceipt.items, dataToSend));
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

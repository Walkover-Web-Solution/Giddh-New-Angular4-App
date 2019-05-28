import { Observable, of as observableOf, of, ReplaySubject } from 'rxjs';

import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { IOption } from '../../theme/ng-select/option.interface';
import { Component, ComponentFactoryResolver, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import * as _ from '../../lodash-optimized';
import { orderBy } from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { InvoiceFilterClassForInvoicePreview } from '../../models/api-models/Invoice';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import { AccountService } from '../../services/account.service';
import { InvoiceService } from '../../services/invoice.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { ModalDirective } from 'ngx-bootstrap';
import { createSelector } from 'reselect';
import { IFlattenAccountsResultItem } from 'apps/web-giddh/src/app/models/interfaces/flattenAccountsResultItem.interface';
import { DownloadOrSendInvoiceOnMailComponent } from 'apps/web-giddh/src/app/invoice/preview/models/download-or-send-mail/download-or-send-mail.component';
import { ElementViewContainerRef } from 'apps/web-giddh/src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { InvoiceTemplatesService } from 'apps/web-giddh/src/app/services/invoice.templates.service';
import { ActivatedRoute } from '@angular/router';
import { InvoiceReceiptFilter, ReceiptItem, ReciptResponse } from 'apps/web-giddh/src/app/models/api-models/recipt';
import { InvoiceReceiptActions } from 'apps/web-giddh/src/app/actions/invoice/receipt/receipt.actions';
import { ActiveFinancialYear, CompanyResponse, ValidateInvoice } from 'apps/web-giddh/src/app/models/api-models/Company';
import { CompanyActions } from 'apps/web-giddh/src/app/actions/company.actions';
import { InvoiceAdvanceSearchComponent } from './models/advanceSearch/invoiceAdvanceSearch.component';
import { ToasterService } from '../../services/toaster.service';

const PARENT_GROUP_ARR = ['sundrydebtors', 'bankaccounts', 'revenuefromoperations', 'otherincome', 'cash'];

const COMPARISON_FILTER = [
  {label: 'Greater Than', value: 'greaterThan'},
  {label: 'Less Than', value: 'lessThan'},
  {label: 'Greater Than or Equals', value: 'greaterThanOrEquals'},
  {label: 'Less Than or Equals', value: 'lessThanOrEquals'},
  {label: 'Equals', value: 'equals'}
];

@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice.preview.component.html',
  styleUrls: ['./invoice.preview.component.css'],
})
export class InvoicePreviewComponent implements OnInit, OnChanges, OnDestroy {

  public validateInvoiceobj: ValidateInvoice = {invoiceNumber: null};
  @ViewChild('invoiceConfirmationModel') public invoiceConfirmationModel: ModalDirective;
  @ViewChild('performActionOnInvoiceModel') public performActionOnInvoiceModel: ModalDirective;
  @ViewChild('downloadOrSendMailModel') public downloadOrSendMailModel: ModalDirective;
  @ViewChild('invoiceGenerateModel') public invoiceGenerateModel: ModalDirective;
  @ViewChild('downloadOrSendMailComponent') public downloadOrSendMailComponent: ElementViewContainerRef;
  @ViewChild('dateRangePickerCmp') public dateRangePickerCmp: ElementRef;
  @ViewChild('advanceSearch') public advanceSearch: ModalDirective;
  @ViewChild('bulkUpdate') public bulkUpdate: ModalDirective;
  @ViewChild('eWayBill') public eWayBill: ModalDirective;
  @ViewChild('invoiceSearch') public invoiceSearch: ElementRef;
  @ViewChild('customerSearch') public customerSearch: ElementRef;
  @ViewChild('perfomaSearch') public perfomaSearch: ElementRef;
  @ViewChild('searchBox') public searchBox: ElementRef;
  @ViewChild('advanceSearchComponent', {read: InvoiceAdvanceSearchComponent}) public advanceSearchComponent: InvoiceAdvanceSearchComponent;
  @Input() public selectedVoucher: string = 'sales';

  public advanceSearchFilter: InvoiceFilterClassForInvoicePreview = new InvoiceFilterClassForInvoicePreview();
  public bsConfig: Partial<BsDatepickerConfig> = {
    showWeekNumbers: false,
    dateInputFormat: 'DD-MM-YYYY',
    rangeInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-green myDpClass'
  };
  public base64Data: string;
  public selectedInvoice: ReceiptItem;
  public invoiceSearchRequest: InvoiceFilterClassForInvoicePreview = new InvoiceFilterClassForInvoicePreview();
  public voucherData: ReciptResponse;
  public accounts$: Observable<IOption[]>;
  public moment = moment;
  public modalRef: BsModalRef;
  public showInvoiceNoSearch = false;
  public modalConfig: ModalOptions = {
    animated: true,
    keyboard: true,
    backdrop: 'static',
    ignoreBackdropClick: true
  };
  public modalUniqueName: string;
  public startDate: Date;
  public endDate: Date;
  public activeFinancialYear: ActiveFinancialYear;

  public showCustomerSearch = false;
  public showProformaSearch = false;
  public datePickerOptions: any = {
    hideOnEsc: true,
    locale: {
      applyClass: 'btn-green',
      applyLabel: 'Go',
      fromLabel: 'From',
      format: 'D-MMM-YY',
      toLabel: 'To',
      cancelLabel: 'Cancel',
      customRangeLabel: 'Custom range'
    },
    ranges: {
      'This Month to Date': [
        moment().startOf('month'),
        moment()
      ],
      'This Quarter to Date': [
        moment().quarter(moment().quarter()).startOf('quarter'),
        moment()
      ],
      'This Financial Year to Date': [
        moment().startOf('year').subtract(9, 'year'),
        moment()
      ],
      'This Year to Date': [
        moment().startOf('year'),
        moment()
      ],
      'Last Month': [
        moment().subtract(1, 'month').startOf('month'),
        moment().subtract(1, 'month').endOf('month')
      ],
      'Last Quater': [
        moment().quarter(moment().quarter()).subtract(1, 'quarter').startOf('quarter'),
        moment().quarter(moment().quarter()).subtract(1, 'quarter').endOf('quarter')
      ],
      'Last Financial Year': [
        moment().startOf('year').subtract(10, 'year'),
        moment().endOf('year').subtract(10, 'year')
      ],
      'Last Year': [
        moment().startOf('year').subtract(1, 'year'),
        moment().endOf('year').subtract(1, 'year')
      ]
    },
    startDate: moment().subtract(30, 'days'),
    endDate: moment()
  };
  public universalDate: Date[];
  public invoiceActionUpdated: Observable<boolean> = of(false);
  public isGetAllRequestInProcess$: Observable<boolean> = of(true);
  public templateType: any;
  public companies$: Observable<CompanyResponse[]>;
  public selectedCompany$: Observable<CompanyResponse>;
  public allItemsSelected: boolean = false;
  public selectedItems: string[] = [];
  public voucherNumberInput: FormControl = new FormControl();
  public accountUniqueNameInput: FormControl = new FormControl();
  public ProformaPurchaseOrder: FormControl = new FormControl();
  public showAdvanceSearchIcon: boolean = false;
  public hoveredItemForAction: string = '';
  public clickedHoveredItemForAction: string = '';
  public showExportButton: boolean = false;
  public totalSale: number = 0;
  public totalDue: number = 0;
  public selectedInvoicesList: any[] = [];
  public sortRequestForUi: { sortBy: string, sort: string } = {sortBy: '', sort: ''};
  public showInvoiceGenerateModal: boolean = false;
  public sideMenubarIsOpen: boolean;

  private getVoucherCount: number = 0;
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
    private _toaster: ToasterService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private _activatedRoute: ActivatedRoute,
    private companyActions: CompanyActions,
    private invoiceReceiptActions: InvoiceReceiptActions
  ) {
    this.invoiceSearchRequest.page = 1;
    this.invoiceSearchRequest.count = 20;
    this.invoiceSearchRequest.entryTotalBy = '';
    this.invoiceSearchRequest.from = moment(this.datePickerOptions.startDate).format('DD-MM-YYYY');
    this.invoiceSearchRequest.to = moment(this.datePickerOptions.endDate).format('DD-MM-YYYY');
    this.invoiceSearchRequest.accountUniqueName = '';
    this.invoiceSearchRequest.invoiceNumber = '';
    this.flattenAccountListStream$ = this.store.select(p => p.general.flattenAccounts).pipe(takeUntil(this.destroyed$));
    this.invoiceActionUpdated = this.store.select(p => p.invoice.invoiceActionUpdated).pipe(takeUntil(this.destroyed$));
    this.isGetAllRequestInProcess$ = this.store.select(p => p.receipt.isGetAllRequestInProcess).pipe(takeUntil(this.destroyed$));

  }

  public ngOnInit() {
    this._activatedRoute.params.subscribe(a => {
      if (!a) {
        return;
      }
      if (a.voucherType === 'recurring') {
        return;
      }
      this.selectedVoucher = a.voucherType;
      if (this.selectedVoucher === 'credit note' || this.selectedVoucher === 'debit note') {
        this.templateType = 'voucher';
      } else {
        this.templateType = 'invoice';
      }
      // this.getVoucher(false);
    });
    // Get accounts
    this.flattenAccountListStream$.subscribe((data: IFlattenAccountsResultItem[]) => {
      let accounts: IOption[] = [];
      _.forEach(data, (item) => {
        if (_.find(item.parentGroups, (o) => _.indexOf(PARENT_GROUP_ARR, o.uniqueName) !== -1)) {
          accounts.push({label: item.name, value: item.uniqueName});
        }
      });
      this.accounts$ = observableOf(orderBy(accounts, 'label'));
    });

    this.store.select(p => p.receipt.vouchers).pipe(takeUntil(this.destroyed$)).subscribe((o: ReciptResponse) => {
      if (o) {
        this.voucherData = _.cloneDeep(o);
        let currDate = moment(moment.now());
        _.map(this.voucherData.items, (item: ReceiptItem) => {
          let dueDate = item.dueDate ? moment(item.dueDate, 'DD-MM-YYYY') : null;
          let dueDays = dueDate ? moment().diff(dueDate, 'days') : null;
          item.isSelected = false;
          item.dueDays = dueDays;
          return o;
        });

        if (this.voucherData.items.length) {
          // this.totalSale = this.voucherData.items.reduce((c, p) => {
          //   return Number(c.grandTotal) + Number(p.grandTotal);
          // }, 0);
          this.showExportButton = this.voucherData.items.every(s => s.account.uniqueName === this.voucherData.items[0].account.uniqueName);
        } else {
          // this.totalSale = 0;
          this.showExportButton = false;
        }
      }
    });

    // this.store.select(p => p.invoice.isLoadingInvoices).takeUntil(this.destroyed$).distinctUntilChanged().subscribe((o: boolean) => {
    //    this.isLoadingInvoices = _.cloneDeep(o);
    // });

    // think this is unnecessary api call
    // this.store.select(p => p.invoice.invoiceData).pipe(
    //   takeUntil(this.destroyed$),
    //   distinctUntilChanged((p: PreviewInvoiceResponseClass, q: PreviewInvoiceResponseClass) => {
    //     if (p && q) {
    //       return (p.templateUniqueName === q.templateUniqueName);
    //     }
    //     if ((p && !q) || (!p && q)) {
    //       return false;
    //     }
    //     return true;
    //   })).subscribe((o: PreviewInvoiceResponseClass) => {
    //   if (o) {
    //     /**
    //      * find if templateUniqueName is exist in company all templates
    //      * check for isDefault flag
    //      * last hope call api from first template
    //      * */
    //     this._invoiceTemplatesService.getAllCreatedTemplates(this.templateType).subscribe((res: BaseResponse<CustomTemplateResponse[], string>) => {
    //       if (res.status === 'success' && res.body.length) {
    //         let template = find(res.body, (item) => item.uniqueName === o.templateUniqueName);
    //         if (template) {
    //           this.getInvoiceTemplateDetails(template.uniqueName);
    //         } else {
    //           template = find(res.body, (item) => item.isDefault);
    //           if (template) {
    //             this.getInvoiceTemplateDetails(template.uniqueName);
    //           } else {
    //             this.getInvoiceTemplateDetails(res.body[0].uniqueName);
    //           }
    //         }
    //       }
    //     });
    //   }
    // });

    // Refresh report data according to universal date
    this.store.select(createSelector([(state: AppState) => state.session.applicationDate], (dateObj: Date[]) => {
      if (dateObj) {
        this.getVoucherCount++;
        if (this.getVoucherCount > 1) {
          this.universalDate = _.cloneDeep(dateObj);
          // this.invoiceSearchRequest.dateRange = this.universalDate;
          this.datePickerOptions.startDate = moment(this.universalDate[0], 'DD-MM-YYYY').toDate();
          this.datePickerOptions.endDate = moment(this.universalDate[1], 'DD-MM-YYYY').toDate();

          this.invoiceSearchRequest.from = moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
          this.invoiceSearchRequest.to = moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
          this.isUniversalDateApplicable = true;
          this.getVoucher(true);
        }
      }
    })).pipe(takeUntil(this.destroyed$)).subscribe();

    this.invoiceActionUpdated.subscribe((a) => {
      if (a) {
        this.getVoucher(this.isUniversalDateApplicable);
      }
    });
    this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(this.prepareModelForInvoiceReceiptApi(''), this.selectedVoucher));

    this.selectedCompany$ = this.store.select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
      if (!companies) {
        return;
      }

      let selectedCmp = companies.find(cmp => {
        if (cmp && cmp.uniqueName) {
          return cmp.uniqueName === uniqueName;
        } else {
          return false;
        }
      });
      if (!selectedCmp) {
        return;
      }
      if (selectedCmp) {
        this.activeFinancialYear = selectedCmp.activeFinancialYear;
        this.store.dispatch(this.companyActions.setActiveFinancialYear(this.activeFinancialYear));
        if (this.activeFinancialYear) {
          this.datePickerOptions.ranges['This Financial Year to Date'] = [
            moment(this.activeFinancialYear.financialYearStarts, 'DD-MM-YYYY').startOf('day'),
            moment()
          ];
          this.datePickerOptions.ranges['Last Financial Year'] = [
            moment(this.activeFinancialYear.financialYearStarts, 'DD-MM-YYYY').subtract(1, 'year'),
            moment(this.activeFinancialYear.financialYearEnds, 'DD-MM-YYYY').subtract(1, 'year')
          ];
        }
      }
      return selectedCmp;
    })).pipe(takeUntil(this.destroyed$));
    this.selectedCompany$.subscribe(cmp => {
      if (cmp) {
        this.activeFinancialYear = cmp.activeFinancialYear;
      }
    });

    this.voucherNumberInput.valueChanges.pipe(
      debounceTime(700),
      distinctUntilChanged(),
      takeUntil(this.destroyed$)
    ).subscribe(s => {
      this.invoiceSearchRequest.voucherNumber = s;
      this.getVoucher(this.isUniversalDateApplicable);
      if (s === '') {
        this.showInvoiceNoSearch = false;
      }
    });

    this.accountUniqueNameInput.valueChanges.pipe(
      debounceTime(700),
      distinctUntilChanged(),
      takeUntil(this.destroyed$)
    ).subscribe(s => {

      this.invoiceSearchRequest.q = s;
      this.getVoucher(this.isUniversalDateApplicable);
      if (s === '') {
        this.showCustomerSearch = false;
      }
    });

    this.store.pipe(select(s => s.general.sideMenuBarOpen), takeUntil(this.destroyed$))
      .subscribe(result => this.sideMenubarIsOpen = result);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedVoucher'] && changes['selectedVoucher'].currentValue !== changes['selectedVoucher'].previousValue) {
      this.selectedVoucher = changes['selectedVoucher'].currentValue;

      if (this.selectedVoucher === 'credit note' || this.selectedVoucher === 'debit note') {
        this.templateType = 'voucher';
      } else {
        this.templateType = 'invoice';
      }
      this.getVoucher(false);
    }
  }

  public toggleBodyClass() {
    if (this.selectedInvoice) {
      document.querySelector('body').classList.add('fixed');
    } else {
      document.querySelector('body').classList.remove('fixed');
    }
  }

  public toggleAdvanceSearchPopup() {
    this.advanceSearch.toggle();
  }

  public toggleBulkUpdatePopup() {
    this.bulkUpdate.toggle();
  }

  public toggleEwayBillPopup() {
    this.eWayBill.toggle();
    this._invoiceService.selectedInvoicesLists = [];
    this._invoiceService.VoucherType = this.selectedVoucher;
    this._invoiceService.setSelectedInvoicesList(this.selectedInvoicesList);
  }

  public loadDownloadOrSendMailComponent() {
    let transactionData = null;
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(DownloadOrSendInvoiceOnMailComponent);
    let viewContainerRef = this.downloadOrSendMailComponent.viewContainerRef;
    viewContainerRef.remove();

    let componentInstanceView = componentFactory.create(viewContainerRef.parentInjector);
    viewContainerRef.insert(componentInstanceView.hostView);

    let componentInstance = componentInstanceView.instance as DownloadOrSendInvoiceOnMailComponent;
    componentInstance.closeModelEvent.subscribe(e => this.closeDownloadOrSendMailPopup(e));
    componentInstance.downloadOrSendMailEvent.subscribe(e => this.onDownloadOrSendMailEvent(e));
    componentInstance.downloadInvoiceEvent.subscribe(e => this.ondownloadInvoiceEvent(e));
    componentInstance.showPdfWrap = false;
    // componentInstance.totalItems = s.count * s.totalPages;
    // componentInstance.itemsPerPage = s.count;
    // componentInstance.maxSize = 5;
    // componentInstance.writeValue(s.page);
    // componentInstance.boundaryLinks = true;
    // componentInstance.pageChanged.subscribe(e => {
    //   this.pageChanged(e);
    // });
  }

  public getInvoiceTemplateDetails(templateUniqueName: string) {
    if (templateUniqueName) {
      this.store.dispatch(this.invoiceActions.GetTemplateDetailsOfInvoice(templateUniqueName));
    } else {
      this.store.dispatch(this.invoiceActions.GetTemplateDetailsOfInvoice('j8bzr0k3lh0khbcje8bh'));
    }
  }

  public pageChanged(ev: any): void {
    if (event.type !== 'click') {
      return;
    }
    this.invoiceSearchRequest.page = ev.page;
    this.getVoucher(false);
  }

  public getVoucherByFilters(f: NgForm) {

    if (f.valid) {
      this.isUniversalDateApplicable = false;
      this.getVoucher(false);
    }
  }

  public onPerformAction(item, ev: string) {
    if (ev) {
      let actionToPerform = ev;
      if (actionToPerform === 'paid') {
        this.selectedInvoice = item;
        this.performActionOnInvoiceModel.show();
      } else {
        this.store.dispatch(this.invoiceActions.ActionOnInvoice(item.uniqueName, {action: actionToPerform}));
      }
    }
  }

  public onDeleteBtnClick() {
    let allInvoices = _.cloneDeep(this.voucherData.items);
    this.selectedInvoice = allInvoices.find((o) => o.uniqueName === this.selectedItems[0]);
    this.invoiceConfirmationModel.show();
  }

  public deleteConfirmedInvoice() {
    this.invoiceConfirmationModel.hide();
    let model = {
      invoiceNumber: this.selectedInvoice.voucherNumber,
      voucherType: this.selectedVoucher
    };
    this.store.dispatch(this.invoiceReceiptActions.DeleteInvoiceReceiptRequest(model, this.selectedInvoice.account.uniqueName));
  }

  public closeConfirmationPopup() {
    this.invoiceConfirmationModel.hide();
  }

  public closePerformActionPopup(data) {
    this.performActionOnInvoiceModel.hide();
    if (data) {
      data.action = 'paid';
      this.store.dispatch(this.invoiceActions.ActionOnInvoice(this.selectedInvoice.uniqueName, data));
    }
  }

  /**
   * onSelectInvoice
   */
  public onSelectInvoice(invoice: ReceiptItem) {
    this.selectedInvoice = _.cloneDeep(invoice);
    this.toggleBodyClass();
    // let downloadVoucherRequestObject = {
    //   voucherNumber: [this.selectedInvoice.voucherNumber],
    //   voucherType: this.selectedVoucher,
    //   accountUniqueName: this.selectedInvoice.account.uniqueName
    // };
    // this.store.dispatch(this.invoiceReceiptActions.VoucherPreview(downloadVoucherRequestObject, downloadVoucherRequestObject.accountUniqueName));
    // this.store.dispatch(this.invoiceActions.PreviewOfGeneratedInvoice(invoice.account.uniqueName, invoice.voucherNumber));
    // this.loadDownloadOrSendMailComponent();
    // this.downloadOrSendMailModel.show();
  }

  public closeDownloadOrSendMailPopup(userResponse: { action: string }) {
    this.downloadOrSendMailModel.hide();
    this.showInvoiceGenerateModal = userResponse.action === 'update';
    if (userResponse.action === 'update') {
      this.store.dispatch(this.invoiceActions.VisitToInvoiceFromPreview());
      this.invoiceGenerateModel.show();
    } else if (userResponse.action === 'closed') {
      this.store.dispatch(this.invoiceActions.ResetInvoiceData());
    }
  }

  public closeInvoiceModel(e) {
    this.invoiceGenerateModel.hide();
    this.showInvoiceGenerateModal = false;
    setTimeout(() => {
      this.store.dispatch(this.invoiceActions.ResetInvoiceData());
    }, 2000);
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

  /**
   * onDownloadOrSendMailEvent
   */
  public onDownloadOrSendMailEvent(userResponse: { action: string, emails: string[], numbers: string[], typeOfInvoice: string[] }) {
    if (userResponse.action === 'download') {
      this.downloadFile();
    } else if (userResponse.action === 'send_mail' && userResponse.emails && userResponse.emails.length) {
      this.store.dispatch(this.invoiceActions.SendInvoiceOnMail(this.selectedInvoice.account.uniqueName, {
        emailId: userResponse.emails,
        invoiceNumber: [this.selectedInvoice.voucherNumber],
        typeOfInvoice: userResponse.typeOfInvoice
      }));
    } else if (userResponse.action === 'send_sms' && userResponse.numbers && userResponse.numbers.length) {
      this.store.dispatch(this.invoiceActions.SendInvoiceOnSms(this.selectedInvoice.account.uniqueName, {numbers: userResponse.numbers}, this.selectedInvoice.voucherNumber));
    }
  }

  public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {
    if (this.showAdvanceSearchIcon) {
      this.advanceSearchFilter.sort = type;
      this.advanceSearchFilter.sortBy = columnName;
      this.advanceSearchFilter.from = this.invoiceSearchRequest.from;
      this.advanceSearchFilter.to = this.invoiceSearchRequest.to;
      this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(this.advanceSearchFilter, this.selectedVoucher));
    } else {
      if (this.invoiceSearchRequest.sort !== type || this.invoiceSearchRequest.sortBy !== columnName) {
        this.invoiceSearchRequest.sort = type;
        this.invoiceSearchRequest.sortBy = columnName;
        this.getVoucher(this.isUniversalDateApplicable);
      }
    }

    this.sortRequestForUi.sort = type;
    this.sortRequestForUi.sortBy = columnName;
  }

  public getVoucher(isUniversalDateSelected: boolean) {
    this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(this.prepareModelForInvoiceReceiptApi(isUniversalDateSelected), this.selectedVoucher));
    // this.store.dispatch(this.invoiceActions.GetAllInvoices(this.prepareQueryParamsForInvoiceApi(isUniversalDateSelected), this.prepareModelForInvoiceApi()));
  }

  public prepareModelForInvoiceReceiptApi(isUniversalDateSelected): InvoiceReceiptFilter {
    let model: any = {};
    let o = _.cloneDeep(this.invoiceSearchRequest);

    if (o.voucherNumber) {
      model.voucherNumber = o.voucherNumber;
    }

    if (o.invoiceNumber) {
      model.voucherNumber = o.invoiceNumber;
    }

    if (o.q) {
      model.q = o.q;
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
    if (this.universalDate && this.universalDate.length && this.isUniversalDateApplicable) {
      fromDate = moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
      toDate = moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
    }
    model.sort = o.sort;
    model.sortBy = o.sortBy;
    model.from = o.from;
    model.to = o.to;
    model.count = o.count;
    model.page = o.page;
    return model;
  }

  public bsValueChange(event: any) {
    this.showAdvanceSearchIcon = true;
    if (event) {
      this.invoiceSearchRequest.from = moment(event.picker.startDate._d).format(GIDDH_DATE_FORMAT);
      this.invoiceSearchRequest.to = moment(event.picker.endDate._d).format(GIDDH_DATE_FORMAT);
    }
    this.getVoucher(this.isUniversalDateApplicable);
  }

  public toggleSearch(fieldName: string, el: any) {
    if (fieldName === 'invoiceNumber') {
      this.showInvoiceNoSearch = true;
      this.showCustomerSearch = false;
      this.showProformaSearch = false;

    } else if (fieldName === 'ProformaPurchaseOrder') {
      this.showInvoiceNoSearch = false;
      this.showCustomerSearch = false;
      this.showProformaSearch = true;

    } else {
      this.showCustomerSearch = true;
      this.showInvoiceNoSearch = false;
      this.showProformaSearch = false;
    }

    setTimeout(() => {
      el.focus();
    }, 200);
  }

  public ondownloadInvoiceEvent(invoiceCopy) {
    let dataToSend = {
      invoiceNumber: [this.selectedInvoice.voucherNumber],
      typeOfInvoice: invoiceCopy
    };
    this.store.dispatch(this.invoiceActions.DownloadInvoice(this.selectedInvoice.account.uniqueName, dataToSend));
  }

  public toggleAllItems(type: boolean) {
    this.allItemsSelected = type;
    if (this.voucherData && this.voucherData.items && this.voucherData.items.length) {
      this.voucherData.items = _.map(this.voucherData.items, (item: ReceiptItem) => {
        item.isSelected = this.allItemsSelected;
        this.itemStateChanged(item);
        return item;
      });
      // this.insertItemsIntoArr();
    }
  }

  public toggleItem(item: any, action: boolean) {
    item.isSelected = action;
    if (action) {
      // this.countAndToggleVar();
    } else {
      this.allItemsSelected = false;
    }
    this.itemStateChanged(item);
    // console.log('selectedInvoicesList', this.selectedInvoicesList );
  }

  public clickedOutside(event, el, fieldName: string) {

    if (fieldName === 'invoiceNumber') {
      if (this.voucherNumberInput.value !== null && this.voucherNumberInput.value !== '') {
        return;
      }
    } else if (fieldName === 'accountUniqueName') {
      if (this.accountUniqueNameInput.value !== null && this.accountUniqueNameInput.value !== '') {
        return;
      }
    } else if (fieldName === 'ProformaPurchaseOrder') {
      if (this.ProformaPurchaseOrder.value !== null && this.ProformaPurchaseOrder.value !== '') {
        return;
      }
    }
    if (this.invoiceSearchRequest[fieldName] !== '') {
      return;
    }

    if (this.childOf(event.target, el)) {
      return;
    } else {
      if (fieldName === 'invoiceNumber') {
        this.showInvoiceNoSearch = false;
      } else if (fieldName === 'ProformaPurchaseOrder') {
        this.showProformaSearch = false;
      } else {
        this.showCustomerSearch = false;
      }
    }
  }

  /* tslint:disable */
  public childOf(c, p) {
    while ((c = c.parentNode) && c !== p) {
    }
    return !!c;
  }

  public itemStateChanged(item: any) {
    let index = this.selectedItems.findIndex(f => f === item.uniqueName);

    if (index > -1) {
      this.selectedItems = this.selectedItems.filter(f => f !== item.uniqueName);
      this.selectedInvoicesList = this.selectedInvoicesList.filter(f => f !== item);
    } else {
      this.selectedItems.push(item.uniqueName);
      this.selectedInvoicesList.push(item);
    }
  }

  public applyAdvanceSearch(request: InvoiceFilterClassForInvoicePreview) {
    this.showAdvanceSearchIcon = true;
    this.datePickerOptions.startDate = moment().subtract(30, 'days');
    this.datePickerOptions.endDate = moment();
    this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(request, this.selectedVoucher));
  }

  public resetAdvanceSearch() {
    this.showAdvanceSearchIcon = false;
    if (this.advanceSearchComponent && this.advanceSearchComponent.allShSelect) {
      this.advanceSearchComponent.allShSelect.forEach(f => {
        f.clear();
      });
    }
    this.advanceSearchFilter = new InvoiceFilterClassForInvoicePreview();

    this.sortRequestForUi = {sortBy: '', sort: 'asc'};
    this.invoiceSearchRequest.sort = 'asc';
    this.invoiceSearchRequest.sortBy = '';
    this.invoiceSearchRequest.q = '';
    this.invoiceSearchRequest.voucherNumber = '';
    this.getVoucher(this.isUniversalDateApplicable);
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public validateInvoiceForEway() {
    let allInvoices = _.cloneDeep(this.voucherData.items);
    this.selectedInvoice = allInvoices.find((o) => o.uniqueName === this.selectedItems[0]);
    this.validateInvoiceobj.invoiceNumber = this.selectedInvoice.voucherNumber;
    this._invoiceService.validateInvoiceForEwaybill(this.validateInvoiceobj).subscribe(res => {
      if (res.status === 'success') {
        if (res.body.errorMessage) {
          this._toaster.warningToast(res.body.errorMessage);
        }
      }
    });
  }
}

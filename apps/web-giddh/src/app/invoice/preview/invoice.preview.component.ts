import { Observable, of as observableOf, of, ReplaySubject } from 'rxjs';

import { debounceTime, distinctUntilChanged, publishReplay, refCount, take, takeUntil } from 'rxjs/operators';
import { IOption } from '../../theme/ng-select/option.interface';
import { ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import * as _ from '../../lodash-optimized';
import { orderBy } from '../../lodash-optimized';
import { saveAs } from 'file-saver';
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
import { BreakpointObserver } from '@angular/cdk/layout';

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
  {label: 'Cancel', value: 'cancel'}
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
  @ViewChild('advanceSearchComponent', {read: InvoiceAdvanceSearchComponent}) public advanceSearchComponent: InvoiceAdvanceSearchComponent;
  @Input() public selectedVoucher: string = 'sales';

  public advanceSearchFilter: InvoiceFilterClassForInvoicePreview = new InvoiceFilterClassForInvoicePreview();
  public bsConfig: Partial<BsDatepickerConfig> = {
    showWeekNumbers: false,
    dateInputFormat: 'DD-MM-YYYY',
    rangeInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-green myDpClass'
  };
  public showPdfWrap: boolean = false;
  public base64Data: string;
  public selectedInvoice: ReceiptItem;
  public invoiceSearchRequest: InvoiceFilterClassForInvoicePreview = new InvoiceFilterClassForInvoicePreview();
  public voucherData: any;
  public filtersForEntryTotal: IOption[] = COMPARISON_FILTER;
  public previewDropdownOptions: IOption[] = PREVIEW_OPTIONS;
  public counts: IOption[] = COUNTS;
  public accounts$: Observable<IOption[]>;
  public moment = moment;
  public modalRef: BsModalRef;
  public showInvoiceNoSearch = false;
  public modalConfig = {
    animated: true,
    keyboard: true,
    backdrop: 'static',
    ignoreBackdropClick: true
  };
  public modalUniqueName: string;
  public startDate: Date;
  public endDate: Date;
  public activeFinancialYear: ActiveFinancialYear;
  public innerWidth: any;
  public displayBtn = false; // ek no


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
  public universalDate$: Observable<any>;
  public invoiceActionUpdated: Observable<boolean> = of(false);
  public isGetAllRequestInProcess$: Observable<boolean> = of(true);
  public templateType: any;
  public companies$: Observable<CompanyResponse[]>;
  public selectedCompany$: Observable<CompanyResponse>;
  public isDeleteSuccess$: Observable<boolean>;
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
  public showMoreBtn: boolean = false;
  public selectedItemForMoreBtn = '';
  public exportInvoiceRequestInProcess$: Observable<boolean> = of(false);
  public exportedInvoiceBase64res$: Observable<any>;
  public isFabclicked: boolean = false;

  public invoiceSelectedDate: any = {
    fromDates: '',
    toDates: '',
    dataToSend: {}
  };
  private exportcsvRequest: any = {
    from: '',
    to: ''
  }
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
    private invoiceReceiptActions: InvoiceReceiptActions,
    private cdr: ChangeDetectorRef,
    private _breakPointObservar: BreakpointObserver
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
    this.exportInvoiceRequestInProcess$ = this.store.select(p => p.invoice.exportInvoiceInprogress).pipe(takeUntil(this.destroyed$));
    this.exportedInvoiceBase64res$ = this.store.select(p => p.invoice.exportInvoicebase64Data).pipe(takeUntil(this.destroyed$));
    this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {

    this._breakPointObservar.observe(['(max-width:768px)']).subscribe(res => {
      console.log(res.matches);
      this.displayBtn = res.matches;
    })

    this.advanceSearchFilter.page = 1;
    this.advanceSearchFilter.count = 20;
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
      this.getVoucher(false);
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

    this.store.select(p => p.receipt.vouchers).pipe(takeUntil(this.destroyed$), publishReplay(1), refCount()).subscribe((o: ReciptResponse) => {
      if (o) {
        this.voucherData = _.cloneDeep(o);
        let currDate = moment(moment.now());
        _.map(this.voucherData.items, (item: ReceiptItem) => {
          let dueDate = item.dueDate ? moment(item.dueDate, 'DD-MM-YYYY') : null;

          if (dueDate) {
            if (dueDate.isAfter(moment()) || ['paid', 'cancel'].includes(item.balanceStatus)) {
              item.dueDays = null;
            } else {
              let dueDays = dueDate ? moment().diff(dueDate, 'days') : null;
              item.isSelected = false;
              item.dueDays = dueDays;
            }
          } else {
            item.dueDays = null;
          }
          setTimeout(() => {

            this.cdr.detectChanges();
          }, 100);
          return o;
        });

        if (this.voucherData.items.length) {
          // this.totalSale = this.voucherData.items.reduce((c, p) => {
          //   return Number(c.grandTotal) + Number(p.grandTotal);
          // }, 0);
          this.showExportButton = this.voucherData.items.every(s => s.account.uniqueName === this.voucherData.items[0].account.uniqueName);
        } else {
          // this.totalSale = 0;
          if(this.voucherData.page>1) {
            this.voucherData.totalItems = this.voucherData.count * (this.voucherData.page - 1);
            this.advanceSearchFilter.page = Math.ceil(this.voucherData.totalItems / this.voucherData.count);
            this.invoiceSearchRequest.page = Math.ceil(this.voucherData.totalItems / this.voucherData.count);
            this.getVoucher(false);
          }
          this.showExportButton = false;
        }
      }
    });

    //--------------------- Refresh report data according to universal date--------------------------------
    this.store.select(createSelector([(state: AppState) => state.session.applicationDate], (a) => {

      if (a) {
        if (localStorage.getItem('universalSelectedDate')) {

          let universalStorageData = localStorage.getItem('universalSelectedDate').split(',');
          if ((moment(universalStorageData[0]).format(GIDDH_DATE_FORMAT) === moment(a[0]).format(GIDDH_DATE_FORMAT)) && (moment(universalStorageData[1]).format(GIDDH_DATE_FORMAT) === moment(a[1]).format(GIDDH_DATE_FORMAT))) {
            //console.log('universal not change');
            if (window.localStorage && localStorage.getItem('invoiceSelectedDate')) {
              let storedSelectedDate = JSON.parse(localStorage.getItem('invoiceSelectedDate'));
              this.showAdvanceSearchIcon = true;
              this.datePickerOptions = {
                ...this.datePickerOptions,
                startDate: moment(storedSelectedDate.fromDates, 'DD-MM-YYYY').toDate(),
                endDate: moment(storedSelectedDate.toDates, 'DD-MM-YYYY').toDate()
              };
              this.invoiceSearchRequest.from = storedSelectedDate.fromDates;
              this.invoiceSearchRequest.to = storedSelectedDate.toDates;
              this.isUniversalDateApplicable = false;

            } else {
              this.datePickerOptions = {
                ...this.datePickerOptions, startDate: moment(a[0], 'DD-MM-YYYY').toDate(),
                endDate: moment(a[1], 'DD-MM-YYYY').toDate()
              };
              this.invoiceSearchRequest.from = moment(a[0]).format(GIDDH_DATE_FORMAT);
              this.invoiceSearchRequest.to = moment(a[1]).format(GIDDH_DATE_FORMAT);
              this.isUniversalDateApplicable = true;
            }
          } else {
            //console.log('universal has  changed');
            this.datePickerOptions = {
              ...this.datePickerOptions, startDate: moment(a[0], 'DD-MM-YYYY').toDate(),
              endDate: moment(a[1], 'DD-MM-YYYY').toDate()
            };
            this.invoiceSearchRequest.from = moment(a[0]).format(GIDDH_DATE_FORMAT);
            this.invoiceSearchRequest.to = moment(a[1]).format(GIDDH_DATE_FORMAT);
            this.isUniversalDateApplicable = true;
          }
        } else {
          this.datePickerOptions = {
            ...this.datePickerOptions, startDate: moment(a[0], 'DD-MM-YYYY').toDate(),
            endDate: moment(a[1], 'DD-MM-YYYY').toDate()
          };
          this.invoiceSearchRequest.from = moment(a[0]).format(GIDDH_DATE_FORMAT);
          this.invoiceSearchRequest.to = moment(a[1]).format(GIDDH_DATE_FORMAT);
          this.isUniversalDateApplicable = true;
        }
      }
      //  this.getVoucherCount++;
      //     if (this.getVoucherCount > 1) {
      //       this.getVoucher(true);
      //     }
      this.getVoucher(true);
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
      this.invoiceSearchRequest.q = s;
      this.getVoucher(this.isUniversalDateApplicable);
      if (s === '') {
        this.showCustomerSearch ? this.showInvoiceNoSearch = false : this.showInvoiceNoSearch = true ;
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
        this.showInvoiceNoSearch ? this.showCustomerSearch = false : this.showCustomerSearch = true;
      }
    });

    this.store.pipe(select(s => s.receipt.isDeleteSuccess), takeUntil(this.destroyed$)).subscribe(res => {
      if (res) {
        this.selectedItems = [];
      }
    });
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
    // if (ev.type !== 'click') {
    //   return;
    // }
    this.invoiceSearchRequest.page = ev.page;
    this.getVoucher(this.isUniversalDateApplicable);
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
    let downloadVoucherRequestObject = {
      voucherNumber: [this.selectedInvoice.voucherNumber],
      voucherType: this.selectedVoucher,
      accountUniqueName: this.selectedInvoice.account.uniqueName
    };
    this.store.dispatch(this.invoiceReceiptActions.VoucherPreview(downloadVoucherRequestObject, downloadVoucherRequestObject.accountUniqueName));
    // this.store.dispatch(this.invoiceActions.PreviewOfGeneratedInvoice(invoice.account.uniqueName, invoice.voucherNumber));
    this.loadDownloadOrSendMailComponent();
    this.downloadOrSendMailModel.show();
  }


  public closeDownloadOrSendMailPopup(userResponse: { action: string }) {
    this.downloadOrSendMailModel.hide();
    if (userResponse.action === 'update') {
      this.store.dispatch(this.invoiceActions.VisitToInvoiceFromPreview());
      this.invoiceGenerateModel.show();
    } else if (userResponse.action === 'closed') {
      this.store.dispatch(this.invoiceActions.ResetInvoiceData());
    }
  }

  public closeInvoiceModel(e) {
    this.invoiceGenerateModel.hide();
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
        voucherNumber: [this.selectedInvoice.voucherNumber],
        typeOfInvoice: userResponse.typeOfInvoice,
        voucherType: this.selectedVoucher
      }));
    } else if (userResponse.action === 'send_sms' && userResponse.numbers && userResponse.numbers.length) {
      this.store.dispatch(this.invoiceActions.SendInvoiceOnSms(this.selectedInvoice.account.uniqueName, {numbers: userResponse.numbers}, this.selectedInvoice.voucherNumber));
    }
  }

  public setToday(model: string) {
    this.invoiceSearchRequest[model] = String(moment());
  }

  public clearDate(model: string) {
    this.invoiceSearchRequest[model] = '';
  }

  public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {
    this.showAdvanceSearchIcon = true;
    if (this.showAdvanceSearchIcon) {
      this.advanceSearchFilter.sort = type;
      this.advanceSearchFilter.sortBy = columnName;
      this.advanceSearchFilter.from = this.invoiceSearchRequest.from;
      this.advanceSearchFilter.to = this.invoiceSearchRequest.to;
      if (this.invoiceSearchRequest.page) {
        this.advanceSearchFilter.page = this.invoiceSearchRequest.page;
      }
      this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(this.advanceSearchFilter, this.selectedVoucher));
    } else {
      if (this.invoiceSearchRequest.sort !== type || this.invoiceSearchRequest.sortBy !== columnName) {
        this.invoiceSearchRequest.sort = type;
        this.invoiceSearchRequest.sortBy = columnName;
        this.getVoucher(this.isUniversalDateApplicable);
      }
    }
  }

  public getVoucher(isUniversalDateSelected: boolean) {
    this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(this.prepareModelForInvoiceReceiptApi(isUniversalDateSelected), this.selectedVoucher));
    // this.store.dispatch(this.invoiceActions.GetAllInvoices(this.prepareQueryParamsForInvoiceApi(isUniversalDateSelected), this.prepareModelForInvoiceApi()));
  }

  // Removed Junk Code

  public prepareModelForInvoiceReceiptApi(isUniversalDateSelected): InvoiceReceiptFilter {
    let model: any = {};
    let o = _.cloneDeep(this.invoiceSearchRequest);
    let advanceSearch = _.cloneDeep(this.advanceSearchFilter);

    if (o.voucherNumber) {
      model.voucherNumber = o.voucherNumber;
    }
    if (o.page) {
      advanceSearch.page = o.page;
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
    if (isUniversalDateSelected || this.showAdvanceSearchIcon) {
      model = advanceSearch;
      if (!model.invoiceDate && !model.dueDate) {
        model.from = this.invoiceSearchRequest.from;
        model.to = this.invoiceSearchRequest.to;
      }
    }
    if (o.invoiceNumber) {
      model.voucherNumber = o.invoiceNumber;
    }

    if (o.q) {
      model.q = o.q;
    }

    if (advanceSearch && advanceSearch.sortBy) {
      model.sortBy = advanceSearch.sortBy;
    }
    if (advanceSearch && advanceSearch.sort) {
      model.sort = advanceSearch.sort;
    }
    return model;
  }

  public bsValueChange(event: any) {
    this.showAdvanceSearchIcon = true;
    if (event) {
      this.invoiceSearchRequest.from = moment(event.picker.startDate._d).format(GIDDH_DATE_FORMAT);
      this.invoiceSearchRequest.to = moment(event.picker.endDate._d).format(GIDDH_DATE_FORMAT);
      this.invoiceSelectedDate.fromDates = this.invoiceSearchRequest.from;
      this.invoiceSelectedDate.toDates = this.invoiceSearchRequest.to;
    }

    if (window.localStorage) {
      localStorage.setItem('invoiceSelectedDate', JSON.stringify(this.invoiceSelectedDate));
    }
    this.getVoucher(this.isUniversalDateApplicable);
  }

  public toggleSearch(fieldName: string) {
    if (fieldName === 'invoiceNumber') {
      this.showInvoiceNoSearch = true;
      this.showCustomerSearch = false;
      this.showProformaSearch = false;

      setTimeout(() => {
        this.invoiceSearch.nativeElement.focus();
      }, 200);
    } else if (fieldName === 'ProformaPurchaseOrder') {
      this.showInvoiceNoSearch = false;
      this.showCustomerSearch = false;
      this.showProformaSearch = true;

      setTimeout(() => {
        this.perfomaSearch.nativeElement.focus();
      }, 200);
    } else {
      this.showCustomerSearch = true;
      this.showInvoiceNoSearch = false;
      this.showProformaSearch = false;

      setTimeout(() => {
        this.customerSearch.nativeElement.focus();
      }, 200);
    }
  }

  public ondownloadInvoiceEvent(invoiceCopy) {
    let dataToSend = {
      voucherNumber: [this.selectedInvoice.voucherNumber],
      typeOfInvoice: invoiceCopy,
      voucherType: this.selectedVoucher
    };
    this._invoiceService.DownloadInvoice(this.selectedInvoice.account.uniqueName, dataToSend)
      .subscribe(res => {
        if (res) {
          return saveAs(res, `${dataToSend.voucherNumber[0]}.` + 'pdf');
        } else {
          this._toaster.errorToast('Something went wrong Please try again!');
        }
      });
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

  public clickedOutside(event: Event, el, fieldName: string) {

    if (fieldName === 'invoiceNumber') {
      if (this.voucherNumberInput.value !== null && this.voucherNumberInput.value !== '') {
        this.voucherNumberInput.setValue('');
        return;
      }
    } else if (fieldName === 'accountUniqueName') {
      if (this.accountUniqueNameInput.value !== null && this.accountUniqueNameInput.value !== '') {
        return;
      }
      event.stopPropagation();
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
        this.voucherNumberInput.value ? this.showInvoiceNoSearch = true : this.showInvoiceNoSearch = false;
      } else if (fieldName === 'ProformaPurchaseOrder') {
        this.showProformaSearch = false;
      } else {
        if (fieldName === 'accountUniqueName') {
          this.accountUniqueNameInput.value ? this.showCustomerSearch = true : this.showCustomerSearch = false;
        } else {
          this.showCustomerSearch = false;
        }
      }
    }
  }

  public fabBtnclicked() {
    this.isFabclicked = !this.isFabclicked;
    if (this.isFabclicked){
      document.querySelector('body').classList.add('overlayBg');
    } else {
      document.querySelector('body').classList.remove('overlayBg');
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
    if (!request.invoiceDate && !request.dueDate) {
      request.from = this.invoiceSearchRequest.from;
      request.to = this.invoiceSearchRequest.to;
    }
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
    this.advanceSearchFilter.page = 1;
    this.advanceSearchFilter.count = 20;

    this.invoiceSearchRequest.sort = 'asc';
    this.invoiceSearchRequest.sortBy = '';
    this.invoiceSearchRequest.page = 1;
    this.invoiceSearchRequest.count = 20;
    this.invoiceSearchRequest.voucherNumber = '';
    this.getVoucher(this.isUniversalDateApplicable);
  }

  public ngOnDestroy() {
    this.universalDate$.pipe(take(1)).subscribe(a => {
      if (a && window.localStorage) {
        localStorage.setItem('universalSelectedDate', a);
      }
    });
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
  public exportCsvDownload() {
    this.exportcsvRequest.from = this.invoiceSearchRequest.from;
    this.exportcsvRequest.to = this.invoiceSearchRequest.to;
     let dataTosend = { accountUniqueName : ''  };
      if(this.selectedInvoicesList[0].account.uniqueName) {
     dataTosend.accountUniqueName = this.selectedInvoicesList[0].account.uniqueName;
      }     
      this.exportcsvRequest.dataToSend =  dataTosend;
    this.store.dispatch(this.invoiceActions.DownloadExportedInvoice(this.exportcsvRequest));
    this.exportedInvoiceBase64res$.pipe(debounceTime(800), take(1)).subscribe(res => {
      if (res) {
        if (res.status === 'success') {
          let blob = this.base64ToBlob(res.body, 'application/xls', 512);
          return saveAs(blob, `${dataTosend.accountUniqueName}-invoices.xls`);
        } else {
          this._toaster.errorToast(res.message);
        }
      }
    });
  }
}

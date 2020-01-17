import { combineLatest, Observable, of as observableOf, of, ReplaySubject } from 'rxjs';

import { debounceTime, distinctUntilChanged, publishReplay, refCount, take, takeUntil } from 'rxjs/operators';
import { IOption } from '../../theme/ng-select/option.interface';
import { ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import * as _ from '../../lodash-optimized';
import { cloneDeep, orderBy, uniqBy } from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { InvoiceFilterClassForInvoicePreview, InvoicePreviewDetailsVm } from '../../models/api-models/Invoice';
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
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceReceiptFilter, ReceiptItem, ReciptResponse } from 'apps/web-giddh/src/app/models/api-models/recipt';
import { InvoiceReceiptActions } from 'apps/web-giddh/src/app/actions/invoice/receipt/receipt.actions';
import { CompanyResponse, ValidateInvoice } from 'apps/web-giddh/src/app/models/api-models/Company';
import { CompanyActions } from 'apps/web-giddh/src/app/actions/company.actions';
import { InvoiceAdvanceSearchComponent } from './models/advanceSearch/invoiceAdvanceSearch.component';
import { ToasterService } from '../../services/toaster.service';
import { InvoiceSetting } from '../../models/interfaces/invoice.setting.interface';
import { VoucherTypeEnum } from '../../models/api-models/Sales';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DaterangePickerComponent } from '../../theme/ng2-daterangepicker/daterangepicker.component';
import { saveAs } from 'file-saver';
import { GeneralService } from '../../services/general.service';
import { ReceiptService } from "../../services/receipt.service";
import { InvoicePaymentModelComponent } from './models/invoicePayment/invoice.payment.model.component';

const PARENT_GROUP_ARR = ['sundrydebtors', 'bankaccounts', 'revenuefromoperations', 'otherincome', 'cash'];

/** Multi currency modules includes Cash/Sales Invoice and CR/DR note */
const MULTI_CURRENCY_MODULES = [VoucherTypeEnum.sales, VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote];

const COMPARISON_FILTER = [
    { label: 'Greater Than', value: 'greaterThan' },
    { label: 'Less Than', value: 'lessThan' },
    { label: 'Greater Than or Equals', value: 'greaterThanOrEquals' },
    { label: 'Less Than or Equals', value: 'lessThanOrEquals' },
    { label: 'Equals', value: 'equals' }
];

@Component({
    selector: 'app-invoice-preview',
    templateUrl: './invoice.preview.component.html',
    styleUrls: ['./invoice.preview.component.scss'],
})
export class InvoicePreviewComponent implements OnInit, OnChanges, OnDestroy {

    public validateInvoiceobj: ValidateInvoice = { invoiceNumber: null };
    @ViewChild('invoiceConfirmationModel') public invoiceConfirmationModel: ModalDirective;
    @ViewChild('performActionOnInvoiceModel') public performActionOnInvoiceModel: ModalDirective;
    @ViewChild('downloadOrSendMailModel') public downloadOrSendMailModel: ModalDirective;
    @ViewChild('invoiceGenerateModel') public invoiceGenerateModel: ModalDirective;
    @ViewChild('downloadOrSendMailComponent') public downloadOrSendMailComponent: ElementViewContainerRef;
    @ViewChild('advanceSearch') public advanceSearch: ModalDirective;
    @ViewChild(DaterangePickerComponent) public dp: DaterangePickerComponent;
    @ViewChild('bulkUpdate') public bulkUpdate: ModalDirective;
    @ViewChild('eWayBill') public eWayBill: ModalDirective;
    @ViewChild('searchBox') public searchBox: ElementRef;
    @ViewChild('advanceSearchComponent', { read: InvoiceAdvanceSearchComponent }) public advanceSearchComponent: InvoiceAdvanceSearchComponent;
    @Input() public selectedVoucher: VoucherTypeEnum = VoucherTypeEnum.sales;
    @ViewChild(InvoicePaymentModelComponent) public invoicePaymentModelComponent: InvoicePaymentModelComponent;

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
    public selectedInvoiceForDetails: InvoicePreviewDetailsVm;
    public itemsListForDetails: InvoicePreviewDetailsVm[] = [];
    public innerWidth: any;
    public isMobileView = false;
    public isExported: boolean = false;

    public showCustomerSearch = false;
    public showProformaSearch = false;
    public selectedDateRange: any;
    public datePickerOptions: any;
    public universalDate: Date[];
    public universalDate$: Observable<any>;
    public actionOnInvoiceSuccess$: Observable<boolean>;
    public isGetAllRequestInProcess$: Observable<boolean> = of(true);
    public templateType: any;
    public companies$: Observable<CompanyResponse[]>;
    public invoiceSetting: InvoiceSetting;
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
    public isExportedInvoices: any[] = [];
    public showMoreBtn: boolean = false;
    public selectedItemForMoreBtn = '';
    public exportInvoiceRequestInProcess$: Observable<boolean> = of(false);
    public exportedInvoiceBase64res$: Observable<any>;
    public isFabclicked: boolean = false;
    public exportInvoiceType: string = '';

    public sortRequestForUi: { sortBy: string, sort: string } = { sortBy: '', sort: '' };
    public showInvoiceGenerateModal: boolean = false;
    public appSideMenubarIsOpen: boolean;

    public invoiceSelectedDate: any = {
        fromDates: '',
        toDates: '',
        dataToSend: {}
    };
    private exportcsvRequest: any = {
        from: '',
        to: '',
        dataToSend: {}
    };
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private isUniversalDateApplicable: boolean = false;
    private flattenAccountListStream$: Observable<IFlattenAccountsResultItem[]>;
    public baseCurrencySymbol: string = '';
    public baseCurrency: string = '';
    public lastListingFilters: any;

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
        private _breakPointObservar: BreakpointObserver,
        private _router: Router,
        private _generalService: GeneralService,
        private _receiptServices: ReceiptService
    ) {
        this.invoiceSearchRequest.page = 1;
        this.invoiceSearchRequest.count = 20;
        this.invoiceSearchRequest.entryTotalBy = '';
        this.invoiceSearchRequest.from = moment().subtract(30, 'days').format(GIDDH_DATE_FORMAT);
        this.invoiceSearchRequest.to = moment().format(GIDDH_DATE_FORMAT);
        this.invoiceSearchRequest.accountUniqueName = '';
        this.invoiceSearchRequest.invoiceNumber = '';
        this.flattenAccountListStream$ = this.store.select(p => p.general.flattenAccounts).pipe(takeUntil(this.destroyed$));
        this.actionOnInvoiceSuccess$ = this.store.select(p => p.receipt.actionOnInvoiceSuccess).pipe(takeUntil(this.destroyed$));
        this.isGetAllRequestInProcess$ = this.store.select(p => p.receipt.isGetAllRequestInProcess).pipe(takeUntil(this.destroyed$));
        this.exportInvoiceRequestInProcess$ = this.store.select(p => p.invoice.exportInvoiceInprogress).pipe(takeUntil(this.destroyed$));
        this.exportedInvoiceBase64res$ = this.store.select(p => p.invoice.exportInvoicebase64Data).pipe(takeUntil(this.destroyed$));
        this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
        //this._invoiceService.getTotalAndBalDue();
    }

    public ngOnInit() {

        // get default datepicker options from store
        this.store.pipe(select(p => p.company.dateRangePickerConfig), takeUntil(this.destroyed$)).subscribe(datePickerOptions => {
            if (datePickerOptions) {
                this.datePickerOptions = datePickerOptions;
            }
        });

        this._breakPointObservar.observe([
            '(max-width: 1023px)'
        ]).subscribe(result => {
            this.isMobileView = result.matches;
        });

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
            // this.getVoucher(false);
        });
        // Get accounts
        this.flattenAccountListStream$.subscribe((data: IFlattenAccountsResultItem[]) => {
            let accounts: IOption[] = [];
            _.forEach(data, (item) => {
                if (_.find(item.parentGroups, (o) => _.indexOf(PARENT_GROUP_ARR, o.uniqueName) !== -1)) {
                    accounts.push({ label: item.name, value: item.uniqueName });
                }
            });
            this.accounts$ = observableOf(orderBy(accounts, 'label'));
        });

        combineLatest([
            this.store.select(p => p.receipt.vouchers).pipe(takeUntil(this.destroyed$), publishReplay(1), refCount()),
            this.store.pipe(select(s => s.receipt.voucherNoForDetails)),
            this.store.pipe(select(s => s.receipt.voucherNoForDetailsAction))
        ])
            .pipe(takeUntil(this.destroyed$))
            .subscribe(res => {
                if (res[0]) {
                    this.itemsListForDetails = [];
                    res[0].items = res[0].items.map((item: ReceiptItem) => {
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
                        if (MULTI_CURRENCY_MODULES.indexOf(this.selectedVoucher) > -1) {
                            // For CR/DR note and Cash/Sales invoice
                            item = this.addToolTiptext(item);
                        }
                        this.itemsListForDetails.push(this.parseItemForVm(item));
                        return item;
                    });

                    let voucherData = _.cloneDeep(res[0]);
                    if (voucherData.items.length) {
                        // this.totalSale = voucherData.items.reduce((c, p) => {
                        //   return Number(c.grandTotal) + Number(p.grandTotal);
                        // }, 0);
                        this.showExportButton = voucherData.items.every(s => s.account.uniqueName === voucherData.items[0].account.uniqueName);
                    } else {
                        // this.totalSale = 0;
                        if (voucherData.page > 1) {
                            voucherData.totalItems = voucherData.count * (voucherData.page - 1);
                            this.advanceSearchFilter.page = Math.ceil(voucherData.totalItems / voucherData.count);
                            this.invoiceSearchRequest.page = Math.ceil(voucherData.totalItems / voucherData.count);
                            this.getVoucher(false);
                            this.cdr.detectChanges();
                        }
                        this.showExportButton = false;
                    }

                    //this.selectedInvoicesList = []; // Commented Due to clearing after page changed
                    if (this.selectedInvoicesList && this.selectedInvoicesList.length > 0) {
                        res[0] = this.checkSelectedInvoice(voucherData);
                    }
                    this.selectedItems = [];
                }

                // get voucherDetailsNo so we can open that voucher in details mode
                if (res[0] && res[1] && res[2]) {
                    this.selectedInvoiceForDetails = null;
                    let voucherIndex = (res[0] as ReciptResponse).items.findIndex(f => f.voucherNumber === res[1]);
                    if (voucherIndex > -1) {
                        let allItems: InvoicePreviewDetailsVm[] = cloneDeep(this.itemsListForDetails);
                        allItems = uniqBy([allItems[voucherIndex], ...allItems], 'voucherNumber');
                        this.itemsListForDetails = allItems;
                        this.toggleBodyClass();
                        setTimeout(() => {
                            this.selectedInvoiceForDetails = allItems[0];
                            this.store.dispatch(this.invoiceReceiptActions.setVoucherForDetails(null, null));
                        }, 1000);
                    }
                }
                setTimeout(() => {
                    this.voucherData = _.cloneDeep(res[0]);
                    if (!this.cdr['destroyed']) {
                        this.cdr.detectChanges();
                    }
                }, 100);
            });

        this.store.pipe(select(s => s.invoice.settings), takeUntil(this.destroyed$)).subscribe(settings => {
            this.invoiceSetting = settings;
        });

        //--------------------- Refresh report data according to universal date--------------------------------
        this.store.select(createSelector([(state: AppState) => state.session.applicationDate], (a) => {

            if (a) {
                if (localStorage.getItem('universalSelectedDate')) {

                    let universalStorageData = localStorage.getItem('universalSelectedDate').split(',');
                    if ((moment(universalStorageData[0]).format(GIDDH_DATE_FORMAT) === moment(a[0]).format(GIDDH_DATE_FORMAT)) && (moment(universalStorageData[1]).format(GIDDH_DATE_FORMAT) === moment(a[1]).format(GIDDH_DATE_FORMAT))) {
                        if (window.localStorage && localStorage.getItem('invoiceSelectedDate')) {
                            let storedSelectedDate = JSON.parse(localStorage.getItem('invoiceSelectedDate'));
                            this.showAdvanceSearchIcon = true;

                            // assign dates
                            this.assignStartAndEndDateForDateRangePicker(storedSelectedDate.fromDates, storedSelectedDate.toDates);
                            this.invoiceSearchRequest.from = storedSelectedDate.fromDates;
                            this.invoiceSearchRequest.to = storedSelectedDate.toDates;
                            this.isUniversalDateApplicable = false;

                        } else {
                            // assign dates
                            this.assignStartAndEndDateForDateRangePicker(a[0], a[1]);

                            this.invoiceSearchRequest.from = moment(a[0]).format(GIDDH_DATE_FORMAT);
                            this.invoiceSearchRequest.to = moment(a[1]).format(GIDDH_DATE_FORMAT);
                            this.isUniversalDateApplicable = true;
                        }
                    } else {
                        // assign dates
                        this.assignStartAndEndDateForDateRangePicker(a[0], a[1]);

                        this.invoiceSearchRequest.from = moment(a[0]).format(GIDDH_DATE_FORMAT);
                        this.invoiceSearchRequest.to = moment(a[1]).format(GIDDH_DATE_FORMAT);
                        this.isUniversalDateApplicable = true;
                    }
                } else {
                    // assign dates
                    this.assignStartAndEndDateForDateRangePicker(a[0], a[1]);

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

        this.actionOnInvoiceSuccess$.subscribe((a) => {
            if (a) {
                this.selectedInvoiceForDetails = null;
                this.getVoucher(this.isUniversalDateApplicable);
            }
        });
        // this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(this.prepareModelForInvoiceReceiptApi(''), this.selectedVoucher));

        this.voucherNumberInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.invoiceSearchRequest.q = s;
            this.getVoucher(this.isUniversalDateApplicable);
            // if (s === '') {
            //   this.showCustomerSearch ? this.showInvoiceNoSearch = false : this.showInvoiceNoSearch = true;
            // }
        });

        this.accountUniqueNameInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.invoiceSearchRequest.q = s;
            this.getVoucher(this.isUniversalDateApplicable);
            // if (s === '') {
            //   this.showInvoiceNoSearch ? this.showCustomerSearch = false : this.showCustomerSearch = true;
            // }
        });

        this.store.pipe(select(s => s.general.sideMenuBarOpen), takeUntil(this.destroyed$))
            .subscribe(result => this.appSideMenubarIsOpen = result);

        this.store.pipe(select(s => s.receipt.isDeleteSuccess), takeUntil(this.destroyed$))
            .subscribe(result => {
                this.selectedItems = [];
                if (result && this.selectedInvoiceForDetails) {
                    this.selectedInvoiceForDetails = null;
                    this.getVoucher(this.isUniversalDateApplicable);
                }

                this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(this.lastListingFilters, this.selectedVoucher));
                this._receiptServices.GetAllReceiptBalanceDue(this.lastListingFilters, this.selectedVoucher).subscribe(res => {
                    this.parseBalRes(res);
                });
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedVoucher'] && changes['selectedVoucher'].currentValue !== changes['selectedVoucher'].previousValue) {
            this.selectedVoucher = changes['selectedVoucher'].currentValue;

            if (this.selectedVoucher === VoucherTypeEnum.creditNote || this.selectedVoucher === VoucherTypeEnum.debitNote) {
                this.templateType = 'voucher';
            } else {
                this.templateType = 'invoice';
            }
            this.getVoucher(false);
            this.selectedInvoice = null;
        }
    }

    public toggleBodyClass() {
        if (this.selectedInvoice) {
            document.querySelector('body').classList.add('fixed', 'mailbox');
        } else {
            document.querySelector('body').classList.remove('fixed', 'mailbox');
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
    }

    public getInvoiceTemplateDetails(templateUniqueName: string) {
        if (templateUniqueName) {
            this.store.dispatch(this.invoiceActions.GetTemplateDetailsOfInvoice(templateUniqueName));
        } else {
            this.store.dispatch(this.invoiceActions.GetTemplateDetailsOfInvoice('j8bzr0k3lh0khbcje8bh'));
        }
    }

    public pageChanged(ev: any): void {
        if (ev.page === this.invoiceSearchRequest.page) {
            return;
        }
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
            let objItem = item || this.selectedInvoiceForDetails;
            let actionToPerform = ev;
            if (actionToPerform === 'paid') {
                this.invoicePaymentModelComponent.loadPaymentModes();
                this.selectedInvoice = objItem;
                this.performActionOnInvoiceModel.show();
                setTimeout(() => {
                    this.invoicePaymentModelComponent.focusAmountField();
                }, 500);
            } else {
                this.store.dispatch(this.invoiceActions.ActionOnInvoice(objItem.uniqueName, { action: actionToPerform, voucherType: objItem.voucherType }));
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

    public goToInvoice(voucherType: string) {
        this._router.navigate(['/pages/proforma-invoice/invoice/', voucherType]);
    }

    /**
     * onSelectInvoice
     */
    public onSelectInvoice(invoice: ReceiptItem) {
        this.selectedInvoice = _.cloneDeep(invoice);

        let allItems: InvoicePreviewDetailsVm[] = cloneDeep(this.itemsListForDetails);
        let newIndex = allItems.findIndex(f => f.voucherNumber === invoice.voucherNumber);
        let removedItem = allItems.splice(newIndex, 1);
        allItems = [...removedItem, ...allItems];
        this.itemsListForDetails = allItems;

        this.selectedInvoiceForDetails = cloneDeep(allItems[0]);
        //this.selectedVoucher = this.selectedInvoiceForDetails.voucherType;
        this.toggleBodyClass();
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
        return new Blob(byteArrays, { type: contentType });
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
            this.store.dispatch(this.invoiceActions.SendInvoiceOnSms(this.selectedInvoice.account.uniqueName, { numbers: userResponse.numbers }, this.selectedInvoice.voucherNumber));
        }
    }

    public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {
        if (this.showAdvanceSearchIcon) {
            this.advanceSearchFilter.sort = type;
            this.advanceSearchFilter.sortBy = columnName;
            this.advanceSearchFilter.from = this.invoiceSearchRequest.from;
            this.advanceSearchFilter.to = this.invoiceSearchRequest.to;
            if (this.invoiceSearchRequest.page) {
                this.advanceSearchFilter.page = this.invoiceSearchRequest.page;
            }
            this.lastListingFilters = this.advanceSearchFilter;
            this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(this.advanceSearchFilter, this.selectedVoucher));
            this._receiptServices.GetAllReceiptBalanceDue(this.advanceSearchFilter, this.selectedVoucher).subscribe(res => {
                this.parseBalRes(res);
            });
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
        this.lastListingFilters = this.prepareModelForInvoiceReceiptApi(isUniversalDateSelected);
        this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(this.prepareModelForInvoiceReceiptApi(isUniversalDateSelected), this.selectedVoucher));
        this._receiptServices.GetAllReceiptBalanceDue(this.prepareModelForInvoiceReceiptApi(isUniversalDateSelected), this.selectedVoucher).subscribe(res => {
            this.parseBalRes(res);
        });
        // this.store.dispatch(this.invoiceActions.GetAllInvoices(this.prepareQueryParamsForInvoiceApi(isUniversalDateSelected), this.prepareModelForInvoiceApi()));
    }

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

        model.from = o.from;
        model.to = o.to;
        model.count = o.count;
        model.page = o.page;
        if (isUniversalDateSelected || this.showAdvanceSearchIcon) {
            //model = advanceSearch;
            if (!model.invoiceDate && !model.dueDate) {
                model.from = this.invoiceSearchRequest.from;
                model.to = this.invoiceSearchRequest.to;
            }
        }
        model.sort = o.sort;
        model.sortBy = o.sortBy;
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

    public dateRangeChanged(event: any) {
        this.showAdvanceSearchIcon = true;
        if (event && event.startDate && event.endDate) {
            this.invoiceSearchRequest.from = moment(event.startDate).format(GIDDH_DATE_FORMAT);
            this.invoiceSearchRequest.to = moment(event.endDate).format(GIDDH_DATE_FORMAT);
            this.invoiceSelectedDate.fromDates = this.invoiceSearchRequest.from;
            this.invoiceSelectedDate.toDates = this.invoiceSearchRequest.to;
        }

        if (window.localStorage) {
            localStorage.setItem('invoiceSelectedDate', JSON.stringify(this.invoiceSelectedDate));
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
            voucherNumber: [this.selectedInvoice.voucherNumber],
            typeOfInvoice: invoiceCopy,
            voucherType: this.selectedVoucher
        };
        this._invoiceService.DownloadInvoice(this.selectedInvoice.account.uniqueName, dataToSend)
            .subscribe(res => {
                if (res) {

                    if (dataToSend.typeOfInvoice.length > 1) {
                        return saveAs(res, `${dataToSend.voucherNumber[0]}.` + 'zip');
                    }

                    return saveAs(res, `${dataToSend.voucherNumber[0]}.` + 'pdf');
                } else {
                    this._toaster.errorToast('Something went wrong Please try again!');
                }
            });
    }

    public toggleAllItems(type: boolean) {
        this.allItemsSelected = type;
        this.selectedItems = [];
        if (this.voucherData && this.voucherData.items && this.voucherData.items.length) {
            this.voucherData.items = _.map(this.voucherData.items, (item: ReceiptItem) => {
                item.isSelected = this.allItemsSelected;
                let isAvailable = false;
                if (this.selectedInvoicesList && this.selectedInvoicesList.length > 0) {
                    this.selectedInvoicesList.forEach((ele) => {
                        if (ele.uniqueName === item.uniqueName) {
                            isAvailable = true;
                        }
                    });
                }
                if (!isAvailable) {
                    this.selectedInvoicesList.push(item);
                }

                this.selectedItems.push(item.uniqueName);
                //  this.itemStateChanged(item, true);
                return item;
            });
        }
        if (!this.allItemsSelected) {
            this.selectedInvoicesList = this.selectedInvoicesList.filter((ele) => {
                return ele.isSelected;
            });

            this.voucherData.items.forEach((ele) => {
                this.selectedInvoicesList = this.selectedInvoicesList.filter((s) => {
                    return ele.uniqueName !== s.uniqueName;
                });
            });

            this.selectedItems = [];
            this.isExported = false;
        } else {
            this.isExported = true;
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
    }

    public clickedOutside(event: Event, el, fieldName: string) {

        if (fieldName === 'invoiceNumber') {
            if (this.voucherNumberInput.value !== null && this.voucherNumberInput.value !== '') {
                // this.voucherNumberInput.setValue('');
                return;
            }
        } else if (fieldName === 'accountUniqueName') {
            if (this.accountUniqueNameInput.value !== null && this.accountUniqueNameInput.value !== '') {
                return;
            }
            //event.stopPropagation();  // due to this dropdown auto close was not working
        } else if (fieldName === 'ProformaPurchaseOrder') {
            if (this.ProformaPurchaseOrder.value !== null && this.ProformaPurchaseOrder.value !== '') {
                return;
            }
        }

        if (this.childOf(event.target, el)) {
            return;
        } else {
            if (fieldName === 'invoiceNumber') {
                this.showInvoiceNoSearch = false;
            } else if (fieldName === 'accountUniqueName') {
                this.showCustomerSearch = false;
            }
            // else {
            //   if (fieldName === 'accountUniqueName') {
            //     this.accountUniqueNameInput.value ? this.showCustomerSearch = true : this.showCustomerSearch = false;
            //   } else {
            //     this.showCustomerSearch = false;
            //   }
            // }
        }
    }

    public fabBtnclicked() {
        this.isFabclicked = !this.isFabclicked;
        if (this.isFabclicked) {
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

    public itemStateChanged(item: any, allSelected: boolean = false) {
        let index = this.selectedItems.findIndex(f => f === item.uniqueName);
        let indexInv = this.selectedInvoicesList.findIndex(f => f.uniqueName === item.uniqueName);

        if (indexInv > -1 && !allSelected) {
            this.selectedInvoicesList = this.selectedInvoicesList.filter(f => f.uniqueName !== item.uniqueName);
        } else {
            this.selectedInvoicesList.push(item);     // Array of checked seleted Items of the list
        }

        if (index > -1 && !allSelected) {
            this.selectedItems = this.selectedItems.filter(f => f !== item.uniqueName);
        } else {
            this.selectedItems.push(item.uniqueName);  // Array of checked seleted Items uniqueName of the list
        }
        if (this.selectedInvoicesList.length === 1) {
            this.exportInvoiceType = this.selectedInvoicesList[0].account.uniqueName;
            this.isExported = true;
        }
        this.isExported = this.selectedInvoicesList.every(ele => {
            return ele.account.uniqueName === this.exportInvoiceType;
        });
        this.selectedInvoicesList = this.selectedInvoicesList.filter(s => s.isSelected);
        this.voucherData = this.checkSelectedInvoice(this.voucherData);
    }

    public applyAdvanceSearch(request: InvoiceFilterClassForInvoicePreview) {
        this.showAdvanceSearchIcon = true;
        if (!request.invoiceDate && !request.dueDate) {
            request.from = this.invoiceSearchRequest.from;
            request.to = this.invoiceSearchRequest.to;
        }
        this.lastListingFilters = request;
        this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(request, this.selectedVoucher));
        this._receiptServices.GetAllReceiptBalanceDue(request, this.selectedVoucher).subscribe(res => {
            this.parseBalRes(res);
        });
    }

    public resetAdvanceSearch() {
        this.showAdvanceSearchIcon = false;
        if (this.advanceSearchComponent && this.advanceSearchComponent.allShSelect) {
            this.advanceSearchComponent.allShSelect.forEach(f => {
                f.clear();
            });
        }
        if (window.localStorage) {
            localStorage.removeItem('invoiceSelectedDate');
        }
        this.advanceSearchFilter = new InvoiceFilterClassForInvoicePreview();
        this.advanceSearchFilter.page = 1;
        this.advanceSearchFilter.count = 20;

        this.sortRequestForUi = { sortBy: '', sort: '' };
        this.invoiceSearchRequest.sort = '';
        this.invoiceSearchRequest.sortBy = '';
        this.invoiceSearchRequest.q = '';
        this.invoiceSearchRequest.page = 1;
        this.invoiceSearchRequest.count = 20;
        this.invoiceSearchRequest.voucherNumber = '';
        let universalDate;
        if (window.localStorage) {
            universalDate = localStorage.getItem('universalSelectedDate') ? localStorage.getItem('universalSelectedDate').split(',') : '';
        }
        if (universalDate.length > 1) {
            this.invoiceSearchRequest.from = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
            this.invoiceSearchRequest.to = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);

            this.assignStartAndEndDateForDateRangePicker(universalDate[0], universalDate[1]);
        }
        this.getVoucher(this.isUniversalDateApplicable);
    }

    public sendEmail(obj: any) {
        if (obj.email) {
            this.store.dispatch(this.invoiceActions.SendInvoiceOnMail(this.selectedInvoice.account.uniqueName, {
                emailId: obj.email.split(','),
                voucherNumber: [obj.invoiceNumber || this.selectedInvoice.voucherNumber],
                voucherType: this.selectedVoucher,
                typeOfInvoice: obj.invoiceType ? obj.invoiceType : []
            }));
        } else {
            this.store.dispatch(this.invoiceActions.SendInvoiceOnSms(this.selectedInvoice.account.uniqueName, {
                numbers: obj.numbers.split(',')
            }, this.selectedVoucher));
        }
    }

    /**
     * called when someone closes invoice/ voucher preview page
     * it will call get all so we can have latest data every time someone updates invoice/ voucher
     */
    public invoicePreviewClosed() {
        this.selectedInvoice = null;
        this.selectedInvoiceForDetails = null;
        this.toggleBodyClass();
        this.getVoucher(this.isUniversalDateApplicable);
    }

    public ngOnDestroy() {
        // this.dp.destroyPicker();
        this.universalDate$.pipe(take(1)).subscribe(a => {
            if (a && window.localStorage) {
                localStorage.setItem('universalSelectedDate', a);
            }
        });
        /*
        commented out this because we are moving this logic to invoice create and update component
        // document.querySelector('body').classList.remove('fixed');
        */
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
        let dataTosend = { accountUniqueName: '' };
        if (this.selectedInvoicesList.length > 0) {

            dataTosend.accountUniqueName = this.allItemsSelected ? '' : this.selectedInvoicesList[0].account.uniqueName;
        } else {
            dataTosend.accountUniqueName = '';
        }
        this.exportcsvRequest.dataToSend = dataTosend;
        this.store.dispatch(this.invoiceActions.DownloadExportedInvoice(this.exportcsvRequest));
        this.exportedInvoiceBase64res$.pipe(debounceTime(800), take(1)).subscribe(res => {
            if (res) {
                if (res.status === 'success') {
                    let blob = this.base64ToBlob(res.body, 'application/xls', 512);
                    this.selectedInvoicesList = [];
                    return saveAs(blob, `${dataTosend.accountUniqueName}All-invoices.xls`);
                } else {
                    this._toaster.errorToast(res.message);
                }
            }
        });
    }

    private parseItemForVm(invoice: ReceiptItem): InvoicePreviewDetailsVm {
        let obj: InvoicePreviewDetailsVm = new InvoicePreviewDetailsVm();
        obj.voucherDate = invoice.voucherDate;
        obj.voucherNumber = invoice.voucherNumber;
        obj.uniqueName = invoice.uniqueName;
        obj.grandTotal = invoice.grandTotal.amountForAccount;
        obj.voucherType = this.selectedVoucher === VoucherTypeEnum.sales ? (invoice.cashInvoice ? VoucherTypeEnum.cash : VoucherTypeEnum.sales) : this.selectedVoucher;
        obj.account = invoice.account;
        obj.voucherStatus = invoice.balanceStatus;
        obj.accountCurrencySymbol = invoice.accountCurrencySymbol;
        return obj;
    }

    public checkSelectedInvoice(voucherData: ReciptResponse) {
        voucherData.items.forEach((v) => {
            this.selectedInvoicesList.forEach((s) => {
                if (v.uniqueName === s.uniqueName) {
                    v.isSelected = true;
                }
            });
        });
        return voucherData;
    }

    private parseBalRes(res) {
        this.totalSale = res.body.grandTotal;
        this.totalDue = res.body.totalDue;
        // get user country from his profile
        this.store.pipe(select(s => s.settings.profile), takeUntil(this.destroyed$)).subscribe(profile => {
            if (profile) {
                this.baseCurrencySymbol = profile.baseCurrencySymbol;
                this.baseCurrency = profile.baseCurrency;
            }
        });
    }

    /**
     * assign date to start and end date for date range picker
     * @param from
     * @param to
     */
    private assignStartAndEndDateForDateRangePicker(from = moment().subtract(30, 'days'), to = moment()) {
        this.selectedDateRange = {
            startDate: moment(from, GIDDH_DATE_FORMAT),
            endDate: moment(to, GIDDH_DATE_FORMAT)
        };
    }

    /**
     * Adds tooltip text for grand total and total due amount
     * to item supplied (for Cash/Sales Invoice and CR/DR note)
     *
     * @private
     * @param {ReceiptItem} item Receipt item received from service
     * @returns {*} Modified item with tooltup text for grand total and total due amount
     * @memberof InvoicePreviewComponent
     */
    private addToolTiptext(item: ReceiptItem): any {
        try {
            let balanceDueAmountForCompany, balanceDueAmountForAccount, grandTotalAmountForCompany, grandTotalAmountForAccount;

            if (this.selectedVoucher === VoucherTypeEnum.sales && item.balanceDue) {
                balanceDueAmountForCompany = Number(item.balanceDue.amountForCompany) || 0;
                balanceDueAmountForAccount = Number(item.balanceDue.amountForAccount) || 0;
            }
            if (MULTI_CURRENCY_MODULES.indexOf(this.selectedVoucher) > -1 &&
                item.grandTotal) {
                grandTotalAmountForCompany = Number(item.grandTotal.amountForCompany) || 0;
                grandTotalAmountForAccount = Number(item.grandTotal.amountForAccount) || 0;
            }

            let grandTotalConversionRate = 0, balanceDueAmountConversionRate = 0;
            if (grandTotalAmountForCompany && grandTotalAmountForAccount) {
                grandTotalConversionRate = +((grandTotalAmountForCompany / grandTotalAmountForAccount) || 0).toFixed(2);
            }
            if (balanceDueAmountForCompany && balanceDueAmountForAccount) {
                balanceDueAmountConversionRate = +((balanceDueAmountForCompany / balanceDueAmountForAccount) || 0).toFixed(2);
            }
            item['grandTotalTooltipText'] = `In ${this.baseCurrency}: ${grandTotalAmountForCompany}<br />(Conversion Rate: ${grandTotalConversionRate})`;
            item['balanceDueTooltipText'] = `In ${this.baseCurrency}: ${balanceDueAmountForCompany}<br />(Conversion Rate: ${balanceDueAmountConversionRate})`;

        } catch (error) { }
        return item;
    }

}

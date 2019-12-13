import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BsDatepickerDirective, BsModalRef, BsModalService, ModalDirective, ModalOptions } from 'ngx-bootstrap';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store';
import { AccountService } from '../services/account.service';
import { SalesActions } from '../actions/sales/sales.action';
import { CompanyActions } from '../actions/company.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { LedgerActions } from '../actions/ledger/ledger.actions';
import { SalesService } from '../services/sales.service';
import { ToasterService } from '../services/toaster.service';
import { GeneralActions } from '../actions/general/general.actions';
import { InvoiceActions } from '../actions/invoice/invoice.actions';
import { SettingsDiscountActions } from '../actions/settings/discount/settings.discount.action';
import { InvoiceReceiptActions } from '../actions/invoice/receipt/receipt.actions';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import {
    AccountDetailsClass,
    ActionTypeAfterVoucherGenerateOrUpdate,
    AmountClassMulticurrency,
    CodeStockMulticurrency,
    DiscountMulticurrency,
    GenericRequestForGenerateSCD,
    GstDetailsClass,
    IForceClear,
    IStockUnit,
    SalesAddBulkStockItems,
    SalesEntryClass,
    SalesEntryClassMulticurrency,
    SalesOtherTaxesCalculationMethodEnum,
    SalesOtherTaxesModal,
    SalesTransactionItemClass,
    StateCode,
    TransactionClassMulticurrency,
    VOUCHER_TYPE_LIST,
    VoucherClass,
    VoucherDetailsClass,
    VoucherTypeEnum
} from '../models/api-models/Sales';
import { auditTime, delay, take, takeUntil } from 'rxjs/operators';
import { IOption } from '../theme/ng-select/option.interface';
import { combineLatest, Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { NgForm } from '@angular/forms';
import { DiscountListComponent } from '../sales/discount-list/discountList.component';
import { IContentCommon } from '../models/api-models/Invoice';
import { StateDetailsRequest, TaxResponse } from '../models/api-models/Company';
import { INameUniqueName } from '../models/interfaces/nameUniqueName.interface';
import { AccountResponseV2, AddAccountRequest, UpdateAccountRequest } from '../models/api-models/Account';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import { IFlattenAccountsResultItem } from '../models/interfaces/flattenAccountsResultItem.interface';
import * as moment from 'moment/moment';
import { UploaderOptions, UploadInput, UploadOutput } from 'ngx-uploader';
import * as _ from '../lodash-optimized';
import { cloneDeep, isEqual } from '../lodash-optimized';
import { InvoiceSetting } from '../models/interfaces/invoice.setting.interface';
import { SalesShSelectComponent } from '../theme/sales-ng-virtual-select/sh-select.component';
import { EMAIL_REGEX_PATTERN } from '../shared/helpers/universalValidations';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { LedgerDiscountClass } from '../models/api-models/SettingsDiscount';
import { Configuration } from '../app.constant';
import { LEDGER_API } from '../services/apiurls/ledger.api';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ShSelectComponent } from '../theme/ng-virtual-select/sh-select.component';
import { ProformaActions } from '../actions/proforma/proforma.actions';
import { PreviousInvoicesVm, ProformaFilter, ProformaGetRequest, ProformaResponse } from '../models/api-models/proforma';
import { giddhRoundOff } from '../shared/helpers/helperFunctions';
import { InvoiceReceiptFilter, ReciptResponse } from '../models/api-models/recipt';
import { LedgerService } from '../services/ledger.service';
import { TaxControlComponent } from '../theme/tax-control/tax-control.component';
import { GeneralService } from '../services/general.service';
import { LoaderState } from "../loader/loader";
import { LoaderService } from "../loader/loader.service";
import { LedgerResponseDiscountClass } from "../models/api-models/Ledger";
import { CurrentPage } from '../models/api-models/Common';
import { NAVIGATION_ITEM_LIST } from '../models/defaultMenus';

const THEAD_ARR_READONLY = [
    {
        display: true,
        label: '#'
    },
    {
        display: true,
        label: 'Product/Service  Description '
    },
    {
        display: true,
        label: 'Qty/Unit'
    },
    {
        display: true,
        label: 'Rate'
    },
    {
        display: true,
        label: 'Amount'
    },
    {
        display: true,
        label: 'Discount'
    },
    {
        display: true,
        label: 'Tax'
    },
    {
        display: true,
        label: 'Total'
    },
    {
        display: true,
        label: ''
    }
];

@Component({
    selector: 'proforma-invoice-component',
    templateUrl: './proforma-invoice.component.html',
    styleUrls: [`./proforma-invoice.component.scss`],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})

export class ProformaInvoiceComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
    @Input() public isPurchaseInvoice: boolean = false;
    @Input() public accountUniqueName: string = '';
    @Input() public invoiceNo = '';
    @Input() public invoiceType: VoucherTypeEnum = VoucherTypeEnum.sales;

    @ViewChild(ElementViewContainerRef) public elementViewContainerRef: ElementViewContainerRef;
    @ViewChild('createGroupModal') public createGroupModal: ModalDirective;
    @ViewChild('createAcModal') public createAcModal: ModalDirective;
    @ViewChild('bulkItemsModal') public bulkItemsModal: ModalDirective;
    @ViewChild('sendEmailModal') public sendEmailModal: ModalDirective;
    @ViewChild('printVoucherModal') public printVoucherModal: ModalDirective;

    @ViewChild('copyPreviousEstimate') public copyPreviousEstimate: ElementRef;
    @ViewChild('unregisteredBusiness') public unregisteredBusiness: ElementRef;

    @ViewChild('invoiceForm', {read: NgForm}) public invoiceForm: NgForm;
    @ViewChild('discountComponent') public discountComponent: DiscountListComponent;
    @ViewChild(TaxControlComponent) public taxControlComponent: TaxControlComponent;
    @ViewChild('customerNameDropDown') public customerNameDropDown: ShSelectComponent;

    @ViewChildren('selectAccount') public selectAccount: QueryList<ShSelectComponent>;
    @ViewChildren('description') public description: QueryList<ElementRef>;

    @ViewChild('inputCustomerName') public inputCustomerName: ElementRef;
    @ViewChild('customerBillingAddress') public customerBillingAddress: ElementRef;
    @ViewChildren(BsDatepickerDirective) public datePickers: QueryList<BsDatepickerDirective>;

    @Output() public cancelVoucherUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();

    public selectWarehouse = [
        {label: 'Warehouse 1', value: 'Warehouse 1'},
        {label: 'Warehouse 2', value: 'Warehouse 2'},
        {label: 'Warehouse 3', value: 'Warehouse 3'},
    ];

    public editCurrencyInputField: boolean = false;
    public showCurrencyValue: boolean = false;
    public autoSaveIcon: boolean = false;
    public editPencilIcon: boolean = true;

    public isSalesInvoice: boolean = true;
    public isCashInvoice: boolean = false;
    public isProformaInvoice: boolean = false;
    public isEstimateInvoice: boolean = false;
    public isUpdateMode = false;
    public isLastInvoiceCopied: boolean = false;

    public customerCountryName: string = '';
    public showGSTINNo: boolean;
    public showTRNNo: boolean;

    public hsnDropdownShow: boolean = false;
    public customerPlaceHolder: string = 'Select Customer';
    public customerNotFoundText: string = 'Add Customer';
    public invoiceNoLabel: string = 'Invoice #';
    public invoiceDateLabel: string = 'Invoice Date';
    public invoiceDueDateLabel: string = 'Invoice Due Date';

    public isGenDtlCollapsed: boolean = true;
    public isMlngAddrCollapsed: boolean = true;
    public isOthrDtlCollapsed: boolean = false;
    public typeaheadNoResultsOfCustomer: boolean = false;
    public invFormData: VoucherClass;
    public customerAcList$: Observable<IOption[]>;
    public bankAccounts$: Observable<IOption[]>;
    public salesAccounts$: Observable<IOption[]> = observableOf(null);
    public accountAsideMenuState: string = 'out';
    public asideMenuStateForProductService: string = 'out';
    public asideMenuStateForRecurringEntry: string = 'out';
    public asideMenuStateForOtherTaxes: string = 'out';
    public theadArrReadOnly: IContentCommon[] = THEAD_ARR_READONLY;
    public companyTaxesList: TaxResponse[] = [];
    public showCreateAcModal: boolean = false;
    public showCreateGroupModal: boolean = false;
    public createAcCategory: string = null;
    public newlyCreatedAc$: Observable<INameUniqueName>;
    public newlyCreatedStockAc$: Observable<INameUniqueName>;
    public countrySource: IOption[] = [];
    public statesSource: IOption[] = [];
    public activeAccount$: Observable<AccountResponseV2>;
    public autoFillShipping: boolean = true;
    public toggleFieldForSales: boolean = true;
    public depositAmount: number = 0;
    public depositAmountAfterUpdate: number = 0;
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    public flattenAccountListStream$: Observable<IFlattenAccountsResultItem[]>;
    public voucherDetails$: Observable<VoucherClass | GenericRequestForGenerateSCD>;
    public forceClear$: Observable<IForceClear> = observableOf({status: false});
    public calculatedRoundOff: number = 0;

    // modals related
    public modalConfig: ModalOptions = {
        animated: true,
        keyboard: false,
        backdrop: 'static',
        ignoreBackdropClick: true
    };
    public pageList: IOption[] = VOUCHER_TYPE_LIST;
    public universalDate: any;
    public moment = moment;
    public GIDDH_DATE_FORMAT = GIDDH_DATE_FORMAT;
    public activeIndx: number;
    public isCustomerSelected = false;
    public voucherNumber: string;
    public depositAccountUniqueName: string;
    public dropdownisOpen: boolean = false;
    public fileUploadOptions: UploaderOptions;

    public uploadInput: EventEmitter<UploadInput>;
    public sessionKey$: Observable<string>;
    public companyName$: Observable<string>;
    public lastInvoices$: Observable<ReciptResponse>;
    public lastProformaInvoices$: Observable<ProformaResponse>;
    public lastInvoices: PreviousInvoicesVm[] = [];
    public isFileUploading: boolean = false;
    public selectedFileName: string = '';
    public file: any = null;
    public invoiceDataFound: boolean = false;
    public isUpdateDataInProcess: boolean = false;
    public isMobileView: boolean = false;
    public showBulkItemModal: boolean = false;
    public showLastEstimateModal: boolean = false;
    public showGstTreatmentModal: boolean = false;
    public selectedCustomerForDetails: string = null;
    public selectedGrpUniqueNameForAddEditAccountModal: string = '';
    public actionAfterGenerateORUpdate: ActionTypeAfterVoucherGenerateOrUpdate = ActionTypeAfterVoucherGenerateOrUpdate.generate;
    public companyCurrency: string;
    public isMultiCurrencyAllowed: boolean = false;
    public fetchedConvertedRate: number = 0;
    public isAddBulkItemInProcess: boolean = false;

    public modalRef: BsModalRef;
    public exceptTaxTypes: string[];
    // private below
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private selectedAccountDetails$: Observable<AccountResponseV2>;
    private innerEntryIdx: number;
    private updateAccount: boolean = false;
    private companyUniqueName$: Observable<string>;
    private sundryDebtorsAcList: IOption[] = [];
    private sundryCreditorsAcList: IOption[] = [];
    private prdSerAcListForDeb: IOption[] = [];
    private prdSerAcListForCred: IOption[] = [];
    private createAccountIsSuccess$: Observable<boolean>;
    private updateAccountSuccess$: Observable<boolean>;
    private createdAccountDetails$: Observable<AccountResponseV2>;
    private updatedAccountDetails$: Observable<AccountResponseV2>;
    private generateVoucherSuccess$: Observable<boolean>;
    private updateVoucherSuccess$: Observable<boolean>;
    private lastGeneratedVoucherNo$: Observable<{ voucherNo: string, accountUniqueName: string }>;

    //Multi-currency changes
    public exchangeRate = 1;
    public originalExchangeRate = 1;
    public isMulticurrencyAccount = false;
    public invoiceUniqueName: string;
    public showLoader: boolean = false;
    public inputMaskFormat: string = '';
    public isPrefixAppliedForCurrency: boolean;
    public selectedSuffixForCurrency: string = '';
    public companyCurrencyName: string;
    public baseCurrencySymbol: string = '';
    public depositCurrSymbol: string = '';
    public grandTotalMulDum;
    public showSwitchedCurr = false;
    public reverseExchangeRate: number;
    public originalReverseExchangeRate: number;
    public countryCode: string = '';
    private entriesListBeforeTax: SalesEntryClass[];
    /** True, if user has selected custom invoice in Invoice Setting */
    private useCustomInvoiceNumber: boolean;
    /** True, if the invoice generation request is received from previous page's modal */
    private isInvoiceRequestedFromPreviousPage: boolean;
    public selectedCompany: any;

    constructor(
        private modalService: BsModalService,
        private store: Store<AppState>,
        private accountService: AccountService,
        private salesAction: SalesActions,
        private companyActions: CompanyActions,
        private router: Router,
        private ledgerActions: LedgerActions,
        private salesService: SalesService,
        private _toasty: ToasterService,
        private _generalActions: GeneralActions,
        private _invoiceActions: InvoiceActions,
        private _settingsDiscountAction: SettingsDiscountActions,
        public route: ActivatedRoute,
        private invoiceReceiptActions: InvoiceReceiptActions,
        private invoiceActions: InvoiceActions,
        private _settingsProfileActions: SettingsProfileActions,
        private _zone: NgZone,
        private _breakpointObserver: BreakpointObserver,
        private _cdr: ChangeDetectorRef,
        private proformaActions: ProformaActions,
        private _ledgerService: LedgerService,
        private _generalService: GeneralService,
        private loaderService: LoaderService
    ) {
        this.store.dispatch(this._generalActions.getFlattenAccount());
        this.store.dispatch(this._settingsProfileActions.GetProfileInfo());
        this.store.dispatch(this.companyActions.getTax());
        this.store.dispatch(this.ledgerActions.GetDiscountAccounts());
        this.store.dispatch(this._invoiceActions.getInvoiceSetting());
        this.store.dispatch(this._settingsDiscountAction.GetDiscount());
        this.store.dispatch(this.salesAction.resetAccountDetailsForSales());

        this.invFormData = new VoucherClass();
        this.companyUniqueName$ = this.store.pipe(select(s => s.session.companyUniqueName), takeUntil(this.destroyed$));
        this.activeAccount$ = this.store.pipe(select(p => p.groupwithaccounts.activeAccount), takeUntil(this.destroyed$));
        this.newlyCreatedAc$ = this.store.pipe(select(p => p.groupwithaccounts.newlyCreatedAccount), takeUntil(this.destroyed$));
        this.newlyCreatedStockAc$ = this.store.pipe(select(p => p.sales.newlyCreatedStockAc), takeUntil(this.destroyed$));
        this.flattenAccountListStream$ = this.store.pipe(select(p => p.general.flattenAccounts), takeUntil(this.destroyed$));
        this.selectedAccountDetails$ = this.store.pipe(select(p => p.sales.acDtl), takeUntil(this.destroyed$));
        this.sessionKey$ = this.store.pipe(select(p => p.session.user.session.id), takeUntil(this.destroyed$));
        this.companyName$ = this.store.pipe(select(p => p.session.companyUniqueName), takeUntil(this.destroyed$));
        this.createAccountIsSuccess$ = this.store.pipe(select(p => p.sales.createAccountSuccess), takeUntil(this.destroyed$));
        this.createdAccountDetails$ = this.store.pipe(select(p => p.sales.createdAccountDetails), takeUntil(this.destroyed$));
        this.updatedAccountDetails$ = this.store.pipe(select(p => p.sales.updatedAccountDetails), takeUntil(this.destroyed$));
        this.updateAccountSuccess$ = this.store.pipe(select(p => p.sales.updateAccountSuccess), takeUntil(this.destroyed$));
        this.generateVoucherSuccess$ = this.store.pipe(select(p => p.proforma.isGenerateSuccess), takeUntil(this.destroyed$));
        this.updateVoucherSuccess$ = this.store.pipe(select(p => p.proforma.isUpdateProformaSuccess), takeUntil(this.destroyed$));
        this.lastGeneratedVoucherNo$ = this.store.pipe(select(p => p.proforma.lastGeneratedVoucherDetails), takeUntil(this.destroyed$));
        this.lastInvoices$ = this.store.pipe(select(p => p.receipt.lastVouchers), takeUntil(this.destroyed$));
        this.lastProformaInvoices$ = this.store.pipe(select(p => p.proforma.lastVouchers), takeUntil(this.destroyed$));
        this.voucherDetails$ = this.store.pipe(
            select(s => {
                if (!this.isProformaInvoice && !this.isEstimateInvoice) {
                    return s.receipt.voucher as VoucherClass;
                } else {
                    return s.proforma.activeVoucher as GenericRequestForGenerateSCD;
                }
            }),
            takeUntil(this.destroyed$)
        );

        this.exceptTaxTypes = ['tdsrc', 'tdspay', 'tcspay', 'tcsrc'];

        this.loaderService.loaderState.pipe(delay(500), takeUntil(this.destroyed$)).subscribe((stateLoader: LoaderState) => {
            if (stateLoader.show) {
                this.showLoader = true;
            } else {
                this.showLoader = false;
                // call focus in customer after loader hides because after loader hider ui re-renders it self
                this.focusInCustomerName();
            }
        });
    }

    public ngAfterViewInit() {
        if (!this.isUpdateMode) {
            this.toggleBodyClass();
        }
    }

    public ngOnInit() {

        this.autoFillShipping = true;
        this.isUpdateMode = false;

        this.store.select(s => {
            if (!s.session.companies) {
                return;
            }
            s.session.companies.forEach(cmp => {
                if (cmp.uniqueName === s.session.companyUniqueName) {
                    this.selectedCompany = cmp;
                }
            });
        }).pipe(takeUntil(this.destroyed$)).subscribe();

        // get user country from his profile
        this.store.pipe(select(s => s.settings.profile), takeUntil(this.destroyed$)).subscribe(async (profile) => {
            await this.prepareCompanyCountryAndCurrencyFromProfile(profile);
        });

        this.route.params.pipe(takeUntil(this.destroyed$), delay(0)).subscribe(parmas => {
            if (parmas['invoiceType']) {
                if (this.invoiceType !== parmas['invoiceType']) {
                    this.invoiceType = decodeURI(parmas['invoiceType']) as VoucherTypeEnum;
                    this.prepareInvoiceTypeFlags();
                    this.saveStateDetails();
                    this.resetInvoiceForm(this.invoiceForm);

                    // reset customer company when invoice type changes, re-check for company currency and country
                    this.store.pipe(select(s => s.settings.profile), take(1)).subscribe(profile => {
                        this.prepareCompanyCountryAndCurrencyFromProfile(profile);
                    });

                    this.makeCustomerList();
                    this.getAllLastInvoices();
                }
                this.invoiceType = decodeURI(parmas['invoiceType']) as VoucherTypeEnum;
                this.prepareInvoiceTypeFlags();
                this.saveStateDetails();
            }

            if (parmas['invoiceType'] && parmas['accUniqueName']) {
                this.accountUniqueName = parmas['accUniqueName'];
                this.isUpdateMode = false;
                this.invoiceType = decodeURI(parmas['invoiceType']) as VoucherTypeEnum;
                this.prepareInvoiceTypeFlags();
                this.isInvoiceRequestedFromPreviousPage = true;
                this.getAccountDetails(parmas['accUniqueName']);

                // set current page title manually because we are passing account unique name which will be dynamic so we can't relay on it so we have to do it manually
                this.setCurrentPageTitle(this.invoiceType);
            }

            if (parmas['invoiceNo'] && parmas['accUniqueName'] && parmas['invoiceType']) {
                // for edit mode from url
                this.accountUniqueName = parmas['accUniqueName'];
                this.invoiceNo = parmas['invoiceNo'];
                this.isUpdateMode = true;
                this.isUpdateDataInProcess = true;
                this.prepareInvoiceTypeFlags();

                this.toggleFieldForSales = (!(this.invoiceType === VoucherTypeEnum.debitNote || this.invoiceType === VoucherTypeEnum.creditNote));

                if (!this.isProformaInvoice && !this.isEstimateInvoice) {
                    this.store.dispatch(this.invoiceReceiptActions.GetVoucherDetails(this.accountUniqueName, {
                        invoiceNumber: this.invoiceNo,
                        voucherType: this.parseVoucherType(this.invoiceType)
                    }));
                } else {
                    let obj: ProformaGetRequest = new ProformaGetRequest();
                    obj.accountUniqueName = this.accountUniqueName;
                    if (this.isProformaInvoice) {
                        obj.proformaNumber = this.invoiceNo;
                    } else {
                        obj.estimateNumber = this.invoiceNo;
                    }
                    this.store.dispatch(this.proformaActions.getProformaDetails(obj, this.invoiceType));
                }
            } else {
                // for edit mode direct from @Input
                if (this.accountUniqueName && this.invoiceNo && this.invoiceType) {
                    this.store.dispatch(this._generalActions.setAppTitle('/pages/proforma-invoice/invoice/' + this.invoiceType));
                    this.getVoucherDetailsFromInputs();
                }
            }

            if (!this.isUpdateMode) {
                this.resetInvoiceForm(this.invoiceForm);
            }

            this.getAllLastInvoices();
        });

        // bind state sources
        /* this.store.pipe(select(p => p.general.states), takeUntil(this.destroyed$)).subscribe((states) => {
           let arr: IOption[] = [];
           if (states) {
             states.forEach(d => {
               arr.push({ label: `${d.name}`, value: d.code });
             });
           }
           this.statesSource = arr;
         });*/

        // get account details and set it to local var
        this.selectedAccountDetails$.subscribe(o => {
            if (o && !this.isUpdateMode) {
                this.assignAccountDetailsValuesInForm(o);
            }
        });

        // get tax list and assign values to local vars
        this.store.pipe(select(p => p.company.isGetTaxesSuccess), takeUntil(this.destroyed$)).subscribe(isGetTaxes => {
            if (isGetTaxes) {
                this.store.pipe(select(p => p.company.taxes), takeUntil(this.destroyed$)).subscribe((o: TaxResponse[]) => {
                    if (o) {
                        this.companyTaxesList = o;
                        this.theadArrReadOnly.forEach((item: IContentCommon) => {
                            // show tax label
                            if (item.label === 'Tax') {
                                item.display = true;
                            }
                            return item;
                        });
                    } else {
                        this.companyTaxesList = [];
                    }
                });
            }
        });

        // listen for new add account utils
        this.newlyCreatedAc$.pipe(takeUntil(this.destroyed$)).subscribe((o: INameUniqueName) => {
            if (o && this.accountAsideMenuState === 'in') {
                let item: IOption = {
                    label: o.name,
                    value: o.uniqueName
                };
                this.onSelectCustomer(item);
            }
        });

        // create account success then hide aside pane
        this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((o) => {
            if (o && this.accountAsideMenuState === 'in') {
                this.toggleAccountAsidePane();
            }
        });

        // listen for universal date
        this.store.pipe(select((p: AppState) => p.session.applicationDate)).subscribe((dateObj: Date[]) => {
            if (dateObj) {
                try {
                    this.universalDate = moment(dateObj[1]).toDate();
                    this.assignDates();
                } catch (e) {
                    this.universalDate = new Date();
                }
            }
        });

        if (!this.isUpdateMode) {
            this.addBlankRow(null);
        }
        this.store.pipe(select((s: AppState) => s.invoice.settings), takeUntil(this.destroyed$)).subscribe((setting: InvoiceSetting) => {
            if (setting) {
                let duePeriod: number;
                if (this.isEstimateInvoice) {
                    duePeriod = setting.estimateSettings ? setting.estimateSettings.duePeriod : 0;
                } else if (this.isProformaInvoice) {
                    duePeriod = setting.proformaSettings ? setting.proformaSettings.duePeriod : 0;
                } else {
                    duePeriod = setting.invoiceSettings ? setting.invoiceSettings.duePeriod : 0;
                    this.useCustomInvoiceNumber = setting.invoiceSettings ? setting.invoiceSettings.useCustomInvoiceNumber : false;
                }
                this.invFormData.voucherDetails.dueDate = duePeriod > 0 ?
                    moment().add(duePeriod, 'days').toDate() : moment().toDate();
            }
        });

        this.uploadInput = new EventEmitter<UploadInput>();
        this.fileUploadOptions = {concurrency: 0};

        //region combine get voucher details && all flatten A/c's && create account and update account success from sidebar
        combineLatest([this.flattenAccountListStream$, this.voucherDetails$, this.createAccountIsSuccess$, this.updateAccountSuccess$])
            .pipe(takeUntil(this.destroyed$), auditTime(700))
            .subscribe(async results => {
                //this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';
                // create mode because voucher details are not available
                if (results[0]) {
                    let flattenAccounts: IFlattenAccountsResultItem[] = results[0];
                    // assign flatten A/c's
                    let bankaccounts: IOption[] = [];
                    this.sundryDebtorsAcList = [];
                    this.sundryCreditorsAcList = [];
                    this.prdSerAcListForDeb = [];
                    this.prdSerAcListForCred = [];

                    flattenAccounts.forEach(item => {

                        if (item.parentGroups.some(p => p.uniqueName === 'sundrydebtors')) {
                            this.sundryDebtorsAcList.push({label: item.name, value: item.uniqueName, additional: item});
                        }

                        if (item.parentGroups.some(p => p.uniqueName === 'sundrycreditors')) {
                            this.sundryCreditorsAcList.push({
                                label: item.name,
                                value: item.uniqueName,
                                additional: item
                            });
                        }

                        if (item.parentGroups.some(p => p.uniqueName === 'bankaccounts' || p.uniqueName === 'cash')) {
                            bankaccounts.push({label: item.name, value: item.uniqueName, additional: item});
                        }

                        if (item.parentGroups.some(p => p.uniqueName === 'otherincome' || p.uniqueName === 'revenuefromoperations')) {
                            if (item.stocks) {
                                // normal entry
                                this.prdSerAcListForDeb.push({
                                    value: item.uniqueName,
                                    label: item.name,
                                    additional: item
                                });

                                // stock entry
                                item.stocks.map(as => {
                                    this.prdSerAcListForDeb.push({
                                        value: `${item.uniqueName}#${as.uniqueName}`,
                                        label: `${item.name} (${as.name})`,
                                        additional: Object.assign({}, item, {stock: as})
                                    });
                                });
                            } else {
                                this.prdSerAcListForDeb.push({
                                    value: item.uniqueName,
                                    label: item.name,
                                    additional: item
                                });
                            }
                        }

                        if (item.parentGroups.some(p => p.uniqueName === 'operatingcost' || p.uniqueName === 'indirectexpenses')) {
                            if (item.stocks) {
                                // normal entry
                                this.prdSerAcListForCred.push({
                                    value: item.uniqueName,
                                    label: item.name,
                                    additional: item
                                });

                                // stock entry
                                item.stocks.map(as => {
                                    this.prdSerAcListForCred.push({
                                        value: `${item.uniqueName}#${as.uniqueName}`,
                                        label: `${item.name} (${as.name})`,
                                        additional: Object.assign({}, item, {stock: as})
                                    });
                                });
                            } else {
                                this.prdSerAcListForCred.push({
                                    value: item.uniqueName,
                                    label: item.name,
                                    additional: item
                                });
                            }
                        }

                    });

                    this.makeCustomerList();

                    /*
                      find and select customer from accountUniqueName basically for account-details-modal popup. only applicable when invoice no
                      is not available. if invoice no is there then it should be update mode
                    */
                    if (this.accountUniqueName && !this.invoiceNo) {
                        if (!this.isCashInvoice) {
                            this.customerAcList$.pipe(take(1)).subscribe(data => {
                                if (data && data.length) {
                                    let item = data.find(f => f.value === this.accountUniqueName);
                                    if (item) {
                                        this.invFormData.voucherDetails.customerName = item.label;
                                        this.invFormData.voucherDetails.customerUniquename = item.value;
                                        this.isCustomerSelected = true;
                                        this.invFormData.accountDetails.name = '';
                                    }
                                }
                            });
                        } else {
                            this.invFormData.voucherDetails.customerName = this.invFormData.accountDetails.name;
                            this.invFormData.voucherDetails.customerUniquename = this.invFormData.accountDetails.uniqueName;
                        }
                    }

                    bankaccounts = _.orderBy(bankaccounts, 'label');
                    this.bankAccounts$ = observableOf(bankaccounts);

                    if (this.invFormData.accountDetails) {
                        if (!this.invFormData.accountDetails.uniqueName) {
                            this.invFormData.accountDetails.uniqueName = 'cash';
                        }
                    }
                    this.depositAccountUniqueName = 'cash';
                }

                // update mode because voucher details is available
                if (results[0] && results[1]) {
                    let obj;

                    if (this.isLastInvoiceCopied) {
                        // if last invoice is copied then create new Voucher and copy only needed things not all things
                        obj = this.invFormData;
                    } else {
                        if ([VoucherTypeEnum.sales, VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote, VoucherTypeEnum.cash].includes(this.invoiceType)) {
                            let convertedRes1 = results[1];

                            // parse normal response to multi currency response
                            // only in sales and cash invoice
                            if (this.invoiceType === VoucherTypeEnum.sales || this.invoiceType === VoucherTypeEnum.cash) {
                                convertedRes1 = await this.modifyMulticurrencyRes(results[1]);

                                if (results[1].account.currency) {
                                    this.companyCurrencyName = results[1].account.currency.code;
                                }
                            }

                            obj = cloneDeep(convertedRes1) as VoucherClass;
                            this.selectedAccountDetails$.pipe(take(1)).subscribe(acc => {
                                obj.accountDetails.currencySymbol = acc.currencySymbol || '';
                            });

                        } else {
                            obj = cloneDeep((results[1] as GenericRequestForGenerateSCD).voucher);
                        }
                    }

                    if (obj.voucherDetails) {

                        // if last invoice is copied then don't copy customer/vendor name and it's details
                        if (!this.isLastInvoiceCopied && !this.isUpdateMode) {

                            // assign account details uniqueName because we are using accounts uniqueName not name
                            if (obj.accountDetails.uniqueName !== 'cash') {
                                obj.voucherDetails.customerUniquename = obj.accountDetails.uniqueName;
                            } else {
                                obj.voucherDetails.customerUniquename = obj.voucherDetails.customerName;
                            }
                        }

                        if (this.isLastInvoiceCopied) {
                            // if it's copied from last invoice then copy all entries && depositEntry from result we got in voucher details api
                            let result: VoucherClass | GenericRequestForGenerateSCD;

                            if (!this.isProformaInvoice && !this.isEstimateInvoice) {
                                result = ((results[1]) as VoucherClass);
                            } else {
                                result = ((results[1]) as GenericRequestForGenerateSCD).voucher;
                            }

                            obj.entries = result.entries;
                            obj.depositEntry = result.depositEntry || result.depositEntryToBeUpdated;
                            obj.templateDetails = result.templateDetails;
                        }

                        //added update mode as causing trouble in multicurrency
                        if (obj.entries.length) {
                            obj.entries = this.parseEntriesFromResponse(obj.entries, results[0]);
                        }

                        this.autoFillShipping = isEqual(obj.accountDetails.billingDetails, obj.accountDetails.shippingDetails);

                        /**
                         * depositAmountAfterUpdate :- amount that has been already paid, so we need to minus balance due from grand total
                         * so we can get how much amount of money is paid
                         * only applicable in sales invoice
                         */
                        if (this.isSalesInvoice) {
                            this.depositAmountAfterUpdate = obj.voucherDetails.deposit;
                        } else {
                            this.depositAmountAfterUpdate = 0;
                        }

                        // Getting from api old data "depositEntry" so here updating key with "depositEntryToBeUpdated"
                        // if (obj.depositEntry || obj.depositEntryToBeUpdated) {
                        //   if (obj.depositEntry) {
                        //     obj.depositEntryToBeUpdated = obj.depositEntry;
                        //     delete obj.depositEntry;
                        //   }
                        //   this.depositAmount = _.get(obj.depositEntryToBeUpdated, 'transactions[0].amount', 0);
                        //   this.depositAccountUniqueName = _.get(obj.depositEntryToBeUpdated, 'transactions[0].particular.uniqueName', '');
                        // }

                        // if last invoice is copied then don't copy voucherDate and dueDate
                        if (!this.isLastInvoiceCopied) {
                            // convert date object
                            if (this.isProformaInvoice) {
                                obj.voucherDetails.voucherDate = moment(obj.voucherDetails.proformaDate, 'DD-MM-YYYY').toDate();
                                obj.voucherDetails.voucherNumber = obj.voucherDetails.proformaNumber;
                            } else if (this.isEstimateInvoice) {
                                obj.voucherDetails.voucherDate = moment(obj.voucherDetails.estimateDate, 'DD-MM-YYYY').toDate();
                                obj.voucherDetails.voucherNumber = obj.voucherDetails.estimateNumber;
                            } else {
                                obj.voucherDetails.voucherDate = moment(obj.voucherDetails.voucherDate, 'DD-MM-YYYY').toDate();
                            }

                            if (obj.voucherDetails.dueDate) {
                                obj.voucherDetails.dueDate = moment(obj.voucherDetails.dueDate, 'DD-MM-YYYY').toDate();
                            }
                        }

                        if (!obj.accountDetails.billingDetails.state) {
                            obj.accountDetails.billingDetails.state = {};
                            if (this.isEstimateInvoice || this.isProformaInvoice) {
                                obj.accountDetails.billingDetails.state.code = this.getNewStateCode(obj.accountDetails.billingDetails.stateCode);
                            } else {
                                obj.accountDetails.billingDetails.state.code = obj.accountDetails.billingDetails.stateCode;
                            }
                            obj.accountDetails.billingDetails.state.name = obj.accountDetails.billingDetails.stateName;
                        }
                        if (!obj.accountDetails.shippingDetails.state) {
                            obj.accountDetails.shippingDetails.state = {};
                            if (this.isEstimateInvoice || this.isProformaInvoice) {
                                obj.accountDetails.shippingDetails.state.code = this.getNewStateCode(obj.accountDetails.shippingDetails.stateCode);
                            } else {
                                obj.accountDetails.shippingDetails.state.code = obj.accountDetails.shippingDetails.stateCode;
                            }
                            obj.accountDetails.shippingDetails.state.name = obj.accountDetails.shippingDetails.stateName;
                        }

                        if (!obj.voucherDetails.customerUniquename) {
                            obj.voucherDetails.customerUniquename = obj.accountDetails.uniqueName;
                        }
                        this.isCustomerSelected = true;
                        this.invoiceDataFound = true;
                        if (!obj.accountDetails.currencySymbol) {
                            obj.accountDetails.currencySymbol = '';
                        }
                        this.invFormData = obj;
                    } else {
                        this.invoiceDataFound = false;
                    }
                    this.isUpdateDataInProcess = false;
                }

                // create account success then close sidebar, and add customer details
                if (results[2]) {
                    // toggle sidebar if it's open
                    if (this.accountAsideMenuState === 'in') {
                        this.toggleAccountAsidePane();
                    }

                    let tempSelectedAcc: AccountResponseV2;
                    this.createdAccountDetails$.pipe(take(1)).subscribe(acc => tempSelectedAcc = acc);

                    if (this.customerNameDropDown) {
                        this.customerNameDropDown.clear();
                    }

                    if (tempSelectedAcc) {
                        this.invFormData.voucherDetails.customerName = tempSelectedAcc.name;
                        this.invFormData.voucherDetails.customerUniquename = tempSelectedAcc.uniqueName;

                        this.isCustomerSelected = true;
                        this.isMulticurrencyAccount = tempSelectedAcc.currencySymbol !== this.baseCurrencySymbol;
                        this.customerCountryName = tempSelectedAcc.country.countryName;

                        this.showGstAndTrnUsingCountryName(this.customerCountryName);
                        if (this.isMulticurrencyAccount) {
                            this.getCurrencyRate(this.companyCurrency, tempSelectedAcc.currency);
                            this.getUpdatedStateCodes(tempSelectedAcc.country.countryCode).then(() => {
                                this.invFormData.accountDetails = new AccountDetailsClass(tempSelectedAcc);
                            });
                            this.companyCurrencyName = tempSelectedAcc.currency;
                        } else {
                            this.invFormData.accountDetails = new AccountDetailsClass(tempSelectedAcc);
                        }
                        // reset customer details so we don't have conflicts when we create voucher second time
                        this.store.dispatch(this.salesAction.resetAccountDetailsForSales());
                    } else {
                        this.isCustomerSelected = false;
                    }
                }

                // update account success then close sidebar, and update customer details
                if (results[3]) {
                    // toggle sidebar if it's open
                    if (this.accountAsideMenuState === 'in') {
                        this.toggleAccountAsidePane();
                    }

                    let tempSelectedAcc: AccountResponseV2;
                    this.updatedAccountDetails$.pipe(take(1)).subscribe(acc => tempSelectedAcc = acc);
                    if (tempSelectedAcc) {
                        if (tempSelectedAcc.addresses && tempSelectedAcc.addresses.length) {
                            tempSelectedAcc.addresses = [_.find(tempSelectedAcc.addresses, (tax) => tax.isDefault)];
                        }
                        this.invFormData.voucherDetails.customerUniquename = null;
                        this.invFormData.voucherDetails.customerName = tempSelectedAcc.name;
                        this.invFormData.accountDetails = new AccountDetailsClass(tempSelectedAcc);
                        this.isCustomerSelected = true;

                        setTimeout(() => this.invFormData.voucherDetails.customerUniquename = tempSelectedAcc.uniqueName, 500);

                        // reset customer details so we don't have conflicts when we create voucher second time
                        this.store.dispatch(this.salesAction.resetAccountDetailsForSales());
                    } else {
                        this.isCustomerSelected = false;
                    }
                }

                this.calculateBalanceDue();
                this.calculateTotalDiscount();
                this.calculateTotalTaxSum();
                this._cdr.detectChanges();
            });
        // endregion

        // listen for newly added stock and assign value
        combineLatest(this.newlyCreatedStockAc$, this.salesAccounts$).subscribe((resp: any[]) => {
            let o = resp[0];
            let acData = resp[1];
            if (o && acData) {
                let result: IOption = _.find(acData, (item: IOption) => item.additional.uniqueName === o.linkedAc && item.additional && item.additional.stock && item.additional.stock.uniqueName === o.uniqueName);
                if (result && !_.isUndefined(this.innerEntryIdx)) {
                    this.invFormData.entries[this.innerEntryIdx].transactions[0].fakeAccForSelect2 = result.value;
                    this.onSelectSalesAccount(result, this.invFormData.entries[this.innerEntryIdx].transactions[0], this.invFormData.entries[this.innerEntryIdx]);
                }
            }
        });

        this._breakpointObserver
            .observe(['(max-width: 840px)'])
            .pipe(takeUntil(this.destroyed$))
            .subscribe((st: BreakpointState) => {
                this.isMobileView = st.matches;
            });

        this.bulkItemsModal.onHidden.subscribe(() => {
            this.showBulkItemModal = false;
        });

        this.generateVoucherSuccess$.subscribe(result => {
            if (result) {
                this.resetInvoiceForm(this.invoiceForm);

                let lastGenVoucher: { voucherNo: string, accountUniqueName: string } = {
                    voucherNo: '',
                    accountUniqueName: ''
                };
                this.lastGeneratedVoucherNo$.pipe(take(1)).subscribe(s => lastGenVoucher = s);
                this.invoiceNo = lastGenVoucher.voucherNo;
                this.accountUniqueName = lastGenVoucher.accountUniqueName;
                this.postResponseAction(this.invoiceNo);
                if (!this.isUpdateMode) {
                    this.getAllLastInvoices();
                }
            }
        });

        this.updateVoucherSuccess$.subscribe(result => {
            if (result) {
                this.doAction(ActionTypeAfterVoucherGenerateOrUpdate.updateSuccess);
                this.postResponseAction(this.invoiceNo);
            }
        });

        combineLatest([
            this.lastInvoices$, this.lastProformaInvoices$
        ])
            .pipe(takeUntil(this.destroyed$))
            .subscribe(result => {
                let arr: PreviousInvoicesVm[] = [];
                if (!this.isProformaInvoice && !this.isEstimateInvoice) {
                    if (result[0]) {
                        result[0] = result[0] as ReciptResponse;
                        result[0].items.forEach(item => {
                            arr.push({
                                versionNumber: item.voucherNumber, date: item.voucherDate, grandTotal: item.grandTotal,
                                account: {name: item.account.name, uniqueName: item.account.uniqueName}
                            });
                        });
                    }
                } else {
                    if (result[1]) {
                        result[1] = result[1] as ProformaResponse;
                        result[1].results.forEach(item => {
                            arr.push({
                                versionNumber: this.isProformaInvoice ? item.proformaNumber : item.estimateNumber,
                                date: this.isProformaInvoice ? item.proformaDate : item.estimateDate,
                                grandTotal: item.grandTotal,
                                account: {name: item.customerName, uniqueName: item.customerUniqueName}
                            });
                        });
                    }
                }
                this.lastInvoices = [...arr];
            });
    }

    private async prepareCompanyCountryAndCurrencyFromProfile(profile) {
        if (profile) {
            this.customerCountryName = profile.country;

            this.showGstAndTrnUsingCountryName(profile.country);

            this.companyCurrency = profile.baseCurrency || 'INR';
            this.baseCurrencySymbol = profile.baseCurrencySymbol;
            this.depositCurrSymbol = this.baseCurrencySymbol;
            this.companyCurrencyName = profile.baseCurrency;

            this.isMultiCurrencyAllowed = profile.isMultipleCurrency;
            this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';
            if (profile.countryCode) {
                this.countryCode = profile.countryCode;
            } else if (profile.countryV2 && profile.countryV2.alpha2CountryCode) {
                this.countryCode = profile.countryV2.alpha2CountryCode;
            }
            if (!this.isUpdateMode) {
                await this.getUpdatedStateCodes(this.countryCode);
            }
        } else {
            this.customerCountryName = '';

            this.showGstAndTrnUsingCountryName('');

            this.companyCurrency = 'INR';
            this.isMultiCurrencyAllowed = false;
        }
    }

    public assignDates() {
        let date = _.cloneDeep(this.universalDate);
        this.invFormData.voucherDetails.voucherDate = date;

        this.invFormData.entries.forEach((entry: SalesEntryClass) => {
            entry.transactions.forEach((txn: SalesTransactionItemClass) => {
                if (!txn.accountUniqueName) {
                    entry.entryDate = date;
                }
            });
        });
    }

    /**
     * Returns new state codes from old state codes
     *
     * @private
     * @param {string} oldStatusCode Old state code
     * @returns {string} Returns new state code
     * @memberof ProformaInvoiceComponent
     */
    private getNewStateCode(oldStatusCode: string): string {
        const currentState = this.statesSource.find((st: any) => (oldStatusCode === st.value || oldStatusCode === st.stateGstCode));
        return (currentState) ? currentState.value : '';
    }

    public makeCustomerList() {
        if (!(this.invoiceType === VoucherTypeEnum.debitNote || this.invoiceType === VoucherTypeEnum.purchase)) {
            this.customerAcList$ = observableOf(_.orderBy(this.sundryDebtorsAcList, 'label'));
            this.salesAccounts$ = observableOf(_.orderBy(this.prdSerAcListForDeb, 'label'));
            this.selectedGrpUniqueNameForAddEditAccountModal = 'sundrydebtors';
        } else {
            this.selectedGrpUniqueNameForAddEditAccountModal = 'sundrycreditors';
            this.customerAcList$ = observableOf(_.orderBy(this.sundryCreditorsAcList, 'label'));
            this.salesAccounts$ = observableOf(_.orderBy(this.prdSerAcListForCred, 'label'));
        }
        this.focusInCustomerName();
    }

    public pageChanged(val: string, label: string) {
        this.router.navigate(['pages', 'proforma-invoice', 'invoice', val]);
    }

    public prepareInvoiceTypeFlags() {
        this.isSalesInvoice = this.invoiceType === VoucherTypeEnum.sales;
        this.isCashInvoice = this.invoiceType === VoucherTypeEnum.cash;
        this.isPurchaseInvoice = this.invoiceType === VoucherTypeEnum.purchase;
        this.isProformaInvoice = this.invoiceType === VoucherTypeEnum.proforma || this.invoiceType === VoucherTypeEnum.generateProforma;
        this.isEstimateInvoice = this.invoiceType === VoucherTypeEnum.estimate || this.invoiceType === VoucherTypeEnum.generateEstimate;

        // special case when we double click on account name and that accountUniqueName is cash then we have to mark as Cash Invoice
        if (this.isSalesInvoice) {
            if (this.accountUniqueName === 'cash') {
                this.isSalesInvoice = false;
                this.isCashInvoice = true;
            }
        }

        if (!this.isCashInvoice) {
            this.customerPlaceHolder = `Select ${!this.isPurchaseInvoice ? 'Customer' : 'Vendor'}`;
            this.customerNotFoundText = `Add ${!this.isPurchaseInvoice ? 'Customer' : 'Vendor'}`;
        }

        if (this.isProformaInvoice || this.isEstimateInvoice) {
            this.invoiceNoLabel = this.isProformaInvoice ? 'Proforma #' : 'Estimate #';
            this.invoiceDateLabel = this.isProformaInvoice ? 'Proforma Date' : 'Estimate Date';
            this.invoiceDueDateLabel = 'Expiry Date';
        } else {
            this.invoiceNoLabel = !this.isPurchaseInvoice ? 'Invoice #' : 'Purchase Invoice #';
            this.invoiceDateLabel = 'Invoice Date';
            this.invoiceDueDateLabel = !this.isPurchaseInvoice ? 'Due Date' : 'Balance Due Date';
        }

        //---------------------//
        // if sales,cash,estimate,proforma invoice then apply 'GST' taxes remove 'InputGST'
        if (this.isSalesInvoice || this.isCashInvoice || this.isProformaInvoice || this.isEstimateInvoice) {
            this.exceptTaxTypes.push('InputGST');
            this.exceptTaxTypes = this.exceptTaxTypes.filter(ele => {
                return ele !== 'GST';
            });
        }

        // if purchase invoice then apply 'InputGST' taxes remove 'GST'
        if (this.isPurchaseInvoice) {
            this.exceptTaxTypes.push('GST');
            this.exceptTaxTypes = this.exceptTaxTypes.filter(ele => {
                return ele !== 'InputGST';
            });
        }
        //---------------------//

    }

    public getAllFlattenAc() {
        // call to get flatten account from store
        this.store.dispatch(this._generalActions.getFlattenAccount());
    }

    public assignAccountDetailsValuesInForm(data: AccountResponseV2) {
        this.customerCountryName = data.country.countryName;
        this.showGstAndTrnUsingCountryName(this.customerCountryName);
        if (this.isInvoiceRequestedFromPreviousPage) {
            this.invFormData.voucherDetails.customerUniquename = data.uniqueName;
            this.invFormData.voucherDetails.customerName = data.name;
        }
        // toggle all collapse
        this.isGenDtlCollapsed = false;
        this.isMlngAddrCollapsed = false;
        this.isOthrDtlCollapsed = false;

        this.getUpdatedStateCodes(data.country.countryCode).then(() => {
            if (data.addresses && data.addresses.length) {
                data.addresses = [_.find(data.addresses, (tax) => tax.isDefault)];
            }
            // auto fill all the details
            this.invFormData.accountDetails = new AccountDetailsClass(data);

            setTimeout(() => {
                this.customerBillingAddress.nativeElement.focus();
            }, 500);
        });
    }

    public getStateCode(type: string, statesEle: SalesShSelectComponent) {
        let gstVal = _.cloneDeep(this.invFormData.accountDetails[type].gstNumber);
        if (gstVal && gstVal.length >= 2) {
            let s = this.statesSource.find(item => item.value === gstVal.substr(0, 2));
            if (s) {
                this.invFormData.accountDetails[type].stateCode = s.value;
            } else {
                this.invFormData.accountDetails[type].stateCode = null;
                this._toasty.clearAllToaster();

                if (this.showGSTINNo) {
                    this._toasty.warningToast('Invalid GSTIN.');
                } else {
                    this._toasty.warningToast('Invalid TRN.');
                }
            }
            statesEle.disabled = true;

        } else {
            statesEle.disabled = false;
            this.invFormData.accountDetails[type].stateCode = null;
        }
    }

    public resetInvoiceForm(f: NgForm) {
        if (f) {
            f.form.reset();
        }
        this.showSwitchedCurr = false;
        this.autoSaveIcon = false;
        this.autoFillShipping = true;
        this.showCurrencyValue = false;
        this.invFormData = new VoucherClass();
        this.depositAccountUniqueName = '';
        this.accountUniqueName = "";
        this.invoiceNo = "";
        this.typeaheadNoResultsOfCustomer = false;
        // toggle all collapse
        this.isGenDtlCollapsed = true;
        this.isMlngAddrCollapsed = true;
        this.isOthrDtlCollapsed = false;
        this.forceClear$ = observableOf({status: true});
        this.isCustomerSelected = false;
        this.selectedFileName = '';

        this.assignDates();
        let invoiceSettings: InvoiceSetting = null;
        this.store.pipe(select(s => s.invoice.settings), take(1)).subscribe(res => invoiceSettings = res);
        if (invoiceSettings) {
            let duePeriod: number;
            if (this.isEstimateInvoice) {
                duePeriod = invoiceSettings.estimateSettings ? invoiceSettings.estimateSettings.duePeriod : 0;
            } else if (this.isProformaInvoice) {
                duePeriod = invoiceSettings.proformaSettings ? invoiceSettings.proformaSettings.duePeriod : 0;
            } else {
                duePeriod = invoiceSettings.invoiceSettings ? invoiceSettings.invoiceSettings.duePeriod : 0;
            }
            this.invFormData.voucherDetails.dueDate = duePeriod > 0 ?
                moment().add(duePeriod, 'days').toDate() : moment().toDate();

            this.invFormData.voucherDetails.dueDate = duePeriod > 0 ?
                moment().add(duePeriod, 'days').toDate() : moment().toDate();
        }
        this.ngAfterViewInit();
    }

    public triggerSubmitInvoiceForm(f: NgForm, isUpdate) {
        this.updateAccount = isUpdate;
        this.onSubmitInvoiceForm(f);
    }

    public autoFillShippingDetails() {
        // auto fill shipping address
        if (this.autoFillShipping) {
            this.invFormData.accountDetails.shippingDetails = _.cloneDeep(this.invFormData.accountDetails.billingDetails);
        }
    }

    public convertDateForAPI(val: any): string {
        if (val) {
            try {
                return moment(val).format(GIDDH_DATE_FORMAT);
            } catch (error) {
                return '';
            }
        } else {
            return '';
        }
    }

    public onSubmitInvoiceForm(f?: NgForm) {
        let data: VoucherClass = _.cloneDeep(this.invFormData);

        // special check if gst no filed is visible then and only then check for gst validation
        if (data.accountDetails.billingDetails.gstNumber && this.showGSTINNo) {
            if (!this.isValidGstIn(data.accountDetails.billingDetails.gstNumber)) {
                this._toasty.errorToast('Invalid gst no in Billing Address! Please fix and try again');
                return;
            }
            if (!this.autoFillShipping) {
                if (!this.isValidGstIn(data.accountDetails.shippingDetails.gstNumber)) {
                    this._toasty.errorToast('Invalid gst no in Shipping Address! Please fix and try again');
                    return;
                }
            }
        }

        if (this.isSalesInvoice || this.isPurchaseInvoice || this.isProformaInvoice || this.isEstimateInvoice) {
            if (moment(data.voucherDetails.dueDate, 'DD-MM-YYYY').isBefore(moment(data.voucherDetails.voucherDate, 'DD-MM-YYYY'), 'd')) {
                this._toasty.errorToast('Due date cannot be less than Invoice Date');
                return;
            }
        } else {
            delete data.voucherDetails.dueDate;
        }

        data.entries = data.entries.filter((entry, indx) => {
            if (!entry.transactions[0].accountUniqueName && indx !== 0) {
                this.invFormData.entries.splice(indx, 1);
            }
            return entry.transactions[0].accountUniqueName;
        });

        data.entries = data.entries.map(entry => {
            // filter active discounts
            entry.discounts = entry.discounts.filter(dis => dis.isActive);

            // filter active taxes
            entry.taxes = entry.taxes.filter(tax => tax.isChecked);
            return entry;
        });

        if (!data.accountDetails.uniqueName) {
            data.accountDetails.uniqueName = 'cash';
        }
        let txnErr: boolean;
        // before submit request making some validation rules
        // check for account uniqueName
        if (data.accountDetails) {
            if (!data.accountDetails.uniqueName) {
                if (this.typeaheadNoResultsOfCustomer) {
                    this._toasty.warningToast('Need to select Bank/Cash A/c or Customer Name');
                } else {
                    this._toasty.warningToast('Customer Name can\'t be empty');
                }
                return;
            }
            if (data.accountDetails.email) {
                if (!EMAIL_REGEX_PATTERN.test(data.accountDetails.email)) {
                    this._toasty.warningToast('Invalid Email Address.');
                    return;
                }
            }
        }

        // replace /n to br for (shipping and billing)

        if (data.accountDetails.shippingDetails.address && data.accountDetails.shippingDetails.address.length && data.accountDetails.shippingDetails.address[0].length > 0) {
            data.accountDetails.shippingDetails.address[0] = data.accountDetails.shippingDetails.address[0].replace(/\n/g, '<br />');
            data.accountDetails.shippingDetails.address = data.accountDetails.shippingDetails.address[0].split('<br />');
        }
        if (data.accountDetails.billingDetails.address && data.accountDetails.billingDetails.address.length && data.accountDetails.billingDetails.address[0].length > 0) {
            data.accountDetails.billingDetails.address[0] = data.accountDetails.billingDetails.address[0].replace(/\n/g, '<br />');
            data.accountDetails.billingDetails.address = data.accountDetails.billingDetails.address[0].split('<br />');
        }

        // convert date object
        if (this.invoiceType === VoucherTypeEnum.generateProforma || this.invoiceType === VoucherTypeEnum.proforma) {
            data.voucherDetails.proformaDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
        } else if (this.invoiceType === VoucherTypeEnum.generateEstimate || this.invoiceType === VoucherTypeEnum.estimate) {
            data.voucherDetails.estimateDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
        } else {
            data.voucherDetails.voucherDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
        }

        data.voucherDetails.dueDate = this.convertDateForAPI(data.voucherDetails.dueDate);
        data.templateDetails.other.shippingDate = this.convertDateForAPI(data.templateDetails.other.shippingDate);

        // check for valid entries and transactions
        if (data.entries) {
            _.forEach(data.entries, (entry) => {
                _.forEach(entry.transactions, (txn: SalesTransactionItemClass) => {
                    // convert date object
                    // txn.date = this.convertDateForAPI(txn.date);
                    entry.entryDate = this.convertDateForAPI(entry.entryDate);
                    txn.convertedAmount = this.fetchedConvertedRate > 0 ? giddhRoundOff((Number(txn.amount) * this.fetchedConvertedRate), 2) : 0;

                    // we need to remove # from account uniqueName because we are appending # to stock for uniqueNess
                    if (this.isLastInvoiceCopied) {
                        if (txn.stockList && txn.stockList.length) {
                            txn.accountUniqueName = txn.accountUniqueName.indexOf('#') > -1 ? txn.accountUniqueName.slice(0, txn.accountUniqueName.indexOf('#')) : txn.accountUniqueName;
                            txn.fakeAccForSelect2 = txn.accountUniqueName.indexOf('#') > -1 ? txn.fakeAccForSelect2.slice(0, txn.fakeAccForSelect2.indexOf('#')) : txn.fakeAccForSelect2;
                        }
                    }

                    // will get errors of string and if not error then true boolean
                    if (!txn.isValid()) {
                        this._toasty.warningToast('Product/Service can\'t be empty');
                        txnErr = true;
                        return false;
                    } else {
                        txnErr = false;
                    }
                });
            });
        } else {
            this._toasty.warningToast('At least a single entry needed to generate sales-invoice');
            return;
        }

        // if txn has errors
        if (txnErr) {
            return false;
        }

        // set voucher type
        data.entries = data.entries.map((entry) => {
            entry.voucherType = this.parseVoucherType(this.invoiceType);
            entry.taxList = entry.taxes.map(m => m.uniqueName);
            entry.tcsCalculationMethod = entry.otherTaxModal.tcsCalculationMethod;

            if (entry.isOtherTaxApplicable) {
                entry.taxList.push(entry.otherTaxModal.appliedOtherTax.uniqueName);
            }

            if (entry.otherTaxType === 'tds') {
                delete entry['tcsCalculationMethod'];
            }
            return entry;
        });
        let exRate = this.originalExchangeRate;
        let obj: GenericRequestForGenerateSCD = {
            account: data.accountDetails,
            updateAccountDetails: this.updateAccount,
            voucher: data,
            entries: [],
            date: data.voucherDetails.voucherDate,
            type: this.invoiceType,
            exchangeRate: exRate,
            dueDate: data.voucherDetails.dueDate
        };

        // set voucher type
        obj.voucher.voucherDetails.voucherType = this.parseVoucherType(this.invoiceType);

        // set state details as new request
        obj.account.billingDetails.countryName = this.customerCountryName;
        obj.account.billingDetails.stateCode = obj.account.billingDetails.state.code;
        obj.account.billingDetails.stateName = obj.account.billingDetails.state.name;

        // set state details as new request
        obj.account.shippingDetails.countryName = this.customerCountryName;
        obj.account.shippingDetails.stateCode = obj.account.shippingDetails.state.code;
        obj.account.shippingDetails.stateName = obj.account.shippingDetails.state.name;

        if (this.isProformaInvoice || this.isEstimateInvoice) {

            if (this.depositAmount && this.depositAmount > 0) {
                obj.paymentAction = {
                    action: 'paid',
                    amount: Number(this.depositAmount) + this.depositAmountAfterUpdate
                };
                if (this.isCustomerSelected) {
                    obj.depositAccountUniqueName = this.depositAccountUniqueName;
                } else {
                    obj.depositAccountUniqueName = data.accountDetails.uniqueName;
                }
            } else {
                obj.depositAccountUniqueName = '';
            }
            this.store.dispatch(this.proformaActions.generateProforma(obj));
        } else {
            let updatedData = obj;
            let isVoucherV4 = false;
            if (this.isSalesInvoice || this.isCashInvoice) {
                updatedData = this.updateData(obj, data);
                isVoucherV4 = true;
                if (this.useCustomInvoiceNumber) {
                    updatedData['number'] = this.invFormData.voucherDetails.voucherNumber;
                }
            }
            this.salesService.generateGenericItem(updatedData, isVoucherV4).pipe(takeUntil(this.destroyed$)).subscribe((response: BaseResponse<any, GenericRequestForGenerateSCD>) => {
                if (response.status === 'success') {
                    // reset form and other
                    this.resetInvoiceForm(f);

                    if (response.body.account) {
                        this.voucherNumber = response.body.number;
                        this.invoiceNo = this.voucherNumber;
                        this.accountUniqueName = response.body.account.uniqueName;
                    } else {
                        this.voucherNumber = response.body.voucherDetails.voucherNumber;
                        this.invoiceNo = this.voucherNumber;
                        this.accountUniqueName = response.body.accountDetails.uniqueName;
                    }

                    if (this.isPurchaseInvoice) {
                        this._toasty.successToast(`Entry created successfully`);
                    } else {
                        this._toasty.successToast(`Entry created successfully with Voucher Number: ${this.voucherNumber}`);
                    }
                    this.postResponseAction(this.invoiceNo);
                } else {
                    this._toasty.errorToast(response.message, response.code);
                }
                this.updateAccount = false;
            }, (error1 => {
                this._toasty.errorToast('Something went wrong! Try again');
            }));
        }
    }

    public onNoResultsClicked(idx?: number) {
        if (_.isUndefined(idx)) {
            this.getAllFlattenAc();
        } else {
            this.innerEntryIdx = idx;
        }
        this.asideMenuStateForProductService = this.asideMenuStateForProductService === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public toggleBodyClass() {
        if (this.asideMenuStateForProductService === 'in' || this.accountAsideMenuState === 'in' || this.asideMenuStateForRecurringEntry === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public toggleOtherTaxesAsidePane(modalBool: boolean, index: number = null) {

        if (!modalBool) {
            let entry = this.invFormData.entries[this.activeIndx];
            if (entry) {
                entry.otherTaxModal = new SalesOtherTaxesModal();
                entry.otherTaxSum = 0;
            }
            return;
        } else {
            if (index !== null) {
                this.entriesListBeforeTax = cloneDeep(this.invFormData.entries);
                // this.selectedEntry = cloneDeep(this.invFormData.entries[index]);
            }
        }

        this.asideMenuStateForOtherTaxes = this.asideMenuStateForOtherTaxes === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public checkForInfinity(value): number {
        return (value === Infinity) ? 0 : value;
    }

    public calculateTotalDiscountOfEntry(entry: SalesEntryClass, trx: SalesTransactionItemClass, calculateEntryTotal: boolean = true) {
        let percentageListTotal = entry.discounts.filter(f => f.isActive)
            .filter(s => s.discountType === 'PERCENTAGE')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;

        let fixedListTotal = entry.discounts.filter(f => f.isActive)
            .filter(s => s.discountType === 'FIX_AMOUNT')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;

        let perFromAmount = ((percentageListTotal * trx.amount) / 100);
        entry.discountSum = perFromAmount + fixedListTotal;

        if (calculateEntryTotal) {
            this.calculateEntryTotal(entry, trx);
        }
        trx.taxableValue = Number(trx.amount) - entry.discountSum;
    }

    public calculateEntryTaxSum(entry: SalesEntryClass, trx: SalesTransactionItemClass, calculateEntryTotal: boolean = true) {
        let taxPercentage: number = 0;
        let cessPercentage: number = 0;
        entry.taxes.filter(f => f.isChecked).forEach(tax => {
            if (tax.type === 'gstcess') {
                cessPercentage += tax.amount;
            } else {
                taxPercentage += tax.amount;
            }
        });

        entry.taxSum = ((taxPercentage * (trx.amount - entry.discountSum)) / 100);
        entry.cessSum = ((cessPercentage * (trx.amount - entry.discountSum)) / 100);

        if (calculateEntryTotal) {
            this.calculateEntryTotal(entry, trx);
        }
    }

    public calculateStockEntryAmount(trx: SalesTransactionItemClass) {
        trx.amount = Number(trx.quantity) * Number(trx.rate);
    }

    public calculateEntryTotal(entry: SalesEntryClass, trx: SalesTransactionItemClass) {
        trx.total = ((trx.amount - entry.discountSum) + (entry.taxSum + entry.cessSum));

        this.calculateSubTotal();
        this.calculateTotalDiscount();
        this.calculateTotalTaxSum();
        this.calculateGrandTotal();
        this.calculateBalanceDue();
    }

    public calculateWhenTrxAltered(entry: SalesEntryClass, trx: SalesTransactionItemClass) {
        trx.amount = Number(trx.amount);
        this.calculateTotalDiscountOfEntry(entry, trx, false);
        this.calculateEntryTaxSum(entry, trx, false);
        this.calculateEntryTotal(entry, trx);
        this.calculateOtherTaxes(entry.otherTaxModal, entry);
        this.calculateTcsTdsTotal();
        this.calculateBalanceDue();
    }

    public calculateTotalDiscount() {
        let discount = 0;
        this.invFormData.entries.forEach(f => {
            discount += f.discountSum;
        });
        this.invFormData.voucherDetails.totalDiscount = discount;
    }

    public calculateTotalTaxSum() {
        let taxes = 0;
        let cess = 0;

        this.invFormData.entries.forEach(f => {
            taxes += f.taxSum;
        });

        this.invFormData.entries.forEach(f => {
            cess += f.cessSum;
        });

        this.invFormData.voucherDetails.gstTaxesTotal = taxes;
        this.invFormData.voucherDetails.cessTotal = cess;
        this.invFormData.voucherDetails.totalTaxableValue = this.invFormData.voucherDetails.subTotal - this.invFormData.voucherDetails.totalDiscount;
    }

    public calculateTcsTdsTotal() {
        let tcsSum: number = 0;
        let tdsSum: number = 0;

        this.invFormData.entries.forEach(entry => {
            tcsSum += entry.otherTaxType === 'tcs' ? entry.otherTaxSum : 0;
            tdsSum += entry.otherTaxType === 'tds' ? entry.otherTaxSum : 0;
        });

        this.invFormData.voucherDetails.tcsTotal = tcsSum;
        this.invFormData.voucherDetails.tdsTotal = tdsSum;
    }

    public calculateBalanceDue() {
        let count: number = 0;
        let depositAmount = Number(this.depositAmount);
        if (this.isMulticurrencyAccount) {
            if (this.depositCurrSymbol === this.invFormData.accountDetails.currencySymbol) {
                depositAmount = depositAmount * this.exchangeRate;
            }
            depositAmount = depositAmount / this.exchangeRate || 0;
        }
        this.invFormData.entries.forEach(f => {
            count += f.transactions.reduce((pv, cv) => {
                return pv + cv.total;
            }, 0);
        });
        this.invFormData.voucherDetails.balanceDue =
            ((count + this.invFormData.voucherDetails.tcsTotal) - this.invFormData.voucherDetails.tdsTotal) - depositAmount - Number(this.depositAmountAfterUpdate);
        this.invFormData.voucherDetails.balanceDue = this.invFormData.voucherDetails.balanceDue + this.calculatedRoundOff;
    }

    public calculateSubTotal() {
        let count: number = 0;
        this.invFormData.entries.forEach(f => {
            count += f.transactions.reduce((pv, cv) => {
                return pv + Number(cv.amount);
            }, 0);
        });
        this.invFormData.voucherDetails.subTotal = count;
    }

    public calculateGrandTotal() {

        let calculatedGrandTotal = 0;
        calculatedGrandTotal = this.invFormData.voucherDetails.grandTotal = this.invFormData.entries.reduce((pv, cv) => {
            return pv + cv.transactions.reduce((pvt, cvt) => pvt + cvt.total, 0);
        }, 0);

        //Save the Grand Total for Edit
        if (calculatedGrandTotal > 0) {
            this.calculatedRoundOff = Number((Math.round(calculatedGrandTotal) - calculatedGrandTotal).toFixed(2));
            if (this.calculatedRoundOff === 0.5) {
                this.calculatedRoundOff = -this.calculatedRoundOff;
            }
            calculatedGrandTotal = calculatedGrandTotal + this.calculatedRoundOff;
        }
        this.invFormData.voucherDetails.grandTotal = calculatedGrandTotal;
        this.grandTotalMulDum = calculatedGrandTotal * this.exchangeRate;
    }

    public generateTotalAmount(txns: SalesTransactionItemClass[]) {
        let res: number = 0;
        _.forEach(txns, (txn: SalesTransactionItemClass) => {
            if (txn.quantity && txn.rate) {
                res += this.checkForInfinity(txn.rate) * this.checkForInfinity(txn.quantity);
            } else {
                res += Number(this.checkForInfinity(txn.amount));
            }
        });
        return res;
    }

    public generateTotalTaxAmount(txns: SalesTransactionItemClass[]) {
        let res: number = 0;
        _.forEach(txns, (txn: SalesTransactionItemClass) => {
            if (txn.total === 0) {
                res += 0;
            } else {
                res += this.checkForInfinity((txn.total - txn.taxableValue));
            }
        });
        return res;
    }

    public onSelectSalesAccount(selectedAcc: any, txn: SalesTransactionItemClass, entry: SalesEntryClass): any {
        if (selectedAcc.value && selectedAcc.additional.uniqueName) {

            let o = _.cloneDeep(selectedAcc.additional);

            // check if we have quantity in additional object. it's for only bulk add mode
            txn.quantity = o.quantity ? o.quantity : null;
            txn.applicableTaxes = [];
            txn.sku_and_customfields = null;

            // description with sku and custom fields
            if ((o.stock) && (this.isCashInvoice || this.isSalesInvoice || this.isPurchaseInvoice)) {
                let description = [];
                let skuCodeHeading = o.stock.skuCodeHeading ? o.stock.skuCodeHeading : 'SKU Code';
                if (o.stock.skuCode) {
                    description.push(skuCodeHeading + ':' + o.stock.skuCode);
                }

                let customField1Heading = o.stock.customField1Heading ? o.stock.customField1Heading : 'Custom field 1';
                if (o.stock.customField1Value) {
                    description.push(customField1Heading + ':' + o.stock.customField1Value);
                }

                let customField2Heading = o.stock.customField2Heading ? o.stock.customField2Heading : 'Custom field 2';
                if (o.stock.customField2Value) {
                    description.push(customField2Heading + ':' + o.stock.customField2Value);
                }

                txn.sku_and_customfields = description.join(', ');
            }
            //------------------------

            // assign taxes and create fluctuation
            if (o.stock && o.stock.stockTaxes && o.stock.stockTaxes.length) {
                o.stock.stockTaxes.forEach(t => {
                    let tax = this.companyTaxesList.find(f => f.uniqueName === t);
                    if (tax) {
                        switch (tax.taxType) {
                            case 'tcsrc':
                            case 'tcspay':
                            case 'tdsrc':
                            case 'tdspay':
                                entry.otherTaxModal.appliedOtherTax = {name: tax.name, uniqueName: tax.uniqueName};
                                entry.isOtherTaxApplicable = true;
                                break;
                            default:
                                txn.applicableTaxes.push(t);
                                break;
                        }
                    }
                });
            } else {
                // assign taxes for non stock accounts
                txn.applicableTaxes = o.applicableTaxes;
            }

            txn.accountName = o.name;
            txn.accountUniqueName = o.uniqueName;

            if (o.stocks && o.stock) {
                // set rate auto
                txn.rate = null;
                let obj: IStockUnit = {
                    id: o.stock.stockUnit.code,
                    text: o.stock.stockUnit.name
                };
                txn.stockList = [];
                if (o.stock && o.stock.accountStockDetails.unitRates.length) {
                    txn.stockList = this.prepareUnitArr(o.stock.accountStockDetails.unitRates);
                    txn.stockUnit = txn.stockList[0].id;
                    txn.rate = txn.stockList[0].rate;
                } else {
                    txn.stockList.push(obj);
                    txn.stockUnit = o.stock.stockUnit.code;
                }
                txn.stockDetails = _.omit(o.stock, ['accountStockDetails', 'stockUnit']);
                txn.isStockTxn = true;
            } else {
                txn.isStockTxn = false;
                txn.stockUnit = null;
                txn.stockDetails = null;
                txn.stockList = [];
                // reset fields
                txn.rate = null;
                txn.quantity = null;
                txn.amount = 0;
                txn.taxableValue = 0;
            }
            txn.sacNumber = null;
            txn.hsnNumber = null;
            if (txn.stockDetails && txn.stockDetails.hsnNumber) {
                txn.hsnNumber = txn.stockDetails.hsnNumber;
                txn.hsnOrSac = 'hsn';
            }
            if (txn.stockDetails && txn.stockDetails.sacNumber) {
                txn.sacNumber = txn.stockDetails.sacNumber;
                txn.hsnOrSac = 'sac';
            }

            if (!o.stock && o.hsnNumber) {
                txn.hsnNumber = o.hsnNumber;
                txn.hsnOrSac = 'hsn';
            }
            if (!o.stock && o.sacNumber) {
                txn.sacNumber = o.sacNumber;
                txn.hsnOrSac = 'sac';
            }

            setTimeout(() => {
                let description = this.description.toArray();
                if (description && description[this.activeIndx]) {
                    description[this.activeIndx].nativeElement.focus();
                }
            }, 200);

            return txn;
        } else {
            txn.isStockTxn = false;
            txn.amount = 0;
            txn.accountName = null;
            txn.accountUniqueName = null;
            txn.hsnOrSac = 'sac';
            txn.total = null;
            txn.rate = null;
            txn.sacNumber = null;
            txn.taxableValue = 0;
            txn.applicableTaxes = [];

            setTimeout(() => {
                let description = this.description.toArray();
                if (description && description[this.activeIndx]) {
                    description[this.activeIndx].nativeElement.focus();
                }
            }, 200);

            return txn;
        }
    }

    public onClearSalesAccount(txn: SalesTransactionItemClass) {
        txn.applicableTaxes = [];
        txn.quantity = null;
        txn.isStockTxn = false;
        txn.stockUnit = null;
        txn.stockDetails = null;
        txn.stockList = [];
        txn.rate = null;
        txn.quantity = null;
        txn.amount = null;
        txn.taxableValue = null;
        txn.sacNumber = null;
        txn.hsnNumber = null;
    }

    public noResultsForCustomer(e: boolean): void {
        this.typeaheadNoResultsOfCustomer = e;
    }

    public onSelectCustomer(item: IOption): void {
        this.typeaheadNoResultsOfCustomer = false;
        if (item.value) {
            this.invFormData.voucherDetails.customerName = item.label;
            this.getAccountDetails(item.value);
            this.isCustomerSelected = true;
            this.invFormData.accountDetails.name = '';
            if (item.additional) {
                // If currency of item is null or undefined then treat it to be equivalent of company currency
                item.additional['currency'] = item.additional.currency || this.companyCurrency;
                this.isMulticurrencyAccount = item.additional.currency !== this.companyCurrency;
            }

            if (this.isMulticurrencyAccount) {
                this.companyCurrencyName = item.additional.currency;
            }

            if (item.additional && item.additional.currency && item.additional.currency !== this.companyCurrency && this.isMultiCurrencyAllowed) {
                this.getCurrencyRate(this.companyCurrency, item.additional.currency);
            }

            if (this.isSalesInvoice && this.isMulticurrencyAccount) {
                this.bankAccounts$ = observableOf(this.updateBankAccountObject(item.additional.currency));
            }
        }
    }

    public onSelectBankCash(item: IOption) {
        if (item.value) {
            this.invFormData.accountDetails.name = item.label;
            this.getAccountDetails(item.value);
        }
    }

    public getAccountDetails(accountUniqueName: string) {
        this.store.dispatch(this.salesAction.getAccountDetailsForSales(accountUniqueName));
    }

    public toggleAccountAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public toggleRecurringAsidePane(toggle?: string): void {
        if (toggle) {
            if (toggle === 'out' && this.asideMenuStateForRecurringEntry !== 'out') {
                this.router.navigate(['/pages', 'invoice', 'recurring']);
            }
            this.asideMenuStateForRecurringEntry = toggle;
        } else {
            this.asideMenuStateForRecurringEntry = this.asideMenuStateForRecurringEntry === 'out' ? 'in' : 'out';
        }
        this.toggleBodyClass();
    }

    public addBlankRow(txn: SalesTransactionItemClass) {
        if (!txn) {
            let entry: SalesEntryClass = new SalesEntryClass();
            if (this.isUpdateMode) {
                entry.entryDate = this.invFormData.entries[0] ? this.invFormData.entries[0].entryDate : this.universalDate || new Date();
                entry.isNewEntryInUpdateMode = true;
            } else {
                entry.entryDate = this.universalDate || new Date();
            }
            this.invFormData.entries.push(entry);
            setTimeout(() => {
                this.activeIndx = this.invFormData.entries.length ? this.invFormData.entries.length - 1 : 0;
                this.onBlurDueDate(this.activeIndx);
            }, 200);
        } else {
            // if transaction is valid then add new row else show toasty
            if (!txn.isValid()) {
                this._toasty.warningToast('Product/Service can\'t be empty');
                return;
            }
            let entry: SalesEntryClass = new SalesEntryClass();
            this.invFormData.entries.push(entry);
            setTimeout(() => {
                this.activeIndx = this.invFormData.entries.length ? this.invFormData.entries.length - 1 : 0;
                this.onBlurDueDate(this.activeIndx);
            }, 200);
        }
    }

    public removeTransaction(entryIdx: number) {
        if (this.invFormData.entries.length > 1) {
            if (this.activeIndx === entryIdx) {
                this.activeIndx = null;
            }
            this.invFormData.entries = this.invFormData.entries.filter((entry, index) => entryIdx !== index);
            this.calculateAffectedThingsFromOtherTaxChanges();
        } else {
            this._toasty.warningToast('Unable to delete a single transaction');
        }
    }

    public taxAmountEvent(txn: SalesTransactionItemClass, entry: SalesEntryClass) {
        txn.setAmount(entry);
        this.calculateBalanceDue();
    }

    public selectedDiscountEvent(txn: SalesTransactionItemClass, entry: SalesEntryClass) {
        // call taxableValue method
        txn.setAmount(entry);
        this.calculateBalanceDue();
    }

    // get action type from aside window and open respective modal
    public getActionFromAside(e?: any) {
        if (e.type === 'groupModal') {
            this.showCreateGroupModal = true;
            // delay just for ng cause
            setTimeout(() => {
                this.createGroupModal.show();
            }, 1000);
        } else {
            this.showCreateAcModal = true;
            this.createAcCategory = e.type;
            // delay just for ng cause
            setTimeout(() => {
                this.createAcModal.show();
            }, 1000);
        }
    }

    public closeCreateGroupModal(e?: any) {
        this.createGroupModal.hide();
    }

    public customMoveGroupFilter(term: string, item: IOption): boolean {
        let newItem = {...item};
        if (!newItem.additional) {
            newItem.additional = {email: '', mobileNo: ''};
        } else {
            newItem.additional.email = newItem.additional.email || '';
            newItem.additional.mobileNo = newItem.additional.mobileNo || '';
        }
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1 || item.additional.email.toLocaleLowerCase().indexOf(term) > -1 || item.additional.mobileNo.toLocaleLowerCase().indexOf(term) > -1);
    }

    public closeCreateAcModal() {
        this.createAcModal.hide();
    }

    public closeDiscountPopup() {
        if (this.discountComponent) {
            this.discountComponent.hideDiscountMenu();
        }
    }

    public closeTaxControlPopup() {
        if (this.taxControlComponent) {
            this.taxControlComponent.showTaxPopup = false;
        }
    }

    public setActiveIndx(indx: number) {
        // BELOW CODE WAS PUTTING FOCUS ON PAYMENT MODE DROPDOWN SO COMMENTED THE CODE
        // setTimeout(function () {
        //   let focused = $('.focused');
        //   if (focused && focused[indx]) {
        //     $('.focused')[indx].focus();
        //   }
        // }, 200);

        this.activeIndx = indx;
    }

    public doAction(action: ActionTypeAfterVoucherGenerateOrUpdate) {
        this.actionAfterGenerateORUpdate = action;
    }

    public postResponseAction(voucherNo: string) {
        switch (this.actionAfterGenerateORUpdate) {
            case ActionTypeAfterVoucherGenerateOrUpdate.generate: {
                this.getAllLastInvoices();
                this.depositAccountUniqueName = '';
                this.depositAmount = 0;
                break;
            }
            case ActionTypeAfterVoucherGenerateOrUpdate.generateAndClose: {
                this.router.navigate(['/pages', 'invoice', 'preview']);
                break;
            }
            case ActionTypeAfterVoucherGenerateOrUpdate.generateAndPrint: {
                // this.fireActionAfterGenOrUpdVoucher(voucherNo, ActionTypeAfterVoucherGenerateOrUpdate.generateAndPrint);
                // this.router.navigate(['/pages', 'invoice', 'preview', this.parseVoucherType(this.invoiceType)]);
                this.printVoucherModal.show();
                break;
            }
            case ActionTypeAfterVoucherGenerateOrUpdate.generateAndSend: {
                this.sendEmailModal.show();
                // this.fireActionAfterGenOrUpdVoucher(voucherNo, ActionTypeAfterVoucherGenerateOrUpdate.generateAndSend);
                break;
            }
            case ActionTypeAfterVoucherGenerateOrUpdate.updateSuccess: {
                this.updateVoucherSuccess();
                break;
            }
            case ActionTypeAfterVoucherGenerateOrUpdate.generateAndRecurring: {
                this.toggleRecurringAsidePane();
                break;
            }
        }
    }

    public resetCustomerName(event) {
        if (event) {
            if (!event.target.value) {
                this.invFormData.voucherDetails.customerName = null;
                this.invFormData.voucherDetails.customerUniquename = null;
                this.isCustomerSelected = false;
                this.invFormData.accountDetails = new AccountDetailsClass();
                this.invFormData.accountDetails.uniqueName = 'cash';

                // if we are in update mode and someone changes customer name then we should reset the voucher details
                if (this.isUpdateMode) {
                    this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
                }
            }
        } else {
            this.invFormData.voucherDetails.customerName = null;
            this.invFormData.voucherDetails.tempCustomerName = null;
            this.isCustomerSelected = false;
            this.invFormData.accountDetails = new AccountDetailsClass();
            this.invFormData.accountDetails.uniqueName = 'cash';

            // if we are in update mode and someone changes customer name then we should reset the voucher details
            if (this.isUpdateMode) {
                this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
            }
        }
    }

    public ngOnChanges(s: SimpleChanges) {
        if (s && s['isPurchaseInvoice'] && s['isPurchaseInvoice'].currentValue) {
            this.pageChanged(VoucherTypeEnum.purchase, 'Purchase');
            this.isSalesInvoice = false;
        }

        if ('accountUniqueName' in s && s.accountUniqueName.currentValue && (s.accountUniqueName.currentValue !== s.accountUniqueName.previousValue)) {
            this.isCashInvoice = s.accountUniqueName.currentValue === 'cash';
        }
    }

    public onSelectPaymentMode(event) {
        if (event && event.value) {
            if (this.isCashInvoice) {
                this.invFormData.accountDetails.name = event.label;
                this.invFormData.accountDetails.uniqueName = event.value;
            }
            this.depositAccountUniqueName = event.value;
            if (event.additional) {
                // If currency of item is null or undefined then treat it to be equivalent of company currency
                event.additional['currency'] = event.additional.currency || this.companyCurrency;
                // only for cash invoice
                // check if selected payment account currency is different then company currency
                // also get rates for selected account currency if it's multi-currency
                if (this.isCashInvoice) {
                    this.isMulticurrencyAccount = event.additional.currency !== this.companyCurrency;
                    if (this.isMulticurrencyAccount) {
                        this.getCurrencyRate(this.companyCurrency, event.additional ? event.additional.currency : '');
                    }
                }
            }

            if (this.isMulticurrencyAccount) {
                if (this.isCashInvoice) {
                    //this.getAccountDetails(event.value);
                    this.invFormData.accountDetails.currencySymbol = event.additional.currencySymbol || this.baseCurrencySymbol;
                    this.depositCurrSymbol = this.invFormData.accountDetails.currencySymbol;
                }
                if (this.isSalesInvoice) {
                    this.depositCurrSymbol = event.additional && event.additional.currencySymbol || this.baseCurrencySymbol;
                }
            } else {
                this.invFormData.accountDetails.currencySymbol = '';
            }

            if (this.isCashInvoice) {
                this.companyCurrencyName = event.additional.currency;
            }
        } else {
            this.depositAccountUniqueName = '';
        }

        this.calculateBalanceDue();
    }

    public clickedInside($event: Event) {
        $event.preventDefault();
        $event.stopPropagation();  // <- that will stop propagation on lower layers
    }

    @HostListener('document:click', ['$event'])
    public clickedOutside(event) {
        if (this.copyPreviousEstimate && this.copyPreviousEstimate.nativeElement && !this.copyPreviousEstimate.nativeElement.contains(event.target)) {
            this.showLastEstimateModal = false;
        }

        if (this.unregisteredBusiness && this.unregisteredBusiness.nativeElement && !this.unregisteredBusiness.nativeElement.contains(event.target)) {
            this.showGstTreatmentModal = false;
        }
    }

    public prepareUnitArr(unitArr) {
        let unitArray = [];
        _.forEach(unitArr, (item) => {
            unitArray.push({id: item.stockUnitCode, text: item.stockUnitCode, rate: item.rate});
        });
        return unitArray;
    }

    public onChangeUnit(txn, selectedUnit) {
        if (!event) {
            return;
        }
        _.find(txn.stockList, (o) => {
            if (o.id === selectedUnit) {
                return txn.rate = o.rate;
            }
        });
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
        } else if (output.type === 'done') {
            if (output.file.response.status === 'success') {
                this.isFileUploading = false;
                this.invFormData.entries[0].attachedFile = output.file.response.body.uniqueName;
                this.invFormData.entries[0].attachedFileName = output.file.response.body.name;
                this._toasty.successToast('file uploaded successfully');
            } else {
                this.isFileUploading = false;
                this.invFormData.entries[0].attachedFile = '';
                this.invFormData.entries[0].attachedFileName = '';
                this._toasty.errorToast(output.file.response.message);
            }
        }
    }

    public cancelUpdate() {
        this.cancelVoucherUpdate.emit(true);
    }

    public onFileChange(event: any) {
        this.file = (event.files as FileList).item(0);
        if (this.file) {
            this.selectedFileName = this.file.name;
        } else {
            this.selectedFileName = '';
        }
    }

    public addBulkStockItems(items: SalesAddBulkStockItems[]) {
        this.isAddBulkItemInProcess = true;
        let salesAccs: IOption[] = [];
        this.salesAccounts$.pipe(take(1)).subscribe(data => salesAccs = data);

        for (const item of items) {
            let salesItem: IOption = salesAccs.find(f => f.value === item.uniqueName);
            if (salesItem) {

                // add quantity to additional because we are using quantity from bulk modal so we have to pass it to onSelectSalesAccount
                salesItem.additional = {...salesItem.additional, quantity: item.quantity};
                let lastIndex = -1;
                let blankItemIndex = this.invFormData.entries.findIndex(f => !f.transactions[0].accountUniqueName);

                if (blankItemIndex > -1) {
                    lastIndex = blankItemIndex;
                    this.invFormData.entries[lastIndex] = new SalesEntryClass();
                } else {
                    this.invFormData.entries.push(new SalesEntryClass());
                    lastIndex = this.invFormData.entries.length - 1;
                }

                this.activeIndx = lastIndex;
                this.invFormData.entries[lastIndex].entryDate = this.universalDate;
                this.invFormData.entries[lastIndex].transactions[0].fakeAccForSelect2 = salesItem.value;
                this.invFormData.entries[lastIndex].isNewEntryInUpdateMode = true;
                this.onSelectSalesAccount(salesItem, this.invFormData.entries[lastIndex].transactions[0], this.invFormData.entries[lastIndex]);
                this.calculateStockEntryAmount(this.invFormData.entries[lastIndex].transactions[0]);
                this.calculateWhenTrxAltered(this.invFormData.entries[lastIndex], this.invFormData.entries[lastIndex].transactions[0]);
            }
        }
    }

    public addNewSidebarAccount(item: AddAccountRequest) {
        this.store.dispatch(this.salesAction.addAccountDetailsForSales(item));
    }

    public updateSidebarAccount(item: UpdateAccountRequest) {
        this.store.dispatch(this.salesAction.updateAccountDetailsForSales(item));
    }

    public addNewAccount() {
        this.selectedCustomerForDetails = null;
        this.invFormData.voucherDetails.customerName = null;
        this.invFormData.voucherDetails.customerUniquename = null;
        this.isCustomerSelected = false;
        this.invFormData.accountDetails = new AccountDetailsClass();
        this.toggleAccountAsidePane();
    }

    public getCustomerDetails() {
        this.selectedCustomerForDetails = this.invFormData.accountDetails.uniqueName;
        this.toggleAccountAsidePane();
    }

    public addAccountFromShortcut() {
        if (!this.isCustomerSelected) {
            this.selectedCustomerForDetails = null;
            this.toggleAccountAsidePane();
        }
    }

    /**
     * update invoice function
     * @param invoiceForm
     */
    public submitUpdateForm(invoiceForm: NgForm) {
        let result = this.prepareDataForApi();
        if (!result) {
            return;
        }
        if (this.isProformaInvoice || this.isEstimateInvoice) {
            this.store.dispatch(this.proformaActions.updateProforma(result));
        } else {
            let data = result.voucher;
            let exRate = this.originalExchangeRate;
            let unqName = this.invoiceUniqueName || this.accountUniqueName;

            // sales and cash invoice uses v4 api so need to parse main object to regarding that
            if (this.isSalesInvoice || this.isCashInvoice) {
                result = {
                    account: data.accountDetails,
                    updateAccountDetails: this.updateAccount,
                    voucher: data,
                    entries: [],
                    date: data.voucherDetails.voucherDate,
                    type: this.parseVoucherType(this.invoiceType),
                    exchangeRate: exRate,
                    dueDate: data.voucherDetails.dueDate,
                    number: this.invoiceNo,
                    uniqueName: unqName
                };

                this.salesService.updateVoucherV4(this.updateData(result, result.voucher)).pipe(takeUntil(this.destroyed$))
                    .subscribe((response: BaseResponse<VoucherClass, GenericRequestForGenerateSCD>) => {
                        this.actionsAfterVoucherUpdate(response, invoiceForm);
                    }, (err) => {
                        this._toasty.errorToast('Something went wrong! Try again');
                    });
            } else {
                // credit and debit note still uses old api so just pass result to service don't parse it
                this.salesService.updateVoucher(result).pipe(takeUntil(this.destroyed$))
                    .subscribe((response: BaseResponse<VoucherClass, GenericRequestForGenerateSCD>) => {
                        this.actionsAfterVoucherUpdate(response, invoiceForm);
                    }, (err) => {
                        this._toasty.errorToast('Something went wrong! Try again');
                    });
            }
        }
    }

    /**
     * used for re-sating invoice form as well as showing appropriate toaster
     * and performing post update actions
     * thing after sales/ cash or credit / debit note voucher updates
     * @param response
     * @param invoiceForm
     */
    private actionsAfterVoucherUpdate(response: BaseResponse<VoucherClass, GenericRequestForGenerateSCD>, invoiceForm: NgForm) {
        if (response.status === 'success') {
            // reset form and other
            this.resetInvoiceForm(invoiceForm);
            this._toasty.successToast('Voucher updated Successfully');
            this.store.dispatch(this.invoiceReceiptActions.updateVoucherDetailsAfterVoucherUpdate(response));
            this.voucherNumber = response.body.number;
            this.invoiceNo = this.voucherNumber;
            this.doAction(ActionTypeAfterVoucherGenerateOrUpdate.updateSuccess);
            this.postResponseAction(this.invoiceNo);

            this.depositAccountUniqueName = '';
            this.depositAmount = 0;
            this.isUpdateMode = false;
        } else {
            this._toasty.errorToast(response.message, response.code);
        }
        this.updateAccount = false;
    }

    public prepareDataForApi(): GenericRequestForGenerateSCD {
        let data: VoucherClass = _.cloneDeep(this.invFormData);

        // special check if gst no filed is visible then and only then check for gst validation
        if (data.accountDetails.billingDetails.gstNumber && this.showGSTINNo) {
            if (!this.isValidGstIn(data.accountDetails.billingDetails.gstNumber)) {
                this._toasty.errorToast('Invalid gst no in Billing Address! Please fix and try again');
                return;
            }
            if (!this.autoFillShipping) {
                if (!this.isValidGstIn(data.accountDetails.shippingDetails.gstNumber)) {
                    this._toasty.errorToast('Invalid gst no in Shipping Address! Please fix and try again');
                    return;
                }
            }
        }

        if (this.isSalesInvoice || this.isPurchaseInvoice || this.isProformaInvoice || this.isEstimateInvoice) {
            if (moment(data.voucherDetails.dueDate, 'DD-MM-YYYY').isBefore(moment(data.voucherDetails.voucherDate, 'DD-MM-YYYY'), 'd')) {
                this._toasty.errorToast('Due date cannot be less than Invoice Date');
                return;
            }
        } else {
            delete data.voucherDetails.dueDate;
        }

        data.entries = data.entries.filter((entry, indx) => {
            if (!entry.transactions[0].accountUniqueName && indx !== 0) {
                this.invFormData.entries.splice(indx, 1);
            }
            return entry.transactions[0].accountUniqueName;
        });

        data.entries = data.entries.map(entry => {
            // filter active discounts
            entry.discounts = entry.discounts.filter(dis => dis.isActive);

            // filter active taxes
            entry.taxes = entry.taxes.filter(tax => tax.isChecked);
            return entry;
        });
        let txnErr: boolean;
        // before submit request making some validation rules
        // check for account uniqueName
        if (data.accountDetails) {
            if (!data.accountDetails.uniqueName) {
                if (this.typeaheadNoResultsOfCustomer) {
                    this._toasty.warningToast('Need to select Bank/Cash A/c or Customer Name');
                } else {
                    this._toasty.warningToast('Customer Name can\'t be empty');
                }
                return;
            }
            if (data.accountDetails.email) {
                if (!EMAIL_REGEX_PATTERN.test(data.accountDetails.email)) {
                    this._toasty.warningToast('Invalid Email Address.');
                    return;
                }
            }
        }

        // replace /n to br for (shipping and billing)

        if (data.accountDetails.shippingDetails.address && data.accountDetails.shippingDetails.address.length && data.accountDetails.shippingDetails.address[0].length > 0) {
            data.accountDetails.shippingDetails.address[0] = data.accountDetails.shippingDetails.address[0].replace(/\n/g, '<br />');
            data.accountDetails.shippingDetails.address = data.accountDetails.shippingDetails.address[0].split('<br />');
        }
        if (data.accountDetails.billingDetails.address && data.accountDetails.billingDetails.address.length && data.accountDetails.billingDetails.address[0].length > 0) {
            data.accountDetails.billingDetails.address[0] = data.accountDetails.billingDetails.address[0].replace(/\n/g, '<br />');
            data.accountDetails.billingDetails.address = data.accountDetails.billingDetails.address[0].split('<br />');
        }

        // convert date object
        if (this.isProformaInvoice) {
            data.voucherDetails.proformaDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
        } else if (this.isEstimateInvoice) {
            data.voucherDetails.estimateDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
        } else {
            data.voucherDetails.voucherDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
        }

        data.voucherDetails.dueDate = this.convertDateForAPI(data.voucherDetails.dueDate);
        data.templateDetails.other.shippingDate = this.convertDateForAPI(data.templateDetails.other.shippingDate);

        // check for valid entries and transactions
        if (data.entries) {
            data.entries.forEach((entry) => {
                entry.transactions.forEach((txn: SalesTransactionItemClass) => {
                    // convert date object
                    // txn.date = this.convertDateForAPI(txn.date);
                    entry.entryDate = moment(entry.entryDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);

                    if (this.isUpdateMode) {
                        // we need to remove # from account uniqueName because we are appending # to stock for uniqueNess
                        if (txn.stockList && txn.stockList.length) {
                            txn.accountUniqueName = txn.accountUniqueName.indexOf('#') > -1 ? txn.accountUniqueName.slice(0, txn.accountUniqueName.indexOf('#')) : txn.accountUniqueName;
                            txn.fakeAccForSelect2 = txn.accountUniqueName.indexOf('#') > -1 ? txn.fakeAccForSelect2.slice(0, txn.fakeAccForSelect2.indexOf('#')) : txn.fakeAccForSelect2;
                        }
                    }
                    // will get errors of string and if not error then true boolean
                    if (!txn.isValid()) {
                        this._toasty.warningToast('Product/Service can\'t be empty');
                        txnErr = true;
                        return false;
                    } else {
                        txnErr = false;
                    }
                });
            });
        } else {
            this._toasty.warningToast('At least a single entry needed to generate sales-invoice');
            return;
        }

        // if txn has errors
        if (txnErr) {
            return null;
        }

        // set voucher type
        data.entries = data.entries.map((entry) => {
            entry.voucherType = this.parseVoucherType(this.invoiceType);
            entry.taxList = entry.taxes.map(m => m.uniqueName);
            entry.tcsCalculationMethod = entry.otherTaxModal.tcsCalculationMethod;

            if (entry.isOtherTaxApplicable) {
                entry.taxList.push(entry.otherTaxModal.appliedOtherTax.uniqueName);
            }

            if (entry.otherTaxType === 'tds') {
                delete entry['tcsCalculationMethod'];
            }
            return entry;
        });

        let obj: GenericRequestForGenerateSCD = {
            voucher: data,
            updateAccountDetails: this.updateAccount
        };

        if (this.isUpdateMode) {
            obj.entryUniqueNames = data.entries.map(m => m.uniqueName);
        }

        if (this.depositAmount && this.depositAmount > 0) {
            obj.paymentAction = {
                // action: 'paid',
                amount: Number(this.depositAmount) + this.depositAmountAfterUpdate
            };
            if (this.isCustomerSelected) {
                obj.depositAccountUniqueName = this.depositAccountUniqueName;
            } else {
                obj.depositAccountUniqueName = data.accountDetails.uniqueName;
            }
        } else {
            obj.depositAccountUniqueName = '';
        }

        // set voucher type
        obj.voucher.voucherDetails.voucherType = this.parseVoucherType(this.invoiceType);
        return obj;
    }

    public getAllLastInvoices() {
        if (this.isProformaInvoice || this.isEstimateInvoice) {
            let filterRequest: ProformaFilter = new ProformaFilter();
            filterRequest.sortBy = this.isProformaInvoice ? 'proformaDate' : 'estimateDate';
            filterRequest.sort = 'desc';
            filterRequest.count = 5;
            filterRequest.isLastInvoicesRequest = true;
            this.store.dispatch(this.proformaActions.getAll(filterRequest, this.isProformaInvoice ? 'proformas' : 'estimates'));
        } else {
            let request: InvoiceReceiptFilter = new InvoiceReceiptFilter();
            request.sortBy = 'voucherDate';
            request.sort = 'desc';
            request.count = 5;
            request.isLastInvoicesRequest = true;
            this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(request, this.parseVoucherType(this.invoiceType)));
        }
    }

    public getLastInvoiceDetails(obj: { accountUniqueName: string, invoiceNo: string }) {
        this.accountUniqueName = obj.accountUniqueName;
        this.invoiceNo = obj.invoiceNo;
        this.isLastInvoiceCopied = true;
        this.showLastEstimateModal = false;
        this.getVoucherDetailsFromInputs();
    }

    public calculateOtherTaxes(modal: SalesOtherTaxesModal, entryObj?: SalesEntryClass) {
        let entry: SalesEntryClass;
        entry = entryObj ? entryObj : this.invFormData.entries[this.activeIndx];

        let taxableValue = 0;
        let totalTaxes = 0;

        if (!entry) {
            return;
        }
        if (modal && modal.appliedOtherTax && modal.appliedOtherTax.uniqueName) {
            let tax = this.companyTaxesList.find(ct => ct.uniqueName === modal.appliedOtherTax.uniqueName);
            if (!modal.appliedOtherTax.name) {
                entry.otherTaxModal.appliedOtherTax.name = tax.name;
            }
            if (['tcsrc', 'tcspay'].includes(tax.taxType)) {

                if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) {
                    taxableValue = Number(entry.transactions[0].amount) - entry.discountSum;
                } else if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTotalAmount) {
                    let rawAmount = Number(entry.transactions[0].amount) - entry.discountSum;
                    taxableValue = (rawAmount + ((rawAmount * entry.taxSum) / 100));
                }
                entry.otherTaxType = 'tcs';
            } else {
                taxableValue = Number(entry.transactions[0].amount) - entry.discountSum;
                entry.otherTaxType = 'tds';
            }

            totalTaxes += tax.taxDetail[0].taxValue;

            entry.otherTaxSum = giddhRoundOff(((taxableValue * totalTaxes) / 100), 2);
            entry.otherTaxModal = modal;
        } else {
            entry.otherTaxSum = 0;
            entry.isOtherTaxApplicable = false;
            entry.otherTaxModal = new SalesOtherTaxesModal();
            entry.tcsTaxList = [];
            entry.tdsTaxList = [];
        }
        if (this.activeIndx && !entryObj) {
            this.invFormData.entries = cloneDeep(this.entriesListBeforeTax);
            this.invFormData.entries[this.activeIndx] = entry;
        }
    }

    public calculateAffectedThingsFromOtherTaxChanges() {
        this.calculateTcsTdsTotal();
        this.calculateGrandTotal();
        this.calculateBalanceDue();
    }

    public sendEmail(request: string | { email: string, invoiceType: string[] }) {
        if (this.isEstimateInvoice || this.isProformaInvoice) {
            let req: ProformaGetRequest = new ProformaGetRequest();

            req.accountUniqueName = this.accountUniqueName;

            if (this.isProformaInvoice) {
                req.proformaNumber = this.invoiceNo;
            } else {
                req.estimateNumber = this.invoiceNo;
            }
            req.emailId = (request as string).split(',');
            this.store.dispatch(this.proformaActions.sendMail(req, this.invoiceType));
        } else {
            request = request as { email: string, invoiceType: string[] };
            this.store.dispatch(this.invoiceActions.SendInvoiceOnMail(this.accountUniqueName, {
                emailId: request.email.split(','),
                voucherNumber: [this.invoiceNo],
                voucherType: this.invoiceType,
                typeOfInvoice: request.invoiceType ? request.invoiceType : []
            }));
        }
        this.cancelEmailModal();
    }

    cancelEmailModal() {
        this.accountUniqueName = '';
        this.invoiceNo = '';
        this.sendEmailModal.hide();
    }

    cancelPrintModal() {
        this.accountUniqueName = '';
        this.invoiceNo = '';
        this.printVoucherModal.hide();
    }

    private getVoucherDetailsFromInputs() {
        if (!this.isLastInvoiceCopied) {
            this.getAccountDetails(this.accountUniqueName);
        }

        this.isUpdateMode = !this.isLastInvoiceCopied;
        this.isUpdateDataInProcess = true;

        this.prepareInvoiceTypeFlags();
        this.toggleFieldForSales = (!(this.invoiceType === VoucherTypeEnum.debitNote || this.invoiceType === VoucherTypeEnum.creditNote));

        if (!this.isProformaInvoice && !this.isEstimateInvoice) {
            if (this.isSalesInvoice || this.isCashInvoice) {
                this.store.dispatch(this.invoiceReceiptActions.GetVoucherDetailsV4(this.accountUniqueName, {
                    invoiceNumber: this.invoiceNo,
                    voucherType: this.parseVoucherType(this.invoiceType)
                }));
            } else {
                this.store.dispatch(this.invoiceReceiptActions.GetVoucherDetails(this.accountUniqueName, {
                    invoiceNumber: this.invoiceNo,
                    voucherType: this.parseVoucherType(this.invoiceType)
                }));
            }
        } else {
            let obj: ProformaGetRequest = new ProformaGetRequest();
            obj.accountUniqueName = this.accountUniqueName;
            if (this.isProformaInvoice) {
                obj.proformaNumber = this.invoiceNo;
            } else {
                obj.estimateNumber = this.invoiceNo;
            }
            this.store.dispatch(this.proformaActions.getProformaDetails(obj, this.invoiceType));
        }
    }

    private parseEntriesFromResponse(entries: SalesEntryClass[], flattenAccounts: IFlattenAccountsResultItem[]) {
        return entries.map((entry, index) => {
            this.activeIndx = index;
            entry.otherTaxModal = new SalesOtherTaxesModal();
            entry.entryDate = moment(entry.entryDate, GIDDH_DATE_FORMAT).toDate();

            entry.discounts = this.parseDiscountFromResponse(entry);
            entry.taxList = entry.taxes.map(m => m.uniqueName);

            entry.transactions = entry.transactions.map(trx => {
                entry.otherTaxModal.itemLabel = trx.stockDetails && trx.stockDetails.name ? trx.accountName + '(' + trx.stockDetails.name + ')' : trx.accountName;
                let newTrxObj: SalesTransactionItemClass = new SalesTransactionItemClass();

                newTrxObj.accountName = trx.accountName;
                newTrxObj.amount = trx.amount;
                newTrxObj.description = trx.description;
                newTrxObj.stockDetails = trx.stockDetails;
                newTrxObj.taxableValue = trx.taxableValue;
                newTrxObj.hsnNumber = trx.hsnNumber;
                newTrxObj.isStockTxn = trx.isStockTxn;
                newTrxObj.applicableTaxes = entry.taxList;

                // check if stock details is available then assign uniquename as we have done while creating option
                if (trx.isStockTxn) {
                    newTrxObj.accountUniqueName = `${trx.accountUniqueName}#${trx.stockDetails.uniqueName}`;
                    newTrxObj.fakeAccForSelect2 = `${trx.accountUniqueName}#${trx.stockDetails.uniqueName}`;

                    // stock unit assign process
                    // get account from flatten account
                    let selectedAcc = flattenAccounts.find(d => {
                        return (d.uniqueName === trx.accountUniqueName);
                    });

                    if (selectedAcc) {
                        // get stock from flatten account
                        let stock = selectedAcc.stocks.find(s => s.uniqueName === trx.stockDetails.uniqueName);

                        if (stock && newTrxObj) {
                            // description with sku and custom fields
                            newTrxObj.sku_and_customfields = null;
                            if (this.isCashInvoice || this.isSalesInvoice || this.isPurchaseInvoice) {
                                let description = [];
                                let skuCodeHeading = stock.skuCodeHeading ? stock.skuCodeHeading : 'SKU Code';
                                if (stock.skuCode) {
                                    description.push(skuCodeHeading + ':' + stock.skuCode);
                                }
                                let customField1Heading = stock.customField1Heading ? stock.customField1Heading : 'Custom field 1';
                                if (stock.customField1Value) {
                                    description.push(customField1Heading + ':' + stock.customField1Value);
                                }
                                let customField2Heading = stock.customField2Heading ? stock.customField2Heading : 'Custom field 2';
                                if (stock.customField2Value) {
                                    description.push(customField2Heading + ':' + stock.customField2Value);
                                }
                                newTrxObj.sku_and_customfields = description.join(', ');
                            }
                            //------------------------

                            let stockUnit: IStockUnit = {
                                id: stock.stockUnit.code,
                                text: stock.stockUnit.name
                            };

                            newTrxObj.stockList = [];
                            if (stock.accountStockDetails.unitRates.length) {
                                newTrxObj.stockList = this.prepareUnitArr(stock.accountStockDetails.unitRates);
                            } else {
                                newTrxObj.stockList.push(stockUnit);
                            }
                        }
                    }

                    newTrxObj.quantity = trx.quantity;
                    newTrxObj.rate = trx.rate;
                    newTrxObj.stockUnit = trx.stockUnit;

                } else {
                    newTrxObj.accountUniqueName = trx.accountUniqueName;
                    newTrxObj.fakeAccForSelect2 = trx.accountUniqueName;
                }

                this.calculateTotalDiscountOfEntry(entry, trx, false);
                this.calculateEntryTaxSum(entry, trx);
                return newTrxObj;
            });

            // tcs tax calculation
            if (entry.tcsTaxList && entry.tcsTaxList.length) {
                entry.isOtherTaxApplicable = true;
                entry.otherTaxType = 'tcs';

                let tax = this.companyTaxesList.find(f => f.uniqueName === entry.tcsTaxList[0]);
                if (tax) {
                    entry.otherTaxModal.appliedOtherTax = {name: tax.name, uniqueName: tax.uniqueName};
                    let taxableValue = 0;
                    if (entry.otherTaxModal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) {
                        taxableValue = Number(entry.transactions[0].amount) - entry.discountSum;
                    } else if (entry.otherTaxModal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTotalAmount) {
                        let rawAmount = Number(entry.transactions[0].amount) - entry.discountSum;
                        taxableValue = (rawAmount + ((rawAmount * entry.taxSum) / 100));
                    }

                    entry.otherTaxSum = giddhRoundOff(((taxableValue * tax.taxDetail[0].taxValue) / 100), 2);
                }
            } else if (entry.tdsTaxList && entry.tdsTaxList.length) {
                // tds tax calculation
                entry.isOtherTaxApplicable = true;
                entry.otherTaxModal.tcsCalculationMethod = SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount;
                entry.otherTaxType = 'tds';

                let tax = this.companyTaxesList.find(f => f.uniqueName === entry.tdsTaxList[0]);
                if (tax) {
                    entry.otherTaxModal.appliedOtherTax = {name: tax.name, uniqueName: tax.uniqueName};
                    let taxableValue = Number(entry.transactions[0].amount) - entry.discountSum;
                    entry.otherTaxSum = giddhRoundOff(((taxableValue * tax.taxDetail[0].taxValue) / 100), 2);
                }
            }
            entry.taxes = [];
            entry.cessSum = 0;
            return entry;
        });
    }

    private parseDiscountFromResponse(entry: SalesEntryClass): LedgerDiscountClass[] {
        let discountArray: LedgerDiscountClass[] = [];
        let isDefaultDiscountThere = entry.tradeDiscounts.some(s => !s.discount.uniqueName);

        // now we are adding every discounts in tradeDiscounts so have to only check in trade discounts
        if (!isDefaultDiscountThere) {
            discountArray.push({
                    discountType: 'FIX_AMOUNT',
                    amount: 0,
                    name: '',
                    particular: '',
                    isActive: true,
                    discountValue: 0
                }
            );
        }

        entry.tradeDiscounts.forEach((f) => {
            discountArray.push({
                discountType: f.discount.discountType,
                amount: f.discount.discountValue,
                name: f.discount.name,
                particular: f.account.uniqueName,
                isActive: true,
                discountValue: f.discount.discountValue,
                discountUniqueName: f.discount.uniqueName
            });

        });

        return discountArray;
    }

    private isValidGstIn(no: string): boolean {
        return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]$/g.test(no);
    }

    private parseVoucherType(voucher: VoucherTypeEnum) {
        // return sales because we don't have cash as voucher type in api so we have to handle it manually
        if (voucher === VoucherTypeEnum.cash) {
            return VoucherTypeEnum.sales;
        }
        return voucher;
    }

    private updateVoucherSuccess() {
        this.fireActionAfterGenOrUpdVoucher(this.invoiceNo, ActionTypeAfterVoucherGenerateOrUpdate.updateSuccess);
        this.cancelVoucherUpdate.emit(true);
    }

    private fireActionAfterGenOrUpdVoucher(voucherNo: string, action: ActionTypeAfterVoucherGenerateOrUpdate) {
        if (this.isProformaInvoice || this.isEstimateInvoice) {
            this.store.dispatch(this.proformaActions.setVoucherForDetails(voucherNo, action));
        } else {
            this.store.dispatch(this.invoiceReceiptActions.setVoucherForDetails(voucherNo, action));
        }
    }

    private saveStateDetails() {
        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'proforma-invoice/invoice/' + this.invoiceType;
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
        this.store.dispatch(this._generalActions.setAppTitle('/pages/proforma-invoice/invoice/' + this.invoiceType));
    }

    public ngOnDestroy() {
        if (!this.isProformaInvoice && !this.isEstimateInvoice) {
            this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
        } else {
            this.store.dispatch(this.proformaActions.resetActiveVoucher());
        }

        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public updateData(obj: GenericRequestForGenerateSCD, data: VoucherClass) {
        delete obj.voucher;
        delete obj.depositAccountUniqueName;

        let salesEntryClassArray: SalesEntryClassMulticurrency[] = [];
        let entries = data.entries;
        let deposit = new AmountClassMulticurrency();

        deposit.accountUniqueName = this.depositAccountUniqueName;
        deposit.amountForAccount = this.depositAmount;

        entries.forEach(e => {
            let salesEntryClass = new SalesEntryClassMulticurrency();
            salesEntryClass.voucherType = e.voucherType;
            salesEntryClass.uniqueName = e.uniqueName;
            salesEntryClass.description = e.description;
            salesEntryClass.date = e.entryDate;
            e.taxList.forEach(t => {
                salesEntryClass.taxes.push({uniqueName: t});
            });
            e.transactions.forEach(tr => {
                let transactionClassMul = new TransactionClassMulticurrency();
                transactionClassMul.account.uniqueName = tr.accountUniqueName;
                transactionClassMul.account.name = tr.accountName;
                transactionClassMul.amount.amountForAccount = tr.amount;
                salesEntryClass.hsnNumber = tr.hsnNumber;
                salesEntryClass.sacNumber = tr.sacNumber;
                salesEntryClass.description = tr.description;
                if (tr.isStockTxn) {
                    let saalesAddBulkStockItems = new SalesAddBulkStockItems();
                    saalesAddBulkStockItems.name = tr.stockDetails.name;
                    saalesAddBulkStockItems.uniqueName = tr.stockDetails.uniqueName;
                    saalesAddBulkStockItems.quantity = tr.quantity;
                    saalesAddBulkStockItems.rate = {};
                    saalesAddBulkStockItems.rate.amountForAccount = tr.rate;
                    saalesAddBulkStockItems.sku = tr.stockDetails.skuCode;
                    saalesAddBulkStockItems.stockUnit = new CodeStockMulticurrency();
                    saalesAddBulkStockItems.stockUnit.code = tr.stockUnit;

                    transactionClassMul.stock = saalesAddBulkStockItems;
                }
                salesEntryClass.transactions.push(transactionClassMul);
            });
            e.discounts.forEach(ds => {
                salesEntryClass.discounts.push(new DiscountMulticurrency(ds));
            });

            salesEntryClassArray.push(salesEntryClass);
        });

        obj.templateDetails = data.templateDetails;
        obj.entries = salesEntryClassArray;
        obj.deposit = deposit;

        obj.account.billingDetails.countryName = this.customerCountryName;
        obj.account.billingDetails.stateCode = obj.account.billingDetails.state.code;
        obj.account.billingDetails.stateName = obj.account.billingDetails.state.name;

        obj.account.shippingDetails.countryName = this.customerCountryName;
        obj.account.shippingDetails.stateCode = obj.account.shippingDetails.state.code;
        obj.account.shippingDetails.stateName = obj.account.shippingDetails.state.name;

        if (this.isCashInvoice) {
            obj.account.customerName = data.voucherDetails.customerName;
            obj.account.name = data.voucherDetails.customerName;
        } else {
            delete obj.account.customerName;
        }
        return obj;
    }

    public async modifyMulticurrencyRes(result: any) {
        let voucherClassConversion = new VoucherClass();
        let voucherDetails = new VoucherDetailsClass();
        await this.getUpdatedStateCodes(result.account.billingDetails.countryCode);
        voucherClassConversion.entries = [];
        result.entries.forEach(entry => {
            let salesEntryClass = new SalesEntryClass();
            let salesTransactionItemClass = new SalesTransactionItemClass();
            salesEntryClass.tcsTaxList = [];
            salesEntryClass.tdsTaxList = [];

            salesEntryClass.transactions = [];

            entry.transactions.forEach(t => {
                salesTransactionItemClass = new SalesTransactionItemClass();
                salesTransactionItemClass.accountUniqueName = t.account.uniqueName;
                salesTransactionItemClass.accountName = t.account.name;
                salesTransactionItemClass.amount = t.amount.amountForAccount;
                salesTransactionItemClass.hsnNumber = t.hsnNumber;
                salesTransactionItemClass.sacNumber = t.sacNumber;
                salesTransactionItemClass.fakeAccForSelect2 = t.account.uniqueName;
                salesTransactionItemClass.description = entry.description;
                salesTransactionItemClass.date = t.date;
                salesEntryClass.transactions.push(salesTransactionItemClass);

                entry.taxes.forEach(ta => {
                    let taxTypeArr = ['tdsrc', 'tdspay', 'tcspay', 'tcsrc'];
                    if (taxTypeArr.indexOf(ta.taxType) > -1) {
                        salesEntryClass.isOtherTaxApplicable = true;
                        let otherTaxModal = new SalesOtherTaxesModal();
                        otherTaxModal.appliedOtherTax = {name: ta.name, uniqueName: ta.uniqueName};
                        otherTaxModal.tcsCalculationMethod = ta.calculationMethod;
                        salesEntryClass.otherTaxModal = otherTaxModal;

                        if (ta.taxType === 'tdsrc' || ta.taxType === 'tdspay') {
                            salesEntryClass.tdsTaxList.push(ta.uniqueName);
                        } else {
                            salesEntryClass.tcsTaxList.push(ta.uniqueName);
                        }

                    } else {
                        salesEntryClass.taxes.push({
                            amount: ta.taxPercent,
                            uniqueName: ta.uniqueName,
                            isChecked: true,
                            isDisabled: false,
                            type: ta.taxType,
                            name: ta.name || ''
                        });
                    }
                });
                if (t.stock) {
                    salesTransactionItemClass.isStockTxn = true;
                    salesTransactionItemClass.stockDetails = {};
                    salesTransactionItemClass.stockDetails.name = t.stock.name;
                    salesTransactionItemClass.stockDetails.uniqueName = t.stock.uniqueName;
                    salesTransactionItemClass.quantity = t.stock.quantity;
                    salesTransactionItemClass.rate = t.stock.rate.amountForAccount;
                    salesTransactionItemClass.stockDetails.skuCode = t.stock.sku;
                    salesTransactionItemClass.stockUnit = t.stock.stockUnit.code;
                    salesTransactionItemClass.fakeAccForSelect2 = t.account.uniqueName + '#' + t.stock.uniqueName;
                }
            });

            if (entry.discounts && entry.discounts.length) {
                let discountArray = [];
                let tradeDiscountArray = [];
                entry.discounts.forEach(discount => {

                    let discountLedger = new LedgerDiscountClass();
                    discountLedger.amount = discount.discountValue;
                    discountLedger.discountType = discount.calculationMethod;
                    discountLedger.discountValue = discount.discountValue;
                    discountLedger.isActive = true;
                    discountLedger.discountUniqueName = discount.uniqueName;
                    discountLedger.name = discount.name;
                    discountLedger.particular = discount.particular;
                    discountLedger.uniqueName = discountLedger.discountUniqueName;
                    let tradeDiscount = new LedgerResponseDiscountClass();
                    tradeDiscount.discount = {
                        uniqueName: '',
                        name: '',
                        discountType: "PERCENTAGE",
                        discountValue: 0
                    };
                    tradeDiscount.account = {
                        accountType: '',
                        uniqueName: entry.uniqueName,
                        name: ''
                    };
                    tradeDiscount.discount.uniqueName = discountLedger.discountUniqueName;
                    tradeDiscount.discount.discountValue = discountLedger.discountValue;
                    tradeDiscount.discount.discountType = discountLedger.discountType;
                    tradeDiscount.discount.name = discountLedger.name;
                    tradeDiscountArray.push(tradeDiscount);
                });
                salesEntryClass.discounts = discountArray;
                salesEntryClass.tradeDiscounts = tradeDiscountArray;
            } else {
                salesEntryClass.discounts = [new LedgerDiscountClass()];
            }
            salesEntryClass.discounts = this.parseDiscountFromResponse(salesEntryClass);
            salesEntryClass.voucherType = entry.voucherType;
            salesEntryClass.uniqueName = entry.uniqueName;
            salesEntryClass.description = entry.description;
            salesEntryClass.entryDate = moment(entry.date, 'DD-MM-YYYY').toDate();
            this.calculateOtherTaxes(salesEntryClass.otherTaxModal, salesEntryClass);
            voucherClassConversion.entries.push(salesEntryClass);
        });

        this.entriesListBeforeTax = voucherClassConversion.entries;
        voucherClassConversion.companyDetails = result.company;
        voucherClassConversion.templateDetails = result.templateDetails;

        voucherClassConversion.accountDetails.billingDetails = new GstDetailsClass();
        voucherClassConversion.accountDetails.billingDetails.panNumber = result.account.billingDetails.panNumber;
        voucherClassConversion.accountDetails.billingDetails.address = result.account.billingDetails.address;
        voucherClassConversion.accountDetails.billingDetails.gstNumber = result.account.billingDetails.gstNumber;
        voucherClassConversion.accountDetails.billingDetails.state.code = this.getNewStateCode(result.account.billingDetails.stateCode);
        voucherClassConversion.accountDetails.billingDetails.state.name = result.account.billingDetails.stateName;
        voucherClassConversion.accountDetails.mobileNumber = result.account.mobileNumber;

        voucherClassConversion.accountDetails.shippingDetails = new GstDetailsClass();
        voucherClassConversion.accountDetails.shippingDetails.panNumber = result.account.shippingDetails.panNumber;
        voucherClassConversion.accountDetails.shippingDetails.address = result.account.shippingDetails.address;
        voucherClassConversion.accountDetails.shippingDetails.gstNumber = result.account.shippingDetails.gstNumber;
        voucherClassConversion.accountDetails.shippingDetails.state.code = this.getNewStateCode(result.account.shippingDetails.stateCode);
        voucherClassConversion.accountDetails.shippingDetails.state.name = result.account.shippingDetails.stateName;

        voucherClassConversion.accountDetails.shippingDetails = this.updateAddressShippingBilling(voucherClassConversion.accountDetails.shippingDetails);
        voucherClassConversion.accountDetails.billingDetails = this.updateAddressShippingBilling(voucherClassConversion.accountDetails.billingDetails);

        // voucherClassConversion.accountDetails.contactNumber = result.account.mobileNumber;
        voucherClassConversion.accountDetails.attentionTo = result.account.attentionTo;
        voucherClassConversion.accountDetails.email = result.account.email;
        voucherClassConversion.accountDetails.uniqueName = result.account.uniqueName;

        //code for voucher details
        voucherDetails.voucherDate = result.date ? result.date : '';
        voucherDetails.balanceDue = result.balanceTotal.amountForAccount;
        voucherDetails.deposit = result.deposit ? result.deposit.amountForAccount : 0;

        //need to check usage
        voucherDetails.dueDate = result.dueDate ? moment(result.dueDate, 'DD-MM-YYYY').toDate() : '';
        voucherDetails.balanceStatus = result.balanceStatus;

        voucherDetails.customerUniquename = result.account.uniqueName;
        voucherDetails.grandTotal = result.grandTotal.amountForAccount;
        voucherDetails.voucherNumber = result.number;
        voucherDetails.subTotal = result.subTotal.amountForAccount;
        voucherDetails.taxesTotal = result.taxTotal.cumulativeAmountForAccount;
        voucherDetails.totalAsWords = result.totalAsWords.amountForAccount;

        voucherClassConversion.voucherDetails = voucherDetails;
        voucherClassConversion.templateDetails = result.templateDetails;

        this.isMulticurrencyAccount = result.multiCurrency;
        this.customerCountryName = result.account.billingDetails.countryName;
        this.showGstAndTrnUsingCountryName(this.customerCountryName);

        this.exchangeRate = result.exchangeRate;
        this.originalExchangeRate = this.exchangeRate;

        this.invoiceUniqueName = result.uniqueName;
        this.prepareInvoiceTypeFlags();
        if (result.cashInvoice) {
            this.isCashInvoice = true;
            this.isSalesInvoice = false;
        }
        if (this.isCashInvoice || result.type.toString().toUpperCase() === VoucherTypeEnum.cash.toString().toUpperCase()) {
            voucherDetails.customerName = result.account.customerName;
            this.depositAccountUniqueName = result.account.uniqueName;
        } else {
            voucherDetails.customerName = result.account.name;
        }

        return voucherClassConversion;
    }

    public updateExchangeRate(val) {
        val = val.replace(this.baseCurrencySymbol, '');
        let total = parseFloat(val.replace(/,/g, "")) || 0;
        if (this.isMulticurrencyAccount) {
            this.exchangeRate = total / this.invFormData.voucherDetails.grandTotal || 0;
            this.originalExchangeRate = this.exchangeRate;
        }
    }

    public getCurrencyRate(to, from) {
        let date = moment().format('DD-MM-YYYY');
        this._ledgerService.GetCurrencyRateNewApi(from, to, date).subscribe(response => {
            let rate = response.body;
            if (rate) {
                this.originalExchangeRate = rate;
                this.exchangeRate = rate;
            }
        }, (error => {

        }));
    }

    public updateBankAccountObject(accCurr) {
        let bankAccounts: IOption[] = [];
        this.flattenAccountListStream$.pipe(take(1)).subscribe(a => {
            a.forEach(acc => {
                if (acc.parentGroups.some(p => p.uniqueName === 'bankaccounts' || p.uniqueName === 'cash')) {
                    if (!acc.currency || acc.currency === accCurr || acc.currency === this.companyCurrency) {
                        bankAccounts.push({label: acc.name, value: acc.uniqueName, additional: acc});
                    }
                }
            });
        });
        return _.orderBy(bankAccounts, 'label');
    }

    public switchCurrencyImg(switchCurr) {
        this.showSwitchedCurr = switchCurr;
        if (switchCurr) {
            this.reverseExchangeRate = this.exchangeRate ? 1 / this.exchangeRate : 0;
            this.originalReverseExchangeRate = this.reverseExchangeRate;
        } else {
            this.exchangeRate = this.reverseExchangeRate ? 1 / this.reverseExchangeRate : 0;
            this.originalExchangeRate = this.exchangeRate;
        }
    }

    public saveCancelExcRate(toSave) {
        if (toSave) {
            if (this.showSwitchedCurr) {
                this.exchangeRate = this.reverseExchangeRate ? 1 / this.reverseExchangeRate : 0;
            } else {
                this.originalExchangeRate = this.exchangeRate;
            }
            this.autoSaveIcon = !this.autoSaveIcon;
            this.showCurrencyValue = !this.showCurrencyValue;
            this.originalReverseExchangeRate = this.reverseExchangeRate;
            this.calculateGrandTotal();
        } else {
            this.showCurrencyValue = !this.showCurrencyValue;
            this.autoSaveIcon = !this.autoSaveIcon;
            this.exchangeRate = this.originalExchangeRate;
            this.reverseExchangeRate = this.originalReverseExchangeRate;
        }
    }

    /**
     * Returns the promise once the state list is successfully
     * fetched to carry outn further operations
     *
     * @private
     * @param {*} currency Currency code for the user
     * @returns Promise to carry out further operations
     * @memberof ProformaInvoiceComponent
     */
    private getUpdatedStateCodes(currency: any): Promise<any> {
        return new Promise((resolve: Function) => {
            if (currency) {
                this.salesService.getStateCode(currency).subscribe(resp => {
                    this.statesSource = this.modifyStateResp((resp.body) ? resp.body.stateList : []);
                    resolve();
                }, () => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    private modifyStateResp(stateList: StateCode[]) {
        let stateListRet: IOption[] = [];
        stateList.forEach(stateR => {
            stateListRet.push({label: stateR.name, value: stateR.code ? stateR.code : stateR.stateGstCode, stateGstCode: stateR.stateGstCode ? stateR.stateGstCode : stateR.code});
        });
        return stateListRet;
    }

    public fillShippingBillingDetails($event: any, isBilling) {
        let stateName = $event.label;
        let stateCode = $event.value;

        if (isBilling) {
            // update account details address if it's billing details
            this.invFormData.accountDetails.billingDetails.state.name = stateName;
            this.invFormData.accountDetails.billingDetails.stateName = stateName;
            this.invFormData.accountDetails.billingDetails.stateCode = stateCode;
        } else {
            // if it's not billing address then only update shipping details
            // check if it's not auto fill shipping address from billing address then and then only update shipping details
            if (!this.autoFillShipping) {
                this.invFormData.accountDetails.shippingDetails.stateName = stateName;
                this.invFormData.accountDetails.shippingDetails.stateCode = stateCode;
                this.invFormData.accountDetails.shippingDetails.state.name = stateName;
            }
        }
    }

    private updateAddressShippingBilling(obj) {
        if (obj) {
            let shippigAddrss = '';
            obj.address.forEach(res => {
                shippigAddrss = shippigAddrss + res + '\n';
            });
            obj.address[0] = shippigAddrss;
        }
        return obj;
    }

    private showGstAndTrnUsingCountryName(name: string) {
        if (this.selectedCompany.country === name) {
            if (name === 'India') {
                this.showGSTINNo = true;
                this.showTRNNo = false;
            } else if (name === 'United Arab Emirates') {
                this.showGSTINNo = false;
                this.showTRNNo = true;
            }
        } else {
            this.showGSTINNo = false;
            this.showTRNNo = false;
        }
    }

    public selectDefaultbank() {
        if (!this.depositAccountUniqueName) {
            this.depositAccountUniqueName = 'cash';
        }
    }

    public onBlurDueDate(index) {
        if (this.invFormData.voucherDetails.customerUniquename || this.invFormData.voucherDetails.customerName) {
            this.setActiveIndx(index);
            setTimeout(() => {
                let selectAccount = this.selectAccount.toArray();
                if (selectAccount !== undefined && selectAccount[index] !== undefined) {
                    selectAccount[index].show('');
                }
            }, 200);
        }
    }

    public onBlurInvoiceDate(index) {
        if (!this.isSalesInvoice && !this.isPurchaseInvoice && !this.isProformaInvoice && !this.isEstimateInvoice) {
            // FOR CASH INVOICE, DEBIT NOTE AND CREDIT NOTE
            this.onBlurDueDate(index);
        }
    }

    public focusInCustomerName() {
        if (this.isCashInvoice) {
            setTimeout(() => {
                if (this.inputCustomerName) {
                    this.inputCustomerName.nativeElement.focus();
                }
            }, 200);
        } else {
            let firstElementToFocus: any = document.getElementsByClassName('fristElementToFocus');
            if (firstElementToFocus[0]) {
                firstElementToFocus[0].focus();
            }
        }

    }

    /**
     * toggle hsn/sac dropdown
     * and hide all open date-pickers because it's overlapping
     * hsn/sac dropdown
     */
    public toggleHsnSacDropDown() {
        if (this.datePickers && this.datePickers.length) {
            this.datePickers.forEach(datePicker => {
                if (datePicker.isOpen) {
                    datePicker.hide();
                }
            });
        }
        this.hsnDropdownShow = !this.hsnDropdownShow;
    }

    /**
     * set current page title as header title
     * @param invoiceType: VoucherTypeEnum
     */
    private setCurrentPageTitle(invoiceType: VoucherTypeEnum) {
        // find exact item from navigation list by using invoiceType
        let navItemFromMenuList = NAVIGATION_ITEM_LIST.find(page => page.uniqueName === `/pages/proforma-invoice/invoice/${invoiceType}`);
        let currentPageObj = new CurrentPage();
        currentPageObj.name = navItemFromMenuList.name;
        currentPageObj.url = this.router.url;
        this.store.dispatch(this._generalActions.setPageTitle(currentPageObj));
    }
}

import { Observable, of, ReplaySubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, auditTime } from 'rxjs/operators';
import { IOption } from './../../theme/ng-select/option.interface';
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import * as moment from 'moment/moment';
import {
    GenBulkInvoiceFinalObj,
    GenBulkInvoiceGroupByObj,
    GenerateBulkInvoiceRequest,
    GetAllLedgersForInvoiceResponse,
    GetAllLedgersOfInvoicesResponse,
    ILedgersInvoiceResult,
    InvoiceFilterClass,
    InvoicePreviewDetailsVm
} from '../../models/api-models/Invoice';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { DaterangePickerComponent } from '../../theme/ng2-daterangepicker/daterangepicker.component';
import { GeneralService } from '../../services/general.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GeneralActions } from '../../actions/general/general.actions';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import { OrganizationType } from '../../models/user-login-state';
import { CommonActions } from '../../actions/common.actions';
import { cloneDeep, find, forEach, groupBy, indexOf, map, orderBy, uniq } from '../../lodash-optimized';
import { VoucherTypeEnum } from '../../models/api-models/Sales';

const COUNTS = [
    { label: '12', value: '12' },
    { label: '25', value: '25' },
    { label: '50', value: '50' },
    { label: '100', value: '100' }
];

@Component({
    selector: 'app-invoice-generate',
    styleUrls: ['./invoice.generate.component.scss'],
    templateUrl: './invoice.generate.component.html'
})

export class InvoiceGenerateComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild(ElementViewContainerRef, { static: true }) public elementViewContainerRef: ElementViewContainerRef;
    @ViewChild(DaterangePickerComponent, { static: true }) public dp: DaterangePickerComponent;
    @ViewChild('particularSearch', { static: true }) public particularSearch: ElementRef;
    @ViewChild('accountUniqueNameSearch', { static: true }) public accountUniqueNameSearch: ElementRef;
    @Input() public selectedVoucher: string = 'invoice';

    public moment = moment;
    public showFromDatePicker: boolean = false;
    public showToDatePicker: boolean = false;
    public togglePrevGenBtn: boolean = false;
    public counts: IOption[] = COUNTS;
    public ledgerSearchRequest: InvoiceFilterClass = new InvoiceFilterClass();
    public filtersForEntryTotal: IOption[] = [];
    public ledgersData: GetAllLedgersOfInvoicesResponse;
    public selectedLedgerItems: string[] = [];
    public selectedCountOfAccounts: string[] = [];
    public allItemsSelected: boolean = false;
    public showParticularSearch = false;
    public showAccountSearch = false;
    public showDescSearch = false;
    public modalRef: BsModalRef;
    public modalConfig = {
        animated: true,
        keyboard: false,
        backdrop: 'static',
        ignoreBackdropClick: true
    };
    public startDate: Date;
    public endDate: Date;
    public isGenerateInvoice: boolean = true;
    public modalUniqueName: string;
    public particularInput: FormControl = new FormControl();
    public accountUniqueNameInput: FormControl = new FormControl();
    public hoveredItemForAction: string = '';
    public clickedHoveredItemForAction: string = '';
    public isGetAllRequestInProcess$: Observable<boolean> = of(true);

    public selectedDateRange: any;
    public universalDate$: Observable<any>;

    private universalDate: Date[];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private isBulkInvoiceGenerated$: Observable<boolean>;
    public isUniversalDateApplicable: boolean = false;
    private isBulkInvoiceGeneratedWithoutErr$: Observable<boolean>;
    public isMobileView = false;
    /** To show edit mode component */
    public showEditMode: boolean = false;
    /** get voucher details response object*/
    public voucherDetails: any;
    /** selected pending voucher */
    public selectedItem: InvoicePreviewDetailsVm;
    /** selected from date */
    public fromDate: string;
    /** selected to date */
    public toDate: string;
    /** is get voucher API call in progress */
    public voucherDetailsInProcess$: Observable<boolean> = of(false);
    /** selected profile currency symbol */
    public baseCurrencySymbol: string = '';
    /** selected profile currency type */
    public baseCurrency: string = '';
    /** Selected account unique name */
    public selectedAccountUniqueName: string = '';
    /** is get ledger data API call in progress */
    public getLedgerDataInProcess$: Observable<boolean> = of(false);
    /** This will hold checked invoices */
    public selectedInvoices: any[] = [];
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** Current branches */
    public branches: Array<any>;
    /** This will hold if updated is account in master to refresh the list of vouchers */
    public isAccountUpdated: boolean = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Comparision filters */
    public comparisionFilters: any = [
        { label: '', value: 'greaterThan' },
        { label: '', value: 'lessThan' },
        { label: '', value: 'greaterThanOrEquals' },
        { label: '', value: 'lessThanOrEquals' },
        { label: '', value: 'equals' }
    ];
    /** True, if company supports new voucher version */
    public isNewVoucherVersion: boolean;

    constructor(
        private store: Store<AppState>,
        private invoiceActions: InvoiceActions,
        private _cdRef: ChangeDetectorRef,
        private generalService: GeneralService,
        private generalActions: GeneralActions,
        private _breakPointObservar: BreakpointObserver,
        private modalService: BsModalService,
        private commonActions: CommonActions
    ) {
        // set initial values
        this.ledgerSearchRequest.page = 1;
        this.ledgerSearchRequest.count = 20;
        this.isBulkInvoiceGenerated$ = this.store.pipe(select(p => p.invoice.isBulkInvoiceGenerated), takeUntil(this.destroyed$));
        this.isBulkInvoiceGeneratedWithoutErr$ = this.store.pipe(select(p => p.invoice.isBulkInvoiceGeneratedWithoutErrors), takeUntil(this.destroyed$));
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
        this.voucherDetailsInProcess$ = this.store.pipe(select(p => p.receipt.voucherDetailsInProcess), takeUntil(this.destroyed$));
        this.getLedgerDataInProcess$ = this.store.pipe(select(state => state.invoice.isGetAllLedgerDataInProgress), takeUntil(this.destroyed$));
        this._breakPointObservar.observe([
            '(max-width: 1023px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileView = result.matches;
        });
    }

    public ngOnInit() {
        this.isNewVoucherVersion = this.generalService.voucherApiVersion === 2;
        this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.branches = response || [];
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && this.branches.length > 1;
            }
        });

        this.store.pipe(select(p => p.invoice.ledgers),
            takeUntil(this.destroyed$))
            .subscribe((res: GetAllLedgersForInvoiceResponse) => {
                if (res && res.results) {
                    let response = cloneDeep(res);

                    response.results = orderBy(response.results, (item: ILedgersInvoiceResult) => {
                        return moment(item.entryDate, GIDDH_DATE_FORMAT);
                    }, 'desc');

                    if (response && response.results) {
                        response.results.map(item => {
                            item = this.addToolTiptext(item);
                            item.isSelected = this.generalService.checkIfValueExistsInArray(this.selectedInvoices, item.uniqueName);
                        });
                    }
                    this.ledgersData = response;
                    this.isGetAllRequestInProcess$ = of(false);
                    setTimeout(() => {
                        this.detectChanges();
                    }, 400)
                }
            });

        combineLatest([this.store.pipe(select(stores => stores.receipt.voucher)), this.store.pipe(select(stores => stores.receipt.invoiceDataHasError))])
            .pipe(takeUntil(this.destroyed$), auditTime(700))
            .subscribe(async results => {
                if (results) {
                    /** get voucher success and no any error during get voucher then show create voucher component   */
                    if (results[0] && !results[1] && this.selectedItem) {
                        this.showEditMode = true;
                    } else {
                        this.showEditMode = false;
                    }
                }
            });

        this.store.pipe(select(stores => stores.receipt.voucher),
            distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe((voucher: any) => {
                if (voucher) {
                    this.voucherDetails = voucher;
                    if (voucher && voucher.templateDetails && voucher.templateDetails.templateUniqueName) {
                        this.getInvoiceTemplateDetails(voucher.templateDetails.templateUniqueName)
                    }
                    this.store.dispatch(this.generalActions.setAppTitle('/pages/invoice/preview/' + this.selectedVoucher));
                }
            });

        // listen for bulk invoice generate and successfully generate and do the things
        this.isBulkInvoiceGenerated$.subscribe(result => {
            if (result) {
                this.toggleAllItems(false);
                this.getLedgersOfInvoice();
            }
        });
        this.isBulkInvoiceGeneratedWithoutErr$.subscribe(result => {
            if (result) {
                this.getLedgersOfInvoice();
            }
        });
        // get user country from his profile
        this.store.pipe(select(s => s.settings.profile), takeUntil(this.destroyed$)).subscribe(profile => {
            if (profile) {
                this.baseCurrencySymbol = profile.baseCurrencySymbol;
                this.baseCurrency = profile.baseCurrency;
            }
        });
        // Refresh report data according to universal date
        this.store.pipe(select((state: AppState) => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj: Date[]) => {
            if (dateObj) {
                this.universalDate = cloneDeep(dateObj);
                this.ledgerSearchRequest.dateRange = this.universalDate;
                this.fromDate = moment(this.universalDate[0], GIDDH_DATE_FORMAT).toDate().toString();
                this.toDate = moment(this.universalDate[1], GIDDH_DATE_FORMAT).toDate().toString();

                this.selectedDateRange = { startDate: moment(dateObj[0]), endDate: moment(dateObj[1]) };
                this.selectedDateRangeUi = moment(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);

                this.isUniversalDateApplicable = true;
                this.getLedgersOfInvoice();
                this.detectChanges();
            }
        });

        this.universalDate$.subscribe(a => {
            if (a) {
                this.ledgerSearchRequest.from = moment(a[0]).format(GIDDH_DATE_FORMAT);
                this.ledgerSearchRequest.to = moment(a[1]).format(GIDDH_DATE_FORMAT);
            }
        });

        this.accountUniqueNameInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.ledgerSearchRequest.accountUniqueName = s;
            this.getLedgersOfInvoice();
            if (s === '') {
                this.showAccountSearch = false;
            }
        });
        this.showEditMode = false;

        this.store.pipe(select(state => state.common.isAccountUpdated), takeUntil(this.destroyed$)).subscribe(response => {
            if (!response) {
                if (this.isAccountUpdated) {
                    this.getLedgersOfInvoice();
                    this.isAccountUpdated = false;
                }
            }
            if (response) {
                this.isAccountUpdated = true;
                this.store.dispatch(this.commonActions.accountUpdated(false));
            }
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedVoucher'] && changes['selectedVoucher'].currentValue !== changes['selectedVoucher'].previousValue) {
            this.setVoucherType(changes['selectedVoucher'].currentValue);
        }
        this.showEditMode = false;
    }

    public getLedgersByFilters(f: NgForm) {
        if (f.valid) {
            this.isUniversalDateApplicable = false;
            this.selectedLedgerItems = [];
            this.selectedCountOfAccounts = [];
            this.getLedgersOfInvoice();
        }
    }

    public pageChanged(event: any): void {
        this.ledgerSearchRequest.page = event.page;
        this.selectedLedgerItems = [];
        this.selectedCountOfAccounts = [];
        this.togglePrevGenBtn = false;
        this.getLedgersOfInvoice();
    }

    public toggleAllItems(type: boolean) {
        if (type) {
            this.allItemsSelected = true;
        } else {
            this.allItemsSelected = false;
        }
        if (this.ledgersData && this.ledgersData.results && this.ledgersData.results.length) {
            this.ledgersData.results = map(this.ledgersData.results, (item: ILedgersInvoiceResult) => {
                item.isSelected = this.allItemsSelected ? true : false;

                if (this.allItemsSelected) {
                    this.selectedInvoices = this.generalService.addValueInArray(this.selectedInvoices, item.uniqueName);
                } else {
                    this.selectedInvoices = this.generalService.removeValueFromArray(this.selectedInvoices, item.uniqueName);
                }

                return item;
            });
            this.insertItemsIntoArr();
        }
    }

    public toggleItem(item: any, action: boolean) {
        item.isSelected = action;
        if (action) {
            this.selectedInvoices = this.generalService.addValueInArray(this.selectedInvoices, item.uniqueName);
            this.countAndToggleVar();
        } else {
            this.selectedInvoices = this.generalService.removeValueFromArray(this.selectedInvoices, item.uniqueName);
            this.allItemsSelected = false;
        }
        this.insertItemsIntoArr();
    }

    public previewInvoice() {
        let model = {
            uniqueNames: uniq(this.selectedLedgerItems)
        };
        let res = find(this.ledgersData.results, (item: ILedgersInvoiceResult) => {
            return item.uniqueName === this.selectedLedgerItems[0];
        });
        this.selectedItem = cloneDeep(res);
        if (this.selectedItem && this.selectedItem.account && this.selectedItem.account.uniqueName) {
            this.selectedAccountUniqueName = this.selectedItem.account.uniqueName;
        } else {
            this.selectedAccountUniqueName = '';
        }
        this.store.dispatch(this.invoiceActions.ModifiedInvoiceStateData(model.uniqueNames));
        if (res && res.account && res.account.uniqueName) {
            this.store.dispatch(this.invoiceActions.PreviewInvoice(res.account.uniqueName, model));
        }

        this.toggleBodyClass();
    }

    /**
     * To close preview model
     *
     * @memberof InvoiceGenerateComponent
     */
    public closeModel(): void {
        this.showEditMode = false;
        this.getLedgersOfInvoice();
        this.selectedItem = null;
        this.selectedCountOfAccounts = [];
        this.selectedLedgerItems = [];
        this.toggleAllItems(false);
        this.isGetAllRequestInProcess$ = of(false);
        this.isUniversalDateApplicable = false;
    }

    public generateBulkInvoice(action: boolean) {
        if (this.selectedLedgerItems.length <= 0) {
            return false;
        }
        let arr: GenBulkInvoiceGroupByObj[] = [];
        forEach(this.ledgersData.results, (item: ILedgersInvoiceResult): void => {
            if (item.isSelected) {
                arr.push({ accUniqueName: item.account.uniqueName, uniqueName: item.uniqueName });
            }
        });
        let res = groupBy(arr, 'accUniqueName');
        let model: GenerateBulkInvoiceRequest[] = [];
        forEach(res, (item: any): void => {
            let obj: GenBulkInvoiceFinalObj = new GenBulkInvoiceFinalObj();
            obj.entries = [];
            forEach(item, (o: GenBulkInvoiceGroupByObj): void => {
                obj.accountUniqueName = o.accUniqueName;
                obj.entries.push(o.uniqueName);
            });
            model.push(obj);
        });
        this.store.dispatch(this.invoiceActions.GenerateBulkInvoice({ combined: action }, model));
        this.selectedLedgerItems = [];
        this.selectedCountOfAccounts = [];
    }

    public setToday(model: string) {
        this.ledgerSearchRequest[model] = String(moment());
    }

    public clearDate(model: string) {
        this.ledgerSearchRequest[model] = '';
    }

    public getInvoiceTemplateDetails(templateUniqueName: string) {
        if (templateUniqueName) {
            this.store.dispatch(this.invoiceActions.GetTemplateDetailsOfInvoice(templateUniqueName));
        } else {
            this.store.dispatch(this.invoiceActions.GetTemplateDetailsOfInvoice('j8bzr0k3lh0khbcje8bh'));
        }
    }

    public getLedgersOfInvoice() {
        this.store.dispatch(this.invoiceActions.GetAllLedgersForInvoice(this.prepareQueryParamsForLedgerApi(), this.prepareModelForLedgerApi()));
        if (this.ledgersData && this.ledgersData.results && this.ledgersData.results.length === 0) {
            this.ledgerSearchRequest.page = (this.ledgerSearchRequest.page > 1) ? this.ledgerSearchRequest.page - 1 : this.ledgerSearchRequest.page;
            this.store.dispatch(this.invoiceActions.GetAllLedgersForInvoice(this.prepareQueryParamsForLedgerApi(), this.prepareModelForLedgerApi()));
        }
        this.selectedLedgerItems = [];
        this.selectedCountOfAccounts = [];
    }

    public prepareModelForLedgerApi() {
        let model: InvoiceFilterClass = {};
        let o = cloneDeep(this.ledgerSearchRequest);
        if (o && o.accountUniqueName) {
            model.accountUniqueName = o.accountUniqueName;
        }
        if (o.entryTotal) {
            model.entryTotal = o.entryTotal;
        }
        if (o.description) {
            model.description = o.description;
        }
        if (o.entryTotalBy === this.comparisionFilters[0].value) {
            model.totalIsMore = true;
        } else if (o.entryTotalBy === this.comparisionFilters[1].value) {
            model.totalIsLess = true;
        } else if (o.entryTotalBy === this.comparisionFilters[2].value) {
            model.totalIsMore = true;
            model.totalIsEqual = true;
        } else if (o.entryTotalBy === this.comparisionFilters[3].value) {
            model.totalIsLess = true;
            model.totalIsEqual = true;
        } else if (o.entryTotalBy === this.comparisionFilters[4].value) {
            model.totalIsEqual = true;
        }
        return model;
    }

    public prepareQueryParamsForLedgerApi() {
        let o = cloneDeep(this.ledgerSearchRequest);
        let fromDate = null;
        let toDate = null;
        if (this.universalDate && this.universalDate.length) {
            fromDate = moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
            toDate = moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
        }

        return {
            from: this.isUniversalDateApplicable ? fromDate : o.from,
            to: this.isUniversalDateApplicable ? toDate : o.to,
            count: o.count,
            page: o.page,
            voucherType: this.selectedVoucher
        };
    }

    public bsValueChange(event: any) {
        if (event) {
            this.ledgerSearchRequest.from = moment(event.picker.startDate._d).format(GIDDH_DATE_FORMAT);
            this.ledgerSearchRequest.to = moment(event.picker.endDate._d).format(GIDDH_DATE_FORMAT);
            this.isUniversalDateApplicable = false;
            this.getLedgersOfInvoice();
        }
    }

    public countAndToggleVar() {
        let total: number = this.ledgersData.results.length;
        let count: number = 0;
        forEach(this.ledgersData.results, (item: ILedgersInvoiceResult) => {
            if (item.isSelected) {
                count++;
            }
        });
        if (count === total) {
            this.allItemsSelected = true;
        }
    }

    public insertItemsIntoArr() {
        if (this.ledgersData) {
            forEach(this.ledgersData.results, (item: ILedgersInvoiceResult) => {
                let idx = indexOf(this.selectedLedgerItems, item.uniqueName);
                if (item.isSelected) {
                    if (idx === -1) {
                        this.selectedLedgerItems.push(item.uniqueName);
                        this.selectedCountOfAccounts.push(item.account.uniqueName);
                    }
                } else {
                    if (idx !== -1) {
                        this.selectedLedgerItems.splice(idx);
                        this.selectedCountOfAccounts.splice(idx);
                    }
                }
            });
        }
        // check if all selected entries are from same account
        if (this.selectedCountOfAccounts.length) {
            this.togglePrevGenBtn = this.selectedCountOfAccounts.every(v => v === this.selectedCountOfAccounts[0]);
        } else {
            this.togglePrevGenBtn = false;
        }
    }

    public changeDebitOrCredit(type: string) {
        if (this.selectedVoucher === type) {
            return;
        }
        this.isGenerateInvoice = false;
        this.selectedVoucher = type;
        this.getLedgersOfInvoice();
    }

    /* tslint:disable */
    public childOf(c, p) {
        while ((c = c.parentNode) && c !== p) {
        }
        return !!c;
    }

    /**
     * setVoucherType
     */
    public setVoucherType(voucherType) {
        switch (voucherType) {
            case 'receipt':
                this.selectedVoucher = 'receipt';
                this.isGenerateInvoice = false;
                break;
            case 'credit note':
                this.isGenerateInvoice = false;
                this.selectedVoucher = 'credit note';
                break;
            case 'debit note':
                this.isGenerateInvoice = false;
                this.selectedVoucher = 'debit note';
                break;
            default:
                this.isGenerateInvoice = true;
                this.selectedVoucher = 'sales';
                break;
        }
    }

    public toggleSearch(fieldName: string) {
        if (fieldName === 'particular') {
            this.showParticularSearch = true;
            this.showAccountSearch = false;

            setTimeout(() => {
                this.particularSearch?.nativeElement.focus();
            }, 200);
        } else {
            this.showParticularSearch = false;
            this.showAccountSearch = true;

            setTimeout(() => {
                this.accountUniqueNameSearch?.nativeElement.focus();
            }, 200);
        }
    }

    detectChanges() {
        if (!this._cdRef['destroyed']) {
            this._cdRef.detectChanges();
        }
    }

    public ngOnDestroy() {
        this.showEditMode = false;
        this.toggleAllItems(false);
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.store.dispatch(this.invoiceActions.resetPendingData());
    }

    public resetDateSearch() {
        this.ledgerSearchRequest.dateRange = this.universalDate;
        if (this.universalDate) {
            this.selectedDateRange = { startDate: moment(this.universalDate[0]), endDate: moment(this.universalDate[1]) };
            this.selectedDateRangeUi = moment(this.universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(this.universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);

            this.isUniversalDateApplicable = true;
        }
        this.getLedgersOfInvoice();
        this.insertItemsIntoArr();
        this.detectChanges();
    }

    /**
     * Add remove fixed class on body tag
     *
     * @memberof InvoiceGenerateComponent
     */
    public toggleBodyClass(): void {
        if (this.showEditMode) {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }

    }

    /**
     *
     * Add tooltip text for total pending amount
     * to item supplied (for Cash/Sales Invoice and CR/DR note)
     *
     * @private
     * @param {ReceiptItem} item Receipt item received from service
     * @returns {*} Modified item with tooltup text for grand total
     * @memberof InvoiceGenerateComponent
     */
    private addToolTiptext(item: ILedgersInvoiceResult): any {
        try {
            let grandTotalAmountForCompany, grandTotalAmountForAccount;
            if (item.total && item.totalForCompany) {
                grandTotalAmountForCompany = Number(item.totalForCompany.amount) || 0;
                grandTotalAmountForAccount = Number(item.total.amount) || 0;
            }

            let grandTotalConversionRate = 0;
            if (grandTotalAmountForCompany && grandTotalAmountForAccount) {
                grandTotalConversionRate = +((grandTotalAmountForCompany / grandTotalAmountForAccount) || 0).toFixed(2);
            }

            let currencyConversion = this.localeData?.currency_conversion;
            currencyConversion = currencyConversion?.replace("[BASE_CURRENCY]", this.baseCurrency)?.replace("[AMOUNT]", grandTotalAmountForCompany)?.replace("[CONVERSION_RATE]", grandTotalConversionRate);

            item['totalTooltipText'] = currencyConversion;

        } catch (error) {
        }
        return item;
    }

    /**
     *To show the datepicker
     *
     * @param {*} element
     * @memberof InvoiceGenerateComponent
     */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
    }

    /**
     * This will hide the datepicker
     *
     * @memberof InvoiceGenerateComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof InvoiceGenerateComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = moment(value.endDate).format(GIDDH_DATE_FORMAT);
            this.ledgerSearchRequest.from = this.fromDate;
            this.ledgerSearchRequest.to = this.toDate;
            this.isUniversalDateApplicable = false;
            this.getLedgersOfInvoice();
        }
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof InvoiceGenerateComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.filtersForEntryTotal = [
                { label: this.commonLocaleData?.app_comparision_filters?.greater_than, value: 'greaterThan' },
                { label: this.commonLocaleData?.app_comparision_filters?.less_than, value: 'lessThan' },
                { label: this.commonLocaleData?.app_comparision_filters?.greater_than_equals, value: 'greaterThanOrEquals' },
                { label: this.commonLocaleData?.app_comparision_filters?.less_than_equals, value: 'lessThanOrEquals' },
                { label: this.commonLocaleData?.app_comparision_filters?.equals, value: 'equals' }
            ];

            this.comparisionFilters = this.filtersForEntryTotal;
        }
    }

    public voucherTypeChanged(voucherType: VoucherTypeEnum): void {
        this.setVoucherType(this.selectedVoucher);
    }
}

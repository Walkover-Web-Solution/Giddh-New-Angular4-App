import { Observable, of, of as observableOf, ReplaySubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, auditTime } from 'rxjs/operators';
import { createSelector } from 'reselect';
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
import * as _ from '../../lodash-optimized';
import { orderBy } from '../../lodash-optimized';
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
import { AccountService } from '../../services/account.service';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { IFlattenAccountsResultItem } from 'apps/web-giddh/src/app/models/interfaces/flattenAccountsResultItem.interface';
import { ActivatedRoute } from '@angular/router';
import { InvoiceReceiptActions } from 'apps/web-giddh/src/app/actions/invoice/receipt/receipt.actions';
import { DaterangePickerComponent } from '../../theme/ng2-daterangepicker/daterangepicker.component';
import { GeneralService } from '../../services/general.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GeneralActions } from '../../actions/general/general.actions';
import { OrganizationType } from '../../models/user-login-state';
import { CommonActions } from '../../actions/common.actions';

const PARENT_GROUP_ARR = ['sundrydebtors', 'bankaccounts', 'revenuefromoperations', 'otherincome', 'cash'];
const COUNTS = [
    { label: '12', value: '12' },
    { label: '25', value: '25' },
    { label: '50', value: '50' },
    { label: '100', value: '100' }
];

const COMPARISON_FILTER = [
    { label: 'Greater Than', value: 'greaterThan' },
    { label: 'Less Than', value: 'lessThan' },
    { label: 'Greater Than or Equals', value: 'greaterThanOrEquals' },
    { label: 'Less Than or Equals', value: 'lessThanOrEquals' },
    { label: 'Equals', value: 'equals' }
];

@Component({
    selector: 'app-invoice-generate',
    styleUrls: ['./invoice.generate.component.scss'],
    templateUrl: './invoice.generate.component.html'
})

export class InvoiceGenerateComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild(ElementViewContainerRef, {static: true}) public elementViewContainerRef: ElementViewContainerRef;
    @ViewChild(DaterangePickerComponent, {static: true}) public dp: DaterangePickerComponent;
    @ViewChild('particularSearch', {static: true}) public particularSearch: ElementRef;
    @ViewChild('accountUniqueNameSearch', {static: true}) public accountUniqueNameSearch: ElementRef;
    @Input() public selectedVoucher: string = 'invoice';

    public accounts$: Observable<IOption[]>;
    public moment = moment;
    public showFromDatePicker: boolean = false;
    public showToDatePicker: boolean = false;
    public togglePrevGenBtn: boolean = false;
    public counts: IOption[] = COUNTS;
    public ledgerSearchRequest: InvoiceFilterClass = new InvoiceFilterClass();
    public filtersForEntryTotal: IOption[] = COMPARISON_FILTER;
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
    public datePickerOptions: any = {
        hideOnEsc: true,
        // parentEl: '#dp-parent',
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
        endDate: moment(),
        // parentEl: '#dateRangeParent'
    };
    public universalDate$: Observable<any>;

    private universalDate: Date[];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private flattenAccountListStream$: Observable<IFlattenAccountsResultItem[]>;
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
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** Current branches */
    public branches: Array<any>;
    /** This will hold if updated is account in master to refresh the list of vouchers */
    public isAccountUpdated: boolean = false;

    constructor(
        private store: Store<AppState>,
        private invoiceActions: InvoiceActions,
        private _cdRef: ChangeDetectorRef,
        private generalService: GeneralService,
        private generalActions: GeneralActions,
        private _breakPointObservar: BreakpointObserver,
        private commonActions: CommonActions
    ) {
        // set initial values
        this.ledgerSearchRequest.page = 1;
        this.ledgerSearchRequest.count = 20;
        this.flattenAccountListStream$ = this.store.pipe(select(p => p.general.flattenAccounts), takeUntil(this.destroyed$));
        this.isBulkInvoiceGenerated$ = this.store.pipe(select(p => p.invoice.isBulkInvoiceGenerated), takeUntil(this.destroyed$));
        this.isBulkInvoiceGeneratedWithoutErr$ = this.store.pipe(select(p => p.invoice.isBulkInvoiceGeneratedWithoutErrors), takeUntil(this.destroyed$));
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
        this.voucherDetailsInProcess$ = this.store.pipe(select(p => p.receipt.voucherDetailsInProcess), takeUntil(this.destroyed$));
        this.getLedgerDataInProcess$ = this.store.pipe(select(state => state.invoice.isGetAllLedgerDataInProgress),takeUntil(this.destroyed$));
        this._breakPointObservar.observe([
            '(max-width: 1023px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileView = result.matches;
        });
    }

    public ngOnInit() {
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
                    let response = _.cloneDeep(res);

                    response.results = _.orderBy(response.results, (item: ILedgersInvoiceResult) => {
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
                    // this.showEditMode = !this.showEditMode;

                }
            });

        // listen for bulk invoice generate and successfully generate and do the things
        this.isBulkInvoiceGenerated$.subscribe(result => {
            if (result) {
                this.toggleAllItems(false);
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
                this.universalDate = _.cloneDeep(dateObj);
                this.ledgerSearchRequest.dateRange = this.universalDate;
                this.datePickerOptions = { ...this.datePickerOptions, startDate: moment(this.universalDate[0], GIDDH_DATE_FORMAT).toDate(), endDate: moment(this.universalDate[1], GIDDH_DATE_FORMAT).toDate(), chosenLabel: this.universalDate[2] };
                this.fromDate = moment(this.universalDate[0], GIDDH_DATE_FORMAT).toDate().toString();
                this.toDate = moment(this.universalDate[1], GIDDH_DATE_FORMAT).toDate().toString();
                // assign date
                // this.assignStartAndEndDateForDateRangePicker(dateObj[0], dateObj[1]);

                this.isUniversalDateApplicable = true;
                this.getLedgersOfInvoice();
                this.detectChanges();
            }
        });

        // set financial years based on company financial year
        this.store.pipe(select(state => state.company && state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if(activeCompany) {
                let activeFinancialYear = activeCompany.activeFinancialYear;
                if (activeFinancialYear) {
                    this.datePickerOptions.ranges['This Financial Year to Date'] = [
                        moment(activeFinancialYear.financialYearStarts, GIDDH_DATE_FORMAT).startOf('day'),
                        moment()
                    ];
                    this.datePickerOptions.ranges['Last Financial Year'] = [
                        moment(activeFinancialYear.financialYearStarts, GIDDH_DATE_FORMAT).subtract(1, 'year'),
                        moment(activeFinancialYear.financialYearEnds, GIDDH_DATE_FORMAT).subtract(1, 'year')
                    ];
                }
            }
        });

        this.universalDate$.subscribe(a => {
            if (a) {
                this.datePickerOptions = { ...this.datePickerOptions, startDate: a[0], endDate: a[1], chosenLabel: a[2] };

                // assign date
                // this.assignStartAndEndDateForDateRangePicker(a[0], a[1]);

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
            if(!response) {
                if(this.isAccountUpdated) {
                    this.getLedgersOfInvoice();
                    this.isAccountUpdated = false;
                }
            }
            if(response) {
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
            this.ledgersData.results = _.map(this.ledgersData.results, (item: ILedgersInvoiceResult) => {
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
            uniqueNames: _.uniq(this.selectedLedgerItems)
        };
        let res = _.find(this.ledgersData.results, (item: ILedgersInvoiceResult) => {
            return item.uniqueName === this.selectedLedgerItems[0];
        });
        this.selectedItem = _.cloneDeep(res);
        if (this.selectedItem && this.selectedItem.account && this.selectedItem.account.uniqueName) {
            this.selectedAccountUniqueName = this.selectedItem.account.uniqueName;
        } else {
            this.selectedAccountUniqueName = '';
        }
        this.store.dispatch(this.invoiceActions.ModifiedInvoiceStateData(model.uniqueNames));
        if (res && res.account && res.account.uniqueName) {
            this.store.dispatch(this.invoiceActions.PreviewInvoice(res.account.uniqueName, model));
        }

        // this.showEditMode = !this.showEditMode
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
        _.forEach(this.ledgersData.results, (item: ILedgersInvoiceResult): void => {
            if (item.isSelected) {
                arr.push({ accUniqueName: item.account.uniqueName, uniqueName: item.uniqueName });
            }
        });
        let res = _.groupBy(arr, 'accUniqueName');
        let model: GenerateBulkInvoiceRequest[] = [];
        _.forEach(res, (item: any): void => {
            let obj: GenBulkInvoiceFinalObj = new GenBulkInvoiceFinalObj();
            obj.entries = [];
            _.forEach(item, (o: GenBulkInvoiceGroupByObj): void => {
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
        let o = _.cloneDeep(this.ledgerSearchRequest);
        if (o && o.accountUniqueName) {
            model.accountUniqueName = o.accountUniqueName;
        }
        if (o.entryTotal) {
            model.entryTotal = o.entryTotal;
        }
        if (o.description) {
            model.description = o.description;
        }
        if (o.entryTotalBy === COMPARISON_FILTER[0].value) {
            model.totalIsMore = true;
        } else if (o.entryTotalBy === COMPARISON_FILTER[1].value) {
            model.totalIsLess = true;
        } else if (o.entryTotalBy === COMPARISON_FILTER[2].value) {
            model.totalIsMore = true;
            model.totalIsEqual = true;
        } else if (o.entryTotalBy === COMPARISON_FILTER[3].value) {
            model.totalIsLess = true;
            model.totalIsEqual = true;
        } else if (o.entryTotalBy === COMPARISON_FILTER[4].value) {
            model.totalIsEqual = true;
        }
        return model;
    }

    public prepareQueryParamsForLedgerApi() {
        let o = _.cloneDeep(this.ledgerSearchRequest);
        let fromDate = null;
        let toDate = null;
        if (this.universalDate && this.universalDate.length) {
            fromDate = moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
            toDate = moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
        }
        // else {
        //   fromDate = moment().subtract(30, 'days').format(GIDDH_DATE_FORMAT);
        //   toDate = moment().format(GIDDH_DATE_FORMAT);
        // }
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
        _.forEach(this.ledgersData.results, (item: ILedgersInvoiceResult) => {
            if (item.isSelected) {
                count++;
            }
        });
        if (count === total) {
            this.allItemsSelected = true;
        }
    }

    public insertItemsIntoArr() {
        _.forEach(this.ledgersData.results, (item: ILedgersInvoiceResult) => {
            let idx = _.indexOf(this.selectedLedgerItems, item.uniqueName);
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

    public clickedOutside(event, el, field: 'accountUniqueName' | 'description' | 'particular') {
        // if (this.invoiceSearchRequest[field] !== '') {
        //   return;
        // }
        //
        // if (this.childOf(event.target, el)) {
        //   return;
        // } else {
        //   if (field === 'invoiceNumber') {
        //     this.showInvoiceNoSearch = false;
        //   } else {
        //     this.showCustomerSearch = false;
        //   }
        // }
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
                this.particularSearch.nativeElement.focus();
            }, 200);
        } else {
            this.showParticularSearch = false;
            this.showAccountSearch = true;

            setTimeout(() => {
                this.accountUniqueNameSearch.nativeElement.focus();
            }, 200);
        }
    }

    detectChanges() {
        if (!this._cdRef['destroyed']) {
            this._cdRef.detectChanges();
        }
    }

    /**
     * assign date to start and end date for date range picker
     * @param from
     * @param to
     */
    private assignStartAndEndDateForDateRangePicker(from, to) {
        from = from || moment().subtract(30, 'd');
        to = to || moment();
        this.selectedDateRange = {
            startDate: moment(from, GIDDH_DATE_FORMAT),
            endDate: moment(to, GIDDH_DATE_FORMAT)
        };
    }

    public ngOnDestroy() {
        this.showEditMode = false;
        this.toggleAllItems(false);
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public resetDateSearch() {
        this.ledgerSearchRequest.dateRange = this.universalDate;
        if (this.universalDate) {
            this.datePickerOptions = { ...this.datePickerOptions, startDate: moment(this.universalDate[0], GIDDH_DATE_FORMAT).toDate(), endDate: moment(this.universalDate[1], GIDDH_DATE_FORMAT).toDate() };
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
            item['totalTooltipText'] = `In ${this.baseCurrency}: ${grandTotalAmountForCompany}<br />(Conversion Rate: ${grandTotalConversionRate})`;

        } catch (error) {
        }
        return item;
    }
}

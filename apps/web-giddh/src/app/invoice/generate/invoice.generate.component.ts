import {Observable, of, of as observableOf, ReplaySubject} from 'rxjs';

import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {createSelector} from 'reselect';
import {IOption} from './../../theme/ng-select/option.interface';
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
import {FormControl, NgForm} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/roots';
import * as _ from '../../lodash-optimized';
import {orderBy} from '../../lodash-optimized';
import * as moment from 'moment/moment';
import {
    GenBulkInvoiceFinalObj,
    GenBulkInvoiceGroupByObj,
    GenerateBulkInvoiceRequest,
    GetAllLedgersForInvoiceResponse,
    GetAllLedgersOfInvoicesResponse,
    ILedgersInvoiceResult,
    InvoiceFilterClass
} from '../../models/api-models/Invoice';
import {InvoiceActions} from '../../actions/invoice/invoice.actions';
import {AccountService} from '../../services/account.service';
import {ElementViewContainerRef} from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import {ModalDirective} from 'ngx-bootstrap';
import {GIDDH_DATE_FORMAT} from '../../shared/helpers/defaultDateFormat';
import {IFlattenAccountsResultItem} from 'apps/web-giddh/src/app/models/interfaces/flattenAccountsResultItem.interface';
import {ActivatedRoute} from '@angular/router';
import {InvoiceReceiptActions} from 'apps/web-giddh/src/app/actions/invoice/receipt/receipt.actions';
import {DaterangePickerComponent} from '../../theme/ng2-daterangepicker/daterangepicker.component';
import {GeneralService} from '../../services/general.service';
import {BreakpointObserver} from '@angular/cdk/layout';

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
    selector: 'app-invoice-generate',
    styleUrls: ['./invoice.generate.component.scss'],
    templateUrl: './invoice.generate.component.html'
})
export class InvoiceGenerateComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild(ElementViewContainerRef) public elementViewContainerRef: ElementViewContainerRef;
    @ViewChild('invoiceGenerateModel') public invoiceGenerateModel: ModalDirective;
    @ViewChild(DaterangePickerComponent) public dp: DaterangePickerComponent;
    @ViewChild('particularSearch') public particularSearch: ElementRef;
    @ViewChild('accountUniqueNameSearch') public accountUniqueNameSearch: ElementRef;
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
    private isUniversalDateApplicable: boolean = false;
    private isBulkInvoiceGeneratedWithoutErr$: Observable<boolean>;
    public isMobileView = false;

    constructor(
        private modalService: BsModalService,
        private store: Store<AppState>,
        private invoiceActions: InvoiceActions,
        private _accountService: AccountService,
        private _activatedRoute: ActivatedRoute,
        private invoiceReceiptActions: InvoiceReceiptActions,
        private _cdRef: ChangeDetectorRef,
        private _generalService: GeneralService,
        private _breakPointObservar: BreakpointObserver
    ) {
        // set initial values
        this.ledgerSearchRequest.page = 1;
        this.ledgerSearchRequest.count = 20;
        this.flattenAccountListStream$ = this.store.select(p => p.general.flattenAccounts).pipe(takeUntil(this.destroyed$));
        this.isBulkInvoiceGenerated$ = this.store.select(p => p.invoice.isBulkInvoiceGenerated).pipe(takeUntil(this.destroyed$));
        this.isBulkInvoiceGeneratedWithoutErr$ = this.store.select(p => p.invoice.isBulkInvoiceGeneratedWithoutErrors).pipe(takeUntil(this.destroyed$));
        this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
        this._breakPointObservar.observe([
            '(max-width: 1023px)'
        ]).subscribe(result => {
            this.isMobileView = result.matches;
        });
    }

    public ngOnInit() {
        // this._activatedRoute.params.subscribe(a => {
        //   this.setVoucherType(a.voucherType);
        // });

        // Get accounts
        this.flattenAccountListStream$.subscribe((data: IFlattenAccountsResultItem[]) => {
            let accounts: IOption[] = [];
            _.forEach(data, (item) => {
                // o.uniqueName === 'sundrydebtors' || o.uniqueName === 'bankaccounts' || o.uniqueName === 'cash' ||  o.uniqueName === 'revenuefromoperations' || o.uniqueName === 'otherincome'
                if (_.find(item.parentGroups, (o) => _.indexOf(PARENT_GROUP_ARR, o.uniqueName) !== -1)) {
                    accounts.push({label: item.name, value: item.uniqueName});
                }
            });
            this.accounts$ = observableOf(orderBy(accounts, 'label'));
        });

        this.store.select(p => p.invoice.ledgers).pipe(
            takeUntil(this.destroyed$))
            .subscribe((o: GetAllLedgersForInvoiceResponse) => {
                if (o && o.results) {
                    let a = _.cloneDeep(o);
                    a.results = _.orderBy(a.results, (item: ILedgersInvoiceResult) => {
                        return moment(item.entryDate, 'DD-MM-YYYY');
                    }, 'desc');
                    this.ledgersData = a;
                    this.isGetAllRequestInProcess$ = of(false);
                    setTimeout(() => {
                        this.detectChanges();
                    }, 400)
                }
            });

        this.store.select(p => p.receipt.voucher).pipe(
            takeUntil(this.destroyed$),
            distinctUntilChanged((p: any, q: any) => {
                if (p && q) {
                    return (p.templateUniqueName === q.templateUniqueName);
                }
                if ((p && !q) || (!p && q)) {
                    return false;
                }
                return true;
            })).subscribe((o: any) => {
            if (o) {
                this.getInvoiceTemplateDetails(o.templateDetails.templateUniqueName);
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

        // Refresh report data according to universal date
        this.store.select(createSelector([(state: AppState) => state.session.applicationDate], (dateObj: Date[]) => {
            if (dateObj) {
                this.universalDate = _.cloneDeep(dateObj);
                this.ledgerSearchRequest.dateRange = this.universalDate;
                this.datePickerOptions = { ...this.datePickerOptions, startDate: moment(this.universalDate[0], 'DD-MM-YYYY').toDate(), endDate: moment(this.universalDate[1], 'DD-MM-YYYY').toDate() };

                // assign date
                // this.assignStartAndEndDateForDateRangePicker(dateObj[0], dateObj[1]);

                this.isUniversalDateApplicable = true;
                this.getLedgersOfInvoice();
                this.detectChanges();
            }
        })).subscribe();

        // set financial years based on company financial year
        this.store.pipe(select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
            if (!companies) {
                return;
            }

            return companies.find(cmp => {
                if (cmp && cmp.uniqueName) {
                    return cmp.uniqueName === uniqueName;
                } else {
                    return false;
                }
            });
        })), takeUntil(this.destroyed$)).subscribe(selectedCmp => {
            if (selectedCmp) {
                let activeFinancialYear = selectedCmp.activeFinancialYear;
                if (activeFinancialYear) {
                    this.datePickerOptions.ranges['This Financial Year to Date'] = [
                        moment(activeFinancialYear.financialYearStarts, 'DD-MM-YYYY').startOf('day'),
                        moment()
                    ];
                    this.datePickerOptions.ranges['Last Financial Year'] = [
                        moment(activeFinancialYear.financialYearStarts, 'DD-MM-YYYY').subtract(1, 'year'),
                        moment(activeFinancialYear.financialYearEnds, 'DD-MM-YYYY').subtract(1, 'year')
                    ];
                }
            }
        });

        this.universalDate$.subscribe(a => {
            if (a) {
                this.datePickerOptions = { ...this.datePickerOptions, startDate: a[0], endDate: a[1] };

                // assign date
                // this.assignStartAndEndDateForDateRangePicker(a[0], a[1]);

                this.ledgerSearchRequest.from = moment(a[0]).format('DD-MM-YYYY');
                this.ledgerSearchRequest.to = moment(a[1]).format('DD-MM-YYYY');
            }
        });

        // this.particularInput.valueChanges.pipe(
        //   debounceTime(700),
        //   distinctUntilChanged()
        // ).subscribe(s => {
        //   this.ledgerSearchRequest.voucherNumber = s;
        //   this.getLedgersOfInvoice();
        //   if (s === '') {
        //     this.showParticularSearch = false;
        //   }
        // });

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
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedVoucher'] && changes['selectedVoucher'].currentValue !== changes['selectedVoucher'].previousValue) {
            this.setVoucherType(changes['selectedVoucher'].currentValue);
        }
    }

    public closeInvoiceModel(e) {
        if (e.action === 'generate') {
            this.selectedLedgerItems = [];
        }
        this.invoiceGenerateModel.hide();
        setTimeout(() => {
            this.store.dispatch(this.invoiceActions.ResetInvoiceData());
        }, 2000);
    }

    public getLedgersByFilters(f: NgForm) {
        if (f.valid) {
            this.isUniversalDateApplicable = false;
            this.selectedLedgerItems = [];
            this.getLedgersOfInvoice();
        }
    }

    public pageChanged(event: any): void {
        this.ledgerSearchRequest.page = event.page;
        this.selectedLedgerItems = [];
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
                return item;
            });
            this.insertItemsIntoArr();
        }
    }

    public toggleItem(item: any, action: boolean) {
        item.isSelected = action;
        if (action) {
            this.countAndToggleVar();
        } else {
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
        this.store.dispatch(this.invoiceActions.ModifiedInvoiceStateData(model.uniqueNames));
        this.store.dispatch(this.invoiceActions.PreviewInvoice(res.account.uniqueName, model));

        // let request: ReceiptVoucherDetailsRequest = new ReceiptVoucherDetailsRequest();
        // request.invoiceNumber = res.voucherNumber.join();
        // request.voucherType = this.selectedVoucher;

        // this.store.dispatch(this.invoiceReceiptActions.GetVoucherDetails(res.account.uniqueName, request));
        this.showInvoiceModal();
    }

    public generateBulkInvoice(action: boolean) {
        if (this.selectedLedgerItems.length <= 0) {
            return false;
        }
        let arr: GenBulkInvoiceGroupByObj[] = [];
        _.forEach(this.ledgersData.results, (item: ILedgersInvoiceResult): void => {
            if (item.isSelected) {
                arr.push({accUniqueName: item.account.uniqueName, uniqueName: item.uniqueName});
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
        this.store.dispatch(this.invoiceActions.GenerateBulkInvoice({combined: action}, model));
        this.selectedLedgerItems = [];
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

    public showInvoiceModal() {
        this.invoiceGenerateModel.show();
    }

    public getLedgersOfInvoice() {
        this.store.dispatch(this.invoiceActions.GetAllLedgersForInvoice(this.prepareQueryParamsForLedgerApi(), this.prepareModelForLedgerApi()));
        if (this.ledgersData && this.ledgersData.results && this.ledgersData.results.length === 0) {
            this.ledgerSearchRequest.page = (this.ledgerSearchRequest.page > 1) ? this.ledgerSearchRequest.page - 1 : this.ledgerSearchRequest.page;
            this.store.dispatch(this.invoiceActions.GetAllLedgersForInvoice(this.prepareQueryParamsForLedgerApi(), this.prepareModelForLedgerApi()));
        }
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
        // this.dp.destroyPicker();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}

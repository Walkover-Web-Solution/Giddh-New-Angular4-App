import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { IOption } from '../../theme/ng-select/option.interface';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import * as _ from '../../lodash-optimized';
import { orderBy } from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { GetAllInvoicesPaginatedResponse, IInvoiceResult, InvoiceFilterClassForInvoicePreview } from '../../models/api-models/Invoice';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import { AccountService } from '../../services/account.service';
import { InvoiceService } from '../../services/invoice.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { ModalDirective } from 'ngx-bootstrap';
import { createSelector } from 'reselect';
import { IFlattenAccountsResultItem } from 'apps/web-giddh/src/app/models/interfaces/flattenAccountsResultItem.interface';
import { InvoiceTemplatesService } from 'apps/web-giddh/src/app/services/invoice.templates.service';
import { InvoiceReceiptActions } from '../../actions/invoice/receipt/receipt.actions';
import { InvoiceReceiptFilter, ReceiptItem, ReceiptVoucherDetailsRequest, ReciptDeleteRequest, ReciptResponse } from '../../models/api-models/recipt';
import { ReceiptService } from '../../services/receipt.service';
import { ToasterService } from '../../services/toaster.service';
import { saveAs } from 'file-saver';
import { Event, NavigationStart, Router } from '@angular/router';
import { InvoiceAdvanceSearchComponent } from '../preview/models/advanceSearch/invoiceAdvanceSearch.component';

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
    templateUrl: './receipt.component.html',
    styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit, OnDestroy {

    @ViewChild('invoiceReceiptConfirmationModel') public invoiceReceiptConfirmationModel: ModalDirective;
    @ViewChild('invoiceReceiptVoucherDetailsModel') public invoiceReceiptVoucherDetailsModel: ModalDirective;
    @ViewChild('invoiceReceiptVoucherUpdateModel') public invoiceReceiptVoucherUpdateModel: ModalDirective;
    @ViewChild('advanceSearch') public advanceSearch: ModalDirective;
    @ViewChild('voucherSearch') public voucherSearch: ElementRef;
    @ViewChild('accountSearch') public accountSearch: ElementRef;
    @ViewChild('advanceSearchComponent', { read: InvoiceAdvanceSearchComponent }) public advanceSearchComponent: InvoiceAdvanceSearchComponent;

    public bsConfig: Partial<BsDatepickerConfig> = {
        showWeekNumbers: false,
        dateInputFormat: 'DD-MM-YYYY',
        rangeInputFormat: 'DD-MM-YYYY',
        containerClass: 'theme-green myDpClass'
    };
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
    public type: string;
    public downloadVoucherRequestObject: any;
    public modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: 'static',
        ignoreBackdropClick: true
    };

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
    public showVoucherSearch: boolean = false;
    public showAccountSearch: boolean = false;
    public modalUniqueName: string;
    public allItemsSelected: boolean = false;
    public voucherNumberInput: FormControl = new FormControl();
    public accountUniqueNameInput: FormControl = new FormControl();
    public selectedItems: string[] = [];
    public showAdvanceSearchIcon: boolean = false;
    public advanceSearchFilter: InvoiceFilterClassForInvoicePreview = new InvoiceFilterClassForInvoicePreview();
    public hoveredItemForAction: string = '';
    public clickedHoveredItemForAction: string = '';

    private universalDate: Date[];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private isUniversalDateApplicable: boolean = false;
    private flattenAccountListStream$: Observable<IFlattenAccountsResultItem[]>;
    private routeEvent: Observable<Event>;

    constructor(
        private modalService: BsModalService,
        private store: Store<AppState>,
        private invoiceActions: InvoiceActions,
        private _accountService: AccountService,
        private _invoiceService: InvoiceService,
        private _invoiceTemplatesService: InvoiceTemplatesService,
        private invoiceReceiptActions: InvoiceReceiptActions,
        private _receiptService: ReceiptService,
        private _toasty: ToasterService,
        private router: Router,
    ) {
        this.routeEvent = this.router.events.pipe(takeUntil(this.destroyed$));
        this.receiptSearchRequest.page = 1;
        this.receiptSearchRequest.count = 25;
        this.receiptSearchRequest.entryTotalBy = '';
        this.flattenAccountListStream$ = this.store.select(p => p.general.flattenAccounts).pipe(takeUntil(this.destroyed$));
        this.isGetAllRequestInProcess$ = this.store.select(p => p.receipt.isGetAllRequestInProcess).pipe(takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        // Get accountsthis
        this.routeEvent.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (event instanceof NavigationStart) {
                this.store.select(p => p.receipt.vouchers).pipe(take(1)).subscribe((o: ReciptResponse) => {
                    this.getInvoiceReceipts();
                });
            }
        });

        this.getInvoiceReceipts();

        this.flattenAccountListStream$.subscribe((data: IFlattenAccountsResultItem[]) => {
            let accounts: IOption[] = [];
            _.forEach(data, (item) => {
                if (_.find(item.parentGroups, (o) => _.indexOf(PARENT_GROUP_ARR, o.uniqueName) !== -1)) {
                    accounts.push({ label: item.name, value: item.uniqueName });
                }
            });
            this.accounts$ = observableOf(orderBy(accounts, 'label'));
        });

        this.store.select(p => p.receipt.vouchers).pipe(takeUntil(this.destroyed$)).subscribe((o: ReciptResponse) => {
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
        this.voucherNumberInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.receiptSearchRequest.voucherNumber = s;
            this.getInvoiceReceipts();
            if (s === '') {
                this.showVoucherSearch = false;
            }
        });

        this.accountUniqueNameInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.receiptSearchRequest.q = s;
            this.getInvoiceReceipts();
            if (s === '') {
                this.showAccountSearch = false;
            }
        });

    }

    public pageChanged(event: any): void {
        this.receiptSearchRequest.page = event.page;
        this.isUniversalDateApplicable = false;
        this.getInvoiceReceipts();
    }

    public getInvoiceReceiptByFilters(f: NgForm) {
        // if (f.valid) {
        this.isUniversalDateApplicable = false;
        this.getInvoiceReceipts();
        // }
    }

    public onEditBtnClick() {
        let request: ReceiptVoucherDetailsRequest = new ReceiptVoucherDetailsRequest();
        request.invoiceNumber = this.downloadVoucherRequestObject.voucherNumber.join();
        request.voucherType = this.type;
        this.store.dispatch(this.invoiceReceiptActions.GetVoucherDetails(this.selectedReceipt.account.uniqueName, request));
        this.showUpdateModal();
    }

    public onDeleteBtnClick() {
        let allReceipts: ReceiptItem[] = _.cloneDeep(this.receiptData.items);
        this.selectedReceipt = allReceipts.find((o) => o.uniqueName === this.selectedItems[0]);
        this.invoiceReceiptConfirmationModel.show();
    }

    public deleteConfirmedInvoice() {
        this.invoiceReceiptConfirmationModel.hide();
        let request: ReciptDeleteRequest = {
            invoiceNumber: this.selectedReceipt.voucherNumber,
            voucherType: this.type
        };
        this.store.dispatch(this.invoiceReceiptActions.DeleteInvoiceReceiptRequest(
            request, this.selectedReceipt.account.uniqueName
        ));
    }

    public closeConfirmationPopup() {
        this.invoiceReceiptConfirmationModel.hide();
    }

    public getInvoiceReceipts() {
        this.type = 'receipt';
        this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(
            this.prepareModelForInvoiceReceiptApi(), this.type
        ));
    }

    public prepareModelForInvoiceReceiptApi(): InvoiceReceiptFilter {
        let model: any = {};
        let o = _.cloneDeep(this.receiptSearchRequest);

        if (o.voucherNumber) {
            model.voucherNumber = o.voucherNumber;
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
        // else {
        //   fromDate = moment().subtract(30, 'days').format(GIDDH_DATE_FORMAT);
        //   toDate = moment().format(GIDDH_DATE_FORMAT);
        // }

        model.from = o.from;
        model.to = o.to;
        model.count = o.count;
        model.page = o.page;
        return model;
    }

    public bsValueChange(event: any) {
        if (event) {
            this.receiptSearchRequest.from = moment(event.picker.startDate._d).format(GIDDH_DATE_FORMAT);
            this.receiptSearchRequest.to = moment(event.picker.endDate._d).format(GIDDH_DATE_FORMAT);
            this.getInvoiceReceipts();
        }
    }

    public downloadVoucherRequest(uniqueName: string, isDownloadMode: boolean) {
        let allReceipts: ReceiptItem[] = _.cloneDeep(this.receiptData.items);
        this.selectedReceipt = allReceipts.find((o) => o.uniqueName === uniqueName);
        this.downloadVoucherRequestObject = {
            voucherNumber: [this.selectedReceipt.voucherNumber],
            voucherType: this.type,
            accountUniqueName: this.selectedReceipt.account.uniqueName
        };
        if (!isDownloadMode) {
            this.showPreviewDownloadModal();
            return;
        }

        this._receiptService.DownloadVoucher(this.downloadVoucherRequestObject, this.selectedReceipt.account.uniqueName)
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

    public showPreviewDownloadModal() {
        this.invoiceReceiptVoucherDetailsModel.show();
    }

    public hidePreviewDownloadModal() {
        this.invoiceReceiptVoucherDetailsModel.hide();
    }

    public showUpdateModal() {
        this.invoiceReceiptVoucherUpdateModel.show();
    }

    public hideUpdateModal() {
        this.invoiceReceiptVoucherUpdateModel.hide();
    }

    public toggleAdvanceSearchPopup() {
        this.advanceSearch.toggle();
    }

    public toggleAllItems(type: boolean) {
        this.allItemsSelected = type;
        if (this.receiptData && this.receiptData.items && this.receiptData.items.length) {
            this.receiptData.items = _.map(this.receiptData.items, (item: ReceiptItem) => {
                item.isSelected = this.allItemsSelected;
                this.itemStateChanged(item.uniqueName);
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
        this.itemStateChanged(item.uniqueName);
    }

    public itemStateChanged(uniqueName: string) {
        let index = this.selectedItems.findIndex(f => f === uniqueName);

        if (index > -1) {
            this.selectedItems = this.selectedItems.filter(f => f !== uniqueName);
        } else {
            this.selectedItems.push(uniqueName);
        }
    }

    public clickedOutside(event, el, fieldName: string) {
        if (fieldName === 'voucherNumber') {
            if (this.voucherNumberInput.value !== null && this.voucherNumberInput.value !== '') {
                return;
            }
        } else if (fieldName === 'accountUniqueName') {
            if (this.accountUniqueNameInput.value !== null && this.accountUniqueNameInput.value !== '') {
                return;
            }
        }
        // if (this.receiptSearchRequest[fieldName] !== '') {
        //   return;
        // }

        if (this.childOf(event.target, el)) {
            return;
        } else {
            if (fieldName === 'voucherNumber') {
                this.showVoucherSearch = false;
            } else {
                this.showAccountSearch = false;
            }
        }
    }

    public toggleSearch(fieldName: string) {
        if (fieldName === 'voucherNumber') {
            this.showVoucherSearch = true;
            this.showAccountSearch = false;

            setTimeout(() => {
                this.voucherSearch.nativeElement.focus();
            }, 200);
        } else {
            this.showAccountSearch = true;
            this.showVoucherSearch = false;

            setTimeout(() => {
                this.accountSearch.nativeElement.focus();
            }, 200);
        }
    }

    public applyAdvanceSearch(request: InvoiceFilterClassForInvoicePreview) {
        this.showAdvanceSearchIcon = true;
        this.datePickerOptions.startDate = moment().subtract(30, 'days');
        this.datePickerOptions.endDate = moment();

        this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(
            request, 'receipt'
        ));
    }

    public resetAdvanceSearch() {
        this.showAdvanceSearchIcon = false;
        if (this.advanceSearchComponent && this.advanceSearchComponent.allShSelect) {
            this.advanceSearchComponent.allShSelect.forEach(f => {
                f.clear();
            });
        }
        this.advanceSearchFilter = new InvoiceFilterClassForInvoicePreview();
        this.getInvoiceReceipts();
    }

    /* tslint:disable */
    public childOf(c, p) {
        while ((c = c.parentNode) && c !== p) {
        }
        return !!c;
    }

    public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {
        if (this.showAdvanceSearchIcon) {
            this.advanceSearchFilter.sort = type;
            this.advanceSearchFilter.sortBy = columnName;
            this.store.dispatch(this.invoiceReceiptActions.GetAllInvoiceReceiptRequest(this.advanceSearchFilter, 'receipt'));
        } else {
            if (this.receiptSearchRequest.sort !== type || this.receiptSearchRequest.sortBy !== columnName) {
                this.receiptSearchRequest.sort = type;
                this.receiptSearchRequest.sortBy = columnName;
                this.getInvoiceReceipts();
            }
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}

import {
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild,
    TemplateRef
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
    ProformaFilter,
    ProformaGetRequest,
    ProformaItem,
    ProformaResponse,
    ProformaUpdateActionRequest
} from '../../models/api-models/proforma';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { ProformaActions } from '../../actions/proforma/proforma.actions';
import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import * as moment from 'moment/moment';
import { cloneDeep, uniqBy } from '../../lodash-optimized';
import { ModalDirective, BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap';
import { InvoiceFilterClassForInvoicePreview, InvoicePreviewDetailsVm } from '../../models/api-models/Invoice';
import { InvoiceAdvanceSearchComponent } from '../preview/models/advanceSearch/invoiceAdvanceSearch.component';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { InvoiceSetting } from '../../models/interfaces/invoice.setting.interface';
import { VoucherTypeEnum } from '../../models/api-models/Sales';
import { ActivatedRoute, Router } from '@angular/router';
import { createSelector } from "reselect";
import { BreakpointObserver } from '@angular/cdk/layout';
import { GeneralService } from '../../services/general.service';

const VOUCHER_TYPES = ['proformas', 'estimates'];

@Component({
    selector: 'app-proforma-list-component',
    templateUrl: './proforma-list.component.html',
    styleUrls: [`./proforma-list.component.scss`]
})

export class ProformaListComponent implements OnInit, OnDestroy, OnChanges {
    @ViewChild('advanceSearch') public advanceSearch: ModalDirective;
    /** Confirmation popup for delete operation */
    @ViewChild('deleteConfirmationModel') public deleteConfirmationModel: ModalDirective;
    @ViewChild(InvoiceAdvanceSearchComponent) public advanceSearchComponent: InvoiceAdvanceSearchComponent;
    @Input() public voucherType: VoucherTypeEnum = VoucherTypeEnum.proforma;
    public voucherData: ProformaResponse;
    public selectedDateRange: any;
    public modalRef: BsModalRef;
    public showAdvanceSearchModal: boolean = false;
    public showResetAdvanceSearchIcon: boolean = false;
    public selectedItems: string[] = [];
    public selectedCustomerUniqueName: string;
    public selectedVoucher: InvoicePreviewDetailsVm;
    public itemsListForDetails: InvoicePreviewDetailsVm[] = [];
    public invoiceSetting: InvoiceSetting;
    public appSideMenubarIsOpen: boolean;

    public modalConfig: ModalOptions = {
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
    public proformaSelectedDate: any = {
        fromDates: '',
        toDates: '',
        dataToSend: {}
    };
    public estimateSelectedDate: any = {
        fromDates: '',
        toDates: '',
        dataToSend: {}
    };
    public localStorageSelectedDate: string = '';
    private isUniversalDateApplicable: boolean = false;

    public showVoucherNoSearch: boolean = false;
    public voucherNumberInput: FormControl = new FormControl();

    public showCustomerSearch: boolean = false;
    public customerNameInput: FormControl = new FormControl();

    public sortRequestForUi: { sortBy: string, sort: string } = { sortBy: '', sort: '' };
    public advanceSearchFilter: ProformaFilter = new ProformaFilter();
    public allItemsSelected: boolean = false;
    public hoveredItemUniqueName: string;
    public clickedItemUniqueName: string;

    public isGetAllInProcess$: Observable<boolean>;
    public isDeleteVoucherSuccess$: Observable<boolean>;
    public voucherNoForDetail: string;
    public voucherDetailAction: string = '';
    public universalDate$: Observable<any>;

    private isUpdateVoucherActionSuccess$: Observable<boolean>;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public isMobileView = false;
    /* This will hold the base currency symbol of the company */
    public baseCurrencySymbol: string = '';
    /* This will hold the base currency of the company */
    public baseCurrency: string = '';

    constructor(private store: Store<AppState>, private proformaActions: ProformaActions, private activatedRouter: ActivatedRoute,
        private router: Router, private _cdr: ChangeDetectorRef, private _breakPointObservar: BreakpointObserver, private _generalService: GeneralService, private modalService: BsModalService) {
        this.advanceSearchFilter.page = 1;
        this.advanceSearchFilter.count = 20;
        this.advanceSearchFilter.from = moment(this.datePickerOptions.startDate).format('DD-MM-YYYY');
        this.advanceSearchFilter.to = moment(this.datePickerOptions.endDate).format('DD-MM-YYYY');

        this.isGetAllInProcess$ = this.store.pipe(select(s => s.proforma.getAllInProcess), takeUntil(this.destroyed$));
        this.isDeleteVoucherSuccess$ = this.store.pipe(select(s => s.proforma.isDeleteProformaSuccess), takeUntil(this.destroyed$));
        this.isUpdateVoucherActionSuccess$ = this.store.pipe(select(s => s.proforma.isUpdateProformaActionSuccess), takeUntil(this.destroyed$));
        this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));

        this._breakPointObservar.observe([
            '(max-width: 1023px)'
        ]).subscribe(result => {
            this.isMobileView = result.matches;
        });
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    ngOnInit() {
        this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$)).subscribe(profile => {
            if (profile) {
                this.baseCurrencySymbol = profile.baseCurrencySymbol;
                this.baseCurrency = profile.baseCurrency;
            }
        });

        combineLatest([
            this.store.pipe(select(s => s.proforma.vouchers)),
            this.store.pipe(select(s => s.proforma.voucherNoForDetails)),
            this.store.pipe(select(s => s.proforma.voucherNoForDetailsAction))
        ])
            .pipe(takeUntil(this.destroyed$))
            .subscribe(res => {
                if (res[0]) {
                    this.itemsListForDetails = [];
                    res[0].results = res[0].items.map(item => {
                        item.isSelected = false;
                        item.uniqueName = item.proformaNumber || item.estimateNumber;
                        item.invoiceDate = item.proformaDate || item.estimateDate;

                        let dueDate = item.expiryDate ? moment(item.expiryDate, 'DD-MM-YYYY') : null;

                        if (dueDate) {
                            if (dueDate.isAfter(moment()) || ['paid', 'cancel'].includes(item.action)) {
                                item.expiredDays = null;
                            } else {
                                let dueDays = dueDate ? moment().diff(dueDate, 'days') : null;
                                item.isSelected = false;
                                item.expiredDays = dueDays;
                            }
                        } else {
                            item.expiredDays = null;
                        }

                        if (VOUCHER_TYPES.indexOf(this.voucherType) > -1) {
                            item = this.addToolTiptext(item);
                        }

                        this.itemsListForDetails.push(this.parseItemForVm(item));

                        return item;
                    });
                }

                // get voucherDetailsNo so we can open that voucher in details mode
                if (res[0] && res[1] && res[2]) {
                    this.selectedVoucher = null;
                    let voucherIndex = (res[0] as ProformaResponse).results.findIndex(f => {
                        if (f.estimateNumber) {
                            return f.estimateNumber === this.voucherNoForDetail;
                        } else {
                            return f.proformaNumber === this.voucherNoForDetail;
                        }
                    });
                    if (voucherIndex > -1) {
                        let allItems: InvoicePreviewDetailsVm[] = cloneDeep(this.itemsListForDetails);
                        allItems = uniqBy([allItems[voucherIndex], ...allItems], 'voucherNumber');
                        this.itemsListForDetails = allItems;
                        this.toggleBodyClass();
                        setTimeout(() => {
                            this.selectedVoucher = allItems[0];
                            this.store.dispatch(this.proformaActions.setVoucherForDetails(null, null));
                        }, 1000);
                    }
                }

                setTimeout(() => {
                    this.voucherData = cloneDeep(res[0]);
                    this._cdr.detectChanges();
                }, 100);
                this.voucherNoForDetail = res[1];
                this.voucherDetailAction = res[2];
            });

        this.store
            .pipe(select(s => s.proforma.isGenerateSalesOrderFromEstimateSuccess), takeUntil(this.destroyed$))
            .subscribe(res => {
                if (res) {
                    this.getAll();
                }
            });

        this.store
            .pipe(select(s => s.proforma.isGenerateInvoiceFromProformaOrEstimatesSuccess), takeUntil(this.destroyed$))
            .subscribe(res => {
                if (res) {
                    this.getAll();
                }
            });

        this.voucherNumberInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            if (this.voucherType === 'proformas') {
                this.advanceSearchFilter.proformaNumber = s;
            } else {
                this.advanceSearchFilter.estimateNumber = s;
            }
            this.getAll();
            // if (s === '') {
            //   this.showVoucherNoSearch = false;
            // }
        });

        this.customerNameInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.advanceSearchFilter.q = s;
            this.getAll();
            // if (s === '') {
            //   this.showCustomerSearch = false;
            // }
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
                        if (window.localStorage && localStorage.getItem(this.localStorageSelectedDate)) {
                            let storedSelectedDate = JSON.parse(localStorage.getItem(this.localStorageSelectedDate));
                            this.showResetAdvanceSearchIcon = true;
                            this.datePickerOptions = {
                                ...this.datePickerOptions,
                                startDate: moment(storedSelectedDate.fromDates, 'DD-MM-YYYY').toDate(),
                                endDate: moment(storedSelectedDate.toDates, 'DD-MM-YYYY').toDate(),
                                chosenLabel: undefined  // Let the library handle the highlighted filter label for range picker
                            };

                            // assign start and end date
                            // this.assignStartAndEndDateForDateRangePicker(storedSelectedDate.fromDates, storedSelectedDate.toDates);
                            this.advanceSearchFilter.from = storedSelectedDate.fromDates;
                            this.advanceSearchFilter.to = storedSelectedDate.toDates;
                            this.isUniversalDateApplicable = false;

                        } else {
                            this.datePickerOptions = {
                                ...this.datePickerOptions, startDate: moment(a[0], 'DD-MM-YYYY').toDate(),
                                endDate: moment(a[1], 'DD-MM-YYYY').toDate(),
                                chosenLabel: a[2]
                            };

                            // assign start and end date
                            // this.assignStartAndEndDateForDateRangePicker(a[0], a[1]);

                            this.advanceSearchFilter.from = moment(a[0]).format(GIDDH_DATE_FORMAT);
                            this.advanceSearchFilter.to = moment(a[1]).format(GIDDH_DATE_FORMAT);
                            this.isUniversalDateApplicable = true;
                        }
                    } else {
                        this.datePickerOptions = {
                            ...this.datePickerOptions, startDate: moment(a[0], 'DD-MM-YYYY').toDate(),
                            endDate: moment(a[1], 'DD-MM-YYYY').toDate(),
                            chosenLabel: a[2]
                        };

                        // assign start and end date
                        // this.assignStartAndEndDateForDateRangePicker(a[0], a[1]);

                        this.advanceSearchFilter.from = moment(a[0]).format(GIDDH_DATE_FORMAT);
                        this.advanceSearchFilter.to = moment(a[1]).format(GIDDH_DATE_FORMAT);
                        this.isUniversalDateApplicable = true;
                    }
                } else {
                    this.datePickerOptions = {
                        ...this.datePickerOptions, startDate: moment(a[0], 'DD-MM-YYYY').toDate(),
                        endDate: moment(a[1], 'DD-MM-YYYY').toDate(),
                        chosenLabel: a[2]
                    };

                    // assign start and end date
                    // this.assignStartAndEndDateForDateRangePicker(a[0], a[1]);

                    this.advanceSearchFilter.from = moment(a[0]).format(GIDDH_DATE_FORMAT);
                    this.advanceSearchFilter.to = moment(a[1]).format(GIDDH_DATE_FORMAT);
                    this.isUniversalDateApplicable = true;
                }
                this.getAll();
            }
        })).pipe(takeUntil(this.destroyed$)).subscribe();

        this.store.pipe(select(s => s.general.sideMenuBarOpen), takeUntil(this.destroyed$))
            .subscribe(result => this.appSideMenubarIsOpen = result);

        this.isDeleteVoucherSuccess$.subscribe(res => {
            if (res && this.selectedVoucher) {
                this.selectedVoucher = null;
                this.toggleBodyClass();
                this.getAll();
            }

            if (res && this.selectedItems.length) {
                this.selectedItems = [];
                this.getAll();
            }
        });

        this.isUpdateVoucherActionSuccess$.subscribe(res => {
            if (res) {
                // get all data again because we are updating action in list page so we have to update data i.e we have to fire this
                this.getAll();
            }
        });

        this.store.select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
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
                if (selectedCmp.activeFinancialYear) {
                    this.datePickerOptions.ranges['This Financial Year to Date'] = [
                        moment(selectedCmp.activeFinancialYear.financialYearStarts, 'DD-MM-YYYY').startOf('day'),
                        moment()
                    ];
                    this.datePickerOptions.ranges['Last Financial Year'] = [
                        moment(selectedCmp.activeFinancialYear.financialYearStarts, 'DD-MM-YYYY').subtract(1, 'year'),
                        moment(selectedCmp.activeFinancialYear.financialYearEnds, 'DD-MM-YYYY').subtract(1, 'year')
                    ];
                }
            }
            return selectedCmp;
        })).pipe(takeUntil(this.destroyed$)).subscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('voucherType' in changes && changes.voucherType.currentValue && (changes.voucherType.currentValue !== changes.voucherType.previousValue)) {
            if (this.voucherType === 'proformas') {
                this.localStorageSelectedDate = 'proformaSelectedDate';
            } else {
                this.localStorageSelectedDate = 'estimateSelectedDate';
            }
            // this.getAll();
            this.selectedVoucher = null;
        }
    }

    public getAll() {
        this.store.dispatch(this.proformaActions.getAll(this.advanceSearchFilter, this.voucherType));
    }

    public clickedOutside(event, el, fieldName: string) {
        if (fieldName === 'voucherNumber') {
            if (this.voucherNumberInput.value !== null && this.voucherNumberInput.value !== '') {
                return;
            }
        } else if (fieldName === 'customerName') {
            if (this.customerNameInput.value !== null && this.customerNameInput.value !== '') {
                return;
            }
        }

        if (this.childOf(event.target, el)) {
            return;
        } else {
            if (fieldName === 'voucherNumber') {
                this.showVoucherNoSearch = false;
            } else if (fieldName === 'customerName') {
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

    public toggleSearch(fieldName: string, el: any) {
        if (fieldName === 'voucherNumber') {
            this.showVoucherNoSearch = true;
            this.showCustomerSearch = false;
        } else if (fieldName === 'customerName') {
            this.showVoucherNoSearch = false;
            this.showCustomerSearch = true;
        }

        setTimeout(() => {
            el.focus();
        }, 200);
    }

    public toggleAllItems(type: boolean) {
        this.allItemsSelected = type;
        if (this.voucherData && this.voucherData.results && this.voucherData.results.length) {
            this.voucherData.results = this.voucherData.results.map((item: ProformaItem) => {
                item.isSelected = this.allItemsSelected;
                this.itemStateChanged(item, true);
                return item;
            });
        }
    }

    public toggleItem(item: any, action: boolean) {
        item.isSelected = action;
        if (!action) {
            this.allItemsSelected = false;
        }
        this.itemStateChanged(item);
    }

    public toggleAdvanceSearchPopup() {
        this.showAdvanceSearchModal = !this.showAdvanceSearchModal;
        this.advanceSearch.toggle();
    }

    public itemStateChanged(item: ProformaItem, allSelected: boolean = false) {
        let index = this.selectedItems.findIndex(f => f === item.uniqueName);

        if (index > -1 && !allSelected) {
            this.selectedItems = this.selectedItems.filter(f => f !== item.uniqueName);
        } else {
            this.selectedItems.push(item.uniqueName);
        }
    }

    public toggleBodyClass() {
        if (this.selectedVoucher) {
            document.querySelector('body').classList.add('fixed');
        } else {
            this.getAll();
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public onSelectInvoice(invoice: ProformaItem) {
        let allItems: InvoicePreviewDetailsVm[] = cloneDeep(this.itemsListForDetails);
        let newIndex = allItems.findIndex(f => f.voucherNumber === (this.voucherType === 'proformas' ? invoice.proformaNumber : invoice.estimateNumber));
        let removedItem = allItems.splice(newIndex, 1);
        allItems = [...removedItem, ...allItems];
        this.itemsListForDetails = allItems;
        this.selectedVoucher = this.parseItemForVm(invoice);

        this.toggleBodyClass();
    }

    public dateRangeChanged(event: any) {
        this.showResetAdvanceSearchIcon = true;
        if (event) {
            this.advanceSearchFilter.from = moment(event.picker.startDate).format(GIDDH_DATE_FORMAT);
            this.advanceSearchFilter.to = moment(event.picker.endDate).format(GIDDH_DATE_FORMAT);
            if (window.localStorage) {
                if (this.voucherType === 'proformas') {
                    this.proformaSelectedDate.fromDates = this.advanceSearchFilter.from;
                    this.proformaSelectedDate.toDates = this.advanceSearchFilter.to;
                    localStorage.setItem('proformaSelectedDate', JSON.stringify(this.proformaSelectedDate));
                } else {
                    this.estimateSelectedDate.fromDates = this.advanceSearchFilter.from;
                    this.estimateSelectedDate.toDates = this.advanceSearchFilter.to;
                    localStorage.setItem('estimateSelectedDate', JSON.stringify(this.estimateSelectedDate));
                }
            }
            this.getAll();
        }
    }

    public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {

        if (this.advanceSearchFilter.sort !== type || this.advanceSearchFilter.sortBy !== columnName) {
            this.advanceSearchFilter.sort = type;
            this.advanceSearchFilter.sortBy = columnName;
            this.getAll();
        }
        // this.sortRequestForUi.sort = type;
        // this.sortRequestForUi.sortBy = columnName;
    }

    public applyAdvanceSearch(request: InvoiceFilterClassForInvoicePreview) {
        this.showResetAdvanceSearchIcon = true;
        // if (!request.invoiceDate && !request.dueDate) {
        //   request.from = this.advanceSearchFilter.from;
        //   request.to = this.advanceSearchFilter.to;
        // }
        this.getAll();
    }

    public resetAdvanceSearch() {
        this.showResetAdvanceSearchIcon = false;
        if (this.advanceSearchComponent && this.advanceSearchComponent.allShSelect) {
            this.advanceSearchComponent.allShSelect.forEach(f => {
                f.clear();
            });
        }
        if (window.localStorage) {
            localStorage.removeItem(this.localStorageSelectedDate);
        }

        let universalDate;
        // get application date
        this.universalDate$.pipe(take(1)).subscribe(date => {
            universalDate = date;
        });

        this.advanceSearchFilter = new ProformaFilter();
        this.advanceSearchFilter.page = 1;
        this.advanceSearchFilter.count = 20;

        // set date picker date as application date
        if (universalDate.length > 1) {
            this.advanceSearchFilter.from = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
            this.advanceSearchFilter.to = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
            this.datePickerOptions = {
                ...this.datePickerOptions,
                startDate: moment(new Date(universalDate[0]), 'DD-MM-YYYY').toDate(),
                endDate: moment(new Date(universalDate[1]), 'DD-MM-YYYY').toDate(),
                chosenLabel: universalDate[2]
            };
        }

        // assign start and end date
        // this.assignStartAndEndDateForDateRangePicker(null, null);

        this.getAll();
    }

    public pageChanged(ev: any): void {
        if (ev.page === this.advanceSearchFilter.page) {
            return;
        }
        this.advanceSearchFilter.page = ev.page;
        this.getAll();
    }

    public goToInvoice(voucherType: string) {
        this.router.navigate(['/pages/proforma-invoice/invoice/', voucherType]);
    }

    public updateVoucherAction(action: string, item?: ProformaItem) {
        let request: ProformaUpdateActionRequest = new ProformaUpdateActionRequest();
        request.accountUniqueName = this.selectedVoucher ? this.selectedVoucher.account.uniqueName : item.customerUniqueName;

        if (this.voucherType === VoucherTypeEnum.generateProforma || this.voucherType === VoucherTypeEnum.proforma) {
            request.proformaNumber = this.selectedVoucher ? this.selectedVoucher.voucherNumber : item.proformaNumber;
        } else {
            request.estimateNumber = this.selectedVoucher ? this.selectedVoucher.voucherNumber : item.estimateNumber;
        }

        if (action === 'ConvertToInvoice') {
            this.store.dispatch(this.proformaActions.generateInvoice(request, this.voucherType));
            return;
        } else if (action === 'ConvertToSalesOrder') {
            this.store.dispatch(this.proformaActions.generateProformaFromEstimate(request, 'proformas'));
            return;
        }

        request.action = action;
        this.store.dispatch(this.proformaActions.updateProformaAction(request, this.voucherType));
    }

    public deleteVoucher() {
        if (this.deleteConfirmationModel && this.deleteConfirmationModel.isShown) {
            this.deleteConfirmationModel.hide();
        }
        // for deleting voucher which is previewed
        if (this.selectedVoucher) {
            this.store.dispatch(this.proformaActions.deleteProforma(this.prepareCommonRequest(), this.voucherType));
        } else {
            // for deleting voucher which is selected from checkbox
            let request: ProformaGetRequest = new ProformaGetRequest();
            let item = this.voucherData.results.find(f => {
                return this.voucherType === VoucherTypeEnum.generateProforma ?
                    (f.proformaNumber === this.selectedItems[0]) : ((f.estimateNumber === this.selectedItems[0]));
            });
            request.accountUniqueName = item.customerUniqueName;

            if (this.voucherType === VoucherTypeEnum.generateProforma || this.voucherType === VoucherTypeEnum.proforma) {
                request.proformaNumber = item.proformaNumber;
            } else {
                request.estimateNumber = item.estimateNumber;
            }
            this.store.dispatch(this.proformaActions.deleteProforma(request, this.voucherType));
        }
    }

    public sendEmail(email: string) {
        let request = this.prepareCommonRequest();
        request.emailId = email.split(',');
        this.store.dispatch(this.proformaActions.sendMail(request, this.voucherType));
    }

    /**
     * called when someone closes invoice/ voucher preview page
     * it will call get all so we can have latest data every time someone updates invoice/ voucher
     */
    public invoicePreviewClosed() {
        this.selectedVoucher = null;
        this.toggleBodyClass();
        this.getAll();
    }

    public ngOnDestroy(): void {
        this.universalDate$.pipe(take(1)).subscribe(a => {
            if (a && window.localStorage) {
                localStorage.setItem('universalSelectedDate', a);
            }
        });
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Displays the confirmation model
     *
     * @param {boolean} shouldOpenModal True, if the modal needs to opened
     * @memberof ProformaListComponent
     */
    public toggleConfirmationModel(shouldOpenModal: boolean = false): void {
        if (this.deleteConfirmationModel) {
            if (shouldOpenModal) {
                this.deleteConfirmationModel.show();
            } else {
                this.deleteConfirmationModel.hide();
            }
        }
    }

    private prepareCommonRequest(): ProformaGetRequest {
        let request: ProformaGetRequest = new ProformaGetRequest();

        request.accountUniqueName = this.selectedVoucher.account.uniqueName;

        if (this.voucherType === VoucherTypeEnum.generateProforma || this.voucherType === VoucherTypeEnum.proforma) {
            request.proformaNumber = this.selectedVoucher.voucherNumber;
        } else {
            request.estimateNumber = this.selectedVoucher.voucherNumber;
        }

        return request;
    }

    private parseItemForVm(invoice: any): InvoicePreviewDetailsVm {
        let obj: InvoicePreviewDetailsVm = new InvoicePreviewDetailsVm();
        obj.voucherDate = this.voucherType === VoucherTypeEnum.generateProforma ? invoice.proformaDate : invoice.estimateDate;
        obj.voucherNumber = this.voucherType === VoucherTypeEnum.generateProforma ? invoice.proformaNumber : invoice.estimateNumber;
        obj.uniqueName = obj.voucherNumber;
        if (this.voucherType === VoucherTypeEnum.generateProforma || this.voucherType === VoucherTypeEnum.generateEstimate) {
            obj.grandTotal = invoice.amount.amountForAccount;
        } else {
            obj.grandTotal = invoice.grandTotal;
        }
        obj.voucherType = this.voucherType;
        obj.account = { name: invoice.customerName, uniqueName: invoice.customerUniqueName };
        obj.voucherStatus = invoice.action;
        return obj;
    }

    /**
     * Adds tooltip text for grand total
     * to item supplied (for Proforma/Estimate Invoice)
     *
     * @private
     * @param {any} item received from service
     * @returns {*} Modified item with tooltip text for grand total
     * @memberof ProformaListComponent
     */
    private addToolTiptext(item: any): any {
        try {
            let grandTotalAmountForCompany,
                grandTotalAmountForAccount;

            if (VOUCHER_TYPES.indexOf(this.voucherType) > -1 && item.amount) {
                grandTotalAmountForCompany = Number(item.amount.amountForCompany) || 0;
                grandTotalAmountForAccount = Number(item.amount.amountForAccount) || 0;
            }

            let grandTotalConversionRate = 0;
            if (grandTotalAmountForCompany && grandTotalAmountForAccount) {
                grandTotalConversionRate = +((grandTotalAmountForCompany / grandTotalAmountForAccount) || 0).toFixed(2);
            }

            item['grandTotalTooltipText'] = `In ${this.baseCurrency}: ${grandTotalAmountForCompany}<br />(Conversion Rate: ${grandTotalConversionRate})`;
        } catch (error) {

        }
        return item;
    }
}

import { Component, ElementRef, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { IOption } from '../../theme/ng-select/ng-select';
import { FormControl } from '@angular/forms';
import { RecurringInvoice, RecurringInvoices } from '../../models/interfaces/RecurringInvoice';
import { Observable, ReplaySubject } from 'rxjs';
import { AppState } from '../../store';
import { select, Store } from '@ngrx/store';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import * as dayjs from 'dayjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { GeneralService } from '../../services/general.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { OrganizationType } from '../../models/user-login-state';

@Component({
    selector: 'app-recurring',
    templateUrl: './recurring.component.html',
    styleUrls: ['./recurring.component.scss'],
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

export class RecurringComponent implements OnInit, OnDestroy {
    public currentPage = 1;
    public modalRef: BsModalRef;
    public asideMenuStateForRecurringEntry: string = 'out';
    public invoiceTypeOptions: IOption[];
    public intervalOptions: IOption[];
    public recurringData$: Observable<RecurringInvoices>;
    public isMobileScreen: boolean = false;
    public selectedInvoice: RecurringInvoice;
    public filter = {
        sort: 'asc',
        sortBy: 'createdAt',
        status: '',
        customerName: '',
        voucherNumber: '',
        duration: '',
        lastInvoiceDate: ''
    };
    public modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: 'static',
        ignoreBackdropClick: true
    };
    @ViewChild('customerSearch', { static: true }) public customerSearch: ElementRef;
    @ViewChild(BsDatepickerDirective, { static: true }) public bsd: BsDatepickerDirective;

    public showInvoiceNumberSearch = false;
    public showCustomerNameSearch = false;
    public allItemsSelected: boolean = false;
    public recurringVoucherDetails: RecurringInvoice[];
    public selectedItems: string[] = [];
    public customerNameInput: FormControl = new FormControl();
    public invoiceNumberInput: FormControl = new FormControl();
    public hoveredItemForAction: string = '';
    public clickedHoveredItemForAction: string = '';
    public showResetFilterButton: boolean = false;
    /** This will hold checked invoices */
    public selectedInvoices: any[] = [];
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** Current branches */
    public branches: Array<any>;
    /** True if api call to get recurring invoices in progress */
    public isLoading: boolean = true;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if user has voucher list permission */
    public hasRecurringVoucherListPermissions: boolean = true;

    constructor(private store: Store<AppState>,
        private generalService: GeneralService,
        private _invoiceActions: InvoiceActions, private _breakPointObservar: BreakpointObserver, private modalService: BsModalService) {
        this.recurringData$ = this.store.pipe(takeUntil(this.destroyed$), select(s => s.invoice.recurringInvoiceData.recurringInvoices));
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    public ngOnInit() {
        this.recurringData$.subscribe(p => {
            if (p && p.recurringVoucherDetails) {
                let items = _.cloneDeep(p.recurringVoucherDetails);
                items.map(item => {
                    item.isSelected = this.generalService.checkIfValueExistsInArray(this.selectedInvoices, item?.uniqueName);
                    return item;
                });

                this.recurringVoucherDetails = items;
                this.isLoading = false;
            }
        });
        this.store.dispatch(this._invoiceActions.GetAllRecurringInvoices());
        this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.branches = response || [];
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && this.branches.length > 1;
            }
        });

        this.invoiceNumberInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.filter.voucherNumber = s;
            this.submit();
            if (s === '') {
                this.showCustomerNameSearch = false;
            }
        });

        this.customerNameInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.filter.customerName = s;
            this.submit();
            if (s === '') {
                this.showCustomerNameSearch = false;
            }
        });

        this._breakPointObservar.observe([
            '(max-width: 1023px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        this.store.pipe(select(state => state.invoice.hasRecurringVoucherListPermissions), takeUntil(this.destroyed$)).subscribe(response => {
            this.hasRecurringVoucherListPermissions = response;
        });
    }

    public openUpdatePanel(invoice: RecurringInvoice) {
        this.selectedInvoice = invoice;
        this.toggleRecurringAsidePane();
    }

    public pageChanged({ page }) {
        this.isLoading = true;
        this.currentPage = page;
        this.store.dispatch(this._invoiceActions.GetAllRecurringInvoices(undefined, page));
    }

    public toggleRecurringAsidePane(toggle?: string): void {
        if (toggle) {
            this.isLoading = true;
            this.asideMenuStateForRecurringEntry = toggle;
            this.store.dispatch(this._invoiceActions.GetAllRecurringInvoices());
        } else {
            this.asideMenuStateForRecurringEntry = this.asideMenuStateForRecurringEntry === 'out' ? 'in' : 'out';
        }
        this.toggleBodyClass();
    }

    public toggleBodyClass() {
        if (this.asideMenuStateForRecurringEntry === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public toggleAllItems(type: boolean) {
        this.allItemsSelected = type;
        if (this.recurringVoucherDetails && this.recurringVoucherDetails.length) {
            this.recurringVoucherDetails = _.map(this.recurringVoucherDetails, (item: RecurringInvoice) => {
                item.isSelected = this.allItemsSelected;

                if (this.allItemsSelected) {
                    this.selectedInvoices = this.generalService.addValueInArray(this.selectedInvoices, item.uniqueName);
                } else {
                    this.selectedInvoices = this.generalService.removeValueFromArray(this.selectedInvoices, item.uniqueName);
                }

                return item;
            });
        }
    }

    public toggleItem(item: any, action: boolean) {
        item.isSelected = action;
        if (action) {
            this.selectedInvoices = this.generalService.addValueInArray(this.selectedInvoices, item.uniqueName);
        } else {
            this.selectedInvoices = this.generalService.removeValueFromArray(this.selectedInvoices, item.uniqueName);
            this.allItemsSelected = false;
        }
        this.itemStateChanged(item.uniqueName);
    }

    public clickedOutside(event, el, fieldName: string) {
        if (fieldName === 'invoiceNumber') {
            if (this.invoiceNumberInput.value !== null && this.invoiceNumberInput.value !== '') {
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
            if (fieldName === 'customerName') {
                this.showCustomerNameSearch = false;
            } else {
                this.showInvoiceNumberSearch = false;
            }
        }
    }

    /* tslint:disable */
    public childOf(c, p) {
        while ((c = c.parentNode) && c !== p) {
        }
        return !!c;
    }

    public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {
        this.showResetFilterButton = true;
        if (this.filter.sort !== type || this.filter.sortBy !== columnName) {
            this.filter.sort = type;
            this.filter.sortBy = columnName;
            this.submit();
        }
    }

    public resetFilter() {
        this.showResetFilterButton = false;
        this.filter = {
            sort: 'asc',
            sortBy: 'createdAt',
            status: '',
            customerName: '',
            voucherNumber: '',
            duration: '',
            lastInvoiceDate: ''
        };
        this.submit();
    }

    public itemStateChanged(uniqueName: string) {
        let index = (this.selectedItems) ? this.selectedItems.findIndex(f => f === uniqueName) : -1;

        if (index > -1) {
            this.selectedItems = this.selectedItems.filter(f => f !== uniqueName);
        } else {
            this.selectedItems.push(uniqueName);
        }
    }

    public toggleSearch(fieldName: string, el) {
        if (fieldName === 'customerName') {
            this.showCustomerNameSearch = true;
            this.showInvoiceNumberSearch = false;
        }

        setTimeout(() => {
            el.focus();
        }, 200);
    }

    public submit() {
        const filter = { ...this.filter };
        if (filter.lastInvoiceDate) {
            filter.lastInvoiceDate = dayjs(filter.lastInvoiceDate).format(GIDDH_DATE_FORMAT);
        }
        if (Object.keys(filter).some(p => filter[p])) {
            this.isLoading = true;
            this.store.dispatch(this._invoiceActions.GetAllRecurringInvoices(filter));
        } else {
            this.isLoading = true;
            this.store.dispatch(this._invoiceActions.GetAllRecurringInvoices());
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof RecurringComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.invoiceTypeOptions = [
                { label: this.localeData?.active, value: 'active' },
                { label: this.localeData?.inactive, value: 'inactive' },
            ];

            this.intervalOptions = [
                { label: this.localeData?.interval_options?.weekly, value: 'weekly' },
                { label: this.localeData?.interval_options?.monthly, value: 'monthly' },
                { label: this.localeData?.interval_options?.quarterly, value: 'quarterly' },
                { label: this.localeData?.interval_options?.halfyearly, value: 'halfyearly' },
                { label: this.localeData?.interval_options?.yearly, value: 'yearly' }
            ];
        }
    }

    /**
     * Returns the search field text
     *
     * @param {*} title
     * @returns {string}
     * @memberof RecurringComponent
     */
    public getSearchFieldText(title: any): string {
        let searchField = this.localeData?.search_field;
        searchField = searchField?.replace("[FIELD]", title);
        return searchField;
    }
}

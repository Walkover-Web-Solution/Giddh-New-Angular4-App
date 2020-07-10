import { Component, OnInit, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap'
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { Observable, ReplaySubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { takeUntil } from 'rxjs/operators';
import { ToasterService } from '../../services/toaster.service';
import { PAGINATION_LIMIT } from '../../app.constant';
import * as moment from 'moment/moment';
import { GIDDH_NEW_DATE_FORMAT_UI, GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';

@Component({
    selector: 'purchase-order',
    templateUrl: './purchase-order.component.html',
    styleUrls: ['./purchase-order.component.scss']
})

export class PurchaseOrderComponent implements OnInit, OnDestroy {
    /* Datepicker component */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /* Input element for column search */
    @ViewChild('searchBox') public searchBox: ElementRef;

    /* This will store if device is mobile or not */
    public isMobileScreen: boolean = false;
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOptions: any;
    /* Moment object */
    public moment = moment;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* Universal date observer */
    public universalDate$: Observable<any>;
    /* Active company unique name */
    public activeCompanyUniqueName$: Observable<string>;
    /* This will store if loading is active or not */
    public isLoading: boolean = false;
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold the response object*/
    public purchaseOrders: any = {};
    /* This will hold the query params of get all PO api */
    public purchaseOrderGetRequest: any = {
        companyUniqueName: '',
        from: '',
        to: '',
        page: 1,
        count: PAGINATION_LIMIT,
        search: '',
        sort: '',
        sortBy: ''
    };
    /* This will hold the post params of get all PO api */
    public purchaseOrderPostRequest: any = {
        purchaseOrderNumber: '',
        grandTotal: '',
        grandTotalOperation: '',
        statuses: [],
        dueFrom: '',
        dueTo: ''
    };
    /* This will hold the universal date object */
    public universalDate: any;
    /* This will hold if PO column search should be visible */
    public showPurchaseOrderNumberSearch: boolean = false;
    /* This will hold if Vendor Name column search should be visible */
    public showVendorNameSearch: boolean = false;
    /* This will hold timeout object */
    public timeout: any;

    constructor(private modalService: BsModalService, private generalService: GeneralService, private breakPointObservar: BreakpointObserver, public purchaseOrderService: PurchaseOrderService, private store: Store<AppState>, private toaster: ToasterService) {
        this.activeCompanyUniqueName$ = this.store.pipe(select(state => state.session.companyUniqueName), (takeUntil(this.destroyed$)));
        this.universalDate$ = this.store.select(state => state.session.applicationDate).pipe(takeUntil(this.destroyed$));
    }

    /**
     * Initializes the component
     *
     * @memberof PurchaseOrderComponent
     */
    public ngOnInit(): void {
        this.breakPointObservar.observe([
            '(max-width: 767px)'
        ]).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        /* Observer to store universal from/to date */
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                this.universalDate = _.cloneDeep(dateObj);

                this.selectedDateRange = { startDate: moment(this.universalDate[0]), endDate: moment(this.universalDate[1]) };
                this.selectedDateRangeUi = moment(this.universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(this.universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);

                this.purchaseOrderGetRequest.from = moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.purchaseOrderGetRequest.to = moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT);

                this.getAllPurchaseOrders(true);
            }
        });

        /* This will get the date range picker configurations */
        this.store.pipe(select(state => state.company.dateRangePickerConfig), takeUntil(this.destroyed$)).subscribe(config => {
            if (config) {
                this.datePickerOptions = config;
            }
        });

        this.activeCompanyUniqueName$.subscribe(response => {
            this.purchaseOrderGetRequest.companyUniqueName = response;
            this.getAllPurchaseOrders(true);
        });
    }

    /**
     * This will open the bulk update popup
     *
     * @param {TemplateRef<any>} template
     * @memberof PurchaseOrderComponent
     */
    public openModalBulkUpdate(template: TemplateRef<any>): void {
        this.modalRef = this.modalService.show(
            template,
            Object.assign({}, { class: 'modal-sm' })
        );
    }

    /**
     * This will open the advance search popup
     *
     * @param {TemplateRef<any>} template
     * @memberof PurchaseOrderComponent
     */
    public openAdvanceSearchModal(template: TemplateRef<any>): void {
        this.modalRef = this.modalService.show(template);
    }

    /**
     * This will search the PO based on filters
     *
     * @param {boolean} resetPage
     * @memberof PurchaseOrderComponent
     */
    public getAllPurchaseOrders(resetPage: boolean): void {
        if (this.purchaseOrderGetRequest.companyUniqueName && this.purchaseOrderGetRequest.from && this.purchaseOrderGetRequest.to) {
            this.isLoading = true;
            this.purchaseOrders = {};

            if (resetPage) {
                this.purchaseOrderGetRequest.page = 1;
            }

            this.purchaseOrderService.getAll(this.purchaseOrderGetRequest, this.purchaseOrderPostRequest).subscribe((res) => {
                if (res) {
                    this.isLoading = false;
                    if (res.status === 'success') {
                        this.purchaseOrders = res.body;
                    } else {
                        this.toaster.errorToast(res.message);
                    }
                }
            });
        }
    }

    /**
     * Releases the memory
     *
     * @memberof PurchaseOrderComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will show the datepicker
     *
     * @memberof PurchaseOrderComponent
     */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: this.isMobileScreen })
        );
    }

    /**
     * This will hide the datepicker
     *
     * @memberof PurchaseOrderComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof PurchaseOrderComponent
     */
    public dateSelectedCallback(value: any): void {
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }

        this.hideGiddhDatepicker();

        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.purchaseOrderGetRequest.from = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.purchaseOrderGetRequest.to = moment(value.endDate).format(GIDDH_DATE_FORMAT);
            this.getAllPurchaseOrders(true);
        }
    }

    /**
     * Callback function for page change event
     *
     * @param {*} event
     * @memberof PurchaseOrderComponent
     */
    public pageChanged(event: any): void {
        if (this.purchaseOrderGetRequest.page !== event.page) {
            this.purchaseOrderGetRequest.page = event.page;
            this.getAllPurchaseOrders(false);
        }
    }

    /**
     * This will search the PO based on advance search
     *
     * @param {*} event
     * @memberof PurchaseOrderComponent
     */
    public advanceSearchCallback(event: any): void {
        if (event) {
            this.purchaseOrderPostRequest = event;
        } else {
            this.purchaseOrderPostRequest = {
                purchaseOrderNumber: '',
                grandTotal: '',
                grandTotalOperation: '',
                statuses: [],
                dueFrom: '',
                dueTo: ''
            };
        }

        this.modalRef.hide();
        this.getAllPurchaseOrders(true);
    }

    /**
     * This will clear all the filters
     *
     * @memberof PurchaseOrderComponent
     */
    public clearFilter(): void {
        this.purchaseOrderGetRequest.from = moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
        this.purchaseOrderGetRequest.to = moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
        this.purchaseOrderGetRequest.page = 1;
        this.purchaseOrderGetRequest.search = '';
        this.purchaseOrderGetRequest.sort = '';
        this.purchaseOrderGetRequest.sortBy = '';

        this.purchaseOrderPostRequest = {
            purchaseOrderNumber: '',
            grandTotal: '',
            grandTotalOperation: '',
            statuses: [],
            dueFrom: '',
            dueTo: ''
        };

        this.getAllPurchaseOrders(true);
    }

    /**
     * This will sort the PO list
     *
     * @param {('asc' | 'desc')} type
     * @param {string} columnName
     * @memberof PurchaseOrderComponent
     */
    public sortPurchaseOrders(type: 'asc' | 'desc', columnName: string): void {
        this.purchaseOrderGetRequest.sort = type;
        this.purchaseOrderGetRequest.sortBy = columnName;
        this.getAllPurchaseOrders(true);
    }

    /**
     * This will show the inline column search
     *
     * @param {string} fieldName
     * @param {*} element
     * @memberof PurchaseOrderComponent
     */
    public showInlineSearch(fieldName: string, element: any): void {
        if (fieldName === 'purchaseOrderNumber') {
            this.showPurchaseOrderNumberSearch = true;
        } else if (fieldName === 'vendorName') {
            this.showVendorNameSearch = true;
        }

        setTimeout(() => {
            element.focus();
        }, 200);
    }

    /**
     * This will search based on column search
     *
     * @memberof PurchaseOrderComponent
     */
    public columnSearch(): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.getAllPurchaseOrders(true);
        }, 700);
    }

    /**
     * This will check if we need to show/hide clear filter button
     *
     * @returns {boolean}
     * @memberof PurchaseOrderComponent
     */
    public showClearFilterButton(): boolean {
        if (this.purchaseOrderPostRequest.purchaseOrderNumber || this.purchaseOrderPostRequest.grandTotal || this.purchaseOrderPostRequest.grandTotalOperation || (this.purchaseOrderPostRequest.statuses && this.purchaseOrderPostRequest.statuses.length > 0) || this.purchaseOrderPostRequest.dueFrom || this.purchaseOrderPostRequest.dueTo || this.purchaseOrderGetRequest.search || this.purchaseOrderGetRequest.sortBy || (this.universalDate && (this.purchaseOrderGetRequest.from !== moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT) || this.purchaseOrderGetRequest.to !== moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT)))) {
            return true;
        } else {
            return false;
        }
    }
}
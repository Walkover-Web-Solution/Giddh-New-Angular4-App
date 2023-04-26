import { Component, ViewChild, ElementRef, TemplateRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal'
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { Observable, ReplaySubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { takeUntil, filter } from 'rxjs/operators';
import { ToasterService } from '../../services/toaster.service';
import { PAGINATION_LIMIT, GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_NEW_DATE_FORMAT_UI, GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { PurchaseOrderActions } from '../../actions/purchase-order/purchase-order.action';
import { IOption } from '../../theme/ng-select/ng-select';
import { SettingsUtilityService } from '../../settings/services/settings-utility.service';
import { WarehouseActions } from '../../settings/warehouse/action/warehouse.action';
import { BULK_UPDATE_FIELDS } from '../../shared/helpers/purchaseOrderStatus';
import { OrganizationType } from '../../models/user-login-state';
import { cloneDeep } from '../../lodash-optimized';

@Component({
    selector: 'purchase-order',
    templateUrl: './purchase-order.component.html',
    styleUrls: ['./purchase-order.component.scss']
})

export class PurchaseOrderComponent implements OnDestroy {
    /* Datepicker component */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /* Input element for column search */
    @ViewChild('searchBox') public searchBox: ElementRef;
    /* Confirm box */
    @ViewChild('poConfirmationModel') public poConfirmationModel: ModalDirective;
    /* This will emit if purchase bill lists needs to be refreshed */
    @Output() public refreshPurchaseBill: EventEmitter<any> = new EventEmitter();

    /* This will store if device is mobile or not */
    public isMobileScreen: boolean = false;
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* dayjs object */
    public dayjs = dayjs;
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
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
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
        sort: 'DESC',
        sortBy: 'purchaseDate'
    };
    /* This will hold the post params of get all PO api */
    public purchaseOrderPostRequest: any = {
        purchaseOrderNumber: '',
        grandTotal: '',
        grandTotalOperation: '',
        statuses: [],
        dueFrom: '',
        dueTo: '',
        vendorName: ''
    };
    /* This will hold the universal date object */
    public universalDate: any;
    /* This will hold if PO column search should be visible */
    public showPurchaseOrderNumberSearch: boolean = false;
    /* This will hold if Vendor Name column search should be visible */
    public showVendorNameSearch: boolean = false;
    /* This will hold timeout object */
    public timeout: any;
    /* This will hold the PO unique name */
    public purchaseOrderUniqueName: any = '';
    /* This will hold if all items are selected */
    public allItemsSelected: boolean = false;
    /* This will hold current hovered item */
    public hoveredItem: any = '';
    /* This will hold current selected item */
    public selectedItem: any = '';
    /* This will hold the delete module to show delete message in confirmation popup */
    public deleteModule: string = '';
    /* This will toggle the select all checkbox */
    public showSelectAllItemCheckbox: boolean = false;
    /* Send email request params object */
    public sendEmailRequest: any = {};
    /* Observable for filters applied */
    public purchaseOrderListFilters$: Observable<any>;
    /* This will hold if we need to overwriter filters */
    public useStoreFilters: boolean = false;
    /* This will hold current page url */
    public pageUrl: string = "pages/purchase-management/purchase";
    /* This holds the fields which can be updated in bulk */
    public bulkUpdateFields: IOption[] = [];
    /* Stores warehouses for a company */
    public warehouses: Array<any>;
    /* Bulk update get params */
    public bulkUpdateGetParams: any = { companyUniqueName: '', action: '' };
    /* Bulk update post params */
    public bulkUpdatePostParams: any = {};
    /* This will hold giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** This will hold checked invoices */
    public selectedPo: any[] = [];
    /* Observable for selected PO applied */
    public selectedPo$: Observable<any>;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** Current branches */
    public branches: Array<any>;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2;
    /** Decimal places from company settings */
    public giddhBalanceDecimalPlaces: number = 2;

    constructor(private modalService: BsModalService, private generalService: GeneralService, private breakPointObservar: BreakpointObserver, public purchaseOrderService: PurchaseOrderService, private store: Store<AppState>, private toaster: ToasterService, public route: ActivatedRoute, private router: Router, public purchaseOrderActions: PurchaseOrderActions, private settingsUtilityService: SettingsUtilityService, private warehouseActions: WarehouseActions) {
        this.activeCompanyUniqueName$ = this.store.pipe(select(state => state.session.companyUniqueName), (takeUntil(this.destroyed$)));
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
        this.purchaseOrderListFilters$ = this.store.pipe(select(state => state.purchaseOrder.listFilters), (takeUntil(this.destroyed$)));
        this.selectedPo$ = this.store.pipe(select(state => state.purchaseOrder.selectedPo), (takeUntil(this.destroyed$)));

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params && params['purchaseOrderUniqueName']) {
                this.purchaseOrderUniqueName = params['purchaseOrderUniqueName'];
            } else {
                this.purchaseOrderUniqueName = '';
            }
        });

        this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$)).subscribe(profile => {
            if (profile) {
                this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
            }
        });

        this.initBulkUpdateFields();
        this.voucherApiVersion = this.generalService.voucherApiVersion;
    }

    /**
     * Initializes the component
     *
     * @memberof PurchaseOrderComponent
     */
    public initPurchaseOrders(): void {
        this.breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.branches = response || [];
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && this.branches?.length > 1;
            }
        });

        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (event instanceof NavigationStart) {
                this.pageUrl = event.url;
                if (event.url.includes('/purchase-order/new') || event.url.includes('/purchase-orders/preview') || event.url.includes('/purchase-order/edit') || event.url.includes('/purchase-management/purchase')) {
                    this.store.dispatch(this.purchaseOrderActions.setPurchaseOrderFilters({ getRequest: this.purchaseOrderGetRequest, postRequest: this.purchaseOrderPostRequest, selectedPo: this.selectedPo }));
                } else {
                    this.store.dispatch(this.purchaseOrderActions.setPurchaseOrderFilters({}));
                }
            }
        });

        this.purchaseOrderListFilters$.pipe(takeUntil(this.destroyed$)).subscribe(filters => {
            if (filters && (this.pageUrl.includes('/purchase-orders/preview') || this.pageUrl.includes('/purchase-management/purchase'))) {
                if (filters.getRequest) {
                    this.purchaseOrderGetRequest = filters.getRequest;
                    this.purchaseOrderGetRequest.page = 1;
                }
                if (filters.postRequest) {
                    this.purchaseOrderPostRequest = filters.postRequest;
                }

                if (filters.getRequest && filters.getRequest.from && filters.getRequest.to) {
                    this.useStoreFilters = true;
                }
            }
        });

        this.selectedPo$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && (this.pageUrl.includes('/purchase-orders/preview') || this.pageUrl.includes('/purchase-management/purchase'))) {
                this.selectedPo = response;
            }
        });

        /* Observer to store universal from/to date */
        this.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (dateObj) {
                this.universalDate = _.cloneDeep(dateObj);

                if (!this.useStoreFilters) {
                    this.selectedDateRange = { startDate: dayjs(this.universalDate[0]), endDate: dayjs(this.universalDate[1]) };
                    this.selectedDateRangeUi = dayjs(this.universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(this.universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);

                    this.purchaseOrderGetRequest.from = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                    this.purchaseOrderGetRequest.to = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);

                    this.getAllPurchaseOrders(true);
                } else {
                    this.selectedDateRange = { startDate: dayjs(this.purchaseOrderGetRequest.from, GIDDH_DATE_FORMAT), endDate: dayjs(this.purchaseOrderGetRequest.to, GIDDH_DATE_FORMAT) };
                    this.selectedDateRangeUi = dayjs(this.purchaseOrderGetRequest.from, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(this.purchaseOrderGetRequest.to, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
                    this.useStoreFilters = false;
                    this.getAllPurchaseOrders(true);
                }
            }
        });

        this.activeCompanyUniqueName$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.purchaseOrderGetRequest.companyUniqueName = response;
            this.bulkUpdateGetParams.companyUniqueName = response;
            this.getAllPurchaseOrders(true);
        });

        this.store.pipe(select(appState => appState.warehouse.warehouses), filter((warehouses) => !!warehouses), takeUntil(this.destroyed$)).subscribe((warehouses: any) => {
            if (warehouses) {
                let warehouseResults = cloneDeep(warehouses.results);
                warehouseResults = warehouseResults?.filter(warehouse => !warehouse.isArchived);
                const warehouseData = this.settingsUtilityService.getFormattedWarehouseData(warehouseResults);
                if (warehouseData) {
                    this.warehouses = warehouseData.formattedWarehouses;
                }
            }
        });
    }

    /**
     * This will open the bulk update popup
     *
     * @param {TemplateRef<any>} template
     * @memberof PurchaseOrderComponent
     */
    public openModalBulkUpdate(template: TemplateRef<any>): void {
        let purchaseNumbers = this.getSelectedItems();
        this.initBulkUpdateFields();

        if (purchaseNumbers?.length > 0) {
            this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
            this.modalRef = this.modalService.show(
                template,
                Object.assign({}, { class: 'modal-sm' })
            );
        } else {
            this.toaster.errorToast(this.localeData?.po_selection_error);
        }
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
        if (this.purchaseOrderGetRequest.companyUniqueName && this.purchaseOrderGetRequest.from && this.purchaseOrderGetRequest.to && !this.isLoading) {
            this.isLoading = true;
            this.purchaseOrders = {};

            if (resetPage) {
                this.purchaseOrderGetRequest.page = 1;
            }

            this.purchaseOrderService.getAll(this.purchaseOrderGetRequest, this.purchaseOrderPostRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res) {
                    this.isLoading = false;
                    if (res.status === 'success') {
                        this.allItemsSelected = false;

                        let purchaseOrders = _.cloneDeep(res.body);

                        if (purchaseOrders && purchaseOrders.items && purchaseOrders.items.length > 0) {
                            purchaseOrders.items.map(item => {
                                item.isSelected = this.generalService.checkIfObjectExistsInArray(this.selectedPo, { poUniqueName: item?.uniqueName, vendorUniqueName: item?.vendor?.uniqueName });
                                let grandTotalConversionRate = 0, grandTotalAmountForCompany, grandTotalAmountForAccount;
                                grandTotalAmountForCompany = Number(item?.grandTotal?.amountForCompany) || 0;
                                grandTotalAmountForAccount = Number(item?.grandTotal?.amountForAccount) || 0;

                                if (grandTotalAmountForCompany && grandTotalAmountForAccount) {
                                    grandTotalConversionRate = +((grandTotalAmountForCompany / grandTotalAmountForAccount) || 0).toFixed(this.giddhBalanceDecimalPlaces);
                                }
                                let currencyConversion = this.localeData?.currency_conversion;
                                currencyConversion = currencyConversion?.replace("[BASE_CURRENCY]", item.grandTotal?.currencyForCompany?.code)?.replace("[AMOUNT]", grandTotalAmountForCompany)?.replace("[CONVERSION_RATE]", grandTotalConversionRate);
                                item.grandTotalTooltipText = currencyConversion;
                                return item;
                            });
                        }

                        this.purchaseOrders = purchaseOrders;
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
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.purchaseOrderGetRequest.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.purchaseOrderGetRequest.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
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
            this.getAllPurchaseOrders(true);
        }
        this.modalRef.hide();
    }

    /**
     * This will clear all the filters
     *
     * @memberof PurchaseOrderComponent
     */
    public clearFilter(): void {
        this.purchaseOrderGetRequest.from = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
        this.purchaseOrderGetRequest.to = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
        this.selectedDateRange = { startDate: dayjs(this.universalDate[0]), endDate: dayjs(this.universalDate[1]) };
        this.selectedDateRangeUi = dayjs(this.universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(this.universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
        this.purchaseOrderGetRequest.page = 1;
        this.purchaseOrderGetRequest.sort = 'DESC';
        this.purchaseOrderGetRequest.sortBy = 'purchaseDate';

        this.purchaseOrderPostRequest = {
            purchaseOrderNumber: '',
            grandTotal: '',
            grandTotalOperation: '',
            statuses: [],
            dueFrom: '',
            dueTo: '',
            vendorName: ''
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
        if (this.purchaseOrderPostRequest.purchaseOrderNumber || this.purchaseOrderPostRequest.grandTotal || this.purchaseOrderPostRequest.grandTotalOperation || (this.purchaseOrderPostRequest.statuses && this.purchaseOrderPostRequest.statuses.length > 0) || this.purchaseOrderPostRequest.dueFrom || this.purchaseOrderPostRequest.dueTo || this.purchaseOrderPostRequest.vendorName || (this.purchaseOrderGetRequest.sortBy && this.purchaseOrderGetRequest.sortBy !== "purchaseDate") || (this.universalDate && (this.purchaseOrderGetRequest.from !== dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT) || this.purchaseOrderGetRequest.to !== dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT)))) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * This will select/unselect all items
     *
     * @param {boolean} type
     * @memberof PurchaseOrderComponent
     */
    public toggleAllItems(type: boolean): void {
        this.allItemsSelected = type;

        this.purchaseOrders.items.forEach(item => {
            item.isSelected = type;

            if (this.allItemsSelected) {
                this.selectedPo = this.generalService.addObjectInArray(this.selectedPo, { poUniqueName: item?.uniqueName, vendorUniqueName: item?.vendor?.uniqueName });
            } else {
                this.selectedPo = this.generalService.removeObjectFromArray(this.selectedPo, { poUniqueName: item?.uniqueName, vendorUniqueName: item?.vendor?.uniqueName });
            }
        });
    }

    /**
     * This will select/unselect single item
     *
     * @param {*} item
     * @param {boolean} action
     * @memberof PurchaseOrderComponent
     */
    public toggleItem(item: any, action: boolean): void {
        item.isSelected = action;
        if (action) {
            this.selectedPo = this.generalService.addObjectInArray(this.selectedPo, { poUniqueName: item?.uniqueName, vendorUniqueName: item?.vendor?.uniqueName });
        } else {
            this.selectedPo = this.generalService.removeObjectFromArray(this.selectedPo, { poUniqueName: item?.uniqueName, vendorUniqueName: item?.vendor?.uniqueName });
            this.allItemsSelected = false;
        }
    }

    /**
     * This will show the confirmation popup for delete
     *
     * @param {*} item
     * @memberof PurchaseOrderComponent
     */
    public confirmDelete(item: any): void {
        this.deleteModule = 'purchaseorder';
        this.selectedItem = item?.uniqueName;
        this.poConfirmationModel?.show();
    }

    /**
     * This will delete the item
     *
     * @memberof PurchaseOrderComponent
     */
    public deleteItem(): void {
        let getRequest = { companyUniqueName: this.purchaseOrderGetRequest.companyUniqueName, poUniqueName: this.selectedItem };

        this.purchaseOrderService.delete(getRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                if (res.status === 'success') {
                    this.getAllPurchaseOrders(false);
                    this.closeConfirmationPopup();
                    this.toaster.successToast(res.body);
                } else {
                    this.closeConfirmationPopup();
                    this.toaster.errorToast(res.message);
                }
            }
        });
    }

    /**
     * This will close the confirmation popup
     *
     * @memberof PurchaseOrderComponent
     */
    public closeConfirmationPopup(): void {
        this.selectedItem = '';
        this.poConfirmationModel.hide();
    }

    /**
     * This will give the list of selected items
     *
     * @returns {*}
     * @memberof PurchaseOrderComponent
     */
    public getSelectedItems(): any {
        let purchaseNumbers = [];

        if (this.purchaseOrders && this.purchaseOrders.items && this.purchaseOrders.items.length > 0) {
            this.purchaseOrders.items.forEach(item => {
                if (item.isSelected) {
                    purchaseNumbers.push(item.voucherNumber);
                }
            });
        }

        return purchaseNumbers;
    }

    /**
     * This will bulk update the status of items
     *
     * @param {*} action
     * @memberof PurchaseOrderComponent
     */
    public bulkUpdate(action: any, purchaseOrderNumber?: any): void {
        let purchaseNumbers = this.getSelectedItems();

        if (purchaseOrderNumber) {
            purchaseNumbers.push(purchaseOrderNumber);
        }

        this.bulkUpdateGetParams.action = action;

        if (purchaseNumbers?.length > 0) {
            this.bulkUpdatePostParams.purchaseNumbers = purchaseNumbers;

            this.purchaseOrderService.bulkUpdate(this.bulkUpdateGetParams, this.bulkUpdatePostParams).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res) {
                    if (res.status === 'success') {

                        if (action === "create_purchase_bill") {
                            this.refreshPurchaseBill.emit(true);
                        }

                        if (this.modalRef) {
                            this.initBulkUpdateFields();
                            this.modalRef.hide();
                        }

                        this.getAllPurchaseOrders(false);
                        if (action === "delete") {
                            this.closeConfirmationPopup();
                        }
                        this.toaster.successToast(res.body);
                    } else {
                        if (action === "delete") {
                            this.closeConfirmationPopup();
                        }
                        this.toaster.errorToast(res.message);
                    }
                }
            });
        } else {
            this.toaster.errorToast(this.localeData?.po_selection_error);
        }
    }

    /**
     * This will show the confirmation popup for bulk delete
     *
     * @memberof PurchaseOrderComponent
     */
    public confirmBulkDelete(): void {
        let purchaseNumbers = this.getSelectedItems();
        if (purchaseNumbers?.length > 0) {
            this.deleteModule = 'purchaseorderlist';
            this.poConfirmationModel?.show();
        } else {
            this.toaster.errorToast(this.localeData?.po_selection_error);
        }
    }

    /**
     * This will process the delete of item(s)
     *
     * @memberof PurchaseOrderComponent
     */
    public processDelete(): void {
        if (this.deleteModule === 'purchaseorderlist') {
            this.bulkUpdate('delete');
        } else {
            this.deleteItem();
        }
    }

    /**
     * This will open the send mail popup
     *
     * @param {*} item
     * @param {TemplateRef<any>} template
     * @memberof PurchaseOrderComponent
     */
    public openSendMailModal(item: any, template: TemplateRef<any>): void {
        this.sendEmailRequest.email = item.vendor.email;
        this.sendEmailRequest.uniqueName = item?.uniqueName;
        this.sendEmailRequest.accountUniqueName = item.vendor?.uniqueName;
        this.sendEmailRequest.companyUniqueName = this.purchaseOrderGetRequest.companyUniqueName;
        this.modalRef = this.modalService.show(template);
    }

    /**
     * This will close the email popup
     *
     * @memberof PurchaseOrderComponent
     */
    public closeSendMailPopup(event: any): void {
        this.selectedItem = '';

        if (event) {
            this.modalRef.hide();
        }
    }

    /**
     * This will validate bulk update form and will update fields
     *
     * @memberof PurchaseOrderComponent
     */
    public validateBulkUpdateFields(): void {
        let isValid = true;

        if (this.bulkUpdateGetParams.action) {
            if (this.bulkUpdateGetParams.action === BULK_UPDATE_FIELDS.purchasedate) {
                if (!this.bulkUpdatePostParams.purchaseDate) {
                    isValid = false;
                    this.toaster.errorToast(this.localeData?.po_date_error);
                } else {
                    this.bulkUpdatePostParams.purchaseDate = dayjs(this.bulkUpdatePostParams.purchaseDate).format(GIDDH_DATE_FORMAT);
                }
            } else if (this.bulkUpdateGetParams.action === BULK_UPDATE_FIELDS.duedate) {
                if (!this.bulkUpdatePostParams.dueDate) {
                    isValid = false;
                    this.toaster.errorToast(this.localeData?.po_expirydate_error);
                } else {
                    this.bulkUpdatePostParams.dueDate = dayjs(this.bulkUpdatePostParams.dueDate).format(GIDDH_DATE_FORMAT);
                }
            } else if (this.bulkUpdateGetParams.action === BULK_UPDATE_FIELDS.warehouse) {
                if (!this.bulkUpdatePostParams.warehouseUniqueName) {
                    isValid = false;
                    this.toaster.errorToast(this.localeData?.po_warehouse_error);
                }
            }
        } else {
            isValid = false;
            this.toaster.errorToast(this.localeData?.po_bulkupdate_error);
        }

        if (isValid) {
            this.bulkUpdate(this.bulkUpdateGetParams.action);
        }
    }

    /**
     * This will reset the bulk update fields
     *
     * @memberof PurchaseOrderComponent
     */
    public initBulkUpdateFields(): void {
        this.bulkUpdateGetParams.action = "";
        this.bulkUpdatePostParams = { purchaseNumbers: [], purchaseDate: '', dueDate: '', warehouseUniqueName: '' };
    }

    /**
     * This will format number so it becomes positive from negative
     *
     * @param {number} dueDays
     * @returns {number}
     * @memberof PurchaseOrderComponent
     */
    public formatNumber(dueDays: number): number {
        dueDays = Math.abs(dueDays);
        return dueDays;
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof PurchaseOrderComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.translationLoaded = true;
            this.bulkUpdateFields = [
                { label: this.localeData?.order_date, value: BULK_UPDATE_FIELDS.purchasedate },
                { label: this.localeData?.expected_delivery_date, value: BULK_UPDATE_FIELDS.duedate },
                { label: this.commonLocaleData?.app_warehouse, value: BULK_UPDATE_FIELDS.warehouse }
            ];
            this.initPurchaseOrders();
        }
    }

    /**
     * This will return delivery days text
     *
     * @param {number} dueDays
     * @returns {string}
     * @memberof PurchaseOrderComponent
     */
    public getDeliveryDaysText(dueDays: number): string {
        let text = "";

        if (dueDays > 0) {
            if (dueDays === 1) {
                text = this.localeData?.delivery_in_day;
            } else {
                text = this.localeData?.delivery_in_days;
            }
            text = text?.replace("[DAYS]", String(dueDays));
        } else {
            text = this.localeData?.delayed_by_days;
            text = text?.replace("[DAYS]", String(this.formatNumber(dueDays)));
        }

        return text;
    }

    /**
     * Opens the bulk convert popup
     *
     * @param {TemplateRef<any>} template
     * @memberof PurchaseOrderComponent
     */
    public openBulkConvert(template: TemplateRef<any>): void {
        if (this.selectedPo?.length > 0) {
            let selectedPoVendors = [];
            this.selectedPo.forEach(po => {
                if (!selectedPoVendors.includes(po.vendorUniqueName)) {
                    selectedPoVendors.push(po.vendorUniqueName);
                }
            });

            if (selectedPoVendors?.length > 1) {
                this.toaster.errorToast(this.localeData?.po_selection_vendor_error);
            } else {
                this.modalRef = this.modalService.show(
                    template,
                    Object.assign({}, { class: 'modal-sm' })
                );
            }
        } else {
            this.toaster.errorToast(this.localeData?.po_selection_error);
        }
    }
}

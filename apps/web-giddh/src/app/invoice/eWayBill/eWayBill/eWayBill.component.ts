import { Component, OnInit, TemplateRef, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { InvoiceActions } from '../../../actions/invoice/invoice.actions';
import { InvoiceService } from '../../../services/invoice.service';
import { AppState } from '../../../store';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { IEwayBillAllList, IEwayBillCancel, Result, UpdateEwayVehicle, IEwayBillfilter } from '../../../models/api-models/Invoice';
import { ToasterService } from '../../../services/toaster.service';
import { saveAs } from 'file-saver';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_DD_MM_YYYY, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { NgForm, UntypedFormControl } from '@angular/forms';
import { LocationService } from '../../../services/location.service';
import { BranchHierarchyType, GIDDH_DATE_RANGE_PICKER_RANGES, IOption, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from '../../../app.constant';
import { GeneralService } from '../../../services/general.service';
import { Router } from '@angular/router';
import { OrganizationType } from '../../../models/user-login-state';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { GstReconcileService } from '../../../services/gst-reconcile.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { cloneDeep } from '../../../lodash-optimized';
import { InvoiceReceiptActions } from '../../../actions/invoice/receipt/receipt.actions';
import { VoucherComponentStore } from '../../../vouchers/utility/vouchers.store';
import { VoucherTypeEnum } from '../../../vouchers/utility/vouchers.const';
import { PageEvent } from '@angular/material/paginator';
import { EwayBillComponentStore } from '../utility/eWayBill.store';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-ewaybill-component',
    templateUrl: './eWayBill.component.html',
    styleUrls: [`./eWayBill.component.scss`],
    providers: [VoucherComponentStore, EwayBillComponentStore],
    standalone:false
})

export class EWayBillComponent implements OnInit, OnDestroy {
    @ViewChild('cancelEwayForm', { static: true }) public cancelEwayForm: NgForm;
    @ViewChild('updateVehicleForm', { static: true }) public updateVehicleForm: NgForm;
    /** Holds vehicle dialog template reference */
    @ViewChild("addVehicle") vehicleDialog: TemplateRef<any>;
    /** Holds cancellation dialog template reference */
    @ViewChild("cancellation") cancelDialog: TemplateRef<any>;
    /* This will hold the boolean value to open/close setting sidebar popup */
    public asideGstSidebarMenuState: boolean = true;
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    public isGetAllEwaybillRequestInProcess$: Observable<boolean>;
    public isGetAllEwaybillRequestSuccess$: Observable<boolean>;
    public cancelEwayInProcess$: Observable<boolean>;
    public cancelEwaySuccess$: Observable<boolean>;
    public updateEwayvehicleProcess$: Observable<boolean>;
    public updateEwayvehicleSuccess$: Observable<boolean>;
    /** Holds list of eway bill */
    public ewaybillLists: IEwayBillAllList;
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** True if api call in progress */
    public isLoading: boolean = true;
    public selectedEwayItem: any;
    public updateEwayVehicleObj: any[] = [];
    public statesSource$: Observable<IOption[]> = observableOf([]);
    public dataSource: any;
    public dataSourceBackup: any;
    public showAdvanceSearchIcon: boolean = false;
    /** Search results for from place */
    public searchResults: Array<any> = [];
    // searching
    @ViewChild('invoiceSearch', { static: true }) public invoiceSearch: ElementRef;
    @ViewChild('customerSearch', { static: true }) public customerSearch: ElementRef;
    public voucherNumberInput: UntypedFormControl = new UntypedFormControl();
    public customerNameInput: UntypedFormControl = new UntypedFormControl();
    public showSearchInvoiceNo: boolean = false;
    public showSearchCustomer: boolean = false;
    public EwayBillfilterRequest: IEwayBillfilter = new IEwayBillfilter();
    public cancelEwayRequest: IEwayBillCancel = {
        ewbNo: null,
        cancelRsnCode: null,
        cancelRmrk: null,
    };
    public ewayUpdateVehicleReasonList: IOption[] = [];
    public ewayCancelReason: IOption[] = [];
    public updateEwayVehicleform: UpdateEwayVehicle = {
        ewbNo: null,
        vehicleNo: null,
        fromPlace: null,
        fromState: null,
        reasonCode: null,
        reasonRem: null,
        transDocNo: null,
        transDocDate: null,
        transMode: null,
        vehicleType: null,
    };
    public selectedEway: Result;
    public states: any[] = [];
    /** Reference to the universal datepicker menu trigger */
    @ViewChild('universalDatepickerTrigger') public universalDatepickerTrigger: MatMenuTrigger;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* dayjs object */
    public dayjs = dayjs;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* Universal date observer */
    public universalDate$: Observable<any>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if today selected */
    public todaySelected: boolean = false;
    /** True if dropdown menu needs to show upwards */
    public isDropUp: boolean = false;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** Stores the current company */
    public activeCompany: any;
    /** This will be hold for universal date */
    public universalDate: any[] = [];
    /** True if initial api got called */
    public initialApiCalled: boolean = false;
    /** Stores the tax details of a company */
    public taxes: IOption[] = [];
    /** Holds active tab index */
    public activeTabIndex: number = 0;
    /** Stores the selected tab */
    public selectedTab: string;
    /** Stores the displayed columns */
    public displayedColumns: string[] = ['index', 'invoiceDate', 'docNumber', 'customerName', 'customerGstin', 'ewbNo', 'ewayBillDate', 'totalValue', 'actions'];
    /** Stores the cancel dialog reference */
    public cancelDialogRef: MatDialogRef<any>;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Holds page size options for pagination */
    public pageSizeOptions: any[] = PAGE_SIZE_OPTIONS;
    /** Holds Store Eway Bill from place by pincode API response state as observable*/
    public ewayBillFromPlace$: Observable<any> = this.componentStore.select(state => state.fromPlace);
    /** Voucher API Version */
    public voucherApiVersion: number;

    constructor(
        private store: Store<AppState>,
        private invoiceActions: InvoiceActions,
        private invoiceService: InvoiceService,
        private _toaster: ToasterService,
        private _location: LocationService,
        private _cd: ChangeDetectorRef,
        private generalService: GeneralService,
        private router: Router,
        private settingsBranchAction: SettingsBranchActions,
        private gstReconcileService: GstReconcileService,
        public dialog: MatDialog,
        private invoiceReceiptActions: InvoiceReceiptActions,
        private voucherComponentStore: VoucherComponentStore,
        private componentStore: EwayBillComponentStore,
        private renderer: Renderer2
    ) {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.EwayBillfilterRequest.count = PAGINATION_LIMIT;
        this.EwayBillfilterRequest.page = 1;

        this.isGetAllEwaybillRequestInProcess$ = this.store.pipe(select(p => p.ewaybillstate.isGetAllEwaybillRequestInProcess), takeUntil(this.destroyed$));
        this.isGetAllEwaybillRequestSuccess$ = this.store.pipe(select(p => p.ewaybillstate.isGetAllEwaybillRequestSuccess), takeUntil(this.destroyed$));

        this.cancelEwayInProcess$ = this.store.pipe(select(p => p.ewaybillstate.cancelEwayInProcess), takeUntil(this.destroyed$));
        this.cancelEwaySuccess$ = this.store.pipe(select(p => p.ewaybillstate.cancelEwaySuccess), takeUntil(this.destroyed$));

        this.updateEwayvehicleProcess$ = this.store.pipe(select(p => p.ewaybillstate.updateEwayvehicleInProcess), takeUntil(this.destroyed$));
        this.updateEwayvehicleSuccess$ = this.store.pipe(select(p => p.ewaybillstate.updateEwayvehicleSuccess), takeUntil(this.destroyed$));

        // bind state sources
        this.store.pipe(select(s => s.general.states), takeUntil(this.destroyed$)).subscribe(res => {
            if (res && res.stateList) {
                Object.keys(res.stateList).forEach(key => {
                    this.states.push({ label: res.stateList[key].code + ' - ' + res.stateList[key].name, value: res.stateList[key].stateGstCode });
                });
                this.statesSource$ = observableOf(this.states);
            }
        });

        this.store.pipe(select(state => state.gstR?.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.EwayBillfilterRequest.gstin = response;
            }
        });
    }

    public selectedDate(value: any) {
        if (value) {
            this.EwayBillfilterRequest.fromDate = dayjs(value.picker.startDate.$d).format(GIDDH_DATE_FORMAT);
            this.EwayBillfilterRequest.toDate = dayjs(value.picker.endDate.$d).format(GIDDH_DATE_FORMAT);
        }
        this.getAllFilteredInvoice();
    }

    public ngOnInit(): void {
        this.updateEwayVehicleform.transDocDate = dayjs().toDate();
        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
        this.renderer.addClass(document.body, 'gst-sidebar-open');
        this.loadTaxDetails();
        this.cancelEwaySuccess$.subscribe(p => {
            if (p) {
                this.store.dispatch(this.invoiceActions.getALLEwaybillList());
                this.cancelEwayForm.reset();
                this.cancelDialogRef?.close();
            }
        });
        this.updateEwayvehicleSuccess$.subscribe(p => {
            if (p) {
                this.updateVehicleForm.reset();
            }
        });
        this.store.pipe(select(state => state.ewaybillstate.EwayBillList), takeUntil(this.destroyed$)).subscribe((response: IEwayBillAllList) => {
            if (response) {
                this.ewaybillLists = cloneDeep(response);
                this.ewaybillLists.results = response.results;

                if (this.todaySelected) {
                    this.selectedDateRange = { startDate: dayjs(response.fromDate, GIDDH_DATE_FORMAT), endDate: dayjs(response.toDate, GIDDH_DATE_FORMAT) };
                    this.selectedDateRangeUi = dayjs(response.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(response.toDate, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
                    this.fromDate = dayjs(response.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                    this.toDate = dayjs(response.toDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                    this.EwayBillfilterRequest.fromDate = dayjs(response.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                    this.EwayBillfilterRequest.toDate = dayjs(response.toDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                }
                this.detectChange();
            }
        });

        this.dataSource = (text$: Observable<any>): Observable<any> => {
            return text$.pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((term: string) => {
                    if (term.startsWith(' ', 0)) {
                        return [];
                    }
                    return this._location.GetCity({
                        QueryString: this.updateEwayVehicleform.fromPlace,
                        AdministratorLevel: undefined,
                        Country: undefined,
                        OnlyCity: true
                    }).pipe(catchError(e => {
                        return [];
                    }));
                }),
                map((res) => {
                    let data = res.map(item => item.city);
                    this.dataSourceBackup = res;
                    return data;
                }), takeUntil(this.destroyed$));
        };

        this.voucherNumberInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.EwayBillfilterRequest.sort = null;
            this.EwayBillfilterRequest.sortBy = null;
            this.EwayBillfilterRequest.searchTerm = s;
            this.EwayBillfilterRequest.searchOn = 'invoiceNumber';
            this.getAllFilteredInvoice();
            if (s === '') {
                this.showSearchInvoiceNo = false;
            }
        });
        this.customerNameInput.valueChanges.pipe(debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.EwayBillfilterRequest.sort = null;
            this.EwayBillfilterRequest.sortBy = null;
            this.EwayBillfilterRequest.searchTerm = s;
            this.EwayBillfilterRequest.searchOn = 'customerName';
            this.getAllFilteredInvoice();
        });

        this.store.pipe(select(state => state.ewaybillstate.isGetAllEwaybillRequestInProcess), takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = response;
        });

        this.currentOrganizationType = this.generalService.currentOrganizationType;

        this.store.pipe(
            select(state => state.session.activeCompany), takeUntil(this.destroyed$)
        ).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });

        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch.name,
                    value: branch?.uniqueName,
                    name: branch.name,
                    parentBranch: branch.parentBranch,
                    consolidatedBranch: branch?.consolidatedBranch
                }));
                this.currentCompanyBranches.unshift({
                    label: this.activeCompany ? this.activeCompany.name : '',
                    name: this.activeCompany ? this.activeCompany.name : '',
                    value: this.activeCompany ? this.activeCompany?.uniqueName : '',
                    isCompany: true
                });
                let currentBranchUniqueName;
                if (!this.currentBranch || !this.currentBranch?.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded
                    if (this.currentOrganizationType === OrganizationType.Branch) {
                        currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                        this.currentBranch = cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName)) || this.currentBranch;
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany?.uniqueName : '';
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : '',
                            alias: this.activeCompany ? this.activeCompany.nameAlias : '',
                            uniqueName: this.activeCompany ? this.activeCompany?.uniqueName : '',
                        };
                    }
                }
                this.EwayBillfilterRequest.branchUniqueName = (this.currentBranch) ? this.currentBranch?.uniqueName : "";
                if (!this.initialApiCalled) {
                    this.initialApiCalled = true;
                    this.initialRequest();
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                }
            }
        });

        this.ewayBillFromPlace$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.updateEwayVehicleform.fromPlace = response;
            }
        });
    }

    public getAllFilteredInvoice() {
        this.store.dispatch(this.invoiceActions.GetAllEwayfilterRequest(this.preparemodelForFilterEway()));
        this.detectChange();
    }

    /**
     * This functtion will be use for initial request for universal date according to eway bill filter
     *
     * @memberof EWayBillComponent
     */
    public initialRequest() {
        this.showAdvanceSearchIcon = false;
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj) => {
            if (dateObj) {
                let universalDate = cloneDeep(dateObj);

                this.store.pipe(select(state => state.session.todaySelected), take(1)).subscribe(response => {
                    this.todaySelected = response;
                    if (!response) {
                        this.selectedDateRange = { startDate: dayjs(universalDate[0]), endDate: dayjs(universalDate[1]) };
                        this.selectedDateRangeUi = dayjs(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                        this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                        this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);

                        this.EwayBillfilterRequest.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                        this.EwayBillfilterRequest.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                    } else {
                        this.EwayBillfilterRequest.fromDate = "";
                        this.EwayBillfilterRequest.toDate = "";
                    }
                    this.EwayBillfilterRequest.page = 0;
                    this.getAllFilteredInvoice();
                });
            }
        });
    }

    /**
     * Branch change handler
     *
     * @memberof EWayBillComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
        this.EwayBillfilterRequest.branchUniqueName = selectedEntity?.value;
        this.getAllFilteredInvoice();
    }

    /**
     * Search query handler for from place field
     *
     * @param {string} query Query to search for from place
     * @memberof EWayBillComponent
     */
    public onSearchQueryChanged(query: string): void {
        this._location.GetCity({
            QueryString: query,
            AdministratorLevel: undefined,
            Country: undefined,
            OnlyCity: true
        }).pipe(catchError(e => {
            this.searchResults = [];
            return [];
        }), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.searchResults = response.map(item => ({
                    ...item,
                    label: item.city,
                    value: item.city
                }));
            }
        });
    }

    public onSelectEwayDownload(eway: Result) {
        this.selectedEway = cloneDeep(eway);
        this.invoiceService.DownloadEwayBills(this.selectedEway.ewbNo).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === 'success') {
                let blob = this.generalService.base64ToBlob(response.body.data, 'application/pdf', 512);
                return saveAs(blob, response.body.name);
            } else {
                this._toaster.errorToast(response?.message);
            }
        });
    }

    public onSelectEwayDetailedDownload(ewayItem: Result) {
        this.selectedEway = cloneDeep(ewayItem);
        this.invoiceService.DownloadDetailedEwayBills(this.selectedEway.ewbNo).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === 'success') {
                let blob = this.generalService.base64ToBlob(response.body.data, 'application/pdf', 512);
                return saveAs(blob, response.body.name);
            } else {
                this._toaster.errorToast(response?.message);
            }
        });
    }

    /**
     * Open add vehicle/cancel dialog
     *
     * @memberof EWayBillComponent
     */
    public openAddVehicleOrCancelDialog(dialogType: 'vehicle' | 'cancel', ewayItem: Result | any): void {
        this.selectedEwayItem = ewayItem;
        const dialogConfig = {
            panelClass: "mat-dialog-md",
            disableClose: true
        };

        if (dialogType === 'vehicle') {
            this.componentStore.getEwayBillFromPlace(ewayItem?.pincode);
            this.dialog.open(this.vehicleDialog, dialogConfig);
        } else if (dialogType === 'cancel') {
            this.cancelDialogRef = this.dialog.open(this.cancelDialog, dialogConfig);
        }
    }

    /**
     * Cancel eway bill
     *
     * @param {any} cancelEwayFormValue
     * @memberof EWayBillComponent
     */
    public cancelEwayBill(cancelEwayFormValue: any): void {
        if (cancelEwayFormValue) {
            this.cancelEwayRequest = cloneDeep(cancelEwayFormValue);
            this.cancelEwayRequest['ewbNo'] = this.selectedEwayItem.ewbNo;
            this.store.dispatch(this.invoiceActions.cancelEwayBill(this.cancelEwayRequest));
        }
        this.detectChange();
    }

    /**
     * Update eway transport
     *
     * @param {any} updateEwayTransportfromValue
     * @memberof EWayBillComponent
     */
    public updateEwayTransport(updateEwayTransportFormValue: any): void {
        if (updateEwayTransportFormValue) {
            this.updateEwayVehicleObj = updateEwayTransportFormValue;
            this.updateEwayVehicleObj['ewbNo'] = this.selectedEwayItem.ewbNo;
            this.updateEwayVehicleObj['transDocDate'] = this.updateEwayVehicleform['transDocDate'] ? dayjs(this.updateEwayVehicleform['transDocDate']).format(GIDDH_DATE_FORMAT_DD_MM_YYYY) : null;
            this.store.dispatch(this.invoiceActions.UpdateEwayVehicle(updateEwayTransportFormValue));
        }
        this.detectChange();
    }

    public sortbyApi(key, ord) {
        this.EwayBillfilterRequest.searchOn = null;
        this.EwayBillfilterRequest.searchTerm = null;
        this.EwayBillfilterRequest.sortBy = key;
        this.EwayBillfilterRequest.sort = ord;
        this.getAllFilteredInvoice();
    }
    public toggleSearch(fieldName: string) {
        if (fieldName === 'invoiceNumber') {
            this.showSearchInvoiceNo = true;
            this.showSearchCustomer = false;

            setTimeout(() => {
                if (this.invoiceSearch && this.invoiceSearch.nativeElement) {
                    this.invoiceSearch.nativeElement.focus();
                }
            }, 200);
        } else if (fieldName === 'customerUniqueName') {
            this.showSearchCustomer = true;
            this.showSearchInvoiceNo = false;
            setTimeout(() => {
                if (this.customerSearch && this.customerSearch.nativeElement) {
                    this.customerSearch.nativeElement.focus();
                }
            }, 200);
        } else {
            this.showSearchInvoiceNo = false;
            this.showSearchCustomer = false;
        }
        this.detectChange();
    }
    public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {
        this.showAdvanceSearchIcon = true;
        if (this.showAdvanceSearchIcon) {
            this.EwayBillfilterRequest.sort = type
            this.EwayBillfilterRequest.sortBy = columnName;
            this.store.dispatch(this.invoiceActions.GetAllEwayfilterRequest(this.preparemodelForFilterEway()));
        }
    }

    public clickedOutside() {
        this.showSearchInvoiceNo = false;
        this.showSearchCustomer = false;

    }
    detectChange() {
       if (!this._cd['destroyed']) {
            this._cd.detectChanges();
        }
    }

    public preparemodelForFilterEway(): IEwayBillfilter {
        let model: any = {

        };
        let request = cloneDeep(this.EwayBillfilterRequest);
        if (request.fromDate) {
            model.fromDate = request.fromDate;
        }
        if (request.toDate) {
            model.toDate = request.toDate;
        }
        if (request.sort) {
            model.sort = request.sort;
        }
        if (request.sortBy) {
            model.sortBy = request.sortBy;
        }

        if (request.searchOn) {
            model.searchOn = request.searchOn;
        }
        if (request.searchTerm) {
            model.searchTerm = request.searchTerm;
        }
        if (request.count) {
            model.count = request.count;
        }
        if (request.page) {
            model.page = request.page;
        }
        if (request.branchUniqueName) {
            model.branchUniqueName = request.branchUniqueName;
        }
        if (request.gstin) {
            model.gstin = request.gstin;
        }
        if (request.failedRequestLog) {
            model.failedRequestLog = request.failedRequestLog;
        }

        return model;
    }

    /**
     * Toggles the datepicker menu
     *
     * @memberof EWayBillComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean): void {
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value - Value from the datepicker component
     * @memberof EWayBillComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
        if (value && value.startDate && value.endDate) {
            this.todaySelected = false;
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.EwayBillfilterRequest.fromDate = this.fromDate;
            this.EwayBillfilterRequest.toDate = this.toDate;
            this.getAllFilteredInvoice();
        }
    }

    /**
     * Releases memory
     *
     * @memberof EWayBillComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.renderer.removeClass(document.body, 'gst-sidebar-open');
        this.asideGstSidebarMenuState = false;
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof EWayBillComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.ewayUpdateVehicleReasonList = [
                { value: '1', label: this.localeData?.vehicle_reason_list?.break_down },
                { value: '2', label: this.localeData?.vehicle_reason_list?.transshipment },
                { value: '3', label: this.localeData?.vehicle_reason_list?.others },
                { value: '4', label: this.localeData?.vehicle_reason_list?.first_time }
            ];

            this.ewayCancelReason = [
                { value: '1', label: this.localeData?.cancel_reason_list?.duplicate },
                { value: '2', label: this.localeData?.cancel_reason_list?.order_cancelled },
                { value: '3', label: this.localeData?.cancel_reason_list?.data_entry_mistake },
                { value: '4', label: this.localeData?.cancel_reason_list?.others }
            ];
        }
    }

    /**
     * Handles GST Sidebar Navigation
     *
     * @memberof EWayBillComponent
     */
    public handleNavigation(): void {
        this.router.navigate(['pages', 'gstfiling']);
    }

    /**
     * This will determine if dropdown menu needs to show downwards or upwards
     *
     * @param {*} event
     * @memberof EWayBillComponent
     */
    public showActionsMenu(event: any) {
        const screenHeight = event?.view?.innerHeight;
        const clickedPosition = event?.y;
        const actionPopupHeight = 300;
        const calculatedPosition = screenHeight - clickedPosition;

        if (calculatedPosition > actionPopupHeight) {
            this.isDropUp = false;
        } else {
            this.isDropUp = true;
        }

        this._cd.detectChanges();
    }

    /**
     * Loads the tax details of a company
     *
     * @private
     * @memberof EWayBillComponent
     */
    private loadTaxDetails(): void {
        this.gstReconcileService.getTaxDetails().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body) {
                this.taxes = response.body.map(tax => ({
                    label: tax,
                    value: tax
                }));

                if (!this.EwayBillfilterRequest.gstin && this.taxes?.length > 0) {
                    this.EwayBillfilterRequest.gstin = this.taxes[0]?.value;
                    if (this.initialApiCalled) {
                        this.selectTax();
                    }
                }
            }
        });
    }

    /**
     * Select tax handler
     *
     * @param {*} [event]
     * @memberof EWayBillComponent
     */
    public selectTax(event?: any): void {
        if (event && event.value) {
            this.EwayBillfilterRequest.gstin = event.value;
        }

        if ((this.currentCompanyBranches?.length > 2 && (this.currentOrganizationType === 'COMPANY' || this.isConsolidatedBranch)) || this.EwayBillfilterRequest.gstin) {
            this.EwayBillfilterRequest.page = 0;
            this.getAllFilteredInvoice();
        }
    }

    /**
     * This will use for on tab changes
     *
     * @param {*} event
     * @memberof EWayBillComponent
     */
    public onTabChange(event: MatTabChangeEvent): void {
        if (!event || event.index === this.activeTabIndex) return;

        const colsToRemove = ['status', 'reason', 'ewbNo', 'ewayBillDate'];
        this.displayedColumns = this.displayedColumns.filter(col => !colsToRemove.includes(col));
        if (event.index === 0) {
            this.displayedColumns.splice(-2, 0, 'ewbNo', 'ewayBillDate');
            this.EwayBillfilterRequest.failedRequestLog = false;
        } else if (event.index === 1) {
            this.displayedColumns.splice(-2, 0, 'status', 'reason');
            this.EwayBillfilterRequest.failedRequestLog = true;
        }
        this.activeTabIndex = event.index;
        this.selectedTab = event.tab.textLabel;
        this.getAllFilteredInvoice();
    }

    /**
     * This will generate eway bill for selected voucher
     *
     * @param {any} voucher
     * @memberof EWayBillComponent
     */
    public onGenerateEwayBill(voucher: any): void {
        this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
        this.invoiceService.selectedInvoicesLists = [];
        this.invoiceService.VoucherType = "";
        this.store.dispatch(this.invoiceReceiptActions.getVoucherDetailsV4(voucher.uniqueName, {
            invoiceNumber: voucher.voucherNumber,
            voucherType: VoucherTypeEnum.sales,
            uniqueName: voucher.uniqueName
        }));
        voucher['voucherDate'] = voucher?.invoiceDate;
        this.invoiceService.setSelectedInvoicesList([voucher]);
        setTimeout(() => {
            this.voucherComponentStore.createEwayBill$.pipe(take(1)).subscribe(response => {
                if (!response?.account?.billingDetails?.pincode) {
                    this._toaster.showSnackBar("error", this.localeData?.pincode_required);
                } else {
                    this.router.navigate(['pages', 'invoice', 'ewaybill', 'create']);
                }
            });
        }, 500);
    }

    /** Handles page change events and makes an API call to fetch data for the new page.
     *
     * @param {PageEvent} event - The event containing pagination details.
     * @memberof EWayBillComponent
     */
    public handlePageChange(event: PageEvent): void {
        let isPageSizeChanged = this.EwayBillfilterRequest.count !== event.pageSize;
        this.EwayBillfilterRequest.page = isPageSizeChanged ? 1 : event.pageIndex + 1;
        this.EwayBillfilterRequest.count = event.pageSize;
        this.getAllFilteredInvoice();
    }
}

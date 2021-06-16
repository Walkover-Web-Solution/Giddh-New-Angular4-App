import { Component, OnInit, TemplateRef, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { InvoiceActions } from '../../../actions/invoice/invoice.actions';
import { InvoiceService } from '../../../services/invoice.service';
import { AppState } from '../../../store';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment/moment';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
import { IEwayBillAllList, IEwayBillCancel, Result, UpdateEwayVehicle, IEwayBillfilter } from '../../../models/api-models/Invoice';
import { base64ToBlob } from '../../../shared/helpers/helperFunctions';
import { ToasterService } from '../../../services/toaster.service';
import { saveAs } from 'file-saver';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { NgForm, FormControl } from '@angular/forms';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { LocationService } from '../../../services/location.service';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import { GeneralService } from '../../../services/general.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-ewaybill-component',
    templateUrl: './eWayBill.component.html',
    styleUrls: [`./eWayBill.component.scss`]
})

export class EWayBillComponent implements OnInit, OnDestroy {
    @ViewChild('cancelEwayForm', { static: true }) public cancelEwayForm: NgForm;
    @ViewChild('updateVehicleForm', { static: true }) public updateVehicleForm: NgForm;
    /* This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /* this will check mobile screen size */
    public isMobileScreen: boolean = false;

    public isGetAllEwaybillRequestInProcess$: Observable<boolean>;
    public isGetAllEwaybillRequestSuccess$: Observable<boolean>;
    public cancelEwayInProcess$: Observable<boolean>;
    public cancelEwaySuccess$: Observable<boolean>;

    public updateEwayvehicleProcess$: Observable<boolean>;
    public updateEwayvehicleSuccess$: Observable<boolean>;
    public EwaybillLists: IEwayBillAllList;
    public modalRef: BsModalRef;
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
    public voucherNumberInput: FormControl = new FormControl();
    public customerNameInput: FormControl = new FormControl();
    public showSearchInvoiceNo: boolean = false;
    public showSearchCustomer: boolean = false;
    public EwayBillfilterRequest: IEwayBillfilter = new IEwayBillfilter();


    public cancelEwayRequest: IEwayBillCancel = {
        ewbNo: null,
        cancelRsnCode: null,
        cancelRmrk: null,
    };
    public ewayUpdateVehicleReasonList: IOption[] = [];

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
            'Last 1 Day': [
                moment().subtract(1, 'days'),
                moment()
            ],
            'Last 7 Days': [
                moment().subtract(6, 'days'),
                moment()
            ],
            'Last 30 Days': [
                moment().subtract(29, 'days'),
                moment()
            ],
            'Last 6 Months': [
                moment().subtract(6, 'months'),
                moment()
            ],
            'Last 1 Year': [
                moment().subtract(12, 'months'),
                moment()
            ]
        },
        startDate: moment().subtract(30, 'days'),
        endDate: moment()
    };

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

    @ViewChild(BsDatepickerDirective, { static: true }) public datepickers: BsDatepickerDirective;
    public selectedEway: Result;
    public states: any[] = [];
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Moment object */
    public moment = moment;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* Universal date observer */
    public universalDate$: Observable<any>;
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private store: Store<AppState>,
        private invoiceActions: InvoiceActions,
        private _invoiceService: InvoiceService,
        private _toaster: ToasterService,
        private modalService: BsModalService,
        private _location: LocationService,
        private _cd: ChangeDetectorRef,
        private generalService: GeneralService,
        private breakpointObserver: BreakpointObserver,
        private router: Router
    ) {
        this.EwayBillfilterRequest.count = 20;
        this.EwayBillfilterRequest.page = 1;
        this.EwayBillfilterRequest.fromDate = moment(this.datePickerOptions.startDate).format(GIDDH_DATE_FORMAT);
        this.EwayBillfilterRequest.toDate = moment(this.datePickerOptions.endDate).format(GIDDH_DATE_FORMAT);

        this.isGetAllEwaybillRequestInProcess$ = this.store.pipe(select(p => p.ewaybillstate.isGetAllEwaybillRequestInProcess), takeUntil(this.destroyed$));
        this.isGetAllEwaybillRequestSuccess$ = this.store.pipe(select(p => p.ewaybillstate.isGetAllEwaybillRequestSuccess), takeUntil(this.destroyed$));

        this.cancelEwayInProcess$ = this.store.pipe(select(p => p.ewaybillstate.cancelEwayInProcess), takeUntil(this.destroyed$));
        this.cancelEwaySuccess$ = this.store.pipe(select(p => p.ewaybillstate.cancelEwaySuccess), takeUntil(this.destroyed$));

        this.updateEwayvehicleProcess$ = this.store.pipe(select(p => p.ewaybillstate.updateEwayvehicleInProcess), takeUntil(this.destroyed$));
        this.updateEwayvehicleSuccess$ = this.store.pipe(select(p => p.ewaybillstate.updateEwayvehicleSuccess), takeUntil(this.destroyed$));

        // bind state sources
        this.store.pipe(select(s => s.general.states), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res.stateList).forEach(key => {
                    this.states.push({ label: res.stateList[key].code + ' - ' + res.stateList[key].name, value: res.stateList[key].code });
                });
                this.statesSource$ = observableOf(this.states);
            }
        });

        this.breakpointObserver
        .observe(['(max-width: 767px)'])
        .pipe(takeUntil(this.destroyed$))
        .subscribe((state: BreakpointState) => {
            this.isMobileScreen = state.matches;
            if (!this.isMobileScreen) {
                this.asideGstSidebarMenuState = 'in';
            }
        });
        this.store.pipe(select(appState => appState.general.openGstSideMenu), takeUntil(this.destroyed$)).subscribe(shouldOpen => {
            if (this.isMobileScreen) {
                if (shouldOpen) {
                    this.asideGstSidebarMenuState = 'in';
                } else {
                    this.asideGstSidebarMenuState = 'out';
                }
            }
        });
    }

    public selectedDate(value: any) {
        if (value) {
            this.EwayBillfilterRequest.fromDate = moment(value.picker.startDate._d).format(GIDDH_DATE_FORMAT);
            this.EwayBillfilterRequest.toDate = moment(value.picker.endDate._d).format(GIDDH_DATE_FORMAT);
        }
        this.getAllFilteredInvoice();
    }

    public ngOnInit(): void {
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.cancelEwaySuccess$.subscribe(p => {
            if (p) {
                this.store.dispatch(this.invoiceActions.getALLEwaybillList());
                this.cancelEwayForm.reset();
                this.closeModel();
            }
        });
        this.updateEwayvehicleSuccess$.subscribe(p => {
            if (p) {
                this.updateVehicleForm.reset();
                this.modalRef.hide();
            }
        });
        this.store.pipe(select(p => p.ewaybillstate.EwayBillList), takeUntil(this.destroyed$)).subscribe((o: IEwayBillAllList) => {
            if (o) {
                this.EwaybillLists = _.cloneDeep(o);
                this.EwaybillLists.results = o.results;
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
                    // let data = res.map(item => item.address_components[0].long_name);
                    let data = res.map(item => item.city);
                    this.dataSourceBackup = res;
                    return data;
                }), takeUntil(this.destroyed$));
        };

        // Refresh report data according to universal date
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj) => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.datePickerOptions = {
                    ...this.datePickerOptions, startDate: moment(universalDate[0], GIDDH_DATE_FORMAT).toDate(),
                    endDate: moment(universalDate[1], GIDDH_DATE_FORMAT).toDate(),
                    chosenLabel: universalDate[2]
                };
                this.selectedDateRange = { startDate: moment(dateObj[0]), endDate: moment(dateObj[1]) };
                this.selectedDateRangeUi = moment(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.EwayBillfilterRequest.fromDate = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.EwayBillfilterRequest.toDate = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.getAllFilteredInvoice();
            }
        });

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
    }

    public getAllFilteredInvoice() {
        this.store.dispatch(this.invoiceActions.GetAllEwayfilterRequest(this.preparemodelForFilterEway()));
        this.detectChange();
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
        this.selectedEway = _.cloneDeep(eway);
        this._invoiceService.DownloadEwayBills(this.selectedEway.ewbNo).pipe(takeUntil(this.destroyed$)).subscribe(d => {

            if (d.status === 'success') {
                let blob = base64ToBlob(d.body, 'application/pdf', 512);
                return saveAs(blob, `${this.selectedEway.ewbNo} - ${this.selectedEway.customerName}.pdf`);
            } else {
                this._toaster.errorToast(d.message);
            }
        });
    }

    public onSelectEwayDetailedDownload(ewayItem: Result) {
        this.selectedEway = _.cloneDeep(ewayItem);
        this._invoiceService.DownloadDetailedEwayBills(this.selectedEway.ewbNo).pipe(takeUntil(this.destroyed$)).subscribe(d => {
            if (d.status === 'success') {
                let blob = base64ToBlob(d.body, 'application/pdf', 512);
                return saveAs(blob, `${this.selectedEway.ewbNo} - ${this.selectedEway.customerName}.pdf`);
            } else {
                this._toaster.errorToast(d.message);
            }
        });
    }

    public openModal(ewayItem: any, template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
        this.selectedEwayItem = ewayItem;
    }

    public openModalWithClass(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(
            template,
            Object.assign({}, { class: 'modal-xl modal-consolidated-details' })
        );
    }
    public cancelEwayBill(cancelEway: NgForm) {

        this.cancelEwayRequest = _.cloneDeep(cancelEway.value);
        this.cancelEwayRequest.ewbNo = this.selectedEwayItem.ewbNo;
        if (cancelEway.valid) {
            this.store.dispatch(this.invoiceActions.cancelEwayBill(this.cancelEwayRequest));
        }

    }

    public updateEwayTransport(updateEwayTransportfrom: NgForm) {

        this.updateEwayVehicleObj = updateEwayTransportfrom.value;
        this.updateEwayVehicleObj['ewbNo'] = this.selectedEwayItem.ewbNo;
        this.updateEwayVehicleObj['transDocDate'] = this.updateEwayVehicleform['transDocDate'] ? moment(this.updateEwayVehicleform['transDocDate']).format('DD/MM/YYYY') : null;
        if (updateEwayTransportfrom.valid) {
            this.store.dispatch(this.invoiceActions.UpdateEwayVehicle(updateEwayTransportfrom.value));
        }
        this.detectChange();
    }
    public closeModel() {
        this.modalRef.hide();
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
                this.invoiceSearch?.nativeElement.focus();
            }, 200);
        } else if (fieldName === 'customerUniqueName') {
            this.showSearchCustomer = true;
            this.showSearchInvoiceNo = false;
            setTimeout(() => {
                this.customerSearch?.nativeElement.focus();
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
            // this.advanceSearchFilter.from = this.invoiceSearchRequest.from;
            // this.advanceSearchFilter.to = this.invoiceSearchRequest.to;
            this.store.dispatch(this.invoiceActions.GetAllEwayfilterRequest(this.preparemodelForFilterEway()));
        } else {
            // if (this.invoiceSearchRequest.sort !== type || this.invoiceSearchRequest.sortBy !== columnName) {
            //   this.invoiceSearchRequest.sort = type;
            //   this.invoiceSearchRequest.sortBy = columnName;
            //   this.getVoucher(this.isUniversalDateApplicable);
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
        let o = _.cloneDeep(this.EwayBillfilterRequest);
        if (o.fromDate) {
            model.fromDate = o.fromDate;
        }
        if (o.toDate) {
            model.toDate = o.toDate;
        }
        if (o.sort) {
            model.sort = o.sort;
        }
        if (o.sortBy) {
            model.sortBy = o.sortBy;
        }

        if (o.searchOn) {
            model.searchOn = o.searchOn;
        }
        if (o.searchTerm) {
            model.searchTerm = o.searchTerm;
        }
        if (o.count) {
            model.count = o.count;
        }
        if (o.page) {
            model.page = o.page;
        }

        return model;
    }

    /**
     * To show the datepicker
     *
     * @param {*} element
     * @memberof EWayBillComponent
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
     * @memberof EWayBillComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof EWayBillComponent
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
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState === 'out';
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
}

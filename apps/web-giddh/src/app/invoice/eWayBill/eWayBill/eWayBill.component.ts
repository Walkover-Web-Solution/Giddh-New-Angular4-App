import { Component, OnInit, TemplateRef, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { InvoiceActions } from '../../../actions/invoice/invoice.actions';
import { InvoiceService } from '../../../services/invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
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
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { NgForm, FormControl } from '@angular/forms';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { LocationService } from '../../../services/location.service';
import { createSelector } from 'reselect';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-ewaybill-component',
    templateUrl: './eWayBill.component.html',
    styleUrls: [`./eWayBill.component.scss`]
})

export class EWayBillComponent implements OnInit {
    @ViewChild('cancelEwayForm') public cancelEwayForm: NgForm;
    @ViewChild('updateVehicleForm') public updateVehicleForm: NgForm;

    public isGetAllEwaybillRequestInProcess$: Observable<boolean>;
    public isGetAllEwaybillRequestSuccess$: Observable<boolean>;
    public cancelEwayInProcess$: Observable<boolean>;
    public cancelEwaySuccess$: Observable<boolean>;

    public updateEwayvehicleProcess$: Observable<boolean>;
    public updateEwayvehicleSuccess$: Observable<boolean>;
    public EwaybillLists: IEwayBillAllList;
    public modalRef: BsModalRef;
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    public needToShowLoader: boolean = true;
    public selectedEwayItem: any;
    public updateEwayVehicleObj: any[] = [];
    public statesSource$: Observable<IOption[]> = observableOf([]);
    public dataSource: any;
    public dataSourceBackup: any;

    public showAdvanceSearchIcon: boolean = false;

    // searching
    @ViewChild('invoiceSearch') public invoiceSearch: ElementRef;
    @ViewChild('customerSearch') public customerSearch: ElementRef;
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
    public ewayUpdateVehicleReasonList: IOption[] = [
        { value: '1', label: 'Due to Break Down' },
        { value: '2', label: 'Due to Transshipment' },
        { value: '3', label: 'Others' },
        { value: '4', label: 'First Time' },
    ];

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

    public ewayCancelReason: IOption[] = [
        { value: '1', label: 'Duplicate' },
        { value: '2', label: 'Order cancelled' },
        { value: '3', label: 'Data Entry Mistake' },
        { value: '4', label: 'Others' },
    ];
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

    @ViewChild(BsDatepickerDirective) public datepickers: BsDatepickerDirective;
    public selectedEway: Result;
    public states: any[] = [];

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private invoiceActions: InvoiceActions,
        private _invoiceService: InvoiceService,
        private _activatedRoute: ActivatedRoute,
        private _toaster: ToasterService,
        private modalService: BsModalService,
        private router: Router,
        private _location: LocationService,
        private _cd: ChangeDetectorRef
    ) {
        this.EwayBillfilterRequest.count = 20;
        this.EwayBillfilterRequest.page = 1;
        this.EwayBillfilterRequest.fromDate = moment(this.datePickerOptions.startDate).format('DD-MM-YYYY');
        this.EwayBillfilterRequest.toDate = moment(this.datePickerOptions.endDate).format('DD-MM-YYYY');

        this.isGetAllEwaybillRequestInProcess$ = this.store.select(p => p.ewaybillstate.isGetAllEwaybillRequestInProcess).pipe(takeUntil(this.destroyed$));
        this.isGetAllEwaybillRequestSuccess$ = this.store.select(p => p.ewaybillstate.isGetAllEwaybillRequestSuccess).pipe(takeUntil(this.destroyed$));

        this.cancelEwayInProcess$ = this.store.select(p => p.ewaybillstate.cancelEwayInProcess).pipe(takeUntil(this.destroyed$));
        this.cancelEwaySuccess$ = this.store.select(p => p.ewaybillstate.cancelEwaySuccess).pipe(takeUntil(this.destroyed$));

        this.updateEwayvehicleProcess$ = this.store.select(p => p.ewaybillstate.updateEwayvehicleInProcess).pipe(takeUntil(this.destroyed$));
        this.updateEwayvehicleSuccess$ = this.store.select(p => p.ewaybillstate.updateEwayvehicleSuccess).pipe(takeUntil(this.destroyed$));
        this.store.dispatch(this.invoiceActions.getALLEwaybillList());

        // bind state sources
        this.store.pipe(select(s => s.general.states), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res.stateList).forEach(key => {
                    this.states.push({ label: res.stateList[key].code + ' - ' + res.stateList[key].name, value: res.stateList[key].code });
                });
                this.statesSource$ = observableOf(this.states);
            }
        });
    }

    public selectedDate(value: any) {
        this.needToShowLoader = false;
        if (value) {
            this.EwayBillfilterRequest.fromDate = moment(value.picker.startDate._d).format(GIDDH_DATE_FORMAT);
            this.EwayBillfilterRequest.toDate = moment(value.picker.endDate._d).format(GIDDH_DATE_FORMAT);
        }
        this.getAllFilteredInvoice();
    }

    public ngOnInit(): void {
        // getALLEwaybillList();
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
        this.store.select(p => p.ewaybillstate.EwayBillList).pipe(takeUntil(this.destroyed$)).subscribe((o: IEwayBillAllList) => {
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
                }));
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
    }

    public getAllFilteredInvoice() {
        this.store.dispatch(this.invoiceActions.GetAllEwayfilterRequest(this.preparemodelForFilterEway()));
        this.detectChange();
    }

    public onSelectEwayDownload(eway: Result) {
        this.selectedEway = _.cloneDeep(eway);
        this._invoiceService.DownloadEwayBills(this.selectedEway.ewbNo).subscribe(d => {

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
        this._invoiceService.DownloadDetailedEwayBills(this.selectedEway.ewbNo).subscribe(d => {
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
            Object.assign({}, { class: 'modal-lg modal-consolidated-details' })
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
                this.invoiceSearch.nativeElement.focus();
            }, 200);
        } else if (fieldName === 'customerUniqueName') {
            this.showSearchCustomer = true;
            this.showSearchInvoiceNo = false;
            setTimeout(() => {
                this.customerSearch.nativeElement.focus();
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
}

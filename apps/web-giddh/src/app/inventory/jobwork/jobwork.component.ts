import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { InventoryReportActions } from '../../actions/inventory/inventory.report.actions';
import { InventoryFilter, InventoryReport, InventoryUser } from '../../models/api-models/Inventory-in-out';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { debounceTime, distinctUntilChanged, publishReplay, refCount, take, takeUntil } from 'rxjs/operators';
import { ToasterService } from '../../services/toaster.service';
import { InventoryService } from '../../services/inventory.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { InvViewService } from '../inv.view.service';
import { ShSelectComponent } from '../../theme/ng-virtual-select/sh-select.component';
import { IStocksItem } from "../../models/interfaces/stocks-item.interface";
import { DaterangePickerComponent } from '../../theme/ng2-daterangepicker/daterangepicker.component';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';

@Component({
    selector: 'jobwork',
    templateUrl: './jobwork.component.html',
    styleUrls: ['./jobwork.component.scss'],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0);'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0);'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})
export class JobworkComponent implements OnInit, OnDestroy {
    public asideTransferPaneState: string = 'out';
    @ViewChild('advanceSearchModel', { static: true }) public advanceSearchModel: ModalDirective;
    @ViewChild('senderName', { static: true }) public senderName: ElementRef;
    @ViewChild('receiverName', { static: true }) public receiverName: ElementRef;
    @ViewChild('productName', { static: true }) public productName: ElementRef;
    @ViewChild('comparisionFilter', { static: true }) public comparisionFilter: ShSelectComponent;
    @ViewChild(DaterangePickerComponent, { static: true }) public datePicker: DaterangePickerComponent;

    public senderUniqueNameInput: FormControl = new FormControl();
    public receiverUniqueNameInput: FormControl = new FormControl();
    public productUniqueNameInput: FormControl = new FormControl();
    public showWelcomePage: boolean = true;
    public showSenderSearch: boolean = false;
    public showReceiverSearch: boolean = false;
    public showProductSearch: boolean = false;
    public updateDescriptionIdx: number = null;
    // modal advance search
    public isFilterCorrect: boolean = false;
    public advanceSearchForm: FormGroup;
    public COMPARISON_FILTER = [
        { label: 'Equals', value: '=' },
        { label: 'Greater Than', value: '>' },
        { label: 'Less Than', value: '<' },
        { label: 'Exclude', value: '!' }
    ];
    public VOUCHER_TYPES: any[] = [

        {
            "value": "Inward note",
            "label": "Inward note",
            "checked": true
        },
        {
            "value": "Outward Note",
            "label": "Outward Note",
            "checked": true
        },
        {
            "value": "Transfer Note",
            "label": "Transfer Note",
            "checked": true
        }
    ];
    public datePickerOptions: any = {
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
                dayjs().subtract(1, 'day'),
                dayjs()
            ],
            'Last 7 Days': [
                dayjs().subtract(6, 'day'),
                dayjs()
            ],
            'Last 30 Days': [
                dayjs().subtract(29, 'day'),
                dayjs()
            ],
            'Last 6 Months': [
                dayjs().subtract(6, 'month'),
                dayjs()
            ],
            'Last 1 Year': [
                dayjs().subtract(12, 'month'),
                dayjs()
            ]
        },
        startDate: dayjs().subtract(30, 'day'),
        endDate: dayjs()
    };
    public inventoryReport: InventoryReport;
    public stocksList$: Observable<IStocksItem[]>;
    public inventoryUsers$: Observable<InventoryUser[]>;
    public filter: InventoryFilter = {};
    public stockOptions: IOption[] = [];
    public startDate: string = dayjs().subtract(30, 'day').format(GIDDH_DATE_FORMAT);
    public endDate: string = dayjs().format(GIDDH_DATE_FORMAT);
    public uniqueName: string;
    public type: string;
    public reportType: string;
    public nameStockOrPerson: string;
    public universalDate$: Observable<any>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private inventoryReport$: Observable<InventoryReport>;

    constructor(
        private inventoryReportActions: InventoryReportActions,
        private inventoryService: InventoryService,
        private _toasty: ToasterService,
        private fb: FormBuilder,
        private invViewService: InvViewService,
        private _store: Store<AppState>,
        private cdr: ChangeDetectorRef) {

        this.stocksList$ = this._store.pipe(select(s => s.inventory.stocksList && s.inventory.stocksList.results), takeUntil(this.destroyed$));
        this.inventoryUsers$ = this._store.pipe(select(s => s.inventoryInOutState.inventoryUsers && s.inventoryInOutState.inventoryUsers), takeUntil(this.destroyed$));
        this.universalDate$ = this._store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
        // on reload page
        let len = document.location.pathname.split('/')?.length;
        if (len === 6) {
            this.uniqueName = document.location.pathname.split('/')[len - 1];
            this.type = document.location.pathname.split('/')[len - 2];
            if (this.uniqueName && this.type === 'stock' || this.type === 'person') {
                this.showWelcomePage = false;
                this.applyFilters(1, true);
            } else {
                this.showWelcomePage = true;
            }
        }

        this.inventoryReport$ = this._store.pipe(select(p => p.inventoryInOutState.inventoryReport), takeUntil(this.destroyed$), publishReplay(1), refCount());

        this._store.pipe(select(p => ({
            stocksList: p.inventory.stocksList,
            inventoryUsers: p.inventoryInOutState.inventoryUsers
        })), takeUntil(this.destroyed$)).subscribe(p => p.inventoryUsers && p.stocksList &&
            (this.stockOptions = p.stocksList.results.map(r => ({ label: r.name, value: r?.uniqueName, additional: 'stock' }))
                .concat(p.inventoryUsers.map(r => ({ label: r.name, value: r?.uniqueName, additional: 'person' })))));
    }

    public ngOnInit() {
        // get view from sidebar while clicking on person/stock

        this.invViewService.getJobworkActiveView().pipe(takeUntil(this.destroyed$)).subscribe(v => {

            this.initVoucherType();
            this.showWelcomePage = false;
            this.type = v.view;
            this.nameStockOrPerson = v.name;
            if (v?.uniqueName) {
                this.uniqueName = v.uniqueName;
                let length = document.location.pathname.split('/')?.length;
                if (!v.uniqueName && length === 6) {
                    this.uniqueName = document.location.pathname.split('/')[length - 1];
                }

                if (this.uniqueName) {
                    if (this.type === 'person') {
                        this.filter.includeSenders = true;
                        this.filter.includeReceivers = true;
                        this.filter.receivers = [this.uniqueName];
                        this.filter.senders = [this.uniqueName];
                        this.applyFilters(1, true);
                    } else {
                        this.applyFilters(1, false);
                    }
                }
            } else {

                if (this.type === 'person') {
                    this.inventoryUsers$.pipe(take(1)).subscribe(res => {
                        if (res && res.length > 0) {
                            let firstElement = res[0];
                            this.showWelcomePage = false;
                            this.nameStockOrPerson = firstElement.name;
                            this.uniqueName = firstElement?.uniqueName;
                            this.filter.includeSenders = true;
                            this.filter.includeReceivers = true;
                            this.filter.receivers = [this.uniqueName];
                            this.filter.senders = [this.uniqueName];
                            this.applyFilters(1, true);
                        } else {
                            this.showWelcomePage = true;
                        }
                    });
                } else {
                    this.stocksList$.pipe(take(1)).subscribe(res => {
                        if (res && res.length > 0) {
                            let firstElement = res[0];
                            this.showWelcomePage = false;
                            this.nameStockOrPerson = firstElement.name;
                            this.uniqueName = firstElement?.uniqueName;
                            this.applyFilters(1, false);
                        } else {
                            this.showWelcomePage = true;
                        }
                    });
                }
            }

        });

        // initialization for voucher type array initially all selected
        this.initVoucherType();
        // Advance search modal
        this.advanceSearchForm = this.fb.group({
            filterAmount: ['', [Validators.pattern('[0-9]+([,.][0-9]+)?$')]],
            filterCategory: [''],
        });

        this.senderUniqueNameInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.filter.senderName = s;
            this.isFilterCorrect = true;
            this.applyFilters(1, true);
            if (s === '') {
                this.showSenderSearch = false;
            }
        });
        this.receiverUniqueNameInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            this.filter.receiverName = s;
            this.isFilterCorrect = true;
            this.applyFilters(1, true);
            if (s === '') {
                this.showReceiverSearch = false;
            }
        });

        // on load first time
        this.stocksList$.subscribe(res => {

            if (res && res.length > 0) {
                let firstElement = res[0];
                if (!this.type) {
                    this.showWelcomePage = false;
                    this.type = 'stock';
                    this.nameStockOrPerson = firstElement.name;
                    this.uniqueName = firstElement?.uniqueName;

                    this._store.dispatch(this.inventoryReportActions.genReport(firstElement?.uniqueName, this.startDate, this.endDate, 1, 6, this.filter));
                }
            } else {
                this.showWelcomePage = true;
            }

        });

        this.universalDate$.subscribe(a => {
            if (a) {
                this.datePickerOptions = { ...this.datePickerOptions, startDate: a[0], endDate: a[1], chosenLabel: a[2] };
                this.startDate = dayjs(a[0]).format(GIDDH_DATE_FORMAT);
                this.endDate = dayjs(a[1]).format(GIDDH_DATE_FORMAT);
                this.applyFilters(1, true);
            }
        });

        this.inventoryReport$.subscribe(res => {
            this.inventoryReport = res;
            this.cdr.detectChanges();
        });


    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public initVoucherType() {
        // initialization for voucher type array inially all selected
        this.filter.jobWorkTransactionType = [];
        this.VOUCHER_TYPES.forEach(element => {
            element.checked = true;
            this.filter.jobWorkTransactionType.push(element.value);
        });
    }

    public dateSelected(val) {
        const { startDate, endDate } = val.picker;
        this.startDate = startDate.format(GIDDH_DATE_FORMAT);
        this.endDate = endDate.format(GIDDH_DATE_FORMAT);
        this.isFilterCorrect = true;
        this.applyFilters(1, true);
    }

    /**
     * updateDescription
     */
    public updateDescription(txn: any) {
        this.updateDescriptionIdx = null;
        this.inventoryService.updateDescription(txn?.uniqueName, txn.description).pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res?.status === 'success') {
                this.updateDescriptionIdx = null;
            } else {
                txn.description = null;
            }
        });

    }

    // focus on click search box
    public showSearchBox(type: string) {
        if (type === 'sender') {
            this.showSenderSearch = !this.showSenderSearch;
            setTimeout(() => {
                this.senderName.nativeElement.focus();
                this.senderName.nativeElement.value = null;
            }, 100);
        } else if (type === 'receiver') {
            this.showReceiverSearch = !this.showReceiverSearch;
            setTimeout(() => {
                this.receiverName.nativeElement.focus();
                this.receiverName.nativeElement.value = null;
            }, 100);
        } else if (type === 'product') {
            this.showProductSearch = !this.showProductSearch;
            setTimeout(() => {
                this.receiverName.nativeElement.focus();
                this.receiverName.nativeElement.value = null;
            }, 100);
        }
    }


    public compareChanged(option: IOption) {
        switch (option.value) {
            case '>':
                this.filter.quantityNotEquals = false;
                this.filter.quantityGreaterThan = true;
                this.filter.quantityEqualTo = false;
                this.filter.quantityLessThan = false;
                break;
            case '<':
                this.filter.quantityNotEquals = false;
                this.filter.quantityGreaterThan = false;
                this.filter.quantityEqualTo = false;
                this.filter.quantityLessThan = true;
                break;
            case '<=':
                this.filter.quantityNotEquals = false;
                this.filter.quantityGreaterThan = false;
                this.filter.quantityEqualTo = true;
                this.filter.quantityLessThan = true;
                break;
            case '>=':
                this.filter.quantityNotEquals = false;
                this.filter.quantityGreaterThan = true;
                this.filter.quantityEqualTo = true;
                this.filter.quantityLessThan = false;
                break;
            case '=':
                this.filter.quantityNotEquals = false;
                this.filter.quantityGreaterThan = false;
                this.filter.quantityEqualTo = true;
                this.filter.quantityLessThan = false;
                break;
            case '!':
                this.filter.quantityNotEquals = true;
                this.filter.quantityGreaterThan = false;
                this.filter.quantityEqualTo = false;
                this.filter.quantityLessThan = false;
                break;
            case 'Sender':
                this.filter.senders = [this.uniqueName];
                this.filter.includeReceivers = false;
                this.filter.includeSenders = true;
                this.filter.receivers = [];
                break;
            case 'Receiver':
                this.filter.senders = [];
                this.filter.includeSenders = false;
                this.filter.includeReceivers = true;
                this.filter.receivers = [this.uniqueName];
                break;
        }
        this.checkFilters();
    }

    @HostListener('document:keyup', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent) {
        if (event.altKey && event.which === 73) { // Alt + i
            event.preventDefault();
            event.stopPropagation();
            this.toggleTransferAsidePane();
        }
    }

    // new transfer aside pane
    public toggleTransferAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideTransferPaneState = this.asideTransferPaneState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public toggleBodyClass() {
        if (this.asideTransferPaneState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public applyFilters(page: number, applyFilter: boolean = true) {
        if (!this.uniqueName) {
            return;
        }

        if (this.type === 'stock' && applyFilter) {
            this.filter.senders = null;
            this.filter.receivers = null;
        }
        this._store.dispatch(this.inventoryReportActions
            .genReport(this.uniqueName, this.startDate, this.endDate, page, 6, applyFilter ? this.filter : null));
        this.cdr.detectChanges();
    }

    // ******* Advance search modal *******//
    public resetFilter() {
        this.filter.senderName = null;
        this.filter.receiverName = null;
        this.showSenderSearch = false;
        this.showReceiverSearch = false;
        this.showProductSearch = false;
        this.senderName.nativeElement.value = null;
        this.receiverName.nativeElement.value = null;
        if (this.productName) {
            this.productName.nativeElement.value = null;
        }

        //advanceSearchAction modal filter
        this.comparisionFilter?.clear();
        this.advanceSearchForm.controls['filterAmount'].setValue(null);

        this.filter.sort = null;
        this.filter.sortBy = null;
        this.filter.quantityGreaterThan = false;
        this.filter.quantityEqualTo = false;
        this.filter.quantityLessThan = false;

        //Reset Date
        this.universalDate$.pipe(take(1)).subscribe(a => {
            if (a) {
                this.datePickerOptions = { ...this.datePickerOptions, startDate: a[0], endDate: a[1], chosenLabel: a[2] };
                this.startDate = dayjs(a[0]).format(GIDDH_DATE_FORMAT);
                this.endDate = dayjs(a[1]).format(GIDDH_DATE_FORMAT);
            }
        });
        //Reset Date

        // initialization for voucher type array initially all selected
        this.initVoucherType();
        this.isFilterCorrect = false;
        this.applyFilters(1, true);
    }

    public onOpenAdvanceSearch() {
        this.advanceSearchModel?.show();
    }

    public advanceSearchAction(type: string) {
        if (type === 'clear') {
            this.comparisionFilter?.clear();
            this.advanceSearchForm.controls['filterAmount'].setValue(null);
            if (this.filter.senderName || this.filter.receiverName || this.senderName.nativeElement.value || this.receiverName.nativeElement.value
                || this.filter.sortBy || this.filter.sort || this.filter.quantityGreaterThan || this.filter.quantityEqualTo || this.filter.quantityLessThan) {
                // do something...
            } else {
                this.isFilterCorrect = false;
            }
            return;
        } else if (type === 'cancel') {
            if (this.filter.senderName || this.filter.receiverName || this.senderName.nativeElement.value || this.receiverName.nativeElement.value
                || this.filter.sortBy || this.filter.sort || this.filter.quantityGreaterThan || this.filter.quantityEqualTo || this.filter.quantityLessThan) {
                // do something...
            } else {
                this.isFilterCorrect = false;
            }
            this.advanceSearchModel.hide();
            return;

        } else {
            if (this.advanceSearchForm.controls['filterAmount'].value) {
                this.filter.quantity = this.advanceSearchForm.controls['filterAmount'].value;
            }
            this.advanceSearchModel.hide();
            this.applyFilters(1, true);
        }


    }

    public checkFilters() {
        if (this.advanceSearchForm.controls['filterAmount'].value && !this.advanceSearchForm.controls['filterAmount'].invalid) {
            this.filter.quantity = this.advanceSearchForm.controls['filterAmount'].value;
        } else {
            this.filter.quantity = null;
        }
        if ((this.filter.quantityGreaterThan || this.filter.quantityEqualTo || this.filter.quantityLessThan) && this.filter.quantity) {
            this.isFilterCorrect = true;
        }
    }

    // ************************************//

    // Sort filter code here
    public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {
        if (this.filter.sort !== type || this.filter.sortBy !== columnName) {
            this.filter.sort = type;
            this.filter.sortBy = columnName;
            this.isFilterCorrect = true;
            this.applyFilters(1, true);
        }
    }

    public clearShSelect(type?: string) {
        this.filter.quantityGreaterThan = null;
        this.filter.quantityEqualTo = null;
        this.filter.quantityLessThan = null;
    }

    public filterByCheck(type: string, event: boolean) {
        let idx = this.filter.jobWorkTransactionType?.indexOf('ALL');
        if (idx !== -1) {
            this.initVoucherType();
        }
        if (event && type) {
            this.filter.jobWorkTransactionType.push(type);
        } else {
            let index = this.filter.jobWorkTransactionType?.indexOf(type);
            if (index !== -1) {
                this.filter.jobWorkTransactionType.splice(index, 1);
            }
        }
        if (this.filter.jobWorkTransactionType?.length > 0 && this.filter.jobWorkTransactionType?.length < this.VOUCHER_TYPES.length) {
            idx = this.filter.jobWorkTransactionType?.indexOf('ALL');
            if (idx !== -1) {
                this.filter.jobWorkTransactionType.splice(idx, 1);
            }
            idx = this.filter.jobWorkTransactionType?.indexOf('NONE');
            if (idx !== -1) {
                this.filter.jobWorkTransactionType.splice(idx, 1);
            }
        }
        if (this.filter.jobWorkTransactionType?.length === this.VOUCHER_TYPES.length) {
            this.filter.jobWorkTransactionType = ['ALL'];
        }
        if (this.filter.jobWorkTransactionType?.length === 0) {
            this.filter.jobWorkTransactionType = ['NONE'];
        }
        this.isFilterCorrect = true;
        this.applyFilters(1, true);
    }

    // ************************************//

    public clickedOutside(event, el, fieldName: string) {
        if (fieldName === 'product') {
            if (this.productUniqueNameInput.value !== null && this.productUniqueNameInput.value !== '') {
                return;
            }
        }
        if (fieldName === 'sender') {
            if (this.senderUniqueNameInput.value !== null && this.senderUniqueNameInput.value !== '') {
                return;
            }
        }
        if (fieldName === 'receiver') {
            if (this.receiverUniqueNameInput.value !== null && this.receiverUniqueNameInput.value !== '') {
                return;
            }
        }
        if (this.childOf(event.target, el)) {
            return;
        } else {
            if (fieldName === 'sender') {
                this.showSenderSearch = false;
            } else if (fieldName === 'receiver') {
                this.showReceiverSearch = false;
            } else if (fieldName === 'product') {
                this.showProductSearch = false;
            }
        }
    }

    /* tslint:disable */
    public childOf(c, p) {
        while ((c = c.parentNode) && c !== p) {
        }
        return !!c;
    }

    public downloadJobworkReport(format: string) {
        if (!this.uniqueName) {
            return;
        }

        if (this.type === 'stock') {
            this.filter.senders = null;
            this.filter.receivers = null;
        }
        this.inventoryService.downloadJobwork(this.uniqueName, this.type, format, this.startDate, this.endDate, this.filter)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(d => {
                if (d?.status === 'success') {
                    this._toasty.infoToast(d?.body);
                } else {
                    this._toasty.errorToast(d?.message);
                }
            });
    }

}

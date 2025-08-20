import { Component, OnInit, ViewChild, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { IOption } from '../../theme/ng-select/ng-select';
import * as dayjs from 'dayjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { GeneralService } from '../../services/general.service';
import { GIDDH_NEW_DATE_FORMAT_UI, GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { purchaseOrderStatus } from "../../shared/helpers/purchaseOrderStatus";
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';

@Component({
    selector: 'purchase-advance-search',
    templateUrl: './purchase-advance-search.component.html',
    styleUrls: ['./purchase-advance-search.component.scss']
})

export class PurchaseAdvanceSearchComponent implements OnInit, OnDestroy {
    /* This will hold the amount filter */
    public filtersForAmount: IOption[] = [];
    /* This will hold the status filter */
    public filtersForStatus: IOption[] = [];
    /* This will input the filters to preselect them */
    @Input() public purchaseOrderPostRequest;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /* Emitter for filters */
    @Output() public closeModelEvent: EventEmitter<any> = new EventEmitter();
    /** Universal datepicker trigger */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;
    /** Flag to track datepicker menu state */
    public isDatepickerMenuOpen: boolean = false;

    /* This will store if device is mobile or not */
    public isMobileScreen: boolean = false;
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
    /* Selected grand total operator */
    public selectedGrandTotalOperator: any = "";
    /* This will hold the default input search values */
    public defaultPurchaseOrderPostRequest: any = {};
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private breakPointObservar: BreakpointObserver, private generalService: GeneralService) {

    }

    /**
     * Initializes the component
     *
     * @memberof PurchaseAdvanceSearchComponent
     */
    public ngOnInit(): void {
        this.filtersForAmount = [
            { label: this.commonLocaleData?.app_comparision_filters?.greater_than, value: 'GREATER_THAN' },
            { label: this.commonLocaleData?.app_comparision_filters?.greater_than_equals, value: 'GREATER_THAN_OR_EQUALS' },
            { label: this.commonLocaleData?.app_comparision_filters?.less_than, value: 'LESS_THAN' },
            { label: this.commonLocaleData?.app_comparision_filters?.less_than_equals, value: 'LESS_THAN_OR_EQUALS' },
            { label: this.commonLocaleData?.app_comparision_filters?.equals, value: 'EQUALS' },
            { label: this.commonLocaleData?.app_comparision_filters?.not_equals, value: 'NOT_EQUALS' }
        ];

        purchaseOrderStatus.map(status => {
            this.filtersForStatus.push({ label: status.label, value: status?.value });
        });

        if (this.purchaseOrderPostRequest && this.purchaseOrderPostRequest.grandTotalOperation) {
            this.filtersForAmount.forEach(operator => {
                if (operator?.value === this.purchaseOrderPostRequest.grandTotalOperation) {
                    this.selectedGrandTotalOperator = operator.label;
                }
            });
        }

        this.defaultPurchaseOrderPostRequest = _.cloneDeep(this.purchaseOrderPostRequest);

        this.breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        if (this.purchaseOrderPostRequest && this.purchaseOrderPostRequest.dueFrom && this.purchaseOrderPostRequest.dueTo) {
            this.selectedDateRange = { startDate: dayjs(this.purchaseOrderPostRequest.dueFrom, GIDDH_DATE_FORMAT), endDate: dayjs(this.purchaseOrderPostRequest.dueTo, GIDDH_DATE_FORMAT) };
            this.selectedDateRangeUi = dayjs(this.purchaseOrderPostRequest.dueFrom, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(this.purchaseOrderPostRequest.dueTo, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
        }
    }

    /**
     * Toggles the universal datepicker menu
     *
     * @param {boolean} isOpen
     * @memberof PurchaseAdvanceSearchComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }


    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof PurchaseAdvanceSearchComponent
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
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.purchaseOrderPostRequest.dueFrom = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.purchaseOrderPostRequest.dueTo = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }

    /**
     * This will emit the search data
     *
     * @memberof PurchaseAdvanceSearchComponent
     */
    public onSearch(): void {
        this.closeModelEvent.emit(this.purchaseOrderPostRequest);
    }

    /**
     * This will emit false on cancel search
     *
     * @memberof PurchaseAdvanceSearchComponent
     */
    public onCancel(): void {
        this.closeModelEvent.emit(false);
    }

    /**
     * Releases the memory
     *
     * @memberof PurchaseAdvanceSearchComponent
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}

import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Observable, ReplaySubject, takeUntil } from "rxjs";
import * as dayjs from 'dayjs';
import { GeneralService } from "apps/web-giddh/src/app/services/general.service";
import { AppState } from "apps/web-giddh/src/app/store";
import { select, Store } from "@ngrx/store";
import { GIDDH_NEW_DATE_FORMAT_UI } from "../../../helpers/defaultDateFormat";

export interface TableData {
    title: string;
    entity: string;
    entityUniqueNames: string[];
    voucherTypes: string[];
    emailSubject: string;
    triggerModule: string;
    to: string[];
    cc: string[];
    bcc: string[];
    conditions: {
        DUE_BY: { key: string; value: number };
        DUE_AMOUNT: { key: string; value: number };
    };
    executionTime: {
        time: string;
        dayOfWeek?: string;
        dayOfMonth?: string;
    };
    actions: string[];
    html: string;
    disabled: boolean;
}

@Component({
    selector: 'app-basic-trigger',
    templateUrl: './basic-trigger.component.html',
    styleUrls: ['./basic-trigger.component.scss']
})

export class BasicTriggerComponent implements OnInit, OnDestroy {
    /** Directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Universal date observer */
    public universalDate$: Observable<any>;
    /** True if current organization is company */
    public isCompanyMode: boolean;
    /** This will store selected date ranges */
    public selectedDateRange: any;
    /** Selected range label */
    public selectedRangeLabel: any = "";

    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store modal reference */
    public modalRef: BsModalRef;
    /** This will store universalDate */
    public universalDate: any;
    /** Holds page size options */
    public pageSizeOptions: any[] = [20,
        50,
        100];
    /** Holds Obligations table data */
    public dataSource: TableData[] = [
        {
            title: 'Payment Reminder',
            entity: 'ACCOUNT',
            entityUniqueNames: ['Entity1', 'Entity2'],
            voucherTypes: ['Type1', 'Type2'],
            emailSubject: 'Reminder: Payment Due',
            triggerModule: 'VOUCHER_DUE',
            to: ['user@example.com'],
            cc: ['cc@example.com'],
            bcc: ['bcc@example.com'],
            conditions: {
                DUE_BY: { key: 'days', value: 4 },
                DUE_AMOUNT: { key: 'GREATER_THAN', value: 10000 }
            },
            executionTime: { time: '16:00', dayOfWeek: 'wednesday' },
            actions: ['ATTACH_VOUCHER_PDF'],
            html: '<p>Payment is due.</p>',
            disabled: false
        },
        // Add more dummy entries if needed
    ];
    /** Holds Obligations table columns */
    public displayedColumns: string[] = [
        'title',
        'entity',
        'emailSubject',
        'triggerModule',
        'executionTime',
        'conditions',
        'actions',
        'disabled'
    ];
    /** True if API Call is in progress */
    public isLoading: boolean;
    constructor(private modalService: BsModalService,
        private generalService: GeneralService,
        private store: Store<AppState>
    ) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    /**
    * Lifecycle hook for initialization
    *
    * @memberof BasicTriggerComponent
    */
    public ngOnInit(): void {
        /** Universal date observer */
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                this.universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            }
        });
    }

    /**
    * This will be use for show datepicker
    *
    * @param {*} element
    * @memberof BasicTriggerComponent
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
    * This will be use for hide datepicker
    *
    * @memberof BasicTriggerComponent
    */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
    * Call back function for date/range selection in datepicker
    *
    * @param {*} value
    * @memberof BasicTriggerComponent
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
        }
    }

    /**
     * Handle page change
     *
     * @param {*} event
     * @memberof AdjustInventoryListComponent
     */
    public handlePageChange(event: any): void {
        // this.pageIndex = event.pageIndex;
        // this.adjustInventoryListRequest.count = event.pageSize;
        // this.adjustInventoryListRequest.page = event.pageIndex + 1;
        // this.getAllAdjustReports(false);
    }


    /**
    * Lifecycle hook for destroy
    *
    * @memberof BasicTriggerComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}

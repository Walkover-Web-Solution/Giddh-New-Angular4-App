import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GIDDH_NEW_DATE_FORMAT_UI, GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as dayjs from 'dayjs';
import { GeneralService } from '../services/general.service';
import { AuditLogsFormComponent } from './components/audit-logs-form/audit-logs-form.component';
import { GetAuditLogsRequest } from '../models/api-models/Logs';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../app.constant';
@Component({
    selector: 'audit-logs',
    templateUrl: './audit-logs.component.html',
    styleUrls: [`./audit-logs.component.scss`],
})
export class AuditLogsComponent implements OnInit, OnDestroy {
    /** To check module for new version  */
    public isNewVersion: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /** This will store modal reference */
    public modalRef: BsModalRef;
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** dayjs object */
    public dayjs = dayjs;
    /** Selected from date */
    public fromDate: string;
    /** Selected to date */
    public toDate: string;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** Universal date observer */
    public universalDate$: Observable<any>;
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** Audit log form component reference */
    @ViewChild('auditLogFormComponent', { static: false }) public auditLogFormComponent: AuditLogsFormComponent;
    /** Audit log request */
    public auditLogsRequest$: Observable<GetAuditLogsRequest>;
    /** To show clear filter */
    public showClearFilter: boolean = false;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(private store: Store<AppState>, private route: ActivatedRoute, private generalService: GeneralService, private modalService: BsModalService, private router: Router) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
        this.auditLogsRequest$ = this.store.pipe(select(state => state.auditlog.auditLogsRequest), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        if (this.generalService.voucherApiVersion === 2) {
            this.router.navigate(['/pages/home']);
        }
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isNewVersion = false;
                if (response.version && String(response.version).toLocaleLowerCase() === 'new') {
                    this.isNewVersion = true;
                }
            } else {
                this.isNewVersion = false;
            }
        });

        /** Universal date observer */
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
        });

        this.auditLogsRequest$.subscribe(response => {
            if (response && response.entity) {
                this.showClearFilter = true;
            }
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     *To show the datepicker
     *
     * @param {*} element
     * @memberof AuditLogsFormComponent
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
     * @memberof AuditLogsFormComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof AuditLogsFormComponent
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
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }

    /**
     * To reset applied filter
     *
     * @memberof AuditLogsComponent
     */
    public resetFilter(): void {
        if (this.isNewVersion && this.auditLogFormComponent) {
            this.auditLogFormComponent.resetFilters();
            this.showClearFilter = false;
        }
    }
}

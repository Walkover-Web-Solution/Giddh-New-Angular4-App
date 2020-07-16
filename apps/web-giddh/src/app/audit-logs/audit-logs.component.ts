import { take, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';
import { ReplaySubject, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { GIDDH_NEW_DATE_FORMAT_UI, GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import * as moment from 'moment';
import { GeneralService } from '../services/general.service';
import { GeneralActions } from '../actions/general/general.actions';

@Component({
    selector: 'audit-logs',
    templateUrl: './audit-logs.component.html',
    styleUrls: ['audit-logs.component.scss']
})
export class AuditLogsComponent implements OnInit, OnDestroy {
    /** To check module for new version  */
    public isNewVersion: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);


    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
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

    constructor(private store: Store<AppState>, private companyActions: CompanyActions, private route: ActivatedRoute, private generalActions: GeneralActions,
    private generalService: GeneralService, private modalService: BsModalService) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isNewVersion = false;
                if (response.version && response.version && String(response.version).toLocaleLowerCase() === 'new') {
                    this.isNewVersion = true;
                     this.store.dispatch(this.generalActions.setAppTitle('/pages/audit-logs/New'));
                }
            } else {
                this.isNewVersion = false;
            }
        });
        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'audit-logs';

        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));

                /** Universal date observer */
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: moment(dateObj[0]), endDate: moment(dateObj[1]) };
                this.selectedDateRangeUi = moment(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
        });
        /* This will get the date range picker configurations */
        this.store.pipe(select(state => state.company.dateRangePickerConfig), takeUntil(this.destroyed$)).subscribe(config => {
            if (config) {
                this.datePickerOptions = config;
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
    public dateSelectedCallback(value: any): void {
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
        }
    }
}

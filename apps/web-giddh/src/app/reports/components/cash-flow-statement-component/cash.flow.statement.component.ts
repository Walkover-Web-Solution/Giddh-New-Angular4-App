import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { takeUntil } from 'rxjs/operators';
import * as dayjs from 'dayjs';
import { ReplaySubject, Observable } from 'rxjs';
import { CashFlowStatementService } from '../../../services/cashflowstatement.service';
import { GeneralService } from '../../../services/general.service';
import { ToasterService } from '../../../services/toaster.service';
import { saveAs } from "file-saver";
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../../app.constant';
import { cloneDeep } from '../../../lodash-optimized';

@Component({
    selector: 'cash-flow-statement-component',
    templateUrl: './cash.flow.statement.component.html',
    styleUrls: ['./cash.flow.statement.component.scss'],
    standalone: false
})

export class CashFlowStatementComponent implements OnInit, OnDestroy {
    /** Instance of universal datepicker menu trigger */
    @ViewChild('universalDatepickerTrigger', { static: false }) public universalDatepickerTrigger: MatMenuTrigger;
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
    /* Active company details */
    public activeCompany: any;
    /* Api request object */
    public downloadRequest = {
        from: '',
        to: '',
        companyUniqueName: ''
    };
    /* This will store if loading is active or not */
    public isLoading: boolean = false;
/** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(private store: Store<AppState>, private cashFlowStatementService: CashFlowStatementService, private generalService: GeneralService, private toaster: ToasterService) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    /**
     * Initializes the component
     *
     * @memberof CashFlowStatementComponent
     */
    public ngOnInit(): void {
        /* Observer to store universal from/to date */
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                let universalDate = cloneDeep(dateObj);

                this.selectedDateRange = { startDate: dayjs(universalDate[0]), endDate: dayjs(universalDate[1]) };
                this.selectedDateRangeUi = dayjs(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);

                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
        });

        /* This will get the company details */
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.downloadRequest.companyUniqueName = activeCompany.uniqueName;
                this.activeCompany = activeCompany;
            }
        });
    }

    /**
     * Releases the memory
     *
     * @memberof CashFlowStatementComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Toggles the datepicker menu
     *
     * @param {boolean} isOpen - Whether to open or close the datepicker
     * @memberof CashFlowStatementComponent
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
     * @param {*} value - The value returned from the datepicker
     * @memberof CashFlowStatementComponent
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
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }

    /**
     * This will download the excel report
     *
     * @memberof CashFlowStatementComponent
     */
    public downloadReport(): void {
        this.downloadRequest.from = this.fromDate;
        this.downloadRequest.to = this.toDate;
        this.isLoading = true;

        this.cashFlowStatementService.downloadReport(this.downloadRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            this.isLoading = false;
            if (res) {
                if (res.status === "success") {
                    let blob = this.generalService.base64ToBlob(res.body.data, 'application/xls', 512);
                    return saveAs(blob, res.body.name);
                } else {
                    this.toaster.clearAllToaster();
                    this.toaster.errorToast(res.message);
                }
            } else {
                this.toaster.clearAllToaster();
                this.toaster.errorToast(this.commonLocaleData?.app_something_went_wrong);
            }
        });
    }
}

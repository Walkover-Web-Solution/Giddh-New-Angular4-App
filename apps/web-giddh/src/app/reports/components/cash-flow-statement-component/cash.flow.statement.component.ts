import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { takeUntil, take } from 'rxjs/operators';
import * as moment from 'moment/moment';
import { ReplaySubject, Observable } from 'rxjs';
import { CashFlowStatementService } from '../../../services/cashflowstatement.service';
import { GeneralService } from '../../../services/general.service';
import { ToasterService } from '../../../services/toaster.service';
import { saveAs } from "file-saver";

@Component({
    selector: 'cash-flow-statement-component',
    templateUrl: './cash.flow.statement.component.html',
    styleUrls: ['./cash.flow.statement.component.scss']
})

export class CashFlowStatementComponent implements OnInit, OnDestroy {
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;

    /* This will store if device is mobile or not */
    public isMobileScreen: boolean = false;
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
    /* Active company details */
    public activeCompany: any;
    /* Active company unique name */
    public activeCompanyUniqueName$: Observable<string>;
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

    constructor(private breakPointObservar: BreakpointObserver, private modalService: BsModalService, private store: Store<AppState>, private cashFlowStatementService: CashFlowStatementService, private generalService: GeneralService, private toaster: ToasterService) {
        this.activeCompanyUniqueName$ = this.store.pipe(select(state => state.session.companyUniqueName), (takeUntil(this.destroyed$)));
        this.universalDate$ = this.store.select(state => state.session.applicationDate).pipe(takeUntil(this.destroyed$));
    }

    /**
     * Initializes the component
     *
     * @memberof CashFlowStatementComponent
     */
    public ngOnInit(): void {
        /* Observer to detect device based on screen width */
        this.breakPointObservar.observe([
            '(max-width: 1023px)'
        ]).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        /* Observer to store universal from/to date */
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);

                this.selectedDateRange = { startDate: moment(universalDate[0]), endDate: moment(universalDate[1]) };
                this.selectedDateRangeUi = moment(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);

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

        /* This will get the company details */
        this.activeCompanyUniqueName$.pipe(take(1)).subscribe(activeCompanyUniqueName => {
            this.downloadRequest.companyUniqueName = activeCompanyUniqueName;

            this.store.pipe(select(state => state.session.companies), takeUntil(this.destroyed$)).subscribe(companies => {
                if (companies) {
                    companies.forEach(company => {
                        if (company.uniqueName === activeCompanyUniqueName) {
                            this.activeCompany = company;
                        }
                    });
                }
            });
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
     * This will show the datepicker
     *
     * @memberof CashFlowStatementComponent
     */
    public showGiddhDatepicker(): void {
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: this.isMobileScreen })
        );
    }

    /**
     * This will hide the datepicker
     *
     * @memberof CashFlowStatementComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof CashFlowStatementComponent
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

    /**
     * This will download the excel report
     *
     * @memberof CashFlowStatementComponent
     */
    public downloadReport(): void {
        this.downloadRequest.from = this.fromDate;
        this.downloadRequest.to = this.toDate;
        this.isLoading = true;

        this.cashFlowStatementService.downloadReport(this.downloadRequest).subscribe((res) => {
            this.isLoading = false;

            if (res.status === "success") {
                let blob = this.generalService.base64ToBlob(res.body, 'application/xls', 512);
                return saveAs(blob, `CashFlowStatement.xlsx`);
            } else {
                this.toaster.clearAllToaster();
                this.toaster.errorToast(res.message);
            }
        });
    }
}

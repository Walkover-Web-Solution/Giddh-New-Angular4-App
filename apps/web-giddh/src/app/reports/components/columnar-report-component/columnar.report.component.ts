import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SettingsFinancialYearService } from '../../../services/settings.financial-year.service';
import { select, Store } from '@ngrx/store';
import { takeUntil, take } from 'rxjs/operators';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';
import { IFlattenGroupsAccountsDetail } from '../../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { AppState } from '../../../store';
import { ToasterService } from '../../../services/toaster.service';
import { GeneralService } from '../../../services/general.service';
import { LedgerService } from '../../../services/ledger.service';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import * as moment from 'moment/moment';
import { saveAs } from "file-saver";
import { IForceClear } from '../../../models/api-models/Sales';

@Component({
    selector: 'columnar-report-component',
    templateUrl: './columnar.report.component.html',
    styleUrls: ['./columnar.report.component.scss']
})

export class ColumnarReportComponent implements OnInit, OnDestroy {
    public fromMonthNames: any = [];
    public toMonthNames: any = [];
    public selectYear: any = [];
    public showOpeningClosingBalance = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
    public selectCrDr = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
    public flatGroupsOptions: any = [];
    private flattenGroups$: Observable<IFlattenGroupsAccountsDetail[]>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public exportRequest: any = {};
    public activeCompanyUniqueName$: Observable<string>;
    public companyUniqueName: string = '';
    public groupUniqueName: string = '';
    public isLoading: boolean = false;
    public forceClear$: Observable<IForceClear> = observableOf({status: false});
    public fromMonth: any = '';
    public toMonth: any = '';
    public financialYearSelected: any;

    constructor(public settingsFinancialYearService: SettingsFinancialYearService, private store: Store<AppState>, private toaster: ToasterService, private ledgerService: LedgerService, private generalService: GeneralService) {
        this.exportRequest.fileType = 'xls';
        this.activeCompanyUniqueName$ = this.store.pipe(select(p => p.session.companyUniqueName), (takeUntil(this.destroyed$)));
        this.flattenGroups$ = this.store.pipe(select(state => state.general.flattenGroups), takeUntil(this.destroyed$));

        this.flattenGroups$.subscribe(flattenGroups => {
            if (flattenGroups) {
                flattenGroups.forEach(key => {
                    this.flatGroupsOptions.push({ label: key.groupName, value: key.groupUniqueName });
                });
            }
        });

        this.activeCompanyUniqueName$.pipe(take(1)).subscribe(activeCompanyName => {
            this.companyUniqueName = activeCompanyName;
        });
    }

    /**
     * Initializes the component
     *
     * @memberof ColumnarReportComponent
     */
    ngOnInit(): void {
        this.getFinancialYears();
    }

    /**
     * This will get all existing financial years for the company
     *
     * @memberof ColumnarReportComponent
     */
    public getFinancialYears(): void {
        this.settingsFinancialYearService.GetAllFinancialYears().subscribe(res => {
            if (res && res.body && res.body.financialYears) {
                res.body.financialYears.forEach(key => {
                    let financialYearStarts = moment(key.financialYearStarts, GIDDH_DATE_FORMAT).format("MMM-YYYY");
                    let financialYearEnds = moment(key.financialYearEnds, GIDDH_DATE_FORMAT).format("MMM-YYYY");
                    this.selectYear.push({ label: financialYearStarts + " - " + financialYearEnds, value: key });
                });
            }
        });
    }

    /**
     * Callback for group selection
     *
     * @param {*} event
     * @memberof ColumnarReportComponent
     */
    public selectGroup(event: any): void {
        this.groupUniqueName = event.value;
    }

    /**
     * This will export the report in excel sheet
     *
     * @memberof ColumnarReportComponent
     */
    public exportReport(): void {
        if (!this.isLoading) {
            this.isLoading = true;
            let monthYear = [];
            let startDate = moment(new Date(this.fromMonth));
            let monthsCount = moment(new Date(this.toMonth)).diff(startDate, 'months');

            monthYear.push(moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MM-YYYY"));

            for (let dateLoop = 1; dateLoop <= monthsCount; dateLoop++) {
                startDate = startDate.add(1, 'month');
                monthYear.push(moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MM-YYYY"));
            }

            this.exportRequest.monthYear = monthYear;
            this.ledgerService.downloadColumnarReport(this.companyUniqueName, this.groupUniqueName, this.exportRequest).subscribe((res) => {
                this.isLoading = false;
                if (res.status === "success") {
                    this.exportRequest = {};
                    this.groupUniqueName = '';
                    this.forceClear$ = observableOf({status: true});
                    this.fromMonthNames = [];
                    this.toMonthNames = [];

                    let blob = this.generalService.base64ToBlob(res.body, 'application/xls', 512);
                    return saveAs(blob, `ColumnarReport.xlsx`);
                } else {
                    this.toaster.clearAllToaster();
                    this.toaster.errorToast(res.message);
                }
            });
        }
    }

    /**
     * Destroyes the data stored
     *
     * @memberof ColumnarReportComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Callback for select year to prepare list of months
     *
     * @param {*} event
     * @memberof ColumnarReportComponent
     */
    public selectFinancialYear(event): void {
        if (event && event.value) {
            this.financialYearSelected = event.value;
            this.exportRequest.financialYear = moment(event.value.financialYearStarts, GIDDH_DATE_FORMAT).format("MMM-YYYY");

            let financialYearStarts = moment(new Date(event.value.financialYearStarts.split("-").reverse().join("-")));
            let financialYearEnds = moment(new Date(event.value.financialYearEnds.split("-").reverse().join("-")));
            let startDate = financialYearStarts;
            let monthsCount = financialYearEnds.diff(financialYearStarts, 'months');
            
            this.fromMonthNames = [];
            this.toMonthNames = [];

            this.fromMonthNames.push({label: moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MMM-YYYY"), value: startDate.toDate()});
            this.toMonthNames.push({label: moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MMM-YYYY"), value: startDate.toDate()});

            for (let dateLoop = 1; dateLoop <= monthsCount; dateLoop++) {
                startDate = startDate.add(1, 'month');
                this.fromMonthNames.push({label: moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MMM-YYYY"), value: startDate.toDate()});
                this.toMonthNames.push({label: moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MMM-YYYY"), value: startDate.toDate()});
            }
        }
    }

    /**
     * Checks if form is valid
     *
     * @returns {boolean}
     * @memberof ColumnarReportComponent
     */
    public isFormValid(): boolean {
        if(this.exportRequest.financialYear && this.groupUniqueName) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Callback for select from month to update list of to months
     *
     * @param {*} event
     * @memberof ColumnarReportComponent
     */
    public selectFromMonth(event) {
        if(event.value) {
            let fromMonth = moment(new Date(this.financialYearSelected.financialYearStarts.split("-").reverse().join("-")));
            let toMonth = moment(new Date(this.financialYearSelected.financialYearEnds.split("-").reverse().join("-")));
            let startDate = fromMonth;
            let monthsCount = toMonth.diff(fromMonth, 'months');
            this.toMonthNames = [];

            this.toMonthNames.push({label: moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MMM-YYYY"), value: startDate.toDate(), disabled: (new Date(event.value) > startDate.toDate())});

            for (let dateLoop = 1; dateLoop <= monthsCount; dateLoop++) {
                startDate = startDate.add(1, 'month');
                this.toMonthNames.push({label: moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MMM-YYYY"), value: startDate.toDate(), disabled: (new Date(event.value) > startDate.toDate())});
            }
        }
    }

    /**
     * Callback for select to month to update list of from months
     *
     * @param {*} event
     * @memberof ColumnarReportComponent
     */
    public selectToMonth(event) {
        if(event.value) {
            let fromMonth = moment(new Date(this.financialYearSelected.financialYearStarts.split("-").reverse().join("-")));
            let toMonth = moment(new Date(this.financialYearSelected.financialYearEnds.split("-").reverse().join("-")));
            let startDate = fromMonth;
            let monthsCount = toMonth.diff(fromMonth, 'months');
            this.fromMonthNames = [];
            
            this.fromMonthNames.push({label: moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MMM-YYYY"), value: startDate.toDate(), disabled: (new Date(event.value) < startDate.toDate())});

            for (let dateLoop = 1; dateLoop <= monthsCount; dateLoop++) {
                startDate = startDate.add(1, 'month');
                this.fromMonthNames.push({label: moment(startDate.toDate(), GIDDH_DATE_FORMAT).format("MMM-YYYY"), value: startDate.toDate(), disabled: (new Date(event.value) < startDate.toDate())});
            }
        }
    }
}
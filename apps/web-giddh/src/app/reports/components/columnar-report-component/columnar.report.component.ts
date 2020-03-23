import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsFinancialYearService } from '../../../services/settings.financial-year.service';
import { select, Store } from '@ngrx/store';
import { takeUntil, take } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { IFlattenGroupsAccountsDetail } from '../../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { AppState } from '../../../store';
import { ToasterService } from '../../../services/toaster.service';
import { GeneralService } from '../../../services/general.service';
import { LedgerService } from '../../../services/ledger.service';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import * as moment from 'moment/moment';
import { saveAs } from "file-saver";

@Component({
    selector: 'columnar-report-component',
    templateUrl: './columnar.report.component.html',
    styleUrls: ['./columnar.report.component.scss']
})

export class ColumnarReportComponent implements OnInit, OnDestroy {
    public monthNames = [{ label: "January", value: "01" }, { label: "February", value: "02" }, { label: "March", value: "03" }, { label: "April", value: "04" }, { label: "May", value: "05" }, { label: "June", value: "06" }, { label: "July", value: "07" }, { label: "August", value: "08" }, { label: "September", value: "09" }, { label: "October", value: "10" }, { label: "November", value: "11" }, { label: "December", value: "12" }];
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

    constructor(public settingsFinancialYearService: SettingsFinancialYearService, private store: Store<AppState>, private toaster: ToasterService, private generalService: GeneralService, private ledgerService: LedgerService) {
        this.exportRequest.fileType = 'xls';
        this.activeCompanyUniqueName$ = this.store.pipe(select(p => p.session.companyUniqueName), (takeUntil(this.destroyed$)));
        this.flattenGroups$ = this.store.pipe(select(state => state.general.flattenGroups), takeUntil(this.destroyed$));

        this.flattenGroups$.subscribe(flattenGroups => {
            if (flattenGroups) {
                flattenGroups.forEach(key => {
                    if (!key.parentGroups || key.parentGroups.length === 0) {
                        this.flatGroupsOptions.push({ label: key.groupName, value: key.groupUniqueName });
                    }
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
                    this.selectYear.push({ label: financialYearStarts + " - " + financialYearEnds, value: financialYearStarts });
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
     * Callback for month selection
     *
     * @param {*} event
     * @memberof ColumnarReportComponent
     */
    public selectMonth(event: any): void {
        this.exportRequest.monthYear = event.value + "-" + moment().year();
    }

    /**
     * This will export the report in excel sheet
     *
     * @memberof ColumnarReportComponent
     */
    public exportReport(): void {
        if (!this.isLoading) {
            this.isLoading = true;
            this.ledgerService.downloadColumnarReport(this.companyUniqueName, this.groupUniqueName, this.exportRequest).subscribe((res) => {
                if (res.status === "success") {
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
}
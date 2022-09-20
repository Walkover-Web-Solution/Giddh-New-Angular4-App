import { Component, OnInit, OnDestroy, OnChanges, Input, SimpleChanges } from '@angular/core';
import { SettingsFinancialYearService } from '../../../services/settings.financial-year.service';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, of } from 'rxjs';
import { AppState } from '../../../store';
import { ToasterService } from '../../../services/toaster.service';
import { cloneDeep } from '../../../lodash-optimized';

@Component({
    selector: 'columnar-report-table-component',
    templateUrl: './columnar.report.table.component.html',
    styleUrls: ['./columnar.report.table.component.scss']
})

export class ColumnarReportTableComponent implements OnInit, OnDestroy, OnChanges {
    /** Column name hard coded due to it is dynamic and get modify at run time */
    public columnsName = [];
    /** Array of Month names for dynamic column name for months  */
    public months = [];
    /** Array of dynamic month name  */
    public monthName: string[] = [];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Columnar report table response object */
    @Input() columnarReportResponse: any;
    /** Columnar report table status of Cr/Dr to +/-  */
    @Input() isBalanceTypeAsSign: any;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public isCrDrChecked: boolean = false;
    /** To check columnar report table's column name closing and opening will be the part of table or not */
    public isShowClosingOpeningBalance$: Observable<boolean> = of(false);

    constructor(public settingsFinancialYearService: SettingsFinancialYearService, private store: Store<AppState>, private toaster: ToasterService) {

    }

    /**
     * Initializes the component
     *
     * @memberof ColumnarReportTableComponent
     */
    public ngOnInit(): void {
        this.columnsName = ['#', this.localeData?.name_of_ledger, this.localeData?.parent_group, this.localeData?.opening_balance, this.localeData?.closing_balance];
        this.months = [this.commonLocaleData?.app_months_full.january, this.commonLocaleData?.app_months_full.february, this.commonLocaleData?.app_months_full.march, this.commonLocaleData?.app_months_full.april, this.commonLocaleData?.app_months_full.may, this.commonLocaleData?.app_months_full.june, this.commonLocaleData?.app_months_full.july, this.commonLocaleData?.app_months_full.august, this.commonLocaleData?.app_months_full.september, this.commonLocaleData?.app_months_full.october, this.commonLocaleData?.app_months_full.november, this.commonLocaleData?.app_months_full.december];

        this.columnarReportResponse = null;
    }

    /**
     *  Life cycle hook for data-bound property of a directive changed
     *
     * @param {SimpleChanges} changes
     * @memberof ColumnarReportTableComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes['columnarReportResponse'] && changes['columnarReportResponse'].currentValue) {
            this.reformationOfColumnarReport(changes['columnarReportResponse'].currentValue);
            this.columnarReportResponse = changes['columnarReportResponse'].currentValue;
            this.mapDataForMonthColumnName();
        }
        if (changes && changes['isBalanceTypeAsSign']) {
            this.isCrDrChecked = changes['isBalanceTypeAsSign'].currentValue;
        }

    }

    /**
     * Destroyes the data stored
     *
     * @memberof ColumnarReportTableComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * To create table data as table is dynamic
     *
     * @param {*} columnarRes columnar report table response object
     * @memberof ColumnarReportTableComponent
     */
    public reformationOfColumnarReport(columnarRes: any): void {
        this.columnsName = [];
        this.monthName = [];
        this.columnsName = ['#', this.localeData?.name_of_ledger, this.localeData?.parent_group, this.localeData?.opening_balance, this.localeData?.closing_balance, this.localeData?.grand_total];
        let response = cloneDeep(columnarRes);
        if (columnarRes && columnarRes.closingBalance) {
            if (!Object.keys(columnarRes.closingBalance)?.length) {
                this.columnsName.splice(3, 2);
                this.isShowClosingOpeningBalance$ = of(false);
            } else {
                this.isShowClosingOpeningBalance$ = of(true);
            }
        }
        if (columnarRes && columnarRes.data && columnarRes.data.length) {
            columnarRes.data.map((key, index) => {
                if (key && response && response.data) {
                    let monthNo = response.data[index].monthYear.split('-')[0];
                    this.columnsName.push(this.months[Number(monthNo) - 1]);
                    this.monthName.push(this.months[Number(monthNo) - 1]);
                }
            });

        }
    }
    /**
     *To Map with column name
     *
     * @memberof ColumnarReportTableComponent
     */
    public mapDataForMonthColumnName() {
        if (this.columnarReportResponse && this.columnarReportResponse.data && this.columnarReportResponse.data.length) {
            this.columnarReportResponse.data.map((item, index) => {
                item.monthName = this.monthName[index];
            });
        }
    }
}

import { Component, OnInit, OnDestroy, OnChanges, Input, SimpleChanges } from '@angular/core';
import { SettingsFinancialYearService } from '../../../services/settings.financial-year.service';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, of as observableOf, of } from 'rxjs';
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
    public columnsName = ['#', 'Name of Ledger', 'Parent Group', 'Opening Balance', 'Closing Balance'];
    /** Array of Month names for dynamic column name for months  */
    public months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Columnar report table response object */
    @Input() columnarReportResponse: any;
    /** To check columnar report table's column name closing and opening will be the part of table or not */
    public isShowClosingOpeningBalance$: Observable<boolean> = of(false);

    constructor(public settingsFinancialYearService: SettingsFinancialYearService, private store: Store<AppState>, private toaster: ToasterService) {
        //
    }

    /**
     * Initializes the component
     *
     * @memberof ColumnarReportTableComponent
     */
    ngOnInit(): void {
        this.columnarReportResponse = null;
        //
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
        this.columnsName = ['#', 'Name of Ledger', 'Parent Group', 'Opening Balance', 'Closing Balance', 'Grand Total'];
        let response = cloneDeep(columnarRes);
        if (columnarRes && columnarRes.closingBalance) {
            if (!Object.keys(columnarRes.closingBalance).length) {
                this.columnsName.splice(3, 2);
                this.isShowClosingOpeningBalance$ = of(false);
            } else {
                this.isShowClosingOpeningBalance$ = of(true);
            }
        }
        if (columnarRes && columnarRes.data && columnarRes.data.length) {
            if (columnarRes && columnarRes.data && columnarRes.data.length) {
                columnarRes.data.forEach((key, index) => {
                    if (key && response) {
                        let monthNo = response.data[index].monthYear.split('-')[0];
                        this.columnsName.push(this.months[Number(monthNo) - 1]);
                    }
                });
            }
        }
    }

}

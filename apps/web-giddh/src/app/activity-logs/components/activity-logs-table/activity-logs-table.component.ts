import { Component, OnDestroy, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuditLogsActions } from '../../../actions/audit-logs/audit-logs.actions';
import { cloneDeep } from '../../../lodash-optimized';
import { GetAuditLogsRequest } from '../../../models/api-models/Logs';
import { AppState } from '../../../store/roots';

@Component({
    selector: 'activity-logs-table',
    templateUrl: './activity-logs-table.component.html',
    styleUrls: ['activity-logs-table.component.scss']
})
export class ActivityLogsTableComponent implements OnInit, OnDestroy {
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** To toggle multiple line show/hide for address*/
    public showSingleAddress: boolean = false;
    /** Total pages in activity log response*/
    public totalPages$: Observable<number>;
    /** To load more activity logs call in process observers */
    public loadMoreInProcess$: Observable<boolean>;
    /** Page count for activity log request */
    public page$: Observable<number>;
    /** Activity log response list */
    public auditLogs$: Observable<any[]>;
    /** Activity log request */
    public auditLogsRequest$: Observable<GetAuditLogsRequest>;
    /** To show hide field */
    public isShowMultipleDataIndex: number = null;
    /** To destroy observers */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if api call in progress */
    public isLoading: boolean = false;
    // public arr=[{
    //     {
    //         "page": 1,
    //         "count": 20,
    //         "totalPages": 3,
    //         "totalItems": 43,
    //         "results": [
    //             {
    //                 "type": "GROUP",
    //                 "name": "Cash",
    //                 "uniqueName": "cash",
    //                 "parentGroups": [
    //                     {
    //                         "name": "Current Assets",
    //                         "uniqueName": "currentassets",
    //                         "category": "assets"
    //                     }
    //                 ],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             },
    //             {
    //                 "type": "GROUP",
    //                 "name": "IGST",
    //                 "uniqueName": "igst",
    //                 "parentGroups": [
    //                     {
    //                         "name": "Current Liabilities",
    //                         "uniqueName": "currentliabilities",
    //                         "category": "liabilities"
    //                     },
    //                     {
    //                         "name": "Duties & Taxes",
    //                         "uniqueName": "dutiestaxes",
    //                         "category": null
    //                     }
    //                 ],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             },
    //             {
    //                 "type": "GROUP",
    //                 "name": "SGST",
    //                 "uniqueName": "sgst",
    //                 "parentGroups": [
    //                     {
    //                         "name": "Current Liabilities",
    //                         "uniqueName": "currentliabilities",
    //                         "category": "liabilities"
    //                     },
    //                     {
    //                         "name": "Duties & Taxes",
    //                         "uniqueName": "dutiestaxes",
    //                         "category": null
    //                     }
    //                 ],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             },
    //             {
    //                 "type": "GROUP",
    //                 "name": "CGST",
    //                 "uniqueName": "cgst",
    //                 "parentGroups": [
    //                     {
    //                         "name": "Current Liabilities",
    //                         "uniqueName": "currentliabilities",
    //                         "category": "liabilities"
    //                     },
    //                     {
    //                         "name": "Duties & Taxes",
    //                         "uniqueName": "dutiestaxes",
    //                         "category": null
    //                     }
    //                 ],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             },
    //             {
    //                 "type": "GROUP",
    //                 "name": "Sales",
    //                 "uniqueName": "sales",
    //                 "parentGroups": [
    //                     {
    //                         "name": "Revenue From Operations",
    //                         "uniqueName": "revenuefromoperations",
    //                         "category": "income"
    //                     }
    //                 ],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             },
    //             {
    //                 "type": "GROUP",
    //                 "name": "UTGST",
    //                 "uniqueName": "utgst",
    //                 "parentGroups": [
    //                     {
    //                         "name": "Current Liabilities",
    //                         "uniqueName": "currentliabilities",
    //                         "category": "liabilities"
    //                     },
    //                     {
    //                         "name": "Duties & Taxes",
    //                         "uniqueName": "dutiestaxes",
    //                         "category": null
    //                     }
    //                 ],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             },
    //             {
    //                 "type": "GROUP",
    //                 "name": "Sub SD",
    //                 "uniqueName": "subsd",
    //                 "parentGroups": [
    //                     {
    //                         "name": "Current Assets",
    //                         "uniqueName": "currentassets",
    //                         "category": "assets"
    //                     },
    //                     {
    //                         "name": "Sundry Debtors",
    //                         "uniqueName": "sundrydebtors",
    //                         "category": null
    //                     },
    //                     {
    //                         "name": "Subgroup of sundry debtor ",
    //                         "uniqueName": "subgroupofsundrydebtor",
    //                         "category": null
    //                     }
    //                 ],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             },
    //             {
    //                 "type": "GROUP",
    //                 "name": "Discount",
    //                 "uniqueName": "discount",
    //                 "parentGroups": [
    //                     {
    //                         "name": "Operating Cost",
    //                         "uniqueName": "operatingcost",
    //                         "category": "expenses"
    //                     }
    //                 ],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             },
    //             {
    //                 "type": "GROUP",
    //                 "name": "GST CESS",
    //                 "uniqueName": "gstcess",
    //                 "parentGroups": [
    //                     {
    //                         "name": "Current Liabilities",
    //                         "uniqueName": "currentliabilities",
    //                         "category": "liabilities"
    //                     },
    //                     {
    //                         "name": "Duties & Taxes",
    //                         "uniqueName": "dutiestaxes",
    //                         "category": null
    //                     }
    //                 ],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             },
    //             {
    //                 "type": "GROUP",
    //                 "name": "Purchases",
    //                 "uniqueName": "purchases",
    //                 "parentGroups": [
    //                     {
    //                         "name": "Operating Cost",
    //                         "uniqueName": "operatingcost",
    //                         "category": "expenses"
    //                     }
    //                 ],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             },
    //             {
    //                 "type": "GROUP",
    //                 "name": "TDS payable",
    //                 "uniqueName": "tdspayable",
    //                 "parentGroups": [
    //                     {
    //                         "name": "Current Liabilities",
    //                         "uniqueName": "currentliabilities",
    //                         "category": "liabilities"
    //                     },
    //                     {
    //                         "name": "Duties & Taxes",
    //                         "uniqueName": "dutiestaxes",
    //                         "category": null
    //                     }
    //                 ],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             },
    //             {
    //                 "type": "GROUP",
    //                 "name": "TCS payable",
    //                 "uniqueName": "tcspayable",
    //                 "parentGroups": [
    //                     {
    //                         "name": "Current Liabilities",
    //                         "uniqueName": "currentliabilities",
    //                         "category": "liabilities"
    //                     },
    //                     {
    //                         "name": "Duties & Taxes",
    //                         "uniqueName": "dutiestaxes",
    //                         "category": null
    //                     }
    //                 ],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             },
    //             {
    //                 "type": "GROUP",
    //                 "name": "Other Income",
    //                 "uniqueName": "otherincome",
    //                 "parentGroups": [],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             },
    //             {
    //                 "type": "GROUP",
    //                 "name": "Fixed Assets",
    //                 "uniqueName": "fixedassets",
    //                 "parentGroups": [],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             },
    //             {
    //                 "type": "GROUP",
    //                 "name": "Bank Accounts",
    //                 "uniqueName": "bankaccounts",
    //                 "parentGroups": [
    //                     {
    //                         "name": "Current Assets",
    //                         "uniqueName": "currentassets",
    //                         "category": "assets"
    //                     }
    //                 ],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             },
    //             {
    //                 "type": "GROUP",
    //                 "name": "Exchange Gain",
    //                 "uniqueName": "exchangegain",
    //                 "parentGroups": [
    //                     {
    //                         "name": "Other Income",
    //                         "uniqueName": "otherincome",
    //                         "category": "income"
    //                     }
    //                 ],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             },
    //             {
    //                 "type": "GROUP",
    //                 "name": "Exchange Loss",
    //                 "uniqueName": "exchangeloss",
    //                 "parentGroups": [
    //                     {
    //                         "name": "Indirect Expenses",
    //                         "uniqueName": "indirectexpenses",
    //                         "category": "expenses"
    //                     }
    //                 ],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             },
    //             {
    //                 "type": "GROUP",
    //                 "name": "Tax On Export",
    //                 "uniqueName": "taxonexport",
    //                 "parentGroups": [
    //                     {
    //                         "name": "Current Assets",
    //                         "uniqueName": "currentassets",
    //                         "category": "assets"
    //                     }
    //                 ],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             },
    //             {
    //                 "type": "GROUP",
    //                 "name": "Operating Cost",
    //                 "uniqueName": "operatingcost",
    //                 "parentGroups": [],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             },
    //             {
    //                 "type": "GROUP",
    //                 "name": "Current Assets",
    //                 "uniqueName": "currentassets",
    //                 "parentGroups": [],
    //                 "mergedAccounts": "",
    //                 "route": ""
    //             }
    //         ]  
    //     }
    // }]

    constructor(private store: Store<AppState>, private auditLogsActions: AuditLogsActions) {
        this.loadMoreInProcess$ = this.store.pipe(select(state => state.auditlog.LoadMoreInProcess), takeUntil(this.destroyed$));
        this.totalPages$ = this.store.pipe(select(state => state.auditlog.totalPages), takeUntil(this.destroyed$));
        this.page$ = this.store.pipe(select(state => state.auditlog.currentPage), takeUntil(this.destroyed$));
        this.auditLogs$ = this.store.pipe(select(state => state.auditlog.auditLogs), takeUntil(this.destroyed$));
        this.auditLogsRequest$ = this.store.pipe(select(state => state.auditlog.auditLogsRequest), takeUntil(this.destroyed$));
    }

    /**
     *  Component lifecycle call stack
     *
     * @memberof AuditLogsTableComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(state => state.auditlog.getLogInProcess), takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = response;
        });

        this.auditLogs$.subscribe(res => {
            console.log(res);
        })
    }

    /**
     *  Component lifecycle call stack
     *
     * @memberof AuditLogsTableComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * To load more new data of audit logs
     *
     * @memberof AuditLogsTableComponent
     */
    public loadMoreLogs(): void {
        this.store.pipe(select(state => state.auditlog), take(1)).subscribe((response) => {
            let request = cloneDeep(response.auditLogsRequest);
            request.page = response.currentPage + 1;
            this.store.dispatch(this.auditLogsActions.getAuditLogs(request));
        });
    }

    /**
     * To open hide field
     *
     * @param {number} index Index number
     * @memberof AuditLogsTableComponent
     */
    public openAllAddress(index: number): void {
        this.showSingleAddress = !this.showSingleAddress;
        this.isShowMultipleDataIndex = index;
    }
}

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ReportsModel } from "../../../models/api-models/Reports";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../../store";
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { CurrentCompanyState } from '../../../store/company/company.reducer';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'reports-table-component',
    templateUrl: './report.table.component.html',
    styleUrls: ['./report.table.component.scss']
})

export class ReportsTableComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Input() public reportRespone: ReportsModel[];
    @Input() public activeFinacialYr: any;
    @Input() salesRegisterTotal: any;
    public toDate: string;
    public fromDate: string;
    public activeTab: any = 'customer';
    public purchaseOrSales: 'sales' | 'purchase';
    /** True, if company country supports other tax (TCS/TDS) */
    public isTcsTdsApplicable: boolean;
    /** Stores the current branch unique name used for filtering */
    @Input() public currentBranchUniqueName: string;
    @Input() tableData: any = [];
    @Input() showColumName: any = {};
    @Input() headerName: any = {};
    @Input() clickRow: any = {};
    /** This will use for displayed table columns */
    public displayedColumns: string[] = [];
    /** Subject to unsubscribe from subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private router: Router) {
    }

    /**
     * Initialize variables
     *
     * @memberof ReportsTableComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(appState => appState.company), takeUntil(this.destroyed$)).subscribe((companyData: CurrentCompanyState) => {
            if (companyData) {
                this.isTcsTdsApplicable = companyData.isTcsTdsApplicable;
            }
        });
    }

    ngOnChanges() {
        console.log(this.clickRow);

        this.displayedColumns = [];
        // Iterate through the array
        this.showColumName.forEach((item) => {
            // Get the key (e.g., "colA", "colB", etc.)
            const key = Object.keys(item)[0];

            // Check if the value is true, then add the key to displayedColumns
            if (item[key]) {
                this.displayedColumns.push(key);
            }
        });
    }

    // Add this in your component (TypeScript)
    isString(value: any): boolean {
        return typeof value === 'string';
    }

    /**
     * Unsubscribes from all the subscriptions
     *
     * @memberof PurchaseRegisterTableComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public GotoDetailedSales(item: ReportsModel) {
        let from = item.from;
        let to = item.to;

        if (from != null && to != null) {
            this.router.navigate(['pages', 'reports', 'sales-detailed-expand'], { queryParams: { from: from, to: to, branchUniqueName: this.currentBranchUniqueName, interval: item.interval, selectedMonth: item.selectedMonth } });
        }
    }
}

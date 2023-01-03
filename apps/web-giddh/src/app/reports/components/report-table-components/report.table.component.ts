import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ReportsModel } from "../../../models/api-models/Reports";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../../store";
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { CurrentCompanyState } from '../../../store/Company/company.reducer';
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

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PurchaseReportsModel } from "../../../models/api-models/Reports";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../../store";
import { Router } from '@angular/router';
import { CurrentCompanyState } from '../../../store/Company/company.reducer';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'purchase-register-table-component',
    templateUrl: './purchase.register.table.component.html',
    styleUrls: ['./purchase.register.table.component.scss']
})

export class PurchaseRegisterTableComponent implements OnInit, OnDestroy {
    @Input() public reportRespone: PurchaseReportsModel[];
    @Input() public activeFinacialYr: any;
    @Input() purchaseRegisterTotal: any;
    /** Stores the current branch unique name used for filtering */
    @Input() public currentBranchUniqueName: string;
    public toDate: string;
    public fromDate: string;
    public activeTab: any = 'customer';
    public purchaseOrSales: 'sales' | 'purchase';
    /** True, if company country supports other tax (TCS/TDS) */
    public isTcsTdsApplicable: boolean;
    /** Subject to unsubscribe from subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(private store: Store<AppState>, private router: Router) {

    }

    /**
     * Initializes the variables
     *
     * @memberof PurchaseRegisterTableComponent
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

    public gotoDetailedPurchase(item: PurchaseReportsModel) {
        let from = item.from;
        let to = item.to;

        if (from != null && to != null) {
            this.router.navigate(['pages', 'reports', 'purchase-detailed-expand'], { queryParams: { from: from, to: to, branchUniqueName: this.currentBranchUniqueName, interval: item.interval, selectedMonth: item.selectedMonth } });
        }
    }
}

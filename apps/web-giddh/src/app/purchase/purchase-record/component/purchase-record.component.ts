import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../../../store';
import { GeneralActions } from '../../../actions/general/general.actions';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { StateDetailsRequest } from '../../../models/api-models/Company';
import { CompanyActions } from '../../../actions/company.actions';

@Component({
    styleUrls: [`./purchase-record.component.scss`],
    templateUrl: './purchase-record.component.html'
})

export class PurchaseRecordComponent implements OnInit, OnDestroy {
    /* This will hold active tab */
    public activeTab: string = 'order';
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold if we need to refresh purchase bill list */
    public refreshPurchaseBill: boolean = false;

    constructor(
        private store: Store<AppState>,
        private generalAction: GeneralActions,
        public route: ActivatedRoute,
        private companyActions: CompanyActions,
        public router: Router
    ) {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params['type'] && this.activeTab !== params['type']) {
                this.activeTab = params['type'];
            }
        });
    }

    /**
     * Lifecycle hook
     *
     * @memberof PurchaseRecordComponent
     */
    public ngOnInit(): void {
        this.store.dispatch(this.generalAction.setAppTitle('/pages/purchase-management/purchase'));
        this.saveLastState(this.activeTab);
    }

    /**
     * Releases the memory
     *
     * @memberof PurchaseRecordComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Callback for on tab change
     *
     * @param {string} tabName
     * @memberof PurchaseRecordComponent
     */
    public onTabChanged(tabName: string): void {
        this.router.navigate(['pages/purchase-management/purchase/', tabName], { replaceUrl: true });
        this.saveLastState(tabName);
    }

    /**
     * This will get output by PO
     *
     * @param {boolean} event
     * @memberof PurchaseRecordComponent
     */
    public purchaseOrderOutput(event: boolean): void {
        this.refreshPurchaseBill = event;
    }

    /**
     * Saves the last state for purchase module
     *
     * @private
     * @param {string} tabName Current tab name
     * @memberof PurchaseRecordComponent
     */
    private saveLastState(tabName: string): void {
        let companyUniqueName = null;
        this.store.pipe(select(appState => appState.session.companyUniqueName), take(1)).subscribe(response => companyUniqueName = response);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = `pages/purchase-management/purchase/${tabName}`;
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    }
}

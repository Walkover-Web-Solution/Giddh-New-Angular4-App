import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { PurchaseOrderActions } from '../actions/purchase-order/purchase-order.action';
import { AppState } from '../store';

/**
 * Handles Component functionality
 */
@Component({
    styleUrls: [`./purchase.component.scss`],
    templateUrl: './purchase.component.html',
    standalone: false
})
/**
 * PurchaseComponent component
 * Handles purchase functionality and user interactions
 */
export class PurchaseComponent implements OnDestroy {
    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(private store: Store<AppState>, public purchaseOrderActions: PurchaseOrderActions) {

    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy(): void {
        this.store.dispatch(this.purchaseOrderActions.setPurchaseOrderFilters({}));
    }
}

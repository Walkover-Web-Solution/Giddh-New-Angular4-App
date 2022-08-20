import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { PurchaseOrderActions } from '../actions/purchase-order/purchase-order.action';
import { AppState } from '../store';

@Component({
    styleUrls: [`./purchase.component.scss`],
    templateUrl: './purchase.component.html'
})
export class PurchaseComponent implements OnDestroy {
    constructor(private store: Store<AppState>, public purchaseOrderActions: PurchaseOrderActions) {

    }

    public ngOnDestroy(): void {
        this.store.dispatch(this.purchaseOrderActions.setPurchaseOrderFilters({}));
    }
}

import { take } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanyActions } from '../actions/company.actions';
import { AppState } from '../store/roots';
import { Store, select } from '@ngrx/store';
import { StateDetailsRequest } from '../models/api-models/Company';
import { PurchaseOrderActions } from '../actions/purchase-order/purchase-order.action';

@Component({
    styleUrls: [`./purchase.component.scss`],
    templateUrl: './purchase.component.html'
})

export class PurchaseComponent implements OnInit, OnDestroy {

    constructor(private store: Store<AppState>, private _companyActions: CompanyActions, public purchaseOrderActions: PurchaseOrderActions) {

    }

    public ngOnInit(): void {
        let companyUniqueName = null;
        this.store.pipe(select(c => c.session.companyUniqueName), take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'purchase';

        this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
    }

    /**
     * Releases the memory
     *
     * @memberof PurchaseComponent
     */
    public ngOnDestroy(): void {
        this.store.dispatch(this.purchaseOrderActions.setPurchaseOrderFilters({}));
    }

}

import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../store';
import { GeneralActions } from '../../../actions/general/general.actions';
import { Store } from '@ngrx/store';

@Component({
    styleUrls: [`./purchase-record.component.scss`],
    templateUrl: './purchase-record.component.html'
})
export class PurchaseRecordComponent implements OnInit {

    /** @ignore */
    constructor(
        private store: Store<AppState>,
        private generalAction: GeneralActions
    ) {}

    /**
     * Lifecycle hook
     *
     * @memberof PurchaseRecordComponent
     */
    public ngOnInit(): void {
        this.store.dispatch(this.generalAction.setAppTitle('/pages/purchase-management/purchase'));
    }
}

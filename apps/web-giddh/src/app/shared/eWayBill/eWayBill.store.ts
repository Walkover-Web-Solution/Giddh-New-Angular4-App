import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { AppState } from "../../store";
import { Observable } from "rxjs";

export interface EWayBillComponentState {}

export const DEFAULT_E_WAY_BILL_STATE: EWayBillComponentState = {}

@Injectable()
export class EWayBillComponentStore extends ComponentStore<EWayBillComponentState> implements OnDestroy {

    constructor(
        private store: Store<AppState>) {
        super(DEFAULT_E_WAY_BILL_STATE);
    }

    public transporterList$: Observable<any> = this.select(this.store.select(state => state.ewaybillstate.TransporterList), (response) => response);
    public transporterListDetails$: Observable<any> = this.select(this.store.select(state => state.ewaybillstate.TransporterListDetails), (response) => response);
    public isGenarateTransporterSuccessfully$: Observable<any> = this.select(this.store.select(state => state.ewaybillstate.isAddnewTransporterInSuccess), (response) => response);
    public updateTransporterSuccess$: Observable<any> = this.select(this.store.select(state => state.ewaybillstate.updateTransporterSuccess), (response) => response);
    public isEwaybillGeneratedSuccessfully$: Observable<any> = this.select(this.store.select(state => state.ewaybillstate.isGenerateEwaybilSuccess), (response) => response);

    /**
     * Lifecycle hook for component destroy
     *
     * @memberof EWayBillComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
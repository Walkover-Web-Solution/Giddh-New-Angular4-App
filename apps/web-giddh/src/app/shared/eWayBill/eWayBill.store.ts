import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { AppState } from "../../store";
import { Observable } from "rxjs";


export interface EWayBillComponentState {

}

export const DEFAULT_E_WAY_BILL_STATE: EWayBillComponentState = {

};

@Injectable()
export class EWayBillComponentStore extends ComponentStore<EWayBillComponentState> implements OnDestroy {

    constructor(
        private store: Store<AppState>) {
        super(DEFAULT_E_WAY_BILL_STATE);
    }

    public isUserAddedSuccessfully$: Observable<any> = this.select(this.store.select(state => state.ewaybillstate.isEwaybillUserCreationSuccess), (response) => response);
    public isLoggedInUserEwayBill$: Observable<any> = this.select(this.store.select(state => state.ewaybillstate.isUserLoggedInEwaybillSuccess), (response) => response);
    public transporterList$: Observable<any> = this.select(this.store.select(state => state.ewaybillstate.TransporterList), (response) => response);
    public transporterListDetails$: Observable<any> = this.select(this.store.select(state => state.ewaybillstate.TransporterListDetails), (response) => response);
    public isGenarateTransporterSuccessfully$: Observable<any> = this.select(this.store.select(state => state.ewaybillstate.isAddnewTransporterInSuccess), (response) => response);
    public updateTransporterSuccess$: Observable<any> = this.select(this.store.select(state => state.ewaybillstate.updateTransporterSuccess), (response) => response);
    public updateTransporterInProcess$: Observable<any> = this.select(this.store.select(state => state.ewaybillstate.updateTransporterInProcess), (response) => response);
    public isGenarateTransporterInProcess$: Observable<any> = this.select(this.store.select(state => state.ewaybillstate.isAddnewTransporterInProcess), (response) => response);
    public isEwaybillGeneratedSuccessfully$: Observable<any> = this.select(this.store.select(state => state.ewaybillstate.isGenerateEwaybilSuccess), (response) => response);
    public isEwaybillGenerateInProcess$: Observable<any> = this.select(this.store.select(state => state.ewaybillstate.isGenerateEwaybillInProcess), (response) => response);

    /**
     * Lifecycle hook for component destroy
     *
     * @memberof ProjectWiseAccountingComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { AppState } from "../../../store";
import { ToasterService } from "../../../services/toaster.service";

export interface OtherTaxState {
}

const DEFAULT_STATE: OtherTaxState = {
};

@Injectable()
export class OtherTaxComponentStore extends ComponentStore<OtherTaxState> {

    constructor(
        private store: Store<AppState>,
        private toast: ToasterService
    ) {
        super(DEFAULT_STATE);
    }

    public companyTaxes$: Observable<any> = this.select(this.store.select(state => state.company.taxes), (response) => response);

    private showErrorToast(type: any, message: any): void {
        if (type === 'error') {
            this.toast.showSnackBar("error", message);
        } else {
            this.toast.showSnackBar("success", message);

        }
    }
}
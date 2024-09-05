import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { ToasterService } from "../../services/toaster.service";
import { VoucherService } from "../../services/voucher.service";
import { AppState } from "../../store";

export interface VoucherPreviewState {
    isLoading: boolean;
    createUpdateInProgress: boolean;
}

const DEFAULT_STATE: VoucherPreviewState = {
    isLoading: false,
    createUpdateInProgress: null,
};

@Injectable()
export class VoucherPreviewComponentStore extends ComponentStore<VoucherPreviewState> {
    public isLoading$ = this.select((state) => state.isLoading);

    constructor(
        private store: Store<AppState>,
        private toaster: ToasterService,
        private voucherService: VoucherService,
    ) {
        super(DEFAULT_STATE);
    }


    // public companyProfile$: Observable<any> = this.select(this.store.select(state => state.settings.profile), (response) => response);
    // public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);
    // public company$: Observable<any> = this.select(this.store.select(state => state.company), (response) => response);
    // public companyTaxes$: Observable<any> = this.select(this.store.select(state => state.company.taxes), (response) => response);
    // public branchList$: Observable<any> = this.select(this.store.select(state => state.settings.branches), (response) => response);;
    // public universalDate$: Observable<any> = this.select(this.store.select(state => state.session.applicationDate), (response) => response);




}
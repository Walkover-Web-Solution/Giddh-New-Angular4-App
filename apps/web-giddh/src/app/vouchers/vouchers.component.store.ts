import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { BaseResponse } from "../models/api-models/BaseResponse";
import { ToasterService } from "../services/toaster.service";

export interface VoucherState {
    isLoading: boolean;
    createUpdateRes: BaseResponse<any, any>;
    createUpdateInProgress: boolean;
}

const DEFAULT_STATE: VoucherState = {
    isLoading: false,
    createUpdateRes: null,
    createUpdateInProgress: null,
};

@Injectable()
export class VoucherComponentStore extends ComponentStore<VoucherState> {
    
    constructor(
        private toast: ToasterService
    ) {
        super(DEFAULT_STATE);
    }

    public isLoading$ = this.select((state) => state.isLoading);
    public createUpdateInProgress$ = this.select((state) => state.createUpdateInProgress);
    public createUpdateRes$ = this.select((state) => state.createUpdateRes);


    private showErrorToast(error: any): void {
        this.toast.showSnackBar("error", error);
    }
}
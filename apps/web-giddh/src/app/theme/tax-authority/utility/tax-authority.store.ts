import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { ITaxAuthority } from "../../../models/interfaces/tax.interface";
import { AppState } from "../../../store";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { ToasterService } from "../../../services/toaster.service";
import { SettingsTaxesService } from "../../../services/settings.taxes.service";

export interface TaxAuthorityState {
    isLoading: boolean;
    taxAuthorityList: ITaxAuthority[];
    createTaxAuthorityIsSuccess: boolean;
    deleteTaxAuthorityIsSuccess: boolean;
    updateTaxAuthorityIsSuccess: boolean;
}

const DEFAULT_STATE: TaxAuthorityState = {
    isLoading: false,
    taxAuthorityList: null,
    createTaxAuthorityIsSuccess: null,
    updateTaxAuthorityIsSuccess: null,
    deleteTaxAuthorityIsSuccess: null
};

@Injectable()
export class TaxAuthorityComponentStore extends ComponentStore<TaxAuthorityState> {

    constructor(
        private toaster: ToasterService,
        private settingsTaxesService: SettingsTaxesService
    ) {
        super(DEFAULT_STATE);
    }

    public isLoading$ = this.select((state) => state.isLoading);
    public taxAuthorityList$ = this.select((state) => state.taxAuthorityList);
    public deleteTaxAuthorityIsSuccess$ = this.select((state) => state.deleteTaxAuthorityIsSuccess);
    public createTaxAuthorityIsSuccess$ = this.select((state) => state.createTaxAuthorityIsSuccess);
    public updateTaxAuthorityIsSuccess$ = this.select((state) => state.updateTaxAuthorityIsSuccess);

    readonly getTaxAuthorityList = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap(() => {
                this.patchState({ isLoading: true });
                return this.settingsTaxesService.GetTaxAuthorityList().pipe(
                    tapResponse(
                        (res: BaseResponse<ITaxAuthority[], any>) => {
                            return this.patchState({
                                taxAuthorityList: res?.body ?? [],
                                isLoading: false
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                taxAuthorityList: [],
                                isLoading: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getStateList = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap(() => {
                this.patchState({ isLoading: true });
                return this.settingsTaxesService.GetTaxAuthorityList().pipe(
                    tapResponse(
                        (res: BaseResponse<ITaxAuthority[], any>) => {
                            return this.patchState({
                                taxAuthorityList: res?.body ?? [],
                                isLoading: false
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                taxAuthorityList: [],
                                isLoading: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly createTaxAuthority = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ createTaxAuthorityIsSuccess: null });
                return this.settingsTaxesService.CreateTaxAuthority(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            this.toaster.showSnackBar("success", "Tax authority created successfully"); // Need to translate
                            return this.patchState({
                                createTaxAuthorityIsSuccess: true
                            });
                        },
                        (error: any) => {                    
                            this.toaster.showSnackBar("error", error?.error?.message);
                            return this.patchState({
                                createTaxAuthorityIsSuccess: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly updateTaxAuthority = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ updateTaxAuthorityIsSuccess: null });
                return this.settingsTaxesService.UpdateTaxAuthority(req.model, req.uniqueName).pipe(
                    tapResponse(
                        (res: BaseResponse<ITaxAuthority[], any>) => {
                            return this.patchState({
                                updateTaxAuthorityIsSuccess: true
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                updateTaxAuthorityIsSuccess: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly deleteTaxAuthority = this.effect((data: Observable<string>) => {
        return data.pipe(
            switchMap((req) => {
                console.log("req", req);
                
                this.patchState({ deleteTaxAuthorityIsSuccess: null });
                return this.settingsTaxesService.DeleteTaxAuthority(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            return this.patchState({
                                deleteTaxAuthorityIsSuccess: true
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                deleteTaxAuthorityIsSuccess: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });
}
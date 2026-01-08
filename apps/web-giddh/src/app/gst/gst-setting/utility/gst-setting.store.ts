import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { Observable, switchMap, catchError, EMPTY, mergeMap } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { AppState } from "../../../store";
import { ToasterService } from "../../../services/toaster.service";
import { GstReconcileService } from "../../../services/gst-reconcile.service";
import { LocaleService } from "../../../services/locale.service";

export interface GstSettingState {
    isLoading: boolean;
    deleteLutNumberIsSuccess: boolean;
    lutNumberList: any[];
    lutNumberResponse: any;
    updateLutNumberResponse: any;
}

const DEFAULT_STATE: GstSettingState = {
    isLoading: false,
    deleteLutNumberIsSuccess: false,
    lutNumberList: null,
    lutNumberResponse: null,
    updateLutNumberResponse: null
};

@Injectable()
export class GstSettingComponentStore extends ComponentStore<GstSettingState> {

    constructor(
        private store: Store<AppState>,
        private toaster: ToasterService,
        private gstReconcileService: GstReconcileService,
        private localeService: LocaleService
    ) {
        super(DEFAULT_STATE);
    }

    public isLoading$ = this.select((state) => state.isLoading);
    public lutNumberList$ = this.select((state) => state.lutNumberList);
    public deleteLutNumberIsSuccess$ = this.select((state) => state.deleteLutNumberIsSuccess);
    public lutNumberResponse$ = this.select((state) => state.lutNumberResponse);
    public updateLutNumberResponse$ = this.select((state) => state.updateLutNumberResponse);
    public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);
    public universalDate$: Observable<any> = this.select(this.store.select(state => state.session.applicationDate), (response) => response);

    readonly getLutNumberList = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap(() => {
                this.patchState({ isLoading: true });
                return this.gstReconcileService.getLutNumberList().pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            return this.patchState({
                                lutNumberList: res?.body ?? [],
                                isLoading: false
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                lutNumberList: [],
                                isLoading: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });


    readonly deleteLutNumber = this.effect((data: Observable<{ lutNumberUniqueName: any }>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ isLoading: true, deleteLutNumberIsSuccess: false });
                return this.gstReconcileService.deleteLutNumber(req.lutNumberUniqueName).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res.status === "success") {
                                this.toaster.showSnackBar("success", res.body);
                                return this.patchState({ isLoading: false, deleteLutNumberIsSuccess: true });
                            } else {
                                this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ isLoading: false, deleteLutNumberIsSuccess: false });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ isLoading: false, deleteLutNumberIsSuccess: false });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });


    readonly createLutNumber = this.effect((data: Observable<{ q: any, index: number }>) => {
        return data.pipe(
            mergeMap((req) => {
                this.patchState({ isLoading: true, lutNumberResponse: null });
                return this.gstReconcileService.createLutNumber(req.q).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    lutNumberResponse: { message: null, successMessage: res.body, lutIndex: req.index, lutNumberItem: req.q }, isLoading: false
                                });
                            } else {
                                return this.patchState({
                                    lutNumberResponse: { message: res.message, lutIndex: req.index, lutNumberItem: req.q }, isLoading: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar('error', this.localeService.translate("app_something_went_wrong"));
                            return this.patchState({
                                lutNumberResponse: { message: error.message, lutIndex: req.index, lutNumberItem: req.q }, isLoading: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly updateLutNumber = this.effect((data: Observable<{ q: any, index: number }>) => {
        return data.pipe(
            mergeMap((req) => {
                this.patchState({ isLoading: true, lutNumberResponse: null });
                return this.gstReconcileService.updateLutNumber(req.q).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    lutNumberResponse: { message: null, successMessage: res.body, lutIndex: req.index, lutNumberItem: req.q }, isLoading: false
                                });
                            } else {
                                return this.patchState({
                                    lutNumberResponse: { message: res.message, lutIndex: req.index, lutNumberItem: req.q }, isLoading: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar('error', 'Something went wrong! Please try again.');
                            return this.patchState({
                                lutNumberResponse: { message: error.message, lutIndex: req.index, lutNumberItem: req.q }, isLoading: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });



}

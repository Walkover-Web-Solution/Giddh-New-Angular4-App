import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { AppState } from "../../store";
import { InventoryService } from "../../services/inventory.service";
import { Observable, switchMap } from "rxjs";
import { BaseResponse } from "../../models/api-models/BaseResponse";
import { ToasterService } from "../../services/toaster.service";
import { Router } from "@angular/router";

export interface InventoryState {
    isLoading: boolean;
}

const DEFAULT_STATE: InventoryState = {
    isLoading: false
};

@Injectable()
export class InventoryComponentStore extends ComponentStore<any> {
    constructor(
        private store: Store<AppState>,
        private inventoryService: InventoryService,
        private toaster: ToasterService,
        public router: Router
    ) {
        super(DEFAULT_STATE);
    }

    public isLoading$ = this.select((state) => state.isLoading);

    /**
     * This will use for Export Item Wise Report Data
     *
     * @memberof InventoryComponentStore
     */
    readonly exportStock = this.effect((data$: Observable<{ stockReportRequest: any, queryParams: any }>) => {
        return data$.pipe(
            switchMap((req) => {
                this.patchState({ isLoading: true });
                return this.inventoryService.getItemWiseReportExport(req.queryParams, req.stockReportRequest).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res.status === "success") {
                                if (typeof res?.body === "string") {
                                    this.toaster.showSnackBar("success", res.body);
                                    this.router.navigate(["/pages/downloads"]);
                                    return this.patchState({
                                        isLoading: false
                                    });
                                }
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({
                                    isLoading: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                isLoading: false
                            });
                        }
                    ),
                )
            })
        );
    });
    /**
     * This will use for Export Variant Wise Report Data
     *
     * @memberof InventoryComponentStore
     */
    readonly exportVariant = this.effect((data$: Observable<{ stockReportRequest: any, queryParams: any }>) => {
        return data$.pipe(
            switchMap((req) => {
                this.patchState({ isLoading: true });
                return this.inventoryService.getVariantWiseReportExport(req.queryParams, req.stockReportRequest).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res.status === "success") {
                                if (typeof res?.body === "string") {
                                    this.toaster.showSnackBar("success", res.body);
                                    this.router.navigate(["/pages/downloads"]);
                                    return this.patchState({
                                        isLoading: false
                                    });
                                }
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({
                                    isLoading: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                isLoading: false
                            });
                        }
                    ),
                )
            })
        );
    });
}
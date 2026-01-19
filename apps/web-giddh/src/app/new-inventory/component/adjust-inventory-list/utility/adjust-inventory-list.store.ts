
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tap } from "rxjs/operators";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "apps/web-giddh/src/app/store";
import { InventoryService } from "apps/web-giddh/src/app/services/inventory.service";
import { ToasterService } from "apps/web-giddh/src/app/services/toaster.service";
import { BaseResponse } from "apps/web-giddh/src/app/models/api-models/BaseResponse";

/**
 * AdjustInventoryListState interface definition
 * Defines the structure and contract for AdjustInventoryListState objects
 */
export interface AdjustInventoryListState {
    adjustInventoryListInProgress: boolean;
    adjustInventoryList: any;
    deleteAdjustInventoryInProgress: boolean;
    deleteAdjustInventoryIsSuccess: boolean;
}

export const DEFAULT_ADJUSTINVENTORYLIST_STATE: AdjustInventoryListState = {
    adjustInventoryListInProgress: null,
    adjustInventoryList: [],
    deleteAdjustInventoryInProgress: null,
    deleteAdjustInventoryIsSuccess: null
};

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * AdjustInventoryListComponentStore store
 * Manages adjustinventorylistcomponent state using NgRx ComponentStore
 */
export class AdjustInventoryListComponentStore extends ComponentStore<AdjustInventoryListState> implements OnDestroy {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private toaster: ToasterService,
        private inventoryService: InventoryService,
        private store: Store<AppState>
    ) {
        /**
         * Handles super functionality
         */
        super(DEFAULT_ADJUSTINVENTORYLIST_STATE);
    }

    public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);
    public universalDate$: Observable<any> = this.select(this.store.select(state => state.session.applicationDate), (response) => response);
    public organisationMode$: Observable<any> = this.select(this.store.select(state => state.settings.branches), (response) => response);
    public deleteAdjustInventoryIsSuccess$: Observable<any> = this.select((state) => state.deleteAdjustInventoryIsSuccess);
    public branchList$: Observable<any> = this.select(this.store.select(state => state.settings.branches), (response) => response);

    /**
     * This will be use for get all inventory adjustments
     *
     * @memberof AdjustInventoryListComponentStore
     */
    readonly getAllAdjustInventoryReport = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ adjustInventoryListInProgress: true });
                return this.inventoryService.getAdjustmentInventoryReport(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res.status === "success") {
                                return this.patchState({
                                    adjustInventoryList: res ?? [],
                                    adjustInventoryListInProgress: false,
                                });
                            } else {
                                this.toaster.showSnackBar("error", res.message);
                                return this.patchState({
                                    adjustInventoryList: [],
                                    adjustInventoryListInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                adjustInventoryList: [],
                                adjustInventoryListInProgress: false,
                            });
                        }
                    ),
                    /**
                     * Handles catchError functionality
                     */
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * This will be use for delete inventory adjustment
     *
     * @memberof AdjustInventoryListComponentStore
     */
    readonly deleteInventoryAdjust = this.effect((data: Observable<string>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ deleteAdjustInventoryInProgress: true, deleteAdjustInventoryIsSuccess: false });
                return this.inventoryService.deleteInventoryAdjust(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res.status === "success") {
                                this.toaster.showSnackBar("success", res?.body);
                                return this.patchState({ deleteAdjustInventoryInProgress: false, deleteAdjustInventoryIsSuccess: true });
                            } else {
                                this.toaster.showSnackBar("error", res?.message);
                                return this.patchState({ deleteAdjustInventoryInProgress: false, deleteAdjustInventoryIsSuccess: false });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ deleteAdjustInventoryInProgress: false, deleteAdjustInventoryIsSuccess: false });
                        }
                    ),
                    /**
                     * Handles catchError functionality
                     */
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Lifecycle hook for component destroy
     *
     * @memberof AdjustInventoryListComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}

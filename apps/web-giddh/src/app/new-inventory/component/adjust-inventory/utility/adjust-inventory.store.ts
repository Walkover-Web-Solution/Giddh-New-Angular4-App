
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tap } from "rxjs/operators";
import { Observable, switchMap, catchError, EMPTY, mergeMap } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "apps/web-giddh/src/app/store";
import { InventoryService } from "apps/web-giddh/src/app/services/inventory.service";
import { ToasterService } from "apps/web-giddh/src/app/services/toaster.service";
import { BaseResponse } from "apps/web-giddh/src/app/models/api-models/BaseResponse";
import { GroupService } from "apps/web-giddh/src/app/services/group.service";

/**
 * AdjustInventoryState interface definition
 * Defines the structure and contract for AdjustInventoryState objects
 */
export interface AdjustInventoryState {
    expensesAccountList: any;
    reasonList: any;
    itemWiseReport: any;
    variantWiseReport: any;
    inventorySearch: any;
    adjustInventoryData: any;
    stockGroupClosingBalance: any
    isLoading: boolean;
    createAdjustInventoryInProgress: boolean;
    createAdjustInventoryIsSuccess: boolean;
    updateAdjustInventoryInProgress: boolean;
    updateAdjustInventoryIsSuccess: boolean;
    createReasonInProgress: boolean;
    createReasonIsSuccess: boolean;
}

export const DEFAULT_ADJUSTINVENTORY_STATE: AdjustInventoryState = {
    expensesAccountList: null,
    isLoading: null,
    reasonList: null,
    itemWiseReport: null,
    variantWiseReport: null,
    inventorySearch: null,
    adjustInventoryData: null,
    createAdjustInventoryInProgress: false,
    createAdjustInventoryIsSuccess: false,
    updateAdjustInventoryInProgress: false,
    updateAdjustInventoryIsSuccess: false,
    createReasonInProgress: null,
    stockGroupClosingBalance: null,
    createReasonIsSuccess: null
};

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * AdjustInventoryComponentStore store
 * Manages adjustinventorycomponent state using NgRx ComponentStore
 */
export class AdjustInventoryComponentStore extends ComponentStore<AdjustInventoryState> implements OnDestroy {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private toaster: ToasterService,
        private inventoryService: InventoryService,
        private groupService: GroupService,
        private store: Store<AppState>
    ) {
        /**
         * Handles super functionality
         */
        super(DEFAULT_ADJUSTINVENTORY_STATE);
    }

    public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);
    public universalDate$: Observable<any> = this.select(this.store.select(state => state.session.applicationDate), (response) => response);
    public financialYear$: Observable<any> = this.select(this.store.select(state => state.settings.financialYearLimits), (response) => response);
    public warehouseList$: Observable<any> = this.select(this.store.select(state => state.warehouse.warehouses), (response) => response);
    public settingsProfile$: Observable<any> = this.select(this.store.select(state => state.settings.profile), (response) => response);
    public expensesAccountList$ = this.select((state) => state.expensesAccountList);
    public inventorySearch$ = this.select((state) => state.inventorySearch);
    public inventoryAdjustData$ = this.select((state) => state.adjustInventoryData);
    public itemWiseReport$ = this.select((state) => state.itemWiseReport);
    public variantWiseReport$ = this.select((state) => state.variantWiseReport);
    public stockGroupClosingBalance$ = this.select((state) => state.stockGroupClosingBalance);
    public reasons$ = this.select((state) => state.reasonList);
    public createAdjustInventoryIsSuccess$ = this.select((state) => state.createAdjustInventoryIsSuccess);
    public createAdjustInventoryInProgress$ = this.select((state) => state.createAdjustInventoryInProgress);
    public createReasonIsSuccess$ = this.select((state) => state.createReasonIsSuccess);
    public isLoading$ = this.select((state) => state.isLoading);

    /**
     * This will be use for get expenses accounts
     *
     * @memberof AdjustInventoryComponentStore
     */
    readonly getExpensesAccounts = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                return this.groupService.getMasters(req, 1).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                return this.patchState({
                                    expensesAccountList: res?.body ?? []
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    expensesAccountList: []
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ expensesAccountList: [] });
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
     * This will be use for get reason list
     *
     * @memberof AdjustInventoryComponentStore
     */
    readonly getAllReasons = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap(() => {
                return this.inventoryService.getInventoryAdjustReasons().pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                return this.patchState({
                                    reasonList: res.body ?? []
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    reasonList: []
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                reasonList: []
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
    * This will be use for get item wise report
    *
    * @memberof AdjustInventoryComponentStore
    */
    readonly getItemWiseReport = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                return this.inventoryService.searchStockTransactionReport(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                return this.patchState({
                                    itemWiseReport: res?.body ?? []
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    itemWiseReport: []
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                itemWiseReport: []
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
    * This will be use for get variant wise report
    *
    * @memberof AdjustInventoryComponentStore
    */
    readonly getVariantWiseReport = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles mergeMap functionality
             */
            mergeMap((req) => {
                return this.inventoryService.getVariantWiseReport(req.queryParams, req.stockReportRequest).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                return this.patchState({
                                    variantWiseReport: res?.body ?? []
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    variantWiseReport: []
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                variantWiseReport: []
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
   * This will be use for get stock group balance
   *
   * @memberof AdjustInventoryComponentStore
   */
    readonly getStockGroupClosingBalance = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles mergeMap functionality
             */
            mergeMap((req) => {
                return this.inventoryService.getStockTransactionReportBalance(req.queryParams, req.balanceStockReportRequest).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                return this.patchState({
                                    stockGroupClosingBalance: res?.body ?? [],
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    stockGroupClosingBalance: [],
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                stockGroupClosingBalance: [],
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
     * This will be use for get adjust inventory data
     *
     * @memberof AdjustInventoryComponentStore
     */
    readonly getAdjustInventoryData = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles mergeMap functionality
             */
            mergeMap((req) => {
                return this.inventoryService.getInventoryAdjust(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                return this.patchState({
                                    adjustInventoryData: res?.body ?? [],
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    adjustInventoryData: [],
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                adjustInventoryData: [],
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
    * This will be use for get inventory search
    *
    * @memberof AdjustInventoryComponentStore
    */
    readonly getInventorySearch = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                return this.inventoryService.getAdjustmentInventoryReport(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                return this.patchState({
                                    inventorySearch: res ?? [],
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    inventorySearch: [],
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                inventorySearch: [],
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
      * This will be use for create reason in  inventory adjustment
      *
      * @memberof AdjustInventoryListComponentStore
      */
    readonly createReason = this.effect((data: Observable<string>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ createReasonInProgress: true, createReasonIsSuccess: false });
                return this.inventoryService.createInventoryAdjustReason(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res.status === "success") {
                                this.toaster.showSnackBar("success", res.body);
                                return this.patchState({ createReasonInProgress: false, createReasonIsSuccess: true });
                            } else {
                                this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ createReasonInProgress: false, createReasonIsSuccess: false });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ createReasonInProgress: false, createReasonIsSuccess: false });
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
    * This will be use for create inventory adjust
    *
    * @memberof AdjustInventoryComponentStore
    */
    readonly createInventoryAdjustment = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ createAdjustInventoryInProgress: true, createAdjustInventoryIsSuccess: null });
                return this.inventoryService.createInventoryAdjustment(req?.formValue, req.branchUniqueName).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.toaster.showSnackBar('success', res?.body);
                                return this.patchState({
                                    createAdjustInventoryInProgress: false,
                                    createAdjustInventoryIsSuccess: true,
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    createAdjustInventoryInProgress: false,
                                    createAdjustInventoryIsSuccess: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                createAdjustInventoryInProgress: false
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
    * This will be use for update inventory adjust
    *
    * @memberof AdjustInventoryComponentStore
    */
    readonly updateInventoryAdjustment = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ updateAdjustInventoryInProgress: true, updateAdjustInventoryIsSuccess: null });
                return this.inventoryService.updateInventoryAdjustment(req?.formValue, req.branchUniqueName).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.toaster.showSnackBar('success', res?.body);
                                return this.patchState({
                                    updateAdjustInventoryInProgress: false,
                                    updateAdjustInventoryIsSuccess: true,
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    updateAdjustInventoryInProgress: false,
                                    updateAdjustInventoryIsSuccess: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                updateAdjustInventoryInProgress: false
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
     * Lifecycle hook for component destroy
     *
     * @memberof AdjustInventoryComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}

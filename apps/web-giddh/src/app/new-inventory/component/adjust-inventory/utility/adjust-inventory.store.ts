
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, mergeMap } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "apps/web-giddh/src/app/store";
import { InventoryService } from "apps/web-giddh/src/app/services/inventory.service";
import { ToasterService } from "apps/web-giddh/src/app/services/toaster.service";
import { BaseResponse } from "apps/web-giddh/src/app/models/api-models/BaseResponse";
import { GroupService } from "apps/web-giddh/src/app/services/group.service";

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

@Injectable()
export class AdjustInventoryComponentStore extends ComponentStore<AdjustInventoryState> implements OnDestroy {

    constructor(
        private toaster: ToasterService,
        private inventoryService: InventoryService,
        private groupService: GroupService,
        private store: Store<AppState>
    ) {
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
            switchMap((req) => {
                return this.groupService.getMasters(req, 1).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    expensesAccountList: res?.body ?? [],
                                });
                            } else {
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    expensesAccountList: [],
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar('error', 'Something went wrong! Please try again.');
                            return this.patchState({
                                expensesAccountList: [],
                            });
                        }
                    ),
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
            switchMap(() => {
                return this.inventoryService.getInventoryAdjustReasons().pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    reasonList: res.body ?? [],
                                });
                            } else {
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    reasonList: [],
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar('error', 'Something went wrong! Please try again.');
                            return this.patchState({
                                reasonList: [],
                            });
                        }
                    ),
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
            switchMap((req) => {
                return this.inventoryService.searchStockTransactionReport(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    itemWiseReport: res?.body ?? [],
                                });
                            } else {
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    itemWiseReport: [],
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar('error', 'Something went wrong! Please try again.');
                            return this.patchState({
                                itemWiseReport: [],
                            });
                        }
                    ),
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
            mergeMap((req) => {
                return this.inventoryService.getVariantWiseReport(req.queryParams, req.stockReportRequest).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    variantWiseReport: res ?? [],
                                });
                            } else {
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    variantWiseReport: [],
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar('error', 'Something went wrong! Please try again.');
                            return this.patchState({
                                variantWiseReport: [],
                            });
                        }
                    ),
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
            mergeMap((req) => {
                return this.inventoryService.getStockTransactionReportBalance(req.queryParams, req.balanceStockReportRequest).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    stockGroupClosingBalance: res?.body ?? [],
                                });
                            } else {
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    stockGroupClosingBalance: [],
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar('error', 'Something went wrong! Please try again.');
                            return this.patchState({
                                stockGroupClosingBalance: [],
                            });
                        }
                    ),
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
            mergeMap((req) => {
                return this.inventoryService.getInventoryAdjust(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    adjustInventoryData: res?.body ?? [],
                                });
                            } else {
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    adjustInventoryData: [],
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar('error', 'Something went wrong! Please try again.');
                            return this.patchState({
                                adjustInventoryData: [],
                            });
                        }
                    ),
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
            switchMap((req) => {
                return this.inventoryService.getAdjustmentInventoryReport(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    inventorySearch: res ?? [],
                                });
                            } else {
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    inventorySearch: [],
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar('error', 'Something went wrong! Please try again.');
                            return this.patchState({
                                inventorySearch: [],
                            });
                        }
                    ),
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
            switchMap((req) => {
                this.patchState({ createReasonInProgress: true, createReasonIsSuccess: false });
                return this.inventoryService.createInventoryAdjustReason(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
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
            switchMap((req) => {
                this.patchState({ createAdjustInventoryInProgress: true });
                return this.inventoryService.createInventoryAdjustment(req?.formValue, req.branchUniqueName).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.toaster.showSnackBar('success', res?.body);
                                return this.patchState({
                                    createAdjustInventoryInProgress: false,
                                    createAdjustInventoryIsSuccess: true,
                                });
                            } else {
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
                            this.toaster.showSnackBar('error', 'Something went wrong! Please try again.');

                            return this.patchState({
                                createAdjustInventoryInProgress: false
                            });
                        }
                    ),
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
            switchMap((req) => {
                this.patchState({ updateAdjustInventoryInProgress: true });
                return this.inventoryService.createInventoryAdjustment(req?.formValue, req.branchUniqueName).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.toaster.showSnackBar('success', res?.body);
                                return this.patchState({
                                    updateAdjustInventoryInProgress: false,
                                    updateAdjustInventoryIsSuccess: true,
                                });
                            } else {
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
                            this.toaster.showSnackBar('error', 'Something went wrong! Please try again.');

                            return this.patchState({
                                updateAdjustInventoryInProgress: false
                            });
                        }
                    ),
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

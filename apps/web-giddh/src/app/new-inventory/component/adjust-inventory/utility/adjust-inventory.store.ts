
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
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
    isLoading: boolean;
    createAdjustInventoryInProgress: boolean;
    createAdjustInventoryIsSuccess: boolean;
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
    createAdjustInventoryInProgress: null,
    createAdjustInventoryIsSuccess: null,
    createReasonInProgress: null,
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
    public expensesAccountList$ = this.select((state) => state.expensesAccountList);
    public inventorySearch$ = this.select((state) => state.inventorySearch);
    public itemWiseReport$ = this.select((state) => state.itemWiseReport);
    public variantWiseReport$ = this.select((state) => state.variantWiseReport);
    public reasons$ = this.select((state) => state.reasonList);
    public createAdjustInventoryIsSuccess$ = this.select((state) => state.createAdjustInventoryIsSuccess);
    public createReasonIsSuccess$ = this.select((state) => state.createReasonIsSuccess);
    public isLoading$ = this.select((state) => state.isLoading);
    public warehouseList$: Observable<any> = this.select(this.store.select(state => state.warehouse.warehouses), (response) => response);



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
            switchMap((req) => {
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
    // readonly createInventoryAdjust = this.effect((data: Observable<any>) => {
    //     return data.pipe(
    //         switchMap((req) => {
    //             this.patchState({ createAdjustInventoryInProgress: true });
    //             return this.subscriptionService.cancelSubscriptionById(req).pipe(
    //                 tapResponse(
    //                     (res: BaseResponse<any, any>) => {
    //                         if (res?.status === 'success') {
    //                             this.toaster.showSnackBar('success', res?.body);
    //                             return this.patchState({
    //                                 createAdjustInventoryInProgress: false,
    //                                 createAdjustInventoryIsSuccess: true,
    //                             });
    //                         } else {
    //                             if (res.message) {
    //                                 this.toaster.showSnackBar('error', res.message);
    //                             }
    //                             return this.patchState({
    //                                 createAdjustInventoryInProgress: false,
    //                                 createAdjustInventoryIsSuccess: false,
    //                             });
    //                         }
    //                     },
    //                     (error: any) => {
    //                         this.toaster.showSnackBar('error', 'Something went wrong! Please try again.');

    //                         return this.patchState({
    //                             createAdjustInventoryInProgress: false
    //                         });
    //                     }
    //                 ),
    //                 catchError((err) => EMPTY)
    //             );
    //         })
    //     );
    // });

    /**
    * This will be use for create reason
    *
    * @memberof AdjustInventoryComponentStore
    */
    // readonly createReason = this.effect((data: Observable<any>) => {
    //     return data.pipe(
    //         switchMap((req) => {
    //             this.patchState({ createReasonInProgress: true });
    //             return this.subscriptionService.cancelSubscriptionById(req).pipe(
    //                 tapResponse(
    //                     (res: BaseResponse<any, any>) => {
    //                         if (res?.status === 'success') {
    //                             this.toaster.showSnackBar('success', res?.body);
    //                             return this.patchState({
    //                                 createReasonInProgress: false,
    //                                 createReasonIsSuccess: true,
    //                             });
    //                         } else {
    //                             if (res.message) {
    //                                 this.toaster.showSnackBar('error', res.message);
    //                             }
    //                             return this.patchState({
    //                                 createReasonInProgress: false,
    //                                 createReasonIsSuccess: false,
    //                             });
    //                         }
    //                     },
    //                     (error: any) => {
    //                         this.toaster.showSnackBar('error', 'Something went wrong! Please try again.');

    //                         return this.patchState({
    //                             createReasonInProgress: false
    //                         });
    //                     }
    //                 ),
    //                 catchError((err) => EMPTY)
    //             );
    //         })
    //     );
    // });


    //     /**
    //      * Transfer Subscription
    //      *
    //      * @memberof SubscriptionComponentStore
    //      */
    //     readonly transferSubscription = this.effect((data: Observable<any>) => {
    //         return data.pipe(
    //             switchMap((req) => {
    //                 this.patchState({ transferSubscriptionInProgress: false });
    //                 return this.subscriptionService.transferSubscription(req.model, req.params).pipe(
    //                     tapResponse(
    //                         (res: BaseResponse<any, any>) => {
    //                             if (res?.status === 'success') {
    //                                 this.toasterService.showSnackBar('success', res?.body);
    //                                 return this.patchState({
    //                                     transferSubscriptionInProgress: false,
    //                                     transferSubscriptionSuccess: true
    //                                 });
    //                             } else {
    //                                 if (res.message) {
    //                                     this.toasterService.showSnackBar('error', res.message);
    //                                 }
    //                                 return this.patchState({
    //                                     transferSubscriptionSuccess: false,
    //                                 });
    //                             }
    //                         },
    //                         (error: any) => {
    //                             this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');

    //                             return this.patchState({
    //                                 transferSubscriptionSuccess: false
    //                             });
    //                         }
    //                     ),
    //                     catchError((err) => EMPTY)
    //                 );
    //             })
    //         );
    //     });

    //     /**
    //     *  Verify Ownership
    //     *
    //     * @memberof SubscriptionComponentStore
    //     */
    //     readonly verifyOwnership = this.effect((data: Observable<any>) => {
    //         return data.pipe(
    //             switchMap((req) => {
    //                 this.patchState({ verifyOwnershipInProgress: true });
    //                 return this.subscriptionService.verifyOwnership(req).pipe(
    //                     tapResponse(
    //                         (res: BaseResponse<any, any>) => {
    //                             if (res?.status === 'success') {
    //                                 this.toasterService.showSnackBar('success', 'Subscription ownership verified successfully.');
    //                                 return this.patchState({
    //                                     verifyOwnershipSuccess: res?.body ?? null,
    //                                     verifyOwnershipInProgress: false,
    //                                 });
    //                             } else {
    //                                 if (res.message) {
    //                                     this.toasterService.showSnackBar('error', res.message);
    //                                 }
    //                                 return this.patchState({
    //                                     verifyOwnershipSuccess: null,
    //                                     verifyOwnershipInProgress: false,
    //                                 });
    //                             }
    //                         },
    //                         (error: any) => {
    //                             this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');
    //                             return this.patchState({
    //                                 verifyOwnershipSuccess: null,
    //                                 verifyOwnershipInProgress: false
    //                             });
    //                         }
    //                     ),
    //                     catchError((err) => EMPTY)
    //                 );
    //             })
    //         );
    //     });

    //     /**
    //  * Get Subscribed Companies
    //  *
    //  * @memberof SubscriptionComponentStore
    //  */
    //     readonly getSubScribedCompanies = this.effect((data: Observable<any>) => {
    //         return data.pipe(
    //             switchMap(() => {
    //                 this.patchState({ subscribedCompaniesInProgress: true });
    //                 return this.subscriptionService.getSubScribedCompanies().pipe(
    //                     tapResponse(
    //                         (res: BaseResponse<any, any>) => {
    //                             if (res?.status === 'success') {
    //                                 return this.patchState({
    //                                     subscribedCompanies: res?.body ?? null,
    //                                     subscribedCompaniesInProgress: false,
    //                                 });
    //                             } else {
    //                                 if (res.message) {
    //                                     this.toasterService.showSnackBar('error', res.message);
    //                                 }
    //                                 return this.patchState({
    //                                     subscribedCompanies: null,
    //                                     subscribedCompaniesInProgress: false,
    //                                 });
    //                             }
    //                         },
    //                         (error: any) => {
    //                             this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');
    //                             return this.patchState({
    //                                 subscribedCompanies: null,
    //                                 subscribedCompaniesInProgress: false
    //                             });
    //                         }
    //                     ),
    //                     catchError((err) => EMPTY)
    //                 );
    //             })
    //         );
    //     });

    //     /**
    //     *  Buy plan by Go cardless for UK companies
    //     *
    //     * @memberof SubscriptionComponentStore
    //     */
    //     readonly buyPlanByGoCardless = this.effect((data: Observable<any>) => {
    //         return data.pipe(
    //             switchMap((req) => {
    //                 return this.subscriptionService.buyPlanByGoCardless(req).pipe(
    //                     tapResponse(
    //                         (res: BaseResponse<any, any>) => {
    //                             if (res?.status === 'success') {
    //                                 return this.patchState({
    //                                     buyPlanSuccess: res?.body ?? null,
    //                                 });
    //                             } else {
    //                                 if (res.message) {
    //                                     this.toasterService.showSnackBar('error', res.message);
    //                                 }
    //                                 return this.patchState({
    //                                     buyPlanSuccess: null
    //                                 });
    //                             }
    //                         },
    //                         (error: any) => {
    //                             this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');

    //                             return this.patchState({
    //                                 buyPlanSuccess: null
    //                             });
    //                         }
    //                     ),
    //                     catchError((err) => EMPTY)
    //                 );
    //             })
    //         );
    //     });

    /**
     * Lifecycle hook for component destroy
     *
     * @memberof SubscriptionComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}

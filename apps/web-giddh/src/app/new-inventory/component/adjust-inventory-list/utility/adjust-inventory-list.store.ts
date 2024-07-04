
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "apps/web-giddh/src/app/store";
import { InventoryService } from "apps/web-giddh/src/app/services/inventory.service";
import { ToasterService } from "apps/web-giddh/src/app/services/toaster.service";
import { BaseResponse } from "apps/web-giddh/src/app/models/api-models/BaseResponse";

export interface AdjustmentInventoryListState {
    adjustInventroyListInProgress: boolean;
    adjustInventroyList: any
    isLoading: boolean;
}

export const DEFAULT_ADJUSTINVENTORYLIST_STATE: AdjustmentInventoryListState = {
    adjustInventroyListInProgress: null,
    adjustInventroyList: [],
    isLoading: null
};

@Injectable()
export class AdjustmentInventoryListComponentStore extends ComponentStore<AdjustmentInventoryListState> implements OnDestroy {

    constructor(
        private toaster: ToasterService,
        private inventoryService: InventoryService,
        private store: Store<AppState>
    ) {
        super(DEFAULT_ADJUSTINVENTORYLIST_STATE);
    }

    public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);
    public universalDate$: Observable<any> = this.select(this.store.select(state => state.session.applicationDate), (response) => response);


    /**
     * Get All Subscriptions
     *
     * @memberof SubscriptionComponentStore
     */
    readonly getAllAdjustmentInventoryReport = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ adjustInventroyListInProgress: true });
                return this.inventoryService.getAdjustmentInventoryReport(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                return this.patchState({
                                    adjustInventroyList: res ?? [],
                                    adjustInventroyListInProgress: false,
                                });
                            } else {
                                if (res.message) {
                                    this.toaster.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    adjustInventroyList: [],
                                    adjustInventroyListInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar('error', 'Something went wrong! Please try again.');
                            return this.patchState({
                                adjustInventroyList: [],
                                adjustInventroyListInProgress: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });


//     /**
//     * Cancel Subscription
//     *
//     * @memberof SubscriptionComponentStore
//     */
//     readonly cancelSubscription = this.effect((data: Observable<any>) => {
//         return data.pipe(
//             switchMap((req) => {
//                 this.patchState({ cancelSubscriptionInProgress: true });
//                 return this.subscriptionService.cancelSubscriptionById(req).pipe(
//                     tapResponse(
//                         (res: BaseResponse<any, any>) => {
//                             if (res?.status === 'success') {
//                                 this.toasterService.showSnackBar('success', res?.body);
//                                 return this.patchState({
//                                     cancelSubscriptionInProgress: false,
//                                     cancelSubscription: true,
//                                 });
//                             } else {
//                                 if (res.message) {
//                                     this.toasterService.showSnackBar('error', res.message);
//                                 }
//                                 return this.patchState({
//                                     cancelSubscriptionInProgress: false,
//                                     cancelSubscription: false,
//                                 });
//                             }
//                         },
//                         (error: any) => {
//                             this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');

//                             return this.patchState({
//                                 cancelSubscriptionInProgress: false
//                             });
//                         }
//                     ),
//                     catchError((err) => EMPTY)
//                 );
//             })
//         );
//     });


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

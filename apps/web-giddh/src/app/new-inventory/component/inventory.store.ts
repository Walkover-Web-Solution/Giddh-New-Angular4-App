import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ComponentStore } from "@ngrx/component-store";
import { tap } from "rxjs/operators";
import { AppState } from "../../store";
import { InventoryService } from "../../services/inventory.service";
import { catchError, EMPTY, mergeMap, Observable, of, switchMap } from "rxjs";
import { BaseResponse } from "../../models/api-models/BaseResponse";
import { ToasterService } from "../../services/toaster.service";
import { Router } from "@angular/router";
import { IDiscountList } from "../../models/api-models/SettingsDiscount";
import { SettingsDiscountService } from "../../services/settings.discount.service";
import { CommonService } from '../../services/common.service';
import { LedgerService } from "../../services/ledger.service";
import { CustomFieldsService } from "../../services/custom-fields.service";
import { map } from '../../lodash-optimized';

export interface InventoryState {
    isLoading: boolean;
    discountsList: IDiscountList[];
    uploadAttachmentInProgress: boolean;
    uploadAttachmentIsSuccess: any;
    downloadAttachmentInProgress: boolean;
    previewAttachmentIsSuccess: any;
    customFieldsSuccess: any;
    updateInventoryVariantSuccess: any;
}

const DEFAULT_STATE: InventoryState = {
    isLoading: false,
    discountsList: null,
    uploadAttachmentInProgress: false,
    uploadAttachmentIsSuccess: null,
    downloadAttachmentInProgress: false,
    previewAttachmentIsSuccess: null,
    customFieldsSuccess:null,
    updateInventoryVariantSuccess:null
};

@Injectable({
    providedIn: 'root'
})
export class InventoryComponentStore extends ComponentStore<any> {
    constructor(
        private store: Store<AppState>,
        private inventoryService: InventoryService,
        private settingsDiscountService: SettingsDiscountService,
        private toaster: ToasterService,
        public router: Router,
        private commonService: CommonService,
        private ledgerService: LedgerService,
        private customFieldsService: CustomFieldsService
    ) {
        super(DEFAULT_STATE);
    }

    public isLoading$ = this.select((state) => state.isLoading);
    public discountsList$: Observable<any> = this.select((state) => state.discountsList);
    public uploadAttachmentIsSuccess$ = this.select((state) => state.uploadAttachmentIsSuccess);
    public uploadAttachmentInProgress$ = this.select((state) => state.uploadAttachmentInProgress);
    public previewAttachmentIsSuccess$ = this.select((state) => state.previewAttachmentIsSuccess);
    public downloadAttachmentInProgress$ = this.select((state) => state.downloadAttachmentInProgress);
    public customFieldsSuccess$: Observable<any> = this.select((state) => state.customFieldsSuccess);
    public updateInventoryVariantSuccess$: Observable<any> = this.select((state) => state.updateInventoryVariantSuccess);

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
                    tap(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === "success" && typeof res?.body === "string") {
                                this.toaster.showSnackBar("success", res.body);
                                this.router.navigate(["/pages/downloads"]);
                                return this.patchState({
                                    isLoading: false
                                });
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
                    tap(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === "success" && typeof res?.body === "string") {
                                this.toaster.showSnackBar("success", res.body);
                                this.router.navigate(["/pages/downloads"]);
                                return this.patchState({
                                    isLoading: false
                                });
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
     * This will use for Export Group Wise Report Data
     *
     * @memberof InventoryComponentStore
     */
    readonly exportGroup = this.effect((data$: Observable<{ stockReportRequest: any, queryParams: any }>) => {
        return data$.pipe(
            switchMap((req) => {
                this.patchState({ isLoading: true });
                return this.inventoryService.getGroupWiseReportExport(req.queryParams, req.stockReportRequest).pipe(
                    tap(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === "success" && typeof res?.body === "string") {
                                this.toaster.showSnackBar("success", res.body);
                                this.router.navigate(["/pages/downloads"]);
                                return this.patchState({
                                    isLoading: false
                                });
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
     * This will use for Export Transaction Wise Report Data
     *
     * @memberof InventoryComponentStore
     */
    readonly exportTransaction = this.effect((data$: Observable<{ stockReportRequest: any, queryParams: any }>) => {
        return data$.pipe(
            switchMap((req) => {
                this.patchState({ isLoading: true });
                return this.inventoryService.getTransactionReportExport(req.queryParams, req.stockReportRequest).pipe(
                    tap(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === "success" && typeof res?.body === "string") {
                                this.toaster.showSnackBar("success", res.body);
                                this.router.navigate(["/pages/downloads"]);
                                return this.patchState({
                                    isLoading: false
                                });
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
     * Get All Discount List
     *
     * @memberof InventoryComponentStore
     */
    readonly getDiscountList = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap(() => {
                return this.settingsDiscountService.GetDiscounts().pipe(
                    tap(
                        (res: BaseResponse<any, any>) => {
                            const discounts = res?.body?.map(discount => {
                                discount['label'] = discount?.name;
                                discount['value'] = discount?.uniqueName;
                                return discount;
                            });
                            return this.patchState({
                                discountsList: discounts
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                discountsList: []
                            });
                        }
                    )
                );
            })
        );
    });

    /**
     * This will use for upload attachment
     *
     * @memberof InventoryComponentStore
     */
    readonly uploadAttachment = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ uploadAttachmentInProgress: true, uploadAttachmentIsSuccess: null });
                return this.commonService.uploadFile(req).pipe(
                    tap(
                        (res: BaseResponse<any, any>) => {
                            if (res.status === "success") {
                                return this.patchState({ uploadAttachmentInProgress: false, uploadAttachmentIsSuccess: res?.body });
                            } else {
                                this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ uploadAttachmentInProgress: false, uploadAttachmentIsSuccess: null });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                uploadAttachmentInProgress: false,
                                uploadAttachmentIsSuccess: null
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * This will use for preview image
     *
     * @memberof InventoryComponentStore
     */
    readonly previewVariantImage = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ downloadAttachmentInProgress: true, previewAttachmentIsSuccess: null });
                return this.ledgerService.downloadAttachement(req?.uniqueName, req?.type).pipe(
                    tap(
                        (res: BaseResponse<any, any>) => {
                            if (res.status === "success") {
                                return this.patchState({ downloadAttachmentInProgress: false, previewAttachmentIsSuccess: res?.body });
                            } else {
                                this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ downloadAttachmentInProgress: false, previewAttachmentIsSuccess: null });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                downloadAttachmentInProgress: false,
                                previewAttachmentIsSuccess: null
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Reset upload attachment state
     *
     * @memberof InventoryComponentStore
     */
    readonly resetUploadAttachmentState = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({
                    uploadAttachmentIsSuccess: null
                });
                return of(null);
            })
        );
    });

    /**
     * This will use for get custom fields
     *
     * @memberof InventoryComponentStore
     */
    readonly getCustomFields = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ customFieldsSuccess: null });
                return this.customFieldsService.list(req).pipe(
                    tap(
                        (res: BaseResponse<any, any>) => {
                            if (res && res.status === "success") {
                                return this.patchState({ customFieldsSuccess: res.body?.results });
                            } else {
                                res?.message &&  this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ customFieldsSuccess: null });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                customFieldsSuccess: null
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * This will use for update inventory variant
     *
     * @memberof InventoryComponentStore
     */
    readonly updateInventoryVariant = this.effect((data: Observable<any>) => {
        return data.pipe(
            mergeMap((req) => {
                this.patchState({ updateInventoryVariantSuccess: null });
                return this.inventoryService.updateInventoryVariant(req).pipe(
                    tap(
                        (res: BaseResponse<any, any>) => {
                            if (res && res.status === "success") {
                                this.toaster.showSnackBar("success", res.body);
                                return this.patchState({ updateInventoryVariantSuccess: req });
                            } else {
                                res?.message &&  this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ updateInventoryVariantSuccess: null });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                updateInventoryVariantSuccess: null
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

}

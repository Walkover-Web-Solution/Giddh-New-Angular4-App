import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, tap } from "rxjs";
import { ITaxAuthority } from "../../../models/interfaces/tax.interface";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { ToasterService } from "../../../services/toaster.service";
import { SettingsTaxesService } from "../../../services/settings.taxes.service";
import { SalesTaxReport, SalesTaxReportRequest } from "./tax-authority.const";
import { LocaleService } from "../../../services/locale.service";
import { AppState } from "../../../store";
import { Store } from "@ngrx/store";
import { GstReconcileService } from "../../../services/gst-reconcile.service";

/**
 * TaxAuthorityState interface definition
 * Defines the structure and contract for TaxAuthorityState objects
 */
export interface TaxAuthorityState {
    isLoading: boolean;
    taxAuthorityList: ITaxAuthority[];
    taxAuthorityWiseReport: any;
    taxWiseReport: any;
    accountWiseReport: any;
    exportTaxAuthorityWiseReport: any;
    exportTaxWiseReport: any;
    exportAccountWiseReport: any;
    createTaxAuthorityIsSuccess: boolean;
    deleteTaxAuthorityIsSuccess: boolean;
    updateTaxAuthorityIsSuccess: boolean;
    taxNumber: any;
}

const DEFAULT_STATE: TaxAuthorityState = {
    isLoading: false,
    taxAuthorityList: null,
    taxAuthorityWiseReport: null,
    taxWiseReport: null,
    accountWiseReport: null,
    exportTaxAuthorityWiseReport: null,
    exportTaxWiseReport: null,
    exportAccountWiseReport: null,
    createTaxAuthorityIsSuccess: null,
    updateTaxAuthorityIsSuccess: null,
    deleteTaxAuthorityIsSuccess: null,
    taxNumber: null
};

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * TaxAuthorityComponentStore store
 * Manages taxauthoritycomponent state using NgRx ComponentStore
 */
export class TaxAuthorityComponentStore extends ComponentStore<TaxAuthorityState> {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private toaster: ToasterService,
        private settingsTaxesService: SettingsTaxesService,
        private gstReconcileService: GstReconcileService,
        private localeService: LocaleService,
        private store: Store<AppState>
    ) {
        /**
         * Handles super functionality
         */
        super(DEFAULT_STATE);
    }

    public isLoading$ = this.select((state) => state.isLoading);
    public taxAuthorityList$ = this.select((state) => state.taxAuthorityList);
    public taxAuthorityWiseReport$ = this.select((state) => state.taxAuthorityWiseReport);
    public taxWiseReport$ = this.select((state) => state.taxWiseReport);
    public accountWiseReport$ = this.select((state) => state.accountWiseReport);
    public exportTaxAuthorityWiseReport$ = this.select((state) => state.exportTaxAuthorityWiseReport);
    public exportTaxWiseReport$ = this.select((state) => state.exportTaxWiseReport);
    public exportAccountWiseReport$ = this.select((state) => state.exportAccountWiseReport);
    public deleteTaxAuthorityIsSuccess$ = this.select((state) => state.deleteTaxAuthorityIsSuccess);
    public createTaxAuthorityIsSuccess$ = this.select((state) => state.createTaxAuthorityIsSuccess);
    public updateTaxAuthorityIsSuccess$ = this.select((state) => state.updateTaxAuthorityIsSuccess);
    public taxNumber$ = this.select((state) => state.taxNumber);

    public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);
    public stateList$: Observable<any> = this.select(this.store.select(state => state.general.states), (response) => response);

    /**
     * Get Tax Authority list
     *
     * @memberof TaxAuthorityComponentStore
     */
    readonly getTaxAuthorityList = this.effect((data: Observable<void>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap(() => {
                this.patchState({ isLoading: true });
                return this.settingsTaxesService.getTaxAuthorityList().pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
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
                    /**
                     * Handles catchError functionality
                     */
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Get State list
     *
     * @memberof TaxAuthorityComponentStore
     */
    readonly getStateList = this.effect((data: Observable<void>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap(() => {
                this.patchState({ isLoading: true });
                return this.settingsTaxesService.getTaxAuthorityList().pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
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
                    /**
                     * Handles catchError functionality
                     */
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Create Tax Authority
     *
     * @memberof TaxAuthorityComponentStore
     */
    readonly createTaxAuthority = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ createTaxAuthorityIsSuccess: null });
                return this.settingsTaxesService.createTaxAuthority(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res.status === 'success') {
                                this.toaster.showSnackBar("success", this.localeService.translate("app_messages.tax_authority_created"));
                                return this.patchState({
                                    createTaxAuthorityIsSuccess: true
                                });

                            } else {
                                res?.message && this.toaster.showSnackBar("error", res?.message);
                                return this.patchState({
                                    createTaxAuthorityIsSuccess: false
                                });
                            }
                        },
                        (error: any) => {
                            return this.patchState({
                                createTaxAuthorityIsSuccess: false
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
     * Update Tax Authority
     *
     * @memberof TaxAuthorityComponentStore
     */
    readonly updateTaxAuthority = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ updateTaxAuthorityIsSuccess: null });
                return this.settingsTaxesService.updateTaxAuthority(req.model, req.uniqueName).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res.status === 'success') {
                                res?.body && this.toaster.showSnackBar("success", res?.body);
                                return this.patchState({
                                    updateTaxAuthorityIsSuccess: true
                                });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res?.message);
                                return this.patchState({
                                    updateTaxAuthorityIsSuccess: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                updateTaxAuthorityIsSuccess: false
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
     * Delete Tax Authority
     *
     * @memberof TaxAuthorityComponentStore
     */
    readonly deleteTaxAuthority = this.effect((data: Observable<string>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ deleteTaxAuthorityIsSuccess: null });
                return this.settingsTaxesService.deleteTaxAuthority(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res.status === 'success') {
                                res?.body && this.toaster.showSnackBar("success", res?.body);
                                return this.patchState({
                                    deleteTaxAuthorityIsSuccess: true
                                });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res?.message);
                                return this.patchState({
                                    deleteTaxAuthorityIsSuccess: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                deleteTaxAuthorityIsSuccess: false
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
     * Get sale tax report - Tax authority/Rate/Account wise
     *
     * @memberof TaxAuthorityComponentStore
     */
    readonly getSalesTaxReport = this.effect((data: Observable<{ reportType: string, params: SalesTaxReportRequest, isExport: boolean }>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({
                    isLoading: true,
                    taxAuthorityWiseReport: null,
                    taxWiseReport: null,
                    accountWiseReport: null
                });
                return this.settingsTaxesService.getExportSaleTaxReport(req.reportType, req.params, req.isExport).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                /**
                                 * Handles switch functionality
                                 */
                                switch (req.reportType) {
                                    case SalesTaxReport.TaxAuthorityWise:
                                        return this.patchState({
                                            taxAuthorityWiseReport: res?.body ?? [],
                                            isLoading: false
                                        });
                                    case SalesTaxReport.TaxWise:
                                        return this.patchState({
                                            taxWiseReport: res?.body ?? [],
                                            isLoading: false
                                        });
                                    case SalesTaxReport.AccountWise:
                                        return this.patchState({
                                            accountWiseReport: res?.body ?? [],
                                            isLoading: false
                                        });
                                }
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({
                                    isLoading: false,
                                    taxAuthorityWiseReport: null,
                                    taxWiseReport: null,
                                    accountWiseReport: null
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                isLoading: false,
                                taxAuthorityWiseReport: null,
                                taxWiseReport: null,
                                accountWiseReport: null
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
     * Export sale tax report - Tax authority/Rate/Account wise
     *
     * @memberof TaxAuthorityComponentStore
     */
    readonly exportSalesTaxReport = this.effect((data: Observable<{ reportType: string, params: SalesTaxReportRequest, isExport: boolean }>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({
                    isLoading: true,
                    exportTaxAuthorityWiseReport: null,
                    exportTaxWiseReport: null,
                    exportAccountWiseReport: null
                });
                return this.settingsTaxesService.getExportSaleTaxReport(req.reportType, req.params, req.isExport).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                /**
                                 * Handles switch functionality
                                 */
                                switch (req.reportType) {
                                    case SalesTaxReport.TaxAuthorityWise:
                                        return this.patchState({
                                            exportTaxAuthorityWiseReport: res?.body ?? '',
                                            isLoading: false
                                        });
                                    case SalesTaxReport.TaxWise:
                                        return this.patchState({
                                            exportTaxWiseReport: res?.body ?? '',
                                            isLoading: false
                                        });
                                    case SalesTaxReport.AccountWise:
                                        return this.patchState({
                                            exportAccountWiseReport: res?.body ?? '',
                                            isLoading: false
                                        });
                                }
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({
                                    isLoading: false,
                                    exportTaxAuthorityWiseReport: null,
                                    exportTaxWiseReport: null,
                                    exportAccountWiseReport: null
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                isLoading: false,
                                exportTaxAuthorityWiseReport: null,
                                exportTaxWiseReport: null,
                                exportAccountWiseReport: null
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
    * Get Tax Number
    *
    * @memberof TaxAuthorityComponentStore
    */
    readonly getTaxNumber = this.effect((data: Observable<void>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap(() => {
                this.patchState({ taxNumber: null, isLoading: true });
                return this.gstReconcileService.getTaxDetails().pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: any) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === "success") {
                                return this.patchState({ taxNumber: res, isLoading: false });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ taxNumber: null, isLoading: false });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ taxNumber: null, isLoading: false });
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
}

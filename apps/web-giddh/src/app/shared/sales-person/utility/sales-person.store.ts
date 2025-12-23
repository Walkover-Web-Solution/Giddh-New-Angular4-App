import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tapResponse } from "@ngrx/operators";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse, CommonPaginatedResponse } from "../../../models/api-models/BaseResponse";
import { ToasterService } from "../../../services/toaster.service";
import { LocaleService } from "../../../services/locale.service";
import { SalesPersonService } from "./sales-person.service";
import { HttpMethod, IOption } from "../../../app.constant";
import { SalesPersonCreateUpdate, SalesPersonDeleteArchivedModel, SalesPersonErrorDetailsEnum } from "./sales-person.constant";
import { includes, map } from '../../../lodash-optimized';

export interface SalesPersonState {
    salesPersonSaveInProgress: boolean;
    createUpdateSalesPersonSuccess: boolean;
    deleteSalesPersonSuccess: boolean;
    salesPersonList: CommonPaginatedResponse<any> | IOption[] | null;
    salesPersonListInProgress: boolean;
    archiveSalesPersonSuccess: any;
    openTransferAndDeleteDialog: boolean; // For sales person linked with account only
    openTransferAndArchiveDialog: boolean; // For sales person linked with entry or voucher
}

export const DEFAULT_STATE: SalesPersonState = {
    salesPersonSaveInProgress: false,
    createUpdateSalesPersonSuccess: false,
    deleteSalesPersonSuccess: false,
    salesPersonList: null,
    salesPersonListInProgress: false,
    archiveSalesPersonSuccess: false,
    openTransferAndDeleteDialog: false,
    openTransferAndArchiveDialog: false
};

@Injectable({
    providedIn: 'root'
})
export class SalesPersonComponentStore extends ComponentStore<SalesPersonState> implements OnDestroy {
    constructor(
        private toasterService: ToasterService,
        private localeService: LocaleService,
        private salesPersonService: SalesPersonService
    ) {
        super(DEFAULT_STATE);
    }

    /** Sales Person List */
    public salesPersonList$: Observable<CommonPaginatedResponse<any> | IOption[]> = this.select((state) => state.salesPersonList);
    /** Sales Person Save In Progress */
    public salesPersonSaveInProgress$: Observable<boolean> = this.select((state) => state.salesPersonSaveInProgress);
    /** Save Sales Person Success */
    public createUpdateSalesPersonSuccess$: Observable<boolean> = this.select((state) => state.createUpdateSalesPersonSuccess);
    /** Delete Sales Person Success */
    public deleteSalesPersonSuccess$: Observable<boolean> = this.select((state) => state.deleteSalesPersonSuccess);
    /** Sales Person List In Progress */
    public salesPersonListInProgress$: Observable<boolean> = this.select((state) => state.salesPersonListInProgress);
    /** Archive Sales Person Success */
    public archiveSalesPersonSuccess$: Observable<boolean> = this.select((state) => state.archiveSalesPersonSuccess);
    /** Open Transfer and Delete Dialog */
    public openTransferAndDeleteDialog$: Observable<boolean> = this.select((state) => state.openTransferAndDeleteDialog);
    /** Open Transfer and Archive Dialog */
    public openTransferAndArchiveDialog$: Observable<boolean> = this.select((state) => state.openTransferAndArchiveDialog);

    /**
     * Get All Sales Person
     *
     * @param {isDropdown: boolean, params: any} params – when true, maps `res.body.results` to an array of
     *   `{ label: item.name, value: item.uniqueName }` for dropdowns.
     * @memberof SalesPersonComponentStore
     */
    readonly getAllSalesPerson = this.effect((data: Observable<{ isDropdown: boolean, params: any }>) => {
        return data.pipe(
            switchMap(({ isDropdown, params }) => {
                this.patchState({ salesPersonListInProgress: true });
                return this.salesPersonService.salesPerson(HttpMethod.GET, isDropdown, null, params).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                let response = res?.body;
                                if (isDropdown) {
                                    response = res?.body?.results?.map((item: any) => ({
                                        label: item.name,
                                        value: item.uniqueName
                                    }));
                                }
                                this.patchState({
                                    salesPersonList: response,
                                    salesPersonListInProgress: false,
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    salesPersonList: null,
                                    salesPersonListInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', this.localeService.translate("app_something_went_wrong"));
                            return this.patchState({
                                salesPersonList: null,
                                salesPersonListInProgress: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Create/Update Sales Person
     *
     * @memberof SalesPersonComponentStore
     */
    readonly createUpdateSalesPerson = this.effect((data: Observable<{ model: SalesPersonCreateUpdate, uniqueName: string }>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ salesPersonSaveInProgress: true, createUpdateSalesPersonSuccess: false });
                return this.salesPersonService.salesPerson(req.uniqueName ? HttpMethod.PUT : HttpMethod.POST, req.model, req.uniqueName).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                if (req.uniqueName) {
                                    this.patchState({
                                        salesPersonSaveInProgress: false,
                                        createUpdateSalesPersonSuccess: true
                                    });
                                } else {
                                    this.patchState({
                                        salesPersonSaveInProgress: false,
                                        createUpdateSalesPersonSuccess: true
                                    });
                                }
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    salesPersonSaveInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', this.localeService.translate("app_something_went_wrong"));
                            return this.patchState({
                                salesPersonSaveInProgress: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Delete Sales Person
     *
     * @memberof SalesPersonComponentStore
     */
    readonly deleteSalesPerson = this.effect((data: Observable<string>) => {
        return data.pipe(
            switchMap((uniqueName) => {
                this.patchState({ deleteSalesPersonSuccess: false });
                return this.salesPersonService.salesPerson(HttpMethod.DELETE, {}, uniqueName).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                typeof res.body === "string" && this.toasterService.showSnackBar('success', res.body);
                                this.patchState({
                                    deleteSalesPersonSuccess: true
                                });
                            } else {
                                if (res.message) {
                                    if (res.errorDetails?.includes(SalesPersonErrorDetailsEnum.ENTRY_VOUCHER)) {
                                        // Show error message only if linked with entry/voucher
                                        this.toasterService.showSnackBar('error', res.message);
                                        this.patchState({
                                            openTransferAndArchiveDialog: true
                                        });
                                    } else if (res.errorDetails?.includes(SalesPersonErrorDetailsEnum.ACCOUNT)) {
                                        this.patchState({
                                            openTransferAndDeleteDialog: true
                                        });
                                    }
                                }
                                return this.patchState({
                                    deleteSalesPersonSuccess: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', this.localeService.translate("app_something_went_wrong"));
                            return this.patchState({
                                deleteSalesPersonSuccess: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Archive/Unarchive sales person
     *
     * @memberof SalesPersonComponentStore
     */
    readonly archiveUnarchiveSalesPerson = this.effect((data: Observable<{ model: SalesPersonDeleteArchivedModel, uniqueName: string }>) => {
        return data.pipe(
            switchMap((model) => {
                this.patchState({ archiveSalesPersonSuccess: false });
                return this.salesPersonService.salesPersonArchive(model.model, model.uniqueName).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                typeof res.body === "string" && this.toasterService.showSnackBar('success', res.body);
                                this.patchState({
                                    archiveSalesPersonSuccess: model
                                });
                            } else {
                                res.message && this.toasterService.showSnackBar('error', res.message);
                                return this.patchState({
                                    archiveSalesPersonSuccess: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', this.localeService.translate("app_something_went_wrong"));
                            return this.patchState({
                                archiveSalesPersonSuccess: false
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
     * @memberof SalesPersonComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}

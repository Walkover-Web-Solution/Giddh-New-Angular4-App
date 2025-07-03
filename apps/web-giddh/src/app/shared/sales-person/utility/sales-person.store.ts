import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { ToasterService } from "../../../services/toaster.service";
import { LocaleService } from "../../../services/locale.service";
import { SalesPersonService } from "./sales-person.service";
import { HttpMethod } from "../../../app.constant";
import { SalesPersonCreateUpdate } from "./sales-person.constant";

export interface BuyPlanState {
    salesPersonSaveInProgress: boolean;
    createUpdateSalesPersonSuccess: boolean;
    deleteSalesPersonSuccess: boolean;
    salesPersonList: any[],
    salesPersonListInProgress: boolean
}

export const DEFAULT_STATE: BuyPlanState = {
    salesPersonSaveInProgress: false,
    createUpdateSalesPersonSuccess: false,
    deleteSalesPersonSuccess: false,
    salesPersonList: [],
    salesPersonListInProgress: false
};

@Injectable()
export class SalesPersonComponentStore extends ComponentStore<BuyPlanState> implements OnDestroy {
    constructor(
        private toasterService: ToasterService,
        private localeService: LocaleService,
        private salesPersonService: SalesPersonService
    ) {
        super(DEFAULT_STATE);
    }

    /** Sales Person List */
    public salesPersonList$: Observable<any[]> = this.select((state) => state.salesPersonList);
    /** Sales Person Save In Progress */
    public salesPersonSaveInProgress$: Observable<boolean> = this.select((state) => state.salesPersonSaveInProgress);
    /** Save Sales Person Success */
    public createUpdateSalesPersonSuccess$: Observable<boolean> = this.select((state) => state.createUpdateSalesPersonSuccess);
    /** Delete Sales Person Success */
    public deleteSalesPersonSuccess$: Observable<boolean> = this.select((state) => state.deleteSalesPersonSuccess);
    /** Sales Person List In Progress */
    public salesPersonListInProgress$: Observable<boolean> = this.select((state) => state.salesPersonListInProgress);

    /**
     * Get All Sales Person
     *
     * @memberof SalesPersonComponentStore
     */
    readonly getAllSalesPerson = this.effect((data: Observable<boolean | void>) => {
        return data.pipe(
            switchMap((isDropdown: boolean = false) => {
                this.patchState({ salesPersonListInProgress: true });
                return this.salesPersonService.salesPerson(HttpMethod.GET).pipe(
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
                                    salesPersonList: [],
                                    salesPersonListInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', this.localeService.translate("app_something_went_wrong"));
                            return this.patchState({
                                salesPersonList: [],
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
                                    this.updateSalesPerson(res?.body);
                                } else {
                                    this.addSalesPerson(res?.body);
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
                this.patchState({ deleteSalesPersonSuccess: null });
                return this.salesPersonService.salesPerson(HttpMethod.DELETE, {}, uniqueName).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.patchState({
                                    deleteSalesPersonSuccess: true
                                });
                                this.removeSalesPerson(uniqueName);
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
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
     * Add Sales Person
     *
     * @param {SalesPersonCreateUpdate} salesPerson
     * @memberof SalesPersonComponentStore
     */
    readonly addSalesPerson = this.updater((state, salesPerson: SalesPersonCreateUpdate) => ({
        ...state,
        salesPersonList: [...state.salesPersonList, salesPerson]
    }));

    /**
     * Update Sales Person
     *
     * @param {SalesPersonCreateUpdate} salesPerson
     * @memberof SalesPersonComponentStore
     */
    readonly updateSalesPerson = this.updater((state, salesPerson: SalesPersonCreateUpdate) => ({
        ...state,
        salesPersonList: state.salesPersonList.map((item) => item.uniqueName === salesPerson.uniqueName ? salesPerson : item)
    }));

    /**
     * Remove Sales Person
     *
     * @param {string} uniqueName
     * @memberof SalesPersonComponentStore
     */
    readonly removeSalesPerson = this.updater((state, uniqueName: string) => ({
        ...state,
        salesPersonList: state.salesPersonList.filter((item) => item.uniqueName !== uniqueName)
    }));
   

    /**
     * Lifecycle hook for component destroy
     *
     * @memberof SalesPersonComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
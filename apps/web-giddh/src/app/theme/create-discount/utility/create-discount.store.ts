import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, tap } from "rxjs";
import { ToasterService } from "../../../services/toaster.service";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { SalesService } from "../../../services/sales.service";
import { SettingsDiscountService } from "../../../services/settings.discount.service";
import { CreateDiscountRequest } from "../../../models/api-models/SettingsDiscount";
import { LocaleService } from "../../../services/locale.service";

/**
 * CreateDiscountState interface definition
 * Defines the structure and contract for CreateDiscountState objects
 */
export interface CreateDiscountState {
    discountsAccountList: any[];
    createDiscountInProgress: boolean;
    createDiscountSuccess: boolean;
}

const DEFAULT_STATE: CreateDiscountState = {
    discountsAccountList: null,
    createDiscountSuccess: null,
    createDiscountInProgress: null
};

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * CreateDiscountComponentStore store
 * Manages creatediscountcomponent state using NgRx ComponentStore
 */
export class CreateDiscountComponentStore extends ComponentStore<CreateDiscountState> {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private toaster: ToasterService,
        private salesService: SalesService,
        private settingsDiscountService: SettingsDiscountService,
        private localeService: LocaleService
    ) {
        /**
         * Handles super functionality
         */
        super(DEFAULT_STATE);
    }

    public discountsAccountList$ = this.select((state) => state.discountsAccountList);
    public createDiscountInProgress$ = this.select((state) => state.createDiscountInProgress);
    public createDiscountSuccess$ = this.select((state) => state.createDiscountSuccess);

    readonly getDiscountsAccountList = this.effect((data: Observable<void>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap(() => {
                return this.salesService.getAccountsWithCurrency('discount').pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            return this.patchState({
                                discountsAccountList: Array.isArray(res?.body?.results) ? res.body.results.map(res => { return { label: res.name, value: res.uniqueName, additional: { currency: res?.currency } } }) : []
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                discountsAccountList: []
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

    readonly saveDiscount = this.effect((data: Observable<{ model: CreateDiscountRequest }>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ createDiscountSuccess: false, createDiscountInProgress: true });

                return this.settingsDiscountService.CreateDiscount(req as any).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap({
                        /**
                         * Handles next functionality
                         */
                        next: (res: BaseResponse<any, CreateDiscountRequest>) => {
                            this.toaster.showSnackBar('success', res.body);
                            this.patchState({
                                createDiscountInProgress: false,
                                createDiscountSuccess: true
                            });
                        },
                        /**
                         * Handles error functionality
                         */
                        error: (error: any) => {
                            this.toaster.showSnackBar('error', error);
                            this.patchState({
                                createDiscountInProgress: false,
                                createDiscountSuccess: false
                            });
                        }
                    }),
                    /**
                     * Handles catchError functionality
                     */
                    catchError(() => EMPTY)
                );
            })
        );
    });

    readonly updateDiscount = this.effect((data: Observable<{ model: CreateDiscountRequest }>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ createDiscountSuccess: false, createDiscountInProgress: true });
                return this.settingsDiscountService.UpdateDiscount(req as any).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            this.toaster.showSnackBar('success', this.localeService.translate("app_messages.discount_updated"));
                            return this.patchState({
                                createDiscountInProgress: false,
                                createDiscountSuccess: true
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar('error', error);
                            return this.patchState({
                                createDiscountInProgress: false,
                                createDiscountSuccess: false

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
}

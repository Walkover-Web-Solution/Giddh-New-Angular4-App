import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { ToasterService } from "../../../services/toaster.service";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { SalesService } from "../../../services/sales.service";
import { SettingsDiscountService } from "../../../services/settings.discount.service";
import { CreateDiscountRequest } from "../../../models/api-models/SettingsDiscount";

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

@Injectable()
export class CreateDiscountComponentStore extends ComponentStore<CreateDiscountState> {

    constructor(
        private toaster: ToasterService,
        private salesService: SalesService,
        private settingsDiscountService: SettingsDiscountService,
    ) {
        super(DEFAULT_STATE);
    }

    public discountsAccountList$ = this.select((state) => state.discountsAccountList);
    public createDiscountInProgress$ = this.select((state) => state.createDiscountInProgress);
    public createDiscountSuccess$ = this.select((state) => state.createDiscountSuccess);

    readonly getDiscountsAccountList = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap(() => {
                return this.salesService.getAccountsWithCurrency('discount').pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            return this.patchState({
                                discountsAccountList: res?.body?.results?.map(res => { return { label: res.name, value: res.uniqueName, additional: { currency: res?.currency } } }) ?? []
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                discountsAccountList: []
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly saveDiscount = this.effect((data: Observable<{ model: CreateDiscountRequest }>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ createDiscountSuccess: false, createDiscountInProgress: true });
                return this.settingsDiscountService.CreateDiscount(req as any).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            this.toaster.showSnackBar('success', res.body);
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
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly updateDiscount = this.effect((data: Observable<{ model: CreateDiscountRequest }>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ createDiscountSuccess: false, createDiscountInProgress: true });
                return this.settingsDiscountService.UpdateDiscount(req.model, req.model.accountUniqueName).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            this.toaster.showSnackBar('success', res.body);
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
                    catchError((err) => EMPTY)
                );
            })
        );
    });
}
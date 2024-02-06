import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { AppState } from "../../../store";
import { ToasterService } from "../../../services/toaster.service";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { SalesService } from "../../../services/sales.service";
import { SettingsDiscountService } from "../../../services/settings.discount.service";
import { CreateDiscountRequest } from "../../../models/api-models/SettingsDiscount";

export interface CreateDiscountState {
    discountsAccountList: any[];
    isLoading: boolean;
    createDiscountInProgress: boolean;
    createDiscountSuccess: boolean;
}

const DEFAULT_STATE: CreateDiscountState = {
    discountsAccountList: null,
    isLoading: false,
    createDiscountSuccess: null,
    createDiscountInProgress: null
};

@Injectable()
export class CreateDiscountComponentStore extends ComponentStore<CreateDiscountState> {

    constructor(
        private store: Store<AppState>,
        private toast: ToasterService,
        private salesService: SalesService,
        private settingsDiscountService: SettingsDiscountService,
    ) {
        super(DEFAULT_STATE);
    }

    public discountsAccountList$ = this.select((state) => state.discountsAccountList);
    public isLoading$ = this.select((state) => state.isLoading);
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
                            this.showErrorToast('error',error);
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
                this.patchState({ isLoading: true, createDiscountSuccess: false, createDiscountInProgress: true });
                return this.settingsDiscountService.CreateDiscount(req as any).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            this.showErrorToast('success', res.body);
                            return this.patchState({
                                isLoading: false,
                                createDiscountInProgress: false,
                                createDiscountSuccess: true
                            });
                        },
                        (error: any) => {
                            this.showErrorToast('error', error);
                            return this.patchState({
                                isLoading: false,
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

    private showErrorToast(type: any, message: any): void {
        if (type === 'error') {
            this.toast.showSnackBar("error", message);
        } else {
            this.toast.showSnackBar("success", message);

        }
    }
}
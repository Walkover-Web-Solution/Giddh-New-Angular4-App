import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { BaseResponse } from "../models/api-models/BaseResponse";
import { ToasterService } from "../services/toaster.service";
import { Observable } from "rxjs/internal/Observable";
import { AppState } from "../store";
import { Store } from "@ngrx/store";
import { EMPTY, catchError, switchMap } from "rxjs";
import { SettingsDiscountService } from "../services/settings.discount.service";
import { IDiscountList } from "../models/api-models/SettingsDiscount";
import { InvoiceService } from "../services/invoice.service";
import { InvoiceSetting } from "../models/interfaces/invoice.setting.interface";
import { VoucherService } from "../services/voucher.service";
import { ReceiptService } from "../services/receipt.service";
import { InvoiceReceiptFilter, ReciptResponse } from "../models/api-models/recipt";
import { ProformaFilter } from "../models/api-models/proforma";

export interface VoucherState {
    isLoading: boolean;
    createUpdateRes: BaseResponse<any, any>;
    createUpdateInProgress: boolean;
    discountsList: IDiscountList[];
    invoiceSettings: InvoiceSetting;
    lastVouchers: ReciptResponse;
}

const DEFAULT_STATE: VoucherState = {
    isLoading: false,
    createUpdateRes: null,
    createUpdateInProgress: null,
    discountsList: null,
    invoiceSettings: null,
    lastVouchers: null
};

@Injectable()
export class VoucherComponentStore extends ComponentStore<VoucherState> {
    
    constructor(
        private store: Store<AppState>,
        private toast: ToasterService,
        private settingsDiscountService: SettingsDiscountService,
        private invoiceService: InvoiceService,
        private receiptService: ReceiptService,
        private voucherService: VoucherService
    ) {
        super(DEFAULT_STATE);
    }

    public isLoading$ = this.select((state) => state.isLoading);
    public createUpdateInProgress$ = this.select((state) => state.createUpdateInProgress);
    public createUpdateRes$ = this.select((state) => state.createUpdateRes);
    public discountsList$ = this.select((state) => state.discountsList);
    public invoiceSettings$ = this.select((state) => state.invoiceSettings);
    public companyProfile$: Observable<any> = this.select(this.store.select(state => state.settings.profile), (response) => response);
    public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);
    public onboardingForm$: Observable<any> = this.select(this.store.select(state => state.common.onboardingform), (response) => response);
    public isTcsTdsApplicable$: Observable<any> = this.select(this.store.select(state => state.company), (response) => response.isTcsTdsApplicable);
    public companyTaxes$: Observable<any> = this.select(this.store.select(state => state.company.taxes), (response) => response);
    public warehouseList$: Observable<any> = this.select(this.store.select(state => state.warehouse.warehouses), (response) => response);
    public branchList$: Observable<any> = this.select(this.store.select(state => state.settings.branches), (response) => response);

    readonly getDiscountsList = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap(() => {
                this.patchState({ isLoading: true });
                return this.settingsDiscountService.GetDiscounts().pipe(
                    tapResponse(
                        (res: BaseResponse<IDiscountList[], any>) => {
                            return this.patchState({
                                isLoading: false,
                                discountsList: res?.body ?? null,
                            });
                        },
                        (error: any) => {
                            this.showErrorToast(error);
                            return this.patchState({
                                isLoading: false,
                                discountsList: null,
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getInvoiceSettings = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap(() => {
                this.patchState({ isLoading: true });
                return this.voucherService.getInvoiceSettings().pipe(
                    tapResponse(
                        (res: BaseResponse<InvoiceSetting, any>) => {
                            return this.patchState({
                                isLoading: false,
                                invoiceSettings: res?.body ?? null,
                            });
                        },
                        (error: any) => {
                            this.showErrorToast(error);
                            return this.patchState({
                                isLoading: false,
                                invoiceSettings: null,
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getPreviousVouchers = this.effect((data: Observable<{body: InvoiceReceiptFilter, type: string}>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ isLoading: true });
                return this.voucherService.getAllVouchers(req.body, req.type).pipe(
                    tapResponse(
                        (res: BaseResponse<ReciptResponse, any>) => {
                            return this.patchState({
                                isLoading: false,
                                lastVouchers: res?.body ?? null,
                            });
                        },
                        (error: any) => {
                            this.showErrorToast(error);
                            return this.patchState({
                                isLoading: false,
                                lastVouchers: null,
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    readonly getPreviousProformaEstimates = this.effect((data: Observable<{body: ProformaFilter, type: string}>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ isLoading: true });
                return this.voucherService.getAllProformaEstimate(req.body, req.type).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            return this.patchState({
                                isLoading: false,
                                lastVouchers: res?.body ?? null,
                            });
                        },
                        (error: any) => {
                            this.showErrorToast(error);
                            return this.patchState({
                                isLoading: false,
                                lastVouchers: null,
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    private showErrorToast(error: any): void {
        this.toast.showSnackBar("error", error);
    }
}
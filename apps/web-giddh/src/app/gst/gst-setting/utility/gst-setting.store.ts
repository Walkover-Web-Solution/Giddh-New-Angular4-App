import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { Observable, switchMap, catchError, EMPTY, of } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { AppState } from "../../../store";
import { ToasterService } from "../../../services/toaster.service";
import { GstReconcileService } from "../../../services/gst-reconcile.service";

export interface GstSettingState {
    isLoading: boolean;
    createUpdateInProgress: boolean;
    deleteLutNumberInProgress: boolean;
    deleteLutNumberIsSuccess: boolean;
    getLutNumberInProgress: boolean;
    lutNumberList: any[];
}

const DEFAULT_STATE: GstSettingState = {
    isLoading: false,
    createUpdateInProgress: null,
    deleteLutNumberInProgress: null,
    deleteLutNumberIsSuccess: null,
    getLutNumberInProgress: null,
    lutNumberList: null,
};

@Injectable()
export class GstSettingComponentStore extends ComponentStore<GstSettingState> {

    constructor(
        private store: Store<AppState>,
        private toaster: ToasterService,
        private gstReconcileService: GstReconcileService
    ) {
        super(DEFAULT_STATE);
    }

    public isLoading$ = this.select((state) => state.isLoading);
    public createUpdateInProgress$ = this.select((state) => state.createUpdateInProgress);
    public deleteLutNumberInProgress$ = this.select((state) => state.deleteLutNumberInProgress);
    public lutNumberList$ = this.select((state) => state.lutNumberList);
    public deleteLutNumberIsSuccess$ = this.select((state) => state.deleteLutNumberIsSuccess);
    public getLutNumberInProgress$ = this.select((state) => state.getLutNumberInProgress);


    public companyProfile$: Observable<any> = this.select(this.store.select(state => state.settings.profile), (response) => response);
    public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);
    public onboardingForm$: Observable<any> = this.select(this.store.select(state => state.common.onboardingform), (response) => response);
    public isTcsTdsApplicable$: Observable<any> = this.select(this.store.select(state => state.company), (response) => response.isTcsTdsApplicable);
    public company$: Observable<any> = this.select(this.store.select(state => state.company), (response) => response);
    public companyTaxes$: Observable<any> = this.select(this.store.select(state => state.company.taxes), (response) => response);
    public warehouseList$: Observable<any> = this.select(this.store.select(state => state.warehouse.warehouses), (response) => response);
    public branchList$: Observable<any> = this.select(this.store.select(state => state.settings.branches), (response) => response);
    public hasSavedChanges$: Observable<any> = this.select(this.store.select(state => state.groupwithaccounts.hasUnsavedChanges), (response) => response);
    public newAccountDetails$: Observable<any> = this.select(this.store.select(state => state.sales.createdAccountDetails), (response) => response);
    public updatedAccountDetails$: Observable<any> = this.select(this.store.select(state => state.sales.updatedAccountDetails), (response) => response);
    public universalDate$: Observable<any> = this.select(this.store.select(state => state.session.applicationDate), (response) => response);

    readonly getLutNumberList = this.effect((data: Observable<void>) => {
        return data.pipe(
            switchMap(() => {
                this.patchState({ getLutNumberInProgress: true });
                return this.gstReconcileService.getLutNumberList().pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            return this.patchState({
                                lutNumberList: res?.body ?? [],
                                getLutNumberInProgress: false
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                lutNumberList: [],
                                getLutNumberInProgress: false
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    // readonly getInvoiceSettings = this.effect((data: Observable<void>) => {
    //     return data.pipe(
    //         switchMap(() => {
    //             this.patchState({ isLoading: true });
    //             return this.voucherService.getInvoiceSettings().pipe(
    //                 tapResponse(
    //                     (res: BaseResponse<InvoiceSetting, any>) => {
    //                         return this.patchState({
    //                             isLoading: false,
    //                             invoiceSettings: res?.body ?? null
    //                         });
    //                     },
    //                     (error: any) => {
    //                         this.toaster.showSnackBar("error", error);
    //                         return this.patchState({
    //                             isLoading: false,
    //                             invoiceSettings: null
    //                         });
    //                     }
    //                 ),
    //                 catchError((err) => EMPTY)
    //             );
    //         })
    //     );
    // });

    // readonly getPreviousVouchers = this.effect((data: Observable<{ model: InvoiceReceiptFilter, type: string }>) => {
    //     return data.pipe(
    //         switchMap((req) => {
    //             this.patchState({ getLastVouchersInProgress: true });
    //             return this.voucherService.getAllVouchers(req.model, req.type).pipe(
    //                 tapResponse(
    //                     (res: BaseResponse<LastVouchersResponse, any>) => {
    //                         return this.patchState({
    //                             getLastVouchersInProgress: false,
    //                             lastVouchers: res?.body ?? {}
    //                         });
    //                     },
    //                     (error: any) => {
    //                         this.toaster.showSnackBar("error", error);
    //                         return this.patchState({
    //                             getLastVouchersInProgress: false,
    //                             lastVouchers: null
    //                         });
    //                     }
    //                 ),
    //                 catchError((err) => EMPTY)
    //             );
    //         })
    //     );
    // });

    // readonly getPreviousProformaEstimates = this.effect((data: Observable<{ model: ProformaFilter, type: string }>) => {
    //     return data.pipe(
    //         switchMap((req) => {
    //             this.patchState({ getLastVouchersInProgress: true });
    //             return this.voucherService.getAllProformaEstimate(req.model, req.type).pipe(
    //                 tapResponse(
    //                     (res: BaseResponse<any, any>) => {
    //                         return this.patchState({
    //                             getLastVouchersInProgress: false,
    //                             lastVouchers: res?.body ?? {}
    //                         });
    //                     },
    //                     (error: any) => {
    //                         this.toaster.showSnackBar("error", error);
    //                         return this.patchState({
    //                             getLastVouchersInProgress: false,
    //                             lastVouchers: {}
    //                         });
    //                     }
    //                 ),
    //                 catchError((err) => EMPTY)
    //             );
    //         })
    //     );
    // });

    // readonly getCreatedTemplates = this.effect((data: Observable<string>) => {
    //     return data.pipe(
    //         switchMap((req) => {
    //             return this.voucherService.getAllCreatedTemplates(req).pipe(
    //                 tapResponse(
    //                     (res: BaseResponse<any, any>) => {
    //                         return this.patchState({
    //                             createdTemplates: res?.body ?? []
    //                         });
    //                     },
    //                     (error: any) => {
    //                         this.toaster.showSnackBar("error", error);
    //                         return this.patchState({
    //                             createdTemplates: []
    //                         });
    //                     }
    //                 ),
    //                 catchError((err) => EMPTY)
    //             );
    //         })
    //     );
    // });



}

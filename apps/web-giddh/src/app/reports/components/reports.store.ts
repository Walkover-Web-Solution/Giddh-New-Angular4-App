import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tapResponse } from "@ngrx/operators";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { SearchService } from "../../services/search.service";
import { ToasterService } from "../../services/toaster.service";
import { BaseResponse } from "../../models/api-models/BaseResponse";
import { CompanyService } from "../../services/company.service";
import { Store } from "@ngrx/store";
import { AppState } from "../../store";

export interface ReportsState {
    accountList: any;
    salesPurchaseList: any;
    salesPurchaseListInProgress: boolean;
}

export const DEFAULT_STATE: ReportsState = {
    accountList: null,
    salesPurchaseList: [],
    salesPurchaseListInProgress: false
};

@Injectable()
export class ReportsComponentStore extends ComponentStore<ReportsState> implements OnDestroy {

    constructor(
        private store: Store<AppState>,
        private toasterService: ToasterService,
        private searchService: SearchService,
        private companyService: CompanyService
    ) {
        super(DEFAULT_STATE);
    }

    public universalDate$: Observable<any> = this.select(this.store.select(state => state.session.applicationDate), (response) => response);
    public accountList$ = this.select((state) => state.accountList);
    public salesPurchaseList$ = this.select((state) => state.salesPurchaseList);
    public salesPurchaseListInProgress$ = this.select((state) => state.salesPurchaseListInProgress);

    /**
     * Get accounts
     *
     * @memberof ReportsComponentStore
     */
    readonly getAccounts = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((params) => {
                this.patchState({ accountList: null });
                return this.searchService.searchAccountV3(params).pipe(
                    tapResponse(
                            (res: BaseResponse<any, any>) => {
                                if (res?.status === 'success') {
                                    this.patchState({ accountList: res?.body || [] });
                                } else {
                                    res?.message && this.toasterService.showSnackBar('error', res.message);
                                    this.patchState({ accountList: null });
                                }
                            },
                            (error: any) => {
                                this.toasterService.showSnackBar("error", error);
                                return this.patchState({ accountList: null });
                            }
                        ),
                        catchError((err) => EMPTY)
                    );
                })
            );
        });


    /**
     * Get sales purchase list
     *
     * @memberof ReportsComponentStore
     */
    readonly getSalesPurchaseList = this.effect((data: Observable<{ payload: any, params: { branchUniqueName: string; from: string; to: string }, isSalesRegister: boolean }>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ salesPurchaseList: null, salesPurchaseListInProgress: true });
                return this.companyService.getSalesRegisterV2(req.payload, req.params, req.isSalesRegister).pipe(
                    tapResponse(
                            (res: BaseResponse<any, any>) => {
                                if (res?.status === 'success') {
                                    this.patchState({ salesPurchaseList: res?.body || [], salesPurchaseListInProgress: false });
                                } else {
                                    res?.message && this.toasterService.showSnackBar('error', res.message);
                                    this.patchState({ salesPurchaseList: [], salesPurchaseListInProgress: false });
                                }
                            },
                            (error: any) => {
                                this.toasterService.showSnackBar("error", error);
                                return this.patchState({ salesPurchaseList: [], salesPurchaseListInProgress: false });
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
     * @memberof ReportsComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}

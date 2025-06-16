import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, of, mergeMap } from "rxjs";
import { AppState } from "../store";
import { Store } from "@ngrx/store";
import { ToasterService } from "../services/toaster.service";
import { TlPlService } from "../services/tl-pl.service";

export interface MultiCurrencyReportsState {
    reportDataList: any;
    inProgressReport: boolean;
    filterRequestData: any;
}

const DEFAULT_STATE: MultiCurrencyReportsState = {
    reportDataList: null,
    inProgressReport: false,
    filterRequestData: null
};

@Injectable()
export class MultiCurrencyReportsComponentStore extends ComponentStore<MultiCurrencyReportsState> {

    constructor(
        private store: Store<AppState>,
        private toaster: ToasterService,
        private TlPlService: TlPlService
    ) {
        super(DEFAULT_STATE);
    }
    public reportDataList$: Observable<any> = this.select(state => state.reportDataList);
    public filterRequestData$: Observable<any> = this.select(state => state.filterRequestData);
    public inProgressReport$: Observable<any> = this.select(state => state.inProgressReport);

    public universalDate$: Observable<any> = this.select(this.store.select(state => state.session.applicationDate), (response) => response);
    public companyList$: Observable<any> = this.select(this.store.select((state) => state.session.companies), (response) => response);
    public currencyList$: Observable<any> = this.select(this.store.select(state => state.session.currencies), (response) => response);
    public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);

    /**
     * Fetches the multi-currency report data.
     * 
     * It calls the `getMultiCurrencyReport` method from the `TlPlService`, handles the response, updates the state, and shows appropriate toasts.
     * 
     * @readonly
     * @memberof MultiCurrencyReportsComponentStore
     */
    readonly getMultiCurrencyReport = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ reportDataList: null, filterRequestData: null, inProgressReport: true });
                return this.TlPlService.getMultiCurrencyReport(req).pipe(
                    tapResponse(
                        (res: any) => {
                            if (res?.status === "success" && res.body) {
                                res.body.response.message && this.toaster.showSnackBar("error", res.body.response.message);
                                return this.patchState({ reportDataList: res.body.response, filterRequestData: { request: res.body.request, lastFetchedAt: res.body.lastFetchedAt }, inProgressReport: false });
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({ reportDataList: null, filterRequestData: null, inProgressReport: false });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({ reportDataList: null, filterRequestData: null, inProgressReport: false });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Creates the multi-currency report.
     * 
     * It triggers the `createMultiCurrencyReport` method from the `TlPlService`, handles the response, and shows appropriate toasts.
     * 
     * @readonly
     * @memberof MultiCurrencyReportsComponentStore
     */
    readonly createMultiCurrencyReport = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                return this.TlPlService.createMultiCurrencyReport(req.reportType, req.payload).pipe(
                    tapResponse(
                        (res: any) => {
                            if (res?.status === "success" && res.body?.file) {
                                this.toaster.showSnackBar("success", res.body.file);
                            } else {
                                res?.message && this.toaster.showSnackBar("error", res.message);
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });
}
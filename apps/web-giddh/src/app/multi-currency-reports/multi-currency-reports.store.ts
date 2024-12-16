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
}

const DEFAULT_STATE: MultiCurrencyReportsState = {
    reportDataList: null,
    inProgressReport: false
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
    public universalDate$: Observable<any> = this.select(this.store.select(state => state.session.applicationDate), (response) => response);
    public companyList$: Observable<any> = this.select(this.store.select((state) => state.session.companies), (response) => response);
    public currencyList$: Observable<any> = this.select(this.store.select(state => state.session.currencies), (response) => response);
    public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);

        /**
    *   Save list of Payment Liability
    *
    * @memberof VatReportComponentStore
    */
        readonly getMultiCurrencyReport = this.effect((data: Observable<any>) => {
            return data.pipe(
                switchMap((req) => {
                    console.log("req------",req);
                    
                    this.patchState({ reportDataList: null, inProgressReport: true });
                    return this.TlPlService.getMultiCurrencyReport(req).pipe(
                        tapResponse(
                            (res: any) => {
                                if (res?.status === "success" && res.body) {
                                    return this.patchState({ reportDataList: res.body, inProgressReport: false });
                                } else {
                                    res?.message && this.toaster.showSnackBar("error", res.message);
                                    return this.patchState({ reportDataList: null, inProgressReport: false });
                                }
                            },
                            (error: any) => {
                                this.toaster.showSnackBar("error", error);
                                return this.patchState({ reportDataList: null, inProgressReport: false });
                            }
                        ),
                        catchError((err) => EMPTY)
                    );
                })
            );
        });

        readonly creatMultiCurrencyReport = this.effect((data: Observable<any>) => {
            return data.pipe(
                switchMap((req) => {
                    console.log("req------",req);
                    return this.TlPlService.creatMultiCurrencyReport(req.reportType, req.payload).pipe(
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
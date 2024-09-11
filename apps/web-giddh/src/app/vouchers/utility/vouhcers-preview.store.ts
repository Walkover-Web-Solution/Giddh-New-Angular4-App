import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { ToasterService } from "../../services/toaster.service";
import { VoucherService } from "../../services/voucher.service";
import { AppState } from "../../store";
import { catchError, EMPTY, Observable, switchMap } from "rxjs";
import { BaseResponse } from "../../models/api-models/BaseResponse";

export interface VoucherPreviewState {
    isVoucherDownloading: boolean;
    isVoucherDownloadError: boolean;
    downloadVoucherResponse: any;
    
    isVoucherVersionsInProgress: boolean;
    voucherVersionsResponse: any;

}

const DEFAULT_STATE: VoucherPreviewState = {
    isVoucherDownloading: null,
    isVoucherDownloadError: null,
    downloadVoucherResponse: null,

    isVoucherVersionsInProgress: null,
    voucherVersionsResponse: null
};

@Injectable()
export class VoucherPreviewComponentStore extends ComponentStore<VoucherPreviewState> {
    public downloadVoucherResponse$ = this.select((state) => state.downloadVoucherResponse);
    public voucherVersionsResponse$ = this.select((state) => state.voucherVersionsResponse);
    public isVoucherVersionsInProgress$ = this.select((state) => state.isVoucherVersionsInProgress);

    constructor(
        private store: Store<AppState>,
        private toaster: ToasterService,
        private voucherService: VoucherService,
    ) {
        super(DEFAULT_STATE);
    }

    public voucherDetails$: Observable<any> = this.select(this.store.select(state => state.receipt.voucher), (response) => response);
    // public companyProfile$: Observable<any> = this.select(this.store.select(state => state.settings.profile), (response) => response);
    // public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);
    // public company$: Observable<any> = this.select(this.store.select(state => state.company), (response) => response);
    // public companyTaxes$: Observable<any> = this.select(this.store.select(state => state.company.taxes), (response) => response);
    // public branchList$: Observable<any> = this.select(this.store.select(state => state.settings.branches), (response) => response);;
    // public universalDate$: Observable<any> = this.select(this.store.select(state => state.session.applicationDate), (response) => response);

    readonly downloadVoucherPdf = this.effect((data: Observable<{ model: any, type: string, fileType: string, voucherType: string }>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ isVoucherDownloading: true , isVoucherDownloadError: false});
                return this.voucherService.downloadPdfFile(req.model, req.type, req.fileType, req.voucherType).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res.status === "success") {
                                return this.patchState({
                                    isVoucherDownloading: false,
                                    downloadVoucherResponse: res?.body ?? {}
                                });
                            } else {
                                res.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({
                                    isVoucherDownloadError: true,
                                    isVoucherDownloading: false,
                                    downloadVoucherResponse: {}
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                isVoucherDownloadError: true,
                                isVoucherDownloading: false,
                                downloadVoucherResponse: null
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });
    
    readonly getVoucherVersions = this.effect((data: Observable<{ getRequestObject: any, postRequestObject: any, voucherType: string }>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ isVoucherVersionsInProgress: true });
                return this.voucherService.getVoucherVersions(req.getRequestObject, req.postRequestObject, req.voucherType).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res.status === "success") {
                                return this.patchState({
                                    isVoucherVersionsInProgress: false,
                                    voucherVersionsResponse: res?.body ?? {}
                                });
                            } else {
                                res.message && this.toaster.showSnackBar("error", res.message);
                                return this.patchState({
                                    isVoucherVersionsInProgress: false,
                                    voucherVersionsResponse: {}
                                });
                            }
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                isVoucherVersionsInProgress: false,
                                voucherVersionsResponse: null
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });


}
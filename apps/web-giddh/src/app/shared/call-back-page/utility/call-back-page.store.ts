import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { BaseResponse } from "../../../models/api-models/BaseResponse";
import { ToasterService } from "../../../services/toaster.service";
import { CommonService } from "../../../services/common.service";

export interface CallBackPageState {
    callBackSuccess: any;
    callBackInProgress: boolean;
}

export const DEFAULT_CALL_BACK_PAGE_STATE: CallBackPageState = {
    callBackSuccess: null,
    callBackInProgress: false,
};

@Injectable()
export class CallBackPageComponentStore extends ComponentStore<CallBackPageState> implements OnDestroy {

    constructor(
        private toasterService: ToasterService,
        private commonService: CommonService
    ) {
        super(DEFAULT_CALL_BACK_PAGE_STATE);
    }

    public callBackSuccess$: Observable<any> = this.select((state) => state.callBackSuccess);

    /**
     * Get Call Back Response
     *
     * @memberof CallBackPageComponentStore
     */
    readonly windowCallBack = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ callBackSuccess: null, callBackInProgress: true });
                return this.commonService.windowCallBack(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res) {
                                return this.patchState({
                                    callBackSuccess: res,
                                    callBackInProgress: false
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    callBackSuccess: null,
                                    callBackInProgress: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({
                                callBackSuccess: null,
                                callBackInProgress: false
                            });
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
     * @memberof CallBackPageComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}

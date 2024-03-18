
import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { Store } from "@ngrx/store";
import { ToasterService } from "../../services/toaster.service";
import { AppState } from "../../store";
import { BaseResponse } from "../../models/api-models/BaseResponse";
import { PermissionService } from "../../services/permission.service";

export interface PermissionListState {
    permissionRolesInProgress: boolean;
    permissionRoles: any
}

export const DEFAULT_PLAN_STATE: PermissionListState = {
    permissionRolesInProgress: null,
    permissionRoles: null

};

@Injectable()
export class AddCompanyComponentStore extends ComponentStore<PermissionListState> implements OnDestroy {

    constructor(private toasterService: ToasterService, private permissionService: PermissionService,
        private store: Store<AppState>) {
        super(DEFAULT_PLAN_STATE);
    }

    /**
     * Get All Plans
     *
     * @memberof PlanComponentStore
     */
    readonly getPermissionRoles = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap(() => {
                this.patchState({ permissionRolesInProgress: true });
                return this.permissionService.GetAllRoles().pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            console.log(res);
                            if (res?.status === 'success') {
                                return this.patchState({
                                    permissionRoles: res?.body ?? [],
                                    permissionRolesInProgress: false,
                                });
                            } else {
                                if (res.message) {
                                    this.toasterService.showSnackBar('success', res.message);
                                }
                                return this.patchState({
                                    permissionRoles: null,
                                    permissionRolesInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Error');
                            return this.patchState({
                                permissionRoles: null,
                                permissionRolesInProgress: false
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
     * @memberof PlanComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}


import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, tap } from "rxjs";
import { ToasterService } from "../../services/toaster.service";
import { BaseResponse } from "../../models/api-models/BaseResponse";
import { PermissionService } from "../../services/permission.service";

/**
 * AddCompanyListState interface definition
 * Defines the structure and contract for AddCompanyListState objects
 */
export interface AddCompanyListState {
    permissionRolesInProgress: boolean;
    permissionRoles: any
}

export const DEFAULT_ADD_COMPANY_STATE: AddCompanyListState = {
    permissionRolesInProgress: null,
    permissionRoles: null

};

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * AddCompanyComponentStore store
 * Manages addcompanycomponent state using NgRx ComponentStore
 */
export class AddCompanyComponentStore extends ComponentStore<AddCompanyListState> implements OnDestroy {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private toasterService: ToasterService,
        private permissionService: PermissionService
    ) {
        /**
         * Handles super functionality
         */
        super(DEFAULT_ADD_COMPANY_STATE);
    }

    /**
     * Get Permissions Roles
     *
     * @memberof AddCompanyComponentStore
     */
    readonly getPermissionRoles = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap(() => {
                this.patchState({ permissionRolesInProgress: true });
                return this.permissionService.GetAllRoles().pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                return this.patchState({
                                    permissionRoles: res?.body ?? [],
                                    permissionRolesInProgress: false,
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    permissionRoles: null,
                                    permissionRolesInProgress: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar('error', 'Something went wrong! Please try again.');
                            return this.patchState({
                                permissionRoles: null,
                                permissionRolesInProgress: false
                            });
                        }
                    ),
                    /**
                     * Handles catchError functionality
                     */
                    catchError((err) => EMPTY)
                );
            })
        );
    });


    /**
     * Lifecycle hook for component destroy
     *
     * @memberof AddCompanyComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}


import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, tap } from "rxjs";
import { BaseResponse } from "../../models/api-models/BaseResponse";
import { ToasterService } from "../../services/toaster.service";
import { ContactService } from "../../services/contact.service";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../store";
import { GetContactsParams } from "../../models/api-models/Contact";

/**
 * ContactState interface definition
 * Defines the structure and contract for ContactState objects
 */
export interface ContactState {
    sendBulkEmailIsSuccess: boolean;
    getLastAccountsInProgress: boolean;
    getAccountStatementInProgress: boolean;
    contactsList: any;
    accountStatementList: any;
    exportAccountStatementResponse:any;
}

export const DEFAULT_CONTACT_STATE: ContactState = {
    sendBulkEmailIsSuccess: null,
    getLastAccountsInProgress: false,
    getAccountStatementInProgress: false,
    contactsList: null,
    accountStatementList: null,
    exportAccountStatementResponse: null
};

/**
 * Handles Injectable functionality
 */
@Injectable(
    {
        providedIn: 'root'
    }
)
/**
 * ContactComponentStore store
 * Manages contactcomponent state using NgRx ComponentStore
 */
export class ContactComponentStore extends ComponentStore<ContactState> implements OnDestroy {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(private toasterService: ToasterService,
        private contactService: ContactService,
        private store: Store<AppState>
    ) {
        /**
         * Handles super functionality
         */
        super(DEFAULT_CONTACT_STATE);
    }

    public universalDate$: Observable<any> = this.select(this.store.select(state => state.session.applicationDate), (response) => response);
    public getLastAccountsInProgress$ = this.select((state) => state.getLastAccountsInProgress);
    public getContactsList$ = this.select((state) => state.contactsList);
    public getAccountStatementList$ = this.select((state) => state.accountStatementList);
    public getAccountStatementInProgress$ = this.select((state) => state.getAccountStatementInProgress);
    public updateAccountInProcess$: Observable<boolean> = this.select(this.store.select(state => state.groupwithaccounts.updateAccountInProcess), (response) => response);
    public updateAccountIsSuccess$: Observable<boolean> = this.select(this.store.select(state => state.groupwithaccounts.updateAccountIsSuccess), (response) => response);
    public isDeleteAccSuccess$: Observable<any> = this.store.pipe(select(state => state.groupwithaccounts.isDeleteAccSuccess), (response) => response);
    public createAccountIsSuccess$: Observable<any> = this.store.pipe(select(state => state.sales.createAccountSuccess), (response) => response);
    public lastDeletedAccountUniqueName$: Observable<any> = this.store.pipe(select(state => state.groupwithaccounts.lastDeletedAccountUniqueName), (response) => response);
    public activeAccount$: Observable<any> = this.select(this.store.select(state => state.groupwithaccounts.activeAccount), (response) => response);
    public activeGroupUniqueName$: Observable<string> = this.select(this.store.select(state => state.groupwithaccounts.activeGroupUniqueName), (response) => response);
    public activeGroup$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroup), (response) => response);
    public virtualAccountEnable$ = this.store.pipe(select(state => state.invoice.settings), (response) => response);
    public currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), (response) => response);
    public showEditAccount$ = this.store.pipe(select(state => state.groupwithaccounts.showEditAccount), (response) => response);
    public isAddAndManageOpenedFromOutside$ = this.store.pipe(select(appStore => appStore.groupwithaccounts.isAddAndManageOpenedFromOutside), (response) => response);
    public exportAccountStatementResponse$ = this.select((state) => state.exportAccountStatementResponse);

    /**
     * Send email template
     *
     * @memberof ContactComponentStore
     */
    readonly sendBulkEmailTemplate = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ sendBulkEmailIsSuccess: false });
                return this.contactService.sendBulkEmailTemplate(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                res?.body && this.toasterService.showSnackBar('success', res?.body);
                                return this.patchState({
                                    sendBulkEmailIsSuccess: true
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res?.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    sendBulkEmailIsSuccess: false,
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);

                            return this.patchState({
                                sendBulkEmailIsSuccess: false
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
     * Effect to get contacts using ContactService.GetContacts
     *
     * @memberof ContactComponentStore
     * @param data Observable of parameter objects containing all required and optional parameters for GetContacts
     * Each object should have the following shape:
     * {
     *   fromDate: string,
     *   toDate: string,
     *   groupUniqueName: string,
     *   pageNumber: number,
     *   refresh: string,
     *   count: number,
     *   query?: string,
     *   sortBy?: string,
     *   order?: string,
     *   postData?: ContactAdvanceSearchModal,
     *   branchUniqueName?: string
     * }
     */
    readonly getContactsList = this.effect((data$: Observable<GetContactsParams>) => {
        return data$.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap(params => {
                // Optionally patch state to indicate loading if needed
                this.patchState({ getLastAccountsInProgress: true, contactsList: [] });
                return this.contactService.GetContacts(
                    params.fromDate,
                    params.toDate,
                    params.groupUniqueName,
                    params.pageNumber,
                    params.refresh,
                    params.count,
                    params.query,
                    params.sortBy,
                    params.order,
                    params.postData,
                    params.branchUniqueName
                ).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.patchState({
                                    contactsList: res?.body ?? [],
                                    getLastAccountsInProgress: false
                                });
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res?.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    contactsList: null,
                                    getLastAccountsInProgress: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);

                            return this.patchState({
                                contactsList: null,
                                getLastAccountsInProgress: false
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


    readonly getAccountStatementList = this.effect((data$: Observable<any>) => {
        return data$.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap(req => {
                // Optionally patch state to indicate loading if needed
                this.patchState({ getAccountStatementInProgress: true, accountStatementList: [] });
                return this.contactService.getAccountStatementList(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.patchState({
                                    accountStatementList: res?.body ?? []
                                });
                                /**
                                 * Sets timeout value
                                 */
                                setTimeout(() => {
                                    this.patchState({
                                        getAccountStatementInProgress: false
                                    });
                                }, 400);
                            } else {
                                /**
                                 * Handles if functionality
                                 */
                                if (res?.message) {
                                    this.toasterService.showSnackBar('error', res.message);
                                }
                                return this.patchState({
                                    accountStatementList: [],
                                    getAccountStatementInProgress: false
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);

                            return this.patchState({
                                accountStatementList: [],
                                getAccountStatementInProgress: false
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
     * Export account statement
     *
     * @memberof ContactComponentStore
     */
    readonly exportAccountStatement = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({
                    exportAccountStatementResponse: null
                });
                return this.contactService.exportAccountStatement(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res.status === "success") {
                                this.patchState({
                                    exportAccountStatementResponse: res.body
                                });
                            } else {
                                this.toasterService.showSnackBar("error", res.message);
                                this.patchState({
                                    exportAccountStatementResponse: null
                                });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            this.patchState({
                                exportAccountStatementResponse: null
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
     * @memberof ContactComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}

import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tap } from "rxjs/operators";
import { Observable, switchMap, catchError, EMPTY, mergeMap } from "rxjs";
import { Store } from "@ngrx/store";
import { ToasterService } from "../services/toaster.service";
import { BaseResponse } from "../models/api-models/BaseResponse";
import { ProjectAccountingService } from "./project-wise-accounting.service";
import { LocaleService } from "../services/locale.service";
import { AppState } from "../store";
import { SearchService } from "../services/search.service";

/**
 * ProjectAccountingState interface definition
 * Defines the structure and contract for ProjectAccountingState objects
 */
export interface ProjectAccountingState {
    isFetchingProjects: boolean;
    projectsList: any;
    saveProjectSuccess: any;
    isSavingProject: boolean;
    projectDetails: any;
    removeProjectSuccess: any;
    projectProfitDetails: any;
    isEntryProgress: boolean;
    entryCreateSuccess: any;
    entryUpdateSuccess: any;
    entryDeleteSuccess: any;
    entrySearch: any;
    accountSearch: any;
    entryList: any;
    isFetchingProfitAndLoss: boolean;
    profitAndLossData: any;
    totalRevenueAndExpense: number;
}

export const DEFAULT_PROJECT_ACCOUNTING_STATE: ProjectAccountingState = {
    isFetchingProjects: false,
    projectsList: null,
    saveProjectSuccess: null,
    isSavingProject: false,
    projectDetails: null,
    removeProjectSuccess: null,
    projectProfitDetails: null,
    isEntryProgress: false,
    entryCreateSuccess: null,
    entryUpdateSuccess: null,
    entryDeleteSuccess: null,
    entrySearch: null,
    accountSearch: null,
    entryList: null,
    isFetchingProfitAndLoss: false,
    profitAndLossData: null,
    totalRevenueAndExpense: 0
};

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * ProjectWiseAccountingComponentStore store
 * Manages projectwiseaccountingcomponent state using NgRx ComponentStore
 */
export class ProjectWiseAccountingComponentStore extends ComponentStore<ProjectAccountingState> implements OnDestroy {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(private toasterService: ToasterService,
        private projectAccountingService: ProjectAccountingService,
        private searchService: SearchService,
        private store: Store<AppState>) {
        /**
         * Handles super functionality
         */
        super(DEFAULT_PROJECT_ACCOUNTING_STATE);
    }

    public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);
    public universalDate$: Observable<any> = this.select(this.store.select(state => state.session.applicationDate), (response) => response);
    public branchList$: Observable<any> = this.select(this.store.select(state => state.settings.branches), (response) => response);

    public isFetchingProjects$ = this.select((state) => state.isFetchingProjects);
    public projectsList$ = this.select((state) => state.projectsList);
    public projectDetails$ = this.select((state) => state.projectDetails);
    public saveProjectSuccess$ = this.select((state) => state.saveProjectSuccess);
    public isSavingProject$ = this.select((state) => state.isSavingProject);
    public removeProjectSuccess$ = this.select((state) => state.removeProjectSuccess);
    public projectProfitDetails$ = this.select((state) => state.projectProfitDetails);
    public isEntryProgress$ = this.select((state) => state.isEntryProgress);
    public entryCreateSuccess$ = this.select((state) => state.entryCreateSuccess);
    public entryUpdateSuccess$ = this.select((state) => state.entryUpdateSuccess);
    public entryDeleteSuccess$ = this.select((state) => state.entryDeleteSuccess);
    public entrySearch$ = this.select((state) => state.entrySearch);
    public accountSearch$ = this.select((state) => state.accountSearch);
    public entryList$ = this.select((state) => state.entryList);
    public isFetchingProfitAndLoss$ = this.select((state) => state.isFetchingProfitAndLoss);
    public profitAndLossData$ = this.select((state) => state.profitAndLossData);
    public totalRevenueAndExpense$ = this.select((state) => state.totalRevenueAndExpense);

    /**
     * Creates a new project and updates the state.
     */
    readonly createNewProject = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ isSavingProject: true, saveProjectSuccess: null });
                return this.projectAccountingService.createNewProject(req.request, req.payload).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.patchState({ isSavingProject: false, saveProjectSuccess: { body: res.body, isCreateFlow: req.request.isCreateFlow } });
                            } else {
                                res?.message && this.toasterService.showSnackBar('error', res.message);
                                this.patchState({ isSavingProject: false, saveProjectSuccess: null });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({ isSavingProject: false, saveProjectSuccess: null });
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
     * Fetches all projects and updates the state.
     */
    readonly getAllProjects = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ isFetchingProjects: true, projectsList: null });
                return this.projectAccountingService.getAllProjects(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.patchState({ isFetchingProjects: false, projectsList: res.body });
                            } else {
                                res?.message && this.toasterService.showSnackBar('error', res.message);
                                this.patchState({ isFetchingProjects: false, projectsList: null });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({ isFetchingProjects: false, projectsList: null });
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
     * Get Single project and updates the state.
     */
    readonly getProjectById = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ isFetchingProjects: true, projectDetails: null });
                return this.projectAccountingService.getProjectById(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.patchState({ isFetchingProjects: false, projectDetails: res.body });
                            } else {
                                res?.message && this.toasterService.showSnackBar('error', res.message);
                                this.patchState({ isFetchingProjects: false, projectDetails: null });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({ isFetchingProjects: false, projectDetails: null });
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
     * Deletes a project and updates the state.
     */
    readonly deleteProject = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ removeProjectSuccess: null });
                return this.projectAccountingService.removeProject(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.toasterService.showSnackBar('success', 'Project delete successfully');
                                this.patchState({ removeProjectSuccess: req.projectUniqueName });
                            } else {
                                res?.message && this.toasterService.showSnackBar('error', res.message);
                                this.patchState({ removeProjectSuccess: null });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({ removeProjectSuccess: null });
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
     * Fetches project profit details and updates the state.
     */
    readonly getProjectProfit = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles mergeMap functionality
             */
            mergeMap((req) => {
                this.patchState({ projectProfitDetails: null });
                return this.projectAccountingService.getProjectProfit(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.patchState({ projectProfitDetails: { profitAndLoss: res.body, uniqueName: req.projectUniqueName } });
                            } else {
                                res?.message && this.toasterService.showSnackBar('error', res.message);
                                this.patchState({ projectProfitDetails: null });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({ projectProfitDetails: null });
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
     * Handles the creation of a new accounting entry and updates the state.
     */
    readonly createNewEntry = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ isEntryProgress: true, entryCreateSuccess: null });
                return this.projectAccountingService.createEntry(req.request, req.payload).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.patchState({ isEntryProgress: false, entryCreateSuccess: res.body });
                            } else {
                                res?.message && this.toasterService.showSnackBar('error', res.message);
                                this.patchState({ isEntryProgress: false, entryCreateSuccess: null });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({ isEntryProgress: false, entryCreateSuccess: null });
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
     * Handles the deletion of an accounting entry and updates the state.
     */
    readonly deleteEntry = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ isEntryProgress: true, entryDeleteSuccess: null });
                return this.projectAccountingService.removeEntry(req.request, req.payload).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.toasterService.showSnackBar('success', 'Entry delete successfully');
                                this.patchState({ isEntryProgress: false, entryDeleteSuccess: { index: req.index, body: res.body } });
                            } else {
                                res?.message && this.toasterService.showSnackBar('error', res.message);
                                this.patchState({ isEntryProgress: false, entryDeleteSuccess: null });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({ isEntryProgress: false, entryDeleteSuccess: null });
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
     * Handles the update of an accounting entry and updates the state.
     */
    readonly updateEntry = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ isEntryProgress: true, entryUpdateSuccess: null });
                return this.projectAccountingService.updateEntry(req.request, req.payload).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.toasterService.showSnackBar('success', 'Entry update successfully');
                                this.patchState({ isEntryProgress: false, entryUpdateSuccess: { body: res.body, entryUniqueName: req.request.entryUniqueName, index: req.index } });
                            } else {
                                res?.message && this.toasterService.showSnackBar('error', res.message);
                                this.patchState({ isEntryProgress: false, entryUpdateSuccess: null });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({ isEntryProgress: false, entryUpdateSuccess: null });
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
     * Handles the search of accounting entries and updates the state.
     */
    readonly searchEntry = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ entrySearch: null });
                return this.projectAccountingService.searchEntry(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.patchState({ entrySearch: { body: res.body, accountUniqueName: req.accountUniqueName } });
                            } else {
                                res?.message && this.toasterService.showSnackBar('error', res.message);
                                this.patchState({ entrySearch: null });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({ entrySearch: null });
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
     * Handles the retrieval of project accounts and updates the state.
     */
    readonly getProjectAccount = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ accountSearch: null });
                return this.searchService.searchAccountV3(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.patchState({ accountSearch: res.body });
                            } else {
                                res?.message && this.toasterService.showSnackBar('error', res.message);
                                this.patchState({ accountSearch: null });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({ accountSearch: null });
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
     * Handles the retrieval of all entry lists and updates the state.
     */
    readonly getAllEnteryList = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ isFetchingProjects: true, entryList: null });
                return this.projectAccountingService.getAllEntryList(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.patchState({ isFetchingProjects: false, entryList: res.body });
                            } else {
                                res?.message && this.toasterService.showSnackBar('error', res.message);
                                this.patchState({ isFetchingProjects: false, entryList: null });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({ isFetchingProjects: false, entryList: null });
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
     * Handles the retrieval of profit and loss details for a project and updates the state.
     */
    readonly getProjectProfitAndLoss = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ isFetchingProfitAndLoss: true, profitAndLossData: null });
                return this.projectAccountingService.getProjectProfitAndLoss(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.patchState({ isFetchingProfitAndLoss: false, profitAndLossData: res.body });
                            } else {
                                res?.message && this.toasterService.showSnackBar('error', res.message);
                                this.patchState({ isFetchingProfitAndLoss: false, profitAndLossData: null });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({ isFetchingProfitAndLoss: false, profitAndLossData: null });
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
     * Fetches total revenue and expense and updates the state.
     */
    readonly getTotalRevenueAndExpense = this.effect((data: Observable<any>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                this.patchState({ totalRevenueAndExpense: 0 });
                return this.projectAccountingService.getTotalRevenueAndExpense(req).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: BaseResponse<any, any>) => {
                            /**
                             * Handles if functionality
                             */
                            if (res?.status === 'success') {
                                this.patchState({ totalRevenueAndExpense: res.body });
                            } else {
                                res?.message && this.toasterService.showSnackBar('error', res.message);
                                this.patchState({ totalRevenueAndExpense: 0 });
                            }
                        },
                        (error: any) => {
                            this.toasterService.showSnackBar("error", error);
                            return this.patchState({ totalRevenueAndExpense: 0 });
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
     * @memberof ProjectWiseAccountingComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}

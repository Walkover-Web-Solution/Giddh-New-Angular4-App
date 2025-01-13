import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { Store } from "@ngrx/store";
import { ToasterService } from "../services/toaster.service";
import { BaseResponse } from "../models/api-models/BaseResponse";
import { ProjectAccountingService } from "./project-wise-accounting.service";
import { LocaleService } from "../services/locale.service";
import { AppState } from "../store";

export interface ProjectAccountingState {
    isFetchingProjects: boolean;
    projectsList: any;
    saveProjectSuccess: any;
    isSavingProject: boolean;
    projectDetails: any;
    removeProjectSuccess: any;
    projectProfitDetails: any;
}

export const DEFAULT_PROJECT_ACCOUNTING_STATE: ProjectAccountingState = {
    isFetchingProjects: false,
    projectsList: null,
    saveProjectSuccess: null,
    isSavingProject: false,
    projectDetails: null,
    removeProjectSuccess: null,
    projectProfitDetails: null,
};

@Injectable()
export class ProjectAccountingComponentStore extends ComponentStore<ProjectAccountingState> implements OnDestroy {

    constructor(private toasterService: ToasterService,
        private projectAccountingService: ProjectAccountingService,
        private store: Store<AppState>) {
        super(DEFAULT_PROJECT_ACCOUNTING_STATE);
    }

    public companyProfile$: Observable<any> = this.select(this.store.select(state => state.settings.profile), (response) => response);
    public activeCompany$: Observable<any> = this.select(this.store.select(state => state.session.activeCompany), (response) => response);
    public onboardingForm$: Observable<any> = this.select(this.store.select(state => state.common.onboardingform), (response) => response);
    public commonCountries$: Observable<any> = this.select(this.store.select(state => state.common.countries), (response) => response);
    public generalState$: Observable<any> = this.select(this.store.select(state => state.general.states), (response) => response);

    public isFetchingProjects$ = this.select((state) => state.isFetchingProjects);
    public projectsList$ = this.select((state) => state.projectsList);
    public projectDetails$ = this.select((state) => state.projectDetails);
    public saveProjectSuccess$ = this.select((state) => state.saveProjectSuccess);
    public isSavingProject$ = this.select((state) => state.isSavingProject);
    public removeProjectSuccess$ = this.select((state) => state.removeProjectSuccess);
    public projectProfitDetails$ = this.select((state) => state.projectProfitDetails);

    /**
     * Creates a new project and updates the state.
     */
    readonly createNewProject = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ isSavingProject: true, saveProjectSuccess: null });
                return this.projectAccountingService.createNewProject(req.model, req.payload).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.patchState({ isSavingProject: false, saveProjectSuccess: res.body });
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
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Updates project details and updates the state.
     */
    readonly editProjectDetails = this.effect((data: Observable<any>) => {
        return data.pipe(
            switchMap((req) => {
                this.patchState({ isSavingProject: true, saveProjectSuccess: null });
                return this.projectAccountingService.editProjectDetails(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.toasterService.showSnackBar('success', 'Project update successfully');
                                this.patchState({ isSavingProject: false, saveProjectSuccess: res.body });
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
            switchMap((req) => {
                this.patchState({ isFetchingProjects: true, projectsList: null });
                return this.projectAccountingService.getAllProjects(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
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
            switchMap((req) => {
                this.patchState({ isFetchingProjects: true, projectDetails: null });
                return this.projectAccountingService.getProjectById(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
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
            switchMap((req) => {
                this.patchState({ removeProjectSuccess: null });
                return this.projectAccountingService.removeProject(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.toasterService.showSnackBar('success', 'Project delete successfully');
                                this.patchState({ removeProjectSuccess: res.body });
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
            switchMap((req) => {
                this.patchState({ projectProfitDetails: null });
                return this.projectAccountingService.removeProject(req).pipe(
                    tapResponse(
                        (res: BaseResponse<any, any>) => {
                            if (res?.status === 'success') {
                                this.patchState({ projectProfitDetails: res.body });
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
                    catchError((err) => EMPTY)
                );
            })
        );
    });

    /**
     * Lifecycle hook for component destroy
     *
     * @memberof BuyPlanComponentStore
     */
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}

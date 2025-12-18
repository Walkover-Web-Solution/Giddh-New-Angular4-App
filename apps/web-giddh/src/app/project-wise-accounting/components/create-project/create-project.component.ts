import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectWiseAccountingComponentStore } from '../../project-wise-accounting.store';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectDialogData } from '../../project-wise-accounting';
import { get } from '../../../lodash-optimized';

@Component({
    selector: 'create-project',
    templateUrl: './create-project.component.html',
    styleUrls: ['./create-project.component.scss'],
    providers: [ProjectWiseAccountingComponentStore],
    standalone: false
})
export class CreateProjectComponent implements OnInit, OnDestroy {
    /** Indicates if the form is loading */
    public isLoading: boolean = false;
    /** Localized strings specific to this component */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to track the saving state of the project */
    public isSavingProject$: Observable<boolean> = this.componentStore.isSavingProject$;
    /** Destroy Subject to manage subscriptions and prevent memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** FormGroup for creating/updating project */
    public createProjectForm: FormGroup;
    /** Getter for the projectName FormControl */
    public get projectName(): FormControl {
        return this.createProjectForm.get('projectName') as FormControl;
    }

    constructor(
        private dialogRef: MatDialogRef<CreateProjectComponent>,
        private componentStore: ProjectWiseAccountingComponentStore,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public inputData: ProjectDialogData
    ) { }

    /**
     * Lifecycle hook for component initialization.
     *
     * @memberof CreateProjectComponent
     */
    public ngOnInit(): void {
        this.initCreateProjectForm();
        this.componentStore.saveProjectSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((project) => {
            if (project) {
                this.sendResponse(project);
            }
        });

        this.componentStore.isSavingProject$.pipe(takeUntil(this.destroyed$)).subscribe((loading) => {
            this.isLoading = loading;
        });
    }

    /**
     * Initializes the Create Project Form with default values and validation rules.
     *
     * @private
     * @memberof CreateProjectComponent
     */
    private initCreateProjectForm(): void {
        this.createProjectForm = this.formBuilder.group({
            projectName: [this.inputData?.name || '', Validators.required]
        });
    }

    /**
     * Validates the form and dispatches a create/update request if valid.
     *
     * @memberof CreateProjectComponent
     */
    public createProject(): void {
        if (!this.isLoading) {
            const projectName = this.createProjectForm.get('projectName').value;
            this.componentStore.createNewProject({
                request: {
                    data: this.inputData?.project,
                    isCreateFlow: this.inputData?.isCreateFlow,
                },
                payload: { name: projectName }
            });
        }
    }

    /**
     * Closes the dialog and sends the response back to the parent component.
     *
     * @param {*} response - The data to return to the parent.
     * @memberof CreateProjectComponent
     */
    public sendResponse(response: any): void {
        this.dialogRef?.close(response);
    }

    /**
     * Lifecycle hook for component cleanup.
     *
     * @memberof CreateProjectComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}

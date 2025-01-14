import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectAccountingComponentStore } from '../../project-wise-accounting.store';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'create-project',
    templateUrl: './create-project.component.html',
    styleUrls: ['./create-project.component.scss'],
    providers: [ProjectAccountingComponentStore]
})
export class CreateProjectComponent implements OnInit, OnDestroy {
    /** Indicates if the form is loading */
    public isLoading: boolean = true;
    /** Localized strings specific to this component */
    public localeData: any = {};
    /** Common localized strings used across components */
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
        private componentStore: ProjectAccountingComponentStore,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public inputData: any // Holds data passed to the dialog
    ) {}

    /** Lifecycle hook for component initialization */
    public ngOnInit(): void {
        this.initCreateProjectForm();

        // Subscribe to saveProjectSuccess$ to handle successful saves
        this.componentStore.saveProjectSuccess$
            .pipe(takeUntil(this.destroyed$))
            .subscribe((project) => {
                if (project) {
                    if (!this.inputData.isCreateFlow) {
                        project.name = this.createProjectForm.get('projectName')?.value;
                    }
                    this.sendResponse(project);
                }
            });
    }

    /**
     * Initializes the Create Project Form with default values and validation rules
     */
    private initCreateProjectForm(): void {
        this.createProjectForm = this.formBuilder.group({
            projectName: [this.inputData?.name || '', [Validators.required, Validators.minLength(3)]]
        });
    }

    /**
     * Handles form submission to create or update a project
     */
    public createProject(): void {
        if (this.createProjectForm.valid) {
            const projectName = this.createProjectForm.value.projectName;

            this.componentStore.createNewProject({
                request: {
                    data: this.inputData.project,
                    isCreateFlow: this.inputData.isCreateFlow,
                },
                payload: { name: projectName },
            });
        } else {
            this.createProjectForm.markAllAsTouched(); // Mark fields as touched to show validation errors
        }
    }

    /**
     * Closes the dialog and sends the response back to the parent component
     * @param response - The data to return to the parent
     */
    public sendResponse(response: any): void {
        this.dialogRef.close(response);
    }

    /** Lifecycle hook for component cleanup */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}

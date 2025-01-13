import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProjectAccountingComponentStore } from '../../project-wise-accounting.store';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from '../../../services/general.service';

@Component({
    selector: 'create-project',
    templateUrl: 'create-project.component.html',
    styleUrls: ['./create-project.component.scss'],
    providers: [ProjectAccountingComponentStore]
})
export class CreateProjectComponent implements OnInit, OnDestroy {
    /** Holds true if api is in progress */
    public isLoading: boolean = true;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    public isSavingProject$: Observable<any> = this.componentStore.isSavingProject$;
    public createProjectForm: FormGroup;
    private model: any = {
        companyUniqueName: 'multipin168414461208805dao0',
        branchUniqueName: 'multiplevarianttesting1'
    }
    /** Confirmation modal configuration */
    @Input() configuration: any ;
    public get companyName(): FormControl {
        return this.createProjectForm.get('companyName') as FormControl
    }

    constructor(
        private dialogRef: MatDialogRef<CreateProjectComponent>,
        private componentStore: ProjectAccountingComponentStore,
        private formBuilder: FormBuilder
    ) {

    }

    public ngOnInit() {
        this.initCreateProjectForm();
    }

    /**
     * This will be use for init lut form
     *
     * @memberof CreateProjectComponent
     */
    public initCreateProjectForm(): void {
        this.createProjectForm = this.formBuilder.group({
            companyName: ['', [Validators.required, Validators.minLength(3)]]
        });
    }

    public createProject() {
        if (this.createProjectForm.valid) {
            const companyName = this.createProjectForm.value.companyName;
            this.componentStore.createNewProject({ model: this.model, payload: { name: companyName } });
        } else {
            this.createProjectForm.markAllAsTouched();
        }
    }

    public ngOnDestroy() {

    }

}

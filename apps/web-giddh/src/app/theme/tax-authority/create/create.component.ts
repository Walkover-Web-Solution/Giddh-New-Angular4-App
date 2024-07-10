import { Component, Inject, OnInit } from '@angular/core';
import { TaxAuthorityComponentStore } from '../utility/tax-authority.store';
import { ReplaySubject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { GeneralActions } from '../../../actions/general/general.actions';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToasterService } from '../../../services/toaster.service';

@Component({
    selector: 'create-tax-authority',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    providers: [TaxAuthorityComponentStore]
})
export class CreateComponent implements OnInit {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** From Group for Tax Authority */
    public taxAuthorityForm: FormGroup;
    /** Holds state list */
    public stateList: any = [];

    constructor(
        private componentStore: TaxAuthorityComponentStore,
        private formBuilder: FormBuilder,
        private store: Store<AppState>,
        private generalActions: GeneralActions,
        private toaster: ToasterService,
        public dialogRef: MatDialogRef<CreateComponent>,
        @Inject(MAT_DIALOG_DATA) public taxAuthorityInfo: any
    ) {
        this.store.dispatch(this.generalActions.getAllState({ country: 'US' }));
    }

    /**
     * Lifecycle hook for initialization
     *
     * @memberof CreateComponent
     */
    public ngOnInit(): void {
        this.getStates();

        if (this.taxAuthorityInfo) {
            this.initializeForm(this.taxAuthorityInfo);
            this.componentStore.updateTaxAuthorityIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response) {
                    this.dialogRef.close(true);
                }
            });
        } else {
            this.initializeForm();
            this.componentStore.createTaxAuthorityIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response) {
                    this.dialogRef.close(true);
                }
            });
        }
    }

    /**
     * Initialize Form group for create tax authority
     *
     * @private
     * @memberof CreateComponent
     */
    private initializeForm(value?: any): void {
        this.taxAuthorityForm = this.formBuilder.group({
            name: [value?.name ?? null],
            stateCode: [value?.state?.code ?? null],
            stateName: [value?.state?.name ?? null],
            description: [value?.description ?? null]
        });        
    }

    /**
     * Create Tax Authority
     *
     * @memberof CreateComponent
     */
    public createUpdateTaxAuthority(): void {
        if (this.taxAuthorityInfo?.uniqueName) {
            const model: any = this.getChangedProperties();
            if (Object.keys(model).length !== 0) {
                this.componentStore.updateTaxAuthority({ model, uniqueName: this.taxAuthorityInfo?.uniqueName });
            } else {
                this.toaster.showSnackBar("warning", this.localeData?.no_values_changed_message);
            }
        } else {
            const model = this.taxAuthorityForm.value;
            !model.description && delete model.description
            this.componentStore.createTaxAuthority(model);
        }
    }

    /**
     * This will use for get states list
     *
     * @memberof CreateComponent
     */
    public getStates(): void {
        this.store.pipe(select(state => state.general.states), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const states = [];
                if (response.stateList) {
                    Object.keys(response.stateList).forEach(key => {
                        if (key) {
                            states.push({
                                label: response.stateList[key].code + ' - ' + response.stateList[key].name,
                                value: response.stateList[key].code,
                                stateGstCode: response.stateList[key].stateGstCode
                            });
                        }
                    });
                    this.stateList = states;
                }
            }
        });
    }

    /**
     * Get Dirty form controls value as API Model Object
     *
     * @private
     * @returns {*}
     * @memberof CreateComponent
     */
    private getChangedProperties(): any {
        let model = {};
        Object.keys(this.taxAuthorityForm.controls).forEach((key) => {
            const currentControl = this.taxAuthorityForm.controls[key];
            if (currentControl.dirty) {
                model = { ...model, [key]: this.taxAuthorityForm.get(key).value };
            }
        });
        return model;
    }

}

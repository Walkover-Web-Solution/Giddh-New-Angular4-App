import { Component, OnInit } from '@angular/core';
import { TaxAuthorityComponentStore } from '../utility/tax-authority.store';
import { ReplaySubject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

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

    constructor(
        private componentStore: TaxAuthorityComponentStore,
        private formBuilder: FormBuilder
    ) { 
        this.initializeForm();
    }

    /**
     * Lifecycle hook for initialization
     *
     * @memberof CreateComponent
     */
    public ngOnInit(): void {
    }

    /**
     * Initialize Form group for create tax authority
     *
     * @private
     * @memberof CreateComponent
     */
    private initializeForm(): void {
        this.taxAuthorityForm = this.formBuilder.group({
            name: [null],
            stateCode: [null],
            description: [null]
        });
    }

    /**
     * Create Tax Authority
     *
     * @memberof CreateComponent
     */
    public createTaxAuthority(): void {
        const model = this.taxAuthorityForm.value;

        if(!model.description) {
            delete model.description;
        }
        this.componentStore.createTaxAuthority(model);
    }
    
}

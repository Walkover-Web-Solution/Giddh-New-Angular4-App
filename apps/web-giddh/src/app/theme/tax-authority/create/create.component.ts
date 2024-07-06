import { Component, OnInit } from '@angular/core';
import { TaxAuthorityComponentStore } from '../utility/tax-authority.store';
import { ReplaySubject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { GeneralActions } from '../../../actions/general/general.actions';

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
        private generalActions: GeneralActions
    ) {
        this.initializeForm();
        this.store.dispatch(this.generalActions.getAllState({ country: 'US' }));
    }

    /**
     * Lifecycle hook for initialization
     *
     * @memberof CreateComponent
     */
    public ngOnInit(): void {
        this.getStates();
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

        if (!model.description) {
            delete model.description;
        }
        this.componentStore.createTaxAuthority(model);
    }

    /**
     * This will use for get states list
     *
     * @memberof CreateComponent
     */
    public getStates() {
        this.store.pipe(select(state => state.general.states), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                console.log(response);
                
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

}

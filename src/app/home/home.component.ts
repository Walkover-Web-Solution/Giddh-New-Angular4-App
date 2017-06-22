import { CompanyRequest } from './../models/api-models/Company';
import { CompanyActions } from './../services/actions/company.actions';
import { Actions } from '@ngrx/effects';

import { Store } from '@ngrx/store';
import { HomeActions } from './actions/home.actions';
import { AppState } from '../store/roots';
import {
    Component,
    OnInit
} from '@angular/core';
import { LoginActions } from '../services/actions';
import { Select2OptionData } from 'ng2-select2/ng2-select2';

@Component({
    selector: 'home',  // <home></home>
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    /**
     * Set our default values
     */
    public exampleData: Select2OptionData[];
    public localState = { value: '' };
    /**
     * TypeScript public modifiers
     */
    constructor(
        private store: Store<AppState>,
        private companyActions: CompanyActions,
        private loginAction: LoginActions
    ) {
        let company = new CompanyRequest();
        // this.store.dispatch(this.companyActions.CreateCompany(company));
    }

    public ngOnInit() {
        console.log('hello `Home` component');
        this.exampleData = [
        ];
    }

    public getAddress(e) {
        console.log(e);
    }
}

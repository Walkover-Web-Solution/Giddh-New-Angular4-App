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

@Component({
  selector: 'home',  // <home></home>
  styleUrls: [ './home.component.css' ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  /**
   * Set our default values
   */
  public localState = { value: '' };
  /**
   * TypeScript public modifiers
   */
  constructor(
    private store: Store<AppState>,
    private companyActions: CompanyActions
  ) {
    let company = new CompanyRequest();
    // this.store.dispatch(this.companyActions.CreateCompany(company));
  }

  public ngOnInit() {
    console.log('hello `Home` component');
    /**
     * this.title.getData().subscribe(data => this.data = data);
     */
  }
}

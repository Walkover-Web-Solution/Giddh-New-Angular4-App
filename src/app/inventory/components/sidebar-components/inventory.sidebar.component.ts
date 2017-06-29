import { AppState } from '../../../store/roots';
import { Actions } from '@ngrx/effects';

import { Store } from '@ngrx/store';

import {
  Component,
  OnInit
} from '@angular/core';
import { LoginActions } from '../services/actions/login.action';
// import { Select2OptionData } from '../shared/theme/select2';

@Component({
  selector: 'invetory-sidebar',  // <home></home>
  templateUrl: './inventory.sidebar.component.html'
})
export class InventorySidebarComponent implements OnInit {

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>) {
  }
  public ngOnInit() {
    console.log('hello `Home` component');
    // this.exampleData = [
    // ];
  }
}

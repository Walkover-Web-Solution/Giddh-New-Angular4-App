import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { AppState } from '../../../store/roots';
import { Actions } from '@ngrx/effects';

import { Store } from '@ngrx/store';

import {
  Component,
  OnInit
} from '@angular/core';
import { LoginActions } from '../services/actions/login.action';
import { Observable } from 'rxjs/Rx';
// import { Select2OptionData } from '../shared/theme/select2';

@Component({
  selector: 'invetory-sidebar',  // <home></home>
  templateUrl: './inventory.sidebar.component.html'
})
export class InventorySidebarComponent implements OnInit {
  public groupsWithStocks$: Observable<IGroupsWithStocksHierarchyMinItem[]>;

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>) {
    this.groupsWithStocks$ = this.store.select(s => s.inventory.groupsWithStocks);
  }
  public ngOnInit() {
    console.log('hello `Home` component');
    // this.exampleData = [
    // ];
  }
}

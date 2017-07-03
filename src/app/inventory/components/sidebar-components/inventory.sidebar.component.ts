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
import { SidebarAction } from '../../../services/actions/inventory/sidebar.actions';

@Component({
  selector: 'invetory-sidebar',  // <home></home>
  templateUrl: './inventory.sidebar.component.html'
})
export class InventorySidebarComponent implements OnInit {
  public groupsWithStocks$: Observable<IGroupsWithStocksHierarchyMinItem[]>;

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, private sidebarAction: SidebarAction) {
    this.groupsWithStocks$ = this.store.select(s => s.inventory.groupsWithStocks);
  }
  public ngOnInit() {
    console.log('hello `Home` component');
    this.store.dispatch(this.sidebarAction.GetGroupsWithStocksHierarchyMin());
    // this.exampleData = [
    // ];
  }
}

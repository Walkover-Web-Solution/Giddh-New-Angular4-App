import { AppState } from '../../../store/roots';
import { Actions } from '@ngrx/effects';

import { Store } from '@ngrx/store';

import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { LoginActions } from '../services/actions/login.action';
import { ActivatedRoute } from '@angular/router';
import { SidebarAction } from '../../../services/actions/inventory/sidebar.actions';
import { Subscription } from 'rxjs/Rx';
// import { Select2OptionData } from '../shared/theme/select2';

@Component({
  selector: 'invetory-add-stock',  // <home></home>
  templateUrl: './inventory.addstock.component.html'
})
export class InventoryAddStockComponent implements OnInit, AfterViewInit, OnDestroy {
  public sub: Subscription;
  public groupUniqueName: string;
  public stockUniqueName: string;
  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction) {
  }
  public ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.groupUniqueName = params['groupUniqueName'];
      this.stockUniqueName = params['stockUniqueName'];
    });
  }
  public ngAfterViewInit() {
    // this.store.dispatch(this.sideBarAction.GetInventoryStock(this.stockUniqueName));
  }
  public ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

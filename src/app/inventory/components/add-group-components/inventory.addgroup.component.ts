import { AppState } from '../../../store/roots';
import { Actions } from '@ngrx/effects';

import { Store } from '@ngrx/store';

import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { LoginActions } from '../services/actions/login.action';
import { Subscription } from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { SidebarAction } from '../../../services/actions/inventory/sidebar.actions';
// import { Select2OptionData } from '../shared/theme/select2';

@Component({
  selector: 'invetory-add-group',  // <home></home>
  templateUrl: './inventory.addgroup.component.html'
})
export class InventoryAddGroupComponent implements OnInit, OnDestroy {
  public sub: Subscription;
  public groupUniqueName: string;
  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction) {
  }
  public ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.groupUniqueName = params['groupUniqueName'];
      if (this.groupUniqueName) {
        this.store.dispatch(this.sideBarAction.OpenGroup(this.groupUniqueName));
        this.store.dispatch(this.sideBarAction.GetInventoryGroup(this.groupUniqueName));
      }
    });
  }
  public ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

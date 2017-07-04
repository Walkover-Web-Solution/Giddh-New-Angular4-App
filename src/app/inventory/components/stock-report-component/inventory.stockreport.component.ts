import { AppState } from '../../../store/roots';

import { Store } from '@ngrx/store';

import { Component, OnInit } from '@angular/core';
import { SidebarAction } from '../../../services/actions/inventory/sidebar.actions';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { InventoryStockReportVM } from './inventory-stock-report.view-model';

@Component({
  selector: 'invetory-stock-report',  // <home></home>
  templateUrl: './inventory.stockreport.component.html'
})
export class InventoryStockReportComponent implements OnInit {
  public sub: Subscription;
  public groupUniqueName: string;
  public stockUniqueName: string;
  public vm: InventoryStockReportVM;

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction) {
    this.vm = new InventoryStockReportVM();
  }

  public ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.groupUniqueName = params['groupUniqueName'];
      this.stockUniqueName = params['stockUniqueName'];
      if (this.groupUniqueName) {
        // this.store.dispatch(this.sideBarAction.OpenGroup(this.groupUniqueName));
        this.store.dispatch(this.sideBarAction.GetInventoryGroup(this.groupUniqueName, this.stockUniqueName));
      }
    });
  }

  public getStockReport() {
    return false;
  }

  public goToManageStock() {
    return false;
  }
}

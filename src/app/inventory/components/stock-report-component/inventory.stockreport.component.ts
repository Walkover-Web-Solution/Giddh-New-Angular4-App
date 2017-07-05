import { StockReportResponse, StockReportRequest } from '../../../models/api-models/Inventory';
import { StockReportActions } from '../../../services/actions/inventory/stocks-report.actions';
import { AppState } from '../../../store/roots';

import { Store } from '@ngrx/store';

import { Component, OnInit } from '@angular/core';
import { SidebarAction } from '../../../services/actions/inventory/sidebar.actions';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { InventoryStockReportVM } from './inventory-stock-report.view-model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'invetory-stock-report',  // <home></home>
  templateUrl: './inventory.stockreport.component.html'
})
export class InventoryStockReportComponent implements OnInit {
  public stockReport$: Observable<StockReportResponse>;
  public sub: Subscription;
  public groupUniqueName: string;
  public stockUniqueName: string;
  public form: FormGroup;

  /**
 * TypeScript public modifiers
 */
  constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction, private stockReportActions: StockReportActions, private fb: FormBuilder) {
    this.stockReport$ = this.store.select(p => p.inventory.stockReport);
  }

  public ngOnInit() {
    this.sub = this.route.params.take(1).subscribe(params => {
      this.groupUniqueName = params['groupUniqueName'];
      this.stockUniqueName = params['stockUniqueName'];
      if (this.groupUniqueName) {
        let activeGroup = null;
        let activeStock = null;
        this.store.dispatch(this.sideBarAction.SetActiveStock(this.stockUniqueName));
        this.store.select(a => a.inventory.activeGroup).take(1).subscribe(a => {
          if (this.groupUniqueName && a && a.uniqueName === this.groupUniqueName) {
            //
          } else {
            let request = new StockReportRequest();
            request.count = 10;
            request.from = '';
            request.to = '';
            request.page = 1;
            request.stockGroupUniqueName = this.groupUniqueName;
            request.stockUniqueName = this.stockUniqueName;
            this.store.dispatch(this.stockReportActions.GetStocksReport(request));
          }
        });
      }
    });
    this.sub.unsubscribe();
    this.form = this.fb.group({
      from: '',
      to: '',
      page: '',
      count: '',
    });
  }

  public getStockReport() {
    return false;
  }

  public goToManageStock() {
    return false;
  }
}

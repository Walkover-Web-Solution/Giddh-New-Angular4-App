import { StockReportRequest, StockReportResponse } from '../../../models/api-models/Inventory';
import { StockReportActions } from '../../../services/actions/inventory/stocks-report.actions';
import { AppState } from '../../../store/roots';

import { Store } from '@ngrx/store';

import { Component, OnInit } from '@angular/core';
import { SidebarAction } from '../../../services/actions/inventory/sidebar.actions';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { InventoryStockReportVM } from './inventory-stock-report.view-model';
import { FormBuilder } from '@angular/forms';
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
  public stockReportRequest: StockReportRequest;
  public showFromDatePicker: boolean;
  public showToDatePicker: boolean;
  public toDate: Date;
  public fromDate: Date;

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction, private stockReportActions: StockReportActions, private fb: FormBuilder) {
    this.stockReport$ = this.store.select(p => p.inventory.stockReport);
    this.stockReportRequest = new StockReportRequest();
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

            this.stockReportRequest.count = 10;
            this.stockReportRequest.from = '';
            this.stockReportRequest.to = '';
            this.stockReportRequest.page = 1;
            this.stockReportRequest.stockGroupUniqueName = this.groupUniqueName;
            this.stockReportRequest.stockUniqueName = this.stockUniqueName;
            this.store.dispatch(this.stockReportActions.GetStocksReport(this.stockReportRequest));
          }
        });
      }
    });
  }

  public getStockReport() {
    this.store.dispatch(this.stockReportActions.GetStocksReport(this.stockReportRequest));
    return false;
  }

  public goToManageStock() {
    return false;
  }

  public nextPage() {
    this.stockReportRequest.page++;
    this.getStockReport();
  }

  public prevPage() {
    this.stockReportRequest.page--;
    this.getStockReport();
  }
}

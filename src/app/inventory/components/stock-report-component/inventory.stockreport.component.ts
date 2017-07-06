import { StockReportRequest, StockReportResponse } from '../../../models/api-models/Inventory';
import { StockReportActions } from '../../../services/actions/inventory/stocks-report.actions';
import { AppState } from '../../../store/roots';

import { Store } from '@ngrx/store';

import { Component, OnInit } from '@angular/core';
import { SidebarAction } from '../../../services/actions/inventory/sidebar.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { InventoryStockReportVM } from './inventory-stock-report.view-model';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import * as _ from 'lodash';
import { InventoryAction } from '../../../services/actions/inventory/inventory.actions';
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

  public moment = moment;

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction,
    private stockReportActions: StockReportActions, private fb: FormBuilder, private router: Router, private inventoryAction: InventoryAction) {
    this.stockReport$ = this.store.select(p => p.inventory.stockReport);
    this.stockReportRequest = new StockReportRequest();
  }

  public ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.groupUniqueName = params['groupUniqueName'];
      this.stockUniqueName = params['stockUniqueName'];
      if (this.groupUniqueName) {
        let activeGroup = null;
        let activeStock = null;
        this.store.dispatch(this.sideBarAction.SetActiveStock(this.stockUniqueName));
        if (this.groupUniqueName && this.stockUniqueName) {
          this.store.select(p => p.inventory.activeGroup).take(1).subscribe((a) => {
            if (!a) {
              this.store.dispatch(this.sideBarAction.OpenGroup(this.groupUniqueName));
              this.store.dispatch(this.sideBarAction.GetInventoryGroup(this.groupUniqueName));
            }
          });
          this.stockReportRequest.count = 10;
          this.fromDate = moment().add(-1, 'month').toDate();
          this.toDate = moment().toDate();
          this.stockReportRequest.from = moment().add(-1, 'month').format('DD-MM-YYYY');
          this.stockReportRequest.to = moment().format('DD-MM-YYYY');
          this.stockReportRequest.page = 1;
          this.stockReportRequest.stockGroupUniqueName = this.groupUniqueName;
          this.stockReportRequest.stockUniqueName = this.stockUniqueName;
          this.store.dispatch(this.stockReportActions.GetStocksReport(_.cloneDeep(this.stockReportRequest)));
        }
      }
    });
  }

  public getStockReport(resetPage: boolean) {
    this.stockReportRequest.from = moment(this.fromDate).format('DD-MM-YYYY');
    this.stockReportRequest.to = moment(this.toDate).format('DD-MM-YYYY');
    if (resetPage) {
      this.stockReportRequest.page = 1;
    }
    this.store.dispatch(this.stockReportActions.GetStocksReport(_.cloneDeep(this.stockReportRequest)));
    return false;
  }

  public goToManageStock() {
    if (this.groupUniqueName && this.stockUniqueName) {
      this.store.dispatch(this.inventoryAction.showLoaderForStock());
      this.store.dispatch(this.sideBarAction.GetInventoryStock(this.stockUniqueName));
      this.router.navigate(['/pages', 'inventory', 'add-group', this.groupUniqueName, 'add-stock', this.stockUniqueName]);
    }
  }

  public nextPage() {
    this.stockReportRequest.page++;
    this.getStockReport(false);
  }

  public prevPage() {
    this.stockReportRequest.page--;
    this.getStockReport(false);
  }
  public closeFromDate(e: any) {
    if (this.showFromDatePicker) {
      this.showFromDatePicker = false;
    }
  }
  public closeToDate(e: any) {
    if (this.showToDatePicker) {
      this.showToDatePicker = false;
    }
  }
}

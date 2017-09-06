import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { StockDetailResponse, StockReportRequest, StockReportResponse } from '../../../models/api-models/Inventory';
import { StockReportActions } from '../../../services/actions/inventory/stocks-report.actions';
import { AppState } from '../../../store/roots';

import { Store } from '@ngrx/store';

import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { SidebarAction } from '../../../services/actions/inventory/sidebar.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { InventoryStockReportVM } from './inventory-stock-report.view-model';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import * as _ from 'lodash';
import { InventoryAction } from '../../../services/actions/inventory/inventory.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'invetory-stock-report',  // <home></home>
  templateUrl: './inventory.stockreport.component.html'
})
export class InventoryStockReportComponent implements OnInit, OnDestroy, AfterViewInit {
  public today: Date = new Date();
  public activeStock$: string;
  public stockReport$: Observable<StockReportResponse>;
  public sub: Subscription;
  public groupUniqueName: string;
  public stockUniqueName: string;
  public stockReportRequest: StockReportRequest;
  public showFromDatePicker: boolean;
  public showToDatePicker: boolean;
  public toDate: string;
  public fromDate: string;
  public moment = moment;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction,
    private stockReportActions: StockReportActions, private router: Router, private fb: FormBuilder, private inventoryAction: InventoryAction) {
    this.stockReport$ = this.store.select(p => p.inventory.stockReport).takeUntil(this.destroyed$);
    // this.activeStock$ = this.store.select(p => {
    //   return this.findStockNameFromId(p.inventory.groupsWithStocks, this.stockUniqueName);
    // });
    // constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction,
    //   private stockReportActions: StockReportActions, private fb: FormBuilder, private router: Router, private inventoryAction: InventoryAction) {
    //   this.stockReport$ = this.store.select(p => p.inventory.stockReport);
    this.stockReportRequest = new StockReportRequest();
  }
  public findStockNameFromId(grps: IGroupsWithStocksHierarchyMinItem[], stockUniqueName: string): string {
    if (grps && grps.length > 0) {
      for (let key of grps) {
        if (key.stocks && key.stocks.length > 0) {

          let index = key.stocks.findIndex(p => p.uniqueName === stockUniqueName);
          if (index === -1) {
            let result = this.findStockNameFromId(key.childStockGroups, stockUniqueName);
            if (result !== '') {
              return result;
            } else {
              continue;
            }
          } else {
            return key.stocks[index].name;
          }
        } else {
          let result = this.findStockNameFromId(key.childStockGroups, stockUniqueName);
          if (result !== '') {
            return result;
          } else {
            continue;
          }
        }
      }
      return '';
    }
    return '';
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
          this.store.select(p => {
            return this.findStockNameFromId(p.inventory.groupsWithStocks, this.stockUniqueName);
          }).take(1).subscribe(p => this.activeStock$ = p);
          this.stockReportRequest.count = 10;
          this.fromDate = moment().add(-1, 'month').format('DD-MM-YYYY');
          this.toDate = moment().format('DD-MM-YYYY');
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
    this.stockReportRequest.from = this.fromDate || null;
    this.stockReportRequest.to = this.toDate || null;
    if (resetPage) {
      this.stockReportRequest.page = 1;
    }
    this.store.dispatch(this.stockReportActions.GetStocksReport(_.cloneDeep(this.stockReportRequest)));
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public ngAfterViewInit() {
    this.store.select(p => p.inventory.activeGroup).take(1).subscribe((a) => {
      if (!a) {
        this.store.dispatch(this.sideBarAction.GetInventoryGroup(this.groupUniqueName));
      }
    });
  }
  public goToManageStock() {
    if (this.groupUniqueName && this.stockUniqueName) {
      this.store.dispatch(this.inventoryAction.showLoaderForStock());
      this.store.dispatch(this.sideBarAction.GetInventoryStock(this.stockUniqueName, this.groupUniqueName));
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

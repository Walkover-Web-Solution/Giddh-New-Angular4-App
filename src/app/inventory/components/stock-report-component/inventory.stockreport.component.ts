import { take, takeUntil } from 'rxjs/operators';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { StockReportRequest, StockReportResponse } from '../../../models/api-models/Inventory';
import { StockReportActions } from '../../../actions/inventory/stocks-report.actions';
import { AppState } from '../../../store';

import { Store } from '@ngrx/store';

import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment/moment';
import * as _ from '../../../lodash-optimized';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';

@Component({
  selector: 'invetory-stock-report',  // <home></home>
  templateUrl: './inventory.stockreport.component.html',
  styles: [`
    .bdrT {
      border-color: #ccc;
    }
  `]
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
  public datePickerOptions: any = {
    locale: {
      applyClass: 'btn-green',
      applyLabel: 'Go',
      fromLabel: 'From',
      format: 'D-MMM-YY',
      toLabel: 'To',
      cancelLabel: 'Cancel',
      customRangeLabel: 'Custom range'
    },
    ranges: {
      'Last 1 Day': [
        moment().subtract(1, 'days'),
        moment()
      ],
      'Last 7 Days': [
        moment().subtract(6, 'days'),
        moment()
      ],
      'Last 30 Days': [
        moment().subtract(29, 'days'),
        moment()
      ],
      'Last 6 Months': [
        moment().subtract(6, 'months'),
        moment()
      ],
      'Last 1 Year': [
        moment().subtract(12, 'months'),
        moment()
      ]
    },
    startDate: moment().subtract(30, 'days'),
    endDate: moment()
  };
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction,
              private stockReportActions: StockReportActions, private router: Router, private fb: FormBuilder, private inventoryAction: InventoryAction) {
    this.stockReport$ = this.store.select(p => p.inventory.stockReport).pipe(takeUntil(this.destroyed$));
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
          }).pipe(take(1)).subscribe(p => this.activeStock$ = p);
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
    this.store.select(p => p.inventory.activeGroup).pipe(take(1)).subscribe((a) => {
      if (!a) {
        this.store.dispatch(this.sideBarAction.GetInventoryGroup(this.groupUniqueName));
      }
    });
  }

  public goToManageStock() {
    if (this.groupUniqueName && this.stockUniqueName) {
      this.store.dispatch(this.inventoryAction.showLoaderForStock());
      this.store.dispatch(this.sideBarAction.GetInventoryStock(this.stockUniqueName, this.groupUniqueName));
      this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
      this.setInventoryAsideState(true, false, true);
      // this.router.navigate(['/pages', 'inventory', 'add-group', this.groupUniqueName, 'add-stock', this.stockUniqueName]);
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

  public selectedDate(value: any) {
    this.fromDate = moment(value.picker.startDate).format('DD-MM-YYYY');
    this.toDate = moment(value.picker.endDate).format('DD-MM-YYYY');
    // this.stockReportRequest.page = 0;

    this.getStockReport(true);
  }

  /**
   * setInventoryAsideState
   */
  public setInventoryAsideState(isOpen, isGroup, isUpdate) {
    this.store.dispatch(this.inventoryAction.ManageInventoryAside({isOpen, isGroup, isUpdate}));
  }
}

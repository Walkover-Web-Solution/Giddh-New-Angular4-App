import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { StockReportRequest, StockReportResponse, StockGroupResponse } from '../../../models/api-models/Inventory';
import { StockReportActions } from '../../../actions/inventory/stocks-report.actions';
import { AppState } from '../../../store';

import { Store } from '@ngrx/store';

import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment/moment';
import * as _ from '../../../lodash-optimized';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'invetory-group-stock-report',  // <home></home>
  templateUrl: './group.stockreport.component.html',
  styles: [`
  .bdrT {
    border-color: #ccc;
  }
  `]
})
export class InventoryGroupStockReportComponent implements OnInit, OnDestroy, AfterViewInit {
  public today: Date = new Date();
  public activeGroup$: Observable<StockGroupResponse>;
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
  public activeGroupName: string;
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
    this.stockReport$ = this.store.select(p => p.inventory.stockReport).takeUntil(this.destroyed$);
    this.stockReportRequest = new StockReportRequest();
    this.activeGroup$ = this.store.select(state => state.inventory.activeGroup).takeUntil(this.destroyed$);

    this.activeGroup$.takeUntil(this.destroyed$).subscribe(a => {
      console.log(a);
      if (a) {
        this.activeGroupName = a.name;
      }
    });
  }

  public ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.groupUniqueName = params['groupUniqueName'];
      if (this.groupUniqueName) {
        let activeGroup = null;
        let activeStock = null;
        if (this.groupUniqueName) {
          this.stockReportRequest.count = 10;
          this.fromDate = moment().add(-1, 'month').format('DD-MM-YYYY');
          this.toDate = moment().format('DD-MM-YYYY');
          this.stockReportRequest.from = moment().add(-1, 'month').format('DD-MM-YYYY');
          this.stockReportRequest.to = moment().format('DD-MM-YYYY');
          this.stockReportRequest.page = 1;
          this.stockReportRequest.stockGroupUniqueName = this.groupUniqueName;
          // this.store.dispatch(this.stockReportActions.GetStocksReport(_.cloneDeep(this.stockReportRequest)));
        }
      }
    });
  }

  public getGroupReport(resetPage: boolean) {
    this.stockReportRequest.from = this.fromDate || null;
    this.stockReportRequest.to = this.toDate || null;
    if (resetPage) {
      this.stockReportRequest.page = 1;
    }
    // this.store.dispatch(this.stockReportActions.GetStocksReport(_.cloneDeep(this.stockReportRequest)));
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

  public goToManageGroup() {
    if (this.groupUniqueName) {
      this.router.navigate(['/pages', 'inventory', 'add-group', this.groupUniqueName]);
    }
  }

  public nextPage() {
    this.stockReportRequest.page++;
    this.getGroupReport(false);
  }

  public prevPage() {
    this.stockReportRequest.page--;
    this.getGroupReport(false);
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

    this.getGroupReport(true);
  }
}

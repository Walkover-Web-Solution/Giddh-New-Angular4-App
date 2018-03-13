import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { GroupStockReportRequest, StockGroupResponse, GroupStockReportResponse } from '../../../models/api-models/Inventory';
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
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';

const COMPARISON_FILTER = [
  { label: 'Greater Than', value: 'Greater Than' },
  { label: 'Less Than', value: 'Less than' },
  { label: 'Greater Than or Equals', value: 'Greater than or Equals' },
  { label: 'Less Than or Equals', value: 'Less than or Equals' },
  { label: 'Equals', value: 'Equals' }
];

const ENTITY_FILTER = [
  { label: 'Inwards', value: 'inwards' },
  { label: 'Outwards', value: 'outwards' },
  { label: 'Opening Stock', value: 'Opening Stock' },
  { label: 'Closing Stock', value: 'Closing Stock' }
];

const VALUE_FILTER = [
  { label: 'Quantity', value: 'quantity' },
  { label: 'Value', value: 'Value' }
];

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
  public groupStockReport$: Observable<GroupStockReportResponse>;
  public sub: Subscription;
  public groupUniqueName: string;
  public stockUniqueName: string;
  public GroupStockReportRequest: GroupStockReportRequest;
  public showFromDatePicker: boolean;
  public showToDatePicker: boolean;
  public toDate: string;
  public fromDate: string;
  public moment = moment;
  public activeGroupName: string;
  public stockList$: Observable<IOption[]>;
  public comparisonFilterDropDown$: Observable<IOption[]>;
  public entityFilterDropDown$: Observable<IOption[]>;
  public valueFilterDropDown$: Observable<IOption[]>;
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

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private sideBarAction: SidebarAction,
    private stockReportActions: StockReportActions,
    private router: Router,
    private fb: FormBuilder,
    private inventoryAction: InventoryAction) {
    this.groupStockReport$ = this.store.select(p => p.inventory.groupStockReport).takeUntil(this.destroyed$);
    this.GroupStockReportRequest = new GroupStockReportRequest();
    this.activeGroup$ = this.store.select(state => state.inventory.activeGroup).takeUntil(this.destroyed$);
    this.activeGroup$.takeUntil(this.destroyed$).subscribe(a => {
      if (a) {
        const stockGroup = _.cloneDeep(a);
        const stockList = [];
        this.activeGroupName = stockGroup.name;
        stockGroup.stocks.forEach((stock) => {
          stockList.push({ label: `${stock.name} (${stock.uniqueName})`, value: stock.uniqueName });
        });
        this.stockList$ = Observable.of(stockList);
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
          this.GroupStockReportRequest.count = 10;
          this.fromDate = moment().add(-1, 'month').format('DD-MM-YYYY');
          this.toDate = moment().format('DD-MM-YYYY');
          this.GroupStockReportRequest.from = moment().add(-1, 'month').format('DD-MM-YYYY');
          this.GroupStockReportRequest.to = moment().format('DD-MM-YYYY');
          this.GroupStockReportRequest.page = 1;
          this.GroupStockReportRequest.stockGroupUniqueName = this.groupUniqueName;
          this.store.dispatch(this.stockReportActions.GetGroupStocksReport(_.cloneDeep(this.GroupStockReportRequest)));
          this.store.dispatch(this.sideBarAction.GetInventoryGroup(this.groupUniqueName));
        }
      }
    });

    this.comparisonFilterDropDown$ = Observable.of(COMPARISON_FILTER);
    this.entityFilterDropDown$ = Observable.of(ENTITY_FILTER);
    this.valueFilterDropDown$ = Observable.of(VALUE_FILTER);
  }

  public getGroupReport(resetPage: boolean) {
    this.GroupStockReportRequest.from = this.fromDate || null;
    this.GroupStockReportRequest.to = this.toDate || null;
    if (resetPage) {
      this.GroupStockReportRequest.page = 1;
    }
    this.store.dispatch(this.stockReportActions.GetGroupStocksReport(_.cloneDeep(this.GroupStockReportRequest)));
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
    this.GroupStockReportRequest.page++;
    this.getGroupReport(false);
  }

  public prevPage() {
    this.GroupStockReportRequest.page--;
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
    // this.GroupStockReportRequest.page = 0;
    this.getGroupReport(true);
  }

  public filterFormData() {
    this.getGroupReport(true);
  }
}

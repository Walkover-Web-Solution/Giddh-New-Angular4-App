import { base64ToBlob } from './../../../shared/helpers/helperFunctions';
import { ToasterService } from './../../../services/toaster.service';
import { InventoryService } from '../../../services/inventory.service';
import { take, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { StockReportRequest, StockReportResponse, AdvanceFilterOptions } from '../../../models/api-models/Inventory';
import { StockReportActions } from '../../../actions/inventory/stocks-report.actions';
import { AppState } from '../../../store';
import { saveAs } from 'file-saver';
import { Store } from '@ngrx/store';

import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of as observableOf, ReplaySubject, Subscription } from 'rxjs';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment/moment';
import * as _ from '../../../lodash-optimized';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CompanyResponse } from '../../../models/api-models/Company';
import { createSelector } from 'reselect';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { ModalDirective, PaginationComponent } from 'ngx-bootstrap';
import { InvViewService } from '../../inv.view.service';

@Component({
  selector: 'invetory-stock-report',  // <home></home>
  templateUrl: './inventory.stockreport.component.html',
  styleUrls: ['./inventory.stockreport.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0);'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0);'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class InventoryStockReportComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('advanceSearchModel') public advanceSearchModel: ModalDirective;
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
  public activeStockName = null;
  public asideMenuState: string = 'out';
  public isWarehouse: boolean = false;
  public selectedEntity: string = 'all';
  public selectedTransactionType: string = 'all';
  public entities$: Observable<CompanyResponse[]>;
  public showAdvanceSearchIcon: boolean = false;
  public accountUniqueNameInput: FormControl = new FormControl();
  public showAccountSearch: boolean = false;
  public entityAndInventoryTypeForm: FormGroup;
  // modal advance search
  public advanceSearchForm: FormGroup;
  public filterCategory: string = null;
  public filterCategoryType: string = null;
  public filterValueCondition: string = null;
  public isFilterCorrect: boolean = false;
  public stockUniqueNameFromURL: string = null;

  public transactionTypes: any[] = [
    { uniqueName: 'purchase_and_sales', name: 'Purchase & Sales' },
    { uniqueName: 'transfer', name: 'Transfer' },
    { uniqueName: 'all', name: 'All Transactions' },
  ];

  public voucherTypes: any[] = [{"value":"SALES","label":"Sales"},{"value":"PURCHASE","label":"Purchse"},{"value":"MANUFACTURING","label":"Manufacturing"},{"value":"TRANSFER","label":"Transfer"},{"value":"JOURNAL_VOUCHER","label":"Journal Voucher"},{"value":"CREDIT_NOTE","label":"Credit Note"},{"value":"DEBIT_NOTE","label":"Debit Note"}];

  public datePickerOptions: any = {
    autoApply: true,
    locale: {
      format: 'D-MMM-YY',
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
  public stockReport: StockReportResponse;
  public universalDate$: Observable<any>;
  public selectedCompany$: Observable<any>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction,
    private stockReportActions: StockReportActions, private router: Router,
    private _toasty: ToasterService,
    private inventoryService: InventoryService, private fb: FormBuilder, private inventoryAction: InventoryAction,
    private settingsBranchActions: SettingsBranchActions,
    private invViewService: InvViewService
  ) {
    this.stockReport$ = this.store.select(p => p.inventory.stockReport).pipe(takeUntil(this.destroyed$));
    this.stockReportRequest = new StockReportRequest();
    this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
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
            this.activeStockName = key.stocks[index].name;
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
    this.stockUniqueNameFromURL = document.location.pathname.split('/')[document.location.pathname.split('/').length - 1]
    if (this.stockUniqueNameFromURL) {
      this.groupUniqueName = document.location.pathname.split('/')[document.location.pathname.split('/').length - 3]
      this.stockUniqueName = this.stockUniqueNameFromURL;
      this.initReport();
    }

    this.stockReportRequest.voucherTypes = []; // initialization for voucher type array
    // get view from sidebar while clicking on group/stock
    this.invViewService.getActiveView().subscribe(v => {
      this.groupUniqueName = v.groupUniqueName;
      this.stockUniqueName = v.stockUniqueName;
      this.selectedEntity = 'allEntity';
      this.selectedTransactionType = 'all';
      if (this.groupUniqueName) {
        this.store.dispatch(this.sideBarAction.SetActiveStock(this.stockUniqueName));
        if (this.groupUniqueName && this.stockUniqueName) {
          this.store.select(p => {
            return this.findStockNameFromId(p.inventory.groupsWithStocks, this.stockUniqueName);
          }).pipe(take(1)).subscribe(p => this.activeStock$ = p);
          this.initReport();
        }
      }
    });


    // this.sub = this.route.params.subscribe(params => {
    //   this.groupUniqueName = params['groupUniqueName'];
    //   this.stockUniqueName = params['stockUniqueName'];
    //   this.selectedEntity = 'allEntity';
    //   this.selectedTransactionType = 'all';
    //   if (this.groupUniqueName) {
    //     this.store.dispatch(this.sideBarAction.SetActiveStock(this.stockUniqueName));
    //     if (this.groupUniqueName && this.stockUniqueName) {
    //       this.store.select(p => {
    //         return this.findStockNameFromId(p.inventory.groupsWithStocks, this.stockUniqueName);
    //       }).pipe(take(1)).subscribe(p => this.activeStock$ = p);
    //       this.fromDate = moment().add(-1, 'month').format('DD-MM-YYYY');
    //       this.toDate = moment().format('DD-MM-YYYY');
    //       this.stockReportRequest.from = moment().add(-1, 'month').format('DD-MM-YYYY');
    //       this.stockReportRequest.to = moment().format('DD-MM-YYYY');
    //       this.stockReportRequest.stockGroupUniqueName = this.groupUniqueName;
    //       this.stockReportRequest.stockUniqueName = this.stockUniqueName;
    //       this.stockReportRequest.transactionType = 'all';
    //       this.store.dispatch(this.stockReportActions.GetStocksReport(_.cloneDeep(this.stockReportRequest)));
    //       this.getAllBranch();
    //     }
    //   }
    // });

    this.stockReport$.subscribe(res => {
      this.stockReport = res;
    });

    this.universalDate$.subscribe(a => {
      if (a) {
        this.datePickerOptions.startDate = a[0];
        this.datePickerOptions.endDate = a[1];
        this.fromDate = moment(a[0]).format('DD-MM-YYYY');
        this.toDate = moment(a[1]).format('DD-MM-YYYY');
        this.getStockReport(true);
      }
    });
    this.selectedCompany$ = this.store.select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
      if (!companies) {
        return;
      }
      let selectedCmp = companies.find(cmp => {
        if (cmp && cmp.uniqueName) {
          return cmp.uniqueName === uniqueName;
        } else {
          return false;
        }
      });
      if (!selectedCmp) {
        return;
      }
      if (selectedCmp) {
        console.log(selectedCmp);
      }
      return selectedCmp;
    })).pipe(takeUntil(this.destroyed$));
    this.selectedCompany$.subscribe();

    this.accountUniqueNameInput.valueChanges.pipe(
      debounceTime(700),
      distinctUntilChanged(),
      takeUntil(this.destroyed$)
    ).subscribe(s => {
      this.stockReportRequest.accountName = s;
      this.getStockReport(true);
      if (s === '') {
        this.showAccountSearch = false;
      }
    });
    this.entityAndInventoryTypeForm = this.fb.group({
      selectedEntity: ['allEntity'],
      selectedTransactionType: ['all']
    });
    // Advance search modal
    this.advanceSearchForm = this.fb.group({
      filterAmount: ['', [Validators.pattern('[-0-9]+([,.][0-9]+)?$')]]
    });
    this.resetFilter();
  }

  public initReport() {
    this.fromDate = moment().add(-1, 'month').format('DD-MM-YYYY');
    this.toDate = moment().format('DD-MM-YYYY');
    this.stockReportRequest.from = moment().add(-1, 'month').format('DD-MM-YYYY');
    this.stockReportRequest.to = moment().format('DD-MM-YYYY');
    this.stockReportRequest.stockGroupUniqueName = this.groupUniqueName;
    this.stockReportRequest.stockUniqueName = this.stockUniqueName;
    this.stockReportRequest.transactionType = 'all';
    this.store.dispatch(this.stockReportActions.GetStocksReport(_.cloneDeep(this.stockReportRequest)));
    
  }

  public getStockReport(resetPage: boolean) {
    this.stockReportRequest.from = this.fromDate || null;
    this.stockReportRequest.to = this.toDate || null;
    if (resetPage) {
      this.stockReportRequest.page = 1;
    }
    this.store.dispatch(this.stockReportActions.GetStocksReport(_.cloneDeep(this.stockReportRequest)));
  }

  /**
   * getAllBranch
   */
  public getAllBranch() {
    this.store.dispatch(this.settingsBranchActions.GetALLBranches());
    this.store.select(createSelector([(state: AppState) => state.settings.branches], (entities) => {
      if (entities) {
        if (entities.results.length) {

          this.entities$ = observableOf(_.orderBy(entities.results, 'name'));
        } else if (entities.results.length === 0) {
          this.entities$ = observableOf(null);
        }
      }
    })).pipe(takeUntil(this.destroyed$)).subscribe();
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public ngAfterViewInit() {
    this.store.select(p => p.inventory.activeGroup).pipe(take(1)).subscribe((a) => {
      if (!a) {
        // this.store.dispatch(this.sideBarAction.GetInventoryGroup(this.groupUniqueName));
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
    this.getStockReport(true);
  }

  /**
   * setInventoryAsideState
   */
  public setInventoryAsideState(isOpen, isGroup, isUpdate) {
    this.store.dispatch(this.inventoryAction.ManageInventoryAside({ isOpen, isGroup, isUpdate }));
  }

  public pageChanged(event: any): void {
    this.stockReportRequest.page = event.page;
    this.getStockReport(false);
  }

  public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {
    if (this.stockReportRequest.sort !== type || this.stockReportRequest.sortBy !== columnName) {
      this.stockReportRequest.sort = type;
      this.stockReportRequest.sortBy = columnName;
      this.getStockReport(true);
    }
  }

  public filterByCheck(type: string, event: boolean) {
    if (event && type) {
      this.stockReportRequest.voucherTypes.push(type);
    } else {
      let index = this.stockReportRequest.voucherTypes.indexOf(type);
      if (index !== -1) { this.stockReportRequest.voucherTypes.splice(index, 1); }
    }
    this.getStockReport(true);
  }

  public clickedOutside(event, el, fieldName: string) {
    if (fieldName === 'account') {
      if (this.accountUniqueNameInput.value !== null && this.accountUniqueNameInput.value !== '') {
        return;
      }
    }
    if (this.childOf(event.target, el)) {
      return;
    } else {
      if (fieldName === 'account') {
        this.showAccountSearch = false;
      }
    }
  }
  /* tslint:disable */
  public childOf(c, p) {
    while ((c = c.parentNode) && c !== p) {
    }
    return !!c;
  }
  public downloadStockReports(type: string) {
    this.stockReportRequest.reportDownloadType = type;
    this.inventoryService.DownloadStockReport(this.stockReportRequest, this.stockUniqueName, this.groupUniqueName)
      .subscribe(d => {
        if (d.status === 'success') {
          if (type == 'xls') {
            let blob = base64ToBlob(d.body, 'application/xls', 512);
            return saveAs(blob, `${this.stockUniqueName}.xlsx`);
          } else {
            let blob = base64ToBlob(d.body, 'application/csv', 512);
            return saveAs(blob, `${this.stockUniqueName}.csv`);
          }
        } else {
          this._toasty.errorToast(d.message);
        }
      });
  }

  // region asidemenu toggle
  public toggleBodyClass() {
    if (this.asideMenuState === 'in') {
      document.querySelector('body').classList.add('fixed');
    } else {
      document.querySelector('body').classList.remove('fixed');
    }
  }

  public toggleAsidePane(event?): void {
    if (event) {
      event.preventDefault();
    }
    this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
    this.toggleBodyClass();
  }
  // From Entity Dropdown
  public selectEntity(entity: any) {
    this.stockReportRequest.branchDetails = entity;
    if (entity === 'warehouse') { // enable after new api for this 'inventoryEntity' key
      this.isWarehouse = true;
    } else {
      this.isWarehouse = false;
    }
    this.getStockReport(true);
  }
  // From inventory type Dropdown
  public selectTransactionType(inventoryType) {
    this.stockReportRequest.transactionType = inventoryType;
    this.getStockReport(true);
  }

  //******* Advance search modal *******//
  public resetFilter() {
    this.isFilterCorrect = false;
    this.stockReportRequest.sort = null;
    this.stockReportRequest.sortBy = null;
    this.stockReportRequest.accountName = null;
    this.showAccountSearch = false;
    this.advanceSearchForm.controls['filterAmount'].setValue(null);
    this.getStockReport(true);
  }
  public onOpenAdvanceSearch() {
    this.advanceSearchModel.show();
  }
  public advanceSearchAction(type: string) {
    if (type === 'cancel') {
      this.resetFilter();
      this.advanceSearchModel.hide();
      return;
    }
    this.advanceSearchModel.hide();
    if (this.isFilterCorrect) {
      this.getStockReport(true);
    }
  }
  /**
   * onDDElementSelect
   */

  public onDDElementSelect(type: string, data: string) {
    switch (type) {
      case 'filterCategory':  // inwards/outwards/opening/closing
        this.filterCategory = data;
        break;
      case 'filterCategoryType': // value/quantity
        this.filterCategoryType = data;
        break;
      case 'filterValueCondition': // =, <, >, !
        this.filterValueCondition = data;
        break;
    }
    this.mapAdvFilters();
  }

  public mapAdvFilters() {
    if (this.filterCategoryType && this.filterCategory) { // creating value for key parma like "qty_cr", "amt_cr"
      this.stockReportRequest.param = this.filterCategoryType + '_' + this.filterCategory;
    }
    if (this.filterValueCondition) { // expressions less_than, greator_than etc
      this.stockReportRequest.expression = this.filterValueCondition;
    }
    if (this.advanceSearchForm.controls['filterAmount'].value) {
      this.stockReportRequest.val = parseFloat(this.advanceSearchForm.controls['filterAmount'].value);
    } else {
      this.stockReportRequest.val = null;
    }
    if (this.stockReportRequest.param && this.stockReportRequest.expression && this.stockReportRequest.val) {
      this.isFilterCorrect = true;
    } else {
      this.isFilterCorrect = false;
    }
  }
  //************************************//
}

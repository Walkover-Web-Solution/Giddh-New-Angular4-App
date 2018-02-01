import { SearchActions } from './../../actions/search.actions';
import { VsForDirective } from './../../theme/ng2-vs-for/ng2-vs-for';
import { ToasterService } from './../../services/toaster.service';
import { KeyboardService } from './../keyboard.service';
import { AccountService } from './../../services/account.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Component, OnInit, ViewChild, OnDestroy, ViewChildren, QueryList, transition, ElementRef, ChangeDetectionStrategy, OnChanges, Input, Output, EventEmitter, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { createSelector } from 'reselect';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as moment from 'moment';
import { IFlattenGroupsAccountsDetail, IFlattenGroupsAccountItem, IFlattenGroupsAccountsDetailItem } from 'app/models/interfaces/flattenGroupsAccountsDetail.interface';
import { FlyAccountsActions } from 'app/actions/fly-accounts.actions';
import { IOption } from 'app/theme/ng-virtual-select/sh-options.interface';
import { SalesActions } from 'app/actions/sales/sales.action';
import { TallyModuleService } from 'app/accounting/tally-service';

@Component({
  selector: 'accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AccountListComponent implements OnInit, OnDestroy, OnChanges {

  @Input() public search: string;
  @Input() public activeIdx: string = null;
  @Output() public openAddAndManage: EventEmitter<boolean> = new EventEmitter();
  @Output() public onSelectItem: EventEmitter<boolean> = new EventEmitter();
  @Input() public grpUniqueName: string;
  @Input() public filterByGrp: boolean = false;
  @Input() public showStockItem: boolean;
  @Input() public showAccountList: boolean;
  @Input() public voucher: string;
  @Input() public type: 'account' | 'stock';

  public accounts: any[];
  public isFlyAccountInProcess$: Observable<boolean>;
  public companyList$: Observable<any>;
  public noResult: boolean = false;
  public activeAccIdx: string = '';
  public grpFlattenAccounts: any[] = [];
  public flattenAccounts: any[] = [];
  public showStockList: boolean = false;
  public stockList: any[] = [];

  private groupUniqueName: string;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private _flyAccountActions: FlyAccountsActions,
    private cd: ChangeDetectorRef,
    private _accountService: AccountService,
    private _salesActions: SalesActions,
    private _tallyService: TallyModuleService) {

    this.isFlyAccountInProcess$ = this.store.select(s => s.flyAccounts.isFlyAccountInProcess).takeUntil(this.destroyed$);

    this.companyList$ = this.store.select(state => {
      return state.session.companies;
    }).takeUntil(this.destroyed$);

    // this._tallyService.selectedPageInfo.subscribe((info) => {
    //   if (info) {
    //     this.groupUniqueName = info.uniqueName;
    //   }
    // });

  }

  public ngOnChanges(s: SimpleChanges) {

    if (s.search && s.search.currentValue !== s.search.previousValue && s.search.currentValue.length >= 3 ) {
      this.searchAccount(s.search.currentValue);
    } else if ((s.search && !s.search.currentValue) || (s.filterByGrp && !s.filterByGrp.currentValue) && this.flattenAccounts.length){
      this.renderAccountList(this.flattenAccounts);
    }

    if (s.activeIdx) {
      this.activeAccIdx = s.activeIdx.currentValue;
    }

    if (s.grpUniqueName && s.grpUniqueName.currentValue) {
      let groupUniqueNames = s.grpUniqueName.currentValue;
      this.getFlattenGrpofAccounts(groupUniqueNames);
    }

    if (s.showStockItem && s.showStockItem.currentValue) {
      this.showStockList = true;
    }

    if (s.voucher && s.voucher.currentValue) {
      this.getFlattenGrpofAccounts(s.voucher.currentValue);
    }
  }

  public ngOnInit() {
  //  this.store.select(p => p.session.companyUniqueName).take(1).subscribe(a => {
  //     if (a && a !== '') {
  //       this._accountService.GetFlattenAccounts('', '', '60').takeUntil(this.destroyed$).subscribe(data => {
  //       if (data.status === 'success') {
  //         this.renderAccountList(data.body.results);
  //         this.flattenAccounts = data.body.results;
  //       }
  //     });
  //     }
  //   });
  this._tallyService.filteredAccounts.subscribe((accounts) => {
    if (accounts) {
      this.renderAccountList(accounts);
      this.flattenAccounts = accounts;
    }
  });

  }

  public searchAccount(s: string) {
    this._accountService.GetFlattenAccounts(s, '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.body.count) {
        this.renderAccountList(data.body.results);
        this.noResult = false;
      } else {
        this.noResult = true;
      }
    });
  }

  public getSize(item, index) {
    return 30;
  }

  public ngOnDestroy() {
    // this.destroyed$.next(true);
    // this.destroyed$.complete();
  }

  /**
   * renderAccontList
   */
  public renderAccountList(data) {
    if (data && data.length) {
      let accounts: any[] = [];
      data.map(d => {
        accounts.push(d);
      });
      this.accounts = accounts;
    }
  }

  /**
   * getFlattenGrpofAccounts
   */
  public getFlattenGrpofAccounts(grpUniqueName, q?: string) {
    this._accountService.GetFlatternAccountsOfGroup({ groupUniqueNames: [grpUniqueName] }, '', q).takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        this.renderAccountList(data.body.results);
        this.sortStockItems(data.body.results);
      } else {
        this.noResult = true;
      }
    });
  }

  /**
   * sortStockItems
   */
  public sortStockItems(ItemArr) {
    let stockAccountArr = [];
    _.forEach(ItemArr, function(obj) {
      if (obj.stocks) {
        _.forEach(obj.stocks, function(stock) {
          stockAccountArr.push(stock);
        });
      }
    });
    console.log(stockAccountArr, 'stocks');
    this.stockList = stockAccountArr;
  }

}

import { VirtualScrollComponent } from './../../theme/ng-virtual-select/virtual-scroll';
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
  @Input() public parentGrpUnqName: string;
  @Input() public filterByGrp: boolean = false;
  @Input() public showStockItem: boolean;
  @Input() public showAccountList: boolean;
  @Input() public voucher: string;
  @Input() public type: 'account' | 'stock';
  @Input() public accountUnqName: string;
  @Input() public arrowKeyInfo: string;

  @ViewChild('accountEleList') public accountEleList: ElementRef;
  // @ViewChild(VirtualScrollComponent) public virtualScrollElm: VirtualScrollComponent;
  @ViewChildren(VsForDirective) public columnView: QueryList<VsForDirective>;

  public accounts: any[];
  public isFlyAccountInProcess$: Observable<boolean>;
  public companyList$: Observable<any>;
  public noResult: boolean = false;
  public activeAccIdx: string = '';
  public grpFlattenAccounts: any[] = [];
  public flattenAccounts: any[] = [];
  public showStockList: boolean = false;
  public stockList: any[] = [];
  public isAccFocus = null;

  private groupUniqueName: string;
  private activeIndex: number = 0;
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
    } else if (s.search && !s.search.currentValue && !s.search.previousValue) {
      this.renderAccountList(this.flattenAccounts);
    }

    if (s.activeIdx) {
      this.activeAccIdx = s.activeIdx.currentValue;
    }

    if (s.parentGrpUnqName && s.parentGrpUnqName.currentValue) {
      let groupUniqueNames = s.parentGrpUnqName.currentValue;
      let accUnqName = s.accountUnqName.currentValue || null;
      this.getFlattenGrpofAccounts(groupUniqueNames, accUnqName);
    }

    if (s.showStockItem && s.showStockItem.currentValue) {
      this.showStockList = true;
    }

    if (s.voucher && s.voucher.currentValue) {
      this.getFlattenGrpofAccounts(s.voucher.currentValue);
    }

    if (s.arrowKeyInfo && s.arrowKeyInfo.currentValue) {
      // if (!this.isAccFocus && this.isAccFocus !== 0 ) {

      // }
      if (this.accountEleList) {
        setTimeout(() => {
          // console.log(this.isAccFocus);
        this.accountEleList.nativeElement.children[1].focus();
        }, 100);
      } else if (this.isAccFocus > -1) {
        // console.log(this.isAccFocus);
        this.accountEleList.nativeElement.children[this.isAccFocus].focus();
      }
    }
/* if (s.arrowKeyInfo && s.arrowKeyInfo.currentValue) {
      console.log(this.accountEleList.nativeElement);
      if (s.arrowKeyInfo.currentValue.key === 40) {

        this.columnView.first.scrollToElement(this.activeIndex);
        this.nextActiveMatch();

      } else if (s.arrowKeyInfo.currentValue.key === 38) {
        this.prevActiveMatch();
        this.columnView.first.scrollToElement(this.activeIndex);
      } else if (s.arrowKeyInfo.currentValue.key === 13) {
        this.onSelectItem.emit(this.accounts[this.activeIndex]);
      } else {
        this.activeIndex = 0; // on blur
      }
    } */
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
      // console.log('accounts are :', accounts);
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
    this.isAccFocus = null;
    if (data && data.length) {
      let accounts: any[] = [];
      data.map(d => {
        accounts.push(d);
      });
      // console.log(accounts);
      this.accounts = accounts;
    }
  }

  /**
   * getFlattenGrpofAccounts
   */
  public getFlattenGrpofAccounts(parentGrpUnqName, q?: string) {
    this._accountService.GetFlatternAccountsOfGroup({ groupUniqueNames: [parentGrpUnqName] }, '', q).takeUntil(this.destroyed$).subscribe(data => {
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
    _.forEach(ItemArr, function(obj: any) {
      if (obj.stocks) {
        _.forEach(obj.stocks, function(stock: any) {
          stock.accountStockDetails.name = obj.name;
          stockAccountArr.push(stock);
        });
      }
    });
    // console.log(stockAccountArr, 'stocks');
    this.stockList = stockAccountArr;
  }

  public nextActiveMatch() {
    this.activeIndex = this.activeIndex < this.accounts.length - 1 ? ++this.activeIndex : this.activeIndex;
  }
  public prevActiveMatch() {
    this.activeIndex = this.activeIndex > 0 ? --this.activeIndex : 0;
  }

  /**
   * onArrowDown
   */
  public onArrowDown(item) {
    item.nextElementSibling.focus();
  }

  /**
   * onArrowDown
   */
  public onArrowUp(item) {
    item.previousElementSibling.focus();
  }
}

import { VsForDirective } from './../../theme/ng2-vs-for/ng2-vs-for';
import { ToasterService } from './../../services/toaster.service';
import { KeyboardService } from './../keyboard.service';
import { AccountService } from './../../services/account.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Component, OnInit, ViewChild, OnDestroy, ViewChildren, QueryList, transition, ElementRef, AfterViewInit, ChangeDetectionStrategy, OnChanges, Input, Output, EventEmitter, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { createSelector } from 'reselect';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as moment from 'moment';
import { IFlattenGroupsAccountsDetail, IFlattenGroupsAccountItem, IFlattenGroupsAccountsDetailItem } from 'app/models/interfaces/flattenGroupsAccountsDetail.interface';
import { FlyAccountsActions } from 'app/actions/fly-accounts.actions';
import { IOption } from 'app/theme/ng-virtual-select/sh-options.interface';

@Component({
  selector: 'accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AccountListComponent implements OnInit, OnDestroy, OnChanges {


  @Input() public flyAccounts: boolean;
  @Input() public search: string;
  @Input() public grpFilter: string = '';
  @Input() public isOpen: boolean = false;
  @Input() public activeIdx: string = null;
  @Output() public openAddAndManage: EventEmitter<boolean> = new EventEmitter();
  @Output() public onSelectItem: EventEmitter<boolean> = new EventEmitter();

  public Items: any[];
  public isFlyAccountInProcess$: Observable<boolean>;
  public companyList$: Observable<any>;
  public showAccountList: boolean = true;
  public noResult: boolean = false;
  public activeAccIdx:string = '';

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _flyAccountActions: FlyAccountsActions, private cd: ChangeDetectorRef, private _accountService: AccountService) {
  
    this.isFlyAccountInProcess$ = this.store.select(s => s.flyAccounts.isFlyAccountInProcess).takeUntil(this.destroyed$);

    this.companyList$ = this.store.select(state => {
      return state.session.companies;
    }).takeUntil(this.destroyed$);
    
  }

  public ngOnChanges(s: SimpleChanges) {
    if(s.isOpen) {
      this.showAccountList = !this.showAccountList;
    }
    if (s.search) {
      this.searchAccount(s.search.currentValue)
    }
    if (s.activeIdx) {
      this.activeAccIdx = s.activeIdx.currentValue;
    }

  }

  public ngOnInit() {
   this.store.select(p => p.session.companyUniqueName).take(1).subscribe(a => {
      if (a && a !== '') {
        this._accountService.GetFlattenAccounts('', '', '60').takeUntil(this.destroyed$).subscribe(data => {
        if (data.status === 'success') {
          let accounts: any[] = [];
          data.body.results.map(d => {
            accounts.push(d);
          });
          this.Items = accounts;
        }
      });
      }
    });
  }

  public ngAfterViewInit() {
 
  }

  public searchAccount(s: string) {
    let accounts: any[] = [];
    this._accountService.GetFlattenAccounts(s, '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.body.count) {
        data.body.results.map(d => {
          accounts.push(d);
        });
        this.noResult = false;
      } else {
        this.noResult = true;
      }
      this.Items = accounts;
    });
  }


  public getSize(item, index) {
    return 30;
  }


  public ngOnDestroy() {
    // this.destroyed$.next(true);
    // this.destroyed$.complete();
  }

}


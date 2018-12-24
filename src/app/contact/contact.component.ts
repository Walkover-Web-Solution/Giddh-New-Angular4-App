import { Observable, of as observableOf, ReplaySubject, Subject } from 'rxjs';

import { take, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Component, ComponentFactoryResolver, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { ToasterService } from '../services/toaster.service';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';
import { Router } from '@angular/router';
import { IOption } from 'app/theme/ng-virtual-select/sh-options.interface';
import { DashboardService } from '../services/dashboard.service';
import { ContactService } from '../services/contact.service';
import { BsDropdownDirective, ModalDirective, PaginationComponent } from 'ngx-bootstrap';
import { CashfreeClass } from '../models/api-models/SettingsIntegraion';
import { IFlattenAccountsResultItem } from '../models/interfaces/flattenAccountsResultItem.interface';
import { SettingsIntegrationActions } from '../actions/settings/settings.integration.action';
import { createSelector } from 'reselect';
import * as _ from 'lodash';
import { AgingDropDownoptions, DueAmountReportQueryRequest, DueAmountReportRequest, DueAmountReportResponse } from '../models/api-models/Contact';
import { AgingReportActions } from '../actions/aging-report.actions';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

const CustomerType = [
  {label: 'Customer', value: 'customer'},
  {label: 'Vendor', value: 'vendor'}
];

export interface PayNowRequest {
  accountUniqueName: string;
  amount: number;
  description: string;
}

@Component({
  selector: 'contact-detail',
  templateUrl: './contact.component.html',
  styles: [`
    .dropdown-menu > li > a {
      padding: 2px 10px;
    }

    .dis {
      display: flex;
    }

    .pd1 {
      padding: 5px;
    }
  `],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})

export class ContactComponent implements OnInit, OnDestroy, OnChanges {
  public CustomerType = CustomerType;
  public flattenAccounts: any = [];
  public sundryDebtorsAccountsBackup: any = {};
  public sundryDebtorsAccountsForAgingReport: IOption[] = [];
  public sundryDebtorsAccounts$: Observable<any>;
  public sundryCreditorsAccountsBackup: any = {};
  public sundryCreditorsAccounts$: Observable<any>;
  public activeTab: 'customer' | 'aging' | 'vendor' = 'customer';
  public accountAsideMenuState: string = 'out';
  public asideMenuStateForProductService: string = 'out';
  public selectedAccForPayment: any;
  public dueAmountReportRequest: DueAmountReportQueryRequest;
  public selectedGroupForCreateAcc: 'sundrydebtors' | 'sundrycreditors' = 'sundrydebtors';
  public cashFreeAvailableBalance: number;
  public payoutForm: CashfreeClass;
  public bankAccounts$: Observable<IOption[]>;
  public totalDueOptions: IOption[] = [{label: 'greater than', value: '0'}, {label: 'less than', value: '1'}, {label: 'equal to', value: '2'}];
  public flattenAccountsStream$: Observable<IFlattenAccountsResultItem[]>;
  public payoutObj: CashfreeClass = new CashfreeClass();
  public dueAmountReportData$: Observable<DueAmountReportResponse>;
  public showFieldFilter = {
    name: true,
    due_amount: true,
    email: true,
    mobile: true,
    closingBalance: true,
    state: true,
    gstin: true,
    comment: true
  };
  public updateCommentIdx: number = null;
  public searchStr$ = new Subject<string>();
  public searchStr: string = '';

  @ViewChild('payNowModal') public payNowModal: ModalDirective;
  @ViewChild('filterDropDownList') public filterDropDownList: BsDropdownDirective;
  @ViewChild('paginationChild') public paginationChild: ElementViewContainerRef;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private createAccountIsSuccess$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private _toasty: ToasterService,
    private router: Router,
    private _dashboardService: DashboardService,
    private _contactService: ContactService,
    private settingsIntegrationActions: SettingsIntegrationActions,
    private _companyActions: CompanyActions,
    private componentFactoryResolver: ComponentFactoryResolver,
    private _route: ActivatedRoute) {

    this.dueAmountReportRequest = new DueAmountReportQueryRequest();
    this.createAccountIsSuccess$ = this.store.select(s => s.groupwithaccounts.createAccountIsSuccess).pipe(takeUntil(this.destroyed$));

    this.flattenAccountsStream$ = this.store.select(createSelector([(s: AppState) => s.general.flattenAccounts], (s) => {
      // console.log('flattenAccountsStream$');
      return s;
    })).pipe(takeUntil(this.destroyed$));
    // this.flattenAccountsStream$ = this.store.select(s => s.general.flattenAccounts).takeUntil(this.destroyed$);
    this.store.select(s => s.agingreport.data).pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data && data.results) {
        this.dueAmountReportRequest.page = data.page;
        this.loadPaginationComponent(data);
      }
      this.dueAmountReportData$ = observableOf(data);
    });

    this._route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
      if (val && val.tab && val.tabIndex) {
        // this.selectTab(val.tab);
        if (val.tab === 'customer') {
          this.setActiveTab('customer', 'sundrydebtors');
        } else {
          this.setActiveTab('vendor', 'sundrycreditors');
        }
      }
    });
  }

  public ngOnInit() {

    // this.filterDropDownList.placement = 'left';

    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'contact';

    this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));

    this.getAccounts('sundrydebtors', null, null, 'true', 20 , '');

    this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
      if (yes) {
        this.toggleAccountAsidePane();
        this.getAccounts('sundrydebtors', null, null, 'true', 20 , '');
      }
    });

    this.getCashFreeBalance();

    this.flattenAccountsStream$.subscribe(data => {
      // console.log('flattenAccountsStream', data);
      if (data) {
        let accounts: IOption[] = [];
        let bankAccounts: IOption[] = [];
        _.forEach(data, (item) => {
          accounts.push({label: item.name, value: item.uniqueName});
          let findBankIndx = item.parentGroups.findIndex((grp) => grp.uniqueName === 'bankaccounts');
          if (findBankIndx !== -1) {
            bankAccounts.push({label: item.name, value: item.uniqueName});
          }
        });
        this.bankAccounts$ = observableOf(accounts);
      }
    });

    this.searchStr$.pipe(
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe((term: any) => {
        if (this.activeTab === 'customer') {
          this.getAccounts('sundrydebtors', null, null, 'true', 20, term);
        } else {
          this.getAccounts('sundrycreditors', null, null, 'true', 20 , term);
        }
    });
  }

  public ngOnChanges(c: SimpleChanges) {
    //
  }

  public setActiveTab(tabName: 'customer' | 'aging' | 'vendor', type: string) {
    this.activeTab = tabName;
    if (tabName !== 'aging') {
      this.getAccounts(type, null, null, 'true', 20 , '');
    } else {
      this.getSundrydebtorsAccounts();
      // this.go();
    }
  }

  // Commented as searching using API
  // public search(ev: any) {
  //   let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
  //   if (this.activeTab === 'customer') {
  //     this.sundryDebtorsAccounts$ = observableOf(this.sundryDebtorsAccountsBackup.results.filter((acc) => acc.name.toLowerCase().includes(searchStr)));
  //   } else {
  //     this.sundryCreditorsAccounts$ = observableOf(this.sundryCreditorsAccountsBackup.results.filter((acc) => acc.name.toLowerCase().includes(searchStr)));
  //   }
  // }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public openAddAndManage(openFor: 'customer' | 'vendor') {
    this.selectedGroupForCreateAcc = openFor === 'customer' ? 'sundrydebtors' : 'sundrycreditors';
    this.toggleAccountAsidePane();
  }

  public toggleAccountAsidePane(event?): void {
    if (event) {
      event.preventDefault();
    }
    this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
    this.toggleBodyClass();
  }

  public toggleBodyClass() {
    if (this.accountAsideMenuState === 'in') {
      document.querySelector('body').classList.add('fixed');
    } else {
      document.querySelector('body').classList.remove('fixed');
    }
  }

  public payNow(acc: string) {
    this.selectedAccForPayment = acc;
    this.payNowModal.show();
  }

  public onPaymentModalCancel() {
    this.payNowModal.hide();
  }

  public onConfirmation(amountToPay: number) {
    let payNowData: PayNowRequest = {
      accountUniqueName: this.selectedAccForPayment.uniqueName,
      amount: amountToPay,
      description: ''
    };

    this._contactService.payNow(payNowData).subscribe((res) => {
      if (res.status === 'success') {
        this._toasty.successToast('Payment done successfully with reference id: ' + res.body.referenceId);
      } else {
        this._toasty.errorToast(res.message, res.code);
      }
    });
  }

  public selectCashfreeAccount(event: IOption, objToApnd) {
    let accObj = {
      name: event.label,
      uniqueName: event.value
    };
    objToApnd.account = accObj;
  }

  public submitCashfreeDetail(f) {
    if (f && f.userName && f.password) {
      let objToSend = _.cloneDeep(f);
      this.store.dispatch(this.settingsIntegrationActions.SaveCashfreeDetails(objToSend));
    } else {
      this._toasty.errorToast('Please enter Cashfree details.', 'Validation');
      return;
    }
  }

  public pageChanged(event: any): void {
    let selectedGrp = this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors';
    this.getAccounts(selectedGrp, event.page, 'pagination', 'true');
  }

  public hideListItems() {
    this.filterDropDownList.hide();
  }

  /**
   * updateComment
   */
  public updateComment(account) {
    if (account.comment) {
      let canUpdate = this.canUpdateComment(account.uniqueName, account.comment);
      if (canUpdate) {
        this.addComment(account);
      } else {
        this.updateCommentIdx = null;
      }
    } else {
      let canDelete = this.canDeleteComment(account.uniqueName);
      if (canDelete) {
        this.deleteComment(account.uniqueName);
      } else {
        this.updateCommentIdx = null;
      }
    }

  }

  /**
   * deleteComment
   */
  public deleteComment(accountUniqueName) {
    setTimeout(() => {
      this._contactService.deleteComment(accountUniqueName).subscribe(res => {
        if (res.status === 'success') {
          this.updateCommentIdx = null;
        }
      });
    }, 500);
  }

  /**
   * canDeleteComment
   */
  public canDeleteComment(accountUniqueName) {
    let account;
    if (this.activeTab === 'customer') {
      account = _.find(this.sundryDebtorsAccountsBackup.results, (o: any) => {
        return o.uniqueName === accountUniqueName;
      });
    } else {
      account = _.find(this.sundryCreditorsAccountsBackup.results, (o: any) => {
        return o.uniqueName === accountUniqueName;
      });
    }
    if (account.comment) {
      account.comment = '';
      return true;
    } else {
      return false;
    }
  }

  /**
   * canDeleteComment
   */
  public canUpdateComment(accountUniqueName, comment) {
    let account;
    if (this.activeTab === 'customer') {
      account = _.find(this.sundryDebtorsAccountsBackup.results, (o: any) => {
        return o.uniqueName === accountUniqueName;
      });
    } else {
      account = _.find(this.sundryCreditorsAccountsBackup.results, (o: any) => {
        return o.uniqueName === accountUniqueName;
      });
    }
    if (account.comment !== comment) {
      account.comment = comment;
      return true;
    } else {
      return false;
    }
  }

  public addComment(account) {
    setTimeout(() => {
      this._contactService.addComment(account.comment, account.uniqueName).subscribe(res => {
        if (res.status === 'success') {
          this.updateCommentIdx = null;
          account.comment = _.cloneDeep(res.body.description);
          this.updateInList(account.uniqueName, account.comment);
        }
      });
    }, 500);
  }

  /**
   * updateInList
   */
  public updateInList(accountUniqueName, comment) {
    if (this.activeTab === 'customer') {
      //
    }
  }

  public closeAgingDropDownop(options: AgingDropDownoptions) {
    // this.agingDropDownoptions = options;
    // if (this.agingDropDownoptions.fourth >= (this.agingDropDownoptions.fifth || this.agingDropDownoptions.sixth)) {
    //   this.showToaster();
    // }
    // if ((this.agingDropDownoptions.fifth >= this.agingDropDownoptions.sixth) || (this.agingDropDownoptions.fifth <= this.agingDropDownoptions.fourth)) {
    //   this.showToaster();
    // }
    // if (this.agingDropDownoptions.sixth <= (this.agingDropDownoptions.fourth || this.agingDropDownoptions.fifth)) {
    //   this.showToaster();
    // }
  }

  public pageChangedDueReport(event: any): void {
    this.dueAmountReportRequest.page = event.page;
  }

  public loadPaginationComponent(s) {
    let transactionData = null;
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(PaginationComponent);
    if (this.paginationChild && this.paginationChild.viewContainerRef) {
      let viewContainerRef = this.paginationChild.viewContainerRef;
      viewContainerRef.remove();

      let componentInstanceView = componentFactory.create(viewContainerRef.parentInjector);
      viewContainerRef.insert(componentInstanceView.hostView);

      let componentInstance = componentInstanceView.instance as PaginationComponent;
      componentInstance.totalItems = s.count * s.totalPages;
      componentInstance.itemsPerPage = s.count;
      componentInstance.maxSize = 5;
      componentInstance.writeValue(s.page);
      componentInstance.boundaryLinks = true;
      componentInstance.pageChanged.subscribe(e => {
        this.pageChangedDueReport(e);
      });
    }
  }

  private showToaster() {
    this._toasty.errorToast('4th column must be less than 5th and 5th must be less than 6th');
  }

  private getAccounts(groupUniqueName: string, pageNumber?: number, requestedFrom?: string, refresh?: string, count: number = 20, query?: string) {
    pageNumber = pageNumber ? pageNumber : 1;
    refresh = refresh ? refresh : 'false';
    this._contactService.GetContacts(groupUniqueName, pageNumber, refresh, count, query ).subscribe((res) => {
      if (res.status === 'success') {
        if (groupUniqueName === 'sundrydebtors') {
          this.sundryDebtorsAccountsBackup = _.cloneDeep(res.body);
          this.sundryDebtorsAccounts$ = observableOf(_.cloneDeep(res.body.results));
          // if (requestedFrom !== 'pagination') {
          //   this.getAccounts('sundrycreditors', pageNumber, null, 'true');
          // }
        } else {
          this.sundryCreditorsAccountsBackup = _.cloneDeep(res.body);
          this.sundryCreditorsAccounts$ = observableOf(_.cloneDeep(res.body.results));
        }
      }
    });
  }

  private getSundrydebtorsAccounts(count: number = 200000) {
    this._contactService.GetContacts('sundrydebtors', 1, 'false', count).subscribe((res) => {
      if (res.status === 'success') {
        this.sundryDebtorsAccountsForAgingReport = _.cloneDeep(res.body.results).map(p => ({label: p.name, value: p.uniqueName}));
      }
    });
  }

  private getCashFreeBalance() {
    this._contactService.GetCashFreeBalance().subscribe((res) => {
      if (res.status === 'success') {
        this.cashFreeAvailableBalance = res.body.availableBalance;
      }
    });
  }

}

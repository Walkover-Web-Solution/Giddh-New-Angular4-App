import { animate, Component, OnDestroy, OnInit, state, style, transition, trigger, ViewChild, ComponentFactoryResolver, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
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
import { AgingDropDownoptions, DueAmountReportQueryRequest, DueAmountReportResponse, DueAmountReportRequest } from '../models/api-models/Contact';
import { AgingReportActions } from '../actions/aging-report.actions';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';

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
  public selectedGroupForCreateAcc: 'sundrydebtors' | 'sundrycreditors' = 'sundrydebtors';
  public cashFreeAvailableBalance: number;
  public payoutForm: CashfreeClass;
  public bankAccounts$: Observable<IOption[]>;
  public totalDueOptions: IOption[] = [{label: 'greater then', value: '0'}, {label: 'less then', value: '1'}, {label: 'equal to', value: '2'}];
  public includeName: boolean = false;
  public totalDueAmount: number = 0;
  public totalDueSelectedOption: string = '0';
  public names: any = [];
  public flattenAccountsStream$: Observable<IFlattenAccountsResultItem[]>;
  public agingDropDownoptions$: Observable<AgingDropDownoptions>;
  public agingDropDownoptions: AgingDropDownoptions;
  public setDueRangeOpen$: Observable<boolean>;
  public payoutObj: CashfreeClass = new CashfreeClass();
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

  @ViewChild('payNowModal') public payNowModal: ModalDirective;
  @ViewChild('filterDropDownList') public filterDropDownList: BsDropdownDirective;
  @ViewChild('paginationChild') public paginationChild: ElementViewContainerRef;
  public dueAmountReportRequest: DueAmountReportQueryRequest;
  public dueAmountReportData$: Observable<DueAmountReportResponse>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private createAccountIsSuccess$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private _toasty: ToasterService,
    private router: Router,
    private _dashboardService: DashboardService,
    private _contactService: ContactService,
    private settingsIntegrationActions: SettingsIntegrationActions,
    private _agingReportActions: AgingReportActions,
    private _companyActions: CompanyActions,
    private componentFactoryResolver: ComponentFactoryResolver) {
    this.agingDropDownoptions$ = this.store.select(s => s.agingreport.agingDropDownoptions).takeUntil(this.destroyed$);
    this.dueAmountReportRequest = new DueAmountReportQueryRequest();
    this.setDueRangeOpen$ = this.store.select(s => s.agingreport.setDueRangeOpen).takeUntil(this.destroyed$);
    this.createAccountIsSuccess$ = this.store.select(s => s.groupwithaccounts.createAccountIsSuccess).takeUntil(this.destroyed$);
    this.flattenAccountsStream$ = this.store.select(createSelector([(s: AppState) => s.general.flattenAccounts], (s) => {
      // console.log('flattenAccountsStream$');
      return s;
    })).takeUntil(this.destroyed$);
    // this.flattenAccountsStream$ = this.store.select(s => s.general.flattenAccounts).takeUntil(this.destroyed$);
    this.store.select(s => s.agingreport.data).takeUntil(this.destroyed$).subscribe((data) => {
      if (data && data.results) {
        this.dueAmountReportRequest.page = data.page;
        this.loadPaginationComponent(data);
      }
      this.dueAmountReportData$ = Observable.of(data);
    });
  }

  public pageChangedDueReport(event: any): void {
    this.dueAmountReportRequest.page = event.page;
    this.go();
  }

  public go() {
    let req = {};
    if (this.totalDueSelectedOption === '0') {
      req = {
        totalDueAmountGreaterThan: true,
        totalDueAmountLessThan: false,
        totalDueAmountEqualTo: false
      };
    } else if (this.totalDueSelectedOption === '1') {
      req = {
        totalDueAmountGreaterThan: false,
        totalDueAmountLessThan: true,
        totalDueAmountEqualTo: false
      };
    } else if (this.totalDueSelectedOption === '2') {
      req = {
        totalDueAmountGreaterThan: false,
        totalDueAmountLessThan: false,
        totalDueAmountEqualTo: true
      };
    }
    req = Object.assign(req, {totalDueAmount: this.totalDueAmount, includeName: this.includeName, names: this.names});
    // totalDueAmount: number;
    // includeName: boolean;
    // name: string[];
    // debugger;
    this.store.dispatch(this._agingReportActions.GetDueReport(req as DueAmountReportRequest, this.dueAmountReportRequest));
  }

  public ngOnInit() {

    // this.filterDropDownList.placement = 'left';

    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'contact';
    this.agingDropDownoptions$.subscribe(p => {
      this.agingDropDownoptions = _.cloneDeep(p);
      this.go();
    });
    this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));

    this.getAccounts('sundrydebtors', null, null, 'true');

    this.createAccountIsSuccess$.takeUntil(this.destroyed$).subscribe((yes: boolean) => {
      if (yes) {
        this.toggleAccountAsidePane();
        this.getAccounts('sundrydebtors', null, null, 'true');
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
        this.bankAccounts$ = Observable.of(accounts);
      }
    });
  }

  public ngOnChanges(c: SimpleChanges) {
    //
  }

  public resetMe() {
    this.dueAmountReportRequest.page = 0;
  }

  public setActiveTab(tabName: 'customer' | 'aging' | 'vendor', type: string) {
    this.activeTab = tabName;
    if (tabName !== 'aging') {
      this.getAccounts(type, null, null, 'true');
    } else {
      this.getSundrydebtorsAccounts();
      // this.go();
      this.store.dispatch(this._agingReportActions.GetDueRange());
    }
  }

  public search(ev: any) {
    let searchStr = ev.target.value ? ev.target.value.toLowerCase() : '';
    if (this.activeTab === 'customer') {
      this.sundryDebtorsAccounts$ = Observable.of(this.sundryDebtorsAccountsBackup.results.filter((acc) => acc.name.toLowerCase().includes(searchStr)));
    } else {
      this.sundryCreditorsAccounts$ = Observable.of(this.sundryCreditorsAccountsBackup.results.filter((acc) => acc.name.toLowerCase().includes(searchStr)));
    }
  }

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

  public openAgingDropDown() {
    this.store.dispatch(this._agingReportActions.OpenDueRange());
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

  private getAccounts(groupUniqueName: string, pageNumber?: number, requestedFrom?: string, refresh?: string, count: number = 20) {
    pageNumber = pageNumber ? pageNumber : 1;
    refresh = refresh ? refresh : 'false';
    this._contactService.GetContacts(groupUniqueName, pageNumber, refresh, count).subscribe((res) => {
      if (res.status === 'success') {
        if (groupUniqueName === 'sundrydebtors') {
          this.sundryDebtorsAccountsBackup = _.cloneDeep(res.body);
          this.sundryDebtorsAccounts$ = Observable.of(_.cloneDeep(res.body.results));
          // if (requestedFrom !== 'pagination') {
          //   this.getAccounts('sundrycreditors', pageNumber, null, 'true');
          // }
        } else {
          this.sundryCreditorsAccountsBackup = _.cloneDeep(res.body);
          this.sundryCreditorsAccounts$ = Observable.of(_.cloneDeep(res.body.results));
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

import { CompanyService } from '../services/companyService.service';
import { BulkEmailRequest } from '../models/api-models/Search';
import { Observable, of as observableOf, ReplaySubject, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { Component, ComponentFactoryResolver, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store';
import { ToasterService } from '../services/toaster.service';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
import { DashboardService } from '../services/dashboard.service';
import { ContactService } from '../services/contact.service';
import { BsDropdownDirective, ModalDirective, PaginationComponent, TabsetComponent } from 'ngx-bootstrap';
import { CashfreeClass } from '../models/api-models/SettingsIntegraion';
import { IFlattenAccountsResultItem } from '../models/interfaces/flattenAccountsResultItem.interface';
import { SettingsIntegrationActions } from '../actions/settings/settings.integration.action';
import * as _ from 'lodash';
import { DueAmountReportQueryRequest, DueAmountReportResponse } from '../models/api-models/Contact';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as moment from 'moment/moment';
import { saveAs } from 'file-saver';
import { GroupWithAccountsAction } from '../actions/groupwithaccounts.actions';
import { createSelector } from 'reselect';

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
  styleUrls: ['./contact.component.scss'],
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
  public flattenAccounts: any = [];
  public sundryDebtorsAccountsBackup: any = {};
  public sundryDebtorsAccountsForAgingReport: IOption[] = [];
  public sundryDebtorsAccounts$: Observable<any>;
  public sundryCreditorsAccountsBackup: any = {};
  public sundryCreditorsAccounts$: Observable<any>;
  public activeTab: any = 'customer';
  public groupUniqueName: any;
  public accountAsideMenuState: string = 'out';
  public selectedAccForPayment: any;
  public dueAmountReportRequest: DueAmountReportQueryRequest;
  public selectedGroupForCreateAcc: 'sundrydebtors' | 'sundrycreditors' = 'sundrydebtors';
  public cashFreeAvailableBalance: number;
  public payoutForm: CashfreeClass;
  public bankAccounts$: Observable<IOption[]>;
  public flattenAccountsStream$: Observable<IFlattenAccountsResultItem[]>;
  public payoutObj: CashfreeClass = new CashfreeClass();
  public dueAmountReportData$: Observable<DueAmountReportResponse>;
  public moment = moment;
  public toDate: string;
  public fromDate: string;
  public selectAllVendor: boolean = false;
  public selectAllCustomer: boolean = false;
  public selectedCheckedContacts: string[] = [];
  public selectedAllContacts: string[] = [];
  public activeAccountDetails: any;

  public selectedWhileHovering: string;
  public searchLoader$: Observable<boolean>;
  // public modalUniqueName: string;


  // sorting
  public key: string = 'name'; // set default
  public order: string = 'asc';

  public showFieldFilter = {
    name: false,
    due_amount: false,
    email: false,
    mobile: false,
    closingBalance: false,
    state: false,
    gstin: false,
    comment: false
  };
  public updateCommentIdx: number = null;
  public searchStr$ = new Subject<string>();
  public searchStr: string = '';
  @ViewChild('payNowModal') public payNowModal: ModalDirective;
  @ViewChild('filterDropDownList') public filterDropDownList: BsDropdownDirective;
  @ViewChild('paginationChild') public paginationChild: ElementViewContainerRef;
  @ViewChild('staticTabs') public staticTabs: TabsetComponent;
  @ViewChild('mailModal') public mailModal: ModalDirective;
  @ViewChild('messageBox') public messageBox: ElementRef;

  // @Input('sort-direction')
  // sortDirection: string = '';

  // @HostListener('click')
  // sort() {
  //     this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  // }

  public datePickerOptions: any;
  public universalDate$: Observable<any>;
  public messageBody = {
    header: {
      email: 'Send Email',
      sms: 'Send Sms',
      set: ''
    },
    btn: {
      email: 'Send Email',
      sms: 'Send Sms',
      set: '',
    },
    type: '',
    msg: '',
    subject: ''
  };
  public dataVariables = [
    {
      name: 'Opening Balance',
      value: '%s_OB',
    },
    {
      name: 'Closing Balance',
      value: '%s_CB',
    },
    {
      name: 'Credit Total',
      value: '%s_CT',
    },
    {
      name: 'Debit Total',
      value: '%s_DT',
    },
    {
      name: 'From Date',
      value: '%s_FD',
    },
    {
      name: 'To Date',
      value: '%s_TD',
    },
    {
      name: 'Magic Link',
      value: '%s_ML',
    },
    {
      name: 'Account Name',
      value: '%s_AN',
    },
  ];
  public isAllChecked: boolean = false;
  public selectedItems: string[] = [];
  public totalSales: number[] = [];
  public totalDue: number[] = [];
  public totalReceipts: number[] = [];
  public Totalcontacts = 0;
  public accInfo: IFlattenAccountsResultItem;
  public purchaseOrSales: 'sales' | 'purchase';
  public accountUniqueName: string;
  public isUpdateAccount: boolean = false;

  private checkboxInfo: any = {
    selectedPage: 1
  };

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private createAccountIsSuccess$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private _toasty: ToasterService,
    private router: Router,
    private _companyServices: CompanyService,
    private _toaster: ToasterService,
    private _dashboardService: DashboardService,
    private _contactService: ContactService,
    private settingsIntegrationActions: SettingsIntegrationActions,
    private _companyActions: CompanyActions,
    private componentFactoryResolver: ComponentFactoryResolver,
    private _groupWithAccountsAction: GroupWithAccountsAction,
    private _route: ActivatedRoute) {
    this.searchLoader$ = this.store.select(p => p.search.searchLoader);
    this.dueAmountReportRequest = new DueAmountReportQueryRequest();
    this.createAccountIsSuccess$ = this.store.select(s => s.groupwithaccounts.createAccountIsSuccess).pipe(takeUntil(this.destroyed$));
    this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
    // this.flattenAccountsStream$ = this.store.pipe(select(createSelector([(s: AppState) => s.general.flattenAccounts], (s) => {

    //   return s;
    // }), (takeUntil(this.destroyed$))));
     this.universalDate$.subscribe(a => {
      if (a) {
        this.datePickerOptions.startDate = a[0];
        this.datePickerOptions.endDate = a[1];
        this.fromDate = moment(a[0]).format('DD-MM-YYYY');
        this.toDate = moment(a[1]).format('DD-MM-YYYY');
        //  this.getAccounts(this.fromDate, this.toDate,this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, null, 'true', 20, '');
      }
    });

    //  this.fromDate = moment(this.datePickerOptions.startDate).format('DD-MM-YYYY');
    // this.toDate = moment(this.datePickerOptions.endDate).format('DD-MM-YYYY');
    this.flattenAccountsStream$ = this.store.pipe(select(s => s.general.flattenAccounts), takeUntil(this.destroyed$));
    this.store.select(s => s.agingreport.data).pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data && data.results) {
        this.dueAmountReportRequest.page = data.page;
        this.loadPaginationComponent(data);
      }
      this.dueAmountReportData$ = observableOf(data);
    });

    this.store.select(p => p.company.dateRangePickerConfig).pipe().subscribe(a => {
      if (a) {
        this.datePickerOptions = a;
      }
    });
  }

  public sort(key, ord = 'asc') {
    this.key = key;
    this.order = ord;

    this.getAccounts(this.fromDate, this.toDate, this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors',
      null, null, 'true', 20, '', key, ord);
  }

  public ngOnInit() {
//  this.universalDate$.subscribe(a => {
//       if (a) {
//         this.datePickerOptions.startDate = a[0];
//         this.datePickerOptions.endDate = a[1];
//         this.fromDate = moment(a[0]).format('DD-MM-YYYY').toString();
//         this.toDate = moment(a[1]).format('DD-MM-YYYY').toString();
//          this.getAccounts(this.fromDate, this.toDate,'sundrydebtors', null, null, 'true', 20, '');
//       }
//     });

    this.store.select(createSelector([(states: AppState) => states.session.applicationDate], (dateObj: Date[]) => {
      if (dateObj) {
        let universalDate = _.cloneDeep(dateObj);
        this.datePickerOptions = {
          ...this.datePickerOptions, startDate: moment(universalDate[0], 'DD-MM-YYYY').toDate(),
          endDate: moment(universalDate[1], 'DD-MM-YYYY').toDate()
        };
        this.fromDate = moment(universalDate[0]).format('DD-MM-YYYY');
        this.toDate = moment(universalDate[1]).format('DD-MM-YYYY');
         this.getAccounts(this.fromDate, this.toDate,'sundrydebtors', null, null, 'true', 20, '');
              }
    })).pipe(takeUntil(this.destroyed$)).subscribe();

    this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
      if (yes) {
        if (this.accountAsideMenuState === 'in') {
          this.toggleAccountAsidePane();
          this.getAccounts(this.fromDate, this.toDate,this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, null, 'true', 20, '');
        }
      }
    });

    this.getCashFreeBalance();

    this.flattenAccountsStream$.subscribe(data => {

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
        this.key = 'name'; // set default
        this.order = 'asc';
        if (this.activeTab === 'customer') {
          this.getAccounts(this.fromDate, this.toDate, 'sundrydebtors', null, null, 'true', 20, term);
        } else {
          this.getAccounts(this.fromDate, this.toDate,'sundrycreditors', null, null, 'true', 20, term);
        }
      });

    this._route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
      if (val && val.tab && val.tabIndex) {
        let tabIndex = Number(val.tabIndex);
        if (this.staticTabs && this.staticTabs.tabs) {
          if (val.tab === 'aging-report' && tabIndex === 1) {
            this.setActiveTab('aging', '');
            this.staticTabs.tabs[tabIndex].active = true;
          } else if (val.tab === 'vendor' && tabIndex === 0) {
            this.setActiveTab('vendor', 'sundrycreditors');
            this.staticTabs.tabs[tabIndex].active = true;
          } else {
            this.setActiveTab('customer', 'sundrydebtors');
            this.staticTabs.tabs[0].active = true;
          }
        }

        // save last state with active tab
        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'contact/' + this.activeTab;

        this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
      }
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    // if (changes['accountUniqueName'] && changes['accountUniqueName'].currentValue
    //   && (changes['accountUniqueName'].currentValue !== changes['accountUniqueName'].previousValue)) {
    //   this.flattenAccountsStream$.pipe(take(1)).subscribe(data => {
    //     if (data && data.length) {
    //       this.accInfo = data.find(f => f.uniqueName === changes['accountUniqueName'].currentValue);
    //       let creditorsString = 'currentliabilities, sundrycreditors';
    //       this.purchaseOrSales = this.accInfo.uNameStr.indexOf(creditorsString) > -1 ? 'purchase' : 'sales';
    //     }
    //   });
    // }
  }

  public performActions(type: number, account: any, event?: any) {
    this.selectedCheckedContacts = [];
    this.selectedCheckedContacts.push(account.uniqueName);

    switch (type) {
      case 0: // go to add and manage
        this.store.dispatch(this._groupWithAccountsAction.getGroupWithAccounts(account.name));
        this.store.dispatch(this._groupWithAccountsAction.OpenAddAndManageFromOutside(account.name));
        break;

      case 1: // go to ledger
        this.goToRoute('ledger', `/${this.fromDate}/${this.toDate}`, account.uniqueName);
        break;

      case 2: // go to sales or purchase
        this.purchaseOrSales = this.activeTab === 'customer' ? 'sales' : 'purchase';
        if (this.purchaseOrSales === 'purchase') {
          this.goToRoute('purchase/create', '', account.uniqueName);
        } else {
          this.goToRoute('sales', '', account.uniqueName);
        }
        break;
      case 3: // send sms
        if (event) {
          event.stopPropagation();
        }
        this.openSmsDialog();
        break;
      case 4: // send email
        if (event) {
          event.stopPropagation();
        }
        this.openEmailDialog();
        break;
      default:
        break;
    }
  }

  public goToRoute(part: string, additionalParams: string = '', accUniqueName: string) {
    let url = location.href + `?returnUrl=${part}/${accUniqueName}`;

    if (additionalParams) {
      url = `${url}${additionalParams}`;
    }

    if (isElectron) {
      let ipcRenderer = (window as any).require('electron').ipcRenderer;
      url = location.origin + location.pathname + `#./pages/${part}/${accUniqueName}`;
      console.log(ipcRenderer.send('open-url', url));
    } else {
      (window as any).open(url);
    }
  }

  // public openUpdatemodel(account: any) {
  //   console.log(' open', this.fromDate, this.toDate);
  //   this.modalUniqueName = account.uniqueName;
  // }
  // public closeModel(account: any) {
  //     this.modalUniqueName = ''; 
  // }
  public tabSelected(tabName: 'customer' | 'aging' | 'vendor') {
    this.selectedCheckedContacts = [];
    this.activeTab = tabName;
  }

  public setActiveTab(tabName: 'customer' | 'aging' | 'vendor', type: string) {
    this.tabSelected(tabName);
    if (tabName !== 'aging') {
    //  this.getAccounts(this.fromDate, this.toDate, type, null, null, 'true', 20, '');
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public updateCustomerAcc(openFor: 'customer' | 'vendor', account?: any) {
    this.activeAccountDetails = account;
    this.isUpdateAccount = true;
    this.selectedGroupForCreateAcc = openFor === 'customer' ? 'sundrydebtors' : 'sundrycreditors';
    this.toggleAccountAsidePane();
  }

  public openAddAndManage(openFor: 'customer' | 'vendor') {
    this.isUpdateAccount = false;
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

  public getUpdatedList(grpName?): void {
    setTimeout(() => {
      if (grpName) {
        if (this.accountAsideMenuState === 'in') {
          this.toggleAccountAsidePane();
          this.getAccounts(this.fromDate, this.toDate,this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, null, 'true', 20, '');
        }
      }
    }, 1000);
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

  public onConfirmation(amountToPay: string) {
    let payNowData: PayNowRequest = {
      accountUniqueName: this.selectedAccForPayment.uniqueName,
      amount: Number(amountToPay),
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
    this.selectedCheckedContacts = [];
    this.getAccounts(this.fromDate, this.toDate,selectedGrp, event.page, 'pagination', 'true', 20, '');
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

  // Add Selected Value to Message Body
  public addValueToMsg(val: any) {
    this.typeInTextarea(val.value);
    // this.messageBody.msg += ` ${val.value} `;
  }

  public typeInTextarea(newText) {
    let el: HTMLInputElement = this.messageBox.nativeElement;
    let start = el.selectionStart;
    let end = el.selectionEnd;
    let text = el.value;
    let before = text.substring(0, start);
    let after = text.substring(end, text.length);
    el.value = (before + newText + after);
    el.selectionStart = el.selectionEnd = start + newText.length;
    el.focus();
    this.messageBody.msg = el.value;
  }

  // Open Modal for Email
  public openEmailDialog() {
    this.messageBody.msg = '';
    this.messageBody.subject = '';
    this.messageBody.type = 'Email';
    this.messageBody.btn.set = this.messageBody.btn.email;
    this.messageBody.header.set = this.messageBody.header.email;
    this.mailModal.show();
  }

  // Open Modal for SMS
  public openSmsDialog() {
    this.messageBody.msg = '';
    this.messageBody.type = 'sms';
    this.messageBody.btn.set = this.messageBody.btn.sms;
    this.messageBody.header.set = this.messageBody.header.sms;
    this.mailModal.show();
  }

  // Send Email/Sms for Accounts
  public async send(groupsUniqueName: string) {
    let request: BulkEmailRequest = {
      data: {
        subject: this.messageBody.subject,
        message: this.messageBody.msg,
        accounts: _.uniq(this.selectedCheckedContacts),
      },
      params: {
        from: this.fromDate,
        to: this.toDate,
        groupUniqueName: groupsUniqueName
      }
    };
    // uncomment it
    // request.data = Object.assign({} , request.data, this.formattedQuery);

    if (this.messageBody.btn.set === 'Send Email') {
      return this._companyServices.sendEmail(request)
        .subscribe((r) => {
          r.status === 'success' ? this._toaster.successToast(r.body) : this._toaster.errorToast(r.message);
          this.checkboxInfo = {
            selectedPage: 1
          };
          this.selectedItems = [];
          this.isAllChecked = false;
        });
    } else if (this.messageBody.btn.set === 'Send Sms') {
      let temp = request;
      delete temp.data['subject'];
      return this._companyServices.sendSms(temp)
        .subscribe((r) => {
          r.status === 'success' ? this._toaster.successToast(r.body) : this._toaster.errorToast(r.message);
          this.checkboxInfo = {
            selectedPage: 1
          };
          this.selectedItems = [];
          this.isAllChecked = false;
        });
    }
    this.mailModal.hide();
  }

  /**
   * updateInList
   */
  public updateInList(accountUniqueName, comment) {
    if (this.activeTab === 'customer') {
      //
    }
  }

  public pageChangedDueReport(event: any): void {
    this.dueAmountReportRequest.page = event.page;
  }

  public getTotalSales() {
    return this.totalSales.reduce((a, b) => a + b, 0);
  }

  public getTotalDue() {

    return this.totalDue.reduce((a, b) => a + b, 0);
  }

  public getTotalReceipts() {
    return this.totalReceipts.reduce((a, b) => a + b, 0);
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

  public selectedDate(value: any) {
    this.fromDate = moment(value.picker.startDate).format('DD-MM-YYYY');
    this.toDate = moment(value.picker.endDate).format('DD-MM-YYYY');
    if(value.event.type==='hide') {
   this.getAccounts(this.fromDate, this.toDate,this.activeTab === 'customer' ? 'sundrydebtors' : 'sundrycreditors', null, null, 'true', 20, '');
    }
  }

  public selectAccount(ev: any, uniqueName: string) {
    // this.selectedcus = true;
    if (ev.target.checked) {
      this.selectedCheckedContacts.push(uniqueName);
      // this.selectCustomer = true;
    } else {
      // this.selectCustomer = false;
      let itemIndx = this.selectedCheckedContacts.findIndex((item) => item === uniqueName);
      this.selectedCheckedContacts.splice(itemIndx, 1);

      if (this.selectedCheckedContacts.length === 0) {
        this.selectAllCustomer = false;
        this.selectAllVendor = false;
        this.selectedWhileHovering = '';
      }
      // this.lc.selectedTxnUniqueName = null;
      // this.store.dispatch(this._ledgerActions.DeSelectGivenEntries([uniqueName]));
    }
  }

  // Save CSV File with data from Table...
  public downloadCSV() {
    if (this.activeTab === 'customer') {
      this.groupUniqueName = 'sundrydebtors';
    } else {
      this.groupUniqueName = 'sundrycreditors';
    }

    let request: BulkEmailRequest = {
      data: {
        subject: this.messageBody.subject,
        message: this.messageBody.msg,
        accounts: this.selectedCheckedContacts,
      },
      params: {
        from: this.fromDate,
        to: this.toDate,
        groupUniqueName: this.groupUniqueName
      }
    };

    this._companyServices.downloadCSV(request).subscribe((res) => {
      this.searchLoader$ = observableOf(false);
      if (res.status === 'success') {
        let blobData = this.base64ToBlob(res.body, 'text/csv', 512);
        return saveAs(blobData, `${this.groupUniqueName}.csv`);
      }
    });

  }

  public base64ToBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    let offset = 0;
    while (offset < byteCharacters.length) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      let i = 0;
      while (i < slice.length) {
        byteNumbers[i] = slice.charCodeAt(i);
        i++;
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
      offset += sliceSize;
    }
    return new Blob(byteArrays, {type: contentType});
  }

  private getAccounts(fromDate: string, toDate: string, groupUniqueName: string, pageNumber?: number, requestedFrom?: string, refresh?: string, count: number = 20, query?: string,
                      sortBy: string = '', order: string = 'asc') {
    pageNumber = pageNumber ? pageNumber : 1;
    refresh = refresh ? refresh : 'false';
    this._contactService.GetContacts(fromDate, toDate, groupUniqueName, pageNumber, refresh, count, query, sortBy, order).subscribe((res) => {
      if (res.status === 'success') {
        this.totalDue = [];
        this.totalSales = [];
        this.totalReceipts = [];
        this.selectedAllContacts = [];
        this.Totalcontacts = 0;
        for (let resp of res.body.results) {
          this.totalSales.push(resp.debitTotal);
          this.totalReceipts.push(resp.creditTotal);
          this.totalDue.push(resp.closingBalance.amount);
          this.selectedAllContacts.push(resp.uniqueName);
        }

        if (groupUniqueName === 'sundrydebtors') {
          this.sundryDebtorsAccountsBackup = _.cloneDeep(res.body);
          this.Totalcontacts = res.body.totalItems;
          _.map(res.body.results, (obj) => {
            obj.closingBalanceAmount = obj.closingBalance.amount;
            obj.openingBalanceAmount = obj.openingBalance.amount;
            if (obj && obj.state) {
              obj.stateName = obj.state.name;
            }
          });
          this.sundryDebtorsAccounts$ = observableOf(_.cloneDeep(res.body.results));
          //  console.log('res.body.results', res.body.results);

        } else {
          this.Totalcontacts = res.body.totalItems;
          this.sundryCreditorsAccountsBackup = _.cloneDeep(res.body);
          _.map(res.body.results, (obj) => {
            obj.closingBalanceAmount = obj.closingBalance.amount;
            obj.openingBalanceAmount = obj.openingBalance.amount;
            if (obj && obj.state) {
              obj.stateName = obj.state.name;
            }
          });
          this.sundryCreditorsAccounts$ = observableOf(_.cloneDeep(res.body.results));

        }
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

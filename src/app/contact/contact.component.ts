import { CompanyService } from './../services/companyService.service';
import { AccountFlat, BulkEmailRequest, SearchRequest } from './../models/api-models/Search';
import { Observable, of as observableOf, ReplaySubject, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { Component, ComponentFactoryResolver, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { ToasterService } from '../services/toaster.service';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { IOption } from 'app/theme/ng-virtual-select/sh-options.interface';
import { DashboardService } from '../services/dashboard.service';
import { ContactService } from '../services/contact.service';
import { BsDropdownDirective, ModalDirective, PaginationComponent, TabsetComponent } from 'ngx-bootstrap';
import { CashfreeClass } from '../models/api-models/SettingsIntegraion';
import { IFlattenAccountsResultItem } from '../models/interfaces/flattenAccountsResultItem.interface';
import { SettingsIntegrationActions } from '../actions/settings/settings.integration.action';
import { createSelector } from 'reselect';
import * as _ from 'lodash';
import { AgingDropDownoptions, DueAmountReportQueryRequest, DueAmountReportResponse } from '../models/api-models/Contact';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as moment from 'moment/moment';
import { saveAs } from 'file-saver';

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

    .aging-table > tbody > tr input[type="checkbox"] {
      position: absolute !important;
      opacity: 0;
    }

    .aging-table > tbody > tr:hover input[type="checkbox"] {
      position: relative !important;
      opacity: 1;
    }

    .checkbox_visible {
      opacity: 1 !important;
      position: relative !important;
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
  public activeTab: any = 'customer';
  public groupUniqueName: any;
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
  public moment = moment;
  public toDate: string;
  public fromDate: string;
  public selectAllVendor: boolean = false;
  public selectAllCustomer: boolean = false;
  public selectedCheckedContacts: string[] = [];
  public selectedAllContacts: string[] = [];
  public allSelected: boolean = false;
  public agingTab: boolean = false;

  public selectedWhileHovering: string;
  public selectCustomer: boolean = false;
  public selectedcus: boolean = false;
  public searchLoader$: Observable<boolean>;

  // sorting
  public key: string = 'name'; // set default
  public reverse: boolean = false;

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
  public selectedContactType: string = 'customer';
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
  public searchResponseFiltered$: Observable<AccountFlat[]>;
  public searchRequest$: Observable<SearchRequest>;
  public isAllChecked: boolean = false;
  public selectedItems: string[] = [];
  public totalSales: number[] = [];
  public totalDue: number[] = [];
  public totalReceipts: number[] = [];
  public Totalcontacts = 0;

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
    private _route: ActivatedRoute) {
    this.searchLoader$ = this.store.select(p => p.search.searchLoader);
    this.dueAmountReportRequest = new DueAmountReportQueryRequest();
    this.createAccountIsSuccess$ = this.store.select(s => s.groupwithaccounts.createAccountIsSuccess).pipe(takeUntil(this.destroyed$));

    this.flattenAccountsStream$ = this.store.select(createSelector([(s: AppState) => s.general.flattenAccounts], (s) => {

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


    this.store.select(p => p.company.dateRangePickerConfig).pipe().subscribe(a => {
      if (a) {
        this.datePickerOptions = a;
      }
    });
    this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
  }

  public sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  public ngOnInit() {

    this.universalDate$.subscribe(a => {
      if (a) {
        this.datePickerOptions.startDate = a[0];
        this.datePickerOptions.endDate = a[1];
        this.fromDate = moment(a[0]).format('DD-MM-YYYY');
        this.toDate = moment(a[1]).format('DD-MM-YYYY');
      }
    });
    this.staticTabs.tabs[0].active = true;
    // if (this._route.children && this._route.children.length > 0) {
    this._route.url.pipe(take(1)).subscribe((p: any) => {
      // this.activeTab = p[0].path;
      //
      // if (this.activeTab === 'customer') {
      //   this.setActiveTab('customer', 'sundrydebtors');
      //   this.staticTabs.tabs[0].heading = 'Customer';
      // } else {
      //   this.setActiveTab('vendor', 'sundrycreditors');
      //   this.staticTabs.tabs[0].heading = 'Vendor';
      //
      // }
    });

    this._route.params.subscribe(s => {
      this.activeTab = s['type'];
      if (this.activeTab === 'customer') {
        this.setActiveTab('customer', 'sundrydebtors');
        this.staticTabs.tabs[0].heading = 'Customer';
      } else {
        this.setActiveTab('vendor', 'sundrycreditors');
        this.staticTabs.tabs[0].heading = 'Vendor';

      }
    });
    // }

    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'contact/' + this.activeTab;

    this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));

    this.getAccounts('sundrydebtors', null, null, 'true', 20, '');

    this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
      if (yes) {
        this.toggleAccountAsidePane();
        this.getAccounts('sundrydebtors', null, null, 'true', 20, '');
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
        if (this.activeTab === 'customer') {
          this.getAccounts('sundrydebtors', null, null, 'true', 20, term);
        } else {
          this.getAccounts('sundrycreditors', null, null, 'true', 20, term);
        }
      });

    this._route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
      if (val && val.tab && val.tabIndex) {
        if (val.tabIndex) {
          this.staticTabs.tabs[0].active = false;
          this.staticTabs.tabs[1].active = true;
        }
        // // this.selectTab(val.tab);
        // if (val.tab === 'customer') {
        //   this.setActiveTab('customer', 'sundrydebtors');
        //   this.staticTabs.tabs[0].heading = 'Customer';
        // } else {
        //   this.setActiveTab('vendor', 'sundrycreditors');
        //   this.staticTabs.tabs[0].heading = 'ven';
        // }
      }
    });
  }

  public ngOnChanges(c: SimpleChanges) {
    //
  }

  public setActiveTab(tabName: 'customer' | 'aging' | 'vendor', type: string) {
    this.activeTab = tabName;
    if (tabName !== 'aging') {
      this.getAccounts(type, null, null, 'true', 20, '');
    } else {
      this.getSundrydebtorsAccounts();
      // this.go();
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
    this.getAccounts(selectedGrp, event.page, 'pagination', 'true', 20, '');
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
        accounts: this.selectedCheckedContacts,
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

  public entryHovered(uniqueName: string) {
    this.selectedWhileHovering = uniqueName;
  }

  public selectedDate(value: any) {
    this.fromDate = moment(value.picker.startDate).format('DD-MM-YYYY');
    this.toDate = moment(value.picker.endDate).format('DD-MM-YYYY');

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

  public selectAllEntries(ev: any) {
    this.selectedCheckedContacts = [];
    if (ev.target.checked) {
      this.selectedCheckedContacts = this.selectedAllContacts;
      this.allSelected = true;
    } else {
      this.allSelected = false;
      this.selectedCheckedContacts = [];
      this.selectedAllContacts = [];
    }
  }

  public agingReportSelected(e) {
    this.agingTab = true;
  }

  private showToaster() {
    this._toasty.errorToast('4th column must be less than 5th and 5th must be less than 6th');
  }

  private getAccounts(groupUniqueName: string, pageNumber?: number, requestedFrom?: string, refresh?: string, count: number = 20, query?: string) {
    pageNumber = pageNumber ? pageNumber : 1;
    refresh = refresh ? refresh : 'false';
    this._contactService.GetContacts(groupUniqueName, pageNumber, refresh, count, query).subscribe((res) => {
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
            if (obj.state.name) {
              obj.stateName = obj.state.name;
            }
          });
          this.sundryDebtorsAccounts$ = observableOf(_.cloneDeep(res.body.results));
          // if (requestedFrom !== 'pagination') {\
          //   this.getAccounts('sundrycreditors', pageNumber, null, 'true');
          // }
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

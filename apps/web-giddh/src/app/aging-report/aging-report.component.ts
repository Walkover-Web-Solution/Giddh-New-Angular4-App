import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { AgingDropDownoptions, DueAmountReportQueryRequest, DueAmountReportRequest, DueAmountReportResponse } from '../models/api-models/Contact';
import { Store } from '@ngrx/store';
import { AppState } from '../store';
import { ToasterService } from '../services/toaster.service';
import { Router } from '@angular/router';
import { AgingReportActions } from '../actions/aging-report.actions';
import { IOption } from '../theme/ng-virtual-select/sh-options.interface';
import * as _ from 'lodash';
import { ContactService } from '../services/contact.service';
import { Observable, of, ReplaySubject } from 'rxjs';
import { PaginationComponent } from 'ngx-bootstrap';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { take, takeUntil } from 'rxjs/operators';
import { StateDetailsRequest } from 'apps/web-giddh/src/app/models/api-models/Company';
import * as moment from 'moment/moment';
import { BsDropdownDirective, ModalDirective, TabsetComponent } from 'ngx-bootstrap';
import { BulkEmailRequest } from '../models/api-models/Search';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'aging-report',
  templateUrl: 'aging-report.component.html',
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
    .icon-pointer {
      position: absolute;
      right: 10px;
      top: 26%;
    }

    .icon-pointer .glyphicon:hover {
      color: #FF5F00 !important;
    }

    .icon-pointer .activeTextColor {
      color: #FF5F00 !important;
    }

    .icon-pointer .d-block.font-xxs.glyphicon.glyphicon-triangle-top {
      line-height: 0.5;
      height: 8px;
    }

    .icon-pointer .font-xxs {
      font-size: 12px;
    }
    .custumerRightWrap{
      padding-right:0;
    }
    .aging-table {
      max-width: 1170px;
      width: 100%;
  }
  .btn-group.moreBtn.open.show{
    display: inline-block !important;
  }
  .moreBtn li {
    padding: 5px;
    cursor: default;
  }
  .moreBtn li:hover {
    background-color: #E5E5E5;
    color: #ff5f00;
}
  .btn-primary.active, .btn-primary:active, .open>.dropdown-toggle.btn-primary {
    color: #333;
    background-color: #E7E7E8;
    border-color: #E7E7E8;
    box-shadow: none !important;
  }
  .icon-pointer.iconSearch{
   
    top: 30%;
    color: #A9A9A9;
  }
  `]
})
export class AgingReportComponent implements OnInit {
  public totalDueSelectedOption: string = '0';
  public totalDueAmount: number = 0;
  public includeName: boolean = false;
  public names: any = [];
  public dueAmountReportRequest: DueAmountReportQueryRequest;
  public sundryDebtorsAccountsForAgingReport: IOption[] = [];
  public setDueRangeOpen$: Observable<boolean>;
  public agingDropDownoptions$: Observable<AgingDropDownoptions>;
  public agingDropDownoptions: AgingDropDownoptions;
  public dueAmountReportData$: Observable<DueAmountReportResponse>;
  public totalDueAmounts: number[] = [];
  public totalFutureDueAmounts: number[] = [];
  public Totalcontacts = 0;
  public selectedCheckedContacts: string[] = [];
  public datePickerOptions: any;
  public universalDate$: Observable<any>;
  public toDate: string;
  public fromDate: string;
  public moment = moment;
  public key: string = 'name';
  public order: string = 'asc';
  public filter: string = '';
  public config: PerfectScrollbarConfigInterface = {suppressScrollX: false, suppressScrollY: false};
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

  @ViewChild('paginationChild') public paginationChild: ElementViewContainerRef;
  @ViewChild('filterDropDownList') public filterDropDownList: BsDropdownDirective;
  @ViewChild('mailModal') public mailModal: ModalDirective;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private _toasty: ToasterService,
    private router: Router, private _agingReportActions: AgingReportActions,
    private _contactService: ContactService,
    private componentFactoryResolver: ComponentFactoryResolver) {
    this.agingDropDownoptions$ = this.store.select(s => s.agingreport.agingDropDownoptions).pipe(takeUntil(this.destroyed$));
    this.dueAmountReportRequest = new DueAmountReportQueryRequest();
    this.setDueRangeOpen$ = this.store.select(s => s.agingreport.setDueRangeOpen).pipe(takeUntil(this.destroyed$));
    this.getDueAmountreportData();
    this.store.select(p => p.company.dateRangePickerConfig).pipe().subscribe(a => {
      if (a) {
        this.datePickerOptions = a;
      }
    });
    this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
  }

  public getDueAmountreportData() {
    this.store.select(s => s.agingreport.data).pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data && data.results) {
        this.dueAmountReportRequest.page = data.page;
        setTimeout(() => this.loadPaginationComponent(data)); // Pagination issue fix
        this.totalDueAmounts = [];
        this.totalFutureDueAmounts = [];
        for (let dueAmount of data.results) {
          this.totalDueAmounts.push(dueAmount.totalDueAmount);
          this.totalFutureDueAmounts.push(dueAmount.futureDueAmount);
        }

      }
      this.dueAmountReportData$ = of(data);
      if (data) {
        _.map(data.results, (obj: any) => {
          obj.dueAmount = obj.currentAndPastDueAmount[0].dueAmount;
          obj.dueAmount1 = obj.currentAndPastDueAmount[1].dueAmount;
          obj.dueAmount2 = obj.currentAndPastDueAmount[2].dueAmount;
          obj.dueAmount3 = obj.currentAndPastDueAmount[3].dueAmount;

        });
      }

    });
  }
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
  public isUpdateAccount: boolean = false;
  public selectedGroupForCreateAcc: 'sundrydebtors' | 'sundrycreditors' = 'sundrydebtors';
  public hideListItems() {
    this.filterDropDownList.hide();
  }
  public openAddAndManage(openFor: 'customer' | 'vendor') {
    this.isUpdateAccount = false;
    this.selectedGroupForCreateAcc = openFor === 'customer' ? 'sundrydebtors' : 'sundrycreditors';
   // this.toggleAccountAsidePane();
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

public downloadCSV() {

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
    this.store.dispatch(this._agingReportActions.GetDueReport(req as DueAmountReportRequest, this.dueAmountReportRequest));
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
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'aging-report';

    this.go();

    // this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
  
    this.store.dispatch(this._agingReportActions.GetDueRange());
    this.agingDropDownoptions$.subscribe(p => {
      this.agingDropDownoptions = _.cloneDeep(p);
    });
          this.getSundrydebtorsAccounts(this.fromDate, this.toDate);
  }


  public openAgingDropDown() {
    this.store.dispatch(this._agingReportActions.OpenDueRange());
  }

  public closeAgingDropDownop(options: AgingDropDownoptions) {
    //
  }

  public pageChangedDueReport(event: any): void {
    this.dueAmountReportRequest.page = event.page;
    this.go();
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

  public getFutureTotalDue() {

    return this.totalFutureDueAmounts.reduce((a, b) => a + b, 0);
  }

  public getTotalDue() {
    return this.totalDueAmounts.reduce((a, b) => a + b, 0);
  }

  public selectedDate(value: any) {
    this.fromDate = moment(value.picker.startDate).format('DD-MM-YYYY');
    this.toDate = moment(value.picker.endDate).format('DD-MM-YYYY');
    if(value.event.type==='hide') {
     this.getSundrydebtorsAccounts(this.fromDate, this.toDate);
    }
  }

  public sort(key, ord = 'asc') {
    this.key = key;
    this.order = ord;
  }

  private getSundrydebtorsAccounts(fromDate: string, toDate: string ,count: number = 200000) {
    this._contactService.GetContacts(fromDate, toDate,'sundrydebtors', 1, 'false', count).subscribe((res) => {
      if (res.status === 'success') {
        this.sundryDebtorsAccountsForAgingReport = _.cloneDeep(res.body.results).map(p => ({label: p.name, value: p.uniqueName}));

      }
    });
  }
}

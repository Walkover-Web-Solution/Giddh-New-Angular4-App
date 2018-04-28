import { Component, OnDestroy, OnInit, trigger, state, style, animate, transition, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { ToasterService } from '../services/toaster.service';
import { SignupWithMobile, UserDetails, VerifyMobileModel } from '../models/api-models/loginModels';
import { LoginActions } from '../actions/login.action';
import { AuthenticationService } from '../services/authentication.service';
import { CompanyService } from '../services/companyService.service';
import { CompanyResponse, GetCouponResp, StateDetailsRequest } from '../models/api-models/Company';
import { cloneDeep } from '../lodash-optimized';
import { CompanyActions } from '../actions/company.actions';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { IOption } from 'app/theme/ng-virtual-select/sh-options.interface';
import { DashboardService } from '../services/dashboard.service';
import { ContactService } from '../services/contact.service';
import { ModalDirective } from 'ngx-bootstrap';

const CustomerType = [
  { label: 'Customer', value: 'customer' },
  { label: 'Vendor', value: 'vendor' }
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
  .dropdown-menu>li>a{
    padding: 2px 10px;
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

export class ContactComponent implements OnInit, OnDestroy {
  public CustomerType = CustomerType;
  public flattenAccounts: any = [];
  public sundryDebtorsAccountsBackup: any[] = [];
  public sundryDebtorsAccounts$: Observable<any>;
  public sundryCreditorsAccountsBackup: any[] = [];
  public sundryCreditorsAccounts$: Observable<any>;
  public activeTab: string = 'customer';
  public accountAsideMenuState: string = 'out';
  public asideMenuStateForProductService: string = 'out';
  public selectedAccForPayment: any;
  public selectedGroupForCreateAcc: 'sundrydebtors' | 'sundrycreditors' = 'sundrydebtors';
  public showFieldFilter = {
    name: true,
    due_amount: true,
    email: false,
    mobile: false
  };
  @ViewChild('payNowModal') public payNowModal: ModalDirective;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private createAccountIsSuccess$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private _toasty: ToasterService,
    private router: Router,
    private _dashboardService: DashboardService,
    private _contactService: ContactService,
    private _toaster: ToasterService) {
      this.createAccountIsSuccess$ = this.store.select(s => s.groupwithaccounts.createAccountIsSuccess).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.getAccounts('sundrydebtors');

    this.createAccountIsSuccess$.takeUntil(this.destroyed$).subscribe((yes: boolean) => {
      if (yes) {
        this.toggleAccountAsidePane();
        this.getAccounts('sundrydebtors');
      }
    });
  }

  public setActiveTab(tabName: 'customer' | 'vendor') {
    this.activeTab = tabName;
  }

  public search(ev: any) {
    let searchStr =  ev.target.value;
    if (this.activeTab === 'customer') {
      this.sundryDebtorsAccounts$ = Observable.of(this.sundryDebtorsAccountsBackup.filter((acc) => acc.name.includes(searchStr)));
    } else {
      this.sundryCreditorsAccounts$ = Observable.of(this.sundryCreditorsAccountsBackup.filter((acc) => acc.name.includes(searchStr)));
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
    if (this.asideMenuStateForProductService === 'in' || this.accountAsideMenuState === 'in') {
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
        this._toaster.successToast('Payment done successfully with reference id: ' + res.body.referenceId);
      } else {
        this._toaster.errorToast(res.message, res.code);
      }
    });
  }

  private getAccounts(groupUniqueName: string) {
    this._dashboardService.GetClosingBalance(groupUniqueName, '', '', false).takeUntil(this.destroyed$).subscribe(response => {
      if (response.status === 'success') {
        if (groupUniqueName === 'sundrydebtors') {
          this.sundryDebtorsAccountsBackup = response.body[0].accounts;
          this.sundryDebtorsAccounts$ = Observable.of(response.body[0].accounts);
          this.getAccounts('sundrycreditors');
        } else {
          this.sundryCreditorsAccountsBackup = response.body[0].accounts;
          this.sundryCreditorsAccounts$ = Observable.of(response.body[0].accounts);
        }
      }
    });
  }
}

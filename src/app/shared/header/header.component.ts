import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { setTimeout } from 'timers';
import { GIDDH_DATE_FORMAT } from './../helpers/defaultDateFormat';
import { CompanyAddComponent, CompanyAddNewUiComponent, ManageGroupsAccountsComponent } from './components';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalDirective } from 'ngx-bootstrap';
import { AppState } from '../../store';
import { LoginActions } from '../../actions/login.action';
import { CompanyActions } from '../../actions/company.actions';
import { ActiveFinancialYear, CompanyResponse } from '../../models/api-models/Company';
import { UserDetails } from '../../models/api-models/loginModels';
import { GroupWithAccountsAction } from '../../actions/groupwithaccounts.actions';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from '../../lodash-optimized';
import { ElementViewContainerRef } from '../helpers/directives/elementViewChild/element.viewchild.directive';
import { FlyAccountsActions } from '../../actions/fly-accounts.actions';
import { FormControl } from '@angular/forms';
import { AuthService } from 'ng-social-login-module';
import { userLoginStateEnum } from '../../store/authentication/authentication.reducer';
import { GeneralActions } from '../../actions/general/general.actions';
import { createSelector } from 'reselect';
import * as moment from 'moment/moment';
import { AuthenticationService } from '../../services/authentication.service';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';
import { IForceClear } from '../../models/api-models/Sales';
import { ShSelectComponent } from '../../theme/ng-virtual-select/sh-select.component';

export const NAVIGATION_ITEM_LIST: IOption[] = [
  { label: 'Dashboard', value: '/pages/home' },
  { label: 'Journal Voucher', value: '/pages/accounting-voucher' },
  { label: 'Sales', value: '/pages/sales' },
  { label: 'Invoice', value: '/pages/invoice/preview' },
  { label: 'Invoice > Generate', value: '/pages/invoice/generate' },
  { label: 'Invoice > Templates', value: '/pages/invoice/templates' },
  { label: 'Invoice > Settings', value: '/pages/invoice/settings' },
  { label: 'Daybook', value: '/pages/daybook' },
  { label: 'Trial Balance', value: '/pages/trial-balance-and-profit-loss', additional: { tab: 'trial-balance', tabIndex: 0 } },
  { label: 'Profit & Loss', value: '/pages/trial-balance-and-profit-loss', additional: { tab: 'profit-and-loss', tabIndex: 1 } },
  { label: 'Balance Sheet', value: '/pages/trial-balance-and-profit-loss', additional: { tab: 'balance-sheet', tabIndex: 2 } },
  { label: 'Audit Logs', value: '/pages/audit-logs' },
  { label: 'Taxes', value: '/pages/purchase/invoice' },
  { label: 'Inventory', value: '/pages/inventory' },
  { label: 'Manufacturing', value: '/pages/manufacturing/report' },
  { label: 'Search', value: '/pages/search' },
  { label: 'Permissions', value: '/pages/permissions/list' },
  { label: 'Settings', value: '/pages/settings' },
  { label: 'Settings > Taxes', value: '/pages/settings', additional: { tab: 'taxes', tabIndex: 0 } },
  { label: 'Settings > Integration', value: '/pages/settings', additional: { tab: 'integration', tabIndex: 1 } },
  { label: 'Settings > Linked Accounts', value: '/pages/settings', additional: { tab: 'linked-accounts', tabIndex: 2 } },
  { label: 'Settings > Profile', value: '/pages/settings', additional: { tab: 'profile', tabIndex: 3 } },
  { label: 'Settings > Financial Year', value: '/pages/settings', additional: { tab: 'financial-year', tabIndex: 4 } },
  { label: 'Settings > Permission', value: '/pages/settings', additional: { tab: 'permission', tabIndex: 5 } },
  { label: 'Settings > Branch', value: '/pages/settings', additional: { tab: 'branch', tabIndex: 6 } },
  { label: 'Settings > Tag', value: '/pages/settings', additional: { tab: 'tag', tabIndex: 7 } },
  { label: 'Settings > Trigger', value: '/pages/settings', additional: { tab: 'trigger', tabIndex: 8 } },
  { label: 'Contact', value: '/pages/contact' },
  { label: 'Inventory In/Out', value: '/pages/inventory-in-out' },
  { label: 'Import', value: '/pages/import' },
  { label: 'Settings > Group', value: '/pages/settings', additional: { tab: 'Group', tabIndex: 10 } },
  { label: 'Onboarding', value: '/onboarding' },
  { label: 'Purchase Invoice ', value: '/pages/purchase/create' },
  { label: 'Company Import/Export', value: '/pages/company-import-export' },
  { label: 'New V/S Old Invoices', value: '/pages/carriedoversales' }
];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
  public userIsSuperUser: boolean = true; // Protect permission module
  public session$: Observable<userLoginStateEnum>;
  public accountSearchValue: string = '';
  public accountSearchControl: FormControl = new FormControl();
  public companyDomains: string[] = ['walkover.in', 'giddh.com', 'muneem.co'];
  public moment = moment;
  @ViewChild('companyadd') public companyadd: ElementViewContainerRef;
  @ViewChild('companynewadd') public companynewadd: ElementViewContainerRef;
  // @ViewChildren(ElementViewContainerRef) public test: ElementViewContainerRef;

  @ViewChild('addmanage') public addmanage: ElementViewContainerRef;
  @ViewChild('manageGroupsAccountsModal') public manageGroupsAccountsModal: ModalDirective;
  @ViewChild('addCompanyModal') public addCompanyModal: ModalDirective;
  @ViewChild('addCompanyNewModal') public addCompanyNewModal: ModalDirective;

  @ViewChild('deleteCompanyModal') public deleteCompanyModal: ModalDirective;
  @ViewChild('navigationModal') public navigationModal: ModalDirective; // CMD + K
  @ViewChild('dateRangePickerCmp') public dateRangePickerCmp: ElementRef;
  @ViewChild('navigationShSelect') public navigationShSelect: ShSelectComponent;

  public title: Observable<string>;
  public flyAccounts: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  public noGroups: boolean;
  public languages: any[] = [
    { name: 'ENGLISH', value: 'en' },
    { name: 'DUTCH', value: 'nl' }
  ];
  public activeFinancialYear: ActiveFinancialYear;
  public datePickerOptions: any = {
    opens: 'left',
    locale: {
      applyClass: 'btn-green',
      applyLabel: 'Go',
      fromLabel: 'From',
      format: 'D-MMM-YY',
      toLabel: 'To',
      cancelLabel: 'Cancel',
      customRangeLabel: 'Custom range'
    },
    ranges: {
      'This Month to Date': [
        moment().startOf('month'),
        moment()
      ],
      'This Quarter to Date': [
        moment().quarter(moment().quarter()).startOf('quarter'),
        moment()
      ],
      'This Financial Year to Date': [
        // moment(this.activeFinancialYear.financialYearStarts).startOf('day'),
        moment(),
        moment()
      ],
      'This Year to Date': [
        moment().startOf('year'),
        moment()
      ],
      'Last Month': [
        moment().startOf('month').subtract(1, 'month'),
        moment().endOf('month').subtract(1, 'month')
      ],
      'Last Quater': [
        moment().quarter(moment().quarter()).startOf('quarter').subtract(1, 'quarter'),
        moment().quarter(moment().quarter()).endOf('quarter').subtract(1, 'quarter')
      ],
      'Last Financial Year': [
        moment(),
        moment()
      ],
      'Last Year': [
        moment().startOf('year').subtract(1, 'year'),
        moment().endOf('year').subtract(1, 'year')
      ]
    },
    startDate: moment().subtract(30, 'days'),
    endDate: moment()
  };
  public sideMenu: { isopen: boolean } = { isopen: false };
  public userMenu: { isopen: boolean } = { isopen: false };
  public companyMenu: { isopen: boolean } = { isopen: false };
  public isCompanyRefreshInProcess$: Observable<boolean>;
  public isCompanyCreationSuccess$: Observable<boolean>;
  public isLoggedInWithSocialAccount$: Observable<boolean>;
  public companies$: Observable<CompanyResponse[]>;
  public selectedCompany: Observable<CompanyResponse>;
  public selectedCompanyCountry: string;
  public markForDeleteCompany: CompanyResponse;
  public deleteCompanyBody: string;
  public user$: Observable<UserDetails>;
  public userIsCompanyUser: boolean = false;
  public userName: string;
  public isProd = ENV;
  public isElectron: boolean = isElectron;
  public isTodaysDateSelected: boolean = false;
  public isDateRangeSelected: boolean = false;
  public userFullName: string;
  public userAvatar: string;
  public navigationOptionList: IOption[] = NAVIGATION_ITEM_LIST;
  public selectedNavigation: string = '';
  public forceClear$: Observable<IForceClear> = observableOf({ status: false });
  public navigationModalVisible: boolean = false;
  public apkVersion: string;
  private loggedInUserEmail: string;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   *
   */
  // tslint:disable-next-line:no-empty
  constructor(private loginAction: LoginActions,
    private socialAuthService: AuthService,
    private store: Store<AppState>,
    private companyActions: CompanyActions,
    private groupWithAccountsAction: GroupWithAccountsAction,
    private router: Router,
    private flyAccountActions: FlyAccountsActions,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdRef: ChangeDetectorRef,
    private zone: NgZone,
    private route: ActivatedRoute,
    private _generalActions: GeneralActions,
    private authService: AuthenticationService) {

    // Reset old stored application date
    this.store.dispatch(this.companyActions.ResetApplicationDate());

    this.isLoggedInWithSocialAccount$ = this.store.select(p => p.login.isLoggedInWithSocialAccount).pipe(takeUntil(this.destroyed$));

    this.user$ = this.store.select(createSelector([(state: AppState) => state.session.user], (user) => {
      if (user) {
        this.loggedInUserEmail = user.user.email;
        return user.user;
      }
    })).pipe(takeUntil(this.destroyed$));

    this.isCompanyRefreshInProcess$ = this.store.select(state => state.session.isRefreshing).pipe(takeUntil(this.destroyed$));

    this.isCompanyCreationSuccess$ = this.store.select(p => p.session.isCompanyCreationSuccess).pipe(takeUntil(this.destroyed$));
    this.companies$ = this.store.select(createSelector([(state: AppState) => state.session.companies], (companies) => {
      if (companies && companies.length) {
        return _.orderBy(companies, 'name');
      }
    })).pipe(takeUntil(this.destroyed$));
    this.selectedCompany = this.store.select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
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

      // Sagar told to change the logic
      // if (selectedCmp.createdBy.email === this.loggedInUserEmail) {
      //   console.log('selectedCmp is :', selectedCmp);
      //   this.userIsSuperUser = true;
      // } else {
      //   this.userIsSuperUser = false;
      // }
      // new logic
      if (selectedCmp.userEntityRoles && selectedCmp.userEntityRoles.length && (selectedCmp.userEntityRoles.findIndex((entity) => entity.role.uniqueName === 'super_admin') === -1)) {
        this.userIsSuperUser = false;
      } else {
        this.userIsSuperUser = true;
      }
      if (selectedCmp) {
        this.activeFinancialYear = selectedCmp.activeFinancialYear;
      }

      if (selectedCmp) {
        this.activeFinancialYear = selectedCmp.activeFinancialYear;
      }
      this.selectedCompanyCountry = selectedCmp.country;
      return selectedCmp;
    })).pipe(takeUntil(this.destroyed$));
    this.session$ = this.store.select(p => p.session.userLoginState).pipe(distinctUntilChanged(), takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.getElectronAppVersion();
    this.store.dispatch(this.companyActions.GetApplicationDate());
    //
    this.user$.pipe(take(1)).subscribe((u) => {
      if (u) {
        let userEmail = u.email;
        // this.getUserAvatar(userEmail);
        let userEmailDomain = userEmail.replace(/.*@/, '');
        if (userEmailDomain && this.companyDomains.indexOf(userEmailDomain) !== -1) {
          this.userIsCompanyUser = true;
        } else {
          this.userIsCompanyUser = false;
        }
        let name = u.name;
        if (u.name.match(/\s/g)) {
          this.userFullName = name;
          let tmpName = name.split(' ');
          this.userName = tmpName[0][0] + tmpName[1][0];
        } else {
          this.userName = u.name[0] + u.name[1];
          this.userFullName = name;
        }

        this.store.dispatch(this.loginAction.renewSession());
      }
    });

    this.manageGroupsAccountsModal.onHidden.subscribe(e => {
      this.store.dispatch(this.groupWithAccountsAction.resetAddAndMangePopup());
    });
    this.accountSearchControl.valueChanges.pipe(
      debounceTime(300))
      .subscribe((newValue) => {
        this.accountSearchValue = newValue;
        if (newValue.length > 0) {
          this.noGroups = true;
        }
        this.filterAccounts(newValue);
      });

    this.store.select(p => p.session.companyUniqueName).pipe(distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(a => {
      if (a && a !== '') {
        this.zone.run(() => {
          this.filterAccounts('');
        });
      }
    });
    this.isCompanyCreationSuccess$.subscribe(created => {
      // TODO see create company response action effect

      // if (created) {
      //   this.store.dispatch(this.loginAction.SetLoginStatus(userLoginStateEnum.userLoggedIn));
      // }
    });
    window.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.keyCode === 27) {
        if (this.sideMenu.isopen) {
          this.sideMenu.isopen = false;
        }
        if (this.manageGroupsAccountsModal.isShown) {
          this.hideManageGroupsModal();
        }
      }
    });
  }

  public ngAfterViewInit() {
    this.session$.subscribe((s) => {
      if (s === userLoginStateEnum.notLoggedIn) {
        this.router.navigate(['/login']);
      } else if (s === userLoginStateEnum.newUserLoggedIn) {
        // this.router.navigate(['/pages/dummy'], { skipLocationChange: true }).then(() => {
        this.router.navigate(['/new-user']);
        // });
      } else {
        // get groups with accounts for general use
        this.store.dispatch(this._generalActions.getGroupWithAccounts());
        this.store.dispatch(this._generalActions.getAllState());
        this.store.dispatch(this._generalActions.getFlattenAccount());
      }
    });
    if (this.route.snapshot.url.toString() === 'new-user') {
      this.showAddCompanyModal();
    }
    this.store.dispatch(this.loginAction.FetchUserDetails());

    // Get universal date
    this.store.select(createSelector([(state: AppState) => state.session.applicationDate], (dateObj: Date[]) => {
      if (dateObj && dateObj.length) {
        if (!this.isDateRangeSelected) {
          this.datePickerOptions.startDate = moment(dateObj[0]);
          this.datePickerOptions.endDate = moment(dateObj[1]);
          this.isDateRangeSelected = true;
          const from: any = moment().subtract(30, 'days').format(GIDDH_DATE_FORMAT);
          const to: any = moment().format(GIDDH_DATE_FORMAT);
          const fromFromStore = moment(dateObj[0]).format(GIDDH_DATE_FORMAT);
          const toFromStore = moment(dateObj[1]).format(GIDDH_DATE_FORMAT);

          if (from === fromFromStore && to === toFromStore) {
            this.isTodaysDateSelected = true;
          }
        }
        let fromForDisplay = moment(dateObj[0]).format('D-MMM-YY');
        let toForDisplay = moment(dateObj[1]).format('D-MMM-YY');
        if (this.dateRangePickerCmp) {
          this.dateRangePickerCmp.nativeElement.value = `${fromForDisplay} - ${toForDisplay}`;
        }
      }
    })).subscribe();
  }

  public ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  public showManageGroupsModal() {
    this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(''));
    this.loadAddManageComponent();
    this.manageGroupsAccountsModal.show();
  }

  public hideManageGroupsModal() {
    this.store.select(c => c.session.lastState).pipe(take(1)).subscribe((s: string) => {
      if (s && (s.indexOf('ledger/') > -1 || s.indexOf('settings') > -1)) {
        this.store.dispatch(this._generalActions.addAndManageClosed());
      }
    });

    this.manageGroupsAccountsModal.hide();
  }

  public showAddCompanyModal() {
    this.loadAddCompanyNewUiComponent();
    this.addCompanyNewModal.show();
  }

  public hideAddCompanyModal() {
    this.addCompanyNewModal.hide();
  }

  public hideCompanyModalAndShowAddAndManage() {
    this.addCompanyModal.hide();
    this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(''));
    this.manageGroupsAccountsModal.show();
  }

  public refreshCompanies(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.store.dispatch(this.companyActions.RefreshCompanies());
  }

  public changeCompany(selectedCompanyUniqueName: string) {
    this.store.dispatch(this.loginAction.ChangeCompany(selectedCompanyUniqueName));
  }

  public deleteCompany(e: Event) {
    e.stopPropagation();
    this.store.dispatch(this.companyActions.DeleteCompany(this.markForDeleteCompany.uniqueName));
    this.hideDeleteCompanyModal(e);
  }

  public showDeleteCompanyModal(company: CompanyResponse, e: Event) {
    this.markForDeleteCompany = company;
    this.deleteCompanyBody = `Are You Sure You Want To Delete ${company.name} ? `;
    this.deleteCompanyModal.show();
    e.stopPropagation();
  }

  public hideDeleteCompanyModal(e: Event) {
    e.stopPropagation();
    this.deleteCompanyModal.hide();
  }

  public logout() {
    if (isElectron) {
      // this._aunthenticationServer.GoogleProvider.signOut();
      this.store.dispatch(this.loginAction.ClearSession());
    } else {
      // check if logged in via social accounts
      this.isLoggedInWithSocialAccount$.subscribe((val) => {
        if (val) {
          this.socialAuthService.signOut().then(() => {
            this.store.dispatch(this.loginAction.ClearSession());
            this.store.dispatch(this.loginAction.socialLogoutAttempt());
          }).catch((err) => {
            this.store.dispatch(this.loginAction.ClearSession());
            this.store.dispatch(this.loginAction.socialLogoutAttempt());
          });

        } else {
          this.store.dispatch(this.loginAction.ClearSession());
        }
      });

    }
  }

  public onHide() {
    this.store.dispatch(this.companyActions.ResetCompanyPopup());
  }

  public onShown() {
    //
  }

  public loadAddCompanyComponent() {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(CompanyAddComponent);
    let viewContainerRef = this.companyadd.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as CompanyAddComponent).closeCompanyModal.subscribe((a) => {
      this.hideAddCompanyModal();
    });
    (componentRef.instance as CompanyAddComponent).closeCompanyModalAndShowAddManege.subscribe((a) => {
      this.hideCompanyModalAndShowAddAndManage();
    });
  }

  public loadAddCompanyNewUiComponent() {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(CompanyAddNewUiComponent);
    let viewContainerRef = this.companynewadd.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as CompanyAddNewUiComponent).closeCompanyModal.subscribe((a) => {
      this.hideAddCompanyModal();
    });
    (componentRef.instance as CompanyAddNewUiComponent).closeCompanyModalAndShowAddManege.subscribe((a) => {
      this.hideCompanyModalAndShowAddAndManage();
    });
  }

  public loadAddManageComponent() {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(ManageGroupsAccountsComponent);
    let viewContainerRef = this.addmanage.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as ManageGroupsAccountsComponent).closeEvent.subscribe((a) => {
      this.hideManageGroupsModal();
      viewContainerRef.remove();
    });
    this.manageGroupsAccountsModal.onShown.subscribe((a => {
      (componentRef.instance as ManageGroupsAccountsComponent).headerRect = (componentRef.instance as ManageGroupsAccountsComponent).header.nativeElement.getBoundingClientRect();
      (componentRef.instance as ManageGroupsAccountsComponent).myModelRect = (componentRef.instance as ManageGroupsAccountsComponent).myModel.nativeElement.getBoundingClientRect();
    }));
  }

  public filterAccounts(q: string) {
    this.store.dispatch(this.flyAccountActions.GetflatAccountWGroups(q));
  }

  public sideBarStateChange(event: boolean) {
    this.sideMenu.isopen = event;
  }

  public forceCloseSidebar(event) {
    if (event.target.parentElement.classList.contains('wrapAcList')) {
      return;
    }
    this.flyAccounts.next(false);
  }

  public closeSidebar(targetId) {
    if (targetId === 'accountSearch' || targetId === 'expandAllGroups' || targetId === 'toggleAccounts') {
      return;
    }
    this.flyAccounts.next(false);
  }

  public setApplicationDate(ev) {
    let data = ev ? _.cloneDeep(ev) : null;
    if (data && data.picker) {

      if (data.picker.chosenLabel === 'This Financial Year to Date') {
        data.picker.startDate = moment(_.clone(this.activeFinancialYear.financialYearStarts), 'DD-MM-YYYY').startOf('day');
      }
      if (data.picker.chosenLabel === 'Last Financial Year') {
        data.picker.startDate = moment(_.clone(this.activeFinancialYear.financialYearStarts), 'DD-MM-YYYY').subtract(1, 'year');
        data.picker.endDate = moment(_.clone(this.activeFinancialYear.financialYearEnds), 'DD-MM-YYYY').subtract(1, 'year');
      }
      this.isTodaysDateSelected = false;
      let dates = {
        fromDate: moment(data.picker.startDate._d).format(GIDDH_DATE_FORMAT),
        toDate: moment(data.picker.endDate._d).format(GIDDH_DATE_FORMAT)
      };
      this.store.dispatch(this.companyActions.SetApplicationDate(dates));
    } else {
      this.isTodaysDateSelected = true;
      let today = _.cloneDeep([moment(), moment()]);
      this.datePickerOptions.startDate = today[0];
      this.datePickerOptions.endDate = today[1];
      let dates = {
        fromDate: null,
        toDate: null,
        duration: 1,
        period: 'MONTH'
      };
      this.store.dispatch(this.companyActions.SetApplicationDate(dates));
    }
  }

  public openDateRangePicker() {
    this.isTodaysDateSelected = false;
  }

  public jumpToToday() {
    this.setApplicationDate(null);
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public getUserAvatar(userId) {
    // this.authService.getUserAvatar(userId).subscribe(res => {
    //   let data = res;
    //   this.userAvatar = res.entry.gphoto$thumbnail.$t;
    // });
  }

  // CMD + K functionality
  @HostListener('document:keydown', ['$event'])
  public handleKeyboardUpEvent(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.which === 75 && !this.navigationModalVisible) {
      event.preventDefault();
      event.stopPropagation();
      this.showNavigationModal();
    }
  }

  public onNavigationSelected(ev: IOption) {
    this.hideNavigationModal();
    if (ev && ev.value) {
      if (ev.additional && ev.additional.tab) {
        this.router.navigate([ev.value], { queryParams: { tab: ev.additional.tab, tabIndex: ev.additional.tabIndex } });
      } else {
        this.router.navigate([ev.value]);
      }
    }
  }

  public onNavigationHide(ev) {
    if (this.navigationModalVisible) {
      this.hideNavigationModal();
    }
  }

  private showNavigationModal() {
    this.navigationOptionList.forEach((ele) => {
      ele.isHilighted = false;
    });
    this.forceClear$ = observableOf({ status: false });
    this.navigationModalVisible = true;
    this.navigationModal.show();
    setTimeout(() => this.navigationShSelect.show(''), 200);
  }

  private hideNavigationModal() {
    this.forceClear$ = observableOf({ status: true });
    this.selectedNavigation = '';
    this.navigationModalVisible = false;
    this.navigationModal.hide();
    // setTimeout(() => this.navigationShSelect.showListFirstTime = false, 200);
  }

  private getElectronAppVersion() {
    this.authService.GetElectronAppVersion().subscribe((res: string) => {
      let version = res.split('files')[0];
      let versNum = version.split(' ')[1];
      this.apkVersion = versNum;
    });
  }
}

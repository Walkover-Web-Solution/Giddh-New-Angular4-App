import { setTimeout } from 'timers';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_UI } from './../helpers/defaultDateFormat';
import { CompanyAddComponent } from './components';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, NgZone, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ModalDirective } from 'ngx-bootstrap';
import { AppState } from '../../store';
import { LoginActions } from '../../actions/login.action';
import { CompanyActions } from '../../actions/company.actions';
import { CompanyResponse } from '../../models/api-models/Company';
import { UserDetails } from '../../models/api-models/loginModels';
import { GroupWithAccountsAction } from '../../actions/groupwithaccounts.actions';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from '../../lodash-optimized';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ElementViewContainerRef } from '../helpers/directives/elementViewChild/element.viewchild.directive';
import { ManageGroupsAccountsComponent } from './components';
import { FlyAccountsActions } from '../../actions/fly-accounts.actions';
import { FormControl } from '@angular/forms';
import { AuthService } from 'ng4-social-login';
import { userLoginStateEnum } from '../../store/authentication/authentication.reducer';
import { GeneralActions } from '../../actions/general/general.actions';
import { createSelector } from 'reselect';
import * as moment from 'moment/moment';
import { DaterangePickerComponent } from 'app/theme/ng2-daterangepicker/daterangepicker.component';
import { AuthenticationService } from '../../services/authentication.service';

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
  // @ViewChildren(ElementViewContainerRef) public test: ElementViewContainerRef;

  @ViewChild('addmanage') public addmanage: ElementViewContainerRef;
  @ViewChild('manageGroupsAccountsModal') public manageGroupsAccountsModal: ModalDirective;
  @ViewChild('addCompanyModal') public addCompanyModal: ModalDirective;

  @ViewChild('deleteCompanyModal') public deleteCompanyModal: ModalDirective;
  @ViewChild('dateRangePickerCmp') public dateRangePickerCmp: ElementRef;

  public title: Observable<string>;
  public flyAccounts: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  public noGroups: boolean;
  public languages: any[] = [
    { name: 'ENGLISH', value: 'en' },
    { name: 'DUTCH', value: 'nl' }
  ];
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
      'Last 1 Day': [
        moment().subtract(1, 'days'),
        moment()
      ],
      'Last 7 Days': [
        moment().subtract(6, 'days'),
        moment()
      ],
      'Last 30 Days': [
        moment().subtract(29, 'days'),
        moment()
      ],
      'Last 6 Months': [
        moment().subtract(6, 'months'),
        moment()
      ],
      'Last 1 Year': [
        moment().subtract(12, 'months'),
        moment()
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

    this.isLoggedInWithSocialAccount$ = this.store.select(p => p.login.isLoggedInWithSocialAccount).takeUntil(this.destroyed$);

    this.user$ = this.store.select(createSelector([(state: AppState) => state.session.user], (user) => {
      if (user) {
        this.loggedInUserEmail = user.user.email;
        return user.user;
      }
    })).takeUntil(this.destroyed$);

    this.isCompanyRefreshInProcess$ = this.store.select(state => state.session.isRefreshing).takeUntil(this.destroyed$);

    this.isCompanyCreationSuccess$ = this.store.select(p => p.session.isCompanyCreationSuccess).takeUntil(this.destroyed$);
    this.companies$ = this.store.select(createSelector([(state: AppState) => state.session.companies], (companies) => {
      if (companies && companies.length) {
        return _.orderBy(companies, 'name');
      }
    })).takeUntil(this.destroyed$);
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
      if (selectedCmp.createdBy.email === this.loggedInUserEmail) {
        this.userIsSuperUser = true;
      } else {
        this.userIsSuperUser = false;
      }
      this.selectedCompanyCountry = selectedCmp.country;
      return selectedCmp;
    })).takeUntil(this.destroyed$);
    this.session$ = this.store.select(p => p.session.userLoginState).distinctUntilChanged().takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.store.dispatch(this.companyActions.GetApplicationDate());
    //
    this.user$.subscribe((u) => {
      if (u) {
        let userEmail = u.email;
        // this.getUserAvatar(userEmail);
        let userEmailDomain = userEmail.replace(/.*@/, '');
        if (userEmailDomain && this.companyDomains.indexOf(userEmailDomain) !== -1) {
          this.userIsCompanyUser = true;
        } else {
          this.userIsCompanyUser = false;
        }
        if (u.name.match(/\s/g)) {
          let name = u.name;
          this.userFullName = name;
          let tmpName = name.split(' ');
          this.userName = tmpName[0][0] + tmpName[1][0];
        } else {
          this.userName = u.name[0] + u.name[1];
          this.userFullName = name;
        }
      }
    });

    this.manageGroupsAccountsModal.onHidden.subscribe(e => {
      this.store.dispatch(this.groupWithAccountsAction.resetAddAndMangePopup());
    });
    this.accountSearchControl.valueChanges
      .debounceTime(300)
      .subscribe((newValue) => {
        this.accountSearchValue = newValue;
        if (newValue.length > 0) {
          this.noGroups = true;
        }
        this.filterAccounts(newValue);
      });

    this.store.select(p => p.session.companyUniqueName).distinctUntilChanged().takeUntil(this.destroyed$).subscribe(a => {
      if (a && a !== '') {
        this.zone.run(() => {
          this.filterAccounts('');
        });
      }
    });
    this.isCompanyCreationSuccess$.subscribe(created => {
      if (created) {
        this.store.dispatch(this.loginAction.SetLoginStatus(userLoginStateEnum.userLoggedIn));
      }
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
    this.store.select(c => c.session.lastState).take(1).subscribe((s: string) => {
      if (s && s.indexOf('ledger/') > -1) {
        this.store.dispatch(this._generalActions.addAndManageClosed());
      }
    });

    this.manageGroupsAccountsModal.hide();
  }

  public showAddCompanyModal() {
    this.loadAddCompanyComponent();
    this.addCompanyModal.show();
  }

  public hideAddCompanyModal() {
    this.addCompanyModal.hide();
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
    // get groups with accounts for general use
    this.store.dispatch(this._generalActions.getGroupWithAccounts());
    this.store.dispatch(this._generalActions.getFlattenAccount());
    // }
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
        // debugger;
        if (val) {
          this.socialAuthService.signOut().then(() => {
            // debugger;
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
    if (event.target.parentElement.classList.contains('wrapAcList') ) {
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
    this.authService.getUserAvatar(userId).subscribe(res => {
      let data = res;
      this.userAvatar = res.entry.gphoto$thumbnail.$t;
    });
  }
}

import { CompanyAddComponent } from './components';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('companyadd') public companyadd: ElementViewContainerRef;
  // @ViewChildren(ElementViewContainerRef) public test: ElementViewContainerRef;

  @ViewChild('addmanage') public addmanage: ElementViewContainerRef;
  @ViewChild('manageGroupsAccountsModal') public manageGroupsAccountsModal: ModalDirective;
  @ViewChild('addCompanyModal') public addCompanyModal: ModalDirective;

  @ViewChild('deleteCompanyModal') public deleteCompanyModal: ModalDirective;
  public title: Observable<string>;
  public flyAccounts: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  public noGroups: boolean;
  public languages: any[] = [
    { name: 'ENGLISH', value: 'en' },
    { name: 'DUTCH', value: 'nl' }
  ];
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
  public userName: string;
  public isProd = ENV;
  public isElectron: boolean = isElectron;
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
    private _generalActions: GeneralActions) {

    this.isLoggedInWithSocialAccount$ = this.store.select(p => p.login.isLoggedInWithSocialAccount).takeUntil(this.destroyed$);

    this.user$ = this.store.select(createSelector([(state: AppState) => state.session.user], (user) => {
      if (user) {
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
      this.selectedCompanyCountry = selectedCmp.country;
      return selectedCmp;
    })).takeUntil(this.destroyed$);
    this.session$ = this.store.select(p => p.session.userLoginState).distinctUntilChanged().takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    //
    this.user$.subscribe((u) => {
      if (u) {
        if (u.name.match(/\s/g)) {
          let name = u.name;
          let tmpName = name.split(' ');
          this.userName = tmpName[0][0] + tmpName[1][0];
        } else {
          this.userName = u.name[0] + u.name[1];
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
      if (a) {
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
        if (val) {
          this.socialAuthService.signOut().then().catch((err) => {
            // console.log('err', err);
          });
          this.store.dispatch(this.loginAction.ClearSession());
          this.store.dispatch(this.loginAction.socialLogoutAttempt());
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

  public closeSidebar(targetId) {
    if (targetId === 'accountSearch' || targetId === 'expandAllGroups' || targetId === 'toggleAccounts') {
      return;
    }
    this.flyAccounts.next(false);
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

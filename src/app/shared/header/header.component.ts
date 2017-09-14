import { CompanyAddComponent } from './components/company-add/company-add.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, NgZone, OnDestroy, OnInit,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ModalDirective } from 'ngx-bootstrap';
import { AppState } from '../../store/roots';
import { LoginActions } from '../../services/actions/login.action';
import { CompanyActions } from '../../services/actions/company.actions';
import { ComapnyResponse, StateDetailsRequest } from '../../models/api-models/Company';
import { UserDetails } from '../../models/api-models/loginModels';
import { GroupWithAccountsAction } from '../../services/actions/groupwithaccounts.actions';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ElementViewContainerRef } from '../helpers/directives/element.viewchild.directive';
import { ManageGroupsAccountsComponent } from './components/new-manage-groups-accounts/manage-groups-accounts.component';
import { FlyAccountsActions } from '../../services/actions/fly-accounts.actions';
import { FormControl } from '@angular/forms';
import { AuthService } from 'ng4-social-login';
import { userLoginStateEnum } from '../../store/authentication/authentication.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
  public userIsSuperUser: boolean = false; // Protect permission module
  public session$: Observable<userLoginStateEnum>;
  public accountSearchValue: string = '';
  public accountSearchControl: FormControl = new FormControl();
  @ViewChild('companyadd') public companyadd: ElementViewContainerRef;
  @ViewChildren(ElementViewContainerRef) public test: ElementViewContainerRef;

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
  public isLoggedInWithSocialAccount$: Observable<boolean>;
  public companies$: Observable<ComapnyResponse[]>;
  public selectedCompany: Observable<ComapnyResponse>;
  public markForDeleteCompany: ComapnyResponse;
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
    private route: ActivatedRoute) {

    this.isLoggedInWithSocialAccount$ = this.store.select(p => p.login.isLoggedInWithSocialAccount).takeUntil(this.destroyed$);

    this.user$ = this.store.select(state => {
      if (state.session.user) {
        return state.session.user.user;
      }
    }).takeUntil(this.destroyed$);

    this.isCompanyRefreshInProcess$ = this.store.select(state => {
      return state.session.isRefreshing;
    }).takeUntil(this.destroyed$);

    this.companies$ = this.store.select(state => {
      return _.orderBy(state.session.companies, 'name');
    }).takeUntil(this.destroyed$);

    this.selectedCompany = this.store.select(state => {
      if (!state.session.companies) {
        return;
      }

      let selectedCmp = state.session.companies.find(cmp => {
        return cmp.uniqueName === state.session.companyUniqueName;
      });
      if (!selectedCmp) {
        return;
      }
      if (selectedCmp.uniqueName === state.session.companyUniqueName && selectedCmp.role.uniqueName === 'super_admin') {
        this.userIsSuperUser = true;
      } else {
        this.userIsSuperUser = false;
      }
      return selectedCmp;

    }).takeUntil(this.destroyed$);
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
      .debounceTime(1000)
      .subscribe((newValue) => {
        this.accountSearchValue = newValue;
        this.filterAccounts(newValue);
      });

    this.store.select(p => p.session.companyUniqueName).distinctUntilChanged().takeUntil(this.destroyed$).subscribe(a => {
      if (a) {
        this.zone.run(() => {
          this.filterAccounts('');
        });
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
      }
    });
    if (this.route.snapshot.url.toString() === 'new-user') {
      this.showAddCompanyModal();
    }
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
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = selectedCompanyUniqueName;
    stateDetailsRequest.lastState = 'company.content.ledgerContent@giddh';

    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
  }

  public deleteCompany(e: Event) {
    e.stopPropagation();
    this.store.dispatch(this.companyActions.DeleteCompany(this.markForDeleteCompany.uniqueName));
    this.hideDeleteCompanyModal(e);
  }

  public showDeleteCompanyModal(company: ComapnyResponse, e: Event) {
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
      this.store.dispatch(this.loginAction.LogOut());
    } else {
      // check if logged in via social accounts
      this.isLoggedInWithSocialAccount$.subscribe((val) => {
        if (val) {
          this.socialAuthService.signOut().then().catch((err) => {
            console.log('err', err);
          });
          this.store.dispatch(this.loginAction.socialLogoutAttempt());
          this.store.dispatch(this.loginAction.LogOut());
        } else {
          this.store.dispatch(this.loginAction.LogOut());
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
    });
    this.manageGroupsAccountsModal.onShown.subscribe((a => {
      (componentRef.instance as ManageGroupsAccountsComponent).headerRect = (componentRef.instance as ManageGroupsAccountsComponent).header.nativeElement.getBoundingClientRect();
      (componentRef.instance as ManageGroupsAccountsComponent).myModelRect = (componentRef.instance as ManageGroupsAccountsComponent).myModel.nativeElement.getBoundingClientRect();
    }));
  }

  public filterAccounts(q: string) {
    this.store.dispatch(this.flyAccountActions.GetflatAccountWGroups(q));
  }

  public closeSidebar(targetId) {
    if (targetId === 'accountSearch' || targetId === 'expandAllGroups') {
      return;
    }
    this.flyAccounts.next(false);
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

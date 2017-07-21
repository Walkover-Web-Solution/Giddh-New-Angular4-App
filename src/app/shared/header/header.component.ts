import { CompanyAddComponent } from './components/company-add/company-add.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild,
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
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ElementViewContainerRef } from '../helpers/directives/element.viewchild.directive';
import { ManageGroupsAccountsComponent } from './components/new-manage-groups-accounts/manage-groups-accounts.component';
import { FlyAccountsActions } from '../../services/actions/fly-accounts.actions';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
  public session$: Observable<boolean>;
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
  public companies$: Observable<ComapnyResponse[]>;
  public selectedCompany: Observable<ComapnyResponse>;
  public markForDeleteCompany: ComapnyResponse;
  public deleteCompanyBody: string;
  public user$: Observable<UserDetails>;
  public userName: string;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   *
   */
  // tslint:disable-next-line:no-empty
  constructor(private loginAction: LoginActions,
    private store: Store<AppState>,
    private companyActions: CompanyActions,
    private groupWithAccountsAction: GroupWithAccountsAction,
    private router: Router,
    private flyAccountActions: FlyAccountsActions,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdRef: ChangeDetectorRef) {
    this.user$ = this.store.select(state => {
      if (state.session.user) {
        return state.session.user.user;
      }
    }).takeUntil(this.destroyed$);

    this.isCompanyRefreshInProcess$ = this.store.select(state => {
      return state.company.isRefreshing;
    }).takeUntil(this.destroyed$);

    this.companies$ = this.store.select(state => {
      return _.orderBy(state.company.companies, 'name');
    }).takeUntil(this.destroyed$);

    this.selectedCompany = this.store.select(state => {
      if (!state.company.companies) {
        return;
      }
      return state.company.companies.find(cmp => {
        return cmp.uniqueName === state.session.companyUniqueName;
      });
    }).takeUntil(this.destroyed$);
    this.session$ = this.store.select(p => (p.session.user !== null && p.session.user.user !== null && p.session.user.authKey !== null)).takeUntil(this.destroyed$);

  }

  public ngOnInit() {
    this.store.dispatch(this.loginAction.LoginSuccess());
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
  }

  public ngAfterViewInit() {
    this.session$.subscribe((s) => {
      if (!s) {
        this.router.navigate(['/login']);
      }
    });
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
    e.stopPropagation();
  }

  public changeCompany(selectedCompanyUniqueName: string) {
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = selectedCompanyUniqueName;
    stateDetailsRequest.lastState = 'company.content.ledgerContent@giddh';

    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
  }

  public deleteCompany() {
    this.store.dispatch(this.companyActions.DeleteCompany(this.markForDeleteCompany.uniqueName));
    this.hideDeleteCompanyModal();
  }

  public showDeleteCompanyModal(company: ComapnyResponse, e: Event) {
    this.markForDeleteCompany = company;
    this.deleteCompanyBody = `Are You Sure You Want To Delete ${company.name} ? `;
    this.deleteCompanyModal.show();
    e.stopPropagation();
  }

  public hideDeleteCompanyModal() {
    this.deleteCompanyModal.hide();
  }

  public logout() {
    this.store.dispatch(this.loginAction.LogOut());

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

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Rx';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ManageGroupsAccountsComponent } from './components/';
import { ModalDirective } from 'ngx-bootstrap';
import { AppState } from '../../store/roots';
import { LoginActions } from '../../services/actions/login.action';
import { CompanyActions } from '../../services/actions/company.actions';
import { ComapnyResponse, StateDetailsResponse, StateDetailsRequest } from '../../models/api-models/Company';
import { UserDetails } from '../../models/api-models/loginModels';
import { GroupWithAccountsAction } from '../../services/actions/groupwithaccounts.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('manageGroupsAccountsModal') public manageGroupsAccountsModal: ModalDirective;
  @ViewChild('addCompanyModal') public addCompanyModal: ModalDirective;

  @ViewChild('deleteCompanyModal') public deleteCompanyModal: ModalDirective;
  public title: Observable<string>;
  public flyAccounts: Subject<boolean> = new Subject<boolean>();
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

  /**
   *
   */
  // tslint:disable-next-line:no-empty
  constructor(
    private loginAction: LoginActions,
    private store: Store<AppState>,
    private companyActions: CompanyActions,
    private groupWithAccountsAction: GroupWithAccountsAction
  ) {
    this.user$ = this.store.select(state => {
      return state.session.user.user;
    });

    this.isCompanyRefreshInProcess$ = this.store.select(state => {
      return state.company.isRefreshing;
    });

    this.companies$ = this.store.select(state => {
      return state.company.companies;
    });

    this.selectedCompany = this.store.select(state => {
      if (!state.company.companies) {
        return;
      }
      return state.company.companies.find(cmp => {
        return cmp.uniqueName === state.session.companyUniqueName;
      });
    });
  }
  // tslint:disable-next-line:no-empty
  public ngOnInit() {
    this.store.dispatch(this.loginAction.LoginSuccess());
    this.user$.subscribe((u) => {
      if (u.name.match(/\s/g)) {
        let name = u.name;
        let tmpName = name.split(' ');
        this.userName = tmpName[0][0] + tmpName[1][0];
      } else {
        this.userName = u.name[0] + u.name[1];
      }
    });

    this.manageGroupsAccountsModal.onHidden.subscribe(e => {
      this.store.dispatch(this.groupWithAccountsAction.resetAddAndMangePopup());
    });
  }
  // tslint:disable-next-line:no-empty
  public ngAfterViewInit() {
  }

  public showManageGroupsModal() {
    this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(''));
    this.manageGroupsAccountsModal.show();
  }

  public hideManageGroupsModal() {
    this.manageGroupsAccountsModal.hide();
  }

  public showAddCompanyModal() {
    this.addCompanyModal.show();
  }

  public hideAddCompanyModal() {
    this.addCompanyModal.hide();
  }

  public refreshCompanies(e: Event) {
    this.store.dispatch(this.companyActions.RefreshCompanies());
    e.stopPropagation();
  }

  public changeCompany(selectedCompanyUniqueName: string, e: Event) {
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = selectedCompanyUniqueName;
    stateDetailsRequest.lastState = 'company.content.ledgerContent@giddh';

    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    e.stopPropagation();
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
}

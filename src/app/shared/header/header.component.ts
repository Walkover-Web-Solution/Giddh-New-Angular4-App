import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Rx';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ManageGroupsAccountsComponent } from './components/';
import { ModalDirective } from 'ngx-bootstrap';
import { AppState } from '../../store/roots';
import { CompanyActions } from '../../services/actions';
import { ComapnyResponse } from '../../models/index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [`
    `]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('manageGroupsAccountsModal') public manageGroupsAccountsModal: ModalDirective;
  @ViewChild('addCompanyModal') public addCompanyModal: ModalDirective;
  public title: Observable<string>;
  public flyAccounts: Subject<boolean>= new Subject<boolean>();
  public noGroups: boolean;
  public languages: any[] = [{ name: 'ENGLISH', value: 'en' }, { name: 'DUTCH', value: 'nl' }];
  public sideMenu: {isopen: boolean} = {isopen: false};
  public userMenu: {isopen: boolean} = {isopen: false};
  public companyMenu: {isopen: boolean} = {isopen: false};
  public isCompanyRefreshInProcess$: Observable<boolean>;
  public companies$: Observable<ComapnyResponse[]>;

  /**
   *
   */
  // tslint:disable-next-line:no-empty
  constructor(private store: Store<AppState>, private companyActions: CompanyActions) {

    this.isCompanyRefreshInProcess$ = this.store.select(state => {
      return state.company.isRefreshing;
    });

    this.companies$ = this.store.select(state => {
      return state.company.companies;
    });
   }
  // tslint:disable-next-line:no-empty
  public ngOnInit() { }
  // tslint:disable-next-line:no-empty
  public ngAfterViewInit() { }

  public showManageGroupsModal() {
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
  }
}

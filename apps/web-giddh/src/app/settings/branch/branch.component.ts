import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { take, takeUntil } from 'rxjs/operators';
import { createSelector } from 'reselect';
import { Store, select } from '@ngrx/store';
import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AppState } from '../../store/roots';
import * as _ from '../../lodash-optimized';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { BsDropdownConfig, ModalDirective } from 'ngx-bootstrap';
import { CompanyAddComponent } from '../../shared/header/components';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { CompanyResponse } from '../../models/api-models/Company';
import { CompanyActions } from '../../actions/company.actions';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

export const IsyncData = [
  { label: 'Debtors', value: 'debtors' },
  { label: 'Creditors', value: 'creditors' },
  { label: 'Inventory', value: 'inventory' },
  { label: 'Taxes', value: 'taxes' },
  { label: 'Bank', value: 'bank' }
];

@Component({
  selector: 'setting-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css'],
  providers: [{ provide: BsDropdownConfig, useValue: { autoClose: false } }]
})

export class BranchComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('branchModal') public branchModal: ModalDirective;
  @ViewChild('addCompanyModal') public addCompanyModal: ModalDirective;
  @ViewChild('companyadd') public companyadd: ElementViewContainerRef;
  @ViewChild('confirmationModal') public confirmationModal: ModalDirective;
  public bsConfig: Partial<BsDatepickerConfig> = {
    showWeekNumbers: false,
    dateInputFormat: 'DD-MM-YYYY',
    rangeInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-green myDpClass'
  };
  public dataSyncOption = IsyncData;
  public currentBranch: string = null;
  public currentBranchNameAlias: string = null;
  public companies$: Observable<CompanyResponse[]>;
  public branches$: Observable<CompanyResponse[]>;
  public selectedCompaniesUniquename: string[] = [];
  public selectedCompaniesName: any[] = [];
  public isAllSelected$: Observable<boolean> = observableOf(false);
  public confirmationMessage: string = '';
  public parentCompanyName: string = null;
  public selectedBranch: string = null;
  public isBranch: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public branchCardView = false;
  public branchTableView = true;
  public hideOldData = false;
  branchTable = [
    {
      BranchName: "{{branch.name}}",
      GSTIN: '-',
      ContactNumber: '1234567890',
      TotalSales: '25,00,000',
      TotalExpenses: '1,21,900',
      TotalTaxes: '58,000',
      TotalStock: '30,00,000',
    },
    {
      BranchName: "{{branch.name}}",
      GSTIN: '-',
      ContactNumber: '1234567890',
      TotalSales: '25,00,000',
      TotalExpenses: '1,21,900',
      TotalTaxes: '58,000',
      TotalStock: '30,00,000',
    },
    {
      BranchName: "{{branch.name}}",
      GSTIN: '-',
      ContactNumber: '1234567890',
      TotalSales: '25,00,000',
      TotalExpenses: '1,21,900',
      TotalTaxes: '58,000',
      TotalStock: '30,00,000',
    },
    {
      BranchName: "{{branch.name}}",
      GSTIN: '-',
      ContactNumber: '1234567890',
      TotalSales: '25,00,000',
      TotalExpenses: '1,21,900',
      TotalTaxes: '58,000',
      TotalStock: '30,00,000',
    }
  ]




  constructor(
    private store: Store<AppState>,
    private settingsBranchActions: SettingsBranchActions,
    private componentFactoryResolver: ComponentFactoryResolver,
    private companyActions: CompanyActions,
    private settingsProfileActions: SettingsProfileActions
  ) {

    this.store.select(p => p.settings.profile).pipe(takeUntil(this.destroyed$)).subscribe((o) => {
      if (o && !_.isEmpty(o)) {
        let companyInfo = _.cloneDeep(o);
        this.currentBranch = companyInfo.name;
        this.currentBranchNameAlias = companyInfo.nameAlias;
      }
    });

    this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
    this.store.dispatch(this.settingsBranchActions.GetALLBranches());
    this.store.dispatch(this.settingsBranchActions.GetParentCompany());

    this.store.select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.settings.branches, (state: AppState) => state.settings.parentCompany], (companies, branches, parentCompany) => {
      if (branches) {
        if (branches.results.length) {
          _.each(branches.results, (branch) => {
            if (branch.addresses && branch.addresses.length) {
              branch.addresses = [_.find(branch.addresses, (gst) => gst.isDefault)];
            }
          });
          this.branches$ = observableOf(_.orderBy(branches.results, 'name'));
        } else if (branches.results.length === 0) {
          this.branches$ = observableOf(null);
        }
      }
      if (companies && companies.length && branches) {
        let companiesWithSuperAdminRole = [];
        _.each(companies, (cmp) => {
          _.each(cmp.userEntityRoles, (company) => {
            if (company.entity.entity === 'COMPANY' && company.role.uniqueName === 'super_admin') {
              if (branches && branches.results.length) {
                let existIndx = branches.results.findIndex((b) => b.uniqueName === cmp.uniqueName);
                if (existIndx === -1) {
                  companiesWithSuperAdminRole.push(cmp);
                }
              } else {
                companiesWithSuperAdminRole.push(cmp);
              }
            }
          });
        });
        this.companies$ = observableOf(_.orderBy(companiesWithSuperAdminRole, 'name'));
      }
      if (parentCompany) {
        setTimeout(() => {
          this.parentCompanyName = parentCompany.name;
        }, 10);
      } else {
        setTimeout(() => {
          this.parentCompanyName = null;
        }, 10);
      }
    })).pipe(takeUntil(this.destroyed$)).subscribe();

  }

  public ngOnInit() {
    this.store.pipe(select(s => s.session.createBranchUserStoreRequestObj), takeUntil(this.destroyed$)).subscribe(res => {
      if (res) {
        if (res.isBranch) {
          this.isBranch = res.isBranch;
        }
      }
    });
  }
  public ngAfterViewInit() {
    if (this.isBranch) {
      this.openCreateCompanyModal()
    }
  }

  public openCreateCompanyModal() {
    this.loadAddCompanyComponent();
    this.hideAddBranchModal();
    this.addCompanyModal.show();
  }

  public hideAddCompanyModal() {
    this.addCompanyModal.hide();
  }

  public hideCompanyModalAndShowAddAndManage() {
    this.addCompanyModal.hide();
  }

  public loadAddCompanyComponent() {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(CompanyAddComponent);
    let viewContainerRef = this.companyadd.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as CompanyAddComponent).createBranch = true;
    (componentRef.instance as CompanyAddComponent).closeCompanyModal.subscribe((a) => {
      this.hideAddCompanyModal();
    });
    (componentRef.instance as CompanyAddComponent).closeCompanyModalAndShowAddManege.subscribe((a) => {
      this.hideCompanyModalAndShowAddAndManage();
    });
  }

  public openAddBranchModal() {
    this.branchModal.show();
  }

  public onHide() {
    // let companyUniqueName = null;
    // this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
    // let stateDetailsRequest = new StateDetailsRequest();
    // stateDetailsRequest.companyUniqueName = companyUniqueName;
    // stateDetailsRequest.lastState = 'settings';
    // this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
  }

  public hideAddBranchModal() {
    this.isAllSelected$ = observableOf(false);
    this.selectedCompaniesUniquename = [];
    this.selectedCompaniesName = [];
    this.branchModal.hide();
  }

  public selectAllCompanies(ev) {
    this.selectedCompaniesUniquename = [];
    this.selectedCompaniesName = [];
    if (ev.target.checked) {
      this.companies$.pipe(take(1)).subscribe((companies) => {
        _.each(companies, (company) => {
          this.selectedCompaniesUniquename.push(company.uniqueName);
          this.selectedCompaniesName.push(company);
        });
      });
    }
    this.isAllCompaniesSelected();
  }

  public checkUncheckMe(cmp, ev) {
    if (ev.target.checked) {
      if (this.selectedCompaniesUniquename.indexOf(cmp.uniqueName) === -1) {
        this.selectedCompaniesUniquename.push(cmp.uniqueName);
      } if (cmp.name) {
        this.selectedCompaniesName.push(cmp);
      }
    } else {
      let indx = this.selectedCompaniesUniquename.indexOf(cmp.uniqueName);
      this.selectedCompaniesUniquename.splice(indx, 1);
      let idx = this.selectedCompaniesName.indexOf(cmp);
      this.selectedCompaniesName.splice(idx, 1);
    }
    this.isAllCompaniesSelected();
  }

  public createBranches() {
    let dataToSend = { childCompanyUniqueNames: this.selectedCompaniesUniquename };
    this.store.dispatch(this.settingsBranchActions.CreateBranches(dataToSend));
    this.hideAddBranchModal();
  }

  public removeBranch(branchUniqueName, companyName) {
    this.selectedBranch = branchUniqueName;
    this.confirmationMessage = `Are you sure want to remove <b>${companyName}</b>?`;
    this.confirmationModal.show();
  }

  public onUserConfirmation(yesOrNo) {
    if (yesOrNo && this.selectedBranch) {
      this.store.dispatch(this.settingsBranchActions.RemoveBranch(this.selectedBranch));
    } else {
      this.selectedBranch = null;
    }
    this.confirmationModal.hide();
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  public getAllBranches() {
    this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
    this.store.dispatch(this.settingsBranchActions.GetALLBranches());
    this.store.dispatch(this.settingsBranchActions.GetParentCompany());
  }

  private isAllCompaniesSelected() {
    this.companies$.pipe(take(1)).subscribe((companies) => {
      if (companies.length === this.selectedCompaniesUniquename.length) {
        this.isAllSelected$ = observableOf(true);
      } else {
        this.isAllSelected$ = observableOf(false);
      }
    });
  }
}

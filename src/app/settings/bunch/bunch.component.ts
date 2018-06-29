import { createSelector } from 'reselect';
import { IOption } from 'app/theme/ng-virtual-select/sh-options.interface';
import { Store } from '@ngrx/store';
import { Component, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { ToasterService } from '../../services/toaster.service';
import { ShSelectComponent } from 'app/theme/ng-virtual-select/sh-select.component';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { ModalDirective, BsDropdownConfig } from 'ngx-bootstrap';
import { CompanyAddComponent } from '../../shared/header/components';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { CompanyResponse, StateDetailsRequest } from '../../models/api-models/Company';
import { Observable } from 'rxjs/Observable';
import { CompanyActions } from '../../actions/company.actions';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';
import { SettingsBunchService } from '../../services/settings.bunch.service';

export const IsyncData = [
  { label: 'Debtors', value: 'debtors' },
  { label: 'Creditors', value: 'creditors' },
  { label: 'Inventory', value: 'inventory' },
  { label: 'Taxes', value: 'taxes' },
  { label: 'Bank', value: 'bank' }
];

@Component({
  selector: 'setting-bunch',
  templateUrl: './bunch.component.html',
  styleUrls: ['./bunch.component.css'],
  providers: [{ provide: BsDropdownConfig, useValue: { autoClose: false } }]
})

export class BunchComponent implements OnInit, OnDestroy {
  @ViewChild('bunchModal') public bunchModal: ModalDirective;
  @ViewChild('addCompanyModal') public addCompanyModal: ModalDirective;
  @ViewChild('getBunchCompanyModal') public getBunchCompanyModal: ModalDirective;
  @ViewChild('confirmationModal') public confirmationModal: ModalDirective;

  public dataSyncOption = IsyncData;
  public currentBranch: string = null;
  public companies$: Observable<CompanyResponse[]>;
  public branches$: Observable<CompanyResponse[]>;
  public selectedCompanies: string[] = [];
  public isAllSelected$: Observable<boolean> = Observable.of(false);
  public confirmationMessage: string = '';
  public parentCompanyName: string = null;
  public selectedBranch: string = null;

  public allBunches: any = [];
  public selectedBunch: any = {};
  public selectedBunchCompany: any = [];
  public mode: string = 'create';
  public activeBunchCompanies: any = {};

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private settingsBranchActions: SettingsBranchActions,
    private componentFactoryResolver: ComponentFactoryResolver,
    private companyActions: CompanyActions,
    private settingsProfileActions: SettingsProfileActions,
    private _settingsBunchService: SettingsBunchService,
    private _toasterService: ToasterService
  ) {

    this.store.select(p => p.settings.profile).takeUntil(this.destroyed$).subscribe((o) => {
      if (o && !_.isEmpty(o)) {
        let companyInfo = _.cloneDeep(o);
        this.currentBranch = companyInfo.name;
      }
    });

    this.getAllBunch();

    this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
    this.store.dispatch(this.settingsBranchActions.GetALLBranches());
    this.store.dispatch(this.settingsBranchActions.GetParentCompany());

    this.store.select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.settings.branches, (state: AppState) => state.settings.parentCompany], (companies, branches, parentCompany) => {
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
        this.companies$ = Observable.of(_.orderBy(companiesWithSuperAdminRole, 'name'));
      }
    })).takeUntil(this.destroyed$).subscribe();

  }

  public ngOnInit() {
    // console.log('bunch component');
  }

  public openAddCompanyModal(grp) {
    this.selectedBunch = _.cloneDeep(grp);
    this.addCompanyModal.show();
  }

  public hideAddCompanyModal() {
    this.addCompanyModal.hide();
  }

  public openGetBunchCompanyModal() {
    this.getBunchCompanyModal.show();
  }

  public hideGetBunchCompanyModal() {
    this.getBunchCompanyModal.hide();
  }

  public openAddBunchModal() {
    this.bunchModal.show();
  }

  public hideBunchModal() {
    this.isAllSelected$ = Observable.of(false);
    this.selectedBunch = {};
    this.bunchModal.hide();
    this.mode = 'create';
  }

  public onHide() {
    // console.log('creat company modal is closed.');
  }

  /**
   * getAllBunch
   */
  public getAllBunch() {
    this._settingsBunchService.GetAllBunches().subscribe(res => {
      if (res && res.status === 'success') {
        this.allBunches = _.cloneDeep(res.body.bunchResources);
        // console.log(res);
      }
    });
  }

  /**
   * createBunch
   */
  public createBunch(data) {
    this._settingsBunchService.CreateBunch(data).subscribe(res => {
      if (res && res.status === 'success') {
        this.allBunches.push(res.body);
        this.hideBunchModal();
        // console.log(res);
      }
    });
  }

  /**
   * save Bunch
   */
  public saveBunch(data) {
    let dataToSend = _.cloneDeep(data);
    if (this.mode === 'create' || !this.mode) {
        this.createBunch(dataToSend);
    } else {
      this.updateBunch(dataToSend);
    }
  }

  /**
   * update
   */
  public update(bunch: any) {
    this.mode = 'update';
    this.selectedBunch = bunch;
    this.openAddBunchModal();
  }

  /**
   * updateBunch
   */
  public updateBunch(data) {
    this._settingsBunchService.UpdateBunch(data, data.uniqueName).subscribe(res => {
      if (res && res.status === 'success') {
        this._toasterService.successToast(res.status);
        this.getAllBunch();
        this.hideBunchModal();
        // console.log(res);
      }
    });
  }

  /**
   * delete bunch
   */
  public deleteBunch(bunchUniqueName) {
    let uniqueName = _.cloneDeep(bunchUniqueName);
    this._settingsBunchService.RemoveBunch(uniqueName).subscribe(res => {
      if (res && res.status === 'success') {
        this._toasterService.successToast(res.body);
        this.getAllBunch();
        // console.log(res);
      } else {
        this._toasterService.errorToast(res.message);
      }
    });
  }

  /**
   * getBunch
   */
  public getBunchCompany(bunch) {
    this.selectedBunch = bunch;
    this._settingsBunchService.GetCompanies(_.cloneDeep(bunch.uniqueName)).subscribe(res => {
      if (res && res.status === 'success') {
        if (res.body.companies && res.body.companies.length) {
          this.selectedBunchCompany = res.body;
          this.getBunchCompanyModal.show();
        } else {
          this._toasterService.errorToast('No company added');
        }
      }
    });
  }

  /**
   * save company
   */
  public AddBunchCompany(data) {
    if (data.length) {
      this._settingsBunchService.AddCompanies(data, this.selectedBunch.uniqueName).subscribe(res => {
        if (res && res.status === 'success') {
          this._toasterService.successToast(res.body);
          this.hideAddCompanyModal();
        }
      });
    } else {
      this.hideAddCompanyModal();
    }
  }

  /**
   * save company
   */
  public RemoveCompany(data) {
    if (data.length) {
      this._settingsBunchService.RemoveCompanies(data, this.selectedBunch.uniqueName).subscribe(res => {
        if (res && res.status === 'success') {
          this._toasterService.successToast(res.body);
          this.hideGetBunchCompanyModal();
        }
      });
    } else {
      this.hideGetBunchCompanyModal();
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  private isAllCompaniesSelected() {
    this.companies$.take(1).subscribe((companies) => {
      if (companies.length === this.selectedCompanies.length) {
        this.isAllSelected$ = Observable.of(true);
      } else {
        this.isAllSelected$ = Observable.of(false);
      }
    });
  }

}

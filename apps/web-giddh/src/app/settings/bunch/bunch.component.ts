import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { take, takeUntil } from 'rxjs/operators';
import { createSelector } from 'reselect';
import { Store } from '@ngrx/store';
import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { AppState } from '../../store/roots';
import * as _ from '../../lodash-optimized';
import { ToasterService } from '../../services/toaster.service';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { BsDropdownConfig, ModalDirective } from 'ngx-bootstrap';
import { CompanyResponse, BranchFilterRequest } from '../../models/api-models/Company';
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

export class BunchComponent implements OnDestroy {
	@ViewChild('bunchModal') public bunchModal: ModalDirective;
	@ViewChild('addCompanyModal') public addCompanyModal: ModalDirective;
	@ViewChild('getBunchCompanyModal') public getBunchCompanyModal: ModalDirective;
	@ViewChild('confirmationModal') public confirmationModal: ModalDirective;

	public dataSyncOption = IsyncData;
	public currentBranch: string = null;
	public companies$: Observable<CompanyResponse[]>;
	public branches$: Observable<CompanyResponse[]>;
	public selectedCompanies: string[] = [];
	public isAllSelected$: Observable<boolean> = observableOf(false);
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

		this.store.select(p => p.settings.profile).pipe(takeUntil(this.destroyed$)).subscribe((o) => {
			if (o && !_.isEmpty(o)) {
				let companyInfo = _.cloneDeep(o);
				this.currentBranch = companyInfo.name;
			}
		});

		this.getAllBunch();

		let branchFilterRequest = new BranchFilterRequest();

		this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
		this.store.dispatch(this.settingsBranchActions.GetALLBranches(branchFilterRequest));
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
				this.companies$ = observableOf(_.orderBy(companiesWithSuperAdminRole, 'name'));
			}
		})).pipe(takeUntil(this.destroyed$)).subscribe();

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
		this.isAllSelected$ = observableOf(false);
		this.selectedBunch = {};
		this.bunchModal.hide();
		this.mode = 'create';
	}

	/**
	 * getAllBunch
	 */
	public getAllBunch() {
		this._settingsBunchService.GetAllBunches().subscribe(res => {
			if (res && res.status === 'success') {
				this.allBunches = _.cloneDeep(res.body.bunchResources);
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
		this.companies$.pipe(take(1)).subscribe((companies) => {
			if (companies.length === this.selectedCompanies.length) {
				this.isAllSelected$ = observableOf(true);
			} else {
				this.isAllSelected$ = observableOf(false);
			}
		});
	}

}

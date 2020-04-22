import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { createSelector } from 'reselect';
import { Store, select } from '@ngrx/store';
import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AppState } from '../../store/roots';
import * as _ from '../../lodash-optimized';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { BsDropdownConfig, ModalDirective } from 'ngx-bootstrap';
import { CompanyAddNewUiComponent } from '../../shared/header/components';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { CompanyResponse, BranchFilterRequest } from '../../models/api-models/Company';
import { CompanyActions } from '../../actions/company.actions';
import { CommonActions } from '../../actions/common.actions';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment/moment';
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import { GeneralService } from "../../services/general.service";
import { BreakpointObserver } from '@angular/cdk/layout';

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
    styleUrls: ['./branch.component.scss'],
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
    public isMobileScreen: boolean = false;
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
    public branchViewType: string = 'table';
    public moment = moment;
    public filters: any[] = [];
    public formFields: any[] = [];
    public universalDate$: Observable<any>;
    public dateRangePickerValue: Date[] = [];

    constructor(
        private store: Store<AppState>,
        private settingsBranchActions: SettingsBranchActions,
        private componentFactoryResolver: ComponentFactoryResolver,
        private companyActions: CompanyActions,
        private settingsProfileActions: SettingsProfileActions,
        private commonActions: CommonActions,
        private _generalService: GeneralService,
        private _breakPointObservar: BreakpointObserver
    ) {
        this.getOnboardingForm();

        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));

        this.store.select(p => p.settings.profile).pipe(takeUntil(this.destroyed$)).subscribe((o) => {
            if (o && !_.isEmpty(o)) {
                let companyInfo = _.cloneDeep(o);
                this.currentBranch = companyInfo.name;
                this.currentBranchNameAlias = companyInfo.nameAlias;
            }
        });

        // listen for universal date
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj) => {
            if (dateObj) {
                this.filters['from'] = moment(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.filters['to'] = moment(dateObj[1]).format(GIDDH_DATE_FORMAT);

                this.dateRangePickerValue = [dateObj[0], dateObj[1]];
                this.getAllBranches();
            }
        });

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
        this.store.pipe(select(s => s.session.createCompanyUserStoreRequestObj), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.isBranch) {
                    this.isBranch = res.isBranch;
                }
            }
        });

        this.store.pipe(select(s => s.settings.branchRemoved), takeUntil(this.destroyed$)).subscribe(res => {
            if (res !== null) {
                this.getAllBranches();
            }
        });
        this._breakPointObservar.observe([
            '(max-width: 1023px)'
        ]).subscribe(result => {
            this.isMobileScreen = result.matches;
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
        this.store.dispatch(this.commonActions.resetCountry());

        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(CompanyAddNewUiComponent);
        let viewContainerRef = this.companyadd.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        (componentRef.instance as CompanyAddNewUiComponent).createBranch = true;
        (componentRef.instance as CompanyAddNewUiComponent).closeCompanyModal.subscribe((a) => {
            this.hideAddCompanyModal();
        });
        (componentRef.instance as CompanyAddNewUiComponent).closeCompanyModalAndShowAddManege.subscribe((a) => {
            this.hideCompanyModalAndShowAddAndManage();
        });
    }

    public openAddBranchModal() {
        this.removeCompanySessionData();
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
            }
            if (cmp.name) {
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
        this.confirmationMessage = `Are you sure want to remove <p class="remvBrnchName"><b>${companyName}?</b></p>`;
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
        let branchFilterRequest = new BranchFilterRequest();
        branchFilterRequest.from = this.filters['from'];
        branchFilterRequest.to = this.filters['to'];

        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        this.store.dispatch(this.settingsBranchActions.GetALLBranches(branchFilterRequest));
        this.store.dispatch(this.settingsBranchActions.GetParentCompany());
        this.store.dispatch(this.settingsBranchActions.ResetBranchRemoveResponse());
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

    public changeBranchViewType(viewType) {
        this.branchViewType = viewType;
    }

    public setFilterDate(data) {
        if (data) {
            let branchFilterRequest = new BranchFilterRequest();
            branchFilterRequest.from = moment(data[0]).format(GIDDH_DATE_FORMAT);
            branchFilterRequest.to = moment(data[1]).format(GIDDH_DATE_FORMAT);

            this.filters['from'] = branchFilterRequest.from;
            this.filters['to'] = branchFilterRequest.to;

            this.store.dispatch(this.settingsBranchActions.GetALLBranches(branchFilterRequest));
        }
    }

    public getOnboardingForm() {
        this.store.pipe(select(s => s.common.onboardingform), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.fields) {
                    Object.keys(res.fields).forEach(key => {
                        if (res.fields[key]) {
                            this.formFields[res.fields[key].name] = [];
                            this.formFields[res.fields[key].name] = res.fields[key];
                        }
                    });
                }
            }
        });
    }

    public removeCompanySessionData() {
        this._generalService.createNewCompany = null;
        this.store.dispatch(this.commonActions.resetCountry());
        this.store.dispatch(this.companyActions.removeCompanyCreateSession());
    }
}

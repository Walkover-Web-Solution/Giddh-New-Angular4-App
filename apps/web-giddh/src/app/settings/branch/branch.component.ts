import { fromEvent, Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { createSelector } from 'reselect';
import { Store, select } from '@ngrx/store';
import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, AfterViewInit, TemplateRef, ElementRef } from '@angular/core';
import { AppState } from '../../store/roots';
import * as _ from '../../lodash-optimized';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { ModalDirective, BsModalService } from 'ngx-bootstrap/modal';
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
import { SettingsProfileService } from '../../services/settings.profile.service';
import { Router } from '@angular/router';
import { SettingsAsideConfiguration, SettingsAsideFormType } from '../constants/settings.constant';
import { ToasterService } from '../../services/toaster.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SettingsUtilityService } from '../services/settings-utility.service';

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
    providers: [{ provide: BsDropdownConfig, useValue: { autoClose: false } }],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})

export class BranchComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('branchModal', {static: false}) public branchModal: ModalDirective;
    @ViewChild('addCompanyModal', {static: false}) public addCompanyModal: ModalDirective;
    @ViewChild('companyadd', {static: false}) public companyadd: ElementViewContainerRef;
    @ViewChild('confirmationModal', {static: false}) public confirmationModal: ModalDirective;
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
    /** Holds the state of aside menu */
    public closeAddressSidePane: string = 'out';
    /** True if branch update is in progress, used to show ladda loader in aside menu */
    public isBranchChangeInProgress: boolean = false;

    /** Branch search field instance */
    @ViewChild('branchSearch', {static: true}) public branchSearch: ElementRef;

    /** Stores the address configuration */
    public addressConfiguration: SettingsAsideConfiguration = {
        type: SettingsAsideFormType.EditBranch,
        linkedEntities: []
    };
    /** Branch details to update */
    public branchToUpdate: any;
    /** Stores the selected branch details */
    private branchDetails: any;

    constructor(
        private router: Router,
        private store: Store<AppState>,
        private settingsBranchActions: SettingsBranchActions,
        private componentFactoryResolver: ComponentFactoryResolver,
        private companyActions: CompanyActions,
        private settingsProfileActions: SettingsProfileActions,
        private settingsProfileService: SettingsProfileService,
        private commonActions: CommonActions,
        private _generalService: GeneralService,
        private _breakPointObservar: BreakpointObserver,
        private modalService: BsModalService,
        private settingsUtilityService: SettingsUtilityService,
        private toasterService: ToasterService
    ) {
        this.getOnboardingForm();

        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));

        this.store.pipe(select(state => state.settings && state.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            if (profile && !_.isEmpty(profile)) {
                let companyInfo = _.cloneDeep(profile);
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

        this.store.pipe(select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.settings.branches, (state: AppState) => state.settings.parentCompany], (companies, branches, parentCompany) => {
            if (branches) {
                if (branches.length) {
                    this.branches$ = observableOf(_.orderBy(branches, 'name'));
                } else if (branches.length === 0) {
                    this.branches$ = observableOf(null);
                }
            }
            if (companies && companies.length && branches) {
                let companiesWithSuperAdminRole = [];
                _.each(companies, (cmp) => {
                    _.each(cmp.userEntityRoles, (company) => {
                        if (company.entity.entity === 'COMPANY' && company.role.uniqueName === 'super_admin') {
                            if (branches && branches.length) {
                                let existIndx = branches.findIndex((b) => b.uniqueName === cmp.uniqueName);
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
        })), takeUntil(this.destroyed$)).subscribe();
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

        fromEvent(this.branchSearch.nativeElement, 'input').pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe((event: any) => {
            this.store.dispatch(this.settingsBranchActions.GetALLBranches({from: '', to: '', query: encodeURIComponent(event.target.value)}));
        });

        this._breakPointObservar.observe([
            '(max-width:768px)'
        ]).subscribe(result => {
            this.isMobileScreen = result.matches;
            this.changeBranchViewType('card')
        });
    }

    public ngAfterViewInit() {
        if (this.isBranch) {
            this.openCreateCompanyModal()
        }
    }

    public openCreateCompanyModal(isUpdateMode?: boolean): void {
        this.loadAddCompanyComponent(isUpdateMode);
        this.hideAddBranchModal();
        this.addCompanyModal.show();
    }

    /**
     * Handles update branch operation
     *
     * @param {*} branch Branch to be updated
     * @memberof BranchComponent
     */
    public updateBranch(branch: any): void {
        this.branchDetails = branch;

        this.loadAddresses('GET', () => {
            this.branchToUpdate = {
                name: branch.name,
                alias: branch.alias,
                linkedEntities: branch.addresses
            };
            this.toggleAsidePane();
        });
        // this.openCreateCompanyModal(true);
    }

    public hideAddCompanyModal() {
        this.addCompanyModal.hide();
    }

    public hideCompanyModalAndShowAddAndManage() {
        this.addCompanyModal.hide();
    }

    public loadAddCompanyComponent(isUpdateMode?: boolean): void {
        this.store.dispatch(this.commonActions.resetCountry());

        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(CompanyAddNewUiComponent);
        let viewContainerRef = this.companyadd.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        (componentRef.instance as CompanyAddNewUiComponent).createBranch = true;
        (componentRef.instance as CompanyAddNewUiComponent).isUpdateMode = isUpdateMode;
        (componentRef.instance as CompanyAddNewUiComponent).entityDetails = this.branchDetails;
        (componentRef.instance as CompanyAddNewUiComponent).closeCompanyModal.subscribe((a) => {
            this.hideAddCompanyModal();
            if (isUpdateMode) {
                this.getAllBranches();
            }
        });
        (componentRef.instance as CompanyAddNewUiComponent).closeCompanyModalAndShowAddManege.subscribe((a) => {
            this.hideCompanyModalAndShowAddAndManage();
        });
    }

    public openAddBranchModal() {
        // this.removeCompanySessionData();
        // this.openCreateCompanyModal();
        this.router.navigate(['pages/settings/create-branch']);
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

        if (branchFilterRequest.from && branchFilterRequest.to) {
            this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
            this.store.dispatch(this.settingsBranchActions.GetALLBranches(branchFilterRequest));
            this.store.dispatch(this.settingsBranchActions.GetParentCompany());
            this.store.dispatch(this.settingsBranchActions.ResetBranchRemoveResponse());
        }
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
        this.store.dispatch(this.companyActions.userStoreCreateBranch(null));
    }

    /**
     * Opens the side menu for edit branch
     *
     * @memberof BranchComponent
     */
    public openEditBranch(): void {
        this.toggleAsidePane();
    }

    /**
     * Toggles aside menu for branch update
     *
     * @param {*} [event]
     * @memberof BranchComponent
     */
    public toggleAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.closeAddressSidePane = this.closeAddressSidePane === 'out' ? 'in' : 'out';

        this.toggleBodyClass();
    }

    /**
     * Toggles fixed body class when aside menu is udpated
     *
     * @memberof BranchComponent
     */
    public toggleBodyClass(): void {
        if (this.closeAddressSidePane === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    /**
     * Updates the branch information
     *
     * @param {*} branchDetails Updated branch information
     * @memberof BranchComponent
     */
    public updateBranchInfo(branchDetails: any): void {
        this.isBranchChangeInProgress = true;
        const linkAddresses = branchDetails.addressDetails.linkedEntities.filter(entity => (branchDetails.formValue.linkedEntity.includes(entity.uniqueName))).map(filteredEntity => ({
            uniqueName: filteredEntity.uniqueName,
            isDefault: filteredEntity.isDefault,
        }));
        const requestObj = {
            name: branchDetails.formValue.name,
            alias: branchDetails.formValue.alias,
            branchUniqueName: this.branchDetails.uniqueName,
            linkAddresses
        };
        this.settingsProfileService.updateBranchInfo(requestObj).subscribe(response => {
            if (response.status === 'success') {
                this.closeAddressSidePane = 'out';
                this.store.dispatch(this.settingsBranchActions.GetALLBranches({from: '', to: ''}));
                this.toasterService.successToast('Branch updated successfully');
            }
            this.isBranchChangeInProgress = false;
        }, () => {
            this.isBranchChangeInProgress = false;
        });
    }

    /**
     * Set default action handler
     *
     * @param {*} entity Entity to be set has default
     * @param {*} branch Selected Branch for operation
     * @param {string} entityType Entity type ('address' or 'warehouse)
     * @memberof BranchComponent
     */
    public setDefault(entity: any, branch: any, entityType: string): void {
        entity.isDefault = !entity.isDefault;
        if (entityType === 'address') {
            branch.addresses.forEach(branchAddress => {
                if (branchAddress.uniqueName === entity.uniqueName) {
                    branchAddress.isDefault = entity.isDefault;
                } else {
                    branchAddress.isDefault = false;
                }
            });
        } else if (entityType === 'warehouse') {
            branch.warehouseResource.forEach(warehouse => {
                if (warehouse.uniqueName === entity.uniqueName) {
                    warehouse.isDefault = entity.isDefault;
                } else {
                    warehouse.isDefault = false;
                }
            });
        }
        const requestObject: any = {
            name: branch.name,
            alias: branch.alias,
            linkAddresses: branch.addresses,
            branchUniqueName: branch.uniqueName,
        }
        if (entityType === 'warehouse') {
            requestObject.defaultWarehouse = {
                name: entity.name,
                uniqueName: entity.uniqueName
            };
        }
        this.settingsProfileService.updateBranchInfo(requestObject).subscribe(() => {
            this.store.dispatch(this.settingsBranchActions.GetALLBranches({from: '', to: ''}));
        });
    }

    /**
     * Loads the addresses
     *
     * @private
     * @param {string} method Method by which API is called ('GET' for fetching and 'POST' for searching among addresses)
     * @param {Function} successCallback Callback to carry out futher operations
     * @memberof BranchComponent
     */
    private loadAddresses(method: string, successCallback: Function): void {
        this.settingsProfileService.getCompanyAddresses(method).subscribe((response) => {
            if (response && response.body && response.status === 'success') {
                this.addressConfiguration.linkedEntities = this.settingsUtilityService.getFormattedCompanyAddresses(response.body.results).map(address => (
                    {
                        ...address,
                        isDefault: false,
                        label: address.name,
                        value: address.uniqueName
                    }));
                if (successCallback) {
                    successCallback();
                }
            }
        });
    }
}

import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { createSelector } from 'reselect';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { CommonActions } from '../../actions/common.actions';
import { CompanyActions } from '../../actions/company.actions';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { cloneDeep, each, isEmpty, orderBy } from '../../lodash-optimized';
import { BranchFilterRequest, CompanyResponse } from '../../models/api-models/Company';
import { GeneralService } from '../../services/general.service';
import { SettingsBranchService } from '../../services/settings.branch.service';
import { SettingsProfileService } from '../../services/settings.profile.service';
import { ToasterService } from '../../services/toaster.service';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { AppState } from '../../store/roots';
import { SettingsAsideConfiguration, SettingsAsideFormType } from '../constants/settings.constant';
import { SettingsUtilityService } from '../services/settings-utility.service';
import { FormControl } from '@angular/forms';
import { BranchHierarchyType } from '../../app.constant';
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
    /** Change status modal instance */
    @ViewChild('branchModal', { static: false }) public branchModal: ModalDirective;
    @ViewChild('companyadd', { static: false }) public companyadd: ElementViewContainerRef;
    @ViewChild('confirmationModal', { static: false }) public confirmationModal: ModalDirective;
    /** Holds Status Dialog Template Reference */
    @ViewChild('statusDialog', { static: true }) public statusDialog: any;
    /** Holds Add Company Dialog Template Reference */
    @ViewChild('addCompanyModal', { static: true }) public addCompanyModal: any;
    /** Holds Close Address Dialog Template Reference */
    @ViewChild('addressAsidePane', { static: true }) public addressAsidePane: any;
    public bsConfig: Partial<BsDatepickerConfig> = {
        showWeekNumbers: false,
        dateInputFormat: GIDDH_DATE_FORMAT,
        rangeInputFormat: GIDDH_DATE_FORMAT,
        containerClass: 'theme-green myDpClass'
    };
    public dataSyncOption = [];
    public currentBranch: string = null;
    public companies$: Observable<CompanyResponse[]>;
    public branches$: Observable<CompanyResponse[]>;
    public selectedCompaniesUniquename: string[] = [];
    public selectedCompaniesName: any[] = [];
    public isAllSelected$: Observable<boolean> = observableOf(false);
    public confirmationMessage: string = '';
    public selectedBranch: string = null;
    public isBranch: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public branchViewType: string = 'card';
    public dayjs = dayjs;
    public filters: any[] = [];
    public formFields: any[] = [];
    public universalDate$: Observable<any>;
    public dateRangePickerValue: Date[] = [];
    /** True if branch update is in progress, used to show ladda loader in aside menu */
    public isBranchChangeInProgress: boolean = false;
    /** Stores all the branches */
    public unFilteredBranchList: Array<any>;
    /** Stores the branch searcch query */
    public searchBranchQuery: FormControl = new FormControl('');
    /** Branch search field instance */
    @ViewChild('branchSearch', { static: true }) public branchSearch: ElementRef;
    /** Stores the address configuration */
    public addressConfiguration: SettingsAsideConfiguration = {
        type: SettingsAsideFormType.EditBranch,
        linkedEntities: []
    };
    /** Branch details to update */
    public branchToUpdate: any;
    /** True, if loader is to be displayed */
    public showLoader: boolean;
    public imgPath: string = '';
    /** Stores the selected branch details */
    private branchDetails: any;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold profile JSON data */
    public profileLocaleData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds branch to archive/unarchive */
    public branchStatusToUpdate: any;
    /** Holds Status MatDailog Reference */
    public statusDialogRef: any;
    /** Holds Close Address MatDailog Reference */
    public addressAsidePaneRef: any;
    /** Index of selected tab */
    public selectedTabIndex: number = 0;
    /** Active tab name */
    public activeTab: string;
    /** Tree Chart Container instance */
    @ViewChild("chartContainer") chartContainer: ElementRef;
    /** This will hold tree response data */
    public data: any[] = [];

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
        private settingsUtilityService: SettingsUtilityService,
        private toasterService: ToasterService,
        private settingsBranchService: SettingsBranchService,
        public dialog: MatDialog
    ) {

    }

    public ngOnInit() {
        this.getOnboardingForm();
        this.searchBranchQuery.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(query => {
            if (query !== undefined && query !== null) {
                if (query) {
                    this.handleBranchSearch(query);
                } else {
                    this.resetFilter();
                }
            }
        });
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));

        this.store.pipe(select(state => state.settings && state.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            if (profile && !isEmpty(profile)) {
                let companyInfo = cloneDeep(profile);
                this.currentBranch = companyInfo.name;
            } else {
                this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
            }
        });

        // listen for universal date
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj) => {
            if (dateObj) {
                this.filters['from'] = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.filters['to'] = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);

                this.dateRangePickerValue = [dateObj[0], dateObj[1]];
                this.getAllBranches();
            }
        });

        this.store.pipe(select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.settings.branches], (companies, branches) => {
            if (branches) {
                if (branches.length) {
                    this.unFilteredBranchList = orderBy(branches, 'name');
                    this.branches$ = observableOf(this.unFilteredBranchList);
                } else if (branches.length === 0) {
                    this.unFilteredBranchList = [];
                    this.branches$ = observableOf(null);
                }
                this.data = this.unFilteredBranchList;
                this.showLoader = false;
            }
            if (companies && companies.length && branches) {
                let companiesWithSuperAdminRole = [];
                each(companies, (cmp) => {
                    each(cmp.userEntityRoles, (company) => {
                        if (company.entity.entity === 'COMPANY' && company.role?.uniqueName === 'super_admin') {
                            if (branches?.length) {
                                let existIndx = branches.findIndex((b) => b?.uniqueName === cmp?.uniqueName);
                                if (existIndx === -1) {
                                    companiesWithSuperAdminRole.push(cmp);
                                }
                            } else {
                                companiesWithSuperAdminRole.push(cmp);
                            }
                        }
                    });
                });
                this.companies$ = observableOf(orderBy(companiesWithSuperAdminRole, 'name'));
            }
        })), takeUntil(this.destroyed$)).subscribe();

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

        this.imgPath = isElectron ? 'assets/images/warehouse-vector.svg' : AppUrl + APP_FOLDER + 'assets/images/warehouse-vector.svg';
    }

    /**
 * Performs local search among branches
 *
 * @param {string} query Searched query
 * @memberof BranchComponent
 */
    public handleBranchSearch(query: string): void {
        let branches = [...this.unFilteredBranchList];
        if (query) {
            const lowercaseQuery = query.toLowerCase();
            branches = this.unFilteredBranchList?.filter(branch => (branch.name && branch.name?.toLowerCase().includes(lowercaseQuery)) || (branch.alias && branch.alias?.toLowerCase().includes(lowercaseQuery)));
        }
        this.branches$ = observableOf(branches);
    }

    /**
     * This hook will be use for component after initialization
     *
     * @memberof BranchComponent
     */
    public ngAfterViewInit(): void {
        if (this.isBranch) {
            this.openCreateCompanyDialog();
        }
    }

    /**
     * Open Create company dialog
     *
     * @memberof BranchComponent
     */
    public openCreateCompanyDialog(): void {
        this.dialog.open(this.addCompanyModal, {
            panelClass: 'modal-dialog',
            width: '1000px'
        });
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
                parentBranchName: branch.parentBranch?.name,
                linkedEntities: branch.addresses || []
            };
            this.toggleAsidePane();
        });
    }

    public openAddBranchModal() {
        this.router.navigate(['pages/settings/create-branch']);
    }

    public selectAllCompanies(ev) {
        this.selectedCompaniesUniquename = [];
        this.selectedCompaniesName = [];
        if (ev.target?.checked) {
            this.companies$.pipe(take(1)).subscribe((companies) => {
                each(companies, (company) => {
                    this.selectedCompaniesUniquename.push(company?.uniqueName);
                    this.selectedCompaniesName.push(company);
                });
            });
        }
        this.isAllCompaniesSelected();
    }

    public checkUncheckMe(cmp, ev) {
        if (ev.target?.checked) {
            if (this.selectedCompaniesUniquename?.indexOf(cmp?.uniqueName) === -1) {
                this.selectedCompaniesUniquename.push(cmp?.uniqueName);
            }
            if (cmp.name) {
                this.selectedCompaniesName.push(cmp);
            }
        } else {
            let indx = this.selectedCompaniesUniquename?.indexOf(cmp?.uniqueName);
            this.selectedCompaniesUniquename.splice(indx, 1);
            let idx = this.selectedCompaniesName?.indexOf(cmp);
            this.selectedCompaniesName.splice(idx, 1);
        }
        this.isAllCompaniesSelected();
    }

    public createBranches() {
        let dataToSend = { childCompanyUniqueNames: this.selectedCompaniesUniquename };
        this.store.dispatch(this.settingsBranchActions.CreateBranches(dataToSend));
    }

    public removeBranch(branchUniqueName, companyName) {
        this.selectedBranch = branchUniqueName;
        let message = this.localeData?.remove_branch;
        message = message?.replace("[COMPANY_NAME]", companyName);
        this.confirmationMessage = message;
        this.confirmationModal?.show();
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

    /**
     * Get all branches
     *
     * @memberof BranchComponent
     */
    public getAllBranches() {
        let branchFilterRequest = new BranchFilterRequest();
        branchFilterRequest.from = this.filters['from'];
        branchFilterRequest.to = this.filters['to'];

        if (branchFilterRequest.from && branchFilterRequest.to) {
            this.showLoader = true;
            // First request with hierarchyType as Tree
            branchFilterRequest.hierarchyType = BranchHierarchyType.Tree;
            this.store.dispatch(this.settingsBranchActions.GetALLBranches(branchFilterRequest));
            this.store.dispatch(this.settingsBranchActions.ResetBranchRemoveResponse());

            // Second request with hierarchyType as Flatten
            branchFilterRequest.hierarchyType = BranchHierarchyType.Flatten;
            this.store.dispatch(this.settingsBranchActions.GetALLBranches(branchFilterRequest));
            this.store.dispatch(this.settingsBranchActions.ResetBranchRemoveResponse());
        }
    }

    private isAllCompaniesSelected() {
        this.companies$.pipe(take(1)).subscribe((companies) => {
            if (companies?.length === this.selectedCompaniesUniquename?.length) {
                this.isAllSelected$ = observableOf(true);
            } else {
                this.isAllSelected$ = observableOf(false);
            }
        });
    }

    public setFilterDate(data) {
        if (data) {
            let branchFilterRequest = new BranchFilterRequest();
            branchFilterRequest.from = dayjs(data[0]).format(GIDDH_DATE_FORMAT);
            branchFilterRequest.to = dayjs(data[1]).format(GIDDH_DATE_FORMAT);

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
        this.isBranchChangeInProgress = false;

        this.addressAsidePaneRef = this.dialog.open(this.addressAsidePane,
            {
                position: {
                    right: '0'
                },
                disableClose: true,
                width: '760px',
                height: '100vh',
                maxHeight: '100vh'
            });

    }

    /**
     * Updates the branch information
     *
     * @param {*} branchDetails Updated branch information
     * @memberof BranchComponent
     */
    public updateBranchInfo(branchDetails: any): void {
        branchDetails.formValue.linkedEntity = branchDetails.formValue.linkedEntity || [];
        this.isBranchChangeInProgress = true;
        const linkAddresses = branchDetails.addressDetails.linkedEntities?.filter(entity => (branchDetails.formValue.linkedEntity.includes(entity?.uniqueName))).map(filteredEntity => ({
            uniqueName: filteredEntity?.uniqueName,
            isDefault: filteredEntity.isDefault,
        }));
        const requestObj = {
            name: branchDetails.formValue.name,
            alias: branchDetails.formValue.alias,
            branchUniqueName: this.branchDetails?.uniqueName,
            linkAddresses
        };
        this.settingsProfileService.updateBranchInfo(requestObj).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === 'success') {
                this.addressAsidePaneRef?.close();
                this.store.dispatch(this.settingsBranchActions.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                this.toasterService.successToast(this.localeData?.branch_updated);
            } else {
                this.toasterService.errorToast(response?.message);
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
        if (entityType === "warehouse" && entity?.isArchived) {
            this.toasterService.warningToast(this.localeData?.archived_default_error);
            return;
        }

        entity.isDefault = !entity.isDefault;

        if (entityType === 'address') {
            branch.addresses.forEach(branchAddress => {
                if (branchAddress?.uniqueName === entity?.uniqueName) {
                    branchAddress.isDefault = entity.isDefault;
                } else {
                    branchAddress.isDefault = false;
                }
            });
        } else if (entityType === 'warehouse') {
            branch.warehouseResource.forEach(warehouse => {
                if (warehouse?.uniqueName === entity?.uniqueName) {
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
            branchUniqueName: branch?.uniqueName,
        }
        if (entityType === 'warehouse') {
            requestObject.defaultWarehouse = {
                name: entity.name,
                uniqueName: entity?.uniqueName
            };
        }
        this.settingsProfileService.updateBranchInfo(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.store.dispatch(this.settingsBranchActions.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
        });
    }


    /**
     * Resets the branch filter
     *
     * @memberof BranchComponent
     */
    public resetFilter(): void {
        this.searchBranchQuery.reset();
        this.handleBranchSearch(this.searchBranchQuery.value);
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
        this.settingsProfileService.getCompanyAddresses(method).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.body && response.status === 'success') {
                this.addressConfiguration.linkedEntities = this.settingsUtilityService.getFormattedCompanyAddresses(response.body.results).map(address => (
                    {
                        ...address,
                        isDefault: false,
                        label: address.name,
                        value: address?.uniqueName
                    }));
                if (successCallback) {
                    successCallback();
                }
            }
        });
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof BranchComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.dataSyncOption = [
                { label: this.localeData?.data_sync_options?.debtors, value: 'debtors' },
                { label: this.localeData?.data_sync_options?.creditors, value: 'creditors' },
                { label: this.localeData?.data_sync_options?.inventory, value: 'inventory' },
                { label: this.localeData?.data_sync_options?.taxes, value: 'taxes' },
                { label: this.localeData?.data_sync_options?.bank, value: 'bank' }
            ];
        }
    }

    /**
     * This will show confirmation dialog for branch archive/unarchive
     *
     * @param {*} branch
     * @memberof BranchComponent
     */
    public confirmStatusUpdate(branch: any): void {
        const unarchivedBranches = this.unFilteredBranchList?.filter(currentBranch => !currentBranch?.isArchived);
        if (unarchivedBranches?.length > 1 || branch?.isArchived) {
            this.branchStatusToUpdate = branch;
            this.statusDialogRef = this.dialog.open(this.statusDialog, {
                panelClass: 'modal-dialog',
                width: '1000px'
            });
        } else {
            this.toasterService.warningToast(this.localeData?.archive_notallowed);
        }
    }

    /**
     * Updates the branch status
     *
     * @memberof BranchComponent
     */
    public updateBranchStatus(): void {
        const isArchived = !this.branchStatusToUpdate?.isArchived;
        this.settingsBranchService.updateBranchStatus({ isArchived: isArchived }, this.branchStatusToUpdate?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                let branchFilterRequest = new BranchFilterRequest();
                branchFilterRequest.from = this.filters['from'];
                branchFilterRequest.to = this.filters['to'];
                branchFilterRequest.hierarchyType = BranchHierarchyType.Flatten;
                this.store.dispatch(this.settingsBranchActions.GetALLBranches(branchFilterRequest));
                this.toasterService.successToast((isArchived) ? this.localeData?.branch_archived : this.localeData?.branch_unarchived);
            } else {
                this.toasterService.errorToast(response?.message);
            }
            this.statusDialogRef?.close();
        });
    }
}

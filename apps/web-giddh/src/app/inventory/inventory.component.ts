import { InventoryAction } from '../actions/inventory/inventory.actions';
import { CompanyResponse, StateDetailsRequest, BranchFilterRequest } from '../models/api-models/Company';
import { GroupStockReportRequest, StockDetailResponse, StockGroupResponse } from '../models/api-models/Inventory';
import { InvoiceActions } from '../actions/invoice/invoice.actions';
import { BsDropdownConfig, ModalDirective, TabDirective, TabsetComponent } from 'ngx-bootstrap';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { createSelector } from 'reselect';
import { select, Store } from '@ngrx/store';
import { AfterViewInit, Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppState } from '../store';
import * as _ from '../lodash-optimized';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { CompanyAddComponent } from '../shared/header/components';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { CompanyActions } from '../actions/company.actions';
import { SettingsBranchActions } from '../actions/settings/branch/settings.branch.action';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { InvViewService } from './inv.view.service';
import { SidebarAction } from "../actions/inventory/sidebar.actions";
import { StockReportActions } from "../actions/inventory/stocks-report.actions";
import * as moment from 'moment/moment';
import { IGroupsWithStocksHierarchyMinItem } from "../models/interfaces/groupsWithStocks.interface";
import { InventoryService } from '../services/inventory.service';
import { ToasterService } from '../services/toaster.service';
import { SettingsUtilityService } from '../settings/services/settings-utility.service';
import { ShSelectComponent } from '../theme/ng-virtual-select/sh-select.component';

export const IsyncData = [
    { label: 'Debtors', value: 'debtors' },
    { label: 'Creditors', value: 'creditors' },
    { label: 'Inventory', value: 'inventory' },
    { label: 'Taxes', value: 'taxes' },
    { label: 'Bank', value: 'bank' }
];

@Component({
    selector: 'inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.scss'],
    providers: [{ provide: BsDropdownConfig, useValue: { autoClose: false } }]
})
export class InventoryComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('branchModal') public branchModal: ModalDirective;
    @ViewChild('addCompanyModal') public addCompanyModal: ModalDirective;
    @ViewChild('companyadd') public companyadd: ElementViewContainerRef;
    @ViewChild('confirmationModal') public confirmationModal: ModalDirective;
    @ViewChild('inventoryStaticTabs') public inventoryStaticTabs: TabsetComponent;
    /** Warehouse filter instance */
    @ViewChild('warehouseFilter') warehouseFilter: ShSelectComponent;

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
    public isBranchVisible$: Observable<boolean>;
    public activeStock$: Observable<StockDetailResponse>;
    public activeGroup$: Observable<StockGroupResponse>;
    public groupsWithStocks$: Observable<IGroupsWithStocksHierarchyMinItem[]>;
    public activeTab: string = 'inventory';
    public activeView: string = null;
    public activeTabIndex: number = 0;
    public currentUrl: string = null;
    public message: any;
    public GroupStockReportRequest: GroupStockReportRequest;
    public firstDefaultActiveGroup: string = null;
    public firstDefaultActiveGroupName: string = null;
    /** Stores the branch details along with warehouse details */
    public branchesWithWarehouse: Array<any> = [];
    /** Stores the current value of branch and warehouse selected for filters */
    public currentBranchAndWarehouseFilterValues: { warehouse: string, branch: string } = { warehouse: '', branch: '' };
    /** List of warehouses */
    public warehouses: Array<any> = [];
    /** List of branches */
    public branches: Array<any> = [];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private _inventoryAction: InventoryAction,
        private invoiceActions: InvoiceActions,
        private inventoryService: InventoryService,
        private settingsBranchActions: SettingsBranchActions,
        private componentFactoryResolver: ComponentFactoryResolver,
        private companyActions: CompanyActions,
        private settingsProfileActions: SettingsProfileActions,
        private invViewService: InvViewService,
        private router: Router, private route: ActivatedRoute,
        private stockReportActions: StockReportActions,
        private sideBarAction: SidebarAction,
        private settingsUtilityService: SettingsUtilityService,
        private toastService: ToasterService
    ) {
        this.currentUrl = this.router.url;

        if (this.currentUrl.indexOf('group') > 0) {
            this.activeView = "group";
        } else if (this.currentUrl.indexOf('stock') > 0) {
            this.activeView = "stock";
        } else {
            this.activeView = null;
        }

        this.activeStock$ = this.store.select(p => p.inventory.activeStock).pipe(takeUntil(this.destroyed$));
        this.activeGroup$ = this.store.select(p => p.inventory.activeGroup).pipe(takeUntil(this.destroyed$));
        this.groupsWithStocks$ = this.store.select(s => s.inventory.groupsWithStocks).pipe(takeUntil(this.destroyed$));

        this.store.select(p => p.settings.profile).pipe(takeUntil(this.destroyed$)).subscribe((o) => {
            if (o && !_.isEmpty(o)) {
                let companyInfo = _.cloneDeep(o);
                this.currentBranch = companyInfo.name;
                this.currentBranchNameAlias = companyInfo.nameAlias;
            }
        });

        let branchFilterRequest = new BranchFilterRequest();

        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        this.store.dispatch(this.settingsBranchActions.GetALLBranches(branchFilterRequest));
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

        // get view from sidebar while clicking on group/stock
        this.invViewService.getActiveView().subscribe(v => {
            this.activeView = v.view;
            if (this.branchesWithWarehouse && this.branchesWithWarehouse.length === 0) {
                // First time initialization (when first stock is created in a new company), load the filter values
                this.loadBranchAndWarehouseDetails();
            }
        });
    }

    public ngOnInit() {
        this.isBranchVisible$ = this.store.select(s => s.inventory.showBranchScreen).pipe(takeUntil(this.destroyed$));
        document.querySelector('body').classList.add('inventory-page');

        this.store.dispatch(this.invoiceActions.getInvoiceSetting());

        this.activeTabIndex = this.router.url.indexOf('jobwork') > -1 ? 1 : this.router.url.indexOf('manufacturing') > -1 ? 2 : this.router.url.indexOf('inventory/report') > -1 ? 3 : 0;

        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(s => {
            if (s instanceof NavigationEnd) {
                let index = s.url.indexOf('jobwork') > -1 ? 1 : s.url.indexOf('manufacturing') > -1 ? 2 : s.url.indexOf('inventory/report') > -1 ? 3 : 0;
                if (this.activeTabIndex !== index) {
                    this.activeTabIndex = index;
                    this.saveLastState();
                }
            }
        });
    }

    public ngOnDestroy() {
        this.store.dispatch(this._inventoryAction.ResetInventoryState());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public ngAfterViewInit() {
        this.setDefaultGroup();
    }

    public setDefaultGroup() {
        // for first time load, show first group report
        this.groupsWithStocks$.pipe(take(2)).subscribe(a => {
            if (a && !this.activeView) {
                this.GroupStockReportRequest = new GroupStockReportRequest();
                let firstElement = a[0];
                if (firstElement) {
                    this.GroupStockReportRequest.from = moment().add(-1, 'month').format('DD-MM-YYYY');
                    this.GroupStockReportRequest.to = moment().format('DD-MM-YYYY');
                    this.GroupStockReportRequest.stockGroupUniqueName = firstElement.uniqueName;
                    this.activeView = 'group';
                    this.firstDefaultActiveGroup = firstElement.uniqueName;
                    this.firstDefaultActiveGroupName = firstElement.name;
                    if (this.activeTabIndex === 0) {
                        // Selected tab is Inventory
                        this.loadBranchAndWarehouseDetails();
                        this.store.dispatch(this.sideBarAction.GetInventoryGroup(firstElement.uniqueName)); // open first default group
                        this.store.dispatch(this.stockReportActions.GetGroupStocksReport(_.cloneDeep(this.GroupStockReportRequest))); // open first default group
                    } else {
                        this.store.dispatch(this.sideBarAction.GetInventoryGroup(firstElement.uniqueName)); // open first default group
                        this.store.dispatch(this.stockReportActions.GetGroupStocksReport(_.cloneDeep(this.GroupStockReportRequest))); // open first default group
                    }
                }
            }
        });
    }

    public openCreateCompanyModal() {
        this.loadAddCompanyComponent();
    }

    public redirectUrlToActiveTab(type: string, event: any, activeTabIndex?: number, currentUrl?: string) {
        if (event) {
            if (!(event instanceof TabDirective)) {
                return;
            }
        }
        if (currentUrl) {
            this.router.navigateByUrl(this.currentUrl);
        } else {
            switch (type) {
                case 'inventory':
                    this.navigateToInventoryTab();
                    break;
                case 'jobwork':
                    this.router.navigate(['/pages', 'inventory', 'jobwork'], { relativeTo: this.route });
                    this.activeTabIndex = 1;
                    break;
                case 'manufacturing':
                    this.router.navigate(['/pages', 'inventory', 'manufacturing'], { relativeTo: this.route });
                    this.activeTabIndex = 2;
                    break;
                case 'report':
                    this.router.navigate(['/pages', 'inventory', 'report'], { relativeTo: this.route });
                    this.activeTabIndex = 3;
                    break;
            }
        }

        setTimeout(() => {
            if (activeTabIndex) {
                this.inventoryStaticTabs.tabs[activeTabIndex].active = true;
            } else {
                this.inventoryStaticTabs.tabs[this.activeTabIndex].active = true;
            }
        });
    }

    public loadAddCompanyComponent() {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(CompanyAddComponent);
        let viewContainerRef = this.companyadd.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        (componentRef.instance as CompanyAddComponent).createBranch = true;
    }

    public openAddBranchModal() {
        this.branchModal.show();
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

    public getAllBranches() {
        let branchFilterRequest = new BranchFilterRequest();
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        this.store.dispatch(this.settingsBranchActions.GetALLBranches(branchFilterRequest));
        this.store.dispatch(this.settingsBranchActions.GetParentCompany());
    }

    /**
     * Loads the report by selected warehouse
     *
     * @param {string} selectedWarehouse User selected warehouse
     * @memberof InventoryGroupStockReportComponent
     */
    public loadReportByWarehouse(selectedWarehouse: string): void {
        this.currentBranchAndWarehouseFilterValues = { ...this.currentBranchAndWarehouseFilterValues, warehouse: selectedWarehouse };
    }
    /**
     * Loads the report by selected branch
     *
     * @param {string} selectedBranch User selected branch
     * @memberof InventoryComponent
     */
    public loadReportByBranch(selectedBranch: string): void {
        this.loadBranchWarehouse(selectedBranch);
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

    private saveLastState() {
        let companyUniqueName = null;
        let state = this.activeTabIndex === 0 ? 'inventory' : this.activeTabIndex === 1 ? 'inventory/jobwork' : this.activeTabIndex === 2 ? 'inventory/manufacturing' : 'inventory/report';
        this.store.pipe(select(c => c.session.companyUniqueName), take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = `/pages/${state}`;

        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    }

    /**
     * Loads the branch and their warehouse details for filters
     *
     * @private
     * @memberof InventoryComponent
     */
    private loadBranchAndWarehouseDetails(): void {
        this.loadInventoryTab(() => {
            this.loadBranchWithWarehouse();
            if (!this.GroupStockReportRequest) {
                this.GroupStockReportRequest = new GroupStockReportRequest();
            }
            this.GroupStockReportRequest.branchUniqueName = this.currentBranchAndWarehouseFilterValues.branch;
            this.GroupStockReportRequest.warehouseUniqueName = (this.currentBranchAndWarehouseFilterValues.warehouse !== 'all-entities') ? this.currentBranchAndWarehouseFilterValues.warehouse : null;;
        });
    }

    /**
     * Loads the inventory tab after fetching linked stocks
     *
     * @private
     * @param {Function} successCallback Success callback function to carry out further tasks
     * @memberof InventoryComponent
     */
    private loadInventoryTab(successCallback: Function): void {
        this.inventoryService.getLinkedStocks().subscribe((response) => {
            if (response) {
                if (response.status === 'success' && response.body && response.body.results) {
                    this.branchesWithWarehouse = response.body.results;
                    successCallback();
                } else if (response.status === 'error') {
                    this.toastService.errorToast(response.message, response.code);
                }
            }
        });
    }

    /**
     * Navigates to inventory tab
     *
     * @private
     * @memberof InventoryComponent
     */
    private navigateToInventoryTab(): void {
        this.router.navigate(['/pages', 'inventory'], { relativeTo: this.route });
        this.activeTabIndex = 0;
        if (this.firstDefaultActiveGroup) {
            this.invViewService.setActiveView('group', this.firstDefaultActiveGroupName, null, this.firstDefaultActiveGroup, true);
            this.store.dispatch(this.sideBarAction.GetInventoryGroup(this.firstDefaultActiveGroup)); // open first default group
        }
    }

    /**
     * Loads the particular branch's warehouse in drop down
     *
     * @private
     * @param {string} selectedBranchUniqueName Selected branch unique name
     * @memberof InventoryComponent
     */
    private loadBranchWarehouse(selectedBranchUniqueName: string): void {
        let branchDetails: any = this.branchesWithWarehouse.filter((branch) => branch.uniqueName === selectedBranchUniqueName);
        if (branchDetails && branchDetails.length > 0) {
            branchDetails = branchDetails.pop();
            const warehouseData = this.settingsUtilityService.getFormattedWarehouseData(branchDetails.warehouses);
            if (warehouseData.formattedWarehouses && warehouseData.formattedWarehouses.length) {
                const allEntity = { label: 'All Entity', value: 'all-entities' };
                let warehouse;
                if (warehouseData.formattedWarehouses.length > 1) {
                    warehouseData.formattedWarehouses.unshift(allEntity);
                    // Select 'All Entity' as default if warehouse count is more than 1
                    warehouse = 'all-entities';
                } else {
                    warehouse = warehouseData.formattedWarehouses[0].uniqueName;
                }
                const currentWarehouse = warehouseData.formattedWarehouses.find((data) => data.uniqueName === warehouse || data.value === warehouse);
                if (currentWarehouse) {
                    this.warehouseFilter.filter = currentWarehouse.label;
                }
                this.currentBranchAndWarehouseFilterValues = { warehouse, branch: branchDetails.uniqueName };
            }
            this.warehouses = warehouseData.formattedWarehouses;
        }
    }

    /**
     * Parses the response received from linked sources API
     *
     * @private
     * @memberof InventoryComponent
     */
    private loadBranchWithWarehouse(): void {
        if (this.branchesWithWarehouse && this.branchesWithWarehouse.length) {
            let currentCompanyUniqueName;
            this.store.pipe(select(state => state.session.companyUniqueName), take(1)).subscribe(uniqueName => currentCompanyUniqueName = uniqueName);
            const headQuarterIndex = this.branchesWithWarehouse.findIndex(branch => branch.isHeadQuarter);
            if (headQuarterIndex > -1 && this.branchesWithWarehouse[headQuarterIndex].uniqueName !== currentCompanyUniqueName) {
                // Remove the head quarter if the current company is a branch as branches don't have access to view head quarter details
                this.branchesWithWarehouse.splice(headQuarterIndex, 1);
            }
            this.branches = this.branchesWithWarehouse.map((branch: any) => ({ label: branch.name, value: branch.uniqueName }));
            this.loadBranchWarehouse(currentCompanyUniqueName);
        }
    }
}

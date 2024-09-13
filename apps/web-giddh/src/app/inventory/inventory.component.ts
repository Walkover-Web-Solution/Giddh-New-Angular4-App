import { InventoryAction } from '../actions/inventory/inventory.actions';
import { CompanyResponse, BranchFilterRequest } from '../models/api-models/Company';
import { GroupStockReportRequest, StockDetailResponse, StockGroupResponse } from '../models/api-models/Inventory';
import { InvoiceActions } from '../actions/invoice/invoice.actions';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { combineLatest, Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { createSelector } from 'reselect';
import { select, Store } from '@ngrx/store';
import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppState } from '../store';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { CompanyActions } from '../actions/company.actions';
import { SettingsBranchActions } from '../actions/settings/branch/settings.branch.action';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { InvViewService } from './inv.view.service';
import { SidebarAction } from "../actions/inventory/sidebar.actions";
import { StockReportActions } from "../actions/inventory/stocks-report.actions";
import * as dayjs from 'dayjs';
import { IGroupsWithStocksHierarchyMinItem } from "../models/interfaces/groups-with-stocks.interface";
import { InventoryService } from '../services/inventory.service';
import { ToasterService } from '../services/toaster.service';
import { SettingsUtilityService } from '../settings/services/settings-utility.service';
import { ShSelectComponent } from '../theme/ng-virtual-select/sh-select.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import { OrganizationType } from '../models/user-login-state';
import { GeneralService } from '../services/general.service';
import { cloneDeep, each, find, orderBy } from '../lodash-optimized';
import { BranchHierarchyType } from '../app.constant';

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
    @ViewChild('branchModal', { static: true }) public branchModal: ModalDirective;
    @ViewChild('addCompanyModal', { static: true }) public addCompanyModal: ModalDirective;
    @ViewChild('companyadd', { static: true }) public companyadd: ElementViewContainerRef;
    @ViewChild('confirmationModal', { static: true }) public confirmationModal: ModalDirective;
    @ViewChild('inventoryStaticTabs', { static: true }) public inventoryStaticTabs: TabsetComponent;
    /** Warehouse filter instance */
    @ViewChild('warehouseFilter', { static: false }) warehouseFilter: ShSelectComponent;
    /** Instance of branch transfer template */
    @ViewChild('branchtransfertemplate', { static: true }) public branchtransfertemplate: TemplateRef<any>;

    public dataSyncOption = IsyncData;
    public companies$: Observable<CompanyResponse[]>;
    public branches$: Observable<CompanyResponse[]>;
    public selectedCompaniesUniquename: string[] = [];
    public selectedCompaniesName: any[] = [];
    public isAllSelected$: Observable<boolean> = observableOf(false);
    public confirmationMessage: string = '';
    public selectedBranch: string = null;
    public isBranchVisible$: Observable<boolean>;
    public activeStock$: Observable<StockDetailResponse>;
    public activeGroup$: Observable<StockGroupResponse>;
    public groupsWithStocks$: Observable<IGroupsWithStocksHierarchyMinItem[]>;
    public activeTab: string = 'inventory';
    public activeView: string = null;
    public activeTabIndex: number = 0;
    public message: any;
    public GroupStockReportRequest: GroupStockReportRequest;
    public firstDefaultActiveGroup: string = null;
    public firstDefaultActiveGroupName: string = null;
    /** Stores the branch details along with warehouse details */
    public branchesWithWarehouse: Array<any> = [];
    /** Stores the current value of branch and warehouse selected for filters */
    public currentBranchAndWarehouseFilterValues: { warehouse: string, branch: string, isCompany: boolean } = { warehouse: '', branch: '', isCompany: false };
    /** List of warehouses */
    public warehouses: Array<any> = [];
    /** List of branches */
    public branches: Array<any> = [];
    /** Stores the current organziation type */
    public currentOrganizationType: OrganizationType;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold if it's mobile screen or not */
    public isMobileScreen: boolean = false;
    /* This will hold if it's mobile screen or not */
    public isMobileView: boolean = false;
    /** Holds the observable for universal date */
    public universalDate$: Observable<any>;
    /** Emits some value if either group or stock is active, used to show the detailed report */
    public shouldShowInventoryReport$: Observable<any>;
    /** Emits when group delete operation is successful */
    public removeGroupSuccess$: Observable<any>;
    /** True if get branches api has initiated once */
    private getBranchesInitiated: boolean = false;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2;
    /** Hold branch transfer mode  */
    public branchTransferMode: string = "";
    /** This will use for bootstrap modal refrence */
    public modalRef: BsModalRef;

    constructor(
        private store: Store<AppState>,
        private _inventoryAction: InventoryAction,
        private invoiceActions: InvoiceActions,
        private inventoryService: InventoryService,
        private settingsBranchActions: SettingsBranchActions,
        private companyActions: CompanyActions,
        private settingsProfileActions: SettingsProfileActions,
        private invViewService: InvViewService,
        private router: Router,
        private route: ActivatedRoute,
        private stockReportActions: StockReportActions,
        private sideBarAction: SidebarAction,
        private settingsUtilityService: SettingsUtilityService,
        private toastService: ToasterService,
        private breakPointObservar: BreakpointObserver,
        private generalService: GeneralService,
        private modalService: BsModalService
    ) {
        this.breakPointObservar.observe([
            '(max-width: 1023px)',
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result?.breakpoints['(max-width: 1023px)'];
            this.isMobileView = result?.breakpoints['(max-width: 767px)'];
        });
        this.activeStock$ = this.store.pipe(select(p => p.inventory.activeStock), takeUntil(this.destroyed$));
        this.activeGroup$ = this.store.pipe(select(p => p.inventory.activeGroup), takeUntil(this.destroyed$));
        this.groupsWithStocks$ = this.store.pipe(select(s => s.inventory.groupsWithStocks), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        if (this.voucherApiVersion === 2) {
            document.querySelector("body")?.classList?.add("inventory-v2");
        }

        this.store.pipe(select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.settings.branches], (companies, branches) => {
            if (branches) {
                if (branches.length) {
                    each(branches, (branch) => {
                        if (branch.addresses && branch.addresses?.length) {
                            branch.addresses = [find(branch.addresses, (gst) => gst && gst.isDefault)];
                        }
                    });
                    this.branches$ = observableOf(orderBy(branches, 'name'));
                } else if (branches?.length === 0) {
                    this.branches$ = observableOf(null);
                }
            } else {
                this.getAllBranches();
            }
            if (companies && companies.length && branches) {
                let companiesWithSuperAdminRole = [];
                each(companies, (cmp) => {
                    each(cmp.userEntityRoles, (company) => {
                        if (company.entity.entity === 'COMPANY' && company.role?.uniqueName === 'super_admin') {
                            if (branches && branches.length) {
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

        // get view from sidebar while clicking on group/stock
        this.invViewService.getActiveView().pipe(takeUntil(this.destroyed$)).subscribe(activeViewData => {
            if (activeViewData?.view) {
                this.activeView = activeViewData.view;
            } else {
                this.activeView = null;
            }

            if (this.branchesWithWarehouse && this.branchesWithWarehouse.length === 0) {
                // First time initialization (when first stock is created in a new company), load the filter values
                this.loadBranchAndWarehouseDetails();
            }
        });

        this.isBranchVisible$ = this.store.pipe(select(s => s.inventory.showBranchScreen), takeUntil(this.destroyed$));
        this.store.dispatch(this.companyActions.getTax());
        document.querySelector('body').classList.add('inventory-page');
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        if (this.currentOrganizationType === OrganizationType.Branch) {
            this.loadBranchWarehouse(this.generalService.currentBranchUniqueName);
        }
        this.store.dispatch(this.invoiceActions.getInvoiceSetting());
        this.universalDate$ = this.store.pipe(select(appStore => appStore.session.applicationDate), takeUntil(this.destroyed$));

        if (this.voucherApiVersion === 2) {
            this.activeTabIndex = this.router.url?.indexOf('jobwork') > -1 ? 1 : this.router.url?.indexOf('manufacturing') > -1 ? 2 : ((this.router.url?.indexOf('inventory/report')) || (this.router.url?.indexOf('inventory/report/receiptnote')) || (this.router.url?.indexOf('inventory/report/deliverychallan'))) > -1 ? 3 : 0;
        } else {
            this.activeTabIndex = this.router.url?.indexOf('jobwork') > -1 ? 1 : this.router.url?.indexOf('manufacturing') > -1 ? 2 : this.router.url?.indexOf('inventory/report') > -1 ? 3 : (this.router.url?.indexOf('inventory/report/receipt') > -1 || this.router.url?.indexOf('inventory/report/delivery') > -1) ? 3 : 0;
        }
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe((params) => {
            if (params.type) {
                if (params?.type === 'deliverychallan') {
                    this.branchTransferMode = 'deliverynote';
                } else {
                    this.branchTransferMode = params.type;
                }
                this.modalRef = this.modalService.show(
                    this.branchtransfertemplate,
                    Object.assign({}, { class: 'modal-lg receipt-note-modal  mb-0 pd-t85' })
                );
            }
        });
        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(s => {
            if (s instanceof NavigationEnd) {
                if (this.voucherApiVersion === 2) {
                    this.activeTabIndex = this.router.url?.indexOf('jobwork') > -1 ? 1 : this.router.url?.indexOf('manufacturing') > -1 ? 2 : ((this.router.url?.indexOf('inventory/report')) || (this.router.url?.indexOf('inventory/report/receiptnote')) || (this.router.url?.indexOf('inventory/report/deliverychallan'))) > -1 ? 3 : 0;
                } else {
                    this.activeTabIndex = this.router.url?.indexOf('jobwork') > -1 ? 1 : this.router.url?.indexOf('manufacturing') > -1 ? 2 : this.router.url?.indexOf('inventory/report') > -1 ? 3 : (this.router.url?.indexOf('inventory/report/receipt') > -1 || this.router.url?.indexOf('inventory/report/delivery') > -1) ? 3 : 0;
                }
            }
        });
        this.shouldShowInventoryReport$ = combineLatest([this.store.pipe(select(appStore => appStore.inventory.activeStockUniqueName)), this.store.pipe(select(appStore => appStore.inventory.activeGroupUniqueName))]).pipe(map(values => values[0] || values[1]));
        this.removeGroupSuccess$ = this.store.pipe(select(appStore => appStore.inventory.deleteGroupSuccess), takeUntil(this.destroyed$));
        this.removeGroupSuccess$.subscribe(response => {
            if (response) {
                // A group or sub-group is deleted
                let groupWithStocks = [];
                this.groupsWithStocks$.subscribe(groupsWithStocks => groupWithStocks = groupsWithStocks ?? []);
                this.loadDefaultGroup(groupWithStocks);
            }
        });
    }

    /**
     *This will use for hide branch transfer
     *
     * @memberof InventoryComponent
     */
    public hideModal(): void {
        this.router.navigate(['/pages/inventory/report']);
        this.modalRef.hide();
    }
    public ngOnDestroy() {
        if (this.voucherApiVersion === 2) {
            document.querySelector("body")?.classList?.remove("inventory-v2");
        }
        this.store.dispatch(this._inventoryAction.ResetInventoryState());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public ngAfterViewInit() {
        if (!this.isMobileScreen) {
            this.setDefaultGroup();
        }
    }

    public setDefaultGroup() {
        // for first time load, show first group report
        this.groupsWithStocks$.pipe(takeUntil(this.destroyed$)).subscribe(a => {
            if (a && !this.activeView) {
                this.loadDefaultGroup(a);
            } else if (a?.length === 0 && this.activeView) {
                this.invViewService.clearMessage('stock_group');
            }
        });
    }

    public redirectUrlToActiveTab(type: string, event: any, activeTabIndex?: number, currentUrl?: string) {
        if (event) {
            if (!(event instanceof TabDirective)) {
                return;
            }
        }
        if (currentUrl) {
            this.router.navigateByUrl(currentUrl);
        } else {
            if (this.voucherApiVersion === 2) {
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
                    case 'report/receiptnote':
                        this.router.navigate(['/pages', 'inventory', 'report', 'receiptnote'], { relativeTo: this.route });
                        this.activeTabIndex = 3;
                        break;
                    case 'report/deliverychallan':
                        this.router.navigate(['/pages', 'inventory', 'report', 'deliverychallan'], { relativeTo: this.route });
                        this.activeTabIndex = 3;
                        break;
                }
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
                }
            }
        }

        setTimeout(() => {
            if (activeTabIndex) {
                if (this.inventoryStaticTabs && this.inventoryStaticTabs.tabs && this.inventoryStaticTabs.tabs[activeTabIndex]) {
                    this.inventoryStaticTabs.tabs[activeTabIndex].active = true;
                }
            } else {
                if (this.inventoryStaticTabs && this.inventoryStaticTabs.tabs && this.inventoryStaticTabs.tabs[this.activeTabIndex]) {
                    this.inventoryStaticTabs.tabs[this.activeTabIndex].active = true;
                }
            }
        });
    }

    public openAddBranchModal() {
        this.branchModal?.show();
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
        this.hideAddBranchModal();
    }

    public removeBranch(branchUniqueName, companyName) {
        this.selectedBranch = branchUniqueName;
        this.confirmationMessage = `Are you sure want to remove <b>${companyName}</b>?`;
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

    public getAllBranches() {
        if (!this.getBranchesInitiated) {
            this.getBranchesInitiated = true;
            let branchFilterRequest = new BranchFilterRequest();
            branchFilterRequest.hierarchyType = BranchHierarchyType.Flatten;
            this.store.dispatch(this.settingsBranchActions.GetALLBranches(branchFilterRequest));
        }
    }

    /**
     * Loads the report by selected warehouse
     *
     * @param {string} selectedWarehouse User selected warehouse
     * @memberof InventoryGroupStockReportComponent
     */
    public loadReportByWarehouse(selectedWarehouse: string): void {
        if (this.branches && this.branches.length <= 2) {
            this.currentBranchAndWarehouseFilterValues = { ...this.currentBranchAndWarehouseFilterValues, warehouse: selectedWarehouse, isCompany: true };
        } else {
            this.currentBranchAndWarehouseFilterValues = { ...this.currentBranchAndWarehouseFilterValues, warehouse: selectedWarehouse };
        }
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
            if (companies?.length === this.selectedCompaniesUniquename?.length) {
                this.isAllSelected$ = observableOf(true);
            } else {
                this.isAllSelected$ = observableOf(false);
            }
        });
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
            this.GroupStockReportRequest.branchUniqueName =
                this.currentBranchAndWarehouseFilterValues.branch !== this.generalService.companyUniqueName ?
                    this.currentBranchAndWarehouseFilterValues.branch : null;
            this.GroupStockReportRequest.warehouseUniqueName = (this.currentBranchAndWarehouseFilterValues.warehouse !== 'all-entities') ? this.currentBranchAndWarehouseFilterValues.warehouse : null;;
            this.store.dispatch(this.stockReportActions.GetGroupStocksReport(cloneDeep(this.GroupStockReportRequest))); // open first default group
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
        this.inventoryService.getLinkedStocks().pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                if (response.status === 'success' && response.body && response.body.results) {
                    this.branchesWithWarehouse = response.body.results;
                    successCallback();
                } else if (response?.status === 'error') {
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
        let branchDetails: any = this.branchesWithWarehouse?.filter((branch) => branch?.uniqueName === selectedBranchUniqueName);
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
                    warehouse = warehouseData.formattedWarehouses[0]?.uniqueName;
                }
                const currentWarehouse = warehouseData.formattedWarehouses.find((data) => data?.uniqueName === warehouse || data?.value === warehouse);
                if (currentWarehouse && this.warehouseFilter) {
                    this.warehouseFilter.filter = currentWarehouse.label;
                }
                this.currentBranchAndWarehouseFilterValues = { warehouse, branch: branchDetails?.uniqueName, isCompany: branchDetails.isCompany };
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
            let currentEntityUniqueName = this.generalService.currentOrganizationType === OrganizationType.Branch ? this.generalService.currentBranchUniqueName : this.generalService.companyUniqueName;
            this.branches = this.branchesWithWarehouse.map((branch: any) => ({ label: `${branch.alias || branch.name}`, value: branch?.uniqueName }));
            this.loadBranchWarehouse(currentEntityUniqueName);
        }
    }

    /**
     * This will return page heading based on active tab
     *
     * @param {boolean} event
     * @memberof InventoryComponent
     */
    public getPageHeading(): string {
        if (this.isMobileView) {
            if (this.activeTabIndex === 0) {
                return "Inventory";
            }
            else if (this.activeTabIndex === 1) {
                return "Job Work";
            }
            else if (this.activeTabIndex === 2) {
                return "Manufacturing";
            }
            else if (this.activeTabIndex === 3) {
                return "Report";
            }
        }
    }

    /**
     * Loads default group data
     *
     * @private
     * @param {Array<any>} response
     * @memberof InventoryComponent
     */
    private loadDefaultGroup(response: Array<any>): void {
        this.GroupStockReportRequest = new GroupStockReportRequest();
        let firstElement = response[0];
        if (firstElement) {
            this.universalDate$.pipe(take(1)).subscribe(dateObj => {
                if (dateObj) {
                    this.GroupStockReportRequest.from = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                    this.GroupStockReportRequest.to = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                } else {
                    this.GroupStockReportRequest.from = dayjs().add(-1, 'month').format(GIDDH_DATE_FORMAT);
                    this.GroupStockReportRequest.to = dayjs().format(GIDDH_DATE_FORMAT);
                }
            });

            this.GroupStockReportRequest.stockGroupUniqueName = firstElement?.uniqueName;
            this.activeView = 'group';
            this.firstDefaultActiveGroup = firstElement?.uniqueName;
            this.firstDefaultActiveGroupName = firstElement.name;
            if (this.activeTabIndex === 0) {
                // Selected tab is Inventory
                this.loadBranchAndWarehouseDetails();
                this.store.dispatch(this.sideBarAction.GetInventoryGroup(firstElement?.uniqueName)); // open first default group
            } else {
                this.store.dispatch(this.sideBarAction.GetInventoryGroup(firstElement?.uniqueName)); // open first default group
                this.store.dispatch(this.stockReportActions.GetGroupStocksReport(cloneDeep(this.GroupStockReportRequest))); // open first default group
            }
        }
    }
}

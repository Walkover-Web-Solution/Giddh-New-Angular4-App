import { Component, EventEmitter, Output, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, Inject, TemplateRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Store, select } from '@ngrx/store';
import { OrganizationType } from '../../../models/user-login-state';
import { GeneralService } from '../../../services/general.service';
import { AppState } from '../../../store';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { Location } from '@angular/common';
import { ASIDE_PANE_CONFIG, BranchHierarchyType } from '../../../app.constant';
import { ServiceConfig } from '../../../services/service.config';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageLeaveUtilityService } from '../../../services/page-leave-utility.service';
import { ComponentCanDeactivate } from '../../../decorators/page-leave-confirmation-guard';
import { CommonActions } from '../../../actions/common.actions';

/**
 * Data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface SidebarNode {
    icons?: string;
    name: string;
    link?: string;
    hiddenLink?: string[]; // this will hold link of the page which is not available to go through directly
    moduleType?: string;
    openActiveMenu?: boolean;
    children?: SidebarNode[];
    onlyBranchMode?: boolean;
}

/** Flat node with expandable and level information */
interface SidebarFlatNode {
    expandable: boolean;
    name: string;
    level: number;
}
@Component({
    selector: 'inventory-sidebar',
    
    templateUrl: './inventory-sidebar.component.html',
    standalone: false,
    styleUrls: [`./inventory-sidebar.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventorySidebarComponent implements OnDestroy, ComponentCanDeactivate {
    /** This will hold new inventory template reference */
    @ViewChild('asideMenuStateForCreateNewInventoryTemplate') asideMenuStateForCreateNewInventoryTemplate: TemplateRef<any>;
    /** This will hold aside menu state */
    public asideMenuStateForCreateNewInventoryDialogRef: MatDialogRef<any>;
    /** Callback function to check for unsaved changes from parent component */
    public hasUnsavedChangesCallback: () => boolean;
    /** Callback function to clean up forms from parent component */
    public markFormsAsPristineCallback: () => void;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /* Event emitter for close sidebar popup event */
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holding data in SidebarNode Array */
    public dataList: SidebarNode[] = [];
    /** Holds images folder path */
    public imgPath: string = "";
    /** Holds transformer data */
    public transformer = (node: SidebarNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name,
            level: level,
            icons: node.icons,
            link: node.link,
            openActiveMenu: node?.openActiveMenu,
            moduleType: node?.moduleType,
            onlyBranchMode: node?.onlyBranchMode,
            hiddenLink: node?.hiddenLink
        };
    };
    /** Holds treeControl data */
    public treeControl = new FlatTreeControl<SidebarFlatNode>(
        node => node.level,
        node => node.expandable,
    );
    /** Holds treeFlattener data */
    public treeFlattener = new MatTreeFlattener(
        this.transformer,
        node => node.level,
        node => node.expandable,
        node => node.children,
    );
    /** Holds dataSource data */
    public dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    /** Holds tree data has child */
    public hasChild = (_: number, node: SidebarFlatNode) => node.expandable;
    /** Holds inventory type module  */
    public moduleType: string = '';
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Holds current page url */
    private currentUrl: string = "";

    constructor(
        private router: Router,
        private changeDetection: ChangeDetectorRef,
        private generalService: GeneralService,
        private store: Store<AppState>,
        @Inject(ServiceConfig) private serviceConfig,
        private settingsBranchAction: SettingsBranchActions,
        private location: Location,
        private dialog: MatDialog,
        private pageLeaveUtilityService: PageLeaveUtilityService,
        private commonAction: CommonActions
    ) {
    }

    /**
     * Initializes the component
     *
     * @memberof InventorySidebarComponent
    */
    public ngOnInit(): void {
        this.imgPath = this.serviceConfig.IMG_PATH;
        this.currentUrl = this.router.url;
        this.setupNavigationListener();
        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.currentUrl = event.url;
                this.openActiveMenu(this.currentUrl);
            }
        });

        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });

        this.store.pipe(select(state => state.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.length) {
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && response?.length >= 2;
                this.changeDetection.detectChanges();
            } else {
                if (this.generalService.companyUniqueName) {
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                }
            }
        });
    }

    /**
     * This will use for open active node in sidebar
     *
     * @param {string} url
     * @memberof InventorySidebarComponent
     */
    public openActiveMenu(url: string): void {
        let activeNodeIndex = null;
        this.dataSource.data?.forEach((tree, index) => {
            if (activeNodeIndex === null) {
                let activeNode = tree?.children?.filter(node => node?.link === url || node?.hiddenLink?.includes(url));
                if (activeNode?.length) {
                    activeNodeIndex = index;
                }
            }
        });
        let rootLevelNodes = this.treeControl.dataNodes?.filter(node => node.level === 0);
        if (activeNodeIndex !== null) {
            this.treeControl.expand(rootLevelNodes[activeNodeIndex]);
        }
    }

    /**
     * This will close the aside panel
     *
     * @param {*} [event]
     * @memberof InventorySidebarComponent
     */
    public closeAsidePane(event?: any): void {
        this.closeAsideEvent.emit(event);
    }

    /**
     * This will navigate the user to previous page
     *
     * @memberof InventorySidebarComponent
     */
    public goToPreviousPage(): void {
        // Check for unsaved changes before proceeding
        
        if (this.showPageLeaveConfirmation) {
            let dialogRef = this.pageLeaveUtilityService.openDialog();
            
            dialogRef.afterClosed().subscribe((action) => {
                if (action) {
                    // User confirmed to proceed - clean up and continue
                    this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
                    this.markFormsAsPristine();
                    this.proceedWithGoToPreviousPage();
                }
                // If user cancelled, do nothing - stay on current state
            });
            return;
        }
        
        this.proceedWithGoToPreviousPage();
    }

    /**
     * Proceeds with navigation to previous page after confirmation check
     *
     * @private
     * @memberof InventorySidebarComponent
     */
    private proceedWithGoToPreviousPage(): void {
        this.location.back();
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof ActivityLogsComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.translationLoaded = true;
            this.dataList = [
                {
                    name: this.localeData?.sidebar?.stock,
                    icons: 'stock.svg',
                    children: [
                        { name: this.localeData?.sidebar?.create_new, icons: 'create-new.svg', openActiveMenu: true, moduleType: 'product', hiddenLink: ['/pages/inventory/v2/stock/product/create', '/pages/inventory/v2/group/product/create'] },
                        { name: this.localeData?.sidebar?.item_wise, icons: 'item-wise.svg', link: '/pages/inventory/v2/reports/product/stock' },
                        { name: this.localeData?.sidebar?.group_wise, icons: 'group-wise.svg', link: '/pages/inventory/v2/reports/product/group' },
                        { name: this.localeData?.sidebar?.variant_wise, icons: 'varient-wise.svg', link: '/pages/inventory/v2/reports/product/variant' },
                        { name: this.localeData?.sidebar?.transactions, icons: 'transactions.svg', link: '/pages/inventory/v2/reports/product/transaction' },
                        { name: this.localeData?.sidebar?.master, icons: 'transactions.svg', link: '/pages/inventory/v2/product/master' },
                        { name: this.localeData?.sidebar?.inventory, icons: 'home-icon-black.svg', link: '/pages/inventory/v2/product/bulk-stock-edit' },
                        { name: this.localeData?.sidebar?.stock_aging_report, icons: 'home-icon-black.svg', link: '/pages/inventory/v2/product/stock-aging-report' },
                        { name: this.localeData?.sidebar?.inventory_adjustment, icons: 'home-icon-black.svg', link: '/pages/inventory/v2/product/adjust', hiddenLink: ['/pages/inventory/v2/product/adjust/create'] },
                        { name: this.localeData?.sidebar?.batch_report, icons: 'home-icon-black.svg', link: '/pages/inventory/v2/product/batch' }
                    ],
                },
                {
                    name: this.localeData?.sidebar?.services,
                    icons: 'service.svg',
                    children: [
                        { name: this.localeData?.sidebar?.create_new, icons: 'create-new.svg', openActiveMenu: true, moduleType: 'service', hiddenLink: ['/pages/inventory/v2/stock/service/create', '/pages/inventory/v2/group/service/create'] },
                        { name: this.localeData?.sidebar?.item_wise, icons: 'item-wise.svg', link: '/pages/inventory/v2/reports/service/stock' },
                        { name: this.localeData?.sidebar?.group_wise, icons: 'group-wise.svg', link: '/pages/inventory/v2/reports/service/group' },
                        { name: this.localeData?.sidebar?.variant_wise, icons: 'varient-wise.svg', link: '/pages/inventory/v2/reports/service/variant' },
                        { name: this.localeData?.sidebar?.transactions, icons: 'transactions.svg', link: '/pages/inventory/v2/reports/service/transaction' },
                        { name: this.localeData?.sidebar?.master, icons: 'transactions.svg', link: '/pages/inventory/v2/service/master' },
                        { name: this.localeData?.sidebar?.inventory, icons: 'home-icon-black.svg', link: '/pages/inventory/v2/service/bulk-stock-edit' },
                        { name: this.localeData?.sidebar?.stock_aging_report, icons: 'home-icon-black.svg', link: '/pages/inventory/v2/service/stock-aging-report' },
                        { name: this.localeData?.sidebar?.inventory_adjustment, icons: 'home-icon-black.svg', link: '/pages/inventory/v2/service/adjust', hiddenLink: ['/pages/inventory/v2/service/adjust/create'] },
                        { name: this.localeData?.sidebar?.batch_report, icons: 'home-icon-black.svg', link: '/pages/inventory/v2/service/batch' }
                    ],
                },
                {
                    name: this.localeData?.sidebar?.fixed_assets,
                    icons: 'fixed-assets.svg',
                    children: [
                        { name: this.localeData?.sidebar?.create_new, icons: 'create-new.svg', openActiveMenu: true, moduleType: 'fixedassets', hiddenLink: ['/pages/inventory/v2/stock/fixedassets/create', '/pages/inventory/v2/group/fixedassets/create'] },
                        { name: this.localeData?.sidebar?.item_wise, icons: 'item-wise.svg', link: '/pages/inventory/v2/reports/fixedassets/stock' },
                        { name: this.localeData?.sidebar?.group_wise, icons: 'group-wise.svg', link: '/pages/inventory/v2/reports/fixedassets/group' },
                        { name: this.localeData?.sidebar?.variant_wise, icons: 'varient-wise.svg', link: '/pages/inventory/v2/reports/fixedassets/variant' },
                        { name: this.localeData?.sidebar?.transactions, icons: 'transactions.svg', link: '/pages/inventory/v2/reports/fixedassets/transaction' },
                        { name: this.localeData?.sidebar?.master, icons: 'transactions.svg', link: '/pages/inventory/v2/fixedassets/master' },
                        { name: this.localeData?.sidebar?.inventory, icons: 'home-icon-black.svg', link: '/pages/inventory/v2/fixedassets/bulk-stock-edit' },
                        { name: this.localeData?.sidebar?.stock_aging_report, icons: 'home-icon-black.svg', link: '/pages/inventory/v2/fixedassets/stock-aging-report' },
                        { name: this.localeData?.sidebar?.batch_report, icons: 'home-icon-black.svg', link: '/pages/inventory/v2/fixedassets/batch' }
                    ],
                },
                {
                    name: this.localeData?.sidebar?.manufacturing,
                    icons: 'manufacturing.svg',
                    children: [
                        { name: this.localeData?.sidebar?.create_new, icons: 'create-new.svg', link: '/pages/inventory/v2/manufacturing/create', onlyBranchMode: true },
                        { name: this.localeData?.sidebar?.report, icons: 'group-wise.svg', link: '/pages/inventory/v2/manufacturing/list' }
                    ],
                },
                {
                    name: this.localeData?.sidebar?.custom_price,
                    icons: 'stock.svg',
                    children: [
                        { name: this.localeData?.sidebar?.customer_wise, icons: 'customer-icon.svg', link: '/pages/inventory/v2/price/customer-wise' },
                        { name: this.localeData?.sidebar?.vendor_wise, icons: 'vendor-icon.svg', link: '/pages/inventory/v2/price/vendor-wise' }
                    ],
                },
                {
                    name: this.localeData?.sidebar?.custom_units,
                    link: '/pages/inventory/v2/custom-units',
                    icons: 'warehouse-opening-balance.svg'
                },
                {
                    name: this.localeData?.sidebar?.branch_transfer,
                    icons: 'branch-transfer.svg',
                    children: [
                        { name: this.localeData?.sidebar?.create_new, icons: 'create-new.svg', openActiveMenu: true, moduleType: 'branch-transfer', hiddenLink: ['/pages/inventory/v2/branch-transfer/receipt-note/create', '/pages/inventory/v2/branch-transfer/delivery-challan/create'], onlyBranchMode: true },
                        { name: this.localeData?.sidebar?.report, icons: 'group-wise.svg', link: '/pages/inventory/v2/branch-transfer/list' }
                    ],
                },
                {
                    name: this.localeData?.sidebar?.warehouse_balance,
                    link: '/pages/inventory/v2/stock-balance',
                    icons: 'warehouse-opening-balance.svg'
                }
            ];
            this.dataSource.data = this.dataList;

            this.openActiveMenu(this.currentUrl);

            this.changeDetection.detectChanges();
        }
    }

    /**
     * This will use for open aside pane dialog
     *
     * @param {*} [node]
     * @memberof InventorySidebarComponent
     */
    public openAsidePaneDialog(node?: any): void {
        this.moduleType = node?.moduleType;
        if (node?.openActiveMenu) {
            this.asideMenuStateForCreateNewInventoryDialogRef = this.dialog.open(this.asideMenuStateForCreateNewInventoryTemplate, ASIDE_PANE_CONFIG);
        }
    }

    /**
     * Sets up navigation listener to intercept route changes and check for unsaved changes
     *
     * @private
     * @memberof InventorySidebarComponent
     */
    private setupNavigationListener(): void {
        // Set up browser confirmation dialog for page leave
        this.pageLeaveUtilityService.addBrowserConfirmationDialog();
        
        // Use GeneralService's navigation listener which properly handles router interception
        this.generalService.setupNavigationListener(
            this.router,
            this.pageLeaveUtilityService,
            this.destroyed$,
            () => this.hasUnsavedChanges(),
            () => this.markFormsAsPristine(),
            { value: false } // isNavigating flag
        );
    }

    /**
     * Checks if there are unsaved changes using GeneralService
     *
     * @private
     * @returns {boolean}
     * @memberof InventorySidebarComponent
     */
    private hasUnsavedChanges(): boolean {
        // Use GeneralService to check for unsaved changes globally
        return this.generalService.checkForUnsavedChanges();
    }

    /**
     * Marks all forms as pristine using GeneralService
     *
     * @private
     * @memberof InventorySidebarComponent
     */
    private markFormsAsPristine(): void {
        // Use GeneralService to mark forms as pristine globally
        this.generalService.markAllFormsAsPristine();
    }

    /**
     * Sets the callback functions for checking unsaved changes and cleaning up forms
     *
     * @param {() => boolean} hasUnsavedChangesCallback
     * @param {() => void} markFormsAsPristineCallback
     * @memberof InventorySidebarComponent
     */
    public setPageLeaveCallbacks(hasUnsavedChangesCallback: () => boolean, markFormsAsPristineCallback: () => void): void {
        this.hasUnsavedChangesCallback = hasUnsavedChangesCallback;
        this.markFormsAsPristineCallback = markFormsAsPristineCallback;
    }

    /**
     * Getter to check if page leave confirmation should be shown
     * This is used by PageLeaveConfirmationGuard
     *
     * @readonly
     * @type {boolean}
     * @memberof InventorySidebarComponent
     */
    public get showPageLeaveConfirmation(): boolean {
        return this.hasUnsavedChanges();
    }

    /**
     * Implementation of ComponentCanDeactivate interface
     * This method is called by PageLeaveConfirmationGuard
     *
     * @returns {Promise<boolean>}
     * @memberof InventorySidebarComponent
     */
    public canDeactivate(): Promise<boolean> {
        if (this.showPageLeaveConfirmation) {
            return new Promise<boolean>((resolve) => {
                let dialogRef = this.pageLeaveUtilityService.openDialog();
                
                dialogRef.afterClosed().subscribe((action) => {
                    if (action) {
                        // User confirmed to proceed - clean up and continue
                        this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
                        this.markFormsAsPristine();
                        resolve(true);
                    } else {
                        // User cancelled - stay on current page
                        resolve(false);
                    }
                });
            });
        }
        return Promise.resolve(true);
    }

    /**
    * Releases the memory
    *
    * @memberof InventorySidebarComponent
    */
    public ngOnDestroy(): void {
        this.store.dispatch(this.commonAction.hasUnsavedChanges(false));
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}

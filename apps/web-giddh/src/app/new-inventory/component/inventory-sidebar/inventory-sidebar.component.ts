import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, Output, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Store, select } from '@ngrx/store';
import { OrganizationType } from '../../../models/user-login-state';
import { GeneralService } from '../../../services/general.service';
import { AppState } from '../../../store';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';

/**
 * Data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface SidebarNode {
    icons?: string;
    name: string;
    link?: string;
    hiddenLink?: string; // this will hold link of the page which is not available to go through directly
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
    styleUrls: [`./inventory-sidebar.component.scss`],
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
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventorySidebarComponent implements OnDestroy {
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /* Event emitter for close sidebar popup event */
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** True if mobile screen */
    public isMobileScreen: boolean = true;
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
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /** Holds inventory type module  */
    public moduleType: string = '';
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** Holds current page url */
    private currentUrl: string = "";

    constructor(
        private router: Router,
        private breakPointObserver: BreakpointObserver,
        private changeDetection: ChangeDetectorRef,
        private generalService: GeneralService,
        private store: Store<AppState>,
        private settingsBranchAction: SettingsBranchActions
    ) {
        this.breakPointObserver.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });
    }

    /**
     * Initializes the component
     *
     * @memberof InventorySidebarComponent
    */
    public ngOnInit(): void {
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.currentUrl = this.router.url;
        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.currentUrl = event.url;
                this.openActiveMenu(this.currentUrl);
            }
        });

        this.store.pipe(select(state => state.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.length) {
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && response?.length >= 2;
                this.changeDetection.detectChanges();
            } else {
                if (this.generalService.companyUniqueName) {
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
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
                let activeNode = tree?.children?.filter(node => node?.link === url || node?.hiddenLink === url);
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
        this.router.navigate(['/pages/inventory/v2']);
    }

    /**
     * This will close the settings popup if clicked outside and is mobile screen
     *
     * @param {*} [event]
     * @memberof InventorySidebarComponent
     */
    public closeAsidePaneIfMobile(event?: any): void {
        if (this.isMobileScreen && event?.target?.className !== "icon-bar") {
            this.closeAsideEvent.emit(event);
        }
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
                        { name: this.localeData?.sidebar?.create_new, icons: 'create-new.svg', openActiveMenu: true, moduleType: 'product', hiddenLink: '/pages/inventory/v2/stock/product/create' },
                        { name: this.localeData?.sidebar?.item_wise, icons: 'item-wise.svg', link: '/pages/inventory/v2/reports/product/stock' },
                        { name: this.localeData?.sidebar?.group_wise, icons: 'group-wise.svg', link: '/pages/inventory/v2/reports/product/group' },
                        { name: this.localeData?.sidebar?.variant_wise, icons: 'varient-wise.svg', link: '/pages/inventory/v2/reports/product/variant' },
                        { name: this.localeData?.sidebar?.transactions, icons: 'transactions.svg', link: '/pages/inventory/v2/reports/product/transaction' },
                        { name: this.localeData?.sidebar?.master, icons: 'transactions.svg', link: '/pages/inventory/v2/product/master' }
                    ],
                },
                {
                    name: this.localeData?.sidebar?.services,
                    icons: 'service.svg',
                    children: [
                        { name: this.localeData?.sidebar?.create_new, icons: 'create-new.svg', openActiveMenu: true, moduleType: 'service', hiddenLink: '/pages/inventory/v2/stock/service/create' },
                        { name: this.localeData?.sidebar?.item_wise, icons: 'item-wise.svg', link: '/pages/inventory/v2/reports/service/stock' },
                        { name: this.localeData?.sidebar?.group_wise, icons: 'group-wise.svg', link: '/pages/inventory/v2/reports/service/group' },
                        { name: this.localeData?.sidebar?.variant_wise, icons: 'varient-wise.svg', link: '/pages/inventory/v2/reports/service/variant' },
                        { name: this.localeData?.sidebar?.transactions, icons: 'transactions.svg', link: '/pages/inventory/v2/reports/service/transaction' },
                        { name: this.localeData?.sidebar?.master, icons: 'transactions.svg', link: '/pages/inventory/v2/service/master' }
                    ],
                },
                {
                    name: this.localeData?.sidebar?.fixed_assets,
                    icons: 'fixed-assets.svg',
                    children: [
                        { name: this.localeData?.sidebar?.create_new, icons: 'create-new.svg', openActiveMenu: true, moduleType: 'fixedassets', hiddenLink: '/pages/inventory/v2/stock/fixedassets/create' },
                        { name: this.localeData?.sidebar?.item_wise, icons: 'item-wise.svg', link: '/pages/inventory/v2/reports/fixedassets/stock' },
                        { name: this.localeData?.sidebar?.group_wise, icons: 'group-wise.svg', link: '/pages/inventory/v2/reports/fixedassets/group' },
                        { name: this.localeData?.sidebar?.variant_wise, icons: 'varient-wise.svg', link: '/pages/inventory/v2/reports/fixedassets/variant' },
                        { name: this.localeData?.sidebar?.transactions, icons: 'transactions.svg', link: '/pages/inventory/v2/reports/fixedassets/transaction' },
                        { name: this.localeData?.sidebar?.master, icons: 'transactions.svg', link: '/pages/inventory/v2/fixedassets/master' }
                    ],
                },
                // {
                //     name: this.localeData?.sidebar?.branch_transfer,
                //     icons: 'branch-transfer.svg',
                //     children: [
                //         { name: this.localeData?.sidebar?.create_branch_transfer, icons: 'create-new.svg', openActiveMenu: true, moduleType: 'branchtransfer' },
                //         { name: this.localeData?.sidebar?.report, icons: 'group-wise.svg', link: '/pages/inventory/v2/branch-transfer/list' }],
                // },
                {
                    name: this.localeData?.sidebar?.manufacturing,
                    icons: 'manufacturing.svg',
                    children: [
                        { name: this.localeData?.sidebar?.create_manufacturing, icons: 'create-new.svg', link: '/pages/inventory/v2/manufacturing/create', onlyBranchMode: true },
                        { name: this.localeData?.sidebar?.recipe, icons: 'create-new.svg', link: '/pages/inventory/v2/recipe/create' },
                        { name: this.localeData?.sidebar?.report, icons: 'group-wise.svg', link: '/pages/inventory/v2/manufacturing/list' }
                    ],
                },
                {
                    name: this.localeData?.sidebar?.warehouse_balance,
                    link: '/pages/inventory/v2/stock-balance',
                    icons: 'warehouse-opening-balance.svg'
                },
                // {
                //     name: this.localeData?.sidebar?.custom_units,
                //     link: '/pages/inventory/v2/custom-units',
                //     icons: 'warehouse-opening-balance.svg'
                // },
            ];
            this.dataSource.data = this.dataList;

            this.openActiveMenu(this.currentUrl);

            this.changeDetection.detectChanges();
        }
    }

    /**
    *Aside pane toggle fixed class
    *
    * @memberof InventorySidebarComponent
    */
    public toggleBodyClass(): void {
        if (this.asideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    /**
     *Aside pane open function
     *
     * @param {*} [event]
     * @param {*} [node]
     * @memberof InventorySidebarComponent
     */
    public toggleAsidePane(event?: any, node?: any): void {
        this.moduleType = node?.moduleType;
        if (node?.openActiveMenu) {
            if (event) {
                event.preventDefault();
            }
            this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
            this.toggleBodyClass();
        }
    }

    /**
     * This will use for close aside menu
     *
     * @param {*} [event]
     * @memberof InventorySidebarComponent
     */
    public closeAsideMenu(event?: any): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = 'out';
        this.toggleBodyClass();
    }

    /**
    * Releases the memory
    *
    * @memberof InventorySidebarComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}


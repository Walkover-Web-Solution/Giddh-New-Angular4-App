import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface SidebarNode {
    icons?: string;
    name: string;
    link?: string;
    children?: SidebarNode[];
}
const TREE_DATA: SidebarNode[] = [
    {
        name: 'Stock',
        icons: 'stock.svg',
        children: [
            { name: 'Create New', icons: 'create-new.svg', link: '/pages/new-inventory/stock/product/create' },
            { name: 'Item-wise', icons: 'item-wise.svg', link: '/pages/new-inventory/reports/product/stock' },
            { name: 'Group-wise', icons: 'group-wise.svg', link: '/pages/new-inventory/reports/product/group' },
            { name: 'Variant-wise', icons: 'varient-wise.svg', link: '/pages/new-inventory/reports/product/variant' },
            { name: 'Transactions', icons: 'transactions.svg', link: '/pages/new-inventory/reports/product/transaction' }],
    },
    {
        name: 'Services',
        icons: 'service.svg',
        children: [
            { name: 'Create New', icons: 'create-new.svg', link: '/pages/new-inventory/stock/service/create' },
            { name: 'Item-wise', icons: 'item-wise.svg', link: '/pages/new-inventory/reports/service/stock' },
            { name: 'Group-wise', icons: 'group-wise.svg', link: '/pages/new-inventory/reports/service/group' },
            { name: 'Variant-wise', icons: 'varient-wise.svg', link: '/pages/new-inventory/reports/service/variant' },
            { name: 'Transactions', icons: 'transactions.svg', link: '/pages/new-inventory/reports/service/transaction' }],
    },
    {
        name: 'Fixed Assets',
        icons: 'fixed-assets.svg',
        children: [
            { name: 'Create New', icons: 'create-new.svg', link: '/pages/new-inventory/stock/fixedassets/create' },
            { name: 'Item-wise', icons: 'item-wise.svg', link: '/pages/new-inventory/reports/fixedassets/stock' },
            { name: 'Group-wise', icons: 'group-wise.svg', link: '/pages/new-inventory/reports/fixedassets/group' },
            { name: 'Variant-wise', icons: 'varient-wise.svg', link: '/pages/new-inventory/reports/fixedassets/variant' },
            { name: 'Transactions', icons: 'transactions.svg', link: '/pages/new-inventory/reports/fixedassets/transaction' }],
    },
    {
        name: 'Branch Transfer',
        icons: 'branch-transfer.svg'
    },
    {
        name: 'Manufacturing',
        icons: 'manufacturing.svg'
    },
    {
        name: 'Warehouse Opening Balance',
        link: '/pages/new-inventory/stock-balance',
        icons: 'warehouse-opening-balance.svg'
    },
];
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
    public dataList: any[] = TREE_DATA;
    /** Holds images folder path */
    public imgPath: string = "";
    /** Holds transformer data */
    public transformer = (node: SidebarNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name,
            level: level,
            icons: node.icons,
            link: node.link
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

    constructor(
        private router: Router,
        private breakPointObserver: BreakpointObserver
    ) {
        this.breakPointObserver.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });
        this.dataSource.data = TREE_DATA;
    }

    /**
     * Initializes the component
     *
     * @memberof InventorySidebarComponent
    */
    public ngOnInit(): void {
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.openActiveMenu(this.router.url);
        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.openActiveMenu(event.url);
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
        TREE_DATA?.forEach((tree, index) => {
            if (activeNodeIndex === null) {
                let activeNode = tree?.children?.filter(node => node?.link === url);
                if (activeNode?.length) {
                    activeNodeIndex = index;
                }
            }
        });
        if (activeNodeIndex !== null) {
            this.treeControl.expand(this.treeControl.dataNodes[activeNodeIndex]);
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
        this.router.navigate(['/pages/inventory']);
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
                        { name: this.localeData?.sidebar?.create_new, icons: 'create-new.svg', link: '/pages/new-inventory/stock/product/create' },
                        { name: this.localeData?.sidebar?.item_wise, icons: 'item-wise.svg', link: '/pages/new-inventory/reports/stock' },
                        { name: this.localeData?.sidebar?.group_wise, icons: 'group-wise.svg', link: '/pages/new-inventory/reports/group' },
                        { name: this.localeData?.sidebar?.variant_wise, icons: 'varient-wise.svg', link: '/pages/new-inventory/reports/variant' },
                        { name: this.localeData?.sidebar?.transactions, icons: 'transactions.svg', link: '/pages/new-inventory/reports/transaction' }],
                },
                {
                    name: this.localeData?.sidebar?.services,
                    icons: 'service.svg'
                },
                {
                    name: this.localeData?.sidebar?.fixed_assets,
                    icons: 'fixed-assets.svg'
                },
                {
                    name: this.localeData?.sidebar?.branch_transfer,
                    icons: 'branch-transfer.svg'
                },
                {
                    name: this.localeData?.sidebar?.manufacturing,
                    icons: 'manufacturing.svg'
                },
                {
                    name: this.localeData?.sidebar?.warehouse_balance,
                    link: '/pages/new-inventory/stock-balance',
                    icons: 'warehouse-opening-balance.svg'
                },
            ];
        }
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


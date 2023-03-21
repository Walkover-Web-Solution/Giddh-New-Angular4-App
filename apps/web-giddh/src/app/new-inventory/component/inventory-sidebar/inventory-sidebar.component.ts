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
            { name: 'Item-wise', icons: 'item-wise.svg', link: '/pages/new-inventory/reports/stock' },
            { name: 'Group-wise', icons: 'group-wise.svg', link: '/pages/new-inventory/reports/group' },
            { name: 'Variant-wise', icons: 'varient-wise.svg', link: '/pages/new-inventory/reports/variant' },
            { name: 'Transactions', icons: 'transactions.svg', link: '/pages/new-inventory/reports/transaction' }],
    },
    {
        name: 'Services',
        icons: 'service.svg'
    },
    {
        name: 'Fixed Assets',
        icons: 'fixed-assets.svg'
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
    public transformer = (node: SidebarNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name,
            level: level,
            icons: node.icons,
            link: node.link
        };
    };
    public treeControl = new FlatTreeControl<SidebarFlatNode>(
        node => node.level,
        node => node.expandable,
    );
    public treeFlattener = new MatTreeFlattener(
        this.transformer,
        node => node.level,
        node => node.expandable,
        node => node.children,
    );
    public dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

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

    public hasChild = (_: number, node: SidebarFlatNode) => node.expandable;

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


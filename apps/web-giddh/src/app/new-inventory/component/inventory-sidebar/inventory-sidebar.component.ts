import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
  index?: number;
  children?: SidebarNode[];
}

const TREE_DATA: SidebarNode[] = [
  {
    name: 'Stock',
    icons: 'stock.svg',
    children: [{  index: 0, name: 'Create New', icons: 'create-new.svg'}, { name: 'Itemwise', icons:'item-wise.svg' }, { name: 'Group-wise' , icons: 'group-wise.svg' }, { name: 'Varient-wise', icons: 'varient-wise.svg' }, { name: 'Transactions', icons: 'transactions.svg' }],
  },
  {
    name: 'Services',
    icons: 'service.svg',
    children: [{ index: 1 ,name: 'Create New', icons: 'create-new.svg'}, { name: 'Itemwise', icons:'item-wise.svg' }, { name: 'Group-wise', icons: 'group-wise.svg' }, { name: 'Varient-wise',icons: 'varient-wise.svg' }, { name: 'Transactions', icons: 'transactions.svg' }],
  },
  {
    name: 'Fixed Assets',
    icons: 'fixed-assets.svg',
    children: [{ index: 2 ,name: 'Create New', icons: 'create-new.svg'}, { name: 'Itemwise', icons:'item-wise.svg' }, { name: 'Group-wise', icons: 'group-wise.svg' }, { name: 'Varient-wise',icons: 'varient-wise.svg' }, { name: 'Transactions', icons: 'transactions.svg' }],
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
    icons: 'warehouse-opening-balance.svg'
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
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
  /* Event emitter for close sidebar popup event */
  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  /** True if mobile screen */
  public isMobileScreen: boolean = true;
  /** Observable to unsubscribe all the store listeners to avoid memory leaks */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /** Holding data in SidebarNode Array */
  dataList: any[] = TREE_DATA;
  /** Holds images folder path */
  public imgPath: string = "";

  private _transformer = (node: SidebarNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      index: node.index,
      icons: node.icons
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

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

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  /**
   * Initializes the component
   * 
   * @memberof InventorySidebarComponent
  */
  public ngOnInit(): void {
    this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
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
   * Function for routing list items by mat-tree-node
   * 
   * @param {string} listName holds the value of item clicked on sidebar menu
   * @param {number} index is the index of the item
   * @memberof InventorySidebarComponent
   */
  public gotoPage(listName: string, index: number): void {
    // for Create New under Stock
    if (listName == this.dataList[0].children[0].name && index == this.dataList[0].children[0].index) {
      this.router.navigate(['/pages/new-inventory/stock/product/create'])
    }
    // for Create New under Services
    else if(listName == this.dataList[1].children[0].name && index == this.dataList[1].children[0].index){
      this.router.navigate(['/pages/new-inventory/stock/service/create'])
    }
    // for Warehouse Opening Balance
    else if (listName === this.dataList[5].name){
      this.router.navigate(['/pages/new-inventory/stock-balance'])
    }
  }
}


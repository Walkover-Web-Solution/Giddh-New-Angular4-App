import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
 interface SidebarNode {
  name: string;
  children?: SidebarNode[];
}

const TREE_DATA: SidebarNode[] = [
  {
    name: 'Stock',
    children: [{name: 'Itemwise'}, {name: 'Group-wise'}, {name: 'Varient-wise'}, {name: 'Transactions'}],
  },
  {
    name: 'Services',
    children: [{name: 'Itemwise'}, {name: 'Group-wise'}, {name: 'Varient-wise'}, {name: 'Transactions'}],
  },
  {
    name: 'Fixed Assets',
    children: [{name: 'Itemwise'}, {name: 'Group-wise'}, {name: 'Varient-wise'}, {name: 'Transactions'}],
  },
  {
    name: 'Branch Transfer',
  },
  {
    name: 'Manufacturing',
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

    private _transformer = (node: SidebarNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
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
}

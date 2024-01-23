import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'inventory-adjustment-aside',
    templateUrl: './inventory-adjustment-aside.component.html',
    styleUrls: ['./inventory-adjustment-aside.component.scss'],

})

export class InventoryAdjustmentReasonAside implements OnInit {
    /* Aside pane state*/
    public asideMenuState: string = 'out';

    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** Holds Table data */
    public dataSource: any[] = [
        { reason: 'Loss by Fire', uniqueName: 'xxxx'},
        { reason: 'Loss by Theaft', uniqueName: 'xxxx'},
        { reason: 'Damaged Goods', uniqueName: 'xxxx'},
        { reason: 'Stock Written off', uniqueName: 'xxxx'},
        { reason: 'Stocktaking results', uniqueName: 'xxxx'},
        { reason: 'Inventory revaluation', uniqueName: 'xxxx'}
    ];

    public closeAsidePane(event?) {
        this.closeAsideEvent.emit();
    }

    public ngOnInit() {

    }
}

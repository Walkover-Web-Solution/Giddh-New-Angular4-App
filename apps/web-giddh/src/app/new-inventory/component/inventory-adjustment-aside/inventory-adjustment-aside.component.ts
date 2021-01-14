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
    public closeAsidePane(event?) {
        this.closeAsideEvent.emit();
    }

    public ngOnInit() {

    }
}

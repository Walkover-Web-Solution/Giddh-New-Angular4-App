import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module'
import { TabsModule } from 'ngx-bootstrap/tabs';
@Component({
    selector: 'aside-adjust-inventory',
    templateUrl: './adjust-inventory-aside.component.html',
    styleUrls: ['./adjust-inventory-aside.component.scss'],

})

export class AsideAdjustInventoryComponent implements OnInit {
    /* Aside pane state*/
    public asideMenuState: string = 'out';

    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    public closeAsidePane(event?) {
        this.closeAsideEvent.emit();
    }

    public hideCreateFieldData: boolean = true;
    public createGroupaside: boolean = true;

    /*back to create new aside pane*/
    public backToMainAside() {
        this.hideCreateFieldData = !this.hideCreateFieldData
    }

    public ngOnInit() {

    }
}

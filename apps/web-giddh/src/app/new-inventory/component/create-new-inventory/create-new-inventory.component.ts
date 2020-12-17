import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module'
import { TabsModule } from 'ngx-bootstrap/tabs';
@Component({
    selector: 'aside-create-new-inventory',
    templateUrl: './create-new-inventory.component.html',
    styleUrls: ['./create-new-inventory.component.scss'],

})

export class CreateNewInventoryComponent implements OnInit {
    public hideCreateFieldData: boolean = true;
    public createGroupaside: boolean = true;

    /*back to create new aside pane*/
    public backToMainAside(){
        this.hideCreateFieldData = !this.hideCreateFieldData
    }

    public ngOnInit() {

    }
}

import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module'
@Component({
    selector: 'inventory-create-group',
    templateUrl: './create-group.component.html',
    styleUrls: ['./create-group.component.scss'],

})

export class InventoryCreateGroupComponent implements OnInit {
    /* this will store image path*/
    public imgPath: string = '';

    public ngOnInit() {
        /* added image path */
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }
}

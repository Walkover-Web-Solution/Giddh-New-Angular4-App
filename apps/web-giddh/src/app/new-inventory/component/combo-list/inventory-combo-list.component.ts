import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'inventory-combo-list',
    templateUrl: './inventory-combo-list.component.html',
    styleUrls: ['./inventory-combo-list.component.scss'],

})

export class InventoryComboListComponent implements OnInit {
    /* this will store image path*/
    public imgPath: string = '';

    public ngOnInit() {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }
}
